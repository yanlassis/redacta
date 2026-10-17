-- Dados iniciais (Seed) para testes do Eixo Redação

INSERT INTO eixos (id, nome) VALUES
(1, 'Saúde Pública'),
(2, 'Tecnologia')
ON CONFLICT (id) DO NOTHING;

INSERT INTO temas (id, titulo, eixo_id) VALUES
(1, 'O estigma associado às doenças mentais', 1),
(2, 'Os impactos da inteligência artificial no mercado de trabalho', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO argumentos (id, descricao) VALUES
(1, 'Negligência estatal nas políticas públicas de saúde'),
(2, 'Substituição da mão de obra humana por automação')
ON CONFLICT (id) DO NOTHING;

INSERT INTO repertorios (id, categoria, conteudo) VALUES
(1, 'Filme', 'Coringa (2019) - Retrata o abandono de pessoas com transtornos mentais pelo Estado.'),
(2, 'Livro', 'A Quarta Revolução Industrial, de Klaus Schwab.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tema_argumento (tema_id, argumento_id) VALUES
(1, 1),
(2, 2)
ON CONFLICT DO NOTHING;

INSERT INTO argumento_repertorio (argumento_id, repertorio_id) VALUES
(1, 1),
(2, 2)
ON CONFLICT DO NOTHING;
