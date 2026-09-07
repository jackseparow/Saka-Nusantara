// Variable Global 3D
let scene, camera, renderer, controls;
let woodGroup; // Grup objek 3D untuk kayu

// Material Kayu
const woodMaterial1 = new THREE.MeshLambertMaterial({ color: 0x8B5A2B }); // Kayu Utama (Cokelat Tua)
const woodMaterial2 = new THREE.MeshLambertMaterial({ color: 0xCD853F }); // Kayu Kedua (Cokelat Muda)
const pinMaterial   = new THREE.MeshLambertMaterial({ color: 0xD2691E }); // Pasak (Cokelat Jingga)

// Inisialisasi Aplikasi
window.addEventListener('DOMContentLoaded', () => {
  initBlockly();
  initThreeJS();
  updateSimulation();
});

// 1. Inisialisasi Blockly
let workspace;
function initBlockly() {
  workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox'),
    scrollbars: true,
    zoom: { controls: true, wheel: true }
  });

  workspace.addChangeListener(updateSimulation);
}

// 2. Inisialisasi Engine Three.js Ala Tinkercad
function initThreeJS() {
  const container = document.getElementById('canvas3DContainer');
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe0e6ed); // Latar terang Tinkercad

  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(8, 7, 9);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Pencahayaan Terang Khas Tinkercad
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // Grup Induk Objek Kayu
  woodGroup = new THREE.Group();
  scene.add(woodGroup);

  // Workplane Grid Biru Muda Ala Tinkercad
  const gridHelper = new THREE.GridHelper(12, 24, 0x007acc, 0xa0c4df);
  gridHelper.position.y = -0.5;
  scene.add(gridHelper);

  // Sumbu Koordinat
  const axesHelper = new THREE.AxesHelper(4);
  scene.add(axesHelper);

  // Loop Render
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Responsive Resize
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// Handler Tombol Kamera Tinkercad
function resetCameraHome() {
  camera.position.set(8, 7, 9);
  controls.target.set(0, 0, 0);
  controls.update();
}

function zoomInCamera() {
  camera.position.multiplyScalar(0.85);
  controls.update();
}

function zoomOutCamera() {
  camera.position.multiplyScalar(1.15);
  controls.update();
}

// 3. Evaluasi Logika & Generasi Model Kayu 3D
function updateSimulation() {
  const topBlocks = workspace.getTopBlocks(true);
  
  if (topBlocks.length === 0 || topBlocks[0].type !== 'fungsi_sambungan') {
    resetUI();
    clearWoodScene();
    return;
  }

  const rootBlock = topBlocks[0];
  const fungsi = rootBlock.getFieldValue('FUNGSI');
  
  let teknik = 'Belum Dipilih';
  let arah = '-';
  let tumpukan = 0;
  let pakaiPasak = 'TIDAK';

  const teknikTarget = rootBlock.getInputTargetBlock('TEKNIK');
  if (teknikTarget) {
    teknik = teknikTarget.getFieldValue('TEKNIK_NAME');

    let modifTarget = teknikTarget.getInputTargetBlock('MODIFIKASI');
    while (modifTarget) {
      if (modifTarget.type === 'modifikasi_keratan') {
        arah = modifTarget.getFieldValue('ARAH');
        tumpukan = parseInt(modifTarget.getFieldValue('TUMPUKAN'));
      } else if (modifTarget.type === 'opsi_pasak') {
        pakaiPasak = modifTarget.getFieldValue('PAKAI_PASAK');
      }
      modifTarget = modifTarget.getNextBlock();
    }
  }

  // Hitung Skor Kekuatan
  let score = 0;
  if (teknik === 'DOVETAIL') score += 40;
  else if (teknik === 'MORTISE_TENON') score += 30;
  else if (teknik === 'LAP_JOINT') score += 15;

  score += (tumpukan * 15);
  if (pakaiPasak === 'YA') score += 20;

  // Update UI Text
  updateUIText(fungsi, teknik, arah, tumpukan, pakaiPasak, score);

  // Re-build 3D Model Kayu
  build3DWoodModel({ fungsi, teknik, arah, tumpukan, pakaiPasak });
}

function resetUI() {
  document.getElementById('resFungsi').innerText = '-';
  document.getElementById('resTeknik').innerText = '-';
  document.getElementById('resArah').innerText = '-';
  document.getElementById('resTumpukan').innerText = '-';
  document.getElementById('resPasak').innerText = '-';
  document.getElementById('resKekuatan').innerText = 'Belum Ada';
  document.getElementById('resKekuatan').className = 'badge';
  document.getElementById('codeOutput').innerText = '// Masukkan blok Kategori Fungsi sebagai dasar.';
}

function updateUIText(fungsi, teknik, arah, tumpukan, pakaiPasak, score) {
  let kekuatan = 'Rendah';
  let badgeClass = 'badge-warning';
  if (score >= 65) {
    kekuatan = 'Sangat Kokoh';
    badgeClass = 'badge-success';
  } else if (score >= 40) {
    kekuatan = 'Cukup Kuat';
    badgeClass = 'badge-info';
  }

  document.getElementById('resFungsi').innerText = fungsi;
  document.getElementById('resTeknik').innerText = teknik;
  document.getElementById('resArah').innerText = arah;
  document.getElementById('resTumpukan').innerText = tumpukan > 0 ? `${tumpukan} Lapis` : '-';
  document.getElementById('resPasak').innerText = pakaiPasak;
  
  const elKekuatan = document.getElementById('resKekuatan');
  elKekuatan.innerText = kekuatan;
  elKekuatan.className = `badge ${badgeClass}`;

  const configJSON = {
    app: "Saka Nusantara",
    fungsi: fungsi,
    teknik: teknik,
    parameter: {
      arah_keratan: arah,
      jumlah_keratan: tumpukan,
      dengan_pasak: pakaiPasak === 'YA'
    },
    calculated_strength_score: score
  };

  document.getElementById('codeOutput').innerText = JSON.stringify(configJSON, null, 2);
}

function clearWoodScene() {
  while (woodGroup.children.length > 0) {
    const obj = woodGroup.children[0];
    if (obj.geometry) obj.geometry.dispose();
    woodGroup.remove(obj);
  }
}

// 4. Pembentuk Geometri Kayu Berdasarkan Parameter Logika
function build3DWoodModel(config) {
  clearWoodScene();

  const { fungsi, tumpukan, pakaiPasak } = config;

  // Kayu 1 (Selalu Ada)
  const wood1Geo = new THREE.BoxGeometry(1, 1, 4);
  const wood1 = new THREE.Mesh(wood1Geo, woodMaterial1);
  woodGroup.add(wood1);

  // Kayu 2 (Diposisikan berdasarkan Orientasi Fungsi)
  const wood2Geo = new THREE.BoxGeometry(1, 1, 4);
  const wood2 = new THREE.Mesh(wood2Geo, woodMaterial2);

  if (fungsi === 'LURUS') {
    wood2.position.set(0, 0, 3.5); // Menyambung lurus di sumbu Z
  } else if (fungsi === 'SUDUT') {
    wood2.rotation.y = Math.PI / 2; // Berputar 90 derajat
    wood2.position.set(1.5, 0, 1.5);
  } else if (fungsi === 'SILANG') {
    wood2.rotation.y = Math.PI / 2;
    wood2.position.set(0, 0.8, 0); // Menumpuk silang (+)
  }

  woodGroup.add(wood2);

  // Visualisasi Jumlah Keratan / Tumpukan (Multilayer Notch)
  if (tumpukan > 0) {
    for (let i = 0; i < tumpukan; i++) {
      const notchGeo = new THREE.BoxGeometry(1.02, 0.2, 0.4);
      const notchMat = new THREE.MeshLambertMaterial({ color: 0x5c3a21 });
      const notch = new THREE.Mesh(notchGeo, notchMat);
      notch.position.set(0, (i * 0.25) - 0.2, 1.5);
      woodGroup.add(notch);
    }
  }

  // Visualisasi Pasak Tambahan
  if (pakaiPasak === 'YA') {
    const pinGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.6, 16);
    const pin = new THREE.Mesh(pinGeo, pinMaterial);
    
    if (fungsi === 'LURUS') {
      pin.position.set(0, 0, 2);
    } else {
      pin.position.set(0, 0.2, 1.5);
    }
    woodGroup.add(pin);
  }
}
