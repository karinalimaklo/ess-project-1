import React from 'react';

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

const DeletedPage = () => {
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1>Conta Desativada</h1>
        <p>Esta conta foi desativada permanentemente por violação dos nossos termos de serviço.</p>
        <p>O acesso ao site foi revogado.</p>
      </div>
    </div>
  );
};

export default DeletedPage;
