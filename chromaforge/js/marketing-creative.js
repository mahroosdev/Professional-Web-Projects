let palette=[], locked=[], currentSection='social-post', currentMood='any', colorCount=3, scheme='free', mockMode='primary';

const BANKS={
  'social-post':[
    {name:'FIRE SALE',desc:'High urgency post',colors:['#ff2200','#ffcc00','#1a1a1a']},
    {name:'GROWTH',desc:'Business growth',colors:['#0f172a','#10b981','#f0fdf4']},
    {name:'LIFESTYLE',desc:'Aspirational brand',colors:['#fef9f0','#c9920a','#1c1410']},
    {name:'TECH LAUNCH',desc:'Product reveal',colors:['#050a14','#00d4ff','#e0f0ff']},
    {name:'POP COLOR',desc:'Bold engagement',colors:['#ff006e','#ffbe0b','#3a86ff']},
  ],
  'ad-banner':[
    {name:'CONVERSION',desc:'High CTR banner',colors:['#ff3300','#ffcc00','#ffffff']},
    {name:'LUXURY AD',desc:'Premium display',colors:['#0a0a0a','#d4af37','#f5f0e0']},
    {name:'TECH AD',desc:'SaaS banner',colors:['#0f172a','#6366f1','#e0e7ff']},
    {name:'RETAIL AD',desc:'E-commerce CTA',colors:['#cc0000','#1a1a1a','#ffffff']},
    {name:'AWARENESS',desc:'Brand awareness',colors:['#1a3d5a','#4a9eff','#f0f7ff']},
  ],
  email:[
    {name:'NEWSLETTER',desc:'Clean newsletter',colors:['#f8fafc','#1a1a2e','#4f46e5']},
    {name:'PROMO EMAIL',desc:'Sales email',colors:['#fff9f0','#ff6b00','#1a0f00']},
    {name:'ONBOARDING',desc:'Welcome email',colors:['#f0fdf4','#059669','#064e3b']},
    {name:'TRANSACT',desc:'Transactional',colors:['#ffffff','#1a1a1a','#3b82f6']},
    {name:'DIGEST',desc:'Weekly digest',colors:['#fef9f0','#8b5e3c','#1c1410']},
  ],
  'landing-ad':[
    {name:'LAUNCH',desc:'Product launch',colors:['#0a0a0a','#ff6b00','#ffcc00']},
    {name:'LEAD GEN',desc:'Lead capture',colors:['#f0f7ff','#1d4ed8','#1e3a8a']},
    {name:'SAAS CTA',desc:'Free trial CTA',colors:['#0f172a','#6366f1','#f5f3ff']},
    {name:'ECOMM',desc:'E-commerce push',colors:['#fff9f0','#cc0000','#1a0f00']},
    {name:'EVENT',desc:'Event registration',colors:['#1a0a2e','#7c3aed','#ffd166']},
  ],
  outdoor:[
    {name:'MEGA IMPACT',desc:'Billboard',colors:['#0d0d0d','#ff3300','#ffffff']},
    {name:'TRANSIT AD',desc:'Metro/bus ad',colors:['#1a2d5a','#ffd100','#ffffff']},
    {name:'RETAIL OOH',desc:'Store exterior',colors:['#0a0a0a','#d4af37','#f5f0e0']},
    {name:'AWARENESS',desc:'Brand outdoor',colors:['#0e2240','#4a9eff','#ffffff']},
    {name:'CAMPAIGN',desc:'City campaign',colors:['#cc0000','#ffcc00','#1a1a1a']},
  ],
  presentation:[
    {name:'INVESTOR',desc:'Pitch deck',colors:['#0f172a','#3b82f6','#f8fafc']},
    {name:'SALES DECK',desc:'Sales presentation',colors:['#1a0f00','#ff6b00','#fff9f0']},
    {name:'BRAND PRES',desc:'Brand presentation',colors:['#1a1a16','#c9920a','#f5f0e8']},
    {name:'PRODUCT',desc:'Product showcase',colors:['#050a14','#00d4ff','#e0f0ff']},
    {name:'REPORT',desc:'Annual report',colors:['#f8fafc','#0f172a','#e2e8f0']},
  ],
};

const SEC_LABELS={'social-post':'Social Post','ad-banner':'Ad Banner',email:'Email','landing-ad':'Landing Page',outdoor:'Outdoor / OOH',presentation:'Deck / Pitch'};
const ROLES=['Primary','CTA','Background','Accent','Text'];

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
  const bank=BANKS[currentSection]||BANKS['social-post'];
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
  renderAll();generateSuggestions();toast('Campaign palette ready!');
}

function shufflePalette(){generatePalette()}
function genComp(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i%2===0?0:180))%360,s,30+i*10));locked=new Array(colorCount).fill(false);renderAll()}
function genAnalogous(){const[h,s,l]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex((h+(i-1)*22+360)%360,s,l));locked=new Array(colorCount).fill(false);renderAll()}
function genMono(){const[h,s]=hexToHsl(palette[0]);palette=Array.from({length:colorCount},(_,i)=>hslToHex(h,s,8+i*(80/Math.max(colorCount-1,1))));locked=new Array(colorCount).fill(false);renderAll()}
function renderAll(){renderPalette();renderMockup();renderCompare()}

function renderPalette(){
  document.getElementById('palBar').innerHTML=palette.map((c,i)=>`<div class="pal-seg" style="background:${c}"><span class="pal-seg-lbl" style="color:${isLight(c)?'#000':'#fff'}">${c}</span></div>`).join('');
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
  const primary=palette[0], cta=palette[1]||'#ff6b00', bg=palette[2]||'#fff9f0';
  const acc=palette[3]||primary;
  const onPrim=isLight(primary)?'#1a1a1a':'#ffffff';
  const onCta=isLight(cta)?'#1a1a1a':'#ffffff';
  const onBg=isLight(bg)?'#1a1a1a':'#f5f5f5';
  document.getElementById('mockSub').textContent=`${SEC_LABELS[currentSection]} — ${mockMode}`;

  const templates={
    primary:`
      <div style="background:${bg};font-family:'Plus Jakarta Sans',sans-serif;min-height:370px">
        ${currentSection==='social-post'?`
          <div style="max-width:380px;margin:0 auto;padding:20px">
            <div style="background:${primary};border-radius:14px;overflow:hidden;box-shadow:0 8px 28px rgba(0,0,0,0.15)">
              <div style="height:130px;background:linear-gradient(135deg,${primary},${cta});display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
                <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;background:rgba(255,255,255,0.1);border-radius:50%"></div>
                <div style="font-family:'Unbounded',sans-serif;font-size:1.1rem;font-weight:900;color:${onPrim};text-align:center;line-height:1.2;position:relative;z-index:1">BIG SALE<br>TODAY</div>
              </div>
              <div style="padding:14px">
                <div style="font-size:0.75rem;font-weight:600;color:${onPrim};margin-bottom:6px">Exclusive offer — Limited time only</div>
                <div style="font-size:0.65rem;color:${onPrim};opacity:0.7;margin-bottom:12px">Don't miss out on our biggest campaign of the year.</div>
                <div style="background:${cta};color:${onCta};text-align:center;padding:10px;border-radius:8px;font-family:'Unbounded',sans-serif;font-size:0.7rem;font-weight:700">SHOP NOW →</div>
              </div>
            </div>
          </div>`:
        currentSection==='ad-banner'?`
          <div style="max-width:480px;margin:20px auto">
            <div style="background:${primary};border-radius:10px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 8px 24px rgba(0,0,0,0.12)">
              <div>
                <div style="font-family:'Unbounded',sans-serif;font-size:0.65rem;font-weight:700;color:${onPrim};opacity:0.7;letter-spacing:2px;margin-bottom:6px">LIMITED OFFER</div>
                <div style="font-family:'Unbounded',sans-serif;font-size:1.1rem;font-weight:900;color:${onPrim};line-height:1.1;margin-bottom:4px">50% OFF</div>
                <div style="font-size:0.68rem;color:${onPrim};opacity:0.7">Everything. Today only.</div>
              </div>
              <div style="background:${cta};color:${onCta};padding:12px 20px;border-radius:8px;font-family:'Unbounded',sans-serif;font-size:0.72rem;font-weight:700;white-space:nowrap">GET DEAL</div>
            </div>
            <div style="background:${bg};border:1px solid rgba(0,0,0,0.08);border-radius:10px;padding:16px;margin-top:10px;display:flex;justify-content:space-between;align-items:center">
              <div style="font-size:0.68rem;color:${onBg};font-weight:500">Leaderboard Banner — 728x90</div>
              <div style="display:flex;gap:5px">${palette.map(c=>`<div style="width:14px;height:14px;border-radius:3px;background:${c}"></div>`).join('')}</div>
            </div>
          </div>`:
        `
          <div style="background:${bg};padding:28px;font-family:'Plus Jakarta Sans',sans-serif;min-height:360px">
            <div style="max-width:500px;margin:0 auto">
              <div style="background:${primary};border-radius:12px;padding:28px;margin-bottom:16px">
                <div style="font-family:'Unbounded',sans-serif;font-size:0.6rem;font-weight:700;color:${onPrim};opacity:0.6;letter-spacing:2px;margin-bottom:10px">CAMPAIGN HEADER</div>
                <div style="font-family:'Unbounded',sans-serif;font-size:1.2rem;font-weight:900;color:${onPrim};line-height:1.1;margin-bottom:10px">This Is Your Campaign Color System</div>
                <div style="font-size:0.72rem;color:${onPrim};opacity:0.75;margin-bottom:16px;line-height:1.6">Consistent colors across every touchpoint build brand recognition and drive results.</div>
                <div style="background:${cta};color:${onCta};display:inline-block;padding:9px 20px;border-radius:7px;font-family:'Unbounded',sans-serif;font-size:0.7rem;font-weight:700">Take Action →</div>
              </div>
            </div>
          </div>`}
      </div>`,
    alternate:`
      <div style="background:${cta};font-family:'Plus Jakarta Sans',sans-serif;min-height:370px;padding:28px;display:flex;align-items:center;justify-content:center">
        <div style="text-align:center;max-width:480px">
          <div style="font-family:'Unbounded',sans-serif;font-size:0.6rem;letter-spacing:4px;text-transform:uppercase;color:${onCta};opacity:0.65;margin-bottom:12px">${SEC_LABELS[currentSection].toUpperCase()}</div>
          <div style="font-family:'Unbounded',sans-serif;font-size:clamp(1.4rem,4vw,2.2rem);font-weight:900;color:${onCta};line-height:1;margin-bottom:16px">YOUR MESSAGE<br>GOES HERE</div>
          <div style="width:60px;height:3px;background:${onCta};opacity:0.4;margin:0 auto 16px"></div>
          <div style="font-size:0.72rem;color:${onCta};opacity:0.75;margin-bottom:24px;line-height:1.6">Powerful campaign messaging that drives action and builds lasting brand recognition.</div>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <div style="background:${primary};color:${onPrim};padding:10px 22px;border-radius:8px;font-family:'Unbounded',sans-serif;font-size:0.7rem;font-weight:700">Primary CTA</div>
            <div style="border:2px solid ${onCta};color:${onCta};padding:8px 20px;border-radius:8px;font-size:0.7rem;opacity:0.85">Secondary</div>
          </div>
        </div>
      </div>`,
    sheet:`
      <div style="background:#f0ece4;padding:20px;font-family:'Plus Jakarta Sans',sans-serif;min-height:370px">
        <div style="font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:3px;text-transform:uppercase;color:#7a5c30;margin-bottom:14px">Campaign Color Sheet</div>
        <div style="display:flex;height:70px;border-radius:10px;overflow:hidden;margin-bottom:14px;box-shadow:0 4px 12px rgba(0,0,0,0.12)">
          ${palette.map(c=>`<div style="flex:1;background:${c}"></div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(${Math.min(palette.length,4)},1fr);gap:10px;margin-bottom:14px">
          ${palette.map((c,i)=>`
            <div>
              <div style="height:60px;background:${c};border-radius:8px;margin-bottom:5px;box-shadow:0 3px 8px rgba(0,0,0,0.1)"></div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:0.62rem;color:#1a0f00">${c}</div>
              <div style="font-size:0.56rem;color:#7a5c30;font-weight:600">${ROLES[i]||'Color '+(i+1)}</div>
            </div>`).join('')}
        </div>
        <div style="background:#fff;border-radius:8px;padding:12px;border:1px solid rgba(0,0,0,0.06)">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-family:'Unbounded',sans-serif;font-size:0.7rem;font-weight:700">BRAND CAMPAIGN 2024</div>
            <div style="display:flex;gap:4px">${palette.map(c=>`<div style="width:12px;height:12px;border-radius:2px;background:${c}"></div>`).join('')}</div>
          </div>
        </div>
      </div>`,
  };
  frame.innerHTML=templates[mockMode]||templates.primary;
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

function copyCSS(){const css=palette.map((c,i)=>`  --campaign-${ROLES[i].toLowerCase()}: ${c};`).join('\n');navigator.clipboard.writeText(`:root {\n${css}\n}`);toast('CSS copied!')}
function copyHex(){navigator.clipboard.writeText(palette.join(', '));toast('HEX copied!')}
function savePalette(){toast('Campaign kit exported!')}
let tTimer;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(tTimer);tTimer=setTimeout(()=>t.classList.remove('show'),2200)}

function init(){palette=['#ff6b00','#ffd100','#1a0f00'];locked=new Array(3).fill(false);generateSuggestions();renderPalette();renderMockup();renderCompare()}
init();;