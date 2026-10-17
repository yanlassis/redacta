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
