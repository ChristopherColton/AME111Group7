// getting a reference to our HTML element
const canvas = document.querySelector('canvas')

// initiating 2D context on it
const ctx = canvas.getContext('2d')
var x = 0;
var y = 0;

window.onload = function()
{
    var name = prompt("What's your name?");
    var lengthOfName = name.length

    document.getElementById('healthy').innerHTML = lengthOfName;
}

ctx.fillStyle = "green";

ctx.beginPath();
ctx.arc(100, 50, 50, 2*Math.PI,false);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.arc(200, 50, 50, 2*Math.PI,false);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.arc(300, 50, 50, 2*Math.PI,false);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.arc(250, 150, 50, 2*Math.PI,false);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.arc(150, 150, 50, 2*Math.PI,false);
ctx.fill();
ctx.closePath();


