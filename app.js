// Variable Global Three.js & Engine Fisika
let scene, camera, renderer, controls;
let worldGroup, gridStrimin;
let workspace;
let isQuaking = false;
let quakeTime = 0;

// Registry Objek Kayu
let woodRegistry = {}; // Menyimpan mesh berdasarkan ID
let assembledGroups = []; // Menyimpan kesatuan kelompok rakitan

window.addEventListener('load', () => {
  setTimeout(() => {
    initBlockly();
    initThreeJS();
    initSplitter();
    updateSimulation();
  }, 100);
});

function initSplitter() {
  const splitter = document.getElementById('dragSplitter');
  const leftPanel = document.getElementById('blocklyDiv');
  const container = document.getElementById('main-container');
  let isDragging = false;

  if (!splitter || !leftPanel || !container) return;

  splitter.addEventListener('mousedown', () => {
    isDragging = true;
    document.body.style.cursor = 'col-resize';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const containerRect = container.getBoundingClientRect();
    let newLeftWidth = e.clientX - containerRect.left;
    
    if (newLeftWidth < 200) newLeftWidth = 200;
    if (newLeftWidth > containerRect.width - 200) newLeftWidth = containerRect.width - 200;

    leftPanel.style.width = `${newLeftWidth}px`;
    if (workspace) Blockly.svgResize(workspace);
    onWindowResize();
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      document.body.style.cursor = 'default';
    }
  });
}

function initBlockly() {
  const blocklyArea = document.getElementById('blocklyDiv');
  if (typeof Blockly === 'undefined' || !blocklyArea) return;

  workspace = Blockly.inject('blocklyDiv', {
    toolbox: window.SAKA_TOOLBOX_XML,
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
  camera.position.set(12, 10, 14);

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

  // 1. Grid Strimin Workplane Khas Tinkercad
  gridStrimin = new THREE.GridHelper(20, 40, 0x0055ff, 0xa0c4df);
  gridStrimin.position.y = 0;
  scene.add(gridStrimin);

  // 2. Panah Sumbu Koordinat (X=Merah, Y=Hijau, Z=Biru/Vertikal)
  const axesHelper = new THREE.AxesHelper(5);
  axesHelper.position.set(0, 0.01, 0);
  scene.add(axesHelper);

  // Loop Render & Engine Fisika Uji Gempa
  function animate() {
    requestAnimationFrame(animate);

    if (isQuaking) {
      quakeTime += 0.15;
      const shakeX = Math.sin(quakeTime * 4) * 0.25;
      const shakeY = Math.cos(quakeTime * 3) * 0.25;
      
      gridStrimin.position.x = shakeX;
      gridStrimin.position.z = shakeY;

      // Efek Gempa pada Seluruh Kesatuan Struktur
      assembledGroups.forEach((groupData) => {
        const grp = groupData.groupObject;

        if (groupData.isLocked) {
          // Kesatuan Terikat Sempurna: Meredam Getaran Bersama
          grp.rotation.z = Math.sin(quakeTime * 2) * 0.02;
          grp.rotation.x = Math.cos(quakeTime * 2) * 0.02;
        } else {
          // Kuncian Longgar/Tanpa Sambungan: Ambruk / Terpisah
          grp.children.forEach((child) => {
            if (child.position.y > 0.3) {
              child.position.y -= 0.12;
              child.rotation.x += 0.05;
              child.rotation.z += 0.05;
            } else {
              child.position.y = 0.3;
            }
          });
        }
      });
    } else {
      gridStrimin.position.set(0, 0, 0);
    }

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  const container = document.getElementById('canvas3DContainer');
  if (!container || !camera || !renderer) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function resetCameraHome() {
  if (camera && controls) {
    camera.position.set(12, 10, 14);
    controls.target.set(0, 2, 0);
    controls.update();
  }
}

function zoomInCamera() {
  if (camera && controls) { camera.position.multiplyScalar(0.85); controls.update(); }
}

function zoomOutCamera() {
  if (camera && controls) { camera.position.multiplyScalar(1.15); controls.update(); }
}

function toggleEarthquake() {
  isQuaking = !isQuaking;
  const btn = document.getElementById('btnQuake');
  const status = document.getElementById('quakeStatus');

  if (isQuaking) {
    btn.classList.add('active');
    btn.innerText = '⏹️ Hentikan Gempa';
    
    let allLocked = assembledGroups.every(g => g.isLocked);

    if (Object.keys(woodRegistry).length === 0) {
      status.innerText = 'Status: Belum ada kayu di tanah!';
      status.style.color = '#666';
    } else if (!allLocked) {
      status.innerText = '💥 STRUKTUR AMBRUK! (Ada sambungan yang tidak terkunci presisi)';
      status.style.color = '#d32f2f';
    } else {
      status.innerText = '✅ STRUKTUR UTUH & TAHAN GEMPA!';
      status.style.color = '#2e7d32';
    }
  } else {
    btn.classList.remove('active');
    btn.innerText = '🫨 Uji Gempa';
    status.innerText = 'Status Bangunan: Siap Diuji';
    status.style.color = '#333';
    updateSimulation();
  }
}

// Executer Utama Pemroses Logika Blok
function updateSimulation() {
  if (!workspace || !worldGroup) return;

  // Clear Scene
  while (worldGroup.children.length > 0) {
    const obj = worldGroup.children[0];
    if (obj.geometry) obj.geometry.dispose();
    worldGroup.remove(obj);
  }

  woodRegistry = {};
  assembledGroups = [];

  const topBlocks = workspace.getTopBlocks(true);

  // Tahap 1: Buat Benda Kerja di Tanah
  topBlocks.forEach((block) => {
    if (block.type === 'tambah_benda_kerja') {
      createWoodOnGround(block);
    }
  });

  // Tahap 2: Proses Perakitan Berjenjang
  topBlocks.forEach((block) => {
    if (block.type === 'rakit_dua_benda') {
      processAssemblyBlock(block);
    }
  });
}

function createWoodOnGround(block) {
  const jenis = block.getFieldValue('JENIS_BENDA');
  const id    = block.getFieldValue('ID_BENDA') || 'kayu_' + Math.random().toString(36).substr(2, 4);
  const p     = Math.max(0.2, parseFloat(block.getFieldValue('DIM_P')) || 1);
  const l     = Math.max(0.2, parseFloat(block.getFieldValue('DIM_L')) || 1);
  const t     = Math.max(0.2, parseFloat(block.getFieldValue('DIM_T')) || 4);

  let colorVal = 0x8B5A2B; // Soko (Cokelat Jati)
  if (jenis === 'BLANDAR') colorVal = 0xCD853F;
  else if (jenis === 'DIAGONAL') colorVal = 0xA0522D;
  else if (jenis === 'UMPAK') colorVal = 0x7F8C8D;

  const mat = new THREE.MeshLambertMaterial({ color: colorVal });
  const geo = new THREE.BoxGeometry(p, t, l);
  const mesh = new THREE.Mesh(geo, mat);
  
  // Posisi Awal di Tanah/Workplane (Sumbu Z Vertikal Three.js)
  mesh.position.set(0, t / 2, 0);

  let jointData = { hasJoint: false, isPresise: false };

  // Iterasi Transformasi (Translasi & Rotasi Pivot)
  let innerBlock = block.getInputTargetBlock('SUB_OPERASI');
  while (innerBlock) {
    if (innerBlock.type === 'transformasi_translasi') {
      mesh.position.x += parseFloat(innerBlock.getFieldValue('POS_X')) || 0;
      mesh.position.z += parseFloat(innerBlock.getFieldValue('POS_Y')) || 0; // Y di UI = Z di 3D
      mesh.position.y += parseFloat(innerBlock.getFieldValue('POS_Z')) || 0; // Z di UI = Y (Tinggi)
    } else if (innerBlock.type === 'transformasi_rotasi_pivot') {
      const angle = parseFloat(innerBlock.getFieldValue('SUDUT')) || 0;
      const axis  = innerBlock.getFieldValue('SUMBU');
      const pivot = innerBlock.getFieldValue('PIVOT');
      const rad   = (angle * Math.PI) / 180;

      // Geser Pivot
      if (pivot === 'START') mesh.geometry.translate(0, t / 2, 0);
      else if (pivot === 'END') mesh.geometry.translate(0, -t / 2, 0);

      if (axis === 'Z') mesh.rotation.y += rad;
      else if (axis === 'X') mesh.rotation.x += rad;
      else if (axis === 'Y') mesh.rotation.z += rad;
    } else if (innerBlock.type === 'fungsi_sambungan') {
      const sizeLubang = parseInt(innerBlock.getFieldValue('UKURAN_LUBANG'));
      const sizePasak  = parseInt(innerBlock.getFieldValue('UKURAN_PASAK'));
      jointData.hasJoint = true;
      jointData.isPresise = (sizePasak === sizeLubang && sizePasak > 0);
    }
    innerBlock = innerBlock.getNextBlock();
  }

  // Buat Grup Induk untuk Objek Ini
  const singleGroup = new THREE.Group();
  singleGroup.add(mesh);
  worldGroup.add(singleGroup);

  // Daftarkan di Registry
  woodRegistry[id] = {
    group: singleGroup,
    mesh: mesh,
    jointData: jointData
  };

  assembledGroups.push({
    groupObject: singleGroup,
    isLocked: jointData.isPresise
  });
}

function processAssemblyBlock(block) {
  const idInduk = block.getFieldValue('ID_INDUK');
  const idAnak  = block.getFieldValue('ID_ANAK');

  const objInduk = woodRegistry[idInduk];
  const objAnak  = woodRegistry[idAnak];

  if (objInduk && objAnak) {
    // Gabungkan Objek Anak ke dalam Grup Induk (Parent-Child Grouping)
    objInduk.group.add(objAnak.mesh);

    // Kunci Status Gabungan
    const isBothPrecise = objInduk.jointData.isPresise && objAnak.jointData.isPresise;
    
    // Update Registry Assembled Groups
    const indexAnakGroup = assembledGroups.findIndex(g => g.groupObject === objAnak.group);
    if (indexAnakGroup !== -1) {
      assembledGroups.splice(indexAnakGroup, 1); // Hapus grup terpisah milik anak
    }

    const parentGroupData = assembledGroups.find(g => g.groupObject === objInduk.group);
    if (parentGroupData) {
      parentGroupData.isLocked = isBothPrecise;
    }
  }
}
