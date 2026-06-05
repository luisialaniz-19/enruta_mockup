const { useState, useMemo } = React;

/* ── Modal Wrapper ── */
function Modal({ title, onClose, wide, children }) {
  return (
    <div className="m-overlay" onClick={onClose}>
      <div className={'m-card' + (wide ? ' wide' : '')} onClick={e => e.stopPropagation()}>
        <div className="m-hdr">
          <h2>{title}</h2>
          <button className="m-close" onClick={onClose}>✕</button>
        </div>
        <div className="m-body">{children}</div>
      </div>
    </div>
  );
}

/* ══════════ 1. NUEVA RESERVA ══════════ */
function ModalNuevaReserva({ onClose, selDay, month, year }) {
  const [saved, setSaved] = useState(false);
  const dateStr = `${String(selDay).padStart(2,'0')}/${String(month+1).padStart(2,'0')}/${year}`;

  if (saved) return (
    <Modal title="Nueva Reserva" onClose={onClose}>
      <div style={{ textAlign:'center', padding:'40px 20px' }}>
        <div style={{ fontSize:48, marginBottom:12 }}>✓</div>
        <div style={{ fontSize:18, fontWeight:700, color:'var(--green-dark)', marginBottom:8 }}>Reserva Creada</div>
        <div style={{ fontSize:13, color:'var(--text2)', marginBottom:20 }}>La reserva fue registrada correctamente.</div>
        <button className="f-btn primary" onClick={onClose}>Volver al Calendario</button>
      </div>
    </Modal>
  );

  return (
    <Modal title="Nueva Reserva" onClose={onClose}>
      <div className="f-grid">
        <div className="f-group">
          <label className="f-label">Fecha</label>
          <input className="f-input" type="text" defaultValue={dateStr} />
        </div>
        <div className="f-group">
          <label className="f-label">Viaje</label>
          <select className="f-select">
            <option>IDA - 08:00 HS</option>
            <option>VUELTA - 17:00 HS</option>
          </select>
        </div>
        <div className="f-group full">
          <label className="f-label">Móvil</label>
          <select className="f-select">
            <option value="">— Seleccionar móvil —</option>
            {MOVILES_DATA.filter(m => m.estado === 'Activo').map((m, i) => (
              <option key={i} value={m.id}>{m.id} — {m.marca} {m.modelo} ({m.patente}) — {m.capacidad} asientos</option>
            ))}
          </select>
        </div>
        <div className="f-group">
          <label className="f-label">Nombre del Pasajero</label>
          <input className="f-input" type="text" placeholder="Nombre completo" />
        </div>
        <div className="f-group">
          <label className="f-label">Teléfono</label>
          <input className="f-input" type="tel" placeholder="Ej: 264 4XX-XXXX" />
        </div>
        <div className="f-group">
          <label className="f-label">DNI</label>
          <input className="f-input" type="text" placeholder="Ej: 30.XXX.XXX" />
        </div>
        <div className="f-group">
          <label className="f-label">Estado de Pago</label>
          <select className="f-select">
            <option>Pagado</option>
            <option>Seña</option>
            <option>Pendiente</option>
          </select>
        </div>
        <div className="f-group">
          <label className="f-label">Monto ($)</label>
          <input className="f-input" type="text" defaultValue="30.000" />
        </div>
        <div className="f-group">
          <label className="f-label">Medio de Pago</label>
          <select className="f-select">
            <option>Efectivo</option>
            <option>Transferencia</option>
            <option>MercadoPago</option>
          </select>
        </div>
        <div className="f-group full">
          <label className="f-label">Notas</label>
          <textarea className="f-textarea f-input" placeholder="Observaciones adicionales..."></textarea>
        </div>
      </div>
      <div className="f-actions">
        <button className="f-btn secondary" onClick={onClose}>Cancelar</button>
        <button className="f-btn success" onClick={() => setSaved(true)}>Confirmar Reserva</button>
      </div>
    </Modal>
  );
}

/* ══════════ 2. VER RESERVAS ══════════ */
const RESERVAS_DATA = [
  { fecha:'03/05', viaje:'IDA', pasajero:'Juan Pérez', asiento:1, pago:'Pagado' },
  { fecha:'03/05', viaje:'IDA', pasajero:'María Gómez', asiento:2, pago:'Pagado' },
  { fecha:'03/05', viaje:'IDA', pasajero:'Roberto Castro', asiento:3, pago:'Pendiente' },
  { fecha:'03/05', viaje:'VUELTA', pasajero:'Cecilia Ortiz', asiento:1, pago:'Pagado' },
  { fecha:'03/05', viaje:'VUELTA', pasajero:'Fernando Díaz', asiento:2, pago:'Pagado' },
  { fecha:'04/05', viaje:'IDA', pasajero:'Ana Torres', asiento:4, pago:'Pagado' },
  { fecha:'04/05', viaje:'IDA', pasajero:'Luis Malla', asiento:5, pago:'Pagado' },
  { fecha:'04/05', viaje:'VUELTA', pasajero:'Matías Vega', asiento:4, pago:'Seña' },
  { fecha:'05/05', viaje:'IDA', pasajero:'Carla Pérez', asiento:6, pago:'Pendiente' },
  { fecha:'05/05', viaje:'IDA', pasajero:'Diego Pelayes', asiento:7, pago:'Pagado' },
  { fecha:'05/05', viaje:'VUELTA', pasajero:'Susana Castro', asiento:5, pago:'Pagado' },
  { fecha:'06/05', viaje:'IDA', pasajero:'Ricardo Flores', asiento:1, pago:'Pagado' },
  { fecha:'06/05', viaje:'IDA', pasajero:'Valentina Ruiz', asiento:2, pago:'Seña' },
  { fecha:'06/05', viaje:'VUELTA', pasajero:'Pablo Sánchez', asiento:3, pago:'Pagado' },
];

function ModalVerReservas({ onClose }) {
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const filtered = RESERVAS_DATA.filter(r => {
    if (filter === 'ida' && r.viaje !== 'IDA') return false;
    if (filter === 'vuelta' && r.viaje !== 'VUELTA') return false;
    if (search && !r.pasajero.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  return (
    <Modal title="Ver Reservas" onClose={onClose} wide>
      <div className="search-bar">
        <input className="f-input" placeholder="Buscar pasajero..." value={search} onChange={e => setSearch(e.target.value)} />
        <button className="f-btn primary" style={{ padding:'8px 16px' }}>Buscar</button>
      </div>
      <div className="tabs-filter">
        {[['todos','Todos'],['ida','IDA'],['vuelta','VUELTA']].map(([k,l]) => (
          <button key={k} className={'tab-f' + (filter === k ? ' active' : '')} onClick={() => setFilter(k)}>{l}</button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:11, color:'var(--text2)', alignSelf:'center' }}>{filtered.length} reservas</span>
      </div>
      <table className="mt">
        <thead><tr><th>Fecha</th><th>Viaje</th><th>Pasajero</th><th>Asiento</th><th>Pago</th></tr></thead>
        <tbody>
          {filtered.map((r, i) => (
            <tr key={i}>
              <td>{r.fecha}</td>
              <td><span className={'mt-badge ' + (r.viaje === 'IDA' ? 'transit' : 'ok')}>{r.viaje}</span></td>
              <td style={{ fontWeight:600 }}>{r.pasajero}</td>
              <td>{r.asiento}</td>
              <td><span className={'mt-badge ' + (r.pago === 'Pagado' ? 'ok' : 'pend')}>{r.pago}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}

/* ══════════ 3. ENCOMIENDAS ══════════ */
const ENCOMIENDAS_DATA = [
  { id:'E-001', remitente:'Laura Mendoza', destinatario:'Federico Romero', desc:'Documentación', estado:'En tránsito', fecha:'03/05' },
  { id:'E-002', remitente:'Gabriela Torres', destinatario:'Nicolás Alvarez', desc:'Paquete pequeño', estado:'Entregado', fecha:'02/05' },
  { id:'E-003', remitente:'Sergio Navarro', destinatario:'Patricia Molina', desc:'Medicamentos', estado:'En tránsito', fecha:'03/05' },
  { id:'E-004', remitente:'Tomás Roldán', destinatario:'Andrea Gutiérrez', desc:'Repuestos', estado:'Pendiente retiro', fecha:'01/05' },
  { id:'E-005', remitente:'Carolina López', destinatario:'Mariana Bustos', desc:'Sobre cerrado', estado:'Entregado', fecha:'30/04' },
  { id:'E-006', remitente:'Alejandro García', destinatario:'Daniela Herrera', desc:'Caja frágil', estado:'En tránsito', fecha:'03/05' },
];

function ModalEncomiendas({ onClose }) {
  const [tab, setTab] = useState('todas');
  const filtered = ENCOMIENDAS_DATA.filter(e => {
    if (tab === 'transito') return e.estado === 'En tránsito';
    if (tab === 'entregadas') return e.estado === 'Entregado';
    if (tab === 'pendientes') return e.estado === 'Pendiente retiro';
    return true;
  });
  const getClass = (st) => st === 'Entregado' ? 'delivered' : st === 'En tránsito' ? 'transit' : 'pend';
  return (
    <Modal title="Encomiendas" onClose={onClose} wide>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div className="tabs-filter" style={{ margin:0 }}>
          {[['todas','Todas'],['transito','En tránsito'],['entregadas','Entregadas'],['pendientes','Pendientes']].map(([k,l]) => (
            <button key={k} className={'tab-f' + (tab === k ? ' active' : '')} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
        <button className="f-btn primary" style={{ padding:'7px 14px', fontSize:12 }}>+ Nueva</button>
      </div>
      <table className="mt">
        <thead><tr><th>Código</th><th>Remitente</th><th>Destinatario</th><th>Descripción</th><th>Fecha</th><th>Estado</th></tr></thead>
        <tbody>
          {filtered.map((e, i) => (
            <tr key={i}>
              <td style={{ fontWeight:700, color:'var(--purple-800)' }}>{e.id}</td>
              <td>{e.remitente}</td>
              <td>{e.destinatario}</td>
              <td>{e.desc}</td>
              <td>{e.fecha}</td>
              <td><span className={'mt-badge ' + getClass(e.estado)}>{e.estado}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}

/* ══════════ 4. CAJA DEL DÍA ══════════ */
function ModalCaja({ onClose, dayData, selDay, month, year }) {
  const totalPax = dayData.ida + dayData.vuelta;
  const ingresos = totalPax * 30000;
  const combustible = 45000;
  const peajes = 12000;
  const varios = 8500;
  const egresos = combustible + peajes + varios;
  const balance = ingresos - egresos;
  const dateStr = `${String(selDay).padStart(2,'0')}/${String(month+1).padStart(2,'0')}/${year}`;
  const fmt = (n) => '$' + n.toLocaleString('es-AR');

  const transacciones = [
    { desc:'Pasajes IDA ('+dayData.ida+')', tipo:'ingreso', monto:dayData.ida*30000 },
    { desc:'Pasajes VUELTA ('+dayData.vuelta+')', tipo:'ingreso', monto:dayData.vuelta*30000 },
    { desc:'Encomiendas (3)', tipo:'ingreso', monto:15000 },
    { desc:'Combustible', tipo:'egreso', monto:combustible },
    { desc:'Peajes', tipo:'egreso', monto:peajes },
    { desc:'Viáticos conductor', tipo:'egreso', monto:varios },
  ];

  return (
    <Modal title={'Caja del Día — ' + dateStr} onClose={onClose}>
      <div className="sum-cards">
        <div className="sum-c sum-green"><div className="sum-c-label">Ingresos</div><div className="sum-c-val">{fmt(ingresos + 15000)}</div></div>
        <div className="sum-c sum-red"><div className="sum-c-label">Egresos</div><div className="sum-c-val">{fmt(egresos)}</div></div>
        <div className="sum-c sum-blue"><div className="sum-c-label">Balance</div><div className="sum-c-val">{fmt(ingresos + 15000 - egresos)}</div></div>
      </div>
      <table className="mt">
        <thead><tr><th>Concepto</th><th>Tipo</th><th style={{ textAlign:'right' }}>Monto</th></tr></thead>
        <tbody>
          {transacciones.map((t, i) => (
            <tr key={i}>
              <td style={{ fontWeight:600 }}>{t.desc}</td>
              <td><span className={'mt-badge ' + (t.tipo === 'ingreso' ? 'ok' : 'pend')}>{t.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}</span></td>
              <td style={{ textAlign:'right', fontWeight:700, color: t.tipo === 'ingreso' ? 'var(--green-dark)' : 'var(--red)' }}>
                {t.tipo === 'ingreso' ? '+' : '−'}{fmt(t.monto)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="f-actions" style={{ marginTop:14 }}>
        <button className="f-btn secondary">Exportar</button>
        <button className="f-btn primary">Cerrar Caja</button>
      </div>
    </Modal>
  );
}

/* ══════════ 5. REPORTES ══════════ */
function ModalReportes({ onClose, year, month }) {
  const mName = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const monthlyOcc = [];
  for (let m = 0; m < 12; m++) {
    const dim = new Date(year, m + 1, 0).getDate();
    let total = 0;
    for (let d = 1; d <= dim; d++) {
      const dd = getDayData(year, m, d);
      total += (dd.ida + dd.vuelta);
    }
    monthlyOcc.push({ month: mName[m], pax: total, occ: Math.round(total / (dim * 15 * 2) * 100) });
  }
  const maxPax = Math.max(...monthlyOcc.map(m => m.pax));
  const totalAnual = monthlyOcc.reduce((s, m) => s + m.pax, 0);
  const avgOcc = Math.round(monthlyOcc.reduce((s, m) => s + m.occ, 0) / 12);

  return (
    <Modal title="Reportes" onClose={onClose} wide>
      <div className="sum-cards" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
        <div className="sum-c sum-purple"><div className="sum-c-label">Pasajeros Anual</div><div className="sum-c-val" style={{ fontSize:20 }}>{totalAnual.toLocaleString('es-AR')}</div></div>
        <div className="sum-c sum-green"><div className="sum-c-label">Ocupación Promedio</div><div className="sum-c-val">{avgOcc}%</div></div>
        <div className="sum-c sum-blue"><div className="sum-c-label">Ingresos Anual</div><div className="sum-c-val" style={{ fontSize:18 }}>${(totalAnual*30).toLocaleString('es-AR')}k</div></div>
        <div className="sum-c" style={{ background:'#FEF3C7', color:'#D97706' }}><div className="sum-c-label">Mes Actual</div><div className="sum-c-val" style={{ fontSize:16 }}>{mName[month]}</div></div>
      </div>
      <div style={{ fontSize:12, fontWeight:700, color:'var(--text2)', marginBottom:8, textTransform:'uppercase', letterSpacing:'.4px' }}>Pasajeros por Mes — {year}</div>
      <div className="bar-chart">
        {monthlyOcc.map((m, i) => (
          <div key={i} className="bar-col">
            <div style={{ fontSize:9, fontWeight:700, color: i === month ? 'var(--purple-800)' : 'var(--text2)' }}>{m.pax}</div>
            <div className="bar-fill" style={{ height: (m.pax / maxPax * 100) + '%', background: i === month ? 'var(--purple-600)' : 'var(--purple-200)' }}></div>
            <div className="bar-label" style={{ fontWeight: i === month ? 800 : 500, color: i === month ? 'var(--purple-800)' : undefined }}>{m.month}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:12, fontWeight:700, color:'var(--text2)', margin:'16px 0 8px', textTransform:'uppercase', letterSpacing:'.4px' }}>Ocupación por Mes (%)</div>
      <div className="bar-chart" style={{ height:80 }}>
        {monthlyOcc.map((m, i) => (
          <div key={i} className="bar-col">
            <div style={{ fontSize:9, fontWeight:700, color: getOccColor(m.occ) }}>{m.occ}%</div>
            <div className="bar-fill" style={{ height: Math.min(m.occ, 100) + '%', background: getOccColor(m.occ) }}></div>
            <div className="bar-label">{m.month}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

/* ══════════ 6. CONFIGURACIÓN ══════════ */
function ModalConfig({ onClose }) {
  const [saved, setSaved] = useState(false);
  return (
    <Modal title="Configuración" onClose={onClose}>
      <div className="set-section">
        <div className="set-title">Vehículo</div>
        <div className="f-grid">
          <div className="f-group">
            <label className="f-label">Capacidad por Viaje</label>
            <input className="f-input" type="number" defaultValue="15" />
          </div>
          <div className="f-group">
            <label className="f-label">Total Asientos Físicos</label>
            <input className="f-input" type="number" defaultValue="20" />
          </div>
          <div className="f-group">
            <label className="f-label">Patente</label>
            <input className="f-input" type="text" defaultValue="AC 123 BD" />
          </div>
          <div className="f-group">
            <label className="f-label">Conductor</label>
            <input className="f-input" type="text" defaultValue="Carlos Rodríguez" />
          </div>
        </div>
      </div>
      <div className="set-section">
        <div className="set-title">Horarios</div>
        <div className="f-grid">
          <div className="f-group">
            <label className="f-label">Horario IDA</label>
            <input className="f-input" type="time" defaultValue="08:00" />
          </div>
          <div className="f-group">
            <label className="f-label">Horario VUELTA</label>
            <input className="f-input" type="time" defaultValue="17:00" />
          </div>
        </div>
      </div>
      <div className="set-section">
        <div className="set-title">Tarifas</div>
        <div className="f-grid">
          <div className="f-group">
            <label className="f-label">Tarifa por Pasaje ($)</label>
            <input className="f-input" type="text" defaultValue="30.000" />
          </div>
          <div className="f-group">
            <label className="f-label">Tarifa Encomienda ($)</label>
            <input className="f-input" type="text" defaultValue="5.000" />
          </div>
        </div>
      </div>
      <div className="set-section">
        <div className="set-title">Sistema</div>
        <div className="f-grid">
          <div className="f-group full">
            <label className="f-label">Moneda</label>
            <select className="f-select"><option>ARS ($)</option><option>USD (US$)</option></select>
          </div>
        </div>
      </div>
      {saved && <div style={{ padding:'8px 14px', background:'#DCFCE7', borderRadius:8, color:'#16A34A', fontWeight:600, fontSize:13, marginBottom:10, textAlign:'center' }}>Configuración guardada correctamente</div>}
      <div className="f-actions">
        <button className="f-btn secondary" onClick={onClose}>Cancelar</button>
        <button className="f-btn success" onClick={() => setSaved(true)}>Guardar Cambios</button>
      </div>
    </Modal>
  );
}

/* ══════════ 7. MÓVILES / FLOTA ══════════ */
const MOVILES_DATA = [
  { id: 'M-001', patente: 'AC 123 BD', marca: 'Mercedes-Benz', modelo: 'Sprinter 515', capacidad: 15, conductor: 'Carlos Rodríguez', estado: 'Activo', km: '142.300' },
  { id: 'M-002', patente: 'AE 456 FG', marca: 'Iveco', modelo: 'Daily 50C', capacidad: 19, conductor: 'Martín Aguirre', estado: 'Activo', km: '98.750' },
  { id: 'M-003', patente: 'AB 789 HJ', marca: 'Mercedes-Benz', modelo: 'Sprinter 413', capacidad: 12, conductor: '—', estado: 'En taller', km: '201.400' },
];

function ModalMoviles({ onClose }) {
  const [view, setView] = useState('lista');
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(false);

  const getEstadoClass = (st) => st === 'Activo' ? 'ok' : st === 'En taller' ? 'pend' : 'transit';

  if (saved) return (
    <Modal title="Móviles / Flota" onClose={onClose} wide>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 8 }}>Móvil Registrado</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>El vehículo fue agregado correctamente a la flota.</div>
        <button className="f-btn primary" onClick={() => { setSaved(false); setAdding(false); }}>Volver a la Lista</button>
      </div>
    </Modal>
  );

  if (adding) return (
    <Modal title="Móviles / Flota — Nuevo Móvil" onClose={onClose} wide>
      <div className="f-grid">
        <div className="f-group">
          <label className="f-label">Patente</label>
          <input className="f-input" type="text" placeholder="Ej: AC 123 BD" />
        </div>
        <div className="f-group">
          <label className="f-label">Marca</label>
          <input className="f-input" type="text" placeholder="Ej: Mercedes-Benz" />
        </div>
        <div className="f-group">
          <label className="f-label">Modelo</label>
          <input className="f-input" type="text" placeholder="Ej: Sprinter 515" />
        </div>
        <div className="f-group">
          <label className="f-label">Año</label>
          <input className="f-input" type="number" placeholder="Ej: 2022" />
        </div>
        <div className="f-group">
          <label className="f-label">Capacidad (asientos)</label>
          <input className="f-input" type="number" placeholder="Ej: 15" />
        </div>
        <div className="f-group">
          <label className="f-label">Kilometraje</label>
          <input className="f-input" type="text" placeholder="Ej: 142.300" />
        </div>
        <div className="f-group">
          <label className="f-label">Conductor Asignado</label>
          <input className="f-input" type="text" placeholder="Nombre completo" />
        </div>
        <div className="f-group">
          <label className="f-label">Estado</label>
          <select className="f-select">
            <option>Activo</option>
            <option>En taller</option>
            <option>Inactivo</option>
          </select>
        </div>
        <div className="f-group full">
          <label className="f-label">Observaciones</label>
          <textarea className="f-textarea f-input" placeholder="VTV, seguro, notas..."></textarea>
        </div>
      </div>
      <div className="f-actions">
        <button className="f-btn secondary" onClick={() => setAdding(false)}>Cancelar</button>
        <button className="f-btn success" onClick={() => setSaved(true)}>Guardar Móvil</button>
      </div>
    </Modal>
  );

  return (
    <Modal title="Móviles / Flota" onClose={onClose} wide>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div className="sum-cards" style={{ gridTemplateColumns: 'repeat(3,1fr)', margin: 0, flex: 1, marginRight: 14 }}>
          <div className="sum-c sum-green"><div className="sum-c-label">Activos</div><div className="sum-c-val">{MOVILES_DATA.filter(m => m.estado === 'Activo').length}</div></div>
          <div className="sum-c" style={{ background: '#FEF3C7', color: '#D97706' }}><div className="sum-c-label">En Taller</div><div className="sum-c-val">{MOVILES_DATA.filter(m => m.estado === 'En taller').length}</div></div>
          <div className="sum-c sum-purple"><div className="sum-c-label">Total Flota</div><div className="sum-c-val">{MOVILES_DATA.length}</div></div>
        </div>
        <button className="f-btn primary" style={{ padding: '9px 16px', fontSize: 12, whiteSpace: 'nowrap' }} onClick={() => setAdding(true)}>+ Nuevo Móvil</button>
      </div>
      <table className="mt">
        <thead>
          <tr><th>Código</th><th>Patente</th><th>Vehículo</th><th>Capacidad</th><th>Conductor</th><th>KM</th><th>Estado</th></tr>
        </thead>
        <tbody>
          {MOVILES_DATA.map((m, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 700, color: 'var(--purple-800)' }}>{m.id}</td>
              <td style={{ fontWeight: 600 }}>{m.patente}</td>
              <td>{m.marca} {m.modelo}</td>
              <td style={{ textAlign: 'center' }}>{m.capacidad}</td>
              <td>{m.conductor}</td>
              <td>{m.km}</td>
              <td><span className={'mt-badge ' + getEstadoClass(m.estado)}>{m.estado}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}

/* ══════════ 8. RECORRIDOS / PARADAS ══════════ */
const PARADAS_IDA = [
  { orden: 1, nombre: 'Terminal San Juan', direccion: 'Av. Rawson y Estados Unidos', hora: '08:00', tipo: 'Origen' },
  { orden: 2, nombre: 'Parada Av. Libertador', direccion: 'Av. Libertador 1450', hora: '08:10', tipo: 'Parada' },
  { orden: 3, nombre: 'Rotonda Acceso Este', direccion: 'Ruta 40 y Acceso Este', hora: '08:20', tipo: 'Parada' },
  { orden: 4, nombre: 'Estación Desaguadero', direccion: 'Ruta 7 km 302', hora: '09:00', tipo: 'Parada' },
  { orden: 5, nombre: 'Terminal Mendoza', direccion: 'Av. Videla y Acceso Este', hora: '10:30', tipo: 'Destino' },
];

const PARADAS_VUELTA = [
  { orden: 1, nombre: 'Terminal Mendoza', direccion: 'Av. Videla y Acceso Este', hora: '17:00', tipo: 'Origen' },
  { orden: 2, nombre: 'Estación Desaguadero', direccion: 'Ruta 7 km 302', hora: '18:00', tipo: 'Parada' },
  { orden: 3, nombre: 'Rotonda Acceso Este', direccion: 'Ruta 40 y Acceso Este', hora: '18:40', tipo: 'Parada' },
  { orden: 4, nombre: 'Parada Av. Libertador', direccion: 'Av. Libertador 1450', hora: '19:20', tipo: 'Parada' },
  { orden: 5, nombre: 'Terminal San Juan', direccion: 'Av. Rawson y Estados Unidos', hora: '19:30', tipo: 'Destino' },
];

function ModalRecorridos({ onClose }) {
  const [viaje, setViaje] = useState('ida');
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(false);

  const paradas = viaje === 'ida' ? PARADAS_IDA : PARADAS_VUELTA;

  const getTipoClass = (t) => t === 'Origen' ? 'ok' : t === 'Destino' ? 'transit' : 'pend';

  if (saved) return (
    <Modal title="Recorridos / Paradas" onClose={onClose} wide>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 8 }}>Parada Registrada</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>La parada fue agregada al recorrido correctamente.</div>
        <button className="f-btn primary" onClick={() => { setSaved(false); setAdding(false); }}>Volver al Recorrido</button>
      </div>
    </Modal>
  );

  if (adding) return (
    <Modal title="Recorridos — Nueva Parada" onClose={onClose} wide>
      <div className="f-grid">
        <div className="f-group">
          <label className="f-label">Nombre de la Parada</label>
          <input className="f-input" type="text" placeholder="Ej: Plaza Central" />
        </div>
        <div className="f-group">
          <label className="f-label">Dirección</label>
          <input className="f-input" type="text" placeholder="Ej: Av. San Martín 500" />
        </div>
        <div className="f-group">
          <label className="f-label">Hora Estimada</label>
          <input className="f-input" type="time" placeholder="Ej: 08:15" />
        </div>
        <div className="f-group">
          <label className="f-label">Tipo</label>
          <select className="f-select">
            <option>Parada</option>
            <option>Origen</option>
            <option>Destino</option>
          </select>
        </div>
        <div className="f-group">
          <label className="f-label">Viaje</label>
          <select className="f-select" defaultValue={viaje}>
            <option value="ida">IDA</option>
            <option value="vuelta">VUELTA</option>
          </select>
        </div>
        <div className="f-group">
          <label className="f-label">Orden en el Recorrido</label>
          <input className="f-input" type="number" placeholder="Ej: 3" min="1" />
        </div>
        <div className="f-group full">
          <label className="f-label">Referencia / Notas</label>
          <textarea className="f-textarea f-input" placeholder="Punto de referencia, indicaciones..."></textarea>
        </div>
      </div>
      <div className="f-actions">
        <button className="f-btn secondary" onClick={() => setAdding(false)}>Cancelar</button>
        <button className="f-btn success" onClick={() => setSaved(true)}>Guardar Parada</button>
      </div>
    </Modal>
  );

  return (
    <Modal title="Recorridos / Paradas" onClose={onClose} wide>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div className="tabs-filter" style={{ margin: 0 }}>
          <button className={'tab-f' + (viaje === 'ida' ? ' active' : '')} onClick={() => setViaje('ida')}>IDA — 08:00 HS</button>
          <button className={'tab-f' + (viaje === 'vuelta' ? ' active' : '')} onClick={() => setViaje('vuelta')}>VUELTA — 17:00 HS</button>
        </div>
        <button className="f-btn primary" style={{ padding: '9px 16px', fontSize: 12, whiteSpace: 'nowrap' }} onClick={() => setAdding(true)}>+ Nueva Parada</button>
      </div>

      {/* Route timeline */}
      <div style={{ padding: '4px 0 12px' }}>
        {paradas.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
            {/* Timeline line + dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
              <div style={{
                width: p.tipo === 'Origen' || p.tipo === 'Destino' ? 14 : 10,
                height: p.tipo === 'Origen' || p.tipo === 'Destino' ? 14 : 10,
                borderRadius: '50%',
                background: p.tipo === 'Origen' ? 'var(--green)' : p.tipo === 'Destino' ? 'var(--purple-700)' : 'var(--purple-300)',
                border: '2px solid #fff',
                boxShadow: '0 0 0 2px ' + (p.tipo === 'Origen' ? 'var(--green)' : p.tipo === 'Destino' ? 'var(--purple-700)' : 'var(--purple-200)'),
                zIndex: 1,
                marginTop: 4
              }}></div>
              {i < paradas.length - 1 && (
                <div style={{ width: 2, flex: 1, minHeight: 32, background: 'var(--purple-200)' }}></div>
              )}
            </div>
            {/* Content */}
            <div style={{ flex: 1, paddingBottom: i < paradas.length - 1 ? 10 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{p.nombre}</span>
                <span className={'mt-badge ' + getTipoClass(p.tipo)} style={{ fontSize: 9 }}>{p.tipo}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 2 }}>{p.direccion}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--purple-700)' }}>{p.hora} hs</div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="sum-cards" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: 8 }}>
        <div className="sum-c sum-purple"><div className="sum-c-label">Total Paradas</div><div className="sum-c-val">{paradas.length}</div></div>
        <div className="sum-c sum-green"><div className="sum-c-label">Duración</div><div className="sum-c-val">2h 30m</div></div>
        <div className="sum-c sum-blue"><div className="sum-c-label">Distancia</div><div className="sum-c-val">170 km</div></div>
      </div>
    </Modal>
  );
}

/* ══════════ 9. TARIFAS ══════════ */
const TARIFAS_DATA = [
  { id: 'T-001', concepto: 'Pasaje Adulto', tramo: 'San Juan → Mendoza', viaje: 'IDA', precio: 30000, tipo: 'Pasaje', promo: null },
  { id: 'T-002', concepto: 'Pasaje Adulto', tramo: 'Mendoza → San Juan', viaje: 'VUELTA', precio: 30000, tipo: 'Pasaje', promo: null },
  { id: 'T-003', concepto: 'Pasaje Menor (4-12 años)', tramo: 'San Juan → Mendoza', viaje: 'IDA', precio: 15000, tipo: 'Pasaje', promo: null },
  { id: 'T-004', concepto: 'Pasaje Menor (4-12 años)', tramo: 'Mendoza → San Juan', viaje: 'VUELTA', precio: 15000, tipo: 'Pasaje', promo: null },
  { id: 'T-005', concepto: 'Pasaje Jubilado', tramo: 'San Juan → Mendoza', viaje: 'IDA', precio: 20000, tipo: 'Pasaje', promo: null },
  { id: 'T-006', concepto: 'Pasaje Jubilado', tramo: 'Mendoza → San Juan', viaje: 'VUELTA', precio: 20000, tipo: 'Pasaje', promo: null },
  { id: 'T-007', concepto: 'Tramo Corto', tramo: 'San Juan → Desaguadero', viaje: 'IDA', precio: 18000, tipo: 'Pasaje', promo: null },
  { id: 'T-008', concepto: 'Ida y Vuelta Adulto', tramo: 'San Juan ↔ Mendoza', viaje: 'IDA+VUELTA', precio: 50000, tipo: 'Pasaje', promo: { label: '2x1', desc: 'Descuento ida y vuelta', precioOriginal: 60000 } },
  { id: 'T-009', concepto: 'Promo Estudiante', tramo: 'San Juan → Mendoza', viaje: 'IDA', precio: 22000, tipo: 'Pasaje', promo: { label: '-27%', desc: 'Descuento estudiantes con libreta', precioOriginal: 30000 } },
  { id: 'T-010', concepto: 'Promo Grupo (5+)', tramo: 'San Juan ↔ Mendoza', viaje: 'IDA+VUELTA', precio: 25000, tipo: 'Pasaje', promo: { label: 'GRUPO', desc: 'Precio por persona, mínimo 5 pasajeros', precioOriginal: 30000 } },
  { id: 'T-011', concepto: 'Encomienda Sobre', tramo: 'San Juan → Mendoza', viaje: 'IDA', precio: 5000, tipo: 'Encomienda', promo: null },
  { id: 'T-012', concepto: 'Encomienda Paquete Chico', tramo: 'San Juan → Mendoza', viaje: 'IDA', precio: 8000, tipo: 'Encomienda', promo: null },
  { id: 'T-013', concepto: 'Encomienda Paquete Grande', tramo: 'San Juan → Mendoza', viaje: 'IDA', precio: 15000, tipo: 'Encomienda', promo: null },
];

function ModalTarifas({ onClose }) {
  const [tab, setTab] = useState('todos');
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(false);

  const filtered = TARIFAS_DATA.filter(t => {
    if (tab === 'pasajes') return t.tipo === 'Pasaje' && !t.promo;
    if (tab === 'encomiendas') return t.tipo === 'Encomienda';
    if (tab === 'promos') return t.promo !== null;
    if (tab === 'ida') return t.viaje === 'IDA';
    if (tab === 'vuelta') return t.viaje === 'VUELTA';
    return true;
  });

  const fmt = (n) => '$' + n.toLocaleString('es-AR');
  const getViajeClass = (v) => v === 'IDA' ? 'transit' : v === 'VUELTA' ? 'ok' : 'delivered';

  if (saved) return (
    <Modal title="Tarifas" onClose={onClose} wide>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 8 }}>Tarifa Registrada</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>La tarifa fue agregada correctamente.</div>
        <button className="f-btn primary" onClick={() => { setSaved(false); setAdding(false); }}>Volver a Tarifas</button>
      </div>
    </Modal>
  );

  if (adding) return (
    <Modal title="Tarifas — Nueva Tarifa" onClose={onClose} wide>
      <div className="f-grid">
        <div className="f-group">
          <label className="f-label">Concepto</label>
          <input className="f-input" type="text" placeholder="Ej: Pasaje Adulto" />
        </div>
        <div className="f-group">
          <label className="f-label">Tipo</label>
          <select className="f-select">
            <option>Pasaje</option>
            <option>Encomienda</option>
          </select>
        </div>
        <div className="f-group">
          <label className="f-label">Viaje</label>
          <select className="f-select">
            <option>IDA</option>
            <option>VUELTA</option>
            <option>IDA+VUELTA</option>
          </select>
        </div>
        <div className="f-group">
          <label className="f-label">Tramo</label>
          <input className="f-input" type="text" placeholder="Ej: San Juan → Mendoza" />
        </div>
        <div className="f-group">
          <label className="f-label">Precio ($)</label>
          <input className="f-input" type="number" placeholder="Ej: 30000" />
        </div>
        <div className="f-group">
          <label className="f-label">¿Es Promo?</label>
          <select className="f-select">
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </div>
        <div className="f-group">
          <label className="f-label">Precio Original (si es promo)</label>
          <input className="f-input" type="number" placeholder="Ej: 60000" />
        </div>
        <div className="f-group">
          <label className="f-label">Etiqueta Promo</label>
          <input className="f-input" type="text" placeholder="Ej: -20%, 2x1, GRUPO" />
        </div>
        <div className="f-group full">
          <label className="f-label">Descripción / Condiciones</label>
          <textarea className="f-textarea f-input" placeholder="Condiciones de la promo, vigencia..."></textarea>
        </div>
      </div>
      <div className="f-actions">
        <button className="f-btn secondary" onClick={() => setAdding(false)}>Cancelar</button>
        <button className="f-btn success" onClick={() => setSaved(true)}>Guardar Tarifa</button>
      </div>
    </Modal>
  );

  return (
    <Modal title="Tarifas" onClose={onClose} wide>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div className="tabs-filter" style={{ margin: 0, flexWrap: 'wrap' }}>
          <button className={'tab-f' + (tab === 'todos' ? ' active' : '')} onClick={() => setTab('todos')}>Todas</button>
          <button className={'tab-f' + (tab === 'ida' ? ' active' : '')} onClick={() => setTab('ida')}>IDA</button>
          <button className={'tab-f' + (tab === 'vuelta' ? ' active' : '')} onClick={() => setTab('vuelta')}>VUELTA</button>
          <button className={'tab-f' + (tab === 'pasajes' ? ' active' : '')} onClick={() => setTab('pasajes')}>Pasajes</button>
          <button className={'tab-f' + (tab === 'encomiendas' ? ' active' : '')} onClick={() => setTab('encomiendas')}>Encomiendas</button>
          <button className={'tab-f' + (tab === 'promos' ? ' active' : '')} onClick={() => setTab('promos')}>Promos</button>
        </div>
        <button className="f-btn primary" style={{ padding: '9px 16px', fontSize: 12, whiteSpace: 'nowrap' }} onClick={() => setAdding(true)}>+ Nueva Tarifa</button>
      </div>

      <table className="mt">
        <thead>
          <tr><th>Código</th><th>Concepto</th><th>Tramo</th><th>Viaje</th><th>Tipo</th><th style={{ textAlign: 'right' }}>Precio</th></tr>
        </thead>
        <tbody>
          {filtered.map((t, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 700, color: 'var(--purple-800)' }}>{t.id}</td>
              <td>
                <div style={{ fontWeight: 600 }}>{t.concepto}</div>
                {t.promo && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, background: '#FEF3C7', color: '#D97706', padding: '1px 6px', borderRadius: 4 }}>{t.promo.label}</span>
                    <span style={{ fontSize: 10, color: 'var(--text3)' }}>{t.promo.desc}</span>
                  </div>
                )}
              </td>
              <td>{t.tramo}</td>
              <td><span className={'mt-badge ' + getViajeClass(t.viaje)}>{t.viaje}</span></td>
              <td><span className={'mt-badge ' + (t.tipo === 'Pasaje' ? 'pend' : 'ok')} style={{ fontSize: 9 }}>{t.tipo}</span></td>
              <td style={{ textAlign: 'right' }}>
                {t.promo && <div style={{ fontSize: 10, color: 'var(--text3)', textDecoration: 'line-through' }}>{fmt(t.promo.precioOriginal)}</div>}
                <div style={{ fontWeight: 800, fontSize: 14, color: t.promo ? '#D97706' : 'var(--green-dark)' }}>{fmt(t.precio)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="sum-cards" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginTop: 14 }}>
        <div className="sum-c sum-purple"><div className="sum-c-label">Total Tarifas</div><div className="sum-c-val">{TARIFAS_DATA.length}</div></div>
        <div className="sum-c sum-green"><div className="sum-c-label">Pasajes</div><div className="sum-c-val">{TARIFAS_DATA.filter(t => t.tipo === 'Pasaje').length}</div></div>
        <div className="sum-c sum-blue"><div className="sum-c-label">Encomiendas</div><div className="sum-c-val">{TARIFAS_DATA.filter(t => t.tipo === 'Encomienda').length}</div></div>
        <div className="sum-c" style={{ background: '#FEF3C7', color: '#D97706' }}><div className="sum-c-label">Promos Activas</div><div className="sum-c-val">{TARIFAS_DATA.filter(t => t.promo).length}</div></div>
      </div>
    </Modal>
  );
}

Object.assign(window, {
  Modal, ModalNuevaReserva, ModalVerReservas, ModalEncomiendas,
  ModalCaja, ModalReportes, ModalConfig, ModalMoviles, ModalRecorridos, ModalTarifas
});
