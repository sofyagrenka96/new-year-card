document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const overlay = document.getElementById('overlay');
    const video = document.getElementById('presentVideo');
    const ornament = document.getElementById('ornament');

    let videoPlayed = false;
    let blinkInterval = null;
    let isDragging = false;
    let startX, startY;

    function hideOverlay() {
        overlay.classList.add('hidden');
        startBtn.classList.add('hidden');
        setTimeout(() => {
            overlay.style.display = 'none';
            startBtn.style.display = 'none';
            video.style.pointerEvents = 'auto';
            video.classList.add('show');
            video.currentTime = 0;
            video.pause();
        }, 1000);
    }

    video.addEventListener('click', function() {
        if (videoPlayed) return; 
        videoPlayed = true;
        video.play().catch(e => console.log("Автовоспроизведение заблокировано"));
    
        video.addEventListener('timeupdate', function timeHandler() {
            if (video.currentTime >= 1.67) {
                ornament.classList.add('show');
                setTimeout(() => {
                    document.getElementById('point1').classList.add('show');
                    startBlinking('point1');
                }, 800);
                video.removeEventListener('timeupdate', timeHandler);
            }
        });
    
        video.addEventListener('ended', function() {
            video.currentTime = 0; 
            video.pause();
        });
    });

    function startBlinking(pointId) {
        if (blinkInterval) clearInterval(blinkInterval);
        const point = document.getElementById(pointId);
        let isRed = false;
        blinkInterval = setInterval(() => {
            point.src = isRed ? 'images/point.png' : 'images/point_red.png';
            isRed = !isRed;
        }, 700); 
    }

    ornament.addEventListener('touchstart', startDrag, {passive: false});
    ornament.addEventListener('mousedown', startDrag);

    function startDrag(e) {
        if (!ornament.classList.contains('show')) return;
        isDragging = true;
        ornament.style.transition = 'none';
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX - ornament.offsetLeft;
        startY = touch.clientY - ornament.offsetTop;
        e.preventDefault();
    }

    document.addEventListener('touchmove', moveDrag, {passive: false});
    document.addEventListener('mousemove', moveDrag);

    function moveDrag(e) {
        if (!isDragging) return;
        const touch = e.touches ? e.touches[0] : e;
        ornament.style.left = (touch.clientX - startX) + 'px';
        ornament.style.top = (touch.clientY - startY) + 'px';
        e.preventDefault();
    }

    document.addEventListener('touchend', endDrag, {passive: false});
    document.addEventListener('mouseup', endDrag);

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;

        const ornamentRect = ornament.getBoundingClientRect();
        const pointRect = document.getElementById('point1').getBoundingClientRect();

        const ornamentTopHalf = {
            left: ornamentRect.left,
            top: ornamentRect.top,
            right: ornamentRect.right,
            bottom: ornamentRect.top + ornamentRect.height / 2
        };

        const isIntersecting = !(
            ornamentTopHalf.right < pointRect.left ||
            ornamentTopHalf.left > pointRect.right ||
            ornamentTopHalf.bottom < pointRect.top ||
            ornamentTopHalf.top > pointRect.bottom
        );

        if (isIntersecting) {
            ornament.style.left = '187px';
            ornament.style.top = '300px';
            ornament.style.transition = 'all 0.3s';

            ornament.removeEventListener('touchstart', startDrag);
            ornament.removeEventListener('mousedown', startDrag);

            if (blinkInterval) {
                clearInterval(blinkInterval);
                blinkInterval = null;
            }
            document.getElementById('point1').style.display = 'none';
        } else {
            ornament.style.left = '308px';
            ornament.style.top = '206px';
            ornament.style.transition = 'all 0.5s';
        }
    }

    startBtn.addEventListener('click', hideOverlay);
    
    startBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(1.1)';
    }, {passive: false});
    
    startBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(1)';
        setTimeout(() => hideOverlay(), 100);
    }, {passive: false});
    
    startBtn.addEventListener('touchcancel', function(e) {
        this.style.transform = 'scale(1)';
    });
});