/**
 * A sound pool to use for the sound effects
 */
function SoundPool(maxSize) {
	var size = maxSize; // Max sounds allowed in the pool
	var pool = [];
	this.pool = pool;
	var currSound = 0;
	/*
	 * Populates the pool array with the given sound
	 */
	this.init = function(object) {
		if (object == "bullet") {
			for (var i = 0; i < size; i++) {
				// Initalize the sound
				laser = new Audio("sounds/bullet.wav");
				laser.volume = .22;
				laser.load();
				pool[i] = laser;
			}
		}
		else if (object == "explosion") {
			for (var i = 0; i < size; i++) {
				var explosion = new Audio("sounds/explosion.wav");
				explosion.volume = .3;
				explosion.load();
				pool[i] = explosion;
			}
		}
		else if (object == "launch") {
			for (var i = 0; i < size; i++) {
				var launch = new Audio("sounds/launch.wav");
				launch.volume = .35;
				launch.load();
				pool[i] = launch;
			}
		}
		else if (object == "bullet") {
			for (var i = 0; i < size; i++) {
				var bullet = new Audio("sounds/bullet.wav");
				bullet.volume = .25;
				bullet.load();
				pool[i] = bullet;
			}
		}
	};

	/*
	 * Plays a sound
	 */
	this.get = function() {
		if(pool[currSound].currentTime == 0 || pool[currSound].ended) {
			pool[currSound].play();
		}
		currSound = (currSound + 1) % size;
	};
}

function mute(){
	if(backgroundAudio.volume === 0){
		backgroundAudio.volume = 0.25;
	}else{
		backgroundAudio.volume = 0;
	}
}