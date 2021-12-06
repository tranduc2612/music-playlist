const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY ='player'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app ={
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    settings: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Bỏ em vào balo',
            singer: 'Tan Tran_ Freak D',
            path:'./music/Bo Em vao Balo - Tan Tran_ Freak D.flac',
            img:'./img/boemvaobalo.jpg'
        },
        {
            name: 'Chị Ong Nâu Nâu',
            singer: 'Nhat Bao Luan',
            path:'./music/Chi Ong Nau That Tinh - Nhat Bao Luan.mp3',
            img:'./img/chiongnaunau.jpg'
        },
        {
            name: 'Đìu Anh Giữ Kín Trong Tym',
            singer: 'RPT MCK-Tlinh',
            path:'./music/Diu Anh Luon Giu Kin Trong Tym - RPT MCK.flac',
            img:'./img/DiuAnhLuonGiuKinTrongTym.jpg'
        },
        {
            name: 'Gu remix',
            singer: 'Freaky',
            path:'./music/Gu Cukak Remix_ - Freaky_ Seachains.mp3',
            img:'./img/Gu.jpg'
        },
        {
            name: 'Gửi vợ tương lai',
            singer: 'KayDee',
            path:'./music/Gui Vo Tuong Lai - Long Non La_ KayDee.flac',
            img:'./img/guivotuonglai.jpg'
        },
        {
            name: 'Hạ còn vương nắng',
            singer: 'DatKaa',
            path:'./music/Ha Con Vuong Nang - DatKaa.flac',
            img:'./img/haconvuongnang.jpg'
        },    
        {
            name: 'Nắm đôi bàn tay',
            singer: 'Kay Trần',
            path:'./music/Nam Doi Ban Tay - Kay Tran.flac',
            img:'./img/namdoibantay.jpg'
        },
        {
            name: 'Người chơi hệ đẹp',
            singer: '16 Typh',
            path:'./music/Nguoi Choi He Dep Cukak Remix_ - 16 Typh.flac',
            img:'./img/nguoichoihedep.jpg'
        },
        {
            name: 'Thích em hơi nhiều',
            singer: 'Wren Evans',
            path:'./music/Thich Em Hoi Nhieu - Wren Evans.mp3',
            img:'./img/thichemhoinhieu.jpg'
        },
        {
            name: 'XTC',
            singer: 'Groovie - Tlinh - MCK',
            path:'./music/XTC - Groovie La Thang_ RPT Orijinn_ RPT.flac',
            img:'./img/xtc.jpg'
        },
        
    ],
    render: function(){
        const htmls = this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index ="${index}">
                <div class="thumb" style="background-image: url('${song.img}"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const cdWidth = cd.offsetWidth;
        // Cd route

        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)' 
            }
        ],{
            duration: 10000, // 10s
            iterations: Infinity
        })
        cdThumbAnimate.pause(); 
        // Zoom Cd
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth; 
        }
        
        // click Play
        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        // when song is played

        audio.onplay = function(){
            app.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // when song is paused
        audio.onpause = function(){
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // Progress changing 
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;   
            }
        }        
        // music rewind
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime;
        }
        // next song
        nextBtn.onclick = function(){
            if(app.isRandom){
                app.randomSong()
            }else{
                app.nextSong();
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        } 
        // prev song
        prevBtn.onclick = function(){
            if(app.isRandom){
                app.randomSong()
            }else{
                app.prevSong();
            }            
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }
        // click random
        randomBtn.onclick = function(){
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active',app.isRandom)
        }

        // ended audio
        audio.onended = function(){
            if(app.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
        // repeat audio
        repeatBtn.onclick = function(){
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active',app.isRepeat)
        }
        // click playlist
        playlist.onclick = function(e){
            const songNude = e.target.closest('.song:not(.active)')
            
            if(songNude || e.target.closest('.option')){
                // click song
                if(songNude){
                    app.currentIndex = Number(songNude.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }

                // click option
                if(e.target.closest('.option')){

                }
            }
        }

    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
          this.currentIndex = 0;
        }
        this.loadCurrentSong();
      },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
          this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === app.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'  
            })
        },300)
    },
    start: function(){
        // definity properties
        this.defineProperties();

        // DOM event
        this.handleEvents();

        // Load first song into UI when run app 
        this.loadCurrentSong();

        // render playlist
        this.render();
    }

}

app.start();

 



