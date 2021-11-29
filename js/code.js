
var gridholder;
var pixsize;
var n;
var pixElement;

function make_divs(gridholder, n)
{
    //I could make n, or I could make rows of n
    var toughstuff = document.createElement('div');
   
    gridholder.appendChild(toughstuff);
    if(n > 0){
    toughstuff.className= "pixel";   
    make_divs(gridholder,n-1)
    }

    
}



function resize()
{
//calculate how many N there should be and add or remove divs based on that.
var newn = Math.floor((window.innerHeight)/pixsize);
var newm = Math.floor((window.innerWidth)/pixsize);

if (n > newn * newm){
    gridholder.removeChild(gridholder.childNodes[Math.floor(newm*newn)-1,n-1])
    }
else{
    make_divs(gridholder, (newn*newm)-n)
    }
n= Math.floor(newn * newm);
}


function init()
{   pixsize = 20;
    var newn = Math.floor((window.innerHeight)/pixsize);
    var newm = Math.floor((window.innerWidth)/pixsize);
    
    n=newm*newn;

    gridholder = document.getElementById("gridholder");
    Alldivs=make_divs(gridholder, n);
    pixElement = document.getElementsByClassName('pixel')
    gridholder.style.width= "100 px";
    
    window.addEventListener("resize",resize,false);

}
