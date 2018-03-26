document.addEventListener("DOMContentLoaded", function(event) {
  const ctx = new AudioContext();
  let series = [];
  let userSeries = [];
  let seriesCount = 0;
  let isUserTurn = false;
  let won = false;
  document.getElementById("one").addEventListener('click', () => pushAndCheck(1, userSeries));
  document.getElementById("two").addEventListener('click', () => pushAndCheck(2, userSeries));
  document.getElementById("three").addEventListener('click', () => pushAndCheck(3, userSeries));
  document.getElementById("four").addEventListener('click', () => pushAndCheck(4, userSeries));

  document.getElementById("start").addEventListener('click', function() {
    startRound();
  });

  function startRound() {
    updateDisplay();
    document.getElementById("msg").innerText = "repeat after me";
    addition();
    userTurn();
  }

  function addition() {
    series.push(Math.floor(Math.random() * Math.floor(4)) + 1);
    playSeries();
    console.log(series);
    seriesCount += 1;
    updateDisplay();
  }

  function updateDisplay() {
    document.getElementById("count").innerText = `score: ${seriesCount}`
  }

  function playSeries() {
    series.map((el, ind) => setTimeout(() => playSound(el), 500 * (ind + 1)));
  }

  function playSound(el) {
    freqMap = {
      1: 262,
      2: 330,
      3: 392,
      4: 440
    }
    let osc = ctx.createOscillator();
    osc.frequency.value = freqMap[el];
    osc.connect(ctx.destination);
    let currentTime = ctx.currentTime;
    osc.start(currentTime);
    osc.stop(currentTime + 0.5);
  }

  function userTurn() {
    userSeries = [];
    isUserTurn = true;
  }

  function pushAndCheck(num, userSeries) {
    if (isUserTurn) {
      playSound(num);
      userSeries.push(num);
      let seriesMatch = userSeries.every((el, ind) => el === series[ind]);
      seriesMatch ? matchComplete() : wrongMove();
    }
  }

  function wrongMove() {
    playSeries();
    userTurn();
    // if (strictMode) restart round
  }

  function matchComplete() {
    if (userSeries.length === series.length) {
      if (isWon()) {
        document.getElementById("msg").innerText = "you win!";
        setTimeout(() => restart(), 3000);
      } else {
        isUserTurn = false;
        startRound();
      }
    }
  }

  function isWon() {
    if (seriesCount === 3) {
      won = true;
      console.log(won);
    } else {
      won = false;
      console.log(won);
    }
    return won;
  }

  function restart() {
    series = [];
    userSeries = [];
    seriesCount = 0;
    startRound();
  }
});
