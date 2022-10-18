let coffeeData;
let isCityDataReady = false;

window.addEventListener("load", function(){
    console.log('page is loaded');
    fetch('coffee.json')
        .then(response => response.json())
        .then(data => {
            coffeeData = data;
            isCityDataReady = true;
            //console.log(coffeeData.country.length);
        });
});

let citylon;
let citylat;
let citystate;

let button = document.getElementById('city-button');
button.addEventListener('click', function() {
    let inputText = document.getElementById("city-input").value;
    let API_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+ inputText + ".json?types=region&access_token=pk.eyJ1Ijoid2VudGFvd2FuZyIsImEiOiJjbDh1Z2pvZWIwM204M29xcTMxM2xtcDZkIn0.LVISn7-zr1xYhbXYwGSymQ";
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        console.log(data.features[0].center);
        citylon = data.features[0].center[0];
        citylat = data.features[0].center[1];
        citystate = true;
    });

});

let mapimg;

let clat = 0;
let clon = 0;

let zoom = 1;

let coffee;

function preload(){
  mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/0,0,1,0.00,0.00/1024x512?access_token=pk.eyJ1Ijoid2VudGFvd2FuZyIsImEiOiJjbDh1Z2pvZWIwM204M29xcTMxM2xtcDZkIn0.LVISn7-zr1xYhbXYwGSymQ');
}

function mercX(lon){
    lon = radians(lon);
    let a = (256 / PI) * pow(2, zoom); 
    let b = lon + PI;
    return a * b;
}

function mercY(lat){
    lat = radians(lat);
    let a = (256 / PI) * pow(2, zoom); 
    let b = tan(PI / 4 + lat / 2);
    let c = PI - log(b);
    return a * c;
}

let citylocs = [];
let ctx;
let cty;

function setup() {
    createCanvas(1024, 512);
    createCanvas(1024, 512).parent("container");
    translate(width / 2, height / 2);
    imageMode(CENTER);
    image(mapimg, 0, 0);
  
}

function draw() {
    translate(width / 2, height / 2);
    let cx = mercX(clon);
    let cy = mercY(clat);

    if(isCityDataReady && citylocs.length == 0) {

        for (let i = 0; i < coffeeData.country.length; i++){
            let lat = coffeeData.country[i].latitude;
            let lon = coffeeData.country[i].longitude;
            let x = mercX(lon) - cx;
            let y = mercY(lat) - cy;
            let r = map(Math.sqrt(coffeeData.country[i].number), 0, 255, 5, 20);
            let ppic = coffeeData.country[i].image;
            let cnote = coffeeData.country[i].note;
            //fill(255, 0, 255, 200);
            //ellipse(x, y, 20, 20);
            citylocs.push(new Cityloc(x, y, r, coffeeData.country[i].name, coffeeData.country[i].number, ppic, cnote));
        }
    
    } else if(isCityDataReady) {
        for(let i = 0; i < citylocs.length; i++) {
            citylocs[i].drawloc();
        }
    } else {
        console.log("data is not ready yet!")
    }

    
    if(citystate = true){
        let ctlat = citylat;
        let ctlon = citylon;
        ctx = mercX(ctlon) - cx;
        cty = mercY(ctlat) - cy;
        fill(255, 0, 0);
        ellipse(ctx, cty, 20, 20);
    }

 
}

function mousePressed() {
    let mx1 = mouseX - width/2;
    let my1 = mouseY - height/2;

    for(let i = 0; i < citylocs.length; i++) {
        citylocs[i].clicked(mx1, my1);
    }
}

class Cityloc {
    constructor(x, y, r, name, num, pic, note) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.r = r;
        this.num = num;
        this.pic = pic;
        this.note = note
    }
    
    drawloc() {
        if(dist(mouseX - width/2, mouseY - height/2, this.x, this.y) < this.r) {
            fill(253, 255, 245);
        } else {
            fill(111, 78, 55);
        }
        push();
        noStroke();
        ellipse(this.x, this.y, 2 * this.r, 2 * this.r);
        pop();
    }

    clicked(mX, mY) {
        if(dist(mX, mY, this.x, this.y) < this.r) {
            //console.log("clicked");
            console.log(this.name);

            let headingElement = document.getElementById("c-name");
            headingElement.innerHTML = this.name;
            let imageElement = document.getElementById('c-img');
            imageElement.src = this.pic;
            let pElement = document.getElementById("c-note");
            pElement.innerHTML = this.note;

            if(citystate = true){
                strokeWeight(3);
                line(this.x, this.y, ctx, cty);
                text(this.num + " Thousand Bags", (this.x + ctx) / 2, (this.y + cty) / 2);
            }
        }
    }
}