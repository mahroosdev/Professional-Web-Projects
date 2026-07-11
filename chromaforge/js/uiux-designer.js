let palette=[], locked=[], currentSection='dashboard', currentMood='light', colorCount=5, scheme='free', mockMode='desktop';

const BANKS={
  dashboard:[
    {name:'Indigo System',desc:'Clean dashboard',colors:['#4f46e5','#818cf8','#e0e7ff','#f9fafb','#1e1b4b']},
    {name:'Emerald Data',desc:'Analytics',colors:['#059669','#34d399','#d1fae5','#f9fafb','#064e3b']},
    {name:'Slate Pro',desc:'Enterprise',colors:['#0f172a','#475569','#e2e8f0','#f8fafc','#3b82f6']},
    {name:'Rose Analytics',desc:'Metrics',colors:['#e11d48','#fb7185','#ffe4e6','#fff1f2','#881337']},
    {name:'Amber BI',desc:'Business intel',colors:['#d97706','#fbbf24','#fef3c7','#fffbeb','#92400e']},
  ],
  mobile:[
    {name:'iOS Inspired',desc:'Clean mobile',colors:['#007aff','#5ac8fa','#f2f2f7','#ffffff','#1c1c1e']},
    {name:'Material You',desc:'Android style',colors:['#6750a4','#b69df8','#f3eeff','#ffffff','#21005d']},
    {name:'Dark Mobile',desc:'Night mode app',colors:['#1c1c1e','#2c2c2e','#3a3a3c','#636366','#0a84ff']},
    {name:'Playful App',desc:'Consumer app',colors:['#ff375f','#ff6482','#fff0f3','#ffffff','#b5002e']},
    {name:'Finance App',desc:'Fintech mobile',colors:['#0071e3','#34aadc','#e8f4fc','#ffffff','#003066']},
  ],
  'design-system':[
    {name:'Neutral Base',desc:'Design system',colors:['#6366f1','#a5b4fc','#e0e7ff','#f8fafc','#312e81']},
    {name:'Brand System',desc:'Brand tokens',colors:['#dc2626','#fca5a5','#fee2e2','#f9fafb','#7f1d1d']},
    {name:'Accessible',desc:'WCAG AA',colors:['#1d4ed8','#93c5fd','#dbeafe','#f0f9ff','#1e3a8a']},
    {name:'Dark System',desc:'Dark theme',colors:['#818cf8','#4f46e5','#1e1b4b','#0f0e1a','#e0e7ff']},
    {name:'Semantic Set',desc:'Semantic tokens',colors:['#059669','#dc2626','#d97706','#2563eb','#0f172a']},
  ],
  onboarding:[
    {name:'Warm Welcome',desc:'Friendly flow',colors:['#ff6b6b','#feca57','#48dbfb','#ffffff','#2d2d2d']},
    {name:'Calm Guide',desc:'Minimal steps',colors:['#6366f1','#a78bfa','#f5f3ff','#ffffff','#1e1b4b']},
    {name:'Bold Steps',desc:'High energy',colors:['#0f172a','#3b82f6','#06b6d4','#f0f9ff','#e2e8f0']},
    {name:'Progress Path',desc:'Gamified onboard',colors:['#7c3aed','#c4b5fd','#ede9fe','#fafafa','#2e1065']},
    {name:'Trust Builder',desc:'SaaS onboarding',colors:['#064e3b','#10b981','#d1fae5','#f0fdf4','#065f46']},
  ],
  'data-viz':[
    {name:'Categorical',desc:'Chart colors',colors:['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6']},
    {name:'Sequential',desc:'Heatmap scale',colors:['#eff6ff','#93c5fd','#3b82f6','#1d4ed8','#1e3a8a']},
    {name:'Diverging',desc:'Positive/Neg',colors:['#dc2626','#fca5a5','#f9fafb','#93c5fd','#1d4ed8']},
    {name:'Dark Charts',desc:'Dark mode viz',colors:['#60a5fa','#34d399','#fbbf24','#f87171','#a78bfa']},
    {name:'Accessible Viz',desc:'Color-blind safe',colors:['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e']},
  ],
  'form-ui':[
    {name:'Clean Forms',desc:'Minimal inputs',colors:['#2563eb','#dbeafe','#f1f5f9','#ffffff','#1e40af']},
    {name:'Soft UI',desc:'Neumorphic',colors:['#e0e5ec','#a3b1c6','#6b7a8d','#ffffff','#3d4a5c']},
    {name:'Dark Forms',desc:'Dark mode input',colors:['#1e293b','#334155','#475569','#94a3b8','#38bdf8']},
    {name:'Validated',desc:'Success states',colors:['#059669','#dc2626','#d97706','#2563eb','#0f172a']},
    {name:'Accessible',desc:'High contrast',colors:['#1e3a8a','#1d4ed8','#dbeafe','#f0f9ff','#172554']},
  ],
};

const SEC_URLS={dashboard:'app.dashboard.com',mobile:'mobile.app',['design-system']:'design.system.io',onboarding:'onboard.app',['data-viz']:'analytics.app','form-ui':'forms.ui.app'};
const SEC_LABELS={dashboard:'Dashboard / App',mobile:'Mobile App',['design-system']:'Design System',onboarding:'Onboarding Flow',['data-viz']:'Data Visualization','form-ui':'Forms & Inputs'};
const TOKEN_NAMES=['--color-primary','--color-secondary','--color-bg-subtle','--color-bg','--color-foreground','--color-neutral-1','--color-neutral-2','--color-border','--color-accent'];

function hexToRgb(h){h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function hexToHsl(h){let[r,g,b]=hexToRgb(h);r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let H,S,L=(mx+mn)/2;if(mx===mn){H=S=0}else{const d=mx-mn;S=L>0.5?d/(2-mx-mn):d/(mx+mn);switch(mx){case r:H=(g-b)/d+(g<b?6:0);break;case g:H=(b-r)/d+2;break;case b:H=(r-g)/d+4;break}H/=6}return[H*360,S*100,L*100]}
function hslToHex(h,s,l){h/=360;s/=100;l/=100;let r,g,b;if(s===0){r=g=b=l}else{const q=l<0.5?l*(1+s):l+s-l*s,p=2*l-q,hue2rgb=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p};r=hue2rgb(p,q,h+1/3);g=hue2rgb(p,q,h);b=hue2rgb(p,q,h-1/3)}return'#'+[r,g,b].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('')}
function isLight(h){const[r,g,b]=hexToRgb(h);return(r*299+g*587+b*114)/1000>128}
function randomHex(){return'#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0')}

function selectSection(btn){document.querySelectorAll('.sec-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');currentSection=btn.dataset.sec;document.getElementById('secLabel').textContent=SEC_LABELS[currentSection];document.getElementById('mockUrl').textContent=SEC_URLS[currentSection];generateSuggestions();renderMockup()}
function selectMood(btn){document.querySelectorAll('#moodChips .chip').forEach(b=>b.classList.remove('active'));btn.classList.add('active');currentMood=btn.dataset.mood;renderMockup()}
function selCount(btn,n){document.querySelectorAll('.cnt-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');colorCount=n;document.getElementById('tokenCount').textContent=n}
function selScheme(btn){document.querySelectorAll('.sch-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');scheme=btn.dataset.sch}
function switchMock(btn,m){document.querySelectorAll('.mock-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');mockMode=m;renderMockup()}

function generateSuggestions(){
  const bank=BANKS[currentSection]||BANKS.dashboard;
  document.getElementById('sugGrid').innerHTML=bank.map((p,i)=>`
    <div class="sug-card" onclick="applySuggestion(${i})" id="sug_${i}">
      <div class="sug-bar">${p.colors.slice(0,5).map(c=>`<div class="sug-seg" style="background:${c}"></div>`).join('')}</div>
      <div class="sug-meta"><div class="sug-name">${p.name}</div><div class="sug-desc">${p.desc}</div></div>
    </div>`).join('');
  document.getElementById('sugTag').textContent=`${SEC_LABELS[currentSection].split('/')[0].trim().toLowerCase()} · ${colorCount} tokens`;
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
  renderPalette();renderMockup();renderCompare();
}

function generatePalette(){
  const base=randomHex();
  const[h,s,l]=hexToHsl(base);
  let generated;
  if(scheme==='mono')generated=Array.from({length:colorCount},(_,i)=>hslToHex(h,s,10+i*(80/Math.max(colorCount-1,1))));
  else if(scheme==='analogous')generated=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i-2)*18+360)%360,s,l));
  else if(scheme==='comp')generated=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i%2===0?0:180))%360,s,30+i*8));
  else generated=Array.from({length:colorCount},()=>randomHex());
  palette=palette.map((c,i)=>locked[i]?c:generated[i]||randomHex());
  while(palette.length<colorCount){palette.push(randomHex());locked.push(false)}
  palette=palette.slice(0,colorCount);
  renderPalette();renderMockup();renderCompare();generateSuggestions();
  toast('Token set generated');
}

function shufflePalette(){generatePalette()}
function genComp(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i%2===0?0:180))%360,s,25+i*8));locked=new Array(colorCount).fill(false);renderAll()}
function genAnalogous(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i-2)*18+360)%360,s,l));locked=new Array(colorCount).fill(false);renderAll()}
function genMono(){const[h,s]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex(h,s,10+i*(80/Math.max(colorCount-1,1))));locked=new Array(colorCount).fill(false);renderAll()}
function renderAll(){renderPalette();renderMockup();renderCompare()}

function renderPalette(){
  document.getElementById('palBar').innerHTML=palette.map((c,i)=>`<div class="pal-seg" style="background:${c}" onclick="document.getElementById('cp_${i}').click()"><span class="pal-seg-lbl">${TOKEN_NAMES[i]?.split('--color-')[1]||'c'+(i+1)}</span></div>`).join('');
  document.getElementById('palSwatches').innerHTML=palette.map((c,i)=>`
    <div class="pal-item">
      <div class="pal-dot" style="background:${c}" onclick="document.getElementById('cp_${i}').click()">
        <input type="color" id="cp_${i}" value="${c}" oninput="updateColor(${i},this.value)" style="width:0;height:0;opacity:0;position:absolute">
      </div>
      <div>
        <input class="pal-hex" value="${c}" onchange="updateColor(${i},this.value)">
        <div class="pal-role">${TOKEN_NAMES[i]||'--c-'+(i+1)}</div>
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
  const primary=palette[0],secondary=palette[1]||primary,bg=palette[2]||'#f9fafb',surface=palette[3]||'#ffffff',fg=palette[4]||'#111827';
  const txt=isLight(bg)?fg:'#f0f0f0';
  const isDark=!isLight(bg);
  document.getElementById('mockSub').textContent=`${SEC_LABELS[currentSection]} · ${mockMode} · ${currentMood} mode`;
  const templates={
    dashboard:`
      <div style="background:${bg};font-family:'IBM Plex Sans',sans-serif;display:flex;height:360px">
        <aside style="background:${surface};width:48px;display:flex;flex-direction:column;align-items:center;padding:12px 0;gap:10px;border-right:1px solid rgba(${isDark?'255,255,255':'0,0,0'},0.07)">
          <div style="width:24px;height:24px;background:${primary};border-radius:5px"></div>
          ${['⊞','◎','◷','📊','⚙'].map(i=>`<div style="font-size:0.8rem;color:${txt};opacity:0.4">${i}</div>`).join('')}
        </aside>
        <main style="flex:1;padding:14px;overflow:hidden">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:10px">
            ${[['Users','2,450','↑5%'],['Revenue','$18k','↑12%'],['Conversion','4.2%','↑1%'],['Sessions','8,920','↑8%']].map(([l,v,d])=>`
              <div style="background:${surface};border:1px solid rgba(${isDark?'255,255,255':'0,0,0'},0.06);border-radius:7px;padding:9px">
                <div style="font-size:0.58rem;color:${txt};opacity:0.5;margin-bottom:3px">${l}</div>
                <div style="font-size:0.9rem;font-weight:600;color:${txt}">${v}</div>
                <div style="font-size:0.58rem;color:${primary}">${d}</div>
              </div>`).join('')}
          </div>
          <div style="background:${surface};border:1px solid rgba(${isDark?'255,255,255':'0,0,0'},0.06);border-radius:7px;padding:12px;margin-bottom:8px">
            <div style="font-size:0.68rem;font-weight:600;color:${txt};margin-bottom:10px">Activity</div>
            <div style="display:flex;align-items:flex-end;gap:5px;height:60px">
              ${[50,70,45,85,60,90,55,75,40,80].map((h,i)=>`<div style="flex:1;background:${i===5?primary:secondary};opacity:${i===5?1:0.35};border-radius:2px 2px 0 0;height:${h}%"></div>`).join('')}
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">
            ${[['Active','1,240','primary'],['Pending','38','warn']].map(([s,n,t])=>`<div style="background:${surface};border-left:3px solid ${t==='primary'?primary:secondary};border-radius:0 7px 7px 0;border:1px solid rgba(${isDark?'255,255,255':'0,0,0'},0.06);border-left:3px solid ${t==='primary'?primary:secondary};padding:8px"><div style="font-size:0.6rem;color:${txt};opacity:0.5">${s}</div><div style="font-size:1rem;font-weight:700;color:${txt}">${n}</div></div>`).join('')}
          </div>
        </main>
      </div>`,
    mobile:`
      <div style="background:${bg};font-family:'IBM Plex Sans',sans-serif;max-width:320px;margin:0 auto;min-height:360px;padding:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div><div style="font-size:0.62rem;color:${txt};opacity:0.5">Good morning</div><div style="font-size:0.95rem;font-weight:600;color:${txt}">Alex Johnson</div></div>
          <div style="width:32px;height:32px;border-radius:50%;background:${primary}"></div>
        </div>
        <div style="background:${primary};border-radius:14px;padding:16px;margin-bottom:12px;position:relative;overflow:hidden">
          <div style="position:absolute;top:-10px;right:-10px;width:70px;height:70px;background:rgba(255,255,255,0.1);border-radius:50%"></div>
          <div style="font-size:0.62rem;color:rgba(255,255,255,0.7)">Balance</div>
          <div style="font-size:1.5rem;font-weight:700;color:#fff;margin:4px 0">$4,200.00</div>
          <div style="font-size:0.6rem;color:rgba(255,255,255,0.65)">↑ 12% this month</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:14px">
          ${['Send','Receive','Cards','More'].map(t=>`<div style="text-align:center"><div style="background:${surface};border-radius:10px;height:40px;display:flex;align-items:center;justify-content:center;font-size:1rem;margin-bottom:4px;border:1px solid rgba(0,0,0,0.05)">○</div><div style="font-size:0.55rem;color:${txt};opacity:0.6">${t}</div></div>`).join('')}
        </div>
        <div style="font-size:0.68rem;font-weight:600;color:${txt};margin-bottom:8px">Recent</div>
        ${[['Netflix','Subscription','−$15'],['Salary','Income','+$2,800']].map(([n,t,a])=>`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px;background:${surface};border-radius:8px;margin-bottom:6px;border:1px solid rgba(0,0,0,0.05)">
            <div style="display:flex;align-items:center;gap:8px"><div style="width:28px;height:28px;border-radius:8px;background:${secondary}22"></div><div><div style="font-size:0.68rem;font-weight:500;color:${txt}">${n}</div><div style="font-size:0.58rem;color:${txt};opacity:0.5">${t}</div></div></div>
            <div style="font-size:0.72rem;font-weight:600;color:${a.startsWith('+')?primary:'#ef4444'}">${a}</div>
          </div>`).join('')}
      </div>`,
    components:`
      <div style="background:${bg};font-family:'IBM Plex Sans',sans-serif;padding:18px;min-height:340px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div>
            <div style="font-size:0.6rem;font-weight:600;color:${txt};opacity:0.5;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Buttons</div>
            <div style="display:flex;flex-direction:column;gap:6px">
              <div style="background:${primary};color:#fff;padding:8px 14px;border-radius:6px;font-size:0.72rem;font-weight:500;text-align:center">Primary Button</div>
              <div style="border:2px solid ${primary};color:${primary};padding:7px 14px;border-radius:6px;font-size:0.72rem;text-align:center">Outline Button</div>
              <div style="background:${bg};color:${txt};padding:7px 14px;border-radius:6px;font-size:0.72rem;text-align:center;opacity:0.4">Disabled Button</div>
            </div>
          </div>
          <div>
            <div style="font-size:0.6rem;font-weight:600;color:${txt};opacity:0.5;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Badges</div>
            <div style="display:flex;flex-wrap:wrap;gap:5px">
              <span style="background:${primary}22;color:${primary};padding:3px 8px;border-radius:20px;font-size:0.6rem">Active</span>
              <span style="background:#10b98122;color:#059669;padding:3px 8px;border-radius:20px;font-size:0.6rem">Success</span>
              <span style="background:#ef444422;color:#dc2626;padding:3px 8px;border-radius:20px;font-size:0.6rem">Error</span>
              <span style="background:#f59e0b22;color:#d97706;padding:3px 8px;border-radius:20px;font-size:0.6rem">Warning</span>
            </div>
            <div style="margin-top:10px;font-size:0.6rem;font-weight:600;color:${txt};opacity:0.5;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Input</div>
            <div style="border:2px solid ${primary};border-radius:6px;padding:7px 10px;font-size:0.68rem;color:${txt};background:${surface}">Design token value…</div>
          </div>
          <div style="grid-column:1/-1">
            <div style="font-size:0.6rem;font-weight:600;color:${txt};opacity:0.5;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Color Tokens</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              ${palette.map((c,i)=>`<div style="text-align:center"><div style="width:36px;height:36px;border-radius:7px;background:${c};margin-bottom:3px;border:1px solid rgba(0,0,0,0.1)"></div><div style="font-size:0.48rem;font-family:monospace;color:${txt};opacity:0.5">${(TOKEN_NAMES[i]||'').replace('--color-','')}</div></div>`).join('')}
            </div>
          </div>
        </div>
      </div>`,
  };
  frame.innerHTML=templates[mockMode]||templates.dashboard;
}

function renderCompare(){
  if(!palette[0])return;
  const[h,s]=hexToHsl(palette[0]);
  const shades=Array.from({length:8},(_,i)=>hslToHex(h,s,8+i*11));
  document.getElementById('cmpRow').innerHTML=shades.map(c=>`
    <div class="cmp-box" onclick="navigator.clipboard.writeText('${c}');toast('Copied '+c)">
      <div class="cmp-top" style="background:${c}"></div>
      <div class="cmp-bot"><div class="cmp-hex">${c}</div><div class="cmp-info">${isLight(c)?'Light':'Dark'}</div></div>
    </div>`).join('');
}

function copyCSS(){const css=palette.map((c,i)=>`  ${TOKEN_NAMES[i]||'--c-'+(i+1)}: ${c};`).join('\n');navigator.clipboard.writeText(`:root {\n${css}\n}`);toast('CSS Variables copied')}
function copyTokens(){const obj={};palette.forEach((c,i)=>{obj[TOKEN_NAMES[i]?.replace('--color-','')||'c'+(i+1)]=c});navigator.clipboard.writeText(JSON.stringify(obj,null,2));toast('Tokens JSON copied')}
let savedCount=0;
function savePalette(){savedCount++;document.getElementById('tokenCount').textContent=savedCount;toast('Token set exported')}
let tTimer;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(tTimer);tTimer=setTimeout(()=>t.classList.remove('show'),2200)}

function init(){palette=['#4f46e5','#818cf8','#e0e7ff','#f9fafb','#1e1b4b'];locked=new Array(5).fill(false);generateSuggestions();renderPalette();renderMockup();renderCompare()}
init();;