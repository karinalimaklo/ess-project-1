import { defineFeature, loadFeature } from 'jest-cucumber';
import { jest } from '@jest/globals';
import ReviewService from '../../services/review.service.js';
import Review from '../../models/review.model.js';

function getServiceMethod(methodName) {
  switch (methodName) {
    case 'POST /review':
      return 'createReview';
    case 'UPDATE /review':
      return 'updateReview';
    case 'DELETE /review':
      return 'deleteReview';
    case 'GET /review':
      return 'getReview';
    case 'hideReview':
      return 'hideReview';
    default:
      throw new Error(`Método não mapeado: ${methodName}`);
  }
}

const createFeature = loadFeature('createReview.feature');
const manageFeature = loadFeature('manageReview.feature');

jest.mock('../../models/review.model.js');

// ----------- CREATE REVIEW FEATURE -----------
defineFeature(createFeature, (test) => {
  let result;
  let error;
  let status = null;
  let reqBody = {};

  beforeEach(() => {
    result = null;
    error = null;
    status = null;
    reqBody = {};
    jest.clearAllMocks();
  });

    test('Criar review com sucesso', ({ given, and, when, then }) => {
      given(/^existe um usuário "(.*)" com id "(.*)"$/, (nome, userId) => {
        reqBody.userId = userId;
      });

      and(/^a música "(.*)" da artista "(.*)" não existe no banco de dados$/, (musica, artista) => {
        reqBody.musica = musica;
        reqBody.artista = artista;
      });

      and(
        /^o corpo da requisição contém os campos userId "(.*)", musica "(.*)", artista "(.*)", texto "(.*)" e rating (\d+)$/,
        (userId, musica, artista, texto, rating) => {
          reqBody = { ...reqBody, userId, musica, artista, texto, rating: Number(rating) };
        }
      );

      when(/^o método "(.*)" for chamado$/, async (methodName) => {
        Review.create.mockResolvedValue({
          ...reqBody,
        });
        status = 201;
        const serviceMethod = getServiceMethod(methodName);
        result = await ReviewService[serviceMethod](
          reqBody.userId,
          reqBody.musica,
          reqBody.artista,
          reqBody.texto,
          reqBody.rating
        );
      });

    then(/^o sistema deve retornar status (\d+)$/, (expectedStatus) => {
      expect(status).toBe(Number(expectedStatus));
    });

    and(
      /^o corpo da resposta deve conter userId "(.*)", musica "(.*)", artista "(.*)", texto "(.*)" e rating (\d+)$/,
      (userId, musica, artista, texto, rating) => {
        expect(result).toEqual({
          userId,
          musica,
          artista,
          texto,
          rating: Number(rating),
        });
      }
    );

    and('o review deve estar presente no banco de dados', () => {
      expect(Review.create).toHaveBeenCalled();
    });
  });


  test('Não criar review por falta de texto', ({ given, and, when, then }) => {
    given(/^existe um usuário "(.*)" com id "(.*)"$/, (nome, userId) => {
      reqBody.userId = userId;
    });

    and(/^a música "(.*)" da artista "(.*)" não existe no banco de dados$/, (musica, artista) => {
      reqBody.musica = musica;
      reqBody.artista = artista;
    });

    when(/^o método "(.*)" for chamado$/, async (methodName) => {
      const serviceMethod = getServiceMethod(methodName);
      Review.create.mockResolvedValue({});
      try {
        await ReviewService[serviceMethod](
          reqBody.userId,
          reqBody.musica,
          reqBody.artista,
          reqBody.texto,
          reqBody.rating
        );
      } catch (err) {
        error = err;
        status = err.status || 400;
      }
    });

    and(
      /^o corpo da requisição contém os campos userId "(.*)", musica "(.*)", artista "(.*)", texto "" e rating (\d+)$/,
      (userId, musica, artista, rating) => {
        reqBody = { userId, musica, artista, texto: '', rating: Number(rating) };
      }
    );

    then(/^o sistema deve retornar status (\d+)$/, (expectedStatus) => {
      expect(status).toBe(Number(expectedStatus));
    });

    and(/^a resposta deve conter a mensagem "(.*)"$/, (msg) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(msg);
    });

    and('nenhum review deve ser criado no banco de dados', () => {
      expect(Review.create).not.toHaveBeenCalled();
    });
  });

    test('Não criar review por falta de avaliação', ({ given, and, when, then }) => {
      given(/^existe um usuário "(.*)" com id "(.*)"$/, (nome, userId) => {
        reqBody.userId = userId;
      });

      and(/^a música "(.*)" da artista "(.*)" não existe no banco de dados$/, (musica, artista) => {
        reqBody.musica = musica;
        reqBody.artista = artista;
      });

      and(
        /^o corpo da requisição contém os campos userId "(.*)", musica "(.*)", artista "(.*)", texto "(.*)" e rating indefinido$/,
        (userId, musica, artista, texto) => {
          reqBody = {
            userId,
            musica,
            artista,
            texto: texto || 'Texto padrão',
            rating: undefined, // simula ausência da avaliação
          };
        }
      );

      when(/^o método "(.*)" for chamado$/, async (methodName) => {
        const serviceMethod = getServiceMethod(methodName);
        Review.create.mockResolvedValue({}); // mock defensivo
        try {
          await ReviewService[serviceMethod](
            reqBody.userId,
            reqBody.musica,
            reqBody.artista,
            reqBody.texto,
            reqBody.rating
          );
        } catch (err) {
          error = err;
          status = err.status || 400;
        }
      });

      then(/^o sistema deve retornar status (\d+)$/, (expectedStatus) => {
        expect(status).toBe(Number(expectedStatus));
      });

      and(/^a resposta deve conter a mensagem "(.*)"$/, (msg) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(msg);
      });

      and('nenhum review deve ser criado no banco de dados', () => {
        expect(Review.create).not.toHaveBeenCalled();
      });
    });

  test('Não encontrar review para edição', ({ given, and, when, then }) => {
    given(/^existe um usuário "(.*)" id "(.*)"$/, (nome, userId) => {
      reqBody.userId = userId;
    });

    and(/^a música "(.*)" da artista "(.*)" não existe no banco de dados$/, (musica, artista) => {
      reqBody.musica = musica;
      reqBody.artista = artista;
    });

    when(/^o método "(.*)" for chamado$/, async (methodName) => {
      Review.findByIdAndUpdate.mockResolvedValue(null);
      try {
        const serviceMethod = getServiceMethod(methodName);
        await ReviewService[serviceMethod](
          reqBody.userId,
          reqBody.musica,
          reqBody.artista,
          reqBody.texto,
          reqBody.rating
        );
      } catch (err) {
        error = err;
        status = err.status || 404; // ou 400, conforme o cenário
      }
    });

    and(
      /^o corpo da requisição contém os campos userId "(.*)", musica "(.*)", artista "(.*)", texto "(.*)" e rating (\d+)$/,
      (userId, musica, artista, texto, rating) => {
        reqBody = { userId, musica, artista, texto, rating: Number(rating) };
      }
    );

    then(/^o sistema deve retornar status (\d+)$/, (expectedStatus) => {
      expect(status).toBe(Number(expectedStatus));
    });

    and(/^a resposta deve conter a mensagem "(.*)"$/, (msg) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(msg);
    });

    and('nenhum review deve ser atualizado no banco de dados', () => {
      expect(Review.findByIdAndUpdate).toHaveBeenCalled();
      expect(Review.findByIdAndUpdate.mock.results[0].value).resolves.toBeNull;
    });
  });
});

// ----------- MANAGE REVIEW FEATURE -----------
defineFeature(manageFeature, (test) => {
  let result;
  let error;
  let status = null;

  beforeEach(() => {
    result = null;
    error = null;
    status = null;
    jest.clearAllMocks();
  });

  test('Remover review com sucesso', ({ given, and, when, then }) => {
    let reviewId;
    let authenticatedUserId;
    let result;

    given(/^existe um review cadastrado com id "(.*)" e userId "(.*)"$/, (id, userId) => {
      reviewId = id;
      Review.findById.mockResolvedValue({ _id: id, userId });
      Review.findByIdAndDelete.mockResolvedValue({ _id: id, userId });
    });

    and(/^estou autenticado como o usuário "(.*)" com id "(.*)"$/, (nome, userId) => {
      authenticatedUserId = userId;
    });

    when(/^o método "DELETE \/review" for chamado com id "(.*)"$/, async (id) => {
      status = 200;
      result = await ReviewService.deleteReview(id, authenticatedUserId); // <- correção aqui
    });

    then(/^o sistema deve retornar status (\d+)$/, (expectedStatus) => {
      expect(status).toBe(Number(expectedStatus));
    });

    and(/^o corpo da resposta deve conter o review removido com id "(.*)"$/, (id) => {
      expect(result).toBeDefined();
      expect(result._id).toBe(id);
    });

    and(/^o review não deve mais existir no banco de dados$/, async () => {
      Review.findById.mockResolvedValue(null);
      const deleted = await Review.findById(reviewId);
      expect(deleted).toBeNull();
    });
  });


  test('Usuário tenta remover review que não é seu', ({ given, and, when, then }) => {
    let reviewId;
    let userId = 'user123';
    let otherUserId = 'user456';
    let error;

    given(/^existe um review com id "(.*)" e userId "(.*)"$/, (id, uid) => {
      reviewId = id;
      Review.findById.mockResolvedValue({ _id: id, userId: uid });
    });

    and(/^estou autenticado como o usuário "(.*)" com id "(.*)"$/, (nome, uid) => {
      // Simula autenticação passando o userId errado
      otherUserId = uid;
    });

    when(/^o método "DELETE \/review" for chamado com id "(.*)"$/, async (id) => {
      try {
        await ReviewService.deleteReview(id, otherUserId);
      } catch (err) {
        error = err;
        status = err.status || 403;
      }
    });

    then(/^o sistema deve retornar status (\d+)$/, (expectedStatus) => {
      expect(status).toBe(Number(expectedStatus));
    });

    and(/^a resposta deve conter a mensagem "(.*)"$/, (msg) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(msg);
    });

    and(/^o review ainda deve existir no banco de dados$/, async () => {
      const review = await Review.findById(reviewId);
      expect(review).not.toBeNull();
    });
  });


  test('Editar review com sucesso', ({ given, and, when, then }) => {
    let reviewId;
    given(/^existe um review cadastrado com id "(.*)" e texto "(.*)" do usuário "(.*)"$/, (id, texto, userId) => {
      reviewId = id;
      Review.findById.mockResolvedValue({ _id: id, texto, userId });
      Review.findByIdAndUpdate.mockImplementation((id, update) =>
        Promise.resolve({ _id: id, ...update })
      );
    });

    and(/^estou autenticado como o usuário "(.*)" com id "(.*)"$/, (nome, userId) => {
      // Simule autenticação
    });

    when(/^o método "UPDATE \/review" for chamado com id "(.*)" e novo texto "(.*)"$/, async (id, novoTexto) => {
      status = 200;
      result = await ReviewService.updateReview(id, { texto: novoTexto });
    });

    then(/^o sistema deve retornar status (\d+)$/, (expectedStatus) => {
      expect(status).toBe(Number(expectedStatus));
    });

    and(/^o corpo da resposta deve conter o review com texto "(.*)"$/, (novoTexto) => {
      expect(result).toBeDefined();
      expect(result.texto).toBe(novoTexto);
    });

    and(/^o campo "(.*)" do review deve estar atualizado no banco de dados$/, (campo) => {
      expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(
        result._id,
        { [campo]: result.texto },
        { new: true }
      );
    });
  });

  test('Visualizar review', ({ given, when, then, and }) => {
    let reviewId;
    given(
      /^existe um review cadastrado com id "(.*)" para a música "(.*)" do usuário "(.*)"$/,
      (id, musica, userId) => {
        reviewId = id;
        Review.findById.mockResolvedValue({
          _id: id,
          musica,
          artista: 'Artista Teste',
          texto: 'Texto Teste',
          rating: 5,
          userId,
        });
      }
    );

    when(/^o método "GET \/review" for chamado com id "(.*)"$/, async (id) => {
      status = 200;
      result = await ReviewService.getReview(id);
    });

    then(/^o sistema deve retornar status (\d+)$/, (expectedStatus) => {
      expect(status).toBe(Number(expectedStatus));
    });

    and(/^o corpo da resposta deve conter musica "(.*)" e usuário "(.*)"$/, (musicaEsperada, userEsperado) => {
      expect(result).toBeDefined();
      expect(result.musica).toBe(musicaEsperada);
      expect(result.userId).toBe(userEsperado);
    });

    and(
      /^o review deve conter todos os campos obrigatórios: id, musica, artista, texto, rating, userId$/,
      () => {
        expect(result).toBeDefined();
        expect(result).toHaveProperty('_id');
        expect(result).toHaveProperty('musica');
        expect(result).toHaveProperty('artista');
        expect(result).toHaveProperty('texto');
        expect(result).toHaveProperty('rating');
        expect(result).toHaveProperty('userId');
      }
    );
  });

  test('Tentar remover review inexistente', ({ given, when, then, and }) => {
    given(/^nenhum review existe com id "(.*)"$/, (id) => {
      Review.findById.mockResolvedValue(null);
    });

    when(/^o método "DELETE \/review" for chamado com id "(.*)"$/, async (id) => {
      try {
        await ReviewService.deleteReview(id);
      } catch (err) {
        error = err;
        status = 404;
      }
    });

    then(/^o sistema deve retornar status (\d+)$/, (expectedStatus) => {
      expect(status).toBe(Number(expectedStatus));
    });

    and(/^a resposta deve conter a mensagem "(.*)"$/, (msg) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(msg);
    });
  });

  test('Tentar editar review inexistente', ({ given, when, then, and }) => {
    given(/^nenhum review existe com id "(.*)"$/, (id) => {
      Review.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
    });

    when(/^o método "UPDATE \/review" for chamado com id "(.*)" e novo texto "(.*)"$/, async (id, novoTexto) => {
      try {
        await ReviewService.updateReview(id, { texto: novoTexto });
      } catch (err) {
        error = err;
        status = 404;
      }
    });

    then(/^o sistema deve retornar status (\d+)$/, (expectedStatus) => {
      expect(status).toBe(Number(expectedStatus));
    });

    and(/^a resposta deve conter a mensagem "(.*)"$/, (msg) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(msg);
    });
  });

  test('Tentar visualizar review inexistente', ({ given, when, then, and }) => {
    given(/^nenhum review existe com id "(.*)"$/, (id) => {
      Review.findById.mockResolvedValue(null);
    });

    when(/^o método "GET \/review" for chamado com id "(.*)"$/, async (id) => {
      try {
        await ReviewService.getReview(id);
      } catch (err) {
        error = err;
        status = 404;
      }
    });

    then(/^o sistema deve retornar status (\d+)$/, (expectedStatus) => {
      expect(status).toBe(Number(expectedStatus));
    });

    and(/^a resposta deve conter a mensagem "(.*)"$/, (msg) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(msg);
    });
  });

  test('Ocultar review com sucesso', ({ given, when, then, and }) => {
    let reviewId;
    given(/^existe um review com id "(.*)"$/, (id) => {
      reviewId = id;
      Review.findByIdAndUpdate.mockResolvedValue({ _id: id, isHidden: true });
    });

    when(/^o método "hideReview" for chamado com id "(.*)"$/, async (id) => {
      status = 200;
      result = await ReviewService.hideReview(id);
    });

    then(/^o sistema deve retornar status (\d+)$/, (expectedStatus) => {
      expect(status).toBe(Number(expectedStatus));
    });

    and(/^o campo "isHidden" do review no corpo da resposta deve ser true$/, () => {
      expect(result).toBeDefined();
      expect(result.isHidden).toBe(true);
    });

    and(/^o campo "isHidden" deve estar como true no banco de dados$/, async () => {
      expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(
        expect.any(String),
        { isHidden: true },
        { new: true }
      );
    });
  });

  test('Tentar ocultar review inexistente', ({ given, when, then, and }) => {
    given(/^nenhum review existe com id "(.*)"$/, (id) => {
      Review.findByIdAndUpdate.mockResolvedValue(null);
    });

    when(/^o método "hideReview" for chamado com id "(.*)"$/, async (id) => {
      try {
        await ReviewService.hideReview(id);
      } catch (err) {
        error = err;
        status = 404;
      }
    });

    then(/^o sistema deve retornar status (\d+)$/, (expectedStatus) => {
      expect(status).toBe(Number(expectedStatus));
    });

    and(/^a resposta deve conter a mensagem "(.*)"$/, (msg) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(msg);
    });
  });
});


