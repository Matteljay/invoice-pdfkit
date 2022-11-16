const { t, config, docH, dt } = require("../globals");

const PayQR = (doc, payment) => {
  if ([dt.QUOTE, dt.PACKING, dt.RETURN].includes(config.docType))
    return docH.returnPos();
  if (!payment?.qr) return docH.returnPos();
  const sqFit = docH.printWidth / 6;
  const width = docH.printWidth / 2 - 2 * docH.margin;
  docH.pTextArgs = [doc.page.margins.left, undefined, { width }];
  doc.fontSize(config.fontSize * 0.9);
  doc.font(config.fontNameBold);
  const method = payment.method ? docH.capitalize(payment.method) + " " : "";
  docH.pText(method + t("pay_qr"));
  doc.font(config.fontName);
  doc.fontSize(config.fontSize);
  docH.imageFixH(payment.qr, doc.page.margins.left, doc.y, {
    fit: [sqFit, sqFit],
    height: sqFit,
  });
  doc.moveDown(2);
  return docH.returnPos();
};

const getDetails = (doc, payment) => {
  const table = [];
  if ([dt.QUOTE, dt.PACKING, dt.RETURN].includes(config.docType))
    return { table, width: 0 };
  if (!payment) return { table, width: 0 };
  const details = {
    pay_name: "name",
    pay_account: "account",
    pay_memo: "memo",
    pay_bank: "bankID",
    pay_tax_id: "taxID",
    pay_reference: "reference",
    pay_note: "note",
  };
  if (config.docType === dt.INVOICE) {
    details.mail_company = "mailCompany";
  } else if (config.docType === dt.RECEIPT) {
    details.mail_company = "mailCompany";
    details.mail_id = "mailID";
  }
  if ([dt.RECEIPT, dt.REFUND].includes(config.docType)) {
    details.pay_transaction = "transaction";
  }
  const method =
    payment.method && !payment.qr ? docH.capitalize(payment.method) + " " : "";
  const header = method + t("pay_details");
  doc.fontSize(config.fontSize * 0.9);
  doc.font(config.fontNameBold);
  let width = doc.widthOfString(header);
  doc.font(config.fontName);
  doc.fontSize(config.fontSize);
  let widthColOne = 0;
  for (const key in details) {
    const value = payment[details[key]];
    if (!value) continue;
    const fullKey = t(key) + ":";
    table.push([fullKey, value]);
    const widthItemOne = doc.widthOfString(fullKey);
    const widthRow = widthItemOne + docH.margin + doc.widthOfString(value);
    widthColOne = Math.max(widthColOne, widthItemOne);
    width = Math.max(width, widthRow);
  }
  widthColOne = Math.ceil(widthColOne);
  width = Math.ceil(width);
  return { table, header, widthColOne, width };
};

const PayDetails = (doc, details) => {
  if (!details?.table?.length) return docH.returnPos();
  const { header, table, widthColOne } = details;
  docH.pTextArgs = [doc.page.margins.left];
  doc.fontSize(config.fontSize * 0.9);
  doc.font(config.fontNameBold);
  docH.pText(header);
  doc.font(config.fontName);
  doc.fontSize(config.fontSize);
  const startColOne = doc.page.margins.left;
  const startColTwo = startColOne + widthColOne + docH.margin * 2;
  table.forEach(([key, value]) => {
    doc.text(key, startColOne, undefined, {
      width: widthColOne,
      align: "left",
      newline: false,
    });
    doc.moveUp(1);
    doc.text(value, startColTwo, undefined);
  });
  doc.moveDown(2);
  return docH.returnPos();
};

module.exports = { PayQR, getDetails, PayDetails };
