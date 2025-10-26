const simulation = document.getElementById("simulationCanvas");
let screen = simulation.getContext("2d");
const schematic = document.getElementById("schematicCanvas");
let scheme = schematic.getContext("2d");

let colour = [0,0,0]

let slitWidth = parseFloat(document.getElementById("slitWidth").value);
let slitSeparation = parseFloat(document.getElementById("slitSeparation").value);
let screenDistance = parseFloat(document.getElementById("screenDistance").value);
let lambda = parseFloat(document.getElementById("wavelength").value);
let W_ph = parseFloat(document.getElementById("ScreenPhysicalWidth").value);
let SamplesPerSlit = parseInt(document.getElementById("SamplesPerSlit").value);
let PixelCount = document.getElementById("simulationCanvas").width;
let method = document.getElementById("Huygens").checked;

let userValue = document.getElementById("userValue");
let more = document.getElementById("other");
let one = document.getElementById("one");

let huygens = document.getElementById('Huygens');
let fraunhofer = document.getElementById('Fraunhofer');
let fraunhoferL = document.getElementById('FraunhoferL');


function drawDiffraction(result) {
    const w = simulation.width;
    const h = simulation.height;
    const I = result["intensity"];
    colour = result["colour"];

    const imgData = screen.createImageData(w, h);
    const data = imgData.data;

    for (let x = 0; x < w; x++) {
        const alpha = I[x] * 255;
        for (let y = Math.floor(h * 0.25); y < Math.floor(h * 0.75); y++) {
            const index = (y * w + x) * 4;
            data[index] = colour[0];
            data[index + 1] = colour[1];
            data[index + 2] = colour[2];
            data[index + 3] = alpha;
        }
    }
    screen.putImageData(imgData, 0, 0);

    drawSchematic(slitSeparation, slitWidth, screenDistance, I);
}

function drawErrorGraph(errorResult) {
    let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1", // "light1", "light2", "dark1", "dark2"
        backgroundColor: "white",
        title: {
            text: "Computing Error to Analytical Far Field Approximation"
        },
        axisY: {
            includeZero: true,
            title: "error, %",
            minimumValue: 0
        },
        axisX: {
            title: "samples",
        },
        data: [{
            type: "line", //change type to bar, line, area, pie, etc
            indexLabelFontColor: "#f11818",
            color: "#f11818",
            indexLabelFontSize: 16,
            indexLabelPlacement: "outside",
            dataPoints: errorResult["error"],
        }]
    });
    chart.render();
}

function drawSchematic(slitSeparation, slitWidth, screenDistance, I) {
    slitSeparation = 0.1 * slitSeparation / 500;
    slitWidth = 0.05 * slitWidth / 100;
    let index = 0;
    scheme.clearRect(0, 0, scheme.width, scheme.height)
    
    const schemeData = scheme.createImageData(schematic.width, schematic.height);
    const sdata = schemeData.data;

    //Light Source
    let startX = Math.floor(schematic.width * 0.2);
    let endX   = Math.floor(schematic.width * 0.8);
    let startY = Math.floor(schematic.height * 0.8);
    let endY   = Math.floor(schematic.height);
    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            index = (y * schematic.width + x) * 4;
            sdata[index]     = colour[0];
            sdata[index + 1] = colour[1];
            sdata[index + 2] = colour[2];
            sdata[index + 3] = 255;
        }
    }
    
    
    //Wall
    startX = Math.floor(schematic.width * 0.1);
    endX   = Math.floor(schematic.width * 0.9);
    startY = Math.floor(schematic.height * 0.75);
    endY   = Math.floor(schematic.height * 0.8);
    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            index = (y * schematic.width + x) * 4;
            sdata[index]     = 55;
            sdata[index + 1] = 55;
            sdata[index + 2] = 55;
            sdata[index + 3] = 255;
        }
    }
    
    //Screen
    startX = Math.floor(schematic.width * 0.1);
    endX   = Math.floor(schematic.width * 0.9);
    startY = Math.floor(schematic.height * (0.4*(1 - screenDistance / 100)+0.1));
    endY   = startY + schematic.height * 0.05;
    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            index = (y * schematic.width + x) * 4;
            sdata[index]     = 55;
            sdata[index + 1] = 55;
            sdata[index + 2] = 55;
            sdata[index + 3] = 255;
        }
    }
    
    //Slits
    startX = Math.floor(schematic.width * (0.48-slitSeparation/2-slitWidth/2));
    endX   = Math.floor(schematic.width * (0.48-slitSeparation/2+slitWidth/2));
    startY = Math.floor(schematic.height * 0.75);
    endY   = Math.floor(schematic.height * 0.8);
    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            index = (y * schematic.width + x) * 4;
            sdata[index]     = colour[0];
            sdata[index + 1] = colour[1];
            sdata[index + 2] = colour[2];
            sdata[index + 3] = 255;
        }
    }
    
    startX = Math.floor(schematic.width * (0.52+slitSeparation/2-slitWidth/2));
    endX   = Math.floor(schematic.width * (0.52+slitSeparation/2+slitWidth/2));
    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            index = (y * schematic.width + x) * 4;
            sdata[index]     = colour[0];
            sdata[index + 1] = colour[1];
            sdata[index + 2] = colour[2];
            sdata[index + 3] = 255;
        }
    }
    
    //Graph
    startX = Math.floor(schematic.width * 0.1);
    endX   = Math.floor(schematic.width * 0.9);
     arrayStart = I.length/2 - Math.floor(0.4 * schematic.width);
     graphHeight = schematic.height * 0.3;
     yOffset = schematic.height * 0.4;
    for (let x = startX+1; x < endX; x++) {
        let i0 = arrayStart + (x - startX - 1);
        let i1 = arrayStart + (x - startX);
        let y0 = Math.floor(yOffset + graphHeight * (1 - I[i0]));
        let y1 = Math.floor(yOffset + graphHeight * (1 - I[i1]));

        let minY = Math.min(y0, y1);
        let maxY = Math.max(y0, y1);
        for (let y = minY; y <= maxY; y++) {
            let index = (y * schematic.width + x) * 4;
            sdata[index]     = colour[0];
            sdata[index + 1] = colour[1];
            sdata[index + 2] = colour[2];
            sdata[index + 3] = 255;
        }
    }
    
    scheme.putImageData(schemeData, 0, 0);
    scheme.textBaseline = "middle";
    scheme.textAlign = 'center';
    scheme.fillStyle = "white";
    scheme.font = "15px monospace";
    scheme.fillText("Light Source", schematic.width/2, 0.9*schematic.height);
    scheme.textBaseline = "hanging";
    scheme.fillText("Screen", schematic.width/2, Math.floor(schematic.height * (0.4*(1 - screenDistance / 100)+0.1)));
    scheme.fillText("slits",schematic.width * 0.1+30, Math.floor(schematic.height * 0.75));
}
function runSimulation(){
    fetch("https://localhost:7255/SimulationHandler", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: ReadParameters()
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(result => {
            
            drawDiffraction(result);
        })
}

function runErrorCheck() {
    fetch("https://localhost:7255/ErrorHandler", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: ReadParameters()
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(errorResult => {
            drawErrorGraph(errorResult);
        })
}
function ReadParameters() {
    slitWidth = parseFloat(document.getElementById("slitWidth").value);
    slitSeparation = parseFloat(document.getElementById("slitSeparation").value);
    screenDistance = parseFloat(document.getElementById("screenDistance").value);
    lambda = parseFloat(document.getElementById("wavelength").value);
    W_ph = parseFloat(document.getElementById("ScreenPhysicalWidth").value);
    SamplesPerSlit = parseInt(document.getElementById("SamplesPerSlit").value);
    PixelCount = document.getElementById("simulationCanvas").width;
    method = document.getElementById("Huygens").checked;
    
    return JSON.stringify({
        Wavelength: lambda,
        SlitWidth: slitWidth,
        SlitSeparation: slitSeparation,
        ScreenDistance: screenDistance,
        ScreenPhysicalWidth: W_ph,
        PixelCount: PixelCount,
        Huygens: method,
        SamplesPerSlit: SamplesPerSlit
    });
}


window.onload = function() {
    runSimulation();
};

function updateUI(method) {
    const SamplesPerSlitL = document.getElementById('SamplesPerSlitL');
    const SamplesPerSlit = document.getElementById('SamplesPerSlit');
    const ErrorGraph = document.getElementById('Check');
    const ErrorGraphL = document.getElementById('CheckL');
    const Graph = document.getElementById('chartContainer');
    if (method.checked) {
        SamplesPerSlitL.style.display = 'inline';
        SamplesPerSlit.style.display = 'inline';
        ErrorGraph.style.display = 'inline';
        ErrorGraphL.style.display = 'inline';
        Graph.style.display = 'block';
    } else {
        SamplesPerSlitL.style.display = 'none';
        SamplesPerSlit.style.display = 'none';
        ErrorGraph.style.display = 'none';
        ErrorGraphL.style.display = 'none';
        Graph.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const huygens = document.getElementById('Huygens');
    const fraunhofer = document.getElementById('Fraunhofer');
    
    huygens.addEventListener('change', function() {
        updateUI(this);
    });
    fraunhofer.addEventListener('change', function() {
        updateUI(huygens);
    });
});
document.querySelectorAll('input[type=radio][name=SlitsAmount]').forEach(radio => {
    radio.addEventListener('change', function() {
        if (more.checked) {
            userValue.style.display = 'inline';
        }
        else {
            userValue.style.display = 'none';
        }
        if (one.checked || more.checked) {
            huygens.checked = true;
            fraunhofer.style.display = 'none';
            fraunhoferL.style.display = 'none';
            updateUI(fraunhofer);
        }
        else {
            fraunhofer.style.display = 'inline';
            fraunhoferL.style.display = 'inline';
            updateUI(huygens)
        }
    });
});
document.getElementById("wavelength").addEventListener("input", function() {
    const currentValue = this.value;
    document.getElementById("wavelengthL").textContent = `Wave Length: ${currentValue}µm`;
    runSimulation();
});
document.getElementById("slitWidth").addEventListener("input", function () {
    const currentValue = this.value;
    document.getElementById("slitWidthL").textContent = `Slit Width: ${currentValue}µm`;
    runSimulation();
});
document.getElementById("slitSeparation").addEventListener("input", function () {
    const currentValue = this.value;
    document.getElementById("slitSeparationL").textContent = `Slit Separation: ${currentValue}µm`;
    runSimulation();
});
document.getElementById("screenDistance").addEventListener("input", function () {
    const currentValue = this.value;
    document.getElementById("screenDistanceL").textContent = `Screen Distance: ${currentValue}cm`;
    runSimulation();
});
document.getElementById("ScreenPhysicalWidth").addEventListener("input", function () {
    const currentValue = this.value;
    if (currentValue > 0.099) {
        document.getElementById("ScreenPhysicalWidthL").textContent = `Physical Width per Pixel: ${currentValue}00m`;
    }
    else {
        document.getElementById("ScreenPhysicalWidthL").textContent = `Physical Width per Pixel: ${currentValue}m`;
    }
    runSimulation();
});
document.getElementById("SamplesPerSlit").addEventListener("input", function () {
    const currentValue = this.value;
    document.getElementById("SamplesPerSlitL").textContent = `Amount of Samples: ${currentValue}`;
    runSimulation();
});
document.getElementById("Huygens").addEventListener("change", function () {
    runSimulation();
});
document.getElementById("Fraunhofer").addEventListener("change", function () {
    runSimulation();
})
document.getElementById("Check").addEventListener("click", function () {
    runErrorCheck();
})