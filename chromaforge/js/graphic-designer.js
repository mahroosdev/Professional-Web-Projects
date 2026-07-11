let palette=[], locked=[], currentSection='poster', currentMood='any', colorCount=3, scheme='free', mockMode='poster';

const BANKS={
  poster:[
    {name:'SCREAM',desc:'Concert poster',colors:['#0d0d0d','#ff2d55','#ffcc00']},
    {name:'MINIMAL',desc:'Swiss design',colors:['#ffffff','#1a1a1a','#ff0000']},
    {name:'NEON NIGHT',desc:'Cyberpunk',colors:['#0a0a1a','#ff00ff','#00ffff']},
    {name:'EARTH TONES',desc:'Natural poster',colors:['#3d2b1f','#c9a96e','#f5e6c8']},
    {name:'BAUHAUS',desc:'Classic geometric',colors:['#ffffff','#0000cc','#cc0000']},
  ],
  editorial:[
    {name:'VOGUE',desc:'Fashion editorial',colors:['#ffffff','#1a1a1a','#c9a96e']},
    {name:'BRUTALIST',desc:'Raw editorial',colors:['#f5f5f0','#0d0d0d','#ff3300']},
    {name:'LITERARY',desc:'Book magazine',colors:['#fef9f0','#2d2d2d','#8b1a1a']},
    {name:'TECH MAG',desc:'Digital editorial',colors:['#0a0a14','#00d4ff','#e0e8f0']},
    {name:'CULTURE',desc:'Arts magazine',colors:['#1a0a2e','#ff6b35','#f7e7ce']},
  ],
  flyer:[
    {name:'PARTY',desc:'Event flyer',colors:['#0d0d0d','#ff00aa','#ffff00']},
    {name:'SALE',desc:'Promo flyer',colors:['#ff0000','#ffffff','#ffcc00']},
    {name:'CALM INFO',desc:'Info flyer',colors:['#f0f7ff','#1a3a5c','#4a8fff']},
    {name:'HEALTH',desc:'Wellness flyer',colors:['#f0fff4','#1a5c2e','#5cb85c']},
    {name:'FOOD',desc:'Restaurant flyer',colors:['#1a0a00','#ff6b35','#f7e7ce']},
  ],
  'book-cover':[
    {name:'THRILLER',desc:'Dark mystery',colors:['#0a0a0a','#8b0000','#d4af37']},
    {name:'ROMANCE',desc:'Soft and warm',colors:['#fff0f3','#ff4d6d','#c9184a']},
    {name:'SCI-FI',desc:'Space future',colors:['#050a1a','#0080ff','#00d4ff']},
    {name:'LITERARY',desc:'Classic fiction',colors:['#f5f0e0','#1a1505','#8b6914']},
    {name:'FANTASY',desc:'Epic fantasy',colors:['#0a0515','#6a0dad','#d4af37']},
  ],
  packaging:[
    {name:'LUXURY BOX',desc:'Premium package',colors:['#0a0a0a','#d4af37','#f5f5f5']},
    {name:'ORGANIC',desc:'Natural product',colors:['#f5f0e0','#2d5a1b','#8b5e3c']},
    {name:'TECH PACK',desc:'Electronics',colors:['#1a1a2e','#0080ff','#e0e8f0']},
    {name:'FOOD PACK',desc:'Grocery product',colors:['#ffffff','#ff6b35','#1a1a1a']},
    {name:'COSMETICS',desc:'Beauty product',colors:['#f9f0f5','#c9184a','#2d1b2e']},
  ],
  infographic:[
    {name:'DATA BRIGHT',desc:'Information viz',colors:['#ffffff','#2563eb','#f59e0b','#ef4444']},
    {name:'DARK DATA',desc:'Dark infographic',colors:['#0f172a','#3b82f6','#10b981','#f59e0b']},
    {name:'PASTEL INFO',desc:'Soft data',colors:['#f8fafc','#93c5fd','#6ee7b7','#fde68a']},
    {name:'VIBRANT',desc:'Bold categories',colors:['#ffffff','#ff2d55','#5856d6','#ff9500']},
    {name:'EARTH',desc:'Geographic data',colors:['#f5f0e0','#2d5a1b','#8b5e3c','#1a3a5c']},
  ],
};

const SEC_LABELS={poster:'Poster Design',editorial:'Editorial',flyer:'Flyer',['book-cover']:'Book Cover',packaging:'Packaging',infographic:'Infographic'};
const ROLES=['Background','Primary','Accent','Secondary','Detail'];

function hexToRgb(h){h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function hexToHsl(h){let[r,g,b]=hexToRgb(h);r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let H,S,L=(mx+mn)/2;if(mx===mn){H=S=0}else{const d=mx-mn;S=L>0.5?d/(2-mx-mn):d/(mx+mn);switch(mx){case r:H=(g-b)/d+(g<b?6:0);break;case g:H=(b-r)/d+2;break;case b:H=(r-g)/d+4;break}H/=6}return[H*360,S*100,L*100]}
function hslToHex(h,s,l){h/=360;s/=100;l/=100;let r,g,b;if(s===0){r=g=b=l}else{const q=l<0.5?l*(1+s):l+s-l*s,p=2*l-q,hue2rgb=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p};r=hue2rgb(p,q,h+1/3);g=hue2rgb(p,q,h);b=hue2rgb(p,q,h-1/3)}return'#'+[r,g,b].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('')}
function isLight(h){const[r,g,b]=hexToRgb(h);return(r*299+g*587+b*114)/1000>128}
function randomHex(){return'#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0')}

function selectSection(btn){document.querySelectorAll('.sec-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');currentSection=btn.dataset.sec;document.getElementById('secLabel').textContent=SEC_LABELS[currentSection];generateSuggestions();renderMockup()}
function selectMood(btn){document.querySelectorAll('.chips .chip').forEach(b=>b.classList.remove('active'));btn.classList.add('active');currentMood=btn.dataset.mood}
function selCount(btn,n){document.querySelectorAll('.cnt-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');colorCount=n}
function selScheme(btn){document.querySelectorAll('.sch-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');scheme=btn.dataset.sch}
function switchMock(btn,m){document.querySelectorAll('.mock-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');mockMode=m;renderMockup()}

function generateSuggestions(){
  const bank=BANKS[currentSection]||BANKS.poster;
  document.getElementById('sugGrid').innerHTML=bank.map((p,i)=>`
    <div class="sug-card" onclick="applySuggestion(${i})" id="sug_${i}">
      <div class="sug-bar">${p.colors.map(c=>`<div class="sug-seg" style="background:${c}"></div>`).join('')}</div>
      <div class="sug-meta"><div class="sug-name">${p.name}</div><div class="sug-desc">${p.desc}</div></div>
    </div>`).join('');
  document.getElementById('sugTag').textContent=SEC_LABELS[currentSection].toUpperCase();
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
  renderAll();generateSuggestions();toast('PALETTE GENERATED');
}

function shufflePalette(){generatePalette()}
function genComp(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i%2===0?0:180))%360,s,30+i*8));locked=new Array(colorCount).fill(false);renderAll()}
function genAnalogous(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i-1)*22+360)%360,s,l));locked=new Array(colorCount).fill(false);renderAll()}
function genMono(){const[h,s]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex(h,s,8+i*(80/Math.max(colorCount-1,1))));locked=new Array(colorCount).fill(false);renderAll()}
function renderAll(){renderPalette();renderMockup();renderCompare()}

function renderPalette(){
  document.getElementById('palBar').innerHTML=palette.map((c,i)=>`<div class="pal-seg" style="background:${c}"><span class="pal-seg-lbl" style="color:${isLight(c)?'#000':'#fff'}">${c.toUpperCase()}</span></div>`).join('');
  document.getElementById('palSwatches').innerHTML=palette.map((c,i)=>`
    <div class="pal-item">
      <div class="pal-dot" style="background:${c}" onclick="document.getElementById('cp_${i}').click()">
        <input type="color" id="cp_${i}" value="${c}" oninput="updateColor(${i},this.value)" style="width:0;height:0;opacity:0;position:absolute">
      </div>
      <div>
        <input class="pal-hex" value="${c.toUpperCase()}" onchange="updateColor(${i},this.value)">
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
  const bg=palette[0],primary=palette[1]||'#ff2d55',accent=palette[2]||primary;
  const txt=isLight(bg)?'#0d0d0d':'#f0f0f0';
  const sec=palette[3]||accent;
  document.getElementById('mockSub').textContent=`${SEC_LABELS[currentSection]} — ${mockMode} preview`;

  const templates={
    poster:`
      <div style="background:${bg};font-family:'Anton',sans-serif;min-height:380px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
        <div style="position:absolute;top:0;left:0;width:50%;height:4px;background:${primary}"></div>
        <div style="position:absolute;bottom:0;right:0;width:50%;height:4px;background:${accent}"></div>
        <div style="position:absolute;top:20px;left:20px;width:80px;height:80px;border:4px solid ${primary};opacity:0.3;transform:rotate(15deg)"></div>
        <div style="position:absolute;bottom:20px;right:20px;width:60px;height:60px;background:${accent};opacity:0.2;border-radius:50%"></div>
        <div style="text-align:center;padding:40px;position:relative;z-index:1">
          <div style="font-size:0.6rem;letter-spacing:5px;color:${primary};text-transform:uppercase;margin-bottom:12px;font-family:'Barlow Condensed',sans-serif">— Presents —</div>
          <div style="font-size:clamp(2rem,6vw,4rem);line-height:0.85;color:${txt};text-transform:uppercase;letter-spacing:2px;margin-bottom:4px">THE BIG</div>
          <div style="font-size:clamp(2rem,6vw,4rem);line-height:0.85;color:${primary};text-transform:uppercase;letter-spacing:2px;margin-bottom:20px">DESIGN<br>EVENT</div>
          <div style="width:60px;height:3px;background:${accent};margin:16px auto"></div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:0.85rem;letter-spacing:3px;text-transform:uppercase;color:${txt};opacity:0.6">MARCH 15 · VENUE NAME · 8PM</div>
          <div style="margin-top:20px;background:${primary};color:${isLight(primary)?'#000':'#fff'};display:inline-block;padding:10px 28px;font-family:'Barlow Condensed',sans-serif;font-size:0.75rem;letter-spacing:3px;text-transform:uppercase">GET TICKETS</div>
        </div>
      </div>`,
    spread:`
      <div style="background:#0c0c0c;padding:12px;display:grid;grid-template-columns:1fr 1fr;gap:4px;min-height:360px">
        <div style="background:${bg};padding:24px;display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:0.6rem;letter-spacing:4px;text-transform:uppercase;color:${primary};margin-bottom:8px">CHAPTER ONE</div>
            <div style="font-family:'Anton',sans-serif;font-size:1.6rem;color:${isLight(bg)?'#0d0d0d':'#f0f0f0'};text-transform:uppercase;line-height:0.9;margin-bottom:14px">DESIGN<br>IS NOT</div>
          </div>
          <div style="width:40px;height:2px;background:${accent}"></div>
        </div>
        <div style="background:${primary};padding:24px;display:flex;flex-direction:column;justify-content:flex-end">
          <div style="font-family:'Anton',sans-serif;font-size:1.6rem;color:${isLight(primary)?'#0d0d0d':'#f0f0f0'};text-transform:uppercase;line-height:0.9;margin-bottom:14px">DECORATION</div>
          <div style="font-family:'Barlow',sans-serif;font-size:0.72rem;color:${isLight(primary)?'rgba(0,0,0,0.6)':'rgba(255,255,255,0.6)'};line-height:1.6">Visual communication that solves real problems and creates lasting impact.</div>
        </div>
      </div>`,
    strip:`
      <div style="background:#0c0c0c;padding:20px;min-height:360px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:0.6rem;letter-spacing:4px;text-transform:uppercase;color:#444;margin-bottom:12px">PALETTE COMPOSITION</div>
        <div style="display:flex;height:80px;margin-bottom:10px;gap:0">
          ${palette.map(c=>`<div style="flex:1;background:${c}"></div>`).join('')}
        </div>
        <div style="display:flex;height:40px;margin-bottom:20px;gap:2px">
          ${palette.map(c=>{const[h,s]=hexToHsl(c);return Array.from({length:5},(_,i)=>hslToHex(h,s,10+i*18)).map(shade=>`<div style="flex:1;background:${shade}"></div>`).join('')}).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(${palette.length},1fr);gap:8px">
          ${palette.map((c,i)=>`<div><div style="height:52px;background:${c};margin-bottom:5px"></div><div style="font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;letter-spacing:1px;color:#888;text-transform:uppercase">${ROLES[i]}</div><div style="font-family:'Barlow Condensed',sans-serif;font-size:0.7rem;color:#f0f0f0">${c.toUpperCase()}</div></div>`).join('')}
        </div>
      </div>`,
  };
  frame.innerHTML=templates[mockMode]||templates.poster;
}

function renderCompare(){
  if(!palette[0])return;
  const[h,s]=hexToHsl(palette[0]);
  const shades=Array.from({length:10},(_,i)=>hslToHex(h,s,5+i*9));
  document.getElementById('cmpRow').innerHTML=shades.map(c=>`
    <div class="cmp-box" onclick="navigator.clipboard.writeText('${c}');toast('${c.toUpperCase()} COPIED')">
      <div class="cmp-top" style="background:${c}"></div>
      <div class="cmp-bot"><div class="cmp-hex">${c.toUpperCase()}</div><div class="cmp-info">${isLight(c)?'LIGHT':'DARK'}</div></div>
    </div>`).join('');
}

function copyCSS(){const css=palette.map((c,i)=>`--color-${ROLES[i].toLowerCase()}: ${c};`).join('\n');navigator.clipboard.writeText(`:root { \n${css}\n}`);toast('CSS COPIED')}
function copyHex(){navigator.clipboard.writeText(palette.join(' / '));toast('HEX COPIED')}
function savePalette(){toast('PALETTE SAVED')}
let tTimer;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(tTimer);tTimer=setTimeout(()=>t.classList.remove('show'),2200)}

function init(){palette=['#0d0d0d','#ff2d55','#ffcc00'];locked=new Array(3).fill(false);generateSuggestions();renderPalette();renderMockup();renderCompare()}
init();;