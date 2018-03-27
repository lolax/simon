document.addEventListener("DOMContentLoaded", function(event) {
  const ctx = new AudioContext();
  let series = [];
  let userSeries = [];
  let seriesCount = 0;
  let isUserTurn = false;
  let gamesBegun = false;

  document.getElementById("one").addEventListener('click', () => pushAndCheck(1, userSeries));
  document.getElementById("two").addEventListener('click', () => pushAndCheck(2, userSeries));
  document.getElementById("three").addEventListener('click', () => pushAndCheck(3, userSeries));
  document.getElementById("four").addEventListener('click', () => pushAndCheck(4, userSeries));

  document.getElementById("start").addEventListener('click', function() {
    gamesBegun ? restart() : startRound();
  });

  function startRound() {
    gamesBegun = true;
    updateDisplay();
    document.getElementById("msg").innerText = "simon says: repeat after me";
    document.getElementById("start").innerText = "restart";
    addition();
    userTurn();
  }

  function addition() {
    series.push(Math.floor(Math.random() * Math.floor(4)) + 1);
    setTimeout(() => playSeries(), 700);
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

    idMap = {
      1: "one",
      2: "two",
      3: "three",
      4: "four"
    }

    let osc = ctx.createOscillator();
    osc.frequency.value = freqMap[el];
    osc.connect(ctx.destination);
    let currentTime = ctx.currentTime;
    osc.start(currentTime);
    lighten(idMap[el]);
    setTimeout(() => unlighten(idMap[el]), 500);
    osc.stop(currentTime + 0.5);
  }

  function lighten(id) {
    document.getElementById(id).classList.add("lighten");
  }

  function unlighten(id) {
    document.getElementById(id).classList.remove("lighten");
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
    document.getElementById("msg").innerText = "simon says: wrong move, buddy, try again!";
    playSeries();
    userTurn();
    // if (strictMode) restart round
  }

  function matchComplete() {
    if (userSeries.length === series.length) {
      if (seriesCount === 3) {
        document.getElementById("msg").innerText = "simon says: you win!";
        setTimeout(() => restart(), 3000);
      } else {
        isUserTurn = false;
        startRound();
      }
    }
  }

  function restart() {
    series = [];
    userSeries = [];
    seriesCount = 0;
    startRound();
  }
});
