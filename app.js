// Variable Global 3D & Fisika
let scene, camera, renderer, controls;
let worldGroup, gridHelper;
let workspace;
let isQuaking = false;
let quakeTime = 0;

let activeWoodComponents = [];

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

  // Engine Fisika Simulasi Gempa
  function animate() {
    requestAnimationFrame(animate);

    if (isQuaking) {
      quakeTime += 0.15;
      const shakeX = Math.sin(quakeTime * 4) * 0.2;
      const shakeZ = Math.cos(quakeTime * 3) * 0.2;
      gridHelper.position.x = shakeX;
      gridHelper.position.z = shakeZ;

      activeWoodComponents.forEach((item) => {
        const mesh = item.mesh;

        if (item.jointStatus === 'NO_JOINT') {
          // KASUS 1: Roboh & Ambruk ke Tanah
          if (mesh.position.y > 0.3) {
            mesh.position.y -= 0.15;
            mesh.rotation.x += 0.08;
            mesh.rotation.z += 0.08;
            mesh.position.x += (Math.random() - 0.5) * 0.1;
          } else {
            mesh.position.y = 0.3;
          }
        } else if (item.jointStatus === 'LOOSE') {
          // KASUS 2: Mleyot (Miring jika tidak ada penguat diagonal/pasak presisi)
          const mleyotFactor = item.hasDiagonalBrace ? 0.02 : 0.2; // Penguat diagonal mengurangi mleyot!
          mesh.rotation.z = Math.sin(quakeTime) * mleyotFactor + (item.hasDiagonalBrace ? 0 : 0.25);
          mesh.rotation.x = 0.05;
        } else if (item.jointStatus === 'PRECISE') {
          // KASUS 3: Kokoh Meredam Gempa
          const dampFactor = item.hasDiagonalBrace ? 0.01 : 0.03;
          mesh.rotation.z = Math.sin(quakeTime * 2) * dampFactor;
        }
      });
    } else {
      gridHelper.position.set(0, 0, 0);
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
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
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

function toggleEarthquake() {
  isQuaking = !isQuaking;
  const btn = document.getElementById('btnQuake');
  const status = document.getElementById('quakeStatus');

  if (isQuaking) {
    btn.classList.add('active');
    btn.innerText = '⏹️ Hentikan Gempa';
    
    let hasNoJoint = activeWoodComponents.some(c => c.jointStatus === 'NO_JOINT');
    let hasLoose   = activeWoodComponents.some(c => c.jointStatus === 'LOOSE');
    let hasDiagonal = activeWoodComponents.some(c => c.hasDiagonalBrace);

    if (activeWoodComponents.length === 0) {
      status.innerText = 'Status: Belum ada kayu untuk diuji!';
      status.style.color = '#666';
    } else if (hasNoJoint) {
      status.innerText = '💥 BANGUNAN AMBRUK! (Ada kayu tanpa perakitan/sambungan)';
      status.style.color = '#d32f2f';
    } else if (hasLoose && !hasDiagonal) {
      status.innerText = '⚠️ BANGUNAN MLEYOT! (Sambungan longgar & tanpa penguat diagonal)';
      status.style.color = '#ff9800';
    } else {
      status.innerText = '✅ BANGUNAN KOKOH & TAHAN GEMPA!';
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

  activeWoodComponents = [];
  const topBlocks = workspace.getTopBlocks(true);

  topBlocks.forEach((block) => {
    if (block.type === 'tambah_benda_kerja') {
      buildWoodComponent(block);
    }
  });
}

function buildWoodComponent(block) {
  const jenis = block.getFieldValue('JENIS_BENDA');
  const p = parseFloat(block.getFieldValue('DIM_P'));
  const l = parseFloat(block.getFieldValue('DIM_L'));
  const t = parseFloat(block.getFieldValue('DIM_T'));

  let colorVal = 0x8B5A2B;
  if (jenis === 'BLANDAR') colorVal = 0xCD853F;
  else if (jenis === 'DIAGONAL') colorVal = 0xA0522D;
  else if (jenis === 'ANDER') colorVal = 0xD2691E;
  else if (jenis === 'UMPAK') colorVal = 0x7F8C8D;

  const mat = new THREE.MeshLambertMaterial({
    color: colorVal,
    transparent: false,
    opacity: 1.0
  });

  const geo = new THREE.BoxGeometry(p, t, l);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = t / 2;

  let jointStatus = 'NO_JOINT';
  let hasDiagonalBrace = (jenis === 'DIAGONAL');

  // Iterasi Blok Operasi Bersarang
  let innerBlock = block.getInputTargetBlock('SUB_OPERASI');
  while (innerBlock) {
    if (innerBlock.type === 'rakit_sambungan') {
      const angle = parseFloat(innerBlock.getFieldValue('SUDUT_DERAJAT'));
      const axis  = innerBlock.getFieldValue('SUMBU_ROTASI');
      const rad = (angle * Math.PI) / 180;

      if (axis === 'Y') mesh.rotation.y += rad;
      else if (axis === 'Z') mesh.rotation.z += rad;
      else if (axis === 'X') mesh.rotation.x += rad;

      // Rotasi 45 Derajat menandakan penguat diagonal
      if (Math.abs(angle % 180) === 45) {
        hasDiagonalBrace = true;
      }
    } else if (innerBlock.type === 'transformasi_posisi') {
      mesh.position.x += parseFloat(innerBlock.getFieldValue('POS_X'));
      mesh.position.y += parseFloat(innerBlock.getFieldValue('POS_Y'));
      mesh.position.z += parseFloat(innerBlock.getFieldValue('POS_Z'));
    } else if (innerBlock.type === 'transformasi_tampilan') {
      const c = parseInt(innerBlock.getFieldValue('WARNA'));
      const op = parseFloat(innerBlock.getFieldValue('OPASITAS'));
      mesh.material.color.setHex(c);
      mesh.material.opacity = op;
      mesh.material.transparent = op < 1.0;
    } else if (innerBlock.type === 'fungsi_sambungan') {
      const sizeLubang = parseInt(innerBlock.getFieldValue('UKURAN_LUBANG'));
      const sizePasak  = parseInt(innerBlock.getFieldValue('UKURAN_PASAK'));

      if (sizePasak === 0) {
        jointStatus = 'LOOSE';
      } else if (sizePasak === sizeLubang) {
        jointStatus = 'PRECISE';
      } else if (sizePasak < sizeLubang) {
        jointStatus = 'LOOSE';
      } else {
        jointStatus = 'NO_JOINT';
      }
    }
    innerBlock = innerBlock.getNextBlock();
  }

  worldGroup.add(mesh);
  activeWoodComponents.push({ mesh, jointStatus, jenis, hasDiagonalBrace });
}
