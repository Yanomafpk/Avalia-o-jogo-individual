var SceneOne = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "SceneOne" });
    },
    init: function() {},
    preload: function() {
        this.load.image("botao", "assets/iniciar-real.png")
    },
    create: function() {
        
        //adiciona o botao iniciar
        this.botaoIniciar = this.add.image(410, 300,'botao').setScale(0.5);
        //permite interação com o botão
        this.botaoIniciar.setInteractive({ cursor: 'pointer'});
        //quando mouse passar por cima, adiciona o botao vermelho
        this.botaoIniciar.setDisplaySize(innerWidth*0.2,innerHeight*0.2)

        //quando aperta, vai para o mapa
        this.botaoIniciar.on('pointerup', () => {this.scene.start("SceneTwo")
        ;});
        this.botaoIniciar.setDisplaySize(innerWidth*0.2,innerHeight*0.2);
        
          

    },
    update: function() {
        
    },

    ProximaCena: function() {    
        this.scene.start("SceneTwo",);
    }
});