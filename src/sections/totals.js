const { t, config, showMoney, docH, dt } = require("../globals");
const drawFlexTable = require("../flex-table");

const calcTotals = (doc, order, pricesData) => {
  if ([dt.PACKING, dt.RETURN].includes(config.docType)) return;
  const cellMarginX = 6;
  const table = [];
  const { subtotal } = pricesData;
  const calc = { total: subtotal, vat: 0, stateTax: 0, fedTax: 0 };
  const {
    discount,
    ship,
    vat,
    stateTax,
    fedTax,
    exchangeTo,
    exchangeRate,
    exchangePrecision,
  } = order.total || {};
  if (discount) {
    const key = `${t("discount")} (${discount}%):`;
    const value = +(subtotal * Number(discount)) / 100;
    table.push([key, showMoney(value)]);
    calc.total -= value;
  }
  if (ship) {
    table.push([t("shipping") + ":", showMoney(ship)]);
    calc.total += Number(ship);
  }
  if (vat) {
    const key = `${t("item_tax")} (${vat}%):`;
    calc.vat = (calc.total * Number(vat)) / 100;
    table.push([key, showMoney(calc.vat)]);
  }
  if (stateTax) {
    const key = `${t("state_tax")} (${stateTax}%):`;
    calc.stateTax = (calc.total * Number(stateTax)) / 100;
    table.push([key, showMoney(calc.stateTax)]);
  }
  if (fedTax) {
    const key = `${t("federal_tax")} (${fedTax}%):`;
    calc.fedTax = (calc.total * Number(fedTax)) / 100;
    table.push([key, showMoney(calc.fedTax)]);
  }
  const sumQty = order.items.reduce((a, i) => a + Number(i.qty), 0);
  let orderTotal = subtotal;
  if (table.length) {
    const key = `${t("subtotal")} (${sumQty} ${t("units")}):`;
    table.unshift([key, showMoney(subtotal)]);
    orderTotal = calc.total + calc.vat + calc.stateTax + calc.fedTax;
    table.push([t("total") + ":", showMoney(orderTotal)]);
  } else {
    const key = `${t("total")} (${sumQty} ${t("units")}):`;
    table.push(key, showMoney(orderTotal));
  }
  if (exchangeTo && exchangeRate) {
    const key = `${t("exchange")} (${exchangeTo}):`;
    table.push([key, showMoney(exchangeRate)]);
    const value = orderTotal / exchangeRate;
    const payable =
      parseFloat(value.toPrecision(exchangePrecision || 6)) + " " + exchangeTo;
    //const payText = config.docType === dt.INVOICE ? t("payable") : t("paid");
    const payText = t("payable");
    table.push([payText + ":", payable]);
  }
  let height = table.length * doc.heightOfString("X");
  height += doc.heightOfString("X");
  const lastColTable = table.map((r) => r[1]).slice(0, -1);
  const lastColFooter = table[table.length - 1][1];
  const lastColTableWidth = docH.widthOfStrings(lastColTable) + 2 * cellMarginX;
  doc.font(config.fontNameBold);
  const lastColFooterWidth = doc.widthOfString(lastColFooter) + 2 * cellMarginX;
  doc.font(config.fontName);
  const lastColumnWidth = Math.max(lastColTableWidth, lastColFooterWidth);
  const totalsData = { table, lastColumnWidth, height };
  return totalsData;
};

const Totals = (doc, order, totalsData) => {
  if (!totalsData) return docH.returnPos({ width: 0 });
  // Keep totals table on one page
  const heightForTotals = doc.page.height - doc.page.margins.bottom - doc.y;
  if (heightForTotals < totalsData.height) doc.addPage();
  //
  const startPage = docH.getPageNumber();
  const startY = doc.y;
  const cellMarginX = 6;
  const totalsTable = drawFlexTable({
    doc,
    fontName: config.fontName,
    fontNameBold: config.fontNameBold,
    table: totalsData.table.slice(0, -1),
    footer: totalsData.table.slice(-1)?.[0],
    end: doc.page.width - doc.page.margins.right,
    allowWrap: false,
    allowGrow: true,
    cellMarginX,
    boldFooter: true,
    alignColumns: "right",
    preferredColumnWidths: [undefined, totalsData.lastColumnWidth],
    flipGray: !(order.items.length % 2),
    headerEveryPage: false,
    writeColumn: false,
  });
  doc.moveDown(1);
  return docH.returnPos({
    width: totalsTable.width + docH.margin,
    startPage,
    startY,
  });
};

module.exports = { calcTotals, Totals };
