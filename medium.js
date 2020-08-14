let canvas = document.querySelector("#canvas");
let level = prompt(`
Уровни сложности:

1 - Легкий
2 - Средний
3 - Сложный

Введите номер:`);

let score = document.querySelector(".score");

let int1, int2, int3;

let ctx = canvas.getContext("2d");
let bgc = ["#FF8E00", "#AA00A2", "#C9F600", "#00B060", "#5CCCCC", "#FFBA00", "#FFBF73", "#717BD8", "#5FD3B3", "#00A779", "#B964D4", "#B0F26D"];
let scorePoints = 0;
bgc = shuffle(bgc);

canvas.style.backgroundColor = `${bgc[0]}`;

let w = 600;
let h = 400;
let angle = 0;

function collides(a, b) {
    if (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y) {
        return true;
    };
}

canvas.width = 600;
canvas.height = 400;

function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


class Enemy {
    constructor(speed) {
        let side = Math.round(Math.random() * 3);
        let randomX = parseInt(Math.random() * w);
        let randomY = parseInt(Math.random() * h);
        let positions = [
            [-50, randomY],
            [w + 50, randomY],
            [randomX, h + 50],
            [randomX, -50]
        ];
        this.x = positions[side][0];
        this.y = positions[side][1];
        if (level === "1") {
            this.lives = 1;
            this.score = 100;
        } else if (level === "2") {
            this.lives = 2;
            this.score = 200;
        } else if (level === "3") {
            this.lives = 2;
            this.score = 200;
        };

        this.speed = speed;
        this.image = new Image();
        this.image.src = "./img/a2.png";

        this.width = 40;
        this.height = 40 * (288 / 261);
        this.isActive = true;
    };

    attack(player) {
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let distance = Math.sqrt(dx ** 2 + dy ** 2);
        let collideWithPlayer = collides(player, this);

        if (!collideWithPlayer) {
            this.x += (dx / distance * this.speed);
            this.y += (dy / distance * this.speed);
        };

        let angleToPlayer = Math.atan2(dy, dx) + Math.PI / 2;

        drawRotatedImage(this.image, this, angleToPlayer);
    };
};


class Laser {
    constructor(player) {
        this.width = 15;
        this.height = 15;
        this.dx = Math.cos(angle - Math.PI / 2) * 10;
        this.dy = Math.sin(angle - Math.PI / 2) * 10;
        this.x = player.x + this.dx - 10;
        this.y = player.y + this.dy - 10;
        this.image = new Image();
        this.image.src = "./img/bullet1.png";
        this.isActive = true;
    };

    shoot() {
        this.x += this.dx;
        this.y += this.dy;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

        if (this.x > w + 20 || this.x < 0 || this.y > h + 20 || this.y < 0) {
            this.isActive = false;
        };

        for (let alien of aliens) {
            if (collides(this, alien)) {
                alien.lives -= 1;
                this.isActive = false;
                console.log(alien.lives);
                if (alien.lives === 0) {
                    scorePoints += alien.score;
                    alien.isActive = false;
                    console.log(alien.lives);
                    break;
                };
            };
        };

    };
};



let player = {
    x: 400,
    y: 300,
    width: 40 + (193 / 314),
    height: 40,
    image: new Image(),
    speed: 5,

    update: function () {
        if (keys[68] === true) {
            this.x += this.speed;
        };
        if (keys[65] === true) {
            this.x -= this.speed;
        };
        if (keys[83] === true) {
            this.y += this.speed;
        };
        if (keys[87] === true) {
            this.y -= this.speed;
        };

        if (this.x < this.width / 2) {
            this.x = this.width / 2;
        };
        if (this.x > w - this.width / 2) {
            this.x = w - this.width / 2;
        };
        if (this.y < this.height / 2) {
            this.y = this.height / 2;
        };
        if (this.y > h - this.height / 2) {
            this.y = h - this.height / 2;
        };
    },



    draw: function () {
        this.update();
        // ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        drawRotatedImage(this.image, this, angle);
    }
}

function drawRotatedImage(image, object, angle) {
    ctx.save();
    ctx.translate(object.x, object.y);
    ctx.rotate(angle);
    ctx.drawImage(image, -(object.width / 2), -(object.height / 2), object.width, object.height);
    ctx.restore();
};

let keys = [];

document.addEventListener("keydown", event => keys[event.keyCode] = true);
document.addEventListener("keyup", event => keys[event.keyCode] = false);
document.addEventListener("mousemove", event => {
    let x = event.layerX - player.x;
    let y = event.layerY - player.y;
    angle = Math.atan2(y, x) + Math.PI / 2;
});

let lasers = [];
let aliens = [];
let mediumAliens = [];

function intervals() {
    if (level === "1") {
        int1 = setInterval(() => {
            if (aliens.length < 6) {
                aliens.push(new Enemy(parseInt(Math.random() + 2)));
            };
        }, 1000);

        int2 = setInterval(() => {
            if (aliens.length < 10) {
                aliens.push(new mediumEnemy(parseInt(Math.random() + 2)));
            };
        }, 5000);


        int3 = setInterval(() => {
            if (aliens.length < 11) {
                aliens.push(new hardEnemy(parseInt(Math.random() + 2)));
            };
        }, 20000);

    } else if (level === "2") {
        int1 = setInterval(() => {
            if (aliens.length < 6) {
                aliens.push(new Enemy(parseInt(Math.random() + 3)));
            };
        }, 1000);

        int2 = setInterval(() => {
            if (aliens.length < 10) {
                aliens.push(new mediumEnemy(parseInt(Math.random() + 2)));
            };
        }, 5000);


        int3 = setInterval(() => {
            if (aliens.length < 11) {
                aliens.push(new hardEnemy(parseInt(Math.random() + 4)));
            };
        }, 20000);
    } else if (level === "3") {
        int1 = setInterval(() => {
            if (aliens.length < 6) {
                aliens.push(new Enemy(parseInt(Math.random() + 3)));
            };
        }, 900);

        int2 = setInterval(() => {
            if (aliens.length < 10) {
                aliens.push(new mediumEnemy(parseInt(Math.random() + 2)));
            };
        }, 4500);


        int3 = setInterval(() => {
            if (aliens.length < 11) {
                aliens.push(new hardEnemy(parseInt(Math.random() + 8)));
            };
        }, 20000);
    };

}





document.addEventListener("click", event => lasers.push(new Laser(player)));




player.image.src = "./img/player.png";


function main() {
    requestAnimationFrame(main);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let laser of lasers) {
        laser.shoot();
    };

    for (let alien of aliens) {
        alien.attack(player);
    };

    lasers = lasers.filter(l => l.isActive);
    aliens = aliens.filter(a => a.isActive);

    score.textContent = scorePoints;


    player.draw();
}

class mediumEnemy {
    constructor(speed) {
        let side = Math.round(Math.random() * 3);
        let randomX = parseInt(Math.random() * w);
        let randomY = parseInt(Math.random() * h);
        let positions = [
            [-50, randomY],
            [w + 50, randomY],
            [randomX, h + 50],
            [randomX, -50]
        ];
        this.x = positions[side][0];
        this.y = positions[side][1];
        if (level === "1") {
            this.lives = 2;
            this.score = 200;
        } else if (level === "2") {
            this.lives = 3;
            this.score = 400;
        } else if (level === "3") {
            this.lives = 3;
            this.score = 400;
        };

        this.speed = speed;
        this.image = new Image();
        this.image.src = "./img/a1.png";

        this.width = 40;
        this.height = 40 * (288 / 261);
        this.isActive = true;
    };

    attack(player) {
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let distance = Math.sqrt(dx ** 2 + dy ** 2);
        let collideWithPlayer = collides(player, this);

        if (!collideWithPlayer) {
            this.x += (dx / distance * this.speed);
            this.y += (dy / distance * this.speed);
        };

        let angleToPlayer = Math.atan2(dy, dx) + Math.PI / 2;

        drawRotatedImage(this.image, this, angleToPlayer);
    };
};


class hardEnemy {
    constructor(speed) {
        let side = Math.round(Math.random() * 3);
        let randomX = parseInt(Math.random() * w);
        let randomY = parseInt(Math.random() * h);
        let positions = [
            [-50, randomY],
            [w + 50, randomY],
            [randomX, h + 50],
            [randomX, -50]
        ];
        this.x = positions[side][0];
        this.y = positions[side][1];
        if (level === "1") {
            this.lives = 10;
            this.score = 1300;
        } else if (level === "2") {
            this.lives = 15;
            this.score = 2000;
        } else if (level === "3") {
            this.lives = 3;
            this.score = 4000;
        };

        this.speed = speed;
        this.image = new Image();
        this.image.src = "./img/a3.png";

        this.width = 40;
        this.height = 40 * (288 / 261);
        this.isActive = true;
    };


    attack(player) {
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let distance = Math.sqrt(dx ** 2 + dy ** 2);
        let collideWithPlayer = collides(player, this);

        if (!collideWithPlayer) {
            this.x += (dx / distance * this.speed);
            this.y += (dy / distance * this.speed);
        };

        let angleToPlayer = Math.atan2(dy, dx) + Math.PI / 2;

        drawRotatedImage(this.image, this, angleToPlayer);
    };
};

setInterval(() => {
    for (let i of aliens) {
        if (collides(i, player)) {
            scorePoints = 0;
            score.textContent = "";
            aliens = [];
            clearInterval(int1);
            clearInterval(int2);
            clearInterval(int3);
            intervals();
        };
    };

}, 100);

main();
intervals();