const playListBtns = document.querySelectorAll(".playlist-btn");
const playlistHeader = document.querySelector(".playlist-header");

playListBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    player.classList.toggle("is-flipped");
    setTimeout(() => {
      playlistHeader.classList.toggle("active");
      cdThump.classList.toggle("active");
    }, 500);
  });
});
