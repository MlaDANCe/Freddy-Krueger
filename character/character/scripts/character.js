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
var imageObject = new Image();
imageObject.src = 'sprites/idle-right.png';

//Create shape/animation
imageObject.onload = function () {
    var character = new Kinetic.Sprite({
        x: 400,
        y: 50,
        image: imageObject,
        animation: 'character-animation',
        animations: {
            idle: [
              // x, y, width, height (7 frame)
              0, 0, 30, 41,
              30, 0, 31, 41,
              61, 0, 33, 41,
              94, 0, 33, 41,
              127, 0, 33, 41,
              160, 0, 33, 41,
              193, 0, 33, 41
            ]
        },

        frameRate: 7,
        frameIndex: 0
    });
}

//Add shape to layer
layer.add(character)

//Add layer to stage
stage.add(layer);

//Start animation
character.start();

//Special events that will change animation of character
//character.on('frameIndexChange', function (evt) {
//    character.animation('character-animation');
//});


