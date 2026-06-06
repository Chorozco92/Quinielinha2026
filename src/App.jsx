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
        <img src="data:image/webp;base64,UklGRvKJAABXRUJQVlA4WAoAAAAgAAAATwUATwUASUNDUMgBAAAAAAHIbGNtcwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABzYXdzY3RybAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWhhbmSdkQA9QICwPUB0LIGepSKOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAF9jcHJ0AAABDAAAAAx3dHB0AAABGAAAABRyWFlaAAABLAAAABRnWFlaAAABQAAAABRiWFlaAAABVAAAABRyVFJDAAABaAAAAGBnVFJDAAABaAAAAGBiVFJDAAABaAAAAGBkZXNjAAAAAAAAAAV1UkdCAAAAAAAAAAAAAAAAdGV4dAAAAABDQzAAWFlaIAAAAAAAAPNUAAEAAAABFslYWVogAAAAAAAAb6AAADjyAAADj1hZWiAAAAAAAABilgAAt4kAABjaWFlaIAAAAAAAACSgAAAPhQAAtsRjdXJ2AAAAAAAAACoAAAB8APgBnAJ1A4MEyQZOCBIKGAxiDvQRzxT2GGocLiBDJKwpai5+M+s5sz/WRldNNlR2XBdkHWyGdVZ+jYgskjacq6eMstu+mcrH12Xkd/H5//9WUDggBIgAALAvA50BKlAFUAU+USiRRqOioiEgsqkAcAoJaW74IHsDU+9bLAOXFYeY8GPg5m71SIv8fsmrmk8ejP7L/hP2n99XxT9b/tv93/bL+0+Rr6f+2/3b/Ff53+8f9z/b/LBoP9W/w/M3+KfaT8T/cP87/yP8R+0fzN+wPjD8sv93/H+wL+K/zP/N/3X9uf85+5P1n/g/9r7M/IH3T/kegR7/feP91/k/3i/wfwGfP/8D/LerP6t/hv91/hf8f+wP2A/y/+n/6T+8fvX/jv///+Pvf/eeDt9t/3P/c/2f5cfYD/Jf6t/uf8B/pP2q+mT+d/6f+J/zf7g+2v84/xH/V/y/+s/a37DP5Z/X/+J/fv9D/9P9f/////91//09y37Wf9n8//ot/Wz/z/n+GHyxICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJAL2/3GmDwRq2XQNyWCoeZhp5mD2dZfX0cxxILrMkvI5VqCzhUS151/MIoEaJhZyVoUSBWvyxICQEgJASAkBICQEgJASAkBICQEgF667XfHxFlCcJVyi7Zn3hzWFa/HPnXdxlKxSMGsb7w5rCtfliQEgJASAkBICQEgJASAkBH4rPWS2L1vDmsK1+WJASAkBICPxdJNWVa52Lvsz7w5rCtfliQEgJASAkBICQEgJASAj8ihx7mEh3dhWvyxICQEgJASAkBH4uD26EFaJXqsK1+WJASAkBICQEgJASAkBICQEgIwhBc/qhzWFa/LEgJASAkBICQEYiAJlmTpupTPvDmsK1+WJASAkBICQEgJASAkBH5KatE3b7w5rCsiB/D/0dX/WAOYQgCmWFdELeAZgsEICgHeYPyWvyxIBfb11HnaZ94c1hWvyxICQEgJASAkBICQEgF8mQlp1tBICQEgF9YzoXX/zCnb3ncU9YvWsCzsGe1Z2yySApkUAAq5/jDVRdsz0+GZq0NhWFa/LEgJASAkBICQEgJASAkBIBhWm8f/3hzWFZCAbmIDyhIN/qonRzEU1Jv1C/1xtHdic/Hc2dZcqG163UJHCoTr+JKgK1+WIxe3sjusIrCtfliQEgJASAkBIC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YSxICQEgJASAkBICQEgJASAkBICPxsshtpE6xcr0ZX5J5H1PLSXT815ZmNcBj/lp4m3yDAAwp6skIuudrWKb+u6+AU3YV6vquddowr1BlA0otiooAcAlzxOgGsEg3nExi8NoNhfliQEgJASAkBICQEgJASAkBICPxsqP3LJGsGEGp2GlCUJvV0Jg5AsXqiBNIMM6YOWenJ5uuiAkmREUOlv7hNZjdxXHrxdxV5qFtNJvbPMwqRd/3deBbkTjWpCJsxqId7rTh8dWXtuOrv+cN/25IbF7tT2RMJAGoZIu2Z94c1hWvyxICQEgJASAkBICMVwySzPBEEhoCsn+Xz1KgkOganP51H3CheRimGJYkHmiGsiDp8eMasy5c7tmCSwSdftgQMOChrSeFYEhr8igULZ7fFmVYxg+E2BB8SrNv3SR12voGYYx9+nWJ3d3kGHHQElczdN0WyhHcbT4yuu1Isjr5proEAw1Bwu6vJPxVzxLxDEKAJO2WqLWz20UFgb/A17KEr1/6+/YQUAqLU6uUgJASAkBICQEgJASAkBICQEgJAMrdJnEAAyUzPnOPk9084WAo9BUwnmeea1tnkLG8KoP3XiFqjjAlVC/NmrbBAFnlEvgWiE9CC9AZBgUKLeEqs+/AgROOW8faTCKwrX5YkBICQEgJASAkBICQEgJASBlKLtmfeOY/5ilF2zRfTZLX5YkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgJASAkBICQEgI/AAD+/uFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACh7TDWYfJJ4RSFcXl5mTbPQ5bAw2LRlj0NRsVqZA176QUF04zG9BD5+/bWBkIoTf3R6UpYhHVd3zq3topTCw7pN/xD9h8NC/du8updgvbtNhzml7lgJnHhikqnRfypY0Zr9rt4MZji0TsYFOwJ5N7CAl6DetQgH7AT85qjndcjPZad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" alt="Mundial 2026" className="w-20 h-20 mx-auto object-contain" />
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
            <img src="data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABDCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMvhQZgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF+Pm3/HaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALt4loBDHqKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/EAAL/2gAMAwEAAgADAAAAEPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPMPNPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPNCKVu//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPMAFLl5+T3PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPOMnnsG9f8AxtTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjTn9x+6YQhBzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzh0ByNHamKSXxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxgxssyVWyGASvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzygGgs7KwcBoIPSDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzbFFdhlEAU9HBwfS1TzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwI+61gSfzvv0Wy07zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjTQZsm8Jjue1YtyKzTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzqF2UybaEdtwPOWI8JHDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzFdPOqKYWaVmPoGiX4is5bDzzzzzzzzzzzzzzzzzzzzzzzzzzjDD4vO9vTzzzzzzzzzzzzzzzzzzzzzz04KPtVlZKvhMyNw03SOXgx7zzzzzzzzzzzzzzzzzzzzzzzZZna9L5510yZujqzvjTzzzzzzzzzzzzzzzRUQnL/3Gw2kpljR9uq4xoHnzzzzzzzzzzzzzzzzzzzzg564Keo7ScfcMd89Nxi41dHDzzzzzzzzzzzzzOGIskP8Am5FihBID49VCqx0U888888888888888888z68NWMsAcwhSDuLCaYEeK0Gieyuw88888888888CEnO2zfkmkLqwYWxdiO4CA088888888888888847t3zmOwjEIjl+XJOcMvcUi8g++is65q4888888888LwqO71iFYyQirOhmau971H888888888888888wj8P5d8nBDSH58emFXC0++++OPBem0HQePt08888888ZSB+l+ioPuRB41EcHWv1ic88888888888884xaBwS+C+OOOOtgHkQ40w+6O+y+++KsHG4+7J90888888HQE4/MipTqt+d8yW7pSnt88888888888884lyNVcvjfu5BxhP6kcMcX4uO6yyW+6myyEJHT/bgW88888POdmupLTJuk9K8X8OZ3Mc8888888888884FZ5Jvhu/lNnBP5rRhgYsvbAlx8Y0GH/LHS9D29QEEZ888kvYQRYNI0JRJyyBSYmZgc8888888888888PpZMEhpPrBvFT3GrxMOytFZTmyrQEc2mS+uuKQ+cY8h7wxxh5aPBnOY8vaxxTv+xV88888888888884HEJQ4xzwARDundRDBFBRkpd7qS+m7D9LjMauC2CAGgMkCm0Wj98MU7WYYI6DyURcc88888888888884WB906Aa6sNHkDZDNNNdMOOeKezWamPPrz5m7iOE+hcKCR2vQAO88888888sc8888888888888888884n9ZAxeZeMFGZ9tdNZGKGGO8Oe6+O+7nNsOzWYIw0okMucMUFVL888888888888888888888888888881UIAr4nw0gMpaT13uceqM1X3VUWatnGxz+O2A4in0w03LC6rEuO0888888888888888888888888888sfomNoQ8gd2o+va+62mN+16+e+357yQUlcZqaUcArocY6fNi5wTX8888888888888888888888888884fSiubqz6Xqqf/b3z2xeSG+ey6sZSBehtIY8s+6KuvTr7jMG6zY1voy8888888888888888888888888lCK6JFRxhImJDTf64Ps+W+mabUwbQ9o250DGNkOiX9lsPReDll1lzz1088888888888888888888888831vdADxRJrhF3fKLXvOe8TYX4hTPHmNFSTCHHxL80bCEyGd7j5uuZlET88888888888888888888888+TCIVjCxNFRj7HsNnCe6p7XG2265a32OoQfasX5G84840IInMvi+k62/K0888888888888888888888457+6MvODYm7vL+0uLO+5Q5mKKKmSaqwECyOu42YsmXvx33M/mCCCO3mL/APfPPPPPPPPPPPPPPPPPPPPOjfhoVAPZdQqrnKkUwhmrol3vP1+faExI2DgPmg4w3hdyt5/ffAPssOL88+dPPPPPPPPPPPPPPPPPPPPBnunS5PL70numposshiT2kjg4utzbpnPgyUHE1ttCq6PFokJDRSan/sqXsM/PPPPPPPPPPPPPPPPPPPOGzw1G+rEy/gsugjTaEqgp/u6BGMMAEGujpgEcSsn1WhasFCGEZTNAlvDZnlsfPPPPPPPPPPPPPPPPPPJ72Q+DaksFvggihsYus2ooLIUJd4iahbYK1LsFPyh1nHME0f8AiIEulTbpBpvgnzzzzzzzzzzzzzzzzzzzzdNB/wAEWZMc4w2Jf+VI4wSiMC1+y/8A68dHgLVPnKUBwWgMd27YwzxCliqJm4b9PPPPPPPPPPPPPPPPPOHfzsA6oMGWhqlOUtOfPKUBkdXbBz8y89SAsGqJ4uF9Dyhdbdsy06exOEElakls/PPPPPPPPPPPPPPPPOEryUPiAzcLnsHXjsrKghD73ics84ga+LUDEvn+KLE4Hrq9z3Cgzwk9OlirPapmfPPPPPPPPPPPPPPPPPpXhviw2Sksug8uKtH1cmCAin7w3DgL2ovGuGk8Gv6Tjee7d9fCj5jrevvtn/4wPPPPPPPPPPPPPPPPPOUhr5e0bWFis87gLiL9ywTR868l4bOBB7PUccBlLIvhH+0obCVpE728AHogqjzy9PPPPPPPPPPPPPPPPABuqV9RRjah/uc6uLUpssJQbx18VgRvTSAhUVm6cLBFuBA5MaR+I2jru7rjobO/nPPPPPPPPPPPPPPPPNx/RfbDVJZk/hrIhKOguDC7Q3S6eYOY2+8yZu4O2p5FCV/zPuY2zQlro0gi4QksXPPPPPPPPPPPPPPPPIar8nVs/bj4XivinmDlszYYAyromlKAh+H7RgmpaU+AqYpmFLmwbHsstQjmrMCk1PPPPPPPPPPPPPPPPGbqzHXzYoy84+WrGofA2uJGO41AKSPS7pQOp0pjyjW5vrsrpX9zahjmt/RtZ5KtPPPPPPPPPPPPPPPPPGUAIwNlA0LmtYUkakXn3ZBQezwZLRieXRwKvUiWg+tkPDIKu7d0vgjkrMozP8JCdvPPPPPPPPPPPPPPPP3LBUNDmSlLorYTOUGm7bpk+uOFsliySRYY/XtPhidLNrqlGK7fzttmAQY1fc0O1PPPPPPPPPPPPPPPPIBOBJMPDPfvvibznfDs7Rj/AO7FJOWY5SypB2+un4AF/tg4rX3+yhKZvtzO3k0P5lTzzzzzzzzzzzzzzzwfwjvz56qxLb/sxbvvJforx9rXYKOfUOIg6UmjYKMt2CJL6psvVaKJ7gOO38yeaZzzzzzzzzzzzzzzzzzhyCoxJb49LJ++et+4oJdIBBLDP7eH9lbxNX0r4RRLbXrrbba7EUW3OCOWWfg9Jnzzzzzzzzzzzzzzzzy4S122p4qY5tksvNPIN8+gAaLCtvuhluRP/wDG8omJ/Yh2nUUO2xgDDL0sDfvrqOU88888888888888888440FIKCGcAxhD31fL86OXHU5umND3TXniiod3uF4CL6SCPAKFQSf/wCCMRQx0xAJfPPPPPPPPPPPPPPPPPPvdUNCojnCSa8VVcKiWqtvewbA0b1xior0MZEgGjIgl+ugorOF89qxxUR5soodPPPPPPPPPPPPPPPPPPEAgsKgmvkp6yw2l25Rkrl/o8qkvbHwj5PCgwevzbggkCgAlxgiwrra0cd88vgHPPPPPPPPPPPPPPPPPPOK09Ik8ALEe/6z7pD9ihjvhCSPj65rAPo0sofBQggkrCknlHuokmv6+w1ba52PPPPPPPPPPPPPPPPPPPLFYoBpDLBoTjn/AGEuJypXoJI98EQj6CbIp7AzMCYb7rwBaAS47oJ5lxm/QqvkTzzzzzzzzzzzzzzzzzzzxtd/v2wLbq8JrTyD1fm1SHo5pbvV7XPf2zP4YraIwHGYhQoArL03bCRudEFfTzzzzzzzzzzzzzzzzzzzyygEQrjpL4X5AB5ybAwF86OPoaI6bYy/8rDLMYbn8oPjvMYoBKj+7cW1NmPvzzzzzzzzzzzzzzzzzzzzzxXozR0YJI7FUHHhLX693GEome8vpJq8tb466LEvo5TOoMDKNjrGsPDnSTDTzzzzzzzzzzzzzzzzzzzzzygOgD+JIrDw4gDLaGHgHkZh4cQeVgbaAhOCd7KIzV0bz57qhnGM8ozix5HzzzzzzzzzzzzzzzzzzzzzzzycoARVLTBS4YIIc9iHkdSHweK2OEHZRnQKIJYq/wAm2y2+9m/PjBiJs8bc888888888888888888888888srIFNb4sEu/wz3t0i1Db5OE3MHRY26Iu+KOgLDP/AKmjhU9ywX2dD7Ft/PPPPPPPPPPPPPPPPPPPPPPPPPLowdZh/Ctvie4wzhotmcXP7oYD8IAjuvQ18X/ruvnJcikxxSKacIHnPPPPPPPPPPPPPPPPPPPPPPPPPPPC/QZbYFrvvmfJXoiv603nssoGVXkCRwE01/8ArJ6zkoy200LRGV2hTzzzzzzzzzzzzzzzzzzzzzzzzzzzzxZZvWfmJ646CvzrxUsNOOPN5K8vcPOMONeoKBWc/wBZlfQgIVpqu888888888888888888888888888888sPw8V3B84cA2M+Qqe7Lfy+OafvPKCDay+6H43vWFPBPAI9R4V88888888888888888888888888888888sfmVBVfsoRuqy7+WH6s6CGGPBR2vP6Czfas31PvPfC0U4K/88888888888888888888888888888888888DW8AY3onXfTyG40+t4iSUs2y+CDrVuPDppjvSxv4tF6Lc88888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" alt="Logo"
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
