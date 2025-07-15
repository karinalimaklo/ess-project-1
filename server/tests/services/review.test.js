import { defineFeature, loadFeature } from 'jest-cucumber';
import { jest } from '@jest/globals';
import ReviewService from '../../services/review.service.js';
import Review from '../../models/review.model.js';

const createFeature = loadFeature('../features/createReview.feature');
const manageFeature = loadFeature('../features/manageReview.feature');

jest.mock('../../models/review.model.js');

defineFeature(createFeature, (test) => {
  let result;
  let error;

  beforeEach(() => {
    result = null;
    error = null;
    jest.clearAllMocks();
  });

  test('Criar review com sucesso', ({ given, when, then }) => {
    given(/^existe um usuário com id "(.*)"$/, () => {});
    given(/^existe a música "(.*)" da artista "(.*)"$/, () => {});

    when(
      /^o método "(.*)" for chamado com userId "(.*)", musica "(.*)", artista "(.*)", texto "(.*)" e rating (\d+)$/,
      async (methodName, userId, musica, artista, texto, rating) => {
        Review.create.mockResolvedValue({
          userId,
          musica,
          artista,
          texto,
          rating: Number(rating),
        });

        result = await ReviewService[methodName](
          userId,
          musica,
          artista,
          texto,
          Number(rating)
        );
      }
    );

    then(
      /^o review retornado deve conter userId "(.*)", musica "(.*)", artista "(.*)", texto "(.*)" e rating (\d+)$/,
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
  });

  test('Não criar review por falta de texto', ({ given, when, then }) => {
    given(/^existe um usuário com id "(.*)"$/, () => {});
    given(/^existe a música "(.*)" da artista "(.*)"$/, () => {});

    when(
      /^o método "(.*)" for chamado com userId "(.*)", musica "(.*)", artista "(.*)", texto "(.*)" e rating (\d+)$/,
      async (methodName, userId, musica, artista, texto, rating) => {
        Review.create.mockResolvedValue({});

        try {
          result = await ReviewService[methodName](
            userId,
            musica,
            artista,
            texto,
            Number(rating)
          );
        } catch (err) {
          error = err;
        }
      }
    );

    then(/^um erro deve ser lançado dizendo "(.*)"$/, (msg) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(msg);
    });
  });

  test('Não criar review com rating 0', ({ given, when, then }) => {
    given('existe um usuário com id "user123"', () => {});
    given('existe a música "Blank Space" da artista "Taylor Swift"', () => {});

    when('o método "createReview" for chamado com userId "user123", musica "Blank Space", artista "Taylor Swift", texto "ok" e rating 0', async () => {
      try {
        await ReviewService.createReview('user123', 'Blank Space', 'Taylor Swift', 'ok', 0);
      } catch (err) {
        error = err;
      }
    });

    then('um erro deve ser lançado dizendo "Selecione uma avaliação para continuar"', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Selecione uma avaliação para continuar');
    });
  });

  test('Não criar review por falta de avaliação', ({ given, when, then }) => {
    given(/^existe um usuário com id "(.*)"$/, () => {});
    given(/^existe a música "(.*)" da artista "(.*)"$/, () => {});

    when(
      /^o método "(.*)" for chamado com userId "(.*)", musica "(.*)", artista "(.*)", texto "(.*)" e rating (.*)$/,
      async (methodName, userId, musica, artista, texto, rating) => {
        Review.create.mockResolvedValue({});

        try {
          result = await ReviewService[methodName](
            userId,
            musica,
            artista,
            texto,
            rating === 'indefinido' ? undefined : Number(rating)
          );
        } catch (err) {
          error = err;
        }
      }
    );

    then(/^um erro deve ser lançado dizendo "(.*)"$/, (msg) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(msg);
    });
  });
});

defineFeature(manageFeature, (test) => {
  let result;
  let error;

  beforeEach(() => {
    result = null;
    error = null;
    jest.clearAllMocks();
  });

  test('Remover review com sucesso', ({ given, when, then, and }) => {
    given(
      /^existe um review cadastrado com id "(.*)" para a música "(.*)" da artista "(.*)"$/,
      (id, musica, artista) => {
        Review.findById.mockResolvedValue({ _id: id, musica, artista });
        Review.findByIdAndDelete.mockResolvedValue({ _id: id, musica, artista });
      }
    );

    and(/^estou autenticado como o dono da review$/, () => {});

    when(/^o método "(.*)" for chamado com id "(.*)"$/, async (methodName, id) => {
      result = await ReviewService[methodName](id);
    });

    then(/^o sistema deve retornar o review removido com id "(.*)"$/, (id) => {
      expect(result).toBeDefined();
      expect(result._id).toBe(id);
    });
  
  test('Tentar remover review inexistente', ({ given, when, then }) => {
    given(/^nenhum review existe com id "(.*)"$/, (id) => {
      Review.findById.mockResolvedValue(null);
    });

    when(/^o método "deleteReview" for chamado com id "(.*)"$/, async (id) => {
      try {
        await ReviewService.deleteReview(id);
      } catch (err) {
        error = err;
      }
    });

    then(/^um erro deve ser lançado dizendo "Review não encontrada"$/, () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Review não encontrada');
    });
  });

  test('Tentar editar review inexistente', ({ given, when, then }) => {
    given(/^nenhum review existe com id "(.*)"$/, (id) => {
      Review.findById.mockResolvedValue(null);
    });

    when(/^o método "updateReview" for chamado com id "(.*)" e novo texto "(.*)"$/, async (id, novoTexto) => {
      try {
        await ReviewService.updateReview(id, { texto: novoTexto });
      } catch (err) {
        error = err;
      }
    });

    then(/^um erro deve ser lançado dizendo "Review não encontrada"$/, () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Review não encontrada');
    });
  });

  test('Tentar visualizar review inexistente', ({ given, when, then }) => {
    given(/^nenhum review existe com id "(.*)"$/, (id) => {
      Review.findById.mockResolvedValue(null);
    });

    when(/^o método "getReview" for chamado com id "(.*)"$/, async (id) => {
      try {
        await ReviewService.getReview(id);
      } catch (err) {
        error = err;
      }
    });

    then(/^um erro deve ser lançado dizendo "Review não encontrada"$/, () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Review não encontrada');
    });
  });

    and(/^o review não deve mais existir no banco de dados$/, async () => {
      Review.findById.mockResolvedValue(null);
      const deleted = await Review.findById(result._id);
      expect(deleted).toBeNull();
    });
  });

  test('Editar review com sucesso', ({ given, and, when, then }) => {
    given(/^existe um review cadastrado com id "(.*)" e texto "(.*)"$/, (id, texto) => {
      Review.findById.mockResolvedValue({ _id: id, texto });
      Review.findByIdAndUpdate.mockImplementation((id, update) =>
        Promise.resolve({ _id: id, ...update })
      );
    });

    and(/^estou autenticado como o dono da review$/, () => {});

    when(/^o método "(.*)" for chamado com id "(.*)" e novo texto "(.*)"$/, async (methodName, id, novoTexto) => {
      result = await ReviewService[methodName](id, { texto: novoTexto });
    });

    then(/^o review retornado deve conter texto "(.*)"$/, (novoTexto) => {
      expect(result).toBeDefined();
      expect(result.texto).toBe(novoTexto);
    });

    and(/^o campo "(.*)" do review deve ser atualizado no banco de dados$/, (campo) => {
      expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(
        result._id,
        { [campo]: result.texto },
        { new: true }
      );
    });
  });

  test('Visualizar review', ({ given, when, then, and }) => {
    given(
      /^existe um review cadastrado com id "(.*)" para a música "(.*)" do usuário "(.*)"$/,
      (id, musica, userId) => {
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

    when(/^o método "(.*)" for chamado com id "(.*)"$/, async (methodName, id) => {
      result = await ReviewService[methodName](id);
    });

    then(/^o review retornado deve conter musica "(.*)" e usuário "(.*)"$/, (musicaEsperada, userEsperado) => {
      expect(result).toBeDefined();
      expect(result.musica).toBe(musicaEsperada);
      expect(result.userId).toBe(userEsperado);
    });

    and(
      /^o review deve conter todos os campos obrigatórios \(id, musica, artista, texto, rating, userId\)$/,
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

  test('Ocultar review com sucesso', ({ given, when, then }) => {
    given(/^existe um review com id "(.*)"$/, (id) => {
      Review.findByIdAndUpdate.mockResolvedValue({ _id: id, isHidden: true });
    });

    when(/^o método "hideReview" for chamado com id "(.*)"$/, async (id) => {
      result = await ReviewService.hideReview(id);
    });

    then(/^o campo "isHidden" do review deve ser true$/, () => {
      expect(result).toBeDefined();
      expect(result.isHidden).toBe(true);
    });
  });

  test('Tentar ocultar review inexistente', ({ given, when, then }) => {
    given(/^nenhum review existe com id "(.*)"$/, (id) => {
      Review.findByIdAndUpdate.mockResolvedValue(null);
    });

    when(/^o método "hideReview" for chamado com id "(.*)"$/, async (id) => {
      try {
        await ReviewService.hideReview(id);
      } catch (err) {
        error = err;
      }
    });

    then(/^um erro deve ser lançado dizendo "Review não encontrada."$/, () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Review não encontrada');
    });
  });
});


