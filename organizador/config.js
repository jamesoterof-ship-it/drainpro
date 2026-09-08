/* ============================================================
   CONFIG — ORGANIZADOR DE ROPA PLEGABLE (pack de 3 cajas)
   Dropi 56932 · MEIBO.CL · costo $4.500 el pack
   Escalera aprobada por James el 07-09-2026:
     3 cajas $19.500 · 6 cajas $24.500 · 9 cajas $34.500
   Medidas de la ficha del proveedor: 60 x 43 x 38 cm (~98 litros)
   Cabe 1 plumon king, 6 frazadas o 16 prendas dobladas.
   El competidor (Global Goods) vende 4 cajas de 26 L por $19.990:
   la nuestra es casi 4 veces mas grande, y ese es el argumento.
   ============================================================ */
window.CONFIG = {
  /* ---- Identidad ---- */
  marca: "JAYE GROUP",
  producto: "Organizador de Ropa Plegable · pack de 3 cajas",
  productoCorto: "Organizador de Ropa",
  seoTitle: "Organizador de Ropa Plegable 98 litros · Pago contra entrega Chile",
  seoDesc: "Cajas organizadoras de 60x43x38 cm con ventana y cierre. Cabe un plumon king o 16 prendas. Envio gratis y pagas al recibir en todo Chile.",

  /* ---- Paleta: sale de la foto del producto ----
     la caja es gris carbon con ribete cafe oscuro; se lleva a azul
     pizarra y el ambar queda solo para lo que se toca (botones, precio) */
  paleta: { pri:"#3C4A57", sec:"#6B7B89", acc:"#E08A2B", priD:"#26313B", ink:"#141A20" },

  /* ---- País / moneda ---- */
  pais: { nombre:"Chile", cc:"cl", prefijo:"+56", moneda:"CLP", locale:"es-CL" },

  /* ---- Hero ---- */
  heroKicker: "Cambio de temporada",
  heroTitle: 'Guarda el invierno.<br><span class="hl">Recupera tu clóset.</span>',
  heroLead: "Cajas de 98 litros que se tragan los plumones, las frazadas y la ropa gruesa. Se apilan y ves lo que hay adentro sin abrirlas.",
  heroTag: "Envío gratis a todo Chile",
  badges: ["98 litros por caja", "Se apilan", "🚚 Pago al recibir"],

  /* ---- Precios / packs ----
     qty = cajas. El tachado NO es inventado: es lo que costaria
     comprar esa misma cantidad en packs de 3 sueltos. */
  precioUnidad: 19500,
  packs: [
    { qty:3, price:19500, was:0,     label:"3 cajas",  sub:"294 litros",                   tag:"" },
    { qty:6, price:24500, was:39000, label:"6 cajas",  sub:"588 litros · $4.083 por caja", tag:"MÁS VENDIDO" },
    { qty:9, price:34500, was:58500, label:"9 cajas",  sub:"882 litros · $3.833 por caja", tag:"MEJOR PRECIO" }
  ],

  /* ---- Imágenes ---- */
  img: {
    logo:    "",
    hero:    "img/hero.webp",
    oferta:  "img/oferta.webp",
    galeria: ["img/c1.webp","img/c2.webp","img/c3.webp","img/c4.webp"],
    packThumb1: "img/unidad.webp",
    packThumb2: "img/duo.webp"
  },

  /* ---- Trust strip (4) ---- */
  trust: [
    { em:"🚚", b:"Envío gratis", s:"a todo Chile" },
    { em:"💵", b:"Paga al recibir", s:"contra entrega" },
    { em:"📦", b:"98 litros", s:"cada caja" },
    { em:"🪟", b:"Ventana", s:"ves sin abrir" }
  ],

  /* ---- Cómo se usa (intro + 3 pasos) ---- */
  howTitle: "Tres pasos y el clóset queda libre",
  howIntro: "Vienen plegadas. Se arman en segundos y quedan firmes: la estructura interna hace que no se desarmen aunque las llenes.",
  howSteps: [
    { t:"Ábrela y ármala", d:"Llega plegada. La abres, calzas la base y queda parada sola. No necesita herramientas." },
    { t:"Guarda y cierra", d:"Le entra un plumón king completo, o seis frazadas, o dieciséis prendas dobladas. Cierras el cierre y listo." },
    { t:"Apílalas", d:"Una encima de otra, arriba del clóset o debajo de la cama. La ventana transparente te deja ver qué hay en cada una." }
  ],

  /* ---- Oferta ---- */
  offerTitle: "6 cajas por $24.500",
  offerSub: "588 litros de espacio. Sale a $4.083 la caja y pagas cuando la recibes.",
  offerWas: 39000,
  offerNew: 24500,

  /* ---- Lo que le cabe (reemplaza los contadores) ---- */
  statTitle: "Cuánto le cabe de verdad",
  stats: [
    { em:'<svg viewBox="0 0 24 24"><path d="M3 8h18v9H3z"/><path d="M3 8l3-4h12l3 4"/></svg>', valor:98, suf:" L", d:"por caja, 60 x 43 x 38 cm." },
    { em:'<svg viewBox="0 0 24 24"><path d="M4 17V9a8 8 0 0 1 16 0v8z"/><path d="M4 17h16"/></svg>', valor:1, suf:"", d:"plumón king completo." },
    { em:'<svg viewBox="0 0 24 24"><path d="M5 5h14v14H5z"/><path d="M5 10h14M5 15h14"/></svg>', valor:6, suf:"", d:"frazadas gruesas." },
    { em:'<svg viewBox="0 0 24 24"><path d="M12 3l4 3-2 2v13H10V8L8 6z"/></svg>', valor:16, suf:"", d:"prendas dobladas." }
  ],

  /* ---- Comparativa ---- */
  cmpTitle: "No todas las cajas son del mismo porte",
  comparativa: [
    "98 litros por caja. Las que venden por ahí traen 26: casi cuatro veces menos.",
    "Estructura interna que la mantiene parada aunque la llenes hasta arriba.",
    "Ventana transparente y asas reforzadas: la bajas del clóset sin que se rasgue."
  ],

  /* ---- Reseñas ---- */
  revScore: 4.8,
  revSeed: 312,

  /* ---- Garantía ---- */
  garDias: 30,
  garTitle: "Garantía total de satisfacción",
  garText: "Si la caja llega con algún defecto, te la cambiamos. Tienes 30 días y no pagas nada por adelantado: revisas el producto cuando el repartidor te lo entrega.",

  /* ---- FAQ ---- */
  faq: [
    { q:"¿De qué tamaño es cada caja?", a:"60 cm de largo, 43 de ancho y 38 de alto: unos 98 litros. Le entra un plumón king completo, seis frazadas gruesas o dieciséis prendas dobladas." },
    { q:"¿Se aplastan cuando las apilo?", a:"No. Llevan una estructura interna en las paredes que las mantiene firmes, así que puedes ponerlas una sobre otra sin que se hundan." },
    { q:"¿Qué colores llegan?", a:"Vienen en gris, celeste y rosado. Si tienes preferencia nos la dices al confirmar el pedido y la tomamos en cuenta según disponibilidad." },
    { q:"¿Sirven para guardar debajo de la cama?", a:"Sí, siempre que tu cama tenga al menos 40 cm de alto libre. Si es más baja, la mejor opción es arriba del clóset o en el altillo." },
    { q:"¿Cómo pago?", a:"Contra entrega: pagas en efectivo cuando el repartidor te deja el pedido en tu casa. No pagas nada por adelantado." },
    { q:"¿Hacen envíos a regiones?", a:"Sí, llegamos a todo Chile con envío gratis y pagas cuando recibes en tu casa. En Santiago demora 1 a 3 días hábiles y en regiones 2 a 4." }
  ],

  /* ---- FIJO: transportadoras (no cambiar) ---- */
  carriers: ["img/logo-bluexpress.png", "img/logo-starken.png"],

  /* ---- FIJO: contacto / footer (NUNCA cambiar) ---- */
  footTitle: "JAYE GROUP — CHILE",
  footAddr: "Av. Providencia 1208, Oficina 16, Santiago, RM.",
  footMail: "gerencia@jayegroup.com.co",
  whatsapp: "56920007288",

  /* ===========================================================
     BACKEND — el dropiId es el real. El resto queda vacio hasta
     que se creen los propios de este producto: mientras tanto la
     pagina es SOLO para previsualizar, no registra pedidos.
     =========================================================== */
  dropiId:   56932,
  sheetUrl:  "",
  n8nConfirm:"",
  panelUrl:  "",
  pixelId:   ""
};
