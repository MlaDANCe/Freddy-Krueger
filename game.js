var LEFT = 0;
var TOP = 0;
var RIGHT = 800;
var BOTTOM = 600;
var JUMP_MAX = 100;
var JUMP_INC = 10;
var STEP_INC = 5;
var TIMEOUT = 100;
var MARIO_WIDTH = 30;
var MARIO_HEIGHT = 50;
var xPos = 10;
var yPos = BOTTOM - MARIO_HEIGHT - 1;
var stage;
var isFlying = false;
var isFalling = false;
var flyCounter = 0;
var mario;
var isMovingRight = false;
var isMovingLeft = false;
var isGameOver = false;
var layerHero,
    layerWalls;
var walls = [];
var isJumpAllowed = true;
var gameTimeout = 60;

var imageRampBackground = new Image();
imageRampBackground.src = 'images/platform.png';

//money
var coinWidth = 5,
    coinHeight = 10,
    shouldShrink = true,   //needed for animation
    speedOfRotation = 0.3, //from 0.0 to 5.0
    numberOfCoins = 50, //10,
    layerCoins;
var coinArray = [];//stores coins

(function () {
    stage = new Kinetic.Stage({
        container: 'canvas-wrapper',
        width: 800,
        height: 600
    });

    document.getElementById('startButton').addEventListener('click', startNewGame);
    $('timedownCounter').hide();

}());

function clearLayouts() {
    if (layerHero) {
        layerHero.clear();
    }
    if (layerCoins) {
        layerCoins.clear();
    }
    if (layerCoins) {
        layerWalls.clear();
    }
}

function startNewGame() {

    $('#startButton').fadeOut(2000);
    isGameOver = false;

    shortly = new Date();
    shortly.setSeconds(shortly.getSeconds() + gameTimeout);

    $('#timedownCounter').countdown({ until: shortly, onExpiry: gameover });
    $('#timedownCounter').countdown('option', { until: shortly, format: 'MS' });
    $('timedownCounter').show();

    window.addEventListener("keydown", keyDownEventHandler, false);
    window.addEventListener("keyup", keyUpEventHandler, false);

    createRamp(150, 530, 120, 30, 'green', 'black');
    createRamp(350, 500, 100, 30, 'red', 'black');
    createRamp(550, 530, 10, 50, 'blue', 'black');
    createRamp(240, 360, 120, 30, 'red', 'black');
    createRamp(450, 430, 100, 20, 'blue', 'black');
    createRamp(110, 260, 150, 30, 'red', 'black');
    createRamp(380, 200, 200, 30, 'blue', 'black');
    createRamp(630, 270, 100, 30, 'blue', 'black');
    createRamp(50, 170, 100, 30, 'red', 'black');
    createRamp(650, 130, 110, 30, 'blue', 'black');
    createRamp(120, 80, 140, 30, 'red', 'black');

    // Layer with walls
    layerWalls = new Kinetic.Layer();
    for (var i = 0; i < walls.length; i++) {
        layerWalls.add(walls[i]);
    }

    stage.add(layerWalls);
    //coins to canvas
    //for (var i = 0; i < numberOfCoins; i++) {
    //    coinArray[i] = new Kinetic.Ellipse({
    //        x: stage.getWidth() / 2 + 20 * i,
    //        y: stage.getHeight() - coinHeight,
    //        radius: {
    //            x: coinWidth,
    //            y: coinHeight
    //        },
    //        fill: 'gold',
    //        stroke: 'black',
    //        strokeWidth: 1
    //    });
    //    layerCoins.add(coinArray[i]);
    //}
    deployCoins();
    layerCoins = new Kinetic.Layer();
    for (i = 0; i < coinArray.length; i++) {
        layerCoins.add(coinArray[i]);
    }

    var anim = new Kinetic.Animation(function (frame) {
        animateCoins(coinArray);
    }, layerCoins);
    anim.start();
    stage.add(layerCoins);

    layerHero = new Kinetic.Layer();
    mario = new Kinetic.Rect({
        x: 10,
        y: BOTTOM - MARIO_HEIGHT - 1,
        width: MARIO_WIDTH,
        height: MARIO_HEIGHT,
        stroke: 'black',
        fill: 'yellow',
        strokeWidth: 2
    });

    layerHero.add(mario);
    stage.add(layerHero);
    //    timerId = setInterval(gameLoop, TIMEOUT);
    gameLoop();
}

function gameover() {
    isGameOver = true;

    var r = Raphael(0, 0, 800, 600),
        font = r.getFont("whoa"),
        gameover = r.print(150, 300, "GAME OVER", font, 80).attr({ fill: "#ccc", stroke: "#000" });
    gameover.animate({
        2: {},
        4: { transform: "s.2,1" },
        6: { transform: "" }
    }, 5000);

    $('canvas-wrapper').hide();
}

function createRamp(posX, posY, width, height, color, borderColor) {
    var currentRamp = new Kinetic.Rect({
        x: posX,
        y: posY,
        width: width,
        height: height,
        //fill:'transparent',
        stroke: borderColor,
        strokeWidth: 1,
        fillPatternImage: imageRampBackground
    });
    walls.push(currentRamp);
}

function keyDownEventHandler(event) {
    switch (event.keyCode) {
        // Up arrow
        case 0x26:
            if (!(isFlying || isFalling)) {
                isFlying = true;
                flyCounter = 0;
                isJumpAllowed = false;
            }
            break;
            // Right arrow
        case 0x27:
            isMovingRight = true;
            break;
        case 0x25:
            isMovingLeft = true;
            break;
    }
}

function keyUpEventHandler(event) {
    switch (event.keyCode) {
        case 0x27: // Right arrow
            isMovingRight = false;
            break;
        case 0x25: // Left arrow
            isMovingLeft = false;
            break;
    }
}

function updateFly() {
    if (isFlying) {
        flyCounter += JUMP_INC;
        if (flyCounter > JUMP_MAX) {
            isFlying = false;
            isFalling = true;
            flyCounter -= JUMP_INC;
        }
        else {
            yPos -= JUMP_INC;
        }
    }
    else if (isFalling) {
        yPos += JUMP_INC;
    }
}

function moveHero() {
    if (isMovingRight) {
        xPos += STEP_INC;
    }

    if (isMovingLeft) {
        if (xPos - STEP_INC >= 0) {
            xPos -= STEP_INC;
        }
    }

    if (isFlying || isFalling) {
        updateFly();
    }

    mario.x(xPos);
    mario.y(yPos);
    mario.draw();//was replaced with:

    //stage.draw();
}

function drawCoins() {
    layerCoins.clear();
    for (var i = 0; i < numberOfCoins; i++) {
        coinArray[i].draw();
    }
}

function animateCoins(coins) {
    for (var i = 0; i < numberOfCoins; i++) {
        if (coins[i].getRadius().x >= coinWidth) {
            shouldShrink = true;
        }
        else if (coins[i].getRadius().x <= speedOfRotation) {
            shouldShrink = false;
        }

        if (shouldShrink) {
            coins[i].setRadius({ x: coins[i].getRadius().x - speedOfRotation, y: coins[i].getRadius().y });
        }
        else {
            coins[i].setRadius({ x: coins[i].getRadius().x + speedOfRotation, y: coins[i].getRadius().y });
        }
    }
}

function gameLoop() {
    if (isGameOver) {
        return;
    }

    layerHero.clear();
    layerCoins.clear();
    handleCollisions();
    moveHero();
    drawCoins();
    requestAnimationFrame(gameLoop);
}

function handleCollisions() {
    isFalling = true;
    var rampCount = walls.length;

    // collision with canvas borders
    if (xPos + MARIO_WIDTH + STEP_INC > RIGHT) {
        isMovingRight = false;
    }

    if (xPos - STEP_INC < 0) {
        isMovingLeft = false;
    }

    if (yPos + MARIO_HEIGHT + STEP_INC > BOTTOM) {
        isFalling = false;
        isJumpAllowed = true;
    }

    for (var i = 0; i < rampCount; i++) {
        var ramp = walls[i];
        // collision with walls
        // collision when wall is top
        if (yPos > ramp.attrs.y + ramp.attrs.height) {
            if ((yPos - JUMP_INC < ramp.attrs.y + ramp.attrs.height) &&
                ((xPos + MARIO_WIDTH > ramp.attrs.x) && (xPos < ramp.attrs.x + ramp.attrs.width))) {
                isFlying = false;
                isFalling = true;
            }
        }

        // collision when wall is bottom
        if (yPos + MARIO_HEIGHT < ramp.attrs.y) {
            if ((yPos + MARIO_HEIGHT + JUMP_INC > ramp.attrs.y) &&
                ((xPos + MARIO_WIDTH > ramp.attrs.x) && (xPos < ramp.attrs.x + ramp.attrs.width))) {
                isFalling = false;
                isJumpAllowed = true;
            }
        }

        if ((ramp.attrs.y >= yPos && ramp.attrs.y <= yPos + MARIO_HEIGHT) || (ramp.attrs.y + ramp.attrs.height >= yPos &&
                ramp.attrs.y + ramp.attrs.height <= yPos + MARIO_HEIGHT)) {
            //collision when wall is on the left
            if (xPos >= ramp.attrs.x && xPos <= ramp.attrs.x + ramp.attrs.width) {
                isMovingLeft = false;
            }

            //collision when wall is on the right
            if (xPos + MARIO_WIDTH >= ramp.attrs.x && xPos + MARIO_WIDTH <= ramp.attrs.x + ramp.attrs.width) {
                isMovingRight = false;
            }
        }
    }

    //handle collisions with money
    for (var i = 0; i < numberOfCoins; i++) {
        if ((xPos <= coinArray[i].getX() && coinArray[i].getX() <= (xPos + MARIO_WIDTH)) &&
                (yPos <= coinArray[i].getY() && coinArray[i].getY() <= (yPos + MARIO_HEIGHT))) {
            coinArray.splice(i, 1);
            numberOfCoins -= 1;
            break;
        }
    }
}

function deployCoins() {
    var COIN_WIDTH = coinWidth * 2;
    var rampIndex;
    var rampLengthInCoins;
    var rampPosition;
    var x;
    var y;
    var coinsMap = {};
    var coinMapIndex;
    var coinsCount = numberOfCoins;

    while (coinsCount >= 0) {
        rampIndex = Math.random() * walls.length | 0;
        rampLengthInCoins = walls[rampIndex].attrs.width / COIN_WIDTH | 0;
        rampPosition = Math.random() * rampLengthInCoins | 0;
        x = rampPosition * COIN_WIDTH + walls[rampIndex].attrs.x;
        y = walls[rampIndex].attrs.y - coinHeight;

        coinMapIndex = rampIndex + '' + rampPosition;
        if (coinsMap[coinMapIndex]) {
            continue;
        }
        else {
            coinsMap[coinMapIndex] = true;
        }
        
        coinArray[numberOfCoins - coinsCount] = new Kinetic.Ellipse({
            x: x,
            y: y,
            radius: {
                x: coinWidth,
                y: coinHeight
            },
            fill: 'gold',
            stroke: 'black',
            strokeWidth: 1
        });
        coinsCount -= 1;
    }
}
