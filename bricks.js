// Robust Brick Breaker Engine
const canvas = document.getElementById("brickCanvas");
const ctx = canvas.getContext("2d");
const gameOverOverlay = document.getElementById("gameOver");
const playAgainBtn = document.getElementById("playAgainBtn");
const instructions = document.getElementById("gameInstructions");

// Set internal resolution
canvas.width = 400;
canvas.height = 300;

// Game Config
let ballRadius = 8;
let x, y, dx, dy;
let paddleHeight = 12;
let paddleWidth = 85;
let paddleX;

let rightPressed = false;
let leftPressed = false;
let isPaused = false;

let brickRowCount = 4;
let brickColumnCount = 5;
let brickWidth = 65;
let brickHeight = 20;
let brickPadding = 8;
let brickOffsetTop = 45;
let brickOffsetLeft = 18;

let score = 0;
let gameRunning = false;
let animationId = null;
let bricks = [];

function initBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

// Controls
document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    else if (e.key === " " || e.code === "Space") {
        if (gameRunning) {
            isPaused = !isPaused;
            if (!isPaused) draw(); 
        }
    }
}, false);

document.addEventListener("keyup", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}, false);

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        gameRunning = false;
                        alert("SECTOR CLEAR!");
                        resetGame();
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, ballRadius);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#444444');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.roundRect(paddleX, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight, 4);
    const gradient = ctx.createLinearGradient(paddleX, 0, paddleX + paddleWidth, 0);
    gradient.addColorStop(0, '#0000ff');
    gradient.addColorStop(0.5, '#00ffff');
    gradient.addColorStop(1, '#0000ff');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#990000";
                ctx.fill();
                
                ctx.strokeStyle = "#ff5555";
                ctx.lineWidth = 2;
                ctx.strokeRect(brickX + 1, brickY + 1, brickWidth - 2, brickHeight - 2);
                
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1;
                ctx.strokeRect(brickX, brickY, brickWidth, brickHeight);
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "bold 16px 'Courier New'";
    ctx.fillStyle = "#f1c40f";
    ctx.fillText("SCORE: " + score, 15, 25);
}

function draw() {
    if (!gameRunning || isPaused) {
        if (isPaused) {
            ctx.font = "bold 20px 'Courier New'";
            ctx.fillStyle = "#f1c40f";
            ctx.fillText("PAUSED", canvas.width/2 - 35, canvas.height/2);
        }
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
    if (y + dy < ballRadius) dy = -dy;
    else if (y + dy > canvas.height - ballRadius - 5) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            dx = 8 * ((x - (paddleX + paddleWidth / 2)) / paddleWidth);
        } else if (y + dy > canvas.height) {
            gameRunning = false;
            gameOverOverlay.style.display = "flex";
            if (animationId) cancelAnimationFrame(animationId);
            return;
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
    else if (leftPressed && paddleX > 0) paddleX -= 7;

    x += dx;
    y += dy;
    animationId = requestAnimationFrame(draw);
}

function startGame() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    initBricks();
    score = 0;
    x = canvas.width / 2;
    y = canvas.height - 50;
    dx = 3;
    dy = -3;
    paddleX = (canvas.width - paddleWidth) / 2;
    gameRunning = true;
    isPaused = false;
    gameOverOverlay.style.display = "none";
    
    if (instructions) {
        instructions.style.display = "block";
        setTimeout(() => {
            instructions.style.display = "none";
        }, 2000);
    }
    
    draw();
}

function resetGame() {
    gameRunning = false;
    if (animationId) cancelAnimationFrame(animationId);
    setTimeout(startGame, 50);
}

function stopGame() {
    gameRunning = false;
    isPaused = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    if (gameOverOverlay) gameOverOverlay.style.display = "none";
    if (instructions) instructions.style.display = "none";
}

if (playAgainBtn) {
    playAgainBtn.addEventListener("click", resetGame);
}

// Global hooks — game starts/stops only via window open/close in system.js
window.startGame = startGame;
window.stopGame = stopGame;
