// Variable Global 3D & Simulasi Fisika
let scene, camera, renderer, controls;
let worldGroup, gridHelper;
let workspace;
let isQuaking = false;
let quakeTime = 0;

// Menyimpan data fisik objek kayu
let activeWoodComponents = [];

const matSoko    = new THREE.MeshLambertMaterial({ color: 0x8B5A2B });
const matBlandar = new THREE.MeshLambertMaterial({ color: 0xCD853F });
const matAnder   = new THREE.MeshLambertMaterial({ color: 0xD2691E });
const matUmpak   = new THREE.MeshLambertMaterial({ color: 0x7f8c8d });

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

  worldGroup = new THREE.Group();
  scene.add(worldGroup);

  gridHelper = new THREE.GridHelper(16, 32, 0x007acc, 0xa0c4df);
  gridHelper.position.y = 0;
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(4);
  scene.add(axesHelper);

  // Loop Render & Engine Fisika Uji Gempa
  function animate() {
    requestAnimationFrame(animate);

    if (isQuaking) {
      quakeTime += 0.15;
      const shakeX = Math.sin(quakeTime * 4) * 0.2;
      const shakeZ = Math.cos(quakeTime * 3) * 0.2;
      gridHelper.position.x = shakeX;
      gridHelper.position.z = shakeZ;

      // Evaluasi Perilaku Fisika Tiap Kayu
      activeWoodComponents.forEach((item) => {
        const mesh = item.mesh;

        if (item.jointStatus === 'NO_JOINT') {
          // KASUS 1: Roboh & Ambruk ke Tanah (Tanpa Sambungan)
          if (mesh.position.y > 0.3) {
            mesh.position.y -= 0.15; // Jatuh gravitasi
            mesh.rotation.x += 0.08; // Terguling
            mesh.rotation.z += 0.08;
            mesh.position.x += (Math.random() - 0.5) * 0.1;
          } else {
            mesh.position.y = 0.3; // Tergeletak di tanah
          }
        } else if (item.jointStatus === 'LOOSE') {
          // KASUS 2: Mleyot Permanen (Lubang Longgar/Renggang)
          mesh.rotation.z = Math.sin(quakeTime) * 0.15 + 0.25; // Mleyot miring
          mesh.rotation.x = 0.1;
        } else if (item.jointStatus === 'PRECISE') {
          // KASUS 3: Meredam Gempa Secara Fleksibel & Tetap Kokoh
          mesh.rotation.z = Math.sin(quakeTime * 2) * 0.03;
        }
      });
    } else {
      gridHelper.position.set(0, 0, 0);
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

// Handler Simulasi Uji Gempa
function toggleEarthquake() {
  isQuaking = !isQuaking;
  const btn = document.getElementById('btnQuake');
  const status = document.getElementById('quakeStatus');

  if (isQuaking) {
    btn.classList.add('active');
    btn.innerText = '⏹️ Hentikan Gempa';
    status.innerText = '🫨 Gempa Berlangsung! Memeriksa Ketahanan...';
    status.style.color = '#e65100';
  } else {
    btn.classList.remove('active');
    btn.innerText = '🫨 Uji Gempa';
    updateSimulation(); // Reset posisi kayu setelah gempa
  }
}

// Generasi Bangunan 3D Berdasarkan Logika Blok
function updateSimulation() {
  if (!workspace || !worldGroup) return;

  while (worldGroup.children.length > 0) {
    const obj = worldGroup.children[0];
    if (obj.geometry) obj.geometry.dispose();
    worldGroup.remove(obj);
  }

  activeWoodComponents = [];
  const topBlocks = workspace.getTopBlocks(true);

  topBlocks.forEach((block) => {
    if (block.type === 'tambah_benda_kerja') {
      buildWoodComponent(block);
    }
  });

  // Update Teks Status
  evalOverallStatus();
}

function buildWoodComponent(block) {
  const jenis = block.getFieldValue('JENIS_BENDA');
  const p = parseFloat(block.getFieldValue('DIM_P'));
  const l = parseFloat(block.getFieldValue('DIM_L'));
  const t = parseFloat(block.getFieldValue('DIM_T'));

  let mat = matSoko;
  if (jenis === 'BLANDAR') mat = matBlandar;
  else if (jenis === 'ANDER') mat = matAnder;
  else if (jenis === 'UMPAK') mat = matUmpak;

  const geo = new THREE.BoxGeometry(p, t, l);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = t / 2; // Default berdiri di tanah

  let jointStatus = 'NO_JOINT'; // Default: Tidak ada sambungan
  let sizeLubang = 0;
  let sizePasak = 0;

  // Cek Blok Bersarang di Dalamnya
  let innerBlock = block.getInputTargetBlock('SUB_OPERASI');
  while (innerBlock) {
    if (innerBlock.type === 'transformasi_posisi') {
      mesh.position.x += parseFloat(innerBlock.getFieldValue('POS_X'));
      mesh.position.y += parseFloat(innerBlock.getFieldValue('POS_Y'));
      mesh.position.z += parseFloat(innerBlock.getFieldValue('POS_Z'));
    } else if (innerBlock.type === 'transformasi_rotasi') {
      const rotY = parseFloat(innerBlock.getFieldValue('ROT_Y'));
      mesh.rotation.y += (rotY * Math.PI) / 180;
    } else if (innerBlock.type === 'fungsi_sambungan') {
      sizeLubang = parseInt(innerBlock.getFieldValue('UKURAN_LUBANG'));
      sizePasak  = parseInt(innerBlock.getFieldValue('UKURAN_PASAK'));

      // Analisis Presisi Kuncian
      if (sizePasak === 0) {
        jointStatus = 'LOOSE'; // Mleyot (Tanpa Pasak)
      } else if (sizePasak === sizeLubang) {
        jointStatus = 'PRECISE'; // Presisi & Kokoh
      } else if (sizePasak < sizeLubang) {
        jointStatus = 'LOOSE'; // Longgar -> Mleyot
      } else {
        jointStatus = 'NO_JOINT'; // Terlalu besar -> Pasak tidak masuk -> Ambruk
      }
    }
    innerBlock = innerBlock.getNextBlock();
  }

  worldGroup.add(mesh);
  activeWoodComponents.push({ mesh, jointStatus, jenis });
}

function evalOverallStatus() {
  const status = document.getElementById('quakeStatus');
  if (!status) return;

  let hasNoJoint = activeWoodComponents.some(c => c.jointStatus === 'NO_JOINT');
  let hasLoose   = activeWoodComponents.some(c => c.jointStatus === 'LOOSE');

  if (activeWoodComponents.length === 0) {
    status.innerText = 'Status Bangunan: Belum Ada Kayu';
    status.style.color = '#666';
  } else if (hasNoJoint) {
    status.innerText = '⚠️ Bahaya: Ada Kayu Tanpa Sambungan (Rentan Ambruk!)';
    status.style.color = '#d32f2f';
  } else if (hasLoose) {
    status.innerText = '⚠️ Peringatan: Sambungan Longgar / Renggang (Bisa Mleyot!)';
    status.style.color = '#ff9800';
  } else {
    status.innerText = '✅ Bangunan Sangat Presisi & Tahan Gempa!';
    status.style.color = '#2e7d32';
  }
}
