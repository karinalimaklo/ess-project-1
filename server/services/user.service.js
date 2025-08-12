import User from '../models/user.model.js';


class UserService {
  static async getAllUsers() {
    return await User.find({ status: { $ne: 'Excluído' } });
  }
  static async getUserById(userId) {
    const user = await User.findOne({ _id: userId, status: { $ne: 'Excluído' } });

    if (!user) {

      throw new Error('Usuário não encontrado.');
    }
    return user;
  }

  static async searchUser(termo) {
    let users;

  if (!termo || termo.trim() === '') {
    users = await User.find().sort({ name: 1 });
  } else {
    const regex = new RegExp(termo, 'i');
    users = await User.find({ name: regex }).sort({ name: 1 });
  }

  if (users.length === 0) {
    const err = new Error('Não foi encontrada nenhum usuário com esse nome.');
    err.status = 404; 
    throw err;
  }

  return users;
  } 
}

export default UserService;
