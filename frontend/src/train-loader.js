// trainAnimation.js

export function startTrainAnimation(canvasId) {
    console.log('Starting train animation on canvas:', canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas with id "${canvasId}" not found.`);
        return;
    }

    const ctx = canvas.getContext('2d');
    const smokePuffs = [];

    let trainX;
    let trainY;

    // Function to resize canvas dynamically
    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        trainY = canvas.height * 0.6;
        trainX = canvas.width + 60;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawTrain(x, y) {
        ctx.font = `${Math.floor(canvas.height * 0.7)}px sans-serif`;
        ctx.fillText('🚂', x, y);
    }

    function drawSmoke() {
        ctx.font = `${Math.floor(canvas.height * 0.7)}px sans-serif`;
        smokePuffs.forEach((puff, index) => {
        ctx.globalAlpha = puff.alpha;
        ctx.fillText('💨', puff.x, puff.y);
        puff.x += 2;        // move smoke slightly left
        // puff.y -= 0.2;      // drift upward
        puff.alpha -= 0.01; // fade out
        if (puff.alpha <= 0) smokePuffs.splice(index, 1);
        });
        ctx.globalAlpha = 1.0;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSmoke();
        drawTrain(trainX, trainY);

        // Smoke puffs spawn behind train
        if (Math.random() < 0.2) {
        smokePuffs.push({
            x: trainX + 10,
            y: trainY - canvas.height * 0.12,
            alpha: 1
        });
        }

        trainX -= canvas.width * 0.02; // speed scales with canvas size

        // Reset train when off-screen
        if (trainX < -60) {
        trainX = canvas.width + 60;
        smokePuffs.length = 0;
        }

        requestAnimationFrame(animate);
    }

    animate();
}
