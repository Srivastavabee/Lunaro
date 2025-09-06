// Timer & DOM Elements
const startBtn=document.getElementById('startBtn');
const pauseBtn=document.getElementById('pauseBtn');
const resetBtn=document.getElementById('resetBtn');
const timerDisplay=document.getElementById('timerDisplay');
const themeSelect=document.getElementById('themeSelect');
const workDurationInput=document.getElementById('workDuration');
const breakDurationInput=document.getElementById('breakDuration');
const workTime=document.getElementById('workTime');
const breakTime=document.getElementById('breakTime');
const quote=document.getElementById('quote');
const soundSelect=document.getElementById('soundSelect');
const noiseSelect=document.getElementById('noiseSelect');
const ambientAudio=document.getElementById('ambientAudio');
const canvas=document.getElementById('themeCanvas');
const ctx=canvas.getContext('2d');
const hamburger=document.getElementById('hamburger');
const menu=document.getElementById('menu');

let timer, totalSeconds=parseInt(workDurationInput.value)*60, isRunning=false;
const startQuotes=["Start your day with focus!","Every small step counts!","Focus. Breathe. Achieve."];
const endQuotes=["Well done! Take a break.","Great work!","Focus pays off!"];

// Hamburger menu
hamburger.addEventListener('click',()=>{ menu.style.display = menu.style.display==='block'?'none':'block'; });

// Work/break sliders
workDurationInput.addEventListener('input',()=>{
  workTime.textContent=workDurationInput.value;
  totalSeconds=parseInt(workDurationInput.value)*60;
  updateTimerDisplay();
});
breakDurationInput.addEventListener('input',()=>{ breakTime.textContent=breakDurationInput.value; });

// Ambient sound
function playAmbientSound(){ 
  let sound=soundSelect.value;
  ambientAudio.src=`assets/${sound}.mp3`;
  ambientAudio.play();
}

// Noise generator
let audioCtx=new (window.AudioContext||window.webkitAudioContext)();
let noiseSource; let gainNode=audioCtx.createGain(); gainNode.connect(audioCtx.destination);
function createNoise(type){
  if(noiseSource) noiseSource.stop();
  let bufferSize=2*audioCtx.sampleRate;
  let buffer=audioCtx.createBuffer(1,bufferSize,audioCtx.sampleRate);
  let output=buffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++){
    if(type==='white') output[i]=Math.random()*2-1;
    if(type==='pink') output[i]=(Math.random()+Math.random()+Math.random()+Math.random()-2)/4;
    if(type==='brown') output[i]=i===0?Math.random()*2-1:(output[i-1]+(Math.random()*2-1))/1.02;
  }
  noiseSource=audioCtx.createBufferSource();
  noiseSource.buffer=buffer;
  noiseSource.loop=true;
  noiseSource.connect(gainNode);
  noiseSource.start();
}
noiseSelect.addEventListener('change',()=>createNoise(noiseSelect.value));

// Timer functions
function updateTimerDisplay(){
  let m=Math.floor(totalSeconds/60).toString().padStart(2,'0');
  let s=(totalSeconds%60).toString().padStart(2,'0');
  timerDisplay.textContent=`${m}:${s}`;
}
function startTimer(){
  if(isRunning) return;
  isRunning=true;
  if(audioCtx.state==='suspended') audioCtx.resume();
  playAmbientSound();
  createNoise(noiseSelect.value);
  quote.textContent=startQuotes[Math.floor(Math.random()*startQuotes.length)];
  timer=setInterval(()=>{
    if(totalSeconds>0){ totalSeconds--; updateTimerDisplay(); drawTheme(); }
    else{ clearInterval(timer); isRunning=false; quote.textContent=endQuotes[Math.floor(Math.random()*endQuotes.length)]; }
  },1000);
}
function pauseTimer(){ clearInterval(timer); isRunning=false; }
function resetTimer(){ clearInterval(timer); isRunning=false; totalSeconds=parseInt(workDurationInput.value)*60; updateTimerDisplay(); ambientAudio.pause(); }

// Canvas Animations
function drawTheme(){
  let progress=1-totalSeconds/(parseInt(workDurationInput.value)*60);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  switch(themeSelect.value){
    case 'luna':
      ctx.fillStyle='rgba(200,200,255,0.2)'; ctx.beginPath();
      ctx.arc(125,125,100*progress,0,2*Math.PI); ctx.fill();
      ctx.fillStyle='#444'; ctx.beginPath();
      ctx.arc(125,125,100,Math.PI*0.5,Math.PI*(0.5+progress*2),false); ctx.fill();
      break;
    case 'nature':
      ctx.fillStyle='green'; ctx.fillRect(120,125,10,-100*progress);
      ctx.fillStyle='pink'; ctx.beginPath(); ctx.arc(125,125-100*progress,25*progress,0,2*Math.PI); ctx.fill();
      break;
    case 'dreamy':
      ctx.fillStyle=`rgba(255,100,255,${progress})`; ctx.beginPath();
      ctx.arc(125,125,100*progress,0,2*Math.PI); ctx.fill();
      break;
    case 'warm':
      ctx.fillStyle=`rgba(255,150,50,${progress})`; ctx.beginPath();
      ctx.arc(125,125,100*progress,0,2*Math.PI); ctx.fill();
      break;
  }
}

// Button events
startBtn.addEventListener('click',startTimer);
pauseBtn.addEventListener('click',pauseTimer);
resetBtn.addEventListener('click',resetTimer);

updateTimerDisplay(); drawTheme();
function drawTheme(){
  let progress=1-totalSeconds/(parseInt(workDurationInput.value)*60);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  switch(themeSelect.value){
    case 'luna':
      ctx.fillStyle='rgba(200,200,255,0.2)';
      ctx.beginPath();
      ctx.arc(125,125,100*progress,0,2*Math.PI);
      ctx.fill();
      ctx.fillStyle='#444';
      ctx.beginPath();
      ctx.arc(125,125,100,0,2*Math.PI*progress);
      ctx.fill();
      break;
    case 'nature':
      ctx.fillStyle='green';
      ctx.fillRect(120,125,10,-100*progress);
      ctx.fillStyle='pink';
      ctx.beginPath();
      ctx.arc(125,125-100*progress,25*progress,0,2*Math.PI);
      ctx.fill();
      break;
    case 'dreamy':
      ctx.fillStyle=`rgba(255,100,255,${progress})`;
      ctx.beginPath();
      ctx.arc(125,125,100*progress,0,2*Math.PI);
      ctx.fill();
      break;
    case 'warm':
      ctx.fillStyle=`rgba(255,150,50,${progress})`;
      ctx.beginPath();
      ctx.arc(125,125,100*progress,0,2*Math.PI);
      ctx.fill();
      break;
  }
}
