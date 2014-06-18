var backgroundAudio = new Audio('sounds/background-music.ogg');
var youWinAudio = new Audio('sounds/win.ogg');
var gameOverAudio = new Audio('sounds/gameOver.ogg');
var DEFAULT_IMAGE_WIDTH = 30;
var soundOnIconPath = 'images/soundOn.png',
	soundOffIconPath = 'images/soundOff.png';

var $soundImage = $(document.createElement('img')).attr({'src' : soundOnIconPath, 'width' : DEFAULT_IMAGE_WIDTH});
var $soundImageContainer = $('#soundImage');

$soundImageContainer.hide();
$soundImage.on('click', function() {
	$this = $(this);
	if($this.attr('src') == soundOnIconPath) {
		$this.attr('src', soundOffIconPath)
		backgroundAudio.pause();
	}
	else if($this.attr('src') == soundOffIconPath) {
		$this.attr('src', soundOnIconPath);
		backgroundAudio.play();
	}
})
$soundImageContainer.append($soundImage);
    
// Get the play button and append an audio play method to onclick
var play = document.getElementById('startButton');
play.addEventListener('click', function(){
    backgroundAudio.play();
	$soundImageContainer.fadeIn(2500);
	backgroundAudio.loop = true;
}, false);

setInterval(function() {
	if (isGameOver && !isGameWin) {
		backgroundAudio.pause();
		$soundImageContainer.css('pointer-events', 'none');
		gameOverAudio.loop = true;
		setTimeout(function(){
			gameOverAudio.play();
		}, 500);
	}
	else if (isGameWin && !isGameOver) {
		backgroundAudio.pause();
		$soundImageContainer.css('pointer-events', 'none');
		youWinAudio.loop = false;
		setTimeout(function(){
			youWinAudio.play();
		}, 500);
	}
}, 100)