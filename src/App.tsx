import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Agendar, { type BookingFormData } from './components/agendar';
import Cadastro from './components/Cadastro';
import LoginPage, { type User } from './components/Login';
import Reset from './components/ResetPassword';
import './styles/agendar.css';
import './styles/Login.css';
import './styles/Cadastro.css';
import './styles/ResetPassword.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/agendar" replace />
            ) : (
              <LoginPage onLoginSuccess={setUser} />
            )
          }
        />
        <Route
          path="/agendar"
          element={
            user ? (
              <Agendar
                serviceName="Serviço Exemplo"
                onClose={() => console.log('Fechar Agendar')}
                onSubmit={(data: BookingFormData) => console.log('Agendado:', data)}
                bookings={[]}
                whatsappNumber="5511999999999"
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/cadastro" element={<Cadastro />} />

    
        <Route path="/reset-password/:token" element={<Reset />} />

        <Route path="*" element={<Navigate to={user ? "/agendar" : "/login"} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
