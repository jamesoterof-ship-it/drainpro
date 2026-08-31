/* ============================================================
   CONFIG — GEL SELLADOR INVISIBLE JAYSUING 300g · Chile
   Clon exacto del molde de la mascara. Lo unico que cambia es la
   identidad y la paleta: AZUL / BLANCO / GRIS, los colores del propio
   producto. Nada del dorado de la mascara.
   Dropi 144587 · proveedor Meibo (Santiago) · costo 1.700 · stock 1.044
   PRECIO: 6.000 la unidad, fijado por James el 29-08.
   Combo de 2 a 9.990 (James, 29-08): el costo son 3.400 y no paga flete
   aparte cuando viaja como agregado de otro pedido.
   ============================================================ */
window.CONFIG = {
  /* ---- Identidad ---- */
  marca: "Jaye Group",
  producto: "Gel Sellador Invisible Jaysuing 300g",
  productoCorto: "Sellador Invisible",
  seoTitle: "Gel Sellador Invisible 300g · Sella filtraciones y humedad sin que se note | Pago contra entrega Chile",
  seoDesc: "Barrera invisible que repele el agua en concreto, ladrillo, cerámica y madera. Anti UV y antihongos, se aplica con brocha y no altera el color. Envío gratis, pagas al recibir.",

  /* ---- Motor de diseño (dorado / negro de la marca) ---- */
  paleta: { pri:"#10265A", sec:"#1E4A8C", acc:"#A8C6E8", priD:"#08142E", ink:"#0B1220" },

  /* ---- País / moneda ---- */
  pais: { nombre:"Chile", cc:"cl", prefijo:"+56", moneda:"CLP", locale:"es-CL" },

  /* ---- Hero ---- */
  heroKicker: "Protección invisible, resultados duraderos",
  heroTitle: 'Sella la humedad <span class="hl">sin que se note</span>',
  heroLead: "Forma una barrera invisible que repele el agua al instante. No altera el color ni la apariencia: la pared queda igual, pero el agua ya no entra.",
  heroTag: "Envío gratis a todo Chile",
  badges: ["💧 Impermeable", "☀️ Anti UV y antihongos", "🚚 Pago al recibir"],

  /* ---- Precios / packs (escalera aprobada, la misma de Camila) ---- */
  precioUnidad: 6000,
  packs: [
    { qty:1, price:6000, was:9990,  label:"1 sellador",  sub:"Precio promoción", tag:"" },
    { qty:2, price:9990, was:19980, label:"2 selladores", sub:"Ahorra $2.010",   tag:"MÁS VENDIDO" }
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
    { em:"🚧", b:"Envío gratis", s:"a todo Chile" },
    { em:"💵", b:"Paga al recibir", s:"contra entrega" },
    { em:"💧", b:"Repele el agua", s:"al instante" },
    { em:"🏠", b:"Interior y exterior", s:"uso múltiple" }
  ],

  /* ---- Beneficios (3) ---- */
  benTitle: "Por qué sirve donde otros fallan",
  benSub: "No es pintura ni silicona: es un gel que penetra y sella desde adentro, sin cambiar el aspecto de la superficie.",
  beneficios: [
    { ic:"💧", t:"Barrera invisible", d:"Forma una capa que repele el agua al instante. La pared, el piso o la madera quedan igual de aspecto: no brilla, no amarillea, no se nota." },
    { ic:"☀️", t:"Anti UV y antihongos", d:"Aguanta el sol sin degradarse y corta la humedad que alimenta hongos y manchas negras. Sirve afuera y adentro." },
    { ic:"🖌️", t:"Se aplica con brocha", d:"Viene listo para usar. Limpias la superficie, pasas la brocha y dejas secar. Sin mezclas, sin herramientas, sin maestro." }
  ],

  /* ---- Cómo actúa (intro + 3 pasos) ---- */
  howTitle: "¿Cómo se usa?",
  howIntro: "Tres pasos y listo. Sin mezclar nada y sin llamar a un maestro.",
  howSteps: [
    { n:1, t:"Limpia y seca", d:"La superficie tiene que estar sin polvo ni grasa, y seca." },
    { n:2, t:"Pasa la brocha", d:"Aplica una capa pareja sobre la zona con filtración o humedad." },
    { n:3, t:"Deja secar", d:"En pocas horas queda sellado. Si la filtración es fuerte, una segunda capa." }
  ],

  /* ---- Oferta ---- */
  offerTitle: "La promo: 2 selladores",
  offerSub: "2 unidades por $9.990, envío gratis y pagas al recibir en tu casa.",
  offerWas: 0,
  offerNew: 9990,

  /* ---- Stats (contadores) ---- */
  statTitle: "Para qué sirve",
  stats: [
    { n:300, suf:" g", t:"de gel por envase" },
    { n:4, suf:"", t:"superficies: concreto, ladrillo, cerámica y madera" },
    { n:0, suf:"", t:"cambio en el color o el aspecto" }
  ],

  /* ---- Comparativa ---- */
  cmpTitle: "¿Qué lo hace distinto?",
  comparativa: [
    { t:"Queda invisible", n:"La pintura impermeable tapa y cambia el color" },
    { t:"Se aplica con brocha, listo para usar", n:"La silicona hay que cortarla, aplicarla y alisarla" },
    { t:"Sirve en concreto, ladrillo, cerámica y madera", n:"Cada producto sirve para una sola superficie" }
  ],

  /* ---- Reseñas ---- */
  revScore: 4.7,
  revSeed: 96,

  /* ---- Garantía ---- */
  garDias: 30,
  garTitle: "Garantía de satisfacción",
  garText: "Si al aplicarlo no te sella la filtración, nos escribes dentro de 30 días y lo resolvemos.",

  /* ---- FAQ ---- */
  faq: [
    { q:"¿Se nota dónde lo apliqué?", a:"No. Es transparente: no altera el color ni el brillo de la superficie. Por eso sirve en fachadas y pisos a la vista." },
    { q:"¿Sirve para una filtración en el techo?", a:"Sí, mientras puedas llegar a la zona y aplicarla seca. Para grietas anchas conviene tapar primero y después sellar." },
    { q:"¿Cuánto rinde un envase?", a:"300 gramos alcanzan para varios metros cuadrados, según lo porosa que sea la superficie." },
    { q:"¿Cuánto demora en llegar?", a:"Entre 2 y 4 días hábiles a todo Chile, con envío gratis. Pagas cuando lo recibes." }
  ],

  /* ---- Transportadoras (logos en /img) ---- */
  carriers: ["img/logo-bluexpress.png", "img/logo-starken.png"],

  /* ---- Contacto / footer ---- */
  footTitle: "JAYE GROUP — CHILE",
  footAddr: "Av. Providencia 1208, Oficina 16, Santiago, RM.",
  footMail: "gerencia@jayegroup.com.co",
  whatsapp: "56964775539",

  /* ===========================================================
     BACKEND — webhook propio: el pedido cae a fin_ventas_wa como
     "Camila Web", pasa por el panel de aprobación y se monta en
     Dropi con el mismo circuito de WhatsApp. dropiId 149702.
     =========================================================== */
  dropiId:   144587,
  sheetUrl:  "",
  orderWebhook: "https://n8n-production-8a42.up.railway.app/webhook/pedido-web-pestanas",
  n8nConfirm:"",
  panelUrl:  "",
  pixelId:   "1249894010361489"
};
