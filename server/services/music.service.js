import Music from '../models/music.model.js';

class MusicService {
  static async createMusic(data) {
    const { title, artist, album, releaseYear, duration, url, platforms, cover} = data;

    if (!cover) {
      throw new Error('A capa da música é obrigatória.');
    }

    if (!title || !artist || !album || !releaseYear || !duration || !url || !platforms) {
      throw new Error('Por favor, preencha todos os campos.');
    }

    if (!/^\d{4}$/.test(releaseYear)) {
      throw new Error('O ano de lançamento deve conter 4 dígitos numéricos.');
    }

    const platformsArray = Array.isArray(platforms) ? platforms : [platforms];

    const lastMusic = await Music.findOne().sort({ musicId: -1 }).lean();
    let newId = 1;
    if (lastMusic?.musicId) {
      newId = parseInt(lastMusic.musicId, 10) + 1;
    }
    const musicId = String(newId).padStart(3, '0');

    const existingMusic = await Music.findOne({ title, artist });
    if (existingMusic) {
      throw new Error('Essa música já está cadastrada no sistema.');
    }

    const durationRegex = /^\d{2}:\d{2}$/;
    if (!durationRegex.test(duration)) {
      throw new Error('A duração deve estar no formato mm:ss');
    }

    const music = await Music.create({
      musicId,
      title,
      artist,
      album,
      releaseYear,
      duration,
      url,
      platforms: platformsArray,
      cover
    });

    return music;
  }

  static async searchMusic(termo) {
    let musics;

    if (!termo || termo.trim() === '') {
      musics = await Music.find().sort({ title: 1 });
    } else {
      const regex = new RegExp(termo, 'i');
      musics = await Music.find({
        $or: [{ title: regex }, { artist: regex }]
      }).sort({ title: 1 });
    }

    if (musics.length === 0) {
      const error = new Error('Não foi encontrada nenhuma música com esse nome.');
      error.status = 404;
      throw error;
    }
    

    return musics;
  }

  static async getMusicDetails(id) {
    const music = await Music.findOne({ musicId: id });

    if (!music) {
      const error = new Error("Música não encontrada.");
      error.status = 404; 
      throw error;
    }
    
    return music;
  }

  static async updateMusic(id, updateData) {

    const updatedMusic = await Music.findOne({musicId: id});

    if (!updatedMusic) {
      const error = new Error('Música não encontrada.');
      error.status = 404;
      throw error;
    }
    const updatedMusicOk = await Music.findOneAndUpdate(
      {musicId: id}, updateData, {new: true}
    );
    return updatedMusicOk;
  }

  static async deleteMusic(id) {
    const deleted = await Music.findOneAndDelete({ musicId: id });

    if (!deleted) throw new Error('Música não encontrada para remoção.');

    return deleted;
  }
}

export default MusicService;
