//The stage
var stage = new Kinetic.Stage({
    container: 'kinetic-canvas',
    width: 800,
    height: 600,

})

var layer = new Kinetic.Layer();

//A border of the whole stage
var border = new Kinetic.Rect({
    width: stage.getWidth(),
    height: stage.getHeight(),
    stroke: 'black',
    strokeWidth: 2
})

//Add border to layer
layer.add(border);

//Load sprite
var sprite = new Image();

//Create shape/animation
sprite.onload = function () {
     var character = new Kinetic.Sprite({
        x: 400,
        y: 400,
        image: sprite,
        animation: 'idleRight',
        animations: {
            idleRight: [
                // x, y, width, height
                0, 0, 29, 40,
                29, 0, 31, 40,
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
                32, 158, 37, 41,
                71, 159, 39, 39,
                112, 157, 40, 41,
                152, 159, 40, 39
            ],
            moveLeft: [
                151, 199, 37, 41,
                109, 200, 39, 39,
                68, 199, 40, 41,
                28, 200, 40, 39

            ],
            jumpRight: [
                21, 81, 26, 38,
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
                23, 122, 26, 35
            ]
        },

        frameRate: 7,
        frameIndex: 0
     });

    //Add shape to layer
     layer.add(character);

    //Add layer to stage
     stage.add(layer);

    //Start animation
     character.start();
}

sprite.src = 'sprites/Sonic-All.png';

////Special events that will change animation of character
//character.on('frameIndexChange', function (evt) {
//    character.animation('character-animation');
//});


