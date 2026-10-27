let AREA='for',bt='obs';
const GR=['Aves','Mamíferos','Reptiles','Anfibios','Peces','Insectos','Plantas','Otros'],MT=['Observación directa','Canto','Red de niebla','Cámara trampa','Trampa Sherman','Huella/rastro','Excreta','Captura manual','Otro'];
const shrink=f=>new Promise(r=>{const i=new Image();i.onload=()=>{const k=Math.min(1,700/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);r(c.toDataURL('image/jpeg',.6))};i.src=URL.createObjectURL(f)});
function bioR(a){D.bsp=D.bsp||[];$('#dsci').innerHTML=D.bsp.map(s=>`<option value="${esc(s[0])}">`).join('');$('#dcom').innerHTML=D.bsp.filter(s=>s[1]).map(s=>`<option value="${esc(s[1])}">`).join('');
$('#nv').innerHTML=[['obs','🦎 Registros'],['bres','📊 Diversidad'],['team','👥 Equipo'],['bcfg','⚙ Config']].map(x=>`<button class="${bt==x[0]?'on':''}" onclick="bt='${x[0]}';R()">${x[1]}</button>`).join('');
a.innerHTML={obs:obsT,bres:bresT,team:teamT,bcfg:bcfgT}[bt]()}
function bioLocalDate(d=new Date()){const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`}
function bioLocalTime(d=new Date()){const p=n=>String(n).padStart(2,'0');return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`}
function obsT(){const n=new Date(),d0=bioLocalDate(n),h0=bioLocalTime(n);
return`<div class="card"><h3>Nuevo registro de fauna</h3><div class="row"><div>Fecha de observación<input id="bf" type="date" value="${d0}"><small>La fecha se puede corregir si el registro corresponde a otro día.</small></div><div>Hora automática de registro<input id="bh" type="text" value="${h0}" readonly aria-readonly="true"><small>Se toma del reloj del teléfono al guardar; no tienes que escribirla.</small></div></div><div class="row"><div>Grupo<select id="bg">${GR.map(g=>`<option>${g}</option>`).join('')}</select></div><div>Cantidad<input id="bn" type="number" min="1" value="1"></div></div><br>
<input id="bs" list="dsci" placeholder="Nombre científico" onchange="bfill('s')"><br><br><input id="bc" list="dcom" placeholder="Nombre común" onchange="bfill('c')"><br><br><div class="row"><select id="bm">${MT.map(g=>`<option>${g}</option>`).join('')}</select><input id="bhab" placeholder="Hábitat / microhábitat"></div><br><input id="bno" placeholder="Notas"><br><br>
<button id="bsavebtn" onclick="bsave()">📍 Guardar registro · hora automática</button><label style="display:inline-block;border:1px solid var(--g);color:var(--g);border-radius:10px;padding:8px 12px">📷 Foto<input id="bfo" type="file" accept="image/*" capture="environment" hidden onchange="toast('Foto lista')"></label><small id="bst"></small></div>
<div class="card"><h3>${P.obs.length} registros de fauna</h3><div class="sc"><table><tr><th>Fecha</th><th>Hora de registro</th><th>Especie</th><th>N</th><th>Grupo</th><th>Coordenadas</th><th></th></tr>${[...P.obs].reverse().map(o=>`<tr><td>${esc(o.f||'')}</td><td>${esc(o.h||'—')}</td><td><i>${esc(o.sci||o.com)}</i></td><td>${o.n}</td><td>${esc(o.g)}</td><td>${U(o)}</td><td>${o.foto?`<img src="${o.foto}" height="32">`:''}<button class="r" onclick="P.obs=P.obs.filter(x=>x.id!=${o.id});save();R()">✕</button></td></tr>`).join('')}</table></div></div>`}
function bfill(w){const v=(w=='s'?$('#bs'):$('#bc')).value.trim().toLowerCase(),m=D.bsp.find(x=>x[w=='s'?0:1].toLowerCase()==v);if(m){$('#bs').value=m[0];if(m[1])$('#bc').value=m[1]}}
async function bsave(){
const sci=$('#bs').value.trim(),com=$('#bc').value.trim();
if(!sci&&!com)return toast('Escribe la especie');
const btn=$('#bsavebtn');if(btn&&btn.disabled)return;
// La marca de tiempo se captura al iniciar el guardado, usando la hora local del teléfono.
const registeredAt=new Date(),h=bioLocalTime(registeredAt),fDate=$('#bf').value||bioLocalDate(registeredAt);
if($('#bh'))$('#bh').value=h;
if(btn)btn.disabled=true;
$('#bst').textContent=` Guardando registro · ${fDate} ${h}…`;
try{
  const c=await pos(),f=$('#bfo').files[0],foto=f?await shrink(f):null;
  if(sci&&!D.bsp.some(x=>x[0].toLowerCase()==sci.toLowerCase()))D.bsp.push([sci,com]);
  const timezone=(()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(_){return ''}})();
  P.obs.push({id:registeredAt.getTime(),f:fDate,h,ts:registeredAt.toISOString(),tz:timezone,utcOffsetMin:-registeredAt.getTimezoneOffset(),g:$('#bg').value,sci,com,n:+$('#bn').value||1,m:$('#bm').value,hab:$('#bhab').value,nota:$('#bno').value,lat:c?c.latitude:null,lon:c?c.longitude:null,foto});
  if(c&&!P.zone)P.zone=utm(c.latitude,c.longitude).z;
  save();R();toast(c?'Fauna guardada con hora y GPS':'Fauna guardada con hora; sin GPS');
}catch(e){if(btn)btn.disabled=false;$('#bst')&&($('#bst').textContent=' No se pudo guardar el registro. Intenta nuevamente.');toast('No se pudo guardar: '+(e.message||'error'))}
}
function bresT(){const o=P.obs;if(!o.length)return'<div class="card">Aún no hay registros.</div>';const sp={},gr={};let N=0;o.forEach(x=>{const k=x.sci||x.com;sp[k]=(sp[k]||0)+x.n;gr[x.g]=(gr[x.g]||0)+x.n;N+=x.n});
const ks=Object.entries(sp).sort((a,b)=>b[1]-a[1]),S=ks.length,H=-ks.reduce((a,[,n])=>a+n/N*Math.log(n/N),0),Si=1-ks.reduce((a,[,n])=>a+(n/N)**2,0);
return`<div class="card"><h3>Diversidad</h3>Riqueza (S): <b>${S}</b> · Abundancia (N): <b>${N}</b><br>Shannon H′: <b>${H.toFixed(3)}</b> · Simpson 1−D: <b>${Si.toFixed(3)}</b> · Pielou J′: <b>${S>1?(H/Math.log(S)).toFixed(3):'-'}</b></div><div class="card"><div class="sc"><table><tr><th>Especie</th><th>N</th><th>pi %</th></tr>${ks.map(([k,n])=>`<tr><td><i>${esc(k)}</i></td><td>${n}</td><td>${(n/N*100).toFixed(1)}</td></tr>`).join('')}</table></div></div><div class="card">${Object.entries(gr).map(([g,n])=>`${g}: <b>${n}</b>`).join(' · ')}</div>`}
function bcfgT(){return`<div class="card"><h3>Coordenadas</h3>Zona UTM<input type="number" value="${P.zone||''}" placeholder="auto" onchange="P.zone=+this.value||null;save();R()"></div><div class="card"><h3>Exportar</h3><button onclick="bex('csv')">CSV</button><button onclick="bex('kml')">KML</button></div><div class="card"><button class="r" onclick="if(confirm('¿Eliminar proyecto?')){D.p=D.p.filter(x=>x!=P);P=null;save();R()}">Eliminar proyecto</button></div>`}
function bex(t){const o=P.obs,n=P.name.replace(/\W+/g,'_');if(t=='csv'){const r=[['Fecha de observación','Hora automática local','Marca de tiempo ISO','Zona horaria del dispositivo','Desfase UTC (min)','Grupo','Científico','Común','Cantidad','Método','Hábitat','Notas','Lat','Lon'],...o.map(x=>[x.f,x.h,x.ts,x.tz,x.utcOffsetMin,x.g,x.sci,x.com,x.n,x.m,x.hab,x.nota,x.lat,x.lon])];return dl(n+'.csv',new Blob(['\ufeff'+r.map(a=>a.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n')],{type:'text/csv'}))}
dl(n+'.kml',new Blob([`<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${esc(P.name)}</name>`+o.filter(x=>x.lat!=null).map(x=>`<Placemark><name>${esc(x.sci||x.com)} (${x.n})</name><description>${esc(x.g+' | Fecha: '+(x.f||'')+' | Hora local: '+(x.h||'')+' | Zona horaria: '+(x.tz||'')+' | Registro ISO: '+(x.ts||''))}</description><Point><coordinates>${x.lon},${x.lat},0</coordinates></Point></Placemark>`).join('')+'</Document></kml>'],{type:'application/vnd.google-earth.kml+xml'}))}
