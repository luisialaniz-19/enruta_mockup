const { useState, useMemo, useCallback } = React;

/* ══════════════ DATA & HELPERS ══════════════ */
const CAPACITY = 15;
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAY_NAMES = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
const DAY_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const NAMES = [
'Juan Pérez', 'María Gómez', 'Roberto Castro', 'Ana Torres', 'Luis Malla', 'Carla Pérez',
'Diego Pelayes', 'Cecilia Ortiz', 'Fernando Díaz', 'Noelia Aballay', 'Matías Vega',
'Susana Castro', 'Ricardo Flores', 'Valentina Ruiz', 'Martín Aguirre', 'Laura Mendoza',
'Pablo Sánchez', 'Carolina López', 'Alejandro García', 'Lucía Morales', 'Federico Romero',
'Gabriela Torres', 'Ignacio Fernández', 'Daniela Herrera', 'Nicolás Alvarez', 'Mariana Bustos',
'Tomás Roldán', 'Andrea Gutiérrez', 'Sergio Navarro', 'Patricia Molina'];


function seeded(s) {const x = Math.sin(s * 127.1 + 311.7) * 43758.5453;return x - Math.floor(x);}

/* Hardcoded May 2026 data to match reference */
const MAY26 = {
  1: { i: 6, v: 4 }, 2: { i: 8, v: 6 }, 3: { i: 11, v: 7 }, 4: { i: 7, v: 5 }, 5: { i: 9, v: 6 },
  6: { i: 12, v: 8 }, 7: { i: 5, v: 3 }, 8: { i: 6, v: 4 }, 9: { i: 10, v: 7 }, 10: { i: 8, v: 5 },
  11: { i: 4, v: 3 }, 12: { i: 7, v: 4 }, 13: { i: 6, v: 4 }, 14: { i: 9, v: 6 }, 15: { i: 11, v: 8 },
  16: { i: 12, v: 9 }, 17: { i: 5, v: 3 }, 18: { i: 6, v: 4 }, 19: { i: 7, v: 5 }, 20: { i: 4, v: 2 },
  21: { i: 8, v: 6 }, 22: { i: 10, v: 7 }, 23: { i: 11, v: 8 }, 24: { i: 6, v: 4 }, 25: { i: 5, v: 3 },
  26: { i: 6, v: 4 }, 27: { i: 7, v: 5 }, 28: { i: 8, v: 6 }, 29: { i: 9, v: 6 }, 30: { i: 10, v: 7 }, 31: { i: 4, v: 2 }
};

function getDayData(y, m, d) {
  if (y === 2026 && m === 4 && MAY26[d]) {
    return { ida: MAY26[d].i, vuelta: MAY26[d].v, capacity: CAPACITY };
  }
  const s = y * 10000 + m * 100 + d;
  const dow = new Date(y, m, d).getDay();
  const busy = dow !== 0 && dow !== 6;
  const bI = busy ? 9 : 7,bV = busy ? 7 : 5;
  const ida = Math.max(3, Math.min(14, Math.round(bI + (seeded(s) - 0.5) * 8)));
  const vuelta = Math.max(2, Math.min(12, Math.round(bV + (seeded(s + 1) - 0.5) * 6)));
  return { ida, vuelta, capacity: CAPACITY };
}

function getPassengers(y, m, d, trip, count) {
  const base = y * 1e6 + m * 1e4 + d * 100 + (trip === 'ida' ? 0 : 50);
  const pax = [];
  for (let i = 0; i < count && i < 20; i++) {
    const ni = Math.floor(seeded(base + i) * NAMES.length);
    const paid = seeded(base + i + 100) > 0.22 ? 'Pagado' : 'Pendiente';
    pax.push({ seat: i + 1, name: NAMES[ni], paid });
  }
  return pax;
}

function getSeatStates(y, m, d, trip, count) {
  const base = y * 1e6 + m * 1e4 + d * 100 + (trip === 'ida' ? 0 : 50);
  const seats = Array.from({ length: 20 }, (_, i) => i + 1);
  for (let i = 19; i > 0; i--) {
    const j = Math.floor(seeded(base + i + 200) * (i + 1));
    [seats[i], seats[j]] = [seats[j], seats[i]];
  }
  const res = Math.min(3, Math.floor(seeded(base + 300) * 4));
  const states = {};
  seats.forEach((sn, i) => {
    if (i < count) states[sn] = 'occ';else
    if (i < count + res) states[sn] = 'res';else
    states[sn] = 'free';
  });
  return states;
}

function getCalendarGrid(y, m) {
  const firstDay = new Date(y, m, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const daysInPrev = new Date(y, m, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: daysInPrev - startOffset + 1 + i, outside: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, outside: false, data: getDayData(y, m, d) });
  }
  const remaining = 7 - cells.length % 7;
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) cells.push({ day: i, outside: true });
  }
  return cells;
}

function formatMoney(n) {
  return '$' + n.toLocaleString('es-AR');
}

/* ══════════════ APP ══════════════ */
function App() {
  const today = new Date(2026, 4, 3); // May 3, 2026
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(4); // 0-indexed, 4 = May
  const [selDay, setSelDay] = useState(3);
  const [tab, setTab] = useState('ida');
  const [activeModal, setActiveModal] = useState(null);

  const grid = useMemo(() => getCalendarGrid(year, month), [year, month]);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayData = useMemo(() => getDayData(year, month, selDay), [year, month, selDay]);
  const occ = Math.round((dayData.ida + dayData.vuelta) / (CAPACITY * 2) * 100);
  const totalPax = dayData.ida + dayData.vuelta;
  const available = CAPACITY * 2 - totalPax;

  const idaPax = useMemo(() => getPassengers(year, month, selDay, 'ida', dayData.ida), [year, month, selDay, dayData.ida]);
  const vueltaPax = useMemo(() => getPassengers(year, month, selDay, 'vuelta', dayData.vuelta), [year, month, selDay, dayData.vuelta]);

  // Monthly stats
  const monthStats = useMemo(() => {
    let tPax = 0,tOcc = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dd = getDayData(year, month, d);
      tPax += dd.ida + dd.vuelta;
      tOcc += (dd.ida + dd.vuelta) / (CAPACITY * 2) * 100;
    }
    return {
      avgPax: Math.round(tPax / daysInMonth),
      totalPax: tPax,
      avgAvail: Math.round(CAPACITY * 2 - tPax / daysInMonth),
      avgOcc: Math.round(tOcc / daysInMonth)
    };
  }, [year, month, daysInMonth]);

  // Upcoming transfers (next 5 days after selected)
  const upcoming = useMemo(() => {
    const items = [];
    for (let i = 1; i <= 5; i++) {
      const nd = new Date(year, month, selDay + i);
      const dd = getDayData(nd.getFullYear(), nd.getMonth(), nd.getDate());
      const pct = Math.round((dd.ida + dd.vuelta) / (CAPACITY * 2) * 100);
      items.push({
        date: `${String(nd.getDate()).padStart(2, '0')}/${String(nd.getMonth() + 1).padStart(2, '0')}`,
        dayName: DAY_FULL[nd.getDay()],
        ida: dd.ida, vuelta: dd.vuelta, capacity: CAPACITY, pct
      });
    }
    return items;
  }, [year, month, selDay]);

  const isToday = (d) => year === 2026 && month === 4 && d === 3;

  const navMonth = (dir) => {
    let nm = month + dir,ny = year;
    if (nm < 0) {nm = 11;ny--;} else if (nm > 11) {nm = 0;ny++;}
    setYear(ny);setMonth(nm);
    setSelDay(1);setTab('ida');
  };

  const goToday = () => {setYear(2026);setMonth(4);setSelDay(3);};

  const navDay = (dir) => {
    let nd = selDay + dir;
    if (nd < 1) {
      const pm = month === 0 ? 11 : month - 1;
      const py = month === 0 ? year - 1 : year;
      const dim = new Date(py, pm + 1, 0).getDate();
      setYear(py);setMonth(pm);setSelDay(dim);
    } else if (nd > daysInMonth) {
      const nm = month === 11 ? 0 : month + 1;
      const ny = month === 11 ? year + 1 : year;
      setYear(ny);setMonth(nm);setSelDay(1);
    } else {
      setSelDay(nd);
    }
    setTab('ida');
  };

  const selDate = new Date(year, month, selDay);
  const dateStr = `${DAY_FULL[selDate.getDay()]} ${String(selDay).padStart(2, '0')} de ${MONTH_NAMES[month]} ${year}`;

  return (
    <div className="dash">
      {/* ── HEADER ── */}
      <div className="hdr">
        <div>
          <img src="logo-enruta.png" alt="EN RUTA" style={{ objectFit: "cover", width: "200px", height: "76px" }} />
        </div>
        <div className="hdr-div"></div>
        <div className="hdr-title">CALENDARIO DE TRASLADOS</div>
        <div className="hdr-stats">
          <StatCard icon={<IconSeat />} label="ASIENTOS<br/>DISPONIBLES" value={monthStats.avgAvail} sub={'de ' + CAPACITY * 2} />
          <StatCard icon={<IconPeople />} label="PASAJEROS<br/>CONFIRMADOS" value={monthStats.avgPax} sub={'de ' + CAPACITY * 2} />
          <StatCard icon={<IconGauge />} label="OCUPACIÓN<br/>PROMEDIO" value={monthStats.avgOcc + '%'} />
        </div>
      </div>

      {/* ── CALENDAR SECTION ── */}
      <div className="cal-sec">
        <div className="cal-ctrl">
          <label>Mes:</label>
          <select value={String(month)} onChange={(e) => {setMonth(parseInt(e.target.value, 10));setSelDay(1);}}>
            {MONTH_NAMES.map((n, i) => <option key={i} value={String(i)}>{n} {year}</option>)}
          </select>
          <button className="nbtn" onClick={() => navMonth(-1)}>‹</button>
          <button className="nbtn" onClick={() => navMonth(1)}>›</button>
          <button className="tbtn" onClick={goToday}>HOY</button>
        </div>
        <div className="cal-wrap">
          <div className="cal-hdr">
            {DAY_NAMES.map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="cal-body">
            {grid.map((c, i) =>
            <CalendarCell
              key={i} day={c.day} data={c.data}
              isToday={!c.outside && isToday(c.day)}
              isSelected={!c.outside && c.day === selDay}
              isOutside={c.outside}
              onClick={() => {setSelDay(c.day);setTab('ida');}} />

            )}
          </div>
          <div className="cal-legend">
            <div className="cl-item"><div className="cl-dot" style={{ background: 'var(--green)' }}></div>0% - 59% Baja ocupación</div>
            <div className="cl-item"><div className="cl-dot" style={{ background: 'var(--yellow)' }}></div>60% - 100% Ocupación normal</div>

            <div className="cl-note">* Capacidad por viaje: {CAPACITY} pasajeros</div>
          </div>
        </div>
      </div>

      {/* ── DAY DETAIL SIDEBAR ── */}
      <div className="dd">
        <div className="dd-hdr">Detalle del Día</div>
        <div className="dd-nav">
          <button onClick={() => navDay(-1)}>‹</button>
          <span className="dd-date">{dateStr}</span>
          <button onClick={() => navDay(1)}>›</button>
        </div>
        <div className="tt">
          <button className={'tt-btn' + (tab === 'ida' ? ' act' : '')} onClick={() => setTab('ida')}>
            IDA - 08:00 HS <span className="tt-cnt">{dayData.ida}/{CAPACITY}</span>
          </button>
          <button className={'tt-btn' + (tab === 'vuelta' ? ' act' : '')} onClick={() => setTab('vuelta')}>
            VUELTA - 17:00 HS <span className="tt-cnt">{dayData.vuelta}/{CAPACITY}</span>
          </button>
        </div>
        <div className="dd-scroll">
          <TripInfo tab={tab} dayData={dayData} />
          <div className="pax-sec">
            <div className="pax-grid">
              <PassengerTable title="IDA - 08:00 HS" passengers={idaPax} />
              <PassengerTable title="VUELTA - 17:00 HS" passengers={vueltaPax} />
            </div>
          </div>
          {/* Próximos Traslados */}
          <div style={{ borderTop: '1px solid var(--border)' }}>
            <div className="pan-hdr ph3">Próximos Traslados</div>
            <div style={{ padding: '10px 14px' }}>
              {upcoming.map((u, i) =>
              <div key={i} className="up-item">
                  <div>
                    <div className="up-date">{u.dayName} {u.date}</div>
                  </div>
                  <div className="up-trips">
                    <span>IDA <b>{u.ida}/{u.capacity}</b></span>
                    <span>VUELTA <b>{u.vuelta}/{u.capacity}</b></span>
                  </div>
                  <div className="up-occ">
                    <div className="up-bar"><div className="up-fill" style={{ width: Math.min(u.pct, 100) + '%', background: getOccColor(u.pct) }}></div></div>
                    <span className="up-pct" style={{ color: getOccColor(u.pct) }}>{u.pct}%</span>
                  </div>
                  <span className="up-arrow">›</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM PANELS ── */}
      <div className="bpanels">
        {/* Resumen del Día */}
        <div className="pan">
          <div className="pan-hdr ph1">Resumen del Día</div>
          <div className="pan-body">
            <div className="sr">
              <div className="sr-icon"><IconBus /></div>
              <div className="sr-label">PASAJEROS CONFIRMADOS</div>
              <div className="sr-val vg">{totalPax}</div>
            </div>
            <div className="sr">
              <div className="sr-icon"><IconSeat /></div>
              <div className="sr-label">ASIENTOS DISPONIBLES</div>
              <div className="sr-val">{Math.max(0, available)}</div>
            </div>
            <div className="sr">
              <div className="sr-icon"><IconGauge /></div>
              <div className="sr-label">OCUPACIÓN TOTAL</div>
              <div className="sr-val" style={{ color: getOccColor(occ) }}>{occ}%</div>
            </div>
            <div className="sr">
              <div className="sr-icon"><IconMoney /></div>
              <div className="sr-label">RECAUDACIÓN ESTIMADA</div>
              <div className="sr-val" style={{ fontSize: 18, fontWeight: 800 }}>{formatMoney(totalPax * 30000)}</div>
            </div>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="pan">
          <div className="pan-hdr ph2">Accesos Rápidos</div>
          <div className="pan-body">
            <div className="qa-grid">
              <QuickAccessBtn icon={<IconPlus />} label="Nueva Reserva" colorClass="qi1" onClick={() => setActiveModal('reserva')} />
              <QuickAccessBtn icon={<IconList />} label="Ver Reservas" colorClass="qi2" onClick={() => setActiveModal('reservas')} />
              <QuickAccessBtn icon={<IconBox />} label="Encomiendas" colorClass="qi3" onClick={() => setActiveModal('encomiendas')} />
              <QuickAccessBtn icon={<IconDollar />} label="Caja del Día" colorClass="qi4" onClick={() => setActiveModal('caja')} />
              <QuickAccessBtn icon={<IconChart />} label="Reportes" colorClass="qi5" onClick={() => setActiveModal('reportes')} />
              <QuickAccessBtn icon={<IconDollar />} label="Tarifas" colorClass="qi8" onClick={() => setActiveModal('tarifas')} />
              <QuickAccessBtn icon={<IconTruck />} label="Móviles" colorClass="qi6" onClick={() => setActiveModal('moviles')} />
              <QuickAccessBtn icon={<IconMapPin2 />} label="Recorridos" colorClass="qi7" onClick={() => setActiveModal('recorridos')} />
            </div>
          </div>
        </div>

      </div>
      {activeModal === 'reserva' && <ModalNuevaReserva onClose={() => setActiveModal(null)} selDay={selDay} month={month} year={year} />}
      {activeModal === 'reservas' && <ModalVerReservas onClose={() => setActiveModal(null)} />}
      {activeModal === 'encomiendas' && <ModalEncomiendas onClose={() => setActiveModal(null)} />}
      {activeModal === 'caja' && <ModalCaja onClose={() => setActiveModal(null)} dayData={dayData} selDay={selDay} month={month} year={year} />}
      {activeModal === 'reportes' && <ModalReportes onClose={() => setActiveModal(null)} year={year} month={month} />}
      {activeModal === 'config' && <ModalConfig onClose={() => setActiveModal(null)} />}
      {activeModal === 'moviles' && <ModalMoviles onClose={() => setActiveModal(null)} />}
      {activeModal === 'recorridos' && <ModalRecorridos onClose={() => setActiveModal(null)} />}
      {activeModal === 'tarifas' && <ModalTarifas onClose={() => setActiveModal(null)} />}
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);