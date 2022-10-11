// 1. Render songs                                  /x
// 2. Scroll top                                    /x
// 3. Play / pause / seek                           /x
// 4. CD rotate                                     /x
// 5. Next / Prev                                   /x
// 6. Random                                        /x
// 7. Next / Repeat when ended                      /x
// 8. Active song                                   /x
// 9. Scroll active song into view                  /x
// 10. Play song when click                         /x

////// Song list
const heading = document.querySelector("header h2");
const singer = document.querySelector("header h3");
const cdThump = document.querySelector(".cd-thumb");
const audio = document.querySelector("#audio");
const cd = document.querySelector(".cd");
const playBtn = document.querySelector(".btn-toggle-play");
const player = document.querySelector(".player");
const progress = document.querySelector("#progress");
const nextBtn = document.querySelector(".btn-next");
const prevSong = document.querySelector(".btn-prev");
const randomBtn = document.querySelector(".btn-random");
const repeatBtn = document.querySelector(".btn-repeat");
const playList = document.querySelector(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeated: false,
  //properties:
  songs: [
    {
      name: "Vì anh đâu có biết",
      singer: "Madihu",
      path: "./assets/music/song1.mp3",
      img: "./assets/img/song1.jpg",
    },
    {
      name: "Anh nhớ ra",
      singer: "Vũ.",
      path: "./assets/music/song2.mp3",
      img: "./assets/img/song2.jpg",
    },
    {
      name: "Em không hiểu",
      singer: "Changg",
      path: "./assets/music/song3.mp3",
      img: "./assets/img/song3.jpg",
    },
    {
      name: "Stuck with you",
      singer: "Justin Bieber",
      path: "./assets/music/song4.mp3",
      img: "./assets/img/song4.jpg",
    },
    {
      name: "Thế thôi",
      singer: "Hải Sâm",
      path: "./assets/music/song5.mp3",
      img: "./assets/img/song5.jpg",
    },
    {
      name: "vaicaunoicokhiennguoithaydoi",
      singer: "Grey D",
      path: "./assets/music/song6.mp3",
      img: "./assets/img/song6.jpg",
    },
    {
      name: "Tình đắng như ly cà phê",
      singer: "ngơ",
      path: "./assets/music/song7.mp3",
      img: "./assets/img/song7.jpg",
    },
    {
      name: "Có em",
      singer: "madihu",
      path: "./assets/music/song8.mp3",
      img: "./assets/img/song8.jpg",
    },
    {
      name: "Thắc Mắc",
      singer: "Thịnh Suy",
      path: "./assets/music/song9.mp3",
      img: "./assets/img/song9.jpg",
    },
    {
      name: "Đi qua mùa hạ",
      singer: "Thái Đinh",
      path: "./assets/music/song10.mp3",
      img: "./assets/img/song10.jpg",
    },
    {
      name: "Chợt nhìn nhau",
      singer: "Vũ.",
      path: "./assets/music/song11.mp3",
      img: "./assets/img/song2.jpg",
    },
  ],

  songsPlayed: [],

  renderSong() {
    let html = "";
    this.songs.forEach((song, index) => {
      html += `
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        }" index="${index}">
        <div
          class="thumb"
          style="
            background-image: url('${song.img}');
          "
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
        `;
      document.querySelector(".playlist").innerHTML = html;
    });
  },
  // Định nghĩa thêm các thuộc tính của app
  defineProperty() {
    //docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents() {
    const cdWidth = cd.clientWidth;
    const _this = this; // lưu _this = app
    let isHolding = false;
    // thu nhỏ ảnh khi scroll lên, phóng to ảnh khi scroll xuống: bắt sự kiện scroll -> scroll xuống thì tăng width CD, scroll lên thì giảm width
    window.addEventListener("scroll", function () {
      const newCdWidth = cdWidth - this.scrollY;
      if (newCdWidth >= 0) {
        cd.style.width = newCdWidth + "px";
        cd.style.opacity = newCdWidth / cdWidth;
      }
      // Guard trường hợp scroll nhanh quá window chưa bắt kịp scrollY
      if (scrollY > cdWidth) {
        cd.style.width = 0 + "px";
      }
    });

    // CD rotate:
    // docs:https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
    // return 1 obj
    const cdThumpAnimate = cdThump.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //5s
      iterations: Infinity, // loop
    });

    cdThumpAnimate.pause(); // lúc đầu vào thì dừng

    // Xử lí click play btn
    playBtn.addEventListener("click", function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    });

    // Khi audio chạy / bài hát được phát
    audio.addEventListener("play", function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumpAnimate.play();
    });

    // Khi audio dừng / bài hát bị dừng
    audio.addEventListener("pause", function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumpAnimate.pause();
    });

    /// khi tiến độ bài hát thay đổi
    audio.addEventListener("timeupdate", function () {
      // (audio.currentTime / audio.duration) * 100: tỉ lệ của thanh progress mỗi lần update time
      if (audio.duration) {
        // audio.duration lúc đầu là NaN => thanh progress nhảy ra giữa
        // console.log(audio.seeking);
        // tính: % = htai/ tổng * 100%
        progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );

        progress.value = progressPercent;

        isClicked = false;

        /// tự động next && random
        // nếu k + 1 thì sẽ k bắt đc sự kiện ended do nhanh quá.
        if (audio.currentTime === audio.duration + 1) {
          if (!_this.isRandom) {
            _this.nextSong();
            audio.play();
          } else {
            _this.playRandomSong();
          }
        }
      }
    });

    // khi tua
    progress.addEventListener("mousedown", function (e) {
      // e.target.value -> số phần trăm
      // tìm htai = % * tổng / 100
      // audio.currentTime = (e.target.value * audio.duration) / 100;
      const width = this.clientWidth;
      const clickX = e.offsetX;
      audio.currentTime = (clickX / width) * audio.duration;
      audio.pause(); // tránh khi tua bị giật
      isHolding = true;
    });

    progress.addEventListener("mousemove", function () {
      if (isHolding) {
        audio.pause();
      }
    });

    progress.addEventListener("mouseup", function (e) {
      const width = this.clientWidth;
      const clickX = e.offsetX;
      audio.currentTime = (clickX / width) * audio.duration;
      isHolding = false;
      audio.play();
    });

    //next song
    nextBtn.addEventListener("click", function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
        audio.play(); // sau khi next thì audio bị pause
      }
      _this.activateSong();
    });

    //prev song event
    prevSong.addEventListener("click", function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
        audio.play();
      }
      _this.activateSong();
    });

    //random
    randomBtn.addEventListener("click", function (e) {
      if (!e.target) return;
      const clicked = e.target.closest(".btn-random");
      clicked.classList.toggle("active");
      if (clicked.classList.contains("active")) _this.isRandom = true;
      else _this.isRandom = false;
    });

    //repeat
    repeatBtn.addEventListener("click", function (e) {
      if (!e.target) return;
      const clicked = e.target.closest(".btn-repeat");
      clicked.classList.toggle("active");
      if (clicked.classList.contains("active")) _this.isRepeated = true;
      else _this.isRepeated = false;
    });

    audio.addEventListener("ended", function () {
      // console.log("end");
      if (_this.isRepeated) {
        audio.play();
      } else nextBtn.click(); // coi như là click vào nút next
    });

    // select song and scroll into view
    playList.addEventListener("click", function (e) {
      if (!e.target) return;
      const clickedSong = e.target.closest(".song");
      const siblings = clickedSong
        .closest(".playlist")
        .querySelectorAll(".song");

      siblings.forEach((song) => {
        if (clickedSong) {
          song.classList.remove("active");
        }
      });
      clickedSong.classList.add("active");
      const songIndex = clickedSong.getAttribute("index");
      _this.currentIndex = songIndex;
      _this.loadCurrentSong();
      audio.play();
      clickedSong.scrollIntoView({ block: "center" });
    });

    /// space to stop
    window.addEventListener("keydown", function (e) {
      if (e.code === "Space" && _this.isPlaying) {
        audio.pause();
      } else if (e.code === "Space" && !_this.isPlaying) {
        audio.play();
      }

      if (e.code === "ArrowRight") {
        audio.currentTime += 5;
      }

      if (e.code === "ArrowLeft") {
        audio.currentTime -= 5;
      }
    });
  },

  loadCurrentSong() {
    singer.innerText = `${this.currentSong.singer}`;
    heading.innerText = `${this.currentSong.name}`;

    cdThump.style.backgroundImage = `url('${this.currentSong.img}')`;

    audio.src = `${this.currentSong.path}`;

    this.songsPlayed.push(this.currentIndex);
  },
  nextSong() {
    this.currentIndex += 1;
    if (this.currentIndex >= this.songs.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong() {
    this.currentIndex -= 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong() {
    let randomNumber;
    if (this.songsPlayed.length === this.songs.length) this.songsPlayed = [];

    do {
      randomNumber = Math.floor(Math.random() * this.songs.length);
    } while (this.songsPlayed.includes(randomNumber));
    this.currentIndex = randomNumber;
    this.loadCurrentSong();
    audio.play();
  },

  // method
  start() {
    this.defineProperty();
    this.handleEvents();
    this.loadCurrentSong();
    this.renderSong();
  },
};

app.start();
