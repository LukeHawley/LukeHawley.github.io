var canvas,ctx;
var rgb=[0,0,0];
var dirx; //positive or negative direction
var diry; //positive or negative direction
var vx, vy;
var kingcol;
var x,y;
var mouseX,mouseY,mouseDown=0;
var earthx,earthy;
var scale; //meters to pixels
var earth_rel_x;
var earth_rel_y;
var nGrav=6.67e-11;
var earthMass = 5.97e24; //kg
var dt = 5; //time step: seconds
var earthRadius = 6371000; // meters
var mountainHeight = earthRadius * 0.165; 


function ballShoot(){

var r = Math.sqrt(earth_rel_x*earth_rel_x+earth_rel_y*earth_rel_y);
var accel = nGrav * earthMass / (r * r);

var ax = -accel * earth_rel_x / r;
var ay = -accel * earth_rel_y / r;
clearCanvas(canvas, ctx);
x = Math.floor(earthx + earth_rel_x/scale);
y = Math.floor(earthy -earth_rel_y/scale);

vx += ax * dt;
vy += ay * dt;
earth_rel_x += vx * dt;
earth_rel_y += vy * dt;
drawDot(ctx,earthx,earthy,earthRadius/scale);
drawDot(ctx, x, y, 10);
window.setTimeout(ballShoot, 1000/30);
}

function drawDot(ctx,x,y,size) {
    // Select a fill style
    ctx.strokeStyle = "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+","+(255/255)+")";

    // Draw a filled circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, true); 
    ctx.stroke();
    ctx.closePath();
} 

function changeColor(){
    next=[1,2,0];
    prev=[2,0,1];
    step=7;
    if (kingcol == null){
        kingcol= rgb.indexOf(Math.max(...rgb));
    }

    if (rgb[prev[kingcol]] < 255){
        rgb[prev[kingcol]] = rgb[prev[kingcol]] + step;
    }
    else if(rgb[next[kingcol]] >= 0){
        rgb[next[kingcol]] = rgb[next[kingcol]]-step;
    }
    else{
        kingcol=next[kingcol];
    }
    updateSwatch();
}

function moveDot(){
    clearCanvas(canvas, ctx);
    if (x < 5 || x > canvas.width-5){
        dirx=-1*dirx;
    }
    x += dirx*2;

    if (y < 5 || y > canvas.height-5){
        diry=-1*diry;
    }
    y += diry*7;
    drawDot(ctx,x,y,10)
    changeColor();
    window.setTimeout(moveDot, 1000/30)
 
}



// Clear the canvas context using the canvas width and height
function clearCanvas(canvas,ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Keep track of the mouse button being pressed and draw a dot at current location
function sketchpad_mouseDown() {
    mouseDown=1;
    drawDot(ctx,mouseX,mouseY,1);
}

// Keep track of the mouse button being released
function sketchpad_mouseUp() {
    mouseDown=0;
}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function sketchpad_mouseMove(e) { 
    // Update the mouse co-ordinates when moved
    getMousePos(e);

    // Draw a dot if the mouse button is currently being pressed
    if (mouseDown==1) {
        drawDot(ctx,mouseX,mouseY,1);
    }
}

// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
    if (!e)
        var e = event;

    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
 }

//color the swatch
function updateSwatch(){
    ctx2.beginPath();
    ctx2.rect(0, 0, 17, 17);
    ctx2.fillStyle = "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+","+(255/255)+")";
    ctx2.fill();
}

function updateColor(colnum){
    vals=['rednum','greennum','bluenum']
    rgb[colnum]=document.getElementById(vals[colnum]).value;
   updateSwatch();
}


function init() {
    canvas = document.getElementById('sketchpad');
    canvas2 = document.getElementById('colorswatch');

    canvas.width=document.body.clientWidth;
    canvas.height=window.innerHeight;

    if (canvas.getContext)
        ctx = canvas.getContext('2d');

    if (canvas2.getContext)
        ctx2 = canvas2.getContext('2d');
        updateSwatch(canvas2,ctx2);

    if (ctx) {
        canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
        canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
        window.addEventListener('mouseup', sketchpad_mouseUp, false);}

    rgb=[255,0,0];
    earthx=Math.floor(canvas.width/2);
    earthy=Math.floor(canvas.height/2);
    scale = earthRadius / (0.355 * canvas.height);
    earth_rel_x=0;
    earth_rel_y=earthRadius+mountainHeight;
    vx=7500;
    vy=0;
    dirx=1;
    diry=1;
    x=200;
    y=200;

    updateSwatch();
    ballShoot(canvas,ctx);
}