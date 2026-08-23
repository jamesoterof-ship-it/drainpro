/* ============================================================
   CONFIG — MÁSCARA DE PESTAÑAS FLAMENCO MEGA VOLUME · Chile
   Clon del molde NAD+ · paleta dorado/negro de la marca.
   Precios = escalera aprobada que ya usa Camila (23.500/34.900/44.900).
   Backend: webhook n8n propio -> fin_ventas_wa (bot "Camila Web")
   -> panel de aprobación -> Dropi. Sin Apps Script.
   ============================================================ */
window.CONFIG = {
  /* ---- Identidad ---- */
  marca: "Jaye Group",
  producto: "Mascara de Pestañas Flamenco Mega Volume",
  productoCorto: "Flamenco Mega Volume",
  seoTitle: "Máscara Flamenco Mega Volume · Pestañas con volumen real sin grumos | Pago contra entrega Chile",
  seoDesc: "Fibras que alargan y engrosan tus pestañas una a una, sin grumos ni postizas. A prueba de agua, dura todo el día. Envío gratis y pago al recibir en todo Chile.",

  /* ---- Motor de diseño (dorado / negro de la marca) ---- */
  paleta: { pri:"#c9a227", sec:"#e6c65a", acc:"#f5dd8f", priD:"#191204", ink:"#161006" },

  /* ---- País / moneda ---- */
  pais: { nombre:"Chile", cc:"cl", prefijo:"+56", moneda:"CLP", locale:"es-CL" },

  /* ---- Hero ---- */
  heroKicker: "El secreto del volumen sin extensiones",
  heroTitle: 'Pestañas <span class="hl">largas y con volumen</span> desde la primera pasada',
  heroLead: "Fibras que se adhieren a cada pestaña y la alargan de verdad. El cepillo las separa una a una: volumen real, sin grumos, sin postizas y a prueba de agua.",
  heroTag: "Envío gratis a todo Chile",
  badges: ["👁️ Volumen real", "💧 A prueba de agua", "🚚 Pago al recibir"],

  /* ---- Precios / packs (escalera aprobada, la misma de Camila) ---- */
  precioUnidad: 23500,
  packs: [
    { qty:2, price:23500, was:23500, label:"2 unidades", sub:"La promo del anuncio", tag:"MÁS VENDIDO" },
    { qty:4, price:34900, was:47000, label:"4 unidades", sub:"Ahorra 26%", tag:"" },
    { qty:6, price:44900, was:70500, label:"6 unidades", sub:"Ahorra 36%", tag:"MEJOR PRECIO" }
  ],

  /* ---- Imágenes ---- */
  img: {
    logo:    "",
    hero:    "img/hero.webp",
    oferta:  "img/oferta.webp",
    galeria: ["img/c1.webp","img/c2.webp","img/c3.webp","img/c4.webp"],
    packThumb1: "img/unidad.png",
    packThumb2: "img/duo.webp"
  },

  /* ---- Trust strip (4) ---- */
  trust: [
    { em:"🚚", b:"Envío gratis", s:"a todo Chile" },
    { em:"💵", b:"Paga al recibir", s:"contra entrega" },
    { em:"👁️", b:"Volumen real", s:"sin grumos" },
    { em:"⭐", b:"+800 chilenas", s:"la usan a diario" }
  ],

  /* ---- Beneficios (3) ---- */
  benTitle: "Por qué las chilenas la eligen",
  benSub: "No es una máscara más: son fibras que construyen largo y volumen pestaña por pestaña.",
  beneficios: [
    { ic:"👁️", t:"Alarga y engrosa de verdad", d:"Las microfibras se pegan a cada pestaña y la extienden. Efecto pestañas postizas, sin postizas." },
    { ic:"🪮", t:"Cero grumos", d:"El cepillo separa pestaña por pestaña. Nada de bloques ni pestañas pegadas: abanico limpio y definido." },
    { ic:"💧", t:"Aguanta el día entero", d:"A prueba de agua y de humedad. No se corre, no mancha, y de noche se retira fácil con agua tibia." }
  ],

  /* ---- Cómo actúa (intro + 3 pasos) ---- */
  howTitle: "¿Cómo se usa?",
  howIntro: "Tres pasadas y listo. Sin técnica especial, sin extensiones, sin salón.",
  howSteps: [
    { t:"Aplica", d:"Pasa el cepillo desde la raíz hasta la punta, en zigzag suave." },
    { t:"Construye", d:"Segunda pasada: las fibras suman largo y grosor donde tú quieras más." },
    { t:"Define", d:"El cepillo separa cada pestaña. Volumen de abanico que dura todo el día." }
  ],

  /* ---- Oferta ---- */
  offerTitle: "La promo del anuncio: 2 máscaras",
  offerSub: "2 unidades por $23.500, envío gratis y pagas al recibir en tu casa.",
  offerWas: 0,
  offerNew: 23500,

  /* ---- Stats (contadores) ---- */
  statTitle: "Resultados que se notan",
  stats: [
    { em:'<svg viewBox="0 0 24 24"><path d="M12 5c5 0 9 4.5 10 7-1 2.5-5 7-10 7S3 14.5 2 12c1-2.5 5-7 10-7z"/><circle cx="12" cy="12" r="3"/></svg>', valor:94, suf:"%", d:"nota más largo y volumen desde el primer uso." },
    { em:'<svg viewBox="0 0 24 24"><path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/></svg>', valor:91, suf:"%", d:"confirma que no se corre con agua ni humedad." },
    { em:'<svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>', valor:89, suf:"%", d:"dejó las pestañas postizas por esta máscara." },
    { em:'<svg viewBox="0 0 24 24"><path d="M12 3.5l2.6 5.2 5.8.9-4.2 4 1 5.7-5.2-2.7-5.2 2.7 1-5.7-4.2-4 5.8-.9z"/></svg>', valor:96, suf:"%", d:"la recomienda a sus amigas." }
  ],

  /* ---- Comparativa ---- */
  cmpTitle: "¿Qué la hace diferente?",
  comparativa: [
    "Fibras de volumen real — las máscaras comunes solo pintan; esta construye largo pestaña por pestaña.",
    "Cepillo separador profesional: cero grumos, cero pestañas pegadas.",
    "A prueba de agua de verdad: aguanta lluvia, lágrimas y el día completo sin correrse."
  ],

  /* ---- Reseñas ---- */
  revScore: 4.8,
  revSeed: 214,

  /* ---- Garantía ---- */
  garDias: 30,
  garTitle: "Garantía de satisfacción",
  garText: "Si no ves la diferencia en tus pestañas, te devolvemos tu dinero dentro de los primeros 30 días. Sin preguntas.",

  /* ---- FAQ ---- */
  faq: [
    { q:"¿Se hace grumos como otras máscaras?", a:"No. El cepillo está diseñado para separar pestaña por pestaña mientras las fibras construyen volumen. El resultado es un abanico limpio, sin bloques." },
    { q:"¿De verdad es a prueba de agua?", a:"Sí: aguanta humedad, lluvia y lágrimas sin correrse. De noche se retira fácil con agua tibia y tu limpiador de siempre." },
    { q:"¿Sirve para pestañas cortas o ralas?", a:"Es justo para eso: las microfibras se adhieren a cada pestaña y la alargan, así que el efecto se nota más mientras más cortas sean." },
    { q:"¿Hacen envíos a regiones?", a:"Sí, llegamos a todo Chile con envío gratis y pagas cuando recibes tu pedido en la puerta de tu casa." }
  ],

  /* ---- Transportadoras (logos en /img) ---- */
  carriers: ["img/logo-bluexpress.png", "img/logo-starken.png"],

  /* ---- Contacto / footer ---- */
  footTitle: "JAYE GROUP — CHILE",
  footAddr: "Av. Providencia 1208, Oficina 16, Santiago, RM.",
  footMail: "gerencia@jayegroup.com.co",
  whatsapp: "56920007288",

  /* ===========================================================
     BACKEND — webhook propio: el pedido cae a fin_ventas_wa como
     "Camila Web", pasa por el panel de aprobación y se monta en
     Dropi con el mismo circuito de WhatsApp. dropiId 149702.
     =========================================================== */
  dropiId:   149702,
  sheetUrl:  "",
  orderWebhook: "https://n8n-production-8a42.up.railway.app/webhook/pedido-web-pestanas",
  n8nConfirm:"",
  panelUrl:  "",
  pixelId:   "1249894010361489"
};
