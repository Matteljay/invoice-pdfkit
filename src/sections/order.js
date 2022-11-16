const { t, showDate, docH, config, dt } = require("../globals");

const Order = (doc, order) => {
  const { docType } = config;
  const details = {
    order_id: order.id,
    order_ref: order.ref,
    order_purchase: docType === dt.QUOTE ? "" : order.purchase,
    order_client: order.clientID,
    order_salesrep: order.salesRep,
    order_created: showDate(order.date.created),
    order_expire: docType === dt.QUOTE ? showDate(order.date.expire) : "",
    order_due: docType === dt.INVOICE ? showDate(order.date.due) : "",
    order_deliver: [dt.INVOICE, dt.RECEIPT].includes(docType)
      ? showDate(order.date.deliver)
      : "",
    order_paid: [dt.RECEIPT, dt.REFUND].includes(docType)
      ? showDate(order.date.paid)
      : "",
    order_refunded: docType === dt.REFUND ? showDate(order.date.refunded) : "",
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
