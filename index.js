const sprites = new Image();
sprites.src = './sprites.png';


const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');




function loop() {
    contexto.drawImage(
        sprites,
        0, 0,
        33, 24,
        10, 50,
        33, 24
    );

    requestAnimationFrame(loop);
}

loop();