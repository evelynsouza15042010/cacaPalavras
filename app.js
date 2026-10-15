const WORDS_BY_THEME = {
  animais: ['LEAO', 'CACHO', 'PANDA', 'GATO', 'TIGRE', 'PEIXE', 'CAVAL', 'FOCA', 'ZEBRA', 'RAPOSA', 'MACACO', 'URSO', 'COBRA', 'BEMTEV', 'DINO'],
  comida: ['PAO', 'LARAN', 'BOLO', 'PIZZA', 'TORTA', 'MELAO', 'PUDIM', 'SALSA', 'DOCES', 'PANCA', 'SORVE', 'CUPCA', 'PASTA', 'BISCO', 'NOZES'],
  ciencia: ['ATOMO', 'LUZ', 'TERRA', 'ESTRE', 'CELUL', 'VAPOR', 'ORBIT', 'MOLAR', 'VITRO', 'PILHA', 'FLUXO', 'FISCA', 'QUIMA', 'RADIO', 'GASOS'],
  esportes: ['BOLA', 'REDE', 'TIRO', 'PULO', 'GOL', 'CORRA', 'FUTEB', 'NADO', 'VITOR', 'PENAL', 'ARCO', 'VÔLEI', 'BOXE', 'LUTA', 'PESCA']
};

const STORAGE_KEYS = {
  game: 'daily-word-game-state',
  stats: 'daily-word-player-stats',
  lastDate: 'daily-word-last-date'
};

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

const dailyInfo = getDailyChallenge();

const state = {
  solution: dailyInfo.solution,
  theme: dailyInfo.theme,
  guesses: [],
  currentGuess: '',
  status: 'playing',
  banner: 'Adivinhe a palavra secreta em 6 tentativas.',
  keyboardStatus: {}
};

const elements = {
  themeBadge: document.getElementById('themeBadge'),
  lettersCount: document.getElementById('lettersCount'),
  banner: document.getElementById('banner'),
  keyboard: document.getElementById('keyboard'),
  actionButton: document.getElementById('actionButton'),
  secondaryButton: document.getElementById('secondaryButton'),
  grid: document.getElementById('letterGrid'),
  currentStreak: document.getElementById('currentStreak'),
  bestStreak: document.getElementById('bestStreak'),
  totalWins: document.getElementById('totalWins'),
  streakPill: document.getElementById('streakPill'),
  shareButton: document.getElementById('shareButton'),
  resetButton: document.getElementById('resetButton')
};

const savedGame = readStorage(STORAGE_KEYS.game);
const savedStats = readStorage(STORAGE_KEYS.stats, {
  currentStreak: 0,
  bestStreak: 0,
  totalWins: 0,
  totalGames: 0,
  lastPlayedDate: null
});

initialize();

function initialize() {
  if (savedGame && savedGame.dateKey === dailyInfo.dateKey) {
    hydrateGame(savedGame);
  } else {
    ensureDailyReset();
  }

  renderStats(savedStats);
  render();
  bindEvents();
}

function bindEvents() {
  document.addEventListener('keydown', (event) => {
    if (state.status !== 'playing') return;

    if (/^[a-zA-Z]$/.test(event.key)) {
      handleLetterInput(event.key.toUpperCase());
    }

    if (event.key === 'Backspace') {
      handleLetterInput('BACKSPACE');
    }

    if (event.key === 'Enter') {
      submitGuess();
    }
  });

  elements.actionButton.addEventListener('click', submitGuess);
  elements.secondaryButton.addEventListener('click', () => {
    if (state.status === 'playing') {
      setBanner('Dica: a palavra pertence ao tema ' + formatTheme(state.theme) + '.', 'info');
      return;
    }
    resetGame();
  });

  elements.shareButton.addEventListener('click', shareResult);
  elements.resetButton.addEventListener('click', resetGame);

  document.querySelectorAll('.key').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.value;
      if (!value) return;
      if (value === 'ENTER') {
        submitGuess();
        return;
      }
      if (value === 'DELETE') {
        handleLetterInput('BACKSPACE');
        return;
      }
      handleLetterInput(value);
    });
  });
}

function handleLetterInput(value) {
  if (state.status !== 'playing') return;

  if (value === 'BACKSPACE') {
    state.currentGuess = state.currentGuess.slice(0, -1);
    setBanner('Adivinhe a palavra secreta em 6 tentativas.', 'info');
    render();
    return;
  }

  if (!/^[A-Z]$/.test(value)) return;

  if (state.currentGuess.length >= WORD_LENGTH) return;

  state.currentGuess += value;
  setBanner('Tentativa atual: ' + state.currentGuess.padEnd(WORD_LENGTH, '_'), 'info');
  render();
}

function submitGuess() {
  if (state.status !== 'playing') return;

  if (state.currentGuess.length !== WORD_LENGTH) {
    setBanner('A palavra precisa ter 5 letras.', 'error');
    return;
  }

  const normalized = state.currentGuess.toUpperCase();
  const allowed = getAllWords();

  if (!allowed.includes(normalized)) {
    setBanner('Essa palavra não está na lista de hoje. Tente outra.', 'error');
    return;
  }

  const evaluation = evaluateGuess(normalized, state.solution);
  state.guesses.push({ guess: normalized, result: evaluation });
  updateKeyboard(normalized, evaluation);

  if (normalized === state.solution) {
    state.status = 'won';
    state.banner = 'Você venceu! A palavra era ' + state.solution + '.';
    finishGame(true);
  } else if (state.guesses.length >= MAX_ATTEMPTS) {
    state.status = 'lost';
    state.banner = 'Você perdeu! A palavra era ' + state.solution + '.';
    finishGame(false);
  } else {
    setBanner('Boa tentativa! Tente outra palavra.', 'success');
  }

  state.currentGuess = '';
  saveGame();
  render();
}

function finishGame(won) {
  const stats = readStorage(STORAGE_KEYS.stats, {
    currentStreak: 0,
    bestStreak: 0,
    totalWins: 0,
    totalGames: 0,
    lastPlayedDate: null
  });

  const today = dailyInfo.dateKey;
  stats.totalGames += 1;

  if (won) {
    stats.totalWins += 1;

    const previousDate = stats.lastPlayedDate;
    const isConsecutive = previousDate && isPreviousDate(previousDate, today);
    stats.currentStreak = isConsecutive ? stats.currentStreak + 1 : 1;
    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
  }

  stats.lastPlayedDate = today;
  writeStorage(STORAGE_KEYS.stats, stats);
  renderStats(stats);
  elements.actionButton.textContent = 'Jogo encerrado';
  elements.actionButton.disabled = true;
  elements.secondaryButton.textContent = 'Novo desafio';
  state.banner = won ? 'Você venceu! A palavra era ' + state.solution + '.' : 'Você perdeu! A palavra era ' + state.solution + '.';
}

function render() {
  elements.themeBadge.textContent = formatTheme(state.theme);
  elements.lettersCount.textContent = WORD_LENGTH + ' letras';
  elements.banner.textContent = state.banner;
  elements.banner.className = 'banner';

  if (state.status === 'won') {
    elements.banner.classList.add('success');
  }
  if (state.status === 'lost') {
    elements.banner.classList.add('error');
  }
  if (state.banner.includes('não está na lista') || state.banner.includes('precisa ter')) {
    elements.banner.classList.add('error');
  }

  renderGrid();
  renderKeyboard();
}

function renderGrid() {
  const rows = [];

  for (let i = 0; i < MAX_ATTEMPTS; i += 1) {
    const cells = [];
    const guess = state.guesses[i]?.guess || state.currentGuess;
    const result = state.guesses[i]?.result || [];

    for (let j = 0; j < WORD_LENGTH; j += 1) {
      const letter = guess[j] || '';
      const classList = ['letter-box'];

      if (letter) classList.push('filled');
      const status = result[j];
      if (status === 'correct') classList.push('correct');
      if (status === 'present') classList.push('present');
      if (status === 'absent') classList.push('absent');

      cells.push(`<div class="${classList.join(' ')}">${letter || ''}</div>`);
    }

    rows.push(`<div class="letter-grid">${cells.join('')}</div>`);
  }

  elements.grid.innerHTML = rows.join('');
}

function renderKeyboard() {
  const kv = [
    'Q','W','E','R','T','Y','U','I','O','P',
    'A','S','D','F','G','H','J','K','L',
    'ENTER','Z','X','C','V','B','N','M','DELETE'
  ];

  const buttons = kv.map((key) => {
    const keyState = state.keyboardStatus[key] || '';
    const className = keyState ? 'key ' + keyState : 'key';
    const label = key === 'ENTER' ? 'ENTER' : key === 'DELETE' ? 'DEL' : key;
    return `<button type="button" class="${className}" data-value="${key}">${label}</button>`;
  }).join('');

  elements.keyboard.innerHTML = buttons;
}

function updateKeyboard(guess, result) {
  result.forEach((status, index) => {
    const letter = guess[index];
    const current = state.keyboardStatus[letter] || 'absent';
    const order = { absent: 0, present: 1, correct: 2 };

    if (order[status] > order[current]) {
      state.keyboardStatus[letter] = status;
    }
  });
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveGame() {
  writeStorage(STORAGE_KEYS.game, {
    dateKey: dailyInfo.dateKey,
    theme: state.theme,
    solution: state.solution,
    guesses: state.guesses,
    currentGuess: state.currentGuess,
    status: state.status,
    banner: state.banner,
    keyboardStatus: state.keyboardStatus
  });
}

function hydrateGame(savedGame) {
  state.theme = savedGame.theme || state.theme;
  state.solution = savedGame.solution || state.solution;
  state.guesses = savedGame.guesses || [];
  state.currentGuess = savedGame.currentGuess || '';
  state.status = savedGame.status || 'playing';
  state.banner = savedGame.banner || state.banner;
  state.keyboardStatus = savedGame.keyboardStatus || {};

  if (state.status !== 'playing') {
    elements.actionButton.disabled = true;
    elements.actionButton.textContent = 'Jogo encerrado';
    elements.secondaryButton.textContent = 'Novo desafio';
  }
}

function ensureDailyReset() {
  const currentDate = dailyInfo.dateKey;
  const lastDate = readStorage(STORAGE_KEYS.lastDate, null);
  if (lastDate !== currentDate) {
    localStorage.removeItem(STORAGE_KEYS.game);
    writeStorage(STORAGE_KEYS.lastDate, currentDate);
  }
}

function resetGame() {
  state.guesses = [];
  state.currentGuess = '';
  state.status = 'playing';
  state.banner = 'Adivinhe a palavra secreta em 6 tentativas.';
  state.keyboardStatus = {};
  elements.actionButton.disabled = false;
  elements.actionButton.textContent = 'Enviar';
  elements.secondaryButton.textContent = 'Dica';
  localStorage.removeItem(STORAGE_KEYS.game);
  render();
}

function renderStats(stats) {
  elements.currentStreak.textContent = String(stats.currentStreak || 0);
  elements.bestStreak.textContent = String(stats.bestStreak || 0);
  elements.totalWins.textContent = String(stats.totalWins || 0);
  elements.streakPill.textContent = '🔥 ' + String(stats.currentStreak || 0);
}

function formatTheme(theme) {
  return theme.charAt(0).toUpperCase() + theme.slice(1);
}

function getDailyChallenge() {
  const categories = Object.keys(WORDS_BY_THEME);
  const dateKey = new Date().toISOString().slice(0, 10);
  const category = categories[hashString(dateKey) % categories.length];
  const words = WORDS_BY_THEME[category];
  const chosen = words[hashString(dateKey + category) % words.length];

  return {
    dateKey,
    theme: category,
    solution: chosen
  };
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getAllWords() {
  return Object.values(WORDS_BY_THEME).flat();
}

function getPreviousDateKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function isPreviousDate(previous, current) {
  const previousDate = new Date(previous + 'T00:00:00');
  const currentDate = new Date(current + 'T00:00:00');
  const delta = currentDate.getTime() - previousDate.getTime();
  return delta === 24 * 60 * 60 * 1000;
}

function evaluateGuess(guess, solution) {
  const result = Array(WORD_LENGTH).fill('absent');
  const remaining = {};

  for (let i = 0; i < solution.length; i += 1) {
    const char = solution[i];
    remaining[char] = (remaining[char] || 0) + 1;
  }

  for (let i = 0; i < guess.length; i += 1) {
    if (guess[i] === solution[i]) {
      result[i] = 'correct';
      remaining[guess[i]] -= 1;
    }
  }

  for (let i = 0; i < guess.length; i += 1) {
    if (result[i] === 'correct') continue;
    const char = guess[i];
    if ((remaining[char] || 0) > 0) {
      result[i] = 'present';
      remaining[char] -= 1;
    }
  }

  return result;
}

function setBanner(message, type = 'info') {
  state.banner = message;
  state.status = state.status === 'won' || state.status === 'lost' ? state.status : 'playing';
  render();
}

async function shareResult() {
  const statusText = state.status === 'won' ? 'Acertei!' : 'Tentei hoje!';
  const text = `${statusText} Joguei o desafio do dia em ${state.guesses.length} tentativas. Tema: ${formatTheme(state.theme)}.`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Daily Word',
        text
      });
      return;
    }

    await navigator.clipboard.writeText(text);
    setBanner('Resultado copiado para a área de transferência.', 'success');
  } catch (error) {
    setBanner('Não foi possível compartilhar agora. Tente novamente.', 'error');
  }
}
