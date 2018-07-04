'use strict'
let canvas = document.getElementById('game');
let context = canvas.getContext('2d');

let asterSpeed = [];
let fires = [];
let expl = [];
let timer = 0;
let ship = {
	x: 300,
	y: 300,
	animX: 0,
	animY: 0
};

let aster = new Image();
aster.src = './img/astero.png';

let background = new Image();
background.src = './img/fon.png';

let shipImg = new Image();
shipImg.src = './img/ship01.png';

let fire = new Image();
fire.src = './img/fire.png';

let explosionImg = new Image();
explosionImg.src = './img/expl222.png';

canvas.addEventListener('mousemove', (event) => {
	ship.x = event.offsetX - 25;
	ship.y = event.offsetY - 13;
}, false);


background.onload = function() {
	game();
}

function game() {
	update();
	render();
	requestAnimationFrame(game);
}

function update() {
	
	// добавление новых астероидов
	timer++;
	
	if (timer % 30 === 0) {
		asterSpeed.push({
			x: Math.random() * 540,
			y: -60,
			// от -1 до +1
			dx: Math.random() * 3 - 2,
			// от 2 до 4
			dy: Math.random() * 2 + 2,
			del: 0
		});
	}
	
	// выстрелы
	if (timer % 20 === 0) {
		fires.push({
			x: ship.x + 10,
			y: ship.y,
			dx: 0,
			dy: -5.2
		});
	}
	
	// физика
	// движение выстрелов
	for(let i = 0; i < fires.length; i++) {
		fires[i].x += fires[i].dx;
		fires[i].y += fires[i].dy;
		
		// удаление выстрелов за границей
		if (fires[i].y <= -30) {
			fires.splice(i, 1);
		}
	}
	
	// анимация взрыва
	for (let i = 0; i < expl.length; i++) {
		// скорость анимации
		expl[i].animx += 1.7;
		
		if (expl[i].animx > 7) {
			expl[i].animy++;
			expl[i].animx = 0;
		}
		
		if (expl[i].animy > 7) {
			expl.splice(i, 1);
		}
	}
	
	// движение астероидов
	for (let i = 0; i < asterSpeed.length; i++) {
		asterSpeed[i].x += asterSpeed[i].dx;
		asterSpeed[i].y += asterSpeed[i].dy;

		// границы
		if (asterSpeed[i].x >= 540 || asterSpeed[i].x <= 0) {
			asterSpeed[i].dx = -asterSpeed[i].dx;
		}
		
		// удаление астероидов за границей поля
		if (asterSpeed[i].y >= 600) {
			asterSpeed.splice(i, 1);
			//i--;
		}
		
		// взаимодействие астероидов и выстрелов
		for (let j = 0; j < fires.length; j++) {
			if (Math.abs(asterSpeed[i].x + 25 - fires[j].x - 15) < 50 && Math.abs(asterSpeed[i].y - fires[j].y) < 25) {
				// добавление взрыва
				expl.push({
					x: asterSpeed[i].x - 25,
					y: asterSpeed[i].y - 25,
					animx: 0,
					animy: 0
				});
				
				// отметка астероида для удаления
				asterSpeed[i].del = 1;
				fires.splice(j, 1);
				break;
			}
		}
		if (asterSpeed[i].del === 1) {
			asterSpeed.splice(i, 1);
		}
	}
}

function render() {
	context.drawImage(background, 0, 0, 600, 600);
	context.drawImage(shipImg, ship.x, ship.y);
	
	for (let i = 0; i < fires.length; i++) {
		context.drawImage(fire, fires[i].x, fires[i].y, 30, 30);
	}
	
	for (let i = 0; i < asterSpeed.length; i++) {
		context.drawImage(aster, asterSpeed[i].x, asterSpeed[i].y, 60, 60);
	}
	
	for (let i = 0; i < expl.length; i++) {
		context.drawImage(explosionImg, 128 * Math.floor(expl[i].animx), 128 * Math.floor(expl[i].animy), 128, 128, expl[i].x, expl[i].y, 100, 100); // 100, 100 финальный размер
	}
}