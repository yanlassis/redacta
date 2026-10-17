# ⚙️ Operador P3: Gabre (Lógica Frontend, Integração e QA)

**Foco Principal:** Fazer a tela "ganhar vida", manipulação de dados e qualidade do produto.

## 🛠 Atribuições e Responsabilidades

1. **Lógica de Interface (Vanilla Javascript - app.js)**
   * Escrever as chamadas para a API do Yan usando etch().
   * Ler o DOM (árvore HTML do Gregol) e criar os cards interativos programaticamente usando os dados do Supabase.

2. **Gerenciamento de Estados de Tela**
   * **Estado de Sucesso:** Popula a tela com os cards maravilhosos do Gregol.
   * **Estado de Loading:** Desabilita botão de pesquisa enquanto a busca ocorre, mostra animação.
   * **Estado de Erro/Vazio:** Apresenta mensagem amigável caso não encontre o que foi digitado.

3. **Conteúdo, QA (Garantia de Qualidade) e Testes**
   * Gabre é a "voz" dos alunos: ele vai cadastrar a base de dados real usando a interface do Supabase.
   * Ao final do dia, testa todo o fluxo: "Eu digito X. Aperto Enter. Espero o tema Y. O layout quebrou? A API respondeu rápido?".

## 📌 Entregáveis por Fase
*   **Fase 1:** Scripts base do pp.js configurados (seletores do DOM prontos). Mapeamento de 2-3 temas reais no banco só pra testes.
*   **Fase 2:** Lista de temas do banco aparecendo magicamente na tela construída pelo Gregol.
*   **Fase 3:** Tratar 	ry/catch em todas as conexões para nunca quebrar a tela do usuário silenciosamente. Regras do estado de loading completas.
*   **Fase 4:** Banco do Supabase preenchido com diversos Eixos reais do ENEM e bateria de testes de usabilidade.
