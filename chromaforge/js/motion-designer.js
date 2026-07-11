let palette=[], locked=[], currentSection='title-card', currentMood='any', colorCount=3, scheme='free', mockMode='animated';

const BANKS={
  'title-card':[
    {name:'CYBER NEON',desc:'Cyberpunk title',colors:['#050a14','#00d4ff','#f953c6']},
    {name:'GOLD STANDARD',desc:'Luxury opener',colors:['#0a0a0a','#d4af37','#f5f0e0']},
    {name:'ELECTRIC',desc:'High energy',colors:['#0a0a1a','#3a7bd5','#00ff88']},
    {name:'CINEMATIC',desc:'Film grade',colors:['#0d0d0d','#c9a84c','#f0e8d8']},
    {name:'SUNSET BURN',desc:'Warm energy',colors:['#0a0508','#ff4400','#ff9900']},
  ],
  transition:[
    {name:'WIPE CLEAN',desc:'Clean transition',colors:['#ffffff','#0f172a','#3b82f6']},
    {name:'NEON BURST',desc:'Flash transition',colors:['#050a14','#00d4ff','#ff00ff']},
    {name:'FADE WARM',desc:'Soft dissolve',colors:['#0a0508','#ff6b35','#f7e7ce']},
    {name:'GLITCH',desc:'Digital glitch',colors:['#0a0a0a','#ff0040','#00ffff']},
    {name:'GRADIENT SWIPE',desc:'Smooth wipe',colors:['#1a0a2e','#7c3aed','#f953c6']},
  ],
  'lower-third':[
    {name:'NEWS STYLE',desc:'Broadcast lower',colors:['#0e2240','#c9a84c','#ffffff']},
    {name:'SPORT HUD',desc:'Sports broadcast',colors:['#0a0a0a','#ff3300','#ffffff']},
    {name:'TECH OVERLAY',desc:'Tech HUD',colors:['#050a14','#00d4ff','#e0f0ff']},
    {name:'MINIMAL',desc:'Clean lower third',colors:['#ffffff','#1a1a1a','#3b82f6']},
    {name:'PREMIUM',desc:'High-end broadcast',colors:['#0a0a0a','#d4af37','#f5f0e0']},
  ],
  explainer:[
    {name:'BRAND EXPLAIN',desc:'Corporate motion',colors:['#ffffff','#4f46e5','#e0e7ff']},
    {name:'PRODUCT DEMO',desc:'SaaS explainer',colors:['#0f172a','#3b82f6','#10b981']},
    {name:'EDUCATION',desc:'Learning video',colors:['#f8fafc','#f59e0b','#059669']},
    {name:'STARTUP',desc:'Pitch deck motion',colors:['#050a14','#00d4ff','#f0f8ff']},
    {name:'FUN EXPLAINER',desc:'Playful motion',colors:['#fff9f0','#ff6b35','#ffd166']},
  ],
  'logo-reveal':[
    {name:'PREMIUM REVEAL',desc:'Luxury logo',colors:['#0a0a0a','#d4af37','#1a1a1a']},
    {name:'TECH REVEAL',desc:'Tech brand intro',colors:['#050a14','#00d4ff','#0a0a0a']},
    {name:'CLEAN REVEAL',desc:'Minimal reveal',colors:['#ffffff','#1a1a1a','#e0e0e0']},
    {name:'NEON REVEAL',desc:'Electric logo',colors:['#050a14','#ff00ff','#00ffff']},
    {name:'CINEMATIC',desc:'Film style reveal',colors:['#0d0d0d','#c9a84c','#2a2a2a']},
  ],
  'ui-animation':[
    {name:'MOBILE UI',desc:'App transition',colors:['#f8fafc','#4f46e5','#7c3aed']},
    {name:'DARK SYSTEM',desc:'Dark UI motion',colors:['#0f172a','#3b82f6','#e2e8f0']},
    {name:'MICRO INTER',desc:'Micro-interactions',colors:['#ffffff','#059669','#f9fafb']},
    {name:'LOADING',desc:'Progress & states',colors:['#0f172a','#6366f1','#a5b4fc']},
    {name:'NOTIFICATION',desc:'Alert animations',colors:['#fff','#ef4444','#fef2f2']},
  ],
};

const SEC_LABELS={'title-card':'Title Card',transition:'Transition','lower-third':'Lower Third',explainer:'Explainer','logo-reveal':'Logo Reveal','ui-animation':'UI Animation'};
const ROLES=['Background','Primary','Accent','Highlight','Glow','Trail'];

function hexToRgb(h){h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function hexToHsl(h){let[r,g,b]=hexToRgb(h);r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let H,S,L=(mx+mn)/2;if(mx===mn){H=S=0}else{const d=mx-mn;S=L>0.5?d/(2-mx-mn):d/(mx+mn);switch(mx){case r:H=(g-b)/d+(g<b?6:0);break;case g:H=(b-r)/d+2;break;case b:H=(r-g)/d+4;break}H/=6}return[H*360,S*100,L*100]}
function hslToHex(h,s,l){h/=360;s/=100;l/=100;let r,g,b;if(s===0){r=g=b=l}else{const q=l<0.5?l*(1+s):l+s-l*s,p=2*l-q,h2r=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p};r=h2r(p,q,h+1/3);g=h2r(p,q,h);b=h2r(p,q,h-1/3)}return'#'+[r,g,b].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('')}
function isLight(h){const[r,g,b]=hexToRgb(h);return(r*299+g*587+b*114)/1000>128}
function randomHex(){return'#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0')}

function selectSection(btn){document.querySelectorAll('.sec-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');currentSection=btn.dataset.sec;document.getElementById('secLabel').textContent=SEC_LABELS[currentSection];generateSuggestions();renderMockup()}
function selectMood(btn){document.querySelectorAll('.chips .chip').forEach(b=>b.classList.remove('active'));btn.classList.add('active');currentMood=btn.dataset.mood}
function selCount(btn,n){document.querySelectorAll('.cnt-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');colorCount=n}
function selScheme(btn){document.querySelectorAll('.sch-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');scheme=btn.dataset.sch}
function switchMock(btn,m){document.querySelectorAll('.mock-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');mockMode=m;renderMockup()}

function generateSuggestions(){
  const bank=BANKS[currentSection]||BANKS['title-card'];
  document.getElementById('sugGrid').innerHTML=bank.map((p,i)=>`
    <div class="sug-card" onclick="applySuggestion(${i})" id="sug_${i}">
      <div class="sug-bar">${p.colors.map(c=>`<div class="sug-seg" style="background:${c}"></div>`).join('')}</div>
      <div class="sug-meta"><div class="sug-name">${p.name}</div><div class="sug-desc">${p.desc}</div></div>
    </div>`).join('');
  document.getElementById('sugTag').textContent=currentSection.replace('-',' ');
}

function applySuggestion(i){
  document.querySelectorAll('.sug-card').forEach(c=>c.classList.remove('selected'));
  document.getElementById('sug_'+i).classList.add('selected');
  const bank=BANKS[currentSection];
  palette=[...bank[i].colors];
  locked=new Array(palette.length).fill(false);
  while(palette.length<colorCount)palette.push(randomHex());
  palette=palette.slice(0,colorCount);
  locked=new Array(colorCount).fill(false);
  renderAll();
}

function generatePalette(){
  const base=randomHex();
  const[h,s,l]=hexToHsl(base);
  let gen;
  if(scheme==='mono')gen=Array.from({length:colorCount},(_,i)=>hslToHex(h,s,8+i*(80/Math.max(colorCount-1,1))));
  else if(scheme==='comp')gen=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i%2===0?0:180))%360,s,30+i*8));
  else if(scheme==='analogous')gen=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i-1)*22+360)%360,s,l));
  else if(scheme==='triadic')gen=Array.from({length:colorCount},(_,i)=>hslToHex((h+i*120)%360,s,l));
  else gen=Array.from({length:colorCount},()=>randomHex());
  palette=palette.map((c,i)=>locked[i]?c:gen[i]||randomHex());
  while(palette.length<colorCount){palette.push(randomHex());locked.push(false)}
  palette=palette.slice(0,colorCount);
  renderAll();generateSuggestions();toast('▶ PALETTE LOADED');
}

function shufflePalette(){generatePalette()}
function genComp(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i%2===0?0:180))%360,s,30+i*8));locked=new Array(colorCount).fill(false);renderAll()}
function genAnalogous(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i-1)*22+360)%360,s,l));locked=new Array(colorCount).fill(false);renderAll()}
function genTriadic(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+i*120)%360,s,l));locked=new Array(colorCount).fill(false);renderAll()}
function renderAll(){renderPalette();renderMockup();renderCompare()}

function renderPalette(){
  document.getElementById('palBar').innerHTML=palette.map((c,i)=>`<div class="pal-seg" style="background:${c}"><span class="pal-seg-lbl">${c}</span></div>`).join('');
  document.getElementById('palSwatches').innerHTML=palette.map((c,i)=>`
    <div class="pal-item">
      <div class="pal-dot" style="background:${c}" onclick="document.getElementById('cp_${i}').click()">
        <input type="color" id="cp_${i}" value="${c}" oninput="updateColor(${i},this.value)" style="width:0;height:0;opacity:0;position:absolute">
      </div>
      <div>
        <input class="pal-hex" value="${c}" onchange="updateColor(${i},this.value)">
        <div class="pal-role">${ROLES[i]||'C'+(i+1)}</div>
      </div>
      <button class="pal-lock ${locked[i]?'locked':''}" onclick="toggleLock(${i})">${locked[i]?'🔒':'○'}</button>
      <button class="pal-del" onclick="removeColor(${i})">✕</button>
    </div>`).join('');
}
function updateColor(i,v){if(/^#[0-9a-fA-F]{6}$/.test(v)){palette[i]=v;renderAll()}}
function toggleLock(i){locked[i]=!locked[i];renderPalette()}
function removeColor(i){if(palette.length>2){palette.splice(i,1);locked.splice(i,1);renderAll()}}

function renderMockup(){
  const frame=document.getElementById('mockFrame');
  if(!palette.length)return;
  const bg=palette[0], primary=palette[1]||'#00d4ff', accent=palette[2]||primary;
  const txt=isLight(bg)?'#0a0a0a':'#e0f0ff';
  const glow=primary;
  document.getElementById('mockSub').textContent=`${SEC_LABELS[currentSection]} — ${mockMode}`;

  const templates={
    animated:`
      <div style="background:${bg};min-height:370px;overflow:hidden;position:relative;font-family:'Exo 2',sans-serif">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,${primary}20,transparent 60%),radial-gradient(ellipse at 70% 30%,${accent}18,transparent 50%)"></div>
        <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${primary},transparent);animation:grow 3s ease-in-out infinite"></div>
        <div style="position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${accent},transparent);animation:grow 3s ease-in-out infinite 1.5s"></div>
        <div style="display:flex;align-items:center;justify-content:center;height:370px;flex-direction:column;gap:20px;position:relative;z-index:1">
          <div style="animation:float 3s ease-in-out infinite">
            <div style="width:64px;height:64px;border:2px solid ${primary};border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 24px ${primary}60;margin:0 auto 16px">
              <div style="width:32px;height:32px;background:${primary};border-radius:6px;animation:spin 4s linear infinite"></div>
            </div>
            <div style="font-family:'Rajdhani',sans-serif;font-size:1.8rem;font-weight:700;letter-spacing:5px;text-transform:uppercase;color:${txt};text-align:center;text-shadow:0 0 20px ${primary}80">MOTION STUDIO</div>
            <div style="width:60%;height:1px;background:linear-gradient(90deg,transparent,${accent},transparent);margin:12px auto"></div>
            <div style="font-family:'Share Tech Mono',monospace;font-size:0.65rem;letter-spacing:4px;color:${primary};text-align:center;opacity:0.8">${SEC_LABELS[currentSection].toUpperCase()} · LIVE PREVIEW</div>
          </div>
          <div style="display:flex;gap:6px;margin-top:10px">
            ${palette.map(c=>`<div style="width:10px;height:10px;border-radius:50%;background:${c};box-shadow:0 0 8px ${c}80;animation:float 2s ease-in-out infinite;animation-delay:${Math.random()*2}s"></div>`).join('')}
          </div>
        </div>
      </div>`,
    gradient:`
      <div style="background:${bg};min-height:370px;padding:20px;font-family:'Share Tech Mono',monospace">
        <div style="font-size:0.58rem;letter-spacing:3px;color:${primary};opacity:0.6;text-transform:uppercase;margin-bottom:14px">Gradient Sequences</div>
        ${[
          [palette[0]||'#050a14', palette[1]||'#00d4ff'],
          [palette[1]||'#00d4ff', palette[2]||'#f953c6'],
          palette.length>2?[palette[0], palette[palette.length-1]]:[palette[0],palette[0]],
          [palette[0], ...palette.slice(1)],
        ].map(([from,...rest])=>`
          <div style="margin-bottom:10px">
            <div style="height:36px;border-radius:6px;background:linear-gradient(90deg,${from},${rest.join(',')});margin-bottom:4px"></div>
            <div style="font-size:0.5rem;color:${txt};opacity:0.4">linear-gradient(90deg, ${from}${rest.map(r=>', '+r).join('')})</div>
          </div>`).join('')}
        <div style="margin-top:16px">
          <div style="height:48px;border-radius:8px;background:conic-gradient(${palette.map((c,i)=>`${c} ${i*(360/palette.length)}deg ${(i+1)*(360/palette.length)}deg`).join(', ')});width:48px;border-radius:50%;float:left;margin-right:14px;box-shadow:0 0 16px ${primary}50"></div>
          <div style="font-size:0.58rem;color:${txt};opacity:0.5;padding-top:8px">Conic gradient from palette</div>
        </div>
      </div>`,
    stills:`
      <div style="background:${bg};min-height:370px;display:grid;grid-template-columns:1fr 1fr;gap:2px;font-family:'Exo 2',sans-serif">
        <div style="background:${bg};padding:20px;display:flex;flex-direction:column;justify-content:center">
          <div style="font-family:'Rajdhani',sans-serif;font-size:0.55rem;letter-spacing:4px;text-transform:uppercase;color:${primary};margin-bottom:8px">Frame 01</div>
          <div style="font-family:'Rajdhani',sans-serif;font-size:1.4rem;font-weight:700;letter-spacing:3px;color:${txt};text-transform:uppercase;line-height:0.9">OPENING<br>TITLE</div>
          <div style="width:40px;height:2px;background:${accent};margin-top:12px"></div>
        </div>
        <div style="background:${primary};padding:20px;display:flex;align-items:center;justify-content:center">
          <div style="text-align:center">
            <div style="width:48px;height:48px;border:2px solid ${isLight(primary)?'rgba(0,0,0,0.3)':'rgba(255,255,255,0.4)'};border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 8px">
              <div style="font-size:1.2rem">▶</div>
            </div>
            <div style="font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:${isLight(primary)?'rgba(0,0,0,0.6)':'rgba(255,255,255,0.7)'}">PLAY REEL</div>
          </div>
        </div>
        <div style="background:${accent};padding:18px;grid-column:1/-1;display:flex;align-items:center;justify-content:space-between">
          <div style="font-family:'Rajdhani',sans-serif;font-size:0.8rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${isLight(accent)?'rgba(0,0,0,0.8)':'rgba(255,255,255,0.9)'}">MOTION DESIGNER · PORTFOLIO 2024</div>
          <div style="display:flex;gap:8px">${palette.map(c=>`<div style="width:10px;height:10px;border-radius:2px;background:${c};opacity:0.7"></div>`).join('')}</div>
        </div>
      </div>`,
  };
  frame.innerHTML=templates[mockMode]||templates.animated;
}

function renderCompare(){
  if(!palette[0])return;
  const[h,s]=hexToHsl(palette[0]);
  const shades=Array.from({length:8},(_,i)=>hslToHex(h,s,8+i*11));
  document.getElementById('cmpRow').innerHTML=shades.map(c=>`
    <div class="cmp-box" onclick="navigator.clipboard.writeText('${c}');toast('COPIED')">
      <div class="cmp-top" style="background:${c}"></div>
      <div class="cmp-bot"><div class="cmp-hex">${c}</div><div class="cmp-info">${isLight(c)?'LT':'DK'}</div></div>
    </div>`).join('');
}

function copyCSS(){const css=palette.map((c,i)=>`  --motion-${ROLES[i].toLowerCase()}: ${c};`).join('\n');navigator.clipboard.writeText(`:root {\n${css}\n}`);toast('CSS COPIED')}
function copyHex(){navigator.clipboard.writeText(palette.join(' '));toast('HEX COPIED')}
function savePalette(){toast('PALETTE EXPORTED')}
let tTimer;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(tTimer);tTimer=setTimeout(()=>t.classList.remove('show'),2200)}

function init(){palette=['#050a14','#00d4ff','#f953c6'];locked=new Array(3).fill(false);generateSuggestions();renderPalette();renderMockup();renderCompare()}
init();;