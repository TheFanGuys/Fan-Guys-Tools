(function(){
 'use strict';
 const script=document.currentScript,base=new URL('../',script?script.src:location.href);
 const tool=location.pathname.split('/').filter(Boolean).slice(-1)[0]==='index.html'?location.pathname.split('/').filter(Boolean).slice(-2)[0]:location.pathname.split('/').filter(Boolean).slice(-1)[0];
 const tools=[['survey','Survey','Capture site conditions'],['estimate','Estimate','Check your pricing'],['layout','Layout','Place fans and routes'],['materials','Materials','Build the takeoff'],['tech','Tech Pro','Specs and troubleshooting']];
 const names=Object.fromEntries(tools.map(([id,name])=>[id,name]));
 const surveySteps=[['job','Job'],['fans','Fans'],['aerial','Access'],['photos','Photos'],['code','Clearance'],['summary','Review']];
 const estimateSteps=[['fans','Fans','install-pills'],['costs','Costs','misc-list'],['travel','Travel','zip'],['review','Review','calc-btn']];
 const guideCopy={
  survey:[['Record','Start with site access and fan count. Mark answers you have not checked as unknown.'],['Measure','Enter mounting and blade heights from the site, then add photos of the structure and obstructions.'],['Review','Read the clearance warnings and the circuit planning label before leaving the survey.']],
  estimate:[['Scope','Choose an install type, add its fans, then switch type to add a mixed scope.'],['Cost','Enter miscellaneous items, breaker allowance, mounting steel, and your local labor rates.'],['Review','Check workdays, travel days, hotel nights, margin and markup before saving a PDF.']],
  layout:[['Import','Use the Layout menu to bring in a PDF page or photo of a floor plan.'],['Calibrate','Tap two points on a known dimension and enter the real distance. Verify a second measurement.'],['Place','Use Add to place fans; use Layers to isolate objects; check the drawing before exporting.']],
  materials:[['Find','Search a name or jump to a category. Categories open only when you need them.'],['Count','Use the stepper or type a number. EMT is in 10 ft sticks; flex and rod are in feet.'],['Share','Preview only counted items, then export a PDF or open the share sheet.']],
  tech:[['Find','Start with Fan Setup or Fault Lookup and select the actual brand and model.'],['Check','Use electrical checks and calculators as field references; verify nameplates and manuals.'],['Document','Save parameter captures and open manuals when you need model-specific instructions.']]
 };
 const guideIcons=[`<svg viewBox="0 0 96 56" aria-hidden="true"><rect x="12" y="9" width="72" height="38" rx="5"/><path d="M24 21h35M24 30h48M24 39h26"/><circle cx="71" cy="21" r="4"/></svg>`,`<svg viewBox="0 0 96 56" aria-hidden="true"><path d="M14 40h68M22 40V13h52v27M31 22h34M31 30h17"/><circle cx="60" cy="29" r="7"/></svg>`,`<svg viewBox="0 0 96 56" aria-hidden="true"><path d="M22 9h43l12 12v26H22zM65 9v12h12M33 30h35M33 38h23"/></svg>`];
 const make=(tag,cls,txt)=>{let n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
 function init(){
  if(!names[tool])return;
  document.body.dataset.tool=tool;FGTStore.setItem('fgt-last-tool',JSON.stringify(tool));let activeSurvey='job',activeEstimate=0;
  const head=make('header','workspace-header');
  const back=make('a','workspace-back','‹');back.href=base.href;back.setAttribute('aria-label','Project dashboard');
  const title=make('div','workspace-title'),label=make('small',null,names[tool]),project=make('button','workspace-project');
  project.type='button';project.setAttribute('aria-label','Switch project');title.append(label,project);
  const status=make('span','workspace-status','On device');status.id='workspace-status';
  const theme=make('button','workspace-theme','◐');theme.type='button';theme.setAttribute('aria-label','Toggle daylight theme');
  theme.onclick=()=>{let light=document.documentElement.dataset.theme!=='light';document.documentElement.dataset.theme=light?'light':'dark';document.body.classList.toggle('light',light);if(tool==='survey')document.body.classList.toggle('dark',!light);FGTStore.setItem('fgt-theme',JSON.stringify(light?'light':'dark'));window.dispatchEvent(new CustomEvent('fgt-theme-change',{detail:light?'light':'dark'}));};
  head.append(back,title,status,theme);document.body.prepend(head);
  function updateProject(){project.textContent=(FGTStore.current()?.name||'Choose project')+' ⌄';}
  updateProject();let light=FGTStore.readRaw('fgt-theme','dark')==='light';document.documentElement.dataset.theme=light?'light':'dark';document.body.classList.toggle('light',light);if(tool==='survey')document.body.classList.toggle('dark',!light);
  const veil=make('div','workspace-veil');veil.hidden=true;
  const sheet=make('section','workspace-sheet');sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');sheet.setAttribute('aria-label','Navigation');
  const heading=make('div','workspace-sheet-head'),headingText=make('h2',null,'Open a tool'),close=make('button','workspace-sheet-close','×');close.type='button';close.setAttribute('aria-label','Close navigation');heading.append(headingText,close);sheet.append(heading);
  const list=make('div','workspace-sheet-list');sheet.append(list);veil.append(sheet);document.body.append(veil);
  const hide=()=>{veil.hidden=true;document.body.classList.remove('workspace-menu-open');};close.onclick=hide;veil.addEventListener('click',e=>{if(e.target===veil)hide();});document.addEventListener('keydown',e=>{if(e.key==='Escape')hide();});
  function show(mode){headingText.textContent=mode==='projects'?'Switch project':mode==='guide'?names[tool]+' · quick guide':'Open a tool';list.replaceChildren();
   if(mode==='guide'){
    guideCopy[tool].forEach(([name,description],i)=>{const card=make('div','workspace-guide-card');card.innerHTML=guideIcons[i];card.append(make('strong',null,(i+1)+' · '+name),make('p',null,description));list.append(card);});
   }else if(mode==='projects'){
    for(const j of FGTStore.jobs().filter(j=>!j.archived)){const b=make('button','workspace-sheet-item'),name=make('strong',null,j.name),sub=make('small',null,j.customer||'Saved on this phone');b.type='button';b.append(name,sub);if(j.id===FGTStore.current()?.id)b.classList.add('current');b.onclick=()=>{if(j.id!==FGTStore.current()?.id){FGTStore.switchJob(j.id);location.reload();}else hide();};list.append(b);}
    const all=make('a','workspace-sheet-item','Manage projects ↗');all.href=base.href+'#jobs';list.append(all);
   }else{
    for(const [id,name,description] of tools){const a=make('a','workspace-sheet-item');a.href=new URL(id+'/',base).href;a.append(make('strong',null,name),make('small',null,description));if(id===tool)a.classList.add('current');list.append(a);}
    const help=make('button','workspace-sheet-item workspace-guide-link');help.type='button';help.append(make('strong',null,'? How to use '+names[tool]),make('small',null,'Three illustrated steps · works offline'));help.onclick=()=>show('guide');list.append(help);
   }
   veil.hidden=false;document.body.classList.add('workspace-menu-open');close.focus();
  }
  project.onclick=()=>show('projects');
  if(tool!=='layout'){const help=make('button','workspace-header-help','?');help.type='button';help.setAttribute('aria-label','How to use '+names[tool]);help.onclick=()=>show('guide');head.insertBefore(help,theme);}
  const nav=make('nav','workspace-nav');nav.setAttribute('aria-label','Field navigation');
  const home=make('a','workspace-nav-action','⌂ Project');home.href=base.href;
  const switcher=make('button','workspace-nav-action workspace-nav-primary','▦ Tools');switcher.type='button';switcher.onclick=()=>show('tools');
  const next=make('button','workspace-nav-action','Next →');next.type='button';nav.append(home,switcher,next);document.body.append(nav);
  if(tool==='layout'){const quick=make('button','workspace-header-tools','Tools');quick.type='button';quick.onclick=()=>show('tools');head.insertBefore(quick,theme);}
  if(tool==='survey'){
   const steps=make('nav','workspace-steps');steps.setAttribute('aria-label','Survey sections');
   for(const [id,name] of surveySteps){let b=make('button','workspace-step',name);b.type='button';b.dataset.step=id;b.onclick=()=>{window.showPage(id);activeSurvey=id;refresh();window.scrollTo({top:0,behavior:'smooth'});};steps.append(b);}
   head.after(steps);
   function refresh(){for(const b of steps.children)b.setAttribute('aria-current',b.dataset.step===activeSurvey?'step':'false');next.textContent=activeSurvey==='summary'?'Estimate →':'Next section →';}
   next.onclick=()=>{const i=surveySteps.findIndex(x=>x[0]===activeSurvey);if(i===surveySteps.length-1)location.assign(new URL('estimate/',base).href);else steps.querySelector('[data-step="'+surveySteps[i+1][0]+'"]').click();};refresh();
   const previous=window.showPage;window.showPage=function(id){previous(id);activeSurvey=id;refresh();};
  }else if(tool==='estimate'){
   const steps=make('nav','workspace-steps');steps.setAttribute('aria-label','Estimate sections');
   for(const [id,name,target] of estimateSteps){let b=make('button','workspace-step',name);b.type='button';b.onclick=()=>jump(estimateSteps.findIndex(x=>x[0]===id));steps.append(b);}
   head.after(steps);
   function jump(i){activeEstimate=i;const target=document.getElementById(estimateSteps[i][2]);target?.closest('.section')?.scrollIntoView({behavior:'smooth',block:'start'});if(i===3)target?.scrollIntoView({behavior:'smooth',block:'center'});refresh();}
   function refresh(){[...steps.children].forEach((b,i)=>b.setAttribute('aria-current',i===activeEstimate?'step':'false'));next.textContent=activeEstimate===3?'Materials →':'Next section →';}
   next.onclick=()=>activeEstimate===3?location.assign(new URL('materials/',base).href):jump(activeEstimate+1);refresh();
   const app=document.getElementById('app'),calc=document.getElementById('calc-btn');if(app&&calc){for(const id of ['install-pills','fan-grid','misc-list','breaker-qty','steel-pills','zip','tier-grid','crew-num','travel-pills','miles-input']){const section=document.getElementById(id)?.closest('.section');if(section)app.insertBefore(section,calc);}}
  }else{
   const nextTool={layout:'materials',materials:'tech',tech:'survey'}[tool];next.textContent=tool==='layout'?'Materials →':tool==='materials'?'Tech Pro →':'Survey →';next.onclick=()=>location.assign(new URL(nextTool+'/',base).href);
  }
  window.addEventListener('fgt-save',e=>{status.textContent=e.detail.ok?'Saved on device':'Save failed';status.classList.toggle('failed',!e.detail.ok);if(!e.detail.ok)alert(e.detail.message);});
  if(tool==='layout'){const btn=document.getElementById('mJobs');if(btn)btn.onclick=()=>location.assign(base.href+'#jobs');}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
 if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register(new URL('sw.js',base)).catch(()=>{}));
})();
