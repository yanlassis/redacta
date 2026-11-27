const test = require('node:test');
const assert = require('node:assert/strict');
const { configurarSsl } = require('../ssl');

const PEM = '-----BEGIN CERTIFICATE-----\nABC\n-----END CERTIFICATE-----';

test('sem DB_SSL_CA mantém a conexão sem verificar o servidor', () => {
  assert.deepEqual(configurarSsl({}), { rejectUnauthorized: false });
  assert.deepEqual(configurarSsl({ DB_SSL_CA: '   ' }), { rejectUnauthorized: false });
});

test('com DB_SSL_CA verifica o certificado do servidor', () => {
  assert.deepEqual(configurarSsl({ DB_SSL_CA: PEM }), { ca: PEM, rejectUnauthorized: true });
});

test('aceita o PEM com \\n literais (variável de ambiente em uma linha)', () => {
  const emUmaLinha = PEM.replace(/\n/g, '\\n');
  assert.equal(configurarSsl({ DB_SSL_CA: emUmaLinha }).ca, PEM);
});
