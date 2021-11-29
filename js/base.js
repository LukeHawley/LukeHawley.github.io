//ball bouncing sim
//Goals: Make it look nice, and make it work, THEN add more features. 



var simulation, simcontext;
var balls;
var elasticity = .85; // between 0 and 1
var mousex, mousey, clicked=0;
var launchmousex, launchmousey;
var dt;// simulation chunk
var gravity=0; //acceleration towards of -x from 0 to some interesting number.
var ballsize=10;
var ballinlimbo;
var wemovin=0;
var firstclick= false;
var interval;

function drawBall(ball){
    simcontext.fillStyle=ball.hexcol;
    simcontext.beginPath();
    simcontext.arc(ball.x,ball.y,ball.size,0,2*Math.PI);
    simcontext.fill();
    simcontext.closePath();
}

function moveBall(){
    //Clear Canvas draw ball, calculate new x,y, detect collision, change velocities.
    clearFrame();

    //check if balllist is empty. 
    loopsize=balls.length;
    if (loopsize==0){
        wemovin=0;
        clearTimeout(dt);
        return
    };
    var skip=balls[balls.length-1].held;
    //loop over all balls
    for (i=0;i<loopsize-skip;i++){
    
        drawBall(balls[i]);
        cbx=balls[i].x;
        cby=balls[i].y;
        cbvx=balls[i].vx;
        cbvy=balls[i].vy;
        cbsize=balls[i].size;

        //Moving the balls
        balls[i].x=cbx+cbvx;
        balls[i].y=cby+cbvy;
        
        
        //checking if ball is within ball radius of sides and moving in that direction still
        //then multiplies ball speed by -elasticity, slowing it down.
        if((cbx < cbsize && cbvx < 0) || (cbx > simulation.width-cbsize && cbvx > 0)){
            balls[i].vx=cbvx*-elasticity;
        }

        if((cby < cbsize && cbvy <0) || (cby > simulation.height-cbsize && cbvy >0)){
            balls[i].vy=cbvy*-elasticity;
        }
        else if (cby > simulation.height- cbsize && cbvy < gravity){

        } 
        else{
        balls[i].vy=cbvy+gravity;}
    }

    if(skip){
        drawBall(balls[length-1])
    }

    dt=window.setTimeout(moveBall,1000/30);

}



function clearFrame(){
    simcontext.clearRect(0,0,simulation.width,simulation.height);
}

function resize(){ 
    simulation.width=window.innerWidth;
    simulation.height=window.innerHeight;

}


function mouseRelease(e){
    clicked=0;
    //check for ballinlimbo and append to balls
    if (ballinlimbo !== undefined){
        balls.push(ballinlimbo);
        balls[balls.length-1].held=0;
    }

    if (!wemovin){
        wemovin=1;
        moveBall();
    }
}

function mouseClick(){
    //Should be autimatically added to BALLS, But position should stay lined to mouse. 
    firstclick=true
    ballinlimbo = {x:mousex,y:mousey,vx:0,vy:0,hexcol:"red", size:ballsize,held:1};
    launchmousex=mousex;
    launchmousey=mousey;
    clicked=1;
}

function mouseMove(e){
    
    mousex=e.offsetX;
    mousey=e.offsetY;
   
    if(clicked){
    if(!wemovin){clearFrame();}
    ballinlimbo.x=mousex;
    ballinlimbo.y=mousey;
    drawBall(ballinlimbo);
    ballinlimbo.vx=launchmousex-mousex;
    ballinlimbo.vy=launchmousey-mousey;
    simcontext.setLineDash([5, 3]);
    simcontext.beginPath();
    simcontext.moveTo(launchmousex, launchmousey);
    simcontext.lineTo(mousex, mousey);
    simcontext.stroke();
    simcontext.closePath();
    }
}


function clickprompt(){

    if (!firstclick){
        simcontext =simulation.getContext('2d');
        simcontext.font = "30px Arial";
        simcontext.fillText("Click and Drag", simulation.width/2.5, 50);
        setTimeout(clearFrame,1000)
    }
    else{
        interval.clearInterval()
    }
}

function init(){
    //get canvas, set context, event listeners, set size
    simulation=document.getElementById("simulation")
    resize();
    simcontext =simulation.getContext('2d');


    //https://stackoverflow.com/questions/13651274/how-can-i-attach-a-window-resize-event-listener-in-javascript
    window.addEventListener("resize",resize,false);
    simulation.addEventListener("mouseup",mouseRelease,false);
    simulation.addEventListener("mousedown", mouseClick, false);
    simulation.addEventListener("mousemove",mouseMove,false);

    gravityslide=document.getElementById("gravity");
    gravityslide.addEventListener("mouseup", readGrav, false);
    elastslide=document.getElementById("elasticity");
    elastslide.addEventListener("mouseup", readElast, false);
    ballsizeslide=document.getElementById("ballsize");
    ballsizeslide.addEventListener("mouseup", readBallSize, false);

    // ballnumslide=document.getElementById("ballnum");
    // ballnumslide.addEventListener("mouseup", readBallNum, false);

    balls= new Array();
    
    //Display click prompt
    interval=setInterval(clickprompt,2500)
    

}

function readGrav(e){
    gravity=document.getElementById("gravity").value/10;
}

function readElast(e){
    elasticity=document.getElementById("elasticity").value;
}

function readBallSize(e){
    ballsize=document.getElementById("ballsize").value;
}

function readBallNum(e){
    ballnum=document.getElementById("ballnum").value;
}