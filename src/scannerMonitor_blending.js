var geometry;
var controls;

var x1, x2, y1, y2, z1, z2;

var cylinderRadius = 20;

var voxels_mesh = null;
var cylinders_mesh = null;
var dummy = new THREE.Object3D();
var dummy2 = new THREE.Object3D();
var scannerobj = new THREE.Object3D();
var scannerobj2= new THREE.Object3D();
var scannerobj3= new THREE.Object3D();
var scannerobj4= new THREE.Object3D();

volconfig = {
    voxel_transparency: 0.1,
    cylinder_transparency: 0.2,
    scaner_transparency: 0.5,
    voxel_color: 0xff501f,
    cylinder_color: 0xe00ff,
	field_of_view: 40,
	useOrtho: false,
	LOR_clipping: false,
	wire_frame: false,
	depth_write: true,
    skip: 1
};

var voxel_material = new THREE.MeshBasicMaterial({
    color: volconfig.voxel_color,
    transparent: true,
    depthWrite: false,
    opacity: volconfig.voxel_transparency,
    //emissive: volconfig.color,
    //emissiveIntensity: 1,
    //blending: THREE.AdditiveBlending,
	blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.SrcAlphaFactor,
    //blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
	blendSrcAlpha: THREE.OneFactor,
    //blendDstAlpha: THREE.OneMinusSrcAlphaFactor
    blendDstAlpha: THREE.OneFactor
});

var cylinder_material = new THREE.MeshBasicMaterial({
    color: volconfig.cylinder_color,
    // emissive: 0xff0000,
    // emissiveIntensity: 1,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: volconfig.cylinder_transparency,
    transparent: true
});


///*
const loader = new THREE.GLTFLoader().setPath( 'models_and_data/' );
loader.load( 'tower_w_2blocks.glb', function ( gltf ) {
//loader.load( 'tower_22x30.glb', function ( gltf ) {
    gltf.scene.traverse(child => {
    	if (child.isMesh) {
		    //child.material.blending = THREE.NormalBlending;
		    //child.material.blending = THREE.AdditiveBlending;
			child.material.depthWrite = volconfig.depth_write;
        	child.material.transparent = true;
        	child.material.opacity = volconfig.scaner_transparency;
        	//child.material.castShadow = true;
        	//child.material.receivedShadow = true;
        	child.material.format = THREE.RGBAFormat;
        	child.material.side = THREE.BackSide;
        	//child.material.side = THREE.FrontSide;
        	//child.material.side = THREE.DoubleSide;
        	//child.material.wireframe = true;
            //child.material.polygonOffset = true;
            //child.material.polygonOffsetFactor = 1000;
            //child.material.polygonOffsetUnits = 1000;
        }
    });
    gltf.scene.scale.setScalar(10); // Scaling is set to 1000 to go from mm to 100 µm
	gltf.scene.translateZ(-162);
	gltf.scene.translateY(201);
	//object.translateX(0);
	gltf.scene.rotation.set(0,0.5*Math.PI,0);
    scannerobj = gltf.scene;
    scene.add(scannerobj);
    scannerobj1 = gltf.scene.clone();
	scannerobj1.translateY(-402);
	scannerobj1.translateX(-324);
	scannerobj1.rotation.set(Math.PI,0.5*Math.PI,0);
    scene.add(scannerobj1);
    scannerobj2 = gltf.scene.clone();
	scannerobj2.translateX(-363);
	scannerobj2.translateY(-39);
	scannerobj2.rotation.set(Math.PI,0.5*Math.PI,-0.5*Math.PI);
    scene.add(scannerobj2);
    scannerobj3 = scannerobj1.clone();
	scannerobj3.translateX(-363);
	scannerobj3.translateY(-39);
	scannerobj3.rotation.set(Math.PI,0.5*Math.PI,0.5*Math.PI);
    scene.add(scannerobj3);
    scene.add( gltf.scene );
} );
//*/

const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000000 );
//var camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 100, 100000);
var orthoCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 100, 100000);
camera.position.set(-1000, 0, 0);
camera.zoom = 0.4;
camera.updateProjectionMatrix();
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
    camera.position.z = 0;
    camera.up = new THREE.Vector3(1, 0, 0);

    camera.lookAt(new THREE.Vector3(0, 0, 0));
};

const renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 0.4); // soft white light
const light2 = new THREE.AmbientLight(0xFFFFC1, 0.6); // soft white light
scene.add(light);
scene.add(light2);

controls = new THREE.OrbitControls(camera, renderer.domElement);

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

var gui = new dat.GUI();

gui.add(volconfig, 'LOR_clipping');

var scanner = gui.addFolder('Scanner');
scanner.add(volconfig, 'scaner_transparency', 0, 1).onFinishChange(updateScannerOpacity);
scanner.add(volconfig, 'wire_frame').onChange(function() {
  scannerobj.traverse(function(child) {
    if (child instanceof THREE.Mesh) {
      child.material.wireframe = volconfig.wire_frame;
    }
  });
});
scanner.add(volconfig, 'depth_write').onChange(function() {
  scannerobj.traverse(function(child) {
    if (child instanceof THREE.Mesh) {
      child.material.depthWrite = volconfig.depth_write;
    }
  });
});
scanner.open();
var voxels = gui.addFolder('Voxels');
voxels.add(volconfig, 'voxel_transparency', 0, 1).onChange(updateVoxelUniforms);
voxels.addColor(volconfig, 'voxel_color').onFinishChange(updateVoxelColor);
voxels.open();
var cylinders = gui.addFolder('Cylinders');
cylinders.add(volconfig, 'cylinder_transparency', 0, 1).onChange(updateCylinderUniforms);
cylinders.add( {radius: cylinderRadius}, 'radius', 1, 100 ).onChange( function(newValue) {
    cylinderRadius = newValue;
    updateCylinderRadius();
});
cylinders.addColor(volconfig, 'cylinder_color').onFinishChange(updateCylinderColor);
cylinders.open();


var cam = gui.addFolder('Camera');
cam.add(volconfig, 'useOrtho').onChange(function(value) {
  if (value) {
    camera = orthoCamera;
  	camera.updateProjectionMatrix();
  } else {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  	camera.updateProjectionMatrix();
  }
});
cam.add(volconfig, 'field_of_view', 1, 100, 1).onChange(function(value) {
  camera.fov = value;
  camera.updateProjectionMatrix();
});
cam.open();

function updateCylinderRadius() {
    var cylinderGeometry = new THREE.CylinderBufferGeometry(cylinderRadius, cylinderRadius, 1, 6, 1);
    cylinders_mesh.geometry.copy(cylinderGeometry);
    cylinders_mesh.geometry.attributes.position.needsUpdate = true;
}

function updateVoxelColor() {
    voxel_material.color.set(volconfig.voxel_color);
    voxel_material.emissive.set(volconfig.voxel_color);
}
function updateCylinderColor() {
    cylinder_material.color.set(volconfig.cylinder_color);
    cylinder_material.emissive.set(volconfig.cylinder_color);
}
function updateVoxelUniforms() {
    voxel_material.opacity = volconfig.voxel_transparency;
};
function updateCylinderUniforms() {
    cylinder_material.opacity = volconfig.cylinder_transparency;
};
function updateScannerOpacity() {
    scannerobj.traverse(child => {
        if (child.isMesh) {
            child.material.opacity = volconfig.scaner_transparency;
        }
    });
};

var blendModeNames = [
    "Normal Blending",
    "Additive Blending",
    "Subtractive Blending",
    "Multiply Blending"
];

var blend = gui.addFolder('LOR  blending (TEST)');
blend.add(voxel_material, "opacity", 0, 1).name("Material Opacity");
blend.add(voxel_material, "blendDst", blendModeNames).name("Blend Destination");
blend.add(voxel_material, "blendSrc", blendModeNames).name("Blend Source");
blend.add(voxel_material, "blendDstAlpha", blendModeNames).name("Blend Destination Alpha");
blend.add(voxel_material, "blendSrcAlpha", blendModeNames).name("Blend Source Alpha");
blend.add(voxel_material, "depthWrite").name("Depth Write");

// create a variable to store the weight of the additive blending
const additiveWeight = { value: 0.5 };

// create a function to update the blending equation with the new weight
function updateBlendingEquation() {
  const weight = additiveWeight.value;
  voxel_material.opacity = 1 - weight;

  const srcColor = new THREE.Color(1, 1, 1);
  const dstColor = new THREE.Color(1, 1, 1);
  const srcAlpha = 1;
  const dstAlpha = 1;
  const blendSrc = srcColor.multiplyScalar(weight);
  const blendDst = dstColor.multiplyScalar(1 - weight);
  const blendSrcAlpha = srcAlpha * weight;
  const blendDstAlpha = dstAlpha * (1 - weight);
}

blend.add(additiveWeight, "value", 0, 1).name("Additive Weight").onChange(updateBlendingEquation);
updateBlendingEquation();

voxels_mesh = new THREE.InstancedMesh(new THREE.BoxBufferGeometry(1, 1, 1), voxel_material, 1000000);
scene.add(voxels_mesh);
cylinders_mesh = new THREE.InstancedMesh(new THREE.CylinderBufferGeometry(10, 10, 1, 6, 1), cylinder_material, 1000000);
scene.add(cylinders_mesh);

function read() {
    console.log("Reading file");
    document.getElementById('file').onchange = function () {
        delete x1, y1, z1, x2, y2, z2;
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = (event) => {
            const file = event.target.result;
            const allLines = file.split(/\r\n|\n/);

            let n_pixelhits=0;
            for (var line = 0; line < allLines.length - 1; line = line + volconfig.skip) {
                let eventline = allLines[line].toString().indexOf("#");

                console.log(n_pixelhits);

                if (n_pixelhits == 2 && eventline != -1) {
                    var point1 = allLines[line - 1].split("\t");
                    var point2 = allLines[line - 2].split("\t");
                    x1 = Math.round(point1[1] * 10);
                    y1 = Math.round(point1[2] * 10);
                    z1 = Math.round(point1[3] * 10);
                    x2 = Math.round(point2[1] * 10);
                    y2 = Math.round(point2[2] * 10);
                    z2 = Math.round(point2[3] * 10);
                    console.log("Two points for this line")
                    console.log(allLines[line - 2]);
                    console.log(allLines[line - 1]);
                    console.log(allLines[line]);
                    
                    Bresenham3D(x1, y1, z1, x2, y2, z2, 680, 170, 170, voxels_mesh);
					drawCylinder(x1, y1, z1, x2, y2, z2, cylinders_mesh);
                }
                
                if (eventline != -1) // quand il trouve le symbole
                {
                    console.log(allLines[line]);
                    n_pixelhits = 0;
                }
                if (eventline == -1) // quand il trouve pas le symbole
                {
                    n_pixelhits = n_pixelhits + 1;
                }

            }
			
        };
        reader.onerror = (event) => {
            alert(event.target.error.name);
        };

        reader.readAsText(file);
    };
	console.log("OUT");

}

function isInside(x, y, z, BX, BY, BZ) {
    if (Math.abs(x) > BX) {
        return false;
    }
    if (Math.abs(y) > BY) {
        return false;
    }
    if (Math.abs(z) > BZ) {
        return false;
    } else {
        return true;
    }
}

var index = 0;
function Bresenham3D(x1, y1, z1, x2, y2, z2, lX, lY, lZ, mesh) {
    var BoxX, BoxY, BoxZ;
    BoxX = lX ;
    BoxY = lY ;
    BoxZ = lZ ;
    var i, dx, dy, dz, l, m, n, x_inc, y_inc, z_inc, err_1, err_2, dx2, dy2, dz2;
    var point = [-1, -1, -1];
    var step = 1;
    point[0] = x1;
    point[1] = y1;
    point[2] = z1;
    dx = x2 - x1;
    dy = y2 - y1;
    dz = z2 - z1;
    x_inc = (dx < 0) ? -step : step;
    l = Math.abs(dx);
    y_inc = (dy < 0) ? -step : step;
    m = Math.abs(dy);
    z_inc = (dz < 0) ? -step : step;
    n = Math.abs(dz);
    dx2 = l << 1;
    dy2 = m << 1;
    dz2 = n << 1;

    if ((l >= m) && (l >= n)) {
        err_1 = dy2 - l;
        err_2 = dz2 - l;
        for (i = 0; i < l; i++) {
            if (isInside(point[0], point[1], point[2], BoxX, BoxY, BoxZ) || !volconfig.LOR_clipping) {
               	dummy.position.set(point[0], point[1], point[2]);
               	dummy.updateMatrix();
               	mesh.setMatrixAt(index, dummy.matrix);
               	++index;
           	}

            if (err_1 > 0) {
                point[1] += y_inc;
                err_1 -= dx2;
            }
            if (err_2 > 0) {
                point[2] += z_inc;
                err_2 -= dx2;
            }
            err_1 += dy2;
            err_2 += dz2;
            point[0] += x_inc;
        }
    } else if ((m >= l) && (m >= n)) {
        err_1 = dx2 - m;
        err_2 = dz2 - m;
        for (i = 0; i < m; i++) {
            if (isInside(point[0], point[1], point[2], BoxX, BoxY, BoxZ) || !volconfig.LOR_clipping) {
                dummy.position.set(point[0], point[1], point[2]);
                dummy.updateMatrix();
                mesh.setMatrixAt(index, dummy.matrix);
                ++index;
            }
            if (err_1 > 0) {
                point[0] += x_inc;
                err_1 -= dy2;
            }
            if (err_2 > 0) {
                point[2] += z_inc;
                err_2 -= dy2;
            }
            err_1 += dx2;
            err_2 += dz2;
            point[1] += y_inc;
        }
    } else {
        err_1 = dy2 - n;
        err_2 = dx2 - n;
        for (i = 0; i < n; i++) {
            if (isInside(point[0], point[1], point[2], BoxX, BoxY, BoxZ) || !volconfig.LOR_clipping) {
                dummy.position.set(point[0], point[1], point[2]);
                dummy.updateMatrix();
                mesh.setMatrixAt(index, dummy.matrix);
                ++index;
            }
            if (err_1 > 0) {
                point[1] += y_inc;
                err_1 -= dz2;
            }
            if (err_2 > 0) {
                point[0] += x_inc;
                err_2 -= dz2;
            }
            err_1 += dy2;
            err_2 += dx2;
            point[2] += z_inc;
        }
    }
    if (isInside(point[0], point[1], point[2], BoxX, BoxY, BoxZ) || !volconfig.LOR_clipping) {
        dummy.position.set(point[0], point[1], point[2]);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
        ++index;
    }
    mesh.instanceMatrix.needsUpdate = true;
}

var index2 = 0;
function drawCylinder(x1, y1, z1, x2, y2, z2, cylinders_mesh) {
    var vstart = new THREE.Vector3(x1, y1, z1);
    var vend = new THREE.Vector3(x2, y2, z2);

    var distance = vstart.distanceTo(vend);

    const { x: ax, y: ay, z: az } = vstart;
    const { x: bx, y: by, z: bz } = vend;
    const stickAxis = new THREE.Vector3(bx - ax, by - ay, bz - az).normalize();

    const scale = new THREE.Vector3(1, distance, 1);
    const position = new THREE.Vector3((bx + ax) / 2, (by + ay) / 2, (bz + az) / 2);
    const quaternion = new THREE.Quaternion();

    const cylinderUpAxis = new THREE.Vector3(0, 1, 0);
    quaternion.setFromUnitVectors(cylinderUpAxis, stickAxis);

    const matrix = new THREE.Matrix4();
    matrix.compose(position, quaternion, scale);

    cylinders_mesh.setMatrixAt(index2, matrix);
    ++index2;
    cylinders_mesh.instanceMatrix.needsUpdate = true;
}


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

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
    stats1.update();
    stats2.update();
};
read();
animate();
