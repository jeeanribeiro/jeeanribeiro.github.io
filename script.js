window.onload = () => {
    const canvas = document.querySelector('canvas'),
            ctx = canvas.getContext('2d');
    let fireflies = [];
    let animationFrameId;

    function initCanvas() {
        canvas.width = window.innerWidth * 1.5;
        canvas.height = window.innerHeight * 1.5;
        createFireflies((canvas.width * canvas.height) / 20000);
    }

    function handleResize() {
        canvas.width = window.innerWidth * 1.5;
        canvas.height = window.innerHeight * 1.5;
        fireflies = [];
        createFireflies((canvas.width * canvas.height) / 20000);
    }

    function initParallax() {
        const parallaxElements = document.querySelectorAll(".parallax");
        ['mousemove', 'deviceorientation'].forEach(event => window.addEventListener(event, (e) => parallax(e, parallaxElements)));
    }

    function parallax(event, elements) {
        const isMouseMove = event.type === 'mousemove';
        elements.forEach(element => {
            const depth = element.dataset.depth;
            const x = isMouseMove ? (window.innerWidth - event.pageX * depth) / 90 : (Math.round(event.gamma) * depth) / 3;
            const y = isMouseMove ? (window.innerHeight - event.pageY * depth) / 90 : (Math.round(event.beta) * depth) / 3;
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    function createFireflies(quantity) {
        for (let i = 0; i < quantity; i++) {
            fireflies.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                deltaX: 0,
                deltaY: 0,
                size: Math.random() * 4 + 2,
                color: '#dfa',
                opacity: 0.05,
                opacityDirection: 'up',
            });
        }
    }

    function updateFirefly(firefly) {
        if (Math.random() <= 0.03) {
            firefly.deltaX = (Math.random() - 0.5) * 2;
            firefly.deltaY = (Math.random() - 0.5) * 2;
        }
        firefly.x += firefly.deltaX;
        firefly.y += firefly.deltaY;

        if (firefly.opacityDirection === 'up') {
            firefly.opacity = Math.min(firefly.opacity + 0.05, 0.95);
            if (firefly.opacity === 0.95) firefly.opacityDirection = 'down';
        } else {
            firefly.opacity = Math.max(firefly.opacity - 0.05, 0.05);
            if (firefly.opacity === 0.05 && Math.random() <= 0.01) {
                firefly.opacityDirection = 'up';
            }
        }
    }

    function drawFireflies() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#dfa';

        fireflies.forEach(firefly => {
            updateFirefly(firefly);
            ctx.fillStyle = firefly.color;
            ctx.globalAlpha = firefly.opacity;
            ctx.fillRect(firefly.x, firefly.y, firefly.size, firefly.size);
        });

        animationFrameId = requestAnimationFrame(drawFireflies);
    }

    function init() {
        initCanvas();
        initParallax();
        window.addEventListener('resize', handleResize);
        drawFireflies();
    }

    init();
};
