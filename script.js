document.addEventListener('DOMContentLoaded', function () {
    const startBtn = document.getElementById('startBtn');
    const overlay = document.getElementById('overlay');
    const video = document.getElementById('presentVideo');

    let currentOrnament = 0;
    const ornaments = Array.from(document.querySelectorAll('.ornament'));
    let blinkInterval = null;
    let isDragging = false;
    let isHung = false;
    let startX, startY;
    let currentOrnamentImg = null;
    let currentOrnamentPoint = null;

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

    video.addEventListener('click', function () {
        if (currentOrnament >= ornaments.length) return;
        if (isHung) return;
        video.muted = true;

        const ornament = ornaments[currentOrnament];
        currentOrnamentImg = ornament.querySelector('.ornament-img');
        currentOrnamentPoint = ornament.querySelector('.ornament-point');

        video.play().catch(e => console.log("Автовоспроизведение заблокировано"));
        video.style.pointerEvents = 'none';

        video.addEventListener('timeupdate', function timeHandler() {
            if (video.currentTime >= 1.67) {
                currentOrnamentImg.classList.add('show');

                const sound = document.getElementById('ornamentSound');
                sound.volume = 0.08;
                if (sound) {
                    sound.currentTime = 0;
                    sound.play().catch(e => console.log("Звук не воспроизвелся"));

                    setTimeout(() => {
                        sound.pause();
                        sound.currentTime = 0;
                    }, 1000);
                }

                setTimeout(() => {
                    currentOrnamentPoint.classList.add('show');
                    startBlinking(currentOrnamentPoint);
                }, 800);

                video.removeEventListener('timeupdate', timeHandler);
            }
        });

        video.addEventListener('ended', function () {
            video.currentTime = 0;
            video.pause();
        });

        currentOrnamentImg.addEventListener('touchstart', startDrag, { passive: false });
        currentOrnamentImg.addEventListener('mousedown', startDrag);
    });

    function startBlinking(point) {
        if (blinkInterval) clearInterval(blinkInterval);
        let isRed = false;
        blinkInterval = setInterval(() => {
            point.src = isRed ? 'images/point.png' : 'images/point_red.png';
            isRed = !isRed;
        }, 700);
    }

    function startDrag(e) {
        if (!currentOrnamentImg.classList.contains('show') || isHung) return;
        isDragging = true;
        currentOrnamentImg.style.transition = 'none';
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX - currentOrnamentImg.offsetLeft;
        startY = touch.clientY - currentOrnamentImg.offsetTop;
        e.preventDefault();
    }

    function moveDrag(e) {
        if (!isDragging) return;
        const touch = e.touches ? e.touches[0] : e;
        currentOrnamentImg.style.left = (touch.clientX - startX) + 'px';
        currentOrnamentImg.style.top = (touch.clientY - startY) + 'px';
        e.preventDefault();
    }

    document.addEventListener('touchmove', moveDrag, { passive: false });
    document.addEventListener('mousemove', moveDrag);

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;

        const ornamentRect = currentOrnamentImg.getBoundingClientRect();
        const pointRect = currentOrnamentPoint.getBoundingClientRect();

        const ornamentTopHalf = {
            left: ornamentRect.left,
            top: ornamentRect.top,
            right: ornamentRect.right,
            bottom: ornamentRect.top + currentOrnamentImg.offsetHeight / 2
        };

        const isIntersecting = !(
            ornamentTopHalf.right < pointRect.left ||
            ornamentTopHalf.left > pointRect.right ||
            ornamentTopHalf.bottom < pointRect.top ||
            ornamentTopHalf.top > pointRect.bottom
        );

        if (isIntersecting) {
            const hangPositions = [
                { left: '180px', top: '288px' }, // orn1
                { left: '123px', top: '374px' }, // orn2 
                { left: '225px', top: '462px' }, // orn3
                { left: '89px', top: '502px' }, // orn4
                { left: '180px', top: '578px' }  // orn5
            ];

            const hangPos = hangPositions[currentOrnament];
            currentOrnamentImg.style.left = hangPos.left;
            currentOrnamentImg.style.top = hangPos.top;
            currentOrnamentImg.style.transition = 'all 0.3s';

            currentOrnamentImg.removeEventListener('touchstart', startDrag);
            currentOrnamentImg.removeEventListener('mousedown', startDrag);

            if (blinkInterval) {
                clearInterval(blinkInterval);
                blinkInterval = null;
            }
            currentOrnamentPoint.style.display = 'none';

            currentOrnament++;
            video.style.pointerEvents = 'auto';
            console.log('Игрушка повешена, следующая: ', currentOrnament);

            if (currentOrnament >= 5) {
                setTimeout(() => {
                    const finalMessage = document.getElementById('finalMessage');
                    const subMessage = document.getElementById('subMessage');

                    if (finalMessage) {
                        finalMessage.classList.add('show');
                    }

                    if (subMessage) {
                        setTimeout(() => {
                            subMessage.classList.add('show');
                            canTouchOrnaments = true;

                            video.style.transition = 'all 0.5s ease-out';
                            video.style.opacity = '0';
                            video.style.visibility = 'hidden';
                            video.style.left = '380px';

                            setTimeout(() => {
                                video.style.display = 'none';
                            }, 500);

                        }, 800);
                    }
                }, 600);
            }

        } else {
            currentOrnamentImg.style.transition = 'all 0.5s';
            currentOrnamentImg.style.left = '';
            currentOrnamentImg.style.top = '';
        }
    }

    document.addEventListener('touchend', endDrag, { passive: false });
    document.addEventListener('mouseup', endDrag);

    startBtn.addEventListener('click', hideOverlay);
    startBtn.addEventListener('click', startMusic);

    startBtn.addEventListener('touchstart', startMusic, { passive: false });

    function startMusic(e) {
        e.preventDefault();

        const bgMusic = document.getElementById('bgMusic');
        if (!bgMusic) return;

        bgMusic.currentTime = 0;
        bgMusic.volume = 0.35;

        const playPromise = bgMusic.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                bgMusic.muted = true;
                bgMusic.play().then(() => {
                    setTimeout(() => {
                        bgMusic.muted = false;
                    }, 1000);
                });
            });
        }
    }

    startBtn.addEventListener('touchstart', function (e) {
        e.preventDefault();
        this.style.transform = 'scale(1.1)';
    }, { passive: false });

    startBtn.addEventListener('touchend', function (e) {
        e.preventDefault();
        this.style.transform = 'scale(1.1)';
        setTimeout(() => hideOverlay(), 100);
    }, { passive: false });

    startBtn.addEventListener('touchcancel', function (e) {
        this.style.transform = 'scale(1)';
    });

    // ========== ОТКРЫТИЕ ФРЕЙМОВ ==========
    let canTouchOrnaments = false;

    // Игрушка 1 (James)
    document.getElementById('ornament1').addEventListener('click', function () {
        if (canTouchOrnaments) {
            openFrame('jamesFrame');
        }
    });

    // Игрушка 2 (Keonho)
    document.getElementById('ornament2').addEventListener('click', function () {
        if (canTouchOrnaments) {
            openFrame('keonhoFrame');
        }
    });

    // Игрушка 3 (Seonghyeon)
    document.getElementById('ornament3').addEventListener('click', function () {
        if (canTouchOrnaments) {
            openFrame('seonFrame');
        }
    });

    // Игрушка 4 (Juhoon)
    document.getElementById('ornament4').addEventListener('click', function () {
        if (canTouchOrnaments) {
            openFrame('juhoonFrame');
        }
    });

    // Игрушка 5 (Martin)
    document.getElementById('ornament5').addEventListener('click', function () {
        if (canTouchOrnaments) {
            openFrame('martinFrame');
        }
    });


    function openFrame(frameId) {
        const overlay = document.getElementById('modalOverlay');
        const frame = document.getElementById(frameId);
        const bgMusic = document.getElementById('bgMusic');

        if (bgMusic && !bgMusic.paused) {
            fadeOutAudio(bgMusic, 500);
        }

        overlay.classList.add('show');
        frame.classList.add('show');

        const video = frame.querySelector('.frame-video');
        video.loop = true;
        setTimeout(() => {
            video.play().catch(e => console.log("Видео не запустилось"));
        }, 500);

        const closeBtn = frame.querySelector('.frame-close');
        closeBtn.onclick = function () {
            closeAllFrames();
        };

        overlay.onclick = function () {
            closeAllFrames();
        };
    }

    function closeAllFrames() {
        document.getElementById('modalOverlay').classList.remove('show');

        document.querySelectorAll('.frame').forEach(frame => {
            frame.classList.remove('show');
            const video = frame.querySelector('.frame-video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic && bgMusic.currentTime > 0) {
            fadeInAudio(bgMusic, 1000);
        }
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeAllFrames();
        }
    });

    function fadeOutAudio(audio, duration) {
        const startVolume = audio.volume;
        const stepTime = 50;
        const steps = duration / stepTime;
        const stepDecrease = startVolume / steps;

        const fadeInterval = setInterval(() => {
            if (audio.volume > stepDecrease) {
                audio.volume -= stepDecrease;
            } else {
                audio.volume = 0;
                clearInterval(fadeInterval);
                audio.pause();
            }
        }, stepTime);
    }

    function fadeInAudio(audio, duration) {
        audio.volume = 0.2;
        audio.play().catch(e => console.log("Не удалось возобновить музыку"));

        const targetVolume = 0.35;
        const stepTime = 50;
        const steps = duration / stepTime;
        const stepIncrease = (targetVolume - 0.2) / steps;

        const fadeInterval = setInterval(() => {
            if (audio.volume < targetVolume) {
                audio.volume += stepIncrease;
            } else {
                audio.volume = targetVolume;
                clearInterval(fadeInterval);
            }
        }, stepTime);
    }
});