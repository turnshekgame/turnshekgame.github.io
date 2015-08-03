// Making sure the page loads correctly
console.log("script loaded");

//Setting up canvas
canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context = canvas.getContext("2d");

// This implies the ground level is at canvas.height - 50.
function drawBackground() {
	context.save();
	context.fillStyle = "#f0f0ff";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.translate(0, canvas.height - 50);
	context.fillStyle = "#007f00";
	context.fillRect(0, 0, canvas.width, 50);
	context.restore();
}
// As such ..
groundLevel = canvas.height - 50;

function Character(state, x, y) {
	this.x = x;
	this.y = y;
	this.state = state;

	// These variables are all hacky and subject to change
	this.fallSpeed = 1.0;
	this.maxAirspeed = 5.0
	this.airFriction = 0;
	this.groundFriction = 0;
	this.doubleJump = "unavailable";
	this.charWidth = 25.0;
	this.charHeight = 50.0;
	this.dx = 5;
	this.dy = 0;

	// Draws the character, their x and y is the center of the drawing.
	this.draw = function() {
		context.save();
		context.translate(this.x, this.y);
		var x = -this.charWidth/2;
		var y = -this.charHeight/2;
		var width = this.charWidth;
		var height = this.charHeight;
		context.fillStyle = "#007f7f";
		context.fillRect(x, y, width, height);
		context.restore();
	}

	// Medium here meaning the terrain: air, ice, grass
	this.applyFriction = function(v, medium) {
		var dec = 0;
		if (medium == "grass") {
			dec = 0.5;
		}
		if (medium == "air") {
			dec = 0.1;
		}

		var newV = 0;
		if ((v > 0) && (v - dec > 0)) {
			newV = v - dec;
		}
		else if ((v > 0) && (v - dec <= 0)) {
			newV = 0;
		}
		else if ((v < 0) && (v + dec < 0)) {
			newV = v + dec;
		}
		else if ((v < 0) && (v + dec >= 0)) {
			newV = 0;
		}

		return newV;
	}

	// Progresses the character one frame, using player input and naturally
	this.update = function () {

		// The if statements adjust the dx and dy accordingly
		if (this.state == "airborne") {
			console.log("in here?");
			// Read player controls
			// .. 
			// ..

			// Check to see if grounded
			// WARNING: hacky since there is no real ground yet
			var charBot = this.y + (this.charHeight/2) // this is feet y-coord
			console.log(charBot);
			console.log(groundLevel);
			// Character hits the ground
			if (charBot >= groundLevel) {
				this.y = groundLevel - this.charHeight/2;
				this.dy = 0;
				this.dx = this.applyFriction(this.dx, "grass")
				this.state = "stand"
			}
			// Character is still in the air
			else {
				this.dy += this.fallSpeed
				if (this.dy > Math.abs(this.maxAirspeed)) {
					this.dy = this.applyFriction(this.dy, "air");
				}
				if (this.dx > Math.abs(this.maxAirspeed)) {
					this.dx = this.applyFriction(this.dx, "air");
				}
				this.state = "airborne" // redundant, not sure if should keep
			}

		}
		else if (this.state == "stand") {
			this.y = groundLevel - this.charHeight/2;
			this.dy = 0;
			this.dx = this.applyFriction(this.dx, "grass")
			this.state = "stand"
		}
		else if (this.state == "walk") {

		}
		// Now, the x and y are updated based on the new dx and dy
		this.draw();
		this.x += this.dx;
		this.y += this.dy;
	};
}

// Initializing game stuff
var player = new Character("airborne", canvas.width/2, canvas.height/2);
var frameNumber = 0;
function worldUpdate() {
	drawBackground();
	player.update();
	//console.log("frameNumber")
	frameNumber ++;
}

setInterval(worldUpdate, 20);