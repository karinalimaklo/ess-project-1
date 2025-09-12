import axios from 'axios';

const BASE_URL = 'http://localhost:4000';
const MUSICS_API_URL = `${BASE_URL}/musics`;

export const deleteMusicById = async (musicId) => {
  try {
    // Tentamos fazer a requisição DELETE.
    const res = await axios.delete(`${MUSICS_API_URL}/${musicId}`);
    
    // É uma boa prática que um DELETE bem-sucedido retorne status 204 (No Content)
    // ou 200 (OK) com uma mensagem. Retornamos os dados se existirem.
    return res.data;

  } catch (error) {
    // Se a requisição falhar (status code não for 2xx), o axios lança um erro.
    // Nós o capturamos aqui.
    console.error("Erro na API ao deletar música:", error);

    // A mensagem de erro específica do seu backend geralmente está em 'error.response.data.message'.
    // Verificamos se essa estrutura existe para evitar erros.
    if (error.response && error.response.data && error.response.data.message) {
      // Lançamos um NOVO erro, mas desta vez com a mensagem clara do backend.
      throw new Error(error.response.data.message);
    }

    // Se não houver uma mensagem específica, lançamos um erro genérico.
    throw new Error('Ocorreu um erro na comunicação com o servidor ao tentar deletar a música.');
  }
};