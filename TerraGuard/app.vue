<template>
  <div id="title">
    <img src="./assets/Images/earth.png" alt="" />
    <h1>TerraGuard Idle</h1>
  </div>

  <div id="rightContent">
    <div id="progressBarPollution">
      <div id="progressP"></div>
      <div class="text">Pollution</div>
    </div>
    <div id="progressBarHappiness">
      <div id="progressH"></div>
      <div class="text">Happiness</div>
    </div>
    <div id="chronometerDiv">
      <p>
        Temps écoulé : <span id="chronometer">00:00:00</span>
      </p>
    </div>
    <div id="moneyDiv">
      <p>Argent : <span id="money">100$</span></p>
    </div>
  </div>

  <div id="leftContent">
    <div id="regles">
      <h2>Règles</h2>
      <ul>
        <li>
          L'achat d'un des éléments des colonnes de gauche coûte 100$
        </li>
        <li>
          L'achat d'un article de la colonne de droite coûte 10 éléments <br>de la colonne de gauche et 50$
        </li>
        <li>L'achat d'un élément de gauche augmente de 1% le niveau de pollution</li>
        <li>L'achat d'un élément de droite baisse de 5% le niveau de pollution et <br>augmente de 3% le niveau de joie
        </li>
        <li>Si la barre de pollution atteint les 100%, vous <span style="color: red; font-weight: bold;">perdez</span>
          la
          partie</li>
        <li>Si la barre de joie atteint les 100%, vous <span style="color: green; font-weight: bold;">gagnez</span> la
          partie</li>
      </ul>
      <p>La Terre compte sur vous !
      </p>
    </div>
  </div>

  <div id="elements">
    <elements v-for="categorie in categories" :nomCat="categorie.nomCat" :elementsListe="categorie.elementsListe" />
  </div>

  <div ref="winCalc" id="winCalc">
    <div id="win">
      <h2>Victoire !</h2>
      <p>Félicitations ! Vous avez sauvé la planète et ses habitants en sont ravis !</p>
      <p>Durée de la partie : <span ref="temps"></span></p>
      <p>Nombre d'achats effectués : <span ref="achats"></span></p>
      <button @click="rejouer">Rejouer</button>
    </div>
  </div>

  <div ref="overCalc" id="overCalc">
    <div id="over">
      <h2>Défaite :(</h2>
      <p>La Terre est devenue inhabitable et tout le monde est mort 😬</p>
      <p>Durée de la partie : <span ref="temps"></span></p>
      <p>Nombre d'achats effectués : <span ref="achats"></span></p>
      <button @click="rejouer">Rejouer</button>
    </div>
  </div>

  <canvas class="webgl"></canvas>
</template>

<style lang="scss">
#title {
  padding: 1vw;
  width: 15vw;
  height: fit-content;
  position: absolute;
  color: #aa7945;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: "EarthFont";

  img {
    height: 5vh;
  }

  h1 {
    margin: 0;
    font-size: 53px;
    font-weight: normal;
  }
}

#rightContent {
  position: absolute;
  right: 6vw;
  top: 35vh;
  width: fit-content;
  height: 100%;
  display: flex;
  flex-direction: column;

  #progressBarPollution,
  #progressBarHappiness {
    margin: 1vw;
    width: 300px;
    height: 22px;
    background-color: lightgray;
    margin-bottom: 10px;
    overflow: hidden;
    border-radius: 11px;
    position: relative;
  }

  #progressBarPollution {
    #progressP {
      width: 0%;
      height: 100%;
      background-color: red;
    }
  }

  #progressBarHappiness {
    #progressH {
      width: 50%;
      height: 100%;
      background-color: green;
    }
  }

  #chronometerDiv,
  #moneyDiv {
    color: #fff;
    margin: 0 1vw 0 1vw;
  }
}

.text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
  font-weight: bold;
}

#leftContent {
  position: absolute;
  left: 2vw;
  top: 28vh;
  width: fit-content;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #fff;

  #regles {
    height: fit-content;
    border: solid 1px white;
    border-radius: 20px;
    background-color: rgba(0, 0, 0, 0.11);
    padding: 0 1vw 1vw 1vw;

    li {
      font-size: 16px;
    }

    p {
      color: #aa7945;
    }
  }
}

#winCalc,
#overCalc {
  color: #fff;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #000000d8;
  display: none;

  #win,
  #over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: solid white 1px;
    padding: 2vw;
    border-radius: 20px;
    background-color: #000000cb;

    h2 {
      text-align: center;
      font-family: "EarthFont";
      font-size: 7em;
      font-weight: normal;
      margin: 0;
    }

    p {
      font-size: 1.5em;
    }
  }
}

#elements {
  position: absolute;
  color: #fff;
  bottom: 0;
  padding: 1vw;
  width: 98vw;
  display: flex;
  justify-content: space-between;
}
</style>

<script setup>
import elements from "~/components/elements.vue";
import * as THREE from "three";
import { setMoneyDisplay, setmoney, getmoney, setProgress, getProgress, setProgressHapiness, getProgressHapiness, getAchat, reset, setProgressBarres } from "./game"

const categories = [
  {
    nomCat: "energies",
    elementsListe: [
      {
        statut: "bad",
        nom: "Centrale à charbon",
      },
      {
        statut: "bad",
        nom: "Raffinerie de pétrole",
      },
      {
        statut: "bad",
        nom: "Usine à gaz",
      },
      {
        statut: "bad",
        nom: "Centrale nucléaire",
      },
      {
        statut: "good",
        nom: "Géothermie",
      },
      {
        statut: "good",
        nom: "Energie éolienne",
      },
      {
        statut: "good",
        nom: "Energie hydraulique",
      },
      {
        statut: "good",
        nom: "Energie solaire",
      },
    ],
  },
  {
    nomCat: "transports",
    elementsListe: [
      {
        statut: "bad",
        nom: "Voiture",
      },
      {
        statut: "bad",
        nom: "Moto",
      },
      {
        statut: "bad",
        nom: "Avion",
      },
      {
        statut: "bad",
        nom: "Navire de transport",
      },
      {
        statut: "good",
        nom: "Transport en commun",
      },
      {
        statut: "good",
        nom: "Vélo",
      },
      {
        statut: "good",
        nom: "Train",
      },
      {
        statut: "good",
        nom: "Voilier cargo",
      },
    ],
  },
  {
    nomCat: "lifestyle",
    elementsListe: [
      {
        statut: "bad",
        nom: "Consommer fastfood",
      },
      {
        statut: "bad",
        nom: "Fast-fashion",
      },
      {
        statut: "bad",
        nom: "Jeter par terre",
      },
      {
        statut: "bad",
        nom: "Commander en ligne",
      },
      {
        statut: "good",
        nom: "Manger bio et éco-responsable",
      },
      {
        statut: "good",
        nom: "Mode éthique et durable",
      },
      {
        statut: "good",
        nom: "Recycler et trier",
      },
      {
        statut: "good",
        nom: "Favoriser le local et fait main",
      },
    ],
  },
];

let intervalH, intervalP, temps = ref(), achats = ref(), winCalc = ref(), overCalc = ref(), hours, minutes, seconds;

onMounted(() => {
  createThree();
  progBar();
  chrono();
});


/**
 * Gère la progression des deux barres en fonction de différents paramètres
 */
const progBar = () => {
  const progressBarPolution = document.getElementById('progressP');
  const progressBarHappiness = document.getElementById('progressH');
  setProgressBarres(progressBarPolution, progressBarHappiness);

  intervalH = setInterval(() => {
    if (getProgress() > 60) {
      setProgressHapiness(getProgressHapiness() - 1)
    }

    if (getProgress() < 15 && getProgressHapiness() <= 100 && getAchat >= 50) {
      setProgressHapiness(getProgressHapiness() + 1)
    }
  }, 1000)

  intervalP = setInterval(() => {
    if (getAchat() >= 50) {
      setProgress(getProgress() + 1)
    }
  }, 2000)
}

const chrono = () => {
  let
    chronometerDisplay = document.getElementById('chronometer');
  setMoneyDisplay(document.getElementById('money'));
  hours = `00`; minutes = `00`; seconds = `00`;
  chronometerDisplay.textContent = `${hours}:${minutes}:${seconds}`

  const interval = setInterval(() => {
    if (getProgress() >= 100) {
      clearInterval(interval);
      clearInterval(intervalP);
      clearInterval(intervalH);
      gameOver();
    } else if (getProgressHapiness() >= 100) {
      clearInterval(interval);
      clearInterval(intervalP);
      clearInterval(intervalH);
      gameWin();
    } else {
      if (getAchat() != 0) {
        seconds++
        if (getAchat() > 50)
          setmoney(getmoney() + getAchat() * 2)
        else setmoney(getmoney() + 100)

        if (seconds < 10) seconds = `0` + seconds

        if (seconds > 59) {
          seconds = `00`
          minutes++

          if (minutes < 10) minutes = `0` + minutes
        }

        if (minutes > 59) {
          minutes = `00`
          hours++

          if (hours < 10) hours = `0` + hours
        }
        chronometerDisplay.textContent = `${hours}:${minutes}:${seconds}`
      }
    }
  }, 1000);
}

const gameOver = () => {
  overCalc.value.style.display = "block"
  temps.value.textContent = `${hours}:${minutes}:${seconds}`;
  achats.value.textContent = getAchat()
}

const gameWin = () => {
  winCalc.value.style.display = "block"
  temps.value.textContent = `${hours}:${minutes}:${seconds}`;
  achats.value.textContent = getAchat()
}

const rejouer = () => {
  reset()
  progBar();
  chrono();
  winCalc.value.style.display = "none"
  overCalc.value.style.display = "none"
}


const createThree = () => {
  const scene = new THREE.Scene();
  const textureLoader = new THREE.TextureLoader();

  const earthMap = textureLoader.load("/Textures/Earth/earth.jpg");
  const earthNormal = textureLoader.load("/Textures/Earth/earth_normal.jpg");
  const earthBump = textureLoader.load(
    "/Textures/Earth/earth_displacement.jpg"
  );

  const particlesTexture = textureLoader.load("/Textures/Particles/star.png");

  // Sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.y = -1;
  camera.position.z = 17;
  scene.add(camera);

  // Renderer
  const canvas = document.querySelector("canvas.webgl");

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.56);
  scene.add(ambientLight);
  // gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
  const directionalLight = new THREE.DirectionalLight(0xfca20c, 2.5);
  directionalLight.position.set(-2, 2, 1);
  scene.add(directionalLight);

  /**
   * Earth
   */
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 16),
    new THREE.MeshPhongMaterial({
      map: earthMap,
      normalMap: earthNormal,
      displacementMap: earthBump,
      displacementScale: 0.5,
    })
  );
  scene.add(sphere);

  /**
   * Particles
   */
  const starsGeometry = new THREE.BufferGeometry(1, 32, 32);
  const starsCount = 3000;
  const positions = new Float32Array(starsCount * 3);

  for (let i = 0; i < starsCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100;
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  // Material
  const starColor = new THREE.Color(0xfff3c9);
  const starsMaterial = new THREE.PointsMaterial({
    size: 0.35,
    transparent: true,
    alphaMap: particlesTexture,
    depthWrite: false,
    color: starColor,
  });

  // Points
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  /**
   * Animate
   */
  const clock = new THREE.Clock();
  let previousTime = 0;

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    // const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime;

    sphere.rotation.y = elapsedTime * 0.1;
    stars.rotation.y = -elapsedTime * 0.025;

    // Update controls
    // controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
};
</script>