document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const overlay = document.getElementById('overlay');
    
    // Флаг, чтобы не срабатывало дважды
    let isAnimating = false;
    
    // Общая функция для запуска анимации
    function hideOverlay() {
        if (isAnimating) return;
        isAnimating = true;
        
        overlay.classList.add('hidden');
        startBtn.classList.add('hidden');
        
        setTimeout(() => {
            overlay.style.display = 'none';
            startBtn.style.display = 'none';
            console.log('Элементы скрыты');
        }, 1000);
    }
    
    // Для клика (десктоп)
    startBtn.addEventListener('click', hideOverlay);
    
    // Для тач-устройств
    startBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(1.1)';
    }, {passive: false});
    
    startBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(1)';
        // Небольшая задержка для визуальной обратной связи
        setTimeout(() => hideOverlay(), 100);
    }, {passive: false});
    
    // Также обрабатываем отмену тача (если палец увели за пределы кнопки)
    startBtn.addEventListener('touchcancel', function(e) {
        this.style.transform = 'scale(1)';
    });
});