# Documento de Projeto Técnico — Jogo de Adivinhação de Palavras (Design 02)

## 1. Visão geral

Este documento detalha a implementação técnica do jogo casual de adivinhação de palavras com foco no Design 02, que prioriza uma interface vibrante, moderna, mobile-first e com forte apelo visual para público jovem.

O objetivo é construir um MVP funcional, rápido de jogar e com boa retenção diária, seguindo o PRD do produto e o conceito visual do mockup do Design 02.

## 2. Objetivo do projeto

Implementar um jogo diário de palavras no modelo Wordle-like, com:
- 1 desafio por dia
- palavras por tema
- feedback visual imediato
- streak diário
- estatísticas básicas
- compartilhamento de resultado
- interface responsiva e mobile-first
- foco em velocidade, clareza e diversão

## 3. Escopo do MVP

### Funcionalidades incluídas
- palavra do dia escolhida por data
- categoria temática por dia
- até 6 tentativas por partida
- validação de palavra
- feedback por cor por letra
- resultado final (vitória/derrota)
- streak atual e melhor streak
- histórico local do jogador
- compartilhamento de resultado
- layout responsivo

### Funcionalidades fora do MVP
- ranking global
- multiplayer
- autenticação
- assinatura premium
- compras dentro do app
- login social
- sistema de avatars avançados

## 4. Estratégia de implementação

A solução mais adequada para o MVP é uma aplicação web front-end moderna sem backend obrigatório, usando armazenamento local para dados do jogador e uma base estática de palavras.

### Por que esta arquitetura?
- reduz tempo de desenvolvimento
- facilita deploy rápido
- atende bem ao uso diário e mobile
- elimina necessidade de autenticação para MVP
- permite evoluir para backend futuro sem quebrar estrutura

## 5. Stack tecnológica recomendada

### Front-end
- React + Vite
- TypeScript
- CSS Modules ou CSS-in-JS
- React Hook Form (opcional, apenas se necessário)

### Estado e persistência
- React State / Context API
- localStorage para:
  - streak
  - histórico de partidas
  - estatísticas
  - último estado da partida em andamento

### Dados
- arquivo JSON estático com palavras por categoria
- utilitário para selecionar palavra do dia por data

### Build e deploy
- Vite
- Netlify ou Vercel

### Testes
- Vitest
- Testing Library
- Playwright para smoke tests do fluxo principal

## 6. Arquitetura geral

A arquitetura será dividida em camadas:

1. Camada de apresentação
   - telas e componentes visuais
   - lógica de renderização

2. Camada de domínio
   - regras do jogo
   - cálculo de feedback
   - seleção da palavra do dia
   - validação de tentativa

3. Camada de persistência
   - localStorage
   - leitura e gravação de estado do jogador

4. Camada de utilitários
   - geração de palavra por data
   - processamento de categorias
   - compartilhamento

## 7. Estrutura do projeto

```bash
src/
  app/
    App.tsx
    routes/
      HomePage.tsx
      GamePage.tsx
      ResultPage.tsx
  components/
    Header.tsx
    ThemeBadge.tsx
    WordGrid.tsx
    Keyboard.tsx
    StatusBanner.tsx
    ResultPanel.tsx
    StatsCard.tsx
    ShareButton.tsx
  features/
    game/
      gameSlice.ts
      gameService.ts
      wordUtils.ts
      constants.ts
    storage/
      storage.ts
  data/
    words.json
  styles/
    tokens.css
    globals.css
    game.css
  types/
    game.ts
    storage.ts
  utils/
    date.ts
    share.ts
    accessibility.ts
```

## 8. Modelo de dados

### 8.1 Entidade Word

```ts
interface Word {
  value: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
```

### 8.2 Entidade Guess

```ts
interface Guess {
  id: number;
  letters: string[];
  statuses: LetterStatus[];
}
```

### 8.3 Enum LetterStatus

```ts
enum LetterStatus {
  ABSENT = 'absent',
  PRESENT = 'present',
  CORRECT = 'correct'
}
```

### 8.4 Entidade GameState

```ts
interface GameState {
  dateKey: string;
  category: string;
  solution: string;
  currentGuess: string;
  guesses: Guess[];
  maxAttempts: number;
  isCompleted: boolean;
  isWon: boolean;
  resultMessage: string;
  startedAt: string;
  completedAt?: string;
}
```

### 8.5 Entidade PlayerStats

```ts
interface PlayerStats {
  currentStreak: number;
  bestStreak: number;
  totalWins: number;
  totalGames: number;
  lastPlayedDate: string | null;
  winRate: number;
  recentResults: boolean[];
}
```

## 9. Regras de negócio do jogo

### 9.1 Seleção da palavra do dia
- a palavra do dia deve ser calculada por data usando uma função determinística
- a mesma data deve sempre produzir a mesma palavra
- a categoria pode ser escolhida com base na data ou em uma lista por dia

Exemplo:

```ts
const dateKey = formatDate(new Date());
const index = hashString(dateKey) % words.length;
const solution = words[index];
```

### 9.2 Validação da tentativa
- a tentativa deve ter o mesmo tamanho da solução
- a tentativa deve ser uma palavra válida no banco permitido
- a tentativa repetida deve ser rejeitada
- palavras inválidas devem disparar feedback visual simples

### 9.3 Feedback por letra

A lógica do feedback é a mesma da mecânica clássica:
- se a letra está correta e no lugar certo: verde
- se a letra existe na palavra, mas em outra posição: amarelo
- se a letra não existe: cinza

### 9.4 Limite de tentativas
- início com 6 tentativas
- cada tentativa bem-sucedida encerra a partida
- se a última tentativa falhar, o jogo encerra com derrota

## 10. Implementação do fluxograma do jogo

### Fluxo principal
1. Carregar a página inicial
2. Verificar se usuário já jogou hoje
3. Se não jogou: iniciar nova partida
4. Se já jogou: carregar último estado salvo
5. O jogador digita palavra
6. Sistema valida tentativa
7. Sistema calcula feedback
8. Renderiza grade com estado das letras
9. Atualiza número de tentativas
10. Se ganhou ou perdeu, finaliza partida
11. Salva estatísticas do jogador
12. Exibe tela de resultado
13. Usuário pode compartilhar resultado ou voltar ao início

## 11. Mapeamento do Design 02 para implementação

O Design 02 tem uma direção visual específica e precisa ser reproduzida na estrutura UI.

### 11.1 Direção visual
- estilo jovem e dinâmico
- fundo claro com contraste forte
- paleta vibrante com azul, roxo e rosa
- elementos arredondados
- UI mobile-first

### 11.2 Paleta recomendada

```css
:root {
  --bg: #f4f7fb;
  --panel: #ffffff;
  --ink: #162033;
  --muted: #61708a;
  --line: rgba(22, 32, 51, 0.08);
  --brand: #4b7ef7;
  --brand-2: #7eb8ff;
  --success: #2ac36b;
  --warning: #f7b731;
  --danger: #727c8b;
  --shadow: 0 18px 40px rgba(48, 64, 98, 0.12);
}
```

### 11.3 Componentes visuais conforme design 02
- cabeçalho com logotipo e streak
- tema em badge colorido
- grade de letras em caixa arredondada
- teclado com estados em cores
- painel de estatísticas em blocos
- banner de status com background suave
- botões primários e secundários com visual arredondado

## 12. Componentes de interface

### 12.1 Header
Responsável por:
- nome do jogo
- badge de desafio diário
- indicador do tema
- streak atual

### 12.2 WordGrid
Renderiza as tentativas realizadas em uma grade, com 6 linhas e 5 colunas.
Cada caixa representa uma posição da palavra.

### 12.3 Keyboard
Teclado virtual com letras em estados:
- normal
- usada e correta
- usada e parcialmente correta
- ausente

### 12.4 StatusBanner
Exibe mensagens de contexto:
- tentativa enviada
- pista da categoria
- está perto
- palavra correta
- palavra incorreta

### 12.5 ResultPanel
Mostra:
- resultado final
- sequência de tentativas
- palavra correta
- botão de compartilhar
- botão de reiniciar

### 12.6 StatsCard
Mostra:
- streak atual
- melhor streak
- total de vitórias
- taxa de acerto

## 13. Lógica de estado do jogo

A aplicação deve centralizar a lógica em um reducer ou store.

### Estado principal
```ts
interface AppState {
  game: GameState;
  stats: PlayerStats;
  isDailyPlayed: boolean;
  theme: string;
}
```

### Ações principais
- START_GAME
- HANDLE_INPUT
- SUBMIT_GUESS
- UPDATE_STATUS
- COMPLETE_GAME
- SAVE_STATS
- SHARE_RESULT
- RESET_GAME

## 14. Persistência local

Para o MVP, o estado deve ser salvo em localStorage com chaves claras:

```ts
const STORAGE_KEYS = {
  game: 'daily-word-game-state',
  stats: 'daily-word-player-stats',
  lastPlayedDate: 'daily-word-last-played-date'
};
```

### Regras de persistência
- salvar ao final de cada tentativa
- salvar estado da partida em andamento
- salvar estatísticas ao concluir o jogo
- não salvar dados sensíveis

## 15. Validação de entrada

A validação deve ocorrer em 3 etapas:

1. tamanho da palavra
2. palavra contém letras válidas
3. palavra existe no banco de palavras da categoria

### Exemplo de algoritmo

```ts
const validateGuess = (guess: string, solution: string, allowedWords: string[]) => {
  if (guess.length !== solution.length) return false;
  if (!allowedWords.includes(guess.toLowerCase())) return false;
  return true;
};
```

## 16. Cálculo de feedback

### Algoritmo
- criar mapa de contagem de letras da solução
- primeiro classificar letras corretas na posição correta
- depois verificar letras restantes para as posições parcialmente corretas
- letras não encontradas ficam como ausentes

```ts
const evaluateGuess = (guess: string, solution: string): LetterStatus[] => {
  const result = Array(guess.length).fill(LetterStatus.ABSENT);
  const counts = new Map<string, number>();

  for (let i = 0; i < solution.length; i++) {
    const char = solution[i];
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === solution[i]) {
      result[i] = LetterStatus.CORRECT;
      counts.set(guess[i], (counts.get(guess[i]) ?? 1) - 1);
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === LetterStatus.CORRECT) continue;
    const char = guess[i];
    if ((counts.get(char) ?? 0) > 0) {
      result[i] = LetterStatus.PRESENT;
      counts.set(char, (counts.get(char) ?? 0) - 1);
    }
  }

  return result;
};
```

## 17. Compartilhamento de resultado

A função de compartilhamento deve ser simples, direta e não revelar a resposta.

### Exemplo de mensagem

```txt
Joguei o desafio de hoje e acertei em 4 tentativas! 🎉
Tema: animais

#DailyWord #GameOfWords
```

### Requisitos
- usar Web Share API quando disponível
- fallback para clipboard
- mensagem sem vazar a solução da palavra

## 18. Acessibilidade

Mesmo com o Design 02 visualmente forte, as interfaces devem priorizar acessibilidade.

### Requisitos mínimos
- contraste adequado entre texto e fundo
- botões com target mínimo de 44x44px
- foco visível em elementos interativos
- suporte a teclado
- mensagens de resultado legíveis por leitor de tela
- sem uso de cor como único indicador
- texto em tamanhos legíveis e sem poluição visual

## 19. Responsividade e UX mobile

### Breakpoints recomendados
- mobile: 360px a 767px
- tablet: 768px a 1023px
- desktop: acima de 1024px

### Regras
- layout centralizado
- botões grandes
- teclado virtual com espaçamento otimizado
- ações principais dentro da área de alcance da mão dominante
- manter a tela legível sem zoom

## 20. Performance

Para manter a sensação de fluidez:
- usar CSS nativo e poucos componentes pesados
- evitar animações muito complexas em todos os elementos
- carregar palavras em memória no início da app
- priorizar renderização local e rápida do estado

### Objetivos
- página inicial em menos de 2 segundos em rede estável
- transições suaves sem travamentos
- interação responsiva em mobile

## 21. Estratégia de testes

### Testes unitários
- cálculo de feedback por letra
- seleção da palavra do dia
- validação de tentativa
- atualização de streak

### Testes de integração
- fluxo completo de partida
- vitória
- derrota
- reuso de estado salvo
- compartilhamento

### Testes de acessibilidade
- foco visível
- contraste mínimo
- leitura por teclado
- elementos com labels corretos

### Testes de UI
- renderização do Design 02 em mobile
- layout em diferentes tamanhos de tela
- comportamento do teclado e do painel de status

## 22. Risco e mitigação

### Risco 1 — palavras ambiguas ou difíceis
Mitigação:
- usar banco curado por tema
- filtrar palavras mais familiares para faixa etária
- usar categoria como suporte para a seleção

### Risco 2 — frustração com muita dificuldade
Mitigação:
- 6 tentativas
- listas controladas
- dicas curtas por tema
- fácil entendimento da regra

### Risco 3 — baixa retenção
Mitigação:
- streak diário
- feedback rápido
- visual prazeroso
- ritual de “jogar hoje”

### Risco 4 — acessibilidade incompleta
Mitigação:
- revisar estados visuais sem depender apenas de cor
- garantir foco e teclado
- validar contrastes

## 23. Roadmap técnico sugerido

### Fase 1 — MVP
- estrutura da aplicação
- seleção da palavra do dia
- lógica de tentativa e feedback
- grade de palavras
- teclado virtual
- salvar progresso localmente
- resultado e compartilhamento

### Fase 2 — expansão
- tema por categoria com mais opções
- histórico por semana
- estatísticas detalhadas
- melhor UX de onboarding

### Fase 3 — produto em escala
- possivelmente backend para sincronização
- ranking
- desafios temáticos
- múltiplos modos de jogo

## 24. Critérios de aceitação do MVP

- o jogo inicia em menos de 2 segundos
- o usuário entende as regras em poucos segundos
- a partida funciona em mobile e desktop
- a palavra do dia é determinística por data
- as letras recebem feedback correto
- o sistema salva o progresso localmente
- a partida finaliza corretamente em vitória ou derrota
- o usuário consegue compartilhar o resultado sem revelar a solução
- o layout respeita os padrões do Design 02

## 25. Conclusão

A implementação do jogo usando o Design 02 deve priorizar uma experiência visualmente forte, acessível e de alta recorrência. A arquitetura sugerida é simples, veloz e adequada ao MVP, com foco em front-end moderno, persistência local e regras bem definidas de jogo.

O design visual do mockup cria a identidade desejada para público jovem, enquanto a implementação técnica garante que o produto seja rápido, usável e fácil de evoluir em versões futuras.

## 26. Próxima etapa recomendada

A próxima etapa prática seria:
1. montar a estrutura do projeto em React + Vite
2. criar os dados de palavras por tema
3. implementar a lógica de jogo e o state
4. reproduzir o Design 02 em componentes
5. validar o fluxo completo em mobile
6. testar acessibilidade e usabilidade
