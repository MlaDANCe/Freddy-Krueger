var coinWidth = 5,
    coinHeight = 10,
    shouldShrink = true,   //needed for animation
    speedOfRotation = 0.3, //from 0.0 to 5.0
    numberOfCoins = 1;

//The stage
var stage = new Kinetic.Stage({
    container: 'animation',
    width: 800,
    height: 600
})

var layer = new Kinetic.Layer();

//A border of the whole stage
var border = new Kinetic.Rect({
  width: stage.getWidth(),
  height: stage.getHeight(),
  stroke: 'black',
  strokeWidth: 2,
  
})

layer.add(border);
var coinArray = [];
for (var i = 0; i < numberOfCoins; i++) {
    coinArray[i] = new Kinetic.Ellipse({
            x: stage.getWidth() / 2 + 20 * i,
            y: stage.getHeight() - coinHeight   ,
            radius: {
              x: coinWidth,
              y: coinHeight
            },
            fill: 'gold',
            stroke: 'black',
            strokeWidth: 1,
        })
    layer.add(coinArray[i]);
}

//Animnation
var anim = new Kinetic.Animation(function(frame) {
    animateCoins(coinArray);
}, layer);

//Coin rotation
function animateCoins(coins) {
    for (var i = 0; i < numberOfCoins; i++) {
        if (coins[i].getRadius().x >= coinWidth) {
        shouldShrink = true;
        }
        else if (coins[i].getRadius().x <= speedOfRotation) {
            shouldShrink = false;
        }

        if (shouldShrink) {
            coins[i].setRadius({x: coins[i].getRadius().x - speedOfRotation, y: coins[i].getRadius().y});
        }
        else {
            coins[i].setRadius({x: coins[i].getRadius().x + speedOfRotation, y: coins[i].getRadius().y});
        }
    }
}

anim.start();

for (var i = 0; i < numberOfCoins; i++) {
    //Some styling
    coinArray[i].on('mouseover', function() {
        document.body.style.cursor = 'pointer';
    })

    coinArray[i].on('mouseout', function() {
        document.body.style.cursor = 'default';
    })

    //On click remove the coin - needed for collision detection later on
    coinArray[i].on('click', function() {
        this.remove();
    })
}
      

stage.add(layer);