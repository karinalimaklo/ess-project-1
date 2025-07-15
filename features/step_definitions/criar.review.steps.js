import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import request from 'supertest';
import app from '../../server/app.js';

let response;
let reviewData = {};

Given('que o usuário preenche todos os campos obrigatórios do review', function () {
  reviewData = {
    userId: '1',
    musica: 'Long Live',
    artista: 'Taylor Swift',
    texto: 'Ótima música!',
    rating: 1,
  };
});

Given('que o usuário não preenche o campo texto', function () {
  reviewData = {
    userId: '1',
    musica: 'Long Live',
    artista: 'Taylor Swift',
    texto: '',
    rating: 1,
  };
});

When('ele envia o review', async function () {
  response = await request(app).post('/reviews').send(reviewData);
});

Then('o sistema retorna sucesso', function () {
  assert.strictEqual(response.statusCode, 201);
  assert.strictEqual(response.body.message, 'Review cadastrada com sucesso');
});

Then('o sistema retorna erro de texto obrigatório', function () {
  assert.strictEqual(response.statusCode, 400);
  assert.strictEqual(response.body.message, 'Escreva algo para fazer o review!');
});