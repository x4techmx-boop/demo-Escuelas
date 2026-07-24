import { useState, useEffect, useRef } from 'react';
import {
  Search, Phone, Video, MoreVertical, Paperclip, Mic, Send,
  Smile, Image, Check, CheckCheck, ArrowLeft, Bot
} from 'lucide-react';
import { getConversaciones, setConversaciones, addProspecto, type Conversacion, type Mensaje } from '@/lib/store';

// IA Response Logic
function getIAResponse(mensajes: Mensaje[], input: string): string {
  const lower = input.toLowerCase();
  const msgCount = mensajes.filter(m => m.tipo === 'recibido').length;

  // Greeting
  if (msgCount <= 1 || lower.includes('hola') || lower.includes('buenas') || lower.includes('buenos')) {
    return 'Hola 👋 Gracias por comunicarte con Colegio Inteligente. Soy el asistente virtual. ¿En qué puedo ayudarte?';
  }
  // Name question
  if (lower.includes('inscri') || lower.includes('información') || lower.includes('info')) {
    return '¡Con gusto te ayudo! ¿Podrías decirme el nombre de tu hijo(a) y para qué grado busca inscripción?';
  }
  // Grade/age
  if (lower.includes('primaria') || lower.includes('kinder') || lower.includes('secundaria') || lower.includes('grado')) {
    return 'Excelente. Tenemos disponibilidad en ese nivel. La inscripción es de $8,500 y la colegiatura mensual de $5,500. ¿Te gustaría conocer más detalles o agendar un recorrido?';
  }
  // Costs
  if (lower.includes('costo') || lower.includes('precio') || lower.includes('cuánto') || lower.includes('cuanto') || lower.includes('mensualidad')) {
    return '📋 Nuestros costos para el ciclo 2025-2026:\n\n• Inscripción: $8,500\n• Colegiatura mensual: $5,500\n• Material: $2,800 (pago único)\n\nContamos con descuento del 10% por pronto pago y planes de beca. ¿Deseas más información?';
  }
  // Schedule
  if (lower.includes('horario') || lower.includes('hora') || lower.includes('turno')) {
    return '🕐 Nuestros horarios:\n\n• Preescolar: 8:00 - 13:30\n• Primaria: 7:30 - 14:30\n• Secundaria: 7:00 - 14:45\n\nOfrecemos horario extendido hasta las 18:00 con costo adicional. ¿Te interesa?';
  }
  // Sports
  if (lower.includes('deporte') || lower.includes('futbol') || lower.includes('natación') || lower.includes('actividad')) {
    return '⚽ Actividades extraescolares:\n\n• Fútbol\n• Natación\n• Taekwondo\n• Ballet\n• Robótica\n• Música\n\nTodas incluidas en la colegiatura. ¿Alguna en particular te interesa?';
  }
  // English
  if (lower.includes('inglés') || lower.includes('ingles') || lower.includes('bilingüe') || lower.includes('idioma')) {
    return '🌎 Somos un colegio bilingüe certificado:\n\n• 50% de clases en inglés\n• Certificación Cambridge\n• Profesores nativos\n• Intercambios culturales\n\n¿Te gustaría agendar un recorrido para conocer nuestro programa?';
  }
  // Tour
  if (lower.includes('recorrido') || lower.includes('visita') || lower.includes('conocer') || lower.includes('agendar') || lower.includes('sí') || lower.includes('si')) {
    return '📅 ¡Perfecto! Tenemos disponibilidad para recorridos:\n\n• Lunes a Viernes: 9:00 - 13:00\n• Sábados: 10:00 - 12:00\n\n¿Qué día y horario te queda mejor? Te confirmo de inmediato.';
  }
  // Day selection
  if (lower.includes('lunes') || lower.includes('martes') || lower.includes('miércoles') || lower.includes('jueves') || lower.includes('viernes') || lower.includes('sábado')) {
    return '✅ ¡Listo! Tu recorrido ha sido agendado. Te esperamos con gusto.\n\n📍 Dirección: Av. Patria #1234, Col. Jardines del Country\n\nTe enviaremos un recordatorio un día antes. ¿Hay algo más en lo que pueda ayudarte?';
  }
  // Scholarship
  if (lower.includes('beca') || lower.includes('descuento') || lower.includes('apoyo')) {
    return '🎓 Contamos con programas de becas:\n\n• Beca académica: 15-30%\n• Beca deportiva: 10-25%\n• Descuento por hermanos: 10%\n• Pronto pago: 10%\n\nLos requisitos se evalúan durante la entrevista. ¿Te gustaría agendar una?';
  }
  // Thanks
  if (lower.includes('gracias') || lower.includes('perfecto') || lower.includes('excelente')) {
    return '¡Con mucho gusto! 😊 Estamos para servirte. Si tienes alguna otra pregunta, no dudes en escribirnos. ¡Te esperamos en Colegio Inteligente! 🎓';
  }
  // Default
  return '¡Gracias por tu mensaje! Un asesor se pondrá en contacto contigo en breve. Mientras tanto, ¿te gustaría agendar un recorrido para conocer nuestras instalaciones? 🏫';
}

export default function WhatsApp() {
  const [conversaciones, setLocalConvos] = useState<Conversacion[]>(getConversaciones());
  const [selectedConvo, setSelectedConvo] = useState<Conversacion | null>(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [typing, setTyping] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConvo?.mensajes]);

  const sendMessage = () => {
    if (!message.trim() || !selectedConvo) return;
    const newMsg: Mensaje = {
      id: Math.random().toString(36).substr(2, 9),
      texto: message,
      tipo: 'recibido',
      hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      fecha: new Date().toISOString().split('T')[0],
    };

    const updatedConvo = { ...selectedConvo, mensajes: [...selectedConvo.mensajes, newMsg], ultimoMensaje: message, fechaUltimo: newMsg.fecha };
    const updatedConvos = conversaciones.map(c => c.id === selectedConvo.id ? updatedConvo : c);
    setLocalConvos(updatedConvos);
    setSelectedConvo(updatedConvo);
    setConversaciones(updatedConvos);
    setMessage('');

    // IA Response
    setTyping(true);
    setTimeout(() => {
      const response = getIAResponse(updatedConvo.mensajes, message);
      const iaMsg: Mensaje = {
        id: Math.random().toString(36).substr(2, 9),
        texto: response,
        tipo: 'enviado',
        hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        fecha: new Date().toISOString().split('T')[0],
      };
      const finalConvo = { ...updatedConvo, mensajes: [...updatedConvo.mensajes, iaMsg], ultimoMensaje: response.substring(0, 50) };
      const finalConvos = updatedConvos.map(c => c.id === selectedConvo.id ? finalConvo : c);
      setLocalConvos(finalConvos);
      setSelectedConvo(finalConvo);
      setConversaciones(finalConvos);
      setTyping(false);

      // Auto-create prospecto if enough info gathered
      if (updatedConvo.mensajes.length >= 6 && !selectedConvo.prospectoId) {
        addProspecto({
          id: Math.random().toString(36).substr(2, 9),
          nombre: selectedConvo.nombre,
          nombreHijo: '',
          edad: 8,
          fechaNacimiento: '',
          gradoSolicitado: '3° Primaria',
          escuelaAnterior: '',
          padre: selectedConvo.nombre,
          madre: '',
          telefono: selectedConvo.telefono,
          correo: '',
          direccion: '',
          ciudad: 'Guadalajara',
          fuenteContacto: 'WhatsApp',
          comentarios: 'Prospecto creado automáticamente desde WhatsApp IA',
          etapa: 'Contacto realizado',
          prioridad: 'media',
          asesor: 'Lic. María González',
          probabilidad: 20,
          fechaCreacion: new Date().toISOString().split('T')[0],
          ultimoContacto: new Date().toISOString().split('T')[0],
          notas: ['Contacto inicial por WhatsApp', 'Bot IA atendió la conversación'],
          etiquetas: ['WhatsApp'],
          foto: selectedConvo.foto,
        });
      }
    }, randomInt(1500, 3000));
  };

  const filteredConvos = search ? conversaciones.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase())) : conversaciones;

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-card border border-border rounded-xl overflow-hidden">
      {/* Conversations List */}
      <div className={`w-full md:w-80 border-r border-border flex flex-col ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Chats</h2>
            <div className="flex items-center gap-1">
              <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <Bot className="w-3 h-3" /> IA Activa
              </span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar conversación..." className="w-full pl-9 pr-4 py-2 bg-muted rounded-lg text-sm outline-none" />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConvos.map(convo => (
            <button
              key={convo.id}
              onClick={() => { setSelectedConvo(convo); setMobileView('chat'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer border-b border-border/50
                ${selectedConvo?.id === convo.id ? 'bg-muted/70' : ''}`}
            >
              <div className="relative">
                <img src={convo.foto} alt="" className="w-12 h-12 rounded-full" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{convo.nombre}</p>
                  <span className="text-[10px] text-muted-foreground">{convo.fechaUltimo}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-muted-foreground truncate pr-2">{convo.ultimoMensaje}</p>
                  {convo.noLeido > 0 && (
                    <span className="w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">{convo.noLeido}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        {selectedConvo ? (
          <>
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-border flex items-center gap-3">
              <button onClick={() => setMobileView('list')} className="md:hidden p-1 cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
              <img src={selectedConvo.foto} alt="" className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <p className="font-medium text-sm">{selectedConvo.nombre}</p>
                <p className="text-xs text-emerald-500">{typing ? 'La IA está escribiendo...' : 'en línea'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-muted rounded-lg cursor-pointer"><Phone className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-muted rounded-lg cursor-pointer"><Video className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-muted rounded-lg cursor-pointer"><MoreVertical className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
              {selectedConvo.mensajes.map(msg => (
                <div key={msg.id} className={`flex ${msg.tipo === 'enviado' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm whitespace-pre-line ${
                    msg.tipo === 'enviado'
                      ? 'bg-emerald-600 text-white rounded-br-sm'
                      : 'bg-card border border-border rounded-bl-sm shadow-sm'
                  }`}>
                    <p>{msg.texto}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${msg.tipo === 'enviado' ? 'text-emerald-200' : 'text-muted-foreground'}`}>
                      <span className="text-[10px]">{msg.hora}</span>
                      {msg.tipo === 'enviado' && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-end">
                  <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl rounded-br-sm text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded-lg cursor-pointer"><Smile className="w-5 h-5 text-muted-foreground" /></button>
              <button className="p-2 hover:bg-muted rounded-lg cursor-pointer"><Paperclip className="w-5 h-5 text-muted-foreground" /></button>
              <button className="p-2 hover:bg-muted rounded-lg cursor-pointer"><Image className="w-5 h-5 text-muted-foreground" /></button>
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe un mensaje como padre de familia..."
                className="flex-1 px-4 py-2.5 bg-muted rounded-xl text-sm outline-none"
              />
              {message ? (
                <button onClick={sendMessage} className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 cursor-pointer"><Send className="w-4 h-4" /></button>
              ) : (
                <button className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 cursor-pointer"><Mic className="w-4 h-4" /></button>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">WhatsApp IA</h3>
              <p className="text-muted-foreground text-sm mt-1">Selecciona una conversación para comenzar</p>
              <p className="text-xs text-muted-foreground mt-3 max-w-xs mx-auto">
                El bot de IA responde automáticamente, califica prospectos y agenda recorridos
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function MessageCircle(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
    </svg>
  );
}