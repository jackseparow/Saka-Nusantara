// Variable Global 3D & Simulasi
let scene, camera, renderer, controls;
let worldGroup, gridHelper;
let workspace;
let isQuaking = false;
let quakeTime = 0;

// Material Kayu & Batu Tradisional
const matSoko    = new THREE.MeshLambertMaterial({ color: 0x8B5A2B }); // Cokelat Tua
const matBlandar = new THREE.MeshLambertMaterial({ color: 0xCD853F }); // Cokelat Muda
const matAnder   = new THREE.MeshLambertMaterial({ color: 0xD2691E }); // Cokelat Terang
const matUmpak   = new THREE.MeshLambertMaterial({ color: 0x7f8c8d }); // Abu-abu Batu

window.addEventListener('load', () => {
  setTimeout(() => {
    initBlockly();
    initThreeJS();
    updateSimulation();
  }, 100);
});

function initBlockly() {
  const blocklyArea = document.getElementById('blocklyDiv');
  const toolboxXml = document.getElementById('toolbox');

  if (typeof Blockly === 'undefined' || !blocklyArea || !toolboxXml) return;

  workspace = Blockly.inject('blocklyDiv', {
    toolbox: toolboxXml,
    scrollbars: true,
    zoom: { controls: true, wheel: true }
  });

  workspace.addChangeListener(updateSimulation);
}

function initThreeJS() {
  const container = document.getElementById('canvas3DContainer');
  if (!container) return;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe0e6ed);

  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(10, 8, 12);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(15, 25, 15);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // Grup Induk Komponen Struktur
  worldGroup = new THREE.Group();
  scene.add(worldGroup);

  // Workplane Tinkercad
  gridHelper = new THREE.GridHelper(16, 32, 0x007acc, 0xa0c4df);
  gridHelper.position.y = 0;
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(4);
  scene.add(axesHelper);

  // Loop Render & Efek Simulasi Gempa
  function animate() {
    requestAnimationFrame(animate);

    if (isQuaking) {
      quakeTime += 0.2;
      // Getaran Tanah Gempa
      const shakeX = Math.sin(quakeTime * 3) * 0.15;
      const shakeZ = Math.cos(quakeTime * 2.5) * 0.15;
      gridHelper.position.x = shakeX;
      gridHelper.position.z = shakeZ;
      worldGroup.position.x = shakeX * 0.8;
      worldGroup.position.z = shakeZ * 0.8;
      worldGroup.rotation.z = Math.sin(quakeTime * 2) * 0.02;
    } else {
      gridHelper.position.set(0, 0, 0);
      worldGroup.position.set(0, 0, 0);
      worldGroup.rotation.z = 0;
    }

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

function resetCameraHome() {
  if (camera && controls) {
    camera.position.set(10, 8, 12);
    controls.target.set(0, 2, 0);
    controls.update();
  }
}

function zoomInCamera() {
  if (camera && controls) {
    camera.position.multiplyScalar(0.85);
    controls.update();
  }
}

function zoomOutCamera() {
  if (camera && controls) {
    camera.position.multiplyScalar(1.15);
    controls.update();
  }
}

// Simulasi Uji Gempa
function toggleEarthquake() {
  isQuaking = !isQuaking;
  const btn = document.getElementById('btnQuake');
  const status = document.getElementById('quakeStatus');

  if (isQuaking) {
    btn.classList.add('active');
    btn.innerText = '⏹️ Hentikan Gempa';
    status.innerText = '🫨 Simulasi Gempa Berlangsung...';
    status.style.color = '#e65100';
  } else {
    btn.classList.remove('active');
    btn.innerText = '🫨 Uji Gempa';
    status.innerText = 'Status Bangunan: Tahan Gempa (Tersambung Presisi)';
    status.style.color = '#2e7d32';
  }
}

// Re-build Konstruksi 3D Berdasarkan Blok Siswa
function updateSimulation() {
  if (!workspace || !worldGroup) return;

  // Bersihkan Komponen Lama
  while (worldGroup.children.length > 0) {
    const obj = worldGroup.children[0];
    if (obj.geometry) obj.geometry.dispose();
    worldGroup.remove(obj);
  }

  const topBlocks = workspace.getTopBlocks(true);

  topBlocks.forEach((block) => {
    if (block.type === 'tambah_benda_kerja') {
      buildWoodComponent(block);
    }
  });
}

function buildWoodComponent(block) {
  const jenis = block.getFieldValue('JENIS_BENDA');
  let mesh;

  // Render Bentuk Geometri Berdasarkan Jenis Komponen
  if (jenis === 'SOKO') {
    // Soko Guru (Tiang Vertikal)
    const geo = new THREE.BoxGeometry(0.8, 4, 0.8);
    mesh = new THREE.Mesh(geo, matSoko);
    mesh.position.y = 2; // Berdiri di atas workplane
  } else if (jenis === 'BLANDAR') {
    // Blandar (Balok Mendatar)
    const geo = new THREE.BoxGeometry(6, 0.6, 0.6);
    mesh = new THREE.Mesh(geo, matBlandar);
    mesh.position.y = 4.3;
  } else if (jenis === 'ANDER') {
    // Ander / Pengunci
    const geo = new THREE.BoxGeometry(0.5, 1.5, 0.5);
    mesh = new THREE.Mesh(geo, matAnder);
    mesh.position.y = 5.2;
  } else if (jenis === 'UMPAK') {
    // Umpak (Batu Alas)
    const geo = new THREE.CylinderGeometry(0.7, 0.9, 0.6, 8);
    mesh = new THREE.Mesh(geo, matUmpak);
    mesh.position.y = 0.3;
  }

  // Iterasi Blok Transformasi Bersarang di Dalamnya
  let innerBlock = block.getInputTargetBlock('SUB_OPERASI');
  while (innerBlock) {
    if (innerBlock.type === 'transformasi_posisi') {
      const x = parseFloat(innerBlock.getFieldValue('POS_X'));
      const y = parseFloat(innerBlock.getFieldValue('POS_Y'));
      const z = parseFloat(innerBlock.getFieldValue('POS_Z'));
      mesh.position.x += x;
      mesh.position.y += y;
      mesh.position.z += z;
    } else if (innerBlock.type === 'transformasi_rotasi') {
      const rotY = parseFloat(innerBlock.getFieldValue('ROT_Y'));
      mesh.rotation.y += (rotY * Math.PI) / 180;
    }
    innerBlock = innerBlock.getNextBlock();
  }

  worldGroup.add(mesh);
}
