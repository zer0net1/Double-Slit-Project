const simulation = document.getElementById("simulationCanvas");


function redrawCanvas(result) {
    let ctx = simulation.getContext("2d");
    const h = simulation.height;
    const I = result["intensity"];
    const colour = result["colour"];
    //const pixelSize = result["physicalPixelSize"];
    ctx.clearRect(0, 0, simulation.width, simulation.height);
    for (let i = 0; i < simulation.width; i++) {
        ctx.strokeStyle = `rgba(${colour[0]}, ${colour[1]}, ${colour[2]}, ${I[i]})`;
        ctx.beginPath();
        ctx.moveTo(i, h * 0.25);
        ctx.lineTo(i, h * 0.75);
        ctx.stroke();
    }
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
            redrawCanvas(result);
        })
}
function ReadParameters() {
    let lambda = parseFloat(document.getElementById("wavelength").value);
    let a = parseFloat(document.getElementById("slitWidth").value);
    let d = parseFloat(document.getElementById("slitSeparation").value);
    let L = parseFloat(document.getElementById("screenDistance").value);
    let W_ph = parseFloat(document.getElementById("ScreenPhysicalWidth").value);
    let SamplesPerSlit = parseInt(document.getElementById("SamplesPerSlit").value);
    let PixelCount = document.getElementById("simulationCanvas").width;
    let method = document.getElementById("Huygens").checked;

    return JSON.stringify({
        Wavelength: lambda,
        SlitWidth: a,
        SlitSeparation: d,
        ScreenDistance: L,
        ScreenPhysicalWidth: W_ph,
        PixelCount: PixelCount,
        Huygens: method,
        SamplesPerSlit: SamplesPerSlit
    });
}


window.onload = function() {
    runSimulation();
};

//Input Change Listeners + Change in UI
document.addEventListener('DOMContentLoaded', function() {
    const methodType = document.getElementById('Huygens');
    const SamplesPerSlitL = document.getElementById('SamplesPerSlitL');
    const SamplesPerSlit = document.getElementById('SamplesPerSlit');

    methodType.addEventListener('change', function() {
        if (this.checked) {
            SamplesPerSlitL.style.display = 'inline';
            SamplesPerSlit.style.display = 'inline';
        } else {
            SamplesPerSlitL.style.display = 'none';
            SamplesPerSlit.style.display = 'none';
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
    document.getElementById("ScreenPhysicalWidthL").textContent = `Physical Width per Pixel: ${currentValue}m`;
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