const config = { initialized: false, company: {}, languageData: {} };

const dt = {
  INVOICE: 0,
  PACKING: 1,
  RETURN: 2,
  RECEIPT: 3,
  REFUND: 4,
};

const t = (key) => config.languageData[key];

const showDate = (num) => {
  if (!num) return "";
  const date = new Date(num);
  return !config.locale
    ? date.toISOString().substring(0, 10)
    : date.toLocaleDateString(config.locale);
};

const showMoney = (num) =>
  Number(num).toLocaleString(
    config.locale,
    config.currency
      ? {
          style: "currency",
          currency: config.currency,
        }
      : { minimumFractionDigits: "2", maximumFractionDigits: "2" }
  );

let docH = {};
const setDocHelper = (doc) => {
  docH.jumpStart = (position) => {
    if (!isNaN(position.startPage)) doc.switchToPage(position.startPage);
    if (position.startY) doc.y = position.startY;
  };
  docH.jumpBelow = (...positions) => {
    const last = positions.reduce(
      (a, pos) => {
        if (!pos) return a;
        else if (isNaN(pos.endPage) || pos.endPage === a.endPage)
          a.endY = Math.max(pos.endY, a.endY);
        else if (pos.endPage > a.endPage) {
          a.endY = pos.endY;
          a.endPage = pos.endPage;
        }
        return a;
      },
      { endPage: 0, endY: doc.page.margins.top }
    );
    doc.switchToPage(last.endPage);
    doc.y = last.endY;
  };
  docH.getPageNumber = () => doc._pageBuffer.indexOf(doc.page);
  docH.nextPage = () => {
    const pageNum = doc._pageBuffer.indexOf(doc.page);
    if (doc.options.bufferPages && doc._pageBuffer[pageNum + 1])
      doc.page = doc._pageBuffer[pageNum + 1];
    else doc.addPage();
  };
  docH.imageFixH = (img, x, y, opt) => {
    if (!img) return;
    if (y + opt.height > doc.page.height - doc.page.margins.bottom) {
      docH.nextPage();
      y = doc.page.margins.top;
    }
    doc.image(img, x, y, opt);
    doc.y = y + opt.height;
  };
  docH.pTextArgs = [];
  docH.pText = (...multiText) => {
    const printTxt = (txt) => {
      if (!txt) return;
      else if (typeof txt === "string") {
        doc.text(txt, ...docH.pTextArgs);
      } else if (Array.isArray(txt)) {
        txt.forEach((t) => printTxt(t));
      }
    };
    multiText.forEach(printTxt);
  };
  docH.widthOfStrings = (arr) => {
    const widths = arr.flatMap((s) => (s ? [doc.widthOfString(s)] : []));
    return Math.ceil(Math.max(...widths));
  };
  docH.returnPos = (start) => ({
    endPage: docH.getPageNumber(),
    endY: doc.y,
    ...start,
  });
  //docH.capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  docH.capitalize = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
  // Start constant variables
  docH.printWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  docH.margin = 4;
};

module.exports = { config, t, showDate, showMoney, setDocHelper, docH, dt };
