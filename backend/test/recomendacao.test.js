const test = require('node:test');
const assert = require('node:assert/strict');
const { radical, construirIndice, recomendar } = require('../recomendacao');
const { carregarSeed } = require('./carregarSeed');

const indice = construirIndice(carregarSeed());
const temasDasTeses = rec => rec.argumentos.map(a => a.tema_origem);

test('radical junta flexões e derivações da mesma palavra', () => {
  assert.equal(radical('desmatamento'), radical('desmatar'));
  assert.equal(radical('idosos'), radical('idoso'));
  assert.equal(radical('eleicoes'), radical('eleicao'));
  assert.equal(radical('mulheres'), radical('mulher'));
  assert.equal(radical('vacinacao'), radical('vacina'));
});

test('radical não junta palavras diferentes nem casa com palavras curtas', () => {
  assert.notEqual(radical('desmatamento'), 'de');
  assert.notEqual(radical('medicamento'), radical('medico'));
});

test('desmatamento na Amazônia traz teses ambientais, não recifes de corais no topo', () => {
  const rec = recomendar('o desmatamento na amazônia', indice);
  assert.equal(rec.eixo_sugerido, 'Meio Ambiente, Clima e Território');
  assert.ok(rec.argumentos.length > 0);
  assert.match(rec.argumentos[0].tema_origem, /Cerrado|Amazôni|garimpo/i);
  assert.doesNotMatch(rec.argumentos[0].tema_origem, /recifes/i);
});

test('anabolizantes em academias não traz câmeras policiais nem candidaturas laranjas', () => {
  const rec = recomendar('o uso de anabolizantes por jovens em academias', indice);
  temasDasTeses(rec).forEach(titulo => {
    assert.doesNotMatch(titulo, /câmeras corporais|violência política/i);
  });
});

test('tema sem relação com a base não cai no eixo Saúde com teses de vacinação', () => {
  const rec = recomendar('a gordofobia na sociedade', indice);
  temasDasTeses(rec).forEach(titulo => assert.doesNotMatch(titulo, /vacinal/i));
});

test('tema totalmente desconhecido devolve confiança baixa e nenhuma tese', () => {
  const rec = recomendar('xyzabc qwerty', indice);
  assert.equal(rec.confianca, 'baixa');
  assert.equal(rec.eixo_id, null);
  assert.deepEqual(rec.argumentos, []);
  assert.deepEqual(rec.repertorios, []);
});

test('título idêntico a um tema do catálogo traz as teses dele primeiro', () => {
  const tema = indice.temas[0];
  const rec = recomendar(tema.titulo, indice);
  assert.equal(rec.existe_exato, true);
  assert.equal(rec.tema_exato_id, tema.id);
  assert.equal(rec.argumentos[0].tema_origem_id, tema.id);
  assert.equal(rec.argumentos[1].tema_origem_id, tema.id);
});

test('tema próximo do catálogo traz as teses do tema correspondente', () => {
  const rec = recomendar('evasão escolar no ensino médio', indice);
  assert.equal(rec.confianca, 'alta');
  assert.match(rec.argumentos[0].tema_origem, /evasão escolar/i);
});

test('repertórios recomendados sustentam as teses escolhidas', () => {
  const rec = recomendar('a xenofobia contra imigrantes venezuelanos', indice);
  assert.ok(rec.repertorios.length > 0);
  const idsTemas = new Set(rec.argumentos.map(a => a.tema_origem_id));
  assert.ok(rec.repertorios.some(r => idsTemas.has(r.tema_origem_id)));
});
