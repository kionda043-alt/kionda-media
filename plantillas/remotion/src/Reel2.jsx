import React, { useEffect, useState } from 'react';
import { delayRender, continueRender, AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, TITLE, BODY, ease, clamp, usePop, SceneFade, Caption, Illustration, Check, Chip } from './Reel';

// Timeline in frames: [from, duration]. Retimed to the voiceover.
export const T2 = {
  s1: [0, 85], s2: [75, 170], s3: [238, 140], s4: [370, 160], s5: [522, 78], s6: [590, 160], total: 750,
  pill: 80, probs: [12, 59, 107], scan: [16, 98, 104], fix: 100,
};

// ---------- Scene 1: where does the time go ----------
const Clock = ({ x, y, size = 230, at = 4 }) => {
  const f = useCurrentFrame();
  const p = usePop(at, 11);
  const a = f * 14;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: size, height: size, transform: `scale(${p})` }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill={C.cream} stroke={C.navy} strokeWidth="7" />
        {[...Array(12)].map((_, i) => (
          <line key={i} x1="50" y1="12" x2="50" y2="18" stroke={C.navy} strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 30} 50 50)`} />
        ))}
        <line x1="50" y1="50" x2="50" y2="26" stroke={C.navy} strokeWidth="5" strokeLinecap="round" transform={`rotate(${a / 12} 50 50)`} />
        <line x1="50" y1="50" x2="50" y2="17" stroke={C.coral} strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${a} 50 50)`} />
        <circle cx="50" cy="50" r="4" fill={C.coral} />
      </svg>
    </div>
  );
};

const S1 = ({ dur }) => (
  <SceneFade dur={dur} fadeIn={0} bg={C.creamImg}>
    <Illustration src="1-antes-desorden.png" dur={dur} top={720} from={1.0} to={1.1} />
    <Caption top={280} segs={[['¿Dónde se pierde el'], ['tiempo', C.coral], ['en tu negocio?']]} size={86} />
  </SceneFade>
);

// ---------- Scene 2: the problems ----------
const Problem = ({ x, y, text, at, rot }) => {
  const p = usePop(at, 11);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 16,
      background: C.coral, color: C.white, borderRadius: 26, padding: '20px 28px',
      fontFamily: TITLE, fontWeight: 700, fontSize: 40, boxShadow: '0 16px 34px rgba(255,90,54,0.35)',
      opacity: Math.min(1, p * 1.5), transform: `scale(${0.5 + 0.5 * p}) rotate(${rot}deg)`,
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 22, background: C.white, color: C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>!</div>
      {text}
    </div>
  );
};

const S2 = ({ dur }) => (
  <SceneFade dur={dur} bg={C.creamImg}>
    <Illustration src="1-antes-desorden.png" dur={dur} top={760} from={1.12} to={1.2} />
    <Caption top={300} segs={[['Lo que frena'], ['tu negocio', C.coral]]} size={80} />
    <Problem x={70} y={720} text="Pedidos traspapelados" at={T2.probs[0]} rot={-3} />
    <Problem x={250} y={1060} text="Mensajes sin responder" at={T2.probs[1]} rot={2} />
    <Problem x={110} y={1400} text="Planillas desactualizadas" at={T2.probs[2]} rot={-2} />
  </SceneFade>
);

// ---------- Scene 3: AI diagnosis finds the bottleneck ----------
const NODES = ['Consultas', 'Pedidos', 'Stock', 'Entregas', 'Cobros'];
const NODE_Y0 = 640, NODE_GAP = 190, BAD = 2;

const Flow = ({ scanFrom = 18, scanTo = 70, found = 74, fixedAt = null }) => {
  const f = useCurrentFrame();
  const scanY = interpolate(f, [scanFrom, scanTo], [NODE_Y0 - 30, NODE_Y0 + BAD * NODE_GAP], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const isFound = f >= found;
  const isFixed = fixedAt !== null && f >= fixedAt;
  const pulse = isFound && !isFixed ? 1 + 0.05 * Math.sin((f - found) / 2.5) : 1;
  return (
    <>
      <div style={{ position: 'absolute', left: 536, top: NODE_Y0 + 60, width: 8, height: NODE_GAP * 4, background: '#E7D9C8', borderRadius: 4 }} />
      {isFixed && [0, 1, 2, 3, 4, 5].map((i) => {
        const t = ((f - fixedAt) * 0.03 + i / 6) % 1;
        return <div key={i} style={{ position: 'absolute', left: 528, top: NODE_Y0 + 60 + t * NODE_GAP * 4 - 12, width: 24, height: 24, borderRadius: 12, background: C.lime }} />;
      })}
      {NODES.map((n, i) => {
        const p = usePop(2 + i * 4, 15);
        const bad = i === BAD && isFound && !isFixed;
        const good = i === BAD && isFixed;
        return (
          <div key={n} style={{
            position: 'absolute', left: 240, top: NODE_Y0 + i * NODE_GAP, width: 600, height: 120,
            borderRadius: 30, background: bad ? C.coral : C.white,
            boxShadow: bad ? '0 0 0 14px rgba(255,90,54,0.18), 0 16px 34px rgba(255,90,54,0.35)' : '0 8px 20px rgba(20,17,43,0.08)',
            display: 'flex', alignItems: 'center', gap: 22, padding: '0 34px',
            opacity: Math.min(1, p * 1.5), transform: `scale(${(0.8 + 0.2 * p) * (i === BAD ? pulse : 1)})`,
          }}>
            {good ? <Check size={56} /> : <div style={{ width: 56, height: 56, borderRadius: 28, background: bad ? C.white : C.cream, border: `4px solid ${bad ? C.white : C.navy}` }} />}
            <span style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 50, color: bad ? C.white : C.navy }}>{n}</span>
            {bad && <span style={{ marginLeft: 'auto', fontFamily: BODY, fontWeight: 700, fontSize: 26, background: C.navy, color: C.cream, padding: '8px 16px', borderRadius: 20 }}>Cuello de botella</span>}
          </div>
        );
      })}
      {!isFound && f >= scanFrom - 6 && (
        <div style={{ position: 'absolute', left: 760, top: scanY, opacity: interpolate(f, [scanFrom - 6, scanFrom], [0, 1], clamp) }}>
          <svg width="170" height="170" viewBox="0 0 100 100">
            <circle cx="40" cy="40" r="27" fill="rgba(198,255,61,0.35)" stroke={C.navy} strokeWidth="9" />
            <line x1="60" y1="60" x2="88" y2="88" stroke={C.navy} strokeWidth="12" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </>
  );
};

const S3 = ({ dur }) => (
  <SceneFade dur={dur} bg={C.cream}>
    <Caption top={250} segs={[['Un diagnóstico con IA'], ['encuentra el', C.navy], ['cuello de botella', C.coral]]} size={72} />
    <Flow scanFrom={T2.scan[0]} scanTo={T2.scan[1]} found={T2.scan[2]} />
  </SceneFade>
);

// ---------- Scene 4: simple custom tool on the phone ----------
const ROWS = [
  ['Café en grano', 0.8, '12 u'],
  ['Leche', 0.15, '4 u'],
  ['Vasos', 0.9, '230 u'],
  ['Medialunas', 0.55, '40 u'],
];

const StockApp = ({ fixAt }) => {
  const f = useCurrentFrame();
  const fixed = f >= fixAt;
  return (
    <div style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', gap: 14 }}>
        {[['Pedidos hoy', '38'], ['Alertas', fixed ? '0' : '1']].map(([l, v], i) => (
          <div key={l} style={{ flex: 1, background: i === 1 && !fixed ? C.coral : C.navy, borderRadius: 24, padding: '18px 22px' }}>
            <div style={{ fontFamily: BODY, fontSize: 24, color: C.cream, opacity: 0.8 }}>{l}</div>
            <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 52, color: C.cream }}>{v}</div>
          </div>
        ))}
      </div>
      {ROWS.map(([name, lvl, qty], i) => {
        const p = usePop(16 + i * 6, 15);
        const low = i === 1;
        const level = low && fixed ? interpolate(f, [fixAt, fixAt + 18], [lvl, 0.85], { ...clamp, easing: ease }) : lvl;
        const alert = low && !fixed;
        return (
          <div key={name} style={{ background: C.white, borderRadius: 22, padding: '18px 22px', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)`, border: alert ? `4px solid ${C.coral}` : '4px solid transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.navy }}>
              <span>{name}</span><span style={{ color: alert ? C.coral : C.muted }}>{low && fixed ? '24 u' : qty}</span>
            </div>
            <div style={{ height: 14, background: '#EFE4D6', borderRadius: 7, marginTop: 12 }}>
              <div style={{ width: `${level * 100}%`, height: '100%', borderRadius: 7, background: alert ? C.coral : C.navy }} />
            </div>
          </div>
        );
      })}
      {(() => {
        const p = usePop(fixAt, 13);
        if (f < fixAt) return null;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.navy, borderRadius: 22, padding: '18px 22px', opacity: Math.min(1, p * 1.5), transform: `scale(${0.85 + 0.15 * p})` }}>
            <Check size={46} />
            <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.cream }}>Pedido al proveedor enviado</span>
          </div>
        );
      })()}
    </div>
  );
};

const S4 = ({ dur }) => {
  const f = useCurrentFrame();
  const enter = interpolate(f, [4, 22], [0, 1], { ...clamp, easing: ease });
  return (
    <SceneFade dur={dur} bg={C.cream}>
      <Caption top={230} segs={[['Una herramienta'], ['simple y a medida,', C.coral], ['desde el celular']]} size={72} />
      <div style={{
        position: 'absolute', left: 205, top: 560, width: 670, height: 1060, borderRadius: 80,
        background: C.navy, padding: 16, boxShadow: '0 40px 80px rgba(20,17,43,0.28)',
        transform: `translateY(${(1 - enter) * 400}px)`, opacity: enter,
      }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 66, overflow: 'hidden', background: C.chatBg }}>
          <div style={{ height: 130, background: C.white, display: 'flex', alignItems: 'flex-end', padding: '0 34px 22px', borderBottom: '2px solid #EDE2D4' }}>
            <span style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 40, color: C.navy }}>Mi negocio</span>
            <span style={{ marginLeft: 'auto', fontFamily: BODY, fontWeight: 700, fontSize: 22, border: `3px solid ${C.navy}`, color: C.navy, padding: '4px 14px', borderRadius: 20 }}>Demo</span>
          </div>
          <StockApp fixAt={T2.fix} />
        </div>
      </div>
    </SceneFade>
  );
};

// ---------- Scene 5: no fuss, no overspending ----------
const S5 = ({ dur }) => (
  <SceneFade dur={dur} bg={C.dark4}>
    <Illustration src="4-crece.png" dur={dur} top={700} from={1.0} to={1.08} />
    <Caption top={280} color={C.cream} start={2} segs={[['Sin vueltas y'], ['sin gastar de más', C.coral]]} size={84} />
    <div style={{ position: 'absolute', top: 1470, width: '100%', display: 'flex', justifyContent: 'center', gap: 22 }}>
      <Chip label="+ tiempo" at={18} accent />
      <Chip label="+ orden" at={26} />
    </div>
  </SceneFade>
);

// ---------- Scene 6: close ----------
const S6 = ({ dur, pillAt }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1.08, 1.0], { ...clamp, easing: ease });
  const p = usePop(pillAt, 11);
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, f - pillAt - 20) / 4);
  return (
    <SceneFade dur={dur} fadeOut={0} bg={C.cream}>
      <Img src={staticFile('5-cierre-logo-vertical.png')} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, transform: `scale(${s})` }} />
      <Caption top={330} start={4} segs={[['Diagnóstico'], ['sin costo', C.coral], ['para tu negocio']]} size={84} />
      <div style={{
        position: 'absolute', top: 1390, left: '50%', transform: `translateX(-50%) scale(${p * pulse})`,
        background: C.coral, color: C.white, fontFamily: TITLE, fontWeight: 700, fontSize: 62,
        padding: '24px 56px', borderRadius: 70, boxShadow: '0 16px 36px rgba(255,90,54,0.35)', whiteSpace: 'nowrap',
      }}>kiondaia.com</div>
    </SceneFade>
  );
};

export const Reel2 = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['700 80px "Space Grotesk"', '400 30px "DM Sans"', '700 30px "DM Sans"'].map((x) => document.fonts.load(x)))
      .then(() => continueRender(handle));
  }, [handle]);
  return (
  <AbsoluteFill style={{ backgroundColor: C.cream }}>
    <Sequence from={T2.s1[0]} durationInFrames={T2.s1[1]}><S1 dur={T2.s1[1]} /></Sequence>
    <Sequence from={T2.s2[0]} durationInFrames={T2.s2[1]}><S2 dur={T2.s2[1]} /></Sequence>
    <Sequence from={T2.s3[0]} durationInFrames={T2.s3[1]}><S3 dur={T2.s3[1]} /></Sequence>
    <Sequence from={T2.s4[0]} durationInFrames={T2.s4[1]}><S4 dur={T2.s4[1]} /></Sequence>
    <Sequence from={T2.s5[0]} durationInFrames={T2.s5[1]}><S5 dur={T2.s5[1]} /></Sequence>
    <Sequence from={T2.s6[0]} durationInFrames={T2.s6[1]}><S6 dur={T2.s6[1]} pillAt={T2.pill} /></Sequence>
  </AbsoluteFill>
  );
};
