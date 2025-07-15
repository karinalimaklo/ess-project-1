import mongoose from 'mongoose';
import connectDB from './db';

// server/db/db.test.js

jest.mock('mongoose');

describe('connectDB', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...OLD_ENV, MONGODB_URI: 'mongodb://fake-uri' };
    });
    afterAll(() => {
        process.env = OLD_ENV;
    });

    it('deve chamar mongoose.connect com a URI do ambiente', async () => {
        mongoose.connect.mockReturnValue(Promise.resolve());
        await connectDB();
        expect(mongoose.connect).toHaveBeenCalledWith('mongodb://fake-uri');
    });

    it('deve logar sucesso ao conectar', async () => {
        mongoose.connect.mockReturnValue(Promise.resolve());
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        await connectDB();
        expect(logSpy).toHaveBeenCalledWith('Connected to MongoDB');
        logSpy.mockRestore();
    });

    it('deve logar erro ao falhar conexão', async () => {
        const fakeError = new Error('fail');
        mongoose.connect.mockReturnValue(Promise.reject(fakeError));
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await connectDB();
        expect(errorSpy).toHaveBeenCalledWith('Error connecting to MongoDB:', fakeError);
        errorSpy.mockRestore();
    });
});