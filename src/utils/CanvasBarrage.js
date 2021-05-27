import Barrage from './Barrage'
export default class CanvasBarrage{
    constructor(canvas, video, option){
        console.log(canvas, video, option)
        this.canvas = canvas;
        this.video = video;
        let defaultOption = {
            speed: 2,
            fontSize: 20,
            color: '#fff',
            ...option
        }

        Object.assign(this, defaultOption);

        this.context = canvas.getContext('2d');
        // 设置宽高
        this.canvas.width = video.clientWidth;
        this.canvas.height = video.clientHeight;
        // 是否暂停
        this.isPaused = true;
        // 存放弹幕
        console.log('dada',this.data)
        this.barrages = this.data.map(obj => new Barrage(obj, this))

        // 渲染所有弹幕
        this.render();
        let self = this;
        this.video.addEventListener('play', function(){
            self.isPaused = false;
            self.render();
        })
        this.video.addEventListener('pause', function(){
            self.isPaused = true;
        })
    }

    // 渲染弹幕
    render(){
        // 第一次先经行清空， 执行渲染弹幕，如果没有暂停继续渲染
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        // 渲染弹幕
        this.renderBarrage();
        if(!this.isPaused){
            window.requestAnimationFrame(this.render.bind(this));
        }

    }

    renderBarrage(){
        // 将数组中的弹幕一个一个取出，判断时间和视频的时间是否符合，符合就执行渲染此弹幕。
        let time = this.video.currentTime;
        this.barrages.forEach(barrage => {
            if(!barrage.flag && time >= barrage.time){
                // 先去初始化，初始化后再进行绘制
                if(!barrage.isInited){
                    barrage.init();
                    barrage.isInited = true;
                }
                barrage.x -= barrage.speed;
                // 渲染自己
                barrage.render();
                if(barrage.x <= -1 * barrage.width){
                    // 停止渲染的标记
                    barrage.flag = true;
                }
            }
        })
    }
}