/**
 * Definisi Blok Custom Saka Nusantara (Benda Kerja, Sambungan, & Transformasi)
 */

// 1. Kategori Benda Kerja
Blockly.Blocks['tambah_benda_kerja'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🪵 TAMBAH BENDA:")
        .appendField(new Blockly.FieldDropdown([
          ["Soko Guru (Tiang Utama)", "SOKO"],
          ["Blandar (Balok Horizontal)", "BLANDAR"],
          ["Ander / Pengunci", "ANDER"],
          ["Umpak (Alas Batu)", "UMPAK"]
        ]), "JENIS_BENDA");
    this.appendStatementInput("SUB_OPERASI")
        .appendField("Atur Komponen:");
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setColour(140);
    this.setTooltip("Tambahkan elemen konstruksi kayu rumah adat.");
  }
};

// 2. Kategori Sambungan
Blockly.Blocks['fungsi_sambungan'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔨 Buat Sambungan:")
        .appendField(new Blockly.FieldDropdown([
          ["Purus & Lubang (Mortise-Tenon)", "MORTISE"],
          ["Ekor Burung (Dovetail)", "DOVETAIL"],
          ["Takik Lurus (Lap Joint)", "LAP"]
        ]), "TIPE_SAMBUNGAN");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(200);
  }
};

Blockly.Blocks['teknik_sambungan'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Kunci dengan Pasak?")
        .appendField(new Blockly.FieldDropdown([
          ["Ya (Kunci Pasak)", "YA"],
          ["Tidak", "TIDAK"]
        ]), "PASAK");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(200);
  }
};

// 3. Kategori Transformasi (Geser & Putar)
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
    this.setTooltip("Geser posisi objek kayu di ruang 3D.");
  }
};

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
    this.setTooltip("Putar sudut orientasi kayu.");
  }
};
