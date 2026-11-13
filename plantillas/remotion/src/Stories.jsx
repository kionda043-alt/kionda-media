import React, { useEffect, useState } from 'react';
import { delayRender, continueRender, AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { C, TITLE, BODY, ease, clamp, usePop, Caption, Illustration, Chip } from './Reel';

const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['700 80px "Space Grotesk"', '400 30px "DM Sans"', '700 30px "DM Sans"'].map((x) => document.fonts.load(x)))
      .then(() => continueRender(handle));
  }, [handle]);
};

const Logo = ({ dark }) => (
  <div style={{ position: 'absolute', top: 1560, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 64, height: 54, borderRadius: 18, background: C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="40" height="30" viewBox="0 0 24 14"><path d="M1 7c2-4 4-4 6 0s4 4 6 0 4-4 6 0 3 3 4 1" fill="none" stroke={C.cream} strokeWidth="2.4" strokeLinecap="round" /></svg>
      </div>
      <span style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 52, color: dark ? C.cream : C.navy }}>kionda <span style={{ color: C.coral }}>IA</span></span>
    </div>
  </div>
);

const Pill = ({ at, text = 'kiondaia.com', top = 1380, size = 60 }) => {
  const f = useCurrentFrame();
  const p = usePop(at, 11);
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, f - at - 15) / 4);
  return (
    <div style={{
      position: 'absolute', top, left: '50%', transform: `translateX(-50%) scale(${p * pulse})`,
      background: C.coral, color: C.white, fontFamily: TITLE, fontWeight: 700, fontSize: size,
      padding: '24px 56px', borderRadius: 70, boxShadow: '0 16px 36px rgba(255,90,54,0.35)', whiteSpace: 'nowrap',
    }}>{text}</div>
  );
};

// ---------- Story 1: question hook ----------
const usePopLocal = (f, at) => interpolate(f, [at, at + 8], [0, 1], { ...clamp, easing: ease });
export const Story1 = () => {
  useFonts();
  const f = useCurrentFrame();
  const swap = 105;
  const a = interpolate(f, [swap - 8, swap], [1, 0], clamp);
  const b = interpolate(f, [swap, swap + 10], [0, 1], { ...clamp, easing: ease });
    return (
    <AbsoluteFill style={{ backgroundColor: C.navy }}>
      <AbsoluteFill style={{ opacity: a }}>
        <Caption top={330} color={C.cream} start={2} size={84} segs={[['¿Cuántas horas por semana se van en'], ['responder lo mismo?', C.coral]]} />
        {['¿Tienen stock?', '¿Hacen envíos?', '¿Hasta qué hora abren?', '¿Tienen stock?', '¿Hacen envíos?'].map((q, i) => {
          const p = usePopLocal(f, 16 + i * 14);
          return (
            <div key={i} style={{
              position: 'absolute', top: 760 + i * 120, left: i % 2 ? 380 : 120, background: i % 2 ? C.coral : C.cream,
              color: i % 2 ? C.white : C.navy, fontFamily: BODY, fontWeight: 700, fontSize: 44, padding: '20px 32px',
              borderRadius: i % 2 ? '30px 30px 8px 30px' : '30px 30px 30px 8px', opacity: Math.min(1, p * 1.5),
              transform: `scale(${0.6 + 0.4 * p})`,
            }}>{q}</div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: b, backgroundColor: C.creamImg }}>
        {f >= swap && <Illustration src="3-se-ordena.png" dur={135} top={640} from={1.0} to={1.06} />}
        <Caption top={330} start={swap + 4} size={84} segs={[['Un bot con IA las responde'], ['las 24 horas', C.coral]]} />
        <Pill at={swap + 40} top={1430} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Story 2: tip ----------
const TipChip = ({ label, at, i }) => {
  const p = usePop(at, 12);
  return (
    <div style={{
      background: i % 2 ? C.white : C.navy, color: i % 2 ? C.navy : C.cream, borderRadius: 34,
      padding: '30px 34px', fontFamily: TITLE, fontWeight: 700, fontSize: 52, width: 420, textAlign: 'center',
      opacity: Math.min(1, p * 1.5), transform: `scale(${0.6 + 0.4 * p}) rotate(${i % 2 ? 2 : -2}deg)`,
      boxShadow: '0 12px 28px rgba(20,17,43,0.12)',
    }}>{label}</div>
  );
};

export const Story2 = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <div style={{ position: 'absolute', top: 260, left: '50%', transform: 'translateX(-50%)', background: C.lime, color: C.navy, fontFamily: TITLE, fontWeight: 700, fontSize: 40, padding: '12px 32px', borderRadius: 40 }}>Tip IA</div>
      <Caption top={380} start={4} size={80} segs={[['Si una tarea se repite'], ['todos los días,', C.coral], ['se puede automatizar']]} />
      <div style={{ position: 'absolute', top: 820, width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 28, padding: '0 80px' }}>
        {['Turnos', 'Pedidos', 'Stock', 'Respuestas'].map((l, i) => <TipChip key={l} label={l} i={i} at={50 + i * 12} />)}
      </div>
      <Caption top={1230} start={120} size={52} color={C.navy} segs={[['¿Qué tarea se repite en tu negocio?']]} />
      <Pill at={150} top={1400} />
    </AbsoluteFill>
  );
};

// ---------- Story 3: before / after ----------
const Half = ({ src, label, top, at, good }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 14], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, height: 600, overflow: 'hidden', opacity: p, transform: `translateX(${(1 - p) * (good ? 120 : -120)}px)` }}>
      <Img src={staticFile(src)} style={{ position: 'absolute', left: -130, top: -10, width: 1340, height: 1340 * (941 / 1672) }} />
      <div style={{ position: 'absolute', left: 50, top: 40, background: good ? C.lime : C.navy, color: good ? C.navy : C.cream, fontFamily: TITLE, fontWeight: 700, fontSize: 46, padding: '12px 30px', borderRadius: 40 }}>{label}</div>
    </div>
  );
};

export const Story3 = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ backgroundColor: C.creamImg }}>
      <Caption top={250} start={2} size={70} segs={[['Papeles, planillas y mensajes'], ['→ una sola app', C.coral]]} />
      <Half src="1-antes-desorden.png" label="Antes" top={480} at={20} />
      <Half src="3-se-ordena.png" label="Con IA" top={1080} at={70} good />
      <div style={{ position: 'absolute', top: 1080, left: 80, right: 80, height: 6, background: C.coral, borderRadius: 3 }} />
      <Pill at={130} top={1560} size={44} text="Diagnóstico sin costo · kiondaia.com" />
    </AbsoluteFill>
  );
};
