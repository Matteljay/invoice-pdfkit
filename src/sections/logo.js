const { config, docH } = require("../globals");

const Logo = (doc) => {
  if (!config.logo) return;
  doc.moveUp(1);
  const maxHeight = doc.y - doc.page.margins.top;
  doc.image(config.logo, doc.page.margins.left, doc.page.margins.top, {
    fit: [docH.printWidth, maxHeight],
    align: "right",
  });
  doc.moveDown(2);
};

module.exports = Logo;
