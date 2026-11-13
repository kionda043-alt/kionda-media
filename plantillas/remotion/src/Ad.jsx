import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, Audio, Sequence, staticFile, useCurrentFrame,
  interpolate, delayRender, continueRender,
} from 'remotion';
import { C, TITLE, BODY, ease, clamp, usePop, SceneFade, Caption, Check } from './Reel';

// ---------- timing (frames @30fps) ----------
// Se ajusta a la voz real: ver T y VOZ abajo.
const HOOKLEN = { A: 3.12 - 0.06, B: 5.98 - 3.50, C: 9.18 - 6.30 };
const SPEED = 1.12;
export const timing = (hook) => {
  const r = (t) => 0.15 + (HOOKLEN[hook] + 0.12 + (t - 9.48)) / SPEED; // segundos en el video
  const F = (sec) => Math.round(sec * 30);
  const chat0 = F(r(9.48)) - 6;
  const ben0 = F(r(15.15)) - 4;
  const close0 = F(r(20.68)) - 4;
  const total = F(r(23.12)) + 26;
  return {
    hook: [0, chat0 + 6], chat: [chat0, ben0 - chat0 + 6], benef: [ben0, close0 - ben0 + 6],
    close: [close0, total - close0], total,
    pill: F(r(19.14)) - ben0,
  };
};
export const T = timing('A');

const WA = { bg: '#0b141a', head: '#1f2c34', in: '#1f2c34', out: '#005c4b', text: '#e9edef', sub: '#8696a0' };

// Imagen vertical 1024x1536 a pantalla completa (cover), con zoom lento
const FullImg = ({ src, dur, from = 1.0, to = 1.08, origin = '50% 70%' }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [from, to], clamp);
  return (
    <Img src={staticFile(src)} style={{
      position: 'absolute', left: -100, top: 0, width: 1280, height: 1920,
      transform: `scale(${s})`, transformOrigin: origin,
    }} />
  );
};

const Notif = ({ x, y, text, time, at, rot = 0, dark }) => {
  const p = usePop(at, 12);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 470, padding: '20px 26px',
      background: dark ? 'rgba(255,244,230,0.97)' : '#fff', borderRadius: 30,
      boxShadow: '0 18px 40px rgba(20,17,43,0.30)', display: 'flex', alignItems: 'center', gap: 20,
      opacity: Math.min(1, p * 1.4), transform: `scale(${0.6 + 0.4 * p}) rotate(${rot}deg)`,
    }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: C.coral, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.navy }}>
          <span>WhatsApp</span>{time && <span style={{ color: C.muted, fontWeight: 500 }}>{time}</span>}
        </div>
        <div style={{ fontFamily: BODY, fontSize: 32, color: C.navy, marginTop: 2 }}>{text}</div>
      </div>
    </div>
  );
};

const Clock = ({ at, time }) => {
  const p = usePop(at, 11);
  return (
    <div style={{
      position: 'absolute', top: 640, left: '50%', transform: `translateX(-50%) scale(${p})`,
      background: C.lime, color: C.navy, fontFamily: TITLE, fontWeight: 700, fontSize: 64,
      padding: '12px 40px', borderRadius: 60, letterSpacing: 1,
    }}>{time}</div>
  );
};

// ---------- Ganchos ----------
const HookA = ({ dur }) => (
  <SceneFade dur={dur} fadeIn={0} bg={C.navy}>
    <OffthreadVideo src={staticFile('ad-clip-noche.mp4')} muted style={{
      position: 'absolute', left: -60, top: 0, width: 1200, height: 2090, objectFit: 'cover',
    }} />
    <Caption top={250} color={C.cream} size={84} segs={[['¿Tu negocio responde WhatsApp a las'], ['3 de la mañana?', C.coral]]} />
    <Clock at={22} time="03:02" />
  </SceneFade>
);

const HookB = ({ dur }) => (
  <SceneFade dur={dur} fadeIn={0} bg={C.cream}>
    <FullImg src="ad-mensajes.png" dur={dur} from={1.0} to={1.1} />
    <Caption top={250} size={92} segs={[['Tus clientes escriben.'], ['¿Quién les contesta?', C.coral]]} />
    <Notif x={60} y={640} text="¿Hay turno mañana?" at={14} rot={-3} />
    <Notif x={560} y={770} text="¿Cuánto sale?" at={24} rot={3} />
    <Notif x={110} y={900} text="¿Dónde están?" at={34} rot={2} />
  </SceneFade>
);

const HookC = ({ dur }) => (
  <SceneFade dur={dur} fadeIn={0} bg={C.navy}>
    <FullImg src="ad-local-noche.png" dur={dur} from={1.04} to={1.14} />
    <Caption top={250} color={C.cream} size={84} segs={[['Mientras duermes,'], ['tus clientes siguen escribiendo.', C.coral]]} />
    <Notif dark x={60} y={620} text="¿Hay turno mañana?" time="02:47" at={14} rot={-3} />
    <Notif dark x={550} y={760} text="¿Cuánto sale?" time="03:15" at={26} rot={3} />
    <Notif dark x={100} y={900} text="¿Abren el sábado?" time="04:02" at={38} rot={2} />
  </SceneFade>
);

// ---------- Chat recreado (Demo) ----------
const Appear = ({ at, align = 'flex-start', children }) => {
  const f = useCurrentFrame();
  const p = usePop(at, 15);
  if (f < at) return null;
  return (
    <div style={{ alignSelf: align, maxWidth: '84%', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px) scale(${0.92 + 0.08 * p})`, transformOrigin: align === 'flex-end' ? '100% 100%' : '0% 100%' }}>
      {children}
    </div>
  );
};

const Bub = ({ at, mine, time, children }) => (
  <Appear at={at} align={mine ? 'flex-end' : 'flex-start'}>
    <div style={{
      background: mine ? WA.out : WA.in, color: WA.text, fontFamily: BODY, fontSize: 36, lineHeight: 1.3,
      padding: '18px 24px 12px', borderRadius: mine ? '24px 6px 24px 24px' : '6px 24px 24px 24px',
    }}>
      {children}
      <div style={{ textAlign: 'right', fontSize: 22, color: WA.sub, marginTop: 4 }}>{time}{mine && <span style={{ color: '#53bdeb' }}> ✓✓</span>}</div>
    </div>
  </Appear>
);

const Typing = ({ from, to }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  return (
    <div style={{ alignSelf: 'flex-start', background: WA.in, borderRadius: '6px 24px 24px 24px', padding: '22px 28px', display: 'flex', gap: 10 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 13, height: 13, borderRadius: 7, background: WA.sub, opacity: 0.35 + 0.65 * Math.max(0, Math.sin((f - i * 3) / 2.5)) }} />
      ))}
    </div>
  );
};

const Chips = ({ at, options, pick, pickAt, hideAt }) => {
  const f = useCurrentFrame();
  if (f >= hideAt) return null;
  return (
    <Appear at={at}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {options.map((o) => {
          const on = o === pick && f >= pickAt;
          const press = o === pick ? interpolate(f, [pickAt - 4, pickAt, pickAt + 4], [1, 0.88, 1], clamp) : 1;
          return (
            <div key={o} style={{ position: 'relative', padding: '14px 28px', borderRadius: 40, fontFamily: BODY, fontWeight: 700, fontSize: 32,
              border: `3px solid ${C.coral}`, background: on ? C.coral : 'transparent', color: on ? '#fff' : C.coral, transform: `scale(${press})` }}>
              {o}
              {o === pick && <Tap at={pickAt} />}
            </div>
          );
        })}
      </div>
    </Appear>
  );
};

// Círculo de "toque"
const Tap = ({ at }) => {
  const f = useCurrentFrame();
  const show = interpolate(f, [at - 8, at - 3, at + 6, at + 12], [0, 1, 1, 0], clamp);
  const ring = interpolate(f, [at, at + 12], [1, 1.9], clamp);
  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', width: 70, height: 70, marginLeft: -35, marginTop: -35, borderRadius: 35,
      background: 'rgba(255,255,255,0.45)', border: '3px solid #fff', opacity: show, transform: `scale(${ring})`, pointerEvents: 'none' }} />
  );
};

// tiempos dentro de la escena de chat
const K = { g: 8, c1: 20, p1: 44, u1: 48, t1: [53, 66], b2: 66, c2: 74, p2: 94, u2: 98, t2: [101, 110], b3: 110, done: 126 };

const Phone = ({ time }) => {
  const f = useCurrentFrame();
  const enter = interpolate(f, [0, 14], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{
      position: 'absolute', left: 160, top: 480, width: 760, height: 1170, borderRadius: 86,
      background: C.navy, padding: 16, boxShadow: '0 40px 80px rgba(20,17,43,0.35)',
      transform: `translateY(${(1 - enter) * 300}px)`, opacity: enter,
    }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 72, overflow: 'hidden', background: WA.bg, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: WA.head, padding: '22px 40px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: BODY, fontWeight: 700, fontSize: 24, color: WA.text, padding: '0 14px 16px' }}>
            <span>{time}</span><span>● ● ▮</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 78, height: 78, borderRadius: 39, border: `3px dashed ${C.coral}`, background: '#2a3942', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 13, lineHeight: 1.05, color: '#ffb4a3' }}>Tu logo<br />aquí</div>
            <div>
              <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 34, color: WA.text }}>Tu negocio</div>
              <div style={{ fontFamily: BODY, fontSize: 24, color: WA.sub }}>en línea</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'flex-end' }}>
          <Bub at={K.g} time="03:02">¡Hola! 👋 Soy el asistente de Tu negocio. ¿Para qué servicio quieres sacar turno?</Bub>
          <Chips at={K.c1} options={['Servicio completo', 'Atención estándar']} pick="Servicio completo" pickAt={K.p1} hideAt={K.u1} />
          <Bub at={K.u1} mine time="03:02">Servicio completo</Bub>
          <Typing from={K.t1[0]} to={K.t1[1]} />
          <Bub at={K.b2} time="03:02">Tengo libre mañana a las 10:00, 11:30 o 16:00. ¿Cuál prefieres?</Bub>
          <Chips at={K.c2} options={['10:00', '11:30', '16:00']} pick="11:30" pickAt={K.p2} hideAt={K.u2} />
          <Bub at={K.u2} mine time="03:03">11:30</Bub>
          <Typing from={K.t2[0]} to={K.t2[1]} />
          <Bub at={K.b3} time="03:03">Listo ✅ Tu turno quedó para mañana a las 11:30.</Bub>
        </div>
      </div>
    </div>
  );
};

const ChatScene = ({ dur, time }) => {
  const f = useCurrentFrame();
  const swap = interpolate(f, [K.done - 6, K.done], [0, 1], clamp);
  const pop = usePop(K.done, 11);
  return (
    <SceneFade dur={dur} bg={C.cream}>
      <div style={{ position: 'absolute', top: 225, width: '100%', textAlign: 'center', opacity: 1 - swap }}>
        <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 68, color: C.navy, letterSpacing: -1.5, lineHeight: 1.05 }}>Un bot con IA<br />da turnos por <span style={{ color: C.coral }}>WhatsApp</span></div>
      </div>
      {f >= K.done - 6 && (
        <div style={{ position: 'absolute', top: 270, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: swap, transform: `scale(${0.85 + 0.15 * pop})` }}>
          <Check size={78} />
          <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 78, color: C.navy, letterSpacing: -1.5 }}>Turno <span style={{ color: C.coral }}>confirmado</span></div>
        </div>
      )}
      <div style={{ position: 'absolute', top: 400, left: 0, width: '100%', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', padding: '6px 22px', borderRadius: 30, border: `3px solid ${C.navy}`, fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.navy }}>Demo</span>
      </div>
      <Phone time={time} />
    </SceneFade>
  );
};

// ---------- Beneficio ----------
const Label = ({ x, text, at }) => {
  const p = usePop(at, 13);
  return (
    <div style={{ position: 'absolute', top: 1175, left: x - 160, width: 320, textAlign: 'center', fontFamily: TITLE, fontWeight: 700, fontSize: 50, color: C.navy, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>{text}</div>
  );
};

const Benefit = ({ dur, pill = 107 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1.0, 1.05], clamp);
  const p = usePop(pill, 11);
  return (
    <SceneFade dur={dur} bg="#FEF1E3">
      <Img src={staticFile('ad-iconos.png')} style={{ position: 'absolute', left: 30, top: 430, width: 1020, height: 1020, transform: `scale(${s})` }} />
      <Caption top={250} size={88} start={2} segs={[['Responde solo,'], ['las\u00A024\u00A0horas', C.coral]]} />
      <Label x={233} text="Turnos" at={4} />
      <Label x={540} text="Avisos" at={22} />
      <Label x={848} text="Consultas" at={40} />
      <div style={{
        position: 'absolute', top: 1330, left: '50%', transform: `translateX(-50%) scale(${p})`,
        background: C.lime, color: C.navy, fontFamily: TITLE, fontWeight: 700, fontSize: 48,
        padding: '18px 44px', borderRadius: 60, whiteSpace: 'nowrap',
      }}>+ tiempo para ti</div>
    </SceneFade>
  );
};

// ---------- Cierre ----------
const Close = ({ dur }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1.06, 1.0], { ...clamp, easing: ease });
  const p = usePop(16, 11);
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, f - 36) / 4);
  return (
    <SceneFade dur={dur} fadeOut={0} bg={C.cream}>
      <Img src={staticFile('5-cierre-logo-vertical.png')} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, transform: `scale(${s})` }} />
      <Caption top={320} start={2} size={90} segs={[['Pruébalo gratis'], ['en\u00A01\u00A0minuto', C.coral]]} />
      <div style={{
        position: 'absolute', top: 1380, left: '50%', transform: `translateX(-50%) scale(${p * pulse})`,
        background: C.coral, color: '#fff', fontFamily: TITLE, fontWeight: 700, fontSize: 62,
        padding: '24px 56px', borderRadius: 70, boxShadow: '0 16px 36px rgba(255,90,54,0.35)', whiteSpace: 'nowrap',
      }}>kiondaia.com/probar</div>
      <div style={{ position: 'absolute', top: 1530, width: '100%', textAlign: 'center', fontFamily: BODY, fontWeight: 500, fontSize: 34, color: C.muted, opacity: p }}>Sin registrarte · con IA real</div>
    </SceneFade>
  );
};

// ---------- composición ----------
const HOOKS = { A: HookA, B: HookB, C: HookC };

export const Ad = ({ hook = 'A', voice = null, music = 'bouncy.wav' }) => {
  const T = timing(hook);
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([
      document.fonts.load('700 80px "Space Grotesk"'),
      document.fonts.load('400 30px "DM Sans"'),
      document.fonts.load('500 30px "DM Sans"'),
      document.fonts.load('700 30px "DM Sans"'),
    ]).then(() => continueRender(handle));
  }, [handle]);
  const Hook = HOOKS[hook];
  const time = '03:02';
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <Sequence from={T.hook[0]} durationInFrames={T.hook[1]}><Hook dur={T.hook[1]} /></Sequence>
      <Sequence from={T.chat[0]} durationInFrames={T.chat[1]}><ChatScene dur={T.chat[1]} time={time} /></Sequence>
      <Sequence from={T.benef[0]} durationInFrames={T.benef[1]}><Benefit dur={T.benef[1]} pill={T.pill} /></Sequence>
      <Sequence from={T.close[0]} durationInFrames={T.close[1]}><Close dur={T.close[1]} /></Sequence>
      {music && <Audio src={staticFile(music)} volume={(f) => interpolate(f, [0, 6, T.total - 25, T.total], [0, voice ? 0.22 : 0.8, voice ? 0.22 : 0.8, 0], clamp)} />}
      {voice && <Audio src={staticFile(voice)} />}
    </AbsoluteFill>
  );
};
