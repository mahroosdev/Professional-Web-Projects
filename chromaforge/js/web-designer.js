// ── STATE ──────────────────────────────────────────────────────────
let palette = [], locked = [], currentSection = 'landing', currentMood = 'any', colorCount = 3, scheme = 'free', mockMode = 'desktop';

// ── PALETTE BANKS ──────────────────────────────────────────────────
const BANKS = {
  landing: [
    {name:'Ocean Breeze',desc:'Clean SaaS',colors:['#0ea5e9','#0284c7','#f0f9ff']},
    {name:'Midnight Pro',desc:'Dark premium',colors:['#0f172a','#3b82f6','#e2e8f0']},
    {name:'Forest Tech',desc:'Natural modern',colors:['#064e3b','#10b981','#f0fdf4']},
    {name:'Coral Wave',desc:'Warm landing',colors:['#ff6b6b','#feca57','#fff5f5']},
    {name:'Purple Haze',desc:'Creative SaaS',colors:['#7c3aed','#a78bfa','#1e1b4b']},
  ],
  portfolio: [
    {name:'Dark Canvas',desc:'Minimal portfolio',colors:['#111111','#f5f5f5','#ff4500']},
    {name:'Studio White',desc:'Clean creative',colors:['#ffffff','#1a1a1a','#6366f1']},
    {name:'Copper & Dark',desc:'Elegant work',colors:['#1c1c1c','#c9a96e','#2a2a2a']},
    {name:'Neon Night',desc:'Bold creative',colors:['#0a0a0a','#00ff88','#111111']},
    {name:'Blueprint',desc:'Technical precise',colors:['#1e3a5f','#4a9eff','#e8f4fd']},
  ],
  blog: [
    {name:'Editorial',desc:'Clean readable',colors:['#ffffff','#1a1a1a','#2563eb']},
    {name:'Warm Paper',desc:'Cozy reading',colors:['#fef9f0','#2d2d2d','#e07a5f']},
    {name:'Night Read',desc:'Dark mode blog',colors:['#141414','#e5e5e5','#fbbf24']},
    {name:'Sage Garden',desc:'Lifestyle blog',colors:['#f0fff4','#2d6a4f','#d4a017']},
    {name:'Tech Notes',desc:'Developer blog',colors:['#0d1117','#58a6ff','#8b949e']},
  ],
  ecommerce: [
    {name:'Premium Shop',desc:'Luxury store',colors:['#0a0a0a','#c9a96e','#f5f5f5']},
    {name:'Fresh Market',desc:'Organic products',colors:['#f0fdf4','#16a34a','#1a1a1a']},
    {name:'Bold Commerce',desc:'High conversion',colors:['#ff4500','#1a1a1a','#ffffff']},
    {name:'Pastel Mall',desc:'Lifestyle brand',colors:['#fdf2f8','#ec4899','#831843']},
    {name:'Tech Store',desc:'Electronics shop',colors:['#0f172a','#3b82f6','#111827']},
  ],
  saas: [
    {name:'Dashboard Pro',desc:'SaaS platform',colors:['#0f172a','#6366f1','#e2e8f0']},
    {name:'Growth App',desc:'Analytics tool',colors:['#022c22','#10b981','#f0fdf4']},
    {name:'Violet System',desc:'Design platform',colors:['#2e1065','#7c3aed','#f5f3ff']},
    {name:'Slate Clean',desc:'Productivity',colors:['#f8fafc','#0f172a','#3b82f6']},
    {name:'Carbon UI',desc:'Enterprise dark',colors:['#161616','#4589ff','#f4f4f4']},
  ],
  agency: [
    {name:'Bold Agency',desc:'Creative studio',colors:['#0a0a0a','#ff3e00','#ffffff']},
    {name:'Gold Standard',desc:'Premium agency',colors:['#0d0d0d','#d4af37','#f5f5f0']},
    {name:'Future Now',desc:'Digital agency',colors:['#050505','#00d4ff','#111111']},
    {name:'Gradient House',desc:'Modern studio',colors:['#6366f1','#ec4899','#f0f0f0']},
    {name:'Pure Impact',desc:'Marketing agency',colors:['#ffffff','#1a1a1a','#ff6b35']},
  ],
};

const SEC_URLS = {landing:'yoursite.com',portfolio:'portfolio.me',blog:'myblog.io',ecommerce:'shop.co',saas:'app.yourproduct.com',agency:'studio.agency'};
const SEC_LABELS = {landing:'Landing Page',portfolio:'Portfolio',blog:'Blog',ecommerce:'E-Commerce',saas:'SaaS App',agency:'Agency'};

// ── COLOR UTILS ────────────────────────────────────────────────────
function hexToRgb(h){h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function hexToHsl(h){let[r,g,b]=hexToRgb(h);r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let H,S,L=(mx+mn)/2;if(mx===mn){H=S=0}else{const d=mx-mn;S=L>0.5?d/(2-mx-mn):d/(mx+mn);switch(mx){case r:H=(g-b)/d+(g<b?6:0);break;case g:H=(b-r)/d+2;break;case b:H=(r-g)/d+4;break}H/=6}return[H*360,S*100,L*100]}
function hslToHex(h,s,l){h/=360;s/=100;l/=100;let r,g,b;if(s===0){r=g=b=l}else{const q=l<0.5?l*(1+s):l+s-l*s,p=2*l-q;const hue2rgb=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p};r=hue2rgb(p,q,h+1/3);g=hue2rgb(p,q,h);b=hue2rgb(p,q,h-1/3)}return'#'+[r,g,b].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('')}
function isLight(h){const[r,g,b]=hexToRgb(h);return(r*299+g*587+b*114)/1000>128}
function darken(h,a){let[hh,s,l]=hexToHsl(h);return hslToHex(hh,s,Math.max(0,l-a))}
function lighten(h,a){let[hh,s,l]=hexToHsl(h);return hslToHex(hh,s,Math.min(100,l+a))}
function randomHex(){return'#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0')}
function genPaletteFromBase(base,count,sch){
  const[h,s,l]=hexToHsl(base);
  if(sch==='mono')return Array.from({length:count},(_,i)=>hslToHex(h,s,Math.max(10,Math.min(90,15+i*(70/Math.max(count-1,1))))));
  if(sch==='analogous')return Array.from({length:count},(_,i)=>hslToHex((h+(i-Math.floor(count/2))*25+360)%360,s,l));
  if(sch==='comp')return Array.from({length:count},(_,i)=>hslToHex((h+(i%2===0?0:180))%360,s,Math.max(20,Math.min(80,35+i*8))));
  if(sch==='triadic')return Array.from({length:count},(_,i)=>hslToHex((h+i*120)%360,s,l));
  return Array.from({length:count},()=>randomHex());
}

// ── SELECTION HANDLERS ────────────────────────────────────────────
function selectSection(btn){
  document.querySelectorAll('.sec-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  currentSection = btn.dataset.sec;
  document.getElementById('secLabel').textContent = SEC_LABELS[currentSection];
  document.getElementById('mockUrl').textContent = SEC_URLS[currentSection];
  generateSuggestions();
  renderMockup();
}
function selectMood(btn){document.querySelectorAll('#moodChips .chip').forEach(b=>b.classList.remove('active'));btn.classList.add('active');currentMood=btn.dataset.mood}
function selCount(btn,n){document.querySelectorAll('.cnt-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');colorCount=n}
function selScheme(btn){document.querySelectorAll('.sch-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');scheme=btn.dataset.sch}
function switchMock(btn,m){document.querySelectorAll('.mock-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');mockMode=m;renderMockup()}

// ── GENERATE SUGGESTIONS ──────────────────────────────────────────
function generateSuggestions(){
  const bank = BANKS[currentSection] || BANKS.landing;
  const grid = document.getElementById('sugGrid');
  grid.innerHTML = bank.map((p,i)=>`
    <div class="sug-card" onclick="applySuggestion(${i})" id="sug_${i}">
      <div class="sug-bar">${p.colors.map(c=>`<div class="sug-seg" style="background:${c}"></div>`).join('')}</div>
      <div class="sug-meta">
        <div class="sug-name">${p.name}</div>
        <div class="sug-desc">${p.desc}</div>
      </div>
    </div>`).join('');
  document.getElementById('sugTag').textContent = `${currentSection} · ${colorCount} colors`;
}

function applySuggestion(i){
  document.querySelectorAll('.sug-card').forEach(c=>c.classList.remove('selected'));
  document.getElementById('sug_'+i).classList.add('selected');
  const bank = BANKS[currentSection];
  palette = [...bank[i].colors];
  locked = new Array(palette.length).fill(false);
  while(palette.length < colorCount) palette.push(randomHex());
  palette = palette.slice(0,colorCount);
  locked = new Array(palette.length).fill(false);
  renderPalette(); renderMockup(); renderCompare();
}

// ── GENERATE PALETTE ─────────────────────────────────────────────
function generatePalette(){
  const base = randomHex();
  const generated = genPaletteFromBase(base, colorCount, scheme);
  palette = palette.map((c,i)=>locked[i]?c:generated[i]||randomHex());
  while(palette.length < colorCount){palette.push(randomHex());locked.push(false)}
  palette = palette.slice(0,colorCount);
  renderPalette(); renderMockup(); renderCompare(); generateSuggestions();
  toast('Palette generated!');
}

function shufflePalette(){generatePalette()}
function genComp(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i%2===0?0:180))%360,s,35+i*8));locked=new Array(colorCount).fill(false);renderPalette();renderMockup();renderCompare()}
function genAnalogous(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i-Math.floor(colorCount/2))*20+360)%360,s,l));locked=new Array(colorCount).fill(false);renderPalette();renderMockup();renderCompare()}
function genMono(){const[h,s]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex(h,s,15+i*(70/Math.max(colorCount-1,1))));locked=new Array(colorCount).fill(false);renderPalette();renderMockup();renderCompare()}

// ── RENDER PALETTE ────────────────────────────────────────────────
const ROLES = ['Primary','Secondary','Accent','Surface','Text','Extra'];
function renderPalette(){
  const bar = document.getElementById('palBar');
  const swatches = document.getElementById('palSwatches');
  bar.innerHTML = palette.map((c,i)=>`
    <div class="pal-seg" style="background:${c}" onclick="editColor(${i})">
      <span class="pal-seg-lbl" style="color:${isLight(c)?'#000':'#fff'}">${c}</span>
    </div>`).join('');
  swatches.innerHTML = palette.map((c,i)=>`
    <div class="pal-item">
      <div class="pal-dot" style="background:${c}" onclick="document.getElementById('cp_${i}').click()">
        <input type="color" id="cp_${i}" value="${c}" oninput="updateColor(${i},this.value)" style="width:0;height:0;opacity:0;position:absolute">
      </div>
      <div>
        <input class="pal-hex" value="${c}" onchange="updateColor(${i},this.value)" onclick="navigator.clipboard.writeText('${c}')">
        <div class="pal-role">${ROLES[i]||'Color '+(i+1)}</div>
      </div>
      <button class="pal-lock ${locked[i]?'locked':''}" onclick="toggleLock(${i})">${locked[i]?'🔒':'🔓'}</button>
      <button class="pal-del" onclick="removeColor(${i})">✕</button>
    </div>`).join('');
}
function updateColor(i,v){if(/^#[0-9a-fA-F]{6}$/.test(v)){palette[i]=v;renderPalette();renderMockup();renderCompare()}}
function toggleLock(i){locked[i]=!locked[i];renderPalette()}
function removeColor(i){if(palette.length>2){palette.splice(i,1);locked.splice(i,1);renderPalette();renderMockup();renderCompare()}}
function editColor(i){document.getElementById('cp_'+i)?.click()}

// ── RENDER MOCKUP ─────────────────────────────────────────────────
function renderMockup(){
  const frame = document.getElementById('mockFrame');
  if(!palette.length) return;
  const bg=palette[0], primary=palette[1]||'#3b82f6', accent=palette[2]||primary;
  const surface=darken(bg,8)||'#0f172a';
  const txt=isLight(bg)?'#1a1a1a':'#f0f0f0';
  const mutedTxt=isLight(bg)?'rgba(0,0,0,0.45)':'rgba(255,255,255,0.45)';
  const btnTxt=isLight(primary)?'#000':'#fff';
  const isMob=mockMode==='mobile';
  const w=isMob?'375px':'100%';
  frame.style.maxWidth=w; frame.style.margin='0 auto';
  frame.innerHTML = buildWebMockup(bg,primary,accent,surface,txt,mutedTxt,btnTxt,currentSection);
  document.getElementById('mockSub').textContent = `${SEC_LABELS[currentSection]} · ${mockMode} preview`;
}

function buildWebMockup(bg,primary,accent,surface,txt,muted,btnTxt,sec){
  const templates = {
    landing:`
      <div style="background:${bg};font-family:'Space Grotesk',sans-serif;min-height:360px">
        <nav style="background:${surface};padding:12px 24px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.06)">
          <div style="font-weight:800;font-size:0.9rem;color:${primary}">BRAND</div>
          <div style="display:flex;gap:16px;font-size:0.72rem;color:${muted}"><span>Home</span><span>Features</span><span>Pricing</span></div>
          <div style="background:${primary};color:${btnTxt};padding:6px 14px;border-radius:5px;font-size:0.7rem;font-weight:700">Get Started</div>
        </nav>
        <div style="padding:40px 24px 32px;text-align:center">
          <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);display:inline-block;padding:4px 12px;border-radius:20px;font-size:0.62rem;color:${accent};margin-bottom:16px">✦ New Feature Released</div>
          <h1 style="font-size:clamp(1.4rem,4vw,2rem);font-weight:800;color:${txt};margin-bottom:12px;line-height:1.2">Build Stunning Websites<br>With Confidence</h1>
          <p style="color:${muted};font-size:0.78rem;margin-bottom:24px;max-width:400px;margin-left:auto;margin-right:auto;line-height:1.6">The professional toolkit for modern web designers. Ship beautiful, accessible, and fast websites.</p>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <div style="background:${primary};color:${btnTxt};padding:9px 20px;border-radius:7px;font-size:0.75rem;font-weight:700">Start Free Trial</div>
            <div style="border:1px solid rgba(255,255,255,0.15);color:${txt};padding:9px 20px;border-radius:7px;font-size:0.75rem">View Examples →</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:0 24px 24px">
          ${['Analytics','Builder','Deploy'].map(t=>`<div style="background:${surface};border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:14px;border-top:2px solid ${accent}"><div style="font-weight:700;font-size:0.78rem;color:${txt};margin-bottom:4px">${t}</div><div style="font-size:0.65rem;color:${muted}">Powerful ${t.toLowerCase()} tools built for speed</div></div>`).join('')}
        </div>
      </div>`,
    portfolio:`
      <div style="background:${bg};font-family:'Space Grotesk',sans-serif;min-height:360px">
        <nav style="padding:16px 28px;display:flex;justify-content:space-between;align-items:center">
          <div style="font-weight:800;font-size:1rem;color:${txt}">ALEX<span style="color:${primary}">.</span></div>
          <div style="display:flex;gap:18px;font-size:0.72rem;color:${muted}"><span>Work</span><span>About</span><span>Contact</span></div>
        </nav>
        <div style="padding:32px 28px">
          <div style="font-size:0.65rem;color:${accent};letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;font-weight:700">UI/UX Designer</div>
          <h1 style="font-size:1.8rem;font-weight:800;color:${txt};margin-bottom:12px;line-height:1.1">Crafting digital<br><span style="color:${primary}">experiences</span> that matter</h1>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px">
            ${[['Project A','Web Design'],['Project B','Branding']].map(([t,c])=>`<div style="background:${surface};border-radius:10px;overflow:hidden"><div style="height:80px;background:linear-gradient(135deg,${primary},${accent})"></div><div style="padding:10px"><div style="font-size:0.72rem;font-weight:700;color:${txt}">${t}</div><div style="font-size:0.6rem;color:${muted}">${c}</div></div></div>`).join('')}
          </div>
        </div>
      </div>`,
    saas:`
      <div style="background:${bg};font-family:'Space Grotesk',sans-serif;min-height:360px">
        <div style="display:flex;height:360px">
          <aside style="background:${surface};width:56px;padding:12px 0;display:flex;flex-direction:column;align-items:center;gap:12px;border-right:1px solid rgba(255,255,255,0.06)">
            <div style="width:28px;height:28px;background:${primary};border-radius:6px"></div>
            ${['⊞','◎','◷','⚙'].map(i=>`<div style="font-size:0.9rem;color:${muted};cursor:pointer">${i}</div>`).join('')}
          </aside>
          <main style="flex:1;padding:16px">
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">
              ${[['Total Revenue','$24,500','↑ 12%'],['Active Users','1,248','↑ 8%'],['Conversion','3.4%','↑ 2%']].map(([l,v,d])=>`<div style="background:${surface};border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:10px"><div style="font-size:0.6rem;color:${muted}">${l}</div><div style="font-size:1rem;font-weight:800;color:${txt};margin:2px 0">${v}</div><div style="font-size:0.6rem;color:${accent}">${d}</div></div>`).join('')}
            </div>
            <div style="background:${surface};border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:12px">
              <div style="font-size:0.7rem;font-weight:700;color:${txt};margin-bottom:10px">Revenue Overview</div>
              <div style="display:flex;align-items:flex-end;gap:4px;height:60px">
                ${[40,65,45,80,55,90,70].map(h=>`<div style="flex:1;background:${primary};opacity:0.7;border-radius:3px 3px 0 0;height:${h}%"></div>`).join('')}
              </div>
            </div>
          </main>
        </div>
      </div>`,
    ecommerce:`
      <div style="background:${bg};font-family:'Space Grotesk',sans-serif;min-height:360px">
        <nav style="background:${surface};padding:10px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.06)">
          <div style="font-weight:800;color:${txt}">SHOP</div>
          <div style="display:flex;gap:12px;font-size:0.7rem;color:${muted}"><span>New</span><span>Sale</span><span>Brands</span></div>
          <div style="display:flex;gap:10px;font-size:0.85rem">🔍 🛒</div>
        </nav>
        <div style="padding:16px 20px">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
            ${[['Product A','$89'],['Product B','$129'],['Product C','$59']].map(([n,p])=>`
              <div style="background:${surface};border-radius:10px;overflow:hidden">
                <div style="height:90px;background:linear-gradient(135deg,${primary}44,${accent}44);display:flex;align-items:center;justify-content:center;font-size:1.6rem">🎁</div>
                <div style="padding:8px"><div style="font-size:0.72rem;font-weight:600;color:${txt}">${n}</div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px"><span style="font-weight:800;color:${accent};font-size:0.8rem">${p}</span><div style="background:${primary};color:${btnTxt};padding:3px 8px;border-radius:4px;font-size:0.6rem">Add</div></div></div>
              </div>`).join('')}
          </div>
        </div>
      </div>`,
    blog:`
      <div style="background:${bg};font-family:'Space Grotesk',sans-serif;min-height:360px">
        <nav style="padding:14px 24px;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;justify-content:space-between;align-items:center">
          <div style="font-weight:800;color:${primary}">THE BLOG</div>
          <div style="display:flex;gap:14px;font-size:0.72rem;color:${muted}"><span>Articles</span><span>Topics</span><span>About</span></div>
        </nav>
        <div style="padding:24px;max-width:580px;margin:0 auto">
          <div style="background:${surface};border-radius:12px;overflow:hidden;margin-bottom:14px">
            <div style="height:80px;background:linear-gradient(135deg,${primary},${accent})"></div>
            <div style="padding:14px"><div style="font-size:0.6rem;color:${accent};text-transform:uppercase;letter-spacing:2px;margin-bottom:6px">Design</div><div style="font-size:0.9rem;font-weight:700;color:${txt};margin-bottom:6px">The Art of Visual Hierarchy in Web Design</div><div style="font-size:0.65rem;color:${muted}">5 min read · March 2024</div></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            ${[['Typography Tips','3 min'],['Color Systems','4 min']].map(([t,r])=>`<div style="background:${surface};border-radius:8px;padding:10px;border-left:3px solid ${accent}"><div style="font-size:0.72rem;font-weight:600;color:${txt};margin-bottom:4px">${t}</div><div style="font-size:0.6rem;color:${muted}">${r} read</div></div>`).join('')}
          </div>
        </div>
      </div>`,
    agency:`
      <div style="background:${bg};font-family:'Space Grotesk',sans-serif;min-height:360px">
        <nav style="padding:14px 28px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.06)">
          <div style="font-weight:900;font-size:1rem;letter-spacing:2px;color:${txt}">STUDIO<span style="color:${primary}">X</span></div>
          <div style="display:flex;gap:16px;font-size:0.7rem;color:${muted}"><span>Work</span><span>Services</span><span>Contact</span></div>
        </nav>
        <div style="padding:36px 28px;display:flex;align-items:center;gap:28px">
          <div style="flex:1">
            <div style="font-size:0.6rem;color:${accent};letter-spacing:3px;text-transform:uppercase;margin-bottom:12px">Creative Agency</div>
            <h1 style="font-size:1.8rem;font-weight:900;color:${txt};line-height:1;margin-bottom:12px">WE BUILD<br><span style="color:${primary}">BRANDS</span><br>THAT LAST</h1>
            <div style="display:inline-flex;background:${primary};color:${btnTxt};padding:9px 18px;border-radius:5px;font-size:0.72rem;font-weight:700;cursor:pointer">View Our Work →</div>
          </div>
          <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:6px">
            ${[primary,accent,surface,bg].map(c=>`<div style="background:${c};border-radius:8px;height:60px;border:1px solid rgba(255,255,255,0.08)"></div>`).join('')}
          </div>
        </div>
      </div>`,
  };
  return templates[sec] || templates.landing;
}

// ── RENDER COMPARE ────────────────────────────────────────────────
function renderCompare(){
  if(!palette[0]) return;
  const[h,s]=hexToHsl(palette[0]);
  const shades=Array.from({length:8},(_,i)=>hslToHex(h,s,10+i*10));
  document.getElementById('cmpRow').innerHTML=shades.map(c=>`
    <div class="cmp-box" onclick="navigator.clipboard.writeText('${c}');toast('Copied ${c}!')">
      <div class="cmp-top" style="background:${c}"></div>
      <div class="cmp-bot">
        <div class="cmp-hex">${c}</div>
        <div class="cmp-info">${isLight(c)?'Light':'Dark'}</div>
      </div>
    </div>`).join('');
}

// ── COPY ──────────────────────────────────────────────────────────
function copyCSS(){const css=palette.map((c,i)=>`--color-${ROLES[i]?.toLowerCase()||'c'+(i+1)}:${c};`).join('\n');navigator.clipboard.writeText(`:root{\n${css}\n}`);toast('CSS copied!')}
function copyHex(){navigator.clipboard.writeText(palette.join(', '));toast('HEX values copied!')}

// ── SAVE ──────────────────────────────────────────────────────────
let savedCount=0;
function savePalette(){savedCount++;document.getElementById('savedCount').textContent=savedCount;toast('Palette saved!')}

// ── TOAST ──────────────────────────────────────────────────────────
let tTimer;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(tTimer);tTimer=setTimeout(()=>t.classList.remove('show'),2200)}

// ── INIT ──────────────────────────────────────────────────────────
function init(){
  palette=['#0ea5e9','#0284c7','#f0f9ff'];
  locked=new Array(palette.length).fill(false);
  generateSuggestions();
  renderPalette();
  renderMockup();
  renderCompare();
}
init();;