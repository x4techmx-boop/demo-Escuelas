import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Login from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import CRM from "@/pages/CRM";
import WhatsApp from "@/pages/WhatsApp";
import AlumnosPage from "@/pages/Alumnos";
import {
  AgendaPage,
  MarketingPage,
  FinanzasPage,
  ReportesPage,
  AutomatizacionesPage,
  PortalPadresPage,
  ConfiguracionPage,
  AsistenteIAPage,
  MensualidadesPage,
} from "@/pages/Modules";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const logged = localStorage.getItem("ci_logged");
  if (!logged) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
        <Route path="/whatsapp" element={<ProtectedRoute><WhatsApp /></ProtectedRoute>} />
        <Route path="/asistente" element={<ProtectedRoute><AsistenteIAPage /></ProtectedRoute>} />
        <Route path="/agenda" element={<ProtectedRoute><AgendaPage /></ProtectedRoute>} />
        <Route path="/marketing" element={<ProtectedRoute><MarketingPage /></ProtectedRoute>} />
        <Route path="/alumnos" element={<ProtectedRoute><AlumnosPage /></ProtectedRoute>} />
        <Route path="/mensualidades" element={<ProtectedRoute><MensualidadesPage /></ProtectedRoute>} />
        <Route path="/finanzas" element={<ProtectedRoute><FinanzasPage /></ProtectedRoute>} />
        <Route path="/reportes" element={<ProtectedRoute><ReportesPage /></ProtectedRoute>} />
        <Route path="/automatizaciones" element={<ProtectedRoute><AutomatizacionesPage /></ProtectedRoute>} />
        <Route path="/portal-padres" element={<ProtectedRoute><PortalPadresPage /></ProtectedRoute>} />
        <Route path="/configuracion" element={<ProtectedRoute><ConfiguracionPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;