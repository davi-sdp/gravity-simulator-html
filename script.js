// Parâmetros de física
const gravity = 4000; // aceleração da gravidade em pixels por segundo ao quadrado
const bounceDamping = 0.7; // fator de amortecimento no salto
const moveSpeed = 200; // velocidade do movimento com as setas em pixels por segundo
const jumpSpeed = -1000; // velocidade do salto
const objectSize = 50; // tamanho do objeto
let audioUnlocked = false; // incia sem som

let velocityY = 0;   // velocidade vertical inicial
let velocityX = 0;   // velocidade horizontal inicial
let positionY = (window.innerHeight - objectSize) / 2; // centraliza verticalmente
let positionX = (window.innerWidth - objectSize) / 2; // centraliza horizontalmente
let object = document.querySelector('.falling-object');
let impactSound = document.getElementById('impact-sound');

let lastTime = 0;
let keys = {}; // Objeto para armazenar o estado das teclas
let isFrozen = false; // Estado para verificar se o objeto está congelado
let isRemovingSpeed = false; // Estado para verificar se a velocidade deve ser removida

// Função para lidar com o controle do teclado
function handleKeyDown(event) {
    keys[event.key] = true; // Marca a tecla como pressionada

    if (event.key === 'k') {
        // Alterna o estado de congelamento
        isFrozen = !isFrozen;
        if (isFrozen) {
            velocityX = 0; // Remove a velocidade horizontal
            velocityY = 0; // Remove a velocidade vertical
        }
    }
    if (event.key === 'j') {
        isRemovingSpeed = true; // Remove a velocidade do objeto
    }
    if (event.key === ' ') {
        velocityY = jumpSpeed; // pula
    }
}

function handleKeyUp(event) {
    keys[event.key] = false; // Marca a tecla como solta
    if (event.key === 'j') {
        isRemovingSpeed = false; // Permite movimento novamente
    }
}

// Espera antes de tocar o áudio
// Qualquer tecla pressionada
window.addEventListener("keydown", (event) => {
    audioUnlocked = true;
});

// Clique do mouse
window.addEventListener("click", () => {
    audioUnlocked = true;
});

// Toque na tela
window.addEventListener("touchstart", () => {
    audioUnlocked = true;
});

function playImpactSound() {
    impactSound.currentTime = 0; // Reinicia o som
    impactSound.play(); // Reproduz o som
}

function update(time) {
    // Calcula o tempo decorrido
    let dt = (time - lastTime) / 1000; // em segundos
    lastTime = time;

    dt = Math.min(dt, 0.1);

    if (!isFrozen) {
        // Atualiza a velocidade com base nas teclas pressionadas
        if (keys['ArrowUp'] || keys['w']) {
            velocityY -= moveSpeed; // Move para cima
        }
        if (keys['ArrowDown'] || keys['s']) {
            velocityY += moveSpeed; // Move para baixo
        }
        if (keys['ArrowLeft'] || keys['a']) {
            velocityX -= moveSpeed; // Move para a esquerda
        }
        if (keys['ArrowRight'] || keys['d']) {
            velocityX += moveSpeed; // Move para a direita
        }

        if (isRemovingSpeed) {
            velocityX = 0; // Remove a velocidade horizontal
            velocityY = Math.max(velocityY, 0); // Remove a velocidade vertical (apenas se estiver descendo)
        }

        // Atualiza a velocidade e a posição
        velocityY += gravity * dt;
        positionY += velocityY * dt;
        positionX += velocityX * dt;

        let hitEdge = false;

        // Verifica se o objeto atinge o chão
        if (positionY > window.innerHeight - objectSize) {
            positionY = window.innerHeight - objectSize; // Corrige a posição no chão
            velocityY *= -bounceDamping; // Inverte a velocidade vertical para o efeito de quicar
            hitEdge = true;
        }

        // Verifica se o objeto atinge o teto
        if (positionY < 0) {
            positionY = 0; // Corrige a posição no teto
            velocityY *= -bounceDamping; // Inverte a velocidade vertical para o efeito de quicar
            hitEdge = true;
        }

        // Verifica se o objeto atinge a borda direita
        if (positionX > window.innerWidth - objectSize) {
            positionX = window.innerWidth - objectSize; // Corrige a posição na borda direita
            velocityX *= -bounceDamping; // Inverte a velocidade horizontal
            hitEdge = true;
        }

        // Verifica se o objeto atinge a borda esquerda
        if (positionX < 0) {
            positionX = 0; // Corrige a posição na borda esquerda
            velocityX *= -bounceDamping; // Inverte a velocidade horizontal
            hitEdge = true;
        }

        // Reproduz o som de impacto se o objeto bateu em alguma borda e se audioUnlocked é true
        if (hitEdge && audioUnlocked) {
            playImpactSound();
        }
    }

    // Atualiza a posição do objeto na tela
    object.style.top = `${positionY}px`;
    object.style.left = `${positionX}px`;

    // Repetir a atualização
    requestAnimationFrame(update);
}

// Adiciona os ouvintes de eventos para o teclado
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

// Inicializa a posição e velocidade
requestAnimationFrame(update);