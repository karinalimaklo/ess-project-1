import React from 'react';
import currentUser from '../currentUser';

const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
  backgroundColor: '#f8f9fa',
  color: '#343a40',
  padding: '20px',
};

const cardStyle = {
  background: 'white',
  padding: '40px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
};

const SuspendedPage = () => {
  const suspendedUntil = currentUser.suspendedUntil 
    ? new Date(currentUser.suspendedUntil).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : 'uma data futura';

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1>Sua Conta está Suspensa</h1>
        <p>O acesso às funcionalidades do site foi temporariamente removido.</p>
        <p>Sua conta será reativada em: <strong>{suspendedUntil}</strong>.</p>
        <p>Por favor, consulte seu email para mais detalhes sobre o motivo da suspensão.</p>
      </div>
    </div>
  );
};

export default SuspendedPage;
