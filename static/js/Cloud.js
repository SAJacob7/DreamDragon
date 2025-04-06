export default class Cloud {
    constructor(ctx, width, height, speed, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio * 0.8;

        this.x = 0;
        this.y = this.canvas.height - this.height;
        this.cloudImg = new Image();
        this.cloudImg.src = '../static/images/cloud_background.png';
    }

    update(gameSpeed, frameTimeDelta) {
        this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
    }

    draw() {
        this.ctx.drawImage(this.cloudImg, this.x, this.y, this.width, this.height);
        this.ctx.drawImage(this.cloudImg, this.x + this.width - 1, this.y, this.width, this.height);

        if(this.x < -this.width) {
            this.x = 0;
        }
    }

    reset() {
        this.x = 0;
    }
}