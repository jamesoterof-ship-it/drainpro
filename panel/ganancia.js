/* Pestaña GANANCIA — la plata del dueño, aparte de las pantallas de operación.
   Se mide por lo que Dropi ENTREGÓ, no por lo vendido: una venta se puede
   perder en el camino, una entrega ya es plata cobrada al cliente.
   Los datos salen de fin_caja_diaria, que se llena sola cada hora. */
(function () {
  var URL_CAJA = 'https://n8n-production-8a42.up.railway.app/webhook/caja-jaye';
  var SUELDO_MES = 5000000;
  var BOTS_DIA = 40000;   /* Camila, Carlos, el inspector, el de redes y el de seguimiento */
  /* La cuenta arranca el 1 de septiembre. Lo de agosto queda guardado en la
     base pero no se muestra: en esos dias no se llevaba asi y mezclarlos
     ensucia el promedio (habia domingos con una sola entrega contra la pauta
     completa, que no representan como se opera ahora). */
  var INICIO = '2026-09-01';
  var dias = [], rangoGan = 7;

  var pes = function (n) { return '$' + Math.round(Number(n) || 0).toLocaleString('es-CO'); };
  var num = function (n) { return Math.round(Number(n) || 0); };
  var MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  function corto(s) { var p = String(s).split('-'); return p[2] + ' ' + MES[+p[1] - 1]; }
  function diaSem(s) { var p = String(s).split('-'); return DIAS[new Date(+p[0], +p[1] - 1, +p[2]).getDay()]; }
  var HOY = (function () {
    var d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  })();

  /* Que dias se muestran segun el selector: los ultimos N, un dia suelto o
     un rango entre dos fechas. Los datos vienen del mas nuevo al mas viejo. */
  function seleccion() {
    if (rangoGan === 'hoy') return dias.filter(function (x) { return x.dia === HOY; });
    if (rangoGan === 'ayer') {
      var p = HOY.split('-');
      var d = new Date(+p[0], +p[1] - 1, +p[2] - 1);
      var ay = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      return dias.filter(function (x) { return x.dia === ay; });
    }
    if (rangoGan === 'dia') {
      var d = (document.getElementById('ganDia') || {}).value;
      return d ? dias.filter(function (x) { return x.dia === d; }) : dias.slice(0, 1);
    }
    if (rangoGan === 'rango') {
      var a = (document.getElementById('ganDesde') || {}).value;
      var b = (document.getElementById('ganHasta') || {}).value;
      if (!a && !b) return dias.slice(0, 7);
      return dias.filter(function (x) { return (!a || x.dia >= a) && (!b || x.dia <= b); });
    }
    return dias.slice(0, Number(rangoGan) || 7);
  }

  function pintarGanancia() {
    if (!dias.length) return;
    var arr = seleccion();
    if (!arr.length) {
      /* Se limpia TODO, no solo la tabla: antes quedaban el total de abajo,
         las tarjetas y el plan con los numeros del rango anterior, y parecia
         que el dia sin entregas tenia plata. */
      var tbv = document.querySelector('#tablaGan tbody');
      var esHoy = (rangoGan === 'hoy');
      if (tbv) tbv.innerHTML = '<tr><td colspan="7" class="vacio">'
        + (esHoy ? 'Todavía no hay entregas registradas hoy. Dropi las va marcando durante el día.'
                 : 'No hay entregas en esa fecha.') + '</td></tr>';
      var tfv = document.querySelector('#tablaGan tfoot'); if (tfv) tfv.innerHTML = '';
      var kv = document.getElementById('ganKpis'); if (kv) kv.innerHTML = '';
      var av2 = document.getElementById('ganAvisos'); if (av2) av2.innerHTML = '';
      var pv = document.getElementById('ganPlan'); if (pv) pv.innerHTML = '';
      var cv = document.getElementById('ganChart');
      if (cv) { var vi = (typeof echarts !== 'undefined') && echarts.getInstanceByDom(cv);
        if (vi) { try { vi.dispose(); } catch (e) {} }
        cv.innerHTML = '<div class="vacio">Sin datos en ese rango</div>'; }
      var sv = document.getElementById('ganChartSub'); if (sv) sv.textContent = '—';
      return;
    }
    var t = { e: 0, en: 0, m: 0, c: 0, s: 0, q: 0 };
    arr.forEach(function (x) {
      t.e += num(x.entregas); t.en += num(x.entra); t.m += num(x.meta);
      t.c += num(x.camila); t.s += num(x.sueldo); t.q += num(x.queda);
    });
    var pctMeta = t.en ? Math.round(t.m / t.en * 100) : 0;
    var porEnt = t.e ? t.en / t.e : 0;
    var k = document.getElementById('ganKpis');
    if (k) k.innerHTML =
      tar('Te liquida Dropi', pes(t.en), arr.length + (arr.length === 1 ? ' día · ' : ' días · ') + t.e + ' entregas', '') +
      tar('Meta', pes(t.m), pctMeta + '% de lo que entra', pctMeta > 55 ? 'mal' : '') +
      tar('Bots', pes(t.c), 'Camila, Carlos y 3 más', '') +
      tar('Tu sueldo', pes(t.s), 'de los $5.000.000 del mes', '') +
      tar('TE QUEDA', pes(t.q), 'ya con tu sueldo descontado', t.q >= 0 ? 'ok' : 'mal') +
      tar('Cada entrega deja', pes(porEnt), 'de lo que te liquida Dropi', '');

    /* el mes contra el sueldo */
    var mes = dias.filter(function (x) { return x.dia.slice(0, 7) === HOY.slice(0, 7); });
    var qMes = 0, enMes = 0, mMes = 0;
    mes.forEach(function (x) { qMes += num(x.queda); enMes += num(x.entra); mMes += num(x.meta); });
    var av = '';
    if (mes.length) {
      var restan = Math.max(1, 30 - mes.length);
      if (qMes >= 0) {
        av = caja('#179f6b', 'El mes va cubierto.', 'En ' + mes.length + ' días entraron ' + pes(enMes) +
          ', se fueron ' + pes(mMes) + ' en Meta, y después de tus ' + pes(SUELDO_MES) +
          ' queda <b>' + pes(qMes) + '</b> libre para reinvertir.');
      } else {
        av = caja('#e8a800', 'Faltan ' + pes(-qMes) + ' para cubrir tu sueldo este mes.',
          'Quedan ' + restan + ' días, o sea ' + pes(-qMes / restan) + ' por día.');
      }
    }
    var rojos = arr.filter(function (x) { return num(x.queda) < 0; }).length;
    if (rojos) av += caja('#e0444b', rojos + ' de ' + arr.length + ' días quedaron en rojo.',
      'Pasa cuando entran pocas entregas y la pauta corre igual — domingos y festivos sobre todo.');
    var a = document.getElementById('ganAvisos');
    if (a) a.innerHTML = av;

    /* tabla */
    var tb = document.querySelector('#tablaGan tbody');
    if (tb) tb.innerHTML = arr.map(function (x) {
      /* TE QUEDA es lo ultimo: despues de Meta, de los bots y del sueldo. */
      var q = num(x.entra) - num(x.meta) - num(x.camila) - num(x.sueldo);
      return '<tr' + (x.dia === HOY ? ' style="background:var(--brand-tint)"' : '') + '>'
        + '<td><b>' + corto(x.dia) + '</b><small style="display:block;color:var(--ink-3)">' + diaSem(x.dia) + (x.dia === HOY ? ' · hoy' : '') + '</small></td>'
        + '<td style="text-align:right">' + num(x.entregas) + '</td>'
        + '<td style="text-align:right">' + pes(x.entra) + '</td>'
        + '<td style="text-align:right;color:var(--ink-2)">−' + pes(x.meta) + '</td>'
        + '<td style="text-align:right;color:var(--ink-2)">−' + pes(x.camila) + '</td>'
        + '<td style="text-align:right;color:var(--ink-2)">−' + pes(x.sueldo) + '</td>'
        + '<td style="text-align:right;font-weight:700;color:' + (q >= 0 ? 'var(--green)' : 'var(--red)') + '">' + pes(q) + '</td></tr>';
    }).join('');
    var tf = document.querySelector('#tablaGan tfoot');
    if (tf) tf.innerHTML = '<tr style="font-weight:800;background:var(--surface-2)"><td>Total</td>'
      + '<td style="text-align:right">' + t.e + '</td><td style="text-align:right">' + pes(t.en) + '</td>'
      + '<td style="text-align:right">−' + pes(t.m) + '</td><td style="text-align:right">−' + pes(t.c) + '</td>'
      + '<td style="text-align:right">−' + pes(t.s) + '</td>'
      + '<td style="text-align:right;color:' + (t.q >= 0 ? 'var(--green)' : 'var(--red)') + '">' + pes(t.q) + '</td></tr>';

    var sub = document.getElementById('ganChartSub');
    if (sub) sub.textContent = arr.length + (arr.length === 1 ? ' día' : ' días') + ' · promedio '
      + (t.e / arr.length).toFixed(1) + ' entregas al día · la cuenta arranca el ' + corto(INICIO);

    grafico(arr);
    plan(porEnt);
  }

  function tar(l, v, n, cls) {
    var col = cls === 'ok' ? 'var(--green)' : cls === 'mal' ? 'var(--red)' : 'var(--ink)';
    return '<div class="kpi"><div class="top-r"><div class="lbl">' + l + '</div></div>'
      + '<div class="val" style="color:' + col + '">' + v + '</div><div class="sm">' + n + '</div></div>';
  }
  function caja(color, titulo, texto) {
    return '<div style="background:var(--surface);border:1px solid var(--border);border-left:4px solid ' + color
      + ';border-radius:11px;padding:12px 14px;margin-bottom:12px;font-size:13px;line-height:1.6">'
      + '<b>' + titulo + '</b> ' + texto + '</div>';
  }

  function grafico(arr) {
    var el = document.getElementById('ganChart');
    if (!el || typeof echarts === 'undefined' || !arr.length) return;
    /* OJO: si se limpia el innerHTML con una instancia viva, echarts se queda
       sin lienzo y el grafico desaparece al cambiar de rango. Se destruye la
       instancia primero y solo entonces se limpia. */
    var vieja = echarts.getInstanceByDom(el);
    if (vieja) { try { vieja.dispose(); } catch (e) {} }
    el.innerHTML = '';
    var d = arr.slice().reverse();
    var oscuro = document.documentElement.getAttribute('data-theme') === 'dark'
      || (!document.documentElement.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme:dark)').matches);
    var inst = echarts.init(el);
    inst.setOption({
      grid: { left: 8, right: 8, top: 18, bottom: 4, containLabel: true },
      tooltip: { trigger: 'axis', valueFormatter: function (v) { return pes(v); } },
      xAxis: { type: 'category', data: d.map(function (x) { return corto(x.dia); }),
        axisLine: { lineStyle: { color: oscuro ? '#2a3344' : '#e9ebf0' } },
        axisLabel: { color: oscuro ? '#6b768a' : '#98a1b0', fontSize: 11 } },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: oscuro ? '#222a3b' : '#eef0f4' } },
        axisLabel: { color: oscuro ? '#6b768a' : '#98a1b0', fontSize: 11,
          formatter: function (v) { return v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : Math.round(v / 1000) + 'k'; } } },
      series: [
        { name: 'Entra', type: 'bar', data: d.map(function (x) { return num(x.entra); }),
          itemStyle: { color: '#179f6b', borderRadius: [4, 4, 0, 0] }, barMaxWidth: 26 },
        { name: 'Meta', type: 'bar', data: d.map(function (x) { return num(x.meta); }),
          itemStyle: { color: '#3056c9', borderRadius: [4, 4, 0, 0] }, barMaxWidth: 26 },
        { name: 'Queda', type: 'line', smooth: true, data: d.map(function (x) { return num(x.queda); }),
          lineStyle: { width: 2.5, color: '#98a1b0' }, itemStyle: { color: '#98a1b0' }, symbolSize: 6 },
      ],
    }, true);
    inst.resize();
    if (!window._ganResize) { window._ganResize = true; window.addEventListener('resize', function () { try { inst.resize(); } catch (e) {} }); }
  }

  /* Escenarios con el margen real por entrega, no con supuestos */
  function plan(porEnt) {
    var el = document.getElementById('ganPlan');
    if (!el || !porEnt) return;
    var ESC = [
      { n: 'Conservador', e: 30, m: 500000 },
      { n: 'Actual', e: 35, m: 600000 },
      { n: 'Escalado', e: 40, m: 700000 },
    ];
    /* La cuenta va SOLO con lo entregado, que es la plata que Dropi liquida.
       Las devoluciones no se restan aparte: lo que se cobra por una entrega ya
       viene neto de flete y de costo del producto. */
    var mejor = 0, mq = -Infinity;
    ESC.forEach(function (x, i) {
      x.entra = x.e * 30 * porEnt;
      x.queda = x.entra - x.m * 30 - BOTS_DIA * 30 - SUELDO_MES;
      if (x.queda > mq) { mq = x.queda; mejor = i; }
    });
    var html = ESC.map(function (x, i) {
      return '<div style="border:1px solid ' + (i === mejor ? 'var(--green)' : 'var(--border)')
        + ';background:' + (i === mejor ? 'var(--green-tint)' : 'transparent') + ';border-radius:12px;padding:14px">'
        + '<div style="font-size:13px;font-weight:800">' + x.n + '</div>'
        + '<div style="font-size:12px;color:var(--ink-2);margin-top:2px">' + x.e + ' entregas al día · ' + pes(x.m) + ' de pauta diaria</div>'
        + '<div style="font-size:21px;font-weight:800;color:var(--green);margin:9px 0 2px">' + pes(x.queda) + '</div>'
        + '<div style="font-size:11.5px;color:var(--ink-3)">te queda al mes, ya con tu sueldo</div>'
        + '<div style="font-size:12px;color:var(--ink-2);margin-top:9px;padding-top:9px;border-top:1px solid var(--border);line-height:1.9">'
        + 'Entra <b style="float:right;color:var(--ink)">' + pes(x.entra) + '</b><br>'
        + 'Meta <b style="float:right;color:var(--ink)">−' + pes(x.m * 30) + '</b><br>'
        + 'Bots <b style="float:right;color:var(--ink)">−' + pes(BOTS_DIA * 30) + '</b><br>'
        + 'Tu sueldo <b style="float:right;color:var(--ink)">−' + pes(SUELDO_MES) + '</b></div></div>';
    }).join('');
    var base = ESC[1];
    var techo = (base.entra - BOTS_DIA * 30 - SUELDO_MES) / 30;
    html += '<div style="grid-column:1/-1;border:1px solid var(--amber);border-radius:12px;padding:14px;background:var(--amber-tint)">'
      + '<div style="font-size:13px;font-weight:800">Hasta dónde aguanta la pauta</div>'
      + '<div style="font-size:13px;color:var(--ink-2);margin-top:6px;line-height:1.65">'
      + 'Con ' + base.e + ' entregas diarias puedes subir hasta <b style="color:var(--ink)">' + pes(techo)
      + ' al día</b> antes de que no quede nada después de pagarte.<br>'
      + '<b style="color:var(--ink)">Ojo con la caja:</b> la pauta se paga hoy y esa plata entra entre 4 y 14 días después. '
      + 'Para sostener ' + pes(700000) + ' diarios hay que aguantar cerca de ' + pes(7000000) + ' antes de ver el primer peso.'
      + '</div></div>';
    el.innerHTML = html;
  }

  window.cargarGanancia = function () {
    fetch(URL_CAJA, { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
      dias = (Array.isArray(j) ? j : [j]).filter(function (x) { return x && x.dia && x.dia >= INICIO; });
      pintarGanancia();
    }).catch(function () {
      var tb = document.querySelector('#tablaGan tbody');
      if (tb) tb.innerHTML = '<tr><td colspan="7" class="vacio">No se pudo cargar la caja.</td></tr>';
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('#segGan button').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('#segGan button').forEach(function (x) { x.classList.remove('act'); });
        b.classList.add('act');
        var v = b.dataset.g;
        rangoGan = /^\d+$/.test(v) ? +v : v;
        var uno = document.getElementById('ganUnDia'), ran = document.getElementById('ganRango');
        if (uno) uno.style.display = (v === 'dia') ? 'inline-flex' : 'none';
        if (ran) ran.style.display = (v === 'rango') ? 'inline-flex' : 'none';
        /* al abrirlos por primera vez se rellenan con algo util */
        if (v === 'dia') { var d = document.getElementById('ganDia'); if (d && !d.value && dias.length) d.value = dias[0].dia; }
        if (v === 'rango') {
          var a = document.getElementById('ganDesde'), z = document.getElementById('ganHasta');
          if (a && !a.value && dias.length) a.value = dias[Math.min(6, dias.length - 1)].dia;
          if (z && !z.value && dias.length) z.value = dias[0].dia;
        }
        pintarGanancia();
      });
    });
    ['ganDia', 'ganDesde', 'ganHasta'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('change', pintarGanancia);
    });
    document.querySelectorAll('.nav-i[data-view="ganancia"]').forEach(function (n) {
      n.addEventListener('click', function () { setTimeout(window.cargarGanancia, 60); });
    });
  });
})();
