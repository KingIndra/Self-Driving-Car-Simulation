const speed = document.getElementById("speed")
const score = document.getElementById("score")
const info = document.getElementById("dis")
const extras = document.getElementById("extras")
extras.remove()

const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;

const carCtx = carCanvas.getContext("2d");

const road = new Road(carCanvas.width/2,carCanvas.width*0.9);

// TRAFFIC
const traffic=[];
const TrafficCount = 0
MINI = -150, MAXI = -200, mini = MINI, maxi = MAXI;
for(let i=0; i<3; i++) {
    rco = randomCoordinates(0, 2, mini, maxi)
    traffic.push(new Car(road.getLaneCenter(i),rco.y,30,50,"DUMMY",2))
    mini = rco.y + MINI, maxi = rco.y + MAXI
}
// 

// STREET LIGHTS
const lights = []
let MINI_LIGHT = -600, MAXI_LIGHT = -1200, mini_light = MINI, maxi_light = MAXI
rco_light = randomCoordinates(0, 1, mini_light, maxi_light)
lights.push(new StreetLight(200*(rco_light.x), -50))
mini_light = rco_light.y + MINI_LIGHT, maxi_light = rco_light.y + MAXI_LIGHT
for(let i=0; i<1; i++) {
    rco_light = randomCoordinates(0, 1, mini_light, maxi_light)
    lights.push(new StreetLight(200*(rco_light.x), rco_light.y))
    mini_light = rco_light.y + MINI_LIGHT, maxi_light = rco_light.y + MAXI_LIGHT
}
let lastLight = {x:rco_light.x, y:rco_light.y}
// 

const N=1;
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"KEYS",4,0.2));
    }
    return cars;
}

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
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",false);

    // <Updates Start> //

    carCtx.save()
    speed.innerHTML = bestCar.speed===0?0:bestCar.speed.toFixed(1)
    score.innerHTML = (Math.floor(bestCar.y)-100)*-1

    // Draw Light    
    for(let i=0; i<lights.length; i++) {
        lights[i].draw(carCtx)
    }
    if(Math.abs(bestCar.y)>Math.abs(lastLight.y)) {
        rco_light = randomCoordinates(0, 1, mini_light, maxi_light)
        lights.push(new StreetLight(200*(rco_light.x), rco_light.y))
        mini_light = rco_light.y + MINI_LIGHT, maxi_light = rco_light.y + MAXI_LIGHT
        lastLight = {x:rco_light.x, y:rco_light.y}
        if(lights.length>4) {
            lights.shift()
        }
    }
    // <Updates End> //

    carCtx.restore();

    requestAnimationFrame(animate);
}