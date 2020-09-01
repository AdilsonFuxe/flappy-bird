const somHit = new Audio();
somHit.src = '../efeitos/hit.wav';

const sprites = new Image();
sprites.src = './img/sprites.png';
let frame = 0;

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function createFlappBird(){
    const flappBird = {
        spriteX: 0,
        spriteY: 0,
        width: 33,
        height: 24, 
        x: 10,
        y: 50,
        gravity:0.25,
        velocity: 0,
        skip: 4.6,
        jump() {
            flappBird.velocity = - flappBird.skip;
        },
        update(){
            if(madeCollision(flappBird,  global.floor)){
                somHit.play();
                setTimeout(()=>{changeScreen(Screens.START);},500);
                return;
            }    
            flappBird.velocity = flappBird.velocity + flappBird.gravity;
            flappBird.y = flappBird.y + flappBird.velocity;
        },
        moviments: [
            { spriteX: 0, spriteY: 0}, //up
            { spriteX: 0, spriteY: 26}, //middle
            { spriteX: 0, spriteY: 52} // down
        ],
        frameActual: 0,
        updateFrame() {
            const frameInterval = 11;
            const endInterval = frame % frameInterval === 0;
         
            if(endInterval){
                const incrementBase = 1;
                const increment = incrementBase + flappBird.frameActual;
                const repeatBase = flappBird.moviments.length;
                flappBird.frameActual = increment % repeatBase;
            }
        },
        draw() {
            flappBird.updateFrame();
            const { spriteX, spriteY } = flappBird.moviments[flappBird.frameActual];
            context.drawImage(
                sprites,
                spriteX, spriteY,
                flappBird.width, flappBird.height,
                flappBird.x, flappBird.y,
                flappBird.width, flappBird.height
            );
        }
    }
    return flappBird;
}

//chao
function createFloor(){
    const floor = {
        spriteX: 0,
        spriteY: 610,
        width: 224,
        height: 112, 
        x: 0,
        y: canvas.height - 112,
        update(){
           const floorMovement = 1;
           const repeatIn = floor.width / 2;
           const moviment = floor.x - floorMovement;
           floor.x = moviment % repeatIn;
        },
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
    return floor;
}

function madeCollision(flappBird, floor){
    const flappBirdY = flappBird.y + flappBird.height;
    const floorY = floor.y;

    return flappBirdY >= floorY;
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

//canos
function createPipes(){
    const pipes = {
        width: 52,
        height: 400, 
        floor: {
            spriteX: 0,
            spriteY: 169,
        },
        sky: {
            spriteX: 52,
            spriteY: 169,
        },
        space: 80,
       
        draw() {
            const spaceBetweenPipes = 90;
           

            pipes.pars.forEach(function(par){
                const yRandom = par.y;
                const pipeSkyX = par.x;
                const pipeSkyY = yRandom;
                // cano no ceu
                context.drawImage(
                    sprites,
                    pipes.sky.spriteX, pipes.sky.spriteY,
                    pipes.width, pipes.height,
                    pipeSkyX, pipeSkyY,
                    pipes.width, pipes.height
                );

                const pipeFlooyX = par.x;
                const pipeFlooyY = pipes.height + spaceBetweenPipes + yRandom;

                // cano no chao
                context.drawImage(
                    sprites,
                    pipes.floor.spriteX, pipes.floor.spriteY,
                    pipes.width, pipes.height,
                    pipeFlooyX, pipeFlooyY,
                    pipes.width, pipes.height
                );

                par.pipeSky = {
                    x: pipeSkyX,
                    y: pipes.height + pipeSkyY
                }

                par.pipeFloor = {
                    x: pipeFlooyX,
                    y: pipeFlooyY
                }
            });
        },
        pars: [],
        madeCollision(par){
            const flappHead = global.flappBird.y;
            const flappBirdBotton = global.flappBird.y + global.flappBird.height;

            if(global.flappBird.x >= par.x) {
                if(flappHead  <= par.pipeSky.y) {
                    return true;
                }
                
                if( flappBirdBotton >= par.pipeFloor.y) {
                    return true;
                }
            }

            return false;
        },
        update() {
            const passed100Frames = frame % 100 === 0;

            if(passed100Frames) {
                pipes.pars.push( { 
                    x: canvas.width, 
                    y: -150 * (Math.random() + 1)
                })
            }

            pipes.pars.forEach(function(par){
                par.x = par.x - 2;

                if(pipes.madeCollision(par)) {
                    somHit.play();
                    setTimeout(()=>{changeScreen(Screens.START);},500);
                    return;
                }

                if( par.x + pipes.width <= 0) {
                    pipes.pars.shift();
                }
            })
        }
    }

    return pipes;
}

//telas
const global = {};
let activeScreen = {};

function changeScreen (newScreen){
    activeScreen = newScreen;

    if(activeScreen.init){
        activeScreen.init();
    }
}

const Screens = {
    START: {
        init(){
            global.flappBird = createFlappBird();
            global.floor = createFloor();
            global.pipe = createPipes();
        },
        draw() {
            background.draw();
            global.floor.draw();
            global.flappBird.draw();
            getReadyMessage.draw();
        },
        click(){
            changeScreen(Screens.GAME);
        },
        update() {
            global.floor.update();
            global.pipe.update();
        }
    }
}

Screens.GAME = {
    draw() {
        background.draw();
        global.pipe.draw();
        global.floor.draw();
        global.flappBird.draw();
    },
    click() {
        global.flappBird.jump();
    },
    update() {
        global.flappBird.update();
        global.floor.update();
        global.pipe.update();
    }
}

function loop() {
   
    activeScreen.draw();
    activeScreen.update();

    requestAnimationFrame(loop);

    frame++;
}

window.addEventListener('click', ()=>{
    if(activeScreen.click){
        activeScreen.click();
    }
});

changeScreen(Screens.START);

loop();