import React, { useState, useEffect, useCallback } from "react";
import { supabase } from './supabase.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ─── BANDERAS ────────────────────────────────────────────────────────────────

// ─── BANDERAS ────────────────────────────────────────────────────────────────

// Colores representativos por selección (funciona sin internet)
const COLORES_PAIS = {
  "México":["#006847","#FFFFFF","#CE1126"],
  "Argentina":["#74ACDF","#FFFFFF","#74ACDF"],
  "Brasil":["#009CB","#FFDF00","#002776"],
  "España":["#AA151B","#F1BF00","#AA151B"],
  "Francia":["#002395","#FFFFFF","#ED2939"],
  "Alemania":["#000000","#DD0000","#FFCE00"],
  "Inglaterra":["#FFFFFF","#CF091F","#FFFFFF"],
  "Portugal":["#006600","#FF0000","#006600"],
  "Italia":["#009246","#FFFFFF","#CE2B37"],
  "Países Bajos":["#AE1C28","#FFFFFF","#21468B"],
  "Bélgica":["#000000","#FAE042","#EF3340"],
  "Uruguay":["#FFFFFF","#5EB6E4","#FFFFFF"],
  "Colombia":["#FCD116","#003087","#CE1126"],
  "Chile":["#FFFFFF","#D52B1E","#0039A6"],
  "Perú":["#D91023","#FFFFFF","#D91023"],
  "Ecuador":["#FFD100","#003893","#ED1C24"],
  "Japón":["#FFFFFF","#BC002D","#FFFFFF"],
  "Corea del Sur":["#FFFFFF","#CD2E3A","#FFFFFF"],
  "Marruecos":["#C1272D","#006233","#C1272D"],
  "Senegal":["#00853F","#FDEF42","#E31B23"],
  "Nigeria":["#008751","#FFFFFF","#008751"],
  "Ghana":["#006B3F","#FCD116","#CE1126"],
  "Camerún":["#007A5E","#CE1126","#FCD116"],
  "Costa de Marfil":["#F77F00","#FFFFFF","#009A44"],
  "Australia":["#00008B","#FFFFFF","#FF0000"],
  "Arabia Saudita":["#006C5","#FFFFFF","#006C5"],
  "Irán":["#239F40","#FFFFFF","#DA0000"],
  "Qatar":["#8D1B3D","#FFFFFF","#8D1B3D"],
  "EUA":["#B22234","#FFFFFF","#3CB6E"],
  "Canadá":["#FF0000","#FFFFFF","#FF0000"],
  "Costa Rica":["#002B7F","#FFFFFF","#CE1126"],
  "Panamá":["#FFFFFF","#D21034","#005293"],
  "Suiza":["#FF0000","#FFFFFF","#FF0000"],
  "Croacia":["#FF0000","#FFFFFF","#0093DD"],
  "Dinamarca":["#C60C0","#FFFFFF","#C60C0"],
  "Serbia":["#C6363C","#0C076","#FFFFFF"],
  "Polonia":["#FFFFFF","#DC143C","#FFFFFF"],
  "Suecia":["#006AA7","#FECC02","#006AA7"],
  "Noruega":["#EF2B2D","#FFFFFF","#002868"],
  "Austria":["#ED2939","#FFFFFF","#ED2939"],
  "Turquía":["#E30A17","#FFFFFF","#E30A17"],
  "Eslovaquia":["#FFFFFF","#0B4EA2","#EE1C25"],
  "Hungría":["#CE2939","#FFFFFF","#477050"],
  "Albania":["#E41E20","#000000","#E41E20"],
  "Ucrania":["#005BBB","#FFD500","#005BBB"],
  "Escocia":["#003087","#FFFFFF","#003087"],
  "Gales":["#FFFFFF","#D01012","#00AE44"],
  "Rep. Checa":["#FFFFFF","#D7141A","#11457E"],
};

const PAIS_ESTILO = {
  "México":"bg-green-700 text-white","Argentina":"bg-sky-400 text-white",
  "Brasil":"bg-green-600 text-yellow-300","España":"bg-red-600 text-yellow-300",
  "Francia":"bg-blue-800 text-white","Alemania":"bg-zinc-900 text-yellow-400",
  "Inglaterra":"bg-red-700 text-white","Portugal":"bg-red-700 text-green-300",
  "Italia":"bg-green-700 text-white","Países Bajos":"bg-orange-500 text-white",
  "Bélgica":"bg-red-700 text-yellow-300","Uruguay":"bg-sky-500 text-white",
  "Colombia":"bg-yellow-400 text-blue-900","Chile":"bg-red-600 text-white",
  "Perú":"bg-red-600 text-white","Ecuador":"bg-yellow-400 text-blue-900",
  "Japón":"bg-white text-red-600","Corea del Sur":"bg-white text-red-600",
  "Marruecos":"bg-red-700 text-green-400","Senegal":"bg-green-600 text-yellow-300",
  "Nigeria":"bg-green-600 text-white","Ghana":"bg-red-600 text-yellow-300",
  "Camerún":"bg-green-600 text-yellow-300","Costa de Marfil":"bg-orange-500 text-white",
  "Australia":"bg-blue-900 text-yellow-300","Arabia Saudita":"bg-green-700 text-white",
  "Irán":"bg-green-700 text-white","Qatar":"bg-purple-900 text-white",
  "EUA":"bg-blue-900 text-red-400","Canadá":"bg-red-600 text-white",
  "Costa Rica":"bg-blue-800 text-red-400","Panamá":"bg-red-600 text-blue-300",
  "Suiza":"bg-red-600 text-white","Croacia":"bg-red-600 text-sky-300",
  "Dinamarca":"bg-red-600 text-white","Serbia":"bg-red-600 text-blue-300",
  "Polonia":"bg-red-600 text-white","Suecia":"bg-blue-700 text-yellow-300",
  "Noruega":"bg-red-600 text-white","Austria":"bg-red-600 text-white",
  "Turquía":"bg-red-600 text-white","Eslovaquia":"bg-blue-700 text-white",
  "Hungría":"bg-red-600 text-white","Albania":"bg-red-700 text-black",
  "Ucrania":"bg-blue-600 text-yellow-300","Escocia":"bg-blue-900 text-white",
  "Gales":"bg-red-600 text-green-400","Rep. Checa":"bg-blue-800 text-red-400",
};

const CODIGOS_PAIS = {
  "México":"mx","Argentina":"ar","Brasil":"br","España":"es",
  "Francia":"fr","Alemania":"de","Inglaterra":"gb-eng","Portugal":"pt",
  "Italia":"it","Países Bajos":"nl","Bélgica":"be","Uruguay":"uy",
  "Colombia":"co","Chile":"cl","Perú":"pe","Ecuador":"ec",
  "Japón":"jp","Corea del Sur":"kr","Marruecos":"ma","Senegal":"sn",
  "Nigeria":"ng","Ghana":"gh","Camerún":"cm","Costa de Marfil":"ci",
  "Australia":"au","Arabia Saudita":"sa","Irán":"ir","Qatar":"qa",
  "EUA":"us","Canadá":"ca","Costa Rica":"cr","Panamá":"pa",
  "Suiza":"ch","Croacia":"hr","Dinamarca":"dk","Serbia":"rs",
  "Polonia":"pl","Suecia":"se","Noruega":"no","Austria":"at",
  "Turquía":"tr","Eslovaquia":"sk","Hungría":"hu","Albania":"al",
  "Ucrania":"ua","Escocia":"gb-sct","Gales":"gb-wls","Rep. Checa":"cz",
  "Venezuela":"ve","Bolivia":"bo","Paraguay":"py","Honduras":"hn",
  "El Salvador":"sv","Guatemala":"gt","Jamaica":"jm","Trinidad y Tobago":"tt",
  "Argelia":"dz","Egipto":"eg","Túnez":"tn","Mali":"ml",
  "China":"cn","Indonesia":"id","Tailandia":"th","Vietnam":"vn",
  "Irak":"iq","Jordania":"jo","Uzbekistán":"uz","Nueva Zelanda":"nz",
  "Grecia":"gr","Rumania":"ro","Bulgaria":"bg","Islandia":"is",
  "Haití":"ht","Curazao":"cw","Sudáfrica":"za","Bosnia y Herzegovina":"ba",
};

const FlagImg = ({ nombre, size = 28 }) => {
  const [imgError, setImgError] = React.useState(false);
  const code = CODIGOS_PAIS[nombre];
  const estilo = PAIS_ESTILO[nombre] || "bg-zinc-700 text-zinc-300";
  const initials = nombre ? nombre.replace("Países Bajos","PB").replace("Costa de Marfil","CI").replace("Arabia Saudita","AS").replace("Corea del Sur","CS").replace("Costa Rica","CR").replace("Trinidad y Tobago","TT").replace("Nueva Zelanda","NZ").replace("Bosnia y Herzegovina","BH").split(" ").map(w=>w[0]).join("").slice(0,3).toUpperCase() : "?";
  const textSize = size <= 20 ? "text-[8px]" : size <= 24 ? "text-[9px]" : "text-[10px]";

  if (code && !imgError) {
    return (
      <img
        src={`https://flagcdn.com/w40/${code}.png`}
        alt={nombre}
        title={nombre}
        onError={() => setImgError(true)}
        style={{ width:size, height:size*0.72, objectFit:"cover", borderRadius:3, display:"inline-block", verticalAlign:"middle", flexShrink:0 }}
      />
    );
  }

  return (
    <span title={nombre} className={`inline-flex items-center justify-center font-black rounded ${estilo} ${textSize}`}
      style={{ width:size, height:size*0.72, flexShrink:0, verticalAlign:"middle" }}>
      {initials}
    </span>
  );
};

const getCode = (nombre) => CODIGOS[nombre] || null;



// ─── DATA ────────────────────────────────────────────────────────────────────

const JORNADAS = [
  { id: "j1", label: "Jornada 1" },
  { id: "j2", label: "Jornada 2" },
  { id: "j3", label: "Jornada 3" },
  { id: "dieciseis", label: "Dieciseisavos" },
  { id: "octavos", label: "Octavos" },
  { id: "cuartos", label: "Cuartos" },
  { id: "semis", label: "Semifinal" },
  { id: "tercero", label: "3er Lugar", hasBonus: true },
  { id: "final", label: "Final", hasBonus: true },
];

const COLORS = [
  "#10b981","#f59e0b","#3b82f6","#ef4444","#8b5cf6",
  "#06b6d4","#f97316","#84cc16","#ec4899","#14b8a6",
  "#a855f7","#fb923c","#22d3ee","#4ade80","#f43f5e",
  "#60a5fa","#fbbf24","#a3e635","#e879f9","#34d399",
];

const PARTIDOS_INICIALES = (() => {
  const lista = [];
  let id = 1;
  const counts = { j1:16, j2:16, j3:16, dieciseis:32, octavos:8, cuartos:4, semis:2, tercero:1, final:1 };
  const sel = [
    "México","Argentina","Brasil","España","Francia","Alemania","Inglaterra","Portugal",
    "Italia","Países Bajos","Bélgica","Uruguay","Colombia","Chile","Perú","Ecuador",
    "Japón","Corea del Sur","Marruecos","Senegal","Nigeria","Ghana","Camerún","Costa de Marfil",
    "Australia","Arabia Saudita","Irán","Qatar","EUA","Canadá","Costa Rica","Panamá",
    "Suiza","Croacia","Dinamarca","Serbia","Polonia","Suecia","Noruega","Austria",
    "Turquía","Eslovaquia","Hungría","Albania","Ucrania","Escocia","Gales","Rep. Checa"
  ];
  JORNADAS.forEach((j) => {
    const n = counts[j.id] || 0;
    for (let i = 0; i < n; i++) {
      lista.push({ id, jornada: j.id, local: sel[(id*2-2)%sel.length], visita: sel[(id*2-1)%sel.length], especial: i===0, resultado: null, esBonus: false });
      id++;
    }
  });
  return lista;
})();

const BONUS_INICIALES = (() => {
  const preguntas = [
    { texto: "¿Quién tendrá más tiros de esquina?", opciones: ["Local","Empate","Visita"] },
    { texto: "¿Se pitará penal?", opciones: ["Sí","No"] },
    { texto: "¿Minutos añadidos tras el 90?", opciones: ["0-5 min","6-10 min","11+ min"] },
    { texto: "¿Quién tendrá más posesión?", opciones: ["Local","Empate","Visita"] },
    { texto: "¿Habrá gol en tiempo extra?", opciones: ["Sí","No"] },
    { texto: "¿Quién tendrá más tarjetas amarillas?", opciones: ["Local","Empate","Visita"] },
    { texto: "¿Se llegará a penales?", opciones: ["Sí","No"] },
    { texto: "¿Primer gol antes del min 30?", opciones: ["Sí","No"] },
    { texto: "¿Habrá autogol?", opciones: ["Sí","No"] },
    { texto: "¿Más de 3 goles en total?", opciones: ["Sí","No"] },
  ];
  const bonus = {};
  ["tercero","final"].forEach((jid) => {
    const count = jid === "tercero" ? 3 : 10;
    bonus[jid] = preguntas.slice(0,count).map((q,i) => ({
      id: `bonus_${jid}_${i}`, jornada: jid, esBonus: true,
      texto: q.texto, opciones: q.opciones, resultado: null,
    }));
  });
  return bonus;
})();

// ─── STORAGE ──────────────────────────────────────────────────────────────────

const useLocalData = (key, init) => {
  const [data, setData] = useState(init);
  const update = useCallback((val) => {
    setData(prev => typeof val === "function" ? val(prev) : val);
  }, []);
  return [data, update];
};

// ─── SCORE ────────────────────────────────────────────────────────────────────

const calcPuntos = (pronosticos, partidos, bonus) => {
  const byJornada = {};
  let total = 0;
  const all = [...partidos, ...(bonus.tercero||[]), ...(bonus.final||[])];
  all.forEach((p) => {
    if (!p.resultado) return;
    const pron = pronosticos[p.id];
    if (!pron || pron !== p.resultado) return;
    const pts = p.especial ? 2 : 1;
    total += pts;
    if (!byJornada[p.jornada]) byJornada[p.jornada] = 0;
    byJornada[p.jornada] += pts;
  });
  return { total, byJornada };
};

// ─── UI ATOMS ─────────────────────────────────────────────────────────────────

const Badge = ({ children, color="green" }) => {
  const c = {
    green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    gold: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    blue: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    red: "bg-red-500/20 text-red-300 border-red-500/30",
    gray: "bg-zinc-700/50 text-zinc-500 border-zinc-600/30",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${c[color]}`}>{children}</span>;
};

const Btn = ({ children, onClick, variant="primary", size="md", disabled }) => {
  const base = "font-bold rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";
  const v = {
    primary: "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20",
    ghost: "bg-transparent hover:bg-zinc-900/80 text-zinc-300 border border-zinc-700",
    gold: "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20",
    danger: "bg-red-600 hover:bg-red-500 text-white",
  };
  const s = { sm:"px-3 py-1.5 text-xs", md:"px-5 py-2.5 text-sm", lg:"px-7 py-3 text-base" };
  return <button className={`${base} ${v[variant]} ${s[size]}`} onClick={onClick} disabled={disabled}>{children}</button>;
};

const JORNADA_COLORS = ["#00A651","#0033FF","#FF0000","#AECC00","#00A651","#0033FF","#FF0000","#00A651","#0033FF"];
const JornadaTabs = ({ jornadaActiva, setJornadaActiva, partidos, bonus, mode }) => (
  <div className="flex gap-1 overflow-x-auto pb-1">
    {JORNADAS.map((j, idx) => {
      const jp = partidos.filter(p => p.jornada === j.id);
      const jb = (j.hasBonus && bonus[j.id]) ? bonus[j.id] : [];
      const all = [...jp, ...jb];
      const completa = all.length > 0 && (mode === "resultados" ? all.every(p => p.resultado) : jp.every(p => p.local && p.visita));
      const activa = jornadaActiva === j.id;
      const col = JORNADA_COLORS[idx % JORNADA_COLORS.length];
      return (
        <button key={j.id} onClick={() => setJornadaActiva(j.id)}
          className="shrink-0 px-3 py-1.5 transition-all duration-200 cursor-pointer rounded-xl flex flex-col items-center gap-0.5"
          style={{
            fontFamily:"'Bebas Neue', cursive",
            fontSize: 13,
            letterSpacing:"0.06em",
            background: activa ? `${col}33` : "rgba(255,255,255,0.05)",
            color: activa ? col : "rgba(255,255,255,0.4)",
            border: activa ? `1px solid ${col}` : "1px solid rgba(255,255,255,0.1)",
            boxShadow: activa ? `0 0 10px ${col}44` : "none",
          }}>
          {j.label} {completa ? "✓" : ""}
        </button>
      );
    })}
  </div>
);

// ─── TABLA COMPARATIVA ────────────────────────────────────────────────────────

const TablaComparativa = ({ participantes, partidos, bonus, jornadasVisibles }) => {
  const [jornadaSel, setJornadaSel] = useState(jornadasVisibles[0] || "j1");
  const visiblesActivas = JORNADAS.filter(j => jornadasVisibles.includes(j.id));

  if (visiblesActivas.length === 0) return (
    <div className="text-center py-8 text-zinc-500 text-sm">El organizador aún no ha activado la visibilidad de pronósticos.</div>
  );

  const jornadaPartidos = partidos.filter(p => p.jornada === jornadaSel && !p.esBonus);
  const standings = participantes
    .map(p => { const { total, byJornada } = calcPuntos(p.pronosticos, partidos, bonus); return { ...p, total, byJornada }; })
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      for (const j of JORNADAS) { const d = (b.byJornada[j.id]||0)-(a.byJornada[j.id]||0); if (d!==0) return d; }
      return 0;
    });

  const getCellBg = (pron, resultado, especial) => {
    if (!resultado) return especial ? "#1a1000" : "#111";
    const ok = pron === resultado;
    if (especial) return ok ? "#1a1000" : "#1a0000";
    return ok ? "#002a14" : "#1a0000";
  };
  const getCellTextColor = (pron, resultado, especial) => {
    if (!resultado) return especial ? "#ffd700" : "#aaa";
    const ok = pron === resultado;
    if (especial) return ok ? "#ffd700" : "#ff4d4d";
    return ok ? "#00ff87" : "#ff4d4d";
  };
  const getCellStyle = (pron, resultado, especial) => {
    if (!resultado) return especial ? "bg-amber-900/30" : "bg-zinc-800";
    const ok = pron === resultado;
    if (especial) return ok ? "bg-amber-400" : "bg-red-700";
    return ok ? "bg-emerald-600" : "bg-red-800/80";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-black text-white" style={{ fontFamily:"'Russo One', sans-serif", letterSpacing:"0.04em" }}>Tabla Comparativa</h2>
        <div className="flex gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-600 inline-block"></span>Acierto</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-800 inline-block"></span>Fallo</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-400 inline-block"></span>Punto Doble</span>
        </div>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {visiblesActivas.map((j, idx) => {
          const col = ["#00A651","#0033FF","#FF0000","#AECC00","#00A651","#0033FF","#FF0000","#00A651","#0033FF"][JORNADAS.findIndex(jj=>jj.id===j.id) % 9];
          const activa = jornadaSel===j.id;
          return (
          <button key={j.id} onClick={() => setJornadaSel(j.id)}
            className="shrink-0 px-3 py-1.5 transition-all duration-200 cursor-pointer rounded-xl"
              style={{
                fontFamily:"'Bebas Neue', cursive",
                fontSize:13,
                letterSpacing:"0.06em",
                background: activa ? `${col}33` : "rgba(255,255,255,0.05)",
                color: activa ? col : "rgba(255,255,255,0.4)",
                border: activa ? `1px solid ${col}` : "1px solid rgba(255,255,255,0.1)",
                boxShadow: activa ? `0 0 10px ${col}44` : "none",
              }}>
            {j.label}
          </button>
          );
        })}
      </div>
      <div className="overflow-x-auto thin-scroll" style={{ border:"2px solid rgba(255,255,255,0.4)", borderRadius:12, marginBottom:80 }}>
        <table className="text-xs border-collapse" style={{ minWidth:"max-content" }}>
          <thead>
            <tr>
              <th className="sticky left-0 z-20 px-3 py-2 text-left font-bold border-b border-r min-w-[130px]"
                style={{ background:"rgba(0,8,58,0.6)", color:"#4d8aff", borderColor:"#1a3a8a", fontSize:11, fontWeight:700, letterSpacing:"0.03em" }}>Participante</th>
              {jornadaPartidos.map((p, mIdx) => {
                const mundialBg = "#00083a";
                const mundialTxt = "#4d8aff";
                return (
                <th key={p.id} className="border-b border-r"
                  style={{ minWidth:36, padding:"8px 4px", background: p.especial ? "rgba(58,42,0,0.65)" : "rgba(0,8,58,0.65)", borderColor: "#1a3a8a" }}>
                  <div style={{ writingMode:"vertical-rl", transform:"rotate(180deg)", height:150, fontSize:10, lineHeight:1.3, whiteSpace:"nowrap", margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center", width:"100%", color: p.especial ? "#fcd34d" : mundialTxt, fontFamily:"'DM Sans', sans-serif", fontWeight:700 }}>
                    {p.local} - {p.visita}
                  </div>
                </th>
                );
              })}
              <th className="border-b border-r px-2 py-2 font-black text-center"
                style={{ background:"#002a15", color:"#00e676", borderColor:"#005a2a", fontSize:12, fontWeight:700 }}>TOTAL</th>
              {JORNADAS.map(j => (
                <th key={j.id} className={`border-b border-r px-1 py-2 text-center`}
                  style={{ minWidth:32, background: j.id===jornadaSel ? "rgba(251,191,36,0.25)" : "#1a1500", borderColor: j.id===jornadaSel ? "rgba(251,191,36,0.5)" : "#3a3000" }}>
                  <div style={{ writingMode:"vertical-rl", transform:"rotate(180deg)", height:60, fontSize:10, color: j.id===jornadaSel ? "#fbbf24" : "#d4a800", fontFamily:"'DM Sans', sans-serif", fontWeight:700 }}
                    className="font-bold">{j.label}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((p, idx) => (
              <tr key={p.id}>
                <td className="sticky left-0 z-10 px-3 py-2 font-bold border-r whitespace-nowrap"
                  style={{ background: idx%2===0 ? "#000d3d" : "#00061f", color:"#a0bfff", borderColor:"#1a3a8a" }}>
                  {idx===0?"🥇":idx===1?"🥈":idx===2?"🥉":`${idx+1}.`} {p.nombre}
                </td>
                {jornadaPartidos.map(part => {
                  const pron = p.pronosticos[part.id];
                  return (
                    <td key={part.id} className="rajdhani text-center px-1 py-1"
                      style={{ minWidth:36, border:"1px solid rgba(255,255,255,0.1)", background:getCellBg(pron, part.resultado, part.especial), color:getCellTextColor(pron, part.resultado, part.especial), border: "1px solid rgba(255,255,255,0.5)" }}>
                      {pron || <span style={{ color:"#ffffff" }}>—</span>}
                    </td>
                  );
                })}
                <td className="text-center px-2 py-1.5 font-black"
                  style={{ border:"1px solid #005a2a", background: idx%2===0 ? "#002a15" : "#001a0d", color:"#00e676", fontSize:13, fontWeight:700 }}>{p.total}</td>
                {JORNADAS.map(j => (
                  <td key={j.id} className="text-center px-1 py-1.5 font-bold"
                    style={{ border:"1px solid #3a3000", background: j.id===jornadaSel ? "rgba(251,191,36,0.2)" : idx%2===0 ? "#1a1500" : "#110f00", color: j.id===jornadaSel ? "#fbbf24" : "#d4a800" }}>
                    {p.byJornada[j.id]||""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── TABLA EVOLUCIÓN ─────────────────────────────────────────────────────────

const TablaEvolucion = ({ jornadasAcumuladas, participantes, partidos, bonus, jornadaSelId, jornadaSelLabel }) => {
  const medals = ["🥇","🥈","🥉"];

  if (!jornadasAcumuladas.length || !jornadaSelId) return null;

  const jornadaIdx = JORNADAS.findIndex(j => j.id === jornadaSelId);
  const jornadasHasta = JORNADAS.slice(0, jornadaIdx + 1).map(j => j.id);
  const partidosHasta = partidos.filter(p => jornadasHasta.includes(p.jornada));
  const bonusHasta = {
    tercero: jornadasHasta.includes("tercero") ? (bonus.tercero||[]) : [],
    final: jornadasHasta.includes("final") ? (bonus.final||[]) : [],
  };

  const standings = participantes
    .map((p, idx) => {
      const { total } = calcPuntos(p.pronosticos, partidosHasta, bonusHasta);
      return { ...p, total, color: COLORS[idx % COLORS.length] };
    })
    .sort((a,b) => b.total - a.total);

  return (
    <div className="space-y-2 pt-2">
      <p className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily:"'Bebas Neue', cursive", fontSize:13, color:"rgba(255,255,255,0.5)", letterSpacing:"0.1em" }}>
        Posiciones al terminar: <span className="text-white">{jornadaSelLabel}</span>
      </p>
      <div className="rounded-xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.1)" }}>
        {standings.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-2.5"
            style={{ background: i%2===0 ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.2)", borderBottom: i < standings.length-1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <span className="text-lg w-7 text-center shrink-0">{medals[i]||`${i+1}`}</span>
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }}></div>
            <span className="flex-1 font-bold text-sm" style={{ fontFamily:"'Rokkitt', serif", fontWeight:600, color:"rgba(255,255,255,0.65)" }}>{p.nombre}</span>
            <span className="font-black shrink-0" style={{ color: p.color, fontSize:18 }}>{p.total}<span className="text-xs text-zinc-600 font-normal ml-0.5">pts</span></span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── EVOLUCIÓN ───────────────────────────────────────────────────────────────

const Evolucion = ({ participantes, partidos, bonus }) => {
  const jornadasConDatos = JORNADAS.filter(j => {
    const jp = partidos.filter(p => p.jornada === j.id);
    return jp.some(p => p.resultado);
  });

  if (jornadasConDatos.length === 0) return (
    <div className="text-center py-12 text-zinc-500">
      <div className="text-4xl mb-3">📈</div>
      <p className="text-sm">La gráfica estará disponible cuando haya resultados cargados.</p>
    </div>
  );

  const jornadasAcumuladas = JORNADAS.filter((_, idx) => {
    const upTo = JORNADAS.slice(0, idx+1).map(j => j.id);
    return jornadasConDatos.some(j => upTo.includes(j.id));
  }).filter((_, idx) => idx <= JORNADAS.indexOf(jornadasConDatos[jornadasConDatos.length-1]));

  const [jornadaSelId, setJornadaSelId] = useState(jornadasAcumuladas[jornadasAcumuladas.length-1]?.id || "");

  const chartData = jornadasAcumuladas.map((jornada) => {
    const jornadasHastaAqui = JORNADAS.slice(0, JORNADAS.indexOf(jornada)+1).map(j => j.id);
    const partidosHasta = partidos.filter(p => jornadasHastaAqui.includes(p.jornada));
    const bonusHasta = {
      tercero: jornadasHastaAqui.includes("tercero") ? (bonus.tercero||[]) : [],
      final: jornadasHastaAqui.includes("final") ? (bonus.final||[]) : [],
    };
    const scores = participantes.map(p => {
      const { total } = calcPuntos(p.pronosticos, partidosHasta, bonusHasta);
      return { id: p.id, nombre: p.nombre, total };
    }).sort((a,b) => b.total - a.total);
    const dataPoint = { jornada: jornada.label, jornadaId: jornada.id };
    scores.forEach((p, idx) => { dataPoint[p.nombre] = idx + 1; });
    return dataPoint;
  });

  const handleChartClick = (data) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const jornadaLabel = data.activeLabel;
      const jornada = jornadasAcumuladas.find(j => j.label === jornadaLabel);
      if (jornada) setJornadaSelId(jornada.id);
    }
  };

  const jornadaSelLabel = jornadasAcumuladas.find(j => j.id === jornadaSelId)?.label || "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white" style={{ fontFamily:"'Russo One', sans-serif", letterSpacing:"0.04em" }}>Evolución de la Tabla</h2>
        <Badge color="blue">{jornadasConDatos.length} jornada{jornadasConDatos.length!==1?"s":""} jugada{jornadasConDatos.length!==1?"s":""}</Badge>
      </div>
      <p className="text-xs text-zinc-500">Toca la gráfica en una jornada para ver la clasificación de ese momento</p>
      <div style={{ height: Math.max(300, participantes.length * 20 + 100), cursor:"pointer" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top:10, right:120, left:30, bottom:10 }} onClick={handleChartClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="jornada" tick={{ fill:"#a1a1aa", fontSize:11, fontFamily:"'Bebas Neue', cursive" }} />
            <YAxis
              domain={[1, participantes.length || 1]}
              reversed={true}
              allowDecimals={false}
              tickCount={participantes.length || 1}
              ticks={Array.from({ length: participantes.length || 1 }, (_, i) => i + 1)}
              tick={{ fill:"#ffffff", fontSize:12, fontWeight:"bold", fontFamily:"'Bebas Neue', cursive" }}
              label={{ value:"Posición", angle:-90, position:"insideLeft", fill:"rgba(255,255,255,0.4)", fontSize:11 }}
            />
            <Tooltip
              contentStyle={{ background:"rgba(0,0,0,0.85)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, fontSize:12 }}
              labelStyle={{ color:"#fff", fontWeight:"bold", fontFamily:"'Bebas Neue', cursive", letterSpacing:"0.05em" }}
              formatter={(val, name) => [`#${val}`, name]}
            />
            {participantes.map((p, idx) => (
              <Line key={p.id} type="linear" dataKey={p.nombre}
                stroke={COLORS[idx % COLORS.length]} strokeWidth={3}
                dot={(props) => {
                  const { cx, cy, value } = props;
                  const col = COLORS[idx % COLORS.length];
                  return (
                    <g key={cx+'-'+cy}>
                      <circle cx={cx} cy={cy} r={14} fill={col} fillOpacity={0.15} />
                      <circle cx={cx} cy={cy} r={8} fill={col} />
                      <text x={cx} y={cy+4} textAnchor="middle" fill="#000"
                        fontSize={9} fontWeight="900" fontFamily="'Bebas Neue', cursive">
                        {value}
                      </text>
                    </g>
                  );
                }}
                activeDot={{ r:10 }}
                label={(props) => {
                  const { x, y, index } = props;
                  if (index !== chartData.length - 1) return null;
                  return (
                    <text x={x + 12} y={y + 4} fill={COLORS[idx % COLORS.length]}
                      fontSize={11} fontWeight="bold" textAnchor="start"
                      fontFamily="'DM Sans', sans-serif">
                      {`${p.nombre.split(' ')[0]} · ${calcPuntos(p.pronosticos, partidos, bonus).total}pts`}
                    </text>
                  );
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <TablaEvolucion jornadasAcumuladas={jornadasAcumuladas} participantes={participantes} partidos={partidos} bonus={bonus} jornadaSelId={jornadaSelId} jornadaSelLabel={jornadaSelLabel} />

    </div>
  );
};
// ─── VIEW: TABLA ──────────────────────────────────────────────────────────────

const TablaView = ({ participantes, partidos, bonus, jornadasVisibles, premioVisible, premioTexto }) => {
  const [subTab, setSubTab] = useState("comparativa");
  const [pagina, setPagina] = useState(0);
  const POR_PAGINA = 10;

  const standings = participantes
    .map(p => { const { total, byJornada } = calcPuntos(p.pronosticos, partidos, bonus); return { ...p, total, byJornada }; })
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      for (const j of JORNADAS) { const d=(b.byJornada[j.id]||0)-(a.byJornada[j.id]||0); if(d!==0) return d; }
      return 0;
    });

  const jugados = [...partidos,...(bonus.tercero||[]),...(bonus.final||[])].filter(p=>p.resultado).length;
  const medals = ["🥇","🥈","🥉"];
  const paginados = standings.slice(0, (pagina + 1) * POR_PAGINA);
  const hayMas = standings.length > paginados.length;

  return (
    <div className="space-y-6">
      {/* Premio banner */}
      {premioVisible && premioTexto && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Premio</p>
            <p className="text-white font-bold text-sm">{premioTexto}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white" style={{ fontFamily:"'Russo One', sans-serif", letterSpacing:"0.04em" }}>Tabla de Posiciones</h2>
        <Badge color="blue">{jugados} jugados</Badge>
      </div>

      {standings.length === 0 ? (
        <div className="text-center py-16 text-zinc-500"><div className="text-5xl mb-3">⚽</div><p>Aún no hay participantes</p></div>
      ) : (
        <div className="space-y-2">
          {paginados.map((p, i) => {
            const borderColor = i===0?"#FFD700":i===1?"#C0C0C0":i===2?"#CD7F32":"#ffffff";
            return (
              <div key={p.id} className="flex items-center gap-3">
                {/* Posición con recuadro */}
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background:"rgba(0,0,0,0.6)", border:`3px solid ${borderColor}` }}>
                  <span className="font-black text-lg leading-none" style={{ color: borderColor }}>
                    {i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`}
                  </span>
                </div>
                {/* Recuadro */}
                <div className="flex items-center gap-3 flex-1 px-3 py-2 rounded-xl"
                  style={{ background:"rgba(0,0,0,0.6)", border:`3px solid ${borderColor}` }}>
                  {(() => {
                    const [open, setOpen] = React.useState(false);
                    return (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 cursor-pointer" onClick={() => setOpen(!open)}>
                          <p className="font-black text-white truncate" style={{ fontFamily:"'Russo One', sans-serif", fontSize:18 }}>{p.nombre}</p>
                          <div className="flex items-center gap-2 shrink-0">
                            <p className="font-black text-emerald-400" style={{ fontSize:28 }}>{p.total}<span className="text-sm text-zinc-600 font-normal ml-0.5">pts</span></p>
                            <span style={{ color:"rgba(255,255,255,0.3)", fontSize:14 }}>{open?"▲":"▼"}</span>
                          </div>
                        </div>
                        {open && (
                          <div className="mt-2 pt-2 border-t border-white/10">
                            <p style={{ fontSize:10, lineHeight:1.8 }}>
                              {JORNADAS.filter(j => p.byJornada[j.id] > 0).map((j, idx, arr) => {
                                const col = ["#00A651","#0033FF","#FF0000","#AECC00","#00A651","#0033FF","#FF0000","#00A651","#0033FF"][JORNADAS.indexOf(j)%9];
                                return (
                                  <span key={j.id}>
                                    <span style={{ color:"rgba(255,255,255,0.45)" }}>{j.label.replace("Jornada ","J").replace("Dieciseisavos","16s").replace("Semifinal","SF").replace("3er Lugar","3L")}</span>
                                    <span style={{ color:col, fontWeight:700 }}> {p.byJornada[j.id]}</span>
                                    {idx < arr.length-1 && <span style={{ color:"#333", margin:"0 4px" }}>•</span>}
                                  </span>
                                );
                              })}
                              {JORNADAS.filter(j => p.byJornada[j.id] > 0).length === 0 && <span style={{ color:"#444" }}>Sin puntos aún</span>}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })}
          {hayMas && (
            <button onClick={() => setPagina(p => p + 1)}
              className="w-full py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all cursor-pointer text-sm font-bold">
              Ver más ({standings.length - paginados.length} restantes) ↓
            </button>
          )}
          {pagina > 0 && (
            <button onClick={() => setPagina(0)}
              className="w-full py-2 text-xs text-zinc-600 hover:text-zinc-400 cursor-pointer transition-all">
              Mostrar menos ↑
            </button>
          )}
        </div>
      )}

      {/* Sub-tabs */}
      <div className="border-t border-zinc-700/30 pt-4">
        <div className="flex gap-2 p-1 rounded-2xl mb-4" style={{ background:"rgba(255,255,255,0.07)" }}>
          {[{id:"comparativa",label:"📊 Tabla Comparativa"},{id:"evolucion",label:"📈 Evolución"}].map(t => (
            <button key={t.id} onClick={() => setSubTab(t.id)}
              className="flex-1 py-2 transition-all duration-200 cursor-pointer rounded-xl"
              style={{
                fontFamily:"'Bebas Neue', cursive",
                letterSpacing:"0.08em",
                fontSize:15,
                background: subTab===t.id ? "rgba(255,255,255,0.15)" : "transparent",
                color: subTab===t.id ? "#ffffff" : "rgba(255,255,255,0.45)",
                boxShadow: subTab===t.id ? "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" : "none",
                border: subTab===t.id ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
              }}>
              {t.label}
            </button>
          ))}
        </div>
        {subTab==="comparativa" && <TablaComparativa participantes={participantes} partidos={partidos} bonus={bonus} jornadasVisibles={jornadasVisibles} />}
        {subTab==="evolucion" && <Evolucion participantes={participantes} partidos={partidos} bonus={bonus} />}
      </div>
    </div>
  );
};

// ─── VIEW: PRONÓSTICOS ────────────────────────────────────────────────────────

const PronosticosView = ({ participantes, setParticipantes, partidos, bonus, jornadasBloqueadas }) => {
  const [step, setStep] = useState("login");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [prons, setProns] = useState({});
  const [jornadaActiva, setJornadaActiva] = useState("j1");
  const [currentUser, setCurrentUser] = useState(null);

  const existing = participantes.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
  const jornadaInfo = JORNADAS.find(j => j.id === jornadaActiva);
  const bloqueada = jornadasBloqueadas.includes(jornadaActiva);
  const jornadaPartidos = partidos.filter(p => p.jornada === jornadaActiva);
  const jornadaBonus = (jornadaInfo?.hasBonus && bonus[jornadaActiva]) ? bonus[jornadaActiva] : [];
  const allItems = [...jornadaPartidos, ...jornadaBonus];

  const LIMITE_PARTICIPANTES = 50;

  const handleLogin = () => {
    setError("");
    if (!nombre.trim()) return;
    if (existing) {
      if (passwordInput !== existing.password) { setError("Contraseña incorrecta."); return; }
      setProns({...existing.pronosticos});
      setCurrentUser(existing);
      setStep("fill");
    } else {
      if (participantes.length >= LIMITE_PARTICIPANTES) { setError(`La quiniela ya alcanzó el límite de ${LIMITE_PARTICIPANTES} participantes.`); return; }
      if (password.length !== 6) { setError("La contraseña debe tener exactamente 6 caracteres."); return; }
      setCurrentUser(null);
      setProns({});
      setStep("fill");
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.from('participantes')
        .upsert({ nombre: nombre.trim(), password: existing ? existing.password : password, pronosticos: prons }, { onConflict: 'nombre', ignoreDuplicates: false });
      if (error) { console.error('handleSave error:', error); }
      // Also update local state
      if (existing) {
        setParticipantes(prev => prev.map(p => p.nombre === nombre.trim() ? {...p, pronosticos: prons} : p));
      } else {
        setParticipantes(prev => [...prev, { id: Date.now(), nombre: nombre.trim(), password, pronosticos: prons }]);
      }
      setStep("done");
    } catch(e) {
      console.error("Save error:", e);
      setStep("done");
    }
  };

  const totalCompletadas = JORNADAS.filter(j => {
    const jp = partidos.filter(p => p.jornada === j.id);
    const jb = (j.hasBonus && bonus[j.id]) ? bonus[j.id] : [];
    return [...jp,...jb].every(p => prons[p.id]);
  }).length;

  if (step === "done") return (
    <div className="text-center py-16 space-y-4">
      <div className="text-6xl">✅</div>
      <h2 className="text-2xl font-black text-white">¡Pronósticos guardados!</h2>
      <p className="text-zinc-500">Buena suerte, <span className="text-emerald-400 font-bold">{nombre}</span> 🍀</p>
      <Btn onClick={() => { setStep("login"); setNombre(""); setPassword(""); setPasswordInput(""); setError(""); }}>Volver</Btn>
    </div>
  );

  if (step === "login") return (
    <div className="max-w-md mx-auto space-y-6 py-8">
      <div className="text-center space-y-2">
        <img src="https://upload.wikimedia.org/wikipedia/en/a/a5/2026_FIFA_World_Cup_emblem.svg" alt="Mundial 2026" className="w-20 h-20 mx-auto object-contain" />
        <h2 className="text-2xl font-black text-white">Ingresa tus pronósticos</h2>
        <p className="text-zinc-500 text-sm">{existing ? "Bienvenido de nuevo — ingresa tu contraseña" : "Regístrate con tu nombre y una contraseña de 6 caracteres"}</p>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1 block">Nombre</label>
          <input className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Tu nombre..." value={nombre} onChange={e => { setNombre(e.target.value); setError(""); }} />
        </div>

        {nombre.trim() && (
          <div>
            <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1 block">
              {existing ? "Contraseña" : "Crear contraseña (6 caracteres)"}
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors pr-12"
                placeholder={existing ? "Tu contraseña..." : "Elige 6 caracteres..."}
                value={existing ? passwordInput : password}
                maxLength={existing ? undefined : 6}
                onChange={e => { existing ? setPasswordInput(e.target.value) : setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key==="Enter" && handleLogin()}
              />
              <button onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer text-sm">
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
            {!existing && (
              <div className="flex gap-1 mt-2">
                {[...Array(6)].map((_,i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i < password.length ? "bg-emerald-500" : "bg-zinc-700"}`}></div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-400 flex items-center gap-1">⚠️ {error}</p>}
        {nombre && existing && !error && <p className="text-sm text-amber-400">👋 Bienvenido de nuevo — ya tienes pronósticos guardados</p>}
        {nombre && !existing && nombre.trim().length > 0 && !error && <p className="text-sm text-emerald-400">✨ Nuevo participante — crea tu contraseña para registrarte</p>}

        <Btn onClick={handleLogin} disabled={!nombre.trim() || (existing ? !passwordInput : password.length!==6)} size="lg">
          {existing ? "Entrar →" : "Registrarme →"}
        </Btn>
      </div>
      
      {participantes.length >= LIMITE_PARTICIPANTES && (
        <div className="bg-red-900/20 border border-red-700/40 rounded-xl px-4 py-3 text-sm text-red-300 text-center">
          🚫 La quiniela está llena. No se aceptan más registros.
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {(() => {
        const standings = participantes
          .map(p => { const { total } = calcPuntos(p.pronosticos, partidos, bonus); return { ...p, total }; })
          .sort((a,b) => b.total - a.total);
        const posicion = standings.findIndex(p => p.nombre.toLowerCase() === nombre.toLowerCase()) + 1;
        const puntos = standings.find(p => p.nombre.toLowerCase() === nombre.toLowerCase())?.total || 0;
        const medalColor = posicion===1?"#FFD700":posicion===2?"#C0C0C0":posicion===3?"#CD7F32":"rgba(255,255,255,0.3)";
        const medal = posicion===1?"🥇":posicion===2?"🥈":posicion===3?"🥉":null;
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-black text-black"
                style={{ background:`hsl(${(nombre.charCodeAt(0)*37)%360}, 70%, 55%)`, fontSize:20, fontFamily:"'Luckiest Guy', cursive", boxShadow:`0 0 16px hsl(${(nombre.charCodeAt(0)*37)%360}, 70%, 45%)` }}>
                {nombre.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <div>
                <h2 className="font-black text-white leading-tight" style={{ fontFamily:"'Luckiest Guy', cursive", fontSize:28, letterSpacing:"0.05em" }}>{nombre}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-black px-3 py-1 rounded-full" style={{ background:medalColor+"33", color:medalColor, border:`1px solid ${medalColor}66`, fontSize:15 }}>
                    {medal} {posicion > 0 ? `#${posicion}` : "—"}
                  </span>
                  <span className="font-black text-emerald-400" style={{ fontSize:18 }}>{puntos} pts</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="flex gap-1 overflow-x-auto thin-scroll pb-3" style={{ marginTop:32 }}>
        {JORNADAS.map((j, jIdx) => {
          const jp = partidos.filter(p => p.jornada === j.id);
          const jb = (j.hasBonus && bonus[j.id]) ? bonus[j.id] : [];
          const completa = [...jp,...jb].every(p => prons[p.id]);
          const bloq = jornadasBloqueadas.includes(j.id);
          return (
            <button key={j.id} onClick={() => setJornadaActiva(j.id)}
              className="shrink-0 px-3 py-1.5 transition-all duration-200 cursor-pointer rounded-xl"
              style={{
                fontFamily:"'Bebas Neue', cursive",
                fontSize:13,
                letterSpacing:"0.06em",
                background: bloq ? "rgba(200,0,0,0.15)" : jornadaActiva===j.id ? `${ ["#00A651","#0033FF","#FF0000","#AECC00","#00A651","#0033FF","#FF0000","#00A651","#0033FF"][JORNADAS.findIndex(jj=>jj.id===j.id)%9] }33` : "rgba(255,255,255,0.05)",
                color: bloq ? "#ff6b6b" : jornadaActiva===j.id ? ["#00A651","#0033FF","#FF0000","#AECC00","#00A651","#0033FF","#FF0000","#00A651","#0033FF"][JORNADAS.findIndex(jj=>jj.id===j.id)%9] : completa ? "#00e676" : "rgba(255,255,255,0.4)",
                border: bloq ? "1px solid rgba(200,0,0,0.3)" : jornadaActiva===j.id ? `1px solid ${ ["#00A651","#0033FF","#FF0000","#AECC00","#00A651","#0033FF","#FF0000","#00A651","#0033FF"][JORNADAS.findIndex(jj=>jj.id===j.id)%9] }` : "1px solid rgba(255,255,255,0.1)",
                boxShadow: jornadaActiva===j.id ? `0 0 10px ${ ["#00A651","#0033FF","#FF0000","#AECC00","#00A651","#0033FF","#FF0000","#00A651","#0033FF"][JORNADAS.findIndex(jj=>jj.id===j.id)%9] }44` : "none",
              }}>
              {j.label} {bloq?"🔒":completa?"✓":""}
            </button>
          );
        })}
      </div>



      <div className="space-y-2">
        {allItems.map((p, pIdx) => {
          const val = prons[p.id];
          const dis = bloqueada;
          const nonBonusItems = allItems.filter(i => !i.esBonus);
          const nonBonusIdx = nonBonusItems.findIndex(i => i.id === p.id);
          const total = nonBonusItems.length;
          const mundialColors = ["#00A651","#0033FF","#FF0000","#AECC00"];
          const borderColor = mundialColors[Math.floor((nonBonusIdx / Math.max(total,1)) * 4) % 4];
          if (p.esBonus) return (
            <div key={p.id} className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2"><Badge color="gold">BONUS</Badge><span className="text-sm text-white font-medium">{p.texto}</span></div>
              <div className="flex gap-2 flex-wrap">
                {p.opciones.map(op => (
                  <button key={op} onClick={() => !dis && setProns(prev => ({...prev,[p.id]:op}))}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${dis?"opacity-50 cursor-not-allowed":"cursor-pointer"} ${val===op?"bg-amber-500 text-black":"bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"}`}>
                    {op}
                  </button>
                ))}
              </div>
            </div>
          );
          return (
            <div key={p.id} className="rounded-xl"
              style={{ border:`1.5px solid ${borderColor}`, background:`${borderColor}11`, padding:"8px 12px" }}>
              <div className="flex items-center gap-2">
                {p.especial && <span style={{ fontSize:9, fontFamily:"'Bebas Neue', cursive", letterSpacing:"0.08em", color:"#FFD700", textShadow:"0 0 8px #FFD700", fontWeight:700, marginRight:"auto" }}>⭐ PUNTO DOBLE</span>}
                <span className="flex-1 text-right font-bold text-white flex items-center justify-end gap-1.5 flex-wrap">
                  <FlagImg nombre={p.local} size={20} />
                  <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.04em", lineHeight:1.3, wordBreak:"break-word", textAlign:"right" }}>{p.local||"—"}</span>
                </span>
                <div className="flex gap-1 shrink-0">
                  {[{k:"L"},{k:"E"},{k:"V"}].map(opt => (
                    <button key={opt.k} onClick={() => !dis && setProns(prev => ({...prev,[p.id]:opt.k}))}
                      title={opt.k==="L"?p.local:opt.k==="E"?"Empate":p.visita}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${dis?"opacity-50 cursor-not-allowed":"cursor-pointer"}`}
                      style={{
                        background: val===opt.k
                          ? opt.k==="L" ? "#7c3aed"
                          : opt.k==="E" ? "#f97316"
                          : "#84cc16"
                          : "rgba(255,255,255,0.08)",
                        color: val===opt.k ? (opt.k==="V" ? "#000" : "#fff") : "rgba(255,255,255,0.5)",
                        border: val===opt.k
                          ? opt.k==="L" ? "2px solid #a855f7"
                          : opt.k==="E" ? "2px solid #fb923c"
                          : "2px solid #a3e635"
                          : "1px solid rgba(255,255,255,0.15)",
                        transform: val===opt.k ? "scale(1.1)" : "scale(1)",
                        boxShadow: val===opt.k
                          ? opt.k==="L" ? "0 0 10px #7c3aed88"
                          : opt.k==="E" ? "0 0 10px #f9731688"
                          : "0 0 10px #84cc1688"
                          : "none"
                      }}>{opt.k}</button>
                  ))}
                </div>
                <span className="flex-1 text-left font-bold text-white flex items-center gap-1.5 flex-wrap">
                  <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.04em", lineHeight:1.3, wordBreak:"break-word" }}>{p.visita||"—"}</span>
                  <FlagImg nombre={p.visita} size={20} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {!bloqueada && <Btn onClick={handleSave} variant="gold" size="lg">Guardar pronósticos ✓</Btn>}
    </div>
  );
};

// ─── VIEW: ADMIN ──────────────────────────────────────────────────────────────


// ─── SORTEO DATA ──────────────────────────────────────────────────────────────

const PAISES_MUNDIAL = {
  A: ["Francia","España","Argentina","Inglaterra","Portugal","Brasil","Países Bajos","Marruecos","Bélgica","Alemania","Croacia","Colombia","Senegal","México","EUA","Uruguay"],
  B: ["Japón","Suiza","Irán","Turquía","Ecuador","Austria","Corea del Sur","Australia","Argelia","Egipto","Canadá","Noruega","Panamá","Costa de Marfil","Suecia","Paraguay"],
  C: ["Rep. Checa","Escocia","Túnez","RD Congo","Uzbekistán","Qatar","Irak","Sudáfrica","Arabia Saudita","Jordania","Bosnia y Herzegovina","Cabo Verde","Ghana","Curazao","Haití","Nueva Zelanda"],
};

const GRUPO_LABELS = { A:"🥇 Grupo A — Top 16", B:"🥈 Grupo B — Medio 16", C:"🥉 Grupo C — Bajo 16" };
const GRUPO_COLORS = { A:"#FFD700", B:"#C0C0C0", C:"#CD7F32" };

// ─── SORTEO VIEW ──────────────────────────────────────────────────────────────

const SorteoView = ({ sorteoResultados, setSorteoResultados, sorteoParticipantesGuardados, setSorteoParticipantesGuardados }) => {
  const [fase, setFase] = useState("registro");
  const [nombreInput, setNombreInput] = useState("");
  const [participantesSorteo, setParticipantesSorteo] = useState(sorteoParticipantesGuardados || []);
  const [participantesRestantes, setParticipantesRestantes] = useState([]);
  const [paisesRestantes, setPaisesRestantes] = useState({ A:[...PAISES_MUNDIAL.A], B:[...PAISES_MUNDIAL.B], C:[...PAISES_MUNDIAL.C] });
  const [participanteActual, setParticipanteActual] = useState(null);
  const [grupoActual, setGrupoActual] = useState("A");
  const [paisesAsignados, setPaisesAsignados] = useState(0);
  const [ganador, setGanador] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [spinIdx, setSpinIdx] = useState(0);
  const [savedGuardar, setSavedGuardar] = useState(false);

  const agregarParticipante = () => {
    const nombre = nombreInput.trim();
    if (!nombre || participantesSorteo.includes(nombre) || participantesSorteo.length >= 16) return;
    setParticipantesSorteo(prev => [...prev, nombre]);
    setNombreInput("");
  };

  const eliminarParticipante = (nombre) => {
    setParticipantesSorteo(prev => prev.filter(p => p !== nombre));
  };

  const iniciarSorteo = () => {
    setParticipantesRestantes([...participantesSorteo]);
    setPaisesRestantes({ A:[...PAISES_MUNDIAL.A], B:[...PAISES_MUNDIAL.B], C:[...PAISES_MUNDIAL.C] });
    setSorteoResultados({});
    setParticipanteActual(null);
    setGrupoActual("A");
    setPaisesAsignados(0);
    setGanador(null);
    setSpinning(false);
    setFase("inicio");
  };

  const reiniciar = () => {
    setFase("registro");
    setParticipantesRestantes([]);
    setPaisesRestantes({ A:[...PAISES_MUNDIAL.A], B:[...PAISES_MUNDIAL.B], C:[...PAISES_MUNDIAL.C] });
    setParticipanteActual(null);
    setGrupoActual("A");
    setPaisesAsignados(0);
    setGanador(null);
    setSpinning(false);
    setSorteoResultados({});
  };

  const girarRuleta = (items, onGanador) => {
    setSpinning(true);
    setGanador(null);
    let idx = 0;
    let speed = 80;
    let total = 0;
    const maxSpins = 20 + Math.floor(Math.random()*15);
    const winnerIdx = Math.floor(Math.random()*items.length);
    const spin = () => {
      setSpinIdx(idx % items.length);
      idx++;
      total++;
      if (total > maxSpins) {
        setSpinIdx(winnerIdx);
        setGanador(items[winnerIdx]);
        setSpinning(false);
        onGanador(items[winnerIdx]);
        return;
      }
      if (total > maxSpins * 0.7) speed = Math.min(speed + 30, 400);
      setTimeout(spin, speed);
    };
    spin();
  };

  const girarParticipante = () => {
    setFase("girando_participante");
    girarRuleta(participantesRestantes, (ganado) => {
      setParticipanteActual(ganado);
      setGrupoActual("A");
      setPaisesAsignados(0);
      setFase("girando_pais");
    });
  };

  const girarPais = () => {
    const paisesGrupo = paisesRestantes[grupoActual];
    girarRuleta(paisesGrupo, (paisGanado) => {
      setSorteoResultados(prev => {
        const curr = prev[participanteActual] || [];
        return { ...prev, [participanteActual]: [...curr, paisGanado] };
      });
      setPaisesRestantes(prev => ({
        ...prev,
        [grupoActual]: prev[grupoActual].filter(p => p !== paisGanado)
      }));
      const newAsignados = paisesAsignados + 1;
      setPaisesAsignados(newAsignados);
      if (newAsignados === 3) {
        const newRestantes = participantesRestantes.filter(p => p !== participanteActual);
        setParticipantesRestantes(newRestantes);
        if (newRestantes.length === 0) setFase("completo");
        else setFase("inicio");
      } else {
        setGrupoActual(newAsignados === 1 ? "B" : "C");
      }
    });
  };

  const items = fase === "girando_participante" ? participantesRestantes : (paisesRestantes[grupoActual] || []);
  const currentItem = items[spinIdx % Math.max(items.length, 1)];
  const GRUPO_NEXT = { 0:"B", 1:"C" };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white" style={{ fontFamily:"'Russo One', sans-serif" }}>🎰 Sorteo de Selecciones</h2>
        <div className="flex gap-2">
          <button onClick={() => { setSorteoParticipantesGuardados(participantesSorteo); setSavedGuardar(true); setTimeout(()=>setSavedGuardar(false),2000); }}
            className="text-xs px-3 py-1.5 rounded-lg cursor-pointer font-bold transition-all"
            style={{ background: savedGuardar?"rgba(0,166,81,0.4)":"rgba(0,166,81,0.2)", color:"#00e676", border:"1px solid rgba(0,166,81,0.4)" }}>
            {savedGuardar ? "✅ Guardado" : "💾 Guardar"}
          </button>
          {fase !== "registro" && (
            <button onClick={reiniciar} className="text-xs px-3 py-1.5 rounded-lg cursor-pointer font-bold transition-all"
              style={{ background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.15)" }}>
              🔄 Reiniciar
            </button>
          )}
        </div>
      </div>

      {/* FASE REGISTRO */}
      {fase === "registro" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input className="flex-1 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none"
              style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", fontFamily:"'Russo One', sans-serif" }}
              placeholder="Nombre del participante..."
              value={nombreInput}
              onChange={e => setNombreInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && agregarParticipante()}
              maxLength={30}
            />
            <button onClick={agregarParticipante}
              disabled={!nombreInput.trim() || participantesSorteo.length >= 16}
              className="px-4 py-2 rounded-xl font-black text-sm cursor-pointer transition-all disabled:opacity-40"
              style={{ background:"#00A651", color:"white", fontFamily:"'Bebas Neue', cursive", fontSize:14 }}>
              + Agregar
            </button>
          </div>
          {participantesSorteo.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-bold" style={{ color:"rgba(255,255,255,0.4)", fontFamily:"'Bebas Neue', cursive", letterSpacing:"0.08em" }}>
                PARTICIPANTES ({participantesSorteo.length}/16)
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {participantesSorteo.map((nombre, i) => (
                  <div key={nombre} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
                    <span className="text-xs font-bold" style={{ color:"rgba(255,255,255,0.4)", minWidth:16 }}>{i+1}.</span>
                    <span className="flex-1 text-sm font-bold text-white truncate" style={{ fontFamily:"'Russo One', sans-serif", fontSize:12 }}>{nombre}</span>
                    <button onClick={() => eliminarParticipante(nombre)} className="text-red-400 hover:text-red-300 text-xs cursor-pointer">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {participantesSorteo.length >= 2 && (
            <button onClick={iniciarSorteo}
              className="w-full py-4 rounded-2xl font-black cursor-pointer transition-all"
              style={{ background:"linear-gradient(135deg, #00A651, #0033FF)", color:"white", fontFamily:"'Bebas Neue', cursive", fontSize:22, letterSpacing:"0.05em", boxShadow:"0 4px 20px rgba(0,166,81,0.4)" }}>
              🎰 INICIAR SORTEO ({participantesSorteo.length} participantes)
            </button>
          )}
        </div>
      )}

      {/* BOMBOS */}
      {fase !== "registro" && (
        <div className="grid grid-cols-3 gap-2">
          {["A","B","C"].map(g => (
            <div key={g} className="rounded-xl p-2" style={{ background:`${GRUPO_COLORS[g]}10`, border:`1px solid ${GRUPO_COLORS[g]}33` }}>
              <p className="text-xs font-bold text-center mb-1.5" style={{ color:GRUPO_COLORS[g], fontFamily:"'Bebas Neue', cursive", fontSize:10, letterSpacing:"0.06em" }}>
                {GRUPO_LABELS[g].split("—")[1]?.trim()}
              </p>
              <div className="space-y-0.5 max-h-40 overflow-y-auto thin-scroll">
                {PAISES_MUNDIAL[g].map(pais => {
                  const usado = !paisesRestantes[g]?.includes(pais);
                  return (
                    <p key={pais} style={{ color: usado ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.75)", textDecoration: usado ? "line-through" : "none", fontSize:9, fontFamily:"'DM Sans', sans-serif", padding:"1px 4px" }}>{pais}</p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RULETA */}
      {(fase==="girando_participante" || fase==="girando_pais") && (
        <div className="rounded-2xl p-6 text-center space-y-3" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)" }}>
          {participanteActual && fase==="girando_pais" && (
            <p className="text-sm font-bold" style={{ color:GRUPO_COLORS[grupoActual] }}>
              Sorteando {GRUPO_LABELS[grupoActual].split("—")[1]} para <span className="text-white">{participanteActual}</span>
            </p>
          )}
          {fase==="girando_participante" && <p className="text-sm text-zinc-400">Sorteando siguiente participante...</p>}
          <div className="rounded-xl py-4 px-6 mx-auto" style={{ background:"rgba(0,0,0,0.4)", border:`2px solid ${fase==="girando_pais" ? GRUPO_COLORS[grupoActual] : "#fff"}`, maxWidth:300 }}>
            <p className="font-black truncate" style={{ fontFamily:"'Bebas Neue', cursive", fontSize:22, letterSpacing:"0.05em", color: ganador ? (fase==="girando_pais" ? GRUPO_COLORS[grupoActual] : "#FFD700") : "white" }}>
              {ganador || currentItem || "..."}
            </p>
          </div>
          {!spinning && ganador && fase==="girando_pais" && paisesAsignados < 3 && (
            <button onClick={girarPais}
              className="px-6 py-2 rounded-xl font-black cursor-pointer transition-all"
              style={{ background:GRUPO_COLORS[GRUPO_NEXT[paisesAsignados-1]]||"#fff", color:"#000", fontFamily:"'Bebas Neue', cursive", fontSize:15 }}>
              Girar {GRUPO_LABELS[GRUPO_NEXT[paisesAsignados-1]]?.split("—")[0]||""}
            </button>
          )}
        </div>
      )}

      {/* BOTÓN GIRAR PARTICIPANTE */}
      {fase==="inicio" && participantesRestantes.length > 0 && (
        <button onClick={girarParticipante}
          className="w-full py-4 rounded-2xl font-black cursor-pointer transition-all"
          style={{ background:"linear-gradient(135deg, #00A651, #0033FF)", color:"white", fontFamily:"'Bebas Neue', cursive", fontSize:22, letterSpacing:"0.05em", boxShadow:"0 4px 20px rgba(0,166,81,0.4)" }}>
          🎰 GIRAR — {participantesRestantes.length} participantes restantes
        </button>
      )}

      {/* RESULTADOS */}
      {Object.keys(sorteoResultados).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily:"'Bebas Neue', cursive", fontSize:12, color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em" }}>Resultados del sorteo</p>
          {Object.entries(sorteoResultados).map(([nombre, paises]) => (
            <div key={nombre} className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)" }}>
              <span className="font-bold text-white text-sm flex-1" style={{ fontFamily:"'Russo One', sans-serif" }}>{nombre}</span>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {paises.map((pais, i) => (
                  <span key={pais} className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background:`${["#00A651","#C0C0C0","#CD7F32"][i]}22`, color:["#00ff87","#e0e0e0","#f0a060"][i], border:`1px solid ${["#00A651","#C0C0C0","#CD7F32"][i]}44` }}>
                    {pais}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {fase==="completo" && (
        <div className="text-center py-4 rounded-2xl" style={{ background:"rgba(0,166,81,0.1)", border:"1px solid rgba(0,166,81,0.3)" }}>
          <p className="text-2xl mb-1">🏆</p>
          <p className="font-black text-white" style={{ fontFamily:"'Luckiest Guy', cursive", fontSize:18 }}>¡Sorteo completado!</p>
          <p className="text-xs text-zinc-500 mt-1">Todos los participantes tienen sus 3 selecciones</p>
        </div>
      )}
    </div>
  );
};


const AdminView = ({ partidos, setPartidos, bonus, setBonus, participantes, setParticipantes, jornadasBloqueadas, setJornadasBloqueadas, jornadasVisibles, setJornadasVisibles, premioVisible, setPremioVisible, premioTexto, setPremioTexto }) => {
  const [authed, setAuthed] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminTab, setAdminTab] = useState("control");
  const [sorteoResultados, setSorteoResultados] = useLocalData("quiniela_sorteo_resultados", {});
  const [sorteoParticipantes, setSorteoParticipantes] = useLocalData("quiniela_sorteo_participantes", []);
  const [jornadaActiva, setJornadaActiva] = useState("j1");
  const [editingId, setEditingId] = useState(null);
  const [editLocal, setEditLocal] = useState("");
  const [editVisita, setEditVisita] = useState("");
  const [showAddPartido, setShowAddPartido] = useState(false);
  const [newLocal, setNewLocal] = useState("");
  const [newVisita, setNewVisita] = useState("");
  const [editingBonusId, setEditingBonusId] = useState(null);
  const [editBonusTxt, setEditBonusTxt] = useState("");
  const [editBonusOps, setEditBonusOps] = useState([]);
  const [showAddBonus, setShowAddBonus] = useState(false);
  const [newBonusTxt, setNewBonusTxt] = useState("");
  const [newBonusOps, setNewBonusOps] = useState(["",""]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteBonusId, setConfirmDeleteBonusId] = useState(null);
  const [editingPremio, setEditingPremio] = useState(false);
  const [premioEdit, setPremioEdit] = useState(premioTexto);
  const ADMIN_PASS = "mundial2026";

  if (!authed) return (
    <div className="max-w-sm mx-auto py-12 space-y-4">
      <div className="text-center space-y-2"><div className="text-4xl">🔐</div><h2 className="text-xl font-black text-white">Panel de Organizador</h2></div>
      <div className="relative">
        <input type={showAdminPass ? "text" : "password"}
          className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 pr-12"
          placeholder="Contraseña..." value={passInput} onChange={e => setPassInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && passInput===ADMIN_PASS && setAuthed(true)} />
        <button onClick={() => setShowAdminPass(!showAdminPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer text-sm">
          {showAdminPass ? "🙈" : "👁️"}
        </button>
      </div>
      {passInput.length > 0 && passInput !== ADMIN_PASS && <p className="text-xs text-red-400 text-center">Contraseña incorrecta</p>}
      <Btn onClick={() => passInput===ADMIN_PASS && setAuthed(true)} disabled={passInput!==ADMIN_PASS}>Entrar →</Btn>
    </div>
  );

  const jornadaInfo = JORNADAS.find(j => j.id === jornadaActiva);
  const jornadaPartidos = partidos.filter(p => p.jornada === jornadaActiva);
  const jornadaBonus = (jornadaInfo?.hasBonus && bonus[jornadaActiva]) ? bonus[jornadaActiva] : [];

  const toggleBloqueada = (jid) => setJornadasBloqueadas(prev => prev.includes(jid)?prev.filter(x=>x!==jid):[...prev,jid]);
  const toggleVisible = (jid) => setJornadasVisibles(prev => prev.includes(jid)?prev.filter(x=>x!==jid):[...prev,jid]);
  const setResultado = (id,res) => setPartidos(prev => prev.map(p => p.id===id?{...p,resultado:p.resultado===res?null:res}:p));
  const setResultadoBonus = (id,res) => setBonus(prev => { const u={...prev}; u[jornadaActiva]=(u[jornadaActiva]||[]).map(b=>b.id===id?{...b,resultado:b.resultado===res?null:res}:b); return u; });
  const toggleEspecial = (id) => setPartidos(prev => prev.map(p => { if(p.jornada!==jornadaActiva) return p; return p.id===id?{...p,especial:!p.especial}:{...p,especial:false}; }));
  const startEdit = (p) => { setEditingId(p.id); setEditLocal(p.local||""); setEditVisita(p.visita||""); };
  const saveEdit = (id) => { setPartidos(prev => prev.map(p=>p.id===id?{...p,local:editLocal.trim(),visita:editVisita.trim()}:p)); setEditingId(null); };
  const deletePartido = (id) => { setPartidos(prev=>prev.filter(p=>p.id!==id)); setConfirmDeleteId(null); };
  const addPartido = () => {
    if (!newLocal.trim()||!newVisita.trim()) return;
    setPartidos(prev=>[...prev,{id:Date.now(),jornada:jornadaActiva,local:newLocal.trim(),visita:newVisita.trim(),especial:false,resultado:null,esBonus:false}]);
    setNewLocal(""); setNewVisita(""); setShowAddPartido(false);
  };
  const deleteParticipante = (id) => setParticipantes(prev=>prev.filter(p=>p.id!==id));
  const startEditBonus = (b) => { setEditingBonusId(b.id); setEditBonusTxt(b.texto); setEditBonusOps([...b.opciones]); };
  const saveEditBonus = () => { setBonus(prev=>{const u={...prev};u[jornadaActiva]=(u[jornadaActiva]||[]).map(b=>b.id===editingBonusId?{...b,texto:editBonusTxt.trim(),opciones:editBonusOps.filter(o=>o.trim())}:b);return u;}); setEditingBonusId(null); };
  const deleteBonus = (id) => { setBonus(prev=>{const u={...prev};u[jornadaActiva]=(u[jornadaActiva]||[]).filter(b=>b.id!==id);return u;}); setConfirmDeleteBonusId(null); };
  const addBonus = () => {
    const ops=newBonusOps.filter(o=>o.trim());
    if (!newBonusTxt.trim()||ops.length<2) return;
    setBonus(prev=>({...prev,[jornadaActiva]:[...(prev[jornadaActiva]||[]),{id:`bonus_${jornadaActiva}_${Date.now()}`,jornada:jornadaActiva,esBonus:true,texto:newBonusTxt.trim(),opciones:ops,resultado:null}]}));
    setNewBonusTxt(""); setNewBonusOps(["",""]); setShowAddBonus(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">Panel Organizador</h2>
        <Badge color="red">Admin</Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[{label:"Participantes",value:participantes.length},{label:"Resultados",value:[...partidos,...(bonus.tercero||[]),...(bonus.final||[])].filter(p=>p.resultado).length},{label:"Bolsa estimada",value:`$${participantes.length*200}`}].map(s=>(
          <div key={s.label} className="bg-zinc-800/60 rounded-xl p-3 text-center border border-zinc-700/30">
            <p className="text-xl font-black text-emerald-400">{s.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-0 border-b border-zinc-700 overflow-x-auto">
        {[{id:"control",label:"🎛️ Control"},{id:"resultados",label:"📋 Resultados"},{id:"editar",label:"✏️ Partidos"},{id:"participantes",label:"👥 Participantes"},{id:"sorteo",label:"🎰 Sorteo"}].map(t=>(
          <button key={t.id} onClick={()=>setAdminTab(t.id)}
            className={`shrink-0 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${adminTab===t.id?"text-emerald-600 border-b-2 border-emerald-500":"text-zinc-500 hover:text-zinc-600"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CONTROL ── */}
      {adminTab==="control" && (
        <div className="space-y-4">
          {/* Premio */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-amber-300">🏆 Premio</p>
              <div className="flex gap-2">
                <button onClick={()=>setPremioVisible(!premioVisible)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${premioVisible?"bg-emerald-600 text-white":"bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
                  {premioVisible?"👁️ Visible":"🙈 Oculto"}
                </button>
                <button onClick={()=>{setEditingPremio(!editingPremio);setPremioEdit(premioTexto);}}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-all cursor-pointer">
                  ✏️ Editar
                </button>
              </div>
            </div>
            {editingPremio ? (
              <div className="space-y-2">
                <textarea className="w-full bg-zinc-900/80 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500 resize-none"
                  rows={3} value={premioEdit} onChange={e=>setPremioEdit(e.target.value)}
                  placeholder="Ej: 1er lugar: $2,400 · 2do lugar: $800 · 3er lugar: 10 quinielas gratis" />
                <div className="flex gap-2">
                  <Btn onClick={()=>{setPremioTexto(premioEdit);setEditingPremio(false);}} size="sm">Guardar ✓</Btn>
                  <Btn onClick={()=>setEditingPremio(false)} size="sm" variant="ghost">Cancelar</Btn>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-300">{premioTexto||<span className="text-zinc-600 italic">Sin definir todavía</span>}</p>
            )}
          </div>

          {/* Jornadas */}
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Control por jornada</p>
          <div className="space-y-2">
            {JORNADAS.map(j=>{
              const bloq=jornadasBloqueadas.includes(j.id);
              const vis=jornadasVisibles.includes(j.id);
              return (
                <div key={j.id} className="flex items-center justify-between bg-zinc-800/40 border border-zinc-700/30 rounded-xl px-4 py-3">
                  <span className="font-bold text-white text-sm">{j.label}</span>
                  <div className="flex gap-2">
                    <button onClick={()=>toggleBloqueada(j.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${bloq?"bg-red-600 text-white":"bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
                      {bloq?"🔒 Bloqueada":"🔓 Abierta"}
                    </button>
                    <button onClick={()=>toggleVisible(j.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${vis?"bg-emerald-600 text-white":"bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
                      {vis?"👁️ Visible":"🙈 Oculta"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-zinc-600">🔒 Bloqueada = sin edición · 👁️ Visible = pronósticos visibles en tabla comparativa</p>
        </div>
      )}

      {/* ── RESULTADOS ── */}
      {adminTab==="resultados" && (
        <div className="space-y-3">
          <JornadaTabs jornadaActiva={jornadaActiva} setJornadaActiva={setJornadaActiva} partidos={partidos} bonus={bonus} mode="resultados" />
          <div className="space-y-2">
            {jornadaPartidos.map(p=>(
              <div key={p.id} className={`rounded-xl p-3 border ${p.especial?"bg-purple-500/5 border-purple-500/30":"bg-zinc-800/40 border-zinc-700/30"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <button onClick={()=>toggleEspecial(p.id)} className={`text-xs px-2 py-0.5 rounded-full border transition-all cursor-pointer ${p.especial?"bg-purple-500/20 text-purple-300 border-purple-500/30":"bg-zinc-800 text-zinc-600 border-zinc-700 hover:border-purple-500/50"}`}>⭐ 2pts</button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex-1 text-right text-sm font-bold text-white truncate"><FlagImg nombre={p.local} size={20} /> {p.local||"—"}</span>
                  <div className="flex gap-1 shrink-0">
                    {[{k:"L"},{k:"E"},{k:"V"}].map(opt=>(
                      <button key={opt.k} onClick={()=>setResultado(p.id,opt.k)} title={opt.k==="L"?p.local:opt.k==="E"?"Empate":p.visita}
                        className={`w-10 h-10 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          p.resultado===opt.k
                            ? opt.k==="L"?"bg-purple-600 text-white ring-2 ring-purple-400 scale-110"
                            : opt.k==="E"?"bg-orange-500 text-white ring-2 ring-orange-400 scale-110"
                            :"bg-lime-500 text-black ring-2 ring-lime-400 scale-110"
                            :"bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:scale-105"
                        }`}>{opt.k}</button>
                    ))}
                  </div>
                  <span className="flex-1 text-left text-sm font-bold text-white truncate">{p.visita||"—"} <FlagImg nombre={p.visita} size={20} /></span>
                </div>
              </div>
            ))}
            {jornadaBonus.length>0&&(
              <div className="pt-2 space-y-2">
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Preguntas Bonus</p>
                {jornadaBonus.map(b=>(
                  <div key={b.id} className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 space-y-2">
                    <div className="flex items-center gap-2"><Badge color="gold">BONUS</Badge><span className="text-sm text-white">{b.texto}</span></div>
                    <div className="flex gap-2 flex-wrap">
                      {b.opciones.map(op=>(
                        <button key={op} onClick={()=>setResultadoBonus(b.id,op)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${b.resultado===op?"bg-amber-500 text-black":"bg-zinc-800 text-zinc-500 hover:bg-zinc-700 border border-zinc-700"}`}>{op}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── EDITAR PARTIDOS ── */}
      {adminTab==="editar"&&(
        <div className="space-y-3">
          <JornadaTabs jornadaActiva={jornadaActiva} setJornadaActiva={setJornadaActiva} partidos={partidos} bonus={bonus} mode="editar" />
          <div className="space-y-2">
            {jornadaPartidos.map(p=>(
              <div key={p.id} className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    {editingId===p.id?(
                      <div className="space-y-2">
                        <div className="flex gap-2 items-end">
                          <div className="flex-1 space-y-1"><p className="text-xs text-zinc-500 font-bold uppercase">Local</p>
                            <input className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500" value={editLocal} onChange={e=>setEditLocal(e.target.value)} placeholder="Equipo local..." /></div>
                          <div className="text-zinc-600 font-black pb-2">vs</div>
                          <div className="flex-1 space-y-1"><p className="text-xs text-zinc-500 font-bold uppercase">Visita</p>
                            <input className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500" value={editVisita} onChange={e=>setEditVisita(e.target.value)} placeholder="Equipo visita..." /></div>
                        </div>
                        <div className="flex gap-2"><Btn onClick={()=>saveEdit(p.id)} size="sm" disabled={!editLocal.trim()||!editVisita.trim()}>Guardar ✓</Btn><Btn onClick={()=>setEditingId(null)} size="sm" variant="ghost">Cancelar</Btn></div>
                      </div>
                    ):(
                      <div className="flex items-center gap-2">
                        {p.especial&&<Badge color="blue">⭐</Badge>}
                        <span className="flex-1 text-right text-sm font-bold text-white truncate">{p.local||<span className="text-zinc-600 italic">Sin definir</span>}</span>
                        <span className="text-zinc-600 text-xs font-black shrink-0">vs</span>
                        <span className="flex-1 text-left text-sm font-bold text-white truncate">{p.visita||<span className="text-zinc-600 italic">Sin definir</span>}</span>
                        <button onClick={()=>startEdit(p)} className="shrink-0 text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-lg cursor-pointer font-bold">✏️</button>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    {confirmDeleteId===p.id?(
                      <div className="flex gap-1 items-center">
                        <span className="text-xs text-red-400">¿Eliminar?</span>
                        <button onClick={()=>deletePartido(p.id)} className="text-xs px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg cursor-pointer font-bold">Sí</button>
                        <button onClick={()=>setConfirmDeleteId(null)} className="text-xs px-2 py-1 bg-zinc-700 text-zinc-300 rounded-lg cursor-pointer font-bold">No</button>
                      </div>
                    ):(
                      <button onClick={()=>setConfirmDeleteId(p.id)} className="text-xs px-2 py-1 bg-red-900/40 hover:bg-red-800/60 text-red-400 rounded-lg cursor-pointer font-bold mt-0.5">✕</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {showAddPartido?(
              <div className="bg-zinc-800/60 border border-emerald-700/30 rounded-xl p-4 space-y-3">
                <p className="text-sm font-bold text-emerald-400">➕ Nuevo partido</p>
                <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1"><p className="text-xs text-zinc-500 font-bold uppercase">Local</p><input className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500" value={newLocal} onChange={e=>setNewLocal(e.target.value)} placeholder="Equipo local..." /></div>
                  <div className="text-zinc-600 font-black pb-2">vs</div>
                  <div className="flex-1 space-y-1"><p className="text-xs text-zinc-500 font-bold uppercase">Visita</p><input className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500" value={newVisita} onChange={e=>setNewVisita(e.target.value)} placeholder="Equipo visita..." /></div>
                </div>
                <div className="flex gap-2"><Btn onClick={addPartido} size="sm" disabled={!newLocal.trim()||!newVisita.trim()}>Agregar ✓</Btn><Btn onClick={()=>{setShowAddPartido(false);setNewLocal("");setNewVisita("");}} size="sm" variant="ghost">Cancelar</Btn></div>
              </div>
            ):(
              <button onClick={()=>setShowAddPartido(true)} className="w-full py-3 rounded-xl border border-dashed border-zinc-600 text-zinc-500 hover:border-emerald-500 hover:text-emerald-400 transition-all cursor-pointer text-sm font-bold">
                ➕ Agregar partido a {jornadaInfo?.label}
              </button>
            )}
            {jornadaInfo?.hasBonus&&(
              <div className="pt-3 space-y-2">
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Preguntas Bonus</p>
                {jornadaBonus.map(b=>(
                  <div key={b.id} className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        {editingBonusId===b.id?(
                          <div className="space-y-3">
                            <div><p className="text-xs text-zinc-500 font-bold uppercase mb-1">Pregunta</p><input className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" value={editBonusTxt} onChange={e=>setEditBonusTxt(e.target.value)} /></div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between"><p className="text-xs text-zinc-500 font-bold uppercase">Opciones</p>{editBonusOps.length<3&&<button onClick={()=>setEditBonusOps([...editBonusOps,""])} className="text-xs text-amber-400 cursor-pointer">+ Agregar</button>}</div>
                              {editBonusOps.map((op,i)=>(
                                <div key={i} className="flex gap-2"><input className="flex-1 bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500" value={op} onChange={e=>{const n=[...editBonusOps];n[i]=e.target.value;setEditBonusOps(n);}} placeholder={`Opción ${i+1}...`} />{editBonusOps.length>2&&<button onClick={()=>setEditBonusOps(editBonusOps.filter((_,j)=>j!==i))} className="text-red-400 px-2 cursor-pointer">✕</button>}</div>
                              ))}
                            </div>
                            <div className="flex gap-2"><Btn onClick={saveEditBonus} size="sm" disabled={!editBonusTxt.trim()||editBonusOps.filter(o=>o.trim()).length<2}>Guardar ✓</Btn><Btn onClick={()=>setEditingBonusId(null)} size="sm" variant="ghost">Cancelar</Btn></div>
                          </div>
                        ):(
                          <div className="flex items-start gap-2">
                            <div className="flex-1 space-y-1"><p className="text-sm text-white font-medium">{b.texto}</p><div className="flex gap-1.5 flex-wrap">{b.opciones.map(op=><span key={op} className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-500 rounded-full border border-zinc-700">{op}</span>)}</div></div>
                            <button onClick={()=>startEditBonus(b)} className="text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-lg cursor-pointer font-bold shrink-0">✏️</button>
                          </div>
                        )}
                      </div>
                      <div className="shrink-0">
                        {confirmDeleteBonusId===b.id?(
                          <div className="flex gap-1 items-center"><span className="text-xs text-red-400">¿Eliminar?</span><button onClick={()=>deleteBonus(b.id)} className="text-xs px-2 py-1 bg-red-600 text-white rounded-lg cursor-pointer font-bold">Sí</button><button onClick={()=>setConfirmDeleteBonusId(null)} className="text-xs px-2 py-1 bg-zinc-700 text-zinc-300 rounded-lg cursor-pointer font-bold">No</button></div>
                        ):(
                          <button onClick={()=>setConfirmDeleteBonusId(b.id)} className="text-xs px-2 py-1 bg-red-900/40 hover:bg-red-800/60 text-red-400 rounded-lg cursor-pointer font-bold mt-0.5">✕</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {showAddBonus?(
                  <div className="bg-amber-500/5 border border-amber-700/30 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-bold text-amber-400">➕ Nueva pregunta bonus</p>
                    <div><p className="text-xs text-zinc-500 font-bold uppercase mb-1">Pregunta</p><input className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" value={newBonusTxt} onChange={e=>setNewBonusTxt(e.target.value)} placeholder="Escribe la pregunta..." /></div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between"><p className="text-xs text-zinc-500 font-bold uppercase">Opciones ({newBonusOps.length})</p>{newBonusOps.length<3&&<button onClick={()=>setNewBonusOps([...newBonusOps,""])} className="text-xs text-amber-400 cursor-pointer">+ Agregar</button>}</div>
                      {newBonusOps.map((op,i)=>(
                        <div key={i} className="flex gap-2"><input className="flex-1 bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500" value={op} onChange={e=>{const n=[...newBonusOps];n[i]=e.target.value;setNewBonusOps(n);}} placeholder={`Opción ${i+1}...`} />{newBonusOps.length>2&&<button onClick={()=>setNewBonusOps(newBonusOps.filter((_,j)=>j!==i))} className="text-red-400 px-2 cursor-pointer">✕</button>}</div>
                      ))}
                    </div>
                    <div className="flex gap-2"><Btn onClick={addBonus} size="sm" disabled={!newBonusTxt.trim()||newBonusOps.filter(o=>o.trim()).length<2}>Agregar ✓</Btn><Btn onClick={()=>{setShowAddBonus(false);setNewBonusTxt("");setNewBonusOps(["",""]);}} size="sm" variant="ghost">Cancelar</Btn></div>
                  </div>
                ):(
                  <button onClick={()=>setShowAddBonus(true)} className="w-full py-3 rounded-xl border border-dashed border-amber-800/40 text-zinc-500 hover:border-amber-500 hover:text-amber-400 transition-all cursor-pointer text-sm font-bold">➕ Agregar pregunta bonus</button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SORTEO ── */}
      {adminTab==="sorteo" && (
        <SorteoView participantes={participantes} sorteoResultados={sorteoResultados} setSorteoResultados={setSorteoResultados} sorteoParticipantesGuardados={sorteoParticipantes} setSorteoParticipantesGuardados={setSorteoParticipantes} />
      )}

      {/* ── PARTICIPANTES ── */}
      {adminTab==="participantes"&&(
        <div className="space-y-1.5">
          {participantes.length===0?(
            <p className="text-zinc-600 text-sm py-4 text-center">Ninguno registrado aún</p>
          ):participantes.map(p=>{
            const {total}=calcPuntos(p.pronosticos,partidos,bonus);
            return (
              <div key={p.id} className="flex items-center justify-between bg-zinc-800/40 rounded-xl px-4 py-2.5 border border-zinc-700/30">
                <span className="text-white font-medium text-sm">{p.nombre}</span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold text-sm">{total} pts</span>
                  <button onClick={()=>deleteParticipante(p.id)} className="text-red-500 hover:text-red-400 text-xs cursor-pointer font-bold">✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState("tabla");
  const [loading, setLoading] = useState(true);
  const [participantes, setParticipantes] = useState([]);
  const [partidos, setPartidos] = useState(PARTIDOS_INICIALES);
  const [bonus, setBonus] = useState(BONUS_INICIALES);
  const [jornadasBloqueadas, setJornadasBloqueadas] = useState([]);
  const [jornadasVisibles, setJornadasVisibles] = useState([]);
  const [premioVisible, setPremioVisible] = useState(false);
  const [premioTexto, setPremioTexto] = useState("");

  // ── LOAD FROM SUPABASE ──────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
      try {
        // Load participantes
        const { data: parts } = await supabase.from('participantes').select('*');
        if (parts && parts.length > 0) {
          setParticipantes(parts.map(p => ({ id: p.id, nombre: p.nombre, password: p.password, pronosticos: p.pronosticos || {} })));
        }
        // Load partidos
        const { data: pars } = await supabase.from('partidos').select('*');
        if (pars && pars.length > 0) {
          setPartidos(pars.map(p => ({ id: p.id, jornada: p.jornada, local: p.local, visita: p.visita, especial: p.especial, resultado: p.resultado, esBonus: p.es_bonus, texto: p.texto, opciones: p.opciones })));
        }
        // Load bonus
        const { data: bon } = await supabase.from('bonus').select('*');
        if (bon && bon.length > 0) {
          const bonusObj = { tercero: [], final: [] };
          bon.forEach(b => {
            if (b.jornada === 'tercero') bonusObj.tercero.push({ id: b.id, jornada: b.jornada, esBonus: true, texto: b.texto, opciones: b.opciones, resultado: b.resultado });
            if (b.jornada === 'final') bonusObj.final.push({ id: b.id, jornada: b.jornada, esBonus: true, texto: b.texto, opciones: b.opciones, resultado: b.resultado });
          });
          if (bonusObj.tercero.length > 0 || bonusObj.final.length > 0) setBonus(bonusObj);
        }
        // Load config
        const { data: conf } = await supabase.from('configuracion').select('*');
        if (conf) {
          conf.forEach(c => {
            if (c.clave === 'jornadas_bloqueadas') setJornadasBloqueadas(c.valor || []);
            if (c.clave === 'jornadas_visibles') setJornadasVisibles(c.valor || []);
            if (c.clave === 'premio_visible') setPremioVisible(c.valor === true || c.valor === 'true');
            if (c.clave === 'premio_texto') setPremioTexto(c.valor || '');
          });
        }
      } catch(e) { console.error('Load error:', e); }
      setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
    // Realtime subscriptions
    const sub = supabase.channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participantes' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'partidos' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bonus' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'configuracion' }, loadAll)
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  // ── SAVE HELPERS ────────────────────────────────────────────────────────────
  const saveParticipante = async (p) => {
    const { error } = await supabase.from('participantes')
      .upsert({ nombre: p.nombre, password: p.password, pronosticos: p.pronosticos || {} }, { onConflict: 'nombre', ignoreDuplicates: false });
    if (error) console.error('saveParticipante error:', error);
  };
  const savePartido = async (p) => {
    const { error } = await supabase.from('partidos').upsert(
      { id: p.id, jornada: p.jornada, local: p.local, visita: p.visita, especial: p.especial || false, resultado: p.resultado || null, es_bonus: p.esBonus || false, texto: p.texto || null, opciones: p.opciones || null },
      { onConflict: 'id' }
    );
    if (error) console.error('savePartido error:', error);
  };
  const saveBonus = async (b) => {
    await supabase.from('bonus').upsert({ id: b.id, jornada: b.jornada, texto: b.texto, opciones: b.opciones, resultado: b.resultado });
  };
  const saveConfig = async (clave, valor) => {
    await supabase.from('configuracion').upsert({ clave, valor });
  };

  // Wrapped setters that also save to Supabase
  const setParticipantesDB = async (fn) => {
    const next = typeof fn === 'function' ? fn(participantes) : fn;
    setParticipantes(next);
    for (const p of next) await saveParticipante(p);
  };
  const setPartidosDB = async (fn) => {
    const prev = partidos;
    const next = typeof fn === 'function' ? fn(prev) : fn;
    setPartidos(next);
    // Only save changed partidos
    for (const p of next) {
      const old = prev.find(x => x.id === p.id);
      const changed = !old || JSON.stringify(old) !== JSON.stringify(p);
      if (changed) await savePartido(p);
    }
    // Delete removed partidos
    for (const p of prev) {
      if (!next.find(x => x.id === p.id)) {
        await supabase.from('partidos').delete().eq('id', p.id);
      }
    }
  };
  const setBonusDB = async (fn) => {
    const next = typeof fn === 'function' ? fn(bonus) : fn;
    setBonus(next);
    const allBonus = [...(next.tercero||[]), ...(next.final||[])];
    for (const b of allBonus) await saveBonus(b);
  };
  const setJornadasBloqueadasDB = async (fn) => {
    const next = typeof fn === 'function' ? fn(jornadasBloqueadas) : fn;
    setJornadasBloqueadas(next);
    await saveConfig('jornadas_bloqueadas', next);
  };
  const setJornadasVisiblesDB = async (fn) => {
    const next = typeof fn === 'function' ? fn(jornadasVisibles) : fn;
    setJornadasVisibles(next);
    await saveConfig('jornadas_visibles', next);
  };
  const setPremioVisibleDB = async (val) => {
    setPremioVisible(val);
    await saveConfig('premio_visible', val);
  };
  const setPremioTextooDB = async (val) => {
    setPremioTexto(val);
    await saveConfig('premio_texto', val);
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <div style={{ fontSize:40 }}>⚽</div>
      <p style={{ color:'white', fontFamily:"'Bebas Neue', cursive", fontSize:20, letterSpacing:'0.1em' }}>Cargando La Quinielinha...</p>
    </div>
  );

  return (
    <div className="min-h-screen text-white" style={{
      fontFamily:"'DM Sans', sans-serif",
      minHeight:"100vh",
      background:"#000000",
      backgroundImage:[
        "radial-gradient(ellipse 80% 70% at 0% 0%, rgba(0,166,81,0.75) 0%, transparent 70%)",
        "radial-gradient(ellipse 80% 70% at 100% 0%, rgba(0,51,255,0.75) 0%, transparent 70%)",
        "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(255,0,0,0.5) 0%, transparent 70%)",
        "radial-gradient(ellipse 60% 50% at 100% 100%, rgba(174,204,0,0.5) 0%, transparent 70%)"
      ].join(",")
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Shrikhand&family=League+Spartan:wght@700;900&family=Luckiest+Guy&family=Rye&family=Black+Han+Sans&family=Barlow+Condensed:wght@700;900&family=Russo+One&family=Rajdhani:wght@700&family=Bebas+Neue&family=Raleway:wght@600;700&family=Rokkitt:wght@600;700&display=swap" rel="stylesheet" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@700&family=Bebas+Neue&family=Raleway:wght@600;700&family=Rokkitt:wght@600;700&display=swap');
        .rajdhani { font-family: 'Rajdhani', sans-serif !important; font-weight: 700 !important; font-size: 14px !important; }
        .thin-scroll::-webkit-scrollbar { height: 4px; }
        .thin-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 2px; }
        .thin-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 2px; }
        .thin-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.5); }
      `}</style>
      <div style={{
        background:"#006400",
        borderBottom:"3px solid #004d00",
        backgroundImage:[
          "radial-gradient(circle at 15% 50%, rgba(255,255,255,0.06) 0%, transparent 45%)",
          "radial-gradient(circle at 85% 50%, rgba(255,255,255,0.06) 0%, transparent 45%)",
          "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 60%)",
          "repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 12px)",
          "repeating-linear-gradient(-45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 12px)"
        ].join(",")
      }}>
        <div style={{ borderTop:"2px solid rgba(255,255,255,0.15)", borderBottom:"2px solid rgba(0,0,0,0.15)" }}>
        <div className="max-w-2xl mx-auto px-3 py-3">
          <div className="relative" style={{ height:100 }}>
            <img src="data:image/png;base64,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" alt="Logo"
              style={{ position:"absolute", left:"calc(83% - 43px)", top:"calc(66px - 43px)", width:86, height:86, zIndex:1, flexShrink:0 }} />
            <svg viewBox="0 0 380 100" style={{ width:"100%", height:100, position:"absolute", top:0, left:0, zIndex:2 }}>
              <defs><path id="arcTitle" d="M 5,92 Q 190,50 375,92" /></defs>
              <text style={{ fontFamily:"'Shrikhand', cursive", fontSize:48, fill:"none", stroke:"#000000", strokeWidth:10, strokeLinejoin:"round" }}>
                <textPath href="#arcTitle" textAnchor="middle" startOffset="50%">La Quinielinha</textPath>
              </text>
              <text style={{ fontFamily:"'Shrikhand', cursive", fontSize:48, fill:"white" }}>
                <textPath href="#arcTitle" textAnchor="middle" startOffset="50%">La Quinielinha</textPath>
              </text>
            </svg>
          </div>
          <p className="text-center text-xs mt-1" style={{ color:"#a3f7c0" }}>{participantes.length} participantes · Mundial 2026</p>
        </div>
        </div>
      </div>
      <div className="sticky top-0 z-10 backdrop-blur" style={{ background:"transparent" }}>
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex gap-2 p-1 rounded-2xl" style={{ background:"rgba(255,255,255,0.07)" }}>
            {[{id:"tabla",label:"🏆 Tabla"},{id:"pronosticos",label:"⚽ Pronósticos"},{id:"admin",label:"🔐 Admin"}].map(t=>(
              <button key={t.id} onClick={()=>setView(t.id)}
                className="flex-1 py-2 text-sm font-bold transition-all duration-200 cursor-pointer rounded-xl"
                style={{
                  fontFamily:"'Bebas Neue', cursive",
                  letterSpacing:"0.08em",
                  fontSize: 15,
                  background: view===t.id ? "rgba(255,255,255,0.15)" : "transparent",
                  color: view===t.id ? "#ffffff" : "rgba(255,255,255,0.45)",
                  boxShadow: view===t.id ? "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" : "none",
                  border: view===t.id ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {view==="tabla"&&<TablaView participantes={participantes} partidos={partidos} bonus={bonus} jornadasVisibles={jornadasVisibles} premioVisible={premioVisible} premioTexto={premioTexto} />}
        {view==="pronosticos"&&<PronosticosView participantes={participantes} setParticipantes={setParticipantesDB} partidos={partidos} bonus={bonus} jornadasBloqueadas={jornadasBloqueadas} />}
        {view==="admin"&&<AdminView partidos={partidos} setPartidos={setPartidosDB} bonus={bonus} setBonus={setBonusDB} participantes={participantes} setParticipantes={setParticipantesDB} jornadasBloqueadas={jornadasBloqueadas} setJornadasBloqueadas={setJornadasBloqueadasDB} jornadasVisibles={jornadasVisibles} setJornadasVisibles={setJornadasVisiblesDB} premioVisible={premioVisible} setPremioVisible={setPremioVisibleDB} premioTexto={premioTexto} setPremioTexto={setPremioTextooDB} />}
      </div>
    </div>
  );
}
