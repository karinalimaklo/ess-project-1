import mongoose from "mongoose";
import Music from "../models/music.model.js";
import Review from "../models/review.model.js";

class MusicService {
  static _validateMusicData(data, isUpdate = false) {
    const {
      title,
      artist,
      album,
      releaseYear,
      duration,
      url,
      platforms,
      cover,
    } = data;

    if (!isUpdate && !cover) {
      throw new Error("A capa da música é obrigatória.");
    }

    if (
      !isUpdate &&
      (!title ||
        !artist ||
        !album ||
        !releaseYear ||
        !duration ||
        !url ||
        !platforms || platforms.length === 0)
    ) {
      throw new Error("Por favor, preencha todos os campos.");
    }

    if (releaseYear && !/^\d{4}$/.test(releaseYear)) {
      throw new Error("O ano de lançamento deve conter 4 dígitos numéricos.");
    }

    const durationRegex = /^\d{2}:\d{2}$/;
    if (duration && !durationRegex.test(duration)) {
      throw new Error("A duração deve estar no formato mm:ss");
    }
  }

  static async createMusic(data) {
    this._validateMusicData(data);

    const durationRegex = /^\d{2}:\d{2}$/;
    if (duration && !durationRegex.test(duration)) {
      throw new Error("A duração deve estar no formato mm:ss");
    }
  }

  static async createMusic(data) {
    this._validateMusicData(data);

    const { title, artist } = data;
    const existingMusic = await Music.findOne({ title, artist });
    if (existingMusic) {
      throw new Error("Essa música já está cadastrada no sistema.");
    }

    const lastMusic = await Music.findOne().sort({ musicId: -1 }).lean();
    let newId = 1;
    if (lastMusic?.musicId) {
      newId = parseInt(lastMusic.musicId, 10) + 1;
    }
    const musicId = String(newId).padStart(3, "0");

    const music = await Music.create({ ...data, musicId });
    return music;
  }

  static async updateMusic(id, updateData) {
    this._validateMusicData(updateData, true); // true = indica que é uma atualização

    const updatedMusic = await Music.findOneAndUpdate(
      { musicId: id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMusic) {
      const error = new Error('Música não encontrada.');
      error.status = 404;
      throw error;
    }

    return updatedMusic;
  }

  static async deleteMusic(id) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const musicToDelete = await Music.findById(id).session(session);
      if (!musicToDelete) {
        throw new Error("Música não encontrada para remoção.");
      }

      await Review.deleteMany({
        musica: musicToDelete.title,
        artista: musicToDelete.artist,
      }).session(session);

      await Music.findByIdAndDelete(musicToDelete._id).session(session);

      await session.commitTransaction();
      return musicToDelete;
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Falha ao excluir música: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  static async searchMusic(termo) {
    let musics;
    if (!termo || termo.trim() === "") {
      musics = await Music.find().sort({ title: 1 });
    } else {
      const regex = new RegExp(termo, "i");
      musics = await Music.find({
        $or: [{ title: regex }, { artist: regex }],
      }).sort({ title: 1 });
    }
    if (musics.length === 0) {
      throw new Error("Não foi encontrada nenhuma música com esse nome.");
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
}

export default MusicService;
