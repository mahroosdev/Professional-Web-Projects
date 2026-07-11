'use strict';
/* ══════════════════════════════════════════
   UTILS
══════════════════════════════════════════ */
const T = (() => {
  function toast(msg, icon='✓') {
    const host = document.getElementById('toast-host');
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span class="toast-icon">${icon}</span><span>${msg}</span>`;
    host.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 250); }, 3000);
  }
  function deb(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
  function copy(text) { navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard!','📋')); }
  return { toast, deb, copy };
})();

/* ══════════════════════════════════════════
   APP CONTROLLER
══════════════════════════════════════════ */
const App = (() => {
  let page = 'imagegen', settingsOpen = false, stTab = 'general';

  function init() {
    // Show splash and hide app initially
    document.getElementById('splash').style.display = 'flex';
    document.getElementById('app').style.display = 'none';

    // Splash status messages
    const msgs = ['Loading AI models...','Preparing workspace...','Almost ready...','Launching!'];
    let mi = 0;
    const st = document.getElementById('splash-status');
    const statInt = setInterval(() => { if (st && msgs[++mi]) st.textContent = msgs[mi]; }, 600);

    setTimeout(() => {
      clearInterval(statInt);
      const splash = document.getElementById('splash');
      splash.style.opacity = '0'; splash.style.transform = 'scale(1.04)';
      setTimeout(() => {
        splash.style.display = 'none';
        const app = document.getElementById('app');
        app.style.display = 'flex';
        ED.init(); GY.render(); HT.render(); updateDailyUI();
      }, 500);
    }, 2500);

    document.addEventListener('dragover', e => e.preventDefault());
    document.addEventListener('drop', globalDrop);
    document.addEventListener('keydown', keys);
    loadPrefs();
  }

  function go(p) {
    page = p;
    document.querySelectorAll('.nav-item').forEach(i => i.classList.toggle('active', i.dataset.page === p));
    document.querySelectorAll('.page').forEach(pg => pg.classList.remove('active'));
    const el = document.getElementById('page-' + p);
    if (el) el.classList.add('active');
    if (window.innerWidth < 768) toggleMobileNav(false);
    localStorage.setItem('nf-page', p);
  }

  function toggleMobileNav(force) {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('sidebar-overlay');
    const open = force !== undefined ? force : !sb.classList.contains('open');
    sb.classList.toggle('open', open);
    ov.classList.toggle('open', open);
  }

  function openSettings() {
    settingsOpen = true;
    document.getElementById('settings-modal').style.display = 'flex';
    if (stTab === 'account') loadAccount();
  }
  function closeSettings() {
    settingsOpen = false;
    document.getElementById('settings-modal').style.display = 'none';
  }

  function stab(t) {
    stTab = t;
    document.querySelectorAll('.modal-tab').forEach(b => b.classList.toggle('on', b.dataset.t === t));
    document.querySelectorAll('.stab-pane').forEach(p => p.classList.remove('on'));
    document.getElementById('stab-' + t).classList.add('on');
    if (t === 'account') loadAccount();
  }

  async function loadAccount() {
    const el = document.getElementById('acct-info');
    if (!el) return;
    if (typeof puter !== 'undefined') {
      try {
        const in_ = await puter.auth.isSignedIn();
        if (in_) {
          const u = await puter.auth.getUser();
          el.innerHTML = `<div class="account-card"><div class="account-avatar">${(u.username||'U')[0].toUpperCase()}</div><div><div class="account-name">${u.username||'Puter User'}</div><div class="account-sub">✅ Signed in with Puter</div></div><button class="btn-ghost" style="margin-left:auto;font-size:12px;padding:6px 12px" onclick="App.signOut()">Sign Out</button></div>`;
        } else showSignIn(el);
      } catch { showSignIn(el); }
    } else {
      el.innerHTML = `<div class="account-card"><div class="account-avatar">🔌</div><div><div class="account-name">Puter SDK not loaded</div><div class="account-sub">Internet connection required</div></div></div>`;
    }
  }

  function showSignIn(el) {
    el.innerHTML = `<div class="account-card"><div class="account-avatar">👤</div><div><div class="account-name">Not signed in</div><div class="account-sub">Sign in to save work across devices</div></div><button class="btn-prime" style="margin-left:auto;font-size:12px;padding:8px 16px" onclick="App.signIn()">Sign In</button></div>`;
  }

  async function signIn() {
    if (typeof puter !== 'undefined') {
      try { await puter.auth.signIn(); loadAccount(); T.toast('Signed in!','✓'); } catch { T.toast('Sign-in cancelled','⚠️'); }
    } else { window.open('https://puter.com','_blank'); }
  }
  async function signOut() {
    if (typeof puter !== 'undefined') { await puter.auth.signOut(); loadAccount(); T.toast('Signed out','✓'); }
  }

  function setTheme(t, btn) {
    const themes = {
      dark:     {'--bg':'#050508','--bg2':'#0a0a12','--surface':'#0d0d18','--surface2':'#12121e','--surface3':'#18182a','--surface4':'#1e1e32','--border':'#1f1f38','--border2':'#2a2a46','--text':'#f0eeff','--text2':'#8884aa','--text3':'#4a4870','--text4':'#2f2d50'},
      light:    {'--bg':'#f4f4f8','--bg2':'#ffffff','--surface':'#ffffff','--surface2':'#f5f5fa','--surface3':'#ebebf4','--surface4':'#e0e0ee','--border':'#dddde8','--border2':'#ccccdc','--text':'#1a1830','--text2':'#5a5878','--text3':'#9090a8','--text4':'#bcbcd4'},
      midnight: {'--bg':'#000008','--bg2':'#04040e','--surface':'#080812','--surface2':'#0e0e1c','--surface3':'#141424','--surface4':'#1a1a2c','--border':'#1a1a2e','--border2':'#242438','--text':'#f2f0ff','--text2':'#7070a0','--text3':'#404068','--text4':'#282848'}
    };
    const vars = themes[t] || themes.dark;
    Object.entries(vars).forEach(([k,v]) => document.documentElement.style.setProperty(k,v));
    document.querySelectorAll('#stab-general .pill-row .pill').forEach(p => p.classList.remove('on'));
    if (btn) btn.classList.add('on');
    localStorage.setItem('nf-theme', t);
  }

  function setAccent(c1,c2,btn) {
    document.documentElement.style.setProperty('--accent',c1);
    document.documentElement.style.setProperty('--accent2',c2);
    document.documentElement.style.setProperty('--accent-glow',c1+'33');
    document.querySelectorAll('.acc-sw').forEach(s => s.classList.remove('on'));
    if (btn) btn.classList.add('on');
    localStorage.setItem('nf-accent',JSON.stringify([c1,c2]));
  }

  function globalDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) {
      const r = new FileReader();
      r.onload = ev => { go('img2code'); setTimeout(() => CV.setImg(ev.target.result, f.name, 'i2c'), 200); T.toast('Image ready to convert!','🖼'); };
      r.readAsDataURL(f);
    }
  }

  function keys(e) {
    if (e.ctrlKey||e.metaKey) {
      const map = {'1':'imagegen','2':'img2code','3':'prompt2code','4':'code2img','5':'editor'};
      if (map[e.key]) { e.preventDefault(); go(map[e.key]); }
      if (e.key===',') { e.preventDefault(); openSettings(); }
    }
    if (e.key==='Escape') {
      if (settingsOpen) closeSettings();
      const lb = document.getElementById('lightbox');
      if (lb.style.display!=='none') lb.style.display='none';
      const to = document.getElementById('tpl-overlay');
      if (to.style.display!=='none') to.style.display='none';
    }
  }

  function loadPrefs() {
    const theme = localStorage.getItem('nf-theme');
    if (theme) setTheme(theme);
    const acc = localStorage.getItem('nf-accent');
    if (acc) { try { const [c1,c2]=JSON.parse(acc); setAccent(c1,c2); } catch{} }
  }

  return { init, go, toggleMobileNav, openSettings, closeSettings, stab, setTheme, setAccent, signIn, signOut };
})();

/* ══════════════════════════════════════════
   DAILY LIMIT / RATE LIMITING
══════════════════════════════════════════ */
const DAILY_MAX = 50;

function getDailyCount() {
  const key = 'nf-daily-' + new Date().toDateString();
  return parseInt(localStorage.getItem(key)||'0');
}
function incDailyCount() {
  const key = 'nf-daily-' + new Date().toDateString();
  const n = getDailyCount() + 1;
  localStorage.setItem(key, n);
  updateDailyUI();
  return n;
}
function updateDailyUI() {
  const n = getDailyCount();
  const rem = document.getElementById('daily-remaining');
  const cnt = document.getElementById('daily-cnt');
  const bar = document.getElementById('daily-bar');
  if (rem) rem.textContent = `${DAILY_MAX-n}`;
  if (cnt) cnt.textContent = `${n}/${DAILY_MAX}`;
  if (bar) bar.style.width = `${Math.min((n/DAILY_MAX)*100,100)}%`;
}

let lastGenTime = 0;
const COOLDOWN = 5000;

function checkCooldown() {
  const elapsed = Date.now() - lastGenTime;
  return elapsed >= COOLDOWN;
}

/* ══════════════════════════════════════════
   IMAGE GENERATOR
══════════════════════════════════════════ */
const IG = (() => {
  let model = 'flux-schnell';
  let style = 'photorealistic';
  let ratio = { sz:'portrait_4_3', w:768, h:1024 };
  let count = 1;
  let quality = 'fast';
  let generating = false;
  let progTimer = null, msgTimer = null;
  let currentUrl = null;
  let isFaved = false;
  let promptHistory = [];

  const RANDOMS = [
    "A stunning cinematic portrait of a warrior queen with glowing battle armor, ethereal light, ultra-realistic 8K",
    "Breathtaking aerial view of a futuristic city at dusk, flying vehicles, glowing towers, photorealistic",
    "A majestic white wolf on a mountain peak, golden hour, hyper-detailed, National Geographic style",
    "An ancient mystical temple in a jungle, golden light shafts, morning mist, cinematic",
    "Underwater scene with colorful coral, tropical fish, crystal blue water, 4K photography",
    "Lone astronaut on Mars, distant Earth visible, dramatic sunset, realistic",
    "Cherry blossom Japanese street at night, lanterns, bokeh, film photography",
    "Epic fantasy dragon over medieval castle, lightning storm, digital art masterpiece",
    "Cozy snow cabin with aurora borealis, warm glow, ultra-realistic",
    "Cyberpunk female warrior with glowing tattoos, rain-soaked alley, neon",
  ];

  const TEMPLATES = [
    { label: '🖼 Cinematic Portrait', p: 'A stunning cinematic close-up portrait with dramatic lighting, film grain, 35mm photography, ultra-realistic' },
    { label: '🌄 Epic Landscape', p: 'Breathtaking epic landscape with golden hour light, volumetric fog, dramatic sky, 8K hyperrealistic photography' },
    { label: '🤖 Sci-Fi Scene', p: 'Futuristic sci-fi environment with holographic displays, metallic surfaces, neon lights, ultra-detailed CGI' },
    { label: '🧙 Fantasy Art', p: 'Epic fantasy scene with magical creatures, glowing runes, mystical atmosphere, detailed digital painting' },
    { label: '🌸 Anime Style', p: 'Beautiful anime scene with vibrant colors, detailed character design, Studio Ghibli quality background' },
    { label: '🏙 Cyberpunk City', p: 'Rainy cyberpunk city at night, neon reflections, flying vehicles, dense architecture, atmospheric fog' },
    { label: '🐉 Dragon', p: 'Majestic dragon in flight over ancient mountains, scales shimmering, wings spread wide, epic fantasy realism' },
    { label: '🌊 Ocean Scene', p: 'Dramatic ocean at sunset, massive waves, golden light on water, ultra-realistic photography, HDR' },
    { label: '👗 Fashion Photo', p: 'High-fashion editorial photography, dramatic lighting, bold couture outfit, luxury magazine quality' },
    { label: '🍕 Food Photography', p: 'Professional food photography, beautifully plated gourmet dish, soft natural light, macro lens, cinematic' },
  ];

  function onPromptInput() {
    const v = document.getElementById('ig-prompt').value;
    const el = document.getElementById('prompt-len');
    if (el) el.textContent = v.length + ' chars';
  }

  function setModel(el) {
    document.querySelectorAll('.model-card').forEach(c => c.classList.remove('on'));
    el.classList.add('on'); model = el.dataset.model;
  }
  function setStyle(el) {
    document.querySelectorAll('#style-pills .pill').forEach(p => p.classList.remove('on'));
    el.classList.add('on'); style = el.dataset.style;
  }
  function setRatio(el) {
    document.querySelectorAll('.ratio-btn').forEach(b => b.classList.remove('on'));
    el.classList.add('on');
    ratio = { sz: el.dataset.sz, w: parseInt(el.dataset.w), h: parseInt(el.dataset.h) };
  }
  function setCount(el) {
    document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('on'));
    el.classList.add('on'); count = parseInt(el.dataset.n);
  }
  function setQuality(el) {
    document.querySelectorAll('[data-q]').forEach(b => b.classList.remove('on'));
    el.classList.add('on'); quality = el.dataset.q;
  }

  function random() {
    const p = RANDOMS[Math.floor(Math.random()*RANDOMS.length)];
    document.getElementById('ig-prompt').value = p;
    onPromptInput();
    T.toast('Random prompt loaded!','🎲');
  }

  function quickGen(p) {
    document.getElementById('ig-prompt').value = p;
    onPromptInput();
    generate();
  }

  function showTemplates() {
    const grid = document.getElementById('tpl-grid');
    grid.innerHTML = TEMPLATES.map(t => `
      <button onclick="IG.useTpl(${JSON.stringify(t.p).replace(/"/g,'&quot;')});document.getElementById('tpl-overlay').style.display='none'"
        style="padding:14px;border-radius:12px;background:var(--surface2);border:1px solid var(--border);color:var(--text2);font-size:12px;cursor:pointer;text-align:left;transition:all .15s;font-family:'Outfit',sans-serif;line-height:1.4"
        onmouseover="this.style.borderColor='var(--accent)';this.style.color='var(--text)'"
        onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text2)'">
        <div style="font-size:13px;font-weight:600;margin-bottom:4px;color:var(--text)">${t.label}</div>
        <div style="font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.7">${t.p.substring(0,60)}...</div>
      </button>
    `).join('');
    document.getElementById('tpl-overlay').style.display = 'flex';
  }

  function useTpl(p) {
    document.getElementById('ig-prompt').value = p;
    onPromptInput();
    T.toast('Template loaded!','📋');
  }

  async function enhance() {
    const p = document.getElementById('ig-prompt').value.trim();
    if (!p) { T.toast('Enter a prompt first','⚠️'); return; }
    const btns = document.querySelectorAll('.toolbar-btn');
    btns[0].textContent = '✦ Enhancing...'; btns[0].disabled = true;
    try {
      const res = await fetch('https://text.pollinations.ai/openai', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ model:'openai-large', messages:[
          { role:'system', content:'You are an expert AI image prompt engineer. Return ONLY the enhanced prompt — no explanations, no quotes, no preamble. Make it vivid with lighting, mood, camera, texture, style details.' },
          { role:'user', content:`Enhance this for ${style} style AI image generation:\n\n"${p}"` }
        ], seed: Math.floor(Math.random()*99999) })
      });
      if (!res.ok) throw new Error();
      const d = await res.json();
      const enhanced = d.choices?.[0]?.message?.content?.trim();
      if (enhanced) { document.getElementById('ig-prompt').value = enhanced; onPromptInput(); }
      T.toast('Prompt enhanced!','✨');
    } catch { T.toast('Enhancement failed, try again','⚠️'); }
    finally { btns[0].textContent = '✦ Enhance'; btns[0].disabled = false; }
  }

  async function generate() {
    if (generating) return;
    const prompt = document.getElementById('ig-prompt').value.trim();
    if (!prompt) { T.toast('Enter a prompt first','⚠️'); return; }

    if (getDailyCount() >= DAILY_MAX) { T.toast('Daily limit reached (50 generations)','⚠️'); return; }
    if (!checkCooldown()) {
      const wait = Math.ceil((COOLDOWN - (Date.now() - lastGenTime)) / 1000);
      T.toast(`Please wait ${wait}s before generating again`,'⏱'); return;
    }

    generating = true; lastGenTime = Date.now();
    setGenLoading(true);
    showLoading();

    const activeCard = document.querySelector('.model-card.on');
    if (activeCard) activeCard.classList.add('generating');

    startProgress(); startMsgCycle();

    // Save to prompt history
    pushHistory(prompt);

    const fullPrompt = buildPrompt(prompt);
    incDailyCount();

    try {
      if (count === 1) {
        const url = await genWithRetry(fullPrompt);
        stopProgress(true);
        showSingleResult(url, prompt);
      } else {
        const urls = await Promise.allSettled(
          Array.from({length:count}, () => genWithRetry(buildPrompt(prompt)))
        );
        stopProgress(true);
        showMultiResult(urls.map(r => r.status==='fulfilled'?r.value:null).filter(Boolean), prompt);
      }
      HT.add({ type:'img', prompt, model, style, thumb: currentUrl });
      T.toast('Image generated!','✦');
    } catch {
      stopProgress(false);
      showError();
      T.toast('Generation failed — try a different prompt','❌');
    } finally {
      if (activeCard) activeCard.classList.remove('generating');
      generating = false; setGenLoading(false);
    }
  }

  function pushHistory(p) {
    promptHistory = [p, ...promptHistory.filter(h => h!==p)].slice(0,8);
    renderHistory();
  }

  function renderHistory() {
    const wrap = document.getElementById('prompt-history-wrap');
    const list = document.getElementById('prompt-history-list');
    if (!wrap||!list) return;
    if (promptHistory.length === 0) { wrap.style.display='none'; return; }
    wrap.style.display = 'block';
    list.innerHTML = promptHistory.map(p => `
      <div class="history-chip" onclick="IG.useHistory(${JSON.stringify(p).replace(/"/g,'&quot;')})">
        <span class="history-chip-text">${p.substring(0,50)}</span>
        <span class="history-chip-use">Use →</span>
      </div>
    `).join('');
  }

  function useHistory(p) {
    document.getElementById('ig-prompt').value = p;
    onPromptInput();
    T.toast('Prompt loaded!','📋');
  }

  function showLoading() {
    document.getElementById('gen-empty').style.display = 'none';
    document.getElementById('gen-result').style.display = 'none';
    document.getElementById('gen-multi-grid').style.display = 'none';
    document.getElementById('gen-loading').style.display = 'flex';
    document.getElementById('gen-save-btn').style.display = 'none';
    document.getElementById('gen-fav-btn').style.display = 'none';
    document.getElementById('gen-edit-toggle').style.display = 'none';
    document.getElementById('gen-regen-btn').style.display = 'none';
    document.getElementById('img-tags').style.display = 'none';
    document.getElementById('edit-panel').classList.remove('show');
  }

  function showSingleResult(url, prompt) {
    currentUrl = url; isFaved = false;
    document.getElementById('gen-loading').style.display = 'none';
    const img = document.getElementById('gen-result');
    img.crossOrigin = 'anonymous'; img.src = url;
    img.style.display = 'block';
    document.getElementById('gen-save-btn').style.display = 'flex';
    document.getElementById('gen-fav-btn').style.display = 'flex';
    document.getElementById('gen-edit-toggle').style.display = 'flex';
    document.getElementById('gen-regen-btn').style.display = 'flex';
    updateFavBtn();
    // Auto-generate tags
    if (document.getElementById('s-show-tags')?.checked) genTags(prompt);
  }

  function showMultiResult(urls, prompt) {
    currentUrl = urls[0];
    document.getElementById('gen-loading').style.display = 'none';
    const grid = document.getElementById('gen-multi-grid');
    grid.style.display = 'grid';
    grid.innerHTML = urls.map((url,i) => {
      const safeUrl = JSON.stringify(url);
      const safePrompt = JSON.stringify(prompt.substring(0,50));
      return `
      <div class="multi-img">
        <img src="${url}" crossorigin="anonymous" alt="" onclick="IG.lbUrl(${safeUrl},${safePrompt})" loading="lazy">
        <div class="multi-img-actions">
          <button class="mini-btn" onclick="event.stopPropagation();IG.saveUrl(${safeUrl},${safePrompt})">💾</button>
          <button class="mini-btn" onclick="event.stopPropagation();IG.dlUrl(${safeUrl})">⬇</button>
        </div>
      </div>
    `;
    }).join('');
    document.getElementById('gen-save-btn').style.display = 'flex';
    document.getElementById('gen-regen-btn').style.display = 'flex';
  }

  function showError() {
    document.getElementById('gen-loading').style.display = 'none';
    const empty = document.getElementById('gen-empty');
    empty.style.display = 'flex';
    empty.querySelector('h3').textContent = 'Generation failed';
    empty.querySelector('p').textContent = 'Please try again or change your prompt';
  }

  async function genWithRetry(prompt, maxTries=2) {
    for (let i=0; i<=maxTries; i++) {
      const url = buildUrl(prompt);
      try {
        return await new Promise((res,rej) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => res(url);
          img.onerror = () => rej(new Error('fail'));
          img.src = url;
          setTimeout(() => rej(new Error('timeout')), 90000);
        });
      } catch(e) {
        if (i===maxTries) throw e;
        await new Promise(r => setTimeout(r, 2000*(i+1)));
      }
    }
  }

  function buildUrl(prompt) {
    const modelMap = {'flux-schnell':'flux','flux-1-1-pro':'flux-realism','dall-e-3':'turbo','stable-diffusion-3':'flux'};
    const m = modelMap[model]||'flux';
    const qSteps = quality==='fast'?'&steps=20' : quality==='high'?'&steps=40':'&steps=28';
    const seed = Math.floor(Math.random()*999999);
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${m}&width=${ratio.w}&height=${ratio.h}&nologo=true&seed=${seed}&enhance=true${qSteps}`;
  }

  function buildPrompt(base) {
    const styleMap = {
      'photorealistic':'photorealistic, hyperrealistic photography, 8K resolution, professional camera, HDR',
      'cinematic':'cinematic shot, film photography, movie still, dramatic lighting, anamorphic bokeh',
      'anime':'anime art style, manga illustration, vibrant saturated colors, Studio Ghibli quality',
      'oil painting':'oil painting on canvas, classical art, rich brushwork, gallery masterpiece',
      'digital art':'digital illustration, concept art, ArtStation quality, highly detailed',
      'watercolor':'watercolor painting, soft blending, flowing pigments, paper texture visible',
      '3D render':'3D rendered, CGI, octane render, PBR materials, studio lighting',
      'pencil sketch':'detailed pencil sketch, graphite drawing, fine crosshatching, artistic',
      'neon cyberpunk':'neon-lit cyberpunk aesthetic, rain-soaked streets, glowing signage, futuristic decay',
      'fantasy art':'epic fantasy illustration, magical atmosphere, dramatic composition, artbook quality',
    };
    const sty = styleMap[style] || style;
    const neg = document.getElementById('ig-neg')?.value.trim();
    let full = `${base}, ${sty}, masterpiece, highly detailed, professional quality`;
    if (neg) full += `. Avoid: ${neg}`;
    return full;
  }

  async function genTags(prompt) {
    try {
      const res = await fetch('https://text.pollinations.ai/openai', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ model:'openai-large', max_tokens:50, messages:[
          { role:'system', content:'Extract 4-6 short style tags from this image prompt. Return ONLY comma-separated words, no explanation.' },
          { role:'user', content: prompt }
        ]})
      });
      if (!res.ok) return;
      const d = await res.json();
      const raw = d.choices?.[0]?.message?.content?.trim()||'';
      const tags = raw.split(',').map(t=>t.trim().toLowerCase()).filter(Boolean).slice(0,6);
      if (tags.length > 0) {
        const el = document.getElementById('img-tags');
        el.innerHTML = tags.map(t=>`<span class="tag-chip">#${t}</span>`).join('');
        el.style.display = 'flex';
      }
    } catch{}
  }

  function startProgress() {
    let w = 0;
    const fill = document.getElementById('gen-prog');
    clearInterval(progTimer);
    progTimer = setInterval(() => { w = Math.min(w + Math.random()*2.5, 82); if(fill) fill.style.width = w+'%'; }, 500);
  }
  function stopProgress(success) {
    clearInterval(progTimer); clearInterval(msgTimer);
    const fill = document.getElementById('gen-prog');
    if (fill) { fill.style.width = success?'100%':'0%'; if(success) setTimeout(()=>fill.style.width='0%',600); }
  }
  function startMsgCycle() {
    clearInterval(msgTimer);
    const msgs = [
      ['Sending prompt to AI model...', `Model: ${model}`],
      ['Generating your image...', 'Processing visual elements'],
      ['Refining details...', 'Enhancing quality'],
      ['Finalizing render...', 'Almost there!']
    ];
    let i = 0;
    msgTimer = setInterval(() => {
      if (i >= msgs.length) { clearInterval(msgTimer); return; }
      const m = document.getElementById('gen-msg');
      const s = document.getElementById('gen-sub');
      if (m) m.textContent = msgs[i][0];
      if (s) s.textContent = msgs[i][1];
      i++;
    }, 6000);
  }
  function setGenLoading(on) {
    const btn = document.getElementById('gen-btn');
    if (!btn) return;
    btn.disabled = on;
    btn.querySelector('.btn-txt').textContent = on?'Generating...':'✦ Generate';
    btn.querySelector('.btn-loader').style.display = on?'inline-block':'none';
  }

  function save() {
    const img = document.getElementById('gen-result');
    if (!img.src||img.style.display==='none') { T.toast('No image to save','⚠️'); return; }
    const p = document.getElementById('ig-prompt').value.trim();
    GY.save(currentUrl, p, model, isFaved);
    T.toast('Image saved to gallery!','💾');
  }

  function saveUrl(url, p) { GY.save(url, p, model, false); T.toast('Image saved!','💾'); }

  function toggleFav() {
    if (!currentUrl) { T.toast('Generate an image first','⚠️'); return; }
    isFaved = !isFaved;
    updateFavBtn();
    T.toast(isFaved?'Added to favorites!':'Removed from favorites', isFaved?'♡':'');
  }
  function updateFavBtn() {
    const btn = document.getElementById('gen-fav-btn');
    if (btn) { btn.textContent = isFaved?'♥ Favorited':'♡ Favorite'; btn.style.color = isFaved?'var(--accent2)':''; btn.style.borderColor = isFaved?'var(--accent2)':''; }
  }

  function lightbox() {
    const img = document.getElementById('gen-result');
    if (!img.src||img.style.display==='none') return;
    lbUrl(img.src, document.getElementById('ig-prompt').value.substring(0,60));
  }
  function lbUrl(url, info) {
    document.getElementById('lb-img').src = url;
    document.getElementById('lb-info').textContent = info||'';
    document.getElementById('lightbox').style.display = 'flex';
  }

  async function download() {
    const url = currentUrl;
    if (!url) { T.toast('No image to download','⚠️'); return; }
    try {
      const blob = await (await fetch(url)).blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'nexaforge-'+Date.now()+'.png'; a.click();
      URL.revokeObjectURL(a.href);
      T.toast('Downloaded!','⬇️');
    } catch { T.toast('Right-click to save image','⚠️'); }
  }
  function dlUrl(url) {
    const a = document.createElement('a'); a.href=url; a.download='nexaforge-'+Date.now()+'.png'; a.click();
  }

  async function copyImg() {
    if (!currentUrl) { T.toast('No image','⚠️'); return; }
    try {
      const blob = await (await fetch(currentUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({[blob.type]:blob})]);
      T.toast('Image copied!','📋');
    } catch { T.toast('Copy not supported, try download','⚠️'); }
  }

  function toggleEdit() {
    const panel = document.getElementById('edit-panel');
    const on = panel.classList.contains('show');
    if (on) { closeEdit(); return; }
    const img = document.getElementById('gen-result');
    if (!img.src||img.style.display==='none') { T.toast('Generate an image first','⚠️'); return; }
    document.getElementById('edit-src-thumb').src = img.src;
    document.getElementById('edit-prompt').value = '';
    panel.classList.add('show');
    const btn = document.getElementById('gen-edit-toggle');
    btn.style.borderColor = 'var(--accent)'; btn.style.color = 'var(--accent)';
  }
  function closeEdit() {
    document.getElementById('edit-panel').classList.remove('show');
    const btn = document.getElementById('gen-edit-toggle');
    if (btn) { btn.style.borderColor=''; btn.style.color=''; }
  }
  async function applyEdit() {
    const instructions = document.getElementById('edit-prompt').value.trim();
    if (!instructions) { T.toast('Describe the changes','⚠️'); return; }
    const original = document.getElementById('ig-prompt').value.trim();
    const btn = document.getElementById('apply-edit-btn');
    btn.disabled=true; btn.querySelector('.btn-txt').textContent='Applying...'; btn.querySelector('.btn-loader').style.display='inline-block';
    try {
      let newPrompt;
      try {
        const res = await fetch('https://text.pollinations.ai/openai', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ model:'openai-large', messages:[
            {role:'system', content:'Combine original image description with edit instructions into one new prompt. Return ONLY the new prompt.'},
            {role:'user', content:`Original: "${original||'generated image'}"\n\nEdit: "${instructions}"\n\nCombine into new prompt:`}
          ]})
        });
        const d = await res.json();
        newPrompt = d.choices?.[0]?.message?.content?.trim();
      } catch { newPrompt = `${original}, but with: ${instructions}`; }
      document.getElementById('ig-prompt').value = newPrompt || original;
      onPromptInput();
      closeEdit();
      await generate();
    } finally {
      btn.disabled=false; btn.querySelector('.btn-txt').textContent='✨ Apply Edit'; btn.querySelector('.btn-loader').style.display='none';
    }
  }

  return { onPromptInput, setModel, setStyle, setRatio, setCount, setQuality, random, quickGen, enhance, generate, save, saveUrl, toggleFav, lightbox, lbUrl, download, dlUrl, copyImg, toggleEdit, closeEdit, applyEdit, showTemplates, useTpl, useHistory };
})();

/* ══════════════════════════════════════════
   GALLERY (SAVED FILES)
══════════════════════════════════════════ */
const GY = (() => {
  let items = [], filterMode = 'all', searchQ = '';

  function load() { try { items = JSON.parse(localStorage.getItem('nf-saved')||'[]'); } catch { items=[]; } }

  function save(src, prompt, model, fav=false) {
    load();
    items.unshift({ src, prompt, model, fav, date: new Date().toLocaleDateString(), ts: Date.now(), id: Date.now().toString() });
    if (items.length>200) items=items.slice(0,200);
    localStorage.setItem('nf-saved', JSON.stringify(items));
    updateBadge();
    render();
  }

  function updateBadge() {
    load();
    const b = document.getElementById('saved-count-badge');
    if (!b) return;
    if (items.length > 0) { b.textContent = items.length; b.style.display='inline-block'; }
    else b.style.display='none';
  }

  function filter(btn) {
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('on'));
    btn.classList.add('on');
    filterMode = btn.dataset.f;
    render();
  }

  function search(q) { searchQ = q.toLowerCase(); render(); }

  function render() {
    load();
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    let data = items;
    if (filterMode==='fav') data = data.filter(i=>i.fav);
    if (searchQ) data = data.filter(i=>(i.prompt||'').toLowerCase().includes(searchQ));
    if (data.length===0) {
      grid.innerHTML = `<div class="gallery-empty">
        <svg viewBox="0 0 64 64" fill="none" width="60" height="60" opacity=".25"><path d="M16 18H4a2 2 0 00-2 2v28a2 2 0 002 2h40a2 2 0 002-2V34" stroke="currentColor" stroke-width="1.5"/><path d="M42 2H28a2 2 0 00-2 2v24l5-3 5 3V4a2 2 0 00-2-2z" stroke="currentColor" stroke-width="1.5"/></svg>
        <h3>${filterMode==='fav'?'No favorites yet':'No saved images yet'}</h3>
        <p>${filterMode==='fav'?'Mark images as favorites to see them here':'Generate images and click Save to build your gallery'}</p>
        <button class="btn-prime" onclick="App.go('imagegen')">Generate Images</button>
      </div>`; return;
    }
    grid.innerHTML = data.map((it,i) => `
      <div class="gallery-item">
        <img src="${it.src}" alt="" onclick="GY.lb(${i})" loading="lazy">
        <div class="gallery-fav"><div class="gallery-fav-icon${it.fav?' on':''}">♥</div></div>
        <div class="gallery-item-actions">
          <button class="gallery-act-btn" onclick="event.stopPropagation();GY.toggleFav(${i})" title="Favorite">${it.fav?'♥':'♡'}</button>
          <button class="gallery-act-btn" onclick="event.stopPropagation();GY.dl(${i})" title="Download">⬇</button>
          <button class="gallery-act-btn" onclick="event.stopPropagation();GY.copyPrompt(${i})" title="Copy prompt">💬</button>
          <button class="gallery-act-btn" onclick="event.stopPropagation();GY.rm(${i})" title="Delete">🗑</button>
        </div>
        <div class="gallery-info">
          <div class="gallery-prompt">${(it.prompt||'Saved image').substring(0,50)}</div>
          <div class="gallery-meta">${it.model||''} · ${it.date||''}</div>
        </div>
      </div>
    `).join('');
    updateBadge();
  }

  function lb(i) { load(); IG.lbUrl(items[i].src, items[i].prompt?.substring(0,60)); }

  function toggleFav(i) {
    load();
    items[i].fav = !items[i].fav;
    localStorage.setItem('nf-saved', JSON.stringify(items));
    render();
    T.toast(items[i].fav?'Added to favorites!':'Removed from favorites', '♥');
  }

  function dl(i) {
    load();
    const a = document.createElement('a');
    a.href=items[i].src; a.download='nexaforge-saved-'+Date.now()+'.png'; a.click();
  }

  function copyPrompt(i) {
    load();
    T.copy(items[i].prompt||'');
  }

  function rm(i) {
    load();
    items.splice(i,1);
    localStorage.setItem('nf-saved', JSON.stringify(items));
    render();
    T.toast('Image removed','✓');
  }

  function clearAll() {
    if (!confirm('Clear all saved images?')) return;
    items=[]; localStorage.removeItem('nf-saved');
    render(); T.toast('Gallery cleared','✓');
  }

  document.addEventListener('DOMContentLoaded', () => setTimeout(render, 2700));
  return { save, render, lb, toggleFav, dl, copyPrompt, rm, clearAll, filter, search };
})();

/* ══════════════════════════════════════════
   HISTORY
══════════════════════════════════════════ */
const HT = (() => {
  let items = [], viewMode = 'list';

  function load() { try { items = JSON.parse(localStorage.getItem('nf-history')||'[]'); } catch { items=[]; } }

  function add(item) {
    load();
    items.unshift({...item, ts: Date.now()});
    if (items.length>150) items=items.slice(0,150);
    localStorage.setItem('nf-history', JSON.stringify(items));
    render();
  }

  function setView(mode, btn) {
    viewMode = mode;
    document.querySelectorAll('.vt-btn').forEach(b=>b.classList.remove('on'));
    if (btn) btn.classList.add('on');
    render();
  }

  function render() {
    load();
    const el = document.getElementById('hist-list');
    if (!el) return;
    if (items.length===0) {
      el.className=''; el.innerHTML='<div class="gallery-empty"><h3>No history yet</h3><p>Your generation history will appear here</p></div>'; return;
    }
    el.className = viewMode==='grid'?'history-grid':'history-list';
    el.innerHTML = items.map(it => {
      const thumb = it.thumb
        ? `<img class="h-thumb" src="${it.thumb}" alt="" loading="lazy">`
        : `<div class="h-thumb" style="display:flex;align-items:center;justify-content:center;font-size:20px">${it.type==='img'?'🎨':'💻'}</div>`;
      const typeLbl = it.type==='img'?'Image':it.type==='code'?'Code':'Convert';
      const typeClass = it.type||'code';
      return `<div class="history-item${viewMode==='grid'?' grid-mode':''}">
        ${thumb}
        <div class="h-info">
          <div class="h-prompt">${(it.prompt||'Generation').substring(0,55)}</div>
          <div class="h-meta">${new Date(it.ts).toLocaleString()}</div>
        </div>
        <span class="h-badge ${typeClass}">${typeLbl}</span>
      </div>`;
    }).join('');
  }

  function clear() {
    if (!confirm('Clear all history?')) return;
    items=[]; localStorage.removeItem('nf-history');
    render(); T.toast('History cleared','✓');
  }

  document.addEventListener('DOMContentLoaded', () => setTimeout(render, 2700));
  return { add, render, setView, clear };
})();

/* ══════════════════════════════════════════
   CONVERTER (Image→Code & Prompt→Code)
══════════════════════════════════════════ */
const CV = (() => {
  let uploads = { i2c:null }, editTimers={};

  async function callAI(messages, maxTokens=4000) {
    const res = await fetch('https://text.pollinations.ai/openai', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ model:'openai-large', messages, max_tokens:maxTokens, seed:Math.floor(Math.random()*99999) })
    });
    if (!res.ok) throw new Error('AI error '+res.status);
    const d = await res.json();
    if (d.choices?.[0]?.message?.content) return d.choices[0].message.content;
    throw new Error('Invalid response');
  }

  function upload(event, id) {
    const f = event.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => setImg(ev.target.result, f.name, id); r.readAsDataURL(f);
  }
  function drop(event, id) {
    const f = event.dataTransfer.files[0]; if (!f||!f.type.startsWith('image/')) return;
    const r = new FileReader(); r.onload = ev => setImg(ev.target.result, f.name, id); r.readAsDataURL(f);
  }
  function setImg(dataUrl, name, id='i2c') {
    uploads[id] = dataUrl;
    const thumb = document.getElementById(id+'-thumb');
    const content = document.getElementById(id+'-zone-content');
    const rm = document.getElementById(id+'-remove');
    if (thumb) { thumb.src = dataUrl; thumb.style.display='block'; }
    if (content) content.style.display='none';
    if (rm) rm.style.display='flex';
    T.toast('Image ready: '+(name||'uploaded'),'🖼');
  }
  function remove(id) {
    uploads[id]=null;
    const thumb=document.getElementById(id+'-thumb');
    const content=document.getElementById(id+'-zone-content');
    const rm=document.getElementById(id+'-remove');
    const fi=document.getElementById(id+'-file');
    if (thumb) { thumb.src=''; thumb.style.display='none'; }
    if (content) content.style.display='flex';
    if (rm) rm.style.display='none';
    if (fi) fi.value='';
    T.toast('Image removed','✓');
  }
  function setStyle(el, id) {
    const cont = el.closest('.pill-row');
    if (cont) cont.querySelectorAll('.pill').forEach(p=>p.classList.remove('on'));
    el.classList.add('on');
  }

  function clean(raw) {
    return raw.replace(/^```[\w\s]*\n?/,'').replace(/\n?```\s*$/,'').replace(/^`{1,2}[\w\s]*\n?/,'').replace(/\n?`{1,2}\s*$/,'').trim();
  }

  function sysPrompt(fw, mode, opts={}) {
    const fi = {
      'HTML/CSS':'Return a complete self-contained HTML document with embedded CSS and JS. No external dependencies.',
      'React JSX':'Return a complete React functional component. Include styles in a <style> tag. Export default as App.',
      'Tailwind CSS':'Return a complete HTML document using Tailwind CSS via CDN. Include <script src="https://cdn.tailwindcss.com"><\/script>.',
      'Vue SFC':'Return a Vue 3 Single File Component with <template>, <script setup>, and <style scoped>.',
      'SVG':'Return pure SVG starting with the <svg> element.',
    };
    return `You are an elite frontend engineer. ${fi[fw]||fi['HTML/CSS']}
${opts.resp?'Mobile-first responsive design required.':''}
${opts.anim?'Add smooth CSS transitions and micro-interactions.':''}
${opts.dark?'Implement dark mode with CSS variables.':''}
${opts.a11y?'Include ARIA labels, semantic HTML, keyboard focus states.':''}
${opts.cmts?'Add brief inline code comments.':''}
Design: modern aesthetic, strong color palette, hover/focus states, clean layout.
CRITICAL: Return ONLY the code. No markdown fences. No explanations. Start directly with the first character.`;
  }

  async function img2code() {
    const img = uploads['i2c'];
    if (!img) { T.toast('Upload an image first','⚠️'); return; }
    const fw = document.getElementById('i2c-fw').value;
    const extra = document.getElementById('i2c-extra').value.trim();
    setBtnLoad('i2c-btn',true,'Converting...');
    const mime=(img.match(/^data:([^;]+);/)||[])[1]||'image/png';
    const b64=img.split(',')[1];
    try {
      let code = await callAI([
        {role:'system',content:sysPrompt(fw,'img2code')},
        {role:'user',content:[
          {type:'image_url',image_url:{url:`data:${mime};base64,${b64}`,detail:'high'}},
          {type:'text',text:`Convert this UI screenshot to pixel-perfect production ${fw} code. Make it responsive, modern, and polished.${extra?' Extra: '+extra:''}`}
        ]}
      ]);
      code=clean(code);
      setCode('i2c',code,fw);
      updatePreview('i2c',code);
      HT.add({type:'convert',prompt:'Image → '+fw});
      T.toast('Code generated!','✓');
    } catch(e) { T.toast('Conversion failed: '+e.message,'❌'); }
    finally { setBtnLoad('i2c-btn',false,'Convert to Code'); }
  }

  async function prompt2code() {
    const prompt = document.getElementById('p2c-prompt').value.trim();
    if (!prompt) { T.toast('Enter a description first','⚠️'); return; }
    const fw = document.getElementById('p2c-fw').value;
    const opts = {
      resp: document.getElementById('p2c-resp')?.checked,
      anim: document.getElementById('p2c-anim')?.checked,
      dark: document.getElementById('p2c-dark')?.checked,
      a11y: document.getElementById('p2c-a11y')?.checked,
      cmts: document.getElementById('p2c-cmts')?.checked,
    };
    setBtnLoad('p2c-btn',true,'Generating...');
    try {
      let code = await callAI([
        {role:'system',content:sysPrompt(fw,'prompt2code',opts)},
        {role:'user',content:`Build a production-ready ${fw} implementation:\n\n${prompt}\n\nMake it visually exceptional and fully functional.`}
      ]);
      code=clean(code);
      setCode('p2c',code,fw);
      updatePreview('p2c',code);
      HT.add({type:'code',prompt});
      T.toast('Code ready! Edit live in the panel.','✓');
    } catch(e) { T.toast('Failed: '+e.message,'❌'); }
    finally { setBtnLoad('p2c-btn',false,'Generate Code'); }
  }

  function setCode(id, code, fw) {
    const el=document.getElementById(id+'-code'); if (!el) return;
    el.textContent=code;
    const badge=document.getElementById(id+'-badge'); if(badge) badge.textContent=fw.split('/')[0].trim();
  }

  function updatePreview(id, code) {
    const frame=document.getElementById(id+'-preview');
    const empty=document.getElementById(id+'-preview-empty');
    if (!frame) return;
    let html=code;
    if (!code.includes('<html')&&!code.includes('<!DOCTYPE')) {
      if (code.includes('export default')||code.includes('import React')) {
        html=`<!DOCTYPE html><html><head>
<script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
</head><body style="margin:0"><div id="root"></div>
<script type="text/babel">${code}\nReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App))<\/script></body></html>`;
      } else { html=`<!DOCTYPE html><html><body style="margin:0">${code}</body></html>`; }
    }
    frame.srcdoc=html;
    if (empty) empty.style.display='none';
  }

  function onEdit(id) {
    clearTimeout(editTimers[id]);
    editTimers[id]=setTimeout(()=>{ const code=document.getElementById(id+'-code')?.textContent||''; updatePreview(id,code); },800);
  }

  function copy(id) {
    const code=document.getElementById(id+'-code')?.textContent?.trim();
    if (!code||code.includes('Generated code')||code.includes('Your generated')) { T.toast('No code yet','⚠️'); return; }
    T.copy(code);
  }

  function exportFile(id) {
    const code=document.getElementById(id+'-code')?.textContent?.trim();
    if (!code||code.length<10) { T.toast('No code to export','⚠️'); return; }
    const blob=new Blob([code],{type:'text/html'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download='nexaforge-'+id+'-'+Date.now()+'.html'; a.click();
    URL.revokeObjectURL(url); T.toast('File downloaded!','⬇️');
  }

  function setBtnLoad(id,on,lbl) {
    const btn=document.getElementById(id); if (!btn) return;
    btn.disabled=on;
    const t=btn.querySelector('.btn-txt'), l=btn.querySelector('.btn-loader');
    if(t) t.textContent=lbl; if(l) l.style.display=on?'inline-block':'none';
  }

  return { upload, drop, setImg, remove, setStyle, img2code, prompt2code, onEdit, copy, exportFile };
})();

/* ══════════════════════════════════════════
   PREVIEW MODULE
══════════════════════════════════════════ */
const PV = {
  setSize(sz,btn,id) {
    const w=document.getElementById(id+'-wrap'); if(w) w.dataset.sz=sz;
    if (btn) { const c=btn.closest('.preview-size-ctrls'); if(c) c.querySelectorAll('.sz-btn').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); }
  },
  edSize(sz,btn) {
    if (btn) { const c=btn.closest('.preview-size-ctrls'); if(c) c.querySelectorAll('.sz-btn').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); }
  }
};

/* ══════════════════════════════════════════
   PROMPT → CODE TEMPLATES
══════════════════════════════════════════ */
const P2C = (() => {
  const tpls = {
    landing:`A stunning SaaS landing page with animated gradient hero, 3 feature cards with icons and hover effects, social proof section with logos, pricing table (3 tiers with highlighted recommended plan), CTA with email signup. Dark glassmorphism theme, purple/pink gradients.`,
    dashboard:`Analytics dashboard with top navbar showing user avatar and notifications, left sidebar navigation with icons, 4 metric cards (revenue, users, conversions, growth rate with trend indicators), large area chart with weekly data, recent activity table with status badges. Dark theme, blue/purple glassmorphism.`,
    login:`Beautiful authentication page with centered glass card, email/password inputs with floating labels and icons, social login buttons (Google, GitHub), remember me toggle, animated submit button with gradient. Dark gradient background with subtle particle grid.`,
    portfolio:`Creative developer portfolio with animated hero typing effect, skills grid with visual progress bars, project showcase cards with tech stack tags and live demo links, contact form, smooth scroll animated navigation. Dark minimal theme with accent color highlights.`,
    ecommerce:`Premium product page with image gallery carousel, 5-star ratings with review count, price display with sale percentage badge, color swatch and size variant selectors, animated add-to-cart button, product description tabs, related products grid. Clean modern white design.`,
    blog:`Beautiful blog post layout with wide hero image, author info with avatar, article body with styled pull-quotes and inline code blocks, sticky sidebar table of contents, topic tags, social share buttons, related articles grid. Clean editorial typography with serif display font.`,
  };
  function load(k) {
    const t=tpls[k]; if(t) { document.getElementById('p2c-prompt').value=t; T.toast('Template loaded!','📝'); }
  }
  return { load };
})();

/* ══════════════════════════════════════════
   CODE → IMAGE
══════════════════════════════════════════ */
const C2I = (() => {
  let W=1280, H=800, bg='#ffffff';
  const SAMPLE=`<!DOCTYPE html>
<html>
<head>
<style>
  body{margin:0;background:#050510;font-family:'Segoe UI',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;}
  .card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:52px;text-align:center;max-width:520px;}
  h1{font-size:3.2rem;background:linear-gradient(135deg,#a78bfa,#f9a8d4,#7dd3fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:16px;font-weight:900;letter-spacing:-2px;}
  p{color:rgba(255,255,255,.55);font-size:1.1rem;line-height:1.7;margin-bottom:28px;}
  .btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:50px;background:linear-gradient(135deg,#6d28d9,#be185d);color:#fff;font-weight:700;font-size:15px;letter-spacing:.3px;}
</style>
</head>
<body>
  <div class="card">
    <h1>NexaForge AI</h1>
    <p>Transform code into stunning visuals. The future of creative development is here.</p>
    <div class="btn">✦ Start Creating</div>
  </div>
</body>
</html>`;

  function loadSample() { document.getElementById('c2i-code').textContent=SAMPLE; T.toast('Sample loaded!','📄'); }
  function setSize(el) { document.querySelectorAll('[data-w]').forEach(p=>p.classList.remove('on')); el.classList.add('on'); W=parseInt(el.dataset.w); H=parseInt(el.dataset.h); }
  function setBg(el) { document.querySelectorAll('.bg-swatch').forEach(s=>s.classList.remove('on')); el.classList.add('on'); bg=el.dataset.bg; }

  async function render() {
    const code=document.getElementById('c2i-code')?.textContent?.trim();
    if (!code) { T.toast('Paste code to render','⚠️'); return; }
    const btn=document.getElementById('c2i-btn');
    if (btn) { btn.disabled=true; btn.querySelector('.btn-txt').textContent='Rendering...'; btn.querySelector('.btn-loader').style.display='inline-block'; }
    document.getElementById('c2i-empty').style.display='none';
    document.getElementById('c2i-loading').style.display='flex';
    document.getElementById('c2i-result').style.display='none';
    let html=code;
    if (!code.includes('<html')&&!code.includes('<!DOCTYPE')) {
      html=`<!DOCTYPE html><html><head><style>body{margin:0;background:${bg}}</style></head><body>${code}</body></html>`;
    }
    const frame=document.createElement('iframe');
    frame.style.cssText=`position:fixed;top:-99999px;left:-99999px;width:${W}px;height:${H}px;border:none;background:${bg}`;
    frame.srcdoc=html; document.body.appendChild(frame);
    frame.onload=()=>{
      setTimeout(()=>{
        if (window.html2canvas) doCapture(frame);
        else {
          const s=document.createElement('script');
          s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          s.onload=()=>doCapture(frame); s.onerror=()=>fallback(frame);
          document.head.appendChild(s);
        }
      },800);
    };
  }

  function doCapture(frame) {
    const btn=document.getElementById('c2i-btn');
    html2canvas(frame.contentDocument.body,{width:W,height:H,scale:2,useCORS:true,backgroundColor:bg==='transparent'?null:bg}).then(canvas=>{
      const url=canvas.toDataURL('image/png');
      const img=document.getElementById('c2i-result');
      img.src=url; img.style.display='block';
      document.getElementById('c2i-loading').style.display='none';
      if (frame.parentNode) document.body.removeChild(frame);
      HT.add({type:'code',prompt:'Code → Image',thumb:url});
      if (btn) { btn.disabled=false; btn.querySelector('.btn-txt').textContent='Render to Image'; btn.querySelector('.btn-loader').style.display='none'; }
      T.toast('Rendered!','✦');
    }).catch(()=>fallback(frame));
  }

  function fallback(frame) {
    document.getElementById('c2i-loading').style.display='none';
    document.getElementById('c2i-empty').style.display='flex';
    if (frame?.parentNode) document.body.removeChild(frame);
    const btn=document.getElementById('c2i-btn');
    if (btn) { btn.disabled=false; btn.querySelector('.btn-txt').textContent='Render to Image'; btn.querySelector('.btn-loader').style.display='none'; }
    T.toast('Render failed — try Download HTML','⚠️');
  }

  function download() {
    const img=document.getElementById('c2i-result');
    if (!img.src||img.style.display==='none') { T.toast('Render first','⚠️'); return; }
    const a=document.createElement('a'); a.href=img.src; a.download='nexaforge-render-'+Date.now()+'.png'; a.click();
    T.toast('PNG downloaded!','⬇️');
  }
  function downloadHTML() {
    const code=document.getElementById('c2i-code')?.textContent?.trim();
    if (!code) { T.toast('No code','⚠️'); return; }
    const blob=new Blob([code],{type:'text/html'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='nexaforge-'+Date.now()+'.html'; a.click();
    URL.revokeObjectURL(url); T.toast('HTML downloaded!','⬇️');
  }
  return { loadSample, setSize, setBg, render, download, downloadHTML };
})();

/* ══════════════════════════════════════════
   LIVE EDITOR
══════════════════════════════════════════ */
const ED = (() => {
  let lang='html', updateTimer=null, isDragging=false;
  const SAMPLE=`<!DOCTYPE html>
<html>
<head>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{min-height:100vh;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);display:flex;align-items:center;justify-content:center;font-family:'Segoe UI',sans-serif}
  .card{background:rgba(255,255,255,.05);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:44px;text-align:center;max-width:420px;width:90%;animation:up .7s cubic-bezier(.16,1,.3,1)}
  @keyframes up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  .avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#a78bfa,#f472b6);margin:0 auto 22px;display:flex;align-items:center;justify-content:center;font-size:28px}
  h1{color:#fff;font-size:26px;font-weight:800;margin-bottom:10px;letter-spacing:-.5px}
  p{color:rgba(255,255,255,.6);font-size:14px;line-height:1.7;margin-bottom:26px}
  .btn{display:inline-flex;align-items:center;gap:8px;padding:13px 30px;background:linear-gradient(135deg,#a78bfa,#f472b6);color:#fff;border-radius:50px;border:none;font-weight:700;cursor:pointer;font-size:14px;transition:transform .2s,box-shadow .2s}
  .btn:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(167,139,250,.4)}
</style>
</head>
<body>
  <div class="card">
    <div class="avatar">✦</div>
    <h1>Hello, NexaForge!</h1>
    <p>Edit this code and watch it update live on the right.</p>
    <button class="btn">✦ Get Started</button>
  </div>
</body>
</html>`;

  function init() {
    const el=document.getElementById('ed-code');
    if (el&&!el.textContent.trim()) { el.textContent=SAMPLE; update(); }
    setupResizer();
  }

  function update() {
    clearTimeout(updateTimer);
    updateTimer=setTimeout(()=>{
      const code=document.getElementById('ed-code')?.textContent||'';
      const frame=document.getElementById('ed-preview'); if (!frame) return;
      let html=code;
      if (!code.includes('<html')&&!code.includes('<!DOCTYPE')) html=`<!DOCTYPE html><html><body style="margin:0">${code}</body></html>`;
      frame.srcdoc=html;
    },500);
  }

  function setLang(v) { lang=v; }
  function format() {
    const el=document.getElementById('ed-code'); if (!el) return;
    let code=el.textContent.replace(/>\s*</g,'>\n<');
    el.textContent=code; T.toast('Formatted!','✓');
  }
  function clear() { if (confirm('Clear editor?')) { document.getElementById('ed-code').textContent=''; document.getElementById('ed-preview').srcdoc=''; } }
  function copy() { T.copy(document.getElementById('ed-code')?.textContent||''); }
  function download() {
    const code=document.getElementById('ed-code')?.textContent||'';
    const ext=lang==='css'?'css':lang==='js'?'js':'html';
    const blob=new Blob([code],{type:'text/plain'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='nexaforge-editor.'+ext; a.click();
    URL.revokeObjectURL(url); T.toast('Downloaded!','⬇️');
  }
  function screenshot() {
    const code=document.getElementById('ed-code')?.textContent||'';
    if (!code.trim()) { T.toast('Nothing to screenshot','⚠️'); return; }
    App.go('code2img');
    setTimeout(()=>{ document.getElementById('c2i-code').textContent=code; C2I.render(); },200);
  }

  function setupResizer() {
    const d=document.getElementById('ed-resizer'); if (!d) return;
    d.addEventListener('mousedown',startDrag);
    d.addEventListener('touchstart',startTouchDrag,{passive:true});
  }
  function startDrag() { isDragging=true; document.getElementById('ed-resizer').classList.add('dragging'); document.addEventListener('mousemove',onDrag); document.addEventListener('mouseup',stopDrag); }
  function startTouchDrag() { isDragging=true; document.getElementById('ed-resizer').classList.add('dragging'); document.addEventListener('touchmove',onTouchDrag); document.addEventListener('touchend',stopDrag); }
  function onDrag(e) { if(isDragging) apply(e.clientX); }
  function onTouchDrag(e) { if(isDragging) apply(e.touches[0].clientX); }
  function apply(x) {
    const layout=document.querySelector('.editor-body'); if (!layout) return;
    const r=layout.getBoundingClientRect();
    const pct=Math.max(20,Math.min(80,((x-r.left)/r.width)*100));
    const ep=document.querySelector('.editor-code-pane');
    if (ep) { ep.style.flex='none'; ep.style.width=pct+'%'; }
    const pp=document.querySelector('.editor-preview-pane');
    if (pp) { pp.style.flex='1'; pp.style.width=''; }
  }
  function stopDrag() {
    isDragging=false;
    const d=document.getElementById('ed-resizer'); if(d) d.classList.remove('dragging');
    document.removeEventListener('mousemove',onDrag); document.removeEventListener('mouseup',stopDrag);
    document.removeEventListener('touchmove',onTouchDrag); document.removeEventListener('touchend',stopDrag);
  }

  return { init, update, setLang, format, clear, copy, download, screenshot };
})();

/* ══════════════════════════════════════════
   MOBILE TABS
══════════════════════════════════════════ */
function initMobileTabs(pageId, labels) {
  const tabBar=document.getElementById(pageId==='img2code'?'i2c-mob-tabs':'p2c-mob-tabs'); if (!tabBar) return;
  const prefix=pageId==='img2code'?'i2c':'p2c';
  const cols=['input','code','preview'].map(n=>document.getElementById(`${prefix}-col-${n}`)).filter(Boolean);
  labels.forEach((lbl,i)=>{
    const btn=document.createElement('button');
    btn.className='mob-tab'+(i===0?' on':''); btn.textContent=lbl;
    btn.addEventListener('click',()=>{
      tabBar.querySelectorAll('.mob-tab').forEach(b=>b.classList.remove('on'));
      btn.classList.add('on');
      cols.forEach((c,j)=>c.classList.toggle('mob-active',j===i));
    });
    tabBar.appendChild(btn);
  });
  cols.forEach((c,j)=>c.classList.toggle('mob-active',j===0));
}

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  try {
    setTimeout(() => {
      initMobileTabs('img2code', ['📤 Upload','💻 Code','👁 Preview']);
      initMobileTabs('prompt2code', ['📝 Describe','💻 Code','👁 Preview']);
    }, 2800);
    App.init();
  } catch (e) {
    console.error('App initialization failed:', e);
    // Fallback: hide splash, show app
    document.getElementById('splash').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
  }
});;