import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus, Search, Filter, MoreHorizontal, Phone, Mail, MapPin,
  Star, Clock, Tag, X, Edit2, Trash2, MessageCircle, Calendar
} from 'lucide-react';
import { getProspectos, setProspectos, addProspecto, type Prospecto } from '@/lib/store';

const etapas = ['Nuevo Prospecto', 'Contacto realizado', 'Interesado', 'Recorrido agendado', 'Recorrido realizado', 'Entrevista', 'Documentación', 'Inscrito', 'No interesado'];
const etapaColors: Record<string, string> = {
  'Nuevo Prospecto': 'border-t-blue-500',
  'Contacto realizado': 'border-t-cyan-500',
  'Interesado': 'border-t-violet-500',
  'Recorrido agendado': 'border-t-amber-500',
  'Recorrido realizado': 'border-t-orange-500',
  'Entrevista': 'border-t-pink-500',
  'Documentación': 'border-t-indigo-500',
  'Inscrito': 'border-t-emerald-500',
  'No interesado': 'border-t-gray-400',
};

function ProspectoCard({ prospecto, onClick }: { prospecto: Prospecto; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: prospecto.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const prioColor = prospecto.prioridad === 'alta' ? 'bg-red-500' : prospecto.prioridad === 'media' ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="bg-card border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <img src={prospecto.foto} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{prospecto.nombre}</p>
          <p className="text-xs text-muted-foreground truncate">{prospecto.gradoSolicitado}</p>
        </div>
        <div className={`w-2 h-2 rounded-full ${prioColor} flex-shrink-0 mt-1.5`} />
      </div>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {prospecto.etiquetas.slice(0, 2).map(tag => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-md font-medium">{tag}</span>
        ))}
        <span className="text-[10px] text-muted-foreground ml-auto">{prospecto.probabilidad}%</span>
      </div>
    </div>
  );
}

export default function CRM() {
  const [prospectos, setLocalProspectos] = useState<Prospecto[]>(getProspectos());
  const [search, setSearch] = useState('');
  const [selectedProspecto, setSelectedProspecto] = useState<Prospecto | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProspecto, setNewProspecto] = useState({ nombre: '', telefono: '', gradoSolicitado: '', fuenteContacto: 'WhatsApp' });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    const handler = () => setLocalProspectos(getProspectos());
    window.addEventListener('store-update', handler);
    return () => window.removeEventListener('store-update', handler);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const overId = over.id as string;
    const etapa = etapas.find(e => e === overId);
    if (etapa) {
      const updated = prospectos.map(p => p.id === active.id ? { ...p, etapa } : p);
      setLocalProspectos(updated);
      setProspectos(updated);
    }
  };

  const handleAdd = () => {
    if (!newProspecto.nombre) return;
    const p: Prospecto = {
      id: Math.random().toString(36).substr(2, 9),
      nombre: newProspecto.nombre,
      nombreHijo: newProspecto.nombre,
      edad: 8,
      fechaNacimiento: '2017-01-01',
      gradoSolicitado: newProspecto.gradoSolicitado || '3° Primaria',
      escuelaAnterior: '',
      padre: newProspecto.nombre,
      madre: '',
      telefono: newProspecto.telefono,
      correo: '',
      direccion: '',
      ciudad: 'Guadalajara',
      fuenteContacto: newProspecto.fuenteContacto,
      comentarios: '',
      etapa: 'Nuevo Prospecto',
      prioridad: 'media',
      asesor: 'Lic. María González',
      probabilidad: 10,
      fechaCreacion: new Date().toISOString().split('T')[0],
      ultimoContacto: new Date().toISOString().split('T')[0],
      notas: ['Prospecto creado manualmente'],
      etiquetas: [],
      foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(newProspecto.nombre)}&background=4f46e5&color=fff&size=128`,
    };
    addProspecto(p);
    setLocalProspectos(getProspectos());
    setShowAddModal(false);
    setNewProspecto({ nombre: '', telefono: '', gradoSolicitado: '', fuenteContacto: 'WhatsApp' });
  };

  const filtered = search ? prospectos.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase())) : prospectos;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold">CRM de Admisiones</h1>
          <p className="text-muted-foreground text-sm">{prospectos.length} prospectos en pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar prospecto..." className="pl-9 pr-4 py-2 bg-muted rounded-lg text-sm outline-none w-48 focus:ring-2 focus:ring-primary/30" />
          </div>
          <button className="p-2 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer"><Filter className="w-4 h-4" /></button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 cursor-pointer">
            <Plus className="w-4 h-4" /> Nuevo
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-3 min-w-max h-full pb-4">
            {etapas.map(etapa => {
              const items = filtered.filter(p => p.etapa === etapa);
              return (
                <div key={etapa} className={`w-72 flex-shrink-0 bg-muted/50 rounded-xl border-t-4 ${etapaColors[etapa]} flex flex-col`}>
                  <div className="px-3 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{etapa}</h3>
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded-md font-medium">{items.length}</span>
                    </div>
                    <button className="p-1 hover:bg-muted rounded cursor-pointer"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
                  </div>
                  <SortableContext items={items.map(p => p.id)} strategy={verticalListSortingStrategy} id={etapa}>
                    <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2 max-h-[calc(100vh-280px)]" id={etapa}>
                      {items.map(p => (
                        <ProspectoCard key={p.id} prospecto={p} onClick={() => setSelectedProspecto(p)} />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </div>
        </div>
      </DndContext>

      {/* Prospect Detail Modal */}
      {selectedProspecto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedProspecto(null)} />
          <div className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-scale-in shadow-2xl">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-semibold">Ficha del Prospecto</h3>
              <button onClick={() => setSelectedProspecto(null)} className="p-2 hover:bg-muted rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <img src={selectedProspecto.foto} alt="" className="w-16 h-16 rounded-xl" />
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{selectedProspecto.nombre}</h2>
                  <p className="text-muted-foreground">{selectedProspecto.gradoSolicitado} • {selectedProspecto.escuelaAnterior}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${selectedProspecto.prioridad === 'alta' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : selectedProspecto.prioridad === 'media' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                      Prioridad {selectedProspecto.prioridad}
                    </span>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                      {selectedProspecto.probabilidad}% probabilidad
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-muted-foreground" />{selectedProspecto.telefono}</div>
                  <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-muted-foreground" />{selectedProspecto.correo || 'Sin correo'}</div>
                  <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-muted-foreground" />{selectedProspecto.ciudad}</div>
                  <div className="flex items-center gap-2 text-sm"><Star className="w-4 h-4 text-muted-foreground" />Fuente: {selectedProspecto.fuenteContacto}</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-muted-foreground" />Creado: {selectedProspecto.fechaCreacion}</div>
                  <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-muted-foreground" />Último contacto: {selectedProspecto.ultimoContacto}</div>
                  <div className="flex items-center gap-2 text-sm"><Tag className="w-4 h-4 text-muted-foreground" />Asesor: {selectedProspecto.asesor}</div>
                  <div className="flex items-center gap-2 text-sm"><MessageCircle className="w-4 h-4 text-muted-foreground" />Etapa: {selectedProspecto.etapa}</div>
                </div>
              </div>

              {/* Datos del hijo */}
              <div className="bg-muted/50 rounded-xl p-4">
                <h4 className="font-medium text-sm mb-2">Datos del Alumno</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-muted-foreground">Nombre:</span> {selectedProspecto.nombreHijo}</p>
                  <p><span className="text-muted-foreground">Edad:</span> {selectedProspecto.edad} años</p>
                  <p><span className="text-muted-foreground">Grado:</span> {selectedProspecto.gradoSolicitado}</p>
                  <p><span className="text-muted-foreground">Escuela anterior:</span> {selectedProspecto.escuelaAnterior}</p>
                </div>
              </div>

              {/* Notas */}
              <div>
                <h4 className="font-medium text-sm mb-2">Bitácora</h4>
                <div className="space-y-2">
                  {selectedProspecto.notas.map((nota, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p>{nota}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium cursor-pointer hover:bg-primary/90">
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-emerald-700">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium cursor-pointer hover:bg-muted/80">
                  <Calendar className="w-4 h-4" /> Agendar
                </button>
                <button className="ml-auto flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg text-sm cursor-pointer">
                  <Trash2 className="w-4 h-4" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-card border border-border rounded-2xl w-full max-w-md animate-scale-in shadow-2xl p-6">
            <h3 className="font-semibold text-lg mb-4">Nuevo Prospecto</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nombre completo</label>
                <input value={newProspecto.nombre} onChange={e => setNewProspecto({ ...newProspecto, nombre: e.target.value })} className="w-full px-3 py-2 bg-muted rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Nombre del padre/madre" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Teléfono</label>
                <input value={newProspecto.telefono} onChange={e => setNewProspecto({ ...newProspecto, telefono: e.target.value })} className="w-full px-3 py-2 bg-muted rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="33 1234 5678" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Grado solicitado</label>
                <select value={newProspecto.gradoSolicitado} onChange={e => setNewProspecto({ ...newProspecto, gradoSolicitado: e.target.value })} className="w-full px-3 py-2 bg-muted rounded-lg text-sm outline-none cursor-pointer">
                  <option value="">Seleccionar...</option>
                  {['Maternal', 'Kinder 1', 'Kinder 2', 'Kinder 3', '1° Primaria', '2° Primaria', '3° Primaria', '4° Primaria', '5° Primaria', '6° Primaria', '1° Secundaria', '2° Secundaria', '3° Secundaria'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Fuente</label>
                <select value={newProspecto.fuenteContacto} onChange={e => setNewProspecto({ ...newProspecto, fuenteContacto: e.target.value })} className="w-full px-3 py-2 bg-muted rounded-lg text-sm outline-none cursor-pointer">
                  {['Facebook', 'Instagram', 'Google', 'TikTok', 'WhatsApp', 'Recomendación', 'Página web', 'Feria escolar'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium cursor-pointer hover:bg-primary/90">Crear Prospecto</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2.5 bg-muted rounded-lg text-sm font-medium cursor-pointer hover:bg-muted/80">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}