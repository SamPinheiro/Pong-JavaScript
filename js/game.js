// Definindo a variavel canvas
var canvas = document.getElementById('canvas');
// Aqui definimos que tudo que será desenhado vai ser em 2d
var ctx = canvas.getContext('2d');

// Variavel para guardar o valor das teclas
var teclas = {};

// Criando a barra da esquerda
var esquerda = {
    x: 10,
    y: canvas.height / 2 - 150 / 2,
    altura: 150,
    largura: 20,
    diry: 0,
    score: 0,
    speed: 4
};
// Criando a barra da direita
var direita = {
    altura: 150,
    largura: 20,
    x: canvas.width - 30,
    y: canvas.height / 2 - 150 / 2,
    diry: 0,
    score: 0,
    speed: 4
};
// Criando a bola
var bola = {
    x: canvas.width / 2 - 15,
    y: canvas.height / 2 - 15,
    altura: 20,
    largura: 20,
    dirx: -1,
    diry: 1,
    mod: 0,
    speed: 1
};

// EventListener das teclas de movimento
document.addEventListener('keydown', function (e) {
    teclas[e.keyCode] = true;
});

document.addEventListener('keyup', function (e) {
    delete teclas[e.keyCode]
});

// Movimentação dos blocos
function moveBloco() {
    if (87 in teclas && esquerda.y > 15)
        esquerda.y -= esquerda.speed;
    else if (83 in teclas && esquerda.y + esquerda.altura < (canvas.height - 15))
        esquerda.y += esquerda.speed;

    if (38 in teclas && direita.y > 15)
        direita.y -= direita.speed;
    else if (40 in teclas && direita.y + direita.altura < (canvas.height - 15))
        direita.y += direita.speed;
};

// Movimentação da bola
function moveBola() {
    // Colisão com os blocos
    if (bola.y + bola.altura >= esquerda.y && bola.y <= esquerda.y + esquerda.altura && bola.x <= esquerda.x + esquerda.largura) {
        bola.dirx = 1;
        bola.mod += 0.2;
    }

    else if (bola.y + bola.altura >= direita.y && bola.y <= direita.y + direita.altura && bola.x + bola.largura >= direita.x) {
        bola.dirx = -1;
        bola.mod += 0.2;
    }

    // Colisão com o canvas
    if (bola.y <= 0)
        bola.diry = 1;
    else if (bola.y + bola.altura >= canvas.height)
        bola.diry = -1;

    // Modificador de velocidade da bola
    bola.x += (bola.speed + bola.mod) * bola.dirx;
    bola.y += (bola.speed + bola.mod) * bola.diry;

    // Contador de pontos
    if (bola.x < esquerda.x + esquerda.largura - 15)
        score('player 2');

    else if (bola.x + bola.largura > direita.x + 15)
        score('player 1');
};

// Atribuição de pontos ao Score
function score(whoScored) {
    if (whoScored == 'player 1')
        ++esquerda.score;
    else
        ++direita.score;

    esquerda.y = canvas.height / 2 - esquerda.altura / 2;
    direita.y = esquerda.y;
    bola.y = canvas.height / 2 - bola.altura / 2;
    bola.x = canvas.width / 2 - bola.largura / 2;
    bola.mod = 0;
};

// Criando função que encerra jogo
function encerraJogo(winner) {
    desenhaScore();

    // Criando função que reseta os valores do Score, limpa o canvas e chama a função esperaStart
    function ganhador() {
        if (winner == 'direita') alert('O Jogador da direita ganhou, Parabéns! Aperte OK para voltar ao menu inicial');
        else if (winner == 'esquerda') alert('O Jogador da esquerda ganhou, Parabéns! Aperte OK para voltar ao menu inicial');

        esquerda.score = 0;
        direita.score = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.querySelector('button').style.display = 'block';

        esperaStart();
    }
    //Para o loop
    clearInterval(loop);
    setTimeout(ganhador, 100)
};

// Desenhar elementos na tela
function desenha() {
    // Limpando o canvas e definindo a cor do elementos
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';

    // Chamando as funções de movimento
    moveBloco();
    moveBola();

    // Desenhar a bola e os blocos
    ctx.fillRect(bola.x, bola.y, bola.largura, bola.altura);
    ctx.fillRect(esquerda.x, esquerda.y, esquerda.largura, esquerda.altura);
    ctx.fillRect(direita.x, direita.y, direita.largura, direita.altura);

    // Desenhar o Score
    ctx.font = '60px Verdana';
    desenhaScore();

    // Teste de número maximo de pontos
    if (direita.score == 10) encerraJogo('direita');
    else if (esquerda.score == 10) encerraJogo('esquerda');
};

// Desenhando Score
function desenhaScore() {
    ctx.fillText(esquerda.score, 400, 60);
    ctx.fillText(direita.score, canvas.width - 450, 60);
}

// Criando função de loop para desenhar o canvas
function gameLoop() {
    loop = setInterval(desenha, 5);
};

// Desabilitando o botão e chamando o loop
function comecaJogo() {
    document.querySelector('button').style.display = 'none';
    gameLoop();
};

// Criando função que espera o click no botão para iniciar o jogo
function esperaStart() {
    const iniciar = document.getElementById('iniciar');
    iniciar.addEventListener('click', comecaJogo);
}

// Criando o loop e chamando a função esperaStart 
var loop;
esperaStart();