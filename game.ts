import { gsap } from "gsap";

let money: number = 100;
let moneyDisplay: HTMLElement;
let progress: number = 0;
let progressDiv: HTMLElement;
let progressDivHapiness: HTMLElement;
let progressHapiness: number = 50;
let achat: number = 0;
let scoreDiv:HTMLElement[] = new Array(); 

export function setmoney(value: number) {
  money = value;
  moneyDisplay.textContent = money + "$";
}

export function getmoney() {
  return money;
}

export function setMoneyDisplay(Div: HTMLElement) {
  moneyDisplay = Div;
}

export function redMoney() {
  moneyDisplay.style.color = "#ff0000";
  moneyDisplay.style.fontWeight = "bold";
  setTimeout(function () {
    //laisse en rouge et gras 700ms avant de repasser en normal
    moneyDisplay.style.color = "#fff";
    moneyDisplay.style.fontWeight = "normal";
  }, 700);
}

export function setProgress(value: number) {
  progress = value;
  updateProgress(progressDiv, progress);
}

export function getProgress() {
  return progress;
}

function updateProgress(Div: HTMLElement, value : number) {
  gsap.to(Div, {
    width: value + "%",
    duration: 2,
  });
}

export function setProgressHapiness(value: number) {
  progressHapiness = value;
  updateProgress(progressDivHapiness, progressHapiness);
}

export function getProgressHapiness() {
  return progressHapiness;
}

export function setProgressBarres(DivP: HTMLElement, DivH: HTMLElement){
  progressDiv = DivP;
  progressDivHapiness = DivH;
}

export function setAchat() {
  achat += 1;
}

export function reset() {
  achat = 0;
  setProgress(0)
  setProgressHapiness(50)
  setmoney(100);
  setScore();
}

export function getAchat() {
  return achat;
}

export function addScoreDiv(Div : HTMLElement){
  scoreDiv.push(Div);
}

function setScore() {
  for (let i = 0; i < scoreDiv.length; i++){
    scoreDiv[i].textContent = "0";
  }
}
