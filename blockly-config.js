/**
 * Definisi Blok Custom Saka Nusantara
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

// 2. Transformasi: Translasi (Geser Posisi)
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

// 3. Transformasi: Rotasi Kustom dengan Pusat Rotasi (Pivot X, Y, Z)
Blockly.Blocks['transformasi_rotasi_pivot'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔄 Rotasi Sudut:")
        .appendField(new Blockly.FieldNumber(90, -360, 360), "SUDUT")
        .appendField("° pada Sumbu:")
        .appendField(new Blockly.FieldDropdown([
          ["Sumbu Z (Vertikal / Tinggi)", "Z"],
          ["Sumbu X (Lebar / Kanan-Kiri)", "X"],
          ["Sumbu Y (Panjang / Depan-Belakang)", "Y"]
        ]), "SUMBU");
    this.appendDummyInput()
        .appendField("🎯 Pusat Rotasi (Pivot):")
        .appendField("X:")
        .appendField(new Blockly.FieldNumber(0, -10, 10), "PIVOT_X")
        .appendField("Y:")
        .appendField(new Blockly.FieldNumber(0, -10, 10), "PIVOT_Y")
        .appendField("Z:")
        .appendField(new Blockly.FieldNumber(0, -10, 10), "PIVOT_Z");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(35);
    this.setTooltip("Memutar kayu dengan sudut, arah sumbu, dan koordinat titik pusat putaran (pivot) kustom.");
  }
};

// 4. Transformasi: Tampilan Warna & Transparansi
Blockly.Blocks['transformasi_tampilan'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🎨 Tampilan -> Warna:")
        .appendField(new Blockly.FieldDropdown([
          ["Cokelat Jati", "0x8B5A2B"],
          ["Cokelat Pinus", "0xCD853F"],
          ["Merah Kayu", "0xA0522D"],
          ["Cokelat Terang", "0xD2691E"],
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
    this.setTooltip("Ubah warna dan opasitas kayu agar coakan/sambungan terlihat jelas.");
  }
};

// 5. Pahatan & Coakan Sambungan
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

// 6. BLOK RAKIT NESTED
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
  <category name="2. Transformasi &amp; Tampilan" colour="#f57c00">
    <block type="transformasi_translasi"></block>
    <block type="transformasi_rotasi_pivot"></block>
    <block type="transformasi_tampilan"></block>
  </category>
  <category name="3. Pahatan &amp; Coakan" colour="#0288d1">
    <block type="fungsi_sambungan"></block>
  </category>
  <category name="4. Rakit / Gabungkan" colour="#4a148c">
    <block type="rakit_dua_benda"></block>
  </category>
</xml>
`;
