/**
 * Definisi Blok Custom Saka Nusantara - Murni Nested Statement Input
 */

// 1. Blok Benda Kerja Dasar
Blockly.Blocks['tambah_benda_kerja'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🪵 BENDA KERJA:")
        .appendField(new Blockly.FieldDropdown([
          ["Soko Guru (Tiang)", "SOKO"],
          ["Blandar (Balok Mendatar)", "BLANDAR"],
          ["Skor (Penguat Diagonal)", "DIAGONAL"],
          ["Pasak Kayu (Pengunci)", "PASAK"],
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
        .appendField("Atur Pahatan & Transformasi:");
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setColour(140);
  }
};

// 2. Transformasi: Translasi (Geser Posisi di Ruang 3D)
Blockly.Blocks['transformasi_translasi'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📍 Geser Posisi ->")
        .appendField("X:")
        .appendField(new Blockly.FieldNumber(0, -10, 10), "POS_X")
        .appendField("Y (Mendatar):")
        .appendField(new Blockly.FieldNumber(0, -10, 10), "POS_Y")
        .appendField("Z (Tinggi):")
        .appendField(new Blockly.FieldNumber(0, 0, 10), "POS_Z");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(35);
  }
};

// 3. Transformasi: Rotasi Kustom
Blockly.Blocks['transformasi_rotasi_pivot'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔄 Rotasi -> Sudut:")
        .appendField(new Blockly.FieldNumber(90, -360, 360), "SUDUT")
        .appendField("° pada Sumbu:")
        .appendField(new Blockly.FieldDropdown([
          ["Sumbu Z (Vertikal)", "Z"],
          ["Sumbu X (Mendatar)", "X"],
          ["Sumbu Y (Miring)", "Y"]
        ]), "SUMBU");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(35);
  }
};

// 4. Pahatan & Coakan Sambungan
Blockly.Blocks['fungsi_sambungan'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔨 Coakan/Takikan:")
        .appendField(new Blockly.FieldDropdown([
          ["Purus & Lubang", "MORTISE"],
          ["Ekor Burung", "DOVETAIL"],
          ["Takik Lurus", "LAP"]
        ]), "TIPE_SAMBUNGAN");
    this.appendDummyInput()
        .appendField("📏 Ukuran Coakan:")
        .appendField(new Blockly.FieldDropdown([
          ["2 cm", "2"],
          ["4 cm", "4"],
          ["6 cm", "6"]
        ]), "UKURAN_LUBANG")
        .appendField(" | Pasak:")
        .appendField(new Blockly.FieldDropdown([
          ["Tanpa Pasak", "0"],
          ["2 cm", "2"],
          ["4 cm", "4"],
          ["6 cm", "6"]
        ]), "UKURAN_PASAK");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(200);
  }
};

// 5. BLOK RAKIT TRUE NESTED (Dua Slot Statement Input Bersusun)
Blockly.Blocks['rakit_dua_benda'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔗 RAKIT / GABUNGKAN BENDA");
    this.appendStatementInput("BENDA_1")
        .appendField("📌 Benda 1 (Utama / Base):");
    this.appendStatementInput("BENDA_2")
        .appendField("🧩 Benda 2 (Sambungan / Pasak):");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(260);
    this.setTooltip("Gabungkan dua benda kerja yang sudah dipahat dan diatur posisinya menjadi satu kesatuan struktur.");
  }
};

// XML Toolbox Dynamic String
window.SAKA_TOOLBOX_XML = `
<xml>
  <category name="1. Benda Kerja" colour="#2e7d32">
    <block type="tambah_benda_kerja"></block>
  </category>
  <category name="2. Transformasi &amp; Posisi" colour="#f57c00">
    <block type="transformasi_translasi"></block>
    <block type="transformasi_rotasi_pivot"></block>
  </category>
  <category name="3. Pahatan &amp; Coakan" colour="#0288d1">
    <block type="fungsi_sambungan"></block>
  </category>
  <category name="4. Rakit / Gabungkan" colour="#4a148c">
    <block type="rakit_dua_benda"></block>
  </category>
</xml>
`;
