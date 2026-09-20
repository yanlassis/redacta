# 💻 Operador P1: Yan (Backend e Banco de Dados)

**Foco Principal:** Desempenho, entrega de dados correta e arquitetura de integração.

## 🛠 Atribuições e Responsabilidades

1. **Modelagem de Banco de Dados (Supabase)**
   * Definir os relacionamentos (Um Eixo tem vários Temas; Um Tema tem Argumentos e Repertórios).
   * Otimizar buscas e evitar lentidão nas consultas no PostgreSQL.

2. **Criação da API Node.js (Express)**
   * Manter o server.js limpo, bem roteado e escalável.
   * Criar os endpoints que o frontend consumirá.
   * Proteger senhas e tokens (.env), garantindo que nunca vazem no GitHub.

3. **Regras de Negócio**
   * Decidir como a busca vai funcionar: vai pesquisar apenas no título do tema ou dentro do texto do argumento também?
   * Limitar os resultados da busca se houver muitos registros (Paginação/Limit).

4. **DevOps e Fluxo de Repositório**
   * Atuar como dono da infraestrutura. Fazer os deploys do Frontend e do Backend.
   * Gerenciar o GitHub: Proteger a branch \main\, revisar código do Gregol e do Gabre.
   * Executar o *Merge* de Pull Requests (Garantir que nenhum código vá para produção sem ser validado).

## 📌 Entregáveis por Fase
*   **Fase 1:** Conexão confirmada no 	est_db.js com o Supabase e servidor local ativo na porta 3000. Tabelas básicas criadas.
*   **Fase 2:** Rota GET /api/temas devolvendo JSON corretamente.
*   **Fase 3:** Sistema tolerante a falhas (ex: o que o backend retorna se a pesquisa for vazia?).
*   **Fase 4:** Ambiente de produção no ar, rodando estável e rápido.

