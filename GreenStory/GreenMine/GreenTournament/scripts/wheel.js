// Изначальный массив сегментов
let segments = [
    "Ничего",
    "50", 
    "75", 
    "100", 
    "125", 
    "150", 
    "200", 
    "250", 
    "300"
];

// Настройки колеса
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const wheelSize = canvas.width;
const center = wheelSize / 2;
let segmentCount = segments.length;
let arc = 2 * Math.PI / segmentCount;

// Флаг «скрыть варианты»
let hideVariants = false;

// Параметры анимации вращения
let spinStartTime; // Время начала вращения
let spinAngle = 0;
let spinVelocity = 5;
let spinning = false;

// Функция отрисовки колеса
function drawWheel() {
    ctx.clearRect(0, 0, wheelSize, wheelSize);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(spinAngle);

    for (let i = 0; i < segmentCount; i++) {
        // Рисуем сегмент
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.fillStyle = getColor(i);
        ctx.arc(0, 0, center, i * arc, (i + 1) * arc);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.save();

        // Подпись сегмента
        ctx.fillStyle = '#000';
        ctx.rotate(arc * i + arc / 2);
        ctx.textAlign = 'right';
        ctx.font = "bold 18px sans-serif";
        ctx.fillText(hideVariants ? "???" : segments[i], center - 10, 5);
        ctx.restore();
    }
    ctx.restore();

    updateSegmentsList();
}

// Функция для перемешивания массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Перемешанный массив цветов
const colors = shuffleArray([
    '#FF5733', '#33FF57', '#3357FF',
    '#FF33A1', '#A133FF', '#33FFF5',
    '#FF8F33', '#8FFF33', '#FF3333',
    '#33FF8F', '#FF33FF', '#33A1FF',
    '#FFC300', '#DAF7A6', '#900C3F',
    '#581845', '#C70039', '#FFB6C1',
    '#40E0D0', '#FF69B4', '#8A2BE2',
    '#FFD700', '#ADFF2F', '#00CED1',
    '#FF4500', '#32CD32', '#BA55D3',
    '#7FFF00', '#DC143C', '#1E90FF',
    '#FF6347', '#3CB371', '#9370DB',
    '#FF1493', '#00FA9A', '#FF7F50',
    '#6A5ACD', '#FFDEAD', '#20B2AA'
]);

// Функция для получения цвета сегмента
function getColor(index) {
    return colors[index % colors.length];
}

// Функция переключения скрытия вариантов
function toggleHideVariants() {
    hideVariants = !hideVariants;
    const wheelContainer = document.querySelector('.wheel-container');
    if (hideVariants) {
        wheelContainer.classList.add('hide-variants');
    } else {
        wheelContainer.classList.remove('hide-variants');
    }
    drawWheel();
}


// Функция добавления нового сегмента в случайное место
function addSegment() {
    const newSegmentInput = document.getElementById('newSegment');
    const newSegment = newSegmentInput.value.trim();
    if (newSegment) { // Проверяем только на пустоту
        const randomIndex = Math.floor(Math.random() * (segments.length + 1)); // Случайная позиция
        segments.splice(randomIndex, 0, newSegment); // Вставляем элемент в случайную позицию
        newSegmentInput.value = '';
        updateWheel();
    } else {
        alert("Пожалуйста, введите непустой вариант.");
    }
}


// Функция удаления сегмента по индексу
function removeSegment(index) {
    segments.splice(index, 1);
    updateWheel();
}

// Обновление колеса после добавления или удаления сегмента
function updateWheel() {
    // Обновляем количество сегментов и угол
    segmentCount = segments.length;
    if (segmentCount === 0) {
        // Если сегментов нет, остановить колесо
        spinning = false;
        spinVelocity = 0;
    }
    arc = 2 * Math.PI / segmentCount;
    // Перезапускаем вращение, если было в процессе
    if (spinning) {
        spinning = false;
        spinVelocity = 0;
        document.querySelector('.wheel-container').classList.remove('spinning');
    }
    drawWheel();
    saveSegments();
}

// Функция обновления списка сегментов на странице
function updateSegmentsList() {
    const segmentsList = document.getElementById('segmentsList');
    segmentsList.innerHTML = '';
    segments.forEach((segment, index) => {
        const li = document.createElement('li');
        li.textContent = segment;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => removeSegment(index);
        li.appendChild(deleteBtn);
        segmentsList.appendChild(li);
    });
}

// Сохранение сегментов в localStorage при обновлении
function saveSegments() {
    localStorage.setItem('wheelSegments', JSON.stringify(segments));
}

// Загрузка сегментов из localStorage при инициализации
function loadSegments() {
    const storedSegments = localStorage.getItem('wheelSegments');
    if (storedSegments) {
        segments = JSON.parse(storedSegments);
        segmentCount = segments.length;
        arc = 2 * Math.PI / segmentCount;
    }
}

// Подключение звука
const winSound = new Audio('audio/win_3.mp3'); // Укажите путь к вашему MP3-файлу

// Анимация вращения
function spinAnimation() {
    if (!spinning) return;

    const elapsed = (Date.now() - spinStartTime) / 1000; // Прошедшее время в секундах
    const progress = elapsed / spinDuration; // Прогресс вращения от 0 до 1

    if (progress >= 1) { // Если время истекло
        spinning = false;
        spinVelocity = 0;
        document.querySelector('.wheel-container').classList.remove('spinning');
        const winningIndex = getWinningSegment();
        displayResult(winningIndex);
        winSound.play(); // Воспроизводим звук после остановки
        return;
    }

    // Линейное замедление скорости
    spinVelocity = Math.sin((1 - progress) * Math.PI / 2); // Синусоидальное замедление
    spinAngle += spinVelocity * 0.1; // Увеличиваем угол вращения
    spinAngle %= 2 * Math.PI;

    drawWheel();
    requestAnimationFrame(spinAnimation);
}

// Запуск вращения колеса
function spinWheel() {
    if (spinning || segments.length === 0) return;

    const durationInput = document.getElementById('durationInput');
    spinDuration = Math.max(1, Math.min(60, parseInt(durationInput.value))) || 5; // Ограничение от 1 до 60 секунд
    
    const resultDisplay = document.getElementById('resultDisplay');
    resultDisplay.innerText = "";
    resultDisplay.style.background = "transparent";

    spinStartTime = Date.now(); // Запоминаем время начала
    spinVelocity = 1; // Начальная скорость (максимум)
    spinning = true;

    document.querySelector('.wheel-container').classList.add('spinning');
    requestAnimationFrame(spinAnimation);
}


// Определение выигрышного сегмента
function getWinningSegment() {
    // Вращение считается по часовой стрелке, но canvas вращается против
    const normalizedAngle = (2 * Math.PI - (spinAngle % (2 * Math.PI))) % (2 * Math.PI);
    let idx = Math.floor(normalizedAngle / arc);
    return idx % segments.length;
}

// Функция отображения результата в центре колеса
function displayResult(index) {
    const resultDisplay = document.getElementById('resultDisplay');
    if (!hideVariants) {
        resultDisplay.innerText = segments[index];
        resultDisplay.style.background = "rgba(255, 255, 255, 0.7)";
    } else {
        resultDisplay.innerText = segments[index]; // Отображаем реальный результат
        resultDisplay.style.background = "rgba(255, 255, 255, 0.7)";
    }
    resultDisplay.style.color = "green";
    resultDisplay.style.display = "block"; // Убедимся, что блок отображается
}

// Изначальная загрузка сегментов и отрисовка колеса
loadSegments();
drawWheel();
updateSegmentsList();
