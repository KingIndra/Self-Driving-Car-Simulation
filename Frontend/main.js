const speed = document.getElementById("speed")
const score = document.getElementById("score")
const highScore = document.getElementById("highScore")

const info = document.getElementById("dis")
const bottom_info = document.getElementById("bottom-info")
const extras = document.getElementById("extras")
extras.remove()

let c_for_ai_info = 0

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
// 

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
let MINI_LIGHT = -700, MAXI_LIGHT = -800, mini_light = MINI, maxi_light = MAXI
let lastLight = generateLights()
// 

const N = 1
let cars = generateCars(N)
let bestCar = cars[0]
if(localStorage.getItem("bestBrain")) {
    for(let i=0; i<cars.length; i++) {
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"))
        if(i!=0) {
            NeuralNetwork.mutate(cars[i].brain,0.15)
        }
    }
}

// GENERATING CARS
function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"KEYS",3,0.2));
    }
    return cars;
}

// TOP DISPLAY BUTTONS FUNCTIONS
function reload() {
    // Storing car's posotion
    const currY = bestCar.y;

    // Initializing bestCar
    bestCar.damaged = false;
    bestCar.y = 100;
    bestCar.x = 100;
    bestCar.angle = 0;
    bestCar.controls.left = false;
    bestCar.controls.right = false;

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

function changeMode(mode) {
    if(c_for_ai_info%2 === 0) {
        bottom_info.appendChild(extras)
    } else {
        extras.remove()
    }
    c_for_ai_info++
    reload()
}

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

    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
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
    speed.innerHTML = bestCar.speed===0?0:bestCar.speed.toFixed(1)
    const scr = (Math.floor(bestCar.y)-100)*-1
    score.innerHTML = scr
    if(scr > highScr) {
        highScore.innerHTML = scr
        saveScr(scr)
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
    for(let i=0; i<cars.length; i++) {
        if(cars[i].damaged && cars[i]!=bestCar) {
            cars.pop(i)
        }
    }

    // <Updates End> //

    carCtx.restore();
    // console.table(traffic.length, lights.length, cars.length)
    requestAnimationFrame(animate);
}

animate();