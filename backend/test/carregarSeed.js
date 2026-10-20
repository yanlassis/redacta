// Lê o sql/seed.sql e devolve os dados no mesmo formato usado pelo motor de recomendação,
// permitindo testar o ranking sem depender do Supabase.
const fs = require('fs');
const path = require('path');

function lerTuplas(trecho) {
  const tuplas = [];
  let atual = null;
  let i = 0;
  while (i < trecho.length) {
    const c = trecho[i];
    if (atual === null) {
      if (c === '-' && trecho[i + 1] === '-') {
        while (i < trecho.length && trecho[i] !== '\n') i++;
      } else if (c === '(') {
        atual = [];
      } else if (c === ';') {
        break;
      }
      i++;
      continue;
    }
    if (c === "'") {
      let valor = '';
      i++;
      while (i < trecho.length) {
        if (trecho[i] === "'" && trecho[i + 1] === "'") { valor += "'"; i += 2; continue; }
        if (trecho[i] === "'") { i++; break; }
        valor += trecho[i++];
      }
      atual.push(valor);
    } else if (/[-\d]/.test(c)) {
      const m = /^-?\d+/.exec(trecho.slice(i));
      atual.push(parseInt(m[0], 10));
      i += m[0].length;
    } else if (c === ')') {
      tuplas.push(atual);
      atual = null;
      i++;
    } else {
      i++;
    }
  }
  return tuplas;
}

function carregarSeed() {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'sql', 'seed.sql'), 'utf8');
  const tabelas = {};
  const re = /INSERT INTO (\w+) \(([^)]+)\) VALUES/g;
  let m;
  while ((m = re.exec(sql))) {
    const colunas = m[2].split(',').map(s => s.trim());
    const linhas = lerTuplas(sql.slice(re.lastIndex)).map(t => Object.fromEntries(colunas.map((c, k) => [c, t[k]])));
    tabelas[m[1]] = (tabelas[m[1]] || []).concat(linhas);
  }

  const porId = linhas => [...new Map(linhas.map(l => [l.id, l])).values()];
  return {
    eixos: porId(tabelas.eixos).map(e => ({ ...e, nome: e.nome.trim() })),
    temas: porId(tabelas.temas),
    argumentos: porId(tabelas.argumentos),
    repertorios: porId(tabelas.repertorios),
    temaArgumento: tabelas.tema_argumento,
    argumentoRepertorio: tabelas.argumento_repertorio
  };
}

module.exports = { carregarSeed };
