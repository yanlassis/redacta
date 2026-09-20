# Eixo Redação: Escopo do Projeto e Guia de Fases

## 📌 Visão Geral do Projeto
A plataforma **Eixo Redação** tem como objetivo fornecer uma pesquisa rápida e sem atrito para estudantes do ENEM/Vestibulares e professores. Eles devem conseguir, em poucos segundos, encontrar temas de redação associados a eixos temáticos, argumentos sólidos e repertórios socioculturais.

**Stack Tecnológico:**
*   **Backend:** Node.js (Express)
*   **Banco de Dados:** Supabase (PostgreSQL)
*   **Frontend:** Vanilla JS, HTML, CSS (com guias de design *Impeccable*)

---

## 🚀 Fases do Desenvolvimento

### Fase 1: Fundação e Setup (Base)
*   **Yan (Backend):** Modelar as tabelas no Supabase (eixos, 	emas, rgumentos, epertorios). Criar conexão inicial no server.js e proteger variáveis de ambiente (.env).
*   **Gregol (UI/UX):** Definir paleta de cores (fundo papel/osso, tons de índigo), tipografia e criar o esqueleto do index.html.
*   **Gabre (Lógica/QA):** Levantar a estrutura inicial do pp.js e testar a comunicação do frontend com uma API "falsa" ou dados estáticos, além de mapear o primeiro tema real para o banco.

### Fase 2: Conexão e Construção Visual (Core)
*   **Yan (Backend):** Criar os endpoints principais da API (ex: /api/temas/busca). Fazer com que a API busque dados reais do Supabase e retorne em formato JSON.
*   **Gregol (UI/UX):** Estilizar os componentes principais: Barra de Pesquisa, Botões, e os Cards que vão exibir os temas/argumentos, já cuidando do visual no Celular.
*   **Gabre (Lógica/QA):** Programar o Javascript (pp.js) para "ouvir" o campo de busca, chamar o endpoint do Yan usando etch(), e injetar o HTML construído pelo Gregol com os dados reais.

### Fase 3: Refinamento e Interações (Impeccable)
*   **Yan (Backend):** Otimizar a busca no banco (filtros avançados de pesquisa), adicionar tratamentos de erro caso o banco caia, evitar requisições redundantes.
*   **Gregol (UI/UX):** Adicionar micro-interações: hover nos cards, transições suaves, estados de foco nos inputs e garantir o design polido (sem bordas grosseiras, uso correto de espaço em branco).
*   **Gabre (Lógica/QA):** Gerenciar estados de tela: mostrar um "Loading" (carregando) visual, tratar quando a busca não encontra nada ("Nenhum tema encontrado") e validar se a renderização não está quebrando o design.

### Fase 4: Qualidade, Conteúdo e Lançamento (Deploy)
*   **Yan (Backend):** Revisão de segurança, remoção de logs sensíveis e deploy do Backend (ex: Render, Vercel ou Railway).
*   **Gregol (UI/UX):** Revisão de acessibilidade (contraste de cores, navegação por teclado) e auditoria visual final no celular.
*   **Gabre (Lógica/QA):** Povoar o banco do Supabase com dezenas de eixos e temas REAIS. Fazer o teste de ponta-a-ponta tentando usar o site como um aluno real faria.
