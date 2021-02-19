var backgroundAudio = new Audio('sounds/background-music.ogg');
var youWinAudio = new Audio('sounds/win.ogg');
var gameOverAudio = new Audio('sounds/gameOver.ogg');
var DEFAULT_IMAGE_WIDTH = 30;

var $window = $(window);

var isBackgroundAudioPlaying = false,
	isYouWinAudioPlaying = false,
	isGameOverAudioPlaying = false;

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
		youWinAudio.pause();
		gameOverAudio.pause();
	}
	else if($this.attr('src') == soundOffIconPath) {
		$this.attr('src', soundOnIconPath);
		if (isBackgroundAudioPlaying) {
			backgroundAudio.play();
		}
		else if (isYouWinAudioPlaying) {
			youWinAudio.play();
		}
		else if (isGameOverAudioPlaying) {
			gameOverAudio.play();
		}
	}
})
$soundImageContainer.append($soundImage);
    
// Get the play button and append an audio play method to onclick
var play = document.getElementById('startButton');
play.addEventListener('click', function(){
    backgroundAudio.play();
	$soundImageContainer.fadeIn(2500);
	backgroundAudio.loop = true;
	isBackgroundAudioPlaying = true;
}, false);

$window.on('gameover', onGameOver).on('gamewin', onGameWon);

function onGameOver() {
	backgroundAudio.pause();
	gameOverAudio.loop = true;
	setTimeout(function(){
		if($soundImage.attr('src') == soundOnIconPath) {
			gameOverAudio.play();
		}
		isGameOverAudioPlaying = true;
		isBackgroundAudioPlaying = false;
	}, 500);
}

function onGameWon() {
	backgroundAudio.pause();
	youWinAudio.loop = false;
	setTimeout(function(){
		if($soundImage.attr('src') == soundOnIconPath) {
			youWinAudio.play();
		}
		isYouWinAudioPlaying = true;
		isBackgroundAudioPlaying = false;
	}, 500);
}