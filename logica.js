// ==========================================
// VARIÁVEIS GLOBAIS DOS CANAIS
// ==========================================
// A lista de canais agora suporta quantos vídeos você quiser!
// Adicionei o '#video3' como exemplo de como é fácil expandir.
var listaCanais = ['#video1', '#video2', '#video3'];
var indiceCanalAtual = 0; 

// ==========================================
// FUNÇÃO GLOBAL: ANIMAÇÃO DO DEDO
// ==========================================
function animarPolegar() {
    var polegar = document.querySelector('#polegar');
    if (!polegar) return;

    polegar.setAttribute('rotation', '-25 0 30');
    setTimeout(() => {
        polegar.setAttribute('rotation', '0 0 30');
    }, 200);
}

// ==========================================
// 1. SENSOR DE PROXIMIDADE
// ==========================================
AFRAME.registerComponent('sensor-proximidade', {
    schema: {
        alvo: { type: 'selector' },
        mao: { type: 'selector' },
        distancia: { type: 'number', default: 2.5 }
    },
    tick: function () {
        if (!this.data.alvo || !this.data.mao) return;

        var posicaoJogador = this.el.object3D.position;
        var posicaoTv = this.data.alvo.object3D.position;
        var distanciaAtual = posicaoJogador.distanceTo(posicaoTv);

        var btnLigar = document.querySelector('#grupo-ligar');
        var btnCanais = document.querySelector('#grupo-canais');
        var tvEstaLigada = document.querySelector('#tela-tv').getAttribute('visible');

        if (distanciaAtual < this.data.distancia) {
            this.data.mao.setAttribute('visible', 'true');
            if (tvEstaLigada) {
                btnCanais.setAttribute('visible', 'true');
                btnLigar.setAttribute('visible', 'false');
            } else {
                btnCanais.setAttribute('visible', 'false');
                btnLigar.setAttribute('visible', 'true');
            }
        } else {
            this.data.mao.setAttribute('visible', 'false');
            btnLigar.setAttribute('visible', 'false');
            btnCanais.setAttribute('visible', 'false');
        }
    }
});

// ==========================================
// 2. BOTÃO LIGAR A TV
// ==========================================
AFRAME.registerComponent('botao-ligar', {
    init: function () {
        this.el.addEventListener('click', () => {
            animarPolegar(); 

            document.querySelector('#grupo-ligar').setAttribute('visible', 'false');
            document.querySelector('#tela-desligada').setAttribute('visible', 'false');
            
            document.querySelector('#grupo-canais').setAttribute('visible', 'true');
            document.querySelector('#tela-tv').setAttribute('visible', 'true');

            var tela = document.querySelector('#tela-tv');
            var videoParaTocar = document.querySelector(listaCanais[indiceCanalAtual]);
            
            tela.setAttribute('material', 'src', listaCanais[indiceCanalAtual]);
            videoParaTocar.currentTime = 0;
            videoParaTocar.play();
        });
    }
});

// ==========================================
// 3. BOTÃO TROCAR DE CANAL 
// ==========================================
AFRAME.registerComponent('botao-canal', {
    schema: {
        acao: { type: 'string' } 
    },
    init: function () {
        this.el.addEventListener('click', () => {
            animarPolegar(); 

            listaCanais.forEach(function(idVideo) {
                var vid = document.querySelector(idVideo);
                if(vid) vid.pause(); // Adicionei uma checagem de segurança
            });

            if (this.data.acao === 'proximo') {
                indiceCanalAtual++;
                if (indiceCanalAtual >= listaCanais.length) {
                    indiceCanalAtual = 0;
                }
            } else if (this.data.acao === 'anterior') {
                indiceCanalAtual--;
                if (indiceCanalAtual < 0) {
                    indiceCanalAtual = listaCanais.length - 1;
                }
            }

            var videoNovoId = listaCanais[indiceCanalAtual];
            var videoNovo = document.querySelector(videoNovoId);
            var tela = document.querySelector('#tela-tv');

            if (videoNovo) {
                tela.setAttribute('material', 'src', videoNovoId);
                videoNovo.currentTime = 0; 
                videoNovo.play();
            }
        });
    }
});

// ==========================================
// 4. LÓGICA DO JOYSTICK NA TELA
// ==========================================
var dadosMovimento = { x: 0, y: 0 };

window.onload = function() {
    var zonaJoystick = document.getElementById('zona-joystick');
    var gerenciadorJoystick = nipplejs.create({
        zone: zonaJoystick,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'white',
        size: 120
    });

    gerenciadorJoystick.on('move', function (evento, dados) {
        dadosMovimento.x = dados.vector.x;
        dadosMovimento.y = dados.vector.y;
    });

    gerenciadorJoystick.on('end', function () {
        dadosMovimento.x = 0;
        dadosMovimento.y = 0;
    });
};

AFRAME.registerComponent('controle-joystick', {
    tick: function () {
        if (dadosMovimento.x === 0 && dadosMovimento.y === 0) return;

        var velocidade = 0.05;
        var cameraObjeto = this.el.object3D;
        
        var direcaoZ = -dadosMovimento.y; 
        var direcaoX = dadosMovimento.x;

        cameraObjeto.translateX(direcaoX * velocidade);
        cameraObjeto.translateZ(direcaoZ * velocidade);
        
        cameraObjeto.position.y = 1.6;
    }
});