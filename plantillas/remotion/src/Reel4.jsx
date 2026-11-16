import React, { useEffect, useState } from 'react';
import { delayRender, continueRender, AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, interpolate, Audio, OffthreadVideo } from 'remotion';
import { C, TITLE, BODY, ease, clamp, usePop, SceneFade, Caption, Check } from './Reel';

// Reel 4: carta digital con QR (kiondaia.com/carta). Tiempos en frames (30 fps), sincronizados con la voz.
export const T4 = {
  s1: [0, 70],        // ¿Tu carta todavía es de papel?
  s2: [66, 106],      // Cada vez que cambia un precio, hay que volver a imprimirla.
  s3: [168, 127],     // Ahora le sacas una foto. Y la IA la lee.
  s4: [291, 102],     // Subes tu logo. Y la carta toma tus colores.
  s5: [389, 98],      // En dos minutos, tienes tu QR para las mesas.
  s6: [483, 235],     // Precio al instante / sin stock / QR siempre el mismo.
  s6b: 84, s6c: 165,  // inicio (relativo a s6) de "sin stock" y "QR siempre el mismo"
  s7: [714, 201],     // Pruébalo 15 días gratis... kiondaia.com/carta
  s7logo: 92,         // cambio a la imagen con logo dentro del cierre
  total: 915,
  imgs: { gancho: 'carta-gancho.png', ia: 'carta-ia.png', cierre: 'carta-cierre.png', clip: 'carta-clip.mp4' },
};

const BRAND = '#1F5E4A';
const SCREEN = '#FFF0E2';

const EjemploTag = ({ dark }) => (
  <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 20, border: `3px solid ${dark ? C.cream : C.navy}`, color: dark ? C.cream : C.navy, padding: '3px 12px', borderRadius: 18 }}>Ejemplo</span>
);

const Phone = ({ children, top = 600, height = 1020, enterAt = 0, left = 205, width = 670 }) => {
  const f = useCurrentFrame();
  const enter = interpolate(f, [enterAt, enterAt + 16], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{
      position: 'absolute', left, top, width, height, borderRadius: 80, background: C.navy, padding: 16,
      boxShadow: '0 40px 80px rgba(20,17,43,0.28)', transform: `translateY(${(1 - enter) * 400}px)`, opacity: enter,
    }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 66, overflow: 'hidden', background: SCREEN, position: 'relative' }}>{children}</div>
    </div>
  );
};

// barra superior del panel del dueño
const OwnerBar = ({ tab }) => (
  <div style={{ background: C.navy, padding: '46px 30px 18px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 30, color: C.cream }}>La Esquina</span>
      <span style={{ marginLeft: 'auto' }}><EjemploTag dark /></span>
    </div>
    {tab && (
      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        {['Carta', 'Diseño', 'QR', 'Mi plan'].map((t) => (
          <span key={t} style={{ flex: 1, textAlign: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 22, padding: '10px 0', borderRadius: 14, background: t === tab ? SCREEN : 'rgba(255,244,230,0.12)', color: t === tab ? C.navy : C.cream }}>{t}</span>
        ))}
      </div>
    )}
  </div>
);

const Card = ({ children, style }) => (
  <div style={{ background: C.white, borderRadius: 26, padding: 26, margin: '22px 22px 0', boxShadow: '0 4px 12px rgba(20,17,43,0.06)', ...style }}>{children}</div>
);

// ---------- carta de papel (escenas 1 y 2) ----------
const ITEMS = [['Café con leche', '$3.200', '$3.500'], ['Medialunas', '$1.000', '$1.200'], ['Tostado', '$6.000', '$6.500'], ['Cerveza tirada', '$5.000', '$5.500']];
const PaperMenu = ({ strikeFrom = 9999, x = 150, y = 640, rot = -4 }) => {
  const f = useCurrentFrame();
  const wob = Math.sin(f / 12) * 1.2;
  const p = usePop(2, 13);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 780, height: 880, background: '#FBF3E4', borderRadius: 16,
      boxShadow: '0 30px 60px rgba(0,0,0,0.35)', transform: `rotate(${rot + wob}deg) scale(${0.85 + 0.15 * p})`, opacity: p, padding: '60px 64px',
    }}>
      <div style={{ position: 'absolute', right: 70, bottom: 110, width: 180, height: 180, borderRadius: 90, border: '14px solid rgba(140,90,40,0.2)' }} />
      <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 64, color: C.navy, textAlign: 'center', letterSpacing: 6 }}>CARTA</div>
      <div style={{ height: 4, background: C.navy, margin: '20px 0 44px', opacity: 0.6 }} />
      {ITEMS.map(([n, pr, fix], i) => {
        const at = strikeFrom + i * 12;
        const s = interpolate(f, [at, at + 8], [0, 1], clamp);
        return (
          <div key={n} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 54, fontFamily: BODY, fontSize: 40, color: C.navy }}>
            <span>{n}</span>
            <span style={{ position: 'relative' }}>
              {pr}
              <span style={{ position: 'absolute', left: -6, right: -6, top: '50%', height: 6, background: C.coral, transform: `scaleX(${s}) rotate(-6deg)`, transformOrigin: 'left' }} />
              <span style={{ position: 'absolute', right: 0, top: -46, fontFamily: '"Comic Sans MS", cursive', fontWeight: 700, fontSize: 36, color: C.coral, opacity: interpolate(f, [at + 6, at + 12], [0, 1], clamp), transform: 'rotate(-8deg)', whiteSpace: 'nowrap' }}>{fix}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
};

const BgImage = ({ src, dur, from = 1.0, to = 1.08, opacity = 1 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [from, to], clamp);
  return <Img src={staticFile(src)} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover', transform: `scale(${s})`, opacity }} />;
};

const S1 = ({ dur }) => (
  <SceneFade dur={dur} fadeIn={0} fadeOut={0} bg={C.navy}>
    {T4.imgs.gancho ? <BgImage src={T4.imgs.gancho} dur={dur} /> : <PaperMenu />}
    <Caption top={250} color={T4.imgs.gancho ? C.navy : C.cream} size={88} segs={[['¿Tu carta todavía'], ['es de papel?', C.coral]]} />
  </SceneFade>
);

// copias reimpresas que se apilan
const Reprints = ({ at }) => {
  const f = useCurrentFrame();
  return [0, 1, 2].map((i) => {
    const p = interpolate(f, [at + i * 10, at + i * 10 + 14], [0, 1], { ...clamp, easing: ease });
    return (
      <div key={i} style={{ position: 'absolute', left: 620 + i * 26, top: 1380 - i * 22, width: 300, height: 360, background: '#FBF3E4', borderRadius: 10, boxShadow: '0 14px 30px rgba(0,0,0,0.35)', transform: `translateX(${(1 - p) * 500}px) rotate(${6 - i * 4}deg)`, opacity: p, padding: 26 }}>
        {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ height: 10, background: 'rgba(20,17,43,0.25)', borderRadius: 5, margin: '18px 0', width: `${90 - (k % 2) * 30}%` }} />)}
      </div>
    );
  });
};

const S2 = ({ dur }) => (
  <SceneFade dur={dur} fadeIn={6} bg={C.navy}>
    {T4.imgs.gancho ? <BgImage src={T4.imgs.gancho} dur={dur} from={1.08} to={1.14} /> : <PaperMenu strikeFrom={8} />}
    {!T4.imgs.gancho && <Reprints at={62} />}
    <Caption top={230} color={T4.imgs.gancho ? C.navy : C.cream} size={70} segs={[['Cada vez que cambia un precio,'], ['hay que volver a imprimirla', C.coral]]} />
  </SceneFade>
);

// ---------- escena 3: foto + la IA lee ----------
const Spinner = () => {
  const f = useCurrentFrame();
  return <div style={{ width: 70, height: 70, borderRadius: 35, border: '8px solid #F3D9C9', borderTopColor: C.coral, transform: `rotate(${f * 14}deg)`, margin: '0 auto' }} />;
};

const READ = [['Cafetería', ['Café espresso $2.800', 'Café con leche $3.500', 'Medialunas $1.200']], ['Sándwiches', ['Tostado de jamón y queso $6.500']], ['Bebidas', ['Cerveza tirada $5.500']]];

const FoundList = ({ f, found }) => (
<>
                <Card style={{ padding: '22px 26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: TITLE, fontWeight: 700, fontSize: 31, color: C.navy }}>
                    <Check size={44} /> Encontramos 17 productos en 5 secciones
                  </div>
                </Card>
                {READ.map(([sec, items], si) => (
                  <div key={sec} style={{ margin: '20px 22px 0' }}>
                    <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 26, color: BRAND, opacity: interpolate(f, [found + 4 + si * 8, found + 10 + si * 8], [0, 1], clamp) }}>{sec}</div>
                    {items.map((it, k) => {
                      const at = found + 6 + si * 8 + k * 4;
                      const p = interpolate(f, [at, at + 8], [0, 1], { ...clamp, easing: ease });
                      const [name, price] = [it.replace(/ \$.*/, ''), it.match(/\$.*/)[0]];
                      return (
                        <div key={it} style={{ display: 'flex', justifyContent: 'space-between', background: C.white, borderRadius: 18, padding: '16px 22px', marginTop: 10, fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.navy, opacity: p, transform: `translateX(${(1 - p) * 60}px)` }}>
                          <span>{name}</span><span>{price}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </>
);

const S3 = ({ dur }) => {
  const f = useCurrentFrame();
  const shot = 34, reading = 44, found = 92;
  const flash = interpolate(f, [shot, shot + 4, shot + 12], [0, 1, 0], clamp);
  if (T4.imgs.clip) {
    const cut = 72;
    return (
      <SceneFade dur={dur} bg={C.cream}>
        {f < cut + 8 && (
          <AbsoluteFill style={{ opacity: interpolate(f, [cut, cut + 8], [1, 0], clamp) }}>
            <OffthreadVideo src={staticFile(T4.imgs.clip)} muted style={{ width: 1080, height: 1920, objectFit: 'cover' }} />
          </AbsoluteFill>
        )}
        <Caption top={220} size={78} width={760} segs={[['Le sacas una foto'], ['y la IA la lee', C.coral]]} />
        {f >= cut && (
          <Phone top={560} enterAt={cut}>
            <OwnerBar />
            <FoundList f={f} found={cut + 4} />
          </Phone>
        )}
      </SceneFade>
    );
  }
  return (
    <SceneFade dur={dur} bg={C.cream}>
      <Caption top={220} size={78} width={760} segs={[['Le sacas una foto'], ['y la IA la lee', C.coral]]} />
      <Phone top={560} enterAt={2}>
        {f < reading ? (
          <div style={{ position: 'absolute', inset: 0, background: '#2A2540' }}>
            <div style={{ position: 'absolute', left: 60, top: 170, width: 520, height: 600, background: '#FBF3E4', borderRadius: 10, transform: 'rotate(-3deg)', padding: 40 }}>
              <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 40, color: C.navy, textAlign: 'center', letterSpacing: 4 }}>CARTA</div>
              {[0, 1, 2, 3, 4, 5, 6].map((k) => <div key={k} style={{ height: 12, background: 'rgba(20,17,43,0.3)', borderRadius: 6, margin: '34px 0', width: `${92 - (k % 3) * 18}%` }} />)}
            </div>
            {['0 0', '0 1', '1 0', '1 1'].map((pos) => {
              const [r, c] = pos.split(' ').map(Number);
              return <div key={pos} style={{ position: 'absolute', width: 80, height: 80, borderColor: C.lime, borderStyle: 'solid', borderWidth: `${r ? 0 : 8}px ${c ? 8 : 0}px ${r ? 8 : 0}px ${c ? 0 : 8}px`, top: r ? 'auto' : 140, bottom: r ? 210 : 'auto', left: c ? 'auto' : 40, right: c ? 40 : 'auto', borderRadius: 8 }} />;
            })}
            <div style={{ position: 'absolute', bottom: 50, left: '50%', marginLeft: -55, width: 110, height: 110, borderRadius: 55, border: `8px solid ${C.cream}`, background: f >= shot - 3 && f < shot + 3 ? C.coral : 'transparent' }} />
            <div style={{ position: 'absolute', inset: 0, background: C.white, opacity: flash }} />
          </div>
        ) : (
          <>
            <OwnerBar />
            {f < found ? (
              <Card style={{ textAlign: 'center', padding: '50px 26px' }}>
                <Spinner />
                <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 34, color: C.navy, marginTop: 26 }}>Leyendo tu carta…</div>
              </Card>
            ) : (
              <FoundList f={f} found={found} />
            )}
          </>
        )}
      </Phone>
    </SceneFade>
  );
};

// ---------- carta pública (lo que ve el cliente) ----------
const PublicMenu = ({ color, logoP = 1, items = [['Café espresso', '$2.800'], ['Café con leche', '$3.500'], ['Capuchino', '$4.200'], ['Medialunas', '$1.200']], soldOut = -1, priceOverride, priceFlash = 0 }) => (
  <div style={{ position: 'absolute', inset: 0, background: '#F4F1EA' }}>
    <div style={{ background: color, padding: '60px 0 34px', textAlign: 'center' }}>
      <div style={{ width: 130, height: 130, borderRadius: 65, margin: '0 auto', border: '5px solid rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${logoP})`, opacity: Math.min(1, logoP * 1.4), background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ fontFamily: 'Georgia, serif', color: C.white, textAlign: 'center', lineHeight: 1 }}><div style={{ fontSize: 46, fontWeight: 700 }}>LA</div><div style={{ fontSize: 15, letterSpacing: 2 }}>ESQUINA</div></div>
      </div>
      <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 44, color: C.white, marginTop: 18 }}>La Esquina</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 18 }}>
        {['WhatsApp', 'Instagram'].map((t) => <span key={t} style={{ fontFamily: BODY, fontWeight: 700, fontSize: 20, color: C.white, background: 'rgba(255,255,255,0.18)', padding: '8px 18px', borderRadius: 20 }}>{t}</span>)}
      </div>
    </div>
    <div style={{ margin: '24px 24px 0', background: C.white, borderRadius: 18, padding: '16px 22px', fontFamily: BODY, fontSize: 24, color: C.muted }}>Buscar en la carta…</div>
    <div style={{ display: 'flex', gap: 10, margin: '18px 24px 0' }}>
      {['Cafetería', 'Sándwiches', 'Bebidas'].map((t, i) => <span key={t} style={{ fontFamily: BODY, fontWeight: 700, fontSize: 21, padding: '9px 18px', borderRadius: 20, background: i === 0 ? color : C.white, color: i === 0 ? C.white : C.navy }}>{t}</span>)}
    </div>
    <div style={{ margin: '22px 24px 0' }}>
      {items.map(([n, pr], i) => {
        const out = i === soldOut;
        const shown = priceOverride && priceOverride[0] === i ? priceOverride[1] : pr;
        return (
          <div key={n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.white, borderRadius: 18, padding: '20px 22px', marginBottom: 12, fontFamily: BODY, fontWeight: 700, fontSize: 27, color: C.navy, opacity: out ? 0.55 : 1, outline: priceOverride && priceOverride[0] === i ? `${4 * priceFlash}px solid ${C.lime}` : 'none' }}>
            <span style={{ textDecoration: out ? 'line-through' : 'none' }}>{n}</span>
            {out ? <span style={{ fontSize: 21, color: C.coral, border: `3px solid ${C.coral}`, padding: '3px 12px', borderRadius: 14 }}>Sin stock</span> : <span>{shown}</span>}
          </div>
        );
      })}
    </div>
  </div>
);

// ---------- escena 4: el logo pinta la carta ----------
const SWATCH = [BRAND, '#C8352A', '#1E4F8C', '#7A2C8C'];
const S4 = ({ dur }) => {
  const f = useCurrentFrame();
  const logoAt = 26;
  const logoP = usePop(logoAt, 11);
  const fill = interpolate(f, [logoAt + 6, logoAt + 22], [0, 1], { ...clamp, easing: ease });
  const idx = f < 70 ? 0 : Math.min(SWATCH.length - 1, Math.floor((f - 70) / 12) + 1);
  const color = f < 70 ? `color-mix(in srgb, ${BRAND} ${fill * 100}%, #8C8796)` : SWATCH[idx % SWATCH.length];
  return (
    <SceneFade dur={dur} bg={C.cream}>
      <Caption top={220} size={72} segs={[['Subes tu logo y la carta'], ['toma tus colores', C.coral]]} />
      <Phone top={560} enterAt={0}>
        <PublicMenu color={color} logoP={logoP} />
        <div style={{ position: 'absolute', top: 24, right: 30 }}><EjemploTag dark /></div>
      </Phone>
      <div style={{ position: 'absolute', top: 1640, width: '100%', display: 'flex', justifyContent: 'center', gap: 18 }}>
        {SWATCH.map((s, i) => <div key={s} style={{ width: 54, height: 54, borderRadius: 27, background: s, border: (f >= 70 ? idx : 0) === i ? `6px solid ${C.navy}` : '6px solid transparent', opacity: interpolate(f, [70 + i * 3, 78 + i * 3], [0, 1], clamp) }} />)}
      </div>
    </SceneFade>
  );
};

// ---------- QR ----------
export const QR = ({ size = 360, fg = C.navy }) => {
  const cells = [];
  let seed = 11;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const n = 25;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const finder = (x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16);
    if (!finder && rnd() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={fg} />);
  }
  const F = ({ x, y }) => (<g><rect x={x} y={y} width="7" height="7" fill={fg} /><rect x={x + 1} y={y + 1} width="5" height="5" fill={C.white} /><rect x={x + 2} y={y + 2} width="3" height="3" fill={fg} /></g>);
  return <svg width={size} height={size} viewBox="-1 -1 27 27" style={{ background: C.white, borderRadius: size / 18 }}>{cells}<F x={0} y={0} /><F x={18} y={0} /><F x={0} y={18} /></svg>;
};

const MiniLogo = ({ s = 70 }) => (
  <div style={{ width: s, height: s, borderRadius: s / 2, background: BRAND, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontWeight: 700, color: C.white, fontSize: s * 0.36 }}>LA</div>
);

const S5 = ({ dur }) => {
  const f = useCurrentFrame();
  const sheet = interpolate(f, [34, 52], [0, 1], { ...clamp, easing: ease });
  return (
    <SceneFade dur={dur} bg={C.cream}>
      <Caption top={220} size={76} segs={[['En 2 minutos,'], ['tu QR para las mesas', C.coral]]} />
      <Phone top={600} height={980} left={70} width={600} enterAt={0}>
        <OwnerBar tab="QR" />
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 34, color: C.navy, marginBottom: 20 }}>Tu QR</div>
          <QR size={330} />
          <div style={{ marginTop: 22, background: C.coral, color: C.white, fontFamily: BODY, fontWeight: 700, fontSize: 25, padding: '16px 0', borderRadius: 18 }}>Imprimir QR para las mesas</div>
        </Card>
      </Phone>
      {/* hoja A4 con 4 tarjetas */}
      <div style={{ position: 'absolute', left: 560, top: 860, width: 470, height: 660, background: C.white, borderRadius: 14, boxShadow: '0 30px 60px rgba(20,17,43,0.3)', padding: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, transform: `translateX(${(1 - sheet) * 600}px) rotate(${4 * sheet}deg)`, opacity: sheet }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ border: '2px dashed #DDD4C8', borderRadius: 12, padding: '16px 8px', textAlign: 'center' }}>
            <MiniLogo s={48} />
            <div style={{ margin: '12px auto 0', width: 150 }}><QR size={150} /></div>
          </div>
        ))}
      </div>
    </SceneFade>
  );
};

// ---------- escena 6: siempre actualizada ----------
const S6 = ({ dur }) => {
  const f = useCurrentFrame();
  const b = T4.s6b, c = T4.s6c;
  const edited = f >= 30;
  const flash = interpolate(f, [30, 36, 60], [0, 1, 0], clamp);
  const toggle = interpolate(f, [b + 18, b + 26], [0, 1], { ...clamp, easing: ease });
  const qrP = usePop(c + 4, 12);
  const tipP = usePop(10, 12);
  const caption = f < b
    ? [['Si cambia un precio,'], ['se actualiza al instante', C.coral]]
    : f < c ? [['¿Se acabó algo?'], ['Lo marcas sin stock', C.coral]]
      : [['Y el QR es'], ['siempre el mismo', C.coral]];
  const start = f < b ? 0 : f < c ? b : c;
  return (
    <SceneFade dur={dur} bg={C.cream}>
      <Caption key={start} top={220} size={76} width={800} start={start} segs={caption} />
      <Phone top={600} height={1000} enterAt={0}>
        <PublicMenu color={BRAND} logoP={1} items={[['Café con leche', '$3.500'], ['Cerveza tirada', '$5.500'], ['Medialunas', '$1.200'], ['Tostado', '$6.500']]}
          priceOverride={[0, edited ? '$3.800' : '$3.500']} priceFlash={flash} soldOut={toggle > 0.5 ? 1 : -1} />
        <div style={{ position: 'absolute', top: 24, right: 30 }}><EjemploTag dark /></div>
        {/* mini panel del dueño: interruptor de stock */}
        {f >= b && f < c + 10 && (
          <div style={{ position: 'absolute', left: 24, right: 24, bottom: 30, background: C.navy, borderRadius: 26, padding: '22px 26px', display: 'flex', alignItems: 'center', transform: `translateY(${interpolate(f, [b, b + 12], [200, 0], { ...clamp, easing: ease })}px)` }}>
            <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 27, color: C.cream }}>Cerveza tirada</span>
            <span style={{ marginLeft: 'auto', fontFamily: BODY, fontWeight: 700, fontSize: 22, color: toggle > 0.5 ? C.coral : C.lime, marginRight: 14 }}>{toggle > 0.5 ? 'Sin stock' : 'Disponible'}</span>
            <span style={{ width: 84, height: 46, borderRadius: 23, background: toggle > 0.5 ? C.coral : '#2FA56B', position: 'relative' }}>
              <span style={{ position: 'absolute', top: 5, left: 5 + (1 - toggle) * 38, width: 36, height: 36, borderRadius: 18, background: C.white }} />
            </span>
          </div>
        )}
      </Phone>
      {f < b && (
        <div style={{ position: 'absolute', left: 640, top: 560, background: C.navy, color: C.cream, borderRadius: 24, padding: '18px 24px', fontFamily: BODY, fontWeight: 700, fontSize: 28, display: 'flex', alignItems: 'center', gap: 12, opacity: interpolate(f, [10, 18], [0, 1], clamp), transform: `scale(${tipP})` }}>
          {edited ? <><Check size={34} /> Guardado</> : 'Café con leche · $3.800'}
        </div>
      )}
      {f >= c && (
        <div style={{ position: 'absolute', left: 660, top: 1180, background: C.white, borderRadius: 30, padding: 22, boxShadow: '0 24px 50px rgba(20,17,43,0.3)', transform: `scale(${qrP}) rotate(5deg)`, textAlign: 'center' }}>
          <QR size={240} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 14, fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.navy }}><Check size={34} /> Mismo QR</div>
        </div>
      )}
    </SceneFade>
  );
};

// ---------- escena 7: cierre ----------
const S7 = ({ dur }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1.08, 1.0], { ...clamp, easing: ease });
  const pillAt = T4.imgs.cierre ? T4.s7logo + 6 : 70;
  const p = usePop(pillAt, 11);
  const badge = usePop(14, 12);
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, f - pillAt - 20) / 4);
  return (
    <SceneFade dur={dur} fadeOut={0} bg={C.cream}>
      <Img src={staticFile('5-cierre-logo-vertical.png')} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover', transform: `scale(${s})` }} />
      {T4.imgs.cierre && f < T4.s7logo + 10 && (
        <Img src={staticFile(T4.imgs.cierre)} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover', transform: `scale(${1 + f * 0.0008})`, opacity: interpolate(f, [T4.s7logo, T4.s7logo + 10], [1, 0], clamp) }} />
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

export const Reel4 = ({ audio }) => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['700 80px "Space Grotesk"', '400 30px "DM Sans"', '700 30px "DM Sans"'].map((x) => document.fonts.load(x)))
      .then(() => continueRender(handle));
  }, [handle]);
  const seq = [[T4.s1, S1], [T4.s2, S2], [T4.s3, S3], [T4.s4, S4], [T4.s5, S5], [T4.s6, S6], [T4.s7, S7]];
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      {seq.map(([[from, dur], S], i) => <Sequence key={i} from={from} durationInFrames={dur}><S dur={dur} /></Sequence>)}
      {audio && <Audio src={staticFile(audio)} />}
    </AbsoluteFill>
  );
};
