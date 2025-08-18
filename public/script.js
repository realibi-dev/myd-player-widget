// --- Настройки роликов ---
const ROLLS = [
    // Ролик 1: F1 -> F2 -> F3
    [{ frame: 'f1', duration: 5500 }, { frame: 'f2', duration: 5500 }, { frame: 'f3', duration: 2500 }],
    // Ролик 2: F3 -> F2 -> F1
    [{ frame: 'f3', duration: 2500 }, { frame: 'f2', duration: 5500 }, { frame: 'f1', duration: 5500 }],
    // Ролик 3: F1 -> F2 -> F3
    [{ frame: 'f1', duration: 5500 }, { frame: 'f2', duration: 5500 }, { frame: 'f3', duration: 2500 }]
];

// --- DOM элементы ---
const ledScreen = document.getElementById('ledScreen');
const widgetsContainer = document.querySelector('.widgets-container');

// --- Состояние ---
let currentRollIndex = 0;
let currentFrameIndex = 0;
let isTransitioning = false;

// --- Функции ---

// Получение курсов валют
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/KZT');
        const data = await response.json();

        document.getElementById('usd-rate').textContent = (1 / data.rates.USD).toFixed(2);
        document.getElementById('rub-rate').textContent = (1 / data.rates.RUB).toFixed(2);
        document.getElementById('cny-rate').textContent = (1 / data.rates.CNY).toFixed(2);
    } catch (error) {
        console.error('Ошибка получения курсов валют:', error);
        document.getElementById('usd-rate').textContent = 'ERR';
        document.getElementById('rub-rate').textContent = 'ERR';
        document.getElementById('cny-rate').textContent = 'ERR';
    }
}

// Смена размера (кадра) БЕЗ перезагрузки видео
function changeFrame(frameKey) {
    if (isTransitioning) return;
    isTransitioning = true;

    // 1. Начало анимации: убираем виджеты
    widgetsContainer.classList.add('hidden');

    // 2. Через короткую задержку (0.25с) меняем размер
    setTimeout(() => {
        // Меняем класс размера у контейнера
        ledScreen.classList.remove('size-f1', 'size-f2', 'size-f3');
        ledScreen.classList.add('size-' + frameKey);

        // НЕ МЕНЯЕМ источник видео и НЕ вызываем video.load()!

        // 3. Через оставшееся время анимации (0.25с) показываем виджеты
        setTimeout(() => {
            widgetsContainer.classList.remove('hidden');
            isTransitioning = false;
        }, 250);

    }, 250);
}

// Переход к следующему кадру в текущем ролике
function nextFrame() {
    const currentRoll = ROLLS[currentRollIndex];
    if (!currentRoll) {
        console.error(`Неизвестный ролик с индексом: ${currentRollIndex}`);
        return;
    }

    const frameData = currentRoll[currentFrameIndex];
    const frameKey = frameData.frame;
    const frameDuration = frameData.duration;

    changeFrame(frameKey);

    setTimeout(() => {
        currentFrameIndex++;
        if (currentFrameIndex >= currentRoll.length) {
            currentRollIndex = (currentRollIndex + 1) % ROLLS.length;
            currentFrameIndex = 0;
        }
        nextFrame();
    }, frameDuration + 500); // Длительность кадра + 0.5с анимации
}

// --- Инициализация ---
function init() {
    // Устанавливаем начальный размер F3
    ledScreen.classList.add('size-f3');

    fetchExchangeRates();
    setInterval(fetchExchangeRates, 300000); // Каждые 5 минут

    setTimeout(() => {
        nextFrame();
    }, 100);
}

// Запуск после загрузки страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
