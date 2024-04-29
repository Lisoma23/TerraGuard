<template>
  <div :id="nomCat">
    <div id="bad">
      <template v-for="(element, index) in elementsListe">
        <p :id="element.statut + index" v-if="element.statut == 'bad'" @click="levelUpBad($event)">
          {{ element.nom }} <span id="score">0</span>/100
        </p>
      </template>
    </div>
    <div id="good">
      <template v-for="(element, index) in elementsListe">
        <p :id="element.statut + (index - 4)" v-if="element.statut == 'good'" @click="levelUpGood($event)">
          {{ element.nom }} <span id="score">0</span>/10
        </p>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nomCat: {
      type: String,
      required: true,
    },
    elementsListe: {
      type: Array,
      required: true,
    },
  },
};
</script>

<script setup>
import { setmoney, getmoney, redMoney, setProgress, getProgress, setProgressHapiness, getProgressHapiness, setAchat, addScoreDiv } from "../game"

const levelUpGood = (event) => {
  let scoreElementGood;
  if (event.target.id == "score") {
    scoreElementGood = event.target;
  } else {
    scoreElementGood = event.target.querySelector("#score");
  }
  const pIdGood = scoreElementGood.parentElement.id; //recupere l'id de l'element good sur lequel on clique
  const lastCharacter = pIdGood.slice(-1); //recupere le dernier caractere de l'id (pour trouver le bad correspondant)
  const goodParent = scoreElementGood.parentElement.parentElement.parentElement; //récupère la div de la catégorie
  let scoreGood = parseInt(scoreElementGood.textContent); //récupère le score en int du good

  const badElement = goodParent.querySelector("#bad" + lastCharacter); //récupère l'élement bad correspondant dans la catégorie
  const scoreElementBad = badElement.querySelector("#score"); //récupères la balise span du bad
  let scoreBad = parseInt(scoreElementBad.textContent); //score en int du bad

  if (scoreBad >= 10 && scoreGood != 10 && getmoney() >= 50) {
    //update les scores
    scoreGood += 1;
    scoreElementGood.textContent = scoreGood;
    scoreBad -= 10;
    addScoreDiv(scoreElementGood);
    setmoney(getmoney() - 50) //retire la somme dépenser pour acheter l'élément
    setProgress(getProgress() - 5) //retire un peu de pollution
    setProgressHapiness(getProgressHapiness() + 3) //améliore l'hapiness car on améliore la condition de vie
    scoreElementBad.textContent = scoreBad;
    scoreElementBad.style.color = "#00ff00";
    scoreElementBad.style.fontWeight = "bold";
    setTimeout(function () { //laisse en vert et gras 700ms avant de repasser en normal
      scoreElementBad.style.color = "#fff";
      scoreElementBad.style.fontWeight = "normal";
    }, 700);
  } else if (scoreBad < 10 && scoreGood < 10) {
    scoreElementBad.style.color = "#ff0000";
    scoreElementBad.style.fontWeight = "bold";
    setTimeout(function () { //laisse en rouge et gras 700ms avant de repasser en normal
      scoreElementBad.style.color = "#fff";
      scoreElementBad.style.fontWeight = "normal";
    }, 700);
  } else if (getmoney() < 50) {
    redMoney(); //rappel au joueur qu'il n'a pas assez
  }
};

const levelUpBad = (event) => {
  //augmente le nombre d'unité que possède l'élément
  let scoreElement;
  if (event.target.id == "score") {
    scoreElement = event.target;
  } else {
    scoreElement = event.target.querySelector("#score");
  }
  if (getmoney() >= 100) {
    addScoreDiv(scoreElement);
    setAchat();
    setmoney(getmoney() - 100) //retire la somme dépenser pour acheter l'élément
    let score = parseInt(scoreElement.textContent);
    if (score != 100) {
      score += 1;
      scoreElement.textContent = score;
    }
    setProgress(getProgress() + 1) //augmente la valeur de la barre de pollution
  } else {
    redMoney(); //indique au joueur qu'il n'a pas assez d'argent
  }

};
</script>