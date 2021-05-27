export default class Barrage{
    constructor(obj, ctx){
        this.obj = obj;
        this.ctx = ctx;

        this.value = obj.content;
        this.time = obj.time;
    }

    init(){
        this.opacity = this.obj.opacity || this.ctx.opacity;
        this.color = this.obj.color || this.ctx.color;
        this.fontSize = this.obj.fontSize || this.ctx.fontSize;
        this.speed = this.obj.speed || this.ctx.speed;

        // 求自己的宽度，目的是用来校验当前是否还需要继续绘制
        let span = document.createElement('span');
        span.innerText = this.value;
        span.style.font = this.fontSize + 'px "Microsoft YaHei"';
        span.style.position = 'absolute';
        document.body.appendChild(span);

        // 记录弹幕有多宽
        this.width = span.clientWidth;
        document.body.removeChild(span);
        // 弹幕的出现位置
        this.x = this.ctx.canvas.clientWidth;
        this.y = this.ctx.canvas.height * Math.random();
        if(this.y < this.fontSize){
            this.y = this.fontSize
        }
        if(this.y > this.ctx.canvas.height - this.fontSize){
            this.y = this.ctx.canvas.height - this.fontSize;
        }
    }

    render(){
        // 渲染自己，将自己画在画布上
        this.ctx.context.font = this.fontSize + 'px "Microsoft YaHei"';
        this.ctx.context.fillStyle = this.color;
        this.ctx.context.fillText(this.value, this.x, this.y);
    }
}