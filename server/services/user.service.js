import User from '../models/user.model.js';


class UserService {
  static async getAllUsers() {
    return await User.find({ status: { $ne: 'Excluído' } });
  }
  static async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    return user;
  }
}

export default UserService;