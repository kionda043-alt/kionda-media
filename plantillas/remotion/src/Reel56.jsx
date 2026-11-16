import React, { useEffect, useState } from 'react';
import { delayRender, continueRender, AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, interpolate, OffthreadVideo } from 'remotion';
import { C, TITLE, BODY, ease, clamp, usePop, SceneFade, Caption, Check } from './Reel';
import { BRAND, EjemploTag, Phone, OwnerBar, BgImage, PublicMenu, QR } from './Reel4';

// Reels cortos de la carta digital (kiondaia.com/carta). Tiempos en frames (30 fps), sincronizados con la voz.
export const T5 = { a: [0, 150], b: [146, 125], c: [267, 152], d: [415, 165], total: 580 };
export const T6 = { a: [0, 105], b: [101, 86], c: [183, 217], d: [396, 58], e: [450, 160], total: 610 };

const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['700 80px "Space Grotesk"', '400 30px "DM Sans"', '700 30px "DM Sans"'].map((x) => document.fonts.load(x)))
      .then(() => continueRender(handle));
  }, [handle]);
};

// caption que cambia según el frame: steps = [[desde, segs], ...]
const StepCaption = ({ steps, top = 230, size = 78, width = 900, color }) => {
  const f = useCurrentFrame();
  let cur = steps[0];
  steps.forEach((s) => { if (f >= s[0]) cur = s; });
  return <Caption key={cur[0]} top={top} size={size} width={width} start={cur[0]} color={color} segs={cur[1]} />;
};

// ---------- cierre compartido ----------
const Close = ({ dur, swapAt = 52 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1.06, 1.0], { ...clamp, easing: ease });
  const p = usePop(swapAt + 6, 11);
  const badge = usePop(12, 12);
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, f - swapAt - 26) / 4);
  return (
    <SceneFade dur={dur} fadeOut={0} bg={C.cream}>
      <Img src={staticFile('5-cierre-logo-vertical.png')} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, transform: `scale(${s})` }} />
      {f < swapAt + 10 && (
        <Img src={staticFile('carta-cierre.png')} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover', opacity: interpolate(f, [swapAt, swapAt + 10], [1, 0], clamp) }} />
      )}
      <Caption top={300} start={2} size={92} segs={[['Pruébalo'], ['15 días gratis', C.coral]]} />
      <div style={{ position: 'absolute', top: 540, width: '100%', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', background: C.lime, color: C.navy, fontFamily: TITLE, fontWeight: 700, fontSize: 46, padding: '14px 36px', borderRadius: 50, transform: `scale(${badge})` }}>sin tarjeta</span>
      </div>
      <div style={{
        position: 'absolute', top: 1400, left: '50%', transform: `translateX(-50%) scale(${p * pulse})`,
        background: C.coral, color: C.white, fontFamily: TITLE, fontWeight: 700, fontSize: 60,
        padding: '24px 52px', borderRadius: 70, boxShadow: '0 16px 36px rgba(255,90,54,0.35)', whiteSpace: 'nowrap',
      }}>kiondaia.com/carta</div>
    </SceneFade>
  );
};

// ================= REEL 5: cambié un precio en 5 segundos =================
const R5A = ({ dur }) => (
  <SceneFade dur={dur} fadeIn={0} bg={C.cream}>
    <BgImage src="carta-precio.png" dur={dur} from={1.0} to={1.1} />
    <StepCaption top={240} size={90} steps={[
      [0, [['¿Subió'], ['el café?', C.coral]]],
      [40, [['Cambiar un precio'], ['lleva 5 segundos', C.coral]]],
    ]} />
  </SceneFade>
);

const Stopwatch = ({ start, end }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [start, end], [0, 5], clamp);
  const p = usePop(start, 12);
  return (
    <div style={{ position: 'absolute', left: 700, top: 500, background: C.navy, color: C.lime, fontFamily: TITLE, fontWeight: 700, fontSize: 56, padding: '14px 30px', borderRadius: 40, transform: `scale(${p}) rotate(4deg)`, boxShadow: '0 16px 30px rgba(20,17,43,0.3)' }}>
      0:0{Math.min(5, Math.floor(t))}
    </div>
  );
};

const R5B = ({ dur }) => {
  const f = useCurrentFrame();
  const typeAt = 42, saveAt = 93;
  const old = '3500', neu = '3800';
  const typed = f < typeAt ? old : neu.slice(0, Math.min(4, Math.floor((f - typeAt) / 5) + 1)).padEnd(1, '');
  const saved = f >= saveAt;
  const press = interpolate(f, [saveAt - 4, saveAt, saveAt + 4], [1, 0.92, 1], clamp);
  return (
    <SceneFade dur={dur} bg={C.cream}>
      <StepCaption top={220} size={72} width={860} steps={[
        [0, [['Abres tu panel,']]],
        [typeAt - 6, [['escribes el'], ['precio nuevo', C.coral]]],
        [saveAt - 6, [['y guardas', C.coral]]],
      ]} />
      <Phone top={600} height={1000} enterAt={0}>
        <OwnerBar tab="Carta" />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 210, background: SCREEN_SHEET, borderRadius: '36px 36px 0 0', padding: '30px 30px', transform: `translateY(${interpolate(f, [8, 22], [800, 0], { ...clamp, easing: ease })}px)`, boxShadow: '0 -10px 30px rgba(20,17,43,0.15)' }}>
          <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 36, color: C.navy, marginBottom: 22 }}>Editar producto</div>
          <Field label="Nombre" value="Café con leche" />
          <Field label="Sección" value="Cafetería" />
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 22, color: C.muted, margin: '6px 0 10px' }}>Tamaños y precios</div>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={fieldBox}>Taza</div>
            <div style={{ ...fieldBox, border: f >= typeAt && !saved ? `4px solid ${C.coral}` : fieldBox.border, color: f >= typeAt ? C.coral : C.navy }}>
              {typed}{f >= typeAt && !saved && <span style={{ opacity: Math.floor(f / 6) % 2 }}>|</span>}
            </div>
          </div>
          <div style={{ marginTop: 34, background: saved ? '#2FA56B' : C.coral, color: C.white, fontFamily: BODY, fontWeight: 700, fontSize: 30, textAlign: 'center', padding: '20px 0', borderRadius: 20, transform: `scale(${press})`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            {saved ? <><Check size={36} bg={C.white} color="#2FA56B" /> Guardado</> : 'Guardar'}
          </div>
          <div style={{ position: 'absolute', top: 24, right: 30 }}><EjemploTag /></div>
        </div>
      </Phone>
      <Stopwatch start={6} end={saveAt + 6} />
    </SceneFade>
  );
};

const SCREEN_SHEET = '#FFF0E2';
const fieldBox = { flex: 1, background: C.white, border: '3px solid #EADFD2', borderRadius: 16, padding: '16px 20px', fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.navy };
const Field = ({ label, value }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 22, color: C.muted, marginBottom: 8 }}>{label}</div>
    <div style={fieldBox}>{value}</div>
  </div>
);

const R5C = ({ dur }) => {
  const f = useCurrentFrame();
  const flash = interpolate(f, [8, 14, 50], [0, 1, 0], clamp);
  const qrP = usePop(46, 12);
  const paperP = usePop(100, 12);
  return (
    <SceneFade dur={dur} bg={C.cream}>
      <StepCaption top={220} size={74} width={880} steps={[
        [0, [['Tus clientes ya lo ven,'], ['con el mismo QR', C.coral]]],
        [100, [['Sin reimprimir'], ['nada', C.coral]]],
      ]} />
      <Phone top={600} height={1000} enterAt={0}>
        <PublicMenu color={BRAND} items={[['Café espresso', '$2.800'], ['Café con leche', '$3.500'], ['Capuchino', '$4.200'], ['Medialunas', '$1.200']]} priceOverride={[1, f >= 8 ? '$3.800' : '$3.500']} priceFlash={flash} />
        <div style={{ position: 'absolute', top: 24, right: 30 }}><EjemploTag dark /></div>
      </Phone>
      <div style={{ position: 'absolute', left: 700, top: 1400, background: C.white, borderRadius: 30, padding: 22, boxShadow: '0 24px 50px rgba(20,17,43,0.3)', transform: `scale(${qrP}) rotate(5deg)`, textAlign: 'center' }}>
        <QR size={220} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 14, fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.navy }}><Check size={34} /> Mismo QR</div>
      </div>
      {f >= 100 && (() => {
        const p = paperP;
        return (
          <div style={{ position: 'absolute', left: 60, top: 1250, width: 260, height: 320, background: '#FBF3E4', borderRadius: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.25)', transform: `scale(${p}) rotate(-8deg)`, padding: 24 }}>
            {[0, 1, 2, 3].map((k) => <div key={k} style={{ height: 10, background: 'rgba(20,17,43,0.25)', borderRadius: 5, margin: '22px 0', width: `${90 - (k % 2) * 30}%` }} />)}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 300, height: 14, background: C.coral, borderRadius: 7, transform: 'rotate(-35deg)' }} />
            </div>
          </div>
        );
      })()}
    </SceneFade>
  );
};

export const Reel5 = () => {
  useFonts();
  const seq = [[T5.a, R5A], [T5.b, R5B], [T5.c, R5C], [T5.d, (p) => <Close {...p} swapAt={52} />]];
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      {seq.map(([[from, dur], S], i) => <Sequence key={i} from={from} durationInFrames={dur}><S dur={dur} /></Sequence>)}
    </AbsoluteFill>
  );
};

// ================= REEL 6: se terminó la cerveza =================
const R6A = ({ dur }) => (
  <SceneFade dur={dur} fadeIn={0} bg={C.cream}>
    <AbsoluteFill><OffthreadVideo src={staticFile('carta-clip-cerveza.mp4')} muted style={{ width: 1080, height: 1920, objectFit: 'cover' }} /></AbsoluteFill>
    <StepCaption top={240} size={92} width={900} steps={[
      [0, [['Viernes'], ['a la noche', C.coral]]],
      [40, [['Se terminó la'], ['cerveza tirada', C.coral]]],
    ]} />
  </SceneFade>
);

const R6B = ({ dur }) => {
  const tables = [[150, 760], [600, 700], [260, 1170], [700, 1130]];
  return (
    <SceneFade dur={dur} bg={C.navy}>
      <Caption top={230} size={74} width={900} color={C.cream} segs={[['Antes, había que avisar'], ['mesa por mesa', C.coral]]} />
      {tables.map(([x, y], i) => {
        const p = usePop(6 + i * 12, 12);
        return (
          <div key={i}>
            <div style={{ position: 'absolute', left: x, top: y + 120, width: 240, height: 120, borderRadius: '50%', background: '#2A2540', border: '6px solid #3A3460' }} />
            <div style={{ position: 'absolute', left: x - 10, top: y, background: C.cream, color: C.navy, fontFamily: BODY, fontWeight: 700, fontSize: 30, padding: '16px 24px', borderRadius: '26px 26px 26px 6px', transform: `scale(${p})`, transformOrigin: '0% 100%', whiteSpace: 'nowrap' }}>No hay tirada…</div>
          </div>
        );
      })}
    </SceneFade>
  );
};

const R6C = ({ dur }) => {
  const f = useCurrentFrame();
  const on = interpolate(f, [22, 30], [0, 1], { ...clamp, easing: ease });
  const off = interpolate(f, [165, 173], [0, 1], { ...clamp, easing: ease });
  const t = on * (1 - off);
  const panelIn = interpolate(f, [4, 16], [220, 0], { ...clamp, easing: ease });
  const tap = (at) => interpolate(f, [at - 6, at, at + 10], [0, 1, 0], clamp);
  const ring = Math.max(tap(24), tap(167));
  return (
    <SceneFade dur={dur} bg={C.cream}>
      <StepCaption top={220} size={74} width={880} steps={[
        [0, [['Ahora, un toque'], ['en tu panel', C.coral]]],
        [56, [['Y en la carta aparece'], ['sin stock', C.coral]]],
        [134, [['Cuando vuelve,'], ['otro toque', C.coral]]],
        [192, [['Y listo', C.coral]]],
      ]} />
      <Phone top={600} height={1000} enterAt={0}>
        <PublicMenu color={BRAND} items={[['Cerveza tirada', '$5.500'], ['Cerveza en lata', '$4.200'], ['Gaseosa', '$3.200'], ['Agua mineral', '$2.500']]} soldOut={t > 0.5 && f >= 58 && f < 172 ? 0 : -1} />
        <div style={{ position: 'absolute', top: 24, right: 30 }}><EjemploTag dark /></div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 30, background: C.navy, borderRadius: 26, padding: '22px 26px', display: 'flex', alignItems: 'center', transform: `translateY(${panelIn}px)` }}>
          <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 27, color: C.cream }}>Cerveza tirada</span>
          <span style={{ marginLeft: 'auto', fontFamily: BODY, fontWeight: 700, fontSize: 22, color: t > 0.5 ? C.coral : C.lime, marginRight: 14 }}>{t > 0.5 ? 'Sin stock' : 'Disponible'}</span>
          <span style={{ width: 84, height: 46, borderRadius: 23, background: t > 0.5 ? C.coral : '#2FA56B', position: 'relative' }}>
            <span style={{ position: 'absolute', top: 5, left: 5 + (1 - t) * 38, width: 36, height: 36, borderRadius: 18, background: C.white }} />
            <span style={{ position: 'absolute', left: -20, top: -24, width: 124, height: 94, borderRadius: 47, border: `5px solid ${C.lime}`, opacity: ring, transform: `scale(${0.7 + 0.5 * ring})` }} />
          </span>
        </div>
      </Phone>
    </SceneFade>
  );
};

const R6D = ({ dur }) => (
  <SceneFade dur={dur} bg={C.cream}>
    <BgImage src="carta-cierre.png" dur={dur} from={1.0} to={1.05} />
    <Caption top={260} size={90} width={900} segs={[['Tu carta,'], ['siempre al día', C.coral]]} />
  </SceneFade>
);

export const Reel6 = () => {
  useFonts();
  const seq = [[T6.a, R6A], [T6.b, R6B], [T6.c, R6C], [T6.d, R6D], [T6.e, (p) => <Close {...p} swapAt={50} />]];
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      {seq.map(([[from, dur], S], i) => <Sequence key={i} from={from} durationInFrames={dur}><S dur={dur} /></Sequence>)}
    </AbsoluteFill>
  );
};
