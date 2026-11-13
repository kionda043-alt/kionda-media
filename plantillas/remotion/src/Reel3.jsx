import React, { useEffect, useState } from 'react';
import { delayRender, continueRender, AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, TITLE, BODY, ease, clamp, usePop, SceneFade, Caption, Illustration, Check, Chip } from './Reel';

export const T3 = {
  s1: [0, 110], s2: [102, 188], s3: [282, 78], s4: [352, 116], s5: [460, 132], s6: [584, 166], total: 750,
  scan: 70, menu: 100, ticket: 10, editPrice: 34, soldOut: 72, pill: 74,
};

const EMOJI = '"Noto Color Emoji", sans-serif';

const PhoneFrame = ({ children, top = 560, height = 1060, enterAt = 0 }) => {
  const f = useCurrentFrame();
  const enter = interpolate(f, [enterAt, enterAt + 16], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{
      position: 'absolute', left: 205, top, width: 670, height, borderRadius: 80,
      background: C.navy, padding: 16, boxShadow: '0 40px 80px rgba(20,17,43,0.28)',
      transform: `translateY(${(1 - enter) * 400}px)`, opacity: enter,
    }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 66, overflow: 'hidden', background: C.chatBg, position: 'relative' }}>{children}</div>
    </div>
  );
};

const DemoTag = ({ dark }) => (
  <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 22, border: `3px solid ${dark ? C.cream : C.navy}`, color: dark ? C.cream : C.navy, padding: '4px 14px', borderRadius: 20 }}>Demo</span>
);

// ---------- Scene 1: the paper menu ----------
const PaperMenu = () => {
  const f = useCurrentFrame();
  const wob = Math.sin(f / 12) * 1.2;
  const p = usePop(2, 13);
  const strike = (at) => interpolate(f, [at, at + 8], [0, 1], clamp);
  const items = [['Milanesa con papas', '$8.500', 30, '$9.200'], ['Ravioles con salsa', '$7.800', 46, 'NO HAY'], ['Ensalada César', '$6.900', null, null], ['Flan casero', '$3.500', 62, '$4.100']];
  return (
    <div style={{
      position: 'absolute', left: 150, top: 640, width: 780, height: 900, background: '#FBF3E4', borderRadius: 16,
      boxShadow: '0 30px 60px rgba(0,0,0,0.35)', transform: `rotate(${-4 + wob}deg) scale(${0.85 + 0.15 * p})`, opacity: p, padding: '60px 64px',
    }}>
      <div style={{ position: 'absolute', right: 70, bottom: 120, width: 190, height: 190, borderRadius: 95, border: '14px solid rgba(140,90,40,0.22)' }} />
      <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 64, color: C.navy, textAlign: 'center', letterSpacing: 6 }}>CARTA</div>
      <div style={{ height: 4, background: C.navy, margin: '20px 0 40px', opacity: 0.6 }} />
      {items.map(([n, pr, at, fix]) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 50, fontFamily: BODY, fontSize: 40, color: C.navy, position: 'relative' }}>
          <span>{n}</span>
          <span style={{ position: 'relative' }}>
            {pr}
            {at !== null && <span style={{ position: 'absolute', left: -6, right: -6, top: '50%', height: 6, background: C.coral, transform: `scaleX(${strike(at)}) rotate(-6deg)`, transformOrigin: 'left' }} />}
            {at !== null && <span style={{ position: 'absolute', right: 0, top: -48, fontFamily: '"Comic Sans MS", cursive', fontWeight: 700, fontSize: 38, color: C.coral, opacity: strike(at + 6), transform: 'rotate(-8deg)', whiteSpace: 'nowrap' }}>{fix}</span>}
          </span>
        </div>
      ))}
    </div>
  );
};

const S1 = ({ dur }) => (
  <SceneFade dur={dur} fadeIn={0} bg={C.navy}>
    <Caption top={240} color={C.cream} size={76} segs={[['¿Tu restaurante todavía trabaja con la'], ['carta en papel?', C.coral]]} />
    <PaperMenu />
  </SceneFade>
);

// ---------- Scene 2: scan QR -> digital menu ----------
const QR = ({ size = 360 }) => {
  const cells = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const n = 21;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    if (finder) continue;
    if (rnd() > 0.55) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={C.navy} />);
  }
  const Finder = ({ x, y }) => (<g><rect x={x} y={y} width="7" height="7" fill={C.navy} /><rect x={x + 1} y={y + 1} width="5" height="5" fill={C.white} /><rect x={x + 2} y={y + 2} width="3" height="3" fill={C.navy} /></g>);
  return (
    <svg width={size} height={size} viewBox="-1 -1 23 23" style={{ background: C.white, borderRadius: 20 }}>
      {cells}<Finder x={0} y={0} /><Finder x={14} y={0} /><Finder x={0} y={14} />
    </svg>
  );
};

const DISHES = [['🍝', 'Ravioles con salsa', '$7.800'], ['🥩', 'Milanesa con papas', '$9.200'], ['🥗', 'Ensalada César', '$6.900']];

const MenuScreen = ({ at }) => {
  const f = useCurrentFrame();
  const added = f >= at + 50;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ height: 130, background: C.white, display: 'flex', alignItems: 'flex-end', padding: '0 34px 22px', borderBottom: '2px solid #EDE2D4' }}>
        <span style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 38, color: C.navy }}>Menú · Mesa 4</span>
        <span style={{ marginLeft: 'auto' }}><DemoTag /></span>
      </div>
      <div style={{ display: 'flex', gap: 12, padding: '22px 28px 6px' }}>
        {['Entradas', 'Principales', 'Postres'].map((c, i) => (
          <span key={c} style={{ fontFamily: BODY, fontWeight: 700, fontSize: 25, padding: '10px 20px', borderRadius: 24, background: i === 1 ? C.navy : C.white, color: i === 1 ? C.cream : C.navy }}>{c}</span>
        ))}
      </div>
      <div style={{ padding: '14px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {DISHES.map(([e, n, pr], i) => {
          const p = usePop(at + 6 + i * 6, 15);
          const isAdded = i === 1 && added;
          return (
            <div key={n} style={{ display: 'flex', gap: 18, background: C.white, borderRadius: 26, padding: 14, alignItems: 'center', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)` }}>
              <div style={{ width: 130, height: 130, borderRadius: 20, background: '#FFE3D6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: EMOJI, fontSize: 76 }}>{e}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 31, color: C.navy }}>{n}</div>
                <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 29, color: C.coral, marginTop: 6 }}>{pr}</div>
              </div>
              <div style={{ width: 64, height: 64, borderRadius: 32, background: isAdded ? C.lime : C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontFamily: TITLE, fontWeight: 700, fontSize: 40, transform: `scale(${i === 1 ? interpolate(f, [at + 46, at + 50, at + 54], [1, 0.8, 1], clamp) : 1})` }}>
                {isAdded ? <Check size={44} bg="transparent" /> : '+'}
              </div>
            </div>
          );
        })}
      </div>
      {added && (() => {
        const p = interpolate(f, [at + 50, at + 60], [0, 1], { ...clamp, easing: ease });
        return (
          <div style={{ position: 'absolute', left: 28, right: 28, bottom: 34, background: C.coral, borderRadius: 30, padding: '24px 30px', display: 'flex', justifyContent: 'space-between', fontFamily: TITLE, fontWeight: 700, fontSize: 32, color: C.white, transform: `translateY(${(1 - p) * 150}px)` }}>
            <span>Ver pedido (1)</span><span>$9.200</span>
          </div>
        );
      })()}
    </div>
  );
};

const S2 = ({ dur }) => {
  const f = useCurrentFrame();
  const scanLine = interpolate(f, [24, T3.scan], [0, 1], clamp);
  const flash = interpolate(f, [T3.scan, T3.scan + 6, T3.scan + 14], [0, 1, 0], clamp);
  return (
    <SceneFade dur={dur} bg={C.cream}>
      <Caption top={220} size={66} segs={[['Cada mesa escanea un código y ve'], ['fotos y precios al día', C.coral]]} />
      <PhoneFrame top={560} enterAt={4}>
        {f < T3.menu ? (
          <div style={{ position: 'absolute', inset: 0, background: '#2A2540', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <QR />
              {['0 0', '0 auto', 'auto 0', 'auto auto'].map((pos, i) => (
                <div key={i} style={{ position: 'absolute', width: 70, height: 70, borderColor: C.lime, borderStyle: 'solid', borderWidth: `${i < 2 ? 8 : 0}px ${i % 2 ? 8 : 0}px ${i >= 2 ? 8 : 0}px ${i % 2 ? 0 : 8}px`, top: i < 2 ? -28 : 'auto', bottom: i >= 2 ? -28 : 'auto', left: i % 2 ? 'auto' : -28, right: i % 2 ? -28 : 'auto', borderRadius: 8 }} />
              ))}
              <div style={{ position: 'absolute', left: -20, right: -20, top: scanLine * 360, height: 6, background: C.lime, boxShadow: `0 0 20px ${C.lime}` }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, background: C.white, opacity: flash }} />
          </div>
        ) : (
          <MenuScreen at={T3.menu} />
        )}
      </PhoneFrame>
    </SceneFade>
  );
};

// ---------- Scene 3: kitchen screen ----------
const S3 = ({ dur }) => {
  const p = usePop(T3.ticket, 12);
  const f = useCurrentFrame();
  return (
    <SceneFade dur={dur} bg={C.cream}>
      <Caption top={250} size={78} segs={[['El pedido llega'], ['ordenado a la cocina', C.coral]]} />
      <div style={{ position: 'absolute', left: 90, top: 640, width: 900, height: 820, background: C.navy, borderRadius: 50, padding: 36, boxShadow: '0 40px 80px rgba(20,17,43,0.28)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
          <span style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 46, color: C.cream }}>Cocina</span>
          <span style={{ marginLeft: 16, width: 16, height: 16, borderRadius: 8, background: C.lime, opacity: 0.5 + 0.5 * Math.sin(f / 3) }} />
          <span style={{ marginLeft: 'auto' }}><DemoTag dark /></span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1, background: C.white, borderRadius: 30, padding: 30, transform: `scale(${0.7 + 0.3 * p})`, opacity: Math.min(1, p * 1.5), border: `6px solid ${C.lime}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 46, color: C.navy }}>Mesa 4</span>
              <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 24, background: C.lime, color: C.navy, padding: '6px 16px', borderRadius: 20 }}>Nuevo</span>
            </div>
            <div style={{ fontFamily: BODY, fontSize: 30, color: C.muted, margin: '6px 0 22px' }}>13:42</div>
            {['1× Milanesa con papas', '1× Ensalada César'].map((x) => (
              <div key={x} style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.navy, marginBottom: 14 }}>{x}</div>
            ))}
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.coral, marginTop: 10 }}>Nota: sin cebolla</div>
          </div>
          <div style={{ width: 300, background: 'rgba(255,244,230,0.12)', borderRadius: 30, padding: 26 }}>
            <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 36, color: C.cream, opacity: 0.8 }}>Mesa 2</div>
            <div style={{ fontFamily: BODY, fontSize: 28, color: C.cream, opacity: 0.6, marginTop: 10 }}>En preparación</div>
          </div>
        </div>
      </div>
    </SceneFade>
  );
};

// ---------- Scene 4: edit price / sold out ----------
const S4 = ({ dur }) => {
  const f = useCurrentFrame();
  const typed = f >= T3.editPrice;
  const saved = f >= T3.editPrice + 18;
  const sw = interpolate(f, [T3.soldOut, T3.soldOut + 8], [0, 1], { ...clamp, easing: ease });
  return (
    <SceneFade dur={dur} bg={C.cream}>
      <Caption top={230} size={72} segs={[['Cambiar un precio o sacar un plato'], ['lleva segundos', C.coral]]} />
      <PhoneFrame top={600} height={980} enterAt={2}>
        <div style={{ height: 130, background: C.white, display: 'flex', alignItems: 'flex-end', padding: '0 34px 22px', borderBottom: '2px solid #EDE2D4' }}>
          <span style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 38, color: C.navy }}>Panel del local</span>
          <span style={{ marginLeft: 'auto' }}><DemoTag /></span>
        </div>
        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[['Milanesa con papas', true], ['Ravioles con salsa', false], ['Ensalada César', false]].map(([n, edit], i) => {
            const isSoldRow = i === 1;
            return (
              <div key={n} style={{ background: C.white, borderRadius: 26, padding: '22px 24px', border: edit && typed && !saved ? `4px solid ${C.coral}` : '4px solid transparent' }}>
                <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 32, color: C.navy, opacity: isSoldRow ? 1 - 0.5 * sw : 1 }}>{n}</div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
                  <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32, color: edit && typed ? C.coral : C.muted, background: '#F6EEE3', padding: '8px 18px', borderRadius: 14 }}>
                    {edit ? (typed ? '$9.800' : '$9.200') : ['$9.200', '$7.800', '$6.900'][i]}
                    {edit && typed && !saved && <span style={{ opacity: Math.floor(f / 6) % 2 }}>|</span>}
                  </span>
                  {edit && saved && <span style={{ marginLeft: 16, display: 'flex', alignItems: 'center', gap: 8, fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.navy }}><Check size={36} /> Guardado</span>}
                  {isSoldRow && (
                    <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, fontFamily: BODY, fontWeight: 700, fontSize: 26, color: sw > 0.5 ? C.coral : C.muted }}>
                      {sw > 0.5 ? 'Agotado' : 'Disponible'}
                      <span style={{ width: 84, height: 46, borderRadius: 23, background: sw > 0.5 ? C.coral : '#D9CFC3', position: 'relative' }}>
                        <span style={{ position: 'absolute', top: 5, left: 5 + sw * 38, width: 36, height: 36, borderRadius: 18, background: C.white }} />
                      </span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </PhoneFrame>
    </SceneFade>
  );
};

// ---------- Scene 5 & 6 ----------
const S5 = ({ dur }) => (
  <SceneFade dur={dur} bg={C.dark4}>
    <Illustration src="4-crece.png" dur={dur} top={700} from={1.0} to={1.08} />
    <Caption top={250} color={C.cream} start={2} size={74} segs={[['Menos tiempo en tareas repetidas,'], ['más tiempo para tus clientes', C.coral]]} />
    <div style={{ position: 'absolute', top: 1480, width: '100%', display: 'flex', justifyContent: 'center', gap: 22 }}>
      <Chip label="+ tiempo" at={30} accent />
      <Chip label="+ orden" at={40} />
    </div>
  </SceneFade>
);

const S6 = ({ dur, pillAt }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1.08, 1.0], { ...clamp, easing: ease });
  const p = usePop(pillAt, 11);
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, f - pillAt - 20) / 4);
  return (
    <SceneFade dur={dur} fadeOut={0} bg={C.cream}>
      <Img src={staticFile('5-cierre-logo-vertical.png')} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, transform: `scale(${s})` }} />
      <Caption top={330} start={4} segs={[['Tu restaurante,'], ['más ordenado.', C.coral]]} size={88} />
      <div style={{
        position: 'absolute', top: 1390, left: '50%', transform: `translateX(-50%) scale(${p * pulse})`,
        background: C.coral, color: C.white, fontFamily: TITLE, fontWeight: 700, fontSize: 62,
        padding: '24px 56px', borderRadius: 70, boxShadow: '0 16px 36px rgba(255,90,54,0.35)', whiteSpace: 'nowrap',
      }}>kiondaia.com</div>
    </SceneFade>
  );
};

export const Reel3 = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['700 80px "Space Grotesk"', '400 30px "DM Sans"', '700 30px "DM Sans"'].map((x) => document.fonts.load(x)))
      .then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <Sequence from={T3.s1[0]} durationInFrames={T3.s1[1]}><S1 dur={T3.s1[1]} /></Sequence>
      <Sequence from={T3.s2[0]} durationInFrames={T3.s2[1]}><S2 dur={T3.s2[1]} /></Sequence>
      <Sequence from={T3.s3[0]} durationInFrames={T3.s3[1]}><S3 dur={T3.s3[1]} /></Sequence>
      <Sequence from={T3.s4[0]} durationInFrames={T3.s4[1]}><S4 dur={T3.s4[1]} /></Sequence>
      <Sequence from={T3.s5[0]} durationInFrames={T3.s5[1]}><S5 dur={T3.s5[1]} /></Sequence>
      <Sequence from={T3.s6[0]} durationInFrames={T3.s6[1]}><S6 dur={T3.s6[1]} pillAt={T3.pill} /></Sequence>
    </AbsoluteFill>
  );
};
