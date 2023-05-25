var cubeSize = { x: 1, y: 1, z: 1 }; // set the size of the cubes
var cubeGap = { x: 0.1, y: 0.1, z: 0.1 }; // set the size of the cubes

let maxValue = -Infinity; // initialize the maximum value to negative infinity
let minValue = Infinity; // same with minValue
const min_scale_factor = 50;
const slices = 340;

function opacity_weight(x, maxValue) {
    const N = maxValue;		// maximum value
    const x0 = 0;			// offset value
    const A = 0.45;			// amplitude of exponential growth
	
    if (x <= x0) {
        return 0.0;
    } else if (x >= N) {
        return 1.0;
    } else {
        return 1.0 - Math.exp(-A * (x - x0) / (N - x0));
    }
}

function rainbowColor(value, maxValue) {
    const color = new THREE.Color();
    const hue = value / maxValue;
    color.setHSL(hue, 1, 0.5);
    return color;
}

// create a scene, camera, renderer and controls
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 1000);
camera.position.set(50, 0, 0);
camera.zoom = 13;
camera.updateProjectionMatrix();
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', function () {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);
				});
var controls = new THREE.OrbitControls(camera, renderer.domElement);

// reading file
document.getElementById('file').onchange = function () {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
        const file = event.target.result;
        const allLines = file.split(/\r\n|\n/);

        for (let i = 0; i < allLines.length; i++) {
            const line = allLines[i];
            const values = line.split('\t'); // assuming tab-separated values

            for (let j = 0; j < values.length; j++) {
                const value = parseFloat(values[j]);

                if (!isNaN(value) && value > maxValue) {
                    maxValue = value;
                }
                if (!isNaN(value) && value > 0 && value < minValue) {
                    minValue = value;
                }
            }
        }
        console.log('Maximum value:', maxValue);
        console.log('Minimum value:', minValue);

        var x = 0;
        var z = 0;
        for (var line = 0; line < allLines.length - 1; line = line + 1) {
            console.log("Line:");
            console.log(allLines[line]);
            if (line > 0 && line % slices == 0) {
                x++;
                z = 0;
            }

            var values = allLines[line].split("\t");
            for (var y = 0; y < values.length - 1; y++) {
                //console.log("xyz: " + x + " " + y + " " + z);
                var value = parseFloat(values[y]);
                //console.log("Value: " + value);
                if (value > minValue * min_scale_factor) {
                    const color_value = rainbowColor(value, maxValue);
                    const cubeMaterial = new THREE.MeshBasicMaterial({ color: color_value, transparent: true });
                    cubeMaterial.opacity = opacity_weight(value, maxValue);
                    var cubeGeometry = new THREE.BoxGeometry(cubeSize.x, cubeSize.y, cubeSize.z);
                    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cube.position.set(x * (cubeSize.x + cubeGap.x) - (slices/2)*(cubeSize.x + cubeGap.x), 
                                      y * (cubeSize.y + cubeGap.y) - (slices/2)*(cubeSize.x + cubeGap.x), 
                                      z * (cubeSize.z + cubeGap.z) - (slices/2)*(cubeSize.x + cubeGap.x));
                    scene.add(cube);
                }
            }
            z++;
        }
    };
    reader.onerror = (event) => {
        alert(event.target.error.name);
    };

    reader.readAsText(file);
};

// Some utils
function updateRendererInfo() {

    var info = renderer.info;

    for (let prop in info.render) {
        console.log(prop + " " + info.render[prop]);
    }

    if (info.memory) {
        for (let prop in info.memory) {
            console.log(prop + " " + info.memory[prop]);
        }
    }
};

function setXY() {
    const length = camera.position.length();

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = length;
    camera.up = new THREE.Vector3(0, 1, 0);

    camera.lookAt(new THREE.Vector3(0, 0, 0));
};
function setYZ() {
    const length = camera.position.length();

    camera.position.x = -length;
    camera.position.y = 0;
    camera.position.z = 0;
    camera.up = new THREE.Vector3(0, 1, 0);

    camera.lookAt(new THREE.Vector3(0, 0, 0));
};
function settYZ() {
    const length = camera.position.length();

    camera.position.x = length;
    camera.position.y = 0;
    camera.position.z = 0;
    camera.up = new THREE.Vector3(0, 1, 0);

    camera.lookAt(new THREE.Vector3(0, 0, 0));
};
function setZX() {
    const length = camera.position.length();

    camera.position.x = 0;
    camera.position.y = length;
    camera.up = new THREE.Vector3(1, 0, 0);

    camera.lookAt(new THREE.Vector3(0, 0, 0));
};

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.domElement.style.cssText = 'position:absolute;top:22px;left:0px;';
document.body.appendChild(stats.dom);
var stats1 = new Stats();
stats1.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
stats1.domElement.style.cssText = 'position:absolute;top:22px;left:80px;';
document.body.appendChild(stats1.dom);
var stats2 = new Stats();
stats2.showPanel(2); // 0: fps, 1: ms, 2: mb, 3+: custom
stats2.domElement.style.cssText = 'position:absolute;top:22px;left:160px;';
document.body.appendChild(stats2.dom);

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
    stats1.update();
    stats2.update();
}

animate();
