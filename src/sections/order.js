const { t, showDate, docH, config, dt } = require("../globals");

const Order = (doc, order) => {
  const details = {
    order_id: order.id,
    order_ref: order.orderRef,
    order_po: order.po,
    order_client: order.clientID,
    order_salesrep: order.salesRep,
    order_created: showDate(order.date.created),
    order_due: config.docType === dt.INVOICE ? showDate(order.date.due) : "",
    order_paid: showDate(order.date.paid),
    order_refunded:
      config.docType === dt.REFUND ? showDate(order.date.refunded) : "",
  };
  const widthColOne = docH.widthOfStrings(
    Object.keys(details).map((k) => (details[k] ? t(k) + ":" : ""))
  );
  const startColTwo = doc.page.margins.left + widthColOne + docH.margin * 2;
  const widthColTwo = docH.printWidth / 2 - widthColOne - docH.margin;
  for (const key in details) {
    const value = details[key];
    if (!value) continue;
    doc.text(t(key) + ":", doc.page.margins.left, undefined, {
      width: widthColOne,
      align: "left",
    });
    doc.moveUp(1);
    doc.text(details[key], startColTwo, undefined, { width: widthColTwo });
  }
  doc.moveDown(2);
  return docH.returnPos();
};

module.exports = Order;
