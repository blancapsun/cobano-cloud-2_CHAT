// ====== PEGA AQUÍ LA CONFIGURACIÓN DE TU PROYECTO FIREBASE ======
const FBC={apiKey:"",authDomain:"",projectId:"",appId:""};
// ================================================================
const T={u:null,code:'',name:'',share:true,mem:{},rs:[],vo:[],h:{},o:null,un:[],init:0};
try{T.code=localStorage.getItem('tc')||'';T.name=localStorage.getItem('tn')||'';T.share=localStorage.getItem('ts')!=='0'}catch(_){}
let fdb,fau,wid=null,lastL=0,mr=null,chk=[],tm2,held=0,stm;
const tdoc=()=>fdb.collection('teams').doc(T.code);
function fbInit(){if(T.init||!FBC.apiKey||!window.firebase)return;T.init=1;firebase.initializeApp(FBC);fau=firebase.auth();fdb=firebase.firestore();fdb.enablePersistence({synchronizeTabs:true}).catch(()=>{});fau.onAuthStateChanged(u=>{T.u=u;if(u&&T.code)listen();else R()})}
window.addEventListener('load',fbInit);
const upd=()=>{const a=document.activeElement;if(P&&(P.area=='bio'?bt:tab)=='team'&&(!a||a.tagName!='INPUT'))R()};
async function tlogin(){const e=$('#te').value.trim(),p=$('#tp').value,n=$('#tn').value.trim(),c=$('#tc').value.trim().toLowerCase();if(!e||p.length<6||!n||!c)return toast('Completa nombre, correo, contraseña (6+) y código');
T.name=n;T.code=c;try{localStorage.setItem('tn',n);localStorage.setItem('tc',c)}catch(_){}
try{await fau.signInWithEmailAndPassword(e,p)}catch(x){if(/user-not-found|invalid-credential/.test(x.code)){try{await fau.createUserWithEmailAndPassword(e,p)}catch(y){return toast(y.code=='auth/email-already-in-use'?'Contraseña incorrecta':y.message)}}else return toast(x.message)}
if(fau.currentUser){T.u=fau.currentUser;listen()}}
function listen(){T.un.forEach(f=>f());T.un=[];const c=tdoc();let first=1;
T.un.push(c.collection('members').onSnapshot(s=>{T.mem={};s.forEach(d=>T.mem[d.id]=d.data());upd()}));
T.un.push(c.collection('sites').onSnapshot(s=>{T.rs=s.docs.map(d=>d.data());upd()}));
T.un.push(c.collection('voice').orderBy('t','desc').limit(15).onSnapshot(s=>{T.vo=s.docs.map(d=>({id:d.id,...d.data()}));if(!first)s.docChanges().forEach(x=>{const v=x.doc.data();if(x.type=='added'&&v.uid!=T.u.uid){toast('🔊 '+v.name);play(v)}});first=0;upd()}));
loc();R()}
function loc(){if(wid!=null){navigator.geolocation.clearWatch(wid);wid=null}if(!T.share||!T.u||!T.code||!navigator.geolocation)return;
wid=navigator.geolocation.watchPosition(p=>{const n=Date.now();if(n-lastL<15000)return;lastL=n;tdoc().collection('members').doc(T.u.uid).set({name:T.name,lat:p.coords.latitude,lon:p.coords.longitude,t:n,share:true})},()=>{},{enableHighAccuracy:true,maximumAge:5000})}
function tshare(v){T.share=v;try{localStorage.setItem('ts',v?'1':'0')}catch(_){}if(!v&&T.u)tdoc().collection('members').doc(T.u.uid).set({name:T.name,share:false,t:Date.now()});loc();R()}
function onSave(){clearTimeout(stm);stm=setTimeout(tsync,2500)}
function tsync(){if(!T.u||!T.code||!P||!fdb)return;const c=tdoc().collection('sites'),b=fdb.batch();let k=0;
const it=P.area=='bio'?(P.obs||[]).map(o=>({id:P.id+'_o'+o.id,d:{kind:'b',pid:P.id,pn:P.name,sp:o.sci||o.com||'',g:o.g,n:o.n,f:o.f,h:o.h,ts:o.ts||null,tz:o.tz||'',utcOffsetMin:o.utcOffsetMin??null,m:o.m||'',hab:o.hab||'',nota:o.nota||'',lat:o.lat,lon:o.lon}})):P.sites.filter(s=>s.trees.length||s.lat!=null).map(s=>({id:P.id+'_'+s.n,d:{kind:'f',pid:P.id,pn:P.name,n:s.n,lat:s.lat,lon:s.lon,trees:s.trees}}));
it.forEach(i=>{i.d.by=T.name;i.d.uid=T.u.uid;const j=JSON.stringify(i.d);if(T.h[i.id]==j)return;T.h[i.id]=j;const d=JSON.parse(j);d.t=Date.now();b.set(c.doc(i.id),d);k++});if(k)b.commit().catch(e=>toast(e.message))}
async function recS(){if(!T.u||mr)return;try{const s=await navigator.mediaDevices.getUserMedia({audio:true});if(!held){s.getTracks().forEach(t=>t.stop());return}mr=new MediaRecorder(s,{audioBitsPerSecond:16000});chk=[];mr.ondataavailable=e=>chk.push(e.data);
mr.onstop=()=>{s.getTracks().forEach(t=>t.stop());const m=mr.mimeType,b=new Blob(chk,{type:m});mr=null;if(b.size>700000||b.size<500)return toast('Mensaje vacío o muy largo');const r=new FileReader();r.onload=()=>tdoc().collection('voice').add({uid:T.u.uid,name:T.name,t:Date.now(),mime:m,audio:r.result.split(',')[1]}).then(()=>toast('Mensaje enviado')).catch(e=>toast(e.message));r.readAsDataURL(b)};
mr.start();tm2=setTimeout(recE,20000);const m=$('#mic');if(m)m.textContent='🔴 Grabando… suelta para enviar'}catch(e){toast('Sin permiso de micrófono')}}
function recE(){clearTimeout(tm2);if(mr&&mr.state=='recording')mr.stop();const m=$('#mic');if(m)m.textContent='🎙 Mantén presionado para hablar'}
const play=v=>{try{new Audio('data:'+v.mime+';base64,'+v.audio).play()}catch(e){}};
function teamT(){fbInit();if(!FBC.apiKey)return'<div class="card"><h3>👥 Equipo</h3>Falta conectar Firebase: pega tu configuración en el archivo <b>team.js</b> (arriba, línea FBC) y vuelve a guardarlo en GitHub.</div>';
if(!window.firebase)return'<div class="card">No cargó Firebase. Revisa tu conexión.</div>';
if(!T.u||!T.code)return`<div class="card"><h3>👥 Entrar al equipo</h3><input id="tn" placeholder="Tu nombre" value="${esc(T.name)}"><br><br><input id="te" type="email" placeholder="Correo"><br><br><input id="tp" type="password" placeholder="Contraseña (6 o más)"><br><br><input id="tc" placeholder="Código del equipo" value="${esc(T.code)}"><br><small>Toda tu brigada usa el mismo código. Si el correo no existe, se crea la cuenta.</small><br><button onclick="tlogin()">Entrar</button></div>`;
const bio=P.area=='bio',now=Date.now(),ago=t=>{const m=Math.round((now-t)/60000);return m<1?'ahora':m<60?m+' min':Math.round(m/60)+' h'};
const ms=Object.entries(T.mem).filter(([,m])=>m.share!==false&&m.lat!=null),rs=T.rs.filter(r=>r.kind==(bio?'b':'f')),pts=[...ms.map(([,m])=>[m.lat,m.lon]),...rs.filter(r=>r.lat!=null).map(r=>[r.lat,r.lon])];
let map='<small>Aún no hay ubicaciones compartidas.</small>';
if(pts.length){const la=pts.reduce((a,p)=>a+p[0],0)/pts.length,lo=pts.reduce((a,p)=>a+p[1],0)/pts.length,kx=111320*Math.cos(la*Math.PI/180),ky=110574,q=p=>[(p[1]-lo)*kx,-(p[0]-la)*ky],xs=pts.map(q),mx=Math.min(...xs.map(a=>a[0])),my=Math.min(...xs.map(a=>a[1])),w=Math.max(...xs.map(a=>a[0]))-mx,h=Math.max(...xs.map(a=>a[1]))-my,sc=280/Math.max(w,h,1),f=p=>{const a=q(p);return[(a[0]-mx)*sc+30,(a[1]-my)*sc+30]};
map=`<svg viewBox="0 0 340 ${h*sc+60}" width="100%" style="background:var(--bg);border-radius:10px">${rs.filter(r=>r.lat!=null).map(r=>{const a=f([r.lat,r.lon]);return`<circle cx="${a[0]}" cy="${a[1]}" r="4" fill="#0a7bb5"/><text x="${a[0]+6}" y="${a[1]+4}" font-size="10" fill="currentColor">${bio?'':r.n}</text>`}).join('')}${ms.map(([id,m])=>{const a=f([m.lat,m.lon]);return`<circle cx="${a[0]}" cy="${a[1]}" r="8" fill="${id==T.u.uid?'#e08a00':'#b3372c'}"/><text x="${a[0]+10}" y="${a[1]+4}" font-size="12" font-weight="bold" fill="currentColor">${esc(m.name)} · ${ago(m.t)}</text>`}).join('')}</svg>`}
const g={};rs.forEach(r=>(g[r.by]??=[]).push(r));
return`<div class="card"><div class="row"><div><b>${esc(T.name)}</b><br><small>Equipo: ${esc(T.code)}</small></div><div><label><input type="checkbox" style="width:auto" ${T.share?'checked':''} onchange="tshare(this.checked)"> Compartir mi ubicación</label><small><br>Solo se actualiza con la app abierta y la pantalla encendida.</small></div><button class="s" onclick="fau.signOut().then(()=>{T.u=null;R()})">Salir</button></div></div>
<div class="card"><h3>Mapa del equipo</h3>${map}<small><br>● naranja = tú · ● rojo = compañeros · ● azul = ${bio?'registros':'sitios'}</small></div>
<div class="card"><h3>Radio</h3><button id="mic" style="width:100%;padding:18px;font-size:16px;touch-action:none" onpointerdown="held=1;recS()" onpointerup="held=0;recE()" onpointerleave="held=0;recE()" oncontextmenu="return false">🎙 Mantén presionado para hablar</button>${T.vo.map(v=>`<div class="row" style="flex-wrap:nowrap"><span><b>${esc(v.name)}</b> <small>${ago(v.t)}</small></span><button class="s" style="flex:0 0 auto" onclick="play(T.vo.find(x=>x.id=='${v.id}'))">▶</button></div>`).join('')}</div>
${Object.entries(g).map(([by,l])=>`<div class="card"><b>${esc(by)}</b> <small>${bio?l.length+' registros':l.length+' sitios · '+l.reduce((a,r)=>a+(r.trees||[]).length,0)+' árboles'}</small>${bio?l.slice(0,12).map(r=>`<div><small>${esc(r.sp)} ×${r.n} · ${esc(r.g)} · ${esc(r.f||'')} ${esc(r.h||'')}</small></div>`).join(''):l.sort((a,b)=>a.n-b.n).map(r=>{const k=r.pid+'_'+r.n;return`<div><button class="s" onclick="T.o=T.o=='${k}'?null:'${k}';R()">Sitio ${r.n} · ${(r.trees||[]).length} árb.</button></div>`+(T.o==k?`<div class="sc"><table>${(r.trees||[]).map(t=>`<tr><td><i>${esc(t.sci||t.com)}</i></td><td>${esc(t.d)} cm</td><td>${esc(t.h)} m</td></tr>`).join('')}</table></div>`:'')}).join('')}</div>`).join('')}`}
