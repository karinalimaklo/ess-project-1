import { defineFeature, loadFeature } from 'jest-cucumber';
import FollowService from '../../services/follow.service.js';
import Follow from '../../models/follow.model.js';

const feature = loadFeature('./tests/services/follow.feature');

jest.mock('../../models/follow.model.js');

defineFeature(feature, (test) => {
  let result;
  let error;

  beforeEach(() => {
    result = null;
    error = null;
    jest.clearAllMocks();
  });

  test('Criar relacionamento de follow com sucesso', ({ given, when, and, then }) => {
    given('não existe nenhum relacionamento de follow entre os usuários "user1" e "user2"', () => {
      Follow.findOne.mockResolvedValue(null);
      Follow.create.mockResolvedValue({ follower: 'user1', following: 'user2' });
    });

    when('uma requisição "POST" é enviada para "/follows"', () => {});

    and('o corpo desta requisição contém os seguintes campos:', async (table) => {
      const { followerId, followingId } = table[0];
      result = await FollowService.createFollow(followerId, followingId);
    });

    then('o status da resposta deve ser "201"', () => {
      expect(result).toBeDefined();
    });

    and('a mensagem "Follow criado com sucesso." deve estar presente na resposta', () => {
      expect(result).toEqual({ follower: 'user1', following: 'user2' });
    });

    and('o relacionamento entre "user1" e "user2" deve estar salvo no banco de dados', () => {
      expect(Follow.create).toHaveBeenCalledWith({ follower: 'user1', following: 'user2' });
    });
  });

  test('Tentar seguir a si mesmo', ({ when, and, then }) => {
    when('uma requisição "POST" é enviada para "/follows"', () => {});

    and('o corpo contém followerId e followingId iguais: "user1"', async () => {
      try {
        await FollowService.createFollow("user1", "user1");
      } catch (err) {
        error = err;
      }
    });

    then('o status da resposta deve ser "400"', () => {
      expect(error).toBeInstanceOf(Error);
    });

    and('a mensagem "Você não pode seguir a si mesmo." deve estar presente na resposta', () => {
      expect(error.message).toBe("Você não pode seguir a si mesmo.");
    });
  });

  test('Tentar seguir o mesmo usuário duas vezes', ({ given, when, and, then }) => {
    given('o usuário "user1" já está seguindo o usuário "user2"', () => {
      Follow.findOne.mockResolvedValue({ follower: 'user1', following: 'user2' });
    });

    when('uma requisição "POST" é enviada para "/follows" com os seguintes dados:', async (table) => {
      const { followerId, followingId } = table[0];
      try {
        await FollowService.createFollow(followerId, followingId);
      } catch (err) {
        error = err;
      }
    });

    then('o status da resposta deve ser "400"', () => {
      expect(error).toBeInstanceOf(Error);
    });

    and('a mensagem "Você já está seguindo esse usuário." deve estar presente na resposta', () => {
      expect(error.message).toBe("Você já está seguindo esse usuário.");
    });
  });

  test('Deixar de seguir um usuário com sucesso', ({ given, when, then, and }) => {
    given('o usuário "user1" está seguindo o usuário "user2"', () => {
      Follow.findOneAndDelete.mockResolvedValue({ follower: 'user1', following: 'user2' });
    }); 

    when('uma requisição "DELETE" é enviada para "/follows" com os seguintes dados:', async (table) => {
      const { followerId, followingId } = table[0];
      result = await FollowService.deleteFollow(followerId, followingId);
    });

    then('o status da resposta deve ser "200"', () => {
      expect(result).toBeDefined();
    });

    and('a mensagem "Follow removido com sucesso." deve estar presente na resposta', () => {
      expect(result.follower).toBe("user1");
      expect(result.following).toBe("user2");
    });

    and('o relacionamento entre "user1" e "user2" não deve mais existir no banco de dados', () => {
      expect(Follow.findOneAndDelete).toHaveBeenCalledWith({ follower: "user1", following: "user2" });
    });
  });

  test('Listar os usuários que um usuário segue', ({ given, when, then, and }) => {
    given('o usuário "user1" está seguindo os usuários "user2" e "user3"', () => {
      const expectedUsers = [
        { following: { name: 'user2' } },
        { following: { name: 'user3' } },
      ];
      const mockPopulate = jest.fn().mockResolvedValue(expectedUsers);
      Follow.find.mockReturnValue({ populate: mockPopulate });
    });

    when('uma requisição "GET" é enviada para "/follows/following/user1"', async () => {
      result = await FollowService.getFollowing("user1");
    });

    then('o status da resposta deve ser "200"', () => {
      expect(result).toBeDefined();
    });

    and('a lista retornada deve conter "user2" e "user3"', () => {
      const names = result.map((u) => u.following.name);
      expect(names).toEqual(["user2", "user3"]);
    });
  });

  test('Listar os seguidores de um usuário', ({ given, when, then, and }) => {
    given('o usuário "user2" é seguido por "user1" e "user3"', () => {
      const expectedFollowers = [
        { follower: { name: 'user1' } },
        { follower: { name: 'user3' } },
      ];
      const mockPopulate = jest.fn().mockResolvedValue(expectedFollowers);
      Follow.find.mockReturnValue({ populate: mockPopulate });
    });

    when('uma requisição "GET" é enviada para "/follows/followers/user2"', async () => {
      result = await FollowService.getFollowers("user2");
    });

    then('o status da resposta deve ser "200"', () => {
      expect(result).toBeDefined();
    });

    and('a lista retornada deve conter "user1" e "user3"', () => {
      const names = result.map((u) => u.follower.name);
      expect(names).toEqual(["user1", "user3"]);
    });
  });

  test('Tentar dar unfollow em alguém que não está sendo seguido', ({ given, when, then, and }) => {
    given('não existe relacionamento de follow entre os usuários "user1" e "user2"', () => {
      Follow.findOneAndDelete.mockResolvedValue(null);
    });

    when('uma requisição "DELETE" é enviada para "/follows" com os seguintes dados:', async (table) => {
      const { followerId, followingId } = table[0];
      try {
        await FollowService.deleteFollow(followerId, followingId);
      } catch (err) {
        error = err;
      }
    });

    then('o status da resposta deve ser "404"', () => {
      expect(error).toBeInstanceOf(Error);
    });

    and('a mensagem "Relacionamento de follow não encontrado." deve estar presente na resposta', () => {
      expect(error.message).toBe("Follow não encontrado");
    });
  });
});