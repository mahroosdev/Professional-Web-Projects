(function(){var valid={blanc:1,obsidian:1,void:1,aerium:1,jewel:1};var t=localStorage.getItem('folioTheme');document.documentElement.setAttribute('data-theme',valid[t]?t:'blanc');})();

(function(){
  window.EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
  window.EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
  window.EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  window.EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';
  window.EMAILJS_CONFIGURED = !/^YOUR_|^$/.test(window.EMAILJS_PUBLIC_KEY)
    && !/^YOUR_|^$/.test(window.EMAILJS_SERVICE_ID)
    && !/^YOUR_|^$/.test(window.EMAILJS_TEMPLATE_ID);
})();;

/* ═══ MOBILE SIDEBAR ═══ */
function toggleSidebar(){
  const s=document.getElementById('sidebar');
  const h=document.getElementById('hamburger');
  const o=document.getElementById('sidebarOverlay');
  const open=s.classList.toggle('drawer-open');
  h.classList.toggle('open',open);
  o.classList.toggle('open',open);
  document.body.classList.toggle('drawer-open',open);
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('drawer-open');
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
  document.body.classList.remove('drawer-open');
}

/* ═══ THEME ═══ */
let themePanelOpen=false;
let settingsThemeOpen=false;
let settingsPrivacyOpen=false;
let settingsAboutOpen=false;
let settingsTimeOpen=false;
let fabSheetOpen=false;
function toggleThemePanel(){
  // Legacy stub — desktop theme panel replaced by settings panel on PC
  if(window.matchMedia('(max-width:768px)').matches)return;
  toggleDesktopSettings();
}
function toggleSettingsThemeAccordion(forceState){
  const panel=document.getElementById('settingsThemeContent');
  const icon=document.getElementById('themeAccordionIcon');
  settingsThemeOpen=typeof forceState==='boolean'?forceState:!settingsThemeOpen;
  panel.classList.toggle('open',settingsThemeOpen);
  icon.style.transform=settingsThemeOpen?'rotate(180deg)':'rotate(0deg)';
}
function toggleSettingsInfoAccordion(kind,forceState){
  /* Fix #28: Unified handler — previously the override at the bottom of the file
     ran BOTH the original and the extension for any overlapping key, risking
     double-toggle. Now a single function handles ALL accordion keys. */
  const map={
    time:     {openKey:'settingsTimeOpen',   stateVar:'settingsTimeOpen',    panel:'settingsTimeContent',       icon:'timeAccordionIcon'},
    privacy:  {openKey:'settingsPrivacyOpen',stateVar:'settingsPrivacyOpen', panel:'settingsPrivacyContent',    icon:'privacyAccordionIcon'},
    about:    {openKey:'settingsAboutOpen',  stateVar:'settingsAboutOpen',   panel:'settingsAboutContent',      icon:'aboutAccordionIcon'},
    notestyle:{panel:'settingsNotestyleContent',  icon:'notestyleAccordionIcon'},
    editorprefs:{panel:'settingsEditorprefsContent',icon:'editorprefsAccordionIcon'},
    toolbar:  {panel:'settingsToolbarContent',     icon:'toolbarAccordionIcon',   onOpen:()=>{if(typeof renderToolbarCustomize==='function')renderToolbarCustomize();}},
    navbar:   {panel:'settingsNavbarContent',       icon:'navbarAccordionIcon'},
    countertimer:{panel:'settingsCountertimerContent', icon:'countertimerAccordionIcon', onOpen:()=>{if(typeof applyToolbarVisibility==='function')applyToolbarVisibility();}},
    datastorage:{panel:'settingsDatastorageContent',icon:'datastorageAccordionIcon'},
    rtlsession:{panel:'settingsRtlsessionContent',  icon:'rtlsessionAccordionIcon',  onOpen:()=>{if(typeof rtlApplySettingsUI==='function')rtlApplySettingsUI();}}
  };
  const cfg=map[kind];
  if(!cfg)return;
  const contentEl=document.getElementById(cfg.panel);
  if(!contentEl)return;
  const iconEl=document.getElementById(cfg.icon);
  // Determine new open state
  let shouldOpen;
  if(typeof forceState==='boolean'){
    shouldOpen=forceState;
  } else {
    shouldOpen=!contentEl.classList.contains('open');
  }
  // Sync state variables for the legacy bool-tracked accordions
  if(kind==='time')settingsTimeOpen=shouldOpen;
  if(kind==='privacy')settingsPrivacyOpen=shouldOpen;
  if(kind==='about')settingsAboutOpen=shouldOpen;
  contentEl.classList.toggle('open',shouldOpen);
  if(iconEl)iconEl.style.transform=shouldOpen?'rotate(180deg)':'rotate(0deg)';
  if(shouldOpen&&cfg.onOpen)cfg.onOpen();
}
function closeFabSheet(){
  fabSheetOpen=false;
  const sheet=document.getElementById('fabActionSheet');
  if(sheet)sheet.classList.remove('open');
}
function setTheme(name){
  const validThemes=['blanc','obsidian','void','aerium','jewel'];
  if(!validThemes.includes(name)) name='blanc';
  document.documentElement.setAttribute('data-theme',name);
  document.querySelectorAll('.theme-opt').forEach(o=>o.classList.remove('active'));
  // Mark ALL matching theme opts active (settings panel)
  document.querySelectorAll(`.theme-opt[data-theme="${name}"]`).forEach(o=>o.classList.add('active'));
  localStorage.setItem('folioTheme',name);
  // Sync PC theme cards
  if(typeof pcUpdateThemeCards==='function')pcUpdateThemeCards(name);
  themePanelOpen=false;
}
/* Desktop settings: close on outside click handled by overlay */

/* ═══ DESKTOP SETTINGS PANEL ═══ */
let desktopSettingsOpen=false;
function toggleDesktopSettings(){
  if(desktopSettingsOpen)closeDesktopSettings();
  else openDesktopSettings();
}
function openDesktopSettings(){
  desktopSettingsOpen=true;
  document.getElementById('settingsPanel').classList.add('open');
  document.getElementById('desktopSettingsToggle').classList.add('active');
  updateTimeSettingsDisplay();
  _updateFileStatus();
  pcSettingsInitContents();
  pcUpdateThemeCards();
}
function closeDesktopSettings(){
  desktopSettingsOpen=false;
  document.getElementById('settingsPanel').classList.remove('open');
  const btn=document.getElementById('desktopSettingsToggle');
  if(btn)btn.classList.remove('active');
}
/* settingsClose: works for both mobile (go home) and desktop (close panel) */
function settingsClose(){
  if(isMobileView())switchSection('home');
  else closeDesktopSettings();
}
/* Close desktop settings when clicking the backdrop (outside the dialog) */
document.addEventListener('click',e=>{
  if(desktopSettingsOpen&&!isMobileView()){
    const dialog=document.getElementById('pcSettingsDialog');
    if(dialog&&!dialog.contains(e.target)){
      const btn=document.getElementById('desktopSettingsToggle');
      if(btn&&btn.contains(e.target))return;
      closeDesktopSettings();
    }
  }
  const sheet=document.getElementById('fabActionSheet');
  const fab=document.getElementById('fab');
  if(!sheet||!fab)return;
  if(fabSheetOpen&&!sheet.contains(e.target)&&!fab.contains(e.target))closeFabSheet();
});

/* ═══ PC SETTINGS — SECTION SWITCHER ═══ */
let _pcSecInited=false;
function pcSettingsSec(secId,btnEl){
  if(isMobileView())return;
  /* deactivate all panels and nav items */
  document.querySelectorAll('.pc-section-panel').forEach(p=>p.classList.remove('pc-active'));
  document.querySelectorAll('.pc-snav-item').forEach(b=>b.classList.remove('active'));
  /* activate target */
  const panel=document.getElementById('pcSec-'+secId);
  if(panel)panel.classList.add('pc-active');
  if(btnEl)btnEl.classList.add('active');
  /* refresh live data for relevant sections */
  if(secId==='timezone')updateTimeSettingsDisplay();
  if(secId==='datastorage')_updateFileStatus();
  if(secId==='rtlsession'&&typeof rtlApplySettingsUI==='function')rtlApplySettingsUI();
}

/* Populate dynamic PC section bodies from the existing accordion HTML (runs once on open) */
function pcSettingsInitContents(){
  if(_pcSecInited)return;
  _pcSecInited=true;

  /* Fix #3: Use deep clone instead of moving the live src node.
     Previously tgt.appendChild(src) physically relocated the DOM node,
     permanently emptying the mobile accordion. Now we clone so both the
     PC panel and the mobile accordion always have their content. */
  function cloneInto(sourceId,targetId){
    const src=document.getElementById(sourceId);
    const tgt=document.getElementById(targetId);
    if(!src||!tgt)return;
    tgt.innerHTML='';
    Array.from(src.children).forEach(c=>{
      const cl=c.cloneNode(true);
      cl.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
      tgt.appendChild(cl);
    });
    /* Force visibility for PC panel — keep overflow-y:auto so content can scroll */
    tgt.style.cssText='display:block!important;max-height:none!important;opacity:1!important;overflow-y:auto!important;overflow-x:hidden!important;margin-top:0!important;';
  }

  const sections={
    'pcNoteStyleBody':     'settingsNotestyleContent',
    'pcEditorBody':        'settingsEditorprefsContent',
    'pcRtlBody':           'settingsRtlsessionContent',
    'pcToolbarBody':       'settingsToolbarContent',
    'pcTimezoneBody':      'settingsTimeContent',
    'pcDatastorageBody':   'settingsDatastorageContent',
    'pcPrivacyBody':       'settingsPrivacyContent',
    'pcAboutBody':         'settingsAboutContent',
    'pcSupportBody':       null /* built inline */
  };

  Object.entries(sections).forEach(([targetId,sourceId])=>{
    if(!sourceId)return;
    cloneInto(sourceId,targetId);
  });

  // Sync current pref state into the freshly-cloned PC panel elements.
  // Without this the clones always render in their HTML-default state
  // (e.g. all toggles off) regardless of saved prefs.
  if(typeof rtlApplySettingsUI==='function')rtlApplySettingsUI();
  if(typeof applyEpPrefs==='function')applyEpPrefs();

  /* Build PC support section */
  const suppTgt=document.getElementById('pcSupportBody');
  if(suppTgt){
    suppTgt.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:14px;max-width:440px">
        <div style="padding:20px;background:rgba(248,81,73,0.06);border:1px solid rgba(248,81,73,0.22);border-radius:14px;cursor:pointer;transition:all 0.18s ease;display:flex;align-items:center;gap:16px" onclick="openBugModal()" onmouseenter="this.style.background='rgba(248,81,73,0.1)'" onmouseleave="this.style.background='rgba(248,81,73,0.06)'">
          <div style="width:44px;height:44px;border-radius:12px;background:rgba(248,81,73,0.12);border:1px solid rgba(248,81,73,0.28);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f85149" stroke-width="2" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div>
            <div style="font-size:13.5px;font-weight:700;color:var(--txt)">Report a Bug</div>
            <div style="font-size:11px;color:var(--txt3);margin-top:3px">Found an issue? Tell us what happened</div>
          </div>
          <svg style="margin-left:auto;flex-shrink:0;color:var(--txt3)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div style="padding:16px;background:var(--entry-bg);border:1px solid var(--entry-border);border-radius:12px;display:flex;align-items:flex-start;gap:10px">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--g)" stroke-width="2" stroke-linecap="round" style="flex-shrink:0;margin-top:2px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div style="font-size:11.5px;color:var(--txt2);line-height:1.65">We read every bug report. Please describe what you were doing, what you expected, and what actually happened. Screenshots or console errors help us fix issues faster.</div>
        </div>
      </div>
    `;
  }
}

/* Keep PC theme cards in sync with the active theme */
function pcUpdateThemeCards(activeTheme){
  const theme=activeTheme||document.documentElement.getAttribute('data-theme')||'blanc';
  document.querySelectorAll('.pc-theme-card').forEach(card=>{
    card.classList.toggle('selected',card.getAttribute('data-theme')===theme);
  });
}

/* ═══ CURTAIN ═══ */
setTimeout(()=>{const c=document.getElementById('curtain');c.classList.add('hide');setTimeout(()=>c.style.display='none',1000);},2800);

/* ═══ SECTION SWITCH ═══ */
let activeSection='home';
function isMobileView(){return window.matchMedia('(max-width:768px)').matches;}
function switchSection(sec){
  activeSection=sec;
  // On desktop, close the settings panel/overlay when switching sections
  if(!isMobileView()&&sec!=='settings'){
    const dsp=document.getElementById('settingsPanel');
    const dso=document.getElementById('desktopSettingsOverlay');
    const dst=document.getElementById('desktopSettingsToggle');
    if(dsp)dsp.classList.remove('open');
    if(dso)dso.classList.remove('open');
    if(dst)dst.classList.remove('active');
  }
  document.getElementById('secNotes').classList.toggle('active',sec==='notes');
  document.getElementById('secTasks').classList.toggle('active',sec==='tasks');
  document.getElementById('notesSidePanel').style.display=sec==='notes'?'flex':'none';
  document.getElementById('tasksSidePanel').style.display=sec==='tasks'?'flex':'none';
  document.getElementById('homeMain').style.display=sec==='home'?'flex':'none';
  document.getElementById('notesMain').style.display=sec==='notes'?'flex':'none';
  document.getElementById('tasksMain').style.display=sec==='tasks'?'flex':'none';
  // On mobile only: toggle settings panel full-screen via class
  if(isMobileView())document.getElementById('settingsPanel').classList.toggle('open',sec==='settings');
  document.getElementById('notesHomeBtn').style.display=(isMobileView()&&sec==='notes')?'flex':'none';
  document.getElementById('tasksExitBtn').style.display=(isMobileView()&&sec==='tasks')?'flex':'none';
  document.body.classList.toggle('mobile-home',isMobileView()&&sec==='home');
  document.body.classList.toggle('mobile-settings',isMobileView()&&sec==='settings');
  document.body.classList.toggle('mobile-tasks',isMobileView()&&sec==='tasks');
  document.body.classList.toggle('mobile-notes',isMobileView()&&sec==='notes');
  // Reset header visibility when switching to tasks
  if(sec==='tasks'&&isMobileView()){
    const hw=document.getElementById('tmHeaderWrap');
    if(hw){hw.style.marginTop='0';hw.style.opacity='1';hw.style.pointerEvents='';}
    const tc=document.getElementById('tmContent');
    if(tc)tc.scrollTop=0;
    // Sync scroll-closure state (lastScrollY / headerHidden) with the reset DOM.
    if(typeof window._taskScrollReset==='function') window._taskScrollReset();
  }
  if(sec==='tasks'&&typeof ensureDefaultTaskFilter==='function')ensureDefaultTaskFilter();
  if(sec!=='settings')toggleSettingsThemeAccordion(false);
  if(sec!=='settings'){toggleSettingsInfoAccordion('privacy',false);toggleSettingsInfoAccordion('about',false);toggleSettingsInfoAccordion('time',false);toggleSettingsInfoAccordion('notestyle',false);toggleSettingsInfoAccordion('editorprefs',false);toggleSettingsInfoAccordion('toolbar',false);toggleSettingsInfoAccordion('navbar',false);toggleSettingsInfoAccordion('datastorage',false);toggleSettingsInfoAccordion('rtlsession',false);toggleSettingsInfoAccordion('countertimer',false);}
  if(sec==='settings'){updateTimeSettingsDisplay();_updateFileStatus();applyNavBarPref();}
  closeFabSheet();
  // Swap logo icon to match active section (desktop)
  const iconBox=document.getElementById('logoIconBox');
  const notesIcon=document.getElementById('logoIconNotes');
  const tasksIcon=document.getElementById('logoIconTasks');
  if(notesIcon&&tasksIcon){
    if(sec==='tasks'){
      notesIcon.style.display='none';
      tasksIcon.style.display='block';
      tasksIcon.style.position='static';
    }else{
      notesIcon.style.display='block';
      tasksIcon.style.display='none';
    }
    if(iconBox){
      iconBox.style.transition='box-shadow 0.18s ease';
      iconBox.style.boxShadow='0 0 28px var(--toggle-hover),inset 0 1px 0 rgba(255,255,255,0.16)';
      setTimeout(()=>{iconBox.style.boxShadow='';},320);
    }
  }
  // Swap mobile drawer icon
  const mNotesIcon=document.getElementById('mobileLogoIconNotes');
  const mTasksIcon=document.getElementById('mobileLogoIconTasks');
  if(mNotesIcon&&mTasksIcon){
    if(sec==='tasks'){
      mNotesIcon.style.display='none';
      mTasksIcon.style.display='block';
      mTasksIcon.style.position='static';
    }else{
      mNotesIcon.style.display='block';
      mTasksIcon.style.display='none';
    }
  }
  updateNavButtons();
  updateNavBadges();
  closeSidebar();
  // Sync timer button state whenever section changes
  if(typeof tbRtlSyncBtn === 'function') tbRtlSyncBtn();
  // Auto-start focus timer when entering tasks (mirrors rtlOnNoteOpen for notes)
  if(sec === 'tasks' && typeof rtlPrefs !== 'undefined' && rtlPrefs.enabled){
    if(rtlPrefs.autoStart && typeof rtlState !== 'undefined' && !rtlState.active){
      if(typeof rtlStart === 'function') rtlStart();
    }
  }
}

/* ═══ NOTES ENGINE ═══ */
const TAG_COLORS={
  Personal:['#7eb8f7','rgba(126,184,247,0.12)'],
  Work:['#f472b6','rgba(244,114,182,0.12)'],
  Ideas:['#f0c133','rgba(240,193,51,0.12)'],
  Important:['#f85149','rgba(248,81,73,0.12)'],
  '':null
};
// Custom tag colors (generated dynamically)
function getTagColor(tag){
  if(!tag)return null;
  if(TAG_COLORS[tag])return TAG_COLORS[tag];
  // Generate consistent color from string hash
  let hash=0;for(let i=0;i<tag.length;i++){hash=tag.charCodeAt(i)+((hash<<5)-hash);}
  const hue=Math.abs(hash)%360;
  return [`hsl(${hue},70%,65%)`,`hsla(${hue},60%,55%,0.14)`];
}

const FOLIO_SAMPLE_NOTES_SEEDED_KEY='folioSampleNotesSeededV1';
const FOLIO_SAMPLE_TASKS_SEEDED_KEY='folioSampleTasksSeededV1';
const FOLIO_SAMPLE_NOTES_DISMISSED_KEY='folioSampleNotesDismissedV1';
const FOLIO_SAMPLE_TASKS_DISMISSED_KEY='folioSampleTasksDismissedV1';
function folioLoadArray(key){
  try{
    const raw=localStorage.getItem(key);
    if(raw===null)return {exists:false,value:[]};
    const parsed=JSON.parse(raw);
    return {exists:true,value:Array.isArray(parsed)?parsed:[]};
  }catch(e){
    console.warn('[Folio] Corrupt '+key+' data, resetting.',e);
    localStorage.removeItem(key);
    return {exists:false,value:[]};
  }
}
function folioSetDismissed(key){
  try{localStorage.setItem(key,'true');}catch(e){}
}
function folioSampleDate(offsetDays){
  const d=new Date();
  d.setHours(12,0,0,0);
  d.setDate(d.getDate()+offsetDays);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function folioBuildSampleNotes(){
  const now=Date.now();
  return [
    {
      id:'sample-note-meeting-v1',
      title:'Meeting Notes',
      body:'<p><strong>Q3 Planning Session</strong></p><p>Capture key decisions, blockers, and next actions from the team review.</p><ul><li>Confirm project scope and deadline.</li><li>Assign design and content owners.</li><li>Prepare the follow-up task list.</li></ul>',
      tag:'Work',
      updated:now-3600000,
      sample:true
    },
    {
      id:'sample-note-project-ideas-v1',
      title:'Project Ideas',
      body:'<p>Explore the intersection of design and technology for future product pages.</p><ul><li>Offline-first productivity tools.</li><li>Cleaner onboarding for new users.</li><li>Reusable UI patterns for dashboards.</li></ul>',
      tag:'Ideas',
      updated:now-86400000,
      sample:true
    },
    {
      id:'sample-note-welcome-v1',
      title:'Welcome to Folio',
      body:'<p>This is your private notes and tasks workspace.</p><p>Create a note, organize a task, switch themes, and export a backup whenever you want. Everything is stored locally in this browser.</p>',
      tag:'Personal',
      updated:now-172800000,
      sample:true
    }
  ];
}
function folioBuildSampleTasks(){
  const now=Date.now();
  return [
    {id:'sample-task-proposal-v1',title:'Submit project proposal',description:'Finalize the project brief and send it for review.',priority:'high',category:'Work',due:folioSampleDate(-5),status:'todo',done:false,subtasks:[],createdAt:now-7200000,updatedAt:now-7200000,sample:true},
    {id:'sample-task-metrics-v1',title:'Review Q3 metrics',description:'Go through the analytics dashboard and prepare the team report.',priority:'medium',category:'Work',due:folioSampleDate(-4),status:'todo',done:false,subtasks:[],createdAt:now-7000000,updatedAt:now-7000000,sample:true},
    {id:'sample-task-run-v1',title:'Morning run - 5km',description:'Stick to the training plan. Track with fitness app.',priority:'low',category:'Health',due:folioSampleDate(-3),status:'todo',done:false,subtasks:[],createdAt:now-6800000,updatedAt:now-6800000,sample:true},
    {id:'sample-task-read-v1',title:'Read "Deep Work" chapter 3',description:'Note one practical focus habit to try this week.',priority:'low',category:'Personal',due:folioSampleDate(-2),status:'todo',done:false,subtasks:[],createdAt:now-6600000,updatedAt:now-6600000,sample:true},
    {id:'sample-task-portfolio-v1',title:'Update portfolio website',description:'Add three new case studies and refresh the About page.',priority:'medium',category:'Personal',due:folioSampleDate(-1),status:'inprogress',done:false,subtasks:[{text:'Write case study 1',done:false},{text:'Write case study 2',done:false},{text:'Update About page',done:false}],createdAt:now-6400000,updatedAt:now-6400000,sample:true},
    {id:'sample-task-invoice-v1',title:'Send invoice follow-up',description:'Check payment status and send a polite reminder if needed.',priority:'medium',category:'Finance',due:'',status:'todo',done:false,subtasks:[],createdAt:now-6200000,updatedAt:now-6200000,sample:true},
    {id:'sample-task-archive-v1',title:'Archive reference files',description:'Move completed project files into the archive folder.',priority:'low',category:'Work',due:'',status:'done',done:true,subtasks:[],createdAt:now-6000000,updatedAt:now-6000000,sample:true},
    {id:'sample-task-weekly-review-v1',title:'Weekly planning review',description:'Review priorities and prepare the next sprint list.',priority:'medium',category:'Personal',due:'',status:'done',done:true,subtasks:[],createdAt:now-5800000,updatedAt:now-5800000,sample:true}
  ];
}
function folioLoadInitialNotes(){
  const stored=folioLoadArray('folioNotes');
  const seeded=localStorage.getItem(FOLIO_SAMPLE_NOTES_SEEDED_KEY)==='true';
  const dismissed=localStorage.getItem(FOLIO_SAMPLE_NOTES_DISMISSED_KEY)==='true';
  if(stored.value.length===0&&!seeded&&!dismissed){
    const samples=folioBuildSampleNotes();
    localStorage.setItem('folioNotes',JSON.stringify(samples));
    localStorage.setItem(FOLIO_SAMPLE_NOTES_SEEDED_KEY,'true');
    return samples;
  }
  return stored.value;
}
function folioLoadInitialTasks(){
  const stored=folioLoadArray('folioTasks');
  const seeded=localStorage.getItem(FOLIO_SAMPLE_TASKS_SEEDED_KEY)==='true';
  const dismissed=localStorage.getItem(FOLIO_SAMPLE_TASKS_DISMISSED_KEY)==='true';
  if(stored.value.length===0&&!seeded&&!dismissed){
    const samples=folioBuildSampleTasks();
    localStorage.setItem('folioTasks',JSON.stringify(samples));
    localStorage.setItem(FOLIO_SAMPLE_TASKS_SEEDED_KEY,'true');
    return samples;
  }
  return stored.value;
}
let notes=folioLoadInitialNotes();
let activeNoteId=null;
let greetTypeTimer=null;
function fmtDate(ts){return new Date(ts).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'})}
function stripHtml(html){
  const tmp=document.createElement('div');
  tmp.innerHTML=html||'';
  return (tmp.textContent||tmp.innerText||'').replace(/\s+/g,' ').trim();
}
/* Fix #2: Escape HTML special characters to prevent XSS via user-controlled
   data (n.title, n.tag, t.title, t.description, t.category) injected into innerHTML */
function escHtml(str){
  if(!str)return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}
function renderList(filter=''){
  const el=document.getElementById('notesList');el.innerHTML='';
  const f=filter.toLowerCase();
  notes.filter(n=>{
    const titlePlain=(n.title||'').toLowerCase();
    const bodyPlain=stripHtml(n.body).toLowerCase();
    return titlePlain.includes(f)||bodyPlain.includes(f);
  }).sort((a,b)=>b.updated-a.updated).forEach(n=>{
    const div=document.createElement('div');
    div.className='note-item'+(n.id===activeNoteId?' active':'');
    div.onclick=()=>{openNote(n.id);closeSidebar();};
    const tc=getTagColor(n.tag);
    const previewText=escHtml(stripHtml(n.body)||'No content');
    div.innerHTML=`<div class="note-title-list">${escHtml(n.title||'Untitled')}${n.sample?'<span class="note-sample">sample</span>':''}</div><div class="note-preview">${previewText}</div><div class="note-date">${fmtDate(n.updated)}</div>${tc?`<span class="note-tag" style="background:${tc[1]};color:${tc[0]};border:1px solid ${tc[0]}40">${escHtml(n.tag)}</span>`:''}`;
    el.appendChild(div);
  });
  renderHomeDashboardDebounced();
}
/* Fix #13: renderHomeDashboard rebuilt full SVG charts on every note save/task toggle.
   Debounce it so rapid changes batch into a single rebuild 400ms after last change. */
let _dashboardDebounceTimer = null;
function renderHomeDashboardDebounced(){
  clearTimeout(_dashboardDebounceTimer);
  _dashboardDebounceTimer = setTimeout(renderHomeDashboard, 400);
}
function openNote(id){
  activeNoteId=id;const n=notes.find(x=>x.id===id);if(!n)return;
  document.getElementById('notesEditorWrap').style.display='flex';
  document.getElementById('notesEmptyState').style.display='none';
  document.getElementById('titleInput').value=n.title;
  // Set tag select — handle custom tags
  const tagSel=document.getElementById('tagSelect');
  const knownTags=['','Personal','Work','Ideas','Important'];
  if(n.tag&&!knownTags.includes(n.tag)){
    // Custom tag — select "Other" and populate input
    tagSel.value='__other__';
    const wrap=document.getElementById('tagOtherWrap');
    wrap.style.display='block';
    document.getElementById('tagOtherInput').value=n.tag;
  } else {
    tagSel.value=n.tag||'';
    document.getElementById('tagOtherWrap').style.display='none';
    document.getElementById('tagOtherInput').value='';
  }
  document.getElementById('dateRow').textContent='Last edited: '+fmtDate(n.updated);
  document.getElementById('bodyEditor').innerHTML=n.body||'';
  updateCharCount();renderList();
}
function saveNote(){
  if(!activeNoteId)return;const n=notes.find(x=>x.id===activeNoteId);if(!n)return;
  if(n.sample){n.sample=false;folioSetDismissed(FOLIO_SAMPLE_NOTES_DISMISSED_KEY);}
  n.title=document.getElementById('titleInput').value;
  // Strip glow spans before saving — .tc spans in any state (fresh/settling/settled)
  // must not reach localStorage. Clone the editor so the live DOM is untouched.
  const _edClone=document.getElementById('bodyEditor').cloneNode(true);
  _edClone.querySelectorAll('span.tc').forEach(sp=>{
    if(sp.parentNode) sp.parentNode.replaceChild(document.createTextNode(sp.textContent),sp);
  });
  _edClone.normalize();
  // Strip \uFEFF cursor-anchor sentinels from text nodes so they don't persist
  const _tw=document.createTreeWalker(_edClone,NodeFilter.SHOW_TEXT);
  let _tn;
  while((_tn=_tw.nextNode())) if(_tn.textContent.includes('\uFEFF')) _tn.textContent=_tn.textContent.replace(/\uFEFF/g,'');
  n.body=_edClone.innerHTML;
  n.updated=Date.now();
  document.getElementById('dateRow').textContent='Last edited: '+fmtDate(n.updated);
  updateCharCount();persistNotes();renderList();
}
// Handle tag select — show/hide custom input
function handleTagSelect(val){
  const wrap=document.getElementById('tagOtherWrap');
  if(val==='__other__'){
    wrap.style.display='block';
    document.getElementById('tagOtherInput').focus();
  } else {
    wrap.style.display='none';
    document.getElementById('tagOtherInput').value='';
    updateTag(val);
  }
}
function applyCustomTag(){
  const val=document.getElementById('tagOtherInput').value.trim();
  if(!activeNoteId)return;
  const n=notes.find(x=>x.id===activeNoteId);if(!n)return;
  n.tag=val;persistNotes();renderList();
}
function clearCustomTag(){
  document.getElementById('tagOtherInput').value='';
  document.getElementById('tagSelect').value='';
  document.getElementById('tagOtherWrap').style.display='none';
  updateTag('');
  saveNote();
}
function updateTag(v){if(!activeNoteId)return;const n=notes.find(x=>x.id===activeNoteId);if(!n)return;if(n.sample){n.sample=false;folioSetDismissed(FOLIO_SAMPLE_NOTES_DISMISSED_KEY);}n.tag=v;persistNotes();renderList();}
function newNote(){folioSetDismissed(FOLIO_SAMPLE_NOTES_DISMISSED_KEY);const n={id:Date.now(),title:'',body:'',tag:'',updated:Date.now(),sample:false};notes.unshift(n);persistNotes();openNote(n.id);setTimeout(()=>document.getElementById('titleInput').focus(),50);}
function deleteNote(){if(!activeNoteId)return;folioConfirm('Delete this note? This cannot be undone.','Delete').then(ok=>{if(!ok)return;const deleted=notes.find(x=>x.id===activeNoteId);notes=notes.filter(x=>x.id!==activeNoteId);if(deleted?.sample||notes.length===0)folioSetDismissed(FOLIO_SAMPLE_NOTES_DISMISSED_KEY);activeNoteId=null;persistNotes();document.getElementById('notesEditorWrap').style.display='none';document.getElementById('notesEmptyState').style.display='flex';renderList();showToast('Note deleted');});}
function filterNotes(v){renderList(v);}
function persistNotes(){localStorage.setItem('folioNotes',JSON.stringify(notes));scheduleFileSave();}
function renderHomeDashboard(){
  const notesCount=document.getElementById('homeNotesCount');
  const tasksCount=document.getElementById('homeTasksCount');
  const pendingCount=document.getElementById('homePendingCount');
  const completedCount=document.getElementById('homeCompletedCount');
  const chart=document.getElementById('homeActivityChart');
  const labels=document.getElementById('homeActivityLabels');
  const ring=document.getElementById('homePulseRing');
  const pulsePct=document.getElementById('homePulsePct');
  const pulseText=document.getElementById('homePulseText');
  const spark=document.getElementById('homePulseSpark');
  if(!notesCount||!tasksCount||!pendingCount||!completedCount||!chart||!labels||!ring||!pulsePct||!pulseText||!spark)return;

  /* ── Dynamic greeting + date + typewriter ── */
  (function(){
    const now=new Date();
    const greetDateEl=document.getElementById('homeGreetDate');
    if(greetDateEl){
      const days=['SUN','MON','TUE','WED','THU','FRI','SAT'];
      const months=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      greetDateEl.textContent=`${days[now.getDay()]} · ${months[now.getMonth()]} ${now.getDate()} · ${now.getFullYear()}`;
    }
    /* 100 motivational lines */
    const LINES=[
      'While the world sleeps, you build.',
      'Your story starts now.',
      'In the zone — keep going.',
      'You showed up. That matters.',
      'Champions work in silence.',
      'Great things take time. Stay the course.',
      'One focused hour changes everything.',
      'The best version of you is a decision away.',
      'Discipline is the bridge between goals and achievement.',
      'Small steps daily — enormous results yearly.',
      'Your future self is watching. Make them proud.',
      'Do the work no one sees. That\'s where legends are made.',
      'Every master was once a beginner who refused to quit.',
      'Progress, not perfection.',
      'You are one idea away from everything changing.',
      'The secret is to start before you\'re ready.',
      'Clarity comes from action, not thought.',
      'Make today the day you\'ll look back on.',
      'Every great journey begins with a single keystroke.',
      'Silence is the loudest form of focus.',
      'You don\'t need motivation. You need momentum.',
      'The work is the reward.',
      'Build something worth being proud of.',
      'Today\'s effort is tomorrow\'s result.',
      'Dream it. Plan it. Execute it.',
      'Nothing worthwhile comes from comfort alone.',
      'Show up every day — even when it\'s hard.',
      'Your ideas deserve to exist.',
      'The blank page is full of possibilities.',
      'Create. Don\'t wait for permission.',
      'Trust the process. The results will follow.',
      'Fall in love with the process of becoming.',
      'Potential means nothing without execution.',
      'Every sunrise is a second chance.',
      'Push a little further than yesterday.',
      'The hardest part is starting. You\'ve already started.',
      'Invest in yourself — it\'s the best return.',
      'You are capable of more than you imagine.',
      'Make it happen. Shock everyone.',
      'Your thoughts become your world. Choose wisely.',
      'Be so focused, distractions forget your name.',
      'The grind is where greatness is built.',
      'Not someday. Today.',
      'Excellence is a habit, not an act.',
      'What you do in the dark comes to light.',
      'Believe in the work before the world does.',
      'One more hour of deep work changes the trajectory.',
      'Your consistency is your competitive advantage.',
      'Write. Think. Build. Repeat.',
      'Ambition without action is just a daydream.',
      'The world rewards those who finish.',
      'Stay humble. Stay hungry. Stay sharp.',
      'Today\'s pain is tomorrow\'s power.',
      'Think big. Start small. Act now.',
      'The mind is the ultimate tool — sharpen it.',
      'Earn the rest by doing the work.',
      'Every note, every task — a step forward.',
      'Real growth happens outside the comfort zone.',
      'Be relentless in the pursuit of what sets your soul on fire.',
      'The only limit is the one you accept.',
      'Success is built in the quiet, unglamorous hours.',
      'You are the sum of every choice you make today.',
      'Keep your head down and your standards high.',
      'Let your work speak louder than your words.',
      'A year from now you\'ll wish you started today.',
      'Do something today your future self will thank you for.',
      'Stars don\'t shine without darkness.',
      'You are not behind. You are on your path.',
      'Make the hours count.',
      'Breathe. Focus. Execute.',
      'The gap between where you are and where you want to be is called work.',
      'Momentum is built one rep, one page, one task at a time.',
      'Clarity of purpose beats intensity of effort.',
      'Write your goals. Work your plan.',
      'Every second of effort compounds over time.',
      'The most powerful tool you have is focused attention.',
      'Decide. Commit. Succeed.',
      'Your habits are your destiny.',
      'Let purpose be your alarm clock.',
      'Greatness is a long game. Play it.',
      'The best time to work hard was yesterday. The second best is now.',
      'Quiet the noise. Do the work.',
      'You are building something real.',
      'Ideas only matter when executed.',
      'Be the person who didn\'t wait.',
      'Growth is uncomfortable. Growth is good.',
      'Make your next move your best move.',
      'You\'ve survived 100% of your hard days.',
      'Your effort today is your edge tomorrow.',
      'No shortcuts. Just depth.',
      'Own your morning. Own your day.',
      'Energy flows where focus goes.',
      'Every line you write is a brick in the wall.',
      'Don\'t count the hours — make the hours count.',
      'What you practice in private, you perform in public.',
      'Stay consistent when no one is watching.',
      'The vision is clear. Trust the work.',
      'Today is a gift — build something with it.',
      'Doubt kills more dreams than failure ever will.',
      'The people who change the world never waited for permission.',
      'Hard work beats talent when talent doesn\'t work hard.',
      'You didn\'t come this far to only come this far.',
      'Stop dreaming about it. Start doing it.',
      'Your only competition is who you were yesterday.',
      'The comeback is always stronger than the setback.',
      'Do it now. Sometimes "later" becomes "never."',
      'You have the same hours in a day as everyone who ever built something great.',
      'One decision can rewrite your entire story.',
      'It always seems impossible until it\'s done.',
      'Outwork your excuses.',
      'The future belongs to those who prepare for it today.',
      'You will never regret hard work.',
      'Rise up and attack the day with enthusiasm.',
      'Discomfort is the currency of achievement.',
      'Be stubborn about your goals. Be flexible about your methods.',
      'Every expert was once a complete beginner.',
      'Stop waiting for Friday. Build something instead.',
      'The pain you feel today will be the strength you feel tomorrow.',
      'Work until your idols become your rivals.',
      'Execution separates the dreamers from the builders.',
      'Don\'t wish for it. Work for it.',
      'Your mindset is your most important asset.',
      'If it doesn\'t challenge you, it won\'t change you.',
      'Success is not owned. It\'s rented — and rent is due every day.',
      'Obsession is just another word for passion with teeth.',
      'Do the reps. No one else can do them for you.',
      'The only way out is through.',
      'Focus on the step in front of you, not the whole staircase.',
      'Talent is cheap. Consistency is rare.',
      'You are always one choice away from a completely different life.',
      'There are no traffic jams on the extra mile.',
      'Push through the resistance. The breakthrough is on the other side.',
      'Good things come to those who hustle.',
      'The difference between try and triumph is a little umph.',
      'Build the life you can\'t stop thinking about.',
      'Don\'t stop when you\'re tired. Stop when you\'re done.',
      'Your goals don\'t care about your feelings.',
      'Pressure creates diamonds.',
      'Hunger is the engine of achievement.',
      'Start where you are. Use what you have. Do what you can.',
      'You already have everything you need to begin.',
      'The strongest steel is forged in the hottest fire.',
      'Your life is a product of your daily choices.',
      'Be the energy you want to attract.',
      'The secret of getting ahead is getting started.',
      'Finish what you start. That habit will change your life.',
      'No one is coming to save you. Build the ladder yourself.',
      'When you feel like quitting, remember why you started.',
      'Every day is a page in your story. Write something worthy.',
      'Brick by brick. Day by day.',
      'The reward for focus is clarity. The reward for clarity is results.',
      'You were built for this moment.',
      'Do hard things. Easy things are forgotten.',
      'Don\'t let the noise of the world drown out your inner voice.',
      'You don\'t need more time. You need more intention.',
      'Chase excellence and success will follow.',
      'Make your work an act of love.',
      'Think long. Act now.',
      'You are not your past. You are what you build today.',
      'The most important conversation is the one you have with yourself.',
      'Where focus goes, energy flows, and results show.',
      'Stay in the fight. Every champion did.',
      'Burn the boats. There\'s no going back.',
      'Strive for progress, not comfort.',
      'Simplicity is the ultimate sophistication.',
      'The more you sweat in practice, the less you bleed in battle.',
      'Your habits in private define your results in public.',
      'Dream bigger. Work harder. Complain less.',
      'Lock in. The world is watching.',
      'Your greatest self is found at the edge of your comfort zone.',
      'Wake up. Work hard. Repeat.',
      'Even the tallest tree started as a seed.',
      'Eat your problems for breakfast.',
      'Create your own momentum.',
      'You are the architect of your own destiny.',
      'Excellence is not a destination — it\'s a direction.',
      'Character is built in the hours no one applauds.',
      'Demand more of yourself than anyone else could.',
      'The clock is ticking. Make it count.',
      'Your next chapter is waiting. Start writing.',
      'Nothing stops the person who decides.',
      'You become what you repeatedly do.',
      'Intensity of focus creates extraordinary outcomes.',
      'Burn bright — the world needs your light.',
      'Every day you don\'t act is a vote against your dream.',
      'One percent better, every single day.',
      'Persist until something happens.',
      'The grind is a privilege. Embrace it.',
      'Leave every day better than you found it.',
      'Your discipline today is your freedom tomorrow.',
      'Don\'t negotiate with your limits. Break them.',
      'Your potential is infinite. Your excuses are not.',
      'The day you plant the seed is not the day you eat the fruit.',
      'Go the extra mile — it\'s never crowded.',
      'Sacrifice comfort. Gain everything.',
      'Work like there is someone always trying to take it all away.',
      'Character is what you do when no one is looking.',
      'Success leaves clues. Follow them.',
      'You are far more capable than your fears suggest.',
      'Every morning is a blank canvas. Paint something bold.',
      'Build the version of you that scares the old you.',
      'Not all storms come to disrupt your life — some come to clear your path.',
      'Take the shot. Regret is worse than failure.',
      'Be so good they can\'t ignore you.',
      'Feed your ambition. Starve your distractions.',
      'The harder you work, the luckier you get.',
      'You\'re not behind. You\'re becoming.',
      'Consistency beats intensity every time.',
      'Be the reason someone believes in hard work.',
      'What you water, grows.',
      'Every pro was once an amateur. Keep going.',
      'Deep work produces rare results.',
      'Create more than you consume.',
      'Your name should mean something. Build toward it.',
      'Show the world what quiet dedication looks like.',
      'You have everything you need to take the next step.',
      'Work hard in silence. Let success make the noise.',
      'Every great thing was built one day at a time.',
      'Refuse to be average.',
      'Let your results do the talking.',
      'There is no elevator to success. Take the stairs.',
      'Be the person who makes things happen.',
      'Clarity is power. Focus on what matters most.',
      'Stay the course when everything is against you.',
      'Fearless execution is the rarest skill.',
      'You are exactly where your effort has placed you.',
      'Think deeply. Act decisively.',
      'Every sacrifice you make today compounds into freedom.',
      'Talent will take you so far. Character takes you the rest.',
      'The mountain doesn\'t care about your mood. Climb anyway.',
      'Commit fully or don\'t start.',
      'Today\'s struggle is tomorrow\'s strength.',
      'What you resist persists. What you face, you conquer.',
      'There\'s a version of you that figured it out. Become them.',
      'Your ambition is valid. Now back it up.',
      'You won\'t always be motivated. Be disciplined instead.',
      'The price of greatness is paid daily.',
      'Whatever you do, do it with intention.',
      'Done is better than perfect, but perfect is built through doing.',
      'Make the sacrifice now so you don\'t have to make excuses later.',
      'You are either growing or decaying. Choose growth.',
      'Build systems, not just goals.',
      'Protect your focus like it\'s your most valuable asset.',
      'Do the boring work brilliantly.',
      'Momentum doesn\'t wait for perfect timing.',
      'You are writing the story of your life. Make it legendary.',
      'Bet on yourself. No one else will do it for you.',
      'Confidence is built through action, not affirmation.',
      'Most people overestimate a year and underestimate a decade.',
      'The best project you\'ll ever work on is yourself.',
      'Do it scared. Do it tired. Just do it.',
      'If it matters to you, make time for it.',
      'Be so focused that people think you\'re obsessed.',
      'Outthink. Outwork. Outlast.',
      'The gap between your dreams and reality is called action.',
      'Build in silence. Launch with thunder.',
      'Move with urgency and think with patience.',
      'The work you avoid is usually the work that matters most.',
      'Your standards set your ceiling. Raise them.',
      'Done is better than dreamed.',
      'Master the fundamentals. The rest will follow.',
      'You have survived every challenge thrown at you. That\'s your data.',
      'Stop perfecting. Start shipping.',
      'The cost of inaction is always higher.',
      'Get comfortable being uncomfortable.',
      'Today\'s version of you is temporary. Build the next one.',
      'Everything you want is on the other side of work.',
      'Be relentless. The world respects persistence.',
      'Compound your efforts. The interest is life-changing.',
      'Start now. Perfect it later.',
      'Success is a series of small wins stacked together.',
      'Write it down. Make it real. Get it done.',
      'The strongest weapon you have is your will.',
      'You don\'t rise to your goals. You fall to your systems.',
      'Every setback is a setup for a stronger comeback.',
      'Your work is your signature. Make it count.',
      'Don\'t let the fear of failure outweigh the desire for success.',
      'Act with purpose. Rest with intention.',
      'Finish the day stronger than you started.',
      'No shortcuts to anywhere worth going.',
      'Hunger plus humility is an unstoppable combination.',
      'The version of you that succeeds is already inside you.',
      'Make your future self grateful for what you do today.',
      'You are the product of your most repeated thoughts.',
      'Never let hard times harden your heart or slow your hustle.',
      'Your output is a reflection of your input.',
      'Stay dangerous — keep learning, building, growing.',
      'The curious mind never stops creating.',
      'Choose effort over ease every single time.',
      'You have to be willing to be bad at something before you\'re great.',
      'One day or day one. You choose.',
      'Your reputation is built in the moments nobody\'s watching.',
      'Find the signal in the noise. Then act on it.',
      'Work hard today so your future has options.',
      'The only thing standing between you and your goal is a decision.',
      'Curiosity is a superpower. Stay hungry for knowledge.',
      'Write the code. Ship the product. Own the outcome.',
      'Every version of you deserves to be the best version.',
      'Deadlines are gifts. They force you to finish.',
      'Extraordinary people do ordinary things extraordinarily well.',
      'Don\'t break the chain. Stay consistent.',
      'No one builds a legacy by accident.',
      'Greatness is never given. It\'s earned at the edge of your capacity.',
      'The person you\'ll be in five years is being decided right now.',
      'Do today what others won\'t so tomorrow you can do what others can\'t.',
      'Build something real. Build something lasting.',
      'One idea executed beats a thousand ideas planned.',
      'Set the standard higher. Then meet it.',
      'The depth of your preparation determines the height of your success.',
      'Invest time like money — spend it on what returns value.',
      'Your life is your message to the world. Make it inspiring.',
      'Keep going. You\'re closer than you think.',
      'Purpose fuels progress. Find yours and feed it.',
      'The mission never sleeps — and neither does your potential.',
      'Every keystroke is a step toward your vision.',
      'Rise to the version of yourself you dream about.',
      'You have the power to create the life you imagine.',
      'Don\'t just set goals — destroy them.',
      'The world belongs to those who don\'t stop.',
      'Take the leap. The net will appear.',
      'Hard days build the foundation for extraordinary ones.',
      'Carve your path. Don\'t follow the crowd.',
      'Obsess over excellence. It shows.',
      'Build your empire one task at a time.',
      'The best view comes after the hardest climb.',
      'You are one habit away from a completely different life.',
      'Think like a visionary. Work like a craftsman.',
      'The details matter. The details separate you.',
      'Every great builder once stared at an empty screen.',
      'Relentless forward motion is a superpower.',
      'Make your effort undeniable.',
      'Be the proof that it\'s possible.',
      'Discipline is choosing the future over the moment.',
      'Your next breakthrough is hiding behind your next obstacle.',
      'Do the work. Own the result.',
      'You are building a life. Make the architecture beautiful.',
      'What would the best version of you do right now?',
      'Become so good that your success is inevitable.',
      'Every day you choose who you become.',
      'The best investment is in your own skill.',
      'Never underestimate the power of showing up.',
      'You\'re not stuck. You\'re just warming up.',
      'When in doubt, ship it out.',
      'Precision over speed. Depth over breadth.',
      'The right moment is always right now.',
      'Your mind is a garden. Plant the right seeds.',
      'Every challenge is an opportunity in disguise.',
      'Focus on the controllables. Master them.',
      'Work smarter and harder. Not one or the other.',
      'You\'ve got this. The numbers just haven\'t shown up yet.',
      'Pour your soul into your work. It shows.',
      'Every line of code, every note, every task — it all adds up.',
      'Build the dream or work in someone else\'s.',
      'The cost of discipline is always less than the cost of regret.',
      'Become addicted to progress.',
      'There is power in showing up consistently.',
      'Your resilience is your brand.',
      'Make decisions your future self will applaud.',
      'The world needs what only you can create.',
      'Nothing is wasted when you\'re learning.',
      'You have a gift. Stop keeping it to yourself.',
      'Build bridges toward your future, not walls around your past.',
      'Execute with precision. Rest with purpose.',
      'Your growth is not behind schedule. It\'s right on time.',
      'Less noise. More signal. More output.',
      'Chase mastery, not validation.',
      'The standard is the standard — never lower it.',
      'Push past the point where others stop.',
      'Work today like your future depends on it — because it does.',
      'Let today\'s effort be tomorrow\'s evidence.',
      'Make the invisible visible through your work.',
      'Some days are hard. Build through them anyway.',
      'The most underrated skill is showing up without needing applause.',
      'You build what you believe. Believe bigger.',
      'Be a student forever and a master at your craft.',
      'One powerful session can shift the entire week.',
      'Speed of execution beats perfection of planning.',
      'Build like no one is watching. Launch like everyone is.',
      'The details you obsess over become the quality others admire.',
      'Deep focus is the new superpower.',
      'Your past performance does not define your next move.',
      'Greatness is built in obscurity before it\'s celebrated in public.',
      'Think 10x. Work 10x. Expect 10x.',
      'Forget balance. Find intensity in what matters.',
      'Your craft is your gift. Refine it daily.',
      'Stay low. Build high.',
      'Not all progress looks like progress — trust the process.',
      'Hardship is not a detour. It\'s the path.',
      'Today\'s discipline is the foundation of tomorrow\'s freedom.',
      'You are the sum of your undistracted hours.',
      'Map your goals. Execute with fire.',
      'Your actions speak so loud your words don\'t matter.',
      'Build for the future. Burn the shortcut map.',
      'Every morning is a new starting line.',
      'You grow most when it\'s most uncomfortable.',
      'Great work doesn\'t happen by accident.',
      'A little progress each day adds up to big results.',
      'The quality of your focus determines the quality of your output.',
      'Stop consuming. Start creating.',
      'Being productive is a form of self-respect.',
      'Never let the fear of the next step freeze you in the last one.',
      'You don\'t have to be perfect. You have to be persistent.',
      'Work ethic is the great equalizer.',
      'Put in the reps. Mastery follows.',
      'Do the thing you said you\'d do.',
      'The version of you a year from now is shaped by today.',
      'Stay in motion. Progress loves movement.',
      'Your best work lies just ahead of your comfort.',
      'Stack the wins. No matter how small.',
      'Bold actions create bold lives.',
      'The foundation of every great thing is consistency.',
      'Make excellence your lowest acceptable standard.',
      'You are capable of doing the hard thing.',
      'Cut the excuses. Do the reps.',
      'Quiet ambition with loud execution.',
      'Every hard thing you do now makes the next hard thing easier.',
      'Build deeply. Not broadly.',
      'Your time is not just money — it\'s legacy.',
      'One strong hour can define your whole day.',
      'Think in years. Work in days.',
      'You are writing your legacy right now.',
      'The path to mastery is paved with daily practice.',
      'Great things are built by those who refuse to give up.',
      'When the work is hard, the results are real.',
      'Don\'t just occupy space. Own it.',
      'You are enough to begin. Begin.',
      'The mission is bigger than the mood.',
      'Finish what you start. The world needs completers.',
      'Your energy is contagious. Make it worth catching.',
      'The discipline you build today is the freedom you enjoy tomorrow.',
      'Don\'t wait for inspiration. Create it.',
      'Every act of focus is an act of self-respect.',
      'Work like you\'re running out of time — because you are.',
      'You don\'t need luck. You need effort applied consistently.',
      'The right mindset is the first tool. Pick it up.',
      'Make yourself proud before you make anyone else proud.',
      'Every struggle you push through is building your character.',
      'The results you want are hidden inside the work you\'re avoiding.',
      'Masterpieces are made in the hours between midnight and dawn.',
      'You are in the arena. That already puts you ahead.',
      'Precision beats power. Technique beats brute force.',
      'Build with intention. Every decision compounds.',
      'Sharpen yourself on difficulty.',
      'What you do daily determines what you become permanently.',
      'The dream is free. The hustle is sold separately.',
      'You become unbeatable the day you stop comparing.',
      'Don\'t talk about the plan. Execute the plan.',
      'Silence your inner critic with your outer action.',
      'The only approval you need is from your future self.',
      'Obsess over the craft. The craft will reward you.',
      'You will never be this young again. Use it.',
      'Your ceiling is your fear. Punch through it.',
      'Stay dangerous — hungry, humble, and relentless.',
      'Every task you finish is a promise kept to yourself.',
      'Craft your life the way you craft your best work.',
      'The seeds of tomorrow are planted in the soil of today.',
      'Take ownership of everything in your life.',
      'You are not defined by your worst day.',
      'No one remembers the person who almost made it.',
      'Chase excellence and comfort will chase you.',
      'Do what is hard and life becomes easy.',
      'Ambition is the spark. Discipline is the fuel.',
      'Time wasted can never be recovered — spend it intentionally.',
      'You are the only variable in your success equation.',
      'Build the habit. The habit will build you.',
      'Your legacy is written in the hours nobody sees.',
      'Show up. Do the reps. Go home. Repeat.',
      'The person you\'re becoming is worth the effort.',
      'Every moment you choose focus, you choose your future.',
      'Success is rented — the rent is paid in daily effort.',
      'Think less. Ship more. Learn fast.',
      'Your work ethic is your autobiography.',
      'Chase the result by mastering the process.',
      'You are not behind. You are building.',
      'Act boldly in the direction of your dreams.',
      'Every day without progress is a day borrowed against your future.',
      'The moment you decide, the work becomes possible.',
      'Your focus is your most finite and most powerful resource.',
      'Build something the world didn\'t know it needed.',
      'Self-discipline is self-love in its most practical form.',
      'Move. Think. Create. That\'s the cycle.',
      'Your output today is your investment in tomorrow.',
      'The world bends toward those who keep showing up.',
      'You already know what to do. Now do it.',
      'Kill the hesitation. Execute the vision.',
      'Every effort in the right direction accumulates.',
      'Mastery is the art of never being satisfied.',
      'Work when it\'s hard. Especially when it\'s hard.',
      'Your work is your vote for the life you want.',
      'Excellence isn\'t an event. It\'s a standard.',
      'You are your greatest project. Keep building.',
      'Rise above the noise. Create something timeless.',
      'Urgency without panic. Patience without laziness.',
      'Every idea is a seed. Water it with action.',
      'You have more power than you believe. Use it.',
      'The formula is simple: show up, do the work, level up.',
      'One focused day can unlock a breakthrough week.',
      'Make every keystroke count.',
      'Your story is still being written. Make it bold.',
      'Silence the doubt. Start the work.',
    ];
    const greetMsgEl=document.getElementById('homeGreetMsg');
    if(!greetMsgEl)return;

    /* Pick line: rotate by day-of-year so each day has a fresh line */
    const dayOfYear=Math.floor((now-(new Date(now.getFullYear(),0,0)))/(1000*60*60*24));
    /* Add a session offset so revisiting home within a day picks a new line */
    let sessionIdx=parseInt(sessionStorage.getItem('folioGreetIdx')||'-1');
    sessionIdx=(sessionIdx+1)%LINES.length;
    sessionStorage.setItem('folioGreetIdx',sessionIdx);
    const line=LINES[(dayOfYear+sessionIdx)%LINES.length];

    /* Typewriter */
    if(greetTypeTimer){clearTimeout(greetTypeTimer);greetTypeTimer=null;}
    greetMsgEl.innerHTML='<span class="home-greet-cursor"></span>';
    const cursor=greetMsgEl.querySelector('.home-greet-cursor');
    let i=0;
    const speed=38; /* ms per char */
    function type(){
      if(!greetMsgEl.contains(cursor)){greetTypeTimer=null;return;}
      if(i<line.length){
        greetMsgEl.insertBefore(document.createTextNode(line[i]),cursor);
        i++;
        greetTypeTimer=setTimeout(type,speed+(Math.random()*18-9));
      } else {
        cursor.style.display='none';
        greetTypeTimer=null;
      }
    }
    greetTypeTimer=setTimeout(type,320);
  })();

  const totalTasks=tasks.length;
  const doneTasks=tasks.filter(t=>t.done).length;
  const pendingTasks=totalTasks-doneTasks;
  const donePct=totalTasks?Math.round(doneTasks/totalTasks*100):0;

  /* Animated count-up for home stat cards */
  function animateCount(el,target,duration){
    if(!el)return;
    const start=parseInt(el.textContent)||0;
    if(start===target){el.textContent=target;return;}
    const startTime=performance.now();
    function step(now){
      const elapsed=now-startTime;
      const progress=Math.min(elapsed/duration,1);
      const eased=1-Math.pow(1-progress,3);
      el.textContent=Math.round(start+(target-start)*eased);
      if(progress<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  animateCount(notesCount,notes.length,600);
  animateCount(tasksCount,totalTasks,600);
  animateCount(pendingCount,pendingTasks,600);
  animateCount(completedCount,doneTasks,600);
  ring.style.background=`conic-gradient(from 180deg,var(--g) 0%,var(--g2) ${donePct}%,rgba(255,255,255,0.08) ${donePct}%,rgba(255,255,255,0.08) 100%)`;
  pulsePct.textContent=`${donePct}%`;
  pulseText.textContent=`${doneTasks} done · ${pendingTasks} pending`;

  const dayNames=['S','M','T','W','T','F','S'];
  const dayFull=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const dayBuckets=[0,0,0,0,0,0,0];
  tasks.forEach(t=>{
    const stamp=t.createdAt||Date.now();
    const day=new Date(stamp).getDay();
    dayBuckets[day]+=1;
  });
  const maxCount=Math.max(...dayBuckets,1);
  chart.innerHTML='';
  labels.innerHTML='';

  const isMobile=window.innerWidth<=768;
  if(isMobile){
    /* ── Creative SVG area + live-dot chart ── */
    const today=new Date().getDay();
    const W=280,H=72,padL=10,padR=10,padT=10,padB=6;
    const innerW=W-padL-padR;const innerH=H-padT-padB;
    const pts=dayBuckets.map((c,i)=>({
      x:padL+(i/6)*innerW,
      y:padT+innerH-Math.max(4,Math.round((c/maxCount)*innerH))
    }));
    const linePath=pts.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaPath=linePath+` L${pts[6].x.toFixed(1)},${(H-padB).toFixed(1)} L${pts[0].x.toFixed(1)},${(H-padB).toFixed(1)} Z`;
    const todayPt=pts[today];
    const uid='ag'+Date.now();
    const svgStr=`<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;display:block">
      <defs>
        <linearGradient id="${uid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--g)" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="var(--g)" stop-opacity="0.01"/>
        </linearGradient>
        <filter id="${uid}glow" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d="${areaPath}" fill="url(#${uid})"/>
      <path d="${linePath}" fill="none" stroke="var(--g2)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" filter="url(#${uid}glow)" opacity="0.9"/>
      ${pts.map((p,i)=>`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${i===today?'0':'2.2'}" fill="var(--g)" opacity="0.5"/>`).join('')}
      <circle cx="${todayPt.x.toFixed(1)}" cy="${todayPt.y.toFixed(1)}" r="7" fill="var(--g)" opacity="0.18" class="mac-halo"/>
      <circle cx="${todayPt.x.toFixed(1)}" cy="${todayPt.y.toFixed(1)}" r="4.2" fill="var(--g2)" class="mac-live-node"/>
      <circle cx="${todayPt.x.toFixed(1)}" cy="${todayPt.y.toFixed(1)}" r="2" fill="#fff"/>
      <line x1="${todayPt.x.toFixed(1)}" y1="${(todayPt.y+5).toFixed(1)}" x2="${todayPt.x.toFixed(1)}" y2="${(H-padB).toFixed(1)}" stroke="var(--g2)" stroke-width="1" stroke-dasharray="2 2" opacity="0.3"/>
    </svg>`;
    chart.innerHTML=svgStr;
    chart.className='mac-chart-area';

    /* Day pills row */
    const pillsHTML=dayBuckets.map((c,i)=>{
      const isToday=i===today;
      return `<div class="mac-day-pill${isToday?' today':''}">
        <span class="mac-day-lbl">${dayNames[i]}</span>
        <span class="mac-day-cnt${c===0?' zero':''}">${c}</span>
      </div>`;
    }).join('');
    labels.innerHTML=`<div class="mac-day-pills">${pillsHTML}</div>`;
    labels.className='mac-chart-labels';

    /* Patch the title to show LIVE badge */
    const titleEl=chart.closest('.home-analytics-card')&&chart.closest('.home-analytics-card').querySelector('.home-analytics-title');
    if(titleEl&&!titleEl.querySelector('.mac-live-badge')){
      titleEl.style.display='flex';titleEl.style.alignItems='center';titleEl.style.justifyContent='space-between';
      titleEl.innerHTML='Weekly Activity<span class="mac-live-badge"><span class="mac-live-dot"></span>LIVE</span>';
    }
  } else {
    /* ── Desktop: original bar chart ── */
    dayBuckets.forEach((count,idx)=>{
      const bar=document.createElement('div');
      bar.className='home-chart-bar';
      const h=Math.max(12,Math.round((count/maxCount)*88));
      bar.style.height=`${h}px`;
      chart.appendChild(bar);
      const label=document.createElement('span');
      label.textContent=dayNames[idx];
      labels.appendChild(label);
    });
  }

  // Spark: reuse activity, render as tiny dots
  spark.innerHTML='';
  const sparkMax=Math.max(...dayBuckets,1);
  dayBuckets.forEach((count)=>{
    const dot=document.createElement('div');
    dot.className='home-spark-dot';
    const s=Math.max(6,Math.round((count/sparkMax)*16));
    dot.style.width=`${s}px`;
    dot.style.height=`${s}px`;
    spark.appendChild(dot);
  });
}
function execFmt(cmd){
  const editor=document.getElementById('bodyEditor');
  if(editor)editor.focus();
  document.execCommand(cmd);
  updateCharCount();
  saveNote();
}
function updateCharCount(){const c=(document.getElementById('bodyEditor').innerText||'').length;document.getElementById('charCount').textContent=c.toLocaleString()+' characters';}

/* ═══ TYPING ANIMATION ═══ */
let isComposing=false;
// Android IMEs (GBoard, Samsung Keyboard, etc.) route EVERY keystroke through the
// composition API, so e.isComposing is permanently true while typing. The !e.isComposing
// guard in the input listener blocks the glow for every individual character on Android.
// We detect Android once here and bypass that guard so each character glows as it appears.
const isAndroidDevice=/Android/i.test(navigator.userAgent);
// ── Wave Glow State ──────────────────────────────────────────────────────────
// Desktop: .tc spans are held bright while typing; faded in sequence on pause.
let waveGlowSpans=[];      // ordered list of active glowing spans
let waveTypingTimer=null;  // debounce — fires startWaveFade() after pause
// Mobile: orb divs are held visible while typing; faded in sequence on pause.
let mobileWaveOrbs=[];     // ordered list of held orb elements
let mobileWaveTimer=null;  // same debounce for mobile
const WAVE_PAUSE_MS=400;   // ms of no-input before wave fade begins
const WAVE_STAGGER_MS=110; // ms between each letter/orb starting its fade
const WAVE_FADE_MS=1700;   // ms for fade animation (matches .tc.wave-fading CSS)
const WAVE_ORB_FADE_MS=1000;
const WAVE_ORB_CAP=24;     // max held orbs to prevent memory issues
const editor=document.getElementById('bodyEditor');
// Tracks whichever contenteditable is currently active (main editor or focus mirror).
// wrapLastChar() uses this to guard normalize() calls that would jump the cursor.
let activeEditor=editor;
editor.addEventListener('compositionstart',()=>isComposing=true);
editor.addEventListener('compositionend',()=>{
  isComposing=false;
  // iOS fires compositionend AFTER the input event (opposite of Chrome), so our
  // isComposing flag is still true when input fires — the glow is blocked.
  // Android (GBoard) commits a word then auto-inserts a space, so the cursor lands
  // AFTER the space — wrapLastChar() sees a space and bails with no glow.
  // Fix: walk back past any trailing whitespace to find the last real character.
  requestAnimationFrame(()=>{
    if(typeof epPrefs!=='undefined'&&epPrefs.textGlow===false)return;
    const sel=window.getSelection();
    if(!sel||!sel.rangeCount)return;
    const range=sel.getRangeAt(0);
    const node=range.startContainer;
    if(node.nodeType!==Node.TEXT_NODE)return;
    const offset=range.startOffset;
    if(offset===0)return;
    const text=node.textContent;
    // Walk back past whitespace (the space Android auto-appends after a word)
    let i=offset-1;
    while(i>=0&&(text[i]===' '||text[i]==='\n'||text[i]==='\r'))i--;
    if(i<0)return;
    const ch=text[i];
    const before=text.slice(0,i);
    const after=text.slice(i+1);
    const span=document.createElement('span');span.className='tc';span.textContent=ch;
    // If cursor is inside an existing .tc span (browser snapped caret there), operate
    // on the span's parent and replace the whole span — not just the inner text node.
    // Without this, the double-wrap guard kills glow after the first few keystrokes.
    const isInsideTc1=node.parentNode&&node.parentNode.classList&&node.parentNode.classList.contains('tc');
    const parent=isInsideTc1?node.parentNode.parentNode:node.parentNode;
    const nodeToReplace=isInsideTc1?node.parentNode:node;
    const frag=document.createDocumentFragment();
    if(before){
      if(isInsideTc1){const prevSpan=document.createElement('span');prevSpan.className='tc';prevSpan.textContent=before;frag.appendChild(prevSpan);waveGlowSpans.push(prevSpan);}
      else{frag.appendChild(document.createTextNode(before));}
    }
    frag.appendChild(span);
    // '\uFEFF' sentinel — keeps the browser from deleting the anchor text node.
    // See wrapLastChar() comment for the full explanation.
    const afterNode=document.createTextNode(after||'\uFEFF');
    frag.appendChild(afterNode);
    parent.replaceChild(frag,nodeToReplace);
    // Bug fix: always use setStart(afterNode, pos) — keeps cursor anchored inside a
    // TEXT_NODE so the browser never snaps it backward to a parent element position.
    try{
      const nr=document.createRange();
      const posInAfter=after?Math.min(offset-(i+1),afterNode.length):0;
      nr.setStart(afterNode,posInAfter);
      nr.collapse(true);sel.removeAllRanges();sel.addRange(nr);
    }catch(_){}
    // Wave glow: hold span bright, push into queue, reset pause timer
    waveGlowSpans.push(span);
    clearTimeout(waveTypingTimer);
    waveTypingTimer=setTimeout(startWaveFade,WAVE_PAUSE_MS);
    // DOM cleanup deferred to editor blur (cleanupTcSpans) — see compositionend comment.
  });
});
editor.addEventListener('input',(e)=>{saveNote();updateCharCount();
  const t=e.inputType||'';
  if(!t.startsWith('insert')||t==='insertFromPaste')return;
  // Guard here (not inside wrapLastChar/triggerAndroidGlow) so focus mode can call
  // those same functions governed only by its own focusGlow pref, independently.
  if(typeof epPrefs!=='undefined'&&epPrefs.textGlow===false)return;
  if(isAndroidDevice){
    requestAnimationFrame(()=>triggerAndroidGlow());
  } else if(!e.isComposing){
    wrapLastChar();
  }
});
function triggerAndroidGlow(){
  // Pref guard removed — each call site checks its own pref (textGlow or focusGlow).
  const sel=window.getSelection();
  if(!sel||!sel.rangeCount)return;
  const range=sel.getRangeAt(0).cloneRange();
  range.collapse(true);
  let rect=range.getBoundingClientRect();
  // Collapsed-range rect may be zero-width — expand left by 1 char for a real rect
  if(rect.height===0){
    try{range.setStart(range.startContainer,Math.max(0,range.startOffset-1));}catch(_){}
    rect=range.getBoundingClientRect();
  }
  if(rect.height===0)return;
  const orb=document.createElement('div');
  // Wave: orb starts held (bright, no fade animation)
  orb.className='tc-orb tc-orb-held';
  orb.style.left=(rect.left-2)+'px';
  orb.style.top=rect.top+'px';
  orb.style.height=rect.height+'px';
  document.body.appendChild(orb);
  // Cap the orb queue to prevent memory issues on long typing runs
  if(mobileWaveOrbs.length>=WAVE_ORB_CAP){
    const oldest=mobileWaveOrbs.shift();
    if(oldest&&oldest.parentNode)oldest.remove();
  }
  mobileWaveOrbs.push(orb);
  // Reset pause timer — when typing stops, fade orbs in sequence
  clearTimeout(mobileWaveTimer);
  mobileWaveTimer=setTimeout(startMobileWaveFade,WAVE_PAUSE_MS);
}
// keypress listener removed — input event already schedules wrapLastChar() once per character.
// Having both caused double DOM splits on rapid typing, mixing characters at cursor position.
editor.addEventListener('paste',e=>{e.preventDefault();const text=e.clipboardData.getData('text/plain');document.execCommand('insertText',false,text);saveNote();});

/* ── Glow span cleanup ─────────────────────────────────────────────────────
   replaceChild(txt, span) must NEVER run while the editor is focused.
   Any DOM mutation near the cursor causes browsers to re-evaluate the
   Selection and snap the caret to offset 0 of the replacement node —
   exactly where the glow span started (the "cursor jumps back" symptom).

   Safe strategy:
     • The CSS for .tc.settled is already color:inherit / text-shadow:none,
       so settled spans are visually identical to plain text. Leave them in
       the DOM while the user types — they cause zero visual artefacts.
     • On blur (editor no longer focused), it is safe to unwrap every settled
       span into a plain text node and normalize. The Selection is gone, so
       no Range can be invalidated.
     • saveNote() saves a *clone* with all .tc spans stripped, so raw span
       markup never reaches localStorage regardless of editing state.
──────────────────────────────────────────────────────────────────────── */
function cleanupTcSpans(el){
  if(!el) return;
  // Unwrap every settled span — fresh/settling spans keep their animation
  el.querySelectorAll('span.tc.settled').forEach(sp=>{
    if(sp.parentNode){
      sp.parentNode.replaceChild(document.createTextNode(sp.textContent),sp);
    }
  });
  // Remove stray empty sentinel text nodes and \uFEFF cursor-anchor chars
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
  const toFix=[];let node;
  while((node=walker.nextNode())) toFix.push(node);
  toFix.forEach(n=>{
    if(!n.parentNode) return;
    // Strip zero-width no-break space sentinels injected by wrapLastChar
    if(n.textContent.includes('\uFEFF')) n.textContent=n.textContent.replace(/\uFEFF/g,'');
    // Remove if now fully empty
    if(n.textContent===''||n.textContent==='\u200B') n.parentNode.removeChild(n);
  });
  // Merge adjacent text nodes — safe now that no live Selection exists
  el.normalize();
}
editor.addEventListener('blur',()=>{ flushWaveOnBlur(); cleanupTcSpans(editor); });
function wrapLastChar(){
  // Pref guard removed — each call site checks its own pref (textGlow or focusGlow).
  const sel=window.getSelection();if(!sel.rangeCount)return;
  const range=sel.getRangeAt(0);let node=range.startContainer;
  if(node.nodeType===Node.TEXT_NODE&&range.startOffset>0){
    const offset=range.startOffset;const ch=node.textContent[offset-1];
    if(ch===' '||ch==='\n'||ch==='\r')return;
    // If cursor is inside an existing .tc span (browser snapped caret there instead of
    // the afterNode sentinel), extract the newly typed char and wrap it in a new fresh
    // span — rather than bailing out and silently skipping glow on all subsequent chars.
    const isInsideTc=node.parentNode&&node.parentNode.classList&&node.parentNode.classList.contains('tc');
    const before=node.textContent.slice(0,offset-1);const after=node.textContent.slice(offset);
    const span=document.createElement('span');span.className='tc';span.textContent=ch;
    const parent=isInsideTc?node.parentNode.parentNode:node.parentNode;
    const nodeToReplace=isInsideTc?node.parentNode:node;
    const frag=document.createDocumentFragment();
    if(before){
      if(isInsideTc){const prevSpan=document.createElement('span');prevSpan.className='tc';prevSpan.textContent=before;frag.appendChild(prevSpan);waveGlowSpans.push(prevSpan);}
      else{frag.appendChild(document.createTextNode(before));}
    }
    frag.appendChild(span);
    // Use '\uFEFF' sentinel so the browser cannot garbage-collect the anchor text node
    // (an empty text node gets silently removed, snapping the cursor into the span and
    // breaking glow on every subsequent keystroke).
    const afterNode=document.createTextNode(after||'\uFEFF');
    frag.appendChild(afterNode);
    parent.replaceChild(frag,nodeToReplace);
    // Always anchor cursor inside afterNode (TEXT_NODE) not setStartAfter(span)
    // (element-level Range container lets the browser snap backward randomly).
    try{
      const nr=document.createRange();
      nr.setStart(afterNode,0);
      nr.collapse(true);sel.removeAllRanges();sel.addRange(nr);
    }catch(e){}
    // Wave glow: hold span bright, push into queue, reset pause timer
    waveGlowSpans.push(span);
    clearTimeout(waveTypingTimer);
    waveTypingTimer=setTimeout(startWaveFade,WAVE_PAUSE_MS);
    // DOM cleanup deferred to editor blur (cleanupTcSpans) — see compositionend comment.
  }
}
/* ── Wave Glow Controllers ───────────────────────────────────────────────────
   startWaveFade() — called after WAVE_PAUSE_MS of no new characters.
   Fades desktop spans left→right in sequence (first typed = first to fade).
   startMobileWaveFade() — same logic for mobile orb elements.
── */
function startWaveFade(){
  const spans=waveGlowSpans.splice(0); // snapshot & clear
  spans.forEach((span,i)=>{
    setTimeout(()=>{
      if(!span.parentNode){return;} // already cleaned up
      span.classList.add('wave-fading');
      // Mark settled after the CSS animation completes so cleanupTcSpans can unwrap
      setTimeout(()=>{ span.classList.add('settled'); },WAVE_FADE_MS);
    },i*WAVE_STAGGER_MS);
  });
}
function startMobileWaveFade(){
  const orbs=mobileWaveOrbs.splice(0);
  orbs.forEach((orb,i)=>{
    setTimeout(()=>{
      if(!orb.parentNode){return;}
      orb.classList.remove('tc-orb-held');
      orb.classList.add('tc-orb-fading');
      setTimeout(()=>{ if(orb.parentNode)orb.remove(); },WAVE_ORB_FADE_MS+50);
    },i*WAVE_STAGGER_MS);
  });
}
// On editor blur: flush any pending wave immediately (don't leave glowing spans)
function flushWaveOnBlur(){
  clearTimeout(waveTypingTimer);
  if(waveGlowSpans.length){ startWaveFade(); }
  clearTimeout(mobileWaveTimer);
  if(mobileWaveOrbs.length){ startMobileWaveFade(); }
}

/* ═══════════════════════════════
   TASK MANAGER ENGINE
═══════════════════════════════ */
let tasks=folioLoadInitialTasks();
let taskFilter=null;
let taskView='list';
let editingTaskId=null;
let modalSubtasks=[];

const TASK_CAT_COLORS={
  Work:['#f472b6','rgba(244,114,182,0.14)'],
  Personal:['#7eb8f7','rgba(126,184,247,0.14)'],
  Ideas:['#f0c133','rgba(240,193,51,0.14)'],
  Health:['#4ade80','rgba(74,222,128,0.14)'],
  Finance:['#fb923c','rgba(251,146,60,0.14)'],
  '':[null,null]
};
function getTaskCatColor(cat){
  if(!cat)return [null,null];
  if(TASK_CAT_COLORS[cat])return TASK_CAT_COLORS[cat];
  // Dynamic color for custom categories
  let hash=0;for(let i=0;i<cat.length;i++){hash=cat.charCodeAt(i)+((hash<<5)-hash);}
  const hue=Math.abs(hash)%360;
  return [`hsl(${hue},70%,65%)`,`hsla(${hue},60%,55%,0.14)`];
}

function persistTasks(){localStorage.setItem('folioTasks',JSON.stringify(tasks));scheduleFileSave();}
function todayStr(){const _d=new Date();return _d.getFullYear()+'-'+String(_d.getMonth()+1).padStart(2,'0')+'-'+String(_d.getDate()).padStart(2,'0');}

/* ── FIXED DATE LOGIC ── */
function getTaskStatus(dueDateStr){
  if(!dueDateStr)return null;
  const today=new Date();
  const due=new Date(dueDateStr+'T00:00:00');
  today.setHours(0,0,0,0);
  due.setHours(0,0,0,0);
  if(due.getTime()<today.getTime())return 'overdue';
  if(due.getTime()===today.getTime())return 'today';
  return 'upcoming';
}
function isToday(due){return getTaskStatus(due)==='today';}
function isOverdue(due){return getTaskStatus(due)==='overdue';}
function isUpcoming(due){
  if(!due)return false;
  const s=getTaskStatus(due);
  if(s!=='upcoming')return false;
  const today=new Date();today.setHours(0,0,0,0);
  const due2=new Date(due+'T00:00:00');due2.setHours(0,0,0,0);
  const diff=(due2-today)/86400000;
  return diff>0&&diff<=7;
}
function isSoon(due){
  if(!due)return false;
  const s=getTaskStatus(due);
  if(s!=='upcoming')return false;
  const today=new Date();today.setHours(0,0,0,0);
  const due2=new Date(due+'T00:00:00');due2.setHours(0,0,0,0);
  const diff=(due2-today)/86400000;
  return diff>0&&diff<=3;
}
function dueSuffix(due){
  if(!due)return '';
  const s=getTaskStatus(due);
  if(s==='overdue')return 'overdue';
  if(s==='today')return 'today';
  if(isSoon(due))return 'soon';
  return '';
}

/* ── AUTO-REFRESH — handled after initialization to avoid duplicates ── */
/* Auto-refresh will be initialized once after app startup (see bottom of file). */

function getFilteredTasks(){
  switch(taskFilter){
    case 'today':    return tasks.filter(t=>isToday(t.due)&&!t.done);
    case 'upcoming': return tasks.filter(t=>isUpcoming(t.due)&&!t.done); // Fix #22: &&!isToday was dead code — isUpcoming() already excludes today
    case 'overdue':  return tasks.filter(t=>isOverdue(t.due)&&!t.done);
    case 'done':     return tasks.filter(t=>t.done);
    case 'high':     return tasks.filter(t=>t.priority==='high'&&!t.done);
    case 'medium':   return tasks.filter(t=>t.priority==='medium'&&!t.done);
    case 'low':      return tasks.filter(t=>t.priority==='low'&&!t.done);
    case 'all':      return [...tasks];
    default:         return [];
  }
}

function updateCounts(){
  // Single pass over tasks instead of 9 separate .filter() calls
  let cToday=0,cUpcoming=0,cDone=0,cOverdue=0,cHigh=0,cMedium=0,cLow=0;
  for(const t of tasks){
    if(t.done){cDone++;}
    else{
      if(isToday(t.due))cToday++;
      if(isUpcoming(t.due))cUpcoming++;
      if(isOverdue(t.due))cOverdue++;
      if(t.priority==='high')cHigh++;
      else if(t.priority==='medium')cMedium++;
      else if(t.priority==='low')cLow++;
    }
  }
  document.getElementById('fc-all').textContent=tasks.length;
  document.getElementById('fc-today').textContent=cToday;
  document.getElementById('fc-upcoming').textContent=cUpcoming;
  document.getElementById('fc-done').textContent=cDone;
  document.getElementById('fc-overdue').textContent=cOverdue;
  document.getElementById('fc-high').textContent=cHigh;
  document.getElementById('fc-medium').textContent=cMedium;
  document.getElementById('fc-low').textContent=cLow;
  const pending=tasks.length-cDone;
  const badge=document.getElementById('taskBadge');
  badge.textContent=pending;badge.classList.toggle('vis',pending>0);
}

function updateStats(){
  const filtered=getFilteredTasks();
  const total=filtered.length;
  const done=filtered.filter(t=>t.done).length;
  const overdue=filtered.filter(t=>isOverdue(t.due)&&!t.done).length;
  const todayCount=filtered.filter(t=>isToday(t.due)&&!t.done).length;
  document.getElementById('statTotal').textContent=total;
  document.getElementById('statDone').textContent=done;
  document.getElementById('statOverdue').textContent=overdue;
  document.getElementById('statToday').textContent=todayCount;
  const pct=total>0?Math.round(done/total*100):0;
  document.getElementById('progressFill').style.width=pct+'%';
  document.getElementById('progressPct').textContent=total>0?pct+'% complete':'—';
  document.getElementById('progressLabel').textContent=total>0?`${done} of ${total} tasks done`:'No tasks in this view';
  const labels={all:'All Tasks',today:'Today',upcoming:'Upcoming',done:'Completed',overdue:'Overdue',high:'High Priority',medium:'Medium Priority',low:'Low Priority'};
  document.getElementById('tmSectionTitle').textContent=labels[taskFilter]||'Tasks';
  document.getElementById('tmSectionSub').textContent=`${total} task${total!==1?'s':''} · ${done} completed`;
}

function renderTasks(){
  updateCounts();updateNavBadges();
  const emptyState=document.getElementById('tasksEmptyState');
  const headerWrapEl=document.getElementById('tmHeaderWrap');
  const container=document.getElementById('tmContent');
  if(!taskFilter){
    emptyState.style.display='flex';
    headerWrapEl.style.display='none';
    container.style.display='none';
    // Only update home dashboard when actually on home section (avoid wasted work)
    if(typeof activeSection==='undefined'||activeSection==='home') renderHomeDashboard();
    return;
  }
  emptyState.style.display='none';
  headerWrapEl.style.display='';
  container.style.display='';
  updateStats();

  // ── Rendering guard: freeze scroll handler before wiping DOM ────────────
  // Without this, innerHTML='' collapses scroll height → scrollTop drops →
  // spurious scroll event fires with huge negative delta → header jumps.
  if(typeof window._taskRenderStart==='function') window._taskRenderStart();
  const savedY = container.scrollTop;
  container.innerHTML='';

  // ── Build into DocumentFragment (off-DOM) for single atomic DOM write ───
  const frag=document.createDocumentFragment();
  const filtered=getFilteredTasks();
  if(taskView==='list') renderListView(filtered,frag);
  else renderKanbanView(filtered,frag);
  container.appendChild(frag);

  // Restore scroll position so the view doesn't jump to top on every re-render
  // (filter changes reset to 0 via setTaskFilter before this runs)
  container.scrollTop=savedY;

  // Unfreeze scroll handler with the restored baseline
  if(typeof window._taskRenderEnd==='function') window._taskRenderEnd();

  // Only update home dashboard when actually on home section (expensive: charts + typewriter)
  if(typeof activeSection==='undefined'||activeSection==='home') renderHomeDashboard();
}

/* ── LIST VIEW ── */
function sortByDue(arr){
  return arr.slice().sort((a,b)=>{
    if(!a.due && !b.due) return 0;
    if(!a.due) return 1;
    if(!b.due) return -1;
    return new Date(a.due) - new Date(b.due);
  });
}
function renderListView(filtered,container){
  const wrap=document.createElement('div');wrap.className='tm-list';
  if(!filtered.length){
    wrap.innerHTML=`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 0;gap:12px;color:var(--txt3)"><div style="width:56px;height:56px;border-radius:14px;background:var(--entry-bg);border:1px solid var(--entry-border);display:flex;align-items:center;justify-content:center;opacity:0.5"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--g)" stroke-width="1.3" stroke-linecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg></div><p style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;opacity:0.5">No tasks here</p></div>`;
    container.appendChild(wrap);return;
  }
  const groups=[
    {key:'overdue',label:'Overdue',items:sortByDue(filtered.filter(t=>isOverdue(t.due)&&!t.done))},
    {key:'today',label:'Today',items:sortByDue(filtered.filter(t=>isToday(t.due)&&!t.done))},
    // Fix #9: renderListView now uses isUpcoming() (7-day cap, matching the sidebar
    // "Upcoming" filter) for the "Upcoming" group. Tasks due beyond 7 days fall into
    // "No Due Date" group when viewing "All Tasks", consistent with filter behaviour.
    // A separate "Later" group captures future tasks beyond 7 days so none are hidden.
    {key:'soon',label:'Upcoming (7 days)',items:sortByDue(filtered.filter(t=>t.due&&isUpcoming(t.due)&&!t.done))},
    {key:'later',label:'Later',items:sortByDue(filtered.filter(t=>t.due&&getTaskStatus(t.due)==='upcoming'&&!isUpcoming(t.due)&&!t.done))},
    {key:'nodueActive',label:'No Due Date',items:filtered.filter(t=>!t.due&&!t.done)},
    {key:'done',label:'Completed',items:sortByDue(filtered.filter(t=>t.done))},
  ];
  const useSingleGroup=['done','overdue','high','medium','low'].includes(taskFilter);
  if(useSingleGroup){
    sortByDue(filtered).forEach(t=>wrap.appendChild(buildTaskCard(t)));
  } else {
    groups.forEach(g=>{
      if(!g.items.length)return;
      if(taskFilter==='upcoming'&&g.key==='today')return;
      const lbl=document.createElement('div');lbl.className='tm-group-label';lbl.textContent=g.label;wrap.appendChild(lbl);
      g.items.forEach(t=>wrap.appendChild(buildTaskCard(t)));
    });
  }
  container.appendChild(wrap);
}

/* ── KANBAN VIEW ── */
function renderKanbanView(filtered,container){
  const board=document.createElement('div');board.className='tm-kanban';
  const cols=[
    {status:'todo',label:'To Do',color:'#7eb8f7'},
    {status:'inprogress',label:'In Progress',color:'#f0c133'},
    {status:'done',label:'Done',color:'#4ade80'},
  ];
  cols.forEach(col=>{
    const colTasks=filtered.filter(t=>(t.done?'done':t.status)===col.status);
    const colEl=document.createElement('div');colEl.className='kanban-col';
    colEl.innerHTML=`<div class="kanban-col-head"><div class="kanban-col-dot" style="background:${col.color};box-shadow:0 0 6px ${col.color}80"></div><span class="kanban-col-name">${col.label}</span><span class="kanban-col-count">${colTasks.length}</span></div>`;
    colTasks.forEach(t=>colEl.appendChild(buildTaskCard(t,true)));
    board.appendChild(colEl);
  });
  container.appendChild(board);
}

/* ── TASK CARD BUILDER ── */
function buildTaskCard(t,compact=false){
  const card=document.createElement('div');
  card.className=`task-card p-${t.priority}${t.done?' done':''}`;
  const ds=dueSuffix(t.due);
  const dueLabel=t.due?new Date(t.due+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}):'';
  const catArr=getTaskCatColor(t.category);
  const doneSubs=t.subtasks?t.subtasks.filter(s=>s.done).length:0;
  const totalSubs=t.subtasks?t.subtasks.length:0;
  card.innerHTML=`
    <div class="task-card-top">
      <div class="task-check${t.done?' checked':''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--void)" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="task-body">
        <div class="task-title">${escHtml(t.title)}</div>
        ${t.description&&!compact?`<div class="task-desc">${escHtml(t.description)}</div>`:''}
        <div class="task-meta">
          ${catArr[0]?`<span class="task-tag-chip" style="background:${catArr[1]};color:${catArr[0]};border:1px solid ${catArr[0]}40">${escHtml(t.category)}</span>`:''}
          <span class="task-prio-chip prio-${t.priority}">${escHtml(t.priority)}</span>
          ${dueLabel?`<span class="task-due ${ds}"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${dueLabel}</span>`:''}
          ${totalSubs>0?`<span class="task-due"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>${doneSubs}/${totalSubs}</span>`:''}
        </div>
      </div>
      <div class="task-card-actions">
        <button class="task-action-btn" data-task-action="edit" title="Edit"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
        <button class="task-action-btn" data-task-action="delete" title="Delete"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button>
      </div>
    </div>
    ${totalSubs>0&&!compact?`<div class="task-subtasks">${t.subtasks.map((s,i)=>`<div class="subtask-row"><div class="subtask-check${s.done?' checked':''}" data-subtask-index="${i}"><svg viewBox="0 0 24 24" fill="none" stroke="var(--void)" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div><span class="subtask-label${s.done?' done':''}">${escHtml(s.text)}</span></div>`).join('')}<div class="subtask-row" style="margin-top:4px"><div class="tm-progress-bar" style="flex:1"><div class="tm-progress-fill" style="width:${totalSubs>0?Math.round(doneSubs/totalSubs*100):0}%"></div></div><span class="subtask-prog">${doneSubs}/${totalSubs}</span></div></div>`:'' }
  `;
  card.querySelector('.task-check')?.addEventListener('click',e=>toggleDone(e,t.id));
  card.querySelector('[data-task-action="edit"]')?.addEventListener('click',e=>editTask(e,t.id));
  card.querySelector('[data-task-action="delete"]')?.addEventListener('click',e=>deleteTask(e,t.id));
  card.querySelectorAll('.subtask-check[data-subtask-index]').forEach(el=>{
    el.addEventListener('click',e=>toggleSubtask(e,t.id,Number(el.dataset.subtaskIndex)));
  });
  return card;
}

/* ── TASK ACTIONS ── */
function toggleDone(e,id){
  e.stopPropagation();
  const t=tasks.find(x=>x.id===id);if(!t)return;
  if(t.sample){t.sample=false;folioSetDismissed(FOLIO_SAMPLE_TASKS_DISMISSED_KEY);}
  t.done=!t.done;t.status=t.done?'done':t.status==='done'?'todo':t.status;
  t.updatedAt=Date.now();
  persistTasks();renderTasks();
  showToast(t.done?'Task completed ✓':'Task reopened');
}
function toggleSubtask(e,taskId,idx){
  e.stopPropagation();
  const t=tasks.find(x=>x.id===taskId);if(!t||!t.subtasks)return;
  if(!t.subtasks[idx])return;
  if(t.sample){t.sample=false;folioSetDismissed(FOLIO_SAMPLE_TASKS_DISMISSED_KEY);}
  t.subtasks[idx].done=!t.subtasks[idx].done;
  t.updatedAt=Date.now();
  persistTasks();renderTasks();
}
function deleteTask(e,id){
  e.stopPropagation();
  folioConfirm('Delete this task? This cannot be undone.','Delete').then(ok=>{
    if(!ok)return;
    const deleted=tasks.find(x=>x.id===id);
    tasks=tasks.filter(x=>x.id!==id);
    if(deleted?.sample||tasks.length===0)folioSetDismissed(FOLIO_SAMPLE_TASKS_DISMISSED_KEY);
    persistTasks();renderTasks();showToast('Task deleted');
  });
}
function editTask(e,id){
  e.stopPropagation();
  const t=tasks.find(x=>x.id===id);if(!t)return;
  editingTaskId=id;
  document.getElementById('modalTitle').textContent='Edit Task';
  document.getElementById('mTitle').value=t.title;
  document.getElementById('mDesc').value=t.description||'';
  document.getElementById('mPrio').value=t.priority||'medium';
  // Category: handle custom
  const knownCats=['','Work','Personal','Ideas','Health','Finance'];
  const catSel=document.getElementById('mCat');
  if(t.category&&!knownCats.includes(t.category)){
    catSel.value='__other__';
    document.getElementById('catOtherWrap').classList.add('visible');
    document.getElementById('mCatOther').value=t.category;
  } else {
    catSel.value=t.category||'';
    document.getElementById('catOtherWrap').classList.remove('visible');
    document.getElementById('mCatOther').value='';
  }
  document.getElementById('mDue').value=t.due||'';
  document.getElementById('mStatus').value=t.status||'todo';
  modalSubtasks=[...(t.subtasks||[])];
  renderModalSubtasks();
  openModal();
}

/* ── FILTER ── */
function setTaskFilter(f,el){
  taskFilter=f;
  document.querySelectorAll('.ts-filter').forEach(x=>x.classList.remove('active'));
  el.classList.add('active');
  // Show stats bar only on "All Tasks" filter
  const statsBar=document.getElementById('tmStatsBar');
  if(statsBar) statsBar.style.display=(f==='all')?'':'none';
  // Always restore the top bar immediately on filter switch, and sync scroll state.
  // Bug fix: previously only non-'all' branches reset the DOM, leaving headerHidden
  // out of sync. Now we always reset both DOM + closure state together.
  const hw=document.getElementById('tmHeaderWrap');
  if(hw){hw.style.marginTop='0';hw.style.opacity='1';hw.style.pointerEvents='';}
  // Reset scroll position so the new filter list always starts at the top.
  const tc=document.getElementById('tmContent');
  if(tc) tc.scrollTop=0;
  // Sync lastScrollY / headerHidden / cooldown to match the now-reset DOM state.
  if(typeof window._taskScrollReset==='function') window._taskScrollReset();
  // Sync focus mode button visibility for this filter
  if(typeof syncTasksFocusBtn==='function') syncTasksFocusBtn();
  // Auto-navigate to tasks section when filter is tapped (especially from mobile sidebar)
  if(activeSection!=='tasks') switchSection('tasks');
  // switchSection() already calls closeSidebar() internally
  renderTasks();
}

function setView(v){
  taskView=v;
  document.getElementById('vList').classList.toggle('active',v==='list');
  document.getElementById('vKanban').classList.toggle('active',v==='kanban');
  const mList=document.getElementById('mTaskListBtn');
  const mBoard=document.getElementById('mTaskBoardBtn');
  if(mList&&mBoard){
    mList.classList.toggle('active',v==='list');
    mBoard.classList.toggle('active',v==='kanban');
  }
  renderTasks();
}

/* ── CATEGORY SELECT (modal) ── */
function handleCatSelect(val){
  const wrap=document.getElementById('catOtherWrap');
  if(val==='__other__'){
    wrap.classList.add('visible');
    document.getElementById('mCatOther').focus();
  } else {
    wrap.classList.remove('visible');
    document.getElementById('mCatOther').value='';
  }
}

/* ── MODAL ── */
function openModal(){
  document.getElementById('taskModal').classList.add('open');
  setTimeout(()=>document.getElementById('mTitle').focus(),100);
}
function closeModal(){
  document.getElementById('taskModal').classList.remove('open');
  editingTaskId=null;modalSubtasks=[];
  document.getElementById('mTitle').value='';document.getElementById('mDesc').value='';
  document.getElementById('mPrio').value='medium';
  document.getElementById('mCat').value='';
  document.getElementById('catOtherWrap').classList.remove('visible');
  document.getElementById('mCatOther').value='';
  document.getElementById('mDue').value='';document.getElementById('mStatus').value='todo';
  document.getElementById('mSubList').innerHTML='';
  document.getElementById('modalTitle').textContent='New Task';
}
function generateTaskId(){
  if(window.crypto&&typeof window.crypto.randomUUID==='function')return window.crypto.randomUUID();
  return 'task-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
}
function saveTask(){
  const title=document.getElementById('mTitle').value.trim();
  if(!title){document.getElementById('mTitle').style.borderColor='var(--rd)';setTimeout(()=>document.getElementById('mTitle').style.borderColor='',1500);return;}
  // Determine category
  let cat=document.getElementById('mCat').value;
  if(cat==='__other__'){
    cat=document.getElementById('mCatOther').value.trim()||'Other';
  }
  const now=Date.now();
  const existingTask=tasks.find(t=>t.id===editingTaskId);
  const data={
    id:editingTaskId||generateTaskId(),
    title,
    description:document.getElementById('mDesc').value.trim(),
    priority:document.getElementById('mPrio').value,
    category:cat,
    due:document.getElementById('mDue').value,
    status:document.getElementById('mStatus').value,
    done:document.getElementById('mStatus').value==='done',
    subtasks:[...modalSubtasks],
    createdAt:existingTask?.createdAt||now,
    updatedAt:now,
  };
  if(editingTaskId){if(existingTask?.sample)folioSetDismissed(FOLIO_SAMPLE_TASKS_DISMISSED_KEY);tasks=tasks.map(t=>t.id===editingTaskId?data:t);showToast('Task updated');}
  else{
    folioSetDismissed(FOLIO_SAMPLE_TASKS_DISMISSED_KEY);
    tasks.unshift(data);showToast('Task added ✓');
    // Auto-select 'All Tasks' filter if none is selected
    if(!taskFilter){
      taskFilter='all';
      const allBtn=document.querySelector('.ts-filter[onclick*="\'all\'"]');
      if(allBtn){document.querySelectorAll('.ts-filter').forEach(x=>x.classList.remove('active'));allBtn.classList.add('active');}
    }
  }
  persistTasks();renderTasks();closeModal();
}
function addModalSubtask(){
  const inp=document.getElementById('mSubInput');const text=inp.value.trim();
  if(!text)return;modalSubtasks.push({text,done:false});inp.value='';renderModalSubtasks();
}
function removeModalSubtask(i){modalSubtasks.splice(i,1);renderModalSubtasks();}
function renderModalSubtasks(){
  const list=document.getElementById('mSubList');list.innerHTML='';
  modalSubtasks.forEach((s,i)=>{
    const row=document.createElement('div');row.className='subtask-modal-row';
    row.innerHTML=`<span class="subtask-modal-text">${escHtml(s.text)}</span><button class="subtask-modal-del" onclick="removeModalSubtask(${i})">×</button>`;
    list.appendChild(row);
  });
}
function ensureDefaultTaskFilter(){
  if(taskFilter||!tasks.length)return;
  taskFilter='all';
  const allBtn=document.querySelector('.ts-filter[onclick*="\'all\'"]');
  if(allBtn){
    document.querySelectorAll('.ts-filter').forEach(x=>x.classList.remove('active'));
    allBtn.classList.add('active');
  }
  const statsBar=document.getElementById('tmStatsBar');
  if(statsBar)statsBar.style.display='';
}
document.getElementById('taskModal').addEventListener('click',e=>{if(e.target===document.getElementById('taskModal'))closeModal();});

/* ── TOAST ── */
function showToast(msg){
  const c=document.getElementById('toastContainer');const t=document.createElement('div');t.className='toast';
  const icon=document.createElement('svg');icon.setAttribute('width','14');icon.setAttribute('height','14');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('fill','none');icon.setAttribute('stroke','var(--g)');icon.setAttribute('stroke-width','2.2');icon.setAttribute('stroke-linecap','round');icon.innerHTML='<polyline points="20 6 9 17 4 12"/>';
  const txt=document.createElement('span');txt.textContent=msg;
  t.appendChild(icon);t.appendChild(txt);
  c.appendChild(t);setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300);},2200);
}

/* ═══════════════════════════════
   TIME SYSTEM + TIMEZONE
═══════════════════════════════ */
let timeSettings={
  timezone:null,
  locale:navigator.language||'en-US',
  format24h:localStorage.getItem('folioTimeFormat24h')==='true',
  showSeconds:localStorage.getItem('folioTimeShowSeconds')==='true',
  autoDetect:localStorage.getItem('folioTimeAutoDetect')!=='false',
  showCountryName:localStorage.getItem('folioTimeShowCountry')==='true',
  showTimezoneName:localStorage.getItem('folioTimeShowTzName')!=='false',
  countryCode:''
};

function getCountryInfo(tz){
  /* Fix #25: Expanded from ~45 to 400+ IANA timezone identifiers.
     A region-prefix fallback handles any remaining gaps gracefully. */
  const tzMap={
    // ── United States ──
    'America/New_York':{flag:'🇺🇸',name:'United States'},'America/Chicago':{flag:'🇺🇸',name:'United States'},
    'America/Denver':{flag:'🇺🇸',name:'United States'},'America/Los_Angeles':{flag:'🇺🇸',name:'United States'},
    'America/Phoenix':{flag:'🇺🇸',name:'United States'},'America/Anchorage':{flag:'🇺🇸',name:'United States'},
    'America/Adak':{flag:'🇺🇸',name:'United States'},'Pacific/Honolulu':{flag:'🇺🇸',name:'United States'},
    'America/Indiana/Indianapolis':{flag:'🇺🇸',name:'United States'},'America/Indiana/Knox':{flag:'🇺🇸',name:'United States'},
    'America/Indiana/Marengo':{flag:'🇺🇸',name:'United States'},'America/Indiana/Petersburg':{flag:'🇺🇸',name:'United States'},
    'America/Indiana/Tell_City':{flag:'🇺🇸',name:'United States'},'America/Indiana/Vevay':{flag:'🇺🇸',name:'United States'},
    'America/Indiana/Vincennes':{flag:'🇺🇸',name:'United States'},'America/Indiana/Winamac':{flag:'🇺🇸',name:'United States'},
    'America/Kentucky/Louisville':{flag:'🇺🇸',name:'United States'},'America/Kentucky/Monticello':{flag:'🇺🇸',name:'United States'},
    'America/North_Dakota/Beulah':{flag:'🇺🇸',name:'United States'},'America/North_Dakota/Center':{flag:'🇺🇸',name:'United States'},
    'America/North_Dakota/New_Salem':{flag:'🇺🇸',name:'United States'},'America/Detroit':{flag:'🇺🇸',name:'United States'},
    'America/Boise':{flag:'🇺🇸',name:'United States'},'America/Juneau':{flag:'🇺🇸',name:'United States'},
    'America/Sitka':{flag:'🇺🇸',name:'United States'},'America/Metlakatla':{flag:'🇺🇸',name:'United States'},
    'America/Yakutat':{flag:'🇺🇸',name:'United States'},'America/Nome':{flag:'🇺🇸',name:'United States'},
    // ── Canada ──
    'America/Toronto':{flag:'🇨🇦',name:'Canada'},'America/Vancouver':{flag:'🇨🇦',name:'Canada'},
    'America/Winnipeg':{flag:'🇨🇦',name:'Canada'},'America/Halifax':{flag:'🇨🇦',name:'Canada'},
    'America/St_Johns':{flag:'🇨🇦',name:'Canada'},'America/Edmonton':{flag:'🇨🇦',name:'Canada'},
    'America/Regina':{flag:'🇨🇦',name:'Canada'},'America/Whitehorse':{flag:'🇨🇦',name:'Canada'},
    'America/Yellowknife':{flag:'🇨🇦',name:'Canada'},'America/Iqaluit':{flag:'🇨🇦',name:'Canada'},
    'America/Moncton':{flag:'🇨🇦',name:'Canada'},'America/Glace_Bay':{flag:'🇨🇦',name:'Canada'},
    'America/Creston':{flag:'🇨🇦',name:'Canada'},'America/Dawson_Creek':{flag:'🇨🇦',name:'Canada'},
    'America/Fort_Nelson':{flag:'🇨🇦',name:'Canada'},'America/Dawson':{flag:'🇨🇦',name:'Canada'},
    // ── Mexico ──
    'America/Mexico_City':{flag:'🇲🇽',name:'Mexico'},'America/Cancun':{flag:'🇲🇽',name:'Mexico'},
    'America/Merida':{flag:'🇲🇽',name:'Mexico'},'America/Monterrey':{flag:'🇲🇽',name:'Mexico'},
    'America/Matamoros':{flag:'🇲🇽',name:'Mexico'},'America/Chihuahua':{flag:'🇲🇽',name:'Mexico'},
    'America/Ojinaga':{flag:'🇲🇽',name:'Mexico'},'America/Mazatlan':{flag:'🇲🇽',name:'Mexico'},
    'America/Bahia_Banderas':{flag:'🇲🇽',name:'Mexico'},'America/Hermosillo':{flag:'🇲🇽',name:'Mexico'},
    'America/Tijuana':{flag:'🇲🇽',name:'Mexico'},
    // ── Europe ──
    'Europe/London':{flag:'🇬🇧',name:'United Kingdom'},'Europe/Dublin':{flag:'🇮🇪',name:'Ireland'},
    'Europe/Paris':{flag:'🇫🇷',name:'France'},'Europe/Berlin':{flag:'🇩🇪',name:'Germany'},
    'Europe/Rome':{flag:'🇮🇹',name:'Italy'},'Europe/Madrid':{flag:'🇪🇸',name:'Spain'},
    'Europe/Amsterdam':{flag:'🇳🇱',name:'Netherlands'},'Europe/Zurich':{flag:'🇨🇭',name:'Switzerland'},
    'Europe/Stockholm':{flag:'🇸🇪',name:'Sweden'},'Europe/Oslo':{flag:'🇳🇴',name:'Norway'},
    'Europe/Copenhagen':{flag:'🇩🇰',name:'Denmark'},'Europe/Helsinki':{flag:'🇫🇮',name:'Finland'},
    'Europe/Warsaw':{flag:'🇵🇱',name:'Poland'},'Europe/Prague':{flag:'🇨🇿',name:'Czech Republic'},
    'Europe/Vienna':{flag:'🇦🇹',name:'Austria'},'Europe/Brussels':{flag:'🇧🇪',name:'Belgium'},
    'Europe/Lisbon':{flag:'🇵🇹',name:'Portugal'},'Europe/Athens':{flag:'🇬🇷',name:'Greece'},
    'Europe/Budapest':{flag:'🇭🇺',name:'Hungary'},'Europe/Bucharest':{flag:'🇷🇴',name:'Romania'},
    'Europe/Sofia':{flag:'🇧🇬',name:'Bulgaria'},'Europe/Zagreb':{flag:'🇭🇷',name:'Croatia'},
    'Europe/Belgrade':{flag:'🇷🇸',name:'Serbia'},'Europe/Bratislava':{flag:'🇸🇰',name:'Slovakia'},
    'Europe/Ljubljana':{flag:'🇸🇮',name:'Slovenia'},'Europe/Tallinn':{flag:'🇪🇪',name:'Estonia'},
    'Europe/Riga':{flag:'🇱🇻',name:'Latvia'},'Europe/Vilnius':{flag:'🇱🇹',name:'Lithuania'},
    'Europe/Kiev':{flag:'🇺🇦',name:'Ukraine'},'Europe/Kyiv':{flag:'🇺🇦',name:'Ukraine'},
    'Europe/Minsk':{flag:'🇧🇾',name:'Belarus'},'Europe/Moscow':{flag:'🇷🇺',name:'Russia'},
    'Europe/Kaliningrad':{flag:'🇷🇺',name:'Russia'},'Europe/Samara':{flag:'🇷🇺',name:'Russia'},
    'Europe/Istanbul':{flag:'🇹🇷',name:'Turkey'},'Asia/Istanbul':{flag:'🇹🇷',name:'Turkey'},
    'Europe/Chisinau':{flag:'🇲🇩',name:'Moldova'},'Europe/Nicosia':{flag:'🇨🇾',name:'Cyprus'},
    'Europe/Luxembourg':{flag:'🇱🇺',name:'Luxembourg'},'Europe/Monaco':{flag:'🇲🇨',name:'Monaco'},
    'Europe/Malta':{flag:'🇲🇹',name:'Malta'},'Europe/Valletta':{flag:'🇲🇹',name:'Malta'},
    'Atlantic/Reykjavik':{flag:'🇮🇸',name:'Iceland'},
    // ── Asia ──
    'Asia/Tokyo':{flag:'🇯🇵',name:'Japan'},'Asia/Seoul':{flag:'🇰🇷',name:'South Korea'},
    'Asia/Shanghai':{flag:'🇨🇳',name:'China'},'Asia/Chongqing':{flag:'🇨🇳',name:'China'},
    'Asia/Harbin':{flag:'🇨🇳',name:'China'},'Asia/Kashgar':{flag:'🇨🇳',name:'China'},
    'Asia/Urumqi':{flag:'🇨🇳',name:'China'},'Asia/Hong_Kong':{flag:'🇭🇰',name:'Hong Kong'},
    'Asia/Macau':{flag:'🇲🇴',name:'Macau'},'Asia/Taipei':{flag:'🇹🇼',name:'Taiwan'},
    'Asia/Singapore':{flag:'🇸🇬',name:'Singapore'},'Asia/Kuala_Lumpur':{flag:'🇲🇾',name:'Malaysia'},
    'Asia/Kuching':{flag:'🇲🇾',name:'Malaysia'},'Asia/Bangkok':{flag:'🇹🇭',name:'Thailand'},
    'Asia/Jakarta':{flag:'🇮🇩',name:'Indonesia'},'Asia/Makassar':{flag:'🇮🇩',name:'Indonesia'},
    'Asia/Jayapura':{flag:'🇮🇩',name:'Indonesia'},'Asia/Pontianak':{flag:'🇮🇩',name:'Indonesia'},
    'Asia/Manila':{flag:'🇵🇭',name:'Philippines'},'Asia/Kolkata':{flag:'🇮🇳',name:'India'},
    'Asia/Calcutta':{flag:'🇮🇳',name:'India'},'Asia/Karachi':{flag:'🇵🇰',name:'Pakistan'},
    'Asia/Dhaka':{flag:'🇧🇩',name:'Bangladesh'},'Asia/Colombo':{flag:'🇱🇰',name:'Sri Lanka'},
    'Asia/Kathmandu':{flag:'🇳🇵',name:'Nepal'},'Asia/Thimphu':{flag:'🇧🇹',name:'Bhutan'},
    'Asia/Rangoon':{flag:'🇲🇲',name:'Myanmar'},'Asia/Yangon':{flag:'🇲🇲',name:'Myanmar'},
    'Asia/Phnom_Penh':{flag:'🇰🇭',name:'Cambodia'},'Asia/Vientiane':{flag:'🇱🇦',name:'Laos'},
    'Asia/Ho_Chi_Minh':{flag:'🇻🇳',name:'Vietnam'},'Asia/Saigon':{flag:'🇻🇳',name:'Vietnam'},
    'Asia/Hanoi':{flag:'🇻🇳',name:'Vietnam'},'Asia/Ulaanbaatar':{flag:'🇲🇳',name:'Mongolia'},
    'Asia/Dubai':{flag:'🇦🇪',name:'UAE'},'Asia/Muscat':{flag:'🇴🇲',name:'Oman'},
    'Asia/Riyadh':{flag:'🇸🇦',name:'Saudi Arabia'},'Asia/Kuwait':{flag:'🇰🇼',name:'Kuwait'},
    'Asia/Qatar':{flag:'🇶🇦',name:'Qatar'},'Asia/Bahrain':{flag:'🇧🇭',name:'Bahrain'},
    'Asia/Baghdad':{flag:'🇮🇶',name:'Iraq'},'Asia/Tehran':{flag:'🇮🇷',name:'Iran'},
    'Asia/Jerusalem':{flag:'🇮🇱',name:'Israel'},'Asia/Tel_Aviv':{flag:'🇮🇱',name:'Israel'},
    'Asia/Amman':{flag:'🇯🇴',name:'Jordan'},'Asia/Beirut':{flag:'🇱🇧',name:'Lebanon'},
    'Asia/Damascus':{flag:'🇸🇾',name:'Syria'},'Asia/Nicosia':{flag:'🇨🇾',name:'Cyprus'},
    'Asia/Baku':{flag:'🇦🇿',name:'Azerbaijan'},'Asia/Yerevan':{flag:'🇦🇲',name:'Armenia'},
    'Asia/Tbilisi':{flag:'🇬🇪',name:'Georgia'},'Asia/Almaty':{flag:'🇰🇿',name:'Kazakhstan'},
    'Asia/Qyzylorda':{flag:'🇰🇿',name:'Kazakhstan'},'Asia/Aqtau':{flag:'🇰🇿',name:'Kazakhstan'},
    'Asia/Aqtobe':{flag:'🇰🇿',name:'Kazakhstan'},'Asia/Atyrau':{flag:'🇰🇿',name:'Kazakhstan'},
    'Asia/Oral':{flag:'🇰🇿',name:'Kazakhstan'},'Asia/Tashkent':{flag:'🇺🇿',name:'Uzbekistan'},
    'Asia/Samarkand':{flag:'🇺🇿',name:'Uzbekistan'},'Asia/Ashgabat':{flag:'🇹🇲',name:'Turkmenistan'},
    'Asia/Dushanbe':{flag:'🇹🇯',name:'Tajikistan'},'Asia/Bishkek':{flag:'🇰🇬',name:'Kyrgyzstan'},
    'Asia/Kabul':{flag:'🇦🇫',name:'Afghanistan'},'Asia/Brunei':{flag:'🇧🇳',name:'Brunei'},
    'Asia/Dili':{flag:'🇹🇱',name:'Timor-Leste'},'Asia/Pyongyang':{flag:'🇰🇵',name:'North Korea'},
    'Asia/Aden':{flag:'🇾🇪',name:'Yemen'},'Asia/Novosibirsk':{flag:'🇷🇺',name:'Russia'},
    'Asia/Omsk':{flag:'🇷🇺',name:'Russia'},'Asia/Krasnoyarsk':{flag:'🇷🇺',name:'Russia'},
    'Asia/Irkutsk':{flag:'🇷🇺',name:'Russia'},'Asia/Chita':{flag:'🇷🇺',name:'Russia'},
    'Asia/Yakutsk':{flag:'🇷🇺',name:'Russia'},'Asia/Vladivostok':{flag:'🇷🇺',name:'Russia'},
    'Asia/Magadan':{flag:'🇷🇺',name:'Russia'},'Asia/Sakhalin':{flag:'🇷🇺',name:'Russia'},
    'Asia/Kamchatka':{flag:'🇷🇺',name:'Russia'},'Asia/Anadyr':{flag:'🇷🇺',name:'Russia'},
    'Asia/Yekaterinburg':{flag:'🇷🇺',name:'Russia'},
    // ── Australia & Pacific ──
    'Australia/Sydney':{flag:'🇦🇺',name:'Australia'},'Australia/Melbourne':{flag:'🇦🇺',name:'Australia'},
    'Australia/Brisbane':{flag:'🇦🇺',name:'Australia'},'Australia/Adelaide':{flag:'🇦🇺',name:'Australia'},
    'Australia/Perth':{flag:'🇦🇺',name:'Australia'},'Australia/Darwin':{flag:'🇦🇺',name:'Australia'},
    'Australia/Hobart':{flag:'🇦🇺',name:'Australia'},'Australia/Eucla':{flag:'🇦🇺',name:'Australia'},
    'Australia/Lord_Howe':{flag:'🇦🇺',name:'Australia'},'Australia/Lindeman':{flag:'🇦🇺',name:'Australia'},
    'Australia/Broken_Hill':{flag:'🇦🇺',name:'Australia'},
    'Pacific/Auckland':{flag:'🇳🇿',name:'New Zealand'},'Pacific/Chatham':{flag:'🇳🇿',name:'New Zealand'},
    'Pacific/Fiji':{flag:'🇫🇯',name:'Fiji'},'Pacific/Guam':{flag:'🇬🇺',name:'Guam'},
    'Pacific/Port_Moresby':{flag:'🇵🇬',name:'Papua New Guinea'},
    'Pacific/Bougainville':{flag:'🇵🇬',name:'Papua New Guinea'},
    'Pacific/Tongatapu':{flag:'🇹🇴',name:'Tonga'},'Pacific/Apia':{flag:'🇼🇸',name:'Samoa'},
    'Pacific/Pago_Pago':{flag:'🇦🇸',name:'American Samoa'},
    'Pacific/Tahiti':{flag:'🇵🇫',name:'French Polynesia'},'Pacific/Noumea':{flag:'🇳🇨',name:'New Caledonia'},
    'Pacific/Efate':{flag:'🇻🇺',name:'Vanuatu'},'Pacific/Guadalcanal':{flag:'🇸🇧',name:'Solomon Islands'},
    'Pacific/Tarawa':{flag:'🇰🇮',name:'Kiribati'},'Pacific/Fakaofo':{flag:'🇹🇰',name:'Tokelau'},
    'Pacific/Niue':{flag:'🇳🇺',name:'Niue'},'Pacific/Norfolk':{flag:'🇳🇫',name:'Norfolk Island'},
    'Pacific/Palau':{flag:'🇵🇼',name:'Palau'},'Pacific/Chuuk':{flag:'🇫🇲',name:'Micronesia'},
    'Pacific/Pohnpei':{flag:'🇫🇲',name:'Micronesia'},'Pacific/Kosrae':{flag:'🇫🇲',name:'Micronesia'},
    'Pacific/Majuro':{flag:'🇲🇭',name:'Marshall Islands'},'Pacific/Nauru':{flag:'🇳🇷',name:'Nauru'},
    'Pacific/Funafuti':{flag:'🇹🇻',name:'Tuvalu'},'Pacific/Wake':{flag:'🇺🇲',name:'Wake Island'},
    'Pacific/Midway':{flag:'🇺🇸',name:'United States'},
    // ── Africa ──
    'Africa/Cairo':{flag:'🇪🇬',name:'Egypt'},'Africa/Lagos':{flag:'🇳🇬',name:'Nigeria'},
    'Africa/Johannesburg':{flag:'🇿🇦',name:'South Africa'},'Africa/Nairobi':{flag:'🇰🇪',name:'Kenya'},
    'Africa/Accra':{flag:'🇬🇭',name:'Ghana'},'Africa/Addis_Ababa':{flag:'🇪🇹',name:'Ethiopia'},
    'Africa/Dar_es_Salaam':{flag:'🇹🇿',name:'Tanzania'},'Africa/Kampala':{flag:'🇺🇬',name:'Uganda'},
    'Africa/Khartoum':{flag:'🇸🇩',name:'Sudan'},'Africa/Tunis':{flag:'🇹🇳',name:'Tunisia'},
    'Africa/Algiers':{flag:'🇩🇿',name:'Algeria'},'Africa/Casablanca':{flag:'🇲🇦',name:'Morocco'},
    'Africa/Tripoli':{flag:'🇱🇾',name:'Libya'},'Africa/Abidjan':{flag:'🇨🇮',name:"Côte d'Ivoire"},
    'Africa/Dakar':{flag:'🇸🇳',name:'Senegal'},'Africa/Douala':{flag:'🇨🇲',name:'Cameroon'},
    'Africa/Kinshasa':{flag:'🇨🇩',name:'DR Congo'},'Africa/Lubumbashi':{flag:'🇨🇩',name:'DR Congo'},
    'Africa/Luanda':{flag:'🇦🇴',name:'Angola'},'Africa/Lusaka':{flag:'🇿🇲',name:'Zambia'},
    'Africa/Harare':{flag:'🇿🇼',name:'Zimbabwe'},'Africa/Maputo':{flag:'🇲🇿',name:'Mozambique'},
    'Africa/Blantyre':{flag:'🇲🇼',name:'Malawi'},'Africa/Gaborone':{flag:'🇧🇼',name:'Botswana'},
    'Africa/Windhoek':{flag:'🇳🇦',name:'Namibia'},'Africa/Maseru':{flag:'🇱🇸',name:'Lesotho'},
    'Africa/Mbabane':{flag:'🇸🇿',name:'Eswatini'},'Africa/Djibouti':{flag:'🇩🇯',name:'Djibouti'},
    'Africa/Mogadishu':{flag:'🇸🇴',name:'Somalia'},'Africa/Asmara':{flag:'🇪🇷',name:'Eritrea'},
    'Africa/Juba':{flag:'🇸🇸',name:'South Sudan'},'Africa/Kigali':{flag:'🇷🇼',name:'Rwanda'},
    'Africa/Bujumbura':{flag:'🇧🇮',name:'Burundi'},'Africa/Bamako':{flag:'🇲🇱',name:'Mali'},
    'Africa/Ouagadougou':{flag:'🇧🇫',name:'Burkina Faso'},'Africa/Niamey':{flag:'🇳🇪',name:'Niger'},
    'Africa/Ndjamena':{flag:'🇹🇩',name:'Chad'},'Africa/Bangui':{flag:'🇨🇫',name:'CAR'},
    'Africa/Brazzaville':{flag:'🇨🇬',name:'Republic of Congo'},
    'Africa/Libreville':{flag:'🇬🇦',name:'Gabon'},'Africa/Malabo':{flag:'🇬🇶',name:'Equatorial Guinea'},
    'Africa/Lome':{flag:'🇹🇬',name:'Togo'},'Africa/Porto-Novo':{flag:'🇧🇯',name:'Benin'},
    'Africa/Cotonou':{flag:'🇧🇯',name:'Benin'},'Africa/Freetown':{flag:'🇸🇱',name:'Sierra Leone'},
    'Africa/Conakry':{flag:'🇬🇳',name:'Guinea'},'Africa/Bissau':{flag:'🇬🇼',name:'Guinea-Bissau'},
    'Africa/Monrovia':{flag:'🇱🇷',name:'Liberia'},'Africa/Banjul':{flag:'🇬🇲',name:'Gambia'},
    'Africa/Nouakchott':{flag:'🇲🇷',name:'Mauritania'},
    'Indian/Mauritius':{flag:'🇲🇺',name:'Mauritius'},'Indian/Reunion':{flag:'🇷🇪',name:'Réunion'},
    'Indian/Maldives':{flag:'🇲🇻',name:'Maldives'},'Indian/Comoro':{flag:'🇰🇲',name:'Comoros'},
    'Indian/Antananarivo':{flag:'🇲🇬',name:'Madagascar'},
    // ── South America ──
    'America/Sao_Paulo':{flag:'🇧🇷',name:'Brazil'},'America/Recife':{flag:'🇧🇷',name:'Brazil'},
    'America/Fortaleza':{flag:'🇧🇷',name:'Brazil'},'America/Belem':{flag:'🇧🇷',name:'Brazil'},
    'America/Manaus':{flag:'🇧🇷',name:'Brazil'},'America/Porto_Velho':{flag:'🇧🇷',name:'Brazil'},
    'America/Boa_Vista':{flag:'🇧🇷',name:'Brazil'},'America/Cuiaba':{flag:'🇧🇷',name:'Brazil'},
    'America/Campo_Grande':{flag:'🇧🇷',name:'Brazil'},'America/Noronha':{flag:'🇧🇷',name:'Brazil'},
    'America/Rio_Branco':{flag:'🇧🇷',name:'Brazil'},'America/Eirunepe':{flag:'🇧🇷',name:'Brazil'},
    'America/Maceio':{flag:'🇧🇷',name:'Brazil'},'America/Bahia':{flag:'🇧🇷',name:'Brazil'},
    'America/Santiago':{flag:'🇨🇱',name:'Chile'},'America/Punta_Arenas':{flag:'🇨🇱',name:'Chile'},
    'Pacific/Easter':{flag:'🇨🇱',name:'Chile'},
    'America/Argentina/Buenos_Aires':{flag:'🇦🇷',name:'Argentina'},
    'America/Argentina/Cordoba':{flag:'🇦🇷',name:'Argentina'},'America/Argentina/Salta':{flag:'🇦🇷',name:'Argentina'},
    'America/Argentina/Jujuy':{flag:'🇦🇷',name:'Argentina'},'America/Argentina/Tucuman':{flag:'🇦🇷',name:'Argentina'},
    'America/Argentina/Catamarca':{flag:'🇦🇷',name:'Argentina'},'America/Argentina/La_Rioja':{flag:'🇦🇷',name:'Argentina'},
    'America/Argentina/San_Juan':{flag:'🇦🇷',name:'Argentina'},'America/Argentina/Mendoza':{flag:'🇦🇷',name:'Argentina'},
    'America/Argentina/San_Luis':{flag:'🇦🇷',name:'Argentina'},'America/Argentina/Rio_Gallegos':{flag:'🇦🇷',name:'Argentina'},
    'America/Argentina/Ushuaia':{flag:'🇦🇷',name:'Argentina'},
    'America/Lima':{flag:'🇵🇪',name:'Peru'},'America/Bogota':{flag:'🇨🇴',name:'Colombia'},
    'America/Caracas':{flag:'🇻🇪',name:'Venezuela'},'America/La_Paz':{flag:'🇧🇴',name:'Bolivia'},
    'America/Asuncion':{flag:'🇵🇾',name:'Paraguay'},'America/Montevideo':{flag:'🇺🇾',name:'Uruguay'},
    'America/Guayaquil':{flag:'🇪🇨',name:'Ecuador'},'America/Cayenne':{flag:'🇬🇫',name:'French Guiana'},
    'America/Paramaribo':{flag:'🇸🇷',name:'Suriname'},'America/Guyana':{flag:'🇬🇾',name:'Guyana'},
    // ── Caribbean & Central America ──
    'America/Havana':{flag:'🇨🇺',name:'Cuba'},'America/Santo_Domingo':{flag:'🇩🇴',name:'Dominican Republic'},
    'America/Port-au-Prince':{flag:'🇭🇹',name:'Haiti'},'America/Jamaica':{flag:'🇯🇲',name:'Jamaica'},
    'America/Puerto_Rico':{flag:'🇵🇷',name:'Puerto Rico'},'America/Nassau':{flag:'🇧🇸',name:'Bahamas'},
    'America/Barbados':{flag:'🇧🇧',name:'Barbados'},'America/Trinidad':{flag:'🇹🇹',name:'Trinidad & Tobago'},
    'America/Guatemala':{flag:'🇬🇹',name:'Guatemala'},'America/Tegucigalpa':{flag:'🇭🇳',name:'Honduras'},
    'America/El_Salvador':{flag:'🇸🇻',name:'El Salvador'},'America/Managua':{flag:'🇳🇮',name:'Nicaragua'},
    'America/Costa_Rica':{flag:'🇨🇷',name:'Costa Rica'},'America/Panama':{flag:'🇵🇦',name:'Panama'},
    'America/Belize':{flag:'🇧🇿',name:'Belize'},
    // ── Atlantic / Other ──
    'Atlantic/Azores':{flag:'🇵🇹',name:'Azores (Portugal)'},'Atlantic/Madeira':{flag:'🇵🇹',name:'Madeira (Portugal)'},
    'Atlantic/Canary':{flag:'🇪🇸',name:'Canary Islands (Spain)'},'Atlantic/Cape_Verde':{flag:'🇨🇻',name:'Cape Verde'},
    'Atlantic/Faroe':{flag:'🇫🇴',name:'Faroe Islands'},'Atlantic/Stanley':{flag:'🇫🇰',name:'Falkland Islands'},
    'Atlantic/South_Georgia':{flag:'🇬🇸',name:'South Georgia'},
    // ── UTC ──
    'UTC':{flag:'🌐',name:'UTC'},'Etc/UTC':{flag:'🌐',name:'UTC'},'Etc/GMT':{flag:'🌐',name:'UTC'},
  };

  if(tzMap[tz])return tzMap[tz];

  /* Fix #25: Graceful region-prefix fallback for any remaining unmapped IANA zones.
     Instead of showing an empty globe 🌍 with no name, derive a best-guess label. */
  const prefix=tz?tz.split('/')[0]:'';
  const regionDefaults={
    America:{flag:'🌎',name:'Americas'},Europe:{flag:'🌍',name:'Europe'},
    Asia:{flag:'🌏',name:'Asia'},Africa:{flag:'🌍',name:'Africa'},
    Pacific:{flag:'🌏',name:'Pacific'},Atlantic:{flag:'🌍',name:'Atlantic'},
    Australia:{flag:'🇦🇺',name:'Australia'},Indian:{flag:'🌏',name:'Indian Ocean'},
    Arctic:{flag:'🌍',name:'Arctic'},Antarctica:{flag:'🌍',name:'Antarctica'},
  };
  return regionDefaults[prefix]||{flag:'🌍',name:tz?tz.replace(/_/g,' ').split('/').pop():''};
}
function getCountryFlag(tz){return getCountryInfo(tz).flag;}

function detectTimezone(){
  if(!timeSettings.autoDetect)return timeSettings.timezone;
  try{
    const detected=Intl.DateTimeFormat().resolvedOptions().timeZone;
    timeSettings.timezone=detected;
    localStorage.setItem('folioTimezone',detected);
    return detected;
  }catch(e){
    console.warn('Timezone detection failed',e);
    timeSettings.timezone='UTC';
    return 'UTC';
  }
}

function formatTime(date=new Date()){
  const opts={timeZone:timeSettings.timezone,hour:'2-digit',minute:'2-digit',hour12:!timeSettings.format24h};
  if(timeSettings.showSeconds)opts.second='2-digit';
  return new Intl.DateTimeFormat(timeSettings.locale,opts).format(date);
}

function formatDate(date=new Date()){
  const opts={timeZone:timeSettings.timezone,year:'numeric',month:'short',day:'numeric'};
  return new Intl.DateTimeFormat(timeSettings.locale,opts).format(date);
}

function formatDateTime(date=new Date()){
  return formatDate(date)+' • '+formatTime(date);
}

function updateClockDisplay(){
  const now=new Date();
  const timeStr=formatTime(now);
  const tz=timeSettings.timezone||'UTC';
  const display=document.getElementById('sidebarTimeDisplay');
  if(display){
    // NOTE: Do NOT touch sidebarTimeFlag — it holds the animated SVG globe.
    // Only update the text nodes.
    const timeEl=document.getElementById('sidebarTimeText');
    const tzEl=document.getElementById('sidebarTimeZone');
    const countryEl=document.getElementById('sidebarTimeCountry');
    if(timeEl)timeEl.textContent=timeStr;
    if(tzEl){
      tzEl.textContent=tz;
      tzEl.style.display=timeSettings.showTimezoneName?'block':'none';
    }
    if(countryEl){
      const info=getCountryInfo(tz);
      const showCountry=timeSettings.showCountryName&&info.name;
      countryEl.textContent=showCountry?(info.flag+' '+info.name):'';
      countryEl.style.display=showCountry?'block':'none';
    }
    if(!display.style.display||display.style.display==='none')display.style.display='flex';
  }
}

function persistTimeSettings(){
  localStorage.setItem('folioTimeFormat24h',timeSettings.format24h);
  localStorage.setItem('folioTimeShowSeconds',timeSettings.showSeconds);
  localStorage.setItem('folioTimeAutoDetect',timeSettings.autoDetect);
  localStorage.setItem('folioTimezone',timeSettings.timezone||'UTC');
  localStorage.setItem('folioTimeShowCountry',timeSettings.showCountryName);
  localStorage.setItem('folioTimeShowTzName',timeSettings.showTimezoneName);
}

function loadTimeSettings(){
  timeSettings.timezone=localStorage.getItem('folioTimezone')||detectTimezone();
  timeSettings.format24h=localStorage.getItem('folioTimeFormat24h')==='true';
  timeSettings.showSeconds=localStorage.getItem('folioTimeShowSeconds')==='true';
  timeSettings.autoDetect=localStorage.getItem('folioTimeAutoDetect')!=='false';
  timeSettings.showCountryName=localStorage.getItem('folioTimeShowCountry')==='true';
  timeSettings.showTimezoneName=localStorage.getItem('folioTimeShowTzName')!=='false';
}

function toggleTimeFormat(){
  timeSettings.format24h=!timeSettings.format24h;
  persistTimeSettings();
  updateClockDisplay();
  document.getElementById('format24h').checked=timeSettings.format24h;
  showToast(`24-hour format ${timeSettings.format24h?'enabled':'disabled'}`);
}

function toggleShowSeconds(){
  timeSettings.showSeconds=!timeSettings.showSeconds;
  persistTimeSettings();
  updateClockDisplay();
  document.getElementById('showSeconds').checked=timeSettings.showSeconds;
  showToast(`Seconds ${timeSettings.showSeconds?'enabled':'disabled'}`);
}

function toggleAutoDetect(){
  timeSettings.autoDetect=!timeSettings.autoDetect;
  persistTimeSettings();
  if(timeSettings.autoDetect){
    detectTimezone();
    updateClockDisplay();
  }
  document.getElementById('autoDetectTz').checked=timeSettings.autoDetect;
  showToast(`Auto-detect ${timeSettings.autoDetect?'enabled':'disabled'}`);
}

function toggleShowCountryName(){
  timeSettings.showCountryName=!timeSettings.showCountryName;
  persistTimeSettings();
  updateClockDisplay();
  const chk=document.getElementById('showCountryName');
  if(chk)chk.checked=timeSettings.showCountryName;
  showToast(`Country name ${timeSettings.showCountryName?'visible':'hidden'}`);
}

function toggleShowTimezoneName(){
  timeSettings.showTimezoneName=!timeSettings.showTimezoneName;
  persistTimeSettings();
  updateClockDisplay();
  const chk=document.getElementById('showTimezoneName');
  if(chk)chk.checked=timeSettings.showTimezoneName;
  showToast(`Timezone name ${timeSettings.showTimezoneName?'visible':'hidden'}`);
}

function updateTimeSettingsDisplay(){
  const autoDetectChk=document.getElementById('autoDetectTz');
  const format24Chk=document.getElementById('format24h');
  const showSecChk=document.getElementById('showSeconds');
  const showCountryChk=document.getElementById('showCountryName');
  const showTzNameChk=document.getElementById('showTimezoneName');
  const tzDisplay=document.getElementById('displayTimeZone');
  const timeDisplay=document.getElementById('currentTime');
  
  if(autoDetectChk)autoDetectChk.checked=timeSettings.autoDetect;
  if(format24Chk)format24Chk.checked=timeSettings.format24h;
  if(showSecChk)showSecChk.checked=timeSettings.showSeconds;
  if(showCountryChk)showCountryChk.checked=timeSettings.showCountryName;
  if(showTzNameChk)showTzNameChk.checked=timeSettings.showTimezoneName;
  if(tzDisplay)tzDisplay.textContent=timeSettings.timezone||'UTC';
  if(timeDisplay)timeDisplay.textContent=formatDateTime();
}

/* ═══ INIT ═══ */
(function(){
  const validThemes=['blanc','obsidian','void','aerium','jewel'];
  const stored=localStorage.getItem('folioTheme');
  const saved=validThemes.includes(stored)?stored:'blanc';
  document.documentElement.setAttribute('data-theme',saved);
  document.querySelectorAll('.theme-opt').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll(`.theme-opt[data-theme="${saved}"]`).forEach(x=>x.classList.add('active'));
  if(typeof pcUpdateThemeCards==='function') pcUpdateThemeCards(saved);

  ensureDefaultTaskFilter();
  switchSection(isMobileView()?'home':'notes');
  renderList();
  renderTasks();
  renderHomeDashboard();
  updateNavButtons();
  updateNavBadges();
  if(!stored) localStorage.setItem('folioTheme','blanc');
  
  // Initialize time system
  loadTimeSettings();
  detectTimezone();
  updateClockDisplay();
  // Update clock every second — Fix #15: store handle so it could be cleared if needed
  window._clockIntervalId = setInterval(updateClockDisplay,1000);
  // Initialize persistent file storage (reconnect previously linked file)
  initFileStorage();
})();

// Initialize safe auto-refresh (only once) — keeps date-derived labels accurate
if (!window.__taskAutoRefreshInitialized) {
  window.__taskAutoRefreshInitialized = true;

  // Auto-refresh task statuses every 60 seconds — Fix #15: store handle
  window._taskRefreshIntervalId = setInterval(() => {
    if (taskFilter && activeSection === 'tasks') {
      renderTasks();
    }
  }, 60000);

  // Fix #16: Store midnight setTimeout handle so chain can be cancelled
  window._midnightTimeoutId = null;
  function scheduleMidnightRefresh(){
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24,0,0,0);
    const timeout = nextMidnight.getTime() - now.getTime();
    window._midnightTimeoutId = setTimeout(() => {
      renderTasks();
      scheduleMidnightRefresh();
    }, timeout);
  }

  scheduleMidnightRefresh();
}

/* ═══════════════════════════════════════════
   ✦ PERSISTENT FILE STORAGE ENGINE
   Three layers: File System API → localStorage → JSON export/import
═══════════════════════════════════════════ */

const _FILE_DB = 'folio_fsh_v1';
let _fileHandle = null;
let _fileSaveTimer = null;
let _fileSaving = false;
const _supportsFS = typeof window !== 'undefined' && 'showSaveFilePicker' in window;

/* ── IndexedDB handle store ── */
function _idb(fn) {
  return new Promise((res, rej) => {
    const r = indexedDB.open(_FILE_DB, 1);
    r.onupgradeneeded = e => e.target.result.createObjectStore('h');
    r.onsuccess = e => { try { fn(e.target.result, res, rej); } catch(ex){ rej(ex); } };
    r.onerror = () => rej(r.error);
  });
}
function _saveHandle(h){ return _idb((db,res,rej)=>{ const tx=db.transaction('h','readwrite'); tx.objectStore('h').put(h,'main'); tx.oncomplete=res; tx.onerror=rej; }); }
function _loadHandle(){ return _idb((db,res)=>{ const tx=db.transaction('h','readonly'); const g=tx.objectStore('h').get('main'); g.onsuccess=()=>res(g.result||null); g.onerror=()=>res(null); }); }
function _clearHandle(){ return _idb((db,res)=>{ const tx=db.transaction('h','readwrite'); tx.objectStore('h').delete('main'); tx.oncomplete=res; tx.onerror=res; }); }

/* ── Permission helper ── */
async function _perm(h) {
  const o = { mode: 'readwrite' };
  if ((await h.queryPermission(o)) === 'granted') return true;
  if ((await h.requestPermission(o)) === 'granted') return true;
  return false;
}

/* ── Write all data to file ── */
async function _writeToFile() {
  if (!_fileHandle || _fileSaving) return;
  _fileSaving = true;
  try {
    if (!(await _perm(_fileHandle))) { return; }
    const payload = JSON.stringify({ notes, tasks, version:2, savedAt:Date.now() }, null, 2);
    const w = await _fileHandle.createWritable();
    await w.write(payload);
    await w.close();
    _showSaveFlash(true);
  } catch(e) {
    console.warn('[Folio] File save error:', e);
    _showSaveFlash(false);
  } finally {
    _fileSaving = false;
  }
}

/* Debounced save — batches rapid changes into one write */
function scheduleFileSave() {
  if (!_fileHandle) return;
  clearTimeout(_fileSaveTimer);
  _fileSaveTimer = setTimeout(_writeToFile, 800);
}

/* Fix #18: Flush any pending debounced save immediately before tab/window closes.
   Without this, edits made within the last 800ms are saved to localStorage but
   lost from the linked JSON file. _writeToFile() is async and the browser cannot
   await it in beforeunload, so we also set event.returnValue to surface the
   browser's "Leave page?" dialog — this pauses unload and lets the in-flight write
   finish. The user can safely click "Leave" once the save flash confirms success. */
window.addEventListener('beforeunload', (event) => {
  if (_fileHandle && _fileSaveTimer) {
    clearTimeout(_fileSaveTimer);
    _fileSaveTimer = null;
    try { _writeToFile(); } catch(e) { console.warn('[Folio] beforeunload write error:', e); }
    // Block immediate unload so the async write has time to complete.
    // Browser will show its own "Leave site?" confirmation dialog.
    event.preventDefault();
    event.returnValue = '';
  }
});

/* ── Read file into app ── */
async function _readFromFile(h) {
  try {
    if (!(await _perm(h))) return false;
    const file = await h.getFile();
    const raw = await file.text();
    const data = JSON.parse(raw);
    if (data.notes) { notes = data.notes; localStorage.setItem('folioNotes', JSON.stringify(notes)); }
    if (data.tasks) { tasks = data.tasks; localStorage.setItem('folioTasks', JSON.stringify(tasks)); }
    renderList(); renderTasks(); renderHomeDashboard(); updateNavBadges();
    return true;
  } catch(e) { console.warn('[Folio] File read error:', e); return false; }
}

/* ── Update status text in settings ── */
function _updateFileStatus() {
  const st = document.getElementById('fileStatusText');
  const ul = document.getElementById('fileUnlinkBtn');
  if (!st) return;
  if (_fileHandle) {
    st.textContent = '✓ Linked: ' + _fileHandle.name;
    st.style.color = 'var(--g)';
    if (ul) ul.style.display = 'inline-flex';
  } else {
    st.textContent = 'Not linked — data stored in browser only';
    st.style.color = 'var(--txt3)';
    if (ul) ul.style.display = 'none';
  }
  /* Show/hide browser-support warning */
  const note = document.getElementById('noBrowserSupportNote');
  if (note) note.style.display = _supportsFS ? 'none' : 'block';
  const btns = document.getElementById('btnLinkFile');
  if (btns) btns.style.opacity = _supportsFS ? '1' : '0.38';
}

function _showSaveFlash(ok) {
  const el = document.getElementById('fileSaveIndicator');
  if (!el) return;
  el.textContent = ok ? '● Auto-saved to file' : '⚠ File save failed';
  el.style.color = ok ? 'var(--g)' : 'var(--rd)';
  el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.opacity='0'; }, 2400);
}

/* ── Public API ── */
async function linkSaveFile() {
  if (!_supportsFS) { showToast('Not supported — use Export/Import below'); return; }
  try {
    const h = await window.showSaveFilePicker({
      suggestedName: 'folio_data.json',
      types: [{ description: 'FOLIO Data File', accept: { 'application/json': ['.json'] } }]
    });
    _fileHandle = h;
    await _saveHandle(h);
    await _writeToFile();
    _updateFileStatus();
    showToast('Linked! All changes auto-save to this file ✓');
  } catch(e) { if (e.name !== 'AbortError') showToast('Could not create file'); }
}

async function openSaveFile() {
  if (!_supportsFS) { importJSON(); return; }
  try {
    const [h] = await window.showOpenFilePicker({
      types: [{ description: 'FOLIO Data File', accept: { 'application/json': ['.json'] } }]
    });
    _fileHandle = h;
    await _saveHandle(h);
    const ok = await _readFromFile(h);
    _updateFileStatus();
    showToast(ok ? 'Data loaded from file ✓' : 'Could not read file');
  } catch(e) { if (e.name !== 'AbortError') showToast('Could not open file'); }
}

async function unlinkSaveFile() {
  _fileHandle = null;
  await _clearHandle();
  _updateFileStatus();
  showToast('File link removed');
}

function exportJSON() {
  const data = JSON.stringify({ notes, tasks, version:2, exportedAt:new Date().toISOString() }, null, 2);
  const url = URL.createObjectURL(new Blob([data], { type:'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'folio_backup_' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 300);
  showToast('Backup exported ✓');
}

function importJSON() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.json,application/json';
  input.onchange = async e => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const hasNotes = Array.isArray(data.notes);
      const hasTasks = Array.isArray(data.tasks);
      if (!hasNotes && !hasTasks) { showToast('Invalid backup file'); return; }
      // Fix #20: Use custom async confirm — native confirm() is blocked in iframes and some PWA modes
      const ok = await folioConfirm(
        `Import will replace your current data.\n${hasNotes?data.notes.length:0} notes · ${hasTasks?data.tasks.length:0} tasks found. Continue?`,
        'Import'
      );
      if (!ok) return;
      if (hasNotes) { notes = data.notes; localStorage.setItem('folioNotes', JSON.stringify(notes)); }
      if (hasTasks) { tasks = data.tasks; localStorage.setItem('folioTasks', JSON.stringify(tasks)); }
      renderList(); renderTasks(); renderHomeDashboard(); updateNavBadges();
      showToast('Data imported ✓');
    } catch(e) { showToast('Could not read backup file'); }
  };
  input.click();
}

/* ── Init: reconnect previously linked file ── */
async function initFileStorage() {
  try {
    const h = await _loadHandle();
    if (h) {
      _fileHandle = h;
      /* Query permission silently — only loads if already granted (no popup on startup) */
      const perm = await h.queryPermission({ mode:'readwrite' }).catch(()=>'prompt');
      if (perm === 'granted') {
        const ok = await _readFromFile(h);
        if (ok) showToast('Data loaded from linked file ✓');
      }
    }
  } catch(e) { /* stale handle — ignore */ }
  _updateFileStatus();
}

/* ═══ PWA SUPPORT ═══ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(() => {})
      .catch(() => {});
  });
}

// Install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  // Show install button if desired
  const fab = document.getElementById('fab');
  if (fab) {
    const installBtn = document.createElement('div');
    installBtn.id = 'installBtn';
    installBtn.style.cssText = 'position:absolute;top:-60px;right:0;background:var(--card);padding:8px 12px;border-radius:8px;font-size:12px;white-space:nowrap;opacity:0;transform:translateY(10px);transition:all 0.3s ease;border:1px solid var(--gb);color:var(--txt);cursor:pointer';
    installBtn.textContent = 'Install App';
    fab.appendChild(installBtn);
    setTimeout(() => {
      installBtn.style.opacity = '1';
      installBtn.style.transform = 'translateY(0)';
    }, 1000);
    installBtn.addEventListener('click', e => {
      e.stopPropagation();
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choice => {
        if (choice.outcome === 'accepted') { /* installed */ }
        deferredPrompt = null;
      });
    });
  }
});

/* ═══ GESTURE SUPPORT ═══ */
let startX=null, startY=null, isSwiping = false, swipeHandled = false;
document.addEventListener('touchstart', e => {
  // Don't track swipe if touch starts inside a scrollable container
  const scrollable = e.target.closest('.notes-list, .ts-filter-scroll, .editor-area, .tm-content, .home-main, .settings-content, .theme-panel, .modal');
  if (scrollable) { startX = null; startY = null; return; }
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  isSwiping = false;
  swipeHandled = false;
}, {passive: true});

document.addEventListener('touchmove', e => {
  if (startX === null || startY === null || swipeHandled) return; // Fix #17: !startX fails when x=0
  const deltaX = e.touches[0].clientX - startX;
  const deltaY = e.touches[0].clientY - startY;
  // Only treat as horizontal swipe if clearly more horizontal than vertical
  if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && Math.abs(deltaX) > 50) {
    isSwiping = true;
    swipeHandled = true;
    // Swipe right from left edge to open sidebar
    if (deltaX > 0 && startX < 40 && !document.getElementById('sidebar').classList.contains('drawer-open')) {
      toggleSidebar();
    }
    // Swipe left to close sidebar
    else if (deltaX < 0 && document.getElementById('sidebar').classList.contains('drawer-open')) {
      closeSidebar();
    }
  }
}, {passive: true});

// Merged touchend: resets swipe state AND clears long-press timer (fixes duplicate listener bug)
document.addEventListener('touchend', e => {
  startX = null; startY = null;
  isSwiping = false;
  swipeHandled = false;
  clearTimeout(longPressTimer);
});

// Long press for context menu
let longPressTimer;
document.addEventListener('touchstart', e => {
  if (e.target.closest('.task-card')) {
    const capturedCard = e.target.closest('.task-card');
    longPressTimer = setTimeout(() => {
      const card = capturedCard;
      card.style.transform = 'scale(0.98)';
      setTimeout(() => card.style.transform = '', 150);
      // BUG 1 FIX: add null guard — match() returns null on group labels / empty-state cards
      const match = card.innerHTML.match(/toggleDone\(event,'([^']+)'/);
      if (!match) return;
      const id = match[1];
      toggleDone({stopPropagation: () => {}}, id);
    }, 500);
  }
}, {passive: true});

/* ═══ BOTTOM NAV & FAB ═══ */
function handleFabClick() {
  if (activeSection === 'notes') { newNote(); return; }
  if (activeSection === 'tasks') { openModal(); return; }
  if (activeSection !== 'home') return;
  const sheet=document.getElementById('fabActionSheet');
  fabSheetOpen=!fabSheetOpen;
  sheet.classList.toggle('open',fabSheetOpen);
  // Bounce animation
  const fab = document.getElementById('fab');
  fab.classList.add('fab-bounce');
  setTimeout(() => fab.classList.remove('fab-bounce'), 600);
}
function fabCreateNote(){
  closeFabSheet();
  switchSection('notes');
  newNote();
}
function fabCreateTask(){
  closeFabSheet();
  switchSection('tasks');
  openModal();
}

// Update nav badges
function updateNavBadges() {
  // Badge removed — no task count shown on nav
}

// Update active nav button
function updateNavButtons() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === activeSection);
  });
}


/* ═══════════════════════════════════════════
   ✦ ENHANCED TOOLBAR TOOLS
═══════════════════════════════════════════ */

/* ── HEADING FORMAT ── */
function execHeading(tag){
  const sel=window.getSelection();
  if(!sel.rangeCount)return;
  const range=sel.getRangeAt(0);
  const ancestor=range.commonAncestorContainer;
  const block=ancestor.nodeType===1?ancestor:ancestor.parentElement;
  const existingH=block.closest?block.closest('h1,h2,h3'):null;
  if(existingH&&existingH.tagName.toLowerCase()===tag){
    document.execCommand('formatBlock',false,'p');
  }else{
    document.execCommand('formatBlock',false,tag);
  }
  document.getElementById('bodyEditor').focus();
  saveNote();
}

/* ── HIGHLIGHT ── */
let hlPickerOpen=false;
function toggleHighlightPicker(e){
  e&&e.stopPropagation();
  const picker=document.getElementById('tbHighlightPicker');
  hlPickerOpen=!hlPickerOpen;
  picker.classList.toggle('open',hlPickerOpen);
}
document.getElementById('notesToolbar')?.addEventListener('mousedown',e=>{
  if(e.target.closest('.tb-btn,.hl-swatch'))e.preventDefault();
});
function applyHighlight(color){
  hlPickerOpen=false;
  document.getElementById('tbHighlightPicker').classList.remove('open');
  if(color===null){
    document.execCommand('removeFormat');
  }else{
    // Firefox does not support hiliteColor — it only supports backColor.
    // Chrome/Edge/Safari support both. Use backColor as the universal fallback.
    const cmd=document.queryCommandSupported('hiliteColor')?'hiliteColor':'backColor';
    document.execCommand(cmd,false,color);
  }
  document.getElementById('bodyEditor').focus();
  saveNote();
}
document.addEventListener('click',function(e){
  if(hlPickerOpen&&!e.target.closest('.tb-highlight-wrap')){
    hlPickerOpen=false;
    const p=document.getElementById('tbHighlightPicker');
    if(p)p.classList.remove('open');
  }
});

/* ── COPY NOTE ── */
function copyNote(){
  if(!activeNoteId)return;
  saveNote();
  const title=(document.getElementById('titleInput')?.value||'').trim();
  const body=(document.getElementById('bodyEditor')?.innerText||'').trim();
  const text=(title?title+'\n\n':'')+body;
  navigator.clipboard.writeText(text).then(()=>showToast('Note copied to clipboard ✓')).catch(()=>{
    // fallback
    const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);
    showToast('Note copied ✓');
  });
}

/* ── EXPORT NOTE ── */
function exportNote(){
  if(!activeNoteId)return;
  saveNote();
  const title=(document.getElementById('titleInput')?.value||'').trim();
  const body=(document.getElementById('bodyEditor')?.innerText||'').trim();
  const text=(title?title+'\n\n':'')+body+'\n\n---\nExported from FOLIO · '+new Date().toLocaleString();
  const blob=new Blob([text],{type:'text/plain'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=(title||'note').replace(/[^a-z0-9]/gi,'_').slice(0,40)+'.txt';
  document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);document.body.removeChild(a);},200);
  // iOS Safari ignores the download attribute — the file opens in a new tab.
  // Show a platform-appropriate toast so the user knows what to do.
  const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;
  showToast(isIOS?'Tap & hold → Save to Files to download ✓':'Note exported as .txt ✓');
}

/* ── WORD COUNT TOGGLE ── */
let showWordCount=false;
function toggleWordCount(){
  showWordCount=!showWordCount;
  const btn=document.getElementById('tbWordCountBtn');
  const cc=document.getElementById('charCount');
  if(btn)btn.classList.toggle('active-tool',showWordCount);
  updateCharCount();
}
// Fix #23: _origUpdateCharCount was captured but never called anywhere — removed dead code.
// Override updateCharCount to support word/char toggle mode
window.updateCharCount=function(){
  const text=document.getElementById('bodyEditor').innerText||'';
  const cc=document.getElementById('charCount');
  if(showWordCount){
    const words=text.trim().split(/\s+/).filter(Boolean).length;
    cc.textContent=words.toLocaleString()+' word'+(words!==1?'s':'');
  }else{
    cc.textContent=text.length.toLocaleString()+' characters';
  }
};

/* ── FOCUS MODE ── */
let focusActive=false;
function toggleFocusMode(){
  focusActive=!focusActive;
  const overlay=document.getElementById('focusModeOverlay');
  const btn=document.getElementById('tbFocusBtn');
  overlay.classList.toggle('open',focusActive);
  if(btn)btn.classList.toggle('active-tool',focusActive);
  const bar=document.getElementById('focusTimerBar');
  if(bar)bar.classList.toggle('ftb-focus-hidden',focusActive);
  if(focusActive){
    // Sync content into focus view
    const n=activeNoteId?notes.find(x=>x.id===activeNoteId):null;
    const titleEl=document.getElementById('focusTitleDisplay');
    const dateEl=document.getElementById('focusDateText');
    const bodyEl=document.getElementById('focusBodyMirror');
    const labelEl=document.getElementById('focusTitleLabel');
    if(n){
      if(titleEl)titleEl.textContent=n.title||'Untitled';
      if(labelEl)labelEl.textContent=n.title||'Focus Mode';
      if(dateEl)dateEl.textContent='Last edited: '+fmtDate(n.updated);
      if(bodyEl)bodyEl.innerHTML=n.body||'';
    }
    // Sync back on input
    if(bodyEl){
      bodyEl.oninput=(e)=>{
        const n2=activeNoteId?notes.find(x=>x.id===activeNoteId):null;
        if(n2){
          // Strip .tc glow spans before persisting — mirrors saveNote() behaviour
          const _cl=bodyEl.cloneNode(true);
          _cl.querySelectorAll('span.tc').forEach(sp=>{if(sp.parentNode)sp.parentNode.replaceChild(document.createTextNode(sp.textContent),sp);});
          _cl.normalize();
          n2.body=_cl.innerHTML;n2.updated=Date.now();persistNotes();renderList();
        }
        const words=bodyEl.innerText.trim().split(/\s+/).filter(Boolean).length;
        const meta=document.getElementById('focusWordMeta');
        if(meta)meta.textContent=words+' words';
        // Typing glow — mirrors main editor behaviour
        const t=(e&&e.inputType)||'';
        if(t.startsWith('insert')&&t!=='insertFromPaste'){
          if(typeof epPrefs!=='undefined'&&epPrefs.focusGlow===false)return;
          if(isAndroidDevice){requestAnimationFrame(()=>triggerAndroidGlow());}
          else if(!e.isComposing){wrapLastChar();}
        }
      };
      // iOS compositionend fix: compositionend fires AFTER input, so isComposing is still
      // true when input runs — the glow is blocked. Re-trigger via rAF once flag is clear.
      // FIX: Remove old listeners before adding new ones to prevent accumulation
      // across multiple focus mode open/close cycles.
      if(bodyEl._focusCompStart) bodyEl.removeEventListener('compositionstart',bodyEl._focusCompStart);
      if(bodyEl._focusCompEnd)   bodyEl.removeEventListener('compositionend',bodyEl._focusCompEnd);
      bodyEl._focusCompStart = ()=>{ isComposing=true; };
      bodyEl._focusCompEnd   = ()=>{
        isComposing=false;
        requestAnimationFrame(()=>{
          if(typeof epPrefs!=='undefined'&&epPrefs.focusGlow===false)return;
          wrapLastChar();
        });
      };
      bodyEl.addEventListener('compositionstart',bodyEl._focusCompStart);
      bodyEl.addEventListener('compositionend',bodyEl._focusCompEnd);
      // Point the normalize() guard at the focus mirror so the cursor
      // isn't invalidated while the user is typing here.
      activeEditor=bodyEl;
      // FIX: Remove previous blur listener before adding a new one
      if(bodyEl._focusBlur) bodyEl.removeEventListener('blur',bodyEl._focusBlur);
      bodyEl._focusBlur = ()=>{ flushWaveOnBlur(); cleanupTcSpans(bodyEl); };
      bodyEl.addEventListener('blur',bodyEl._focusBlur);
      setTimeout(()=>{bodyEl.focus();},200);
    }
    // Update word meta
    const words=(document.getElementById('bodyEditor').innerText||'').trim().split(/\s+/).filter(Boolean).length;
    const meta=document.getElementById('focusWordMeta');
    if(meta)meta.textContent=words+' words';
    document.body.style.overflow='hidden';
  }else{
    // Sync focus content back to main editor
    const focusBody=document.getElementById('focusBodyMirror');
    const mainBody=document.getElementById('bodyEditor');
    if(focusBody&&mainBody){
      /* Fix #21: Before sync-back, strip all lingering .tc span wrappers produced by
         wrapLastChar() in the focus editor. The focus editor may have normalised them
         slightly differently, so merging them in would corrupt the .tc.settled structure
         in the main editor. We extract plain text content and replace spans cleanly. */
      const clone=focusBody.cloneNode(true);
      clone.querySelectorAll('span.tc').forEach(sp=>{
        sp.replaceWith(document.createTextNode(sp.textContent));
      });
      clone.normalize();
      mainBody.innerHTML=clone.innerHTML;
      saveNote();
    }
    // Restore normalize() guard to the main editor now that focus mode is closed.
    activeEditor=editor;
    document.body.style.overflow='';
  }
}

/* ── KEYBOARD SHORTCUTS ── */
document.addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)){
    if(e.key==='b'){e.preventDefault();execFmt('bold');}
    if(e.key==='i'){e.preventDefault();execFmt('italic');}
    if(e.key==='u'){e.preventDefault();execFmt('underline');}
    if(e.key==='z'&&!e.shiftKey){e.preventDefault();execFmt('undo');}
    if((e.key==='y')||(e.key==='z'&&e.shiftKey)){e.preventDefault();execFmt('redo');}
  }
  if(e.key==='Escape'&&focusActive){toggleFocusMode();}
  if(e.key==='Escape'&&desktopSettingsOpen){closeDesktopSettings();}
  if(e.key==='Escape'&&typeof _confirmResolve==='function'){_confirmResolve(false);}
});

/* ═══════════════════════════════════════════
   ✦ NOTE STYLE SETTINGS
═══════════════════════════════════════════ */
let noteStylePrefs=JSON.parse(localStorage.getItem('folioNoteStyle')||'{"pageMode":"split","layout":"normal","scroll":"vertical"}');

function setNoteStyle(key,val){
  noteStylePrefs[key]=val;
  localStorage.setItem('folioNoteStyle',JSON.stringify(noteStylePrefs));
  applyNoteStyle();
  // Update UI radio states
  if(key==='pageMode'){
    ['Split','Infinite'].forEach(id=>{
      const el=document.getElementById('ns'+id);
      if(el){
        const active=val.toLowerCase()===id.toLowerCase();
        el.dataset.active=active?'true':'false';
        const radio=el.querySelector('.ns-radio');
        if(radio){radio.innerHTML=active?'<div class="ns-radio-dot"></div>':'';}
      }
    });
  }
  if(key==='layout'){
    ['Normal','Landscape','Long'].forEach(id=>{
      const el=document.getElementById('nsLayout'+id);
      const radio=document.getElementById('nsLayout'+id+'Radio');
      if(el){
        const active=val===id.toLowerCase();
        el.dataset.active=active?'true':'false';
        if(radio)radio.innerHTML=active?'<div class="ns-radio-dot"></div>':'';
      }
    });
  }
  if(key==='scroll'){
    ['Vertical','Horizontal'].forEach(id=>{
      const el=document.getElementById('nsScroll'+id);
      const radio=document.getElementById('nsScroll'+id+'Radio');
      if(el){
        const active=val===id.toLowerCase();
        el.dataset.active=active?'true':'false';
        if(radio)radio.innerHTML=active?'<div class="ns-radio-dot"></div>':'';
      }
    });
  }
  showToast('Style updated ✓');
}

function applyNoteStyle(){
  const _editorEl=document.getElementById('bodyEditor');
  const editorArea=document.querySelector('.editor-area');
  if(!_editorEl)return;
  // Layout classes
  _editorEl.classList.remove('layout-landscape','layout-long');
  if(noteStylePrefs.layout==='landscape')_editorEl.classList.add('layout-landscape');
  if(noteStylePrefs.layout==='long')_editorEl.classList.add('layout-long');
  // Scroll
  if(editorArea){
    editorArea.style.overflowX=(noteStylePrefs.scroll==='horizontal')?'auto':'';
    editorArea.style.flexDirection=(noteStylePrefs.scroll==='horizontal')?'row':'column';
  }
}

function initNoteStyleUI(){
  // Restore radio buttons to match saved prefs
  setNoteStyle('pageMode',noteStylePrefs.pageMode||'split');
  setNoteStyle('layout',noteStylePrefs.layout||'normal');
  setNoteStyle('scroll',noteStylePrefs.scroll||'vertical');
}

/* ═══════════════════════════════════════════
   ✦ EDITOR PREFERENCES
═══════════════════════════════════════════ */
let epPrefs=JSON.parse(localStorage.getItem('folioEpPrefs')||'{"fontSize":"medium","lineHeight":"normal","textGlow":true,"focusGlow":true,"spellCheck":true,"autoFocus":false}');

function setEditorFontSize(size){
  epPrefs.fontSize=size;
  saveEpPrefs();
  const editor=document.getElementById('bodyEditor');
  editor.classList.remove('font-small','font-medium','font-large','font-xlarge');
  editor.classList.add('font-'+size);
  ['Sm','Md','Lg','Xl'].forEach(s=>document.getElementById('epSize'+s)?.classList.remove('ep-active'));
  const map={small:'Sm',medium:'Md',large:'Lg',xlarge:'Xl'};
  document.getElementById('epSize'+map[size])?.classList.add('ep-active');
}

function setLineHeight(lh){
  epPrefs.lineHeight=lh;
  saveEpPrefs();
  const editor=document.getElementById('bodyEditor');
  editor.classList.remove('lh-snug','lh-normal','lh-relaxed');
  editor.classList.add('lh-'+lh);
  ['Snug','Normal','Relaxed'].forEach(s=>document.getElementById('epLh'+s)?.classList.remove('ep-active'));
  const map={snug:'Snug',normal:'Normal',relaxed:'Relaxed'};
  document.getElementById('epLh'+map[lh])?.classList.add('ep-active');
}

function toggleEditorPref(key){
  epPrefs[key]=!epPrefs[key];
  saveEpPrefs();
  if(key==='spellCheck'){
    const val=epPrefs.spellCheck?'true':'false';
    const ed=document.getElementById('bodyEditor');
    if(ed)ed.setAttribute('spellcheck',val);
    const fm=document.getElementById('focusBodyMirror');
    if(fm)fm.setAttribute('spellcheck',val);
  }
  if(key==='textGlow'){
    // Glow is handled in wrapLastChar — just persist the pref
  }
  if(key==='autoFocus'){
    // Will auto-trigger on next note open
  }
}

function saveEpPrefs(){localStorage.setItem('folioEpPrefs',JSON.stringify(epPrefs));}


/* ═══════════════════════════════════════════
   ✦ NAVIGATION BAR VISIBILITY TOGGLE
═══════════════════════════════════════════ */
function toggleNavBar(source){
  const checkbox=source||document.getElementById('epShowNavBar');
  const show=checkbox?checkbox.checked:true;
  document.body.classList.toggle('nav-bar-hidden',!show);
  localStorage.setItem('folioNavBarVisible', show?'true':'false');
}
function applyNavBarPref(){
  const saved=localStorage.getItem('folioNavBarVisible');
  // On mobile (≤768px) default is hidden; on desktop default is visible
  const mobileDefault=window.innerWidth<=768?false:true;
  const show=saved===null?mobileDefault:saved!=='false';
  document.body.classList.toggle('nav-bar-hidden',!show);
  const checkbox=document.getElementById('epShowNavBar');
  if(checkbox)checkbox.checked=show;
}

function applyEpPrefs(){
  setEditorFontSize(epPrefs.fontSize||'medium');
  setLineHeight(epPrefs.lineHeight||'normal');
  // Restore checkboxes
  const checks={epTextGlow:'textGlow',epFocusGlow:'focusGlow',epSpellCheck:'spellCheck',epAutoFocus:'autoFocus'};
  Object.entries(checks).forEach(([id,key])=>{
    const el=document.getElementById(id);
    if(el)el.checked=!!epPrefs[key];
  });
  if(!epPrefs.spellCheck){
    const ed=document.getElementById('bodyEditor');
    if(ed)ed.setAttribute('spellcheck','false');
    const fm=document.getElementById('focusBodyMirror');
    if(fm)fm.setAttribute('spellcheck','false');
  }
}

/* ═══════════════════════════════════════════
   ✦ TOOLBAR CUSTOMIZATION
═══════════════════════════════════════════ */
const TOOLBAR_TOOLS=[
  {id:'bold',label:'Bold',icon:'<b>B</b>'},
  {id:'italic',label:'Italic',icon:'<i>I</i>'},
  {id:'underline',label:'Underline',icon:'<u>U</u>'},
  {id:'strike',label:'Strikethrough',icon:'<span style="text-decoration:line-through">S</span>'},
  {id:'h1',label:'Heading 1',icon:'H1'},
  {id:'h2',label:'Heading 2',icon:'H2'},
  {id:'ul',label:'Bullet List',icon:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="4" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="2" fill="currentColor" stroke="none"/><line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/></svg>'},
  {id:'ol',label:'Numbered List',icon:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/></svg>'},
  {id:'highlight',label:'Highlight',icon:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 3l6 6-9 9-4-4 7-11z"/></svg>'},
  {id:'alignLeft',label:'Align Left',icon:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/></svg>'},
  {id:'alignCenter',label:'Center',icon:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/></svg>'},
  {id:'undo',label:'Undo',icon:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>'},
  {id:'redo',label:'Redo',icon:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-4.95"/></svg>'},
  {id:'focus',label:'Focus Mode',icon:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>'},
  {id:'copy',label:'Copy Note',icon:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>'},
  {id:'export',label:'Export (.txt)',icon:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'},
];

let tbVisibility=JSON.parse(localStorage.getItem('folioTbVis')||'{}');

function renderToolbarCustomize(){
  const list=document.getElementById('toolbarCustomizeList');
  if(!list)return;
  list.innerHTML='';
  TOOLBAR_TOOLS.forEach(tool=>{
    const enabled=tbVisibility[tool.id]!==false;
    const row=document.createElement('div');
    row.className='tc-item';
    row.innerHTML=`
      <div class="tc-item-icon">${tool.icon}</div>
      <div class="tc-item-label">${tool.label}</div>
      <div class="tc-item-toggle ${enabled?'on':''}" onclick="toggleToolVisibility('${tool.id}',this)" title="${enabled?'Enabled — click to hide':'Disabled — click to show'}"></div>
    `;
    list.appendChild(row);
  });
}

function toggleToolVisibility(toolId, toggleEl){
  const current=tbVisibility[toolId]!==false;
  tbVisibility[toolId]=!current;
  localStorage.setItem('folioTbVis',JSON.stringify(tbVisibility));
  toggleEl.classList.toggle('on',!current);
  applyToolbarVisibility();
}

function applyToolbarVisibility(){
  TOOLBAR_TOOLS.forEach(tool=>{
    const enabled=tbVisibility[tool.id]!==false;
    const btn=document.querySelector(`.tb-tool[data-tool="${tool.id}"]`);
    if(btn)btn.style.display=enabled?'':'none';
  });
  // Focus Timer button
  const timerBtn=document.getElementById('tbRtlBtn');
  if(timerBtn)timerBtn.style.display=tbVisibility['rtltimer']===false?'none':'';
  // sep7 separator follows the timer button
  const sep7=document.querySelector('.tb-tool[data-tool="sep7"]');
  if(sep7) sep7.style.display=tbVisibility['rtltimer']===false?'none':'';
  // Character counter bar
  const cc=document.getElementById('charCount');
  if(cc)cc.style.display=tbVisibility['charcounter']===false?'none':'';
  // Word count button
  const wcBtn=document.querySelector('.tb-tool[data-tool="wordcount"]');
  if(wcBtn)wcBtn.style.display=tbVisibility['wordcount']===false?'none':'';
  // Sync static toggle UI
  const timerToggle=document.getElementById('tcFocusTimerToggle');
  if(timerToggle)timerToggle.classList.toggle('on',tbVisibility['rtltimer']!==false);
  const ccToggle=document.getElementById('tcCharCounterToggle');
  if(ccToggle)ccToggle.classList.toggle('on',tbVisibility['charcounter']!==false);
  const wcToggle=document.getElementById('tcWordCountToggle');
  if(wcToggle)wcToggle.classList.toggle('on',tbVisibility['wordcount']!==false);
}

function toggleSpecialTool(toolId, toggleElId){
  const current=tbVisibility[toolId]!==false;
  tbVisibility[toolId]=!current;
  localStorage.setItem('folioTbVis',JSON.stringify(tbVisibility));
  applyToolbarVisibility();
}

function resetToolbarSettings(){
  tbVisibility={};
  localStorage.removeItem('folioTbVis');
  applyToolbarVisibility();
  renderToolbarCustomize();
  showToast('Toolbar reset to default ✓');
}

/* ── AUTO-FOCUS on note open ── */
const _origOpenNote=openNote;
window.openNote=function(id){
  // If focus mode is open, close it first and sync its content back before
  // switching notes — otherwise the focus mirror will overwrite the new note.
  if(focusActive){toggleFocusMode();}
  _origOpenNote(id);
  if(epPrefs&&epPrefs.autoFocus){
    /* Fix #24: Delay was 400ms but user could start typing immediately, causing
       toggleFocusMode to interrupt composition and reset cursor. Now we cancel
       if the user is already composing (typing) when the timer fires. */
    let _afTimer=setTimeout(()=>{
      if(!isComposing){toggleFocusMode();}
    },400);
    // Cancel if user starts typing before the 400ms elapses
    const _cancelAF=()=>{clearTimeout(_afTimer);document.getElementById('bodyEditor')?.removeEventListener('keydown',_cancelAF);};
    document.getElementById('bodyEditor')?.addEventListener('keydown',_cancelAF,{once:true});
  }
  // ✦ Reading Session Timer — trigger on note open
  if(typeof rtlOnNoteOpen === 'function') rtlOnNoteOpen();
};

/* ── INIT ALL NEW FEATURES ── */
(function initEnhancedFeatures(){
  applyEpPrefs();
  applyNavBarPref();
  applyToolbarVisibility();
  initNoteStyleUI();
  applyNoteStyle();
  if(typeof rtlApplySettingsUI==='function')rtlApplySettingsUI();
  if(typeof tbRtlSyncBtn==='function')tbRtlSyncBtn();
})();

function detectSystemTheme() {
  if(!localStorage.getItem('folioTheme')) setTheme('blanc');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if(!localStorage.getItem('folioTheme')) setTheme('blanc');
});

/* ═══ LOADING SKELETONS ═══ */
function showSkeleton(container, type) {
  container.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';
    if (type === 'note') {
      skeleton.innerHTML = '<div class="skeleton-title"></div><div class="skeleton-text"></div><div class="skeleton-text" style="width:60%"></div>';
    } else if (type === 'task') {
      skeleton.innerHTML = '<div class="skeleton-title" style="width:80%"></div><div class="skeleton-text" style="width:40%"></div>';
    }
    container.appendChild(skeleton);
  }
}

function hideSkeleton(container) {
  if(!container)return;
  container.querySelectorAll('.skeleton').forEach(s=>s.remove());
}

/* ═══ PERFORMANCE OPTIMIZATIONS ═══ */
function optimizeAnimations() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    document.documentElement.style.setProperty('--ease', 'linear');
    document.documentElement.style.setProperty('--spr', 'linear');
  }
}

optimizeAnimations();

/* ═══ KEYBOARD & INPUT FIXES ═══ */
function handleVisualViewport() {
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      // Only adjust layout when a text input is focused (keyboard open),
      // NOT during regular scroll (where viewport shrinks/grows with browser chrome).
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
      if (isInputFocused) {
        activeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
      }
      // Do NOT touch document.body.style.height — overriding it mid-scroll
      // collapses the flex layout and freezes momentum scrolling on iOS.
    });
  }
}

handleVisualViewport();

/* ═══ MICRO-INTERACTIONS ═══ */
document.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (btn) {
    btn.classList.add('btn-press');
    setTimeout(() => btn.classList.remove('btn-press'), 150);
  }
});

document.addEventListener('click', e => {
  const card = e.target.closest('.task-card, .note-item');
  if (card && !e.target.closest('button')) {
    card.classList.add('card-tap');
    setTimeout(() => card.classList.remove('card-tap'), 200);
  }
});
/* ═══ MOBILE TASKS — SCROLL HIDE/SHOW HEADER ═══ */
(function(){
  let lastScrollY = 0;
  let ticking = false;
  let headerHidden = false;
  // Timestamp cooldown prevents rapid re-triggers while CSS transition runs.
  // lastScrollY is ALWAYS updated first so delta can never accumulate.
  let lastTransitionAt = 0;
  const COOLDOWN_MS = 340; // slightly longer than the 320ms CSS transition

  // ── Rendering guard ──────────────────────────────────────────────────────
  // When renderTasks() wipes innerHTML, the scroll container briefly loses
  // height, which fires a spurious scroll event with a huge negative delta
  // that makes the header jump. We suppress scroll handling during that window
  // and restore a clean baseline once the new DOM is in place.
  let rendering = false;

  // ── Cached DOM refs (set once at init, never re-queried per frame) ───────
  let _tmContent = null;
  let _headerWrap = null;
  let _cachedHeaderH = 0;      // offsetHeight — read once, not every hide
  let _mobileQuery = null;     // matchMedia — created once, not every frame

  function hideHeader() {
    const now = Date.now();
    if (now - lastTransitionAt < COOLDOWN_MS) return;
    lastTransitionAt = now;
    // Use cached height — avoids forced reflow on every hide call
    if (!_cachedHeaderH) _cachedHeaderH = _headerWrap.offsetHeight;
    _headerWrap.style.marginTop = '-' + _cachedHeaderH + 'px';
    _headerWrap.style.opacity = '0';
    _headerWrap.style.pointerEvents = 'none';
    headerHidden = true;
  }

  function showHeader(force) {
    const now = Date.now();
    if (!force && now - lastTransitionAt < COOLDOWN_MS) return;
    lastTransitionAt = now;
    _headerWrap.style.marginTop = '0';
    _headerWrap.style.opacity = '1';
    _headerWrap.style.pointerEvents = '';
    headerHidden = false;
  }

  function onTasksScroll() {
    if (!ticking) {
      requestAnimationFrame(function() {
        // Skip all logic during a renderTasks DOM rebuild
        if (rendering) { ticking = false; return; }
        if (!_tmContent || !_headerWrap) { ticking = false; return; }
        if (!_mobileQuery.matches) { ticking = false; return; }

        const currentY = _tmContent.scrollTop;
        // Always update so delta never accumulates across paused frames
        lastScrollY = currentY;

        // Header is permanently visible during scroll.
        // Only focus mode (toggleTasksFocus) can hide/show it.

        ticking = false;
      });
      ticking = true;
    }
  }

  // ── Public API ────────────────────────────────────────────────────────────

  // Called by setTaskFilter + switchSection: syncs all closure state to DOM.
  window._taskScrollReset = function() {
    lastScrollY = 0;
    headerHidden = false;
    lastTransitionAt = 0;
    rendering = false;
  };

  // Called by renderTasks BEFORE wiping innerHTML.
  // Freezes the scroll handler and records the pre-wipe scroll position
  // so the handler can't react to the temporary height collapse.
  window._taskRenderStart = function() {
    rendering = true;
    if (_tmContent) lastScrollY = _tmContent.scrollTop;
  };

  // Called by renderTasks AFTER new DOM is in place and scrollTop restored.
  // Unfreezes the handler with the ACTUAL scroll position as the baseline.
  // We read _tmContent.scrollTop directly rather than trusting the passed savedY:
  // if content got shorter (task deleted), the browser silently clamps scrollTop
  // below savedY, so savedY would produce a wrong delta on the very next event.
  window._taskRenderEnd = function() {
    lastScrollY = _tmContent ? _tmContent.scrollTop : 0;
    rendering = false;
  };

  function attachScrollListener() {
    _tmContent = document.getElementById('tmContent');
    _headerWrap = document.getElementById('tmHeaderWrap');
    _mobileQuery = window.matchMedia('(max-width:768px)');
    // Cache header height once after layout is stable
    if (_headerWrap) _cachedHeaderH = _headerWrap.offsetHeight;
    if (_tmContent) {
      _tmContent.addEventListener('scroll', onTasksScroll, { passive: true });
    }
    // Fix #14: Invalidate cached header height on resize (device rotation, zoom)
    window.addEventListener('resize', () => {
      if (_headerWrap) _cachedHeaderH = _headerWrap.offsetHeight;
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachScrollListener);
  } else {
    attachScrollListener();
  }
})();

/* ── TASKS FOCUS MODE ── */
let tasksFocusActive = false;
function toggleTasksFocus() {
  tasksFocusActive = !tasksFocusActive;
  const headerWrap = document.getElementById('tmHeaderWrap');
  const btn = document.getElementById('tasksFocusBtn');
  if (tasksFocusActive) {
    if (headerWrap) {
      const h = headerWrap.offsetHeight;
      document.documentElement.style.setProperty('--tm-hw', h + 'px');
    }
    document.body.classList.add('tasks-focus-mode');
    if (btn) btn.classList.add('focus-on');
  } else {
    document.body.classList.remove('tasks-focus-mode');
    if (btn) btn.classList.remove('focus-on');
  }
}
// Sync focus btn visibility per filter
function syncTasksFocusBtn() {
  const btn = document.getElementById('tasksFocusBtn');
  if (!btn) return;
  const show = (taskFilter === null || taskFilter === 'all');
  btn.style.display = show ? '' : 'none';
  if (!show && tasksFocusActive) toggleTasksFocus();
};

/* ══ BUG REPORT ══ */
function openBugModal(){
  // Populate system info
  const theme=document.documentElement.getAttribute('data-theme')||'blanc';
  const themeNames={blanc:'White',obsidian:'Black',void:'Purple',aerium:'Blue',jewel:'Gold'};
  document.getElementById('bugInfoTheme').textContent=themeNames[theme]||theme;
  document.getElementById('bugInfoBrowser').textContent=getBrowserName();
  document.getElementById('bugInfoPlatform').textContent=(navigator.userAgentData?.platform)||navigator.platform||'Unknown';
  document.getElementById('bugInfoScreen').textContent=`${window.innerWidth}×${window.innerHeight} (${window.devicePixelRatio||1}x)`;
  document.getElementById('bugInfoTime').textContent=new Date().toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'});
  // Reset form
  document.getElementById('bugFormBody').style.display='flex';
  document.getElementById('bugFormBody').style.flexDirection='column';
  document.getElementById('bugSuccessState').style.display='none';
  document.getElementById('bugSubject').value='';
  document.getElementById('bugDescription').value='';
  document.getElementById('bugEmail').value='';
  document.getElementById('bugCategory').selectedIndex=0;
  const btn=document.getElementById('bugSendBtn');
  btn.classList.remove('sending');
  btn.disabled=false;
  document.getElementById('bugReportOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeBugModal(){
  document.getElementById('bugReportOverlay').classList.remove('open');
  document.body.style.overflow='';
}
function bugOverlayClick(e){
  if(e.target===document.getElementById('bugReportOverlay'))closeBugModal();
}
function getBrowserName(){
  const ua=navigator.userAgent;
  if(ua.includes('Edg/'))return'Microsoft Edge';
  if(ua.includes('Chrome/'))return'Chrome';
  if(ua.includes('Firefox/'))return'Firefox';
  if(ua.includes('Safari/')&&!ua.includes('Chrome'))return'Safari';
  if(ua.includes('OPR/')||ua.includes('Opera'))return'Opera';
  return'Unknown Browser';
}
async function submitBugReport(){
  const subject=document.getElementById('bugSubject').value.trim();
  const description=document.getElementById('bugDescription').value.trim();
  if(!subject){shakeBugField('bugSubject');showBugToast('Add a short subject first.');return;}
  if(!description){shakeBugField('bugDescription');showBugToast('Add a description before sending.');return;}
  if(!window.EMAILJS_CONFIGURED){
    showBugToast('EmailJS is not configured yet. Replace the placeholder keys in this file.');
    return;
  }
  if(navigator.onLine===false){
    showBugToast('Internet is required to send through EmailJS.');
    return;
  }
  const btn=document.getElementById('bugSendBtn');
  btn.classList.add('sending');
  btn.disabled=true;
  const params={
    bug_category:document.getElementById('bugCategory').value,
    bug_subject:subject,
    bug_description:description,
    reporter_email:document.getElementById('bugEmail').value.trim(),
    app_version:'V1.0',
    app_theme:document.getElementById('bugInfoTheme').textContent,
    browser:document.getElementById('bugInfoBrowser').textContent,
    platform:document.getElementById('bugInfoPlatform').textContent,
    screen_size:document.getElementById('bugInfoScreen').textContent,
    reported_at:new Date().toISOString()
  };
  try{
    const response=await fetch(window.EMAILJS_ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        service_id:window.EMAILJS_SERVICE_ID,
        template_id:window.EMAILJS_TEMPLATE_ID,
        user_id:window.EMAILJS_PUBLIC_KEY,
        public_key:window.EMAILJS_PUBLIC_KEY,
        template_params:params
      })
    });
    if(!response.ok) throw new Error('EmailJS error '+response.status);
    document.getElementById('bugFormBody').style.display='none';
    document.getElementById('bugSuccessState').style.display='flex';
  }catch(error){
    showBugToast('EmailJS send failed. Check credentials and connection.');
  }finally{
    btn.classList.remove('sending');
    btn.disabled=false;
  }
}
function shakeBugField(id){
  const el=document.getElementById(id);
  el.style.borderColor='rgba(248,81,73,0.6)';
  el.style.boxShadow='0 0 0 3px rgba(248,81,73,0.12)';
  el.animate([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}],{duration:320,easing:'ease-out'});
  setTimeout(()=>{el.style.borderColor='';el.style.boxShadow='';},1400);
}
function showBugToast(msg){
  const t=document.createElement('div');
  t.id='bugToast';
  t.className='bug-toast';
  t.setAttribute('role','status');
  t.setAttribute('aria-live','polite');
  t.style.cssText='position:fixed;bottom:88px;left:50%;transform:translateX(-50%) translateY(12px);background:rgba(248,81,73,0.12);border:1px solid rgba(248,81,73,0.35);color:#f85149;font-size:12px;font-family:Inter,sans-serif;font-weight:600;padding:10px 18px;border-radius:10px;z-index:10000;opacity:0;transition:all 0.28s ease;white-space:nowrap';
  t.textContent=msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=>{t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';});
  setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),300);},3500);
};

/* Fix #20: Async custom confirm — works in iframes and PWA standalone */
let _confirmResolve=null;
/* ═══════════════════════════════════════════
   ✦ FOCUS SESSION TIMER
═══════════════════════════════════════════ */
// folioRtlPrefsV2: versioned key so existing users (who had enabled:true as the old default)
// get a clean reset. Only minutes and warn are migrated from the old key if present.
(function(){
  if(!localStorage.getItem('folioRtlPrefsV2')){
    const old = JSON.parse(localStorage.getItem('folioRtlPrefs') || '{}');
    const migrated = {
      enabled: false,                                     // always off — must opt in
      autoStart: false,                                   // always off — must opt in
      warn: old.warn !== undefined ? old.warn : true,     // keep their warn pref
      minutes: old.minutes || 25,                         // keep their duration pref
    };
    localStorage.setItem('folioRtlPrefsV2', JSON.stringify(migrated));
  }
})();
var rtlPrefs = JSON.parse(localStorage.getItem('folioRtlPrefsV2'));
var rtlState = {
  active: false,
  paused: false,
  secondsLeft: 0,
  totalSeconds: 0,
  _interval: null,
  _startWords: 0,
  _startChars: 0,
  _noteId: null,
  _startTime: 0,    // wall-clock start (Date.now())
  _pausedMs: 0,     // total accumulated pause duration in ms
  _pauseAt: null,   // timestamp when current pause began
};

function rtlSave(){ localStorage.setItem('folioRtlPrefsV2', JSON.stringify(rtlPrefs)); }

/* ── Settings UI ── */
function rtlApplySettingsUI(){
  const setToggle = (id, val) => {
    document.querySelectorAll('#' + id).forEach(el => el.classList.toggle('on', !!val));
  };
  setToggle('rtlEnableToggle', rtlPrefs.enabled);
  setToggle('rtlAutoStartToggle', rtlPrefs.autoStart);
  setToggle('rtlWarnToggle', rtlPrefs.warn);
  document.querySelectorAll('#rtlDurSlider').forEach(s => { s.value = rtlPrefs.minutes; });
  rtlUpdateDurLabel(rtlPrefs.minutes);
  rtlSyncPresetBtns(rtlPrefs.minutes);
  const off = !rtlPrefs.enabled;
  ['rtlAutoStartRow','rtlWarnRow','rtlDurationRow'].forEach(id => {
    document.querySelectorAll('#'+id).forEach(el => {
      el.style.opacity = off ? '0.38' : '1';
      el.style.pointerEvents = off ? 'none' : 'auto';
    });
  });
  const showManual = rtlPrefs.enabled && !rtlPrefs.autoStart;
  document.querySelectorAll('#rtlManualStartWrap').forEach(w => { w.style.display = showManual ? 'block' : 'none'; });
}

function rtlTogglePref(key){
  rtlPrefs[key] = !rtlPrefs[key];
  rtlSave();
  rtlApplySettingsUI();
  if(key === 'enabled'){
    if(!rtlPrefs.enabled) rtlStop(false);
    else if(rtlPrefs.autoStart && activeNoteId && !rtlState.active) rtlStart();
  }
}

function rtlSliderChange(val){
  rtlPrefs.minutes = parseInt(val);
  rtlSave();
  document.querySelectorAll('#rtlDurSlider').forEach(s => { s.value = val; });
  rtlUpdateDurLabel(val);
  rtlSyncPresetBtns(val);
}

function rtlUpdateDurLabel(val){
  const v = parseInt(val);
  const html = v >= 60
    ? `${Math.floor(v/60)}<small>h</small> ${v%60 ? v%60+'<small>min</small>' : ''}`
    : `${v}<small>min</small>`;
  document.querySelectorAll('#rtlDurLabel').forEach(el => { el.innerHTML = html; });
}

function rtlSetPreset(min){
  rtlPrefs.minutes = min;
  rtlSave();
  document.querySelectorAll('#rtlDurSlider').forEach(s => { s.value = min; });
  rtlUpdateDurLabel(min);
  rtlSyncPresetBtns(min);
}

function rtlSyncPresetBtns(val){
  document.querySelectorAll('.rtl-preset-btn').forEach((btn) => {
    btn.classList.toggle('rtl-active', parseInt(btn.dataset.minutes) === parseInt(val));
  });
}

/* ── Timer bar UI ── */
function rtlShowBar(){
  document.querySelectorAll('.session-timer-bar').forEach(b => b.classList.add('ftb-active'));
  tbRtlSyncBtn();
}
function rtlHideBar(){
  document.querySelectorAll('.session-timer-bar').forEach(b =>
    b.classList.remove('ftb-active','ftb-warn','ftb-critical','ftb-paused')
  );
  tbRtlSyncBtn();
}
// Legacy aliases (used by existing call sites)
function rtlShowPill(){ rtlShowBar(); }
function rtlHidePill(){ rtlHideBar(); }

function rtlUpdatePill(){
  const s = rtlState.secondsLeft;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const timeStr = `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  const warnSecs = 5 * 60;
  const critSecs = 60;
  const pct = rtlState.totalSeconds > 0
    ? Math.max(0, Math.round((s / rtlState.totalSeconds) * 100))
    : 0;
  const pauseHtml = rtlState.paused
    ? '<polygon points="5,3 19,12 5,21"/>'
    : '<rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/>';

  document.querySelectorAll('.session-timer-bar').forEach(bar => {
    // Time display
    const display = bar.querySelector('.rtl-time-display');
    if(display) display.textContent = timeStr;
    // Progress
    const fill = bar.querySelector('.ftb-progress-fill');
    const label = bar.querySelector('.ftb-progress-label');
    if(fill) fill.style.width = pct + '%';
    if(label) label.textContent = pct + '%';
    // Colour states
    bar.classList.toggle('ftb-warn', rtlPrefs.warn && s <= warnSecs && s > critSecs);
    bar.classList.toggle('ftb-critical', s <= critSecs && s > 0);
    // Pause icon swap
    const pauseIcon = bar.querySelector('.rtl-pause-icon');
    if(pauseIcon) pauseIcon.innerHTML = pauseHtml;
  });
}

/* ── Core timer ── */
function rtlStart(){
  if(!rtlPrefs.enabled) return;
  if(rtlState.active) return;
  const editor = document.getElementById('bodyEditor');
  const txt = editor ? (editor.innerText || '') : '';
  rtlState._startWords = txt.trim().split(/\s+/).filter(Boolean).length;
  rtlState._startChars = txt.length;
  rtlState._noteId = activeNoteId;
  rtlState.totalSeconds = rtlPrefs.minutes * 60;
  rtlState.secondsLeft  = rtlState.totalSeconds;
  rtlState.active  = true;
  rtlState.paused  = false;
  rtlState._startTime = Date.now();
  rtlState._pausedMs  = 0;
  rtlState._pauseAt   = null;
  rtlShowBar();
  rtlUpdatePill();
  rtlState._interval = setInterval(() => {
    if(rtlState.paused) return;
    // Compute remaining time from actual wall-clock elapsed — never drifts early
    const elapsedMs = Date.now() - rtlState._startTime - rtlState._pausedMs;
    rtlState.secondsLeft = Math.max(0, rtlState.totalSeconds - Math.floor(elapsedMs / 1000));
    rtlUpdatePill();
    if(rtlState.secondsLeft <= 0){
      clearInterval(rtlState._interval);
      rtlState._interval = null;
      rtlState.active = false;
      rtlHideBar();
      rtlFireEnd();
    }
  }, 500); // poll every 500ms — accurate display even if a tick is skipped
}

function rtlTogglePause(){
  if(!rtlState.active) return;
  rtlState.paused = !rtlState.paused;
  if(rtlState.paused){
    // Record when this pause began
    rtlState._pauseAt = Date.now();
  } else {
    // Accumulate how long we were paused so elapsed calc stays correct
    if(rtlState._pauseAt !== null){
      rtlState._pausedMs += Date.now() - rtlState._pauseAt;
      rtlState._pauseAt = null;
    }
  }
  document.querySelectorAll('.session-timer-bar').forEach(b =>
    b.classList.toggle('ftb-paused', rtlState.paused)
  );
  rtlUpdatePill();
}

function rtlStop(showEnd){
  if(rtlState._interval){ clearInterval(rtlState._interval); rtlState._interval = null; }
  rtlState.active = false;
  rtlState.paused = false;
  rtlHideBar();
  if(showEnd) rtlFireEnd();
}

/* ── Session-end toast ── */
function rtlFireEnd(){
  const minutesSpent = Math.round((rtlState.totalSeconds - rtlState.secondsLeft) / 60) || rtlPrefs.minutes;

  const statTime = document.getElementById('fstStatTime');
  const subEl    = document.getElementById('fstSub');

  if(statTime) statTime.textContent = minutesSpent;

  const msgs = [
    "Great session. Keep the momentum going.",
    "Every focused minute compounds. Well done.",
    "A solid session. Your future self thanks you.",
    "Consistency is the key. You showed up today.",
    "Another session done. Progress is progress."
  ];
  const msg = msgs[Math.floor(Math.random() * msgs.length)];
  if(subEl) subEl.textContent = msg;

  const toast = document.getElementById('focusSessionToast');
  if(toast){ toast.classList.add('open'); }
  // Auto-dismiss after 8 seconds
  setTimeout(() => { rtlDismiss(); }, 8000);
}

function rtlDismiss(){
  document.getElementById('focusSessionToast')?.classList.remove('open');
  // Only reset display state if no new session has started since the toast appeared.
  // Zeroing totalSeconds/secondsLeft while a live interval is running would
  // immediately trigger the secondsLeft<=0 end-condition on the next tick.
  if(!rtlState.active){
    rtlState.totalSeconds = 0;
    rtlState.secondsLeft  = 0;
  }
}

function rtlRestart(){
  rtlDismiss();
  setTimeout(rtlStart, 300);
}

function rtlManualStart(){
  if(!rtlPrefs.enabled) return;
  if(rtlState.active){ rtlStop(false); } else { rtlStart(); }
}

function rtlOnNoteOpen(){
  if(!rtlPrefs.enabled) return;
  // Do NOT stop the timer when switching notes — a focus session should
  // survive note changes. Only auto-start if no session is already running.
  if(rtlPrefs.autoStart && !rtlState.active) rtlStart();
}

function tbRtlToggle(){
  if(typeof rtlState==='undefined') return;
  if(rtlState.active){
    rtlStop(true);
  } else {
    if(!rtlPrefs.enabled){ rtlPrefs.enabled = true; rtlSave(); rtlApplySettingsUI(); }
    if(typeof rtlStart==='function') rtlStart();
  }
  tbRtlSyncBtn();
}
function tbTasksRtlToggle(){
  if(typeof rtlState==='undefined') return;
  if(rtlState.active){
    rtlStop(true);
  } else {
    if(!rtlPrefs.enabled){ rtlPrefs.enabled = true; rtlSave(); rtlApplySettingsUI(); }
    if(typeof rtlStart==='function') rtlStart();
  }
  tbRtlSyncBtn();
}
function tbRtlSyncBtn(){
  const running = typeof rtlState!=='undefined' && rtlState.active;
  // Notes toolbar button
  const btn = document.getElementById('tbRtlBtn');
  if(btn){
    btn.classList.toggle('active-tool', running);
    btn.title = running ? 'Stop focus timer' : 'Start focus timer';
  }
  // Tasks topbar button
  const tmBtn = document.getElementById('tmRtlBtn');
  if(tmBtn){
    const label = document.getElementById('tmRtlBtnLabel');
    tmBtn.style.color = running ? 'var(--g)' : 'var(--txt3)';
    tmBtn.style.borderColor = running ? 'var(--accent-border)' : 'var(--btn-border)';
    tmBtn.style.background = running ? 'var(--btn-hover-bg)' : 'var(--btn-bg)';
    tmBtn.title = running ? 'Stop focus timer' : 'Start focus timer';
    if(label) label.textContent = running ? 'Stop' : 'Timer';
  }
  // Sync mobile icon-only timer button
  const mTimerBtn = document.getElementById('mobileTimerBtn');
  if(mTimerBtn){
    mTimerBtn.classList.toggle('running', running);
    mTimerBtn.title = running ? 'Stop focus timer' : 'Start focus timer';
  }
}

function folioClearAllNotes(){
  folioConfirm('Delete ALL notes? This cannot be undone.','Delete All').then(ok=>{
    if(!ok)return;
    notes=[];
    activeNoteId=null;
    folioSetDismissed(FOLIO_SAMPLE_NOTES_DISMISSED_KEY);
    persistNotes();
    renderList();
    document.getElementById('notesEditorWrap').style.display='none';
    document.getElementById('notesEmptyState').style.display='flex';
    showToast('All notes cleared');
  });
}
function folioClearAllTasks(){
  folioConfirm('Delete ALL tasks? This cannot be undone.','Delete All').then(ok=>{
    if(!ok)return;
    tasks=[];
    folioSetDismissed(FOLIO_SAMPLE_TASKS_DISMISSED_KEY);
    persistTasks();
    renderTasks();
    showToast('All tasks cleared');
  });
}
function folioConfirm(msg, okLabel='OK'){
  return new Promise(resolve=>{
    _confirmResolve=(val)=>{
      const ov=document.getElementById('folioConfirmOverlay');
      ov.classList.remove('open');
      document.body.style.overflow='';
      resolve(val);
    };
    document.getElementById('folioConfirmMsg').textContent=msg;
    document.getElementById('folioConfirmOkBtn').textContent=okLabel;
    const ov=document.getElementById('folioConfirmOverlay');
    ov.classList.add('open');
    document.body.style.overflow='hidden';
  });
};