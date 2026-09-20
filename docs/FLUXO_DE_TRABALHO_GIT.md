# 🔄 Fluxo de Trabalho (Git, GitHub e DevOps)

Este documento define as regras de versionamento e como o código deve transitar das máquinas de cada desenvolvedor até a produção.

## 👑 O Papel do DevOps (Yan - P1)
O Yan (P1) atua como o Guardião do Repositório e Infraestrutura (DevOps). Isso significa que:
* A branch main é sagrada. Código quebrado não entra nela.
* **Apenas o Yan aprova e faz o merge (junção) final dos Pull Requests (PRs) para a branch main.**
* O Yan configurará os deploys automáticos (o momento em que o código vai para o ar) quando a branch main for atualizada.

---

## 🌿 Regras de Branches (Ramificações)
Nunca trabalhe diretamente na branch main. Quando o **Gregol (P2)** ou o **Gabre (P3)** forem criar ou editar algo, devem seguir este fluxo:

1. **Atualize sua máquina primeiro:**
   git checkout main
   git pull origin main
2. **Crie a sua branch de trabalho (baseada na tarefa):**
   * Padrão de nomeclatura: <tipo>/<nome-da-tarefa-com-hifens>
   * *Exemplos:* 
     * eat/card-de-tema (Para criar o HTML/CSS do card)
     * eat/lógica-busca-fetch (Para o script de integração)
     * ix/erro-responsividade-celular (Para correções)
   * Comando: git checkout -b feat/card-de-tema

## 💬 Padrão de Commits (Conventional Commits)
Seus commits devem contar uma história clara do que foi feito. Usem este padrão em inglês ou português:

* eat: cria a barra de pesquisa na página inicial (Nova funcionalidade)
* ix: corrige o tamanho da fonte no celular (Correção de erro)
* style: ajusta as cores de fundo conforme o guia Impeccable (Ajustes de CSS e design sem alterar a lógica)
* efactor: melhora a lógica do fetch no app.js (Melhoria de código existente)

## 🔀 Pull Requests (O caminho para a Main)
Quando sua funcionalidade estiver pronta:
1. Suba sua branch para o GitHub: git push origin sua-branch
2. Abra o GitHub e crie um **Pull Request (PR)** apontando para a main.
3. No PR, adicione uma breve descrição do que você fez (se puder, coloque um print da tela, caso seja visual).
4. **Yan (DevOps)** vai revisar o código. Se estiver tudo certo, ele faz o *Merge*. Se faltar algo, ele vai comentar pedindo ajustes.

> **Resumo da Ópera:** P2 e P3 criam branches, fazem commits claros, empurram pro GitHub e pedem permissão ao P1 (via PR) para integrar as mudanças ao projeto oficial.
