var SceneTwo = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function SceneTwo() {
        Phaser.Scene.call(this, { "key": "SceneTwo" });
    },
    init: function(data) {
        // Obtém a mensagem passada como dado
        this.message = data.message;

        // Define as propriedades do jogador
        this.player = {
            width: 170,
            height: 133,
            obj: null
        };

        // Inicializa a pontuação
        this.score = 0;

        // Inicializa outras variáveis da cena
        this.cursors = null;
        this.platforms = null;
        this.stars = null;
        this.bombs = null;
        this.scoreText = null;
    },
    preload: function() {
        // Carrega as imagens necessárias
        this.load.spritesheet('dragon', 'assets/dragao.png', { frameWidth: this.player.width, frameHeight: this.player.height });
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
    },
    create: function() {
        // Cria um grupo de plataformas estáticas
        this.platforms = this.physics.add.staticGroup();

        // Cria plataformas
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        // Adiciona o jogador e suas propriedades físicas
        this.player.obj = this.physics.add.sprite(170, 130, 'dragon').setScale(0.6);
        this.player.obj.body.setSize(50, 80, true);
        this.player.obj.setCollideWorldBounds(true);
        this.physics.add.collider(this.player.obj, this.platforms);

        // Adiciona animação ao jogador
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('dragon', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.player.obj.anims.play('fly');

        // Cria um objeto para rastrear as teclas do cursor
        this.cursors = this.input.keyboard.createCursorKeys();

        // Adiciona estrelas para coletar
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        // Define a propriedade de quicar das estrelas
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Cria um grupo para armazenar bombas
        this.bombs = this.physics.add.group();

        // Cria texto para mostrar a pontuação
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

        // Colisão entre as variaveis
        this.physics.add.collider(this.player.obj, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);

        // Verifica se o jogador colide com as estrelas ou as bombas
        this.physics.add.overlap(this.player.obj, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player.obj, this.bombs, this.hitBomb, null, this);

        // Adiciona texto na tela
        this.add.text(
            640, 
            360, 
            this.message, 
            {
                fontSize: 50,
                color: "#000000",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);
    },
    update: function() {
        // Move o jogador para direita e esquerda
        if (this.cursors.left.isDown) {
            this.player.obj.setVelocityX(-150);
        } else if (this.cursors.right.isDown) {
            this.player.obj.setVelocityX(150);
        } else {
            this.player.obj.setVelocityX(0);
        }

        // Move o jogador para cima e para baixo
        if (this.cursors.up.isDown) {
            this.player.obj.setVelocityY(-150);
        } else if (this.cursors.down.isDown) {
            this.player.obj.setVelocityY(150);
        } else {
            this.player.obj.setVelocityY(0);
        }
    },
    collectStar: function(player, star) {
        // Desabilita a estrela quando a estrela é coletada
        star.disableBody(true, true);

        // Adiciona pontos à pontuação
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        // Verifica se todas as estrelas foram coletadas
        if (this.stars.countActive(true) === 0) {
            // nascem as estrelas
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            // Cria uma nova bomba a cada vez que todas estrelas são coletadas
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }
    },
    hitBomb: function(player, bomb) {
        // Pausa a física do jogo
        this.physics.pause();

        // Tinge o jogador de vermelho
        player.setTint(0xff0000);

        // Toca a animação de virar
        player.anims.play('turn');
    }
});
