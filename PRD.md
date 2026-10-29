# PRD — Palavra Secreta

**Versão:** 0.2
**Data:** 2026-10-29
**Status:** Rascunho para validação
**Idioma:** Português brasileiro

## 1. Visão do produto

Palavra Secreta é uma plataforma de jogos casuais de palavras.
O jogador pode escolher diferentes modos de desafio, desde
descobrir palavras letra por letra até resolver charadas.

O objetivo é oferecer uma experiência divertida, acessível,
rápida de aprender e adequada para sessões curtas.

## 2. Público-alvo

- Pessoas que gostam de palavras, enigmas e desafios.
- Jogadores casuais de celular e computador.
- Pessoas interessadas em vocabulário e raciocínio.
- Jogadores que preferem partidas sem pressão de tempo.

## 3. Modos de jogo

### 3.1. Termo — adivinhação por letras

Inspirado na mecânica de jogos como Termo e Wordle.

Regras:
- O jogo escolhe uma palavra secreta.
- O jogador tenta descobrir a palavra digitando outra palavra.
- Cada tentativa deve possuir o número de letras exigido.
- Após cada tentativa, o jogo informa quais letras estão:
  - Na posição correta.
  - Na palavra, mas em outra posição.
  - Ausentes da palavra.
- O jogador tem um número limitado de tentativas.
- A rodada termina quando a palavra é descoberta ou as
  tentativas acabam.

Requisitos:
- Tratar letras maiúsculas e minúsculas como equivalentes.
- Aceitar palavras em português brasileiro.
- Tratar acentos de maneira consistente.
- Não contar entradas inválidas como tentativas.
- Explicar o significado das cores e oferecer indicadores textuais.

### 3.2. Charadas

O jogador recebe uma pergunta ou enigma cuja resposta é uma palavra.

Regras:
- Apresentar uma charada por rodada.
- Permitir que o jogador digite uma resposta.
- Ignorar espaços externos e diferenças entre maiúsculas
  e minúsculas.
- Permitir solicitar pistas adicionais.
- Informar quando a resposta estiver correta.
- Permitir revelar a resposta.
- Oferecer outro desafio após o término.

### 3.3. Palavra misteriosa

O jogador recebe pistas progressivas sobre uma palavra secreta.

Regras:
- Apresentar uma pista inicial.
- Permitir solicitar outras pistas.
- Manter o histórico de palpites.
- Encerrar a rodada quando o jogador acertar ou revelar
  a resposta.

Este modo não deve fingir que calcula proximidade semântica.
Se essa funcionalidade for implementada futuramente, sua
lógica deverá ser especificada e testada separadamente.

### 3.4. Categorias — proposta futura

O jogador recebe um conjunto de palavras e precisa identificar
relações ou agrupá-las por categorias.

Exemplos:
- Animais.
- Alimentos.
- Objetos.
- Natureza.
- Cultura e entretenimento.

Este modo está planejado, mas não é obrigatório na primeira
versão jogável.

## 4. Menu principal

A tela inicial deve permitir escolher um modo de jogo.

Cada modo deve possuir:
- Nome.
- Descrição curta.
- Explicação das regras.
- Botão para começar.
- Indicação de dificuldade, quando aplicável.

O jogador deve poder retornar ao menu sem perder a clareza
sobre o estado da partida.

## 5. Objetivos

- Oferecer diferentes experiências de adivinhação.
- Tornar o início de uma partida simples.
- Incentivar a descoberta de palavras.
- Garantir uma experiência utilizável por teclado.
- Funcionar em computadores e dispositivos móveis.
- Permitir adicionar novos modos no futuro.

## 6. Requisitos funcionais

RF-01 — Exibir o menu de modos de jogo.

RF-02 — Permitir iniciar uma partida em cada modo disponível.

RF-03 — Implementar o modo Termo com feedback por letra.

RF-04 — Implementar o modo de charadas com respostas digitadas.

RF-05 — Implementar o modo Palavra Misteriosa com pistas.

RF-06 — Validar entradas vazias e inválidas.

RF-07 — Impedir que entradas repetidas sejam contabilizadas
indevidamente.

RF-08 — Informar vitória, derrota ou revelação da resposta.

RF-09 — Permitir reiniciar uma rodada.

RF-10 — Permitir retornar ao menu principal.

RF-11 — Adaptar o layout a telas pequenas e grandes.

RF-12 — Oferecer feedback textual além de cores.

RF-13 — Permitir navegar usando teclado.

RF-14 — Manter os dados do jogo separados da apresentação.

## 7. Requisitos não funcionais

RNF-01 — Não exigir cadastro.

RNF-02 — Não exigir conexão de rede para os modos locais.

RNF-03 — Utilizar HTML semântico.

RNF-04 — Apresentar foco de teclado visível.

RNF-05 — Respeitar a preferência por movimento reduzido.

RNF-06 — Evitar dependências externas obrigatórias.

RNF-07 — Não coletar dados pessoais na versão inicial.

RNF-08 — Manter código legível e modular.

## 8. Escopo da primeira versão

Incluído:
- Menu principal.
- Modo Termo.
- Modo Charadas.
- Modo Palavra Misteriosa.
- Seleção de tema visual.
- Interface responsiva.
- Feedback de acerto e erro.
- Botões para reiniciar e retornar ao menu.
- Documentação técnica.

Fora do escopo inicial:
- Multiplayer.
- Contas de usuário.
- Ranking online.
- Sincronização entre dispositivos.
- Monetização.
- Inteligência artificial para criar charadas.
- Classificação semântica avançada.
- Aplicativo nativo para celular.

## 9. Critérios de aceitação

- O jogador consegue selecionar um modo pelo menu.
- O Termo compara as letras nas posições corretas.
- Letras repetidas são avaliadas de forma consistente.
- As charadas aceitam respostas válidas.
- O modo Palavra Misteriosa oferece pistas progressivas.
- Entradas vazias não avançam a rodada.
- O jogador pode revelar respostas quando permitido.
- Os estados de vitória e derrota são comunicados.
- É possível retornar ao menu.
- Os controles funcionam por teclado.
- A interface é utilizável em telas pequenas.

## 10. Decisões pendentes

1. O Termo terá palavras de quatro, cinco ou seis letras?
2. Deve existir um desafio diário e outro modo ilimitado?
3. O jogador poderá escolher a dificuldade?
4. As charadas serão separadas por categorias?
5. Devem existir pontuação, estatísticas e sequência de vitórias?
6. O progresso deve ser salvo no navegador?
7. O jogo terá modo escuro?
8. Qual identidade visual deve ser adotada definitivamente?

## 11. Referências

- Termo: https://term.ooo/
- Wordle: https://www.nytimes.com/games/wordle/index.html
- Connections: https://www.nytimes.com/games/connections
- Contexto: https://www.contexto.us.com/pt/como-jogar
- WCAG: https://www.w3.org/TR/WCAG22/

A análise dessas referências serve para estudar mecânicas,
não para copiar identidade visual, conteúdo ou código.