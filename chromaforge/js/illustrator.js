let palette=[], locked=[], currentSection='character', currentMood='any', colorCount=5, scheme='free', mockMode='canvas';

const BANKS={
  character:[
    {name:'Fairy Tale',desc:'Whimsical characters',colors:['#a855f7','#ec4899','#fbbf24','#34d399','#f0e8ff']},
    {name:'Bold Heroes',desc:'Strong characters',colors:['#1e1b4b','#4f46e5','#f59e0b','#ef4444','#f8fafc']},
    {name:'Earthy Folk',desc:'Folk art style',colors:['#3d1c02','#c9602a','#e8a96a','#4a7c59','#f5e6d0']},
    {name:'Neon Pop',desc:'Urban characters',colors:['#0d0d0d','#ff00ff','#00ffff','#ffff00','#ff3300']},
    {name:'Soft Pastel',desc:'Gentle characters',colors:['#fce7f3','#fbcfe8','#ddd6fe','#bfdbfe','#d1fae5']},
  ],
  scene:[
    {name:'Golden Hour',desc:'Warm landscape',colors:['#0c1445','#1e4488','#ff7c1a','#ffc84a','#fff3cc']},
    {name:'Forest Night',desc:'Dark woodland',colors:['#051205','#0d3b12','#1a6b1e','#2eb82a','#a3d977']},
    {name:'Ocean Dawn',desc:'Coastal scene',colors:['#0a1628','#1a4a8c','#4a9eff','#b8d4ee','#f0f8ff']},
    {name:'Desert Dusk',desc:'Arid landscape',colors:['#2d1b00','#8b4513','#cd853f','#deb887','#fff8f0']},
    {name:'Neon City',desc:'Urban night scene',colors:['#0a0a14','#ff00aa','#00aaff','#aa00ff','#ffaa00']},
  ],
  abstract:[
    {name:'Deep Space',desc:'Cosmic abstract',colors:['#05051a','#1a0a3a','#4a1a8c','#9a4aff','#e0b0ff']},
    {name:'Fire & Ice',desc:'Contrast abstract',colors:['#0a2040','#1a6aff','#00d4ff','#ff4400','#ff9900']},
    {name:'Earth Core',desc:'Organic shapes',colors:['#2d1a0a','#8b4513','#cd9b3a','#90c060','#e8d4a0']},
    {name:'Acid Trip',desc:'Psychedelic',colors:['#ff00ff','#00ffff','#ffff00','#ff3300','#00ff66']},
    {name:'Minimal Geo',desc:'Geometric abstract',colors:['#1a1a2e','#e94560','#0f3460','#16213e','#e8e8e8']},
  ],
  floral:[
    {name:'Spring Garden',desc:'Fresh florals',colors:['#f0fff4','#86efac','#4ade80','#fbbf24','#f472b6']},
    {name:'Dark Bloom',desc:'Moody flowers',colors:['#1a0a2e','#7c3aed','#c084fc','#f9a8d4','#fef3c7']},
    {name:'Tropical',desc:'Bold botanicals',colors:['#0d2d1a','#0d9448','#48c774','#f9c74f','#f94144']},
    {name:'Dried Flowers',desc:'Muted botanical',colors:['#3d2b1f','#9b6b4a','#c4956a','#d4a96a','#f0e0c0']},
    {name:'Watercolor',desc:'Soft floral',colors:['#fff9f9','#ffd1d1','#ffb3b3','#ff8fab','#e63983']},
  ],
  'editorial-ill':[
    {name:'News & Views',desc:'Editorial style',colors:['#1a1a1a','#cc2200','#f5f5f0','#dddddd','#888888']},
    {name:'Magazine Bold',desc:'Feature article',colors:['#0d0d2a','#ff3366','#ffcc00','#00ccff','#f5f5f5']},
    {name:'Think Piece',desc:'Literary mood',colors:['#1a1505','#4a3800','#8b6914','#d4a017','#f5f0e0']},
    {name:'Satire',desc:'Satirical illo',colors:['#1a1a1a','#ff3300','#ffff00','#ffffff','#333333']},
    {name:'Long Form',desc:'Essay illustration',colors:['#faf9f6','#2d2010','#8b7355','#c9a96e','#4a3800']},
  ],
  children:[
    {name:'Playroom',desc:'Bright and fun',colors:['#ff6b6b','#ffd166','#06d6a0','#118ab2','#073b4c']},
    {name:'Fairyland',desc:'Magical kids',colors:['#ffe5ec','#ffb3c1','#ff4d6d','#c9184a','#590d22']},
    {name:'Adventure',desc:'Outdoor fun',colors:['#d4edda','#52b788','#2d6a4f','#f4a261','#e76f51']},
    {name:'Space Kids',desc:'Cosmic children',colors:['#03045e','#0077b6','#00b4d8','#90e0ef','#caf0f8']},
    {name:'Candy Land',desc:'Sweet and bright',colors:['#ff006e','#fb5607','#ffbe0b','#8338ec','#3a86ff']},
  ],
};

const SEC_LABELS={character:'Characters',scene:'Scenes',abstract:'Abstract',floral:'Floral',['editorial-ill']:'Editorial','children':"Children's"};
const ROLES=['Base','Mid-1','Mid-2','Accent','Highlight','Deep','Warm'];

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
  const bank=BANKS[currentSection]||BANKS.character;
  document.getElementById('sugGrid').innerHTML=bank.map((p,i)=>`
    <div class="sug-card" onclick="applySuggestion(${i})" id="sug_${i}">
      <div class="sug-bar">${p.colors.map(c=>`<div class="sug-seg" style="background:${c}"></div>`).join('')}</div>
      <div class="sug-meta"><div class="sug-name">${p.name}</div><div class="sug-desc">${p.desc}</div></div>
    </div>`).join('');
  document.getElementById('sugTag').textContent=SEC_LABELS[currentSection].toLowerCase();
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
  if(scheme==='analogous')gen=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i-2)*20+360)%360,s,l));
  else if(scheme==='comp')gen=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i%2===0?0:180))%360,s,30+i*8));
  else if(scheme==='triadic')gen=Array.from({length:colorCount},(_,i)=>hslToHex((h+i*120)%360,s,l));
  else if(scheme==='split')gen=Array.from({length:colorCount},(_,i)=>hslToHex((h+[0,150,210,30,180][i%5])%360,s,l));
  else gen=Array.from({length:colorCount},()=>randomHex());
  palette=palette.map((c,i)=>locked[i]?c:gen[i]||randomHex());
  while(palette.length<colorCount){palette.push(randomHex());locked.push(false)}
  palette=palette.slice(0,colorCount);
  renderAll();generateSuggestions();toast('New color story!');
}

function shufflePalette(){generatePalette()}
function genAnalogous(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i-2)*20+360)%360,s,l));locked=new Array(colorCount).fill(false);renderAll()}
function genTriadic(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+i*120)%360,s,l));locked=new Array(colorCount).fill(false);renderAll()}
function genSplit(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+[0,150,210,30,180,60,300][i%7])%360,s,l));locked=new Array(colorCount).fill(false);renderAll()}
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
        <div class="pal-role">${ROLES[i]||'Color '+(i+1)}</div>
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
  const c=palette;
  const bg=c[0]||'#0e0a14', m1=c[1]||'#a855f7', m2=c[2]||'#ec4899', acc=c[3]||'#fbbf24', hi=c[4]||'#f0e8ff';
  document.getElementById('mockSub').textContent=`${SEC_LABELS[currentSection]} — ${mockMode} preview`;

  const templates={
    canvas:`
      <div style="background:${bg};min-height:370px;display:flex;align-items:center;justify-content:center;padding:28px;position:relative;overflow:hidden">
        <svg width="100%" height="320" viewBox="0 0 600 320" style="max-width:600px">
          <circle cx="160" cy="120" r="80" fill="${m1}" opacity="0.8"/>
          <circle cx="300" cy="80" r="55" fill="${acc}" opacity="0.75"/>
          <ellipse cx="440" cy="140" rx="90" ry="65" fill="${m2}" opacity="0.75"/>
          <rect x="80" y="200" width="100" height="80" rx="12" fill="${hi}" opacity="0.6"/>
          <polygon points="310,180 380,280 240,280" fill="${acc}" opacity="0.65"/>
          <circle cx="520" cy="240" r="45" fill="${m1}" opacity="0.5"/>
          <rect x="180" y="220" width="140" height="70" rx="8" fill="${m2}" opacity="0.45"/>
          ${c.slice(0,colorCount).map((col,i)=>`<circle cx="${80+i*90}" cy="${280}" r="14" fill="${col}"/>`).join('')}
        </svg>
      </div>`,
    'palette-story':`
      <div style="background:#0e0a14;min-height:370px;padding:28px;font-family:'Instrument Sans',sans-serif">
        <div style="font-family:'Fraunces',serif;font-style:italic;font-size:1.2rem;color:${hi};margin-bottom:20px">Color Story</div>
        <div style="display:flex;height:120px;border-radius:12px;overflow:hidden;margin-bottom:20px">
          ${palette.map(col=>`<div style="flex:1;background:${col}"></div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:12px">
          ${palette.map((col,i)=>{
            const[h,s,l]=hexToHsl(col);
            const lighter=hslToHex(h,s,Math.min(90,l+20));
            const darker=hslToHex(h,s,Math.max(5,l-20));
            return`<div style="text-align:center">
              <div style="display:flex;flex-direction:column;border-radius:8px;overflow:hidden;margin-bottom:6px">
                <div style="height:20px;background:${lighter}"></div>
                <div style="height:32px;background:${col}"></div>
                <div style="height:20px;background:${darker}"></div>
              </div>
              <div style="font-family:'Courier Prime',monospace;font-size:0.55rem;color:${hi};opacity:0.6">${ROLES[i]||'C'+(i+1)}</div>
            </div>`}).join('')}
        </div>
      </div>`,
    swatches:`
      <div style="background:${isLight(bg)?'#f5f5f5':'#1a1a2e'};min-height:370px;padding:24px;font-family:'Instrument Sans',sans-serif">
        <div style="font-family:'Fraunces',serif;font-style:italic;font-size:0.9rem;color:${isLight(bg)?'#1a1a1a':'#f0e8ff'};margin-bottom:18px;opacity:0.6">Swatch Board — ${SEC_LABELS[currentSection]}</div>
        <div style="display:grid;grid-template-columns:repeat(${Math.min(palette.length,5)},1fr);gap:8px">
          ${palette.map((col,i)=>`
            <div>
              <div style="height:80px;background:${col};border-radius:8px;margin-bottom:6px;box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
              <div style="font-family:'Courier Prime',monospace;font-size:0.6rem;color:${isLight(bg)?'#1a1a1a':'#f0e8ff'}">${col}</div>
              <div style="font-size:0.56rem;color:${isLight(bg)?'rgba(0,0,0,0.45)':'rgba(255,255,255,0.4)'}">${ROLES[i]||'C'+(i+1)}</div>
            </div>`).join('')}
        </div>
        <div style="margin-top:20px;height:32px;border-radius:8px;overflow:hidden;display:flex">
          ${palette.map(c=>`<div style="flex:1;background:${c}"></div>`).join('')}
        </div>
      </div>`,
  };
  frame.innerHTML=templates[mockMode]||templates.canvas;
}

function renderCompare(){
  if(!palette[0])return;
  const[h,s]=hexToHsl(palette[0]);
  const shades=Array.from({length:8},(_,i)=>hslToHex(h,s,8+i*11));
  document.getElementById('cmpRow').innerHTML=shades.map(c=>`
    <div class="cmp-box" onclick="navigator.clipboard.writeText('${c}');toast('Copied!')">
      <div class="cmp-top" style="background:${c}"></div>
      <div class="cmp-bot"><div class="cmp-hex">${c}</div><div class="cmp-info">${isLight(c)?'Lt':'Dk'}</div></div>
    </div>`).join('');
}

function copyCSS(){const css=palette.map((c,i)=>`  --ill-${ROLES[i].toLowerCase()}: ${c};`).join('\n');navigator.clipboard.writeText(`:root {\n${css}\n}`);toast('CSS copied!')}
function copyHex(){navigator.clipboard.writeText(palette.join(', '));toast('HEX copied!')}
function savePalette(){toast('Color story saved!')}
let tTimer;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(tTimer);tTimer=setTimeout(()=>t.classList.remove('show'),2200)}

function init(){palette=['#a855f7','#ec4899','#fbbf24','#34d399','#f0e8ff'];locked=new Array(5).fill(false);generateSuggestions();renderPalette();renderMockup();renderCompare()}
init();;