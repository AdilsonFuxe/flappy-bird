const sprites = new Image();
sprites.src = './sprites.png';


const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const flappBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24, 
    x: 10,
    y: 50,
    gravity:0.25,
    velocity: 0,
    update(){
        flappBird.velocity = flappBird.velocity + flappBird.gravity;
        flappBird.y = flappBird.y + flappBird.velocity;
    },
    draw() {
        context.drawImage(
            sprites,
            flappBird.spriteX, flappBird.spriteY,
            flappBird.width, flappBird.height,
            flappBird.x, flappBird.y,
            flappBird.width, flappBird.height
        );
    }
}

//chao
const floor = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112, 
    x: 0,
    y: canvas.height - 112,
    draw() {
        context.drawImage(
            sprites,
            floor.spriteX, floor.spriteY,
            floor.width, floor.height,
            floor.x, floor.y,
            floor.width, floor.height
        );
        context.drawImage(
            sprites,
            floor.spriteX, floor.spriteY,
            floor.width, floor.height,
            (floor.x + floor.width), floor.y,
            floor.width, floor.height
        );
    }
}

//plano de fundo
const background = {
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204, 
    x: 0,
    y: canvas.height - 204,
    draw() {
        context.fillStyle = '#70c5ce';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
            sprites,
            background.spriteX, background.spriteY,
            background.width, background.height,
            background.x, background.y,
            background.width, background.height
        );
        context.drawImage(
            sprites,
            background.spriteX, background.spriteY,
            background.width, background.height,
            (background.x + background.width), background.y,
            background.width, background.height
        );
    }
}

const getReadyMessage = {
    spriteX: 134,
    spriteY: 0,
    width: 174,
    height: 152, 
    x: (canvas.width / 2) - (174 / 2),
    y: 50,
    draw() {
        context.drawImage(
            sprites,
            getReadyMessage.spriteX, getReadyMessage.spriteY,
            getReadyMessage.width, getReadyMessage.height,
            getReadyMessage.x, getReadyMessage.y,
            getReadyMessage.width, getReadyMessage.height
        );
    }
}

//telas

let activeScreen = {};

function changeScreen (newScreen){
    activeScreen = newScreen;
}

const Screens = {
    START: {
        draw() {
            background.draw();
            floor.draw();
            flappBird.draw();
            getReadyMessage.draw();
        },
        click(){

        },
        update() {

        }
    }
}

Screens.GAME = {
    draw() {
        background.draw();
        floor.draw();
        flappBird.draw();
    },
    update() {
        flappBird.update();
    }
}

function loop() {
   
    activeScreen.draw();
    activeScreen.update();

    requestAnimationFrame(loop);
}

window.addEventListener('click', ()=>{
    if(activeScreen.click){
        changeScreen(Screens.GAME);
    }
});

changeScreen(Screens.START);

loop();