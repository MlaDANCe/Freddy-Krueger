var LEFT = 0;
var TOP = 0;
var RIGHT = 800;
var BOTTOM = 600;
var JUMP_MAX = 100;
var JUMP_INC = 5;
var STEP_INC = 3;
var TIMEOUT = 100;
var MARIO_WIDTH = 43;
var MARIO_HEIGHT = 52;
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
var isLastMoveLeft = false;
var layerHero,
    sonicLayer,
    layerWalls;
var walls = [];
var isJumpAllowed = true;
var gameTimeout = 70;
var character = new Kinetic.Sprite();
var imageRampBackground = new Image();
imageRampBackground.src = 'images/platform.png';

//money
var coinWidth = 10,
    coinHeight = 10,
    shouldShrink = true,   //needed for animation
    speedOfRotation = 0.3, //from 0.0 to 5.0
    numberOfCoins = 30, //10,
    layerCoins,
    collectedCoins = 0;
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
    createRamp(550, 530, 140, 50, 'blue', 'black');
    createRamp(260, 360, 120, 30, 'red', 'black');
    createRamp(450, 430, 100, 20, 'blue', 'black');
    createRamp(110, 270, 150, 30, 'red', 'black');
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
        opacity: 0,
        strokeWidth: 2
    });

    sonicLayer = new Kinetic.Layer();
    var sprite = new Image();

    //Create shape/animation
    sprite.onload = function () {
        character = new Kinetic.Sprite({
            x: xPos,
            y: yPos,
            image: sprite,
            animation: 'idleRight',
            animations: {
                idleRight: [
                    // x, y, width, height
                    0, 0, 33, 40,
                    29, 0, 33, 40,
                    60, 0, 33, 40,
                    93, 0, 33, 40,
                    126, 0, 33, 40,
                    159, 0, 33, 40,
                    192, 0, 33, 40
                ],
                idleLeft: [
                    196, 40, 29, 40,
                    165, 40, 31, 40,
                    132, 40, 33, 40,
                    99, 40, 33, 40,
                    66, 40, 33, 40,
                    33, 40, 33, 40,
                    0, 40, 33, 40
                ],
                moveRight: [
                    43, 162, 33, 36,
                    76, 162, 33, 36,
                    109, 162, 33, 36,
                    141, 162, 33, 36,
                    43, 162, 33, 36,
                    76, 162, 33, 36,
                    109, 162, 33, 36,
                    141, 162, 33, 36
                ],
                moveLeft: [
                    141, 201, 33, 36,
                    109, 201, 33, 36,
                    76, 201, 33, 36,
                    43, 201, 33, 36,
                    141, 201, 33, 36,
                    109, 201, 33, 36,
                    76, 201, 33, 36,
                    43, 201, 33, 36
                ],
                jumpRight: [
                    21, 81, 26, 38,
                    47, 86, 31, 31,
                    78, 86, 31, 31,
                    112, 86, 31, 32,
                    144, 86, 31, 31,
                    47, 86, 31, 31,
                    78, 86, 31, 31,
                    112, 86, 31, 32,
                    144, 86, 31, 31,
                    177, 83, 26, 35
                ],
                jumpLeft: [
                    177, 119, 28, 38,
                    146, 126, 31, 31,
                    115, 125, 31, 31,
                    81, 125, 31, 32,
                    49, 125, 31, 31,
                    146, 126, 31, 31,
                    115, 125, 31, 31,
                    81, 125, 31, 32,
                    49, 125, 31, 31,
                    23, 122, 26, 35
                ],
                fallRight: [
                    118, 241, 25, 44
                ],
                fallLeft: [
                    89, 241, 25, 44,
                ]
            },

            frameRate: 12,
            frameIndex: 0
        });

        // Scale character to approximately 50px height
        character.scale({
            x: 1.3,
            y: 1.3
        });

        //Add shape to layer
        sonicLayer.add(character);

        //Start animation
        character.start();
    }

    sprite.src = 'images/Sonic-All.png';
    layerHero.add(mario);
    stage.add(layerHero);
    stage.add(sonicLayer);
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
            character.setY(character.attrs.y -= JUMP_INC);
            if ((isFlying) && isMovingLeft) {
                character.attrs.animation = 'jumpLeft'
            }

            if ((isFlying) && isMovingRight) {
                character.attrs.animation = 'jumpRight';
            }

            if (!isMovingLeft && !isMovingRight) {
                if (isLastMoveLeft) {
                    character.attrs.animation = 'fallLeft';
                } else {
                    character.attrs.animation = 'fallRight';
                }
            }


        }
    }
    else if (isFalling) {
        yPos += JUMP_INC;
        character.setY(character.attrs.y += JUMP_INC);
    }
}

function moveHero() {
    if (isMovingRight) {
        xPos += STEP_INC;
        isLastMoveLeft = false;
        character.setX(character.attrs.x += STEP_INC);
        if (!(isFlying || isFalling)) {
            character.attrs.animation = 'moveRight';
        }
    }

    if (isMovingLeft) {
        if (xPos - STEP_INC >= 0) {
            isLastMoveLeft = true;
            xPos -= STEP_INC;
            character.setX(character.attrs.x -= STEP_INC);
            if (!(isFlying || isFalling)) {
                character.attrs.animation = 'moveLeft';
            }
        }
    }

    if (isFlying || isFalling) {
        updateFly();
    }
    if (!isFlying && !isFalling && !isMovingRight && !isMovingLeft) {
        if (isLastMoveLeft) {
            character.attrs.animation = 'idleLeft';
        } else {
            character.attrs.animation = 'idleRight';
        }

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
    for (var i = 0; i < coins.length; i++) {
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
    updateCollectedCoins(collectedCoins);
    requestAnimationFrame(gameLoop);
}
function updateCollectedCoins(coins) {
    $('#collectedCoins').text("Collected coins: "+coins);
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
            collectedCoins++;
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
