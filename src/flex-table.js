// License: MIT - Matteljay 2022
//

/*
type FlexTable = {
  doc?: PDFKit.PDFDocument,
  fontName?: PDFKit.Mixins.PDFFontSource,
  fontNameBold?: PDFKit.Mixins.PDFFontSource,
  header?: string[],
  table: string[][],
  footer?: string[],
  start?: number,
  end?: number,
  allowWrap?: boolean | boolean[],
  allowGrow?: boolean | boolean[],
  cellMarginX?: number,
  boldHeader?: boolean,
  boldFooter?: boolean,
  alignColumns?: string | string[],
  preferredColumnWidths?: number | number[],
  flipGray?: boolean,
  minCellHeight?: number,
  headerEveryPage?: boolean,
  writeColumn?: boolean[],
}
// writeColumn: whether that column's values will become text fields, requires doc.initForm()
*/

let arg,
  doc,
  plainFont,
  boldFont,
  columnWidths,
  totalBaseWidth,
  doubleXMargin,
  tStart,
  tEnd,
  tWidth,
  grayCounter;

const drawFlexTable = (drawTableArguments) => {
  arg = drawTableArguments;
  doc = arg.doc;
  plainFont = arg.fontName || "Helvetica";
  boldFont = arg.fontNameBold || "Helvetica-Bold";
  doubleXMargin = 2 * arg.cellMarginX;
  grayCounter = !arg.flipGray;
  columnWidths = getBaseWidths();
  totalBaseWidth = columnWidths.reduce((a, w) => a + w, 0);
  [tStart, tEnd, tWidth] = limitTable();
  if (tWidth - totalBaseWidth < -1) wrapColumnsToLimits();
  if (tWidth - totalBaseWidth > 1) growColumnsToLimits();
  const allowWriting = arg.writeColumn
    ? arg.writeColumn.some((a) => !!a)
    : false;
  printHeader();
  for (const row of arg.table) printRow(row, allowWriting);
  printFooter();
  return {
    x: tStart,
    width: tWidth,
    columnWidths,
  };
};

const printHeader = () => {
  if (arg.header) {
    if (arg.boldHeader != false) doc.font(boldFont);
    printRow(arg.header, false);
    doc.font(plainFont);
  }
};

const printFooter = () => {
  if (arg.footer) {
    if (arg.boldFooter != false) doc.font(boldFont);
    printRow(arg.footer, false);
    doc.font(plainFont);
  }
};

const printRow = (row, allowWriting) => {
  const { alignColumns, writeColumn, minCellHeight } = arg;
  const currentFontHeight = doc.heightOfString("X");
  // Calculate cellHeights
  const cellHeights = [];
  row.forEach((cell, i) => {
    const width = columnWidths[i] - doubleXMargin;
    const cellHeight = doc.heightOfString(cell, { width });
    //console.log(cell, columnWidths[i] - doubleXMargin, cellHeight);
    if (allowWriting && writeColumn[i]) cellHeights.push(currentFontHeight * 2);
    else cellHeights.push(cellHeight);
  });
  cellHeights.push(currentFontHeight); // force minimum
  if (minCellHeight) cellHeights.push(minCellHeight);
  const maxCellHeight = cellHeights.reduce((a, h) => (h > a ? h : a), 0);
  // Check new page required
  let accumPosX = tStart + arg.cellMarginX;
  if (doc.y + maxCellHeight > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
    if (arg.headerEveryPage) printHeader();
  }
  // Paint gray background
  const basePosY = doc.y;
  grayCounter = !grayCounter;
  const gap = currentFontHeight - doc._fontSize;
  if (grayCounter) {
    doc
      .rect(tStart, basePosY - gap, tWidth, maxCellHeight)
      .fill("#eee")
      .fill("black");
  }
  // Start printing text
  row.forEach((cell, i) => {
    const width = columnWidths[i] - doubleXMargin;
    if (width <= 0) return;
    if (i > 0) accumPosX += columnWidths[i - 1];
    const marginY = (maxCellHeight - cellHeights[i]) / 2;
    const align = Array.isArray(alignColumns) ? alignColumns[i] : alignColumns;
    if (allowWriting && writeColumn[i]) {
      const height = cellHeights[i] - gap - 2;
      //console.log(cell, accumPosX, maxCellHeight, marginY, width, align);
      doc
        .formText("item", accumPosX + 2, basePosY + marginY, width, height, {
          align,
          value: cell,
        })
        .rect(accumPosX + 2, basePosY + marginY, width, height)
        .stroke();
    } else if (cell || cell === 0) {
      doc.text(cell, accumPosX, basePosY + marginY, { width, align });
    }
    doc.y += marginY;
  });
};

const growColumnsToLimits = () => {
  const { allowGrow } = arg;
  if (Array.isArray(allowGrow)) {
    const sizeOfGrowable = allowGrow.reduce(
      (a, canGrow, i) => (canGrow ? a + columnWidths[i] - doubleXMargin : a),
      0
    );
    // Visual: totalBaseWidth - sizeOfGrowable + sizeOfGrowable * growFactor = tWidth
    const growFactor = 1 - (totalBaseWidth - tWidth) / sizeOfGrowable;
    allowGrow.forEach((canGrow, i) => {
      if (canGrow)
        columnWidths[i] =
          (columnWidths[i] - doubleXMargin) * growFactor + doubleXMargin;
    });
    totalBaseWidth = columnWidths.reduce((a, w) => a + w, 0);
  }
};

const wrapColumnsToLimits = () => {
  const { allowWrap } = arg;
  if (Array.isArray(allowWrap)) {
    // allowWrap Stage One
    const sizeOfShrinkable = allowWrap.reduce(
      (a, canWrap, i) => (canWrap ? a + columnWidths[i] - doubleXMargin : a),
      0
    );
    const minimalBaseWidth = totalBaseWidth - sizeOfShrinkable;
    if (tWidth >= minimalBaseWidth) {
      // Visual: totalBaseWidth - sizeOfShrinkable + sizeOfShrinkable * shrinkFactor = tWidth
      const shrinkFactor = 1 - (totalBaseWidth - tWidth) / sizeOfShrinkable;
      allowWrap.forEach((canWrap, i) => {
        if (canWrap && columnWidths[i] > doubleXMargin)
          columnWidths[i] =
            (columnWidths[i] - doubleXMargin) * shrinkFactor + doubleXMargin;
      });
    } else {
      // Set widths to zero
      allowWrap.forEach((canWrap, i) => {
        if (canWrap) columnWidths[i] = 0;
      });
    }
    totalBaseWidth = columnWidths.reduce((a, w) => a + w, 0);
  }
  if (tWidth < totalBaseWidth) {
    // allowWrap Stage Two (force wrapping anyway)
    const sizeOfShrinkable = columnWidths.reduce(
      (a, width) => a + width - doubleXMargin,
      0
    );
    const minimalBaseWidth = totalBaseWidth - sizeOfShrinkable;
    if (tWidth >= minimalBaseWidth) {
      const shrinkFactor = 1 - (totalBaseWidth - tWidth) / sizeOfShrinkable;
      columnWidths.forEach((width, i) => {
        if (width > doubleXMargin)
          columnWidths[i] =
            (width - doubleXMargin) * shrinkFactor + doubleXMargin;
      });
      //console.log(columnWidths);
    } else {
      // Not even enough room for margins
      columnWidths.forEach((width, i) => {
        columnWidths[i] = 0;
      });
    }
    totalBaseWidth = columnWidths.reduce((a, w) => a + w, 0);
  }
};

const limitTable = () => {
  let start = arg.start;
  let end = arg.end;
  if (!start && !end) start = doc.page.margins.left;
  if (!start) {
    start = end - totalBaseWidth;
    if (start < doc.page.margins.left) start = doc.page.margins.left;
  }
  if (!end) {
    end = start + totalBaseWidth;
    if (end > doc.page.width - doc.page.margins.right)
      end = doc.page.width - doc.page.margins.right;
  }
  return [start, end, end - start];
};

const getBaseWidths = () => {
  const columnWidths = [];
  if (arg.header) {
    if (arg.boldHeader != false) doc.font(boldFont);
    updateColumnWidths(columnWidths, arg.header);
    doc.font(plainFont);
  }
  if (arg.footer) {
    if (arg.boldFooter != false) doc.font(boldFont);
    updateColumnWidths(columnWidths, arg.footer);
    //console.log(columnWidths);
    doc.font(plainFont);
  }
  doc.font(plainFont);
  for (const row of arg.table) {
    updateColumnWidths(columnWidths, row);
  }
  return columnWidths;
};

const updateColumnWidths = (columnWidths, row) => {
  const { preferredColumnWidths: prefWidths } = arg;
  if (typeof prefWidths === "number")
    row.forEach((cell, i) => (columnWidths[i] = prefWidths));
  else
    row.forEach((cell, i) => {
      if (Array.isArray(prefWidths) && typeof prefWidths[i] === "number") {
        columnWidths[i] = prefWidths[i];
        return;
      }
      let width = (cell ? doc.widthOfString(cell) : 0) + doubleXMargin;
      width += width * 0.01; // Add some to fix misbehaving heightOfString()
      if (isNaN(columnWidths[i]) || width > columnWidths[i])
        columnWidths[i] = width;
    });
};

module.exports = drawFlexTable;
