// DOM Elements
const canvas = document.getElementById("themeCanvas");
const ctx = canvas.getContext("2d");
const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const workInput = document.getElementById("workDuration");
const breakInput = document.getElementById("breakDuration");
const themeSelect = document.getElementById("themeSelect");
const quoteDisplay = document.getElementById("quoteDisplay");
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => menu.classList.toggle("show"));

// Timer variables
let totalSeconds = parseInt(workInput.value) * 60;
let timer = null;
let isRunning = false;
let isWorkSession = true;

// Update timer display
function updateTimerDisplay() {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

// Quotes
function setQuote(start=true){
  if(start){
    quoteDisplay.textContent = "“Focus on your goals, one step at a time.”";
  } else {
    quoteDisplay.textContent = "“Great job! Take a breath and refresh.”";
  }
}

// Start timer
function startTimer(){
  if(!isRunning){
    isRunning = true;
    setQuote(true);
    timer = setInterval(() => {
      totalSeconds--;
      if(totalSeconds < 0){
        clearInterval(timer);
        isRunning = false;
        isWorkSession = !isWorkSession;
        totalSeconds = (isWorkSession ? parseInt(workInput.value) : parseInt(breakInput.value)) * 60;
        setQuote(false);
        startTimer(); // auto start next session
      }
      updateTimerDisplay();
    },1000);
  }
}

// Pause timer
function pauseTimer(){
  isRunning = false;
  clearInterval(timer);
}

// Reset timer
function resetTimer(){
  pauseTimer();
  totalSeconds = (isWorkSession ? parseInt(workInput.value) : parseInt(breakInput.value)) * 60;
  updateTimerDisplay();
  setQuote(true);
}

// Event Listeners
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
workInput.addEventListener("change", resetTimer);
breakInput.addEventListener("change", resetTimer);
themeSelect.addEventListener("change", drawTheme);

// THEMES
function drawTheme(){
  const progress = 1 - totalSeconds / (isWorkSession ? workInput.value*60 : breakInput.value*60);
  switch(themeSelect.value){
    case "luna": drawLunaTheme(progress); break;
    case "nature": drawNatureTheme(progress); break;
    case "dreamy": drawDreamyTheme(progress); break;
    case "warm": drawWarmTheme(progress); break;
  }
  requestAnimationFrame(drawTheme);
}

// LUNA Theme
function drawLunaTheme(progress){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let bgGrad = ctx.createRadialGradient(125,125,0,125,125,200);
  bgGrad.addColorStop(0,"#0a0a1a");
  bgGrad.addColorStop(1,"#000");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  let moonGrad = ctx.createRadialGradient(125,125,0,125,125,100);
  moonGrad.addColorStop(0,"rgba(255,255,255,"+(progress*0.8)+")");
  moonGrad.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle = moonGrad;
  ctx.beginPath();
  ctx.arc(125,125,100,0,2*Math.PI);
  ctx.fill();

  for(let i=0;i<30;i++){
    let x=Math.random()*250, y=Math.random()*250;
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.arc(x,y,Math.random()*2,0,2*Math.PI);
    ctx.fill();
  }
}

// NATURE Theme
function drawNatureTheme(progress){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#e8f5e9";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="#388e3c";
  ctx.fillRect(123,125,4,-100*progress);

  ctx.fillStyle="#f48fb1";
  ctx.beginPath();
  let petalSize = 30*progress;
  ctx.arc(125,125-100*progress,petalSize,0,2*Math.PI);
  ctx.fill();
}

// DREAMY Theme
function drawDreamyTheme(progress){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let pulse = 0.5+0.5*Math.sin(Date.now()/500);
  let gradient = ctx.createRadialGradient(125,125,0,125,125,100);
  gradient.addColorStop(0,"rgba(200,150,255,"+(progress*pulse)+")");
  gradient.addColorStop(1,"rgba(200,150,255,0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(125,125,100*progress,0,2*Math.PI);
  ctx.fill();
}

// WARM Theme
function drawWarmTheme(progress){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#fff3e0";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  let jitter = Math.random()*5;
  let gradient = ctx.createRadialGradient(125,125,0,125,125,50+50*progress+jitter);
  gradient.addColorStop(0,"rgba(255,200,50,"+progress+")");
  gradient.addColorStop(1,"rgba(255,50,0,0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(125,125,50+50*progress+jitter,0,2*Math.PI);
  ctx.fill();
}

// Initialize
updateTimerDisplay();
drawTheme();
