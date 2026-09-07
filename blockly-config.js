/**
 * Definisi Blok Custom Saka Nusantara
 */

// 1. Benda Kerja
Blockly.Blocks['tambah_benda_kerja'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🪵 TAMBAH BENDA:")
        .appendField(new Blockly.FieldDropdown([
          ["Soko Guru (Tiang)", "SOKO"],
          ["Blandar (Balok)", "BLANDAR"],
          ["Ander (Pengunci)", "ANDER"],
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
        .appendField("Operasi / Modifikasi:");
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setColour(140);
  }
};

// 2. Sambungan & Coakan
Blockly.Blocks['fungsi_sambungan'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔨 Sambungan:")
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

// 3. Transformasi Posisi
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

// 4. Transformasi Rotasi
Blockly.Blocks['transformasi_rotasi'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔄 Putar Objek ->")
        .appendField("Sumbu Y:")
        .appendField(new Blockly.FieldDropdown([
          ["0°", "0"],
          ["90°", "90"],
          ["180°", "180"],
          ["270°", "270"]
        ]), "ROT_Y");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(35);
  }
};

// 5. Transformasi Tampilan (Warna & Transparansi)
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
