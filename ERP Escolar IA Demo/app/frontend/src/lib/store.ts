// ============================================================
// COLEGIO INTELIGENTE - Data Store (LocalStorage)
// ============================================================

export interface Prospecto {
  id: string;
  nombre: string;
  nombreHijo: string;
  edad: number;
  fechaNacimiento: string;
  gradoSolicitado: string;
  escuelaAnterior: string;
  padre: string;
  madre: string;
  telefono: string;
  correo: string;
  direccion: string;
  ciudad: string;
  fuenteContacto: string;
  comentarios: string;
  etapa: string;
  prioridad: 'alta' | 'media' | 'baja';
  asesor: string;
  probabilidad: number;
  fechaCreacion: string;
  ultimoContacto: string;
  notas: string[];
  etiquetas: string[];
  foto: string;
}

export interface Alumno {
  id: string;
  prospectoId?: string;
  nombre: string;
  matricula: string;
  nivel: string;
  grado: string;
  grupo: string;
  tutor: string;
  telefono: string;
  correo: string;
  estado: 'activo' | 'baja' | 'egresado';
  fechaIngreso: string;
  foto: string;
  mensualidad: number;
}

export interface Mensualidad {
  id: string;
  alumnoId: string;
  concepto: string;
  monto: number;
  fechaLimite: string;
  estado: 'pagado' | 'pendiente' | 'vencido' | 'parcial';
  fechaPago?: string;
  montoPagado?: number;
  mes: string;
}

export interface Conversacion {
  id: string;
  prospectoId?: string;
  nombre: string;
  telefono: string;
  mensajes: Mensaje[];
  ultimoMensaje: string;
  fechaUltimo: string;
  noLeido: number;
  foto: string;
}

export interface Mensaje {
  id: string;
  texto: string;
  tipo: 'enviado' | 'recibido';
  hora: string;
  fecha: string;
}

export interface Evento {
  id: string;
  titulo: string;
  tipo: 'recorrido' | 'entrevista' | 'llamada' | 'recordatorio';
  fecha: string;
  hora: string;
  prospectoId?: string;
  descripcion: string;
  completado: boolean;
}

export interface Configuracion {
  costoInscripcion: number;
  costoMensualidad: number;
  descuentoProntoPago: number;
  recargoMora: number;
  grados: string[];
  grupos: string[];
  asesores: string[];
}

// Nombres mexicanos realistas
const nombres = ['Santiago', 'Mateo', 'Sebastián', 'Leonardo', 'Emiliano', 'Diego', 'Miguel Ángel', 'Daniel', 'Alejandro', 'Pablo', 'Valentina', 'Sofía', 'Regina', 'Camila', 'María José', 'Ximena', 'Renata', 'Isabella', 'Mariana', 'Lucía'];
const apellidos = ['García', 'Hernández', 'López', 'Martínez', 'González', 'Rodríguez', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Ortiz', 'Ruiz'];
const padresNombres = ['Carlos', 'Roberto', 'Fernando', 'Jorge', 'Luis', 'Ricardo', 'Eduardo', 'Andrés', 'Miguel', 'José'];
const madresNombres = ['Ana', 'María', 'Patricia', 'Laura', 'Claudia', 'Gabriela', 'Adriana', 'Mónica', 'Verónica', 'Alejandra'];
const escuelas = ['Colegio Montessori', 'Instituto Cervantes', 'Escuela Primaria Federal', 'Colegio Americano', 'Instituto Bilingüe', 'Escuela Waldorf', 'Colegio del Valle', 'Instituto Patria'];
const fuentes = ['Facebook', 'Instagram', 'Google', 'TikTok', 'WhatsApp', 'Recomendación', 'Página web', 'Feria escolar'];
const grados = ['Maternal', 'Kinder 1', 'Kinder 2', 'Kinder 3', '1° Primaria', '2° Primaria', '3° Primaria', '4° Primaria', '5° Primaria', '6° Primaria', '1° Secundaria', '2° Secundaria', '3° Secundaria'];
const etapas = ['Nuevo Prospecto', 'Contacto realizado', 'Interesado', 'Recorrido agendado', 'Recorrido realizado', 'Entrevista', 'Documentación', 'Inscrito', 'No interesado'];
const asesores = ['Lic. María González', 'Lic. Ana Torres', 'Lic. Roberto Díaz'];
const ciudades = ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'Tlajomulco'];

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function genId(): string { return Math.random().toString(36).substr(2, 9); }
function genDate(monthsAgo: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  d.setDate(randomInt(1, 28));
  return d.toISOString().split('T')[0];
}
function genAvatar(name: string): string {
  const colors = ['4f46e5', '7c3aed', '2563eb', '0891b2', '059669', 'dc2626', 'ea580c', 'ca8a04'];
  const color = colors[name.length % colors.length];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128&bold=true`;
}

function generateProspectos(): Prospecto[] {
  const prospectos: Prospecto[] = [];
  for (let i = 0; i < 40; i++) {
    const nombre = randomFrom(nombres);
    const apellido1 = randomFrom(apellidos);
    const apellido2 = randomFrom(apellidos);
    const nombreCompleto = `${nombre} ${apellido1} ${apellido2}`;
    const padre = `${randomFrom(padresNombres)} ${apellido1}`;
    const madre = `${randomFrom(madresNombres)} ${apellido2}`;
    const edad = randomInt(3, 15);
    const etapa = i < 5 ? 'Inscrito' : randomFrom(etapas.filter(e => e !== 'Inscrito'));
    
    prospectos.push({
      id: genId(),
      nombre: nombreCompleto,
      nombreHijo: `${randomFrom(nombres)} ${apellido1}`,
      edad,
      fechaNacimiento: genDate(edad * 12),
      gradoSolicitado: randomFrom(grados),
      escuelaAnterior: randomFrom(escuelas),
      padre,
      madre,
      telefono: `33${randomInt(10000000, 99999999)}`,
      correo: `${padre.toLowerCase().replace(/\s/g, '.').replace(/[áéíóú]/g, 'a')}@gmail.com`,
      direccion: `Calle ${randomFrom(['Hidalgo', 'Juárez', 'Morelos', 'Reforma', 'Independencia'])} #${randomInt(100, 999)}`,
      ciudad: randomFrom(ciudades),
      fuenteContacto: randomFrom(fuentes),
      comentarios: randomFrom(['Interesado en programa bilingüe', 'Busca horario extendido', 'Preguntó por becas', 'Quiere conocer instalaciones', 'Referido por familia inscrita']),
      etapa,
      prioridad: randomFrom(['alta', 'media', 'baja']),
      asesor: randomFrom(asesores),
      probabilidad: etapa === 'Inscrito' ? 100 : etapa === 'Documentación' ? 90 : etapa === 'Entrevista' ? 75 : etapa === 'Recorrido realizado' ? 60 : etapa === 'Recorrido agendado' ? 45 : etapa === 'Interesado' ? 35 : etapa === 'Contacto realizado' ? 20 : etapa === 'No interesado' ? 5 : 10,
      fechaCreacion: genDate(randomInt(0, 4)),
      ultimoContacto: genDate(randomInt(0, 1)),
      notas: ['Primer contacto por WhatsApp', 'Se envió información de costos'],
      etiquetas: [randomFrom(['Urgente', 'VIP', 'Beca', 'Bilingüe', 'Deportes'])],
      foto: genAvatar(nombreCompleto),
    });
  }
  return prospectos;
}

function generateAlumnos(): Alumno[] {
  const alumnos: Alumno[] = [];
  for (let i = 0; i < 40; i++) {
    const nombre = randomFrom(nombres);
    const apellido = randomFrom(apellidos);
    const nombreCompleto = `${nombre} ${apellido} ${randomFrom(apellidos)}`;
    alumnos.push({
      id: genId(),
      nombre: nombreCompleto,
      matricula: `CI-2025-${String(i + 1).padStart(4, '0')}`,
      nivel: randomFrom(['Preescolar', 'Primaria', 'Secundaria']),
      grado: randomFrom(grados),
      grupo: randomFrom(['A', 'B', 'C']),
      tutor: `${randomFrom(padresNombres)} ${apellido}`,
      telefono: `33${randomInt(10000000, 99999999)}`,
      correo: `${nombre.toLowerCase().replace(/[áéíóú]/g, 'a')}@gmail.com`,
      estado: 'activo',
      fechaIngreso: genDate(randomInt(1, 24)),
      foto: genAvatar(nombreCompleto),
      mensualidad: randomFrom([4500, 5000, 5500, 6000, 6500]),
    });
  }
  return alumnos;
}

function generateMensualidades(alumnos: Alumno[]): Mensualidad[] {
  const mensualidades: Mensualidad[] = [];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];
  alumnos.forEach(alumno => {
    meses.forEach((mes, idx) => {
      const estado = idx < 4 ? 'pagado' : idx === 4 ? randomFrom(['pagado', 'pagado', 'pendiente']) : idx === 5 ? randomFrom(['pagado', 'pendiente', 'vencido']) : 'pendiente';
      mensualidades.push({
        id: genId(),
        alumnoId: alumno.id,
        concepto: `Colegiatura ${mes} 2025`,
        monto: alumno.mensualidad,
        fechaLimite: `2025-${String(idx + 1).padStart(2, '0')}-10`,
        estado,
        fechaPago: estado === 'pagado' ? `2025-${String(idx + 1).padStart(2, '0')}-${String(randomInt(1, 10)).padStart(2, '0')}` : undefined,
        montoPagado: estado === 'pagado' ? alumno.mensualidad : estado === 'parcial' ? alumno.mensualidad * 0.5 : 0,
        mes,
      });
    });
  });
  return mensualidades;
}

function generateConversaciones(): Conversacion[] {
  const convos: Conversacion[] = [];
  const chatNames = ['Laura Hernández', 'Carlos García', 'Patricia López', 'Roberto Martínez', 'Ana González', 'Fernando Pérez', 'Claudia Sánchez', 'Miguel Torres'];
  
  chatNames.forEach((name, i) => {
    const msgs: Mensaje[] = [];
    if (i === 0) {
      msgs.push(
        { id: genId(), texto: 'Hola, buenas tardes', tipo: 'recibido', hora: '10:30', fecha: '2025-07-20' },
        { id: genId(), texto: 'Hola 👋 Gracias por comunicarte con Colegio Inteligente. Soy el asistente virtual. ¿En qué puedo ayudarte?', tipo: 'enviado', hora: '10:30', fecha: '2025-07-20' },
        { id: genId(), texto: 'Quiero información para inscribir a mi hijo', tipo: 'recibido', hora: '10:31', fecha: '2025-07-20' },
        { id: genId(), texto: '¡Con gusto! ¿Podrías decirme el nombre de tu hijo y para qué grado busca inscripción?', tipo: 'enviado', hora: '10:31', fecha: '2025-07-20' },
        { id: genId(), texto: 'Se llama Diego, para 3° de primaria', tipo: 'recibido', hora: '10:32', fecha: '2025-07-20' },
        { id: genId(), texto: 'Excelente. Para 3° de Primaria tenemos disponibilidad. La inscripción es de $8,500 y la colegiatura mensual de $5,500. ¿Te gustaría agendar un recorrido para conocer nuestras instalaciones?', tipo: 'enviado', hora: '10:32', fecha: '2025-07-20' },
        { id: genId(), texto: 'Sí, me interesa. ¿Qué días tienen disponibles?', tipo: 'recibido', hora: '10:33', fecha: '2025-07-20' },
        { id: genId(), texto: 'Tenemos disponibilidad de lunes a viernes de 9:00 a 13:00. ¿Qué día te queda mejor?', tipo: 'enviado', hora: '10:33', fecha: '2025-07-20' },
      );
    } else {
      msgs.push(
        { id: genId(), texto: randomFrom(['Hola, buenas tardes', 'Buenos días', 'Hola, ¿me pueden dar información?']), tipo: 'recibido', hora: `${randomInt(8, 17)}:${String(randomInt(0, 59)).padStart(2, '0')}`, fecha: '2025-07-19' },
        { id: genId(), texto: 'Hola 👋 Gracias por comunicarte con Colegio Inteligente. Soy el asistente virtual. ¿En qué puedo ayudarte?', tipo: 'enviado', hora: `${randomInt(8, 17)}:${String(randomInt(0, 59)).padStart(2, '0')}`, fecha: '2025-07-19' },
      );
    }
    convos.push({
      id: genId(),
      nombre: name,
      telefono: `33${randomInt(10000000, 99999999)}`,
      mensajes: msgs,
      ultimoMensaje: msgs[msgs.length - 1].texto.substring(0, 50),
      fechaUltimo: msgs[msgs.length - 1].fecha,
      noLeido: i < 3 ? randomInt(1, 5) : 0,
      foto: genAvatar(name),
    });
  });
  return convos;
}

function generateEventos(): Evento[] {
  const eventos: Evento[] = [];
  const today = new Date();
  for (let i = 0; i < 15; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + randomInt(-7, 14));
    eventos.push({
      id: genId(),
      titulo: randomFrom(['Recorrido - Fam. García', 'Entrevista - Fam. López', 'Llamada seguimiento', 'Recordatorio documentos', 'Recorrido - Fam. Martínez', 'Entrevista admisión']),
      tipo: randomFrom(['recorrido', 'entrevista', 'llamada', 'recordatorio']),
      fecha: d.toISOString().split('T')[0],
      hora: `${randomInt(8, 16)}:${randomFrom(['00', '30'])}`,
      descripcion: 'Cita programada',
      completado: d < today,
    });
  }
  return eventos;
}

// ============================================================
// STORE API
// ============================================================

const KEYS = {
  prospectos: 'ci_prospectos',
  alumnos: 'ci_alumnos',
  mensualidades: 'ci_mensualidades',
  conversaciones: 'ci_conversaciones',
  eventos: 'ci_eventos',
  config: 'ci_config',
  initialized: 'ci_initialized',
};

const defaultConfig: Configuracion = {
  costoInscripcion: 8500,
  costoMensualidad: 5500,
  descuentoProntoPago: 10,
  recargoMora: 5,
  grados,
  grupos: ['A', 'B', 'C'],
  asesores,
};

export function initializeStore(): void {
  if (localStorage.getItem(KEYS.initialized)) return;
  const prospectos = generateProspectos();
  const alumnos = generateAlumnos();
  const mensualidades = generateMensualidades(alumnos);
  const conversaciones = generateConversaciones();
  const eventos = generateEventos();
  
  localStorage.setItem(KEYS.prospectos, JSON.stringify(prospectos));
  localStorage.setItem(KEYS.alumnos, JSON.stringify(alumnos));
  localStorage.setItem(KEYS.mensualidades, JSON.stringify(mensualidades));
  localStorage.setItem(KEYS.conversaciones, JSON.stringify(conversaciones));
  localStorage.setItem(KEYS.eventos, JSON.stringify(eventos));
  localStorage.setItem(KEYS.config, JSON.stringify(defaultConfig));
  localStorage.setItem(KEYS.initialized, 'true');
}

export function getProspectos(): Prospecto[] {
  return JSON.parse(localStorage.getItem(KEYS.prospectos) || '[]');
}
export function setProspectos(data: Prospecto[]): void {
  localStorage.setItem(KEYS.prospectos, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('store-update', { detail: 'prospectos' }));
}
export function addProspecto(p: Prospecto): void {
  const all = getProspectos();
  all.unshift(p);
  setProspectos(all);
}
export function updateProspecto(id: string, updates: Partial<Prospecto>): void {
  const all = getProspectos();
  const idx = all.findIndex(p => p.id === id);
  if (idx !== -1) { all[idx] = { ...all[idx], ...updates }; setProspectos(all); }
}

export function getAlumnos(): Alumno[] {
  return JSON.parse(localStorage.getItem(KEYS.alumnos) || '[]');
}
export function setAlumnos(data: Alumno[]): void {
  localStorage.setItem(KEYS.alumnos, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('store-update', { detail: 'alumnos' }));
}
export function addAlumno(a: Alumno): void {
  const all = getAlumnos();
  all.unshift(a);
  setAlumnos(all);
}

export function getMensualidades(): Mensualidad[] {
  return JSON.parse(localStorage.getItem(KEYS.mensualidades) || '[]');
}
export function setMensualidades(data: Mensualidad[]): void {
  localStorage.setItem(KEYS.mensualidades, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('store-update', { detail: 'mensualidades' }));
}
export function registrarPago(id: string, monto: number): void {
  const all = getMensualidades();
  const idx = all.findIndex(m => m.id === id);
  if (idx !== -1) {
    all[idx].estado = monto >= all[idx].monto ? 'pagado' : 'parcial';
    all[idx].montoPagado = monto;
    all[idx].fechaPago = new Date().toISOString().split('T')[0];
    setMensualidades(all);
  }
}

export function getConversaciones(): Conversacion[] {
  return JSON.parse(localStorage.getItem(KEYS.conversaciones) || '[]');
}
export function setConversaciones(data: Conversacion[]): void {
  localStorage.setItem(KEYS.conversaciones, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('store-update', { detail: 'conversaciones' }));
}

export function getEventos(): Evento[] {
  return JSON.parse(localStorage.getItem(KEYS.eventos) || '[]');
}
export function setEventos(data: Evento[]): void {
  localStorage.setItem(KEYS.eventos, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('store-update', { detail: 'eventos' }));
}
export function addEvento(e: Evento): void {
  const all = getEventos();
  all.push(e);
  setEventos(all);
}

export function getConfig(): Configuracion {
  return JSON.parse(localStorage.getItem(KEYS.config) || JSON.stringify(defaultConfig));
}
export function setConfig(data: Configuracion): void {
  localStorage.setItem(KEYS.config, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('store-update', { detail: 'config' }));
}

// Convertir prospecto a alumno
export function convertirAAlumno(prospectoId: string): void {
  const prospectos = getProspectos();
  const p = prospectos.find(x => x.id === prospectoId);
  if (!p) return;
  
  const config = getConfig();
  const alumno: Alumno = {
    id: genId(),
    prospectoId: p.id,
    nombre: p.nombreHijo || p.nombre,
    matricula: `CI-2025-${String(getAlumnos().length + 1).padStart(4, '0')}`,
    nivel: p.gradoSolicitado.includes('Kinder') || p.gradoSolicitado.includes('Maternal') ? 'Preescolar' : p.gradoSolicitado.includes('Secundaria') ? 'Secundaria' : 'Primaria',
    grado: p.gradoSolicitado,
    grupo: randomFrom(['A', 'B', 'C']),
    tutor: p.padre || p.madre,
    telefono: p.telefono,
    correo: p.correo,
    estado: 'activo',
    fechaIngreso: new Date().toISOString().split('T')[0],
    foto: p.foto,
    mensualidad: config.costoMensualidad,
  };
  addAlumno(alumno);
  
  // Generar mensualidades
  const meses = ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const mensualidades = getMensualidades();
  meses.forEach((mes, idx) => {
    mensualidades.push({
      id: genId(),
      alumnoId: alumno.id,
      concepto: `Colegiatura ${mes} 2025`,
      monto: config.costoMensualidad,
      fechaLimite: `2025-${String(idx + 8).padStart(2, '0')}-10`,
      estado: 'pendiente',
      mes,
    });
  });
  // Inscripción
  mensualidades.push({
    id: genId(),
    alumnoId: alumno.id,
    concepto: 'Inscripción 2025-2026',
    monto: config.costoInscripcion,
    fechaLimite: new Date().toISOString().split('T')[0],
    estado: 'pendiente',
    mes: 'Inscripción',
  });
  setMensualidades(mensualidades);
  
  // Actualizar prospecto
  updateProspecto(prospectoId, { etapa: 'Inscrito', probabilidad: 100 });
}

// Dashboard stats
export function getDashboardStats() {
  const prospectos = getProspectos();
  const alumnos = getAlumnos();
  const mensualidades = getMensualidades();
  
  const nuevos = prospectos.filter(p => p.etapa === 'Nuevo Prospecto').length;
  const visitasAgendadas = prospectos.filter(p => p.etapa === 'Recorrido agendado').length;
  const visitasRealizadas = prospectos.filter(p => p.etapa === 'Recorrido realizado').length;
  const entrevistas = prospectos.filter(p => p.etapa === 'Entrevista').length;
  const documentacion = prospectos.filter(p => p.etapa === 'Documentación').length;
  const inscritos = prospectos.filter(p => p.etapa === 'Inscrito').length;
  const totalProspectos = prospectos.length;
  const conversion = totalProspectos > 0 ? Math.round((inscritos / totalProspectos) * 100) : 0;
  
  const alumnosActivos = alumnos.filter(a => a.estado === 'activo').length;
  const pagadas = mensualidades.filter(m => m.estado === 'pagado');
  const pendientes = mensualidades.filter(m => m.estado === 'pendiente' || m.estado === 'vencido');
  const vencidas = mensualidades.filter(m => m.estado === 'vencido');
  
  const ingresosCobrados = pagadas.reduce((sum, m) => sum + (m.montoPagado || m.monto), 0);
  const ingresosEsperados = mensualidades.reduce((sum, m) => sum + m.monto, 0);
  const adeudos = pendientes.reduce((sum, m) => sum + m.monto, 0);
  
  return {
    totalProspectos, nuevos, visitasAgendadas, visitasRealizadas,
    entrevistas, documentacion, inscritos, conversion,
    alumnosActivos, mensualidadesCobradas: pagadas.length,
    mensualidadesPendientes: pendientes.length, vencidas: vencidas.length,
    ingresosCobrados, ingresosEsperados, adeudos,
  };
}

export function getChartData() {
  const prospectos = getProspectos();
  const mensualidades = getMensualidades();
  
  // Prospectos por fuente
  const fuentesCount: Record<string, number> = {};
  prospectos.forEach(p => { fuentesCount[p.fuenteContacto] = (fuentesCount[p.fuenteContacto] || 0) + 1; });
  
  // Prospectos por etapa (embudo)
  const etapasCount: Record<string, number> = {};
  etapas.forEach(e => { etapasCount[e] = prospectos.filter(p => p.etapa === e).length; });
  
  // Ingresos por mes
  const ingresosMes: Record<string, number> = {};
  mensualidades.filter(m => m.estado === 'pagado').forEach(m => {
    ingresosMes[m.mes] = (ingresosMes[m.mes] || 0) + (m.montoPagado || m.monto);
  });
  
  // Inscripciones por grado
  const gradosCount: Record<string, number> = {};
  prospectos.filter(p => p.etapa === 'Inscrito').forEach(p => {
    gradosCount[p.gradoSolicitado] = (gradosCount[p.gradoSolicitado] || 0) + 1;
  });
  
  return { fuentesCount, etapasCount, ingresosMes, gradosCount };
}

// Reset store
export function resetStore(): void {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  initializeStore();
  window.dispatchEvent(new CustomEvent('store-update', { detail: 'reset' }));
}