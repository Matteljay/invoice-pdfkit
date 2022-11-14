const { t, config, docH } = require("../globals");

const Destination = (doc, addr, title, isSmall) => {
  if (!addr) return;
  const values = [
    addr.company,
    addr.name ? t("attn") + " " + addr.name : "",
    addr.addr1,
    addr.addr2,
    addr.city,
    addr.zip,
    addr.state,
    addr.country,
    addr.email,
  ];
  docH.pTextArgs = [
    doc.page.margins.left,
    undefined,
    { width: docH.printWidth / 2 - docH.margin },
  ];
  doc.fontSize(config.fontSize * 0.9);
  doc.font(config.fontNameBold);
  docH.pText(title);
  doc.font(config.fontName);
  if (!isSmall) doc.fontSize(config.fontSize);
  docH.pText(values);
  doc.fontSize(config.fontSize);
  doc.moveDown(2);
  return docH.returnPos();
};

module.exports = Destination;
