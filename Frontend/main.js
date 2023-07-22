// selecting html elements
const pauseButton = document.getElementById("pause")

const info = document.getElementById("dis")
const bottom_info = document.getElementById("bottom-info")

const playingSection = document.getElementById("playing")
const trainingSection = document.getElementById("training")
trainingSection.remove()

let speed = null
let score = null
let highScore = null

let generation = null
let scoreTraining = null
let carsCount = null

function trainingInfo() {
    generation = document.getElementById("generation")
    scoreTraining = document.getElementById("scoreTraining")
    carsCount = document.getElementById("carsCount")
}
function playingInfo() {
    speed = document.getElementById("speed")
    score = document.getElementById("score")
    highScore = document.getElementById("highScore")
}
playingInfo()
trainingInfo()

// let c_for_ai_info = 0, c_for_brain_animation = 0
// Flags
let playingFlag = true

let pause = false

// utils
function disablingCasualButtons(flag) {
    const elements = document.getElementsByClassName("disableOnTraining")
    for(let i=0; i<elements.length; i++) {
        elements[i].disabled = flag
    }
}
// 


const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;

const carCtx = carCanvas.getContext("2d");

const road = new Road(carCanvas.width/2,carCanvas.width*0.9);

// TRAFFIC
function generateTraffic() {
    shuffleArray(traverse_arr);
    for(let i=0; i<3; i++) {
        rco_traffic = randomCoordinates(0, 2, mini_traffic, maxi_traffic)
        traffic.push(new Car(road.getLaneCenter(traverse_arr[i]),rco_traffic.y,30,50,"DUMMY",2))
        mini_traffic = rco_traffic.y + MINI_TRAFFIC, maxi_traffic = rco_traffic.y + MAXI_TRAFFIC
        if(i==0) {
            firstTraffic = traffic.length-1
        }
        if(i==2) {
            lastTraffic = traffic.length-1
        }
    }
}
let traffic=[];
let firstTraffic = null, lastTraffic=null;
let MINI_TRAFFIC = -180, MAXI_TRAFFIC = -220, mini_traffic = MINI_TRAFFIC, maxi_traffic = MAXI_TRAFFIC;
let traverse_arr = [0,1,2];
generateTraffic()
// mini_traffic = traffic[lastTraffic].y


// STREET LIGHTS
function generateLights() {
    rco_light = randomCoordinates(0, 1, mini_light, maxi_light)
    lights.push(new StreetLight(200*(rco_light.x), -50))
    mini_light = rco_light.y + MINI_LIGHT, maxi_light = rco_light.y + MAXI_LIGHT
    for(let i=0; i<1; i++) {
        rco_light = randomCoordinates(0, 1, mini_light, maxi_light)
        lights.push(new StreetLight(200*(rco_light.x), rco_light.y))
        mini_light = rco_light.y + MINI_LIGHT, maxi_light = rco_light.y + MAXI_LIGHT
    }
    return {x:rco_light.x, y:rco_light.y}
}
let lights = []
let MINI_LIGHT = -800, MAXI_LIGHT = -900, mini_light = MINI, maxi_light = MAXI
let lastLight = generateLights()
// 

function usingTrainedBrain() {
    if(localStorage.getItem("bestBrain")) {
        for(let i=0; i<cars.length; i++) {
            cars[i].brain=JSON.parse(
                localStorage.getItem("bestBrain"))
            if(i!=0) {
                NeuralNetwork.mutate(cars[i].brain,0.15)
            }
        }
    }
}
const N = 1
let cars = generateCars(N, "KEYS")
let bestCar = cars[0]
usingTrainedBrain()

// GENERATING CARS
function generateCars(N,mode,speed=3){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,mode,speed,0.2));
    }
    return cars;
}

// TOP DISPLAY BUTTONS FUNCTIONS
function reload() {
    // Storing car's posotion
    const currY = bestCar.y;

    // Initializing New Car
    bestCar.repair()

    // Generating Traffic
    traffic=[];
    firstTraffic = null, lastTraffic=null;
    MINI_TRAFFIC = -180, MAXI_TRAFFIC = -220, mini_traffic = MINI_TRAFFIC, maxi_traffic = MAXI_TRAFFIC;
    traverse_arr = [0,1,2];
    generateTraffic();

    // Generating Lights
    lights = [];
    MINI_LIGHT = -700, MAXI_LIGHT = -800, mini_light = MINI, maxi_light = MAXI;
    lastLight = generateLights();

    highScr = getScr()
}

function pauseFunction() {
    pause = !pause
    if(pause) {
        pauseButton.classList.add("fa-fade")
    } else {
        pauseButton.classList.remove("fa-fade")   
    }
}

function changeMode(mode) {
    // console.log(mode)
    reload()
}

let storeBestCar = null;
document.getElementById("machineLearning").addEventListener('click', async (e) => 
{
    let button = e.target
    if(button.tagName !== "BUTTON") button = button.parentElement

    let brainEmoji = button.children[0]
    const brainAnimated = Number(brainEmoji.getAttribute("animated"))

    if(brainAnimated) {
        console.log(bestCar)
    }
    reload()

    if(brainAnimated) {
        brainEmoji.classList.remove("fa-fade")
        brainEmoji.setAttribute("animated", 0)
        // end training
        cars = []
        storeBestCar.repair()
        cars.push(storeBestCar)
        console.log("training end")
        // 
        trainingSection.remove()
        bottom_info.appendChild(playingSection)
        playingFlag = true
        playingInfo()
        disablingCasualButtons(false)
    } 
    else {
        brainEmoji.classList.add("fa-fade")
        brainEmoji.setAttribute("animated", 1)
        storeBestCar = bestCar
        playingSection.remove()
        bottom_info.appendChild(trainingSection)
        playingFlag = false
        trainingInfo()
        disablingCasualButtons(true)
        // start training
        console.log("training starts")
        let input_number_of_cars, input_speed, input_array
        pauseFunction()
        
        pauseFunction()
        cars = generateCars(200, "AI", 4)        
        bestCar = cars[0]
        usingTrainedBrain()
        //
    }
})


// Function For Saving and Deleting Brain Data
function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain))
}
function discard(){
    localStorage.removeItem("bestBrain")
}
// 

// HighScore
function saveScr(scr){
    localStorage.setItem("highScore", JSON.stringify(scr))
}
function getScr(){
    if(localStorage.getItem("highScore") === null) {
        return 0
    } else {
        return JSON.parse(localStorage.getItem("highScore"))
    }
}
let highScr = getScr()
highScore.innerHTML = highScr

function animate(){

    if(!pause) {
        for(let i=0;i<traffic.length;i++){
            traffic[i].update(road.borders,[]);
        }
        let number_of_cars = 0
        for(let i=0;i<cars.length;i++){
            cars[i].update(road.borders,traffic);
            if(!cars[i].damaged) {
                number_of_cars++
            }
        }
        traffic.push(bestCar)
        for(let i=0;i<lights.length; i++) {
            lights[i].update(traffic)
        }
        traffic.pop()
        bestCar=cars.find(
            c=>c.y==Math.min(
                ...cars.map(c=>c.y)
            ));
    
        carCanvas.height=window.innerHeight;
    
        carCtx.save();
        carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
    
        road.draw(carCtx);
        for(let i=0;i<traffic.length;i++){
            traffic[i].draw(carCtx,"red");
        }
        let last_traffic_y = traffic[lastTraffic].y, first_traffic_y = traffic[firstTraffic].y;
        if(Math.abs(bestCar.y)>Math.abs(first_traffic_y)) {
            traverse_arr = [0,1,2];
            shuffleArray(traverse_arr)
            mini_traffic = last_traffic_y + MINI_TRAFFIC, maxi_traffic = last_traffic_y + MAXI_TRAFFIC
            for(let i=0; i<3; i++) {
                rco_traffic = randomCoordinates(0, 2, mini_traffic, maxi_traffic)
                traffic.push(new Car(road.getLaneCenter(traverse_arr[i]),rco_traffic.y,30,50,"DUMMY",2))
                mini_traffic = rco_traffic.y + MINI_TRAFFIC, maxi_traffic = rco_traffic.y + MAXI_TRAFFIC
                if(i==0) firstTraffic = traffic.length-1
                if(i==2) lastTraffic = traffic.length-1
            }
            if(traffic.length>6) {
                for(let i=0; i<3; i++) {
                    traffic.shift();
                    firstTraffic--
                    lastTraffic--
                }
            }
        }
        carCtx.globalAlpha=0.2;
        for(let i=0;i<cars.length;i++){
            cars[i].draw(carCtx,"blue");
        }
        carCtx.globalAlpha=1;
        bestCar.draw(carCtx,"blue");
    
        // <Updates Start> //
        carCtx.save()
    
        if(playingFlag) {
            speed.innerHTML = bestCar.speed===0?0:bestCar.speed.toFixed(1)
            const scr = (Math.floor(bestCar.y)-100)*-1
            score.innerHTML = scr
            if(scr > highScr) {
                highScore.innerHTML = scr
                saveScr(scr)
            }
        } else {
            const scr = (Math.floor(bestCar.y)-100)*-1
            scoreTraining.innerHTML = scr
            carsCount.innerHTML = number_of_cars
            generation.innerHTML = scr%2
        }
    
        // Draw Light    
        for(let i=0; i<lights.length; i++) {
            lights[i].draw(carCtx)
        }
        if(Math.abs(bestCar.y)>Math.abs(lastLight.y)-100) {
            rco_light = randomCoordinates(0, 1, mini_light, maxi_light)
            lights.push(new StreetLight(200*(rco_light.x), rco_light.y))
            mini_light = rco_light.y + MINI_LIGHT, maxi_light = rco_light.y + MAXI_LIGHT
            lastLight = {x:rco_light.x, y:rco_light.y}
            if(lights.length>3) {
                lights.shift()
            }
        }
    
        // <Updates End> //
    
        carCtx.restore();
        // console.table(traffic.length, lights.length, cars.length)
    }
    requestAnimationFrame(animate);
}

animate();