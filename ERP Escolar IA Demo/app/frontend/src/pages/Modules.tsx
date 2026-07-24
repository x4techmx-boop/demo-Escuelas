import { useState, useEffect } from 'react';
import {
  Calendar, ChevronLeft, ChevronRight, Megaphone, BarChart3,
  Zap, UserCircle, Settings, DollarSign, TrendingUp, Users,
  ArrowRight, Download, Filter, Bot, Send, AlertCircle, Check,
  Clock, FileText, CreditCard, PieChart, Target, Globe
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { getProspectos, getAlumnos, getMensualidades, getEventos, getConfig, setConfig, getDashboardStats, type Evento } from '@/lib/store';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

// ===================== AGENDA =====================
export function AgendaPage() {
  const [eventos, setLocalEventos] = useState<Evento[]>(getEventos());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'mes' | 'semana'>('mes');

  useEffect(() => {
    const handler = () => setLocalEventos(getEventos());
    window.addEventListener('store-update', handler);
    return () => window.removeEventListener('store-update', handler);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return eventos.filter(e => e.fecha === dateStr);
  };

  const tipoColor = (tipo: string) => {
    switch (tipo) {
      case 'recorrido': return 'bg-blue-500';
      case 'entrevista': return 'bg-violet-500';
      case 'llamada': return 'bg-emerald-500';
      case 'recordatorio': return 'bg-amber-500';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agenda</h1>
          <p className="text-muted-foreground text-sm">{eventos.length} eventos programados</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button onClick={() => setView('mes')} className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${view === 'mes' ? 'bg-card shadow-sm' : ''}`}>Mes</button>
            <button onClick={() => setView('semana')} className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${view === 'semana' ? 'bg-card shadow-sm' : ''}`}>Semana</button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-2 hover:bg-muted rounded-lg cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
          <h3 className="font-semibold">{monthNames[month]} {year}</h3>
          <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-2 hover:bg-muted rounded-lg cursor-pointer"><ChevronRight className="w-5 h-5" /></button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
            <div key={d} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground border-b border-border">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-border/50" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
            return (
              <div key={day} className={`min-h-[80px] p-1 border-b border-r border-border/50 ${isToday ? 'bg-primary/5' : ''}`}>
                <span className={`text-xs font-medium inline-flex w-6 h-6 items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground' : ''}`}>{day}</span>
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 2).map(ev => (
                    <div key={ev.id} className={`text-[9px] px-1 py-0.5 rounded text-white truncate ${tipoColor(ev.tipo)}`}>
                      {ev.titulo.substring(0, 15)}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <span className="text-[9px] text-muted-foreground">+{dayEvents.length - 2} más</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-3">Próximos Eventos</h3>
        <div className="space-y-2">
          {eventos.filter(e => !e.completado).slice(0, 5).map(ev => (
            <div key={ev.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
              <div className={`w-2 h-2 rounded-full ${tipoColor(ev.tipo)}`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{ev.titulo}</p>
                <p className="text-xs text-muted-foreground">{ev.fecha} • {ev.hora}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-muted rounded-md capitalize">{ev.tipo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== MARKETING =====================
export function MarketingPage() {
  const prospectos = getProspectos();
  const fuentes = ['Facebook', 'Instagram', 'Google', 'TikTok', 'WhatsApp', 'Recomendación', 'Página web', 'Feria escolar'];

  const data = fuentes.map(f => {
    const total = prospectos.filter(p => p.fuenteContacto === f).length;
    const inscritos = prospectos.filter(p => p.fuenteContacto === f && p.etapa === 'Inscrito').length;
    const conversion = total > 0 ? Math.round((inscritos / total) * 100) : 0;
    const costoSimulado = Math.round(Math.random() * 5000 + 1000);
    return { fuente: f, total, inscritos, conversion, costo: costoSimulado, roi: inscritos > 0 ? Math.round((inscritos * 8500) / costoSimulado * 100) / 100 : 0 };
  });

  const chartData = {
    labels: data.map(d => d.fuente),
    datasets: [{
      label: 'Prospectos',
      data: data.map(d => d.total),
      backgroundColor: ['#3b82f6', '#ec4899', '#ef4444', '#000000', '#22c55e', '#f59e0b', '#6366f1', '#8b5cf6'],
      borderRadius: 6,
    }],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketing</h1>
          <p className="text-muted-foreground text-sm">Rendimiento por canal de adquisición</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Prospectos por Canal</h3>
        <div className="h-64">
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.05)' } } } }} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Canal</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Prospectos</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Inscritos</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Conversión</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Inversión</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">ROI</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.fuente} className="border-b border-border/50 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  {row.fuente}
                </td>
                <td className="px-4 py-3 tabular-nums">{row.total}</td>
                <td className="px-4 py-3 tabular-nums">{row.inscritos}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${row.conversion > 20 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>{row.conversion}%</span>
                </td>
                <td className="px-4 py-3 tabular-nums hidden md:table-cell">${row.costo.toLocaleString()}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`font-medium ${row.roi > 1 ? 'text-emerald-600' : 'text-red-500'}`}>{row.roi}x</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===================== FINANZAS =====================
export function FinanzasPage() {
  const [mensualidades, setLocalMens] = useState(getMensualidades());
  const stats = getDashboardStats();

  useEffect(() => {
    const handler = () => setLocalMens(getMensualidades());
    window.addEventListener('store-update', handler);
    return () => window.removeEventListener('store-update', handler);
  }, []);

  const pagosHoy = mensualidades.filter(m => m.fechaPago === new Date().toISOString().split('T')[0]);
  const morosidad = mensualidades.length > 0 ? Math.round((mensualidades.filter(m => m.estado === 'vencido').length / mensualidades.length) * 100) : 0;

  const ingresosChart = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [
      { label: 'Cobrado', data: [180000, 195000, 210000, 205000, 220000, 185000, 160000], backgroundColor: 'rgba(16, 185, 129, 0.8)', borderRadius: 6 },
      { label: 'Esperado', data: [220000, 220000, 220000, 220000, 220000, 220000, 220000], backgroundColor: 'rgba(79, 70, 229, 0.2)', borderRadius: 6 },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Financiero</h1>
        <p className="text-muted-foreground text-sm">Control de ingresos y cobranza</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-muted-foreground">Ingresos Cobrados</span>
          </div>
          <p className="text-2xl font-bold tabular-nums">${(stats.ingresosCobrados / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Ingresos Esperados</span>
          </div>
          <p className="text-2xl font-bold tabular-nums">${(stats.ingresosEsperados / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-muted-foreground">Adeudos</span>
          </div>
          <p className="text-2xl font-bold tabular-nums">${(stats.adeudos / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-muted-foreground">Morosidad</span>
          </div>
          <p className="text-2xl font-bold tabular-nums">{morosidad}%</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Ingresos vs Esperado</h3>
        <div className="h-64">
          <Bar data={ingresosChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { font: { family: 'DM Sans', size: 11 } } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.05)' } } } }} />
        </div>
      </div>
    </div>
  );
}

// ===================== REPORTES =====================
export function ReportesPage() {
  const stats = getDashboardStats();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reportes</h1>
          <p className="text-muted-foreground text-sm">Genera y exporta reportes detallados</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" className="px-3 py-2 bg-muted rounded-lg text-sm outline-none" defaultValue="2025-01-01" />
          <input type="date" className="px-3 py-2 bg-muted rounded-lg text-sm outline-none" defaultValue="2025-07-31" />
          <button className="p-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"><Filter className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Prospectos', value: stats.totalProspectos, icon: Users, desc: 'Total en pipeline' },
          { title: 'Visitas Realizadas', value: stats.visitasRealizadas, icon: Calendar, desc: 'Recorridos completados' },
          { title: 'Conversión', value: `${stats.conversion}%`, icon: TrendingUp, desc: 'Tasa de inscripción' },
          { title: 'Inscripciones', value: stats.inscritos, icon: Check, desc: 'Nuevos inscritos' },
          { title: 'Ingresos', value: `$${(stats.ingresosCobrados / 1000).toFixed(0)}K`, icon: DollarSign, desc: 'Total cobrado' },
          { title: 'Adeudos', value: `$${(stats.adeudos / 1000).toFixed(0)}K`, icon: AlertCircle, desc: 'Pendiente de cobro' },
        ].map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-3">
              <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <Download className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm font-medium mt-1">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium cursor-pointer hover:bg-primary/90">
          <Download className="w-4 h-4" /> Exportar PDF
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-emerald-700">
          <FileText className="w-4 h-4" /> Exportar Excel
        </button>
      </div>
    </div>
  );
}

// ===================== AUTOMATIZACIONES =====================
export function AutomatizacionesPage() {
  const steps = [
    { label: 'Nuevo mensaje WhatsApp', icon: '💬', color: 'bg-emerald-500' },
    { label: 'Crear Prospecto en CRM', icon: '👤', color: 'bg-blue-500' },
    { label: 'Responder con IA', icon: '🤖', color: 'bg-violet-500' },
    { label: 'Guardar datos del hijo', icon: '💾', color: 'bg-cyan-500' },
    { label: 'Esperar respuesta', icon: '⏳', color: 'bg-amber-500' },
    { label: 'Enviar folleto digital', icon: '📄', color: 'bg-pink-500' },
    { label: 'Agendar recorrido', icon: '📅', color: 'bg-indigo-500' },
    { label: 'Enviar recordatorio', icon: '🔔', color: 'bg-orange-500' },
    { label: 'Solicitar documentos', icon: '📋', color: 'bg-teal-500' },
    { label: 'Crear alumno', icon: '🎓', color: 'bg-emerald-600' },
    { label: 'Generar mensualidades', icon: '💰', color: 'bg-yellow-500' },
    { label: 'Enviar bienvenida', icon: '🎉', color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Automatizaciones</h1>
        <p className="text-muted-foreground text-sm">Flujos automáticos de trabajo</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Flujo: Nuevo Prospecto → Inscripción</h3>
            <p className="text-xs text-muted-foreground mt-1">Automatización completa del proceso de admisión</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-medium">Activo</span>
        </div>

        <div className="flex flex-col items-center">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex items-center gap-3 w-full max-w-sm bg-muted/50 rounded-xl p-3 hover:bg-muted transition-colors cursor-pointer group">
                <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center text-lg`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{step.label}</p>
                  <p className="text-[10px] text-muted-foreground">Paso {i + 1}</p>
                </div>
                <Zap className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {i < steps.length - 1 && (
                <div className="w-0.5 h-6 bg-border my-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== PORTAL PADRES =====================
export function PortalPadresPage() {
  const alumnos = getAlumnos();
  const mensualidades = getMensualidades();
  const alumno = alumnos[0];
  const alumnoMens = alumno ? mensualidades.filter(m => m.alumnoId === alumno.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Portal para Padres</h1>
        <p className="text-muted-foreground text-sm">Vista demo del portal de padres de familia</p>
      </div>

      {alumno && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Student Card */}
          <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
            <img src={alumno.foto} alt="" className="w-16 h-16 rounded-xl" />
            <div>
              <h2 className="text-xl font-bold">{alumno.nombre}</h2>
              <p className="text-muted-foreground">{alumno.grado} {alumno.grupo} • {alumno.matricula}</p>
              <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md font-medium mt-1 inline-block">Activo</span>
            </div>
          </div>

          {/* Estado de Cuenta */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Estado de Cuenta</h3>
            <div className="space-y-2">
              {alumnoMens.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{m.concepto}</p>
                    <p className="text-xs text-muted-foreground">Vence: {m.fechaLimite}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">${m.monto.toLocaleString()}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${m.estado === 'pagado' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>{m.estado}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Avisos */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Avisos y Circulares</h3>
            <div className="space-y-3">
              {['Junta de padres - 25 de Julio', 'Inicio de inscripciones ciclo 2026-2027', 'Festival de fin de cursos - 15 de Julio'].map((aviso, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p className="text-sm">{aviso}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== CONFIGURACIÓN =====================
export function ConfiguracionPage() {
  const [config, setLocalConfig] = useState(getConfig());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground text-sm">Ajustes generales del sistema</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h3 className="font-semibold">Costos y Colegiaturas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Costo de Inscripción</label>
            <input type="number" value={config.costoInscripcion} onChange={e => setLocalConfig({ ...config, costoInscripcion: Number(e.target.value) })} className="w-full px-3 py-2 bg-muted rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Colegiatura Mensual</label>
            <input type="number" value={config.costoMensualidad} onChange={e => setLocalConfig({ ...config, costoMensualidad: Number(e.target.value) })} className="w-full px-3 py-2 bg-muted rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Descuento Pronto Pago (%)</label>
            <input type="number" value={config.descuentoProntoPago} onChange={e => setLocalConfig({ ...config, descuentoProntoPago: Number(e.target.value) })} className="w-full px-3 py-2 bg-muted rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Recargo por Mora (%)</label>
            <input type="number" value={config.recargoMora} onChange={e => setLocalConfig({ ...config, recargoMora: Number(e.target.value) })} className="w-full px-3 py-2 bg-muted rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>

        <h3 className="font-semibold pt-4">Asesores</h3>
        <div className="space-y-2">
          {config.asesores.map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={a} onChange={e => { const asesores = [...config.asesores]; asesores[i] = e.target.value; setLocalConfig({ ...config, asesores }); }} className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          ))}
        </div>

        <button onClick={handleSave} className={`px-6 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
          {saved ? '✓ Guardado' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
}

// ===================== ASISTENTE IA =====================
export function AsistenteIAPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: '¡Hola! Soy el Asistente IA de Colegio Inteligente. Puedo responder preguntas sobre tus prospectos, alumnos, finanzas y más. ¿En qué puedo ayudarte?' }
  ]);

  const handleSend = () => {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setQuery('');

    setTimeout(() => {
      const prospectos = getProspectos();
      const alumnos = getAlumnos();
      const mensualidades = getMensualidades();
      const stats = getDashboardStats();
      let response = '';

      if (q.includes('prospecto') && (q.includes('cuántos') || q.includes('cuantos') || q.includes('total'))) {
        response = `Actualmente tienes **${stats.totalProspectos} prospectos** en el pipeline. De estos, ${stats.nuevos} son nuevos, ${stats.visitasAgendadas} tienen visita agendada y ${stats.inscritos} ya se inscribieron.`;
      } else if (q.includes('probabilidad') || q.includes('mayor')) {
        const top = prospectos.filter(p => p.etapa !== 'Inscrito' && p.etapa !== 'No interesado').sort((a, b) => b.probabilidad - a.probabilidad).slice(0, 5);
        response = `Los prospectos con mayor probabilidad de inscripción son:\n\n${top.map((p, i) => `${i + 1}. **${p.nombre}** - ${p.probabilidad}% (${p.etapa})`).join('\n')}`;
      } else if (q.includes('seguimiento') || q.includes('7 días') || q.includes('sin contacto')) {
        const sinSeg = prospectos.filter(p => { const d = new Date(p.ultimoContacto); const diff = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24); return diff > 7 && p.etapa !== 'Inscrito' && p.etapa !== 'No interesado'; });
        response = `Hay **${sinSeg.length} prospectos** con más de 7 días sin seguimiento. Los más urgentes son:\n\n${sinSeg.slice(0, 5).map((p, i) => `${i + 1}. ${p.nombre} - Último contacto: ${p.ultimoContacto}`).join('\n')}`;
      } else if (q.includes('grado') && q.includes('demanda')) {
        const gradoCount: Record<string, number> = {};
        prospectos.forEach(p => { gradoCount[p.gradoSolicitado] = (gradoCount[p.gradoSolicitado] || 0) + 1; });
        const sorted = Object.entries(gradoCount).sort((a, b) => b[1] - a[1]);
        response = `Los grados con mayor demanda son:\n\n${sorted.slice(0, 5).map(([g, c], i) => `${i + 1}. **${g}** - ${c} prospectos`).join('\n')}`;
      } else if (q.includes('visita') && q.includes('semana')) {
        response = `Esta semana se han realizado **${stats.visitasRealizadas} recorridos** y hay **${stats.visitasAgendadas} más agendados**. La tasa de conversión de visita a inscripción es del ${stats.conversion}%.`;
      } else if (q.includes('inscripcion') || q.includes('inscripciones') && q.includes('mes')) {
        response = `Este mes se han logrado **${stats.inscritos} inscripciones** nuevas, con una tasa de conversión del ${stats.conversion}%. El ingreso por inscripciones es de $${(stats.inscritos * 8500).toLocaleString()}.`;
      } else if (q.includes('asesor') || q.includes('convierte')) {
        const asesorCount: Record<string, number> = {};
        prospectos.filter(p => p.etapa === 'Inscrito').forEach(p => { asesorCount[p.asesor] = (asesorCount[p.asesor] || 0) + 1; });
        const sorted = Object.entries(asesorCount).sort((a, b) => b[1] - a[1]);
        response = `Rendimiento por asesor:\n\n${sorted.map(([a, c], i) => `${i + 1}. **${a}** - ${c} inscripciones`).join('\n')}`;
      } else if (q.includes('ingreso') || q.includes('cobr') || q.includes('dinero')) {
        response = `**Resumen financiero:**\n\n• Ingresos cobrados: $${stats.ingresosCobrados.toLocaleString()}\n• Ingresos esperados: $${stats.ingresosEsperados.toLocaleString()}\n• Adeudos: $${stats.adeudos.toLocaleString()}\n• Mensualidades pendientes: ${stats.mensualidadesPendientes}`;
      } else if (q.includes('alumno') && (q.includes('cuántos') || q.includes('cuantos') || q.includes('activo'))) {
        response = `Hay **${stats.alumnosActivos} alumnos activos** distribuidos en Preescolar, Primaria y Secundaria. El ingreso mensual esperado por colegiaturas es de $${(stats.alumnosActivos * 5500).toLocaleString()}.`;
      } else {
        response = `Puedo ayudarte con información sobre:\n\n• Prospectos y pipeline\n• Probabilidad de inscripción\n• Seguimiento pendiente\n• Demanda por grado\n• Visitas y recorridos\n• Inscripciones del mes\n• Rendimiento de asesores\n• Ingresos y cobranza\n• Alumnos activos\n\n¿Qué te gustaría saber?`;
      }

      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-3xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Bot className="w-6 h-6 text-primary" /> Asistente IA</h1>
        <p className="text-muted-foreground text-sm">Pregunta sobre prospectos, alumnos, finanzas y más</p>
      </div>

      <div className="flex-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-xl text-sm whitespace-pre-line ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'}`}>
                {msg.text.split('**').map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border flex items-center gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Pregunta algo... ej: ¿Cuántos prospectos tengo?"
            className="flex-1 px-4 py-2.5 bg-muted rounded-xl text-sm outline-none"
          />
          <button onClick={handleSend} className="p-2.5 bg-primary text-primary-foreground rounded-xl cursor-pointer hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================== MENSUALIDADES =====================
export function MensualidadesPage() {
  const [mensualidades, setLocalMens] = useState(getMensualidades());
  const [filter, setFilter] = useState('');
  const alumnos = getAlumnos();

  useEffect(() => {
    const handler = () => setLocalMens(getMensualidades());
    window.addEventListener('store-update', handler);
    return () => window.removeEventListener('store-update', handler);
  }, []);

  const handlePay = (id: string, monto: number) => {
    registrarPago(id, monto);
    setLocalMens(getMensualidades());
  };

  const filtered = filter ? mensualidades.filter(m => m.estado === filter) : mensualidades;
  const getAlumnoName = (id: string) => alumnos.find(a => a.id === id)?.nombre || 'Alumno';

  const estadoColor = (estado: string) => {
    switch (estado) {
      case 'pagado': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'pendiente': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'vencido': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Mensualidades</h1>
          <p className="text-muted-foreground text-sm">{mensualidades.length} registros</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 bg-muted rounded-lg text-sm outline-none cursor-pointer">
            <option value="">Todos</option>
            <option value="pagado">Pagados</option>
            <option value="pendiente">Pendientes</option>
            <option value="vencido">Vencidos</option>
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-14rem)]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Alumno</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Concepto</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Fecha Límite</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Monto</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map(m => (
                <tr key={m.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-2.5 text-sm truncate max-w-[120px]">{getAlumnoName(m.alumnoId)}</td>
                  <td className="px-4 py-2.5 text-sm">{m.concepto}</td>
                  <td className="px-4 py-2.5 text-sm text-muted-foreground hidden md:table-cell">{m.fechaLimite}</td>
                  <td className="px-4 py-2.5 text-sm font-semibold tabular-nums">${m.monto.toLocaleString()}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-2 py-1 rounded-md font-medium capitalize ${estadoColor(m.estado)}`}>{m.estado}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    {m.estado !== 'pagado' && (
                      <button onClick={() => handlePay(m.id, m.monto)} className="px-3 py-1 bg-emerald-600 text-white rounded-md text-xs font-medium cursor-pointer hover:bg-emerald-700">
                        Pagar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}