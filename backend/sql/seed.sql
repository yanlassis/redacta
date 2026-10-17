-- Dados completos (Seed) do Eixo Redação

-- 1. Eixos Temáticos
INSERT INTO eixos (id, nome) VALUES
(1, 'Saúde Pública'),
(2, 'Tecnologia'),
(3, 'Educação'),
(4, 'Meio Ambiente'),
(5, 'Cidadania e Direitos Humanos'),
(6, 'Cultura e Comunicação')
ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome;

-- 2. Temas de Redação
INSERT INTO temas (id, titulo, eixo_id) VALUES
(1, 'O estigma associado às doenças mentais', 1),
(2, 'Os impactos da inteligência artificial no mercado de trabalho', 2),
(3, 'Desafios para a valorização do saneamento básico e prevenção de epidemias no Brasil', 1),
(4, 'Desafios para o combate à desinformação e à manipulação algorítmica na era digital', 2),
(5, 'A evasão escolar e os entraves para a democratização do ensino médio no Brasil', 3),
(6, 'A importância da educação midiática e financeira na formação cidadã dos jovens', 3),
(7, 'Caminhos para combater o racismo ambiental e os impactos de eventos climáticos extremos', 4),
(8, 'Desafios da gestão de resíduos sólidos e da transição energética no século XXI', 4),
(9, 'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher', 5),
(10, 'A falta de registro civil e os obstáculos ao acesso à cidadania no Brasil', 5),
(11, 'A preservação do patrimônio histórico-cultural e a democratização do acesso ao cinema', 6),
(12, 'O papel da leitura na construção do pensamento crítico da juventude brasileira', 6)
ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, eixo_id = EXCLUDED.eixo_id;

-- 3. Argumentos
INSERT INTO argumentos (id, descricao) VALUES
(1, 'Negligência estatal nas políticas públicas de saúde'),
(2, 'Substituição da mão de obra humana por automação'),
(3, 'O silenciamento histórico e o preconceito social dificultam a busca por tratamento psicológico e psiquiátrico.'),
(4, 'A precarização das relações de trabalho (uberização) e a falta de requalificação profissional ampliam a desigualdade tecnológica.'),
(5, 'A desigualdade socioespacial concentra a falta de saneamento nas periferias, perpetuando doenças evitáveis.'),
(6, 'A escassez de investimentos preventivos sobrecarrega o Sistema Único de Saúde (SUS) com internações de urgência.'),
(7, 'Os algoritmos das redes sociais priorizam o engajamento emocional em detrimento da veracidade factual, criando bolhas informacionais.'),
(8, 'A ausência de regulamentação e fiscalização eficazes dificulta a responsabilização de plataformas digitais pela propagação de notícias falsas.'),
(9, 'A necessidade de inserção precoce no mercado de trabalho força jovens de baixa renda a abandonarem a escola.'),
(10, 'A defasagem curricular e a falta de infraestrutura nas escolas públicas geram desinteresse e sensação de não pertencimento nos estudantes.'),
(11, 'O ensino tradicional foca na memorização de conteúdos, mas falha em preparar o jovem para verificar fontes digitais e gerir recursos financeiros.'),
(12, 'A vulnerabilidade econômica das famílias brasileiras é agravada pelo endividamento precoce e pela falta de letramento financeiro na educação básica.'),
(13, 'Populações periféricas, indígenas e negras sofrem de maneira desproporcional os efeitos de enchentes, secas e falta de infraestrutura urbana.'),
(14, 'A omissão do poder público na fiscalização ambiental privilegia interesses econômicos imediatos em detrimento da justiça climática.'),
(15, 'A cultura do hiperconsumo e da obsolescência programada acelera a geração de lixo eletrônico e plástico sem a devida logística reversa.'),
(16, 'A baixa adesão à coleta seletiva decorre tanto da falta de educação ambiental quanto da escassez de incentivos fiscais para a reciclagem.'),
(17, 'A herança patriarcal naturaliza as tarefas domésticas e o cuidado de idosos e crianças como obrigações exclusivamente femininas e não remuneradas.'),
(18, 'A escassez de creches públicas e redes de apoio estatais impede a plena inserção e ascensão das mulheres no mercado de trabalho formal.'),
(19, 'A burocracia estatal e o distanciamento geográfico de cartórios excluem milhões de brasileiros do acesso a direitos básicos de saúde e assistência.'),
(20, 'A invisibilidade documental perpetua ciclos intergeracionais de pobreza e vulnerabilidade a trabalhos análogos à escravidão.'),
(21, 'A concentração de salas de cinema e museus em centros elitizados restringe o direito constitucional à cultura para moradores das periferias.'),
(22, 'O descaso governamental com a manutenção de acervos e monumentos apaga a memória coletiva e a identidade nacional.'),
(23, 'A velocidade das mídias digitais e o consumo de vídeos curtos reduzem a capacidade de concentração e interpretação aprofundada de textos.'),
(24, 'A precariedade de bibliotecas públicas e o alto custo dos livros no Brasil elitizam o hábito da leitura desde a infância.')
ON CONFLICT (id) DO UPDATE SET descricao = EXCLUDED.descricao;

-- 4. Repertórios Socioculturais
INSERT INTO repertorios (id, categoria, conteudo) VALUES
(1, 'Filme', 'Coringa (2019) - Retrata o abandono de pessoas com transtornos mentais pelo Estado.'),
(2, 'Livro', 'A Quarta Revolução Industrial, de Klaus Schwab.'),
(3, 'Filosofia', 'Michel Foucault, em "História da Loucura", analisa como a sociedade historicamente marginalizou e excluiu indivíduos considerados fora do padrão de normalidade mental.'),
(4, 'Sociologia', 'Zygmunt Bauman, no conceito de "Modernidade Líquida", destaca a fragilidade dos laços humanos e a insegurança constante gerada pelas transformações rápidas do mundo contemporâneo.'),
(5, 'Legislação', 'Constituição Federal de 1988 (Art. 196) - Garante que a saúde é direito de todos e dever do Estado, assegurada mediante políticas sociais e econômicas que visem à redução do risco de doença.'),
(6, 'Literatura', 'O Médico e o Monstro (Robert Louis Stevenson) - Ilustra a dualidade humana e o peso social de esconder o sofrimento psíquico por medo do julgamento moral.'),
(7, 'Sociologia', 'Ricardo Antunes, em "O Privilégio da Servidão", discute como a era digital e a automação criaram um novo proletariado de serviços precarizados e sem direitos trabalhistas.'),
(8, 'Filosofia', 'Hannah Arendt, em "Verdade e Política", alerta que a verdade factual é frágil diante da manipulação sistemática e que a perda de referências reais compromete a democracia.'),
(9, 'Comunicação', 'Eli Pariser, autor de "O Filtro Invisível" (2011), demonstra como a personalização algorítmica da internet isola os usuários em bolhas ideológicas que reforçam preconceitos.'),
(10, 'Audiovisual', 'O Dilema das Redes (2020) - Documentário que expõe como o modelo de negócios das grandes plataformas digitais explora a psicologia humana para maximizar o tempo de tela e o engajamento.'),
(11, 'Filosofia', 'Paulo Freire, em "Pedagogia do Oprimido" e "A Importância do Ato de Ler", defende que a educação deve ser libertadora e formar cidadãos capazes de ler criticamente o mundo ao seu redor.'),
(12, 'Sociologia', 'Pierre Bourdieu desenvolve o conceito de "Capital Cultural", mostrando como a escola muitas vezes reproduz desigualdades sociais ao ignorar a realidade socioeconômica dos alunos mais pobres.'),
(13, 'Legislação', 'Constituição Federal de 1988 (Art. 205) - Estabelece que a educação, direito de todos e dever do Estado e da família, visa ao pleno desenvolvimento da pessoa e ao preparo para a cidadania.'),
(14, 'Filosofia', 'Ailton Krenak, em "Ideias para Adiar o Fim do Mundo", critica a visão predatória que separa a humanidade da natureza e propõe o resgate da cosmovisão ancestral indígena.'),
(15, 'Sociologia', 'Robert Bullard, considerado o pai do conceito de "Justiça Ambiental", evidencia que comunidades negras e de baixa renda são sistematicamente mais expostas a riscos ecológicos e poluição.'),
(16, 'Legislação', 'Constituição Federal de 1988 (Art. 225) - Assegura que todos têm direito ao meio ambiente ecologicamente equilibrado, impondo ao Poder Público e à coletividade o dever de defendê-lo para as presentes e futuras gerações.'),
(17, 'Filosofia', 'Hans Jonas, em "O Princípio Responsabilidade", propõe uma nova ética para a civilização tecnológica: agir de modo que os efeitos da nossa ação sejam compatíveis com a permanência da vida humana na Terra.'),
(18, 'Sociologia', 'Silvia Federici, em "O Ponto Zero da Revolução", analisa como o trabalho reprodutivo e de cuidado não remunerado das mulheres é a base invisível que sustenta toda a economia capitalista.'),
(19, 'Literatura', 'Quarto de Despejo, de Carolina Maria de Jesus - Diário real de uma mulher negra e periférica que lutava diariamente para cuidar dos filhos em meio à fome e ao abandono estatal.'),
(20, 'Literatura', 'Vidas Secas, de Graciliano Ramos - Retrata o personagem Fabiano e sua família como cidadãos invisíveis perante o Estado, privados de linguagem, documentos e direitos fundamentais.'),
(21, 'Sociologia', 'Gilberto Dimenstein, na obra "O Cidadão de Papel", argumenta que no Brasil os direitos humanos e constitucionais existem formalmente na lei, mas não se concretizam na prática para a população vulnerável.'),
(22, 'Literatura', '1984, de George Orwell - Romance distópico no qual o controle do passado, da linguagem (Novilíngua) e da memória histórica é utilizado para impedir o pensamento crítico dos cidadãos.')
ON CONFLICT (id) DO UPDATE SET categoria = EXCLUDED.categoria, conteudo = EXCLUDED.conteudo;

-- 5. Relacionamento Tema <-> Argumento
INSERT INTO tema_argumento (tema_id, argumento_id) VALUES
(1, 1), (1, 3),
(2, 2), (2, 4),
(3, 5), (3, 6),
(4, 7), (4, 8),
(5, 9), (5, 10),
(6, 11), (6, 12),
(7, 13), (7, 14),
(8, 15), (8, 16),
(9, 17), (9, 18),
(10, 19), (10, 20),
(11, 21), (11, 22),
(12, 23), (12, 24)
ON CONFLICT DO NOTHING;

-- 6. Relacionamento Argumento <-> Repertório
INSERT INTO argumento_repertorio (argumento_id, repertorio_id) VALUES
(1, 1), (1, 5),
(3, 3), (3, 6),
(2, 2), (2, 4),
(4, 7),
(5, 5), (5, 21),
(6, 5),
(7, 9), (7, 10),
(8, 8),
(9, 12), (9, 13),
(10, 11), (10, 12),
(11, 11), (11, 9),
(12, 13), (12, 4),
(13, 15), (13, 16),
(14, 14), (14, 16),
(15, 17), (15, 4),
(16, 16), (16, 17),
(17, 18), (17, 19),
(18, 18), (18, 21),
(19, 20), (19, 21),
(20, 20), (20, 21),
(21, 21), (21, 12),
(22, 22),
(23, 10), (23, 22),
(24, 11), (24, 12)
ON CONFLICT DO NOTHING;

-- Ajusta as sequences do PostgreSQL para novos inserts futuros
SELECT setval('eixos_id_seq', (SELECT MAX(id) FROM eixos));
SELECT setval('temas_id_seq', (SELECT MAX(id) FROM temas));
SELECT setval('argumentos_id_seq', (SELECT MAX(id) FROM argumentos));
SELECT setval('repertorios_id_seq', (SELECT MAX(id) FROM repertorios));
