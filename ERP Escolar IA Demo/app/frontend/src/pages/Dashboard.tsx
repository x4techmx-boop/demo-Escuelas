import { useState, useEffect } from 'react';
import {
  Users, UserPlus, CalendarCheck, ClipboardCheck, FileText,
  UserCheck, TrendingUp, GraduationCap, DollarSign, AlertCircle,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { getDashboardStats, getChartData } from '@/lib/store';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  positive?: boolean;
  color: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState(getDashboardStats());
  const [charts, setCharts] = useState(getChartData());

  useEffect(() => {
    const handler = () => { setStats(getDashboardStats()); setCharts(getChartData()); };
    window.addEventListener('store-update', handler);
    return () => window.removeEventListener('store-update', handler);
  }, []);

  const statCards: StatCard[] = [
    { label: 'Total Prospectos', value: stats.totalProspectos, icon: Users, change: '+12%', positive: true, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { label: 'Prospectos Nuevos', value: stats.nuevos, icon: UserPlus, change: '+5', positive: true, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { label: 'Visitas Agendadas', value: stats.visitasAgendadas, icon: CalendarCheck, color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
    { label: 'Entrevistas', value: stats.entrevistas, icon: ClipboardCheck, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { label: 'Documentación', value: stats.documentacion, icon: FileText, color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
    { label: 'Inscripciones', value: stats.inscritos, icon: UserCheck, change: '+3', positive: true, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { label: 'Conversión', value: `${stats.conversion}%`, icon: TrendingUp, change: '+2.5%', positive: true, color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { label: 'Alumnos Activos', value: stats.alumnosActivos, icon: GraduationCap, color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
    { label: 'Ingresos Cobrados', value: `$${(stats.ingresosCobrados / 1000).toFixed(0)}K`, icon: DollarSign, change: '+8%', positive: true, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { label: 'Adeudos', value: `$${(stats.adeudos / 1000).toFixed(0)}K`, icon: AlertCircle, change: '-3%', positive: false, color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
    { label: 'Mensualidades Cobradas', value: stats.mensualidadesCobradas, icon: DollarSign, color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
    { label: 'Mensualidades Pendientes', value: stats.mensualidadesPendientes, icon: AlertCircle, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'hsl(222, 47%, 11%)', titleFont: { family: 'DM Sans' }, bodyFont: { family: 'DM Sans' }, cornerRadius: 8, padding: 12 } },
    scales: { x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 11 } } }, y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { family: 'DM Sans', size: 11 } } } },
  };

  const fuentesData = {
    labels: Object.keys(charts.fuentesCount),
    datasets: [{ data: Object.values(charts.fuentesCount), backgroundColor: ['#4f46e5', '#7c3aed', '#2563eb', '#0891b2', '#059669', '#dc2626', '#ea580c', '#ca8a04'], borderWidth: 0 }],
  };

  const embudoData = {
    labels: Object.keys(charts.etapasCount).filter(k => k !== 'No interesado'),
    datasets: [{
      label: 'Prospectos',
      data: Object.entries(charts.etapasCount).filter(([k]) => k !== 'No interesado').map(([, v]) => v),
      backgroundColor: 'rgba(79, 70, 229, 0.8)',
      borderRadius: 6,
    }],
  };

  const ingresosData = {
    labels: Object.keys(charts.ingresosMes),
    datasets: [{
      label: 'Ingresos',
      data: Object.values(charts.ingresosMes),
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#4f46e5',
    }],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Resumen general del ciclo escolar 2025-2026</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 bg-muted rounded-lg text-sm border-0 outline-none cursor-pointer">
            <option>Este mes</option>
            <option>Última semana</option>
            <option>Este año</option>
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all duration-200 animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              {card.change && (
                <span className={`flex items-center gap-0.5 text-xs font-medium ${card.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {card.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {card.change}
                </span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold tabular-nums">{card.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Embudo de Admisiones */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Embudo de Admisiones</h3>
          <div className="h-64">
            <Bar data={embudoData} options={chartOptions} />
          </div>
        </div>

        {/* Prospectos por Fuente */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Prospectos por Fuente</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={fuentesData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { font: { family: 'DM Sans', size: 11 }, padding: 12 } } } }} />
          </div>
        </div>

        {/* Ingresos Mensuales */}
        <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">Ingresos Mensuales</h3>
          <div className="h-64">
            <Line data={ingresosData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}