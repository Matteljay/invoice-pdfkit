const { t, config, docH, dt } = require("../globals");

const Terms = (doc, order) => {
  const { docType } = config;
  if ([dt.PACKING, dt.RETURN].includes(docType)) return;
  docH.pTextArgs = [doc.page.margins.left];
  if (config.company.termsURL || order.date.due) {
    doc.fontSize(config.fontSize * 0.9);
    doc.font(config.fontNameBold);
    docH.pText(t("terms"));
    doc.font(config.fontName);
    doc.fontSize(config.fontSize);
  }
  if (config.company.termsURL)
    docH.pText(t("terms_site") + " " + config.company.termsURL);
  if (docType === dt.QUOTE) {
    if (order.date.due) docH.pText(t("terms_expire"));
    docH.pText(config.company.terms);
  } else if (docType === dt.INVOICE) {
    if (order.date.due) docH.pText(t("terms_due"));
    docH.pText(config.company.terms);
  } else {
    docH.pText(t("terms_paid"));
  }
  if (config.company.tagline) {
    doc.moveDown(1.5);
    docH.pText(config.company.tagline);
  }
};

let textHeight;
let pageIndicatorHeight;
const getPageIndicatorHeight = (doc) => {
  if (pageIndicatorHeight) return pageIndicatorHeight;
  doc.fontSize(config.fontSize * 0.9);
  textHeight = doc.heightOfString("X");
  pageIndicatorHeight = textHeight + 3 * docH.margin;
  doc.fontSize(config.fontSize);
  return pageIndicatorHeight;
};

const PageNumbers = (doc) => {
  const { bottom } = doc.page.margins;
  doc.fontSize(config.fontSize * 0.9);
  const pageCount = doc._pageBuffer.length;
  for (let p = 0; p < pageCount; p++) {
    doc.switchToPage(p);
    const text = t("page") + ` ${p + 1} / ${pageCount}`;
    doc.text(
      text,
      doc.page.margins.left,
      doc.page.height - bottom - textHeight - 1,
      {
        align: "right",
      }
    );
  }
  doc.fontSize(config.fontSize);
};

module.exports = { Terms, getPageIndicatorHeight, PageNumbers };
