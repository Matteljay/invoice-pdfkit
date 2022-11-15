const { t, config, showMoney, docH, dt } = require("../globals");
const drawFlexTable = require("../flex-table");

const calcItems = (order) => {
  if (!order.items.length) return {};
  if (config.docType === dt.PACKING) return calcPacking(order);
  if (config.docType === dt.RETURN) return calcReturn(order);
  return calcPrices(order);
};

const calcPacking = (order) => {
  const firstItem = order.items[0];
  const header = [t("item_id"), t("item_desc")];
  if (!!firstItem.qty) header.push(t("item_qty"));
  if (!!firstItem.qtyShip) header.push(t("item_qtyShip"));
  const table = [];
  for (const item of order.items) {
    const line = [item.id, item.desc];
    if (!!firstItem.qty) line.push(item.qty);
    if (!!firstItem.qtyShip) line.push(item.qtyShip);
    table.push(line);
  }
  return { header, table };
};

const calcReturn = (order) => {
  const { header, table } = calcPacking(order);
  header.push("Return");
  table.forEach((line) => line.push(""));
  const writeColumn = [];
  writeColumn[header.length - 1] = true;
  return { header, table, writeColumn };
};

const calcPrices = (order) => {
  const hasDiscount = order.items.reduce((a, i) => a || !!i.discount, false);
  const hasTax = order.items.reduce((a, i) => a || !!i.tax, false);
  //
  const header = [t("item_id"), t("item_desc"), t("item_qty"), t("item_price")];
  if (hasDiscount) header.push(t("item_discount"));
  if (hasTax) header.push(t("item_tax"));
  header.push(t("item_total"));
  //
  const table = [];
  const totals = [];
  for (const item of order.items) {
    const line = [item.id, item.desc, item.qty, showMoney(item.price)];
    if (hasDiscount) line.push(item.discount ? item.discount + "%" : "");
    if (hasTax) line.push(item.tax ? item.tax + "%" : "");
    const total = calcArticleTotal(item);
    totals.push(total);
    line.push(showMoney(total));
    table.push(line);
  }
  const subtotal = totals.reduce((a, t) => a + t, 0);
  return { header, table, subtotal };
};

const calcArticleTotal = (item) => {
  let out = item.price;
  if (!isNaN(item.qty)) out *= item.qty;
  if (item.discount) out *= 1 - item.discount / 100;
  if (item.tax) out *= 1 + item.tax / 100;
  return out;
};

const Prices = (doc, order, pricesData, totalsData) => {
  if (!order.items?.length || !pricesData) return docH.returnPos();
  const startPage = docH.getPageNumber();
  const startY = doc.y;
  const { header, table } = pricesData;
  const cellMarginX = 6;
  const preferredColumnWidths = [];
  if (totalsData)
    preferredColumnWidths[header.length - 1] = totalsData.lastColumnWidth;
  const onlyDescriptionColumn = Array(7).fill(false);
  onlyDescriptionColumn[1] = true;
  if (config.docType === dt.RETURN && !doc._acroform) doc.initForm();
  drawFlexTable({
    doc,
    fontName: config.fontName,
    fontNameBold: config.fontNameBold,
    header,
    table,
    footer: undefined,
    start: doc.page.margins.left,
    end: doc.page.width - doc.page.margins.right,
    allowWrap: onlyDescriptionColumn,
    allowGrow: onlyDescriptionColumn,
    cellMarginX,
    boldHeader: true,
    boldFooter: false,
    alignColumns: onlyDescriptionColumn.map((v) => (v ? "left" : "right")),
    preferredColumnWidths,
    flipGray: false,
    minCellHeight: 0,
    headerEveryPage: true,
    writeColumn: pricesData.writeColumn,
  });
  return docH.returnPos({ startPage, startY });
};

module.exports = { calcItems, Prices };
