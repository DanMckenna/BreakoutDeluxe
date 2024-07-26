//get references to HTML objects on the webpage
const gameCanvasElement = document.getElementById("gameCanvas"); //get a reference to the canvas element on the webpage
const ctx = gameCanvasElement.getContext("2d"); //get a reference to the context object for the canvas element

//starting xy coordinates of the ball
let x = gameCanvasElement.width / 2;
let y = gameCanvasElement.height - 30;

//ball offset coordinates
let dx = 2;
let dy = -2;

//collision detection constant for the ball
const ballRadius = 10;

//paddle details
const paddleWidth = 75; //represents the width of the paddle
const paddleHeight = 10; //represents the height of the paddle
let paddleXcoordinate = (gameCanvasElement.width - paddleWidth) / 2; //represents the x-axis coordinate of the paddle

//user input variables
let rightPressed = false;
let leftPressed = false;

//brick constants
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

//define the 2-dimensional brick array
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1};
    }
}

let score = 0; //represents the user's current score
let lives = 3; //represents the total number of remaining lives

//arrow button event listeners
document.addEventListener("keydown", keyDownHandler, false); //add an event listener to detect when the user presses down a key on their keyboard
document.addEventListener("keyup", keyUpHandler, false); //add an event listener to detect when the releases a key on their keyboard
document.addEventListener("mousemove", mouseMoveHandler, false); //add an event listener for mouse movement

//a function that uses the keyDownHandler event listener to detect if the left or right keyboard arrows have been pressed and return true if so
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

//a function that uses the keyUpHandler event listener to detect if the left or right keyboard arrows have been released and return false if so
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

//a function that uses the mouseMoveHandler event listener to detect if the position of the mouse cursor relative to the position of the paddle on the canvas
function mouseMoveHandler(e) {
    const relativeX = e.clientX - gameCanvasElement.offsetLeft;
    if (relativeX > 0 && relativeX < gameCanvasElement.width) {
        paddleXcoordinate = relativeX - paddleWidth / 2;
    }
}

//draws the array of brick objects onto the canvas
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//draws the ball object onto the canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

//draws the paddle object onto the canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleXcoordinate, gameCanvasElement.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

//draws the scoreboard onto the canvas
function drawScoreboard() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, gameCanvasElement.width - 65, 20);
}

//collision detection logic for when the ball collides with a brick
function brickCollisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++; //increase the user's current score
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN!!!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

//a function containing the sequence of drawing events to perform
function draw() {
    ctx.clearRect(0, 0, gameCanvasElement.width, gameCanvasElement.height); //removes the previous ball object frame if one exists
    drawBricks();
    drawBall(); //draws a new ball object onto the canvas
    drawPaddle(); //draws a new paddle object onto the canvas
    drawScoreboard();
    drawLives();
    brickCollisionDetection(); //check if the ball has collided with a brick

    /* Ball x-axis movement and collision detection
     * Reverse the movement of the ball if it reaches the left or right edges of the canvas, preventing it from moving off the canvas
     * Reversing the ball movement creates a simulated bouncing effect as it touches the left and right edges of the canvas */
    if (x + dx > gameCanvasElement.width - ballRadius|| x + dx < 0) {
        dx = -dx;
    }

    /* Ball y-axis movement and collision detection
     * Reverse the movement of the ball if it reaches the top edge of the canvas, preventing it from moving off the canvas
     * Reversing the ball movement creates a simulated bouncing effect as it touches the top edge of the canvas
     * Display a "GAME OVER" if the ball touches the bottom of the screen without hitting the paddle */
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > gameCanvasElement.height - ballRadius) {
        if (x > paddleXcoordinate && x < paddleXcoordinate + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--; //decrement the total number of remaining lives
            
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = gameCanvasElement.width / 2;
                y = gameCanvasElement.height - 30;
                dx = 2;
                dy = -2;
                paddleXcoordinate = (gameCanvasElement.width - paddleWidth) / 2;
            }
        }
    }

    /* Paddle x-axis movement and collision detection
     * Read the user's input to determine if the left or right arrows were pressed
     * Set the new x-axis position of the paddle depending on which arrow key was pressed
     * Prevent the paddle from moving off the left or right edges of the screen. */    
    if (rightPressed && paddleXcoordinate < gameCanvasElement.width - paddleWidth) {
        paddleXcoordinate += 7;
    }
    else if (leftPressed && paddleXcoordinate > 0) {
        paddleXcoordinate -= 7;
    }
    
    //adjust the x and y coordinate counters for the next iteration of the ball object
    x += dx; //adjusts the x-coordinate position of the next new ball object
    y += dy; //adjusts the y-coordinate position of the next new ball object

    //recursively execute the draw() function while letting the browser itself handle rendering
    requestAnimationFrame(draw);
}

//performs the following when the 'start' button is pressed
function startGame() {
    draw();
}

//perform the following when the start button on the webpage is pressed
document.getElementById("runButton").addEventListener("click", function () {
    startGame(); //begins the sequence of drawing events that represent the game
    this.disabled = true; //disables the start button
});