const { config, t, dt } = require("../globals");

const Title = (doc) => {
  doc.moveDown(1);
  doc.fontSize(config.fontSize * 3);
  let text;
  if (config.docType === dt.PACKING) text = t("packing");
  else if (config.docType === dt.RETURN) text = t("return");
  else if (config.docType === dt.RECEIPT) text = t("receipt");
  else if (config.docType === dt.REFUND) text = t("refund");
  else text = t("invoice");
  doc.text(text, doc.page.margins.left, undefined, { align: "left" });
  doc.fontSize(config.fontSize);
  doc.moveDown(2);
};

module.exports = Title;
