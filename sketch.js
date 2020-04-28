function setup() {
    createCanvas(400, 200);
}

function draw() {
    if (mouseIsPressed) {
        fill(0);
    } else {
        fill(255);
    }
    text("A", mouseX, mouseY);
}