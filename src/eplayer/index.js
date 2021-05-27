import Hls from 'Hls'
export default class Eplayer extends HTMLElement {
    constructor() {
        super()
        this.doms = {}
        this.src = this.getAttribute('src')
        this.type = this.getAttribute('type')
        this.poster = this.getAttribute('poster')
        this.init()
        this.stream()
    }

    static get observedAttributes() {
        return ['src', 'type', 'poster']
    }

    attributeChangedCallback(name, _, newVal) {
        if (name === 'src') this.src = this.$('.video').src = newVal
        if (name === 'type') this.type = newVal
        if (name === 'poster') this.poster = this.$('.video').poster = newVal
        this.stream()
        this.video.load()
    }

    $(key) {
        return this.doms[key]
    }

    waiting() {
        this.$('.mark').removeEventListener('click', this.mark.bind(this))
        this.$('.mark').classList.remove('playing')
        this.$('.mark').classList.add('loading')
    }

    stream() {
        switch (this.type) {
            case 'hls':
                if (Hls.isSupported()) {
                    let hls = new Hls()
                    hls.loadSource(this.src)
                    hls.attachMedia(this.video)
                }
                break
        }
    }

    mark() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => this.play(), 200)
    }

    canplay() {
        this.$('.mark').classList.remove('loading')
        this.$('.mark').classList.add('playing')
        this.$('.mark').addEventListener('click', this.mark.bind(this))
        this.$('.total').innerHTML = getTimeStr(this.video.duration)
    }

    play() {
        if (this.video.paused) {
            this.video.play()
            this.$('.ep-video').style.display = 'none'
            this.$('.is-play').classList.replace('ep-play', 'ep-pause')
        } else {
            this.video.pause()
            this.$('.ep-video').style.display = 'block'
            this.$('.is-play').classList.replace('ep-pause', 'ep-play')
        }
    }

    volume() {
        if (this.video.muted) {
            this.video.muted = false
            setVolume(this.video.volume * 10, this.$('.line'))
            this.$('.is-volume').classList.replace('ep-volume-off', 'ep-volume')
        } else {
            this.video.muted = true
            setVolume(0, this.$('.line'))
            this.$('.is-volume').classList.replace('ep-volume', 'ep-volume-off')
        }
    }

    update() {
        let cTime = getTimeStr(this.video.currentTime)
        if (this.video.buffered.length) {
            let bufferEnd = this.video.buffered.end(this.video.buffered.length - 1)
            this.$('.buffer').style.width = (bufferEnd / this.video.duration) * 100 + '%'
        }
        let offset = (this.video.currentTime / this.video.duration) * 100
        this.$('.now').innerHTML = cTime
        this.$('.current').style.width = offset + '%'
    }

    progress(e) {
      console.log('progress')
        let offset = e.offsetX / this.$('.progress').offsetWidth
        this.video.currentTime = this.video.duration * offset
    }

    down(e) {
        this.disX = e.clientX - this.$('.cycle').offsetLeft
        document.onmousemove = (e) => this.move(e)
        document.onmouseup = () => {
            document.onmousemove = null
            document.onmouseup = null
        }
    }

    move(e) {
        let offset = e.clientX - this.disX + 7
        if (offset < 0) offset = 0
        if (offset > this.$('.progress').clientWidth) {
            offset = this.$('.progress').clientWidth
        }
        this.$('.current').style.width = offset + 'px'
        this.video.currentTime = (offset / this.$('.progress').clientWidth) * this.video.duration
        document.onmousemove = null
        setTimeout((document.onmousemove = (e) => e && this.move(e)), 30)
    }

    alow() {
        clearTimeout(this.timer)
        this.$('.controls').style.bottom = 0
        this.$('.ep-video').style.bottom = 70 + 'px'
        this.$('.mark').style.cursor = 'default'
        this.timer = setTimeout(() => {
            this.$('.controls').style.bottom = -70 + 'px'
            this.$('.ep-video').style.bottom = 25 + 'px'
            this.$('.mark').style.cursor = 'none'
        }, 5000)
    }

    keydown(e) {
        switch (e.keyCode) {
            case 37:
                this.video.currentTime -= 10
                break
            case 39:
                this.video.currentTime += 10
                break
            case 38:
                try {
                    this.video.volume = parseInt(this.video.volume * 100) / 100 + 0.05
                } catch (e) {
                    console.log(e)
                }
                setVolume(this.video.volume.toFixed(1) * 10, this.$('.line'))
                break
            case 40:
                try {
                    this.video.volume = parseInt(this.video.volume * 100) / 100 - 0.05
                } catch (e) {
                    console.log(e)
                }
                setVolume(this.video.volume.toFixed(1) * 10, this.$('.line'))
                break
            case 32:
                this.play()
                break
            default:
        }
    }

    ended() {
        this.$('.is-play').classList.replace('ep-pause', 'ep-play')
    }

    full() {
        let el = this.$('.eplayer')
        if (isFullScreen()) {
            const efs = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen
            return efs()
        } else {
            let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
            return rfs.call(el)
        }
    }

    panel(e) {
        e.preventDefault()
        const panel = this.$('.panel')
        const eplayer = this.$('.eplayer')
        if (e.button !== 2) {
            panel.style.display = 'none'
        } else {
            panel.style.display = 'block'
            panel.style.height = panel.childElementCount * 24 + 'px'
            if (panel.offsetHeight + e.offsetY + 40 > eplayer.offsetHeight) {
                panel.style.top = ''
                panel.style.bottom = ((eplayer.offsetHeight - e.offsetY) / eplayer.offsetHeight) * 100 + '%'
            } else {
                panel.style.bottom = ''
                panel.style.top = (e.offsetY / eplayer.offsetHeight) * 100 + '%'
            }
            if (panel.offsetWidth + e.offsetX + 10 > eplayer.offsetWidth) {
                panel.style.left = ''
                panel.style.right = ((eplayer.offsetWidth - e.offsetX) / eplayer.offsetWidth) * 100 + '%'
            } else {
                panel.style.right = ''
                panel.style.left = (e.offsetX / eplayer.offsetWidth) * 100 + '%'
            }
        }
    }

    speed() {
        this.video.playbackRate === 2 ? (this.video.playbackRate = 1) : (this.video.playbackRate = this.video.playbackRate + 0.5)
        this.$('.speed').innerText = this.video.playbackRate + 'x'
    }

    init() {
        let html = `
        <style>
          @import "https://at.alicdn.com/t/font_836948_g9fk6jqpl8l.css";
          *{
            padding:0;
            margin:0;
          }
          li{
            list-style:none;
          }
          .eplayer,video{
            height:100%;
            width:100%;
            color:var(--icons,rgba(255,255,255,0.6));
            font-size:12px;
            background:#000
          }
          .eplayer{
            user-select:none;
            position: relative;
            overflow: hidden;
          }
          .controls{
            position:absolute;
            left:0;
            right:0;
            bottom:0;
            padding:10px;
            background:linear-gradient(transparent,rgba(0,0,0,.5));
            transition: .3s ease-out;   
            z-index:1;   
          }
          .progress{
            position:relative;
            bottom:15px;
            left:0;
            right:0;
            cursor:pointer;
          }
          .options{
            display:flex;
            align-items:center;
          }
          .epicon{
            color:var(--icons,rgba(255,255,255,0.6));
            padding:0 10px;
          }
          .epicon{
            font-size:18px;
            transition: .3s;
            cursor:pointer;
          }
          .epicon:hover{
            color:#fff;
          }
          .time{
            position:relative;
            top:-2px;
          }
          .time b{
            font-weight:normal;
          }
          .lines{
            display: flex;
            padding:0 10px;
          }
          .line{
            padding:0;
            margin-bottom: -2px;
            cursor:pointer
          }
          .line i{
            width:4px;
            border-radius:4px;
            display: inline-block;
            background: var(--icons,rgba(255,255,255,0.6));
            height: 12px;
            transform:scaleX(0.7);
            transition: .3s;
          }
          .line:hover i{
            height:14px;
            background:var(--theme,#946ce6);
          }
          .active i{
            background:var(--theme,#946ce6);
          }
          .left{
            flex:1;
          }
          .right{
            flex:1;
            display:flex;
            align-items:center;
            justify-content: flex-end;
          }
          .bg,.current,.buffer{
            left:0;
            height:3px;
            position:absolute;
            top:0;
            
          }
          .bg{
            right:0;
            background:var(--progress,rgba(255,255,255,.3));
          }
          .current{
            background:var(--theme,#946ce6);
            pointer-events: none;
          }
          .buffer{
            pointer-events: none;
            background:var(--buffer,rgba(255,255,255,.5));
          }
          .dot{
            position:absolute;
            border-radius: 50%;
            display: block;
            background:var(--theme,#946ce6);
            height: 9px;
            width:9px;
            right:-5px;
            top:-3px;
            cursor:pointer;
            z-index:1;
          }
          .cycle{
            position:absolute;
            border-radius: 50%;
            display: block;
            background:var(--theme,#946ce6);
            opacity:0.3;
            height: 15px;
            width:15px;
            right:-8px;
            top:-6px;
            cursor:pointer;
            z-index:1;
          }
          @keyframes loading{
            0%{
              transform: rotate(0deg);
            }
            100%{
              transform: rotate(360deg);
            }  
          }
          .playing{
            position: absolute;
            z-index: 1;
            top:0;
            left:0;
            right:0;
            bottom:0;
          }
          .loading {
            position: absolute;
            z-index: 1;
            top: 50%;
            left: 50%;
            margin:-20px 0 0 -20px;
            width: 40px;
            height: 40px;
            z-index:1;
            box-shadow: 2px 0px rgba(255,255,255,.6);
            border-radius: 50%;
            animation: loading 1s linear infinite;
          }
          .ep-video {
            position: absolute;
            bottom: 25px;
            right: 20px;
            font-size:40px;
            color:var(--icons,rgba(255,255,255,.6));
            z-index:1;
            cursor: pointer; 
          }
          .panel {
            position: absolute;
            bottom: 200px;
            right: 300px;
            background:rgba(0,0,0,.8);
            border-radius:4px;
            cursor: pointer; 
            z-index: 1;
            display:none;
            width:150px;
          }
          .panel li{
            line-height:24px;
            text-align:center;
          }
          .panel li:hover{
            border-radius:4px;
            background:rgba(0,0,0,.8)
          }
          .speed{
              font-size:10px;
              font-style:italic;
              width:22px;
              text-align:center;
              border-radius:11px;
              color:rgba(0,0,0,.5);
              font-weight:900;
              background:var(--icons,rgba(255,255,255,.8));
              margin-left:-10px;
              display:inline-block;
          }
        </style>
        <div class="eplayer">
          <video id="video" class="video" src="${this.src || ''}" poster="${this.poster}"></video>
          <div class="mark loading"></div>
          <div class="controls" style="bottom:-70px">
            <div class="progress">
              <b class="bg"></b>
              <b class="buffer"></b>
              <div class="current" style="width:0">
                <div class="dot"></div>
                <div class="cycle"></div>
              </div>
            </div>
            <div class="options">
              <div class="left">
                <i class="epicon ep-play is-play"></i>
                <span class="time">
                  <b class="now">00:00</b> / <b class="total">00:00</b>
                </span>
              </div>
              <div class="right">
                <i class="epicon ep-volume is-volume"></i>
                <ol class="lines">
                  <span class="line"><i></i></span>
                  <span class="line"><i></i></span>
                  <span class="line"><i></i></span>
                  <span class="line"><i></i></span>
                  <span class="line"><i></i></span>
                  <span class="line"><i></i></span>
                  <span class="line"><i></i></span>
                  <span class="line"><i></i></span>
                  <span class="line"><i></i></span>
                  <span class="line"><i></i></span>
                </ol>
                <i class="epicon ep-speed">              
                  <b class="speed">1x</b>
                </i>
                ${document.pictureInPictureEnabled && `<i class="epicon ep-pip"></i>`}
                <i class="epicon ep-full"></i>
              </div>
            </div>
          </div>
          <div class="epicon ep-video"></div>
          <div class="panel"></div>
        </div>
      `
        let template = document.createElement('template')
        template.innerHTML = html
        this.attachShadow({
            mode: 'open',
        }).appendChild(template.content.cloneNode(true))

        const doms = [
            '.video',
            '.mark',
            '.playing',
            '.loading',
            '.total',
            '.now',
            '.current',
            '.buffer',
            '.is-play',
            '.ep-video',
            '.is-volume',
            '.cycle',
            '.progress',
            '.controls',
            '.line',
            '.ep-pause',
            '.ep-play',
            '.ep-volume-off',
            '.ep-volume',
            '.bg',
            '.eplayer',
            '.ep-full',
            '.panel',
            '.speed',
            '.pip',
        ]

        for (const key of doms) {
            let dom = this.shadowRoot.querySelectorAll(key)
            this.doms[key] = dom.length > 1 ? [...dom] : dom[0]
        }
        this.mount()

        for (const name in Eplayer.plugins) {
            const cb = Eplayer.plugins[name]
            let node = document.createElement('li')
            node.innerText = name
            let panel = this.$('.panel')
            panel.appendChild(node)
            node.addEventListener('click', () => cb(this.shadowRoot))
        }
    }

    delegate(type, map) {
        const that = this
        if (typeof map === 'function') {
            this.shadowRoot.addEventListener(type, map.bind(that))
        } else {
            this.shadowRoot.addEventListener(type, (e) => {
                for (const key in map) e.target.matches(key) && map[key].call(that, e)
            })
        }
    }

    pip() {
        if (!document.pictureInPictureElement) {
            this.video.requestPictureInPicture()
        } else {
            document.exitPictureInPicture()
        }
    }

    mount() {
        this.video = this.$('.video')
        this.video.volume = 0.5
        setVolume(this.video.volume * 10, this.$('.line'))
        this.video.onwaiting = this.waiting.bind(this)
        this.video.oncanplay = this.canplay.bind(this)
        this.video.ontimeupdate = this.update.bind(this)
        this.video.onended = this.ended.bind(this)
        this.delegate('click', {
            '.is-volume': this.volume,
            '.ep-full': this.full,
            '.ep-video': this.play,
            '.is-play': this.play,
            '.ep-speed': this.speed,
            '.speed': this.speed,
            '.bg': this.progress,
            '.buffer': this.progress,
            '.ep-pip': this.pip,
        })
        this.delegate('mousedown', {
            '.cycle': this.down,
            '.mark': this.panel,
        })
        this.delegate('dblclick', {
            '.mark': () => {
                clearTimeout(this.timer)
                this.full()
            },
        })
        this.delegate('keydown', this.keydown)
        this.delegate('mousemove', this.alow)
        this.$('.line').forEach((item, index) => {
            item.onclick = () => {
                this.video.volume = (index + 1) / 10
                setVolume(index + 1, this.$('.line'))
            }
        })
        document.oncontextmenu = () => false
    }
}

Eplayer.plugins = {}

Eplayer.use = function (name, cb) {
    this.plugins[name] = cb
}

function getTimeStr(time) {
    let h = Math.floor(time / 3600)
    let m = Math.floor((time % 3600) / 60)
    let s = Math.floor(time % 60)
    h = h >= 10 ? h : '0' + h
    m = m >= 10 ? m : '0' + m
    s = s >= 10 ? s : '0' + s
    return h === '00' ? m + ':' + s : h + ':' + m + ':' + s
}

function setVolume(index, node) {
    for (let j = index; j < node.length; j++) {
        node[j].classList.remove('active')
    }
    for (let i = 0; i < index; i++) {
        node[i].classList.add('active')
    }
}

function isFullScreen() {
    return document.isFullScreen || document.webkitIsFullScreen || document.mozIsFullScreen
}


(function () {
    let link = document.createElement('link')
    link.setAttribute('href', 'https://at.alicdn.com/t/font_836948_g9fk6jqpl8l.css')
    link.setAttribute('rel', 'stylesheet')
    document.head.appendChild(link)
})()