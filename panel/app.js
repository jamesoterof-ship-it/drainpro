/* ============================================================
   PANEL JAYE GROUP — v3 (12 correcciones)
   WhatsApp (n8n) + Páginas (Apps Script) · refresco 15 s
   ============================================================ */
const BASE='https://n8n-production-8a42.up.railway.app/webhook';
const URL_CONV=BASE+'/leer-conversaciones';
const URL_HIST=BASE+'/historial';
const URL_PAUSA=BASE+'/pausar-activar';
const URL_RESP=BASE+'/responder';
const URL_VENTAS=BASE+'/ventas';
const URL_APROBAR=BASE+'/aprobar-pedido';
const URL_IMG='https://web-production-a5adc.up.railway.app/api/jaye/enviar-imagen';
const URL_HUELLAS=BASE+'/leer-huellas';
const URL_PEDWEB=BASE+'/leer-pedidos-web';   // pedidos de pagina desde Postgres (no Google)
const URL_ABANDONADOS=BASE+'/leer-abandonados'; // abandonados desde Postgres (no Google)
const URL_GENCOPY=BASE+'/generar-copy'; // creador de anuncios: genera copys con IA (Claude)
const URL_BUSCAGEO=BASE+'/buscar-geo'; // buscador de ubicaciones de Meta (ciudades/regiones)
const URL_ASESORCAMP=BASE+'/asesor-campana'; // asesor: recomienda qué hacer con una campaña existente
const URL_DETALLE=BASE+'/detalle-campana'; // detalle de una campaña (todos sus anuncios)
const URL_LEERVIS=BASE+'/leer-visitas'; // visitas de TODAS las páginas desde Postgres (no Google) — cualquier página nueva aparece sola
const URL_MONTAR=BASE+'/montar-campana'; // motor: sube la campaña/anuncios a Meta
const URL_SUBVID=BASE+'/subir-video'; // sube el video en binario (streaming, sin reventar memoria) y devuelve video_id
window.huellaMap={};
async function cargarHuellas(){
  try{
    const r=await fetch(URL_HUELLAS); const arr=await r.json();
    const m={}; (Array.isArray(arr)?arr:[]).forEach(h=>{ if(h&&h.tel8) m[h.tel8]=h; });
    window.huellaMap=m;
    if(typeof refrescarAprob==='function') refrescarAprob();
    else if(typeof renderAprobar==='function') renderAprobar();
  }catch(e){}
}
function huellaBadge(tel){
  var k=String(tel||'').replace(/\D/g,'').slice(-8); if(!k) return '';
  var h=(window.huellaMap||{})[k];
  var rc, sym, t;
  if(!h){ rc='#9aa4b2'; sym='+'; t='Cliente nuevo (sin historial)'; }
  else {
    rc={'Segura':'#1d9e75','Probable':'#caa000','Riesgosa':'#d8782e','Crítica':'#e24b4a'}[h.risk_label] || ((+h.n_dev||0)>0?'#d8782e':'#8a93a0');
    sym=(h.risk_label==='Segura' && (+h.n_dev||0)===0)?'✓':'!'; t='Ver alerta del cliente';
  }
  return '<button class="hbtn" onclick="event.stopPropagation();verHuella(this,\''+k+'\')" title="'+t+'" style="border:0;cursor:pointer;width:19px;height:19px;border-radius:50%;background:'+rc+';color:#fff;font-weight:700;font-size:12px;line-height:1;display:inline-flex;align-items:center;justify-content:center;padding:0;margin-left:6px;vertical-align:middle">'+sym+'</button>';
}
function cerrarHuella(){var e=document.getElementById('huellaPop'); if(e) e.remove();}
function verHuella(btn,k){
  cerrarHuella();
  var h=(window.huellaMap||{})[k];
  var dark=document.body.classList.contains('dark')||document.documentElement.classList.contains('dark');
  var bg=dark?'#1b2330':'#fff', bd=dark?'#33415a':'#d8dee8', tx=dark?'#e8edf4':'#1a2433', sub=dark?'#9fb0c6':'#5a6470';
  var d=document.createElement('div'); d.id='huellaPop';
  d.style.cssText='position:fixed;z-index:99999;width:250px;background:'+bg+';border:1px solid '+bd+';border-radius:12px;box-shadow:0 12px 34px rgba(0,0,0,.28);padding:12px 14px;font-size:12.5px;color:'+sub;
  if(!h){
    d.innerHTML='<div style="font-weight:700;margin-bottom:7px;color:'+tx+';display:flex;align-items:center;gap:7px"><span style="width:9px;height:9px;border-radius:50%;background:#9aa4b2;display:inline-block"></span>Cliente nuevo</div>'
      +'<div>Sin historial en tu tienda ni en Dropi. Es la <b style="color:'+tx+'">primera vez</b> que te pide.</div>';
  } else {
    var rc={'Segura':'#1d9e75','Probable':'#caa000','Riesgosa':'#d8782e','Crítica':'#e24b4a'}[h.risk_label]||'#8a93a0';
    var np=+h.n_ped||0,nd=+h.n_dev||0,dt=+h.dropi_total||0,dd=+h.dropi_dev||0;
    d.innerHTML='<div style="font-weight:700;margin-bottom:9px;color:'+tx+';display:flex;align-items:center;gap:7px"><span style="width:9px;height:9px;border-radius:50%;background:'+rc+';display:inline-block"></span>'+(h.risk_label||'Cliente')+(h.buyer_type?(' · '+h.buyer_type):'')+'</div>'
      +'<div style="margin-bottom:6px">Tu tienda: <b style="color:'+tx+'">'+np+' pedidos</b> · <b style="color:'+(nd>0?'#d8472e':'#1d9e75')+'">'+nd+' devol.</b></div>'
      +'<div>Dropi (plataforma): <b style="color:'+rc+'">'+(h.risk_label||'?')+'</b><br>'+dt+' pedidos · <b style="color:'+(dd>0?'#d8472e':'#1d9e75')+'">'+dd+' devoluciones</b></div>';
  }
  document.body.appendChild(d);
  var r=btn.getBoundingClientRect(); var W=250, H=d.offsetHeight||130;
  var left=r.right+8;                       /* al lado derecho del icono */
  var top=r.top + r.height/2 - H/2;          /* centrado verticalmente con el icono */
  if(left+W>window.innerWidth-6) left=r.left-W-8;   /* sin espacio a la derecha -> a la izquierda */
  if(left<6) left=6;
  if(top<6) top=6;
  if(top+H>window.innerHeight-6) top=window.innerHeight-H-6;
  d.style.top=top+'px'; d.style.left=left+'px';
}
document.addEventListener('click',function(e){ if(!e.target.closest('.hbtn') && !e.target.closest('#huellaPop')) cerrarHuella(); });
window.addEventListener('scroll',cerrarHuella,true);

/* ---------- Aprobación de pedidos (solo lo aprobado se monta en Dropi) ---------- */
function pnameId(p){ p=(p||'').toLowerCase(); if(p.includes('extract'))return 0; if(p.includes('shilajit'))return 113699; if(p.includes('tornado')||p.includes('drainpro'))return 69746; if(p.includes('nad'))return 120370; return 0; }
function keyPag(o){ return 'pag:'+o.pagina+':'+o.fila; }
function keyWa(o){ return 'wa:'+String(o.tel||'').slice(-8)+'|'+pnameId(o.prod)+'|'+String(o.fecha||'').split(',')[0]; }
function aprobSet(){ try{ return new Set(JSON.parse(localStorage.getItem('jaye_aprob')||'[]')); }catch(e){ return new Set(); } }
function rechazSet(){ try{ return new Set(JSON.parse(localStorage.getItem('jaye_rechaz')||'[]')); }catch(e){ return new Set(); } }
function guardarSet(n,s){ try{ localStorage.setItem(n, JSON.stringify([...s])); }catch(e){} }
function esAprobado(k){ return aprobSet().has(k); }
function esRechazado(k){ return rechazSet().has(k); }
function refrescarAprob(){ if(typeof renderPedidosWeb==='function') renderPedidosWeb(); if(typeof renderVentasWA==='function') renderVentasWA(); if(typeof renderVentasBot==='function') renderVentasBot(); if(typeof renderAprobar==='function') renderAprobar(); }
function aprobar(k){
  var a=aprobSet(); a.add(k); guardarSet('jaye_aprob',a);
  var r=rechazSet(); if(r.delete(k)) guardarSet('jaye_rechaz',r);   // aprobar manda sobre rechazar
  fetch(URL_APROBAR,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:k,accion:'aprobar'})}).catch(function(){});
  if(typeof toast==='function') toast('Aprobado ✓ — se montará en Dropi en el próximo ciclo');
  refrescarAprob();
}
function rechazar(k){
  var r=rechazSet(); r.add(k); guardarSet('jaye_rechaz',r);
  var a=aprobSet(); if(a.delete(k)) guardarSet('jaye_aprob',a);     // al rechazar, deja de estar aprobado
  fetch(URL_APROBAR,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:k,accion:'rechazar'})}).catch(function(){});
  if(typeof toast==='function') toast('Rechazado ✕ — no se montará en Dropi');
  refrescarAprob();
}
function deshacerRechazo(k){
  var r=rechazSet(); r.delete(k); guardarSet('jaye_rechaz',r);
  fetch(URL_APROBAR,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:k,accion:'quitar-rechazo'})}).catch(function(){});
  if(typeof toast==='function') toast('Rechazo deshecho — vuelve a Pendientes');
  refrescarAprob();
}
var BTN_APROB='background:var(--brand,#3056c9);color:#fff;border:0;border-radius:8px;padding:5px 12px;font-weight:700;font-size:12.5px;cursor:pointer';
function celdaAprob(k,montadoHtml){
  if(montadoHtml) return montadoHtml;
  if(esAprobado(k)) return '<span class="st st-rec"><i></i>Aprobado ⏳</span>';
  if(esRechazado(k)) return '<span class="st st-ab"><i></i>Rechazado</span><button class="b-desh" onclick="deshacerRechazo(&quot;'+k+'&quot;)">Deshacer</button>';
  return '<button class="b-apr" onclick="aprobar(&quot;'+k+'&quot;)">✓ Aprobar</button><button class="b-rech" title="Rechazar — no se monta en Dropi" onclick="rechazar(&quot;'+k+'&quot;)">✕</button>';
}

const PAGINAS=[
  {id:'shilajit', nombre:'Shilajit Ultra', url:'https://script.google.com/macros/s/AKfycbzhWqfMJVJiquBdOfOAqkgVFp9dHBphmpEk4CLd4woXSb4A9vIN_1iPq3PkjKKKHCusGQ/exec', color:'#0e8074'},
  {id:'drainpro', nombre:'DRAINPRO',      url:'https://script.google.com/macros/s/AKfycbwRayJ1bThod83lMlvOWSdE8MAedTPLbaxIcrDN301PYUk7SWZoen6pFE5rScYiuvra/exec', color:'#3060ea'}
];

const soloNum=t=>String(t||'').replace(/\D/g,'');
const esc=t=>String(t||'').replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
const fmtCLP=n=>'$'+Math.round(n).toLocaleString('es-CL');
const fmtCOP=n=>'$'+Math.round(n).toLocaleString('es-CO');
const fmtGS=n=>'Gs '+Math.round(n).toLocaleString('es-PY');
const numero=v=>{const n=parseFloat(String(v??'').replace(/[^\d.,-]/g,'').replace(/\./g,'').replace(',','.'));return isNaN(n)?0:n;};
const FLAG={CL:'flag-cl',CO:'flag-co',PY:'flag-py'};
const BOTNOM={Carlos:'Carlos · Chile',James:'James · Colombia',Ramon:'Ramón · Paraguay'};
const BOTLOC={Carlos:'CL',James:'CO',Ramon:'PY'};
const BOTCOLOR={Carlos:'linear-gradient(135deg,#0e8074,#3aa897)',James:'linear-gradient(135deg,#3060ea,#6a92f5)',Ramon:'linear-gradient(135deg,#7c4dd8,#a98aec)'};

let convos=[], ordenes=[], pedidosWeb=[], abandonadosWeb=[], visitasWeb=[], selTel=null;
let pedidosArchivo=[], visitasArchivo=[];   // meses ya archivados (solo Histórico)
let fBot='Carlos', fEst='todas', fPaisV='todas', fProdP='todos', tabConv='conv';
let fCanal='todos';                                   // (8) filtro de canal
let R={tipo:'hoy',desde:null,hasta:null};             // (9) rango de fechas
let Rconv={tipo:'7d',desde:null,hasta:null};          // rango de Conversaciones
let Rvis={tipo:'hoy',desde:null,hasta:null};          // rango de Visitas

/* ---------- fechas (con a. m./p. m.) ---------- */
function fechaOrden(f,h){
  const s=String(f||'').trim(); let d=null;
  let m=s.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
  if(m) d=new Date(+m[3],+m[2]-1,+m[1]);
  else { const t=Date.parse(s); if(!isNaN(t)) d=new Date(t); }
  if(!d||isNaN(d)) return 0;
  const full=String(h||'')+' '+s;
  const hm=full.match(/(\d{1,2}):(\d{2})/);
  if(hm){
    let hh=+hm[1]; const mm=+hm[2];
    if(/p\.?\s?m/i.test(full) && hh<12) hh+=12;
    if(/a\.?\s?m/i.test(full) && hh===12) hh=0;
    d.setHours(hh,mm);
  }
  return d.getTime();
}
function inicioDia(off){const d=new Date();d.setHours(0,0,0,0);return d.getTime()-off*864e5;}
function enRangoDe(ts,rg){
  if(!ts) return false;
  if(rg.tipo==='hoy')  return ts>=inicioDia(0);
  if(rg.tipo==='ayer') return ts>=inicioDia(1)&&ts<inicioDia(0);
  if(rg.tipo==='7d')   return ts>=inicioDia(6);
  if(rg.tipo==='30d')  return ts>=inicioDia(29);
  if(rg.tipo==='fechas'&&rg.desde&&rg.hasta) return ts>=rg.desde&&ts<rg.hasta+864e5;
  return true;
}
const enRango=ts=>enRangoDe(ts,R);
const TXT_RANGO={hoy:'hoy',ayer:'ayer','7d':'últimos 7 días','30d':'últimos 30 días',fechas:'rango elegido'};
const rangoTxt=()=>TXT_RANGO[R.tipo]||'hoy';

/* ---------- WhatsApp: normalizadores ---------- */
function normConv(r){
  const tel=soloNum(r.TELEFONO);
  const bot=String(r.BOT||'').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  const modo=String(r.MODO||'bot').trim().toLowerCase();
  const esR=bot.includes('ramon'); const esJ=bot.includes('james');
  return {n:r.NOMBRE||tel||'Sin nombre',tel,ultimo:r.ULTIMO_MENSAJE||'',hora:r.HORA||'',fecha:r.FECHA||'',
    orden:fechaOrden(r.FECHA,r.HORA),bot:esR?'Ramon':esJ?'James':'Carlos',loc:esR?'PY':esJ?'CO':'CL',
    estado:modo==='agente'?'pausada':'activa',msgs:[],loaded:false};
}
function parseHist(txt){
  if(!txt) return [];
  const parts=String(txt).split(/(?=(?:Cliente|Asistente|Ramón|Ramon|Carlos|James|Agente)\s*:)/g);
  const out=[];
  parts.forEach(p=>{p=p.trim();if(!p)return;
    const m=p.match(/^(Cliente|Asistente|Ramón|Ramon|Carlos|James|Agente)\s*:\s*([\s\S]*)$/);
    if(m){const lbl=m[1],body=m[2].trim();if(!body)return;
      const from=lbl==='Cliente'?'cliente':(lbl==='Agente'?'agente':'bot');out.push({from,text:body});}
    else out.push({from:'cliente',text:p});
  });
  return out;
}

/* ---------- cargas ---------- */
async function cargarConvos(){
  try{
    const res=await fetch(URL_CONV); const data=await res.json();
    const rows=Array.isArray(data)?data:(data.body||[]);
    const previo={}; convos.forEach(c=>{previo[c.tel]={msgs:c.msgs,loaded:c.loaded};});
    convos=rows.filter(r=>r&&r.TELEFONO).map(normConv).sort((a,b)=>b.orden-a.orden);
    convos.forEach(c=>{const p=previo[c.tel];if(p&&p.loaded){c.msgs=p.msgs;c.loaded=true;}});
    renderConvList(); renderBots(); renderResumen();
    if(selTel){const c=convos.find(x=>x.tel===selTel); if(c) pintarChatHead(c);}
  }catch(e){
    const el=document.getElementById('clist');
    if(el && !convos.length) el.innerHTML='<div class="vacio">No pude cargar conversaciones. Reintento…</div>';
  }
}
async function cargarVentas(){
  try{
    const res=await fetch(URL_VENTAS); const data=await res.json();
    const rows=Array.isArray(data)?data:(data.body||[]);
    const ords=[];
    rows.forEach(r=>{ if(!r||(!r.NOMBRE&&!r.PRODUCTO))return;
      const bot=String(r.BOT||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
      const esR=bot.includes('ramon'); const esJ=bot.includes('james'); const precio=numero(r.PRECIO);
      ords.push({cli:r.NOMBRE||'—',tel:soloNum(r.TELEFONO),prod:r.PRODUCTO||'—',cant:numero(r.CANTIDAD)||1,
        precioNum:precio,precio:esR?fmtGS(precio):esJ?fmtCOP(precio)+' COP':fmtCLP(precio),
        dir:r.DIRECCION||'—',zona:r.COMUNA||r.CIUDAD||'—',region:r.REGION||r.DEPARTAMENTO||'—',
        bot:esR?'Ramon':esJ?'James':'Carlos',loc:esR?'PY':esJ?'CO':'CL',estado:r.ESTADO||'—',
        conf:!/abono pendiente/i.test(String(r.ESTADO||'')),abono:/abono pendiente/i.test(String(r.ESTADO||'')),/* abono pendiente = NO confirmada hasta que pague el anticipo */
        montado:/montad/i.test(String(r.ESTADO||'')),
        ordenDropi:(String(r.ESTADO||'').match(/#(\d+)/)||[])[1]||'',
        fecha:r.FECHA||'',hora:r.HORA||'',orden:fechaOrden(r.FECHA,r.HORA)});
    });
    ordenes=ords.sort((a,b)=>b.orden-a.orden);   // (3) recientes primero
    renderVentasWA(); renderVentasBot(); renderBots(); renderResumen(); renderConvStats(); if(typeof renderAprobar==='function') renderAprobar();
  }catch(e){}
}
const mapPedido=r=>({fecha:r.fecha||'',cli:r.nombre||'—',tel:soloNum((r.indicativo||'')+(r.telefono||'')),
    prod:r.producto,color:r.color,pagina:r.pagina,dir:r.direccion||'—',ref:r.referencia||'',comuna:r.comuna||'—',
    region:r.region||'—',correo:r.correo||'',cant:numero(r.cantidad)||1,totalNum:numero(r.total),
    total:fmtCLP(numero(r.total)),conf:String(r.confirmado||'').toUpperCase()==='SI',
    dropi:String(r.dropi||'').toUpperCase()==='ENVIADO',fila:r.fila,orden:fechaOrden(r.fecha,'')});
async function cargarPaginas(){
  const conectadas=PAGINAS.filter(p=>p.url);
  let peds=[], abs=[], vis=[], pedsArch=[], visArch=[];
  // PEDIDOS DE PAGINA: desde Postgres (confiable, no Google)
  try{ const pr=await fetch(URL_PEDWEB); const pj=await pr.json(); (pj.pedidos||[]).forEach(r=>peds.push(r)); }catch(e){}
  // ABANDONADOS: desde Postgres (no Google)
  try{ const ar=await fetch(URL_ABANDONADOS); const aj=await ar.json(); (aj.abandonados||[]).forEach(r=>{ const pg=PAGINAS.find(x=>x.id===r.pagina); abs.push(Object.assign({color:pg?pg.color:'#3060ea'},r)); }); }catch(e){}
  // VISITAS: desde Postgres (NO Google). Cualquier página que reporte aparece sola.
  const COLORVIS={shilajit:'#0e8074',drainpro:'#3060ea',nad:'#b8860b'};
  const COLORROT=['#6cc24a','#9b59b6','#e67e22','#16a085','#c0392b','#2980b9'];
  try{
    const vr=await fetch(URL_LEERVIS); const vj=await vr.json();
    const rows=Array.isArray(vj)?vj:(vj.visitas||vj.data||[]);
    let ci=0; const ck={};
    rows.forEach(r=>{ const slug=r.pagina||'otro'; let col=COLORVIS[slug]; if(!col){ if(!ck[slug])ck[slug]=COLORROT[(ci++)%COLORROT.length]; col=ck[slug]; }
      vis.push({pagina:slug,producto:r.nombre||slug,color:col,fecha:r.dia,visitas:r.visitas,formulario:r.formularios}); });
  }catch(e){}
  pedidosWeb=peds.map(mapPedido).sort((a,b)=>b.orden-a.orden);
  pedidosArchivo=pedsArch.map(mapPedido);                 // meses ya archivados (solo para Histórico)
  visitasArchivo=visArch;
  abandonadosWeb=abs.map(r=>({fecha:r.fecha||'',cli:r.nombre||'—',tel:soloNum((r.indicativo||'')+(r.telefono||'')),
    prod:r.producto,color:r.color,estado:String(r.estado||'').toUpperCase(),comuna:r.comuna||'—',
    dir:r.direccion||'',ref:r.referencia||'',region:r.region||'',correo:r.correo||'',
    cant:numero(r.cantidad)||1,total:fmtCLP(numero(r.total)),contactado:!!r.contactado,contactadoFecha:fechaCorta(r.contactado),orden:fechaOrden(r.fecha,'')}))
    .filter(o=>o.estado!=='COMPLETADO')               // (6) solo NO completados
    .sort((a,b)=>b.orden-a.orden);
  visitasWeb=vis;
  renderPedidosWeb(); renderAbandonadosWeb(); renderVisitas(); renderResumen(); if(typeof renderAprobar==='function') renderAprobar();
}

/* ---------- RESUMEN (canal + rango funcionales) ---------- */
function renderResumen(){
  const el=id=>document.getElementById(id);
  const waR =ordenes.filter(o=>enRango(o.orden));
  const webR=pedidosWeb.filter(o=>enRango(o.orden));
  const usaWA = fCanal!=='web', usaWeb = fCanal!=='wa';
  const lbl=rangoTxt();
  ['lTot','lWa','lWeb','lMon'].forEach((id,i)=>{ if(el(id)) el(id).textContent=['Ventas totales ('+lbl+')','Ventas por WhatsApp ('+lbl+')','Ventas por página ('+lbl+')','Ventas '+lbl+' · por moneda'][i]; });
  if(el('kTot')) el('kTot').textContent=(usaWA?waR.length:0)+(usaWeb?webR.length:0);
  if(el('kWa'))  el('kWa').textContent=usaWA?waR.length:'—';
  if(el('kWeb')) el('kWeb').textContent=usaWeb?(PAGINAS.some(p=>p.url)?webR.length:'—'):'—';
  if(el('kWebMeta')) el('kWebMeta').textContent=usaWeb&&PAGINAS.some(p=>p.url)?(fmtCLP(webR.reduce((a,b)=>a+b.totalNum,0))+' CLP'):'—';
  if(el('kMonedas')){
    const tCL=(usaWA?waR.filter(o=>o.loc==='CL').reduce((a,b)=>a+b.precioNum,0):0)+(usaWeb?webR.reduce((a,b)=>a+b.totalNum,0):0);
    const tCO=usaWA?waR.filter(o=>o.loc==='CO').reduce((a,b)=>a+b.precioNum,0):0;
    const tPY=usaWA?waR.filter(o=>o.loc==='PY').reduce((a,b)=>a+b.precioNum,0):0;
    el('kMonedas').innerHTML=
      '<div class="mm"><span class="flag flag-cl"></span>'+fmtCLP(tCL)+'<small>CLP</small></div>'+
      '<div class="mm"><span class="flag flag-co"></span>'+fmtCOP(tCO)+'<small>COP</small></div>'+
      '<div class="mm"><span class="flag flag-py"></span>'+fmtGS(tPY).replace('Gs ','')+'<small>Gs</small></div>';
  }
  renderChart(); renderPaises(); renderActividad(); renderTopProd();
}
function renderActividad(){
  const cont=document.getElementById('actividadReciente'); if(!cont) return;
  const wa=ordenes.map(o=>({cli:o.cli,canal:'wa',prod:o.prod,loc:o.loc,bot:o.bot,money:o.precio,orden:o.orden,
    fecha:o.fecha,hora:o.hora}));
  const web=pedidosWeb.map(o=>({cli:o.cli,canal:'web',prod:o.prod,loc:'CL',color:o.color,money:o.total+' CLP',orden:o.orden,fecha:o.fecha}));
  const todo=wa.concat(web).sort((a,b)=>b.orden-a.orden).slice(0,8);
  if(!todo.length){cont.innerHTML='<div class="vacio">Aún no hay ventas.</div>';return;}
  cont.innerHTML='<div class="actfeed">'+todo.map(a=>{
    const bg=a.canal==='wa'?(BOTCOLOR[a.bot]||'#0e8074'):(a.color||'#3060ea');
    const ini=String(a.cli||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase()||'·';
    return '<div class="actrow"><div class="actav" style="background:'+bg+'">'+esc(ini)+'</div>'+
      '<div class="actinfo"><div class="n1">'+esc(a.cli&&a.cli!=='—'?a.cli:'Cliente')+'</div>'+
      '<div class="n2">'+esc(a.prod)+' · '+esc(a.fecha)+(a.hora?' '+esc(a.hora):'')+'</div></div>'+
      '<span class="actcanal '+(a.canal==='wa'?'act-wa':'act-web')+'">'+(a.canal==='wa'?'WhatsApp':'Página')+'</span>'+
      '<div class="actmoney">'+esc(a.money)+'</div></div>';
  }).join('')+'</div>';
}
function renderTopProd(){
  const cont=document.getElementById('topProductos'); if(!cont) return;
  const waR=ordenes.filter(o=>enRango(o.orden)), webR=pedidosWeb.filter(o=>enRango(o.orden));
  const prod={};
  if(fCanal!=='web') waR.forEach(o=>{const k=o.prod||'—';prod[k]=(prod[k]||0)+1;});
  if(fCanal!=='wa') webR.forEach(o=>{const k=o.prod||'—';prod[k]=(prod[k]||0)+1;});
  const top=Object.entries(prod).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const sub=document.getElementById('topProdSub'); if(sub) sub.textContent=rangoTxt();
  if(!top.length){cont.innerHTML='<div class="vacio">Sin ventas en el periodo.</div>';return;}
  const max=top[0][1]||1;
  cont.innerHTML=top.map(([n,c])=>'<div class="pais">'+esc(n)+'<div class="track"><i style="width:'+Math.round(c/max*100)+'%;background:#0e8074"></i></div><b>'+c+'</b></div>').join('');
}
function renderChart(){
  const cont=document.getElementById('chartReal'); if(!cont) return;
  const nD = R.tipo==='30d' ? 30 : (R.tipo==='fechas'&&R.desde&&R.hasta ? Math.min(31,Math.round((R.hasta-R.desde)/864e5)+1) : 7);
  const base = R.tipo==='fechas'&&R.desde ? R.desde : inicioDia(nD-1);
  const dias=[];
  for(let i=0;i<nD;i++){const d=new Date(base+i*864e5);dias.push({key:d.toDateString(),lbl:nD>10?String(d.getDate()):(d.toDateString()===new Date().toDateString()?'Hoy':d.toLocaleDateString('es-CL',{weekday:'short'})),wa:0,web:0});}
  if(fCanal!=='web') ordenes.forEach(o=>{if(!o.orden)return;const d=dias.find(x=>x.key===new Date(o.orden).toDateString());if(d)d.wa++;});
  if(fCanal!=='wa') pedidosWeb.forEach(o=>{if(!o.orden)return;const d=dias.find(x=>x.key===new Date(o.orden).toDateString());if(d)d.web++;});
  const max=Math.max(4,...dias.map(d=>d.wa+d.web));
  const W=620, m=40, slot=(W-m-10)/nD, bw=Math.min(15,slot*0.34);
  let bars='',labels='';
  dias.forEach((d,i)=>{
    const x=m+12+i*slot, hw=Math.round(d.web/max*150), ha=Math.round(d.wa/max*150);
    bars+=`<rect x="${x}" y="${186-hw}" width="${bw}" height="${hw||2}" rx="3" fill="#3060ea"/>`;
    bars+=`<rect x="${x+bw+3}" y="${186-ha}" width="${bw}" height="${ha||2}" rx="3" fill="#179f6b"/>`;
    if(d.web&&nD<=10)bars+=`<text x="${x+bw/2}" y="${178-hw}" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--ink)">${d.web}</text>`;
    if(d.wa&&nD<=10)bars+=`<text x="${x+bw*1.5+3}" y="${178-ha}" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--ink)">${d.wa}</text>`;
    if(nD<=10||i%5===0||i===nD-1)labels+=`<text x="${x+bw+1}" y="205" text-anchor="middle" font-size="11" fill="var(--ink-3)">${d.lbl}</text>`;
  });
  cont.innerHTML=`<svg viewBox="0 0 620 220" width="100%" height="210" preserveAspectRatio="none" font-family="Inter">
    <g stroke="var(--grid)" stroke-width="1"><line x1="40" y1="20" x2="610" y2="20"/><line x1="40" y1="65" x2="610" y2="65"/><line x1="40" y1="110" x2="610" y2="110"/><line x1="40" y1="155" x2="610" y2="155"/><line x1="40" y1="186" x2="610" y2="186"/></g>
    ${bars}${labels}</svg>`;
}
function renderPaises(){
  const cont=document.getElementById('paisesReal'); if(!cont) return;
  const g={CL:{n:0,t:0},CO:{n:0,t:0},PY:{n:0,t:0}};
  if(fCanal!=='web') ordenes.filter(o=>enRango(o.orden)).forEach(o=>{g[o.loc].n++;g[o.loc].t+=o.precioNum;});
  if(fCanal!=='wa') pedidosWeb.filter(o=>enRango(o.orden)).forEach(o=>{g.CL.n++;g.CL.t+=o.totalNum;});
  const tot=g.CL.n+g.CO.n+g.PY.n||1;
  const fila=(loc,nom,color,fmt)=>{const p=Math.round(g[loc].n/tot*100);
    return `<div class="pais"><span class="flag ${FLAG[loc]}"></span>${nom}<div class="track"><i style="width:${p}%;background:${color}"></i></div><b>${g[loc].n} · ${fmt(g[loc].t)}</b><span class="pct">${p}%</span></div>`;};
  cont.innerHTML=fila('CL','Chile','#0e8074',fmtCLP)+fila('CO','Colombia','var(--blue)',fmtCOP)+fila('PY','Paraguay','var(--violet)',fmtGS);
  const ps=document.getElementById('paisesSub'); if(ps) ps.textContent=rangoTxt()+' · '+(fCanal==='todos'?'todos los canales':fCanal==='wa'?'WhatsApp':'páginas');
}

/* ---------- PEDIDOS WEB ---------- */
function renderPedidosWeb(){
  const tb=document.getElementById('tbodyPedidos'); if(!tb) return;
  if(!PAGINAS.some(p=>p.url)){tb.innerHTML='<tr><td colspan="9" class="vacio">Esperando conexión de las planillas…</td></tr>';return;}
  const q=(document.getElementById('pbuscar')?.value||'').toLowerCase();
  let arr=pedidosWeb;
  if(fProdP!=='todos') arr=arr.filter(o=>o.pagina===fProdP);
  if(q) arr=arr.filter(o=>(o.cli+' '+o.tel+' '+o.comuna).toLowerCase().includes(q));
  if(!arr.length){tb.innerHTML='<tr><td colspan="9" class="vacio">Sin pedidos aquí.</td></tr>';return;}
  tb.innerHTML=arr.slice(0,100).map((o,i)=>`
    <tr onclick="verPedido(${i})">
      <td class="cli">${esc(o.cli)}${huellaBadge(o.tel)}<small>${esc(o.fecha)} · +${o.tel}</small></td>
      <td><span class="pchip"><i style="background:${o.color}"></i>${esc(o.prod)}</span></td>
      <td>${esc(o.comuna)}</td>
      <td>${o.cant}</td>
      <td class="money">${o.total}</td>
      <td>${o.abono?'<span class="st st-rec"><i></i>Abono pendiente</span>':(o.conf?'<span class="st st-ok"><i></i>Confirmado</span>':'<span class="st st-rec"><i></i>Pendiente</span>')}</td>
      <td class="cell-aprob" onclick="event.stopPropagation()">${celdaAprob(keyPag(o), o.dropi?'<span class="st st-ok"><i></i>Montado</span>':'')}</td>
      <td><svg class="ico-sm chev" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></td>
    </tr>`).join('');
  window._pedidosF=arr;
}
function verPedido(i){
  const o=(window._pedidosF||pedidosWeb)[i]; if(!o) return;
  const fila=(k,v)=>`<div class="dl"><span class="k">${k}</span><span class="v">${esc(v)}</span></div>`;
  document.getElementById('mTitulo').textContent=o.cli;
  document.getElementById('mBody').innerHTML=
    fila('Canal','Página · '+o.prod)+fila('Producto',o.prod)+fila('Cantidad',o.cant+' unidades')+
    fila('Teléfono','+'+o.tel)+(o.correo?fila('Correo',o.correo):'')+fila('Dirección',o.dir)+
    (o.ref?fila('Referencia',o.ref):'')+fila('Comuna',o.comuna)+fila('Región',o.region)+
    fila('Confirmación del cliente',o.abono?'ABONO PENDIENTE (esperando comprobante)':(o.conf?'CONFIRMADO':'Pendiente'))+fila('Dropi',o.dropi?'ENVIADO':'Pendiente')+fila('Fecha',o.fecha);
  document.getElementById('mTotal').textContent=o.total+' CLP';
  window._ventaAbierta={cli:o.cli,dir:o.dir+(o.ref?' - '+o.ref:''),region:o.region,tel:o.tel,prod:o.prod,cant:o.cant,precio:o.total};
  document.getElementById('ov').classList.add('open');
}
async function toggleDropi(i){
  const o=(window._pedidosF||pedidosWeb)[i]; if(!o) return;
  const p=PAGINAS.find(x=>x.id===o.pagina); if(!p||!p.url) return;
  o.dropi=!o.dropi; renderPedidosWeb();
  try{
    await fetch(p.url,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({tipo:'estado_dropi',fila:o.fila,estado:o.dropi?'ENVIADO':'PENDIENTE'})});
    toast(o.dropi?'Marcado como ENVIADO a Dropi':'Marcado como PENDIENTE');
  }catch(e){}
}

/* ---------- ABANDONADOS ---------- */
function fechaCorta(v){ if(!v) return ''; try{ var d=new Date(v); if(isNaN(d)) return ''; return d.toLocaleString('es-CL',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}); }catch(e){ return ''; } }
function renderAbandonadosWeb(){
  const tb=document.getElementById('tbodyAband'); if(!tb) return;
  if(!PAGINAS.some(p=>p.url)){tb.innerHTML='<tr><td colspan="7" class="vacio">Esperando conexión de las planillas…</td></tr>';return;}
  if(!abandonadosWeb.length){tb.innerHTML='<tr><td colspan="7" class="vacio">Sin abandonados pendientes. 🎉</td></tr>';return;}
  tb.innerHTML=abandonadosWeb.slice(0,100).map((o,i)=>`
    <tr onclick="verAbandonado(${i})" style="cursor:pointer">
      <td class="cli">${esc(o.cli)}<small>${esc(o.fecha)} · +${o.tel}</small></td>
      <td><span class="pchip"><i style="background:${o.color}"></i>${esc(o.prod)}</span></td>
      <td>${esc(o.comuna)}</td>
      <td>${o.cant}</td>
      <td class="money">${o.total}</td>
      <td>${o.contactado?'<span class="st st-ok"><i></i>✓ Mensaje enviado</span>'+(o.contactadoFecha?'<small style="display:block;color:var(--ink-3)">'+esc(o.contactadoFecha)+'</small>':''):'<span class="st st-ab"><i></i>Sin contactar</span>'}</td>
      <td onclick="event.stopPropagation()"><a class="qr" style="text-decoration:none" href="https://wa.me/${o.tel}" target="_blank">WhatsApp</a></td>
    </tr>`).join('');
  window._abandF=abandonadosWeb.slice(0,100);
}
function verAbandonado(i){
  const o=(window._abandF||abandonadosWeb)[i]; if(!o) return;
  const fila=(k,v)=>`<div class="dl"><span class="k">${k}</span><span class="v">${esc(v)}</span></div>`;
  document.getElementById('mTitulo').textContent=o.cli;
  document.getElementById('mBody').innerHTML=
    fila('Canal','Página · pedido abandonado')+fila('Producto',o.prod)+fila('Cantidad',o.cant+' unidades')+
    fila('Teléfono','+'+o.tel)+(o.correo?fila('Correo',o.correo):'')+
    fila('Dirección',o.dir||'— (no la alcanzó a completar)')+
    (o.ref?fila('Referencia',o.ref):'')+fila('Comuna',o.comuna)+
    (o.region?fila('Región',o.region):'')+
    fila('Estado',o.contactado?('Mensaje de recuperación enviado'+(o.contactadoFecha?' · '+o.contactadoFecha:'')):'Sin contactar')+
    fila('Fecha',o.fecha);
  document.getElementById('mTotal').textContent=o.total+' CLP';
  window._ventaAbierta={cli:o.cli,dir:(o.dir||'')+(o.ref?' - '+o.ref:''),region:o.region,tel:o.tel,prod:o.prod,cant:o.cant,precio:o.total};
  document.getElementById('ov').classList.add('open');
}

/* ---------- VISITAS ---------- */
let fPagV='todas';
window.setPagV=function(id){ fPagV=id; renderVisitas(); };
function pagesVis(){ var m={}; (visitasWeb||[]).forEach(function(v){ if(v&&v.pagina&&!m[v.pagina]) m[v.pagina]={id:v.pagina,nombre:v.producto||v.pagina,color:v.color||'#6cc24a'}; }); var a=Object.keys(m).map(function(k){return m[k];}); return a.length?a:PAGINAS.filter(p=>p.url); }
function renderVisitas(){
  const box=document.getElementById('visitasBox'); if(!box) return;
  const lbl=TXT_RANGO[Rvis.tipo]||'';
  const conectadas=pagesVis();
  var _sp=document.getElementById('segPagV'); if(_sp){ _sp.innerHTML='<button class="'+(fPagV==='todas'?'act':'')+'" onclick="setPagV(\'todas\')">Todas</button>'+conectadas.map(function(p){return '<button class="'+(fPagV===p.id?'act':'')+'" onclick="setPagV(\''+p.id+'\')"><span style="width:8px;height:8px;border-radius:50%;background:'+p.color+';display:inline-block"></span>'+esc2(p.nombre)+'</button>';}).join(''); }
  const pgs=conectadas.filter(p=>fPagV==='todas'||p.id===fPagV);
  // agregados por página, en el rango
  const data=pgs.map(p=>{
    let vis=0,form=0;
    visitasWeb.filter(v=>v.pagina===p.id&&enRangoDe(fechaOrden(v.fecha,''),Rvis)).forEach(v=>{vis+=numero(v.visitas);form+=numero(v.formulario);});
    const peds=pedidosWeb.filter(o=>o.pagina===p.id&&enRangoDe(o.orden,Rvis)).length;
    return {id:p.id,nombre:p.nombre,color:p.color,vis,form,peds};
  });
  const tVis=data.reduce((a,b)=>a+b.vis,0), tForm=data.reduce((a,b)=>a+b.form,0), tPed=data.reduce((a,b)=>a+b.peds,0);
  const convT=tVis?(tPed/tVis*100):0, convF=tForm?(tPed/tForm*100):0;

  // KPIs totales
  const kp=document.getElementById('visitasKpis');
  if(kp) kp.innerHTML=
    kpiV('Visitas',tVis.toLocaleString('es-CL'),lbl,'var(--border-2)','var(--ink)','M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z','circle')+
    kpiV('Al formulario',tForm.toLocaleString('es-CL'),(tVis?Math.round(tForm/tVis*100):0)+'% de las visitas','var(--amber-tint)','var(--amber)','M9 11l3 3L22 4','doc')+
    kpiV('Pedidos',tPed.toLocaleString('es-CL'),'cerrados en el periodo','var(--blue-tint)','var(--blue)','','bag')+
    kpiV('Conversión',convT.toFixed(1)+'%',(convF?convF.toFixed(1)+'% desde el formulario':'visita → pedido'),'var(--green-tint)','var(--green)','','up');

  // gráfico por día (visitas/formulario/pedidos)
  const nD = Rvis.tipo==='30d'?30:(Rvis.tipo==='hoy'||Rvis.tipo==='ayer'?7:7);
  const dias=[];
  for(let i=nD-1;i>=0;i--){const d=new Date(inicioDia(i));dias.push({key:d.toDateString(),lbl:i===0?'Hoy':d.toLocaleDateString('es-CL',{weekday:'short'}),v:0,f:0,p:0});}
  visitasWeb.filter(v=>fPagV==='todas'||v.pagina===fPagV).forEach(v=>{const t=fechaOrden(v.fecha,'');if(!t)return;const d=dias.find(x=>x.key===new Date(t).toDateString());if(d){d.v+=numero(v.visitas);d.f+=numero(v.formulario);}});
  pedidosWeb.filter(o=>fPagV==='todas'||o.pagina===fPagV).forEach(o=>{const d=dias.find(x=>x.key===new Date(o.orden).toDateString());if(d)d.p++;});
  const max=Math.max(4,...dias.map(d=>d.v));
  const W=620,m=40,slot=(W-m-10)/nD,bw=Math.min(11,slot*0.24);
  let bars='',labels='';
  dias.forEach((d,i)=>{const x=m+10+i*slot;
    const hv=Math.round(d.v/max*150),hf=Math.round(d.f/max*150),hp=Math.round(d.p/max*150);
    bars+=`<rect x="${x}" y="${186-hv}" width="${bw}" height="${hv||1}" rx="2.5" fill="var(--ink-3)"/>`;
    bars+=`<rect x="${x+bw+2}" y="${186-hf}" width="${bw}" height="${hf||1}" rx="2.5" fill="#c98a16"/>`;
    bars+=`<rect x="${x+2*bw+4}" y="${186-hp}" width="${bw}" height="${hp||1}" rx="2.5" fill="#179f6b"/>`;
    labels+=`<text x="${x+bw*1.5}" y="205" text-anchor="middle" font-size="11" fill="${i===nD-1?'var(--ink)':'var(--ink-3)'}">${d.lbl}</text>`;
  });
  const vc=document.getElementById('visChart');
  if(vc) vc.innerHTML=`<svg viewBox="0 0 620 220" width="100%" height="210" preserveAspectRatio="none" font-family="Inter"><g stroke="var(--grid)" stroke-width="1"><line x1="40" y1="20" x2="610" y2="20"/><line x1="40" y1="65" x2="610" y2="65"/><line x1="40" y1="110" x2="610" y2="110"/><line x1="40" y1="155" x2="610" y2="155"/><line x1="40" y1="186" x2="610" y2="186"/></g>${bars}${labels}</svg>`;
  const vcs=document.getElementById('visChartSub'); if(vcs) vcs.textContent=(fPagV==='todas'?'Todas las páginas':data[0]?data[0].nombre:'')+' · '+lbl;

  // embudo
  const fun=document.getElementById('visFunnel');
  if(fun){
    const paso=(nm,val,base,color)=>{const p=base?Math.round(val/base*100):0;
      return `<div class="cstep"><span class="nm">${nm}</span><div class="track"><i style="width:${Math.max(2,p)}%;background:${color}"></i></div><b>${val.toLocaleString('es-CL')}</b></div>`;};
    fun.innerHTML=paso('Visitas',tVis,tVis,'var(--ink-3)')+paso('Al formulario',tForm,tVis,'var(--amber)')+paso('Pedidos',tPed,tVis,'var(--green)');
  }
  const vfs=document.getElementById('visFunSub'); if(vfs) vfs.textContent=lbl;

  // tarjetas por página
  if(!conectadas.length){ box.innerHTML='<div class="vacio">Conecta las planillas para ver visitas.</div>'; return; }
  box.innerHTML=data.map(p=>{
    const conv=p.vis?(p.peds/p.vis*100):0;
    return `<div class="kpi" style="margin-bottom:14px">
      <div class="top-r"><span class="lbl"><span class="pchip"><i style="background:${p.color}"></i>${p.nombre}</span> · ${lbl}</span></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:6px">
        <div><div class="val" style="font-size:24px">${p.vis.toLocaleString('es-CL')}</div><div class="meta">visitas</div></div>
        <div><div class="val" style="font-size:24px">${p.form.toLocaleString('es-CL')}</div><div class="meta">al formulario</div></div>
        <div><div class="val" style="font-size:24px">${p.peds}</div><div class="meta">pedidos</div></div>
        <div><div class="val" style="font-size:24px;color:var(--green)">${conv.toFixed(1)}%</div><div class="meta">conversión</div></div>
      </div></div>`;
  }).join('') || '<div class="vacio">Sin datos en este periodo.</div>';
}
function kpiV(lbl,val,meta,bg,col){
  return '<div class="kpi"><div class="top-r"><span class="lbl">'+lbl+'</span><span class="icn" style="background:'+bg+';color:'+col+'"><svg class="ico-sm" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg></span></div><div class="val">'+val+'</div><div class="meta">'+meta+'</div></div>';
}

/* ---------- CONVERSACIONES (por bot, con pestañas Conv/Ventas) ---------- */
const inicialesDe=n=>String(n||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase()||'?';
// (3) indicadores de conversión del bot seleccionado, en el rango elegido
function renderConvStats(){
  const cont=document.getElementById('convStats'); if(!cont) return;
  const lbl=TXT_RANGO[Rconv.tipo]||'';
  const cs=convos.filter(c=>c.bot===fBot && enRangoDe(c.orden,Rconv));
  const total=convos.filter(c=>c.bot===fBot).length;
  const ventas=ordenes.filter(o=>o.bot===fBot && enRangoDe(o.orden,Rconv)).length;
  const conAgente=cs.filter(c=>c.estado==='pausada').length;
  const conv=cs.length?(ventas/cs.length*100):0;
  cont.innerHTML=
    '<div class="cs"><div class="lbl">Conversaciones · '+lbl+'</div><div class="val">'+cs.length+'<small>de '+total+' totales</small></div></div>'+
    '<div class="cs"><div class="lbl">Ventas cerradas · '+lbl+'</div><div class="val">'+ventas+'</div></div>'+
    '<div class="cs acc"><div class="lbl">Conversión</div><div class="val">'+conv.toFixed(1)+'%</div></div>'+
    '<div class="cs"><div class="lbl">Atendidas por agente</div><div class="val">'+conAgente+'</div></div>';
}
function renderConvList(){
  renderConvStats();
  const cont=document.getElementById('clist'); if(!cont) return;
  const q=(document.getElementById('cbuscar')?.value||'').toLowerCase();
  let arr=convos.filter(c=>c.bot===fBot && enRangoDe(c.orden,Rconv));
  if(fEst!=='todas') arr=arr.filter(c=>c.estado===fEst);
  if(q) arr=arr.filter(c=>(c.n+' '+c.tel).toLowerCase().includes(q));
  if(!arr.length){cont.innerHTML='<div class="vacio">Sin conversaciones aquí.</div>';return;}
  cont.innerHTML=arr.slice(0,150).map(c=>`
    <div class="citem ${c.tel===selTel?'sel':''}" onclick="abrirChat('${c.tel}')">
      <div class="cav" style="background:${BOTCOLOR[c.bot]}">${inicialesDe(c.n)}<span class="bdot ${c.estado==='activa'?'bdot-on':'bdot-paused'}"></span></div>
      <div class="cinfo">
        <div class="l1"><span class="nm">${esc(c.n)}</span><span class="tm">${esc(c.hora||c.fecha)}</span></div>
        <div class="l2">${esc(c.ultimo)||'—'}</div>
      </div>
      <span class="ctag ${c.estado==='activa'?'ctag-bot':'ctag-ag'}">${c.estado==='activa'?'Bot':'Agente'}</span>
    </div>`).join('');
}
function renderVentasBot(){
  const tb=document.getElementById('tbodyVentasBot'); if(!tb) return;
  const arr=ordenes.filter(o=>o.bot===fBot);
  if(!arr.length){tb.innerHTML='<tr><td colspan="8" class="vacio">Este bot aún no registra ventas.</td></tr>';return;}
  tb.innerHTML=arr.slice(0,80).map((o,i)=>`
    <tr onclick="verVentaBot(${i})">
      <td class="cli">${esc(o.cli)}${huellaBadge(o.tel)}<small>${esc(o.fecha)} ${esc(o.hora)} · +${o.tel}</small></td>
      <td><span class="pchip"><i style="background:#0e8074"></i>${esc(o.prod)}</span></td>
      <td>${esc(o.zona)}</td>
      <td>${o.cant}</td>
      <td class="money">${o.precio}</td>
      <td>${o.abono?'<span class="st st-rec"><i></i>Abono pendiente</span>':(o.conf?'<span class="st st-ok"><i></i>Confirmado</span>':'<span class="st st-rec"><i></i>Pendiente</span>')}</td>
      <td class="cell-aprob" onclick="event.stopPropagation()">${celdaAprob(keyWa(o), o.montado?'<span class="st st-ok"><i></i>Montado'+(o.ordenDropi?' #'+o.ordenDropi:'')+'</span>':'')}</td>
      <td><svg class="ico-sm chev" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></td>
    </tr>`).join('');
  window._ventasBotF=arr;
}
function verVentaBot(i){window._ventasF=window._ventasBotF;verVenta(i);}
function setTabConv(t){
  tabConv=t;
  document.querySelectorAll('#tabsConv .minitab').forEach(x=>x.classList.toggle('act',x.dataset.t===t));
  document.getElementById('convPanel').style.display = t==='conv'?'':'none';
  document.getElementById('ventasBotPanel').style.display = t==='ventas'?'':'none';
  document.getElementById('segEst').style.display = t==='conv'?'':'none';
  if(t==='ventas') renderVentasBot();
  ajustarStickyTop();
}
function pintarChatHead(c){
  document.getElementById('chNom').textContent=c.n;
  document.getElementById('chTel').innerHTML='+'+c.tel+' · atendida por <b>'+BOTNOM[c.bot]+'</b>';
  const av=document.getElementById('chAv'); av.style.background=BOTCOLOR[c.bot]; av.textContent=inicialesDe(c.n);
  const b=document.getElementById('btnPausa'), t=document.getElementById('pauseTxt');
  if(c.estado==='pausada'){b.classList.add('btn-resume');t.textContent='Activar bot';}
  else{b.classList.remove('btn-resume');t.textContent='Pausar bot';}
}
async function abrirChat(tel){
  selTel=tel; renderConvList();
  const c=convos.find(x=>x.tel===tel); if(!c) return;
  document.getElementById('chatwin').style.display='flex';
  document.getElementById('chatEmpty').style.display='none';
  const g=document.querySelector('#view-conv .convgrid'); if(g) g.classList.add('ver-chat');  // móvil: muestra el chat
  document.body.classList.add('chat-abierto');
  pintarChatHead(c);
  const box=document.getElementById('chmsgs');
  if(!c.loaded){ box.innerHTML='<div class="vacio">Cargando historial…</div>';
    try{
      const res=await fetch(URL_HIST+'?telefono='+soloNum(c.tel)+'&pais='+c.loc);
      const data=await res.json();
      const arr=Array.isArray(data)?data:(data?[data]:[]);
      const row=arr.find(r=>r&&soloNum(r.telefono)===soloNum(c.tel))||arr[0];
      c.msgs=parseHist(row&&row.historial); c.loaded=true;
    }catch(e){ box.innerHTML='<div class="vacio">No pude cargar el historial.</div>'; return; }
  }
  renderBubbles(c);
}
const RE_IMG=/(data:image\/[^\s)]+|https?:\/\/[^\s)]+\.(?:png|jpe?g|webp|gif)(?:\?[^\s)]*)?|https?:\/\/[^\s)]*(?:lookaside|fbcdn|googleusercontent|cloudfront|githubusercontent|jaye-bots\/fotos)[^\s)]*)/ig;
function cuerpoMensaje(m){
  if(m.img) return '<img class="msgimg" src="'+m.img+'" onclick="ampliarImg(this)" alt="imagen">';
  let t=String(m.text||''); const imgs=t.match(RE_IMG)||[];
  let texto=esc(t.replace(RE_IMG,'').replace(/📷\s*\[imagen[^\]]*\]/gi,'').trim());
  const fotos=imgs.map(u=>'<img class="msgimg" src="'+u+'" onclick="ampliarImg(this)" alt="imagen">').join('');
  return (texto?texto:'')+(fotos?(texto?'<br>':'')+fotos:'')||'—';
}
function renderBubbles(c){
  const box=document.getElementById('chmsgs');
  if(!c.msgs.length){box.innerHTML='<div class="vacio">Sin mensajes todavía.</div>';return;}
  box.innerHTML=c.msgs.map(m=>{
    const cls=m.from==='cliente'?'m-cli':(m.from==='agente'?'m-ag':'m-bot');
    const who=m.from==='cliente'?'Cliente':(m.from==='agente'?'Tú · Agente':BOTNOM[c.bot].split(' ·')[0]+' · Bot');
    return `<div class="msg ${cls}"><div class="who">${who}</div>${cuerpoMensaje(m)}</div>`;
  }).join('');
  box.scrollTop=box.scrollHeight;
}
function ampliarImg(el){
  const ov=document.getElementById('imgov');
  document.getElementById('imgovImg').src=el.src;
  ov.classList.add('open');
}
async function togglePausa(){
  const c=convos.find(x=>x.tel===selTel); if(!c) return;
  const nuevo=c.estado==='pausada'?'bot':'agente';
  try{
    await fetch(URL_PAUSA,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telefono:soloNum(c.tel),modo:nuevo})});
    c.estado=nuevo==='agente'?'pausada':'activa';
    pintarChatHead(c); renderConvList(); toast(nuevo==='agente'?'Bot pausado: tú atiendes esta conversación':'Bot reactivado');
  }catch(e){ toast('No se pudo cambiar el modo','err'); }
}
async function enviarRespuesta(){
  const inp=document.getElementById('chInput'); const t=inp.value.trim(); if(!t||!selTel) return;
  const c=convos.find(x=>x.tel===selTel); if(!c) return;
  inp.value=''; c.msgs.push({from:'agente',text:t}); renderBubbles(c);
  try{
    const r=await fetch(URL_RESP,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telefono:soloNum(c.tel),mensaje:t,pais:c.loc})});
    if(!r.ok) throw 0;
    await fetch(URL_PAUSA,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telefono:soloNum(c.tel),modo:'agente'})});
    c.estado='pausada'; pintarChatHead(c); renderConvList();
  }catch(e){ toast('No se pudo enviar','err'); }
}
const quickReply=txt=>{const i=document.getElementById('chInput');i.value=txt;i.focus();};

/* (1) enviar imagen como agente */
function sendImg(input){
  const f=input.files&&input.files[0]; input.value=''; if(!f||!selTel) return;
  const c=convos.find(x=>x.tel===selTel); if(!c) return;
  const rd=new FileReader();
  rd.onload=()=>{
    const img=new Image();
    img.onload=async()=>{
      const MAX=1000; let w=img.width,h=img.height;
      if(w>MAX||h>MAX){const k=MAX/Math.max(w,h);w=Math.round(w*k);h=Math.round(h*k);}
      const cv=document.createElement('canvas');cv.width=w;cv.height=h;
      cv.getContext('2d').drawImage(img,0,0,w,h);
      const dataUrl=cv.toDataURL('image/jpeg',0.85);
      const msgImg={from:'agente',img:dataUrl}; c.msgs.push(msgImg); renderBubbles(c); toast('Enviando imagen…');
      try{
        const r=await fetch(URL_IMG,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pais:c.loc,telefono:soloNum(c.tel),imagen:dataUrl,caption:''})});
        if(!r.ok) throw 0;
        await fetch(URL_PAUSA,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telefono:soloNum(c.tel),modo:'agente'})});
        c.estado='pausada'; pintarChatHead(c); renderConvList(); toast('Imagen enviada ✓');
      }catch(e){ toast('No se pudo enviar la imagen','err'); }
    };
    img.src=rd.result;
  };
  rd.readAsDataURL(f);
}

/* ---------- VENTAS WA (vista global) ---------- */
function renderVentasWA(){
  const tb=document.getElementById('tbodyVentasWA'); if(!tb) return;
  const q=(document.getElementById('vbuscar')?.value||'').toLowerCase();
  let arr=ordenes;
  if(fPaisV!=='todas') arr=arr.filter(o=>o.loc===fPaisV);
  if(q) arr=arr.filter(o=>(o.cli+' '+o.prod+' '+o.tel+' '+o.zona).toLowerCase().includes(q));
  if(!arr.length){tb.innerHTML='<tr><td colspan="9" class="vacio">Sin ventas registradas aún.</td></tr>';return;}
  tb.innerHTML=arr.slice(0,100).map((o,i)=>`
    <tr onclick="verVenta(${i})">
      <td class="cli">${esc(o.cli)}${huellaBadge(o.tel)}<small>${esc(o.fecha)} ${esc(o.hora)} · +${o.tel}</small></td>
      <td>${BOTNOM[o.bot].split(' ·')[0]}</td>
      <td><span class="pchip"><i style="background:#0e8074"></i>${esc(o.prod)}</span></td>
      <td><span class="flag ${FLAG[o.loc]}"></span></td>
      <td>${o.cant}</td>
      <td class="money">${o.precio}</td>
      <td>${o.abono?'<span class="st st-rec"><i></i>Abono pendiente</span>':(o.conf?'<span class="st st-ok"><i></i>Confirmado</span>':'<span class="st st-rec"><i></i>Pendiente</span>')}</td>
      <td class="cell-aprob" onclick="event.stopPropagation()">${celdaAprob(keyWa(o), o.montado?'<span class="st st-ok"><i></i>Montado'+(o.ordenDropi?' #'+o.ordenDropi:'')+'</span>':'')}</td>
      <td><svg class="ico-sm chev" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></td>
    </tr>`).join('');
  window._ventasF=arr;
}
function verVenta(i){
  const o=(window._ventasF||ordenes)[i]; if(!o) return;
  const fila=(k,v)=>`<div class="dl"><span class="k">${k}</span><span class="v">${esc(v)}</span></div>`;
  document.getElementById('mTitulo').textContent=o.cli;
  document.getElementById('mBody').innerHTML=
    fila('Canal','WhatsApp · '+BOTNOM[o.bot])+fila('País',{CL:'Chile',CO:'Colombia',PY:'Paraguay'}[o.loc])+
    fila('Producto',o.prod)+fila('Cantidad',o.cant+' unidades')+fila('Teléfono','+'+o.tel)+
    fila('Dirección',o.dir)+fila('Comuna / Ciudad',o.zona)+fila('Región / Depto.',o.region)+
    fila('Confirmación del cliente',o.abono?'ABONO PENDIENTE (esperando comprobante)':(o.conf?'CONFIRMADO':'Pendiente'))+fila('Montado en Dropi',o.montado?('SÍ'+(o.ordenDropi?' · orden #'+o.ordenDropi:'')):'Pendiente')+
    fila('Fecha',o.fecha+' '+(o.hora||''));
  document.getElementById('mTotal').textContent=o.precio;
  window._ventaAbierta=o;
  document.getElementById('ov').classList.add('open');
}
function copiarVenta(){
  const o=window._ventaAbierta; if(!o) return;
  const txt=[o.cli,o.dir+(o.zona&&o.zona!=='—'?' - '+o.zona:''),o.region,'+'+o.tel,o.prod+' x'+o.cant,o.precio].join('\n');
  navigator.clipboard.writeText(txt).then(()=>toast('Datos copiados'));
}
const waVenta=()=>{const o=window._ventaAbierta;if(o)window.open('https://wa.me/'+o.tel,'_blank');};

/* ---------- BOTS ---------- */
function renderBots(){
  const cont=document.getElementById('botcards'); if(!cont) return;
  const hoyV=ordenes.filter(o=>o.orden>=inicioDia(0));
  cont.innerHTML=['Carlos','James','Ramon'].map(b=>{
    const cs=convos.filter(c=>c.bot===b);
    const pausadas=cs.filter(c=>c.estado==='pausada').length;
    const ventasHoy=hoyV.filter(o=>o.bot===b).length;
    const loc=BOTLOC[b];
    return `<div class="bot">
      <div class="bh">
        <div class="bav" style="background:${BOTCOLOR[b]}">${b[0]}</div>
        <div><div class="bnm">${BOTNOM[b]}</div><div class="bsub"><span class="flag ${FLAG[loc]}"></span><span class="stlive"><i></i>Activo</span></div></div>
      </div>
      <div class="bstats">
        <div class="bstat"><b>${cs.length}</b><span>conversaciones</span></div>
        <div class="bstat"><b>${ventasHoy}</b><span>ventas hoy</span></div>
        <div class="bstat"><b>${pausadas}</b><span>con agente</span></div>
      </div>
      <div class="bfoot">
        <button class="bbtn" onclick="irConvBot('${b}')"><svg class="ico-sm" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Conversaciones</button>
        <button class="bbtn" onclick="irVentasDeBot('${b}')"><svg class="ico-sm" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-6 0v4M5 9h14l-1 11H6L5 9z"/></svg>Ver ventas</button>
      </div>
    </div>`;
  }).join('');
}
function irConvBot(b){
  fBot=b; selTel=null;
  document.querySelectorAll('.nav-i[data-bot]').forEach(x=>x.classList.toggle('subact',x.dataset.bot===b));
  document.getElementById('tabVentasLbl').textContent='Ventas de '+BOTNOM[b].split(' ·')[0];
  mostrarVista('conv'); setTabConv('conv'); renderConvList();
  document.getElementById('vtitle').textContent=BOTNOM[b];
  document.getElementById('vsub').textContent='Conversaciones y ventas de este bot';
}
function irVentasDeBot(b){ irConvBot(b); setTabConv('ventas'); }

/* ---------- HISTÓRICO (filtra datos por mes) ---------- */
let mesSel=null;  // 'YYYY-MM'
const MESNOM=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
function mesDe(ts){ if(!ts) return null; const d=new Date(ts); return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2); }
function nombreMes(k){ const p=k.split('-'); return MESNOM[(+p[1])-1]+' '+p[0]; }
const pedidosHist=()=>pedidosWeb.concat(pedidosArchivo);   // vivos + archivados
const visitasHist=()=>visitasWeb.concat(visitasArchivo);
function construirSelectorMeses(){
  const sel=document.getElementById('selMes'); if(!sel) return;
  const set=new Set();
  ordenes.forEach(o=>{const m=mesDe(o.orden); if(m) set.add(m);});
  pedidosHist().forEach(o=>{const m=mesDe(o.orden); if(m) set.add(m);});
  const hoy=new Date(); set.add(hoy.getFullYear()+'-'+('0'+(hoy.getMonth()+1)).slice(-2));
  const meses=[...set].sort().reverse();
  if(!mesSel||!set.has(mesSel)) mesSel=meses[0];
  sel.innerHTML=meses.map(m=>'<option value="'+m+'"'+(m===mesSel?' selected':'')+'>'+nombreMes(m)+'</option>').join('');
  if(!sel._wired){ sel._wired=true; sel.addEventListener('change',()=>{ mesSel=sel.value; renderHistorico(); }); }
}
function renderHistorico(){
  construirSelectorMeses();
  const kp=document.getElementById('histKpis'); if(!kp) return;
  const vWA=ordenes.filter(o=>mesDe(o.orden)===mesSel);
  const vWeb=pedidosHist().filter(o=>mesDe(o.orden)===mesSel);
  const vis=visitasHist().filter(v=>String(v.fecha).match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/)&&mesDe(fechaOrden(v.fecha,''))===mesSel);
  const totVis=vis.reduce((a,b)=>a+numero(b.visitas),0);
  const conv=totVis?((vWeb.length/totVis*100).toFixed(1)+'%'):'—';
  kp.innerHTML=
    kpi('Ventas totales',vWA.length+vWeb.length,'páginas + WhatsApp','var(--border-2)','var(--ink)')+
    kpi('Por WhatsApp',vWA.length,'Carlos, James y Ramón','var(--green-tint)','var(--green)')+
    kpi('Por página',vWeb.length,fmtCLP(vWeb.reduce((a,b)=>a+b.totalNum,0))+' CLP','var(--blue-tint)','var(--blue)')+
    kpi('Conversión páginas',conv,totVis+' visitas','var(--violet-tint)','var(--violet)');
  // ventas por país (monedas separadas)
  const g={CL:{n:0,t:0},CO:{n:0,t:0},PY:{n:0,t:0}};
  vWA.forEach(o=>{g[o.loc].n++;g[o.loc].t+=o.precioNum;});
  vWeb.forEach(o=>{g.CL.n++;g.CL.t+=o.totalNum;});
  const tot=g.CL.n+g.CO.n+g.PY.n||1;
  const fila=(loc,nom,color,fmt)=>{const p=Math.round(g[loc].n/tot*100);
    return '<div class="pais"><span class="flag '+FLAG[loc]+'"></span>'+nom+'<div class="track"><i style="width:'+p+'%;background:'+color+'"></i></div><b>'+g[loc].n+' · '+fmt(g[loc].t)+'</b><span class="pct">'+p+'%</span></div>';};
  document.getElementById('histPaises').innerHTML=fila('CL','Chile','#0e8074',fmtCLP)+fila('CO','Colombia','var(--blue)',fmtCOP)+fila('PY','Paraguay','var(--violet)',fmtGS);
  document.getElementById('histPaisSub').textContent=nombreMes(mesSel);
  // ventas por canal (WhatsApp vs Página)
  const totC=(vWA.length+vWeb.length)||1;
  const filaC=(nom,n,color)=>{const p=Math.round(n/totC*100);
    return '<div class="pais">'+nom+'<div class="track"><i style="width:'+p+'%;background:'+color+'"></i></div><b>'+n+' ventas</b><span class="pct">'+p+'%</span></div>';};
  document.getElementById('histCanal').innerHTML=filaC('WhatsApp',vWA.length,'var(--green)')+filaC('Página',vWeb.length,'var(--blue)');
  document.getElementById('histCanalSub').textContent=nombreMes(mesSel)+' · '+(vWA.length+vWeb.length)+' ventas en total';
  // top productos (por cantidad de pedidos)
  const prod={}; [...vWA.map(o=>o.prod),...vWeb.map(o=>o.prod)].forEach(p=>{const k=p||'—';prod[k]=(prod[k]||0)+1;});
  const top=Object.entries(prod).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxp=top.length?top[0][1]:1;
  document.getElementById('histProd').innerHTML = top.length? top.map(([n,c])=>
    '<div class="pais">'+esc(n)+'<div class="track"><i style="width:'+Math.round(c/maxp*100)+'%;background:#0e8074"></i></div><b>'+c+'</b></div>').join('')
    : '<div class="vacio">Sin ventas este mes.</div>';
  document.getElementById('histNota').innerHTML='💾 <b>Guardado automático:</b> cada día 1, el mes que termina se archiva en tus planillas (pestañas "Archivo '+mesSel+' …") y el panel arranca el mes nuevo en cero. Aquí puedes consultar cualquier mes. Las ventas de WhatsApp y de páginas, las visitas y la conversión quedan registradas mes a mes.';
}
function kpi(lbl,val,meta,bg,col){
  return '<div class="kpi"><div class="top-r"><span class="lbl">'+lbl+'</span><span class="icn" style="background:'+bg+';color:'+col+'"><svg class="ico-sm" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg></span></div><div class="val">'+val+'</div><div class="meta">'+meta+'</div></div>';
}

/* ---------- APROBACIÓN UNIFICADA (página + WhatsApp en una sola lista) ---------- */
let fAprob='pend';
document.querySelectorAll('#segAprob .minitab').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#segAprob .minitab').forEach(x=>x.classList.remove('act'));
  b.classList.add('act'); fAprob=b.dataset.a; renderAprobar();
}));
function renderAprobar(){
  const tb=document.getElementById('tbodyAprobar'); if(!tb) return;
  const dosDias=Date.now()-2*864e5;
  const items=[];
  (pedidosWeb||[]).forEach(o=>{ if(!o.conf) return; const k=keyPag(o);
    items.push({k,raw:o,canal:'Página',cli:o.cli,tel:o.tel,fecha:o.fecha,prod:o.prod,color:o.color,comuna:o.comuna,cant:o.cant,total:o.total,orden:o.orden,
      st:o.dropi?'montado':(esAprobado(k)?'aprobado':(esRechazado(k)?'rechazado':'pendiente'))});
  });
  (ordenes||[]).forEach(o=>{ if(o.loc!=='CL') return; if(o.orden<dosDias && !o.montado) return; const k=keyWa(o);
    items.push({k,raw:o,canal:'WhatsApp',cli:o.cli,tel:o.tel,fecha:o.fecha,prod:o.prod,color:'#0e8074',comuna:o.zona,cant:o.cant,total:o.precio,orden:o.orden,
      st:o.montado?'montado':(esAprobado(k)?'aprobado':(esRechazado(k)?'rechazado':'pendiente'))});
  });
  const nPend=items.filter(x=>x.st==='pendiente').length;
  const bg=document.getElementById('badgeAprobar');
  if(bg){ bg.style.display=nPend?'':'none'; bg.textContent=nPend; }
  agRiesgoCalc(items);
  let arr=items.sort((a,b)=>b.orden-a.orden);
  if(fAprob==='pend') arr=arr.filter(x=>x.st==='pendiente');
  window._aprobF=arr;
  if(!arr.length){ tb.innerHTML='<tr><td colspan="8" class="vacio">'+(fAprob==='pend'?'Nada por aprobar. 🎉':'Sin ventas recientes.')+'</td></tr>'; return; }
  tb.innerHTML=arr.slice(0,100).map((x,i)=>`
    <tr onclick="verAprob(${i})">
      <td class="cli">${esc(x.cli)}${huellaBadge(x.tel)}<small>${esc(x.fecha)} · +${x.tel}</small></td>
      <td>${x.canal}</td>
      <td><span class="pchip"><i style="background:${x.color}"></i>${esc(x.prod)}</span></td>
      <td>${esc(x.comuna||'—')}</td>
      <td>${x.cant}</td>
      <td class="money">${x.total}</td>
      <td class="cell-aprob" onclick="event.stopPropagation()">${celdaAprob(x.k, x.st==='montado'?'<span class="st st-ok"><i></i>Montado</span>':'')}</td>
      <td onclick="event.stopPropagation()"><a class="qr" style="text-decoration:none" href="https://wa.me/${x.tel}" target="_blank">WhatsApp</a></td>
    </tr>`).join('');
}
/* detalle del cliente al hacer clic en una fila de Aprobación (página o WhatsApp) */
function verAprob(i){
  const x=(window._aprobF||[])[i]; if(!x) return; const o=x.raw||{};
  const fila=(k,v)=>`<div class="dl"><span class="k">${k}</span><span class="v">${esc(v)}</span></div>`;
  document.getElementById('mTitulo').textContent=o.cli||x.cli;
  if(x.canal==='Página'){
    document.getElementById('mBody').innerHTML=
      fila('Canal','Página · '+o.prod)+fila('Producto',o.prod)+fila('Cantidad',o.cant+' unidades')+
      fila('Teléfono','+'+o.tel)+(o.correo?fila('Correo',o.correo):'')+fila('Dirección',o.dir)+
      (o.ref?fila('Referencia',o.ref):'')+fila('Comuna',o.comuna)+fila('Región',o.region)+
      fila('Confirmación del cliente',o.abono?'ABONO PENDIENTE (esperando comprobante)':(o.conf?'CONFIRMADO':'Pendiente'))+fila('Dropi',o.dropi?'ENVIADO':'Pendiente')+fila('Fecha',o.fecha);
    document.getElementById('mTotal').textContent=o.total+' CLP';
    window._ventaAbierta={cli:o.cli,dir:o.dir+(o.ref?' - '+o.ref:''),region:o.region,tel:o.tel,prod:o.prod,cant:o.cant,precio:o.total};
  }else{
    document.getElementById('mBody').innerHTML=
      fila('Canal','WhatsApp · '+(BOTNOM[o.bot]||''))+fila('País',{CL:'Chile',CO:'Colombia',PY:'Paraguay'}[o.loc]||'—')+
      fila('Producto',o.prod)+fila('Cantidad',o.cant+' unidades')+fila('Teléfono','+'+o.tel)+
      fila('Dirección',o.dir)+fila('Comuna / Ciudad',o.zona)+fila('Región / Depto.',o.region)+
      fila('Confirmación del cliente',o.abono?'ABONO PENDIENTE (esperando comprobante)':(o.conf?'CONFIRMADO':'Pendiente'))+fila('Montado en Dropi',o.montado?('SÍ'+(o.ordenDropi?' · orden #'+o.ordenDropi:'')):'Pendiente')+
      fila('Fecha',o.fecha+' '+(o.hora||''));
    document.getElementById('mTotal').textContent=o.precio;
    window._ventaAbierta=o;
  }
  document.getElementById('ov').classList.add('open');
}

/* ---------- navegación ---------- */
const TITULOS={resumen:['Resumen general','Todos los canales · monedas separadas por país'],
  finanzas:['Finanzas','P&L, costos, devoluciones y rentabilidad por producto · Chile · en COP'],
  dropi:['Dropi · Guías','Estado de cada guía actualizado con Dropi · seguimiento'],
  calc:['Calculadora de combos','Costo y precio de venta por combo (1/2/3) en CLP · flete repartido'],
  aprobar:['Aprobación de ventas','Página + WhatsApp · solo lo que apruebes se monta en Dropi'],
  pedidos:['Pedidos de páginas','Shilajit y DRAINPRO · confirmación y estado Dropi'],
  abandonados:['Pedidos abandonados','Solo los no completados · recuperación automática'],
  visitas:['Visitas y conversión','Métricas de las páginas'],
  conv:['Conversaciones','WhatsApp'],
  anuncios:['Creador de anuncios','Sube tu video → la IA escribe los copys → eliges los que sirven'],
  bots:['Ventas y control de bots','WhatsApp · Carlos, James y Ramón'],
  historico:['Histórico','Consulta cualquier mes · todo queda guardado'],
  config:['Configuración','Ajustes del panel']};
// calcula dónde deben pegarse los encabezados de tabla: justo debajo de la barra superior + filtros fijos de la vista
function ajustarStickyTop(){
  const top=document.querySelector('.top');
  let off=top?top.offsetHeight:64;
  const v=document.querySelector('.view.act');
  if(v){
    const f=v.querySelector('.filters');
    if(f && getComputedStyle(f).position==='sticky' && f.offsetParent!==null) off+=f.offsetHeight;
  }
  document.documentElement.style.setProperty('--th-top', off+'px');
}
function mostrarVista(v){
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('act'));
  (document.getElementById('view-'+v)||document.getElementById('view-resumen')).classList.add('act');
  document.querySelectorAll('.nav-i[data-view]').forEach(x=>x.classList.toggle('act',x.dataset.view===v&&!x.dataset.bot));
  const t=TITULOS[v]||TITULOS.resumen;
  document.getElementById('vtitle').textContent=t[0];
  document.getElementById('vsub').textContent=t[1];
  if(v==='historico') renderHistorico();
  if(v==='visitas') renderVisitas();
  if(v==='finanzas'||v==='dropi'){ if(!window._finCargado){ cargarFinanzas(); } else { renderFinanzas(); _renderFinTabla(window._finPedidos); } }
  if(v==='calc') cargarCalc();
  if(typeof cerrarDrawer==='function') cerrarDrawer();
  if(typeof volverLista==='function') volverLista();   // vuelve a la lista al cambiar de vista
  ajustarStickyTop();
}
window.addEventListener('resize', ajustarStickyTop);
setTimeout(ajustarStickyTop, 300);
document.querySelectorAll('.nav-i[data-view]').forEach(n=>n.addEventListener('click',()=>{
  if(n.dataset.bot){ irConvBot(n.dataset.bot); return; }
  document.querySelectorAll('.nav-i[data-bot]').forEach(x=>x.classList.remove('subact'));
  mostrarVista(n.dataset.view);
}));

/* ---------- filtros UI ---------- */
document.querySelectorAll('#segCanal button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#segCanal button').forEach(x=>x.classList.remove('act'));b.classList.add('act');
  fCanal=b.dataset.c; renderResumen();
}));
document.querySelectorAll('#segEst button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#segEst button').forEach(x=>x.classList.remove('act'));b.classList.add('act');
  fEst=b.dataset.e;renderConvList();
}));
document.querySelectorAll('#segRconv button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#segRconv button').forEach(x=>x.classList.remove('act'));b.classList.add('act');
  Rconv={tipo:b.dataset.r,desde:null,hasta:null}; renderConvList();
}));
document.querySelectorAll('#segRvis button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#segRvis button').forEach(x=>x.classList.remove('act'));b.classList.add('act');
  Rvis={tipo:b.dataset.r,desde:null,hasta:null}; renderVisitas();
}));
document.querySelectorAll('#segPagV button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#segPagV button').forEach(x=>x.classList.remove('act'));b.classList.add('act');
  fPagV=b.dataset.pg; renderVisitas();
}));
document.querySelectorAll('#segPaisV .minitab').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#segPaisV .minitab').forEach(x=>x.classList.remove('act'));b.classList.add('act');
  fPaisV=b.dataset.p;renderVentasWA();
}));
document.querySelectorAll('#segProdP .minitab').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#segProdP .minitab').forEach(x=>x.classList.remove('act'));b.classList.add('act');
  fProdP=b.dataset.pp;renderPedidosWeb();
}));
document.querySelectorAll('#tabsConv .minitab').forEach(b=>b.addEventListener('click',()=>setTabConv(b.dataset.t)));
['cbuscar','vbuscar','pbuscar'].forEach(id=>{const e=document.getElementById(id);if(e)e.addEventListener('input',()=>{renderConvList();renderVentasWA();renderPedidosWeb();});});
const ci=document.getElementById('chInput'); if(ci) ci.addEventListener('keydown',e=>{if(e.key==='Enter')enviarRespuesta();});
/* (9) rango funcional */
const rangeSeg=document.getElementById('rangeSeg'), drr=document.getElementById('daterange');
if(rangeSeg){rangeSeg.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
  rangeSeg.querySelectorAll('button').forEach(x=>x.classList.remove('act'));b.classList.add('act');
  if(b.dataset.r==='fechas'){ if(drr) drr.hidden=false; return; }
  if(drr) drr.hidden=true;
  R={tipo:b.dataset.r,desde:null,hasta:null};
  renderResumen();
}));}
const btnAplicar=document.getElementById('btnAplicarFechas');
if(btnAplicar) btnAplicar.addEventListener('click',()=>{
  const d=document.getElementById('fDesde').value, h=document.getElementById('fHasta').value;
  if(!d||!h){toast('Elige las dos fechas','err');return;}
  R={tipo:'fechas',desde:new Date(d+'T00:00').getTime(),hasta:new Date(h+'T00:00').getTime()};
  renderResumen(); toast('Rango aplicado');
});

/* ---------- toast / modal ---------- */
function toast(msg,tipo){
  let t=document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t);}
  t.textContent=msg; t.className='show'+(tipo==='err'?' err':'');
  clearTimeout(t._h); t._h=setTimeout(()=>t.className='',2600);
}
const closeM=()=>document.getElementById('ov').classList.remove('open');

/* ---------- tema claro / oscuro ---------- */
const ICO_SOL='<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>';
const ICO_LUNA='<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
function aplicarTema(t){
  const dark=t==='dark';
  document.documentElement.setAttribute('data-theme', dark?'dark':'light');
  try{ localStorage.setItem('jaye_tema', dark?'dark':'light'); }catch(e){}
  const ic=document.getElementById('temaIcon'); if(ic) ic.innerHTML = dark?ICO_SOL:ICO_LUNA;
}
function toggleTema(){ aplicarTema(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'); }
(function(){ let t='light'; try{ t=localStorage.getItem('jaye_tema')||'light'; }catch(e){} aplicarTema(t); })();

/* ---------- menú móvil (cajón) + chat móvil ---------- */
function abrirDrawer(){ document.querySelector('.side').classList.add('open'); document.getElementById('drawerov').classList.add('open'); }
function cerrarDrawer(){ document.querySelector('.side').classList.remove('open'); document.getElementById('drawerov').classList.remove('open'); }
function volverLista(){ const g=document.querySelector('#view-conv .convgrid'); if(g) g.classList.remove('ver-chat'); document.body.classList.remove('chat-abierto'); }
const esMovil=()=>window.matchMedia('(max-width:760px)').matches;

/* ---------- arranque (15 s) ---------- */
/* ===================== DROPI · FINANZAS ===================== */
const URL_PEDIDOS_DROPI=BASE+'/leer-pedidos-dropi';
const URL_GASTO_META=BASE+'/leer-gasto-meta';
const URL_PL_PRODUCTO=BASE+'/leer-pl-producto';
window._finPedidos=[]; window._finMeta=[]; window._finPLProd=[]; window._finRango='mes'; window._finEstado=''; window._finBuscar=''; window._finCargado=false; window._fDesde=''; window._fHasta='';
var _finCG=null,_finCD=null;
function _cop(n){return '$'+Math.round(+n||0).toLocaleString('es-CO');}
function _finDesde(){ if(window._fDesde) return window._fDesde; var r=window._finRango; if(r==='all') return '2000-01-01'; var d=new Date(); if(r==='mes'){ d.setDate(1); } else if(r!=='hoy'){ d.setDate(d.getDate()-(parseInt(r,10)-1)); } return d.toISOString().slice(0,10); }
function _finHasta(){ return window._fHasta || '2999-12-31'; }
function _enR(d){ d=String(d||'').slice(0,10); return d && d>=_finDesde() && d<=_finHasta(); }
function _esTransito(e){return /TR[AÁ]NSITO|REPARTO|DESTINO|PREPARAD|ESPERA|GUIA/i.test(e);}
async function _finJ(u){ try{ var r=await fetch(u); var j=await r.json(); return Array.isArray(j)?j:null; }catch(e){ return null; } }
async function cargarFinanzas(){
  var p=await _finJ(URL_PEDIDOS_DROPI), m=await _finJ(URL_GASTO_META), pl=await _finJ(URL_PL_PRODUCTO);
  window._finPedidos=p||[]; window._finMeta=m||[]; window._finPLProd=pl||[]; window._finCargado=true;
  renderFinanzas(); _renderFinTabla(window._finPedidos);
  if(p===null){ var tb=document.getElementById('tbodyDropi'); if(tb) tb.innerHTML='<tr><td colspan="8" class="vacio">No se pudieron cargar los pedidos (¿webhook activo en n8n?).</td></tr>'; }
}
function _periodoLabel(){
  var ms=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  function f(s){ var p=String(s).split('-'); return parseInt(p[2],10)+' '+ms[parseInt(p[1],10)-1]; }
  if(window._finRango==='all'&&!window._fDesde) return 'todo el histórico';
  var d=_finDesde(), h=window._fHasta||new Date().toISOString().slice(0,10);
  return f(d)+' → '+f(h)+' '+String(d).split('-')[0];
}
function renderFinanzas(){
  var ped=window._finPedidos||[], meta=window._finMeta||[];
  // COHORTE: solo los pedidos MONTADOS (creados) en el período; se clasifican por su estado actual → SUMAN exacto
  var montados=0,entregados=0,devueltos=0,enCamino=0,cancelados=0,ingresos=0,costo=0,flete=0;
  // EN PROCESO (en camino/novedad): "cash in transit" — NO es ingreso aún, se mide aparte
  var procVal=0,procCosto=0,procFlete=0;
  ped.forEach(function(p){
    if(!_enR(p.creado_en)) return;
    montados++;
    var est=(p.estado||'').toUpperCase();
    if(/ENTREGAD/.test(est)){ entregados++; ingresos+=+p.recaudo||0; costo+=+p.costo||0; flete+=+p.flete||0; }
    else if(/DEVOL|RECHAZ/.test(est)){ devueltos++; flete+=+p.flete||0; }
    else if(/CANCELAD/.test(est)){ cancelados++; }
    else { enCamino++; procVal+=+p.recaudo||0; procCosto+=+p.costo||0; procFlete+=+p.flete||0; }
  });
  var ads=0; meta.forEach(function(m){ if(_enR(m.fecha)) ads+=+m.gasto||0; });
  var ganancia=ingresos-costo-flete-ads, resueltos=entregados+devueltos;
  var pctDev=resueltos?Math.round(devueltos/resueltos*100):0, margen=ingresos?Math.round(ganancia/ingresos*100):0;
  // PROYECCIÓN: aplico la tasa histórica de entrega del propio cohorte a lo que está en proceso
  var tasaEnt=resueltos?entregados/resueltos:0;
  // todas las en-proceso pagan flete (se entreguen o se devuelvan); ingreso y costo solo en las que se proyecta entregar
  var ganProy=ganancia + (procVal*tasaEnt) - (procCosto*tasaEnt) - procFlete;
  // COSTO DE OPERACIÓN PROMEDIO por venta ENTREGADA: producto + flete (incl. devoluciones) + pauta, todo ÷ entregados
  // => el % de devolución queda cargado solo (lo que se gastó en lo no entregado lo pagan las entregadas)
  var opProd=entregados?costo/entregados:0, opFlete=entregados?flete/entregados:0, opMeta=entregados?ads/entregados:0, opProm=opProd+opFlete+opMeta;
  var pe=document.getElementById('finPeriodo'); if(pe) pe.textContent=_periodoLabel();
  var kpi=function(l,vv,col,sub){return '<div style="background:#f4f6f9;border-radius:12px;padding:11px 13px"><div style="font-size:11.5px;color:#8a93a0">'+l+'</div><div style="font-size:19px;font-weight:700;margin-top:2px;color:'+(col||'#1a2433')+'">'+vv+'</div>'+(sub?'<div style="font-size:10.5px;color:#8a93a0;margin-top:1px">'+sub+'</div>':'')+'</div>';};
  var K=document.getElementById('finKpis'); if(K) K.innerHTML=
    kpi('Montados (ventas)',montados,'#1a2433','= entreg+dev+camino+canc')+
    kpi('Entregados',entregados,'#0f7a52')+
    kpi('Devueltos',devueltos+' · '+pctDev+'%',pctDev>20?'#c0392b':'#1a2433','% de resueltos')+
    kpi('En camino',enCamino,'#185fa5',_cop(procVal)+' en proceso')+
    kpi('Cancelados',cancelados,'#8a93a0')+
    kpi('Ingresos (realizado)',_cop(ingresos),'#1a2433','solo entregados')+kpi('Costo producto',_cop(costo))+kpi('Flete',_cop(flete),'#1a2433','entregas + devol.')+kpi('Publicidad',_cop(ads))+
    kpi('Costo op. prom/venta',_cop(opProm),'#b06a00','prod '+_cop(opProd)+' · flete '+_cop(opFlete)+' · meta '+_cop(opMeta)+' · dev '+pctDev+'% cargado')+
    kpi('Ganancia neta',_cop(ganancia),ganancia>=0?'#0f7a52':'#c0392b','margen '+margen+'%')+
    kpi('Ganancia proyectada',_cop(ganProy),ganProy>=0?'#0f7a52':'#c0392b','al cerrar lo en proceso ('+Math.round(tasaEnt*100)+'% entrega)');
  _renderFinCharts(ped,meta,_finDesde());
  _renderPL(ingresos,costo,flete,ads);
  _renderDevBars(ped);
  _renderUnit(); _renderAds();
}
/* === Estado de resultados (P&L por capas) === */
function _renderPL(ing,cogs,flete,ads){
  var cm1=ing-cogs, cm2=cm1-flete, cm3=cm2-ads;
  var pc=function(v){ return ing?Math.round(v/ing*100)+'%':'—'; };
  var row=function(lbl,val,bold,col,pct){ return '<div style="display:flex;justify-content:space-between;padding:'+(bold?'9px':'6px')+' 8px;'+(bold?'background:#f4f6f9;border-radius:8px;margin:3px 0;':'')+'font-size:'+(bold?'13.5px':'13px')+';'+(bold?'font-weight:700':'')+'"><span style="color:'+(bold?'#1a2433':'#5a6470')+'">'+lbl+'</span><span style="display:flex;gap:12px"><b style="color:'+(col||'#1a2433')+';min-width:96px;text-align:right">'+_cop(val)+'</b><span style="color:#8a93a0;min-width:38px;text-align:right;font-weight:400">'+(pct||'')+'</span></span></div>'; };
  var el=document.getElementById('finPL'); if(!el) return;
  el.innerHTML=
    row('Ingresos (entregados)',ing,false,'#1a2433','100%')+
    row('− Costo de producto (COGS)',-cogs,false,'#c0392b')+
    row('= Margen bruto (CM1)',cm1,true,'#1a2433',pc(cm1))+
    row('− Flete (entregas + devoluciones)',-flete,false,'#c0392b')+
    row('= Contribución antes de pauta (CM2)',cm2,true,'#1a2433',pc(cm2))+
    row('− Publicidad (Meta)',-ads,false,'#c0392b')+
    row('= GANANCIA NETA (CM3)',cm3,true,cm3>=0?'#0f7a52':'#c0392b',pc(cm3));
  // waterfall
  _renderWaterfall(ing,cogs,flete,ads,cm3);
}
var _echW=null;
function _renderWaterfall(ing,cogs,flete,ads,neta){
  var el=document.getElementById('finWaterfall'); if(!el||!el.offsetWidth||typeof echarts==='undefined') return;
  _echW=echarts.getInstanceByDom(el)||echarts.init(el);
  var cats=['Ingresos','Costo','Flete','Pauta','Ganancia'];
  var base=[0, ing-cogs, ing-cogs-flete, ing-cogs-flete-ads, 0];
  var vals=[ing, cogs, flete, ads, Math.max(neta,0)];
  var colors=['#1d9e75','#c0392b','#c0392b','#c0392b',neta>=0?'#0f7a52':'#c0392b'];
  _echW.setOption({tooltip:{trigger:'axis',axisPointer:{type:'shadow'},formatter:function(p){var i=p[0].dataIndex;return cats[i]+': '+_cop(vals[i]);}},grid:{left:46,right:8,top:10,bottom:24},
    xAxis:{type:'category',data:cats,axisLabel:{fontSize:9,color:'#8a93a0'},axisTick:{show:false}},yAxis:{type:'value',axisLabel:{fontSize:9,color:'#8a93a0',formatter:function(x){return '$'+(x/1e6).toFixed(1)+'M';}},splitLine:{lineStyle:{color:'#eef0f2'}}},
    series:[{type:'bar',stack:'t',itemStyle:{color:'transparent'},data:base},{type:'bar',stack:'t',data:vals.map(function(v,i){return {value:v,itemStyle:{color:colors[i],borderRadius:[3,3,0,0]}};})}]},true); _echW.resize();
}
function _renderUnit(){
  var arr=window._finPLProd||[], tb=document.getElementById('tbodyUnit'); if(!tb) return;
  if(!arr.length){ tb.innerHTML='<tr><td colspan="10" class="vacio">Activa «Leer PL Producto» en n8n para ver esto.</td></tr>'; return; }
  tb.innerHTML=arr.map(function(p){ var v=+p.entregados||0, u=+p.unidades||0;
    // TODO por VENTA (orden entregada), NO por unidad: la pauta/CAC se paga por venta; el costo de producto ya viene ×cantidad (promo 2x)
    var udsV=v?u/v:0;                  // unidades por venta (revela los packs: ~2 = 2x)
    var prV=v?(+p.ingresos)/v:0;       // precio promedio por venta
    var coV=v?(+p.costo)/v:0;          // costo producto por venta (ya incluye el ×2 del pack)
    var flV=v?(+p.flete)/v:0;          // flete por venta (1 envío, incl. devoluciones)
    var caV=v?(+p.publicidad)/v:0;     // CAC: pauta por VENTA, no por unidad
    var opV=coV+flV+caV, mgV=prV-opV;
    var dp=(+p.entregados+ +p.devueltos)?Math.round(+p.devueltos/(+p.entregados+ +p.devueltos)*100):0;
    return '<tr><td><b>'+esc(p.producto)+'</b></td><td>'+v+'</td><td>'+udsV.toFixed(1)+'</td><td class="money">'+_cop(prV)+'</td><td class="money">'+_cop(coV)+'</td><td class="money">'+_cop(flV)+'</td><td class="money" style="color:#b06a00">'+_cop(caV)+'</td><td class="money" style="font-weight:700">'+_cop(opV)+'</td><td class="money" style="font-weight:700;color:'+(mgV>=0?'#0f7a52':'#c0392b')+'">'+_cop(mgV)+'</td><td style="color:'+(dp>25?'#c0392b':'#5a6470')+'">'+dp+'%</td></tr>';
  }).join('');
}
var _echAds=null;
function _renderAds(){
  var arr=(window._finPLProd||[]).filter(function(p){return (+p.publicidad||0)>0;}).sort(function(a,b){return (+b.publicidad)-(+a.publicidad);});
  var el=document.getElementById('finAdsBar'), tab=document.getElementById('finAdsTab');
  if(arr.length && el && el.offsetWidth && typeof echarts!=='undefined'){
    _echAds=echarts.getInstanceByDom(el)||echarts.init(el);
    _echAds.setOption({tooltip:{trigger:'axis',axisPointer:{type:'shadow'},valueFormatter:function(x){return _cop(x);}},grid:{left:4,right:14,top:8,bottom:8,containLabel:true},
      xAxis:{type:'value',axisLabel:{fontSize:9,color:'#8a93a0',formatter:function(x){return '$'+(x/1e6).toFixed(1)+'M';}},splitLine:{lineStyle:{color:'#eef0f2'}}},
      yAxis:{type:'category',data:arr.map(function(p){return p.producto;}).reverse(),axisLabel:{fontSize:10,color:'#5a6470'},axisTick:{show:false}},
      series:[{type:'bar',data:arr.map(function(p){return +p.publicidad;}).reverse(),itemStyle:{color:'#e0a800',borderRadius:[0,4,4,0]}}]},true); _echAds.resize();
  }
  if(tab){ if(!arr.length){ tab.innerHTML='<div class="vacio" style="padding:10px">Activa «Leer PL Producto».</div>'; }
    else tab.innerHTML='<table style="width:100%;font-size:12px"><thead><tr style="color:#8a93a0;text-align:left"><th style="padding:5px 6px;font-weight:500">Producto</th><th style="padding:5px 6px;font-weight:500">Pauta</th><th style="padding:5px 6px;font-weight:500">CAC/vta</th></tr></thead><tbody>'+
      arr.map(function(p){ var v=+p.entregados||0,cac=v?(+p.publicidad)/v:0; return '<tr style="border-top:0.5px solid #eef0f2"><td style="padding:5px 6px">'+esc(p.producto)+'</td><td style="padding:5px 6px;font-weight:600">'+_cop(p.publicidad)+'</td><td style="padding:5px 6px;color:#b06a00">'+_cop(cac)+'</td></tr>'; }).join('')+'</tbody></table>'; }
}
var _echBP=null,_echBC=null;
function _barH(el,data,color){
  if(!el||!el.offsetWidth||typeof echarts==='undefined') return null;
  var inst=echarts.getInstanceByDom(el)||echarts.init(el);
  inst.setOption({tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},grid:{left:4,right:34,top:6,bottom:6,containLabel:true},
    xAxis:{type:'value',axisLabel:{show:false},splitLine:{show:false},axisLine:{show:false}},
    yAxis:{type:'category',data:data.map(function(d){return d.name;}).reverse(),axisLabel:{fontSize:10,color:'#5a6470'},axisTick:{show:false},axisLine:{show:false}},
    series:[{type:'bar',data:data.map(function(d){return d.value;}).reverse(),barWidth:'58%',itemStyle:{color:color,borderRadius:[0,5,5,0]},label:{show:true,position:'right',fontSize:10,fontWeight:'bold',color:'#1a2433'}}]},true); inst.resize(); return inst;
}
function _datTab(rows,n){ return '<table style="width:100%;font-size:12px"><tbody>'+rows.map(function(x){ var pct=n?Math.round(x.value/n*100):0; return '<tr style="border-top:0.5px solid #eef0f2"><td style="padding:4px 6px;color:#5a6470">'+esc(x.name)+'</td><td style="padding:4px 6px;text-align:right;font-weight:600">'+x.value+'</td><td style="padding:4px 6px;text-align:right;color:#8a93a0;width:42px">'+pct+'%</td></tr>'; }).join('')+'</tbody></table>'; }
function _renderDevBars(ped){
  var prod={},caus={},n=0;
  ped.forEach(function(p){ var est=(p.estado||'').toUpperCase(); if(!/DEVOL|RECHAZ/.test(est)) return; if(!_enR(p.creado_en)) return;
    var pr=_shortProd(p.producto); prod[pr]=(prod[pr]||0)+1;
    var m=(p.motivo_devolucion||'Sin motivo'); m=m.charAt(0).toUpperCase()+m.slice(1).toLowerCase(); caus[m]=(caus[m]||0)+1; n++; });
  var t=document.getElementById('finDevTot'); if(t) t.textContent=n+' devoluciones en el período';
  function L(o){ return Object.keys(o).map(function(k){return {name:k,value:o[k]};}).sort(function(a,b){return b.value-a.value;}); }
  var dp=L(prod), dc=L(caus);
  _echBP=_barH(document.getElementById('finDevProdBar'),dp,'#e24b4a');
  _echBC=_barH(document.getElementById('finCausalesBar'),dc,'#d8782e');
  var tp=document.getElementById('finDevProdTab'), tc=document.getElementById('finCausalesTab');
  if(tp) tp.innerHTML=n?_datTab(dp,n):'<div class="vacio" style="padding:8px">Sin devoluciones.</div>';
  if(tc) tc.innerHTML=n?_datTab(dc,n):'';
}
var _echDP=null,_echCa=null;
function _shortProd(s){ s=(s||'').toUpperCase();
  if(s.indexOf('SHILAJIT')>=0)return'Shilajit'; if(/POLVO|DRENAJE|DRAINPRO/.test(s))return'Polvo Limpiador';
  if(s.indexOf('NAD')>=0)return'NAD+'; if(s.indexOf('FREIDORA')>=0)return'Freidora'; if(s.indexOf('MAGNESIO')>=0)return'Magnesio';
  if(/COL[AÁ]GENO/.test(s))return'Colágeno'; if(s.indexOf('CANDIDA')>=0)return'Cándida'; if(s.indexOf('SELLADOR')>=0)return'Sellador'; if(s.indexOf('FAJA')>=0)return'Faja';
  return (s.charAt(0)+s.slice(1).toLowerCase()).split(' ').slice(0,2).join(' '); }
function _donutPro(el,data){
  if(typeof echarts==='undefined'||!el||!el.offsetWidth) return null;
  var inst=echarts.getInstanceByDom(el)||echarts.init(el);
  var total=data.reduce(function(a,b){return a+b.value;},0);
  inst.setOption({
    color:['#e24b4a','#d8782e','#e0a800','#1d9e75','#378ADD','#7c4dd8','#d4537e','#5a6470'],
    tooltip:{trigger:'item',formatter:'{b}<br/><b>{c}</b> · {d}%'},
    legend:{type:'scroll',bottom:0,left:'center',textStyle:{fontSize:10,color:'#5a6470'},itemWidth:11,itemHeight:11,icon:'circle'},
    graphic:[{type:'text',left:'center',top:'40%',style:{text:String(total),fontSize:26,fontWeight:'bold',fill:'#1a2433'}},{type:'text',left:'center',top:'53%',style:{text:'devol.',fontSize:11,fill:'#8a93a0'}}],
    series:[{type:'pie',radius:['48%','75%'],center:['50%','46%'],avoidLabelOverlap:true,
      itemStyle:{borderRadius:7,borderColor:'#fff',borderWidth:2,shadowBlur:16,shadowColor:'rgba(40,50,70,.22)',shadowOffsetX:2,shadowOffsetY:5},
      label:{show:true,position:'outside',formatter:'{d}%',fontSize:11,fontWeight:'bold',color:'#1a2433'},
      labelLine:{length:9,length2:9,lineStyle:{color:'#cdd5df'}},
      emphasis:{scaleSize:9,itemStyle:{shadowBlur:24}},
      data:data}]
  },true);
  inst.resize(); return inst;
}
var _PAL=['#e24b4a','#d8782e','#e0a800','#1d9e75','#378ADD','#7c4dd8','#d4537e','#5a6470'];
function _webglOK(){ try{var c=document.createElement('canvas'); return !!(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl')));}catch(e){return false;} }
function _gpe(s,e,k,h){ var sr=s*Math.PI*2,er=e*Math.PI*2; return {
  u:{min:-Math.PI,max:Math.PI*3,step:Math.PI/32}, v:{min:0,max:Math.PI*2,step:Math.PI/20},
  x:function(u,v){ if(u<sr)return Math.cos(sr)*(1+Math.cos(v)*k); if(u>er)return Math.cos(er)*(1+Math.cos(v)*k); return Math.cos(u)*(1+Math.cos(v)*k); },
  y:function(u,v){ if(u<sr)return Math.sin(sr)*(1+Math.cos(v)*k); if(u>er)return Math.sin(er)*(1+Math.cos(v)*k); return Math.sin(u)*(1+Math.cos(v)*k); },
  z:function(u,v){ if(u<-Math.PI*0.5)return Math.sin(u); if(u>Math.PI*2.5)return Math.sin(u)*h; return Math.sin(v)>0?h:-1; } }; }
function getPie3D(pieData,inner){
  var series=[],sum=0,sv=0,ev=0,k=typeof inner!=='undefined'?(1-inner)/(1+inner):1/3;
  for(var i=0;i<pieData.length;i++){ sum+=pieData[i].value;
    var it={name:pieData[i].name,type:'surface',parametric:true,wireframe:{show:false},pieData:pieData[i],itemStyle:{}};
    if(pieData[i].itemStyle&&pieData[i].itemStyle.color) it.itemStyle.color=pieData[i].itemStyle.color; series.push(it); }
  for(var j=0;j<series.length;j++){ ev=sv+series[j].pieData.value; series[j].pieData.startRatio=sv/sum; series[j].pieData.endRatio=ev/sum;
    series[j].parametricEquation=_gpe(sv/sum,ev/sum,k,1.6); sv=ev; }
  return { tooltip:{formatter:function(p){ for(var x=0;x<series.length;x++){ if(series[x].name===p.seriesName){var d=series[x].pieData; return p.seriesName+'<br/><b>'+d.value+'</b> · '+Math.round((d.endRatio-d.startRatio)*100)+'%';} } return p.seriesName; }},
    legend:{type:'scroll',bottom:0,left:'center',textStyle:{fontSize:10,color:'#5a6470'},itemWidth:11,itemHeight:11,icon:'circle'},
    xAxis3D:{min:-1,max:1},yAxis3D:{min:-1,max:1},zAxis3D:{min:-1,max:1},
    grid3D:{show:false,boxHeight:5,top:'-4%',viewControl:{alpha:40,beta:25,distance:215,rotateSensitivity:1,zoomSensitivity:0,panSensitivity:0,autoRotate:true,autoRotateSpeed:9}},
    series:series }; }
function _pie3D(el,data){ if(!el||!el.offsetWidth) return null;
  try{ var inst=echarts.getInstanceByDom(el)||echarts.init(el); inst.setOption(getPie3D(data,0.5),true); inst.resize(); return inst; }
  catch(e){ return _donutPro(el,data); } }
function _renderDevDonuts(ped){
  var prod={},caus={},n=0;
  ped.forEach(function(p){ var est=(p.estado||'').toUpperCase(); if(!/DEVOL|RECHAZ/.test(est)) return; if(!_enR(p.creado_en)) return;
    var pr=_shortProd(p.producto); prod[pr]=(prod[pr]||0)+1;
    var m=(p.motivo_devolucion||'Sin motivo'); m=m.charAt(0).toUpperCase()+m.slice(1).toLowerCase(); caus[m]=(caus[m]||0)+1; n++; });
  var t=document.getElementById('finDevTot'); if(t) t.textContent=n+' devoluciones en el período';
  function mk(o){ return Object.keys(o).map(function(k){return {name:k,value:o[k]};}).sort(function(a,b){return b.value-a.value;}).map(function(x,i){ x.itemStyle={color:_PAL[i%_PAL.length]}; return x; }); }
  var dp=mk(prod), dc=mk(caus);
  if(!n){ dp=[{name:'Sin devoluciones',value:1,itemStyle:{color:'#cdd5df'}}]; dc=dp.slice(); }
  var use3d=_webglOK()&&typeof echarts!=='undefined';
  var R=use3d?_pie3D:_donutPro;
  _echDP=R(document.getElementById('echDevProd'),dp);
  _echCa=R(document.getElementById('echCausales'),dc);
}
window.addEventListener('resize',function(){ try{[_echGan,_echDev,_echW,_echAds,_echBP,_echBC].forEach(function(c){if(c)c.resize();});}catch(e){} });
function _renderPLProd(){
  var arr=window._finPLProd||[], tb=document.getElementById('tbodyPLProd'); if(!tb) return;
  if(!arr.length){ tb.innerHTML='<tr><td colspan="8" class="vacio">Sin datos.</td></tr>'; return; }
  tb.innerHTML=arr.map(function(p){ var gan=(+p.ingresos||0)-(+p.costo||0)-(+p.flete||0)-(+p.publicidad||0);
    var dp=(+p.entregados+ +p.devueltos)?Math.round(+p.devueltos/(+p.entregados+ +p.devueltos)*100):0;
    return '<tr><td><b>'+esc(p.producto)+'</b></td><td>'+p.pedidos+'</td><td style="color:'+(dp>25?'#c0392b':'#5a6470')+'">'+dp+'%</td>'+
      '<td class="money">'+_cop(p.ingresos)+'</td><td class="money">'+_cop(p.costo)+'</td><td class="money">'+_cop(p.flete)+'</td><td class="money" style="color:#b06a00">'+_cop(p.publicidad)+'</td>'+
      '<td class="money" style="font-weight:700;color:'+(gan>=0?'#0f7a52':'#c0392b')+'">'+_cop(gan)+'</td></tr>';
  }).join('');
}
var _echGan=null,_echDev=null;
function _renderFinCharts(ped,meta,desde){
  if(typeof echarts==='undefined') return;
  var dias={},byDev={},metaDay={};
  function dd(d){return String(d||'').slice(0,10);}
  ped.forEach(function(p){ var est=(p.estado||'').toUpperCase();
    if(/ENTREGAD/.test(est)){ var d=dd(p.entregado_en); if(_enR(d)){ dias[d]=dias[d]||{ing:0,gas:0}; dias[d].ing+=+p.recaudo||0; dias[d].gas+=(+p.costo||0)+(+p.flete||0); } }
    if(/DEVOL|RECHAZ/.test(est)){ var c=dd(p.actualizado_en||p.creado_en); if(_enR(c)) byDev[c]=(byDev[c]||0)+1; }
  });
  meta.forEach(function(m){ if(_enR(m.fecha)) metaDay[m.fecha]=+m.gasto||0; });
  var labels=Object.keys(Object.assign({},dias,byDev,metaDay)).filter(function(d){return _enR(d);}).sort();
  var ing=labels.map(function(d){return dias[d]?Math.round(dias[d].ing):0;});
  var gas=labels.map(function(d){return (dias[d]?dias[d].gas:0)+(metaDay[d]||0);});
  var gan=labels.map(function(d,i){return ing[i]-gas[i];});
  var dev=labels.map(function(d){return byDev[d]||0;});
  var lab=labels.map(function(d){return d.slice(5);});
  var g=document.getElementById('finChartGan'), v=document.getElementById('finChartDev');
  if(g&&g.offsetWidth){ _echGan=echarts.getInstanceByDom(g)||echarts.init(g);
    _echGan.setOption({color:['#1d9e75','#e0a800','#378ADD'],tooltip:{trigger:'axis',axisPointer:{type:'shadow'},valueFormatter:function(x){return _cop(x);}},
      legend:{bottom:0,textStyle:{fontSize:10,color:'#5a6470'},itemWidth:11,itemHeight:11,icon:'roundRect'},
      grid:{left:46,right:10,top:12,bottom:36},
      xAxis:{type:'category',data:lab,axisLabel:{fontSize:9,color:'#8a93a0'},axisTick:{show:false},axisLine:{lineStyle:{color:'#d8dee8'}}},
      yAxis:{type:'value',axisLabel:{fontSize:9,color:'#8a93a0',formatter:function(x){return '$'+(x/1e6).toFixed(1)+'M';}},splitLine:{lineStyle:{color:'#eef0f2'}}},
      series:[{name:'Ingresos',type:'bar',data:ing,itemStyle:{borderRadius:[4,4,0,0]}},{name:'Gasto',type:'bar',data:gas,itemStyle:{borderRadius:[4,4,0,0]}},{name:'Ganancia',type:'bar',data:gan,itemStyle:{borderRadius:[4,4,0,0]}}]},true); _echGan.resize(); }
  if(v&&v.offsetWidth){ _echDev=echarts.getInstanceByDom(v)||echarts.init(v);
    _echDev.setOption({tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},grid:{left:30,right:10,top:12,bottom:24},
      xAxis:{type:'category',data:lab,axisLabel:{fontSize:9,color:'#8a93a0'},axisTick:{show:false},axisLine:{lineStyle:{color:'#d8dee8'}}},
      yAxis:{type:'value',minInterval:1,axisLabel:{fontSize:9,color:'#8a93a0'},splitLine:{lineStyle:{color:'#eef0f2'}}},
      series:[{name:'Devoluciones',type:'bar',data:dev,itemStyle:{color:'#e24b4a',borderRadius:[4,4,0,0]}}]},true); _echDev.resize(); }
}
function _estChip(est){ var e=(est||'').toUpperCase(),bg='#eef0f2',c='#5a6470';
  if(/ENTREGAD/.test(e)){bg='#e1f5ee';c='#0f6e56';} else if(/DEVOL|RECHAZ/.test(e)){bg='#fcebeb';c='#a32d2d';}
  else if(/NOVEDAD/.test(e)){bg='#fbf0d4';c='#8a5a00';} else if(_esTransito(e)){bg='#e6f1fb';c='#185fa5';}
  return '<span style="font-size:11px;background:'+bg+';color:'+c+';padding:2px 8px;border-radius:9px;white-space:nowrap">'+(est||'—')+'</span>';
}
function _ganOf(p){ var e=(p.estado||'').toUpperCase(); if(/DEVOL|RECHAZ/.test(e)) return -(+p.flete||0); return (+p.recaudo||0)-(+p.costo||0)-(+p.flete||0); }
function _renderFinTabla(ped){
  var est=window._finEstado, q=(window._finBuscar||'').toLowerCase();
  var arr=(ped||[]).filter(function(p){
    if(est && !(new RegExp(est,'i')).test(p.estado||'')) return false;
    if(q){ if((((p.cliente||'')+' '+(p.guia||'')+' '+(p.producto||'')+' '+(p.telefono||'')).toLowerCase()).indexOf(q)<0) return false; }
    return true;
  });
  var tb=document.getElementById('tbodyDropi'); if(!tb) return;
  if(!arr.length){ tb.innerHTML='<tr><td colspan="8" class="vacio">Sin pedidos en este filtro.</td></tr>'; return; }
  var grp={},T={rec:0,cos:0,fle:0,gan:0};
  arr.forEach(function(p){ var k=_shortProd(p.producto); var g=grp[k]||(grp[k]={n:0,rec:0,cos:0,fle:0,gan:0}); var gn=_ganOf(p);
    g.n++; g.rec+=+p.recaudo||0; g.cos+=+p.costo||0; g.fle+=+p.flete||0; g.gan+=gn;
    T.rec+=+p.recaudo||0; T.cos+=+p.costo||0; T.fle+=+p.flete||0; T.gan+=gn; });
  var gk=Object.keys(grp).sort(function(a,b){return grp[b].n-grp[a].n;});
  var sumRows=gk.map(function(k){ var g=grp[k]; return '<tr style="background:#f7f9fb"><td><b style="color:#1a2433">'+esc(k)+'</b> <small style="color:#8a93a0">'+g.n+' guía'+(g.n>1?'s':'')+'</small></td><td></td><td></td><td></td><td class="money">'+_cop(g.rec)+'</td><td class="money">'+_cop(g.cos)+'</td><td class="money">'+_cop(g.fle)+'</td><td class="money" style="color:'+(g.gan>=0?'#0f7a52':'#c0392b')+';font-weight:600">'+_cop(g.gan)+'</td></tr>'; }).join('');
  var totRow='<tr style="background:#e7ebf1;font-weight:700;border-top:2px solid #cfd8e3;border-bottom:2px solid #cfd8e3"><td>'+arr.length+' guías</td><td></td><td></td><td style="color:#5a6470">TOTAL</td><td class="money">'+_cop(T.rec)+'</td><td class="money">'+_cop(T.cos)+'</td><td class="money">'+_cop(T.fle)+'</td><td class="money" style="color:'+(T.gan>=0?'#0f7a52':'#c0392b')+'">'+_cop(T.gan)+'</td></tr>';
  tb.innerHTML=sumRows+totRow+arr.slice(0,300).map(function(p){
    var gan=_ganOf(p), e2=(p.estado||'').toUpperCase(), proj=!/ENTREGAD|DEVOL|RECHAZ/.test(e2);
    return '<tr><td class="cli">'+esc(p.cliente||'—')+'<small>+'+(p.telefono||'')+(p.motivo_devolucion?(' · '+esc(p.motivo_devolucion)):'')+'</small></td>'+
      '<td>'+esc((p.producto||'').slice(0,26))+' <small>x'+(p.cantidad||1)+'</small></td>'+
      '<td>'+(p.guia?('<span style="font-variant-numeric:tabular-nums">'+esc(p.guia)+'</span>'):'—')+'</td>'+
      '<td>'+_estChip(p.estado)+'</td><td class="money">'+_cop(p.recaudo)+'</td><td class="money">'+_cop(p.costo)+'</td><td class="money">'+_cop(p.flete)+'</td>'+
      '<td class="money" style="color:'+(gan>=0?'#0f7a52':'#c0392b')+';font-weight:600">'+(proj?('<span style="color:#9aa4b2">'+_cop(gan)+'*</span>'):_cop(gan))+'</td></tr>';
  }).join('');
}
document.addEventListener('click',function(e){
  var r=e.target.closest&&e.target.closest('#finRango .minitab'); if(r){ document.querySelectorAll('#finRango .minitab').forEach(function(b){b.classList.remove('act');}); r.classList.add('act'); window._finRango=r.dataset.r; window._fDesde=''; window._fHasta=''; var di=document.getElementById('finDesde'),hi=document.getElementById('finHasta'); if(di)di.value=''; if(hi)hi.value=''; renderFinanzas(); }
  var s=e.target.closest&&e.target.closest('#finEstado .minitab'); if(s){ document.querySelectorAll('#finEstado .minitab').forEach(function(b){b.classList.remove('act');}); s.classList.add('act'); window._finEstado=s.dataset.e; _renderFinTabla(window._finPedidos); }
});
document.addEventListener('change',function(e){ if(e.target&&(e.target.id==='finDesde'||e.target.id==='finHasta')){ window._fDesde=(document.getElementById('finDesde')||{}).value||''; window._fHasta=(document.getElementById('finHasta')||{}).value||''; document.querySelectorAll('#finRango .minitab').forEach(function(b){b.classList.remove('act');}); renderFinanzas(); } });
document.addEventListener('input',function(e){ if(e.target&&e.target.id==='finBuscar'){ window._finBuscar=e.target.value; _renderFinTabla(window._finPedidos); } });
setInterval(function(){ var f=document.getElementById('view-finanzas'),d=document.getElementById('view-dropi'); if((f&&f.classList.contains('act'))||(d&&d.classList.contains('act'))) cargarFinanzas(); }, 180000);

cargarConvos(); cargarVentas(); cargarPaginas(); cargarHuellas();
setInterval(()=>{cargarConvos();cargarVentas();cargarPaginas();},15000);
setInterval(cargarHuellas,300000);
document.getElementById('fechaHead').textContent=new Date().toLocaleDateString('es-CL',{weekday:'long',day:'numeric',month:'long'});

/* ====================== ASESOR IA (botón flotante + chat) ====================== */
const URL_AGENTE=BASE+'/agente-finanzas';
const URL_METAACCION=BASE+'/meta-accion';
window._agHist=[]; window._agBusy=false; window._agInit=false;
function agToggle(){ var p=document.getElementById('agPanel'); if(!p) return; p.classList.toggle('open');
  if(p.classList.contains('open')){
    if(!window._agInit){ window._agInit=true;
      agPush('a','Hola James. Soy tu asesor: contable, Meta Ads y riesgo de clientes. Veo tus numeros reales de Dropi y Meta. Preguntame o usa un atajo de abajo.'); }
    agAlertaRiesgo();
    setTimeout(function(){ var t=document.getElementById('agText'); if(t) t.focus(); },80); } }
/* Aviso de clientes riesgosos: cuenta los PENDIENTES de aprobacion que son Riesgosa/Critica */
window._agRiesgo=[];
function agRiesgoCalc(items){
  var pend=(items||[]).filter(function(x){return x.st==='pendiente';});
  var out=[];
  pend.forEach(function(x){ var k=String(x.tel||'').replace(/\D/g,'').slice(-8); var h=(window.huellaMap||{})[k];
    if(h && /RIESG|CR[IÍ]TIC/i.test(h.risk_label||'')) out.push({cli:x.cli,tel:x.tel,risk:h.risk_label,dev:(+h.dropi_dev||0),tot:(+h.dropi_total||0)}); });
  window._agRiesgo=out;
  var b=document.getElementById('agAlert'); if(b){ if(out.length){ b.style.display='flex'; b.textContent=out.length; } else b.style.display='none'; }
}
function agAlertaRiesgo(){ var arr=window._agRiesgo||[]; var ex=document.getElementById('agRiesgoMsg'); if(ex) ex.remove();
  if(!arr.length) return; var m=document.getElementById('agMsgs'); if(!m) return;
  var l=arr.slice(0,6).map(function(r){return '- '+(r.cli||'Cliente')+' ('+r.risk+', '+r.dev+'/'+r.tot+' devueltos en Dropi)';}).join('\n');
  var d=document.createElement('div'); d.id='agRiesgoMsg'; d.className='agMsg a'; d.style.borderColor='#e24b4a';
  d.innerHTML=agMd('ALERTA DE RIESGO: tienes '+arr.length+' cliente(s) riesgoso(s) esperando aprobacion:\n'+l+'\n\nRevisalos antes de aprobar. Dime si quieres que te diga cuales bloquear.');
  m.appendChild(d); m.scrollTop=m.scrollHeight; }
function agAuto(t){ t.style.height='auto'; t.style.height=Math.min(t.scrollHeight,96)+'px'; }
function agKey(e){ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); agSend(); } }
function agChip(txt){ var t=document.getElementById('agText'); if(t){ t.value=txt; } agSend(); }
function agEsc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function agMd(s){ s=agEsc(s);
  // Texto PLANO serio: fuera asteriscos, codigo, encabezados y tablas
  s=s.replace(/\*\*([^*]+)\*\*/g,'$1');           // sin negritas markdown
  s=s.replace(/\*([^*\n]+)\*/g,'$1');              // sin italicas
  s=s.replace(/`+([^`]*)`+/g,'$1');                // sin codigo
  s=s.replace(/^\s{0,3}#{1,6}\s*/gm,'');            // sin encabezados #
  s=s.replace(/^\s*\|(.*)\|\s*$/gm,function(m,c){return c.replace(/\|/g,'   ').trim();}); // tablas -> texto
  s=s.replace(/^\s*[-*•]\s+/gm,'• ');               // vinetas limpias
  s=s.replace(/\n{3,}/g,'\n\n');
  s=s.replace(/\n/g,'<br>');
  return s; }
function agPush(role,text){ var m=document.getElementById('agMsgs'); if(!m) return null;
  var d=document.createElement('div'); d.className='agMsg '+(role==='u'?'u':'a'); d.innerHTML=role==='u'?agEsc(text):agMd(text);
  m.appendChild(d); m.scrollTop=m.scrollHeight; return d; }
function agDots(on){ var m=document.getElementById('agMsgs'); if(!m) return;
  var ex=document.getElementById('agDots'); if(ex) ex.remove();
  if(on){ var d=document.createElement('div'); d.id='agDots'; d.className='agDots'; d.innerHTML='<i></i><i></i><i></i>'; m.appendChild(d); m.scrollTop=m.scrollHeight; } }
async function agSend(){ if(window._agBusy) return; var t=document.getElementById('agText'); if(!t) return;
  var q=(t.value||'').trim(); if(!q) return;
  t.value=''; agAuto(t); agPush('u',q); window._agHist.push({role:'user',content:q});
  window._agBusy=true; var sb=document.getElementById('agSend'); if(sb) sb.disabled=true; agDots(true);
  try{
    var r=await fetch(URL_AGENTE,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({pregunta:q, historial:window._agHist.slice(-10), pais:'CL'})});
    var txt=await r.text(); var resp='';
    try{ var j=JSON.parse(txt); resp=j.respuesta||j.text||j.output||j.answer||(j.content&&j.content[0]&&j.content[0].text)||txt; }
    catch(e){ resp=txt; }
    agDots(false); if(!resp||!resp.trim()) resp='No pude generar respuesta. Revisa que el flujo «Agente Finanzas» esté activo en n8n.';
    // separar acciones propuestas de Meta (ACCIONES_JSON: [...]) del texto
    var acciones=[]; var mm=resp.match(/ACCIONES_JSON:\s*(\[[\s\S]*\])\s*$/);
    if(mm){ try{ acciones=JSON.parse(mm[1]); }catch(e){} resp=resp.slice(0,mm.index).trim(); }
    agPush('a',resp); window._agHist.push({role:'assistant',content:resp});
    if(acciones&&acciones.length) agAcciones(acciones);
  }catch(err){ agDots(false); agPush('a','No me pude conectar al cerebro (n8n). Verifica que el webhook «agente-finanzas» esté activo.'); }
  window._agBusy=false; var sb2=document.getElementById('agSend'); if(sb2) sb2.disabled=false;
}
/* Tarjetas de accion de Meta con boton Autorizar (nada se ejecuta sin clic) */
function agAcciones(arr){ var m=document.getElementById('agMsgs'); if(!m) return;
  arr.forEach(function(a){ if(!a||!a.campania_id||!a.tipo) return;
    var lbl=a.tipo==='pausar'?('Pausar campaña: '+(a.nombre||a.campania_id))
      :a.tipo==='activar'?('Activar campaña: '+(a.nombre||a.campania_id))
      :('Presupuesto «'+(a.nombre||a.campania_id)+'» → $'+Number(a.valor||0).toLocaleString('es-CO')+'/día');
    var d=document.createElement('div'); d.className='agAccion';
    d.innerHTML='<div class="agAccT">Acción en Meta · requiere tu autorización</div><div class="agAccL">'+agEsc(lbl)+'</div>'+
      '<div class="agAccB"><button class="agOk">Autorizar</button><button class="agNo">Cancelar</button></div>';
    var done=false;
    d.querySelector('.agOk').onclick=function(){ if(done)return; done=true; agEjecutar(a,d); };
    d.querySelector('.agNo').onclick=function(){ d.querySelector('.agAccB').innerHTML='<span class="agAccMsg" style="color:#8a93a0">Cancelado.</span>'; };
    m.appendChild(d); });
  m.scrollTop=m.scrollHeight; }
async function agEjecutar(a,d){ var b=d.querySelector('.agAccB'); b.innerHTML='<span class="agAccMsg" style="color:#8a6d12">Ejecutando…</span>';
  try{ var r=await fetch(URL_METAACCION,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({campania_id:a.campania_id,tipo:a.tipo,valor:a.valor,nombre:a.nombre})});
    var j=await r.json(); var ok=j&&j.ok;
    b.innerHTML='<span class="agAccMsg" style="color:'+(ok?'#0f7a52':'#c0392b')+'">'+agEsc(j&&j.mensaje?j.mensaje:(ok?'Listo':'No se pudo'))+'</span>';
  }catch(e){ b.innerHTML='<span class="agAccMsg" style="color:#c0392b">No me pude conectar para ejecutar.</span>'; } }

/* ====================== CALCULADORA DE COMBOS ====================== */
const URL_CALC=BASE+'/calc-productos';
window._calcProds=[]; window._calcPrecios={};
async function cargarCalc(){ var sel=document.getElementById('calcProd'); if(!sel) return;
  if(!window._calcProds.length){ try{ var r=await fetch(URL_CALC); var a=await r.json(); window._calcProds=Array.isArray(a)?a:(a.data||a.objects||[]); }catch(e){} }
  if(!sel.dataset.ready){
    var html='<option value="">— elige un producto —</option>';
    window._calcProds.forEach(function(p,i){ html+='<option value="'+i+'">'+esc(p.nombre||('id '+p.producto_id))+'</option>'; });
    html+='<option value="nuevo">+ Producto nuevo (escribo el costo)</option>';
    sel.innerHTML=html; sel.dataset.ready='1';
  }
  // promedios GLOBALES fijos del histórico (transporte entre regiones, Meta, devolución) — editables
  var g=window._calcProds[0]||{};
  var setIf=function(id,val){ var el=document.getElementById(id); if(el&&!el.value&&val!=null) el.value=val; };
  setIf('calcFlete',g.flete_prom_clp); setIf('calcCac',g.cac_prom_clp); setIf('calcDevol',g.devol_prom_pct);
  renderCalc();
}
function calcPick(){ var sel=document.getElementById('calcProd'); var v=sel.value; window._calcPrecios={};
  if(v!=='' && v!=='nuevo'){ var p=window._calcProds[+v];
    if(p){ document.getElementById('calcCosto').value=p.costo_unit_clp||''; } }  // solo el COSTO cambia por producto; transporte/Meta/devolución quedan en el promedio fijo
  renderCalc(); }
function calcReset(){ window._calcPrecios={}; renderCalc(); }
function calcSetMk(n){ var el=document.getElementById('calcMarkup'); if(el) el.value=n; window._calcPrecios={}; renderCalc(); }
function _fclp(n){ return '$'+Math.round(n||0).toLocaleString('es-CL'); }
function _calcCarga(){ var d=(+(document.getElementById('calcDevol')||{}).value||0)/100; if(d<0)d=0; if(d>=0.95)d=0.95; return 1/(1-d); }
function renderCalc(){ var tb=document.getElementById('calcBody'); if(!tb) return;
  var costo=+(document.getElementById('calcCosto')||{}).value||0;
  var flete=+(document.getElementById('calcFlete')||{}).value||0;
  var cac=+(document.getElementById('calcCac')||{}).value||0;
  var mk=+(document.getElementById('calcMarkup')||{}).value||0;
  var carga=_calcCarga();
  if(!costo){ tb.innerHTML='<tr><td colspan="9" class="vacio">Elige un producto o escribe el costo unitario.</td></tr>'; return; }
  var flC=Math.round(flete*carga), caC=Math.round(cac*carga);
  tb.innerHTML=[1,2,3].map(function(n){
    var cp=costo*n, ct=cp+flC+caC, sug=Math.round(ct*(1+mk/100));
    var pr=(window._calcPrecios[n]!=null)?window._calcPrecios[n]:sug;
    var gan=pr-ct, mg=pr?Math.round(gan/pr*100):0;
    return '<tr><td><b>Combo x'+n+'</b></td><td>'+n+'</td><td class="money">'+_fclp(cp)+'</td><td class="money">'+_fclp(flC)+'</td><td class="money" style="color:#b06a00">'+_fclp(caC)+'</td><td class="money" style="font-weight:700">'+_fclp(ct)+'</td>'+
      '<td><input type="number" inputmode="numeric" data-n="'+n+'" value="'+pr+'" oninput="calcPrecio('+n+',this.value)"></td>'+
      '<td class="money" style="font-weight:700;color:'+(gan>=0?'#0f7a52':'#c0392b')+'">'+_fclp(gan)+'</td>'+
      '<td style="color:'+(mg>=0?'#0f7a52':'#c0392b')+'">'+mg+'%</td></tr>';
  }).join('');
}
function calcPrecio(n,v){ window._calcPrecios[n]= (v===''?null:(+v||0));
  var costo=+(document.getElementById('calcCosto')||{}).value||0, flete=+(document.getElementById('calcFlete')||{}).value||0, cac=+(document.getElementById('calcCac')||{}).value||0;
  var carga=_calcCarga();
  var ct=costo*n+Math.round(flete*carga)+Math.round(cac*carga), pr=window._calcPrecios[n]||0, gan=pr-ct, mg=pr?Math.round(gan/pr*100):0;
  var inp=document.querySelector('#calcBody input[data-n="'+n+'"]'); if(!inp) return;
  var tds=inp.closest('tr').querySelectorAll('td');
  tds[7].textContent=_fclp(gan); tds[7].style.color=gan>=0?'#0f7a52':'#c0392b';
  tds[8].textContent=mg+'%'; tds[8].style.color=mg>=0?'#0f7a52':'#c0392b';
}

/* ---------- Creador de anuncios IA (profesional) ---------- */
var AD_PAISES={
  Chile:{num:'+56 9 2000 7288',numId:'966653193207908',pixel:'Jaye Hogar',pixelId:'1249894010361489'},
  Colombia:{num:'+57 314 5021958',numId:'1134195636445391',pixel:'Colombia',pixelId:'963855752775059'},
  Paraguay:{num:'+595 975 357165',numId:'1114986368370031',pixel:'JAYE PARAGUAY',pixelId:'2162367424167882'}
};
var AD_PAGE={nombre:'Jaye Group',id:'1021271641058424'};
var AD_NUMS=[{id:'966653193207908',label:'🇨🇱 +56 9 2000 7288 (Chile)'},{id:'1134195636445391',label:'🇨🇴 +57 314 5021958 (Colombia)'},{id:'1114986368370031',label:'🇵🇾 +595 975 357165 (Paraguay)'}];
var AD_PIXELS=[{id:'1249894010361489',label:'Jaye Hogar (Chile)'},{id:'963855752775059',label:'Colombia'},{id:'2162367424167882',label:'JAYE PARAGUAY'},{id:'1503126321234302',label:'GUATEMALA'},{id:'966394032414530',label:'JAYE STORE'}];
var AD_COUNTRIES='Afganistán,Albania,Alemania,Andorra,Angola,Arabia Saudita,Argelia,Argentina,Armenia,Australia,Austria,Bélgica,Bolivia,Brasil,Bulgaria,Canadá,Chile,China,Chipre,Colombia,Corea del Sur,Costa Rica,Croacia,Cuba,Dinamarca,Ecuador,Egipto,El Salvador,Emiratos Árabes Unidos,Eslovaquia,Eslovenia,España,Estados Unidos,Estonia,Filipinas,Finlandia,Francia,Grecia,Guatemala,Honduras,Hungría,India,Indonesia,Irlanda,Israel,Italia,Japón,Letonia,Lituania,Luxemburgo,Malasia,Marruecos,México,Nicaragua,Nigeria,Noruega,Nueva Zelanda,Países Bajos,Panamá,Paraguay,Perú,Polonia,Portugal,Puerto Rico,Reino Unido,República Checa,República Dominicana,Rumania,Rusia,Singapur,Sudáfrica,Suecia,Suiza,Tailandia,Turquía,Ucrania,Uruguay,Venezuela,Vietnam'.split(',');
var AD_PRODUCTS=['DRAINPRO','Shilajit Ultra',"NAD+ Men's Complex"];
var AD_CTAS_ALL=[{v:'WHATSAPP_MESSAGE',t:'Enviar mensaje (WhatsApp)'},{v:'MESSAGE_PAGE',t:'Enviar mensaje'},{v:'SHOP_NOW',t:'Comprar'},{v:'ORDER_NOW',t:'Pedir ahora'},{v:'LEARN_MORE',t:'Más información'},{v:'SIGN_UP',t:'Registrarte'},{v:'SUBSCRIBE',t:'Suscribirte'},{v:'GET_OFFER',t:'Conseguir oferta'},{v:'GET_QUOTE',t:'Solicitar presupuesto'},{v:'CONTACT_US',t:'Contáctanos'},{v:'APPLY_NOW',t:'Solicitar ahora'},{v:'DOWNLOAD',t:'Descargar'},{v:'BOOK_TRAVEL',t:'Reservar'},{v:'DONATE_NOW',t:'Donar'},{v:'WATCH_MORE',t:'Ver más'},{v:'LISTEN_NOW',t:'Escuchar ahora'},{v:'CALL_NOW',t:'Llamar ahora'},{v:'GET_DIRECTIONS',t:'Cómo llegar'},{v:'SEE_MENU',t:'Ver menú'},{v:'BUY_TICKETS',t:'Comprar entradas'},{v:'GET_SHOWTIMES',t:'Ver horarios'},{v:'REQUEST_TIME',t:'Solicitar hora'},{v:'SAVE',t:'Guardar'},{v:'NO_BUTTON',t:'Sin botón'}];
var AD_PAGEPIC='https://graph.facebook.com/'+AD_PAGE.id+'/picture?type=square&width=96&height=96';
var _adAds=[]; var _adCopyPool=null;
function adCtaUpd(){ var s=document.getElementById('adCta'); if(!s) return; var cur=s.value; if(!s.children.length) s.innerHTML=AD_CTAS_ALL.map(function(c){return '<option value="'+c.v+'">'+c.t+'</option>';}).join(''); if(cur){ s.value=cur; } else { s.value=(_adDest==='whatsapp'?'WHATSAPP_MESSAGE':'SHOP_NOW'); } }
function adCtaLabel(v){ if(!v) return ''; for(var k=0;k<AD_CTAS_ALL.length;k++){ if(AD_CTAS_ALL[k].v===v) return AD_CTAS_ALL[k].t; } return v; }
function adFill(){
  var pl=document.getElementById('adPaisList'); if(pl&&!pl.children.length) pl.innerHTML=AD_COUNTRIES.map(function(c){return '<option value="'+c+'">';}).join('');
  var prl=document.getElementById('adProdList'); if(prl&&!prl.children.length) prl.innerHTML=AD_PRODUCTS.map(function(c){return '<option value="'+c+'">';}).join('');
  var ns=document.getElementById('adNum'); if(ns&&!ns.children.length) ns.innerHTML=AD_NUMS.map(function(n){return '<option value="'+n.id+'">'+n.label+'</option>';}).join('');
  var px=document.getElementById('adPixel'); if(px&&!px.children.length) px.innerHTML=AD_PIXELS.map(function(p){return '<option value="'+p.id+'">'+p.label+'</option>';}).join('');
}
var _adFiles=[]; var _adDest='whatsapp';
function waSvg(color,size){ size=size||15; return '<svg viewBox="0 0 24 24" width="'+size+'" height="'+size+'" fill="'+(color||'currentColor')+'" style="flex-shrink:0;vertical-align:-2px" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'; }
function adChip(t){ return '<span style="background:var(--surface-2);border:1px solid var(--border);border-radius:999px;padding:4px 11px;color:var(--ink-2)">'+t+'</span>'; }
function adPaisUpd(){
  var pais=(document.getElementById('adPais')||{}).value||'';
  var def=AD_PAISES[pais];
  if(def){ var ns=document.getElementById('adNum'); if(ns) ns.value=def.numId; var px=document.getElementById('adPixel'); if(px) px.value=def.pixelId; }
  var a=document.getElementById('adAuto'); if(a) a.innerHTML=adChip('📄 Página: '+AD_PAGE.nombre)+adChip('💡 Elige número y pixel arriba (puedes cambiarlos)');
  adNombreSug();
}
function adNombreSug(){
  var nom=document.getElementById('adNombre'); if(!nom||nom.dataset.edit) return;
  var pais=(document.getElementById('adPais')||{}).value||'Chile';
  var prod=(document.getElementById('adProd')||{}).value||'';
  var d=new Date(); var f=(''+d.getDate()).padStart(2,'0')+'-'+(''+(d.getMonth()+1)).padStart(2,'0');
  nom.value=pais+' · '+prod+' · '+f;
}
function adDestUpd(){ var w=document.getElementById('adLinkWrap'); if(w) w.style.display=(_adDest==='link')?'':'none'; var nw=document.getElementById('adNumWrap'); if(nw) nw.style.display=(_adDest==='whatsapp')?'':'none'; adCtaUpd(); if(_adAds.length) renderGaleria(); }
function adSugPresup(){ document.getElementById('adPresup').value=50000; if(typeof toast==='function')toast('Sugerido: 50.000 COP/día para empezar y que Meta aprenda'); }
var _adGeos=[]; var _geoTimer=null;
function adGeoBuscar(){
  clearTimeout(_geoTimer);
  var q=document.getElementById('adUbic').value.trim(); var sug=document.getElementById('adGeoSug');
  if(q.length<2){ sug.style.display='none'; sug.innerHTML=''; return; }
  _geoTimer=setTimeout(function(){
    var pais=(document.getElementById('adPais')||{}).value||'';
    sug.style.display='block'; sug.innerHTML='<div style="padding:8px 11px;color:#8a93a0;font-size:12px">Buscando…</div>';
    fetch(URL_BUSCAGEO+'?q='+encodeURIComponent(q)+'&pais='+encodeURIComponent(pais)).then(function(r){return r.json();}).then(function(j){
      var arr=(j&&j.data)||[];
      if(!arr.length){ sug.innerHTML='<div style="padding:8px 11px;color:#8a93a0;font-size:12px">Sin resultados.</div>'; return; }
      sug.innerHTML=arr.map(function(x){ return '<div class="adGeoItem" data-k="'+x.key+'" data-n="'+String(x.name).replace(/"/g,'&quot;')+'" style="padding:8px 11px;cursor:pointer;font-size:13px;border-bottom:1px solid var(--border);color:var(--ink)">'+String(x.name).replace(/</g,'&lt;')+' <span style="color:#8a93a0;font-size:11px">'+(x.type==='city'?'ciudad':'región')+'</span></div>'; }).join('');
      [].slice.call(sug.querySelectorAll('.adGeoItem')).forEach(function(it){ it.addEventListener('click',function(){ adGeoAdd(it.dataset.k,it.dataset.n); }); });
    }).catch(function(){ sug.innerHTML='<div style="padding:8px 11px;color:#8a93a0;font-size:12px">No se pudo buscar (activa "Buscar Geo Meta" en n8n).</div>'; });
  },350);
}
function adGeoAdd(key,name){ if(!_adGeos.some(function(g){return g.key===key;})) _adGeos.push({key:key,name:name}); document.getElementById('adUbic').value=''; document.getElementById('adGeoSug').style.display='none'; adGeoRender(); }
function adGeoDel(key){ _adGeos=_adGeos.filter(function(g){return String(g.key)!==String(key);}); adGeoRender(); }
function adGeoRender(){
  var box=document.getElementById('adGeoChips'); if(!box) return;
  if(!_adGeos.length){ box.innerHTML='<span style="font-size:11.5px;color:#8a93a0">Vacío = todo el país</span>'; return; }
  box.innerHTML=_adGeos.map(function(g){ return '<span style="display:inline-flex;align-items:center;gap:5px;background:var(--surface-2);border:1px solid var(--border);border-radius:999px;padding:3px 4px 3px 10px;font-size:12px;color:var(--ink)">'+String(g.name).replace(/</g,'&lt;')+'<button type="button" onclick="adGeoDel(\''+g.key+'\')" style="border:0;background:none;color:#8a93a0;cursor:pointer;font-size:15px;line-height:1;padding:0 3px">×</button></span>'; }).join('');
}
function adFilePick(){
  var sel=[].slice.call((document.getElementById('adFile')||{}).files||[]);
  sel.forEach(function(f){ if(!_adFiles.some(function(g){return g.name===f.name&&g.size===f.size;})) _adFiles.push(f); });
  var inp=document.getElementById('adFile'); if(inp) inp.value='';
  adFileRender();
}
function adFileDel(i){ _adFiles.splice(i,1); adFileRender(); }
function adDragOver(e){ e.preventDefault(); var z=document.getElementById('adDropZone'); if(z) z.style.background='var(--surface)'; }
function adDragLeave(e){ var z=document.getElementById('adDropZone'); if(z) z.style.background='var(--surface-2)'; }
function adDrop(e){ e.preventDefault(); adDragLeave(e); var fs=(e.dataTransfer&&e.dataTransfer.files)?[].slice.call(e.dataTransfer.files):[]; fs.forEach(function(f){ if(/image|video/.test(f.type) && !_adFiles.some(function(g){return g.name===f.name&&g.size===f.size;})) _adFiles.push(f); }); adFileRender(); }
function adFileRender(){
  var nImg=_adFiles.filter(function(f){return /image/.test(f.type);}).length, nVid=_adFiles.filter(function(f){return /video/.test(f.type);}).length;
  var fn=document.getElementById('adFileName'); if(fn) fn.textContent='';
  var tip=document.getElementById('adCreaTip'); if(tip) tip.textContent=_adFiles.length?('('+nVid+' video, '+nImg+' imagen) → '+_adFiles.length+' anuncios'):'La IA recomienda 4-6 creativos (cada uno = un anuncio)';
  var list=document.getElementById('adFileList');
  if(list) list.innerHTML=_adFiles.map(function(f,i){ return '<span style="display:inline-flex;align-items:center;gap:6px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:4px 5px 4px 9px;font-size:12px;color:var(--ink);margin:4px 5px 0 0">'+(/video/.test(f.type)?'🎬':'🖼️')+' '+esc2(f.name).slice(0,26)+'<button type="button" onclick="adFileDel('+i+')" title="Quitar" style="border:0;background:none;color:#8a93a0;cursor:pointer;font-size:15px;line-height:1;padding:0 3px">×</button></span>'; }).join('');
}
function pick(arr,i){ if(!arr||!arr.length) return ''; return arr[i%arr.length]; }
function win(arr,start,n){ if(!arr||!arr.length) return []; var o=[]; for(var k=0;k<Math.min(n,arr.length);k++) o.push(arr[(start+k)%arr.length]); return o; }
function generarAnuncios(){
  if(!_adFiles.length){ if(typeof toast==='function')toast('Sube al menos un video o imagen'); return; }
  var prod=document.getElementById('adProd').value, desc=document.getElementById('adDesc').value.trim(), pais=document.getElementById('adPais').value, link=(document.getElementById('adLinkProd')||{}).value||'', estudio=(document.getElementById('adEstudio')||{}).value||'';
  if(_adTarget){ prod=_adTarget.nombre; pais=_adTarget.pais||pais; estudio=(_adTarget.copy||'')+' '+estudio; link=''; }
  var btn=document.getElementById('adGenBtn'); var old=btn.textContent; btn.disabled=true; btn.textContent='Mirando creativos… 👀';
  var panel=document.getElementById('adGaleriaPanel'); panel.style.display='block';
  document.getElementById('adGaleria').innerHTML='<div class="vacio" style="grid-column:1/-1">La IA está mirando cada imagen/video y escribiendo el copy de cada uno… 👀✍️</div>';
  document.getElementById('adMontaMsg').innerHTML='';
  // un copy POR creativo: la IA VE la imagen (o un fotograma del video) y escribe el copy que coincide con ESE visual
  _adAds=_adFiles.map(function(){ return { textos:['…'], titulares:[''], descripciones:[''], cargando:true }; });
  renderGaleria();
  Promise.all(_adFiles.map(function(f,i){
    return _adVisualImg(f).then(function(img){
      return fetch(URL_GENCOPY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({producto:prod,descripcion:desc,copy_actual:'',pais:pais,link:link,estudio:estudio,img:img})})
        .then(function(r){return r.json();})
        .then(function(j){ if(j&&j.textos&&j.textos.length){ _adAds[i]={ textos:win(j.textos,0,3), titulares:win(j.titulares,0,3), descripciones:win(j.descripciones,0,3) }; } else { _adAds[i]={ textos:['(no se pudo, dale 🔄)'], titulares:[''], descripciones:[''] }; } renderGaleria(); })
        .catch(function(){ _adAds[i]={ textos:['(error, dale 🔄)'], titulares:[''], descripciones:[''] }; renderGaleria(); });
    });
  })).then(function(){ btn.disabled=false; btn.textContent=old; renderGaleria(); });
}
function renderGaleria(){
  var g=document.getElementById('adGaleria'); if(!g) return;
  if(!_adAds.length){ g.innerHTML='<div class="vacio" style="grid-column:1/-1">Sin anuncios. Sube creativos y dale "Generar anuncios".</div>'; return; }
  var destino=_adDest;
  var ctaEl=document.getElementById('adCta'); var ctaTxt=(ctaEl&&ctaEl.selectedIndex>=0)?ctaEl.options[ctaEl.selectedIndex].text:'Más información';
  if(_adTarget&&_adTarget.cta) ctaTxt=adCtaLabel(_adTarget.cta)||ctaTxt;
  var dom= destino==='whatsapp' ? 'Mensaje de WhatsApp' : ((document.getElementById('adLink').value||'jaye-group.com').replace(/^https?:\/\//,'').split('/')[0]);
  g.innerHTML=_adAds.map(function(ad,i){
    var f=_adFiles[i]; var crea;
    if(f && /image/.test(f.type)) crea='<img src="'+URL.createObjectURL(f)+'" style="width:100%;display:block;aspect-ratio:1/1;object-fit:cover">';
    else if(f && /video/.test(f.type)) crea='<video src="'+URL.createObjectURL(f)+'" controls muted playsinline preload="metadata" style="width:100%;height:auto;display:block;background:#000"></video>';
    else crea='<div style="aspect-ratio:1/1;background:var(--surface-2);display:flex;align-items:center;justify-content:center;color:#8a93a0;font-size:12px">creativo</div>';
    var ctaBtn= destino==='whatsapp' ? (waSvg('#25D366',13)+' '+esc2(ctaTxt)) : esc2(ctaTxt);
    var variantes='<details style="border-top:1px solid var(--border)"><summary style="padding:6px 10px;font-size:10.5px;color:#8a93a0;cursor:pointer">📋 Ver los 3 textos · 3 títulos · 3 descripciones (Meta los rota)</summary>'
      +'<div style="padding:2px 10px 10px;font-size:11px;color:var(--ink-2)">'
      +'<div style="font-weight:700;color:var(--ink);margin:6px 0 2px">Textos</div>'+(ad.textos||[]).map(function(t,k){return '<div style="margin-bottom:4px;white-space:pre-wrap;border-left:2px solid var(--border);padding-left:7px">'+(k+1)+'. '+esc2(t)+'</div>';}).join('')
      +'<div style="font-weight:700;color:var(--ink);margin:8px 0 2px">Títulos</div>'+(ad.titulares||[]).map(function(t,k){return '<div style="margin-bottom:4px;border-left:2px solid var(--border);padding-left:7px">'+(k+1)+'. '+esc2(t)+'</div>';}).join('')
      +'<div style="font-weight:700;color:var(--ink);margin:8px 0 2px">Descripciones</div>'+(ad.descripciones||[]).map(function(t,k){return '<div style="margin-bottom:4px;border-left:2px solid var(--border);padding-left:7px">'+(k+1)+'. '+esc2(t)+'</div>';}).join('')
      +'</div></details>';
    return '<div style="border:1px solid var(--border);border-radius:12px;overflow:hidden;background:var(--surface)">'
      +'<div style="display:flex;align-items:center;gap:7px;padding:8px 10px">'
        +'<div style="position:relative;width:30px;height:30px;border-radius:50%;background:#16232e;color:#6cc24a;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;overflow:hidden;flex-shrink:0">JG<img src="'+AD_PAGEPIC+'" onerror="this.remove()" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div>'
        +'<div style="line-height:1.15;min-width:0"><div style="font-weight:700;font-size:12px;color:var(--ink)">Jaye Group</div><div style="font-size:10px;color:#8a93a0">Patrocinado</div></div>'
        +'<div style="margin-left:auto;display:flex;gap:4px;flex-shrink:0">'
          +'<button type="button" onclick="adAdRegen('+i+')" title="Generar copy nuevo" style="border:1px solid var(--border);background:var(--surface-2);border-radius:7px;width:27px;height:27px;cursor:pointer;font-size:12px">🔄</button>'
          +'<button type="button" onclick="adAdDel('+i+')" title="Quitar anuncio" style="border:1px solid var(--border);background:var(--surface-2);border-radius:7px;width:27px;height:27px;cursor:pointer;font-size:15px;line-height:1;color:#c0392b">×</button>'
        +'</div></div>'
      +'<div style="padding:0 10px 8px;font-size:12px;line-height:1.45;color:var(--ink);white-space:pre-wrap">'+esc2((ad.textos&&ad.textos[0])||'')+'</div>'
      +crea
      +'<div style="display:flex;align-items:center;gap:8px;padding:9px 10px;background:var(--surface-2)">'
        +'<div style="min-width:0;flex:1"><div style="font-size:9.5px;color:#8a93a0;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc2(dom)+'</div>'
        +'<div style="font-weight:700;font-size:12px;color:var(--ink);line-height:1.3">'+esc2((ad.titulares&&ad.titulares[0])||'')+'</div>'
        +'<div style="font-size:10.5px;color:#8a93a0;line-height:1.3">'+esc2((ad.descripciones&&ad.descripciones[0])||'')+'</div></div>'
        +'<button type="button" style="display:inline-flex;align-items:center;gap:4px;background:#e7f0ff;color:#1b74e4;border:0;border-radius:7px;padding:7px 10px;font-weight:700;font-size:11.5px;white-space:nowrap;cursor:default">'+ctaBtn+'</button>'
      +'</div>'+variantes+'</div>';
  }).join('');
}
function adAdDel(i){ _adAds.splice(i,1); _adFiles.splice(i,1); adFileRender(); renderGaleria(); }
function adAdRegen(i){
  var prod=document.getElementById('adProd').value, desc=document.getElementById('adDesc').value.trim(), pais=document.getElementById('adPais').value, link=(document.getElementById('adLinkProd')||{}).value||'', estudio=(document.getElementById('adEstudio')||{}).value||'';
  if(_adTarget){ prod=_adTarget.nombre; pais=_adTarget.pais||pais; estudio=(_adTarget.copy||'')+' '+estudio; link=''; }
  var f=_adFiles[i];
  if(typeof toast==='function')toast('Mirando el creativo y reescribiendo… 👀');
  _adVisualImg(f).then(function(img){
    return fetch(URL_GENCOPY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({producto:prod,descripcion:desc,copy_actual:'',pais:pais,link:link,estudio:estudio,img:img,variante:true})})
      .then(function(r){return r.json();}).then(function(j){ if(j&&j.textos&&j.textos.length){ _adAds[i]={textos:win(j.textos,0,3),titulares:win(j.titulares,0,3),descripciones:win(j.descripciones,0,3)}; renderGaleria(); if(typeof toast==='function')toast('Copy nuevo ✓'); } else { if(typeof toast==='function')toast('No se pudo, reintenta'); } });
  }).catch(function(){ if(typeof toast==='function')toast('Error'); });
}
function adLimpiar(){
  _adFiles=[]; _adGeos=[]; _adAds=[]; _adCopyPool=null;
  var prod=document.getElementById('adProd'); if(prod) prod.value='DRAINPRO';
  var nom=document.getElementById('adNombre'); if(nom){ nom.value=''; try{ delete nom.dataset.edit; }catch(e){} }
  ['adLink','adDesc','adUbic','adPresup'].forEach(function(id){ var e=document.getElementById(id); if(e) e.value=''; });
  var gp=document.getElementById('adGaleriaPanel'); if(gp) gp.style.display='none';
  var gg=document.getElementById('adGaleria'); if(gg) gg.innerHTML=''; var mm=document.getElementById('adMontaMsg'); if(mm) mm.innerHTML='';
  adFileRender(); adGeoRender(); adNombreSug();
  if(typeof toast==='function')toast('Formulario limpio');
}
function adLzUpd(){ var p=(document.querySelector('input[name="adLz"]:checked')||{}).value; var w=document.getElementById('adLzFechaWrap'); if(w) w.style.display=(p==='programada')?'block':'none'; }
function _adFileB64(f){ return new Promise(function(res){ if(!f){res('');return;} var r=new FileReader(); r.onload=function(){ var s=String(r.result||''); var c=s.indexOf(','); res(c>=0?s.slice(c+1):s); }; r.onerror=function(){res('');}; r.readAsDataURL(f); }); }
// Saca una imagen JPEG (máx ~1024px) del creativo para que la IA lo VEA con Vision: imagen directa, o un fotograma del video. Devuelve {mime,data} o null.
function _adVisualImg(f){
  return new Promise(function(res){
    if(!f){ res(null); return; }
    var url=URL.createObjectURL(f);
    function fromEl(el,w,h){ try{ var max=1024, sc=Math.min(1,max/Math.max(w||max,h||max)); var cw=Math.max(1,Math.round((w||max)*sc)), ch=Math.max(1,Math.round((h||max)*sc)); var cv=document.createElement('canvas'); cv.width=cw; cv.height=ch; cv.getContext('2d').drawImage(el,0,0,cw,ch); var d=cv.toDataURL('image/jpeg',0.82); var ci=d.indexOf(','); res({mime:'image/jpeg',data:ci>=0?d.slice(ci+1):d}); }catch(e){ res(null); } }
    if(/image/.test(f.type)){ var im=new Image(); im.onload=function(){ fromEl(im,im.naturalWidth,im.naturalHeight); URL.revokeObjectURL(url); }; im.onerror=function(){ res(null); URL.revokeObjectURL(url); }; im.src=url; }
    else if(/video/.test(f.type)){ var v=document.createElement('video'); v.muted=true; v.playsInline=true; v.onloadeddata=function(){ var cap=false; var go=function(){ if(cap)return; cap=true; fromEl(v,v.videoWidth,v.videoHeight); URL.revokeObjectURL(url); }; v.onseeked=go; setTimeout(go,2500); try{ v.currentTime=Math.min(1,(v.duration||2)/3)||0.1; }catch(e){ go(); } }; v.onerror=function(){ res(null); URL.revokeObjectURL(url); }; v.src=url; v.load(); }
    else { res(null); URL.revokeObjectURL(url); }
  });
}
// Sube un video en binario a /subir-video (streaming, no revienta memoria de n8n) y devuelve el video_id de Meta
function _adSubirVideo(f){ return new Promise(function(res){ if(!f){res('');return;} if(f._vid){res(f._vid);return;} var fd=new FormData(); fd.append('data', f, (f.name||'v.mp4')); fetch(URL_SUBVID,{method:'POST',body:fd}).then(function(r){return r.json();}).then(function(j){ var v=(j&&j.video_id)||''; if(v) f._vid=v; res(v); }).catch(function(){ res(''); }); }); }
function aprobarMontar(){
  if(!_adAds.length){ if(typeof toast==='function')toast('Genera los anuncios primero'); return; }
  var destino=_adDest;
  if(destino==='link' && !document.getElementById('adLink').value.trim() && !_adTarget){ if(typeof toast==='function')toast('Falta la URL de la página'); return; }
  var pais=document.getElementById('adPais').value;
  var numEl=document.getElementById('adNum'), pxEl=document.getElementById('adPixel'), ctaEl=document.getElementById('adCta');
  var numTxt=(destino==='whatsapp'&&numEl&&numEl.selectedIndex>=0)?numEl.options[numEl.selectedIndex].text:'';
  var lzModo=(document.querySelector('input[name="adLz"]:checked')||{}).value||'pausada';
  var startTime='';
  if(lzModo==='programada'){ var dt=(document.getElementById('adLzFecha')||{}).value; if(!dt){ if(typeof toast==='function')toast('Elige la fecha y hora'); return; } try{ startTime=new Date(dt).toISOString(); }catch(e){} }
  var ccMap={Chile:'CL',Colombia:'CO',Paraguay:'PY','México':'MX',Mexico:'MX','Perú':'PE',Peru:'PE',Ecuador:'EC',Argentina:'AR',Guatemala:'GT','España':'ES',Espana:'ES'};
  var cc=ccMap[pais]||'CL';
  var msg=document.getElementById('adMontaMsg'), btn=document.getElementById('adMontarBtn');
  if(btn){ btn.disabled=true; btn.textContent='Montando en Meta…'; }
  if(msg) msg.innerHTML='Subiendo a Meta… (puede tardar unos segundos)';
  if(msg) msg.innerHTML='Subiendo creativos a Meta… (los videos pueden tardar un poco más)';
  Promise.all(_adAds.map(function(a,i){
    var f=_adFiles[i];
    var isVid=f && /^video\//.test(f.type||'');
    if(isVid){
      return _adSubirVideo(f).then(function(vid){ return vid?{ video_id:vid, textos:a.textos, titulares:a.titulares, descripciones:a.descripciones }:null; });
    }
    return _adFileB64(f).then(function(d){ return d?{ mime:(f?f.type:''), data:d, textos:a.textos, titulares:a.titulares, descripciones:a.descripciones }:null; });
  })).then(function(arr){
    var anuncios=arr.filter(function(an){ return an && (an.data || an.video_id); });
    if(!anuncios.length){ throw new Error('sin creativos (¿el video no terminó de subir?)'); }
    var payload={ modo:(_adTarget?'refresco':'nueva'), pais:pais, cc:cc, producto:document.getElementById('adProd').value, nombre:(document.getElementById('adNombre').value||(_adTarget?_adTarget.nombre:'Campaña')),
      destino:destino, link:document.getElementById('adLink').value, numero:numTxt, pixelId:(pxEl?pxEl.value:''), cta:(ctaEl?ctaEl.value:''), pageId:AD_PAGE.id,
      presupuesto:parseInt(document.getElementById('adPresup').value||50000,10),
      geos:_adGeos.map(function(g){ return {key:g.key, type:g.type}; }),
      anuncios:anuncios,
      lanzamiento:{ modo:lzModo, start_time:startTime },
      refrescar:(_adTarget?{campaignId:_adTarget.id, adsetId:(_adTarget.adsetId||'')}:null) };
    return fetch(URL_MONTAR,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  }).then(function(r){ return r.json(); }).then(function(res){
    if(btn){ btn.disabled=false; btn.textContent='✅ Aprobar y montar'; }
    if(res && res.ok){
      var est = res.estado==='ACTIVE' ? (res.programado?('PROGRAMADA para '+new Date(res.programado).toLocaleString('es-CO')):'ACTIVA'):'PAUSADA';
      msg.innerHTML='✅ <b>Montada en Meta — '+est+'.</b><br>'+(res.ads?res.ads.length:0)+' anuncio(s) · campaña '+esc2(res.campaignId||'')+'.'+((res.errores&&res.errores.length)?('<br><span style="color:#c0392b">Avisos: '+esc2(res.errores.join(' · '))+'</span>'):'');
      if(typeof toast==='function')toast('Montada en Meta ✓');
    } else {
      msg.innerHTML='<span style="color:#c0392b">No se pudo montar: '+esc2((res&&res.errores&&res.errores.join(' · '))||'enciende "Montar Campaña" en n8n')+'</span>';
      if(typeof toast==='function')toast('Error al montar');
    }
  }).catch(function(){ if(btn){ btn.disabled=false; btn.textContent='✅ Aprobar y montar'; } if(msg) msg.innerHTML='<span style="color:#c0392b">No se pudo conectar (enciende \"Montar Campaña\" en n8n).</span>'; });
}
function esc2(s){ return String(s||'').replace(/</g,'&lt;'); }
var _adCamps=[]; var _adCampFiltro='ACTIVE'; var _adTarget=null;
function cargarCampanas(){
  var box=document.getElementById('adCampList'); box.innerHTML='<div class="vacio">Cargando campañas de Meta… (puede tardar)</div>';
  fetch(BASE+'/leer-campanas').then(function(r){return r.json();}).then(function(arr){
    if(!arr||!arr.length||arr[0].vacio){ box.innerHTML='<div class="vacio">No hay campañas (o "Leer Campañas Meta" no está encendido en n8n).</div>'; return; }
    _adCamps=arr; renderCampList();
  }).catch(function(){ box.innerHTML='<div class="vacio">No se pudo cargar (enciende "Leer Campañas Meta" en n8n).</div>'; });
}
function renderCampList(){
  var box=document.getElementById('adCampList'); if(!box) return;
  if(!_adCamps.length){ box.innerHTML='<div class="vacio">Dale "Cargar campañas".</div>'; return; }
  var f=_adCampFiltro;
  var list=_adCamps.filter(function(c){ if(f==='ALL') return true; if(f==='ACTIVE') return c.estado==='ACTIVE'; return c.estado!=='ACTIVE'; });
  if(!list.length){ box.innerHTML='<div class="vacio">No hay campañas '+(f==='ACTIVE'?'activas':(f==='PAUSED'?'pausadas':''))+'.</div>'; return; }
  box.innerHTML=list.map(function(c){ var i=_adCamps.indexOf(c);
    return '<div style="border:1px solid var(--border);border-radius:10px;margin-bottom:9px;overflow:hidden">'
      +'<div onclick="adToggleDetalle('+i+')" style="padding:11px 13px;cursor:pointer">'
        +'<div style="display:flex;align-items:center;gap:8px"><div style="font-weight:700;color:var(--ink);flex:1;min-width:0">'+esc2(c.nombre)+' <span style="font-size:11px;color:'+(c.estado==='ACTIVE'?'#1f9d55':'#8a93a0')+'">· '+esc2(c.estado)+'</span></div>'
        +'<button type="button" onclick="event.stopPropagation();adAsesor('+i+')" style="font-size:11.5px;padding:6px 11px;border:1px solid var(--border);border-radius:8px;background:var(--surface-2);color:var(--ink);cursor:pointer;font-weight:700;white-space:nowrap">💡 ¿Qué hago?</button></div>'
        +'<div style="font-size:12px;color:var(--ink-2);margin-top:3px">Gasto 14d: <b>'+Number(c.gasto||0).toLocaleString('es-CO')+' COP</b> · '+(c.num_ads||0)+' anuncios · <span style="color:#8a93a0">Meta dice: '+(c.resultados||0)+' (inflado)</span></div>'
        +'<div style="font-size:12px;margin-top:5px;display:flex;gap:9px;flex-wrap:wrap;align-items:center">'
          +'<span style="background:#e8f6ec;color:#1f7a3d;border-radius:6px;padding:2px 7px;font-weight:700">✅ '+(c.ventas_reales||0)+' ventas reales <span style="font-weight:400;opacity:.8">'+(c.canal==='whatsapp'?'(bot Carlos)':'(Dropi)')+'</span></span>'
          +(c.ventas_reales? ('<span style="color:var(--ink)">Costo real/venta: <b>'+Number(c.costo_real||0).toLocaleString('es-CO')+' COP</b></span>'+'<span style="color:'+((c.roas_real||0)>=1.5?'#1f7a3d':((c.roas_real||0)>=1?'#b8860b':'#c0392b'))+';font-weight:800">ROAS real: '+(c.roas_real||0)+'x</span>') : '<span style="color:#c0392b;font-weight:700">sin ventas reales aún</span>')
          +(c.fuente==='exacto'?'<span style="background:#16232e;color:#6cc24a;border-radius:6px;padding:2px 7px;font-size:10.5px;font-weight:700" title="Cada venta atada a esta campaña por el teléfono">✓ exacto</span>':'<span style="color:#8a93a0;font-size:10.5px" title="Estimado por producto+fecha; será exacto cuando la campaña reciba clics con seguimiento">≈ estimado</span>')
          +(c.ventas_desde?'<span style="color:#8a93a0;font-size:11px">(desde '+esc2(c.ventas_desde)+')</span>':'')
        +'</div>'
        +(c.compartida?'<div style="font-size:11px;color:#b8860b;margin-top:3px">⚠️ Hay varias campañas activas de este producto: este número es del producto, no se puede separar por campaña sin seguimiento por enlace.</div>':'')
        +'<div style="font-size:11px;color:#8a93a0;margin-top:3px">clic para ver detalle ▾</div>'
        +'<div id="adRec'+i+'" style="display:none"></div>'
      +'</div>'
      +'<div id="adDet'+i+'" style="display:none;border-top:1px solid var(--border);padding:10px 13px;background:var(--surface-2)"></div>'
      +'</div>';
  }).join('');
}
function adToggleDetalle(i){
  var det=document.getElementById('adDet'+i); if(!det) return;
  if(det.style.display!=='none'){ det.style.display='none'; return; }
  det.style.display='block'; det.innerHTML='<div style="color:#8a93a0;font-size:12px">Cargando anuncios…</div>';
  var c=_adCamps[i];
  fetch(URL_DETALLE+'?id='+encodeURIComponent(c.id)).then(function(r){return r.json();}).then(function(d){
    if(!d||d.error||!d.anuncios){ det.innerHTML='<div style="color:#8a93a0;font-size:12px">No se pudo cargar el detalle (enciende "Detalle Campaña" en n8n).</div>'; return; }
    c._det=d;
    var dInfo=(d.destino?(' · Dirigido a: <b>'+esc2(d.destino)+'</b>'):'')+(d.cta?(' · Botón: <b>'+esc2(adCtaLabel(d.cta))+'</b>'):'');
    var head='<div style="font-size:12px;color:var(--ink-2);margin-bottom:8px">Objetivo: '+esc2(d.objetivo||'')+' · Presupuesto: '+(d.presupuesto?(Number(d.presupuesto).toLocaleString('es-CO')+' COP/día'):'(en el conjunto)')+' · '+(d.num_ads||0)+' anuncios ('+(d.num_activos||0)+' activos)'+dInfo+'</div>';
    var acciones='<div style="display:flex;gap:6px;flex-wrap:wrap;margin:4px 0 10px">'
      +'<button type="button" onclick="adRefrescar('+i+')" style="font-size:12px;padding:8px 13px;border:0;border-radius:8px;background:var(--brand,#3056c9);color:#fff;cursor:pointer;font-weight:700">♻️ Refrescar / Agregar anuncios</button>'
      +'<button type="button" onclick="adPausar('+i+')" style="font-size:12px;padding:8px 13px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--ink-2);cursor:pointer;font-weight:700">⏸️ Pausar</button></div>';
    var ads=(d.anuncios||[]).map(function(a){
      var th=a.thumb?('<img src="'+a.thumb+'" onerror="this.style.display=\'none\'" style="width:46px;height:46px;border-radius:7px;object-fit:cover;flex-shrink:0">'):'<div style="width:46px;height:46px;border-radius:7px;background:var(--surface);flex-shrink:0"></div>';
      return '<div style="display:flex;gap:9px;align-items:flex-start;background:var(--surface);border:1px solid var(--border);border-radius:9px;padding:8px;margin-bottom:6px">'+th
        +'<div style="min-width:0;flex:1"><div style="font-size:12px;font-weight:700;color:var(--ink)">'+esc2(a.nombre||'anuncio')+' <span style="font-size:10px;color:'+(a.estado==='ACTIVE'?'#1f9d55':'#8a93a0')+'">· '+esc2(a.estado)+'</span></div>'
        +'<div style="font-size:11px;color:var(--ink-2)">Gasto: '+Number(a.gasto||0).toLocaleString('es-CO')+' COP · Result: '+(a.resultados||0)+'</div>'
        +'<div style="font-size:11px;color:#8a93a0;margin-top:2px;max-height:30px;overflow:hidden">'+esc2(String(a.copy||'').slice(0,90))+'</div></div></div>';
    }).join('') || '<div style="color:#8a93a0;font-size:12px">Sin anuncios.</div>';
    det.innerHTML=head+acciones+'<div style="font-weight:700;font-size:12px;color:var(--ink);margin-bottom:5px">Anuncios:</div>'+ads;
  }).catch(function(){ det.innerHTML='<div style="color:#8a93a0;font-size:12px">No se pudo cargar (enciende "Detalle Campaña" en n8n).</div>'; });
}
function adGuessPais(nombre){ var P=['Colombia','Paraguay','Ecuador','Argentina','Guatemala','España','México','Mexico','Perú','Peru','Chile']; var n=(nombre||'').toLowerCase(); for(var k=0;k<P.length;k++){ if(n.indexOf(P[k].toLowerCase())>=0){ var v=P[k]; if(v==='Mexico')v='México'; if(v==='Peru')v='Perú'; return v; } } return 'Chile'; }
function adProdKeyword(nombre){ var n=(nombre||'').toLowerCase();
  if(n.indexOf('nad')>=0) return 'nad';
  if(n.indexOf('shilajit')>=0) return 'shilajit';
  if(n.indexOf('drain')>=0||n.indexOf('limpiador')>=0||n.indexOf('tornado')>=0||n.indexOf('polvo')>=0) return 'limpiador';
  if(n.indexOf('magnesio')>=0) return 'magnesio';
  if(n.indexOf('colag')>=0||n.indexOf('colág')>=0) return 'colag';
  if(n.indexOf('creatina')>=0) return 'creatina';
  if(n.indexOf('lampara')>=0||n.indexOf('lámpara')>=0||n.indexOf('solar')>=0) return 'lampara';
  if(n.indexOf('sellador')>=0) return 'sellador';
  if(n.indexOf('probiot')>=0) return 'probiot';
  if(n.indexOf('crema')>=0) return 'crema';
  var w=n.replace(/[^a-zñ ]/g,' ').split(/\s+/).filter(function(x){ return x.length>3 && ['campaña','campana','whatssap','whatsapp','chile','nueva','prueba','junio','mayo','abril','marzo','video','imagen','imágenes','imagenes','nuevo','nuevos','creativos','original','ventas','sitio'].indexOf(x)<0; });
  return w[0]||(n.split(' ')[0])||'';
}
function adRefrescar(i){
  var c=_adCamps[i]; var det=c._det||{};
  var _detLink=(det.link||'').replace('jamesoterof-ship-it.github.io/drainpro','jayegroupchile.github.io/drainpro');
  _adTarget={id:c.id,nombre:c.nombre,copy:c.copy||'',objetivo:c.objetivo||'',gasto:c.gasto||0,resultados:c.resultados||0,pais:adGuessPais(c.nombre),destino:(det.destino||''),cta:(det.cta||''),link:_detLink};
  _adDest=(det.destino==='Página/Link')?'link':'whatsapp';
  var _lkEl=document.getElementById('adLink'); if(_lkEl) _lkEl.value=_detLink;
  _adFiles=[]; _adAds=[]; _adCopyPool=null;
  document.querySelectorAll('#adModo .minitab').forEach(function(x){x.classList.remove('act');});
  var nb=document.querySelector('#adModo .minitab[data-m="nueva"]'); if(nb) nb.classList.add('act');
  var nu=document.getElementById('adNueva'), ex=document.getElementById('adExistente'); if(nu) nu.style.display=''; if(ex) ex.style.display='none';
  adRefreshMode(true);
  var gp=document.getElementById('adGaleriaPanel'); if(gp) gp.style.display='none';
  adFileRender();
  window.scrollTo({top:0,behavior:'smooth'});
  if(typeof toast==='function')toast('Refrescando: '+c.nombre);
}
function adRefreshMode(on){
  var grid=document.getElementById('adConfigGrid'), auto=document.getElementById('adAuto'), head=document.getElementById('adRefrescarHeader'), tit=document.getElementById('adFormTitulo');
  if(on && _adTarget){
    if(grid) grid.style.display='none'; if(auto) auto.style.display='none'; if(tit) tit.textContent='Refrescar campaña';
    if(head){ head.style.display='block'; head.innerHTML='<div style="background:#e7f0ff;border:1px solid var(--border);border-radius:9px;padding:11px 13px">'
      +'<div style="font-weight:800;color:#1b74e4;font-size:13px">♻️ Refrescando: '+esc2(_adTarget.nombre)+'</div>'
      +'<div style="font-size:12px;color:var(--ink-2);margin-top:3px">Objetivo: '+esc2(_adTarget.objetivo)+' · gasto 14d: '+Number(_adTarget.gasto).toLocaleString('es-CO')+' COP · '+_adTarget.resultados+' resultados · país: '+esc2(_adTarget.pais)+'</div>'
      +'<div style="font-size:12px;color:var(--ink-2);margin-top:3px">Dirigido a: <b>'+esc2(_adTarget.destino||'(según la campaña)')+'</b> · Botón de acción: <b>'+esc2(adCtaLabel(_adTarget.cta)||'(según la campaña)')+'</b></div>'
      +'<div style="font-size:12px;color:var(--ink-2);margin-top:4px">Esta campaña ya tiene su destino, presupuesto y público. Tú solo sube los <b>creativos nuevos</b> → la IA genera los copys (3 de cada) → vista previa → y se agregan a ESTA campaña (pausados).</div>'
      +'<button type="button" onclick="adVolverExistente()" style="margin-top:8px;border:0;background:none;color:#1b74e4;cursor:pointer;font-weight:700;text-decoration:underline;font-size:12.5px">← Volver a campañas</button></div>'; }
  } else {
    if(grid) grid.style.display=''; if(auto) auto.style.display=''; if(tit) tit.textContent='Nueva campaña';
    if(head){ head.style.display='none'; head.innerHTML=''; }
  }
}
function adTargetClear(){ _adTarget=null; adRefreshMode(false); }
function adVolverExistente(){ _adTarget=null; adRefreshMode(false); document.querySelectorAll('#adModo .minitab').forEach(function(x){x.classList.remove('act');}); var eb=document.querySelector('#adModo .minitab[data-m="existente"]'); if(eb) eb.classList.add('act'); var nu=document.getElementById('adNueva'),ex=document.getElementById('adExistente'); if(nu)nu.style.display='none'; if(ex)ex.style.display=''; window.scrollTo({top:0,behavior:'smooth'}); }
function adPausar(i){
  var c=_adCamps[i];
  if(typeof toast==='function')toast('Pausar necesita el permiso de editar de Meta (saldo pendiente)');
  alert('Para pausar "'+c.nombre+'" se necesita el permiso de editar de Meta (está bloqueado por el saldo pendiente). Apenas pagues el saldo, este botón la pausa solo. Por ahora pásala a pausada desde Meta.');
}
document.querySelectorAll('#adCampFiltro .minitab').forEach(function(b){ b.addEventListener('click',function(){ document.querySelectorAll('#adCampFiltro .minitab').forEach(function(x){x.classList.remove('act');}); b.classList.add('act'); _adCampFiltro=b.dataset.f; renderCampList(); }); });
function adAsesor(i){
  var c=_adCamps[i]; if(!c) return;
  var box=document.getElementById('adRec'+i); if(box){ box.style.display='block'; box.innerHTML='<div style="color:#8a93a0;font-size:12px;margin-top:6px">Analizando con IA… 🤔</div>'; }
  var pais=adGuessPais(c.nombre); var producto=adProdKeyword(c.nombre);
  var destino=(c._det&&c._det.destino)||c.destino||'';
  fetch(URL_ASESORCAMP,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({campana:c,pais:pais,producto:producto,destino:destino})})
    .then(function(r){return r.json();}).then(function(j){
      if(box) box.innerHTML='<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:9px;padding:9px 11px;margin-top:7px"><div style="font-weight:800;color:var(--ink);font-size:12.5px">💡 '+esc2(j.titulo||'Recomendación')+'</div><div style="font-size:12px;color:var(--ink);margin-top:3px">'+esc2(j.recomendacion||'')+'</div>'+(j.porque?('<div style="font-size:11px;color:#8a93a0;margin-top:3px">'+esc2(j.porque)+'</div>'):'')+'</div>';
    }).catch(function(){ if(box) box.innerHTML='<div style="color:#8a93a0;font-size:12px;margin-top:6px">No se pudo analizar (enciende "Asesor Campaña" en n8n).</div>'; });
}
document.querySelectorAll('#adModo .minitab').forEach(function(b){ b.addEventListener('click',function(){
  document.querySelectorAll('#adModo .minitab').forEach(function(x){x.classList.remove('act');}); b.classList.add('act');
  document.getElementById('adNueva').style.display=(b.dataset.m==='nueva')?'':'none';
  document.getElementById('adExistente').style.display=(b.dataset.m==='existente')?'':'none';
  if(b.dataset.m==='nueva'){ adTargetClear(); }
}); });
document.querySelectorAll('#adDestSeg .adDestBtn').forEach(function(b){ b.addEventListener('click',function(){
  _adDest=b.dataset.d;
  document.querySelectorAll('#adDestSeg .adDestBtn').forEach(function(x){ x.style.background='var(--surface-2)'; x.style.color='var(--ink)'; x.style.borderColor='var(--border)'; });
  b.style.background='var(--brand,#3056c9)'; b.style.color='#fff'; b.style.borderColor='var(--brand,#3056c9)';
  adDestUpd();
}); });
(function(){ adFill(); var n=document.getElementById('adNombre'); if(n) n.addEventListener('input',function(){n.dataset.edit='1';}); if(document.getElementById('adPais')) adPaisUpd(); adDestUpd(); adFileRender(); adGeoRender(); var cta=document.getElementById('adCta'); if(cta) cta.addEventListener('change',function(){ if(_adAds.length) renderGaleria(); }); })();
