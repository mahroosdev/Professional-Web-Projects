let palette=[], locked=[], currentSection='logomark', currentMood='any', colorCount=2, scheme='free', mockMode='mark';

const BANKS={
  logomark:[
    {name:'Gold & Dark',desc:'Premium mark',colors:['#1a1a16','#c9920a']},
    {name:'Clean Blue',desc:'Tech logomark',colors:['#0066cc','#f0f7ff']},
    {name:'Organic Green',desc:'Nature brand',colors:['#1a3d1a','#5a9e5a']},
    {name:'Bold Red',desc:'Strong identity',colors:['#cc0000','#1a1a1a']},
    {name:'Violet & Sand',desc:'Creative studio',colors:['#5c2d91','#f5f0e8']},
  ],
  wordmark:[
    {name:'Classic Black',desc:'Timeless wordmark',colors:['#0d0d0d','#f5f5f0']},
    {name:'Navy Blue',desc:'Professional',colors:['#1a2d5a','#ffffff']},
    {name:'Warm Gold',desc:'Luxury brand',colors:['#c9920a','#1a1a16']},
    {name:'Forest',desc:'Organic brand',colors:['#2d5a1b','#f5f0e0']},
    {name:'Charcoal Rose',desc:'Lifestyle brand',colors:['#2d2828','#e8a598']},
  ],
  monogram:[
    {name:'Gold Monogram',desc:'Heritage feel',colors:['#d4af37','#1a1a16']},
    {name:'Navy & Cream',desc:'Preppy classic',colors:['#1a2d5a','#f5f0e0']},
    {name:'Black & White',desc:'Pure minimal',colors:['#0d0d0d','#fafaf8']},
    {name:'Copper',desc:'Artisan craft',colors:['#b87333','#2d2420']},
    {name:'Emerald',desc:'Exclusive brand',colors:['#1a4a2e','#d4c9a0']},
  ],
  emblem:[
    {name:'Heritage Blue',desc:'Classic emblem',colors:['#1a2d5a','#c9920a','#fafaf8']},
    {name:'Dark & Gold',desc:'Premium crest',colors:['#0d0d0d','#d4af37','#f5f0e0']},
    {name:'Shield Green',desc:'Trust & growth',colors:['#1a3d1a','#c9920a','#ffffff']},
    {name:'Royal Red',desc:'Bold crest',colors:['#8b0000','#1a1a1a','#f5f0e0']},
    {name:'Maritime',desc:'Nautical emblem',colors:['#0e2240','#ffffff','#c9920a']},
  ],
  'icon-set':[
    {name:'Blue System',desc:'UI icon set',colors:['#1a73e8','#e8f0fe']},
    {name:'Duotone',desc:'Creative icons',colors:['#5c2d91','#f0e6ff']},
    {name:'Mono Dark',desc:'Clean icon set',colors:['#1a1a1a','#f5f5f5']},
    {name:'Warm Duo',desc:'Friendly icons',colors:['#e06030','#fff4f0']},
    {name:'Green System',desc:'Eco & health',colors:['#1a5c2e','#e8f5ed']},
  ],
};

const SEC_LABELS={logomark:'Logomark',wordmark:'Wordmark',monogram:'Monogram',emblem:'Emblem',['icon-set']:'Icon Set'};
const ROLES=['Mark Color','Background','Accent','Support'];

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
  const bank=BANKS[currentSection]||BANKS.logomark;
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
  if(scheme==='mono')gen=Array.from({length:colorCount},(_,i)=>hslToHex(h,s,10+i*(75/Math.max(colorCount-1,1))));
  else if(scheme==='comp')gen=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i%2===0?0:180))%360,s,35+i*5));
  else gen=Array.from({length:colorCount},()=>randomHex());
  palette=palette.map((c,i)=>locked[i]?c:gen[i]||randomHex());
  while(palette.length<colorCount){palette.push(randomHex());locked.push(false)}
  palette=palette.slice(0,colorCount);
  renderAll();generateSuggestions();toast('New palette generated');
}

function shufflePalette(){generatePalette()}
function genComp(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i%2===0?0:180))%360,s,35+i*10));locked=new Array(colorCount).fill(false);renderAll()}
function genMono(){const[h,s]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex(h,s,10+i*(75/Math.max(colorCount-1,1))));locked=new Array(colorCount).fill(false);renderAll()}
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
function removeColor(i){if(palette.length>1){palette.splice(i,1);locked.splice(i,1);renderAll()}}

function renderMockup(){
  const frame=document.getElementById('mockFrame');
  if(!palette.length)return;
  const mark=palette[0], bg=palette[1]||'#fafaf8', accent=palette[2]||mark;
  const onMark=isLight(mark)?'#0d0d0d':'#fff';
  const onBg=isLight(bg)?'#0d0d0d':'#f0f0f0';
  document.getElementById('mockSub').textContent=`${SEC_LABELS[currentSection]} — ${mockMode} preview`;

  const templates={
    mark:`
      <div style="background:${bg};font-family:'DM Sans',sans-serif;min-height:340px;display:flex;align-items:center;justify-content:center;gap:60px;padding:40px;flex-wrap:wrap">
        <div style="text-align:center">
          <div style="font-size:0.6rem;font-family:'DM Mono',monospace;color:${onBg};opacity:0.4;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px">On Light</div>
          <div style="background:${bg};border:1px solid rgba(0,0,0,0.08);border-radius:12px;padding:32px 40px;display:inline-flex;align-items:center;gap:12px">
            <div style="width:48px;height:48px;background:${mark};border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.2rem;font-family:'DM Serif Display',serif;color:${onMark}">A</div>
            <div style="font-family:'DM Serif Display',serif;font-size:1.3rem;color:${onBg}">BrandName</div>
          </div>
        </div>
        <div style="text-align:center">
          <div style="font-size:0.6rem;font-family:'DM Mono',monospace;color:${onBg};opacity:0.4;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px">On Dark</div>
          <div style="background:${mark};border-radius:12px;padding:32px 40px;display:inline-flex;align-items:center;gap:12px">
            <div style="width:48px;height:48px;background:${bg};border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.2rem;font-family:'DM Serif Display',serif;color:${mark}">A</div>
            <div style="font-family:'DM Serif Display',serif;font-size:1.3rem;color:${onMark}">BrandName</div>
          </div>
        </div>
      </div>`,
    card:`
      <div style="background:#e8e5dd;font-family:'DM Sans',sans-serif;min-height:340px;display:flex;align-items:center;justify-content:center;gap:20px;padding:30px;flex-wrap:wrap">
        <div>
          <div style="font-size:0.58rem;font-family:'DM Mono',monospace;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px">Front</div>
          <div style="background:${mark};border-radius:10px;width:260px;height:150px;padding:20px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 8px 32px rgba(0,0,0,0.2)">
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:32px;height:32px;background:${bg};border-radius:7px;display:flex;align-items:center;justify-content:center;font-family:'DM Serif Display',serif;font-size:0.9rem;color:${mark}">A</div>
              <div style="font-family:'DM Serif Display',serif;font-size:0.95rem;color:${onMark}">BrandName</div>
            </div>
            <div><div style="font-size:0.72rem;font-weight:500;color:${onMark}">Jane Doe</div><div style="font-size:0.62rem;color:${onMark};opacity:0.65">Creative Director</div></div>
          </div>
        </div>
        <div>
          <div style="font-size:0.58rem;font-family:'DM Mono',monospace;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px">Back</div>
          <div style="background:${bg};border:1px solid rgba(0,0,0,0.1);border-radius:10px;width:260px;height:150px;padding:20px;display:flex;flex-direction:column;justify-content:flex-end;box-shadow:0 8px 32px rgba(0,0,0,0.1)">
            <div style="font-size:0.65rem;color:${onBg};opacity:0.6">jane@brandname.com</div>
            <div style="font-size:0.65rem;color:${onBg};opacity:0.6">+1 (555) 000 0000</div>
            <div style="font-size:0.65rem;color:${onBg};opacity:0.6">brandname.com</div>
          </div>
        </div>
      </div>`,
    brand:`
      <div style="background:${bg};font-family:'DM Sans',sans-serif;min-height:340px;padding:24px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
          <div>
            <div style="font-size:0.58rem;font-family:'DM Mono',monospace;color:${onBg};opacity:0.4;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Primary</div>
            <div style="height:52px;background:${mark};border-radius:6px;margin-bottom:4px"></div>
            <div style="font-family:'DM Mono',monospace;font-size:0.62rem;color:${onBg}">${mark}</div>
          </div>
          <div>
            <div style="font-size:0.58rem;font-family:'DM Mono',monospace;color:${onBg};opacity:0.4;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Background</div>
            <div style="height:52px;background:${palette[1]||'#f5f0e8'};border:1px solid rgba(0,0,0,0.08);border-radius:6px;margin-bottom:4px"></div>
            <div style="font-family:'DM Mono',monospace;font-size:0.62rem;color:${onBg}">${palette[1]||'#f5f0e8'}</div>
          </div>
        </div>
        <div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:16px;margin-bottom:12px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <div style="width:36px;height:36px;background:${mark};border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'DM Serif Display',serif;font-size:1rem;color:${onMark}">A</div>
            <div style="font-family:'DM Serif Display',serif;font-size:1.1rem;color:${onBg}">BrandName</div>
          </div>
          <div style="font-family:'DM Serif Display',serif;font-size:0.8rem;color:${onBg};opacity:0.7;font-style:italic">Crafted with intention, built to last</div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${palette.map((c,i)=>`<div style="display:flex;align-items:center;gap:5px"><div style="width:16px;height:16px;background:${c};border-radius:3px;border:1px solid rgba(0,0,0,0.1)"></div><span style="font-family:'DM Mono',monospace;font-size:0.58rem;color:${onBg};opacity:0.6">${ROLES[i]}</span></div>`).join('')}
        </div>
      </div>`,
  };
  frame.innerHTML=templates[mockMode]||templates.mark;
}

function renderCompare(){
  if(!palette[0])return;
  const[h,s]=hexToHsl(palette[0]);
  const shades=Array.from({length:9},(_,i)=>hslToHex(h,s,8+i*10));
  document.getElementById('cmpRow').innerHTML=shades.map(c=>`
    <div class="cmp-box" onclick="navigator.clipboard.writeText('${c}');toast('Copied')">
      <div class="cmp-top" style="background:${c}"></div>
      <div class="cmp-bot"><div class="cmp-hex">${c}</div><div class="cmp-info">${isLight(c)?'Lt':'Dk'}</div></div>
    </div>`).join('');
}

function copyCSS(){const css=palette.map((c,i)=>`  --logo-${ROLES[i].toLowerCase().replace(' ','-')}:${c};`).join('\n');navigator.clipboard.writeText(`:root {\n${css}\n}`);toast('CSS copied')}
function copyHex(){navigator.clipboard.writeText(palette.join(' / '));toast('HEX copied')}
function savePalette(){toast('Color pair saved')}
let tTimer;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(tTimer);tTimer=setTimeout(()=>t.classList.remove('show'),2200)}

function init(){palette=['#1a1a16','#c9920a'];locked=[false,false];generateSuggestions();renderPalette();renderMockup();renderCompare()}
init();;