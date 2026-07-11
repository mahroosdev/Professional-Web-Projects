let palette=[], locked=[], currentSection='identity', currentMood='any', colorCount=4, scheme='free', mockMode='identity';

const BANKS={
  identity:[
    {name:'Amber Heritage',desc:'Timeless brand',colors:['#1c1410','#ff9a44','#ffd166','#f5e6d0']},
    {name:'Navy & Gold',desc:'Premium identity',colors:['#0e2240','#c9a84c','#f5f0e0','#e8dcc8']},
    {name:'Forest Fresh',desc:'Organic brand',colors:['#1a3d1a','#5a9e5a','#c8e6c9','#f5f0e8']},
    {name:'Bold Red',desc:'Powerful brand',colors:['#1a0a0a','#cc2200','#ff6644','#faf0ec']},
    {name:'Violet Studio',desc:'Creative agency',colors:['#1a0a2e','#7c3aed','#c4b5fd','#f5f3ff']},
  ],
  'style-guide':[
    {name:'Clean System',desc:'Modern style guide',colors:['#0f172a','#3b82f6','#e2e8f0','#f8fafc']},
    {name:'Warm Manual',desc:'Human style guide',colors:['#1c1410','#ff9a44','#f5e6d0','#ffffff']},
    {name:'Bold Guide',desc:'Impact-driven',colors:['#0d0d0d','#ff3300','#ffcc00','#f5f5f0']},
    {name:'Pastel System',desc:'Soft brand guide',colors:['#2d2d2d','#ff9ecf','#b0e0e6','#f5f5f5']},
    {name:'Earth Manual',desc:'Natural identity',colors:['#2d2010','#8b5e3c','#c9a96e','#f5f0e0']},
  ],
  stationery:[
    {name:'Executive',desc:'Formal stationery',colors:['#0e2240','#c9a84c','#f5f0e0','#ffffff']},
    {name:'Creative Studio',desc:'Agency stationery',colors:['#0d0d0d','#ff3300','#f5f5f0','#ffffff']},
    {name:'Modern Clean',desc:'Minimal stationery',colors:['#1a1a2e','#4a9eff','#e8f4fc','#ffffff']},
    {name:'Luxe Paper',desc:'Premium stationery',colors:['#1a1a16','#c9920a','#f5f0e8','#fafaf8']},
    {name:'Warm Office',desc:'Approachable brand',colors:['#2d1b00','#ff9a44','#fff3e0','#ffffff']},
  ],
  packaging:[
    {name:'Premium Dark',desc:'Luxury packaging',colors:['#0a0a0a','#d4af37','#f5f0e0','#ffffff']},
    {name:'Fresh Natural',desc:'Organic packaging',colors:['#1a3d1a','#5a9e5a','#f0fff4','#ffffff']},
    {name:'Bold Consumer',desc:'Mass market',colors:['#cc0000','#ffcc00','#1a1a1a','#ffffff']},
    {name:'Pastel Beauty',desc:'Cosmetic packaging',colors:['#fdf0f8','#e07aaa','#c9184a','#ffffff']},
    {name:'Tech Product',desc:'Electronics pack',colors:['#1a1a2e','#4a9eff','#e0e8f0','#ffffff']},
  ],
  'social-brand':[
    {name:'Vibrant Social',desc:'High engagement',colors:['#ff2d55','#ff9500','#ffcc00','#30d158']},
    {name:'Calm Feed',desc:'Lifestyle brand',colors:['#f5f0e8','#8b7355','#c9a96e','#2d2010']},
    {name:'Dark Presence',desc:'Premium social',colors:['#0a0a0a','#ff9a44','#1a1a1a','#f5f5f5']},
    {name:'Pastel Brand',desc:'Soft social',colors:['#fff0f5','#ffb3c6','#ff4d6d','#c9184a']},
    {name:'Bold Campaign',desc:'Performance brand',colors:['#1a1a2e','#4a9eff','#00d4ff','#f0f9ff']},
  ],
  signage:[
    {name:'High Visibility',desc:'Bold signage',colors:['#0d0d0d','#ffcc00','#ff3300','#ffffff']},
    {name:'Premium Retail',desc:'Store signage',colors:['#1a1a16','#c9920a','#f5f0e8','#ffffff']},
    {name:'Wayfinding',desc:'Navigation system',colors:['#0e2240','#4a9eff','#f0f7ff','#ffffff']},
    {name:'Event Signage',desc:'Venue branding',colors:['#1a0a2e','#7c3aed','#c4b5fd','#ffffff']},
    {name:'Outdoor Ad',desc:'Billboard & OOH',colors:['#cc0000','#1a1a1a','#ffffff','#ffcc00']},
  ],
};

const SEC_LABELS={identity:'Full Identity System','style-guide':'Style Guide',stationery:'Stationery',packaging:'Packaging','social-brand':'Social Presence',signage:'Signage & OOH'};
const ROLES=['Primary','Secondary','Tertiary','Neutral','Light','Support'];

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
  const bank=BANKS[currentSection]||BANKS.identity;
  document.getElementById('sugGrid').innerHTML=bank.map((p,i)=>`
    <div class="sug-card" onclick="applySuggestion(${i})" id="sug_${i}">
      <div class="sug-bar">${p.colors.map(c=>`<div class="sug-seg" style="background:${c}"></div>`).join('')}</div>
      <div class="sug-meta"><div class="sug-name">${p.name}</div><div class="sug-desc">${p.desc}</div></div>
    </div>`).join('');
  document.getElementById('sugTag').textContent=SEC_LABELS[currentSection].split(' ')[0].toLowerCase();
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
  else if(scheme==='comp')gen=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i%2===0?0:180))%360,s,25+i*10));
  else if(scheme==='analogous')gen=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i-1)*20+360)%360,s,l));
  else if(scheme==='triadic')gen=Array.from({length:colorCount},(_,i)=>hslToHex((h+i*120)%360,s,l));
  else gen=Array.from({length:colorCount},()=>randomHex());
  palette=palette.map((c,i)=>locked[i]?c:gen[i]||randomHex());
  while(palette.length<colorCount){palette.push(randomHex());locked.push(false)}
  palette=palette.slice(0,colorCount);
  renderAll();generateSuggestions();toast('Brand colors generated');
}

function shufflePalette(){generatePalette()}
function genComp(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i%2===0?0:180))%360,s,25+i*10));locked=new Array(colorCount).fill(false);renderAll()}
function genAnalogous(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i-1)*18+360)%360,s,l));locked=new Array(colorCount).fill(false);renderAll()}
function genMono(){const[h,s]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex(h,s,8+i*(80/Math.max(colorCount-1,1))));locked=new Array(colorCount).fill(false);renderAll()}
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
  const p=palette[0],s=palette[1]||p,t=palette[2]||s,n=palette[3]||'#f5f0e8';
  const onP=isLight(p)?'#1a1a16':'#f5e6d0';
  const onN=isLight(n)?'#1a1a16':'#f5e6d0';
  document.getElementById('mockSub').textContent=`${SEC_LABELS[currentSection]} — ${mockMode} view`;

  const templates={
    identity:`
      <div style="background:${n};font-family:'Nunito',sans-serif;min-height:360px;padding:28px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid rgba(0,0,0,0.08)">
          <div style="width:52px;height:52px;background:${p};border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;color:${onP}">B</div>
          <div>
            <div style="font-family:'Playfair Display',serif;font-size:1.2rem;color:${onN}">BrandName</div>
            <div style="font-size:0.65rem;color:${onN};opacity:0.5;margin-top:1px;font-family:'Fira Code',monospace">Brand Identity System</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px">
          ${palette.map((c,i)=>`
            <div>
              <div style="height:60px;background:${c};border-radius:8px;margin-bottom:5px;border:1px solid rgba(0,0,0,0.06)"></div>
              <div style="font-size:0.62rem;font-weight:700;color:${onN}">${ROLES[i]||'Color'+(i+1)}</div>
              <div style="font-family:'Fira Code',monospace;font-size:0.55rem;color:${onN};opacity:0.5">${c}</div>
            </div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px">
          <div style="background:${p};border-radius:10px;padding:16px">
            <div style="font-family:'Playfair Display',serif;font-size:1rem;color:${onP};margin-bottom:6px">Where brands come alive</div>
            <div style="font-size:0.68rem;color:${onP};opacity:0.7;line-height:1.6">A complete identity system that speaks with clarity, purpose, and distinction.</div>
            <div style="margin-top:12px;background:${n};color:${onN};display:inline-block;padding:7px 16px;border-radius:5px;font-size:0.68rem;font-weight:700">Learn More</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${[s,t].map(c=>`<div style="flex:1;background:${c};border-radius:8px;border:1px solid rgba(0,0,0,0.06)"></div>`).join('')}
          </div>
        </div>
      </div>`,
    collateral:`
      <div style="background:#e0dbd4;padding:20px;font-family:'Nunito',sans-serif;min-height:360px;display:flex;gap:16px;align-items:center;justify-content:center;flex-wrap:wrap">
        <div style="background:${p};border-radius:10px;width:240px;height:140px;padding:18px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 8px 28px rgba(0,0,0,0.25)">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:28px;height:28px;background:${n};border-radius:7px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-weight:700;color:${p};font-size:0.85rem">B</div>
            <div style="font-family:'Playfair Display',serif;font-size:0.9rem;color:${onP}">BrandName</div>
          </div>
          <div><div style="font-size:0.72rem;font-weight:700;color:${onP}">Sarah Miller</div><div style="font-size:0.6rem;color:${onP};opacity:0.7">Brand Strategist</div><div style="font-size:0.6rem;color:${onP};opacity:0.55;margin-top:3px">sarah@brandname.com</div></div>
        </div>
        <div style="background:${n};border-radius:10px;width:200px;padding:16px;box-shadow:0 8px 28px rgba(0,0,0,0.15);border:1px solid rgba(0,0,0,0.06)">
          <div style="font-family:'Playfair Display',serif;font-size:0.7rem;font-style:italic;color:${onN};opacity:0.5;margin-bottom:10px">Newsletter</div>
          <div style="font-family:'Playfair Display',serif;font-size:0.9rem;color:${onN};margin-bottom:8px">Brand Insights</div>
          <div style="height:3px;background:${p};border-radius:2px;margin-bottom:8px"></div>
          <div style="font-size:0.65rem;color:${onN};opacity:0.65;line-height:1.5">Monthly ideas on brand strategy and visual identity.</div>
          <div style="margin-top:10px;background:${p};color:${onP};text-align:center;padding:6px;border-radius:5px;font-size:0.65rem;font-weight:700">Subscribe</div>
        </div>
      </div>`,
    system:`
      <div style="background:${n};font-family:'Nunito',sans-serif;padding:22px;min-height:360px">
        <div style="font-family:'Fira Code',monospace;font-size:0.58rem;color:${onN};opacity:0.4;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px">Color System</div>
        <div style="display:flex;gap:0;border-radius:10px;overflow:hidden;height:56px;margin-bottom:16px;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
          ${palette.map(c=>`<div style="flex:1;background:${c}"></div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(${palette.length},1fr);gap:10px">
          ${palette.map((c,i)=>{const[h,s]=hexToHsl(c);const shades=Array.from({length:4},(_,j)=>hslToHex(h,s,15+j*22));return`
            <div>
              <div style="font-size:0.58rem;font-family:'Fira Code',monospace;color:${onN};opacity:0.45;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">${ROLES[i]}</div>
              ${shades.map(shade=>`<div style="height:22px;background:${shade};margin-bottom:2px;border-radius:3px"></div>`).join('')}
              <div style="font-family:'Fira Code',monospace;font-size:0.52rem;color:${onN};opacity:0.5;margin-top:4px">${c}</div>
            </div>`}).join('')}
        </div>
      </div>`,
  };
  frame.innerHTML=templates[mockMode]||templates.identity;
}

function renderCompare(){
  if(!palette[0])return;
  const[h,s]=hexToHsl(palette[0]);
  const shades=Array.from({length:9},(_,i)=>hslToHex(h,s,8+i*10));
  document.getElementById('cmpRow').innerHTML=shades.map(c=>`
    <div class="cmp-box" onclick="navigator.clipboard.writeText('${c}');toast('Copied '+c)">
      <div class="cmp-top" style="background:${c}"></div>
      <div class="cmp-bot"><div class="cmp-hex">${c}</div><div class="cmp-info">${isLight(c)?'Lt':'Dk'}</div></div>
    </div>`).join('');
}

function copyCSS(){const css=palette.map((c,i)=>`  --brand-${ROLES[i].toLowerCase()}: ${c};`).join('\n');navigator.clipboard.writeText(`:root {\n${css}\n}`);toast('CSS variables copied')}
function copyHex(){navigator.clipboard.writeText(palette.join(', '));toast('HEX values copied')}
function savePalette(){toast('Brand kit exported')}
let tTimer;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(tTimer);tTimer=setTimeout(()=>t.classList.remove('show'),2200)}

function init(){palette=['#1c1410','#ff9a44','#ffd166','#f5e6d0'];locked=new Array(4).fill(false);generateSuggestions();renderPalette();renderMockup();renderCompare()}
init();;