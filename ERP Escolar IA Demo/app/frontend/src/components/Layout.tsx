import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, MessageCircle, Calendar, Megaphone,
  GraduationCap, CreditCard, DollarSign, BarChart3, Zap,
  UserCircle, Settings, Search, Bell, Moon, Sun, Menu, X,
  LogOut, ChevronDown, Bot
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'CRM Admisiones', path: '/crm' },
  { icon: MessageCircle, label: 'WhatsApp IA', path: '/whatsapp' },
  { icon: Bot, label: 'Asistente IA', path: '/asistente' },
  { icon: Calendar, label: 'Agenda', path: '/agenda' },
  { icon: Megaphone, label: 'Marketing', path: '/marketing' },
  { icon: GraduationCap, label: 'Alumnos', path: '/alumnos' },
  { icon: CreditCard, label: 'Mensualidades', path: '/mensualidades' },
  { icon: DollarSign, label: 'Finanzas', path: '/finanzas' },
  { icon: BarChart3, label: 'Reportes', path: '/reportes' },
  { icon: Zap, label: 'Automatizaciones', path: '/automatizaciones' },
  { icon: UserCircle, label: 'Portal Padres', path: '/portal-padres' },
  { icon: Settings, label: 'Configuración', path: '/configuracion' },
];

export default function Layout({ children }: LayoutProps) {
  const [dark, setDark] = useState(() => localStorage.getItem('ci_theme') === 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, text: 'Nuevo prospecto: Laura Hernández', time: 'Hace 5 min' },
    { id: 2, text: 'Recorrido agendado para mañana 10:00', time: 'Hace 15 min' },
    { id: 3, text: 'Pago recibido: $5,500 - Fam. García', time: 'Hace 1 hora' },
  ]);
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('ci_theme', dark ? 'dark' : 'light');
  }, [dark]);

  const filteredNav = searchQuery
    ? navItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : navItems;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Desktop */}
      <aside className={`hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-[72px]'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in">
              <h1 className="text-sm font-bold text-foreground leading-tight">Colegio</h1>
              <p className="text-xs text-primary font-semibold leading-tight">Inteligente</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group
                  ${active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
                {active && sidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-border p-3">
          <div className={`flex items-center gap-3 ${!sidebarOpen ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">AD</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin</p>
                <p className="text-xs text-muted-foreground truncate">admin@colegio.mx</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r border-border animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between px-4 h-16 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-sm font-bold">Colegio</h1>
                  <p className="text-xs text-primary font-semibold">Inteligente</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-muted rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
              {navItems.map(item => {
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer
                      ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 hover:bg-muted rounded-lg cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex p-2 hover:bg-muted rounded-lg cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                className="pl-9 pr-4 py-2 w-64 bg-muted rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              {searchOpen && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-scale-in">
                  {filteredNav.map(item => (
                    <button
                      key={item.path}
                      onMouseDown={() => { navigate(item.path); setSearchQuery(''); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-sm cursor-pointer"
                    >
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="p-2 hover:bg-muted rounded-lg relative cursor-pointer">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-card" />
              </button>
              {showNotif && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 animate-scale-in">
                  <div className="px-4 py-3 border-b border-border">
                    <h4 className="font-semibold text-sm">Notificaciones</h4>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="px-4 py-3 hover:bg-muted border-b border-border/50 cursor-pointer">
                        <p className="text-sm">{n.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button onClick={() => setDark(!dark)} className="p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors">
              {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-border ml-1">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">AD</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium leading-tight">Administrador</p>
                <p className="text-xs text-muted-foreground leading-tight">Director</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </div>

            {/* Logout */}
            <button onClick={() => navigate('/')} className="p-2 hover:bg-muted rounded-lg cursor-pointer" title="Cerrar sesión">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}