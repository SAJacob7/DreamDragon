import Star from "./Star1.js";

export default class StarController {
    STAR_INTERVAL_MIN = 500;
    STAR_INTERVAL_MAX = 2500;

    nextStarInterval = null;
    stars = [];

    constructor(ctx, starImages, scaleRation, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.starImages = starImages;
        this.scaleRation = scaleRation;
        this.speed = speed;

        this.setNextStarTime();
    }

    setNextStarTime() {
        const num = this.getRandomNumber(this.STAR_INTERVAL_MIN, this.STAR_INTERVAL_MAX);
        this.nextStarInterval = num;
        console.log(this.nextStarInterval);
    }

    getRandomNumber(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createStar() {
        const index = this.getRandomNumber(0, this.starImages.length - 1);
        const starImage = this.starImages[index];
        const x = this.canvas.width * 1.5;
        const y = this.canvas.height - starImage.height;
        const star = new Star(this.ctx, x, y, starImage.width, starImage.height, starImage.image);
    
        this.stars.push(star);
    }

    update(gameSpeed, frameTimeDelta) {
        if (this.nextStarInterval <= 0) {
            this.createStar();
            this.setNextStarTime();
        }
        this.nextStarInterval -= frameTimeDelta;

        this.stars.forEach((star) => {
            star.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRation);
        });

        this.stars = this.stars.filter(star => star.x > -star.width);
    }

    draw() {
        this.stars.forEach(star => star.draw());
    }

    collideWith(player) {
        return this.stars.some(star => star.collideWith(player));
    }

    reset() {
        this.stars = [];
    }
}