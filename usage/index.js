const beep = require("./audio/beep.mp3");
const boop = require("./audio/boop.wav");

const playBeep = () => {
  setTimeout(() => {
    beep.play();
    playBoop();
  }, 1500);
};

const playBoop = () => {
  setTimeout(() => {
    boop.play();
    playBeep();
  }, 1500);
};
playBeep();
