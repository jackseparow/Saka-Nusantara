/**
 * Definisi Blok Custom Saka Nusantara (Termasuk Blok Perakitan Sudut Parametrik)
 */

// 1. Tambah Benda Kerja
Blockly.Blocks['tambah_benda_kerja'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🪵 TAMBAH BENDA:")
        .appendField(new Blockly.FieldDropdown([
          ["Soko Guru (Tiang Vertikal)", "SOKO"],
          ["Blandar / Sunduk (Balok Horisontal)", "BLANDAR"],
          ["Skor / Sokong (Penguat Diagonal)", "DIAGONAL"],
          ["Ander (Pengunci Atas)", "ANDER"],
          ["Umpak (Alas Batu)", "UMPAK"]
        ]), "JENIS_BENDA");
    this.appendDummyInput()
        .appendField("📐 Dimensi (P x L x T):")
        .appendField(new Blockly.FieldNumber(1, 0.2, 10), "DIM_P")
        .appendField("x")
        .appendField(new Blockly.FieldNumber(1, 0.2, 10), "DIM_L")
        .appendField("x")
        .appendField(new Blockly.FieldNumber(4, 0.2, 10), "DIM_T");
    this.appendStatementInput("SUB_OPERASI")
        .appendField("Operasi / Perakitan:");
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setColour(140);
  }
};

// 2. BLOK BARU: Blok Perakitan & Orientasi Sudut (Nested Block)
Blockly.Blocks['rakit_sambungan'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔗 RAKIT / SAMBUNGKAN:")
        .appendField(new Blockly.FieldDropdown([
          ["Sambung Sudut (Siku / Diagonal)", "SUDUT"],
          ["Sambung Lurus (Memperpanjang)", "LURUS"]
        ]), "JENIS_SAMBUNGAN");
    this.appendDummyInput()
        .appendField("📐 Sudut Sambungan:")
        .appendField(new Blockly.FieldAngle(90), "SUDUT_DERAJAT")
        .appendField("Sumbu:")
        .appendField(new Blockly.FieldDropdown([
          ["Sumbu Y (Mendatar / Horizontal)", "Y"],
          ["Sumbu Z (Miring / Vertikal Diagonal)", "Z"],
          ["Sumbu X (Kemiringan Atap)", "X"]
        ]), "SUMBU_ROTASI");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(260);
    this.setTooltip("Rakit kayu dengan menentukan sudut kemiringan/persambungan (misal 90° untuk siku, 45° untuk penguat diagonal).");
  }
};

// 3. Coakan & Pasak Pengunci
Blockly.Blocks['fungsi_sambungan'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔨 Teknik Pahatan:")
        .appendField(new Blockly.FieldDropdown([
          ["Purus & Lubang (Mortise-Tenon)", "MORTISE"],
          ["Ekor Burung (Dovetail)", "DOVETAIL"],
          ["Takik Lurus (Lap Joint)", "LAP"]
        ]), "TIPE_SAMBUNGAN");
    this.appendDummyInput()
        .appendField("📏 Coakan:")
        .appendField(new Blockly.FieldDropdown([
          ["Kecil (2 cm)", "2"],
          ["Sedang (4 cm)", "4"],
          ["Besar (6 cm)", "6"]
        ]), "UKURAN_LUBANG")
        .appendField(" | Pasak:")
        .appendField(new Blockly.FieldDropdown([
          ["Tanpa Pasak", "0"],
          ["Kecil (2 cm)", "2"],
          ["Sedang (4 cm)", "4"],
          ["Besar (6 cm)", "6"]
        ]), "UKURAN_PASAK");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(200);
  }
};

// 4. Transformasi Posisi
Blockly.Blocks['transformasi_posisi'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📍 Geser Posisi ->")
        .appendField("X:")
        .appendField(new Blockly.FieldNumber(0, -10, 10), "POS_X")
        .appendField("Y:")
        .appendField(new Blockly.FieldNumber(0, 0, 10), "POS_Y")
        .appendField("Z:")
        .appendField(new Blockly.FieldNumber(0, -10, 10), "POS_Z");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(35);
  }
};

// 5. Tampilan Warna & Transparansi
Blockly.Blocks['transformasi_tampilan'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎨 Tampilan -> Warna:")
        .appendField(new Blockly.FieldDropdown([
          ["Cokelat Jati", "0x8B5A2B"],
          ["Cokelat Pinus", "0xCD853F"],
          ["Merah Kayu", "0xA0522D"],
          ["Abu-abu Batu", "0x7F8C8D"]
        ]), "WARNA")
        .appendField(" | Transparan:")
        .appendField(new Blockly.FieldDropdown([
          ["Padat (100%)", "1.0"],
          ["Semi Transparan (50%)", "0.5"],
          ["Sangat Transparan (20%)", "0.2"]
        ]), "OPASITAS");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(35);
  }
};
