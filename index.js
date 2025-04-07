const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const keys = {};
const objects = [];
const allBullets = [];
const infoText = document.getElementById("infoText");
const deleteFromArray = function (target, array) {
    const index = array.indexOf(target);
    if (index > -1) {
        array.splice(index, 1); // Remove the element from the array
    }
} // Function to delete an element from an array, used for bullets elements

class Player {
    constructor(x, y, color) {
        this.x = x;
        this.spawnX = x;
        this.spawnY = y;
        this.y = y;
        this.speed = 5;
        this.lives = 5;
        this.direction = "up";
        this.damageable = true;
        this.color = color;
        this.size = 30;
    }
    // die() {

    // }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    move(dX, dY) {
        this.x += dX;
        this.y += dY;
    }
    checkCollision(enemyProjectileList) {
        for (let i = 0; i < enemyProjectileList.length; i++) {
            if (this.x < enemyProjectileList[i].x + enemyProjectileList[i].size &&
                this.x + this.size > enemyProjectileList[i].x &&
                this.y < enemyProjectileList[i].y + enemyProjectileList[i].size &&
                this.y + this.size > enemyProjectileList[i].y) {
                return true;
            }
        }
        return false;
    }
    update() {
        if (this.x <= 0) {
            this.x = canvas.width - this.size;

        }
        if (this.x >= canvas.width - this.size) {
            this.x = 0;
        }
        if (this.y <= 0) {
            this.y = canvas.height - this.size;
        }
        if (this.y >= canvas.height - this.size) {
            this.y = 0;
        }
    }
}
class Bullet {
    constructor(x, y, direction, target, memberArray) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.memberArray = memberArray;
        this.speed = 15;
        this.size = 10;
        this.direction = direction;
        // this.image = new Image();
        // this.image.src = 'waterBall.webp';
    }

    draw() {
        // ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Circle with center (100, 100) and radius 50
        if (this.target == player1) {
            ctx.fillStyle = 'blue';
        }
        else {
            ctx.fillStyle = 'red';
        }
        ctx.fill();
        ctx.closePath();
    }
    collide() {
        if (
            this.x < this.target.x + this.target.size &&
            this.x + this.size > this.target.x &&
            this.y + this.size > this.target.y &&
            this.y + this.size <= this.target.y + this.target.size
        ) {
            return true;
        }
        else {
            return false;
        }
    }
    die() {
        this.y = -60;
        this.speed = 0;
        deleteFromArray(this, this.memberArray);
    }
    tick() {
        if (this.direction === "left") {
            this.x = this.x - this.speed;
        }
        if (this.direction === "right") {
            this.x = this.x + this.speed;
        }
        if (this.direction === "up") {
            this.y = this.y - this.speed;
        }
        if (this.direction === "down") {
            this.y = this.y + this.speed;
        }
        if (this.collide()) {
            this.target.lives -= 1;
            console.log(this.target.lives);
            this.die()
        }
    }
}

// function Fire(x, y) {
//     this.x = x;
//     this.y = y;
//     this.size = 30;
//     this.dead = false;
//     this.image = new Image();
//     this.image.src = 'fire.webp';
//     this.draw = function () {
//         ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
//     },
//         this.die = function () {
//             this.x = canvas.width + 20;
//             this.y = -20;
//             this.dead = true;
//             play();
//         }
//     this.playerCollide = function (player) {
//         if (
//             this.x < player.x + player.size &&
//             this.x + this.size > player.x &&
//             this.y + this.size > player.y &&
//             this.y + this.size <= player.y + player.size
//         ) {
//             return true;
//         }
//     }
//     this.waterCollide = function (water) {
//         if (
//             this.x < water.x + water.size &&
//             this.x + this.size > water.x &&
//             this.y + this.size > water.y &&
//             this.y + this.size <= water.y + water.size
//         ) {
//             this.die();
//             water.collide();
//         }
//     }
// }

const BGImage = new Image(1400, 850);
var imgSrc = "";
var player1 = new Player(100, 100, 'blue');
var player2 = new Player(600, 100, 'red');


// const height = 20
const brown = '#964B00'; // Brown color for platforms



// Ensure the title screen is displayed on page load
window.onload = function () {
    document.getElementById('titleScreen').style.display = 'flex';
    canvas.style.display = 'none';
    infoText.style.display = 'none';
};


function gameLoop() {
    ctx.clearRect(0, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black for the background
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(BGImage, 0, 0, 1400, 850);
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Handle player movement
    if (keys['a']) {
        player1.move(-player1.speed, 0);
        player1.direction = "left";
    }
    if (keys['d']) {
        player1.move(player1.speed, 0);
        player1.direction = "right";
    }
    if (keys['w']) {
        player1.move(0, -player1.speed);
        player1.direction = "up";
    }
    if (keys['s']) {
        player1.move(0, player1.speed);
        player1.direction = "down";
    }
    if (keys['ArrowLeft']) {
        player2.move(-player2.speed, 0);
        player2.direction = "left";
    }
    if (keys['ArrowRight']) {
        player2.move(player2.speed, 0);
        player2.direction = "right";
    }
    if (keys['ArrowUp']) {
        player2.move(0, -player2.speed);
        player2.direction = "up";
    }
    if (keys['ArrowDown']) {
        player2.move(0, player2.speed);
        player2.direction = "down";
    }
    // Update and draw player
    player1.update();
    player1.draw();
    player2.update();
    player2.draw();

    infoText.innerText = "";

    // Draw fires and check collisions

    // Handle water projectiles
    for (const bullet of allBullets) {
        if (this.y < 0 || this.y > canvas.getAttribute("height") || this.x < 0 || this.x > canvas.getAttribute("width")) {
            this.die();
        }
        else {
            bullet.tick();
            bullet.draw();
        }
    }
    // if (Player.score >= targetScore) {
    //     ctx.fillStyle = '#88E788';
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    //     ctx.fillStyle = 'black';
    //     ctx.font = "50px Arial";
    //     ctx.fillText("You win!", canvas.width / 2 - 200, canvas.height / 2);
    //     ctx.fillText("Press F5 to play again", canvas.width / 2 - 200, canvas.height / 2 + 50);
    //     ctx.fillText("Points: " + Player.score + "/" + targetScore + " Deaths: " + Player.deaths, canvas.width / 2 - 200, canvas.height / 2 + 100);
    //     ctx.font = "20px Aria";
    //     ctx.fillText("These dangerous forest fires that you just put out occur all over the world, claiming lives and homes every time they happen.", canvas.width / 2 - 600, canvas.height / 2 + 150);
    //     ctx.fillText("We need to push for more preventative measures for these catastrophies in order to eliminate or mitigate the damages from wildfires.", canvas.width / 2 - 600, canvas.height / 2 + 180);
    //     ctx.fillText("Because gradual global warming and climate change is the primary cause of the increase in natural wildfires as of late, that should be our main priority.", canvas.width / 2 - 650, canvas.height / 2 + 210);
    //     ctx.fillText("Combatting global warming will not be easy, but we must work together to prevent this impending doom that is knocking on our door.", canvas.width / 2 - 600, canvas.height / 2 + 240);

    // }
    
    //determines color of info text, dev discretion based on color of bg
    switch (level){
        case 1:
            ctx.fillStyle= "white";
        case 2:
            ctx.fillStyle = "black";
    }
    if (player1.lives<=0){
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = "50px Arial";
        ctx.fillText("Player 2 Wins!", canvas.width / 2 - 200, canvas.height / 2);
        ctx.fillText("Press F5 to play again", canvas.width / 2 - 200, canvas.height / 2 + 50);
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + 5-player2.lives +"-" + 5-player1.lives);
    }
    else if (player2.lives<=0){

    }
    requestAnimationFrame(gameLoop);
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
    if (event.key === ' ') {
        allBullets.push(new Bullet(player1.x + player1.size / 2, player1.y + player1.size / 2, player1.direction, player2, allBullets));
    }
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});
document.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // 0 is the left mouse button
        allBullets.push(new Bullet(player2.x + player2.size / 2, player2.y + player2.size / 2, player2.direction, player1, allBullets));
    }
});
// Start the game loop
BGImage.onload = function () {
    gameLoop();
};

function startLevel(level) {
    // Hide the title screen and show the game canvas
    document.getElementById('titleScreen').style.display = 'none';
    canvas.style.display = 'block';
    infoText.style.display = 'block';

    // Clear existing platforms and fires

    // Load level-specific platforms and fires
    if (level === 1) {
        imgSrc = "marsBG.webp";
    } else if (level === 2) {
        imgSrc = "spaceBG.webp";
    } else if (level === 3) {
        imgSrc = "marsBG.webp";
    }
    else if (level === 4) {
        imgSrc = "spaceBG.webp";
    }
    BGImage.src = imgSrc;
    // Start the game loop
    gameLoop();
}