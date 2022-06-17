window.onload = () => {
    ['mousemove', 'deviceorientation'].forEach(event => window.addEventListener(event, parallax))
    function parallax(event) {
        if (event.type === 'mousemove') {
            document.querySelectorAll(".parallax").forEach(element => {
              const depth = element.dataset.depth;
              const x = (window.innerWidth - event.pageX * depth) / 90;
              const y = (window.innerHeight - event.pageY * depth) / 90;
              element.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        } else if (event.type === 'deviceorientation') {
            document.querySelectorAll(".parallax").forEach(element => {
                const depth = element.dataset.depth;
                const x = (Math.round(event.gamma) * depth) / 3;
                const y = (Math.round(event.beta) * depth) / 3;
                element.style.transform = `translateX(${x}px) translateY(${y}px)`;
            })
        }
    }

    const canvas = document.querySelector('canvas'),
            ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth * 1.5;
    canvas.height = window.innerHeight * 1.5;

    const firefliesQuantity = (canvas.width * canvas.height) / 20000;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    })

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    let fireflies = [];
    const createFireflies = quantity => {
        for (let i = 0; i < quantity; i++) {
        fireflies.push({
            x: getRandomInt(0, canvas.width),
            y: getRandomInt(0, canvas.height),
            deltaX: 0,
            deltaY: 0,
            size: getRandomInt(2, 6),
            color: '#dfa',
            opacity: 0.05,
            opacityDirection: 'up',
        })
        }
    }
    createFireflies(firefliesQuantity);

    const move = firefly => {
        if (Math.random() <= 0.03) {
        firefly.deltaX = getRandomInt(-10, 10) / 10;
        firefly.deltaY = getRandomInt(-10, 10) / 10;
        }
        firefly.x += firefly.deltaX;
        firefly.y += firefly.deltaY;
    }

    const blink = firefly => {
        if (firefly.opacityDirection === 'up') {
        if (firefly.opacity < 0.95) {
            firefly.opacity += 0.05;
        } else {
            firefly.opacityDirection = 'down';
        }
        } else {
        if (firefly.opacity > 0.05) {
            firefly.opacity -= 0.05;
        } else {
            if (Math.random() <= 0.01) {
            firefly.opacityDirection = 'up';
            }
        }
        }
    }

    const draw = firefly => {
        move(firefly);
        blink(firefly);
        ctx.fillStyle = firefly.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = firefly.color;
        ctx.globalAlpha = firefly.opacity;
        ctx.fillRect(firefly.x, firefly.y, firefly.size, firefly.size);
    }

    const loop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fireflies.forEach(firefly => {
        draw(firefly);
        })
        setTimeout(loop, 20);
    }
    loop();
}
