const { useState, useMemo, useCallback } = React;

/* ── SVG Icons ── */
function IconSeat() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11V7a5 5 0 0110 0v4"/><rect x="4" y="11" width="16" height="6" rx="2"/><path d="M6 17v2"/><path d="M18 17v2"/></svg>;
}
function IconPeople() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><circle cx="17" cy="9" r="2.5"/><path d="M21 21v-1.5a3 3 0 00-3-3h-.5"/></svg>;
}
function IconGauge() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12"/><path d="M12 6v6l4 2"/></svg>;
}
function IconWheel() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="2" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="22" y2="12"/></svg>;
}
function IconPlus() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
function IconList() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="8" y1="8" x2="17" y2="8"/><line x1="8" y1="12" x2="17" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>; }
function IconBox() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5"/><path d="M21 8l-9 5"/><path d="M12 13v8"/></svg>; }
function IconDollar() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.5-1.5-3-1.5-2 0-3 1-3 2s1 2 3 2 3 1 3 2-1 2-3 2c-1.5 0-2.5-.5-3-1.5"/><line x1="12" y1="6" x2="12" y2="18"/></svg>; }
function IconChart() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="12" width="4" height="8" rx="1"/><rect x="10" y="6" width="4" height="14" rx="1"/><rect x="17" y="9" width="4" height="11" rx="1"/></svg>; }
function IconGear() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>; }
function IconBus() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="3" width="16" height="16" rx="3"/><path d="M4 11h16"/><circle cx="8" cy="22" r="1"/><circle cx="16" cy="22" r="1"/><path d="M7 19h10"/></svg>; }
function IconMoney() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>; }

/* ── Helpers ── */
function getOccColor(pct) {
  if (pct >= 60) return 'var(--yellow)';
  return 'var(--green)';
}

/* ── OccupationBar ── */
function OccupationBar({ pct, compact }) {
  const c = getOccColor(pct);
  const w = Math.min(pct, 100);
  return (
    <div className="ob" style={compact ? { gap: '3px' } : undefined}>
      <div className="ob-track"><div className="ob-fill" style={{ width: w + '%', background: c }}></div></div>
      <span className="ob-pct" style={{ color: c }}>{Math.round(pct)}%</span>
    </div>
  );
}

/* ── StatCard ── */
function StatCard({ icon, label, value, sub }) {
  return (
    <div className="sc">
      <div className="sc-icon">{icon}</div>
      <div>
        <div className="sc-label" dangerouslySetInnerHTML={{ __html: label }}></div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span className="sc-val">{value}</span>
          {sub && <span className="sc-sub">{sub}</span>}
        </div>
      </div>
    </div>
  );
}

/* ── CalendarCell ── */
function CalendarCell({ day, data, isToday, isSelected, isOutside, onClick }) {
  const cls = ['cc'];
  if (isOutside) cls.push('out');
  if (isToday && !isOutside) cls.push('today');
  if (isSelected && !isOutside) cls.push('sel');
  return (
    <div className={cls.join(' ')} onClick={isOutside ? undefined : onClick}>
      <div className="cc-day">{day}</div>
      {data && !isOutside && (
        <>
          <div className="cc-trip">
            <span className="cc-trip-l">IDA</span>
            <span className="cc-trip-c">{data.ida}/{data.capacity}</span>
          </div>
          <div className="cc-trip">
            <span className="cc-trip-l v">VUELTA</span>
            <span className="cc-trip-c">{data.vuelta}/{data.capacity}</span>
          </div>
          <OccupationBar pct={Math.round((data.ida + data.vuelta) / (data.capacity * 2) * 100)} />
        </>
      )}
    </div>
  );
}

/* ── SeatMap ── */
const BUS_ROWS = [
  { left: [1, 2], right: [3, 4, 5] },
  { left: [6, 7], right: [8, 9, 10] },
  { left: [11, 12], right: [13, 14, 15] },
  { left: [16, 17, 18], right: [19, 20] },
];

function SeatMap({ seatData }) {
  return (
    <div className="bus-wrap">
      <div className="bus">
        <div className="bus-drv"><IconWheel /></div>
        {BUS_ROWS.map((row, i) => (
          <div key={i} className="bus-row">
            {row.left.map(n => (
              <div key={n} className={'seat ' + (seatData[n] || 'free')}>{n}</div>
            ))}
            <div className="bus-aisle"></div>
            {row.right.map(n => (
              <div key={n} className={'seat ' + (seatData[n] || 'free')}>{n}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PassengerTable ── */
function PassengerTable({ title, passengers, maxShow = 7 }) {
  const shown = passengers.slice(0, maxShow);
  const remaining = passengers.length - maxShow;
  return (
    <div>
      <div className="pt-title">{title}</div>
      <table className="pt">
        <thead><tr><th>Asiento</th><th>Pasajero</th><th>Pago</th></tr></thead>
        <tbody>
          {shown.map((p, i) => (
            <tr key={i}>
              <td>{p.seat}</td>
              <td>{p.name || '—'}</td>
              <td>{p.paid ? <span className={'badge ' + (p.paid === 'Pagado' ? 'badge-ok' : 'badge-pend')}>{p.paid}</span> : '—'}</td>
            </tr>
          ))}
          {shown.length < 8 && Array.from({ length: 8 - shown.length }).map((_, i) => (
            <tr key={'e' + i}><td>{shown.length + i + 1}</td><td>—</td><td>—</td></tr>
          ))}
        </tbody>
      </table>
      {remaining > 0 && <div className="pt-more">Y {remaining} asientos más ocupados…</div>}
    </div>
  );
}

/* ── QuickAccessBtn ── */
function QuickAccessBtn({ icon, label, colorClass, onClick }) {
  return (
    <button className="qa-btn" onClick={onClick}>
      <div className={'qa-icon ' + colorClass}>{icon}</div>
      <div className="qa-label">{label}</div>
    </button>
  );
}

/* ── TripInfo ── */
function IconClock() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>; }
function IconMapPin() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function IconUser() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>; }
function IconRoute() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M12 19h4.5a3.5 3.5 0 000-7h-8a3.5 3.5 0 010-7H12"/></svg>; }

function TripInfo({ tab, dayData }) {
  const isIda = tab === 'ida';
  const count = isIda ? dayData.ida : dayData.vuelta;
  const cap = dayData.capacity;
  const pct = Math.round(count / cap * 100);
  const occColor = getOccColor(pct);

  const origin = isIda ? 'San Juan' : 'Mendoza';
  const destination = isIda ? 'Mendoza' : 'San Juan';
  const departure = isIda ? '08:00' : '17:00';
  const arrival = isIda ? '10:30' : '19:30';

  return (
    <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Route visual */}
      <div style={{ background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)', borderRadius: 10, padding: '12px 14px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--purple-600)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 2 }}>Origen</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--purple-900)' }}>{origin}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)' }}>{departure} hs</div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text3)', marginBottom: 4 }}>2h 30min</div>
            <div style={{ width: '100%', position: 'relative', height: 3 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--purple-200)', borderRadius: 2 }}></div>
              <div style={{ position: 'absolute', top: -3, left: 0, width: 9, height: 9, borderRadius: '50%', background: 'var(--purple-700)' }}></div>
              <div style={{ position: 'absolute', top: -3, right: 0, width: 9, height: 9, borderRadius: '50%', background: 'var(--purple-700)' }}></div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--purple-600)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 2 }}>Destino</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--purple-900)' }}>{destination}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)' }}>{arrival} hs</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', background: 'rgba(255,255,255,.6)', borderRadius: 6, padding: '5px 10px' }}>
          <IconRoute />
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text2)' }}>Ruta Nacional 7 — 170 km</span>
        </div>
      </div>

      {/* Occupation card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ background: '#F8F7FA', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 4 }}>Pasajeros</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>{count}<span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)' }}>/{cap}</span></div>
        </div>
        <div style={{ background: '#F8F7FA', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 4 }}>Ocupación</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: occColor }}>{pct}%</div>
        </div>
      </div>

      {/* Info rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {[
          { icon: <IconUser />, label: 'Conductor', value: 'Carlos Rodríguez' },
          { icon: <IconBus />, label: 'Vehículo', value: 'Mercedes-Benz Sprinter' },
          { icon: <IconMoney />, label: 'Recaudación', value: '$' + (count * 30000).toLocaleString('es-AR') },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 4px', borderBottom: i < 2 ? '1px solid #F0EDF5' : 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--purple-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple-700)', flexShrink: 0 }}>{row.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px' }}>{row.label}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{row.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconTruck() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>; }
function IconMapPin2() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>; }

/* ── Export ── */
Object.assign(window, {
  IconSeat, IconPeople, IconGauge, IconWheel, IconPlus, IconList, IconBox,
  IconDollar, IconChart, IconGear, IconBus, IconMoney, IconTruck, IconMapPin2,
  getOccColor, OccupationBar, StatCard, CalendarCell, SeatMap,
  PassengerTable, QuickAccessBtn, BUS_ROWS, TripInfo
});
