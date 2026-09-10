// Variable Global Three.js & Engine Fisika
let scene, camera, renderer, controls;
let worldGroup, gridStrimin;
let workspace;
let isQuaking = false;
let quakeTime = 0;

let assembledGroups = [];

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
  camera.position.set(15, 12, 18);

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

  // PRESISI STRIMIN 1-TO-1 (Grid di-offset 0.5 agar kotak menampung persis koordinat bulat)
  gridStrimin = new THREE.GridHelper(30, 30, 0x0055ff, 0xa0c4df);
  gridStrimin.position.set(0.5, 0, 0.5); 
  scene.add(gridStrimin);

  // Sumbu Koordinat (X=Merah, Y=Hijau/Tinggi, Z=Biru)
  const axesHelper = new THREE.AxesHelper(6);
  axesHelper.position.set(0, 0.01, 0);
  scene.add(axesHelper);

  function animate() {
    requestAnimationFrame(animate);

    if (isQuaking) {
      quakeTime += 0.15;
      const shakeX = Math.sin(quakeTime * 4) * 0.25;
      const shakeY = Math.cos(quakeTime * 3) * 0.25;
      
      gridStrimin.position.x = 0.5 + shakeX;
      gridStrimin.position.z = 0.5 + shakeY;

      assembledGroups.forEach((groupData) => {
        const grp = groupData.groupObject;

        if (groupData.isLocked) {
          grp.rotation.z = Math.sin(quakeTime * 2) * 0.02;
          grp.rotation.x = Math.cos(quakeTime * 2) * 0.02;
        } else {
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
      gridStrimin.position.set(0.5, 0, 0.5);
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
    camera.position.set(15, 12, 18);
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
    
    let allLocked = assembledGroups.length > 0 && assembledGroups.every(g => g.isLocked);

    if (assembledGroups.length === 0) {
      status.innerText = 'Status: Belum ada rakitan kayu di tanah!';
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

function updateSimulation() {
  if (!workspace || !worldGroup) return;

  while (worldGroup.children.length > 0) {
    const obj = worldGroup.children[0];
    if (obj.geometry) obj.geometry.dispose();
    worldGroup.remove(obj);
  }

  assembledGroups = [];
  const topBlocks = workspace.getTopBlocks(true);

  topBlocks.forEach((block) => {
    if (block.type === 'rakit_dua_benda') {
      processRakitBlock(block);
    } else if (block.type === 'tambah_benda_kerja') {
      const standaloneGroup = new THREE.Group();
      const res = buildSingleMesh(block);
      if (res.mesh) {
        standaloneGroup.add(res.mesh);
        worldGroup.add(standaloneGroup);
        assembledGroups.push({ groupObject: standaloneGroup, isLocked: res.isPresise });
      }
    }
  });
}

function processRakitBlock(rakitBlock) {
  const combinedGroup = new THREE.Group();
  let isAllPrecise = true;

  const b1Block = rakitBlock.getInputTargetBlock('BENDA_1');
  if (b1Block && b1Block.type === 'tambah_benda_kerja') {
    const res1 = buildSingleMesh(b1Block);
    if (res1.mesh) {
      combinedGroup.add(res1.mesh);
      if (!res1.isPresise) isAllPrecise = false;
    }
  }

  const b2Block = rakitBlock.getInputTargetBlock('BENDA_2');
  if (b2Block && b2Block.type === 'tambah_benda_kerja') {
    const res2 = buildSingleMesh(b2Block);
    if (res2.mesh) {
      combinedGroup.add(res2.mesh);
      if (!res2.isPresise) isAllPrecise = false;
    }
  }

  worldGroup.add(combinedGroup);
  assembledGroups.push({
    groupObject: combinedGroup,
    isLocked: isAllPrecise
  });
}

function buildSingleMesh(block) {
  const jenis = block.getFieldValue('JENIS_BENDA');
  const p     = Math.max(0.2, parseFloat(block.getFieldValue('DIM_P')) || 1);
  const l     = Math.max(0.2, parseFloat(block.getFieldValue('DIM_L')) || 1);
  const t     = Math.max(0.2, parseFloat(block.getFieldValue('DIM_T')) || 4);

  let colorVal = 0x8B5A2B;
  if (jenis === 'BLANDAR') colorVal = 0xCD853F;
  else if (jenis === 'DIAGONAL') colorVal = 0xA0522D;
  else if (jenis === 'PASAK') colorVal = 0xD2691E;
  else if (jenis === 'UMPAK') colorVal = 0x7F8C8D;

  const mat = new THREE.MeshLambertMaterial({
    color: colorVal,
    transparent: false,
    opacity: 1.0
  });

  const geo = new THREE.BoxGeometry(p, t, l);
  // PIVOT GEOMETRI PRESISI: Di sudut Bawah-Kiri-Depan (0,0,0)
  geo.translate(p / 2, t / 2, l / 2);

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, 0, 0);

  let isPresise = false;

  let innerBlock = block.getInputTargetBlock('SUB_OPERASI');
  while (innerBlock) {
    if (innerBlock.type === 'transformasi_translasi') {
      mesh.position.x += parseFloat(innerBlock.getFieldValue('POS_X')) || 0;
      mesh.position.z += parseFloat(innerBlock.getFieldValue('POS_Y')) || 0; 
      mesh.position.y += parseFloat(innerBlock.getFieldValue('POS_Z')) || 0; 
    } else if (innerBlock.type === 'transformasi_rotasi_pivot') {
      const angle  = parseFloat(innerBlock.getFieldValue('SUDUT')) || 0;
      const axis   = innerBlock.getFieldValue('SUMBU');
      const pivotX = parseFloat(innerBlock.getFieldValue('PIVOT_X')) || 0;
      const pivotY = parseFloat(innerBlock.getFieldValue('PIVOT_Y')) || 0;
      const pivotZ = parseFloat(innerBlock.getFieldValue('PIVOT_Z')) || 0;
      const rad    = (angle * Math.PI) / 180;

      const pivotVector = new THREE.Vector3(pivotX, pivotZ, pivotY);
      mesh.position.sub(pivotVector);
      
      if (axis === 'Z') mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rad);
      else if (axis === 'X') mesh.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), rad);
      else if (axis === 'Y') mesh.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), rad);

      if (axis === 'Z') mesh.rotation.y += rad;
      else if (axis === 'X') mesh.rotation.x += rad;
      else if (axis === 'Y') mesh.rotation.z += rad;

      mesh.position.add(pivotVector);

    } else if (innerBlock.type === 'transformasi_tampilan') {
      const c  = parseInt(innerBlock.getFieldValue('WARNA'));
      const op = parseFloat(innerBlock.getFieldValue('OPASITAS'));
      if (!isNaN(c)) mesh.material.color.setHex(c);
      if (!isNaN(op)) {
        mesh.material.opacity = op;
        mesh.material.transparent = op < 1.0;
      }
    } else if (innerBlock.type === 'fungsi_sambungan') {
      const sizeLubang = parseInt(innerBlock.getFieldValue('UKURAN_LUBANG'));
      const sizePasak  = parseInt(innerBlock.getFieldValue('UKURAN_PASAK'));
      isPresise = (sizePasak === sizeLubang && sizePasak > 0);
    }
    innerBlock = innerBlock.getNextBlock();
  }

  return { mesh, isPresise };
}
