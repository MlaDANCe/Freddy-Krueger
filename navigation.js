var LEFT = 0;
var TOP = 0;
var RIGHT = 800;
var BOTTOM = 600;
var JUMP_MAX = 80;
var JUMP_INC = 10;
var STEP_INC = 10;
var TIMEOUT = 150;
var MARIO_WIDTH = 30;
var MARIO_HEIGHT = 50;
var xPos = 10;
var yPos = BOTTOM - MARIO_HEIGHT - 1;
var timerId;
var stage;
var layer;
var isFlying = false;
var isFalling = false;
var flyCounter = 0;
var fallCounter = 0;
var mario;


(function testNavigation() {
    window.addEventListener("keydown", keyDownEventHandler, false);
    stage = new Kinetic.Stage({
        container: 'canvas-wrapper',
        width: 800,
        height: 600
    });

    layer = new Kinetic.Layer();
    mario = new Kinetic.Rect({
        x: 10,
        y: BOTTOM - MARIO_HEIGHT - 1,
        width: MARIO_WIDTH,
        height: MARIO_HEIGHT,
        fill: 'yellow',
        stroke: 'black',
        strokeWidth: 4
    });
    layer.add(mario);
    stage.add(layer);
    timerId = setInterval(update, TIMEOUT);
})();


function keyDownEventHandler(event) {
    switch (event.keyCode) {
        // Up arrow
        case 0x26:
            if (!(isFlying || isFalling)) {
                beginFly();
            }
            break;
        // Right arrow
        case 0x27:
            if (xPos + MARIO_WIDTH + STEP_INC <= RIGHT) {
                xPos += STEP_INC;
            }
            break;
        // Down arrow
        //case 0x28:

        //    break;
            // Left arrow
        case 0x25:
            if (xPos - STEP_INC >= 0) {
                xPos -= STEP_INC;
            }
            break;
    }
}

function beginFly() {
    isFlying = true;
    flyCounter = 0;
}

function updateFly() {
    if (isFlying) {
        flyCounter += JUMP_INC;
        if (flyCounter > JUMP_MAX) {
            isFlying = false;
            isFalling = true;
            flyCounter -=  JUMP_INC;
        }
        else {
            yPos -= JUMP_INC;
        }
    }
    else if (isFalling) {
        flyCounter -= JUMP_INC;
        if (flyCounter < 0) {
            isFalling = false;
        }
        else {
            yPos += JUMP_INC;
        }
    }
}

function update() {
    updateFly();
    mario.x(xPos);
    mario.y(yPos);
    layer.clear();
    mario.draw();
}