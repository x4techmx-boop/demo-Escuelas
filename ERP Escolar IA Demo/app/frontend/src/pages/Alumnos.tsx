import { useState, useEffect } from 'react';
import {
  Search, Filter, GraduationCap, Phone, Mail,
  Eye, FileText, CreditCard, X, Check, AlertCircle, Clock, DollarSign
} from 'lucide-react';
import { getAlumnos, getMensualidades, registrarPago, type Alumno, type Mensualidad } from '@/lib/store';

export default function AlumnosPage() {
  const [alumnos, setLocalAlumnos] = useState<Alumno[]>(getAlumnos());
  const [mensualidades, setLocalMens] = useState<Mensualidad[]>(getMensualidades());
  const [search, setSearch] = useState('');
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
  const [tab, setTab] = useState<'info' | 'pagos' | 'expediente'>('info');
  const [filterNivel, setFilterNivel] = useState('');
  const [showPayModal, setShowPayModal] = useState<Mensualidad | null>(null);

  useEffect(() => {
    const handler = () => { setLocalAlumnos(getAlumnos()); setLocalMens(getMensualidades()); };
    window.addEventListener('store-update', handler);
    return () => window.removeEventListener('store-update', handler);
  }, []);

  const filtered = alumnos.filter(a => {
    const matchSearch = !search || a.nombre.toLowerCase().includes(search.toLowerCase()) || a.matricula.toLowerCase().includes(search.toLowerCase());
    const matchNivel = !filterNivel || a.nivel === filterNivel;
    return matchSearch && matchNivel;
  });

  const getAlumnoMensualidades = (alumnoId: string) => mensualidades.filter(m => m.alumnoId === alumnoId);

  const estadoColor = (estado: string) => {
    switch (estado) {
      case 'pagado': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'pendiente': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'vencido': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'parcial': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handlePay = (mens: Mensualidad) => {
    registrarPago(mens.id, mens.monto);
    setLocalMens(getMensualidades());
    setShowPayModal(null);
  };

  // Stats
  const totalPagado = mensualidades.filter(m => m.estado === 'pagado').reduce((s, m) => s + (m.montoPagado || m.monto), 0);
  const totalPendiente = mensualidades.filter(m => m.estado === 'pendiente' || m.estado === 'vencido').reduce((s, m) => s + m.monto, 0);
  const totalVencido = mensualidades.filter(m => m.estado === 'vencido').reduce((s, m) => s + m.monto, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Alumnos</h1>
          <p className="text-muted-foreground text-sm">{alumnos.length} alumnos activos</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar alumno..." className="pl-9 pr-4 py-2 bg-muted rounded-lg text-sm outline-none w-48 focus:ring-2 focus:ring-primary/30" />
          </div>
          <select value={filterNivel} onChange={e => setFilterNivel(e.target.value)} className="px-3 py-2 bg-muted rounded-lg text-sm outline-none cursor-pointer">
            <option value="">Todos los niveles</option>
            <option value="Preescolar">Preescolar</option>
            <option value="Primaria">Primaria</option>
            <option value="Secundaria">Secundaria</option>
          </select>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums">${(totalPagado / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground">Cobrado</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums">${(totalPendiente / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground">Pendiente</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums">${(totalVencido / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground">Vencido</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Alumno</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Matrícula</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Nivel</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Grado</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Tutor</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map(alumno => (
                <tr key={alumno.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={alumno.foto} alt="" className="w-8 h-8 rounded-full" />
                      <span className="font-medium truncate max-w-[150px]">{alumno.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{alumno.matricula}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="px-2 py-1 rounded-md text-xs bg-primary/10 text-primary font-medium">{alumno.nivel}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{alumno.grado} {alumno.grupo}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground truncate max-w-[120px]">{alumno.tutor}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-md text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium capitalize">{alumno.estado}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelectedAlumno(alumno); setTab('info'); }} className="p-1.5 hover:bg-muted rounded-lg cursor-pointer" title="Ver detalle">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => { setSelectedAlumno(alumno); setTab('pagos'); }} className="p-1.5 hover:bg-muted rounded-lg cursor-pointer" title="Pagos">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAlumno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedAlumno(null)} />
          <div className="relative bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto animate-scale-in shadow-2xl">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <img src={selectedAlumno.foto} alt="" className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-semibold">{selectedAlumno.nombre}</h3>
                  <p className="text-xs text-muted-foreground">{selectedAlumno.matricula}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAlumno(null)} className="p-2 hover:bg-muted rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-4 flex gap-1 border-b border-border">
              {(['info', 'pagos', 'expediente'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors cursor-pointer capitalize ${tab === t ? 'bg-muted text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  {t === 'info' ? 'Información' : t === 'pagos' ? 'Mensualidades' : 'Expediente'}
                </button>
              ))}
            </div>

            <div className="p-6">
              {tab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm"><GraduationCap className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Nivel:</span> {selectedAlumno.nivel}</div>
                    <div className="flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Grado:</span> {selectedAlumno.grado} {selectedAlumno.grupo}</div>
                    <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Teléfono:</span> {selectedAlumno.telefono}</div>
                    <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Correo:</span> {selectedAlumno.correo}</div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm"><span className="text-muted-foreground">Tutor:</span> {selectedAlumno.tutor}</div>
                    <div className="text-sm"><span className="text-muted-foreground">Fecha ingreso:</span> {selectedAlumno.fechaIngreso}</div>
                    <div className="text-sm"><span className="text-muted-foreground">Mensualidad:</span> ${selectedAlumno.mensualidad.toLocaleString()}</div>
                    <div className="text-sm"><span className="text-muted-foreground">Estado:</span> <span className="capitalize text-emerald-600 font-medium">{selectedAlumno.estado}</span></div>
                  </div>
                </div>
              )}

              {tab === 'pagos' && (
                <div className="space-y-3">
                  {getAlumnoMensualidades(selectedAlumno.id).map(mens => (
                    <div key={mens.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mens.estado === 'pagado' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                          {mens.estado === 'pagado' ? <Check className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-amber-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{mens.concepto}</p>
                          <p className="text-xs text-muted-foreground">Vence: {mens.fechaLimite}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-semibold tabular-nums">${mens.monto.toLocaleString()}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${estadoColor(mens.estado)}`}>{mens.estado}</span>
                        </div>
                        {mens.estado !== 'pagado' && (
                          <button onClick={() => setShowPayModal(mens)} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium cursor-pointer hover:bg-primary/90">
                            Pagar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'expediente' && (
                <div className="space-y-3">
                  {['CURP', 'Acta de nacimiento', 'INE del tutor', 'Comprobante de domicilio', 'Certificado anterior', 'Boleta anterior', 'Fotografías'].map((doc, i) => (
                    <div key={doc} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{doc}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-md font-medium ${i < 4 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {i < 4 ? 'Entregado' : 'Pendiente'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPayModal(null)} />
          <div className="relative bg-card border border-border rounded-2xl w-full max-w-sm animate-scale-in shadow-2xl p-6">
            <h3 className="font-semibold text-lg mb-2">Registrar Pago</h3>
            <p className="text-sm text-muted-foreground mb-4">{showPayModal.concepto}</p>
            <div className="bg-muted/50 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Monto:</span>
                <span className="font-semibold">${showPayModal.monto.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fecha límite:</span>
                <span>{showPayModal.fechaLimite}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handlePay(showPayModal)} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-emerald-700 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Confirmar Pago
              </button>
              <button onClick={() => setShowPayModal(null)} className="px-4 py-2.5 bg-muted rounded-lg text-sm font-medium cursor-pointer hover:bg-muted/80">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}