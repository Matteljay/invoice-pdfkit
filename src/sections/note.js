const { t, config, docH } = require("../globals");

const Note = (doc, order, width) => {
  const { note } = order;
  if (!note) return;
  docH.pTextArgs = [doc.page.margins.left, undefined, { width }];
  doc.fontSize(config.fontSize * 0.9);
  doc.font(config.fontNameBold);
  docH.pText(t("note"));
  doc.font(config.fontName);
  doc.fontSize(config.fontSize);
  docH.pText(note);
  doc.moveDown(2);
  return docH.returnPos();
};

module.exports = Note;
