const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = 1300;
canvas.width = 1200;

//person img
let img = new Image();
img.src = 'person.png';
img.alt = 'alt';
//exit
let exit = new Image();
exit.src = 'exit.png';
exit.alt = 'alt';

// directional Arrow images
let upArrow = new Image();
upArrow.src = 'up.png';
upArrow.alt = 'alt';

let downArrow = new Image();
downArrow.src = 'downArrow.png';
downArrow.alt = 'alt';
//clouds
let cloud = new Image();
cloud.src = 'cloud.png';
cloud.alt = 'alt';
//car
// let car1 = new Image();
// car1.src = 'car1.png';
// car1.alt = 'alt';

// let car2 = new Image();
// car2.src = 'car2.png';
// car2.alt = 'alt';

// let car3 = new Image();
// car3.src = 'car3.png';
// car3.alt = 'alt';

let increaseSpeed = document.getElementById('speedUp');
let decreaseSpeed = document.getElementById('speedDown')
let startButton = document.getElementById('start')
let speed = 1;
let timerThresh = 120 - (20 * speed);
let maxPeople = 0;
// classes


class Floor {
    constructor(number){
        this.number = number;
        this.yLoc = 1180 - (number * 100);
        this.droppedOff = 0;
    }
    createFloor(){
        ctx.fillStyle = 'lightgrey';
        ctx.fillRect( 502,this.yLoc, 494, 100);

        ctx.beginPath();
        ctx.moveTo(502, this.yLoc);
        ctx.lineTo(996, this.yLoc);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(502, this.yLoc+1);
        ctx.lineTo(996, this.yLoc +1);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
}


class Person {
    constructor(startFloor,targetFloor) {
        this.startFloor = startFloor;
        this.targetFloor = targetFloor;
        this.xlocation = 970;
        this.yStart = 1180 - (startFloor * 100)
        this.yTarget = 1180 - (targetFloor * 100);
     }
     getDirection(){
        if(this.targetFloor>this.startFloor){
            return 'up';
        }
        else {
            return 'down'; 
        }
    }
     drawPerson(){
        ctx.drawImage(img, this.xlocation, (this.yStart+60),20,40);
        if(this.getDirection() == 'up'){
            ctx.drawImage(upArrow, this.xlocation-5, this.yStart+60, 10,10);
        }
        else{
            ctx.drawImage(downArrow, this.xlocation-5, this.yStart+60, 10,10);
        }
     }

}


let elevator = {
    timer: 0,
    state : 'checking',
    direction : 'idle',
    currentFloor : 0,
    yLoc : 1180,
    passengers : {},
    numPassengers: 0,
    target: null
}


// Building 
let floors = [];
function drawBase() {

// clouds
ctx.drawImage(cloud, 50, 20, 400,200);
ctx.drawImage(cloud, 200, 10, 400,200);
ctx.drawImage(cloud, 400, 20, 400,200);
ctx.drawImage(cloud, 600, 20, 400,200);
ctx.drawImage(cloud, 700, 10, 400,200);
ctx.drawImage(cloud, 900, 20, 400,200);
// road 
ctx.fillStyle = " #3A3B3C";
ctx.fillRect(0, 1280, 500, 20);
ctx.fillStyle = "green";
ctx.fillRect(1080, 1280, 200, 20);
//cars
// ctx.drawImage(car1,300,1220,100,60);
// ctx.drawImage(car2,175,1220,100,60);
// ctx.drawImage(car3,50,1220,100,60);
// building
ctx.fillStyle = "black";
ctx.fillRect(500, 278, 600, 1080);

ctx.beginPath();
ctx.moveTo(1000, 278);
ctx.lineTo(1000, 1280);
ctx.strokeStyle = "white";
ctx.stroke();

// Elevator Shaft

ctx.beginPath();
ctx.moveTo(1050, 278);
ctx.lineTo(1050, 1280);
ctx.strokeStyle = "grey";
ctx.stroke();

// ctx.fillStyle = 'orange';
// ctx.fillRect(1002 , eleYLoc, 97, 100);

// floors 
// ground
// ctx.fillStyle = 'lightgrey';
// ctx.fillRect( 502, 1180, 494, 100);

ctx.beginPath();
ctx.moveTo(502, 1180);
ctx.lineTo(996, 1180);
ctx.strokeStyle = "black";
ctx.stroke();

ctx.beginPath();
ctx.moveTo(502, 1181);
ctx.lineTo(996, 1181);
ctx.strokeStyle = "black";
ctx.stroke();

// Buttons 


function addFloors() {
    for( i = 0; i < 10; i++){
        let floor = new Floor(i);
        floor.createFloor();
        floors.push(floor);

    }
};
addFloors();
}
drawBase();
function clear(){
    maxPeople = 0; 
    for(let floor of floors){
        floor.droppedOff = 0;
    }
}

// Start 

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function getRandomMinMax(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let waiting = {};


function generate() {
    
    
      
    setTimeout(() => {
        
        let person = new Person(getRandomInt(9), getRandomInt(9));
        while(person.startFloor == person.targetFloor){
            person.targetFloor = getRandomInt(9);
        }
        if(waiting[person.startFloor] == undefined){
            waiting[person.startFloor] = [];
            waiting[person.startFloor].push(person);
        }
        else {
            waiting[person.startFloor].push(person);
        }
        if (elevator.numPassengers == 0){
            checkTarget(person);    
        }
        maxPeople += 1
        if(maxPeople<10){        
            generate();

        }
        
             
    },getRandomMinMax(1000,4000));



}

startButton.onclick = function() {
    clear();
    let intial = new Person(getRandomInt(9), getRandomInt(9));
    waiting[intial.startFloor] = [];
    waiting[intial.startFloor].push(intial);
    checkTarget(intial);
    elevator.state = 'checking';

    generate();
}



// Elevator movement

function checkTarget(newTarget) {
    if( elevator.target == null){
        elevator.target = newTarget.startFloor;
        
        // if (elevator.target > elevator.currentFloor){
        //     elevator.direction = 'up';
            
        // }
        // else{
        //     elevator.direction = 'down';
            

        // }
        if(elevator.currentFloor == newTarget.startfloor)
            elevator.state = 'checking';
    
        return
    }

}
function drawDroppedOff () {
    for( let floor of floors){
        let xExit = 970;
        let yExit = 1180 - (floor.number * 100);
        for(let i = 0; i< floor.droppedOff; i++){
            
            xExit = 970 - (i*30) 
            ctx.drawImage(exit, xExit, (yExit+10),20,40);
        }
    }
}

function draw() {
    
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    drawBase();
    if (elevator.state =='checking'){
        if(shouldStop()) {
            elevator.state = 'stopped';
            elevator.timer = 0;
        }
        else {
            elevator.state = 'moving';
        }
    }
    if(elevator.state == 'stopped'){
        
        if(elevator.timer == timerThresh/2){
            pickup();
            dropoff();
        }
        else if (elevator.timer == timerThresh)
            elevator.state = 'moving';
            
        elevator.timer += 1;
    }

    if (elevator.state == 'moving' || elevator.state == 'idle'){
        travel();
    }
    ctx.fillStyle = 'orange';
    ctx.fillRect(1002 , elevator.yLoc, 97, 100);
    if(elevator.numPassengers > 0){
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText(elevator.numPassengers, 1040, elevator.yLoc + 65)
    }
    if (elevator.state != 'idle'){
        if(elevator.direction == 'up'){
            ctx.drawImage(upArrow, 1007 , elevator.yLoc + 5, 20, 20)
        }
        else if(elevator.direction == 'down'){
            ctx.drawImage(downArrow, 1007 , elevator.yLoc + 5, 20, 20)
        }
    }
    
    for( let floor in waiting){
        
        for(let i = 0; i< waiting[floor].length; i++){
            let person = waiting[floor][i];
            person.xlocation  = 970 - (i * 30);
            person.drawPerson();
        
        }
    }
    drawDroppedOff();

    // // target debug
    // ctx.fillStyle = 'black';
    // ctx.font = '40px Arial';
    // ctx.fillText(elevator.target, 300, 700)
 

    requestAnimationFrame(draw);
}



function shouldStop() {
    if(elevator.target != null && elevator.target == elevator.currentFloor){
        elevator.state = 'checking';
        return true;
    }
    else if(elevator.target == null){
        if( waiting[elevator.currentFloor] != undefined ){
            for( let person of waiting[elevator.currentFloor]){
                if (person.getDirection() == elevator.direction || elevator.target == elevator.currentFloor)
                    return true;
            }
        }
        if (elevator.passengers[elevator.currentFloor] != undefined)
            return true;
    }
    return false;
}


function pickup() {
    let people = waiting[elevator.currentFloor];
    if(people == undefined){
        return
    }
    if (elevator.target != null){
        let intial = waiting[elevator.target][0];
        elevator.target = null;
        elevator.direction = intial.getDirection();   
    } 
    for(let i = people.length -1 ; i >= 0; i--){

        if(people[i].getDirection() == elevator.direction) {
            
            if( elevator.passengers[people[i].targetFloor] == undefined){
                elevator.passengers[people[i].targetFloor]= [];
            }
            elevator.passengers[people[i].targetFloor].push.apply(elevator.passengers[people[i].targetFloor],people.splice(i,1));
            elevator.numPassengers += 1;
            if (waiting[elevator.currentFloor].length === 0)
                delete waiting[elevator.currentFloor];
                
        }
    }

}



function dropoff() {
    if(elevator.passengers[elevator.currentFloor] == undefined){
        return;    
    }
    floors[elevator.currentFloor].droppedOff += elevator.passengers[elevator.currentFloor].length;
    elevator.numPassengers -= elevator.passengers[elevator.currentFloor].length;
    delete elevator.passengers[elevator.currentFloor];

    if (Object.keys(waiting).length === 0 && Object.keys(elevator.passengers).length === 0){
        elevator.direction = 'down';
        elevator.state = 'idle';
        
    }
    else if(Object.keys(elevator.passengers).length == 0){
        elevator.state = 'checking';
        if ( elevator.direction == 'up') {
            for(let i = elevator.currentFloor; i < floors.length; i++){
                if (waiting[i] == undefined)
                    continue;
                else{
                    for(let person of waiting[i]){
                        if( person.getDirection() == elevator.direction){
                            elevator.target = i;
                            return;
                        }
                    }
                }
            }
            for(let i = floors.length; i >= 0; i--){
                if(waiting[i]== undefined){
                    continue;
                }
                else {
                    for(let person of waiting[i]){
                        if( person.getDirection() != elevator.direction){
                            elevator.target = i;
                            if(elevator.currentFloor > elevator.target){
                                elevator.direction = 'down';
                            }
                            return;
                        }
                    }
                }
            }
            for(let i = 0; i < floors.length; i++){
                if(waiting[i]== undefined){
                    continue;
                }
                else {
                    elevator.target = i;
                    if(elevator.currentFloor > elevator.target){
                        elevator.direction = 'down';
                    }
                    return;
                }
            }

            if(elevator.target == null){
                elevator.direction = 'down';
            }

        }
        else if (elevator.direction == 'down') {
            for(let i = elevator.currentFloor; i >= 0; i--){
                if (waiting[i] == undefined)
                    continue;
                else{
                    for(let person of waiting[i]){
                        if( person.getDirection() == elevator.direction){
                            elevator.target = i;
                            return;
                        }
                    }
                }
            }

            for(let i = 0; i < floors.length; i++){
                if(waiting[i]== undefined){
                    continue;
                }

                else {
                    for(let person of waiting[i]){
                        if( person.getDirection() != elevator.direction){
                            elevator.target = i;
                            if(elevator.currentFloor < elevator.target){
                                elevator.direction = 'up';
                            }
                            return;
                        }
                    }
                }
            }
            for(let i = floors.length -1; i >= 0; i--){
                if(waiting[i]== undefined){
                    continue;
                }
                else {

                    elevator.target = i;
                    if(elevator.currentFloor < elevator.target){
                        elevator.direction = 'up';
                    }
                    return;
                
                }
            }
            if(elevator.target == null){
                elevator.direction = 'up';
            }        
        }
    }


        
}


increaseSpeed.onclick = function(){
    speed += 1;
    if(speed>3)
        speed=3;
    
    
}
decreaseSpeed.onclick = function(){
    speed -= 1;
    if(speed <= 1)
        speed = 1;
}
function travel() {
    if(elevator.state == 'idle' && Object.keys(waiting).length == 0){
        
        if(elevator.yLoc < 1180){
            elevator.yLoc += speed;
            if (elevator.yLoc - (1180 - (elevator.currentFloor *100)) >= 100) 
                elevator.currentFloor -= 1;
        }
        return;
    }
    
    if(elevator.yLoc <= 280 && elevator.direction == 'up'){
        elevator.state = 'checking' 
        elevator.direction = 'down';
        
    }
    else if(elevator.yLoc >= 1180 && elevator.direction == 'down') {
        elevator.state = 'checking'
        elevator.direction = 'up';
    }
    if (elevator.target != null){
        if(elevator.currentFloor> elevator.target){
            elevator.direction = 'down';

        }
        else {
            elevator.direction = 'up';
        }
    }
    if( elevator.direction == 'up'){
        elevator.yLoc -= speed;
    }
    else if(elevator.direction == 'down'){
        elevator.yLoc += speed;
    }
    if (elevator.yLoc - (1180 - (elevator.currentFloor *100)) <= -100) {
        elevator.state = 'checking';
        elevator.currentFloor += 1;
    }
    else if (elevator.yLoc - (1180 - (elevator.currentFloor *100)) >= 100) {
        elevator.state = 'checking';
        elevator.currentFloor -= 1;
        
    }

}
   
function start(){
    requestAnimationFrame(draw);

}
start();

