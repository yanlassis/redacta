-- Criação das tabelas do projeto Eixo Redação

CREATE TABLE IF NOT EXISTS eixos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS temas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    eixo_id INTEGER REFERENCES eixos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS argumentos (
    id SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS repertorios (
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL,
    conteudo TEXT NOT NULL
);

-- Tabelas associativas (Relacionamentos N:N)

CREATE TABLE IF NOT EXISTS tema_argumento (
    tema_id INTEGER REFERENCES temas(id) ON DELETE CASCADE,
    argumento_id INTEGER REFERENCES argumentos(id) ON DELETE CASCADE,
    PRIMARY KEY (tema_id, argumento_id)
);

CREATE TABLE IF NOT EXISTS argumento_repertorio (
    argumento_id INTEGER REFERENCES argumentos(id) ON DELETE CASCADE,
    repertorio_id INTEGER REFERENCES repertorios(id) ON DELETE CASCADE,
    PRIMARY KEY (argumento_id, repertorio_id)
);


-- Tabela de Favoritos do Usuário
CREATE TABLE IF NOT EXISTS favoritos (
    id SERIAL PRIMARY KEY,
    tema_id INTEGER REFERENCES temas(id) ON DELETE CASCADE,
    repertorio_id INTEGER REFERENCES repertorios(id) ON DELETE CASCADE,
    user_identifier VARCHAR(100) DEFAULT 'default_user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
