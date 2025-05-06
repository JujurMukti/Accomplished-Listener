const grid = document.getElementById('locationGrid');
const submitBtn = document.getElementById('submit');
const popup = document.getElementById('popup');

const soundCorrect = document.getElementById("sound-correct");
const soundIncorrect = document.getElementById("sound-incorrect");
const soundGameOver = document.getElementById("sound-gameover");
const audios = [document.getElementById('audio1'), document.getElementById('audio2'), document.getElementById('audio3')];

const maxSelection = 3;
const correctAnswers = [1, 10, 12];

let selected = [];
let answer = [];
let attemptsLeft = 5;
let playPopup = false;
let waitAnimation = false;

function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.volume = 1;
  sound.play();
}

function toggleSelection(button) {
  const value = button;
  const getIdx = parseInt(button.dataset.x);
  if (selected.includes(value)) {
    selected = selected.filter(item => item !== value);
    answer = answer.filter(item => item !== getIdx);
    button.classList.remove('selected', 'red-flash');
  } else if (selected.length < maxSelection) {
    selected.push(value);
    answer.push(getIdx);
    button.classList.add('selected');
  } else {
     if (!waitAnimation) {
     waitAnimation = true;
     selected.forEach(item => {
       item.classList.add('red-flash');
     })
     setTimeout(() => {
       selected.forEach(item => {
         item.classList.remove('red-flash');
       })
       waitAnimation = false;
     }, 300);
   }
  }
  submitBtn.disabled = selected.length !== maxSelection;
}

function updateAttemptsDisplay() {
  const attemptsEl = document.getElementById("attempts");
  attemptsEl.innerHTML = `<strong id="heart" style="color: ${attemptsLeft > 1 ? '#4CAF50' : 'red'}">${attemptsLeft}</strong> Attempt${attemptsLeft !== 1 ? 's' : ''} Remaining`;
}

function showPopup(message, isSuccess) {
  playPopup = true;
  popup.classList.remove('try-again');
  popup.innerHTML = `<div class="popup-box">${message}</div>`;
  popup.style.backgroundColor = isSuccess ? 'rgba(47, 255, 0, 0.6)' : 'rgba(244, 37, 37, 0.6)';
  popup.classList.add('show');
  if (!isSuccess && message !== "GAME OVER!") {
    setTimeout(() => {
      popup.classList.remove('show');
      playPopup = false;
    }, 2000);
  }
}

submitBtn.addEventListener('click', () => {
  if (!playPopup ) {
  const isCorrect = answer.every(sel => correctAnswers.includes(sel));
  if (attemptsLeft <= 1) {
    showPopup("GAME OVER!", isCorrect);
    playSound(soundGameOver);
    document.querySelectorAll('.audio-container audio' ).forEach(audio => {
      audio.pause();
    });
  } else {
    showPopup(isCorrect ? "CORRECT!" : "TRY AGAIN!", isCorrect);
    isCorrect ? playSound(soundCorrect) : playSound(soundIncorrect);
  }

  if (!isCorrect) {
    attemptsLeft--;
    updateAttemptsDisplay();
  }
}
});

for (let i = 1; i <= 15; i++) {
  const btn = document.createElement('button');
  btn.innerText = `Location ${i}`;
  btn.dataset.x = i;
  btn.addEventListener('click', () => toggleSelection(btn));
  grid.appendChild(btn);
}

audios.forEach((audio, idx) => {
  audio.addEventListener('play', () => {
    audios.forEach((otherAudio, i) => {
      if (i !== idx && !otherAudio.paused) {
        otherAudio.pause();
      }
    });
  });
});
