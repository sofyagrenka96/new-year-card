document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const overlay = document.getElementById('overlay');
    
    let isAnimating = false;
    
    function hideOverlay() {
        if (isAnimating) return;
        isAnimating = true;
        
        overlay.classList.add('hidden');
        startBtn.classList.add('hidden');
        
        setTimeout(() => {
            overlay.style.display = 'none';
            startBtn.style.display = 'none';
            console.log('Элементы скрыты');

            const video = document.getElementById('presentVideo');
            video.style.pointerEvents = 'auto';
            video.classList.add('show');

            video.currentTime = 0;
            video.pause();

        }, 1000);
    }
    
    startBtn.addEventListener('click', hideOverlay);
    
    startBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(1.1)';
    }, {passive: false});
    
    startBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(1.05)';
        setTimeout(() => hideOverlay(), 100);
    }, {passive: false});
    
    startBtn.addEventListener('touchcancel', function(e) {
        this.style.transform = 'scale(1)';
    });
});