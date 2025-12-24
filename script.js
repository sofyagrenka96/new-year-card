document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const overlay = document.getElementById('overlay');
    
    startBtn.addEventListener('click', function() {
        overlay.classList.add('hidden');
        startBtn.classList.add('hidden');
        
        setTimeout(() => {
            overlay.style.display = 'none';
            startBtn.style.display = 'none';
        }, 1000);
    });
    
    startBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(1.05)';
    });
    
    startBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(1)';
    });
});