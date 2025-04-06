export default class Score {
    score = 0
    HIGH_SCORE_KEY = "highscore";

    constructor(ctx, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
    }

    update(frameTimeDelta) {
        this.score += frameTimeDelta * 0.01;
    }

    reset(){
        this.score = 0;
    }

    setHighScore() {
        const highScore = 0;// get highscore from db
        if (this.score > highScore) {
            this.score = 50;
            // save highscore to db with Math.floor(this.score)
        }
    }

    draw() {
        const highScore = 0;// get highscore from db
        const y = 20 * this.scaleRatio * 0.8;

        const fontSize = 20 * this.scaleRatio * 0.8;
        this.ctx.font = `${fontSize}px serif`;
        this.ctx.fillStyle = "white";

        const scoreX = this.canvas.width - 50 * this.scaleRatio * 0.8;
        const highScoreX = scoreX - 100 * this.scaleRatio * 0.8;

        const scorePadded = Math.floor(this.score).toString().padStart(3, 0);
        const highScorePadded = highScore.toString().padStart(3, 0);

        this.ctx.fillText(scorePadded, scoreX, y);
    }
}