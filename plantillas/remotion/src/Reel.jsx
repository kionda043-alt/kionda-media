import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing, delayRender, continueRender,
} from 'remotion';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';

export const C = {
  cream: '#FFF4E6', creamImg: '#FEEFE1', navy: '#14112B', coral: '#FF5A36',
  lime: '#C6FF3D', dark2: '#181131', dark4: '#1D1238', white: '#FFFFFF',
  chatBg: '#F5E8D8', muted: '#6B6680',
};
export const TITLE = '"Space Grotesk", sans-serif';
export const BODY = '"DM Sans", sans-serif';
export const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };

// ---------- helpers ----------
export const usePop = (at, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness: 180, mass: 0.7 } });
};

export const SceneFade = ({ dur, fadeIn = 8, fadeOut = 10, bg, children }) => {
  const f = useCurrentFrame();
  const a = fadeIn > 0 ? interpolate(f, [0, fadeIn], [0, 1], clamp) : 1;
  const b = fadeOut > 0 ? interpolate(f, [dur - fadeOut, dur], [1, 0], clamp) : 1;
  return <AbsoluteFill style={{ backgroundColor: bg, opacity: Math.min(a, b) }}>{children}</AbsoluteFill>;
};

// Caption with word-by-word entrance. segs: [[text, color], ...]
export const Caption = ({ segs, top = 250, size = 78, start = 0, color = C.navy, width = 940 }) => {
  const frame = useCurrentFrame();
  const words = [];
  segs.forEach(([t, c]) => t.split(' ').filter(Boolean).forEach((w) => words.push([w, c || color])));
  return (
    <div style={{
      position: 'absolute', top, left: (1080 - width) / 2, width, textAlign: 'center',
      fontFamily: TITLE, fontWeight: 700, fontSize: size, lineHeight: 1.08, letterSpacing: -1.5,
    }}>
      {words.map(([w, c], i) => {
        const p = interpolate(frame - start - i * 2, [0, 9], [0, 1], { ...clamp, easing: ease });
        return (
          <span key={i} style={{
            display: 'inline-block', color: c, marginRight: '0.24em', opacity: p,
            transform: `translateY(${(1 - p) * 28}px)`,
          }}>{w}</span>
        );
      })}
    </div>
  );
};

export const Illustration = ({ src, top = 680, width = 1420, dur, from = 1.0, to = 1.07 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [from, to], clamp);
  const h = width * (941 / 1672);
  return (
    <Img src={staticFile(src)} style={{
      position: 'absolute', top, left: (1080 - width) / 2, width, height: h,
      transform: `scale(${s})`, transformOrigin: '50% 50%',
      WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 72%, transparent 100%)',
      maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 72%, transparent 100%)',
    }} />
  );
};

// ---------- Scene 1: too many messages ----------
const Notif = ({ x, y, text, at, rot }) => {
  const p = usePop(at, 12);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 420, padding: '22px 26px',
      background: C.white, borderRadius: 30, boxShadow: '0 18px 40px rgba(20,17,43,0.18)',
      display: 'flex', alignItems: 'center', gap: 20, opacity: Math.min(1, p * 1.4),
      transform: `scale(${0.6 + 0.4 * p}) rotate(${rot}deg)`,
    }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: C.coral, flexShrink: 0 }} />
      <div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.navy }}>Nuevo mensaje</div>
        <div style={{ fontFamily: BODY, fontSize: 30, color: C.muted, marginTop: 2 }}>{text}</div>
      </div>
    </div>
  );
};

const Counter = ({ at }) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [at, at + 70], [1, 99], { ...clamp, easing: Easing.in(Easing.quad) }));
  const p = usePop(at, 10);
  const pulse = 1 + 0.06 * Math.sin(f / 2.2);
  return (
    <div style={{
      position: 'absolute', left: 820, top: 610, width: 150, height: 150, borderRadius: 75,
      background: C.coral, color: C.white, fontFamily: TITLE, fontWeight: 700, fontSize: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: `scale(${p * pulse})`, boxShadow: '0 14px 30px rgba(255,90,54,0.4)',
    }}>{n >= 99 ? '+99' : n}</div>
  );
};

const Scene1 = ({ dur }) => (
  <SceneFade dur={dur} fadeIn={0} bg={C.creamImg}>
    <Illustration src="1-antes-desorden.png" dur={dur} top={720} from={1.0} to={1.1} />
    <Notif x={50} y={700} text="¿Tienen stock?" at={8} rot={-4} />
    <Notif x={590} y={860} text="¿Hacen envíos?" at={18} rot={3} />
    <Notif x={70} y={1250} text="¿Hay turno hoy?" at={28} rot={2} />
    <Notif x={600} y={1360} text="¿Cuánto sale?" at={38} rot={-3} />
    <Counter at={6} />
    <Caption top={260} segs={[['¿Tu negocio recibe'], ['más mensajes', C.coral], ['de los que puede responder?']]} />
  </SceneFade>
);

// ---------- Scene 2: the bot arrives ----------
export const Chip = ({ label, at, accent }) => {
  const p = usePop(at, 12);
  return (
    <div style={{
      padding: '20px 40px', borderRadius: 60, fontFamily: TITLE, fontWeight: 700, fontSize: 44,
      background: accent ? C.lime : C.cream, color: C.navy, opacity: Math.min(1, p * 1.5),
      transform: `translateY(${(1 - p) * 40}px) scale(${0.7 + 0.3 * p})`,
    }}>{label}</div>
  );
};

const Scene2 = ({ dur }) => (
  <SceneFade dur={dur} bg={C.dark2}>
    <Illustration src="2-llega-la-ia.png" dur={dur} top={660} from={1.06} to={1.0} />
    <Caption top={250} color={C.cream} start={4}
      segs={[['Un bot con IA atiende por'], ['WhatsApp e Instagram,', C.coral], ['las 24 horas']]} />
    <div style={{ position: 'absolute', top: 1470, width: '100%', display: 'flex', justifyContent: 'center', gap: 22 }}>
      <Chip label="WhatsApp" at={78} />
      <Chip label="Instagram" at={90} />
      <Chip label="24/7" at={150} accent />
    </div>
  </SceneFade>
);

// ---------- Scene 3: phone with chats ----------
const Typing = ({ from, to }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  return (
    <div style={{ alignSelf: 'flex-start', background: C.white, borderRadius: '28px 28px 28px 8px', padding: '22px 28px', display: 'flex', gap: 10 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 14, height: 14, borderRadius: 7, background: C.muted,
          opacity: 0.35 + 0.65 * Math.max(0, Math.sin((f - i * 3) / 2.5)),
        }} />
      ))}
    </div>
  );
};

const Appear = ({ at, children, align = 'flex-start' }) => {
  const f = useCurrentFrame();
  const p = usePop(at, 15);
  if (f < at) return null;
  return (
    <div style={{ alignSelf: align, maxWidth: '86%', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px) scale(${0.9 + 0.1 * p})`, transformOrigin: align === 'flex-end' ? '100% 100%' : '0% 100%' }}>
      {children}
    </div>
  );
};

const bubble = (mine) => ({
  background: mine ? C.navy : C.white, color: mine ? C.cream : C.navy,
  borderRadius: mine ? '28px 28px 8px 28px' : '28px 28px 28px 8px',
  padding: '24px 30px', fontFamily: BODY, fontSize: 37, lineHeight: 1.3,
  boxShadow: '0 4px 10px rgba(20,17,43,0.06)',
});

const Msg = ({ at, mine, children }) => (
  <Appear at={at} align={mine ? 'flex-end' : 'flex-start'}>
    <div style={bubble(mine)}>{children}</div>
  </Appear>
);

export const Check = ({ size = 34, color = C.navy, bg = C.lime }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);

const Buttons = ({ at, options, pick, pickAt }) => {
  const f = useCurrentFrame();
  return (
    <Appear at={at}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {options.map((o) => {
          const on = pick === o && f >= pickAt;
          const press = pick === o ? interpolate(f, [pickAt - 3, pickAt, pickAt + 4], [1, 0.9, 1], clamp) : 1;
          return (
            <div key={o} style={{
              padding: '18px 34px', borderRadius: 44, fontFamily: BODY, fontWeight: 700, fontSize: 36,
              border: `3px solid ${C.coral}`, background: on ? C.coral : C.white, color: on ? C.white : C.coral,
              transform: `scale(${press})`,
            }}>{o}</div>
          );
        })}
      </div>
    </Appear>
  );
};

const JacketIcon = () => (
  <svg width="130" height="130" viewBox="0 0 100 100">
    <path d="M35 14 L50 22 L65 14 L86 26 L92 52 L80 55 L78 40 L78 88 L22 88 L22 40 L20 55 L8 52 L14 26 Z" fill={C.navy} />
    <path d="M50 22 L50 88" stroke={C.coral} strokeWidth="3" />
  </svg>
);
const BuildingIcon = () => (
  <svg width="130" height="130" viewBox="0 0 100 100">
    <rect x="22" y="14" width="56" height="76" rx="4" fill={C.navy} />
    {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
      <rect key={`${r}${c}`} x={30 + c * 16} y={22 + r * 15} width="9" height="9" rx="1.5" fill={r === 1 && c === 1 ? C.lime : C.cream} />
    )))}
    <rect x="43" y="76" width="14" height="14" fill={C.coral} />
  </svg>
);

const ProductCard = ({ at, icon, title, sub, tag }) => (
  <Appear at={at}>
    <div style={{ background: C.white, borderRadius: 28, overflow: 'hidden', width: 540, boxShadow: '0 6px 14px rgba(20,17,43,0.08)' }}>
      <div style={{ height: 170, background: '#FFE3D6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div style={{ padding: '18px 24px 22px' }}>
        <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 38, color: C.navy }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <span style={{ fontFamily: BODY, fontSize: 31, color: C.muted }}>{sub}</span>
          {tag && <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 24, background: C.lime, color: C.navy, padding: '4px 14px', borderRadius: 20 }}>{tag}</span>}
        </div>
      </div>
    </div>
  </Appear>
);

const Steps = ({ at, checks }) => {
  const f = useCurrentFrame();
  const items = ['Confirmado', 'Preparado', 'En camino', 'Entregado'];
  return (
    <Appear at={at}>
      <div style={{ background: C.white, borderRadius: 28, padding: '28px 32px', width: 540, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {items.map((it, i) => {
          const done = checks[i] !== undefined && f >= checks[i];
          return (
            <div key={it} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {done ? <Check /> : <div style={{ width: 34, height: 34, borderRadius: 17, border: `3px solid #D9CFC3` }} />}
              <span style={{ fontFamily: BODY, fontWeight: done ? 700 : 500, fontSize: 36, color: done ? C.navy : C.muted }}>{it}</span>
            </div>
          );
        })}
      </div>
    </Appear>
  );
};

const Confirm = ({ at, title, sub }) => (
  <Appear at={at}>
    <div style={{ background: C.white, borderRadius: 28, padding: '22px 26px', display: 'flex', gap: 18, alignItems: 'center', width: 560, borderLeft: `8px solid ${C.lime}` }}>
      <Check size={50} />
      <div>
        <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 38, color: C.navy }}>{title}</div>
        <div style={{ fontFamily: BODY, fontSize: 30, color: C.muted, marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  </Appear>
);

const Handoff = ({ at }) => (
  <Appear at={at}>
    <div style={{ background: C.navy, borderRadius: 28, padding: '28px 32px', width: 560, display: 'flex', gap: 22, alignItems: 'center' }}>
      <div style={{ width: 70, height: 70, borderRadius: 35, background: C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TITLE, fontWeight: 700, fontSize: 34, color: C.white }}>V</div>
      <div>
        <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 37, color: C.cream }}>Derivado a Ventas</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 24, background: C.lime, color: C.navy, padding: '4px 14px', borderRadius: 20 }}>Prioridad alta</span>
        </div>
      </div>
    </div>
  </Appear>
);

const CHATS = [
  {
    title: 'Toma turnos', tag: 'Demo', sub: 'Turnos',
    body: () => (<>
      <Msg at={2} mine>Hola, ¿hay turno para mañana?</Msg>
      <Typing from={8} to={14} />
      <Msg at={14}>¡Hola! Mañana hay lugar en estos horarios:</Msg>
      <Buttons at={20} options={['10:00', '11:30', '16:00']} pick="11:30" pickAt={32} />
      <Confirm at={38} title="Turno confirmado" sub="Mañana 11:30 · con recordatorio" />
    </>),
  },
  {
    title: 'Vende', tag: 'Demo', sub: 'Tienda',
    body: () => (<>
      <Msg at={2} mine>¿Tienen la campera negra en talle M?</Msg>
      <Typing from={8} to={14} />
      <Msg at={14}>¡Sí! Queda en stock:</Msg>
      <ProductCard at={20} icon={<JacketIcon />} title="Campera negra" sub="Talle M" tag="En stock" />
      <Buttons at={32} options={['Agregar al pedido']} pick="Agregar al pedido" pickAt={44} />
    </>),
  },
  {
    title: 'Responde dudas', tag: 'Caso real', sub: 'Inmobiliaria',
    body: () => (<>
      <Msg at={2} mine>¿El departamento tiene cochera?</Msg>
      <Typing from={8} to={14} />
      <Msg at={14}>Sí: cochera cubierta y baulera.</Msg>
      <ProductCard at={20} icon={<BuildingIcon />} title="2 ambientes · 54 m²" sub="Con cochera" />
      <Msg at={32}>¿Es para vivir o para invertir?</Msg>
      <Buttons at={38} options={['Vivir', 'Invertir']} />
    </>),
  },
  {
    title: 'Confirma pedidos y envíos', tag: 'Demo', sub: 'Pedidos',
    body: () => (<>
      <Msg at={2}>Pedido #2481 confirmado.</Msg>
      <Steps at={10} checks={[14, 22, 30]} />
      <Msg at={38}>Llega el jueves. Aviso por acá cuando esté cerca.</Msg>
    </>),
  },
  {
    title: 'Deriva a la persona indicada', tag: 'Caso real', sub: 'Atención',
    body: () => (<>
      <Msg at={2} mine>Necesito un presupuesto para mi local.</Msg>
      <Typing from={8} to={14} />
      <Msg at={14}>Perfecto. Paso la consulta a una persona del equipo.</Msg>
      <Handoff at={28} />
    </>),
  },
];
const STARTS = [0, 57, 114, 171, 240];
const LENS = [57, 57, 57, 69, 110];
const subIdx = (f) => { let i = 0; STARTS.forEach((st, k) => { if (f >= st) i = k; }); return i; };

const ChatTitle = ({ chat, idx }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: ease });
  const out = idx === 4 ? 0 : interpolate(f, [LENS[idx] - 6, LENS[idx]], [0, 1], clamp);
  const real = chat.tag === 'Caso real';
  return (
    <div style={{ position: 'absolute', top: 230, width: '100%', textAlign: 'center', opacity: p * (1 - out), transform: `translateY(${(1 - p) * 30 - out * 20}px)` }}>
      <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: chat.title.length > 18 ? 70 : 88, color: C.navy, letterSpacing: -1.5, lineHeight: 1.05, padding: '0 60px' }}>{chat.title}</div>
      <div style={{ display: 'inline-block', marginTop: 18, padding: '8px 22px', borderRadius: 30, fontFamily: BODY, fontWeight: 700, fontSize: 28, background: real ? C.coral : 'transparent', color: real ? C.white : C.navy, border: `3px solid ${real ? C.coral : C.navy}` }}>{chat.tag}</div>
    </div>
  );
};

const Dots = () => {
  const f = useCurrentFrame();
  const idx = subIdx(f);
  return (
    <div style={{ position: 'absolute', top: 1660, width: '100%', display: 'flex', justifyContent: 'center', gap: 14 }}>
      {CHATS.map((_, i) => (
        <div key={i} style={{ width: i === idx ? 46 : 16, height: 16, borderRadius: 8, background: i === idx ? C.coral : '#E3D5C4' }} />
      ))}
    </div>
  );
};

const Phone = () => {
  const f = useCurrentFrame();
  const idx = subIdx(f);
  const chat = CHATS[idx];
  const enter = interpolate(f, [0, 14], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{
      position: 'absolute', left: 170, top: 470, width: 740, height: 1150, borderRadius: 86,
      background: C.navy, padding: 18, boxShadow: '0 40px 80px rgba(20,17,43,0.28)',
      transform: `translateY(${(1 - enter) * 300}px)`, opacity: enter,
    }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 70, overflow: 'hidden', background: C.chatBg, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 150, background: C.white, display: 'flex', alignItems: 'flex-end', padding: '0 34px 22px', gap: 20, borderBottom: '2px solid #EDE2D4' }}>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24"><path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" fill="none" stroke={C.cream} strokeWidth="2.6" strokeLinecap="round" /></svg>
          </div>
          <div>
            <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 32, color: C.navy }}>Asistente virtual</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: BODY, fontSize: 24, color: C.muted }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: '#7BC043' }} /> en línea · {chat.sub}
            </div>
          </div>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          {CHATS.map((c, i) => (
            <Sequence key={i} from={STARTS[i]} durationInFrames={i === 4 ? 1000 : LENS[i]} layout="none">
              <ChatBody chat={c} last={i === 4} len={LENS[i]} />
            </Sequence>
          ))}
        </div>
      </div>
    </div>
  );
};

const ChatBody = ({ chat, last, len }) => {
  const f = useCurrentFrame();
  const out = last ? 0 : interpolate(f, [len - 6, len], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '30px 30px', display: 'flex', flexDirection: 'column', gap: 22, justifyContent: 'flex-start', opacity: 1 - out, transform: `translateX(${-out * 80}px)` }}>
      {chat.body()}
    </div>
  );
};

const Scene3 = ({ dur }) => (
  <SceneFade dur={dur} bg={C.cream}>
    {CHATS.map((c, i) => (
      <Sequence key={i} from={STARTS[i]} durationInFrames={LENS[i]} layout="none">
        <ChatTitle chat={c} idx={i} />
      </Sequence>
    ))}
    <Phone />
    <Dots />
  </SceneFade>
);

// ---------- Scene 4: team gains time ----------
const Scene4 = ({ dur }) => {
  const p = usePop(30, 11);
  return (
    <SceneFade dur={dur} bg={C.dark4}>
      <Illustration src="4-crece.png" dur={dur} top={700} from={1.0} to={1.08} />
      <Caption top={260} color={C.cream} start={4} segs={[['Tu equipo gana'], ['tiempo', C.coral], ['para lo importante']]} />
      <div style={{
        position: 'absolute', top: 1480, left: '50%', transform: `translateX(-50%) scale(${p})`,
        background: C.lime, color: C.navy, fontFamily: TITLE, fontWeight: 700, fontSize: 46,
        padding: '18px 42px', borderRadius: 60,
      }}>+ tiempo · + orden</div>
    </SceneFade>
  );
};

// ---------- Scene 5: close ----------
const Scene5 = ({ dur }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1.08, 1.0], { ...clamp, easing: ease });
  const p = usePop(74, 11);
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, f - 95) / 4);
  return (
    <SceneFade dur={dur} fadeOut={0} bg={C.cream}>
      <Img src={staticFile('5-cierre-logo-vertical.png')} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, transform: `scale(${s})` }} />
      <Caption top={330} start={4} segs={[['Tu negocio,'], ['más ordenado.', C.coral]]} size={88} />
      <div style={{
        position: 'absolute', top: 1390, left: '50%', transform: `translateX(-50%) scale(${p * pulse})`,
        background: C.coral, color: C.white, fontFamily: TITLE, fontWeight: 700, fontSize: 62,
        padding: '24px 56px', borderRadius: 70, boxShadow: '0 16px 36px rgba(255,90,54,0.35)', whiteSpace: 'nowrap',
      }}>kiondaia.com</div>
    </SceneFade>
  );
};

// ---------- timeline ----------
export const Reel = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([
      document.fonts.load('700 80px "Space Grotesk"'),
      document.fonts.load('500 40px "Space Grotesk"'),
      document.fonts.load('400 30px "DM Sans"'),
      document.fonts.load('500 30px "DM Sans"'),
      document.fonts.load('700 30px "DM Sans"'),
    ]).then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <Sequence from={0} durationInFrames={122}><Scene1 dur={122} /></Sequence>
      <Sequence from={112} durationInFrames={202}><Scene2 dur={202} /></Sequence>
      <Sequence from={304} durationInFrames={350}><Scene3 dur={350} /></Sequence>
      <Sequence from={644} durationInFrames={100}><Scene4 dur={100} /></Sequence>
      <Sequence from={734} durationInFrames={166}><Scene5 dur={166} /></Sequence>
    </AbsoluteFill>
  );
};
