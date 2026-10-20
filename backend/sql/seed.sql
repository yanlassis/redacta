-- ============================================================================
-- SEED COMPLETO E APROFUNDADO - EIXO REDAÇÃO
-- Repertórios específicos, autorais e altamente pertinentes (zero clichês/coringas)
-- ============================================================================

-- Limpa os dados anteriores para evitar resquícios de repertórios genéricos
TRUNCATE TABLE argumento_repertorio, tema_argumento, repertorios, argumentos, temas, eixos RESTART IDENTITY CASCADE;

-- 1. EIXOS TEMÁTICOS (8 Eixos)
INSERT INTO eixos (id, nome) VALUES
(1, 'Saúde Pública e Bioética'),
(2, 'Tecnologia, Ciência e Sociedade Digital'),
(3, 'Educação e Formação Cidadã'),
(4, 'Meio Ambiente, Clima e Território'),
(5, 'Cidadania, Direitos Humanos e Minorias'),
(6, 'Cultura, Memória e Identidade Nacional'),
(7, 'Trabalho, Economia e Desigualdade'),
(8, 'Segurança Pública, Justiça e Democracia');

-- 2. TEMAS DE REDAÇÃO (24 Temas — 3 por Eixo)
INSERT INTO temas (id, titulo, eixo_id) VALUES
-- Eixo 1: Saúde Pública e Bioética
(1, 'O estigma associado às doenças mentais e os desafios da reforma psiquiátrica no Brasil', 1),
(2, 'A queda nas taxas de cobertura vacinal e o retorno de doenças erradicadas', 1),
(3, 'Desafios para combater a violência obstétrica e humanizar o parto na rede pública', 1),

-- Eixo 2: Tecnologia, Ciência e Sociedade Digital
(4, 'Os impactos da inteligência artificial na autenticidade artística e na propriedade intelectual', 2),
(5, 'Colonialismo de dados e a ameaça à privacidade na economia da vigilância', 2),
(6, 'A proliferação das apostas esportivas online (bets) e o endividamento das famílias brasileiras', 2),

-- Eixo 3: Educação e Formação Cidadã
(7, 'A evasão escolar no ensino médio diante da necessidade de trabalho precoce', 3),
(8, 'Desafios para a efetiva inclusão de estudantes neurodivergentes nas escolas regulares', 3),
(9, 'A desvalorização da carreira docente e o apagão de professores na educação básica', 3),

-- Eixo 4: Meio Ambiente, Clima e Território
(10, 'Racismo ambiental e a vulnerabilidade das periferias frente a eventos climáticos extremos', 4),
(11, 'O avanço do garimpo ilegal e as ameaças à sobrevivência dos povos originários na Amazônia', 4),
(12, 'A crise hídrica urbana e a mercantilização do acesso à água potável no Brasil', 4),

-- Eixo 5: Cidadania, Direitos Humanos e Minorias
(13, 'A invisibilidade do trabalho de cuidado não remunerado exercido pelas mulheres no Brasil', 5),
(14, 'O envelhecimento populacional acelerado e o combate ao etarismo no Brasil contemporâneo', 5),
(15, 'A arquitetura hostil nos grandes centros urbanos e a marginalização da população em situação de rua', 5),

-- Eixo 6: Cultura, Memória e Identidade Nacional
(16, 'A negligência com o patrimônio histórico material e o apagamento da memória nacional', 6),
(17, 'O preconceito linguístico como mecanismo de exclusão social e silenciamento regional', 6),
(18, 'A proteção dos saberes tradicionais de comunidades quilombolas e ribeirinhas', 6),

-- Eixo 7: Trabalho, Economia e Desigualdade
(19, 'A precarização do trabalho mediado por aplicativos e a fragilização da proteção previdenciária', 7),
(20, 'O paradoxo da insegurança alimentar e a persistência da fome em um país agroexportador', 7),
(21, 'A persistência do trabalho análogo à escravidão no campo e na indústria têxtil contemporânea', 7),

-- Eixo 8: Segurança Pública, Justiça e Democracia
(22, 'A crise do sistema penitenciário brasileiro e os entraves para a ressocialização de detentos', 8),
(23, 'A letalidade policial seletiva e o uso de câmeras corporais nas forças de segurança', 8),
(24, 'Desafios para o enfrentamento da violência política de gênero e a sub-representação feminina no Parlamento', 8);

-- 3. ARGUMENTOS (48 Argumentos — 2 para cada um dos 24 temas)
INSERT INTO argumentos (id, descricao) VALUES
-- Tema 1 (Saúde Mental)
(1, 'A persistência de uma mentalidade manicomial estigmatiza o sofrimento psíquico como periculosidade social, desencorajando a busca por atendimento nos Centros de Atenção Psicossocial (CAPS).'),
(2, 'A mercantilização da saúde mental reduz transtornos complexos a diagnósticos rápidos e hipermedicalização, negligenciando determinantes socioeconômicos como o esgotamento laboral.'),
-- Tema 2 (Vacinação)
(3, 'O próprio sucesso histórico do Programa Nacional de Imunizações (PNI) gerou uma falsa percepção de segurança coletiva, diminuindo a adesão parental às campanhas de vacinação infantil.'),
(4, 'A disseminação coordenada de desinformação científica explora o medo e a desconfiança institucional, convertendo uma questão de saúde coletiva em disputa ideológica.'),
-- Tema 3 (Violência Obstétrica)
(5, 'A hierarquização extrema do saber médico silencia a autonomia da gestante sobre o próprio corpo, naturalizando procedimentos invasivos e obsoletos durante o trabalho de parto.'),
(6, 'O viés racial no atendimento hospitalar expõe mulheres negras e indígenas a menores índices de analgesia e a um pré-natal fragmentado na rede pública.'),

-- Tema 4 (IA e Arte/Propriedade Intelectual)
(7, 'O treinamento de modelos generativos com obras protegidas sem consentimento ou remuneração apropria-se do trabalho criativo humano em benefício de conglomerados tecnológicos.'),
(8, 'A padronização algorítmica da estética ameaça esvaziar o caráter crítico, histórico e subjetivo da produção cultural, substituindo a expressão humana por recombinações estatísticas.'),
-- Tema 5 (Colonialismo de Dados)
(9, 'A extração contínua de metadados comportamentais no Sul Global replica lógicas coloniais históricas, convertendo a experiência cotidiana dos cidadãos em matéria-prima gratuita para big techs.'),
(10, 'A opacidade dos termos de uso e o déficit de fiscalização de proteção de dados permitem a discriminação algorítmica na concessão de crédito, seguros e vagas de emprego.'),
-- Tema 6 (Apostas Online / Bets)
(11, 'O design gamificado das plataformas de apostas opera por reforço intermitente programado para induzir a compulsão (ludopatia), atingindo sobretudo jovens e beneficiários de programas sociais.'),
(12, 'A normalização publicitária das apostas por influenciadores e clubes de futebol mascara o risco de ruína financeira sob a falsa promessa de ascensão econômica rápida.'),

-- Tema 7 (Evasão Escolar)
(13, 'A urgência da sobrevivência material impõe à juventude periférica uma escolha excludente entre a permanência escolar e a geração imediata de renda informal para o sustento familiar.'),
(14, 'Um currículo enciclopédico desconectado das vivências territoriais dos estudantes produz alienação pedagógica e enfraquece o sentido da escola como espaço de mobilidade social.'),
-- Tema 8 (Inclusão de Neurodivergentes)
(15, 'A mera matrícula de alunos com Transtorno do Espectro Autista (TEA) ou TDAH sem adaptação pedagógica e sem profissionais de apoio configura uma inclusão meramente burocrática e excludente.'),
(16, 'A padronização dos métodos avaliativos escolares penaliza formas diversas de processamento cognitivo, reforçando estigmas de incapacidade no ambiente escolar.'),
-- Tema 9 (Carreira Docente)
(17, 'A combinação de baixos pisos salariais, jornadas exaustivas em múltiplas escolas e adoecimento docente afasta os jovens universitários das licenciaturas, prenunciando um colapso formativo.'),
(18, 'A perda de autoridade pedagógica e a responsabilização exclusiva do professor por falhas estruturais do Estado corroem o prestígio social do magistério no Brasil.'),

-- Tema 10 (Racismo Ambiental)
(19, 'O processo histórico de urbanização excludente empurrou populações negras e de baixa renda para encostas e várzeas sem drenagem, tornando os desastres climáticos socialmente seletivos.'),
(20, 'A ausência das comunidades afetadas nos conselhos de planejamento urbano perpetua obras públicas que priorizam áreas nobres em detrimento da adaptação climática das periferias.'),
-- Tema 11 (Garimpo e Povos Originários)
(21, 'A contaminação dos rios amazônicos por mercúrio destrói a soberania alimentar e causa danos neurológicos irreversíveis em populações indígenas e ribeirinhas.'),
(22, 'A fragilidade na rastreabilidade da cadeia comercial do ouro permite a lavagem de minérios extraídos ilegalmente de terras demarcadas no mercado financeiro formal.'),
-- Tema 12 (Crise Hídrica e Água)
(23, 'A distribuição desigual da infraestrutura hídrica cria uma escassez fabricada nas periferias urbanas, enquanto setores hidrointensivos usufruem de outorgas amplas e incentivos tarifários.'),
(24, 'A degradação de mananciais pelo desmatamento de matas ciliares e pelo despejo de esgoto in natura compromete a segurança hídrica das metrópoles brasileiras.'),

-- Tema 13 (Trabalho de Cuidado da Mulher)
(25, 'A divisão sexual do trabalho historicamente construída transfere para as mulheres o encargo gratuito de cuidar de crianças, idosos e enfermos, desonerando o Estado e o mercado.'),
(26, 'A "pobreza de tempo" resultante da dupla ou tripla jornada feminina restringe o acesso das mulheres à qualificação profissional, ao lazer e a cargos de liderança política.'),
-- Tema 14 (Envelhecimento e Etarismo)
(27, 'A cultura produtivista contemporânea associa o valor humano exclusivamente à juventude e ao rendimento laboral, descartando a memória e a experiência da população idosa.'),
(28, 'A infraestrutura urbana e os serviços digitais brasileiros ignoram as limitações motoras e visuais da terceira idade, restringindo o direito à cidade e a autonomia financeira do idoso.'),
-- Tema 15 (Arquitetura Hostil e População de Rua)
(29, 'A instalação de pedras pontiagudas, divisórias em bancos e grades sob viadutos substitui políticas de habitação e assistência social pela expulsão estética dos corpos indesejados.'),
(30, 'A higienização do espaço público nega o direito constitucional à cidade e aprofunda a desumanização e a invisibilidade civil das pessoas em situação de rua.'),

-- Tema 16 (Patrimônio Histórico)
(31, 'O subfinanciamento crônico de órgãos de preservação e museus brasileiros expõe acervos insubstituíveis ao risco constante de incêndios e deterioração estrutural.'),
(32, 'A preservação seletiva que privilegia apenas monumentos das elites coloniais desconecta a população do patrimônio público, enfraquecendo o sentimento de pertencimento coletivo.'),
-- Tema 17 (Preconceito Linguístico)
(33, 'A confusão entre a norma-padrão gramatical e a totalidade da língua portuguesa transforma sotaques e variedades regionais ou periféricas em marcadores de inferioridade intelectual.'),
(34, 'A ridicularização do falar popular nas escolas, na mídia e em processos seletivos opera como barreira simbólica de acesso a espaços de poder e cidadania.'),
-- Tema 18 (Saberes Tradicionais Quilombolas/Ribeirinhos)
(35, 'A biopirataria e a apropriação comercial de conhecimentos fitoterápicos ancestrais sem repartição de benefícios violam os direitos coletivos das comunidades tradicionais.'),
(36, 'A lentidão na titulação definitiva de territórios quilombolas ameaça a transmissão intergeracional de técnicas agrícolas sustentáveis e manifestações culturais afro-brasileiras.'),

-- Tema 19 (Trabalho por Aplicativos)
(37, 'A retórica do "empreendedorismo de si mesmo" mascara a subordinação algorítmica, na qual plataformas definem tarifas, punições e jornadas sem assegurar direitos trabalhistas mínimos.'),
(38, 'A transferência integral dos custos operacionais e dos riscos de acidentes de trânsito para os entregadores e motoristas sobrecarrega o SUS e fragiliza a previdência social.'),
-- Tema 20 (Insegurança Alimentar no Brasil)
(39, 'A priorização governamental e creditícia das monoculturas de exportação (commodities) em detrimento da agricultura familiar encarece os alimentos básicos que abastecem a mesa brasileira.'),
(40, 'A formação de "desertos alimentares" nas periferias urbanas dificulta o acesso físico e financeiro a alimentos in natura, combinando desnutrição com obesidade por ultraprocessados.'),
-- Tema 21 (Trabalho Análogo à Escravidão)
(41, 'A terceirização em cadeia nas indústrias da moda e do agronegócio dilui a responsabilidade jurídica das grandes marcas que lucram com oficinas clandestinas e servidão por dívida.'),
(42, 'A ausência de alternativas econômicas nas regiões de origem dos trabalhadores resgatados provoca a reincidência da vulnerabilidade ao aliciamento predatório.'),

-- Tema 22 (Sistema Penitenciário)
(43, 'O encarceramento em massa de jovens provisórios por delitos não violentos transforma os presídios superlotados em agências de recrutamento de facções criminosas.'),
(44, 'A escassez de programas de estudo, remição pela leitura e capacitação profissional intramuros inviabiliza a reintegração social e retroalimenta as taxas de reincidência criminal.'),
-- Tema 23 (Letalidade Policial e Câmeras Corporais)
(45, 'A lógica bélica de segurança pública trata territórios periféricos como zonas de guerra, vitimando desproporcionalmente a juventude negra sob o pretexto do combate às drogas.'),
(46, 'O uso obrigatório de câmeras corporais protege tanto o cidadão contra abusos de autoridade quanto o próprio policial através da produção de provas técnicas auditáveis.'),
-- Tema 24 (Violência Política de Gênero)
(47, 'O assédio moral, as ameaças virtuais e a interrupção sistemática da fala feminina no Parlamento buscam expulsar as mulheres da esfera decisória e preservar o monopólio masculino do poder.'),
(48, 'O uso de candidaturas femininas fictícias ("laranjas") pelos partidos políticos burla a legislação de cotas eleitorais e perpetua o déficit de representatividade democrática.');

-- 4. REPERTÓRIOS SOCIOCULTURAIS ESPECÍFICOS (48 Repertórios — Sem clichês/coringas)
INSERT INTO repertorios (id, categoria, conteudo) VALUES
-- Eixo 1 (Saúde Mental, Vacinação, Violência Obstétrica)
(1, 'Psiquiatria', 'Nise da Silveira (1905–1999) — Médica psiquiatra brasileira que revolucionou o tratamento mental no Engenho de Dentro (RJ), substituindo o eletrochoque e a lobotomia pela terapia ocupacional e pela expressão artística no Museu de Imagens do Inconsciente.'),
(2, 'Literatura', 'Lima Barreto, em "Diário do Hospício" e "O Cemitério dos Vivos" (1920), relata sua própria internação no Hospital Nacional de Alienados, denunciando como o manicômio funcionava como depósito social para pobres, negros e marginalizados.'),
(3, 'Legislação', 'Lei Antimanicomial (Lei nº 10.216/2001) — Marco da Reforma Psiquiátrica brasileira (inspirada por Paulo Delgado), que redireciona a assistência em saúde mental para o convívio comunitário e proíbe internações em instituições com características asilares.'),
(4, 'História', 'Revolta da Vacina (1904) — Episódio no Rio de Janeiro em que a campanha de vacinação obrigatória contra a varíola, conduzida de forma autoritária e sem pedagogia sanitária por Oswaldo Cruz e Pereira Passos, gerou forte resistência popular.'),
(5, 'Saúde Coletiva', 'Conceito de "Hesitação Vacinal" (OMS / Grupo SAGE) — Define o atraso ou recusa na aceitação de vacinas seguras apesar de sua disponibilidade, motivado pelos "3 Cs": Complacência (baixa percepção de risco), Conveniência (barreiras de acesso) e Confiança (desinformação).'),
(6, 'Audiovisual', 'Documentário "O Renascimento do Parto" (2013, dir. Eduardo Chauvet) — Expõe a epidemia de cesarianas desnecessárias no Brasil e a cascata de intervenções médicas que retiram o protagonismo da mulher no nascimento.'),
(7, 'Saúde Coletiva', 'Pesquisa "Nascer no Brasil" (Fiocruz) — Maior inquérito nacional sobre parto e nascimento, que comprovou estatisticamente que mulheres pretas recebem menos anestesia local em episiotomias e menos orientação pré-natal do que mulheres brancas.'),

-- Eixo 2 (IA e Arte, Colonialismo de Dados, Apostas Online)
(8, 'Filosofia', 'Walter Benjamin, no ensaio "A Obra de Arte na Era de sua Reprodutibilidade Técnica" (1936), cria o conceito de "Aura": a existência única e autêntica da obra de arte ligada ao seu tempo e espaço, que se perde na reprodução serial e automatizada.'),
(9, 'Tecnologia', 'Pesquisadoras Timnit Gebru e Emily Bender, no artigo científico "Stochastic Parrots" (Papagaios Estocásticos, 2021), demonstram que grandes modelos de linguagem não compreendem sentido nem possuem intencionalidade artística, apenas costuram padrões probabilísticos extraídos de obras humanas.'),
(10, 'Sociologia', 'Nick Couldry e Ulises Mejias, na obra "The Costs of Connection" (2019), cunham o conceito de "Colonialismo de Dados": a apropriação da vida humana por meio de dados digitais, preparando o terreno para uma nova fase do capitalismo assim como o colonialismo histórico extraiu terras e minérios.'),
(11, 'Sociologia', 'Shoshana Zuboff, professora de Harvard e autora de "A Era do Capitalismo de Vigilância" (2019), explica como a experiência humana privada é unilateralmente reivindicada pelas big techs para fabricar produtos de predição e modificação de comportamento.'),
(12, 'Antropologia', 'Natasha Dow Schüll, antropóloga do MIT e autora de "Addiction by Design" (Vício por Design, 2012), comprova como algoritmos de jogos eletrônicos de azar são projetados arquitetonicamente para colocar o usuário na "zona da máquina", mantendo-o apostando até o esgotamento financeiro.'),
(13, 'Economia', 'Nota Técnica do Banco Central do Brasil (2024) sobre o mercado de apostas — Revelou o impacto macroeconômico do fluxo bilionário de recursos de famílias de baixa renda e beneficiários do Bolsa Família transferidos mensalmente para empresas de apostas online.'),

-- Eixo 3 (Evasão Escolar, Neurodivergência, Carreira Docente)
(14, 'Sociologia', 'Bernard Charlot, sociólogo da educação francês radicado no Brasil, em "Da Relação com o Saber" (2000), demonstra que o "fracasso escolar" não é uma deficiência interna do aluno pobre, mas o resultado da ruptura de sentido entre a escola e a sobrevivência cotidiana do jovem.'),
(15, 'Educação', 'Anísio Teixeira (1900–1971) e o Manifesto dos Pioneiros da Educação Nova (1932) — Defendeu a escola pública, gratuita, integral e laica, alertando que uma educação dualista (uma escola intelectual para a elite e outra precária para o povo) perpetua a estrutura de classes no Brasil.'),
(16, 'Sociologia', 'Judy Singer, socióloga australiana que cunhou o termo "Neurodiversidade" (1998) — Propõe que condições como autismo, TDAH e dislexia não são patologias a serem "curadas", mas variações naturais do genoma humano que exigem adaptação ambiental e pedagógica.'),
(17, 'Legislação', 'Lei Berenice Piana (Lei nº 12.764/2012) e Estatuto da Pessoa com Deficiência (Lei nº 13.146/2015) — Asseguram o direito do estudante autista e com deficiência a acompanhante especializado na rede regular de ensino, proibindo a cobrança de taxas extras pelas escolas.'),
(18, 'Educação', 'António Nóvoa, reitor honorário da Universidade de Lisboa, em "Profissão Professor" (1995), analisa o fenômeno da "proletarização docente": o processo pelo qual os professores sofrem perda de autonomia pedagógica, intensificação burocrática do trabalho e desprestígio salarial.'),
(19, 'Pesquisa', 'Estudo "Risco de Apagão de Professores no Brasil" (Instituto Semesp) — Projeta que o Brasil poderá enfrentar um déficit de mais de 235 mil professores na educação básica até 2040 devido ao envelhecimento da categoria e à queda drástica de concluintes nas licenciaturas.'),

-- Eixo 4 (Racismo Ambiental, Garimpo/Amazônia, Crise Hídrica)
(20, 'Geografia', 'Milton Santos, em "O Espaço do Cidadão" (1987), formula o conceito de "Cidadanias Mutiladas": a forma como a organização desigual do território urbano brasileiro nega infraestrutura básica (saneamento, drenagem e transporte) aos moradores das periferias.'),
(21, 'Ecologia Política', 'Joan Martínez Alier, economista espanhol autor de "O Ecologismo dos Pobres" (2002), demonstra que os conflitos ambientais surgem da distribuição desigual dos custos ecológicos, nos quais populações vulneráveis lutam pela sobrevivência de seus territórios contra a exploração predatória.'),
(22, 'Antropologia', 'Davi Kopenawa Yanomami e Bruce Albert, na obra seminal "A Queda do Céu" (2015), denunciam o impacto devastador dos garimpeiros ("comedores de terra") que espalham fumaça de epidemias e mercúrio ("xawara") nas águas e florestas dos povos originários.'),
(23, 'Literatura', 'Euclides da Cunha, nos ensaios amazônicos de "À Margem da História" (1909), já denunciava a exploração predatória da floresta e dos trabalhadores locais, definindo o ciclo extrativista irracional como a criação de um deserto sobre a maior biodiversidade do planeta.'),
(24, 'Geografia', 'Carlos Walter Porto-Gonçalves, geógrafo brasileiro autor de "A Globalização da Natureza e a Natureza da Globalização" (2006), analisa como a água deixou de ser tratada como bem comum vital para ser disputada geopoliticamente como mercadoria financeira.'),
(25, 'Legislação', 'Resolução nº 64/292 da Assembleia Geral da ONU (2010) — Reconhece formalmente o acesso à água potável limpa e ao esgotamento sanitário como um direito humano essencial para o pleno gozo da vida.'),

-- Eixo 5 (Trabalho de Cuidado, Etarismo, Arquitetura Hostil)
(26, 'Economia Feminista', 'Nancy Folbre, economista norte-americana autora de "The Invisible Heart" (O Coração Invisível, 2001), demonstra que a economia de mercado depende inteiramente da "economia do cuidado" familiar, que entra em colapso quando as mulheres são sobrecarregadas sem políticas públicas de apoio.'),
(27, 'Pesquisa', 'Pesquisa Nacional por Amostra de Domicílios Contínua (PNAD/IBGE - Outras Formas de Trabalho) — Evidencia que as mulheres brasileiras dedicam quase o dobro de horas semanais aos afazeres domésticos e cuidado de pessoas em comparação aos homens (cerca de 21,3h contra 11,7h).'),
(28, 'Filosofia', 'Simone de Beauvoir, no clássico "A Velhice" (1970), denuncia a "conspiração do silêncio" da sociedade capitalista em torno do envelhecimento: o idoso, ao deixar de ser força produtiva, é tratado como uma espécie estranha e despojado de sua dignidade civil.'),
(29, 'Saúde Coletiva', 'Alexandre Kalache, médico epidemiologista brasileiro e ex-diretor do Programa de Envelhecimento da OMS, alerta que "o Brasil está envelhecendo antes de enriquecer", exigindo políticas urgentes de "Envelhecimento Ativo" e cidades amigáveis à pessoa idosa.'),
(30, 'Legislação', 'Lei Padre Júlio Lancellotti (Lei nº 14.489/2022) — Altera o Estatuto da Cidade para proibir o emprego de técnicas de construção hostis (como pinos metálicos, pedras ásperas e muros pontiagudos) que tenham como objetivo afastar pessoas em situação de rua dos espaços públicos.'),
(31, 'Urbanismo', 'Jane Jacobs, em "Morte e Vida de Grandes Cidades" (1961), defende que a vitalidade e a segurança reais de uma metrópole dependem de calçadas acolhedoras, diversidade de usos e convivência humana ("olhos da rua"), e não da segregação espacial ou militarização estética.'),

-- Eixo 6 (Patrimônio Histórico, Preconceito Linguístico, Saberes Tradicionais)
(32, 'História', 'Aloísio Magalhães (1927–1982), designer e ex-diretor do IPHAN, introduziu o conceito de "Bens Culturais de Referência", defendendo que o patrimônio brasileiro não se resume ao barroco colonial de "pedra e cal", mas abrange o fazer popular, indígena e afro-brasileiro.'),
(33, 'História', 'Jacques Le Goff, historiador francês autor de "História e Memória" (1977), demonstra que os monumentos e acervos materiais são os suportes físicos da identidade coletiva; destruí-los ou abandoná-los equivale a produzir uma amnésia política na nação.'),
(34, 'Linguística', 'Marcos Bagno, linguista brasileiro e autor de "Preconceito Linguístico: o que é, como se faz" (1999), comprova que não existe "erro de português" nas variedades populares, mas regras gramaticais próprias que são estigmatizadas exclusivamente pelo desprestígio social de seus falantes.'),
(35, 'Literatura', 'Oswald de Andrade, no poema "Pronominais" (1925), sintetiza a tensão entre a gramática artificial imposta pelas elites e a língua viva falada pelo povo brasileiro: "Dê-me um cigarro / Diz a gramática / Do professor e do aluno / E do mulato sabido / Mas o bom negro e o bom branco / Da Nação Brasileira / Dizem todos os dias / Deixa disso camarada / Me dá um cigarro".'),
(36, 'Antropologia', 'Antônio Bispo dos Santos (Nêgo Bispo, 1959–2023), pensador quilombola piauiense e autor de "A Terra Dá, a Terra Quer" (2023), formula o conceito de "Contracolonização" e "Biointeração", opondo o modo de vida sustentável das comunidades tradicionais à lógica extrativista predatória.'),
(37, 'Legislação', 'Decreto nº 3.551/2000 (Registro de Bens Culturais de Natureza Imaterial) — Instituiu no Brasil o inventário do Patrimônio Imaterial pelo IPHAN, protegendo saberes, celebrações e formas de expressão como o Ofício das Baianas de Acarajé, o Samba de Roda e a Arte Kusiwa Wajãpi.'),

-- Eixo 7 (Trabalho por Apps, Fome/Insegurança Alimentar, Trabalho Escravo)
(38, 'Sociologia', 'Ludmila Costhek Abílio, socióloga da Unicamp, desenvolve o conceito de "Gerenciamento Algorítmico e Autogerenciamento Subordinado", explicando que a uberização não cria empreendedores autônomos, mas trabalhadores just-in-time disponíveis integralmente sem qualquer garantia mínima.'),
(39, 'Audiovisual', 'Filme "Você Não Estava Aqui" (Sorry We Missed You, 2019, dir. Ken Loach) — Retrata o drama de Ricky, um trabalhador que compra uma van acreditando tornar-se "seu próprio patrão" em uma franquia de entregas rápidas, mas vê sua família desmoronar sob multas abusivas e jornadas de 14 horas.'),
(40, 'Geografia', 'Josué de Castro, médico e geógrafo pernambucano autor do clássico "Geografia da Fome" (1946), provou ao mundo que a fome no Brasil não é um fenômeno natural ou climático (como a seca), mas uma praga fabricada socialmente pelo latifúndio monocultor e pela concentração de renda.'),
(41, 'Economia', 'Amartya Sen, Prêmio Nobel de Economia, na obra "Pobreza e Fomes" (1981), demonstra que as grandes crises de fome da história moderna não ocorreram por falta física de produção de alimentos, mas pela perda da "capacidade de acesso" (entitlements) e poder de compra das camadas mais pobres.'),
(42, 'Sociologia', 'José de Souza Martins, sociólogo da USP e autor de "O Cativeiro da Terra" (1979) e "A Sociedade Vista do Abismo", analisa a persistência da "escravidão por dívida" (sistema de barracão ou peonagem) como engrenagem estrutural da acumulação econômica na fronteira agrícola brasileira.'),
(43, 'Legislação', 'Portaria do "Cadastro de Empregadores" (Lista Suja do Trabalho Escravo - MTE) e Emenda Constitucional nº 81/2014 — Instrumentos jurídicos brasileiros reconhecidos pela OIT que determinam a transparência pública dos infratores e a expropriação de propriedades rurais e urbanas onde for flagrado trabalho escravo.'),

-- Eixo 8 (Sistema Penitenciário, Letalidade Policial, Violência Política de Gênero)
(44, 'Sociologia', 'Loïc Wacquant, sociólogo francês autor de "As Prisões da Miséria" (1999), analisa a transição do "Estado de Bem-Estar Social" para o "Estado Penal": em vez de combater a pobreza com políticas sociais, o Estado passa a gerir a marginalidade urbana criminalizando e encarcerando em massa os mais pobres.'),
(45, 'Direito', 'Julgamento da ADPF 347 pelo Supremo Tribunal Federal (2015/2023) — O STF declarou que o sistema prisional brasileiro vive um "Estado de Coisas Inconstitucional", caracterizado pela violação massiva, generalizada e sistemática de direitos fundamentais devido à omissão estrutural dos poderes públicos.'),
(46, 'Filosofia', 'Achille Mbembe, filósofo camaronês autor do ensaio "Necropolítica" (2003), define como o poder soberano contemporâneo opera decidindo quem deve viver e quem pode morrer, normalizando zonas de exceção jurídica onde a letalidade estatal contra corpos negros e periféricos não gera responsabilização.'),
(47, 'Segurança Pública', 'Estudo da Fundação Getulio Vargas (FGV Direito SP) sobre Câmeras Operacionais Portáteis na Polícia Militar de SP — Comprovou empiricamente que o uso de câmeras nos uniformes reduziu em mais de 60% a letalidade em confrontos policiais, além de diminuir as mortes dos próprios agentes.'),
(48, 'Ciência Política', 'Carole Pateman, cientista política britânica autora de "O Contrato Sexual" (1988), demonstra que o pacto político moderno foi fundado sobre a divisão entre a esfera pública (masculina) e a esfera privada/doméstica (feminina), explicando por que a presença da mulher no Parlamento ainda é tratada como uma invasão.');

-- 5. RELACIONAMENTO TEMA <-> ARGUMENTO
INSERT INTO tema_argumento (tema_id, argumento_id) VALUES
(1, 1), (1, 2),
(2, 3), (2, 4),
(3, 5), (3, 6),
(4, 7), (4, 8),
(5, 9), (5, 10),
(6, 11), (6, 12),
(7, 13), (7, 14),
(8, 15), (8, 16),
(9, 17), (9, 18),
(10, 19), (10, 20),
(11, 21), (11, 22),
(12, 23), (12, 24),
(13, 25), (13, 26),
(14, 27), (14, 28),
(15, 29), (15, 30),
(16, 31), (16, 32),
(17, 33), (17, 34),
(18, 35), (18, 36),
(19, 37), (19, 38),
(20, 39), (20, 40),
(21, 41), (21, 42),
(22, 43), (22, 44),
(23, 45), (23, 46),
(24, 47), (24, 48);

-- 6. RELACIONAMENTO ARGUMENTO <-> REPERTÓRIO (2 repertórios únicos por tema, sem repetição intratema)
INSERT INTO argumento_repertorio (argumento_id, repertorio_id) VALUES
-- Tema 1 (Saúde Mental) -> Repertórios 1, 2, 3
(1, 1), (1, 3), (2, 2),
-- Tema 2 (Vacinação) -> Repertórios 4, 5
(3, 5), (4, 4),
-- Tema 3 (Violência Obstétrica) -> Repertórios 6, 7
(5, 6), (6, 7),
-- Tema 4 (IA e Arte) -> Repertórios 8, 9
(7, 9), (8, 8),
-- Tema 5 (Colonialismo de Dados) -> Repertórios 10, 11
(9, 10), (10, 11),
-- Tema 6 (Bets / Apostas) -> Repertórios 12, 13
(11, 12), (12, 13),
-- Tema 7 (Evasão Escolar) -> Repertórios 14, 15
(13, 14), (14, 15),
-- Tema 8 (Neurodivergentes) -> Repertórios 16, 17
(15, 17), (16, 16),
-- Tema 9 (Carreira Docente) -> Repertórios 18, 19
(17, 19), (18, 18),
-- Tema 10 (Racismo Ambiental) -> Repertórios 20, 21
(19, 20), (20, 21),
-- Tema 11 (Garimpo e Indígenas) -> Repertórios 22, 23
(21, 22), (22, 23),
-- Tema 12 (Crise Hídrica) -> Repertórios 24, 25
(23, 24), (24, 25),
-- Tema 13 (Trabalho de Cuidado) -> Repertórios 26, 27
(25, 26), (26, 27),
-- Tema 14 (Etarismo) -> Repertórios 28, 29
(27, 28), (28, 29),
-- Tema 15 (Arquitetura Hostil) -> Repertórios 30, 31
(29, 30), (30, 31),
-- Tema 16 (Patrimônio Histórico) -> Repertórios 32, 33
(31, 33), (32, 32),
-- Tema 17 (Preconceito Linguístico) -> Repertórios 34, 35
(33, 34), (34, 35),
-- Tema 18 (Saberes Tradicionais) -> Repertórios 36, 37
(35, 36), (36, 37),
-- Tema 19 (Uberização / Apps) -> Repertórios 38, 39
(37, 38), (38, 39),
-- Tema 20 (Insegurança Alimentar) -> Repertórios 40, 41
(39, 40), (40, 41),
-- Tema 21 (Trabalho Escravo) -> Repertórios 42, 43
(41, 43), (42, 42),
-- Tema 22 (Sistema Prisional) -> Repertórios 44, 45
(43, 44), (44, 45),
-- Tema 23 (Letalidade Policial / Câmeras) -> Repertórios 46, 47
(45, 46), (46, 47),
-- Tema 24 (Violência Política de Gênero) -> Repertórios 48
(47, 48);

-- 7. Repertório complementar específico para o Tema 24 (Lei 14.192/2021)
INSERT INTO repertorios (id, categoria, conteudo) VALUES
(49, 'Legislação', 'Lei de Combate à Violência Política contra a Mulher (Lei nº 14.192/2021) — Tipifica como crime eleitoral qualquer ação que vise constranger, humilhar, perseguir ou impedir o exercício dos direitos políticos e do mandato parlamentar de mulheres.');

INSERT INTO argumento_repertorio (argumento_id, repertorio_id) VALUES
(48, 49);

-- Atualiza as sequences do PostgreSQL
SELECT setval('eixos_id_seq', (SELECT MAX(id) FROM eixos));
SELECT setval('temas_id_seq', (SELECT MAX(id) FROM temas));
SELECT setval('argumentos_id_seq', (SELECT MAX(id) FROM argumentos));
SELECT setval('repertorios_id_seq', (SELECT MAX(id) FROM repertorios));

-- ============================================================================
-- 8. EXPANSÃO MASSIVA DA BASE DE DADOS (Temas 25 a 84 | Argumentos 49 a 168 | Repertórios 50 a 169)
-- +2 Novos Eixos Temáticos (Eixos 9 e 10)
-- +60 Novos Temas de Redação
-- +120 Novas Teses Argumentativas
-- +120 Novos Repertórios Socioculturais Autênticos e Específicos
-- ============================================================================

INSERT INTO eixos (id, nome) VALUES
(9, ' Infância, Juventude e Relações Familiares'),
(10, 'Mobilidade Urbana, Habitação e Direito à Cidade');

-- Corrigindo eventual espaço inicial no nome do Eixo 9
UPDATE eixos SET nome = 'Infância, Juventude e Relações Familiares' WHERE id = 9;

INSERT INTO temas (id, titulo, eixo_id) VALUES
-- Eixo 1: Saúde Pública e Bioética (Temas 25 a 30)
(25, 'O uso indiscriminado de medicamentos para emagrecimento e a ditadura dos padrões corporais', 1),
(26, 'Os impactos do consumo de cigarros eletrônicos (vapes) na saúde respiratória da juventude', 1),
(27, 'Desafios para a ampliação dos cuidados paliativos e a garantia da morte digna no SUS', 1),
(28, 'A proliferação de superbactérias e os riscos da automedicação por antibióticos no Brasil', 1),
(29, 'Entraves para a doação de órgãos e a redução da recusa familiar no sistema de transplantes', 1),
(30, 'A negligência com as doenças tropicais negligenciadas nas regiões mais pobres do país', 1),

-- Eixo 2: Tecnologia, Ciência e Sociedade Digital (Temas 31 a 36)
(31, 'A disseminação de deepfakes e os riscos à integridade do processo democrático e à honra individual', 2),
(32, 'O descarte irregular de lixo eletrônico (e-waste) e a obsolescência programada de dispositivos', 2),
(33, 'A exclusão digital de idosos e populações rurais diante da digitalização dos serviços públicos', 2),
(34, 'A economia da atenção, o vício em vídeos curtos e a fragmentação cognitiva dos jovens', 2),
(35, 'A exposição infantil lucrativa nas redes sociais (sharenting) e a adultização precoce', 2),
(36, 'Os impactos ambientais e hídricos do consumo energético de data centers e modelos de IA', 2),

-- Eixo 3: Educação e Formação Cidadã (Temas 37 a 42)
(37, 'O analfabetismo funcional e a crise de interpretação leitora entre jovens brasileiros', 3),
(38, 'A importância da educação financeira nas escolas para conter o superendividamento juvenil', 3),
(39, 'A violência extrema e os ataques às escolas: entre o extremismo virtual e a crise de convivência', 3),
(40, 'O fechamento de escolas do campo e os desafios para garantir a educação rural contextualizada', 3),
(41, 'A carência de infraestrutura científica, laboratórios e bibliotecas nas escolas públicas', 3),
(42, 'O ensino médio noturno e os obstáculos enfrentados pelo estudante trabalhador no Brasil', 3),

-- Eixo 4: Meio Ambiente, Clima e Território (Temas 43 a 48)
(43, 'A devastação silenciosa do Cerrado e o comprometimento do berço das águas no Brasil', 4),
(44, 'O branqueamento dos recifes de corais e a poluição plástica na Amazônia Azul', 4),
(45, 'A prática de greenwashing corporativo e a falsa sustentabilidade no mercado de consumo', 4),
(46, 'Os impactos dos megaprojetos de energia renovável sobre comunidades tradicionais no Nordeste', 4),
(47, 'O uso intensivo de agrotóxicos banidos no exterior e a contaminação de lençóis freáticos', 4),
(48, 'O deslocamento forçado de refugiados climáticos internos diante de secas e enchentes', 4),

-- Eixo 5: Cidadania, Direitos Humanos e Minorias (Temas 49 a 54)
(49, 'A subnotificação de casos de feminicídio e as falhas nas redes de proteção à mulher', 5),
(50, 'A transfobia institucional e os obstáculos para a inserção da população trans no mercado formal', 5),
(51, 'A intolerância religiosa contra matrizes africanas e a laicidade seletiva do Estado brasileiro', 5),
(52, 'A xenofobia seletiva contra imigrantes e refugiados do Sul Global no Brasil', 5),
(53, 'A invisibilidade da comunidade surda e o déficit de intérpretes de Libras nos serviços essenciais', 5),
(54, 'A precariedade do acolhimento institucional e os desafios da adoção tardia no Brasil', 5),

-- Eixo 6: Cultura, Memória e Identidade Nacional (Temas 55 a 60)
(55, 'A elitização do acesso ao cinema, ao teatro e aos equipamentos culturais nas periferias', 6),
(56, 'A criminalização histórica das manifestações culturais periféricas como o funk e o rap', 6),
(57, 'A extinção de línguas indígenas nativas e a perda de cosmologias originárias no Brasil', 6),
(58, 'A repatriação de artefatos históricos e fósseis brasileiros saqueados por museus estrangeiros', 6),
(59, 'A crise das bibliotecas comunitárias e o impacto da taxação de livros na formação leitora', 6),
(60, 'A apropriação cultural e o esvaziamento simbólico de tradições populares pela indústria do entretenimento', 6),

-- Eixo 7: Trabalho, Economia e Desigualdade (Temas 61 a 66)
(61, 'A síndrome de burnout, as metas abusivas e a crise do direito à desconexão laboral', 7),
(62, 'O debate sobre a redução da jornada de trabalho (escala 6x1) e a qualidade de vida do trabalhador', 7),
(63, 'A regressividade tributária sobre o consumo e o agravamento da concentração de renda no Brasil', 7),
(64, 'A desertificação bancária em pequenos municípios e a vulnerabilidade a golpes financeiros', 7),
(65, 'O trabalho infantil artístico e digital: os limites entre o talento mirim e a exploração econômica', 7),
(66, 'A informalidade crônica e a desproteção de trabalhadoras domésticas diaristas no Brasil', 7),

-- Eixo 8: Segurança Pública, Justiça e Democracia (Temas 67 a 72)
(67, 'O reconhecimento facial na segurança pública e os falsos positivos decorrentes do viés racial', 8),
(68, 'O fenômeno dos "desaparecidos forçados" e a dor das famílias sem resposta estatal', 8),
(69, 'A proliferação dos desertos de notícias e a violência contra jornalistas no interior do país', 8),
(70, 'A morosidade judiciária e a assimetria no acesso à Defensoria Pública pelos mais pobres', 8),
(71, 'A expansão do domínio territorial de milícias e facções sobre serviços básicos nas metrópoles', 8),
(72, 'A justiça restaurativa como alternativa eficaz à cultura punitivista nos conflitos juvenis', 8),

-- Eixo 9: Infância, Juventude e Relações Familiares (Temas 73 a 78)
(73, 'O abandono paterno afetivo e material e a sobrecarga das mães solo no Brasil', 9),
(74, 'A gravidez na adolescência como fator de interrupção da trajetória escolar e reprodução da pobreza', 9),
(75, 'O isolamento social juvenil (fenômeno hikikomori) e a fragilização dos laços presenciais', 9),
(76, 'A hipermedicalização da infância diante de comportamentos naturais do desenvolvimento infantil', 9),
(77, 'O trabalho infantil doméstico invisibilizado e a reprodução intergeracional da servidão', 9),
(78, 'A orfandade decorrente da violência letal e de crises sanitárias e o desamparo psicossocial', 9),

-- Eixo 10: Mobilidade Urbana, Habitação e Direito à Cidade (Temas 79 a 84)
(79, 'A gentrificação dos centros históricos e a expulsão imobiliária das populações tradicionais', 10),
(80, 'A crise do transporte público coletivo e o debate sobre a Tarifa Zero nas metrópoles', 10),
(81, 'O déficit habitacional brasileiro e a coexistência de milhões de imóveis ociosos nos centros urbanos', 10),
(82, 'A falta de iluminação e planejamento urbano sob a ótica de gênero e a insegurança feminina nas ruas', 10),
(83, 'A epidemia de sinistros envolvendo motociclistas e o custo humano da velocidade nas entregas urbanas', 10),
(84, 'A supressão da arborização urbana e a formação de ilhas de calor extremas nos bairros periféricos', 10);

-- 9. NOVOS ARGUMENTOS (49 a 168 — 2 por cada novo tema)
INSERT INTO argumentos (id, descricao) VALUES
-- Tema 25 (Medicamentos de emagrecimento)
(49, 'A estetização farmacológica transforma medicamentos destinados ao controle do diabetes em mercadorias de estilo de vida, provocando desabastecimento para pacientes crônicos.'),
(50, 'A pressão algorítmica das redes sociais por corpos irreais patologiza a diversidade morfológica humana e estimula o uso sem prescrição de substâncias com graves efeitos colaterais.'),
-- Tema 26 (Cigarros eletrônicos / Vapes)
(51, 'A indústria tabagista utiliza aromas adocicados, design tecnológico e influenciadores digitais para recrutar adolescentes ao vício em nicotina, revertendo décadas de queda do tabagismo no Brasil.'),
(52, 'A comercialização clandestina de dispositivos eletrônicos para fumar impede o controle sanitário sobre metais pesados e solventes tóxicos que causam lesões pulmonares agudas (EVALI).'),
-- Tema 27 (Cuidados Paliativos)
(53, 'O paradigma biomédico hospitalocêntrico encara a morte como fracasso técnico, submetendo pacientes terminais à obstinação terapêutica dolorosa (distanásia) em vez de priorizar o alívio do sofrimento.'),
(54, 'A escassez de equipes multidisciplinares de cuidados paliativos na atenção básica restringe o direito a uma despedida digna e humanizada às camadas de alta renda.'),
-- Tema 28 (Superbactérias e Automedicação)
(55, 'A cultura da automedicação e a interrupção precoce de tratamentos com antibióticos aceleram a seleção natural de cepas bacterianas multirresistentes, ameaçando procedimentos cirúrgicos básicos.'),
(56, 'O uso indiscriminado de antimicrobianos na pecuária intensiva e o descarte hospitalar inadequado contaminam ecossistemas aquáticos, convertendo a resistência bacteriana em uma crise de Saúde Única.'),
-- Tema 29 (Doação de Órgãos)
(57, 'A ausência de diálogo prévio no núcleo familiar sobre a vontade do doador, somada ao desconhecimento acerca do diagnóstico de morte encefálica, eleva os índices de recusa nas entrevistas hospitalares.'),
(58, 'Assimetrias logísticas na captação e no transporte aéreo de órgãos entre as regiões brasileiras ocasionam o desperdício de tecidos vitais fora dos grandes eixos hospitalares.'),
-- Tema 30 (Doenças Tropicais Negligenciadas)
(59, 'Como enfermidades como doença de Chagas, esquistossomose e hanseníase atingem populações sem poder aquisitivo, a indústria farmacêutica global destina investimentos ínfimos à pesquisa de novos fármacos.'),
(60, 'A persistência de doenças infectoparasitárias do século XIX no Brasil contemporâneo reflete a omissão estatal na universalização do saneamento básico e da habitação salubre.'),

-- Tema 31 (Deepfakes e Democracia)
(61, 'A síntese hiper-realista de voz e imagem por inteligência artificial corrói o valor probatório do registro audiovisual, instaurando um ceticismo generalizado que favorece a manipulação eleitoral.'),
(62, 'O uso de deepfakes pornográficos não consensuais atinge majoritariamente mulheres e adolescentes em ambiente escolar, configurando uma nova modalidade de violência psicológica e difamação virtual.'),
-- Tema 32 (Lixo Eletrônico e Obsolescência)
(63, 'A obsolescência programada — tanto física quanto via atualizações de software — encurta artificialmente a vida útil de aparelhos e gera montanhas de resíduos tóxicos sem logística reversa efetiva.'),
(64, 'A reciclagem informal de placas e baterias sem equipamentos de proteção expõe catadores de baixa renda à inalação de chumbo, cádmio e mercúrio.'),
-- Tema 33 (Exclusão Digital de Idosos e Rurais)
(65, 'O fechamento de postos de atendimento presencial e a exigência exclusiva de aplicativos governamentais convertem a falta de letramento digital e de conectividade em barreira de acesso a direitos previdenciários.'),
(66, 'A concentração da infraestrutura de fibra óptica e 5G nos centros comercialmente rentáveis perpetua um apartheid tecnológico no campo e nas comunidades tradicionais.'),
-- Tema 34 (Economia da Atenção e Vídeos Curtos)
(67, 'O feed infinito baseado em vídeos ultracurtos condiciona o cérebro jovem a descargas rápidas de dopamina, reduzindo a tolerância ao esforço intelectual prolongado e à leitura profunda.'),
(68, 'A captura mercantil do tempo livre pelos algoritmos substitui o ócio criativo e o convívio comunitário por um estado contínuo de hiperestimulação ansiosa.'),
-- Tema 35 (Sharenting e Exposição Infantil)
(69, 'A monetização da rotina íntima de crianças por pais influenciadores viola o direito fundamental à privacidade e cria uma pegada digital indelével sem o consentimento do menor.'),
(70, 'A submissão precoce de crianças a métricas de engajamento e patrocinadores borra a fronteira entre brincadeira e trabalho infantil, induzindo quadros de ansiedade performática.'),
-- Tema 36 (Consumo Energético e Hídrico da IA)
(71, 'A aparência imaterial da "nuvem" oculta uma infraestrutura física massiva de data centers que consome milhões de litros de água potável para resfriamento em regiões já submetidas ao estresse hídrico.'),
(72, 'A corrida corporativa por modelos de inteligência artificial cada vez maiores eleva exponencialmente a demanda elétrica global, retardando as metas de descarbonização energética.'),

-- Tema 37 (Analfabetismo Funcional)
(73, 'A expansão quantitativa da escolarização brasileira não foi acompanhada pelo domínio pleno da leitura crítica, formando cidadãos capazes de decodificar letras, mas vulneráveis à manipulação informacional.'),
(74, 'A escassez de práticas leitoras diversificadas na infância e a precarização do ensino fundamental comprometem a capacidade do jovem de interpretar textos complexos e exercer a cidadania plena.'),
-- Tema 38 (Educação Financeira e Endividamento Juvenil)
(75, 'A oferta facilitada de crédito digital, parcelamentos automáticos e cartões sem anuidade encontra uma juventude desprovida de formação matemática aplicada ao orçamento doméstico.'),
(76, 'O tabu cultural em discutir finanças na escola e na família favorece a inadimplência precoce e a exclusão de milhões de jovens adultos do sistema produtivo formal.'),
-- Tema 39 (Violência e Ataques às Escolas)
(77, 'Comunidades virtuais extremistas operam na cooptação algorítmica de adolescentes isolados, convertendo ressentimentos individuais e discursos de ódio em atentados contra o espaço escolar.'),
(78, 'A resposta meramente policialesca aos conflitos escolares ignora a urgência de psicólogos educacionais, mediação antibullying e fortalecimento dos vínculos comunitários.'),
-- Tema 40 (Educação do Campo)
(79, 'O fechamento sistemático de escolas rurais sob a justificativa de corte de custos força crianças a percorrerem longas distâncias em transporte precário e desenraíza a juventude camponesa.'),
(80, 'A imposição de matrizes curriculares urbanocêntricas desvaloriza a agroecologia e os saberes do campo, tratando o meio rural como sinônimo de atraso civilizatório.'),
-- Tema 41 (Infraestrutura Científica Escolar)
(81, 'O ensino de ciências reduzido à memorização de fórmulas em salas sem laboratórios experimentais sufoca a curiosidade investigativa e afasta estudantes da carreira científica.'),
(82, 'A desigualdade abissal de infraestrutura entre escolas privadas de elite e a rede pública periférica cristaliza a exclusão dos jovens pobres das áreas estratégicas de pesquisa e inovação.'),
-- Tema 42 (Ensino Médio Noturno)
(83, 'A transposição mecânica do currículo diurno para o turno da noite ignora a exaustão física do estudante trabalhador, convertendo o cansaço laboral em evasão escolar.'),
(84, 'A extinção progressiva de turmas noturnas nas redes estaduais nega o direito constitucional à educação àqueles que não podem abrir mão da jornada diária de trabalho.'),

-- Tema 43 (Devastação do Cerrado)
(85, 'O foco midiático e legal concentrado quase exclusivamente na Amazônia permite que o Cerrado sofra taxas recordes de desmatamento legal e ilegal para a expansão da fronteira agropecuária.'),
(86, 'A destruição da vegetação nativa de raízes profundas do Cerrado compromete a recarga dos principais aquíferos e bacias hidrográficas que abastecem o território brasileiro.'),
-- Tema 44 (Recifes de Corais e Amazônia Azul)
(87, 'O aquecimento anormal das águas oceânicas combinado à acidificação marinha provoca o branqueamento em massa dos corais brasileiros, colapsando o berçário da biodiversidade costeira e a pesca artesanal.'),
(88, 'O despejo contínuo de microplásticos e efluentes industriais nas zonas costeiras evidencia a negligência com a soberania ambiental da chamada Amazônia Azul.'),
-- Tema 45 (Greenwashing Corporativo)
(89, 'O uso de selos ambientais vagos e campanhas publicitárias "ecológicas" por empresas altamente poluidoras engana o consumidor consciente e desvia o foco de práticas extrativistas predatórias.'),
(90, 'A ausência de regulamentação rigorosa e auditoria independente sobre alegações ESG permite que corporações lucrem com a estética da sustentabilidade sem alterar sua matriz produtiva.'),
-- Tema 46 (Megaprojetos de Energia Renovável e Comunidades)
(91, 'A instalação desordenada de complexos eólicos e solares sobre dunas, territórios quilombolas e áreas de agricultura familiar no Nordeste reproduz o modelo histórico de "colonialismo energético".'),
(92, 'Contratos leoninos de arrendamento de terras e a poluição sonora das turbinas expulsam populações rurais, demonstrando que uma matriz elétrica limpa não garante justiça socioambiental.'),
-- Tema 47 (Agrotóxicos e Contaminação Hídrica)
(93, 'A flexibilização do registro de pesticidas comprovadamente carcinogênicos e banidos na União Europeia expõe trabalhadores rurais e consumidores brasileiros a uma contaminação química silenciosa.'),
(94, 'A pulverização aérea de agrotóxicos atinge escolas rurais, aldeias indígenas e nascentes de água, socializando os danos ambientais enquanto privatiza os lucros da monocultura.'),
-- Tema 48 (Refugiados Climáticos Internos)
(95, 'A intensificação de secas severas no Semiárido e na Amazônia e de inundações catastróficas no Sul força milhares de famílias a abandonarem suas terras sem amparo jurídico específico para deslocados climáticos.'),
(96, 'O acolhimento emergencial improvisado não é acompanhado por políticas de reconstrução habitacional resiliente, perpetuando um ciclo de migração forçada e empobrecimento urbano.'),

-- Tema 49 (Feminicídio e Redes de Proteção)
(97, 'A escassez de Delegacias Especializadas de Atendimento à Mulher (DEAMs) funcionando 24 horas nos municípios do interior deixa vítimas de violência doméstica desprotegidas após a denúncia.'),
(98, 'A dependência econômica e a falha no monitoramento eletrônico de agressores sob medidas protetivas transformam o rompimento conjugal em sentença de morte evitável.'),
-- Tema 50 (População Trans e Mercado de Trabalho)
(99, 'A expulsão precoce do lar e o bullying escolar severo interrompem a trajetória formativa de pessoas travestis e transexuais, empurrando-as sistematicamente para a marginalidade e a prostituição.'),
(100, 'O preconceito nos processos seletivos e o desrespeito ao nome social nas empresas revelam que a igualdade formal na lei ainda não assegura cidadania laboral à população trans.'),
-- Tema 51 (Intolerância Religiosa e Matrizes Africanas)
(101, 'A invasão e depredação de terreiros de Candomblé e Umbanda decorrem do racismo religioso histórico, que demoniza cosmovisões afro-brasileiras enquanto naturaliza símbolos hegemônicos no espaço público.'),
(102, 'A subnotificação policial dos crimes de ódio religioso como meras "brigas de vizinhança" esvazia a proteção constitucional à liberdade de crença e à laicidade estatal.'),
-- Tema 52 (Xenofobia Seletiva no Brasil)
(103, 'O mito da hospitalidade brasileira mascara uma recepção racializada: enquanto imigrantes europeus e norte-americanos são celebrados como "expatriados", refugiados africanos, haitianos e venezuelanos enfrentam exploração laboral e hostilidade.'),
(104, 'A burocracia na revalidação de diplomas universitários e a barreira linguística nos serviços públicos desperdiçam a qualificação profissional dos imigrantes e os confinam ao subemprego.'),
-- Tema 53 (Comunidade Surda e Libras)
(105, 'A ausência de profissionais capacitados em Língua Brasileira de Sinais (Libras) em hospitais, delegacias e repartições públicas viola o direito da pessoa surda ao atendimento autônomo e sigiloso.'),
(106, 'A visão capacitista que trata a surdez apenas como deficiência auditiva a ser corrigida ignora a identidade linguística e cultural própria da comunidade surda brasileira.'),
-- Tema 54 (Acolhimento Institucional e Adoção Tardia)
(107, 'A preferência majoritária dos pretendentes à adoção por bebês brancos entra em choque com a realidade dos abrigos brasileiros, compostos sobretudo por crianças mais velhas, grupos de irmãos e adolescentes negros.'),
(108, 'O desligamento compulsório dos jovens acolhidos ao completarem 18 anos sem programas de moradia assistida ou inserção profissional expõe egressos de abrigos ao desamparo absoluto.'),

-- Tema 55 (Elitização do Acesso à Cultura)
(109, 'A concentração geográfica de cinemas, teatros e centros culturais nos bairros nobres, aliada ao alto custo dos ingressos, transforma o direito constitucional à cultura em privilégio de classe.'),
(110, 'A falta de transporte público noturno seguro impede que moradores das periferias frequentem a programação cultural das regiões centrais das metrópoles.'),
-- Tema 56 (Criminalização da Cultura Periférica)
(111, 'O aparato estatal historicamente reprime manifestações negras e periféricas — como ocorreu com o samba e a capoeira no passado e ocorre hoje com os bailes funk e batalhas de rima — sob o pretexto de manutenção da ordem.'),
(112, 'A ausência de equipamentos públicos de lazer nas favelas faz com que a juventude ocupe as ruas para produzir arte, recebendo repressão policial em vez de fomento cultural.'),
-- Tema 57 (Extinção de Línguas Indígenas)
(113, 'O desaparecimento de dezenas de línguas indígenas brasileiras representa a perda irreparável de sistemas inteiros de classificação botânica, memória histórica e filosofia originária.'),
(114, 'A imposição histórica do monolinguismo em língua portuguesa e a falta de material didático bilíngue nas aldeias desestimulam os jovens indígenas a manterem o idioma ancestral.'),
-- Tema 58 (Repatriação de Artefatos e Fósseis)
(115, 'A retenção de mantos sagrados indígenas e fósseis raros do Araripe em museus europeus perpetua o saque colonial e priva os cientistas e povos originários brasileiros do acesso à sua própria memória.'),
(116, 'O argumento utilizado por instituições estrangeiras de que o Brasil não teria condições técnicas de conservar seu acervo instrumentaliza nossas falhas orçamentárias para legitimar a apropriação patrimonial.'),
-- Tema 59 (Bibliotecas Comunitárias e Taxação de Livros)
(117, 'Propostas de aumento da carga tributária sobre o mercado editorial sob a justificativa de que "apenas a elite compra livros" encarecem ainda mais a leitura e penalizam justamente as famílias de baixa renda.'),
(118, 'A falta de apoio governamental às bibliotecas comunitárias criadas por moradores nas periferias sobrecarrega iniciativas civis que cumprem o papel constitucional omitido pelo Estado.'),
-- Tema 60 (Apropriação Cultural e Indústria do Entretenimento)
(119, 'Quando grandes corporações mercantilizam símbolos religiosos, vestimentas e ritmos de grupos marginalizados sem dar protagonismo ou retorno econômico aos seus criadores, convertem resistência histórica em fetiche de consumo.'),
(120, 'O esvaziamento simbólico das festas populares pelo turismo predatório afasta os moradores locais e desfigura a identidade comunitária original das celebrações.'),

-- Tema 61 (Burnout e Direito à Desconexão)
(121, 'A onipresença dos aplicativos de mensagens corporativas dissolveu a fronteira entre a jornada contratual e o tempo de descanso, mantendo o trabalhador em estado permanente de alerta e exaustão psíquica.'),
(122, 'A internalização da cobrança por hiperprodutividade faz com que o próprio empregado se sinta culpado ao descansar, mascarando relações de trabalho abusivas sob o discurso da alta performance.'),
-- Tema 62 (Redução da Jornada e Escala 6x1)
(123, 'A escala de seis dias de trabalho para apenas um de descanso impede o convívio familiar, a qualificação educacional e a recuperação fisiológica, atingindo sobretudo mulheres e jovens do setor de comércio e serviços.'),
(124, 'O avanço tecnológico e os ganhos de produtividade das últimas décadas foram apropriados exclusivamente pelo capital, sem se converterem na redução do tempo de trabalho humano.'),
-- Tema 63 (Regressividade Tributária)
(125, 'Um sistema tributário que arrecada majoritariamente sobre o consumo de bens básicos e alimentos faz com que famílias pobres paguem proporcionalmente muito mais impostos sobre sua renda do que os super-ricos.'),
(126, 'A baixa tributação sobre grandes patrimônios, heranças e dividendos reduz a capacidade de financiamento estatal de políticas públicas redistributivas como saúde e educação.'),
-- Tema 64 (Desertificação Bancária e Golpes)
(127, 'O fechamento em massa de agências bancárias físicas em municípios do interior obriga aposentados e trabalhadores rurais a se deslocarem por dezenas de quilômetros para sacar benefícios básicos.'),
(128, 'A migração forçada de populações vulneráveis para o ambiente bancário digital sem proteção adequada das instituições financeiras alimenta uma indústria de fraudes e empréstimos consignados abusivos.'),
-- Tema 65 (Trabalho Infantil Artístico e Digital)
(129, 'A naturalização social do sucesso de influenciadores e atores mirins invisibiliza jornadas exaustivas de gravação que comprometem o desenvolvimento escolar e psicológico da criança.'),
(130, 'A lacuna legislativa sobre a gestão patrimonial dos rendimentos obtidos por menores nas redes sociais deixa crianças vulneráveis à exploração financeira pelos próprios responsáveis.'),
-- Tema 66 (Informalidade e Trabalhadoras Domésticas)
(131, 'A transição em massa do vínculo mensalista para o regime de diarista autônoma após a PEC das Domésticas tem sido utilizada para burlar encargos trabalhistas e manter mulheres negras sem cobertura previdenciária.'),
(132, 'A herança colonial escravocrata ainda permeia a arquitetura dos "quartos de empregada" e a naturalização do desrespeito às jornadas legais no trabalho doméstico brasileiro.'),

-- Tema 67 (Reconhecimento Facial e Viés Racial)
(133, 'Algoritmos de vigilância treinados majoritariamente com bancos de imagens de pessoas brancas apresentam taxas elevadas de falsos positivos ao analisar rostos negros, automatizando o racismo institucional.'),
(134, 'A adoção acrítica de sistemas de reconhecimento facial pela polícia sem transparência auditável inverte a presunção de inocência e submete cidadãos inocentes a prisões injustas.'),
-- Tema 68 (Desaparecidos Forçados)
(135, 'O desaparecimento de dezenas de milhares de pessoas por ano no Brasil — muitas vezes em contextos de violência letal ou omissão estatal — impõe às mães e familiares um luto suspenso e sem reparação jurídica.'),
(136, 'A falta de integração nacional entre bancos de dados genéticos, institutos médicos legais e delegacias impede a identificação de vítimas e perpetua a impunidade.'),
-- Tema 69 (Desertos de Notícias e Violência contra Jornalistas)
(137, 'A ausência de veículos de imprensa independentes em mais da metade dos municípios brasileiros impede a fiscalização do orçamento público local e deixa a população refém da propaganda oficial e de boatos.'),
(138, 'O assédio judicial e as agressões físicas contra comunicadores no interior do país silenciam denúncias de corrupção, grilagem de terras e crimes ambientais.'),
-- Tema 70 (Morosidade Judiciária e Defensoria Pública)
(139, 'O déficit de defensores públicos em centenas de comarcas brasileiras nega aos cidadãos hipossuficientes o contraditório efetivo, mantendo presos provisórios esquecidos além do prazo legal.'),
(140, 'A lentidão processual combinada à cultura de litigância excessiva das grandes corporações penaliza quem depende de decisões judiciais urgentes para acessar medicamentos, pensões e direitos trabalhistas.'),
-- Tema 71 (Domínio de Milícias e Facções sobre Serviços)
(141, 'O vácuo deixado pelo Estado na provisão de segurança, habitação e infraestrutura nas periferias permitiu que grupos paramilitares e facções passassem a monopolizar a venda de água, gás, internet e transporte.'),
(142, 'A infiltração de organizações criminosas nas estruturas político-eleitorais e policiais corrói a soberania democrática e submete milhões de moradores a regimes de extorsão territorial.'),
-- Tema 72 (Justiça Restaurativa)
(143, 'A abordagem puramente retributiva dos atos infracionais juvenis limita-se à punição isolada, sem promover a conscientização do ofensor sobre o dano causado nem a reparação simbólica e material da vítima.'),
(144, 'A implementação de círculos restaurativos em escolas e varas da infância reconstrói laços comunitários rompidos e reduz drasticamente a reincidência infracional.'),

-- Tema 73 (Abandono Paterno e Mães Solo)
(145, 'A naturalização cultural da paternidade como escolha opcional — evidenciada por milhões de certidões de nascimento sem o nome do pai — sobrecarrega financeiramente e emocionalmente as mulheres chefes de família.'),
(146, 'O descumprimento das obrigações de cuidado e pensão alimentícia aprofunda a feminização da pobreza e restringe as oportunidades de desenvolvimento integral das crianças.'),
-- Tema 74 (Gravidez na Adolescência)
(147, 'O tabu moralista que impede a educação sexual científica nas escolas priva adolescentes de informações essenciais sobre métodos contraceptivos e prevenção de infecções sexualmente transmissíveis.'),
(148, 'A maternidade precoce recai de forma desproporcional sobre meninas negras e periféricas, forçando o abandono escolar por falta de creches públicas e redes de apoio.'),
-- Tema 75 (Isolamento Juvenil / Hikikomori)
(149, 'A substituição integral das interações presenciais por ambientes digitais hipercontrolados atrofia as habilidades socioemocionais de mediação de conflitos e tolerância à frustração na juventude.'),
(150, 'O medo do fracasso acadêmico e laboral diante de uma sociedade hipercompetitiva leva jovens ao autoisolamento severo no quarto, demandando acolhimento psicológico familiar e comunitário.'),
-- Tema 76 (Hipermedicalização da Infância)
(151, 'A intolerância das instituições escolares e das famílias exaustas diante da agitação e do tempo próprio da infância converte variações normais de comportamento em diagnósticos psiquiátricos precoces.'),
(152, 'O uso de psicofármacos como substitutos do brincar livre, do espaço público e da escuta pedagógica silencia sintomas de sofrimento familiar e escolar sem tratar suas causas.'),
-- Tema 77 (Trabalho Infantil Doméstico)
(153, 'A prática historicamente naturalizada de utilizar meninas pobres e negras como "criadas" ou cuidadoras em casas de terceiros ou na própria família oculta uma das formas mais severas de exploração infantil.'),
(154, 'Por ocorrer no interior privado dos domicílios sob o disfarce de "ajuda" ou "apadrinhamento", o trabalho infantil doméstico escapa à fiscalização trabalhista e perpetua o ciclo de baixa escolaridade.'),
-- Tema 78 (Orfandade e Desamparo)
(155, 'Milhares de crianças brasileiras que perderam seus pais para a pandemia, a letalidade violenta ou o feminicídio carecem de pensões especiais e acompanhamento psicossocial continuado pelo Estado.'),
(156, 'A sobrecarga das avós idosas que assumem sozinhas a criação dos netos órfãos sem suporte financeiro governamental agrava a vulnerabilidade econômica intergeracional.'),

-- Tema 79 (Gentrificação Urbana)
(157, 'Projetos de "revitalização" urbana conduzidos em parceria com a especulação imobiliária valorizam artificialmente o solo, elevam aluguéis e expulsam moradores antigos e pequenos comerciantes para as franjas da metrópole.'),
(158, 'A transformação de bairros históricos em cenários turísticos gourmetizados destrói as redes de solidariedade vicinal e apaga a memória viva das classes trabalhadoras que construíram a cidade.'),
-- Tema 80 (Transporte Público e Tarifa Zero)
(159, 'O modelo de financiamento do transporte coletivo baseado exclusivamente na tarifa paga pelo passageiro encarece as passagens, expulsa usuários do sistema e penaliza os moradores das periferias distantes.'),
(160, 'A adoção da Tarifa Zero financiada por fundos públicos e taxas sobre o transporte individual poluente democratiza o acesso ao trabalho, à cultura e aos serviços de saúde na cidade.'),
-- Tema 81 (Déficit Habitacional e Imóveis Ociosos)
(161, 'A coexistência de milhões de famílias sem teto ou pagando aluguéis extorsivos ao lado de milhares de edifícios vazios retidos para especulação financeira viola o princípio constitucional da função social da propriedade.'),
(162, 'A ausência de aplicação de instrumentos do Estatuto da Cidade — como o IPTU progressivo no tempo e o retrofit para moradia popular — esvazia os centros urbanos e encarece a infraestrutura pública.'),
-- Tema 83 / 82 (Urbanismo de Gênero / Insegurança Feminina)
(163, 'O planejamento urbano historicamente pensado para o deslocamento pendular masculino casa-trabalho ignora os trajetos complexos de cuidado realizados pelas mulheres a pé e no transporte coletivo.'),
(164, 'Ruas sem iluminação adequada, pontos de ônibus isolados e muros cegos restringem a liberdade de circulação noturna das mulheres, limitando seu acesso ao estudo e ao trabalho.'),
-- Tema 83 (Sinistros de Motociclistas e Entregas)
(165, 'O sistema de bonificação por metas e tempo de espera nos aplicativos de entrega induz motociclistas à alta velocidade e ao desrespeito às leis de trânsito, convertendo a pressa do consumidor em mortes e amputações.'),
(166, 'A ausência de faixas exclusivas seguras e de regulamentação trabalhista sobre o frete urbano transfere o custo bilionário das internações ortopédicas diretamente para os leitos de trauma do SUS.'),
-- Tema 84 (Ilhas de Calor e Arborização Urbana)
(167, 'A distribuição desigual de parques e árvores nas cidades brasileiras cria um apartheid microclimático, no qual bairros periféricos hiperdensos e asfaltados registram temperaturas até 8 °C superiores às áreas nobres arborizadas.'),
(168, 'O corte indiscriminado de árvores urbanas e a impermeabilização total do solo agravam simultaneamente a mortalidade cardiovascular por ondas de calor e as enchentes repentinas.');

-- 10. NOVOS REPERTÓRIOS SOCIOCULTURAIS ESPECÍFICOS (50 a 169 — 2 para cada novo tema)
INSERT INTO repertorios (id, categoria, conteudo) VALUES
-- Tema 25 (Medicamentos de emagrecimento / Padrões corporais)
(50, 'Filosofia', 'Naomi Wolf, escritora e pensadora autora de "O Mito da Beleza" (1991), demonstra que, à medida que as mulheres conquistaram direitos civis e políticos, a indústria do consumo fabricou um padrão estético de magreza inatingível como novo mecanismo de controle social e exaustão física.'),
(51, 'Sociologia', 'David Le Breton, antropólogo e sociólogo francês autor de "Adeus ao Corpo" (1999), analisa como a tecnociência contemporânea trata o corpo humano como um rascunho imperfeito que deve ser remodelado quimicamente a qualquer custo para se adequar ao mercado.'),
-- Tema 26 (Cigarros eletrônicos / Vapes)
(52, 'Legislação', 'Resolução da Diretoria Colegiada da Anvisa (RDC nº 855/2024) — Mantém a proibição da fabricação, importação, comercialização e publicidade de todos os Dispositivos Eletrônicos para Fumar (DEFs) no Brasil com base no princípio da precaução sanitária.'),
(53, 'História', 'Robert Proctor, historiador da ciência da Universidade Stanford e autor de "Golden Holocaust" (2011), cunhou o termo "Agnotologia" para descrever como a indústria do tabaco fabricou deliberadamente a dúvida científica e usou marketing juvenil para ocultar os riscos letais da nicotina.'),
-- Tema 27 (Cuidados Paliativos)
(54, 'Saúde Coletiva', 'Cicely Saunders (1918–2005), médica, enfermeira e assistente social britânica fundadora do St. Christopher’s Hospice, criou o conceito de "Dor Total": o sofrimento no fim da vida não é apenas físico, mas engloba dimensões emocionais, sociais e espirituais que exigem acolhimento integral.'),
(55, 'Literatura', 'Ana Claudia Quintana Arantes, médica paliativista brasileira autora de "A Morte é um Dia que Vale a Pena Viver" (2016), denuncia a solidão hospitalar e defende os cuidados paliativos como a reafirmação da biografia e da dignidade humana até o último instante.'),
-- Tema 28 (Superbactérias e Automedicação)
(56, 'Ciência', 'Discurso de Alexander Fleming no Prêmio Nobel de Medicina (1945) — O próprio descobridor da penicilina alertou há quase um século que o uso insuficiente ou irresponsável do antibiótico pelo paciente educaria os micróbios a resistirem à droga.'),
(57, 'Saúde Coletiva', 'Relatório Global sobre Resistência Antimicrobiana (OMS / Relatório O’Neill) — Projeta que infecções por superbactérias poderão causar até 10 milhões de mortes anuais até 2050, superando o câncer, caso o uso humano e agropecuário de antibióticos não seja contido.'),
-- Tema 29 (Doação de Órgãos)
(58, 'Legislação', 'Lei dos Transplantes (Lei nº 9.434/1997 e Lei nº 10.211/2001) — Estabelece no Brasil o modelo de doação "consentida", no qual a retirada de órgãos depende obrigatoriamente da autorização do cônjuge ou parentes maiores de idade, tornando essencial o diálogo familiar em vida.'),
(59, 'Filosofia', 'Hans Jonas, filósofo alemão autor de "Técnica, Medicina e Ética" (1985), reflete sobre os critérios éticos da definição de morte encefálica e a responsabilidade solidária da sociedade na preservação da vida através da doação consentida.'),
-- Tema 30 (Doenças Tropicais Negligenciadas)
(60, 'História', 'Expedições Científicas de Carlos Chagas (1909) e Arthur Neiva (1912) pelo interior do Brasil — Documentaram um país abandonado pelo poder público, levando o médico Miguel Pereira a declarar a célebre frase: "O Brasil é ainda um imenso hospital".'),
(61, 'Saúde Coletiva', 'Conceito de "Doenças Negligenciadas" (Médicos Sem Fronteiras / DNDi) — Classifica enfermidades como malária, leishmaniose e doença de Chagas não como fatalidades biológicas, mas como falhas de mercado e de prioridade política que perpetuam o ciclo da pobreza.'),

-- Tema 31 (Deepfakes e Democracia)
(62, 'Filosofia', 'Hannah Arendt, no ensaio "Verdade e Política" (1967), adverte que o resultado da substituição consistente da verdade factual por mentiras organizadas não é que as mentiras passem a ser aceitas como verdade, mas que o senso humano pelo qual nos orientamos no mundo real fica destruído.'),
(63, 'Direito', 'Resolução nº 23.732/2024 do Tribunal Superior Eleitoral (TSE) — Proíbe o uso de deepfakes (conteúdo sintético multimídia gerado por IA para criar ou substituir a imagem ou voz de pessoa viva ou falecida) nas campanhas eleitorais brasileiras, sob pena de cassação do registro.'),
-- Tema 32 (Lixo Eletrônico e Obsolescência)
(64, 'Economia', 'Serge Latouche, economista francês autor de "Feito para Jogar Fora: a história da obsolescência programada" (2012), demonstra como a economia de crescimento infinito depende da destruição deliberada da durabilidade dos produtos, esgotando as reservas minerais do planeta.'),
(65, 'Legislação', 'Política Nacional de Resíduos Sólidos (Lei nº 12.305/2010) e Decreto nº 10.240/2020 — Instituem a responsabilidade compartilhada pelo ciclo de vida dos produtos e obrigam fabricantes, importadores e comerciantes de eletroeletrônicos a estruturarem sistemas de logística reversa.'),
-- Tema 33 (Exclusão Digital de Idosos e Rurais)
(66, 'Sociologia', 'Jan van Dijk, sociólogo holandês autor de "The Deepening Divide: Inequality in the Information Society" (2005), demonstra que a exclusão digital não se resume à falta do aparelho físico, mas aprofunda desigualdades preexistentes de idade, renda e escolaridade no acesso a direitos.'),
(67, 'Pesquisa', 'Pesquisa TIC Domicílios (Cetic.br / NIC.br) — Evidencia que a conectividade significativa (conexão estável, computador e habilidades digitais para serviços públicos) ainda exclui grande parcela dos moradores de áreas rurais e idosos das classes D e E no Brasil.'),
-- Tema 34 (Economia da Atenção e Vídeos Curtos)
(68, 'Psicologia', 'Nicholas Carr, escritor norte-americano finalista do Pulitzer com "A Geração Superficial: o que a internet está fazendo com os nossos cérebros" (2010), comprova pela neuroplasticidade que o hábito de saltar rapidamente entre estímulos digitais reduz a capacidade de concentração e memória de longo prazo.'),
(69, 'Comunicação', 'Tim Wu, professor da Universidade Columbia e autor de "The Attention Merchants" (Os Mercadores da Atenção, 2016), reconstrói como a indústria de mídia e tecnologia evoluiu para capturar e revender cada segundo livre da consciência humana.'),
-- Tema 35 (Sharenting e Exposição Infantil)
(70, 'Direito', 'Conceito Jurídico de "Sharenting" (junção de share e parenting) formulado por Stacey Steinberg — Analisa o conflito entre a liberdade de expressão dos pais nas redes sociais e o direito fundamental da criança à privacidade, à imagem e ao esquecimento digital (Art. 227 da CF e ECA).'),
(71, 'Sociologia', 'Neil Postman, crítico cultural norte-americano autor de "O Desaparecimento da Infância" (1982), argumenta que a exposição total das crianças aos meios de comunicação eletrônicos dissolve as fronteiras simbólicas entre o mundo adulto e o infantil.'),
-- Tema 36 (Consumo Energético e Hídrico da IA)
(72, 'Tecnologia', 'Kate Crawford, pesquisadora da USC e autora de "Atlas of AI" (Atlas da Inteligência Artificial, 2021), desmistifica a ideia de que a IA é abstrata ou etérea, revelando sua base profundamente extrativista em água, energia elétrica, lítio e trabalho humano precarizado.'),
(73, 'Ciência', 'Estudo da Universidade da Califórnia (Shaolei Ren et al., "Making AI Less Thirsty", 2023) — Calculou que o treinamento e a operação de grandes modelos de linguagem consomem milhões de litros de água doce limpa em torres de resfriamento de data centers.'),

-- Tema 37 (Analfabetismo Funcional)
(74, 'Educação', 'Magda Soares (1932–2023), professora emérita da UFMG e autora de "Letramento: um tema em três gêneros" (1998), estabeleceu a distinção fundamental entre "alfabetização" (aprender o código escrito) e "letramento" (a capacidade de usar a leitura e a escrita nas práticas sociais).'),
(75, 'Pesquisa', 'Indicador de Alfabetismo Funcional (INAF - Ação Educativa e Instituto Paulo Montenegro) — Revela que cerca de 3 em cada 10 brasileiros entre 15 e 64 anos são analfabetos funcionais, apresentando sérias dificuldades para interpretar textos cotidianos e tabelas simples.'),
-- Tema 38 (Educação Financeira e Endividamento Juvenil)
(76, 'Economia', 'Richard Thaler, Prêmio Nobel de Economia e autor de "Nudge" (2008), explica por meio da Economia Comportamental como o "viés do presente" e a arquitetura de escolha dos aplicativos de crédito levam indivíduos sem educação financeira a decisões impulsivas de endividamento.'),
(77, 'Filosofia', 'Maurizio Lazzarato, sociólogo e filósofo italiano autor de "A Fábrica do Homem Endividado" (2011), analisa como o capitalismo financeiro contemporâneo governa a juventude por meio da dívida perpétua, hipotecando o futuro do trabalhador antes mesmo do primeiro emprego.'),
-- Tema 39 (Violência e Ataques às Escolas)
(78, 'Educação', 'Relatório do Grupo de Trabalho de Especialistas em Violência nas Escolas (MEC / pesquisadoras Telma Vinha e Miriam Abramovay, 2023) — Demonstrou que câmeras e detectores de metais não impedem ataques extremos, sendo indispensável a criação de "clima escolar positivo" e escuta psicológica.'),
(79, 'Comunicação', 'Giuliano Da Empoli, ensaísta ítalo-suíço autor de "Os Engenheiros do Caos" (2019), descreve como algoritmos de recomendação identificam adolescentes solitários e os conduzem progressivamente a câmaras de eco extremistas e misóginas.'),
-- Tema 40 (Educação do Campo)
(80, 'Educação', 'Roseli Caldart, pedagoga brasileira referência em "Pedagogia do Movimento Sem Terra" e Educação do Campo, defende o princípio de uma educação "no e do campo": no campo, porque o estudante tem direito a estudar onde vive; do campo, porque o currículo deve ser construído com os saberes camponeses.'),
(81, 'Legislação', 'Lei nº 12.960/2014 (Alteração da LDB - Lei de Diretrizes e Bases da Educação) — Determina que o fechamento de escolas do campo, indígenas e quilombolas exige manifestação prévia do órgão normativo de ensino e consulta obrigatória à comunidade escolar afetada.'),
-- Tema 41 (Infraestrutura Científica Escolar)
(82, 'Ciência', 'Carl Sagan, astrofísico norte-americano autor de "O Mundo Assombrado pelos Demônios" (1995), alerta que uma sociedade inteiramente dependente da ciência e da tecnologia na qual quase ninguém compreende como a ciência funciona é uma receita para o desastre democrático.'),
(83, 'Pesquisa', 'Censo Escolar da Educação Básica (INEP/MEC) — Revela que menos de 15% das escolas públicas de ensino fundamental no Brasil possuem laboratório de ciências em funcionamento, restringindo o ensino experimental a uma minoria privilegiada.'),
-- Tema 42 (Ensino Médio Noturno)
(84, 'Educação', 'Gaudêncio Frigotto, filósofo e educador brasileiro autor de "A Produtividade da Escola Improdutiva" (1984), analisa a dualidade estrutural do ensino médio brasileiro, que nega ao jovem trabalhador do turno noturno uma formação científica e humanística integral.'),
(85, 'Literatura', 'Conceição Evaristo, em seus contos de "Olhos d’Água" (2014) e relatos autobiográficos, retrata a luta cotidiana da juventude periférica e trabalhadora que enfrenta o cansaço físico extremo do serviço diurno para ocupar os bancos escolares à noite.'),

-- Tema 43 (Devastação do Cerrado)
(86, 'Geografia', 'Aziz Ab’Saber (1924–2012), geógrafo brasileiro autor de "Os Domínios de Natureza no Brasil" (2003), caracterizou o Cerrado como a "caixa d’água do Brasil", onde nascem as águas que alimentam as bacias dos rios São Francisco, Tocantins-Araguaia e Paraná.'),
(87, 'Ciência', 'Iniciativa MapBiomas (Relatório Anual de Desmatamento no Brasil - RAD) — Comprovou por imagens de satélite que o Cerrado ultrapassou a Amazônia como o bioma mais desmatado do país, concentrando a devastação na região conhecida como MATOPIBA.'),
-- Tema 44 (Recifes de Corais e Amazônia Azul)
(88, 'Biologia', 'Rachel Carson, bióloga marinha norte-americana autora de "O Mar que nos Cerca" (1951), demonstrou pioneiramente que a estabilidade climática terrestre e a cadeia alimentar global dependem do equilíbrio químico e térmico dos ecossistemas oceânicos.'),
(89, 'Geografia', 'Conceito Estratégico de "Amazônia Azul" (Marinha do Brasil / CIRM) — Designa a zona econômica exclusiva marítima brasileira de 5,7 milhões de km², cuja biodiversidade coralínea (como o Banco dos Abrolhos e os recifes amazônicos) é vital para a soberania nacional.'),
-- Tema 45 (Greenwashing Corporativo)
(90, 'Comunicação', 'Jay Westerveld, ambientalista norte-americano que cunhou o termo "Greenwashing" (1986) — Criou o conceito ao observar hotéis que pediam aos hóspedes para reutilizar toalhas "para salvar os recifes de corais" enquanto expandiam construções destruindo o ecossistema local.'),
(91, 'Legislação', 'Código Brasileiro de Autorregulamentação Publicitária (Anexo U do CONAR) e Código de Defesa do Consumidor (Art. 37 da Lei nº 8.078/1990) — Tipificam como publicidade enganosa e abusiva qualquer alegação socioambiental genérica que não possa ser comprovada cientificamente.'),
-- Tema 46 (Megaprojetos de Energia Renovável e Comunidades)
(92, 'Ecologia Política', 'Maristella Svampa, socióloga argentina autora de "As Fronteiras do Neoextrativismo na América Latina" (2019), demonstra que mesmo a transição para energias renováveis pode reproduzir a lógica colonial de "zonas de sacrifício" quando imposta sem consulta às comunidades locais.'),
(93, 'Pesquisa', 'Relatórios da Comissão Pastoral da Terra (CPT) sobre Conflitos Socioambientais Eólicos no Nordeste — Documentam o cercamento de dunas comunitárias, rachaduras em cisternas rurais e o adoecimento por ruído contínuo ("síndrome da turbina eólica") em comunidades camponesas.'),
-- Tema 47 (Agrotóxicos e Contaminação Hídrica)
(94, 'Geografia', 'Larissa Mies Bombardi, geógrafa da USP autora do atlas "Geografia do Uso de Agrotóxicos no Brasil e Conexões com a União Europeia" (2017), expôs a "hipocrisia química": empresas europeias exportam para o Brasil toneladas de pesticidas proibidos em seus próprios países de origem.'),
(95, 'Ciência', 'Rachel Carson, na obra clássica "Primavera Silenciosa" (Silent Spring, 1962), denunciou como os pesticidas sintéticos (como o DDT) não eliminam apenas pragas, mas se bioacumulam nas águas, no solo e nos tecidos humanos, silenciando a fauna e gerando cânceres.'),
-- Tema 48 (Refugiados Climáticos Internos)
(96, 'Literatura', 'Graciliano Ramos, em "Vidas Secas" (1938), imortalizou na trajetória de Fabiano e Sinhá Vitória a figura histórica do retirante climático brasileiro, expulso da terra pela combinação entre o extremo ambiental e o abandono estatal.'),
(97, 'Direito', 'Convenção de Kampala e Relatórios do ACNUR / Banco Mundial ("Groundswell") — Alertam para o vácuo jurídico internacional e nacional na proteção dos "deslocados ambientais internos", que perdem moradia e meios de subsistência devido à crise climática.'),

-- Tema 49 (Feminicídio e Redes de Proteção)
(98, 'Antropologia', 'Rita Laura Segato, antropóloga argentino-brasileira autora de "As Estruturas Elementares da Violência" (2003), explica que o feminicídio não é um crime passional ou privado, mas um ato político de "pedagogia da crueldade" pelo qual o patriarcado reafirma a posse sobre o corpo feminino.'),
(99, 'Legislação', 'Lei Maria da Penha (Lei nº 11.340/2006) e Lei do Feminicídio (Lei nº 13.104/2015 / Lei nº 14.994/2024) — Marcos legais brasileiros que criaram medidas protetivas de urgência e tornaram o feminicídio crime autônomo com a maior pena do Código Penal, exigindo agora capilaridade de atendimento nos municípios.'),
-- Tema 50 (População Trans e Mercado de Trabalho)
(100, 'Filosofia', 'Judith Butler, filósofa norte-americana autora de "Corpos que Importam" (1993) e "Quadros de Guerra" (2009), analisa como normas de gênero excludentes definem quais vidas são consideradas dignas de proteção social e cidadania e quais são tratadas como descartáveis.'),
(101, 'Pesquisa', 'Dossiê Anual da ANTRA (Associação Nacional de Travestis e Transexuais, org. Bruna Benevides) — Evidencia que a evasão escolar forçada pela transfobia exclui cerca de 90% das mulheres trans e travestis do mercado formal de trabalho no Brasil.'),
-- Tema 51 (Intolerância Religiosa e Matrizes Africanas)
(102, 'História', 'Wanderson Flor do Nascimento, filósofo da UnB, cunhou e desenvolveu o conceito de "Racismo Religioso": a hostilidade contra o Candomblé e a Umbanda não é mera divergência teológica, mas a perseguição direta à herança civilizatória negra e indígena no Brasil.'),
(103, 'Legislação', 'Lei nº 14.532/2023 (Equiparação da Injúria Racial ao Crime de Racismo) — Agrava a pena para crimes de intolerância religiosa e tipifica a conduta de impedir ou empregar violência contra manifestações e liturgias de religiões de matriz africana.'),
-- Tema 52 (Xenofobia Seletiva no Brasil)
(104, 'Filosofia', 'Adela Cortina, filósofa espanhola da Universidade de Valência, criou na obra "Aporofobia, a aversão ao pobre" (2017) o conceito que explica a xenofobia seletiva: a hostilidade não é contra o estrangeiro em si (já que o turista rico é acolhido), mas contra o imigrante percebido como pobre.'),
(105, 'Legislação', 'Nova Lei de Migração (Lei nº 13.445/2017) — Substituiu o antigo Estatuto do Estrangeiro da ditadura militar (que via o imigrante como ameaça à segurança nacional) pelo paradigma dos direitos humanos, repudiando a xenofobia e garantindo acesso igualitário à saúde e educação.'),
-- Tema 53 (Comunidade Surda e Libras)
(106, 'Educação', 'Karin Strobel, pesquisadora surda brasileira e doutora em Educação, na obra "As Imagens do Outro sobre a Cultura Surda" (2008), defende que o povo surdo possui artefatos culturais, experiência visual e língua própria, opondo-se ao "ouvintismo" que tenta impor a oralização forçada.'),
(107, 'Legislação', 'Lei de Libras (Lei nº 10.436/2002) e Decreto nº 5.626/2005 — Reconhecem a Língua Brasileira de Sinais como meio legal de comunicação e expressão no Brasil e determinam que o poder público assegure atendimento com intérpretes na saúde, justiça e educação.'),
-- Tema 54 (Acolhimento Institucional e Adoção Tardia)
(108, 'Direito', 'Dados do Sistema Nacional de Adoção e Acolhimento (SNA / Conselho Nacional de Justiça - CNJ) — Revelam o descompasso estrutural no qual a maioria das crianças disponíveis para adoção tem mais de 8 anos de idade, enquanto a imensa maioria dos pretendentes exige crianças de até 3 anos.'),
(109, 'Psicologia', 'John Bowlby (1907–1990), psiquiatra e psicanalista britânico formulador da "Teoria do Apego", demonstrou que a privação prolongada de vínculos afetivos estáveis e familiares na infância gera impactos profundos no desenvolvimento emocional e social do jovem.'),

-- Tema 55 (Elitização do Acesso à Cultura)
(110, 'Sociologia', 'Pierre Bourdieu, sociólogo francês autor de "A Distinção: crítica social do julgamento" (1979), demonstra como o consumo cultural erudito (museus, teatros, concertos) é utilizado pelas classes dominantes como "Capital Cultural" para legitimar e reproduzir barreiras sociais.'),
(111, 'Cultura', 'Teixeira Coelho, professor da USP e autor de "Dicionário Crítico de Política Cultural" (1997), defende o conceito de "Cidadania Cultural": o Estado não deve apenas preservar obras no centro da cidade, mas descentralizar os meios de produção e fruição estética para as periferias.'),
-- Tema 56 (Criminalização da Cultura Periférica)
(112, 'História', 'Código Penal da Primeira República (Decreto nº 847/1890, Art. 402) — Tipificava expressamente como crime a prática da capoeira e do samba nas ruas, comprovando que a criminalização atual dos bailes funk e do rap repete uma tradição secular de controle penal da cultura negra.'),
(113, 'Antropologia', 'Hermano Vianna, antropólogo brasileiro autor de "O Mundo Funk Carioca" (1988), analisa os bailes periféricos como espaços legítimos de sociabilidade, inovação estética e economia criativa da juventude negra das favelas.'),
-- Tema 57 (Extinção de Línguas Indígenas)
(114, 'Linguística', 'Aryon Dall’Igna Rodrigues (1925–2014), maior linguista de idiomas indígenas do Brasil e autor de "Línguas Brasileiras" (1986), documentou que, das cerca de 1.200 línguas faladas no território em 1500, restam cerca de 180, quase todas ameaçadas de extinção por falta de proteção territorial e escolar.'),
(115, 'História', 'Diretório dos Índios de Marquês de Pombal (1757) — Legislação colonial portuguesa que proibiu o uso da "Língua Geral" (Nheengatu) e dos idiomas nativos no Brasil, iniciando uma política oficial de glotocídio (extermínio linguístico) cujos efeitos persistem até hoje.'),
-- Tema 58 (Repatriação de Artefatos e Fósseis)
(116, 'História', 'Devolução do Manto Tupinambá pela Dinamarca ao Museu Nacional (2024) e mobilização do povo Gavião e Tupinambá de Olivença — Marco histórico de descolonização museológica que reacendeu o debate sobre artefatos sagrados retirados do Brasil no século XVII.'),
(117, 'Ciência', 'Campanha internacional "#UbirajaraBelongsToBR" liderada pela Sociedade Brasileira de Paleontologia (2020–2023) — Resultou na repatriação histórica do fóssil do dinossauro Ubirajara jubatus, que havia sido retirado ilegalmente da Bacia do Araripe (CE) para um museu na Alemanha.'),
-- Tema 59 (Bibliotecas Comunitárias e Taxação de Livros)
(118, 'Legislação', 'Imunidade Tributária Cultural do Livro (Art. 150, inciso VI, alínea "d" da Constituição Federal, proposta por Jorge Amado na Constituinte de 1946) — Veda à União, Estados e Municípios instituir impostos sobre livros, jornais e papel destinado à sua impressão para proteger a liberdade de pensamento e a educação.'),
(119, 'Pesquisa', 'Pesquisa "Retratos da Leitura no Brasil" (Instituto Pró-Livro) — Aponta que o Brasil perdeu milhões de leitores nos últimos anos e que a falta de bibliotecas próximas de casa e o preço do livro são barreiras decisivas para as famílias de baixa renda.'),
-- Tema 60 (Apropriação Cultural e Indústria do Entretenimento)
(120, 'Filosofia', 'bell hooks (Gloria Jean Watkins), teórica feminista norte-americana, no ensaio "Comendo o Outro: desejo e resistência" (1992), analisa como a cultura de massa consome a estética e a cultura negra como mercadoria exótica, enquanto mantém os corpos negros submetidos ao racismo estrutural.'),
(121, 'Antropologia', 'Nestor García Canclini, antropólogo argentino autor de "Culturas Híbridas" (1989), investiga as tensões entre as tradições populares comunitárias e sua captura mercadológica pela indústria cultural globalizada.'),

-- Tema 61 (Burnout e Direito à Desconexão)
(122, 'Filosofia', 'Byung-Chul Han, filósofo sul-coreano radicado na Alemanha e autor de "Sociedade do Cansaço" (2010), demonstra que a sociedade disciplinar deu lugar à "sociedade do desempenho", na qual o indivíduo explora a si mesmo acreditando ser livre até colapsar em depressão e burnout.'),
(123, 'Saúde Coletiva', 'Classificação Internacional de Doenças da OMS (CID-11, em vigor desde 2022) — Oficializou a Síndrome de Burnout (código QD85) como um fenômeno exclusivamente ocupacional resultante do estresse crônico no local de trabalho que não foi administrado com sucesso.'),
-- Tema 62 (Redução da Jornada e Escala 6x1)
(124, 'Economia', 'John Maynard Keynes, no célebre ensaio "Possibilidades Econômicas para os Nossos Netos" (1930), previu que o avanço tecnológico permitiria à humanidade no século XXI trabalhar apenas 15 horas semanais, evidenciando o paradoxo atual da exaustão na escala 6x1.'),
(125, 'Sociologia', 'Ricardo Antunes, sociólogo do trabalho da Unicamp e autor de "O Privilégio da Servidão" (2018), analisa como o setor de serviços na era digital intensificou a extração do tempo de vida do trabalhador brasileiro por meio de escalas exaustivas e baixos salários.'),
-- Tema 63 (Regressividade Tributária)
(126, 'Economia', 'Thomas Piketty, economista francês autor de "O Capital no Século XXI" (2013), comprova com dados históricos de dois séculos que a ausência de tributação progressiva sobre a renda e as grandes heranças gera níveis extremos de desigualdade que ameaçam a própria democracia.'),
(127, 'Economia', 'Estudos do IPEA e do Instituto Justiça Fiscal sobre a Regressividade Tributária no Brasil — Demonstram que os 10% mais pobres da população brasileira comprometem cerca de 32% de sua renda com tributos indiretos sobre o consumo, enquanto os 10% mais ricos pagam cerca de 21%.'),
-- Tema 64 (Desertificação Bancária e Golpes)
(128, 'Geografia', 'Milton Santos e María Laura Silveira, na obra "O Brasil: Território e Sociedade no Início do Século XXI" (2001), analisam a seletividade espacial do sistema financeiro, que concentra agências nas "regiões concentradas" e abandona os pequenos municípios do interior.'),
(129, 'Legislação', 'Lei do Superendividamento (Lei nº 14.181/2021, que atualizou o Código de Defesa do Consumidor) — Proíbe o assédio de consumo para contratação de crédito, especialmente contra idosos, analfabetos e vulneráveis, garantindo a preservação do "mínimo existencial".'),
-- Tema 65 (Trabalho Infantil Artístico e Digital)
(130, 'Audiovisual', 'Documentário "Quiet on Set: O Lado Sombrio da TV Infantil" (2024) e memórias "Jennette McCurdy" — Expuseram mundialmente os bastidores de pressão psicológica, privação de infância e exploração financeira enfrentados por atores e influenciadores mirins.'),
(131, 'Legislação', 'Convenção nº 138 da OIT e Lei Francesa nº 2020-1266 ("Lei dos Influenciadores Mirins") — Referências regulatórias que exigem alvará judicial prévio, limitação estrita de horas de gravação e depósito obrigatório dos lucros em conta bloqueada até a maioridade da criança.'),
-- Tema 66 (Informalidade e Trabalhadoras Domésticas)
(132, 'Sociologia', 'Lélia Gonzalez (1935–1994), antropóloga e filósofa brasileira autora de "Por um Feminismo Afro-Latino-Americano", analisou como a divisão racial e sexual do trabalho no Brasil reservou historicamente à mulher negra o lugar da "mucama" e do serviço doméstico desprotegido.'),
(133, 'Audiovisual', 'Filme "Que Horas Ela Volta?" (2015, dir. Anna Muylaert) — Retrata por meio da personagem Val e de sua filha Jéssica as barreiras simbólicas e arquitetônicas ("a piscina e o quarto de fundos") que perpetuam a desigualdade no trabalho doméstico brasileiro.'),

-- Tema 67 (Reconhecimento Facial e Viés Racial)
(134, 'Tecnologia', 'Joy Buolamwini (pesquisadora do MIT e criadora do documentário "Coded Bias", 2020) e Tarcízio Silva (autor de "Racismo Algorítmico", 2022) — Comprovaram que sistemas de reconhecimento facial falham até 35% mais ao identificar rostos negros e femininos, levando a prisões injustas no Brasil.'),
(135, 'Pesquisa', 'Relatório da Rede de Observatórios da Segurança ("O Panóptico Digital") — Levantamento no Brasil que revelou que mais de 90% das pessoas presas por meio de câmeras de reconhecimento facial policial no país são negras, com diversos casos comprovados de erro judiciário.'),
-- Tema 68 (Desaparecidos Forçados)
(136, 'Sociologia', 'Fábio Araújo, sociólogo da Fiocruz e autor de "Das Técnicas de Fazer Desaparecer Corpos" (2014), analisa o desaparecimento de pessoas nas periferias brasileiras como uma tecnologia de terror e sofrimento contínuo que nega às mães até mesmo o direito ao sepultamento.'),
(137, 'Legislação', 'Lei nº 13.812/2019 (Política Nacional de Busca de Pessoas Desaparecidas) — Instituiu o Cadastro Nacional de Pessoas Desaparecidas e determinou que a investigação policial de desaparecimento de crianças e adolescentes deve ser iniciada imediatamente, sem espera de 24 horas.'),
-- Tema 69 (Desertos de Notícias e Violência contra Jornalistas)
(138, 'Comunicação', 'Atlas da Notícia (projeto de pesquisa do Projor em parceria com a Volt Data Lab) — Mapeamento que revelou que mais de 50% dos municípios brasileiros são "desertos de notícias", não possuindo sequer um veículo de jornalismo local para fiscalizar prefeituras e câmaras.'),
(139, 'Filosofia', 'John Stuart Mill, filósofo britânico autor de "Sobre a Liberdade" (On Liberty, 1859), demonstra que silenciar a imprensa e a investigação independente não rouba apenas o jornalista, mas toda a sociedade que fica privada da possibilidade de corrigir os abusos do poder.'),
-- Tema 70 (Morosidade Judiciária e Defensoria Pública)
(140, 'Direito', 'Mauro Cappelletti e Bryant Garth, juristas autores da obra clássica "Acesso à Justiça" (1978), identificam que o maior obstáculo ao Estado de Direito na modernidade são os custos financeiros e a lentidão dos tribunais, que penalizam desproporcionalmente o litigante pobre.'),
(141, 'Pesquisa', 'Pesquisa Nacional da Defensoria Pública (ANADEP / IPEA) — Revelou que mais da metade das comarcas brasileiras ainda não conta com atendimento regular da Defensoria Pública, descumprindo a Emenda Constitucional nº 80/2014.'),
-- Tema 71 (Domínio de Milícias e Facções sobre Serviços)
(142, 'Sociologia', 'Ignacio Cano (LAV-UERJ) e Bruno Paes Manso (autor de "A República das Milícias", 2020) — Analisam como grupos paramilitares deixaram de vender apenas "proteção armada" para controlar negócios imobiliários ilegais, distribuição de água, gás e internet nas metrópoles.'),
(143, 'Filosofia', 'Max Weber, em "Economia e Sociedade" (1922), define o Estado moderno pelo "monopólio legítimo do uso da força física dentro de um determinado território" — monopólio que se fragmenta quando organizações criminosas impõem leis paralelas e pedágios à população.'),
-- Tema 72 (Justiça Restaurativa)
(144, 'Direito', 'Howard Zehr, criminologista norte-americano considerado o pioneiro mundial da área com a obra "Trocando as Lentes: um novo foco sobre o crime e a justiça" (1990), propõe substituir a pergunta punitiva ("Que castigo o infrator merece?") pela restaurativa ("Quem foi ferido e como reparar o dano?").'),
(145, 'Legislação', 'Resolução nº 225/2016 do Conselho Nacional de Justiça (CNJ) e Sistema Nacional de Atendimento Socioeducativo (Lei do SINASE nº 12.594/2012) — Priorizam práticas restaurativas e medidas em meio aberto na resolução de conflitos envolvendo adolescentes.'),

-- Tema 73 (Abandono Paterno e Mães Solo)
(146, 'Direito', 'Portal da Transparência do Registro Civil (ARPEN-Brasil - "Pais Ausentes") — Revela que mais de 160 mil crianças nascem todos os anos no Brasil sem o nome do pai na certidão de nascimento, evidenciando a epidemia de abandono parental no país.'),
(147, 'Sociologia', 'Elisabeth Badinter, filósofa e historiadora francesa autora de "Um Amor Conquistado: o mito do amor materno" (1980), desnaturaliza a ideia de que o cuidado com os filhos seja um instinto biológico exclusivo da mulher, demonstrando que essa narrativa serve para isentar os homens da paternidade responsável.'),
-- Tema 74 (Gravidez na Adolescência)
(148, 'Saúde Coletiva', 'Relatório do Fundo de População das Nações Unidas (UNFPA / ONU Brasil) — Demonstra que a taxa de gravidez na adolescência no Brasil (entre 15 e 19 anos) está acima da média mundial e concentra-se nas periferias onde faltam educação em sexualidade e planejamento reprodutivo.'),
(149, 'Economia', 'James Heckman, Prêmio Nobel de Economia, comprova pela "Equação de Heckman" que o investimento público em creches, primeira infância e apoio a mães jovens gera o maior retorno social e econômico possível no combate à pobreza intergeracional.'),
-- Tema 75 (Isolamento Juvenil / Hikikomori)
(150, 'Psiquiatria', 'Tamaki Saito, psiquiatra japonês que cunhou o termo "Hikikomori" na obra "Isolamento Social: uma adolescência sem fim" (1998), descreve o retraimento domiciliar severo de jovens por mais de seis meses como sintoma de uma sociedade que não acolhe a vulnerabilidade juvenil.'),
(151, 'Psicologia', 'Jonathan Haidt, psicólogo social da Universidade de Nova York e autor de "A Geração Ansiosa" (2024), demonstra como a transição da "infância baseada no brincar" para a "infância baseada no celular" provocou uma epidemia global de solidão e fobia social entre adolescentes.'),
-- Tema 76 (Hipermedicalização da Infância)
(152, 'Saúde Coletiva', 'Maria Aparecida Affonso Moysés, professora titular de Pediatria da Unicamp, lidera pesquisas sobre a "Medicalização da Educação e da Sociedade", alertando como o Brasil se tornou um dos maiores consumidores mundiais de metilfenidato (Ritalina) para silenciar falhas pedagógicas.'),
(153, 'Filosofia', 'Georges Canguilhem, médico e filósofo francês autor de "O Normal e o Patológico" (1943), demonstra que a fronteira entre saúde e doença não é puramente biológica, mas construída por normas sociais de produtividade e disciplina institucional.'),
-- Tema 77 (Trabalho Infantil Doméstico)
(154, 'Legislação', 'Decreto nº 6.481/2008 (Lista das Piores Formas de Trabalho Infantil - Lista TIP, regulamentando a Convenção 182 da OIT) — Proíbe expressamente o trabalho infantil doméstico para menores de 18 anos no Brasil devido aos riscos físicos, químicos, ergonômicos e de abuso psicológico.'),
(155, 'Quadrinhos', 'Série documental e artística "Eu, Empregada Doméstica", criada pela historiadora e ex-doméstica Preta-Rara (Joyce Fernandes, 2019), reúne centenas de relatos reais sobre meninas negras levadas ainda na infância do interior para trabalhar sem salário em casas de família sob a promessa de estudo.'),
-- Tema 78 (Orfandade e Desamparo)
(156, 'Pesquisa', 'Estudo da Fiocruz e da revista científica The Lancet (2022) sobre Orfandade no Brasil — Estimou que mais de 130 mil crianças e adolescentes brasileiros perderam pai, mãe ou avós cuidadores apenas na crise sanitária recente, somando-se aos milhares de órfãos anuais da violência armada.'),
(157, 'Legislação', 'Lei nº 14.717/2023 — Instituiu pensão especial de um salário-mínimo destinada aos filhos e dependentes menores de 18 anos órfãos em razão do crime de feminicídio, um avanço legal que especialistas defendem ampliar para outras formas de orfandade vulnerável.'),

-- Tema 79 (Gentrificação Urbana)
(158, 'Sociologia', 'Ruth Glass, socióloga britânica que cunhou o termo "Gentrificação" em "London: Aspects of Change" (1964), descreveu o processo pelo qual bairros operários tradicionais são progressivamente ocupados por camadas de alta renda até a expulsão completa de seus habitantes originais.'),
(159, 'Geografia', 'David Harvey, geógrafo britânico autor de "Cidades Rebeldes: do direito à cidade à revolução urbana" (2012), analisa a gentrificação como "acumulação por espoliação", na qual o capital imobiliário se apropria da vitalidade cultural criada pelos moradores pobres para depois expulsá-los.'),
-- Tema 80 (Transporte Público e Tarifa Zero)
(160, 'Urbanismo', 'Lúcio Gregori, engenheiro e ex-secretário de Transportes de São Paulo que formulou o primeiro projeto brasileiro de "Tarifa Zero" (1990), defende que o transporte coletivo deve ser financiado pelo orçamento público tal como o SUS e a iluminação urbana, pois toda a economia da cidade se beneficia do deslocamento do trabalhador.'),
(161, 'Pesquisa', 'Levantamento da Associação Nacional das Empresas de Transportes Urbanos (NTU) — Demonstra que mais de 100 municípios brasileiros (como Caucaia-CE, Maricá-RJ e São Caetano do Sul-SP) já implementaram a Tarifa Zero universal, gerando aumento do comércio local e redução de emissões.'),
-- Tema 81 (Déficit Habitacional e Imóveis Ociosos)
(162, 'Urbanismo', 'Raquel Rolnik, urbanista da USP e ex-relatora da ONU para o Direito à Moradia Adequada, na obra "Guerra dos Lugares: a colonização da terra e da moradia na era das finanças" (2015), explica como a transformação da casa em ativo financeiro especulativo produz simultaneamente prédios vazios e famílias sem teto.'),
(163, 'Pesquisa', 'Relatório de Déficit Habitacional da Fundação João Pinheiro (FJP) e Censo Demográfico do IBGE — Comprovam o paradoxo urbano brasileiro: o país possui um déficit de cerca de 6 milhões de moradias enquanto registra mais de 11 milhões de domicílios vagos ou ociosos.'),
-- Tema 82 (Urbanismo de Gênero / Insegurança Feminina)
(164, 'Urbanismo', 'Zaida Muxí, arquiteta e urbanista argentina radicada em Barcelona e autora de "Mulheres, Casas e Cidades" (2018), desenvolve o "Urbanismo Feminista", propondo cidades planejadas com iluminação contínua, calçadas ativas e equipamentos de apoio ao trabalho de cuidado.'),
(165, 'Pesquisa', 'Pesquisa "Viver em São Paulo: Mulheres" e "Assédio no Transporte" (Rede Nossa São Paulo / Instituto Patrícia Galvão) — Revela que a maioria das mulheres brasileiras já deixou de aceitar vagas de emprego ou cursos universitários noturnos por medo da insegurança no trajeto urbano.'),
-- Tema 83 (Sinistros de Motociclistas e Entregas)
(166, 'Sociologia', 'Paul Virilio (1932–2018), filósofo e urbanista francês criador do conceito de "Dromologia" na obra "Velocidade e Política" (1977), analisa como a aceleração tecnológica imposta pela logística moderna produz inevitavelmente seus próprios acidentes catastróficos.'),
(167, 'Saúde Coletiva', 'Boletim Epidemiológico do Ministério da Saúde e dados da ABRAMET (Associação Brasileira de Medicina de Tráfego) — Apontam que os motociclistas já representam a maioria absoluta das internações por sinistros de trânsito no SUS, com forte concentração entre jovens entregadores de aplicativos.'),
-- Tema 84 (Ilhas de Calor e Arborização Urbana)
(168, 'Climatologia', 'Carlos Nobre, climatologista brasileiro e copresidente do Painel Científico para a Amazônia, alerta que a combinação das mudanças climáticas globais com as "ilhas de calor urbanas" tornará as periferias sem arborização inabitáveis durante ondas de calor extremo.'),
(169, 'Pesquisa', 'Dados do Censo Demográfico do IBGE (Características Urbanísticas do Entorno dos Domicílios) — Evidenciam que milhões de moradores de favelas e periferias brasileiras vivem em ruas sem uma única árvore, sofrendo maior incidência de hipertensão, insolação e alagamentos.');

-- 11. RELACIONAMENTO TEMA <-> ARGUMENTO (Temas 25 a 84)
INSERT INTO tema_argumento (tema_id, argumento_id) VALUES
(25, 49), (25, 50),
(26, 51), (26, 52),
(27, 53), (27, 54),
(28, 55), (28, 56),
(29, 57), (29, 58),
(30, 59), (30, 60),
(31, 61), (31, 62),
(32, 63), (32, 64),
(33, 65), (33, 66),
(34, 67), (34, 68),
(35, 69), (35, 70),
(36, 71), (36, 72),
(37, 73), (37, 74),
(38, 75), (38, 76),
(39, 77), (39, 78),
(40, 79), (40, 80),
(41, 81), (41, 82),
(42, 83), (42, 84),
(43, 85), (43, 86),
(44, 87), (44, 88),
(45, 89), (45, 90),
(46, 91), (46, 92),
(47, 93), (47, 94),
(48, 95), (48, 96),
(49, 97), (49, 98),
(50, 99), (50, 100),
(51, 101), (51, 102),
(52, 103), (52, 104),
(53, 105), (53, 106),
(54, 107), (54, 108),
(55, 109), (55, 110),
(56, 111), (56, 112),
(57, 113), (57, 114),
(58, 115), (58, 116),
(59, 117), (59, 118),
(60, 119), (60, 120),
(61, 121), (61, 122),
(62, 123), (62, 124),
(63, 125), (63, 126),
(64, 127), (64, 128),
(65, 129), (65, 130),
(66, 131), (66, 132),
(67, 133), (67, 134),
(68, 135), (68, 136),
(69, 137), (69, 138),
(70, 139), (70, 140),
(71, 141), (71, 142),
(72, 143), (72, 144),
(73, 145), (73, 146),
(74, 147), (74, 148),
(75, 149), (75, 150),
(76, 151), (76, 152),
(77, 153), (77, 154),
(78, 155), (78, 156),
(79, 157), (79, 158),
(80, 159), (80, 160),
(81, 161), (81, 162),
(82, 163), (82, 164),
(83, 165), (83, 166),
(84, 167), (84, 168);

-- 12. RELACIONAMENTO ARGUMENTO <-> REPERTÓRIO (Argumentos 49 a 168 <-> Repertórios 50 a 169)
INSERT INTO argumento_repertorio (argumento_id, repertorio_id) VALUES
(49, 50), (50, 51),
(51, 52), (52, 53),
(53, 54), (54, 55),
(55, 56), (56, 57),
(57, 58), (58, 59),
(59, 60), (60, 61),
(61, 62), (62, 63),
(63, 64), (64, 65),
(65, 66), (66, 67),
(67, 68), (68, 69),
(69, 70), (70, 71),
(71, 72), (72, 73),
(73, 74), (74, 75),
(75, 76), (76, 77),
(77, 78), (78, 79),
(79, 80), (80, 81),
(81, 82), (82, 83),
(83, 84), (84, 85),
(85, 86), (86, 87),
(87, 88), (88, 89),
(89, 90), (90, 91),
(91, 92), (92, 93),
(93, 94), (94, 95),
(95, 96), (96, 97),
(97, 98), (98, 99),
(99, 100), (100, 101),
(101, 102), (102, 103),
(103, 104), (104, 105),
(105, 106), (106, 107),
(107, 108), (108, 109),
(109, 110), (110, 111),
(111, 112), (112, 113),
(113, 114), (114, 115),
(115, 116), (116, 117),
(117, 118), (118, 119),
(119, 120), (120, 121),
(121, 122), (122, 123),
(123, 124), (124, 125),
(125, 126), (126, 127),
(127, 128), (128, 129),
(129, 130), (130, 131),
(131, 132), (132, 133),
(133, 134), (134, 135),
(135, 136), (136, 137),
(137, 138), (138, 139),
(139, 140), (140, 141),
(141, 142), (142, 143),
(143, 144), (144, 145),
(145, 146), (146, 147),
(147, 148), (148, 149),
(149, 150), (150, 151),
(151, 152), (152, 153),
(153, 154), (154, 155),
(155, 156), (156, 157),
(157, 158), (158, 159),
(159, 160), (160, 161),
(161, 162), (162, 163),
(163, 164), (164, 165),
(165, 166), (166, 167),
(167, 168), (168, 169);

-- Atualiza novamente as sequences do PostgreSQL para o novo total
SELECT setval('eixos_id_seq', (SELECT MAX(id) FROM eixos));
SELECT setval('temas_id_seq', (SELECT MAX(id) FROM temas));
SELECT setval('argumentos_id_seq', (SELECT MAX(id) FROM argumentos));
SELECT setval('repertorios_id_seq', (SELECT MAX(id) FROM repertorios));

-- ============================================================================
-- 13. TEMAS OFICIAIS DA REDAÇÃO DO ENEM (2000 a 2025 — aplicação regular)
-- Temas 85 a 110 | Argumentos 169 a 220 | Repertórios 170 a 221
-- ============================================================================

INSERT INTO temas (id, titulo, eixo_id) VALUES
(85, 'Direitos da criança e do adolescente: como enfrentar esse desafio nacional', 9),                                  -- Enem 2000
(86, 'Desenvolvimento e preservação ambiental: como conciliar os interesses em conflito?', 4),                           -- Enem 2001
(87, 'O direito de votar: como fazer dessa conquista um meio para promover as transformações sociais de que o Brasil necessita?', 8), -- Enem 2002
(88, 'A violência na sociedade brasileira: como mudar as regras desse jogo', 8),                                          -- Enem 2003
(89, 'Como garantir a liberdade de informação e evitar abusos nos meios de comunicação', 2),                              -- Enem 2004
(90, 'O trabalho infantil na realidade brasileira', 9),                                                                   -- Enem 2005
(91, 'O poder de transformação da leitura', 3),                                                                           -- Enem 2006
(92, 'O desafio de se conviver com a diferença', 5),                                                                      -- Enem 2007
(93, 'Como preservar a floresta Amazônica: suspender imediatamente o desmatamento; dar incentivos financeiros a proprietários que deixarem de desmatar; ou aumentar a fiscalização e aplicar multas a quem desmatar', 4), -- Enem 2008
(94, 'O indivíduo frente à ética nacional', 8),                                                                           -- Enem 2009
(95, 'O trabalho na construção da dignidade humana', 7),                                                                  -- Enem 2010
(96, 'Viver em rede no século XXI: os limites entre o público e o privado', 2),                                           -- Enem 2011
(97, 'O movimento imigratório para o Brasil no século XXI', 5),                                                           -- Enem 2012
(98, 'Efeitos da implantação da Lei Seca no Brasil', 10),                                                                 -- Enem 2013
(99, 'Publicidade infantil em questão no Brasil', 9),                                                                     -- Enem 2014
(100, 'A persistência da violência contra a mulher na sociedade brasileira', 5),                                          -- Enem 2015
(101, 'Caminhos para combater a intolerância religiosa no Brasil', 6),                                                    -- Enem 2016
(102, 'Desafios para a formação educacional de surdos no Brasil', 3),                                                     -- Enem 2017
(103, 'Manipulação do comportamento do usuário pelo controle de dados na internet', 2),                                   -- Enem 2018
(104, 'Democratização do acesso ao cinema no Brasil', 6),                                                                 -- Enem 2019
(105, 'O estigma associado às doenças mentais na sociedade brasileira', 1),                                               -- Enem 2020
(106, 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil', 5),                                    -- Enem 2021
(107, 'Desafios para a valorização de comunidades e povos tradicionais no Brasil', 6),                                    -- Enem 2022
(108, 'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil', 7),        -- Enem 2023
(109, 'Desafios para a valorização da herança africana no Brasil', 6),                                                    -- Enem 2024
(110, 'Perspectivas acerca do envelhecimento na sociedade brasileira', 5);                                                -- Enem 2025

-- 14. ARGUMENTOS DOS TEMAS DO ENEM (169 a 220 — 2 por tema)
INSERT INTO argumentos (id, descricao) VALUES
-- Tema 85 (Enem 2000 — Direitos da criança e do adolescente)
(169, 'A distância entre a proteção integral prevista em lei e a realidade de crianças pobres, negras e periféricas revela que o Estado garante direitos no papel, mas falha na oferta de escola, saúde e convivência familiar segura.'),
(170, 'A fragilidade da rede de proteção — conselhos tutelares sem estrutura e subnotificação da violência doméstica e sexual — mantém crianças expostas a abusos justamente nos espaços que deveriam protegê-las.'),
-- Tema 86 (Enem 2001 — Desenvolvimento e preservação ambiental)
(171, 'A falsa dicotomia entre crescimento econômico e preservação sustenta um modelo predatório que converte florestas em pasto e commodities, transferindo os custos ambientais para as próximas gerações.'),
(172, 'Instrumentos de economia verde, como o pagamento por serviços ambientais e a bioeconomia, mostram que a floresta em pé pode gerar mais renda que a devastação, conciliando os interesses em conflito.'),
-- Tema 87 (Enem 2002 — O direito de votar)
(173, 'O voto, conquistado após longas exclusões de mulheres, analfabetos e pobres, perde sua potência transformadora quando o eleitor é tratado como cliente, alvo de clientelismo e compra de votos.'),
(174, 'A baixa formação política e a desinformação reduzem a participação a um ato isolado a cada eleição, enfraquecendo a fiscalização dos eleitos e o controle social sobre as políticas públicas.'),
-- Tema 88 (Enem 2003 — A violência na sociedade brasileira)
(175, 'A violência brasileira tem endereço e cor: concentra-se nas periferias e vitima sobretudo jovens negros, reflexo de uma desigualdade estrutural que o Estado enfrenta mais com repressão do que com políticas sociais.'),
(176, 'A lógica da guerra às drogas e o encarceramento em massa alimentam um ciclo em que prisões superlotadas fortalecem facções criminosas e devolvem à sociedade indivíduos mais violentos.'),
-- Tema 89 (Enem 2004 — Liberdade de informação e abusos nos meios de comunicação)
(177, 'A concentração dos meios de comunicação em poucos grupos familiares compromete a pluralidade de vozes e transforma a liberdade de informação em privilégio de quem controla a mídia.'),
(178, 'Garantir a liberdade de expressão não significa tolerar abusos: a disseminação de notícias falsas e a violação da honra exigem responsabilização posterior, sem recair na censura prévia vedada pela Constituição.'),
-- Tema 90 (Enem 2005 — O trabalho infantil na realidade brasileira)
(179, 'O trabalho infantil é perpetuado pela pobreza e por uma cultura que o naturaliza como formativo, roubando da criança o tempo de brincar e estudar e reproduzindo a exclusão entre gerações.'),
(180, 'As formas invisíveis de exploração, como o trabalho doméstico, o rural familiar e o aliciamento pelo tráfico, escapam à fiscalização e mantêm crianças fora do alcance das políticas de proteção.'),
-- Tema 91 (Enem 2006 — O poder de transformação da leitura)
(181, 'A leitura transforma o indivíduo ao ampliar seu repertório crítico e sua capacidade de compreender o mundo, mas o acesso desigual a livros e bibliotecas faz dela um privilégio de classe no Brasil.'),
(182, 'A ausência de mediadores de leitura e de exemplo familiar faz com que muitos jovens associem o livro à obrigação escolar, e não ao prazer e à autonomia intelectual.'),
-- Tema 92 (Enem 2007 — O desafio de se conviver com a diferença)
(183, 'A intolerância à diferença nasce de estereótipos aprendidos socialmente e se manifesta em racismo, LGBTfobia e capacitismo, negando a muitos grupos o exercício pleno da cidadania.'),
(184, 'A escola é espaço decisivo para a convivência democrática, pois o contato com a diversidade desde a infância desconstrói preconceitos que a família e a mídia podem reforçar.'),
-- Tema 93 (Enem 2008 — Como preservar a floresta Amazônica)
(185, 'O desmatamento da Amazônia é movido por grilagem, pecuária extensiva e impunidade, de modo que apenas uma fiscalização efetiva, com multas cobradas e áreas embargadas, quebra o ciclo de destruição.'),
(186, 'Incentivos financeiros a quem preserva, aliados à bioeconomia das comunidades locais, tornam a floresta em pé mais lucrativa do que derrubada, complementando as ações de comando e controle.'),
-- Tema 94 (Enem 2009 — O indivíduo frente à ética nacional)
(187, 'A tolerância cotidiana a pequenas transgressões, o chamado "jeitinho brasileiro", normaliza a corrupção e enfraquece a confiança da população nas instituições.'),
(188, 'A ética pública depende de cidadãos que fiscalizam e de instituições transparentes, pois a responsabilidade individual não se sustenta sem punição efetiva aos desvios dos agentes públicos.'),
-- Tema 95 (Enem 2010 — O trabalho na construção da dignidade humana)
(189, 'O trabalho só constrói dignidade quando oferece direitos, salário justo e reconhecimento; a informalidade e a precarização reduzem o trabalhador a mero instrumento de produção.'),
(190, 'A persistência do trabalho análogo à escravidão no Brasil mostra que a herança escravocrata ainda define quem realiza os trabalhos mais degradantes e menos protegidos.'),
-- Tema 96 (Enem 2011 — Viver em rede: público e privado)
(191, 'A exposição voluntária da intimidade nas redes sociais dilui as fronteiras entre o público e o privado, transformando a vida pessoal em espetáculo em busca de visibilidade e aprovação.'),
(192, 'A falta de educação digital deixa os usuários vulneráveis a crimes como o vazamento de imagens íntimas e o cyberbullying, nos quais a exposição na rede gera danos permanentes.'),
-- Tema 97 (Enem 2012 — O movimento imigratório para o Brasil)
(193, 'O Brasil se apresenta como país acolhedor, mas imigrantes haitianos, venezuelanos e africanos enfrentam xenofobia, racismo e barreiras para validar diplomas e acessar empregos formais.'),
(194, 'A acolhida humanitária representa um avanço, mas a interiorização de imigrantes sem políticas locais de integração mantém muitos deles em subempregos e moradias precárias.'),
-- Tema 98 (Enem 2013 — Efeitos da implantação da Lei Seca)
(195, 'A Lei Seca reduziu mortes no trânsito ao instituir tolerância zero ao álcool, mas seus efeitos dependem de fiscalização contínua, que ainda é irregular fora das capitais.'),
(196, 'A cultura que associa lazer ao consumo de álcool e a sensação de impunidade levam muitos motoristas a desafiar a lei, o que exige campanhas educativas além da punição.'),
-- Tema 99 (Enem 2014 — Publicidade infantil)
(197, 'A publicidade dirigida a crianças explora sua incapacidade de distinguir entretenimento de persuasão, estimulando o consumismo precoce e hábitos alimentares nocivos.'),
(198, 'Com a migração da publicidade para youtubers mirins e influenciadores digitais, a regulação pensada para a televisão tornou-se insuficiente para proteger a infância do marketing disfarçado.'),
-- Tema 100 (Enem 2015 — Violência contra a mulher)
(199, 'A violência contra a mulher persiste porque o machismo estrutural naturaliza o controle masculino sobre o corpo e a vida feminina, do ciúme possessivo ao feminicídio.'),
(200, 'Apesar de leis avançadas, a falta de delegacias especializadas, casas-abrigo e medidas protetivas fiscalizadas faz com que muitas mulheres não denunciem ou voltem a ser agredidas.'),
-- Tema 101 (Enem 2016 — Intolerância religiosa)
(201, 'A intolerância religiosa no Brasil atinge principalmente as religiões de matriz africana, revelando que o preconceito religioso é também uma expressão do racismo estrutural.'),
(202, 'A laicidade do Estado garante a liberdade de crença, mas a omissão na punição de ataques a terreiros e o uso político da fé ameaçam a convivência entre as diferentes religiões.'),
-- Tema 102 (Enem 2017 — Formação educacional de surdos)
(203, 'A formação educacional de surdos esbarra na escassez de professores bilíngues e de intérpretes de Libras, o que transforma a inclusão escolar em mera presença física, sem aprendizagem real.'),
(204, 'O desconhecimento da Libras pela maioria ouvinte isola os surdos também fora da escola, restringindo seu acesso ao trabalho, à saúde e à vida cultural.'),
-- Tema 103 (Enem 2018 — Manipulação do comportamento pelo controle de dados)
(205, 'Algoritmos de recomendação usam dados pessoais para prever e moldar desejos, criando bolhas de informação que limitam a autonomia do usuário e polarizam o debate público.'),
(206, 'O modelo de negócio das plataformas digitais, baseado na atenção e na venda de perfis comportamentais, transforma o usuário em produto, muitas vezes sem consentimento consciente.'),
-- Tema 104 (Enem 2019 — Democratização do acesso ao cinema)
(207, 'O acesso ao cinema concentra-se nas capitais e nos shoppings de bairros ricos, de modo que a grande maioria dos municípios brasileiros não possui uma única sala de exibição.'),
(208, 'A valorização da produção audiovisual nacional e de cineclubes periféricos é essencial para que a população se veja representada nas telas e exerça seu direito à cultura.'),
-- Tema 105 (Enem 2020 — Estigma associado às doenças mentais)
(209, 'O estigma faz com que transtornos mentais sejam vistos como fraqueza ou "frescura", levando as pessoas a esconder o sofrimento e a adiar a busca por tratamento.'),
(210, 'A rede pública de atenção psicossocial é insuficiente diante da demanda, o que restringe o cuidado em saúde mental a quem pode pagar por psicólogos e psiquiatras.'),
-- Tema 106 (Enem 2021 — Invisibilidade e registro civil)
(211, 'A falta de certidão de nascimento torna milhares de brasileiros invisíveis para o Estado, impedindo o acesso a escola, saúde, programas sociais e demais documentos básicos.'),
(212, 'O sub-registro concentra-se em populações pobres, indígenas e de regiões remotas, de modo que a invisibilidade civil aprofunda as desigualdades que já as marginalizam.'),
-- Tema 107 (Enem 2022 — Comunidades e povos tradicionais)
(213, 'Povos indígenas, quilombolas, ribeirinhos e outras comunidades tradicionais sofrem com a insegurança territorial, pois a demora na demarcação expõe suas terras a grileiros, garimpeiros e ao avanço do agronegócio.'),
(214, 'A desvalorização dos saberes tradicionais apaga conhecimentos sobre biodiversidade e manejo sustentável que são estratégicos para o enfrentamento da crise climática.'),
-- Tema 108 (Enem 2023 — Trabalho de cuidado realizado pela mulher)
(215, 'O trabalho de cuidado com filhos, idosos e a casa recai desproporcionalmente sobre as mulheres e, por não ser remunerado, é tratado como obrigação natural, e não como trabalho.'),
(216, 'A sobrecarga do cuidado limita a escolaridade, a carreira e a renda das mulheres, sobretudo das negras e pobres, ampliando a desigualdade de gênero no mercado de trabalho.'),
-- Tema 109 (Enem 2024 — Herança africana)
(217, 'A herança africana estrutura a cultura brasileira na língua, na religião, na culinária e na música, mas é frequentemente folclorizada ou apagada pelo racismo estrutural.'),
(218, 'O ensino superficial da história africana e afro-brasileira nas escolas impede que os estudantes reconheçam a contribuição dos povos africanos para além da escravidão.'),
-- Tema 110 (Enem 2025 — Envelhecimento)
(219, 'O envelhecimento acelerado da população brasileira exige adaptar saúde, previdência e cidades, mas o país envelhece antes de enriquecer e sem uma estrutura pública de cuidado para os idosos.'),
(220, 'O etarismo associa a velhice à improdutividade e à incapacidade, gerando exclusão no mercado de trabalho, violência e abandono, sobretudo dos idosos mais pobres.');

-- 15. REPERTÓRIOS DOS TEMAS DO ENEM (170 a 221 — 2 por tema)
INSERT INTO repertorios (id, categoria, conteudo) VALUES
-- Tema 85 (Enem 2000)
(170, 'Legislação', 'Estatuto da Criança e do Adolescente (Lei nº 8.069/1990) e art. 227 da Constituição Federal — consagram a doutrina da proteção integral e determinam que família, sociedade e Estado assegurem, com absoluta prioridade, os direitos de crianças e adolescentes.'),
(171, 'Pesquisa', 'Panorama da Violência Letal e Sexual contra Crianças e Adolescentes no Brasil (UNICEF e Fórum Brasileiro de Segurança Pública, 2021) — registrou cerca de 35 mil mortes violentas intencionais de crianças e adolescentes entre 2016 e 2020 e mostrou que a maior parte da violência sexual contra crianças ocorre dentro de casa, praticada por conhecidos.'),
-- Tema 86 (Enem 2001)
(172, 'Ecologia Política', 'Relatório "Nosso Futuro Comum" (Comissão Brundtland, ONU, 1987) — definiu desenvolvimento sustentável como aquele que satisfaz as necessidades do presente sem comprometer a capacidade das gerações futuras de satisfazerem as suas.'),
(173, 'Legislação', 'Política Nacional de Pagamento por Serviços Ambientais (Lei nº 14.119/2021) — cria mecanismos para remunerar produtores rurais e comunidades que conservam vegetação nativa, nascentes e biodiversidade, tornando a preservação economicamente vantajosa.'),
-- Tema 87 (Enem 2002)
(174, 'História', 'Código Eleitoral de 1932 e Constituição de 1988 — o primeiro garantiu o voto feminino no Brasil, e a Carta de 1988 consolidou o voto dos analfabetos e tornou o voto facultativo para jovens de 16 e 17 anos, ampliando a cidadania política.'),
(175, 'Legislação', 'Lei da Ficha Limpa (Lei Complementar nº 135/2010) — nascida de um projeto de iniciativa popular com mais de 1,6 milhão de assinaturas, torna inelegíveis por oito anos políticos condenados por órgão colegiado, exemplo de participação cidadã que vai além do voto.'),
-- Tema 88 (Enem 2003)
(176, 'Pesquisa', 'Atlas da Violência (Ipea e Fórum Brasileiro de Segurança Pública) — mostra de forma recorrente que pessoas negras representam cerca de três em cada quatro vítimas de homicídio no Brasil e que os jovens são a faixa etária mais atingida.'),
(177, 'Sociologia', 'Loïc Wacquant, sociólogo francês autor de "As Prisões da Miséria" (1999) — demonstra como o enfraquecimento do Estado social é acompanhado pelo fortalecimento do Estado penal, que passa a gerir a pobreza por meio da polícia e do encarceramento.'),
-- Tema 89 (Enem 2004)
(178, 'Pesquisa', 'Monitor da Propriedade da Mídia no Brasil (Repórteres Sem Fronteiras e Intervozes, 2017) — revelou que os 50 veículos de maior audiência do país pertencem a apenas 26 grupos, a maioria controlada por famílias, o que indica alto risco à pluralidade.'),
(179, 'Legislação', 'Art. 5º, V, e art. 220 da Constituição Federal — asseguram o direito de resposta e a indenização por dano à imagem e vedam toda censura de natureza política, ideológica e artística, equilibrando liberdade de expressão e responsabilidade.'),
-- Tema 90 (Enem 2005)
(180, 'Pesquisa', 'PNAD Contínua do IBGE (2023) — registrou cerca de 1,6 milhão de crianças e adolescentes de 5 a 17 anos em situação de trabalho infantil no Brasil, a maioria pretos ou pardos.'),
(181, 'Legislação', 'Convenção nº 182 da OIT e Decreto nº 6.481/2008 (Lista TIP) — definem as piores formas de trabalho infantil, incluindo o trabalho doméstico e a utilização de crianças no tráfico de drogas, proibidas para menores de 18 anos.'),
-- Tema 91 (Enem 2006)
(182, 'Pesquisa', 'Retratos da Leitura no Brasil (Instituto Pró-Livro, 6ª edição, 2024) — pela primeira vez, a maioria dos brasileiros (53%) foi classificada como não leitora, ou seja, não leu nem parte de um livro nos três meses anteriores à pesquisa.'),
(183, 'Educação', 'Paulo Freire, em "A importância do ato de ler" (1981) — defende que "a leitura do mundo precede a leitura da palavra", entendendo a leitura como instrumento de libertação e de consciência crítica.'),
-- Tema 92 (Enem 2007)
(184, 'Antropologia', 'Claude Lévi-Strauss, em "Raça e História" (1952) — critica o etnocentrismo, a tendência de julgar outras culturas pelos próprios valores, e afirma que "o bárbaro é, antes de tudo, o homem que crê na barbárie".'),
(185, 'Legislação', 'Lei nº 7.716/1989 e Lei Brasileira de Inclusão (Lei nº 13.146/2015) — tipificam os crimes de preconceito de raça, cor, etnia, religião e procedência nacional, aplicados pelo STF também à homotransfobia (ADO 26, 2019), e garantem a inclusão da pessoa com deficiência.'),
-- Tema 93 (Enem 2008)
(186, 'Pesquisa', 'Sistema PRODES do INPE — a taxa anual de desmatamento da Amazônia Legal caiu de cerca de 13 mil km² em 2021 para cerca de 6,3 mil km² em 2024, após a retomada da fiscalização do Ibama e do Plano de Ação para Prevenção e Controle do Desmatamento (PPCDAm).'),
(187, 'Economia', 'Fundo Amazônia (criado em 2008) — mecanismo financiado sobretudo por doações da Noruega e da Alemanha e gerido pelo BNDES, que apoia projetos de prevenção, monitoramento e uso sustentável da floresta, premiando a redução do desmatamento.'),
-- Tema 94 (Enem 2009)
(188, 'Sociologia', 'Sérgio Buarque de Holanda, em "Raízes do Brasil" (1936) — descreve o "homem cordial", que tende a confundir o público e o privado e a guiar-se por relações pessoais, e não por regras impessoais, traço que dificulta a ética republicana.'),
(189, 'Legislação', 'Lei de Acesso à Informação (Lei nº 12.527/2011) e Lei Anticorrupção (Lei nº 12.846/2013) — ampliam a transparência dos dados públicos e responsabilizam empresas por atos lesivos contra a administração pública.'),
-- Tema 95 (Enem 2010)
(190, 'Filosofia', 'Karl Marx, nos "Manuscritos Econômico-Filosóficos" (1844) — desenvolve o conceito de trabalho alienado, no qual o trabalhador não se reconhece no que produz e se torna estranho a si mesmo, perdendo a dimensão humanizadora do trabalho.'),
(191, 'Pesquisa', 'Ministério do Trabalho e Emprego — desde 1995, mais de 60 mil trabalhadores foram resgatados de condições análogas à escravidão no Brasil, e 2023 registrou mais de 3 mil resgates, o maior número desde 2009.'),
-- Tema 96 (Enem 2011)
(192, 'Antropologia', 'Paula Sibilia, antropóloga autora de "O show do eu: a intimidade como espetáculo" (2008) — analisa como as redes transformam a intimidade em vitrine e a subjetividade em algo construído para ser visto pelos outros.'),
(193, 'Legislação', 'Lei Carolina Dieckmann (Lei nº 12.737/2012) — tipificou a invasão de dispositivos informáticos após o vazamento de fotos íntimas da atriz, tornando-se marco na proteção da privacidade no ambiente digital.'),
-- Tema 97 (Enem 2012)
(194, 'Legislação', 'Lei de Migração (Lei nº 13.445/2017) — substituiu o Estatuto do Estrangeiro, herdado da ditadura militar, e passou a tratar a migração como direito humano, repudiando a xenofobia e a discriminação.'),
(195, 'Pesquisa', 'Operação Acolhida (Governo Federal e agências da ONU) — desde 2018, interiorizou mais de 100 mil refugiados e migrantes venezuelanos de Roraima para outras cidades brasileiras, embora a integração ao mercado formal siga como desafio.'),
-- Tema 98 (Enem 2013)
(196, 'Legislação', 'Lei Seca (Lei nº 11.705/2008), endurecida pela Lei nº 12.760/2012 — estabeleceu tolerância zero para álcool ao volante e permitiu comprovar a embriaguez por vídeo, testemunhos e outros meios além do bafômetro.'),
(197, 'Saúde Coletiva', 'Relatório Global sobre Segurança Viária da Organização Mundial da Saúde (2023) — os sinistros de trânsito matam cerca de 1,19 milhão de pessoas por ano no mundo, e dirigir sob efeito de álcool está entre os principais fatores de risco evitáveis.'),
-- Tema 99 (Enem 2014)
(198, 'Legislação', 'Resolução nº 163/2014 do Conanda e art. 37 do Código de Defesa do Consumidor — consideram abusiva a publicidade que se aproveita da deficiência de julgamento e experiência da criança.'),
(199, 'Audiovisual', 'Documentário "Criança, a Alma do Negócio" (Estela Renner, 2008) — mostra como o mercado transforma crianças em consumidoras e em promotoras de compras dentro da própria família.'),
-- Tema 100 (Enem 2015)
(200, 'Legislação', 'Lei Maria da Penha (Lei nº 11.340/2006) e Lei do Feminicídio (Lei nº 13.104/2015) — criaram mecanismos para coibir a violência doméstica e qualificaram o assassinato de mulheres por razões de gênero como crime hediondo.'),
(201, 'Filosofia', 'Simone de Beauvoir, em "O Segundo Sexo" (1949) — afirma que "ninguém nasce mulher: torna-se mulher", mostrando que a subordinação feminina é uma construção social, e não um destino biológico.'),
-- Tema 101 (Enem 2016)
(202, 'História', 'Mãe Gilda de Ogum e Lei nº 11.635/2007 — a ialorixá baiana morreu em 2000 após ter seu terreiro depredado e sua imagem difamada; em sua memória, 21 de janeiro tornou-se o Dia Nacional de Combate à Intolerância Religiosa.'),
(203, 'Legislação', 'Art. 5º, VI, e art. 19 da Constituição Federal — garantem a inviolabilidade da liberdade de consciência e de crença e a proteção aos locais de culto, ao mesmo tempo que proíbem o Estado de subvencionar ou embaraçar o funcionamento de cultos religiosos.'),
-- Tema 102 (Enem 2017)
(204, 'Legislação', 'Lei nº 10.436/2002 e Lei nº 14.191/2021 — a primeira reconheceu a Libras como meio legal de comunicação e expressão, e a segunda incluiu a educação bilíngue de surdos como modalidade de ensino na LDB.'),
(205, 'Pesquisa', 'Censo Demográfico do IBGE (2010) — cerca de 9,7 milhões de brasileiros declararam algum grau de deficiência auditiva, dos quais mais de 2 milhões com deficiência severa, evidenciando a dimensão da demanda por acessibilidade.'),
-- Tema 103 (Enem 2018)
(206, 'Tecnologia', 'Escândalo Cambridge Analytica (2018) — dados de cerca de 87 milhões de usuários do Facebook foram coletados sem autorização e usados para direcionar propaganda política personalizada, inclusive na eleição presidencial norte-americana de 2016.'),
(207, 'Legislação', 'Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018) — estabelece que o tratamento de dados exige base legal, como o consentimento livre e informado, e garante ao titular os direitos de acesso, correção e eliminação de seus dados.'),
-- Tema 104 (Enem 2019)
(208, 'Pesquisa', 'Observatório Brasileiro do Cinema e do Audiovisual (Ancine) — menos de 10% dos municípios brasileiros possuem ao menos uma sala de cinema, e as salas se concentram nas capitais e em shopping centers.'),
(209, 'Legislação', 'Art. 215 da Constituição Federal e Lei da Cota de Tela (Lei nº 14.814/2024) — o Estado deve garantir o pleno exercício dos direitos culturais, e a cota de tela obriga os cinemas a exibir uma parcela mínima de filmes brasileiros.'),
-- Tema 105 (Enem 2020)
(210, 'Sociologia', 'Erving Goffman, em "Estigma: notas sobre a manipulação da identidade deteriorada" (1963) — explica como atributos socialmente desvalorizados reduzem o indivíduo a uma marca, levando-o à exclusão e ao isolamento.'),
(211, 'Saúde Coletiva', 'Organização Mundial da Saúde (relatório de 2017) — aponta o Brasil como o país com a maior prevalência de transtornos de ansiedade do mundo, atingindo cerca de 9,3% da população.'),
-- Tema 106 (Enem 2021)
(212, 'Legislação', 'Lei nº 9.534/1997 e Lei de Registros Públicos (Lei nº 6.015/1973) — garantem a gratuidade do registro civil de nascimento e da primeira certidão para todos os brasileiros.'),
(213, 'Pesquisa', 'IBGE, Estatísticas do Registro Civil — estima-se que cerca de 3 milhões de brasileiros não possuam certidão de nascimento, e o sub-registro é maior na Região Norte e entre as populações indígenas.'),
-- Tema 107 (Enem 2022)
(214, 'Legislação', 'Convenção nº 169 da OIT e Decreto nº 6.040/2007 — asseguram aos povos indígenas e tribais o direito à consulta prévia, livre e informada e instituem a Política Nacional de Desenvolvimento Sustentável dos Povos e Comunidades Tradicionais.'),
(215, 'Literatura', 'Ailton Krenak, em "Ideias para adiar o fim do mundo" (2019) — critica a ideia de uma humanidade separada da natureza e defende os modos de vida dos povos originários como alternativa ao modelo predatório.'),
-- Tema 108 (Enem 2023)
(216, 'Pesquisa', 'PNAD Contínua do IBGE (2022) — as mulheres dedicam, em média, 21,3 horas semanais aos afazeres domésticos e ao cuidado de pessoas, quase o dobro das 11,7 horas dedicadas pelos homens.'),
(217, 'Economia Feminista', 'Silvia Federici, em "O Ponto Zero da Revolução" (2012) — argumenta que o trabalho doméstico não remunerado sustenta a economia capitalista ao reproduzir diariamente a força de trabalho: "aquilo que eles chamam de amor, nós chamamos de trabalho não pago".'),
-- Tema 109 (Enem 2024)
(218, 'Legislação', 'Lei nº 10.639/2003 — tornou obrigatório o ensino de História e Cultura Afro-Brasileira e Africana nas escolas, mas pesquisa do Geledés e do Instituto Alana (2023) mostrou que a maioria das secretarias municipais de educação realiza poucas ou nenhuma ação para cumpri-la.'),
(219, 'Sociologia', 'Lélia Gonzalez e o conceito de "amefricanidade" (1988) — a intelectual destaca a influência africana na formação cultural e linguística do Brasil, chamando o português falado aqui de "pretuguês".'),
-- Tema 110 (Enem 2025)
(220, 'Pesquisa', 'Censo Demográfico do IBGE (2022) — a população com 60 anos ou mais chegou a cerca de 32 milhões de pessoas, mais de 15% do total, e o índice de envelhecimento quase dobrou em relação a 2010.'),
(221, 'Legislação', 'Estatuto da Pessoa Idosa (Lei nº 10.741/2003) — assegura às pessoas com 60 anos ou mais prioridade no atendimento, proteção contra discriminação, violência e abandono e acesso à saúde, ao transporte e ao lazer.');

-- 16. RELACIONAMENTO TEMA <-> ARGUMENTO (Temas 85 a 110)
INSERT INTO tema_argumento (tema_id, argumento_id) VALUES
(85, 169), (85, 170),
(86, 171), (86, 172),
(87, 173), (87, 174),
(88, 175), (88, 176),
(89, 177), (89, 178),
(90, 179), (90, 180),
(91, 181), (91, 182),
(92, 183), (92, 184),
(93, 185), (93, 186),
(94, 187), (94, 188),
(95, 189), (95, 190),
(96, 191), (96, 192),
(97, 193), (97, 194),
(98, 195), (98, 196),
(99, 197), (99, 198),
(100, 199), (100, 200),
(101, 201), (101, 202),
(102, 203), (102, 204),
(103, 205), (103, 206),
(104, 207), (104, 208),
(105, 209), (105, 210),
(106, 211), (106, 212),
(107, 213), (107, 214),
(108, 215), (108, 216),
(109, 217), (109, 218),
(110, 219), (110, 220);

-- 17. RELACIONAMENTO ARGUMENTO <-> REPERTÓRIO (Argumentos 169 a 220 <-> Repertórios 170 a 221)
INSERT INTO argumento_repertorio (argumento_id, repertorio_id) VALUES
(169, 170), (170, 171),
(171, 172), (172, 173),
(173, 174), (174, 175),
(175, 176), (176, 177),
(177, 178), (178, 179),
(179, 180), (180, 181),
(181, 182), (182, 183),
(183, 184), (184, 185),
(185, 186), (186, 187),
(187, 188), (188, 189),
(189, 190), (190, 191),
(191, 192), (192, 193),
(193, 194), (194, 195),
(195, 196), (196, 197),
(197, 198), (198, 199),
(199, 200), (200, 201),
(201, 202), (202, 203),
(203, 204), (204, 205),
(205, 206), (206, 207),
(207, 208), (208, 209),
(209, 210), (210, 211),
(211, 212), (212, 213),
(213, 214), (214, 215),
(215, 216), (216, 217),
(217, 218), (218, 219),
(219, 220), (220, 221);

SELECT setval('temas_id_seq', (SELECT MAX(id) FROM temas));
SELECT setval('argumentos_id_seq', (SELECT MAX(id) FROM argumentos));
SELECT setval('repertorios_id_seq', (SELECT MAX(id) FROM repertorios));
