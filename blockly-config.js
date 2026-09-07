/**
 * Definisi Blok Custom Saka Nusantara
 */

// 1. Level 1: Kategori Fungsi (Basis Utama)
Blockly.Blocks['fungsi_sambungan'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔨 SAMBUNGAN SAKA:")
        .appendField(new Blockly.FieldDropdown([
          ["Memperpanjang (Lurus)", "LURUS"],
          ["Sudut / Siku (Bentuk L / T)", "SUDUT"],
          ["Persilangan (Bentuk +)", "SILANG"]
        ]), "FUNGSI");
    this.appendStatementInput("TEKNIK")
        .setCheck("Teknik")
        .appendField("Gunakan Teknik:");
    this.setColour(140);
    this.setTooltip("Pilih tujuan/fungsi dari sambungan kayu saka yang ingin dibuat.");
  }
};

// 2. Level 2: Teknik Sambungan Tradisional
Blockly.Blocks['teknik_sambungan'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Teknik:")
        .appendField(new Blockly.FieldDropdown([
          ["Takik Lurus (Lap Joint)", "LAP_JOINT"],
          ["Purus & Lubang (Mortise & Tenon)", "MORTISE_TENON"],
          ["Ekor Burung (Dovetail)", "DOVETAIL"]
        ]), "TEKNIK_NAME");
    this.appendStatementInput("MODIFIKASI")
        .setCheck("Modifikasi")
        .appendField("Atur Modifikasi:");
    this.setPreviousStatement(true, "Teknik");
    this.setNextStatement(false);
    this.setColour(200);
    this.setTooltip("Pilih jenis teknik pahatan/keratan dasar.");
  }
};

// 3. Level 3: Modifikasi Keratan
Blockly.Blocks['modifikasi_keratan'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Arah Keratan:")
        .appendField(new Blockly.FieldDropdown([
          ["Horizontal", "HORIZONTAL"],
          ["Vertikal", "VERTIKAL"]
        ]), "ARAH")
        .appendField(" | Jumlah Keratan:")
        .appendField(new Blockly.FieldDropdown([
          ["1 Keratan (Lapis 1)", "1"],
          ["2 Keratan (Lapis 2)", "2"],
          ["3 Keratan (Lapis 3)", "3"]
        ]), "TUMPUKAN");
    this.setPreviousStatement(true, "Modifikasi");
    this.setNextStatement(true, "Modifikasi");
    this.setColour(35);
    this.setTooltip("Tentukan arah dan jumlah bertumpuknya keratan kayu.");
  }
};

// 4. Level 3 (Opsional): Pasak Pengunci Tradisional
Blockly.Blocks['opsi_pasak'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Tambahkan Pasak Kayu:")
        .appendField(new Blockly.FieldDropdown([
          ["Ya (Kunci Ekstra)", "YA"],
          ["Tidak", "TIDAK"]
        ]), "PAKAI_PASAK");
    this.setPreviousStatement(true, "Modifikasi");
    this.setNextStatement(true, "Modifikasi");
    this.setColour(45);
    this.setTooltip("Tambahkan pasak melintang untuk mengunci sambungan.");
  }
};
