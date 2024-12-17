const themes = {
    'index.html': { light: 'url("img/konkurs_back.jpg")', dark: 'url("img/dark_konkurs_back.jpg")' },
    'first_konkurs.html': { light: 'url("img/first_konkurs.jpg")', dark: 'url("img/dark_first_konkurs.jpg")' },
    'first_summer_konkurs.html': { light: 'url("img/light_summer.jpg")', dark: 'url("img/dark_summer.jpg")' },
    'second_newyear_konkurs.html': { light: 'url("img/light_newyear.jpg")', dark: 'url("img/dark_newyear.jpg")' }
};

// Функция получения текущего файла страницы
function getCurrentPage() {
    const path = window.location.pathname;
    return path.split("/").pop();
}

function toggleTheme() {
    const currentPage = getCurrentPage();
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Применяем новый фон
    document.body.style.backgroundImage = themes[currentPage][newTheme];

    // Сохраняем текущую тему
    localStorage.setItem('theme', newTheme);
}

function applySavedTheme() {
    const currentPage = getCurrentPage();
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Применяем сохранённый фон
    document.body.style.backgroundImage = themes[currentPage][savedTheme];
}

// При загрузке страницы применяем сохранённую тему
window.onload = applySavedTheme;
