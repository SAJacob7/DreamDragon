export default class Player {
    WALK_ANIMATION_TIMER = 200;
    walkAnimationTimer = this.WALK_ANIMATION_TIMER;
 
 
    jumpPressed = false;
    jumpInProgress = false;
    falling = false;
    JUMP_SPEED = 0.6;
    GRAVITY = 0.4;
 
 
    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio, dragonLevel) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio * 0.8;
        this.dragonLevel = dragonLevel;
 
 
        this.x = 40 * scaleRatio;
        this.y = this.canvas.height - this.height - 35 * scaleRatio;
        this.yStandingPosition = this.y;
 
 
        this.dragon = new Image();
        if (this.dragonLevel == 1) {
            this.dragon.src = "../static/images/dragon1.png";
        }
        else if (this.dragonLevel == 2) {
            this.dragon.src = "../static/images/dragon2.png";
        }
        else if (this.dragonLevel == 3) {
            this.dragon.src = "../static/images/dragon3.png";
        }
        else if (this.dragonLevel == 4) {
            this.dragon.src = "../static/images/dragon4.png";
        }
        else if (this.dragonLevel == 5) {
            this.dragon.src = "../static/images/dragon5.png";
        }
        this.image = this.dragon;
 
 
        // Keyboard
        window.removeEventListener('keydown', this.keydown)
        window.removeEventListener('keyup', this.keyup)
 
 
        window.addEventListener('keydown', this.keydown)
        window.addEventListener('keyup', this.keyup)
 
 
        // Touch
        window.removeEventListener('touchstart', this.touchstart)
        window.removeEventListener('touchend', this.touchstart)
 
 
        window.addEventListener('touchstart', this.touchstart)
        window.addEventListener('touchend', this.touchstart)
    }
 
 
    touchstart = () => {
        this.jumpPressed = true;
    }
 
 
    touchend = () => {
        this.jumpPressed = false;
    }
 
 
    keydown = (event) => {
        if (event.code === 'Space') {
            this.jumpPressed = true;
        }
    }
 
 
    keyup = (event) => {
        if (event.code === 'Space') {
            this.jumpPressed = false;
        }
    }
 
 
    update(gameSpeed, frameTimeDelta) {
        this.run(gameSpeed, frameTimeDelta);
        this.jump(frameTimeDelta);
    }
 
 
    jump(frameTimeDelta) {
        if (this.jumpPressed) {
            this.jumpInProgress = true;
        }
 
 
        if (this.jumpInProgress && !this.falling) {
            if (this.y > this.canvas.height - this.minJumpHeight
                || this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed
                ) {
                this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
            } else {
                this.falling = true;
            }
       
        }
        else {
            if (this.y < this.yStandingPosition) {
                this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
                if (this.y + this.height > this.canvas.height) {
                    this.y = this.yStandingPosition;
                }
            } else {
                this.falling = false;
                this.jumpInProgress = false;
            }
        }
    }
 
 
    run(gameSpeed, frameTimeDelta) {
        this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
    }
 
 
    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
 
 
    }
 } 