/**
 * Definisi Blok Custom Saka Nusantara - Alur Perakitan Berjenjang
 */

// 1. Benda Kerja Dasar
Blockly.Blocks['tambah_benda_kerja'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🪵 BENDA KERJA:")
        .appendField(new Blockly.FieldDropdown([
          ["Soko Guru (Tiang)", "SOKO"],
          ["Blandar (Balok Mendatar)", "BLANDAR"],
          ["Skor (Penguat Diagonal)", "DIAGONAL"],
          ["Umpak (Alas Batu)", "UMPAK"]
        ]), "JENIS_BENDA")
        .appendField("Nama ID:")
        .appendField(new Blockly.FieldTextInput("kayu_1"), "ID_BENDA");
    this.appendDummyInput()
        .appendField("📐 Dimensi (P x L x T):")
        .appendField(new Blockly.FieldNumber(1, 0.2, 10), "DIM_P")
        .appendField("x")
        .appendField(new Blockly.FieldNumber(1, 0.2, 10), "DIM_L")
        .appendField("x")
        .appendField(new Blockly.FieldNumber(4, 0.2, 10), "DIM_T");
    this.appendStatementInput("SUB_OPERASI")
        .appendField("Atur Posisi & Pahatan:");
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setColour(140);
  }
};

// 2. Transformasi: Translasi (Geser)
Blockly.Blocks['transformasi_translasi'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📍 Translasi (Geser) ->")
        .appendField("X:")
        .appendField(new Blockly.FieldNumber(0, -10, 10), "POS_X")
        .appendField("Y:")
        .appendField(new Blockly.FieldNumber(0, -10, 10), "POS_Y")
        .appendField("Z (Tinggi):")
        .appendField(new Blockly.FieldNumber(0, 0, 10), "POS_Z");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(35);
  }
};

// 3. Transformasi: Rotasi Kustom dengan Pusat Putaran (Pivot)
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
    this.appendDummyInput()
        .appendField("🎯 Pusat Putaran (Pivot):")
        .appendField(new Blockly.FieldDropdown([
          ["Pusat Objek (Tengah)", "CENTER"],
          ["Ujung Bawah / Pangkal", "START"],
          ["Ujung Atas / Ujung", "END"]
        ]), "PIVOT");
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

// 5. BLOK RAKIT BERJENJANG (Nested Grouping Block)
Blockly.Blocks['rakit_dua_benda'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔗 RAKIT / KUNCI GABUNGAN");
    this.appendDummyInput()
        .appendField("Induk (Saka/Base):")
        .appendField(new Blockly.FieldTextInput("kayu_1"), "ID_INDUK");
    this.appendDummyInput()
        .appendField("Anak (Blandar/Sambungan):")
        .appendField(new Blockly.FieldTextInput("kayu_2"), "ID_ANAK");
    this.appendStatementInput("OPERASI_RAKIT")
        .appendField("Atur Kuncian Sambungan:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(260);
    this.setTooltip("Menyatukan dua benda kerja menjadi satu kesatuan struktur pada lokasi takikan.");
  }
};

// XML Toolbox Dynamic String
window.SAKA_TOOLBOX_XML = `
<xml>
  <category name="1. Tambah Benda Kerja" colour="#2e7d32">
    <block type="tambah_benda_kerja"></block>
  </category>
  <category name="2. Transformasi &amp; Posisi" colour="#f57c00">
    <block type="transformasi_translasi"></block>
    <block type="transformasi_rotasi_pivot"></block>
  </category>
  <category name="3. Pahatan &amp; Coakan" colour="#0288d1">
    <block type="fungsi_sambungan"></block>
  </category>
  <category name="4. Rakit Berjenjang" colour="#4a148c">
    <block type="rakit_dua_benda"></block>
  </category>
</xml>
`;
