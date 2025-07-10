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

  test('Criar follow com sucesso', ({ given, when, then }) => {
    given('o método createFollow chamado com followerId "user1" e followingId "user2" retorna um follow com esses valores', () => {
      Follow.findOne.mockResolvedValue(null);
      Follow.create.mockResolvedValue({ follower: 'user1', following: 'user2' });
    });

    when('o método createFollow for chamado com followerId "user1" e followingId "user2"', async () => {
      result = await FollowService.createFollow('user1', 'user2');
    });

    then('o follow retornado deve conter followerId "user1" e followingId "user2"', () => {
      expect(result.follower).toBe('user1');
      expect(result.following).toBe('user2');
    });
  });

  test('Tentar seguir a si mesmo', ({ given, when, then }) => {
    given('o método createFollow chamado com followerId igual a followingId "user1" lança um erro', () => {});

    when('o método createFollow for chamado com followerId e followingId "user1"', async () => {
      try {
        await FollowService.createFollow('user1', 'user1');
      } catch (err) {
        error = err;
      }
    });

    then('um erro deve ser lançado dizendo "Você não pode seguir a si mesmo."', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Você não pode seguir a si mesmo.');
    });
  });

  test('Tentar seguir o mesmo usuário duas vezes', ({ given, when, then }) => {
    given('o usuário "user1" já está seguindo "user2"', () => {
      Follow.findOne.mockResolvedValue({ follower: 'user1', following: 'user2' });
    });

    when('o método createFollow for chamado com followerId "user1" e followingId "user2"', async () => {
      try {
        await FollowService.createFollow('user1', 'user2');
      } catch (err) {
        error = err;
      }
    });

    then('um erro deve ser lançado dizendo "Você já está seguindo esse usuário."', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Você já está seguindo esse usuário.');
    });
  });

  test('Deixar de seguir um usuário', ({ given, when, then }) => {
    given('o usuário "user1" está seguindo "user2"', () => {
      Follow.findOneAndDelete.mockResolvedValue({ follower: 'user1', following: 'user2' });
    });

    when('o método deleteFollow for chamado com followerId "user1" e followingId "user2"', async () => {
      result = await FollowService.deleteFollow('user1', 'user2');
    });

    then('o sistema deve retornar o follow removido', () => {
      expect(result.follower).toBe('user1');
      expect(result.following).toBe('user2');
    });
  });

  test('Listar quem um usuário está seguindo', ({ given, when, then }) => {
    given('o usuário "user1" está seguindo "user2" e "user3"', () => {
      const expectedUsers = [
        { following: { name: 'user2' } },
        { following: { name: 'user3' } },
      ];
      const mockPopulate = jest.fn().mockResolvedValue(expectedUsers);
      Follow.find.mockReturnValue({
        populate: mockPopulate,
      });
    });

    when('o método getFollowing for chamado com "user1"', async () => {
      result = await FollowService.getFollowing('user1');
    });

    then('a lista retornada deve conter "user2" e "user3"', () => {
      const names = result.map((u) => u.following.name);
      expect(names).toEqual(['user2', 'user3']);
    });
  });

  test('Listar quem está seguindo um usuário', ({ given, when, then }) => {
    given('"user2" é seguido por "user1" e "user3"', () => {
      const expectedFollowers = [
        { follower: { name: 'user1' } },
        { follower: { name: 'user3' } },
      ];
      const mockPopulate = jest.fn().mockResolvedValue(expectedFollowers);
      Follow.find.mockReturnValue({
        populate: mockPopulate,
      });
    });

    when('o método getFollowers for chamado com "user2"', async () => {
      result = await FollowService.getFollowers('user2');
    });

    then('a lista retornada deve conter "user1" e "user3"', () => {
      const names = result.map((u) => u.follower.name);
      expect(names).toEqual(['user1', 'user3']);
    });
  });

    test('Tentar dar unfollow em alguém que não sigo', ({ given, when, then }) => {
        given('não existe follow entre "user1" e "userX"', () => {
            Follow.findOneAndDelete.mockResolvedValue(null);
        });
        when('o método deleteFollow for chamado com followerId "user1" e followingId "userX"', async () => {
            try {
                await FollowService.deleteFollow('user1', 'userX');
            } catch (err) {
                error = err;
              }
        });
        then('um erro deve ser lançado dizendo "Follow não encontrado"', () => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Follow não encontrado");
        });
    });

});