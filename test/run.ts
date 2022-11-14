const tradePDF = require("../index");
const fs = require("fs");

const folder = "./test/";
const filename = "output.pdf";
const yourCompany: CompanyInfo = {
  company: "Admiral Motors",
  addr1: "2517 N Oak Ave",
  city: "Fort Meade",
  zip: "FL 33941",
  state: "Florida",
  country: "United States of America",
  tel: "+1 863-285-5552",
  web: "https://admiralmotors.co.uk",
  email: "admiralmotors@protonmail.com",
  account: "NL33 ABNA 0383 9284 93",
  bankID: "BIC ABNABNL2AXXX",
  registration: "K.v.K. 0441.956.713",
  taxID: "BTW nr. BE0423798694",
  //extras: ["More information", "And even more"],
  termsURL: "https://shopping-example.com/terms",
  terms: ["- Only valid if paid on time", "- Pay on time for real please"],
  tagline: "Quality machinery for life - Thank you for doing business.",
  ship: {
    company: "Admiral Motors Logistics Intl.",
    name: "Roger Carrion",
    addr1: "Industrieweg 324",
    city: "3344TY Haarlem",
    //zip: "4432GT",
    //state: "Noord-Holland",
    country: "The Netherlands",
  },
};

const items = [
  {
    id: "k2d822e2",
    desc: "Expensive Watch",
    qty: "18",
    qtyShip: "6",
    price: "258845.25",
    discount: "10",
    tax: "14.5",
  },
  {
    id: "zui5ohgh",
    desc: "Best Toothbrush Ever Rlly",
    qty: "62",
    qtyShip: "62",
    price: "5.10",
    discount: "",
    tax: "9",
  },
  {
    id: "zui5ohgh",
    desc: "Tooth Pick XXL",
    qty: "1280",
    qtyShip: "1280",
    price: "0.02",
    discount: "",
    tax: "9",
  },
];

const itemsLarge = [
  {
    id: "if3moh3f",
    desc: "Uber Expensive Watch With Slightly Annoyingly Excessive Article Description",
    qty: "14",
    qtyShip: "7",
    price: "458845.25",
    discount: "7",
    tax: "14.5",
  },
  {
    id: "roh0aith",
    desc: "Behringer Audio Digital Mixing Console",
    qty: "8",
    qtyShip: "3",
    price: "158845.25",
    discount: "10",
    tax: "14.5",
  },
];

const repeatItems = Array(8).fill(items).flat();

const order: Order = {
  id: "Y4TIX8GX",
  date: {
    // JS Date format, milliseconds since 1 January 1970 UTC
    created: 1659372135311,
    due: 1655118412147,
    paid: 1655118412147,
    refunded: 1655118412147,
  },
  paymentID: "Package accepted by Martin",
  trackingID: "3SXPXA1217058",
  note: "Some relevant text - ex. Don't drop off at the neighbors",
  clientID: "C345524U",
  bill: {
    company: "Super Grip Tires BV",
    name: "Jan van Eihof",
    email: "finance@supergriptires.com",
    addr1: "Dorpstraat 587",
    city: "3884AR Leusden",
    //zip: "3884AR",
    //state: "Utrecht",
    //country: "The Netherlands",
  },
  ship: {
    company: "SGT Logistics Netherlands",
    name: "Tony Forklift",
    addr1: "Industrieweg 43",
    city: "4432GT Arnhem",
    //zip: "4432GT",
    state: "Gelderland",
    country: "The Netherlands",
  },
  total: {
    discount: 41,
    vat: 15.2,
    stateTax: 6,
    fedTax: 9.5,
    ship: 7.24,
    exchangeTo: "BTC",
    exchangeRate: 15200,
    exchangePrecision: 7,
  },
  items: itemsLarge.concat(repeatItems),
};

const payment = {
  method: "bitcoin lightning",
  qr: fs.readFileSync("test/qr-ln.jpg"),
  name: "Jack van der Molensteen",
  //account: "BC1QMAMK7PJU2N2NHL58E8VRWWW6CDRFLHNAQJFY2V",
  //account:
  //  "LNBC20M1PVJLUEZPP5QQQSYQCYQ5RQWZQFQQQSYQCYQ5RQWZQFQQQSYQCYQ5RQWZQFQYPQHP58YJMDAN79S6QQDHDZGYNM4ZWQD5D7XMW5FK98KLYSY043L2AHRQSFPP3QJMP7LWPAGXUN9PYGEXVGPJDC4JDJ85FR9YQ20Q82GPHP2NFLC7JTZRCAZRRA7WWGZXQC8U7754CDLPFRMCCAE92QGZQVZQ2PS8PQQQQQQPQQQQQ9QQQVPEUQAFQXU92D8LR6FVG0R5GV0HEEEQGCRQLNM6JHPHU9Y00RRHY4GRQSZSVPCGPY9QQQQQQGQQQQQ7QQZQJ9N4EVL6MR5AJ9F58ZP6FYJZUP6YWN3X6SK8AKG5V4TGN2Q8G4FHX05WF6JUAXU9760YP46454GPG5MTZGERLZEZQCQVJNHJH8Z3G2QQDHHWKJ",
  //account: "NL33 ABNA 0383 9284 93",
  bankID: "ABNABNL2AXXX",
  taxID: "BE0423798694",
  memo: "3u232",
  companyReg: "KvK 0441.956.713",
  reference: "RF8WHAT9EVAH1",
  note: "Some secondary order reference or other relevant payment info. This could also be a slightly annoyingly long text.",
  mailCompany: "DHL Express International",
  mailID: "3S482SOME73CODE3",
  //transaction: "Cash payment accepted by Kees",
  transaction:
    "a5d5ad7538fafc841fa7a314a88b1c157b472d34b39dbe56c08dd293a656b9c1",
};

console.log("Language options: " + tradePDF.getLanguages());
tradePDF.init({
  logo: fs.readFileSync("test/logo.jpg"),
  company: yourCompany,
  language: "en",
  locale: "en-US",
  currency: "USD",
  page: { size: "A4" }, // This object is passed to pdfkit, see their documentation
  fontSize: 11,
  //fontName: "Courier", // Font is also defined in pdfkit, can be path to .ttf
  //fontNameBold: "Courier-BoldOblique",
});

//fs.mkdirSync(folder, { recursive: true }); // recursive suppresses exists-error
//const filenameGenerated =
//  new Date().toISOString().substring(0, 19).replace(/\W/g, "") + ".pdf";
//console.log(pdfData.toString("base64"));
let pdfData;

pdfData = tradePDF.invoice(order, payment);
fs.writeFileSync(folder + "1_invoice.pdf", pdfData);

pdfData = tradePDF.packing(order);
fs.writeFileSync(folder + "2_packing.pdf", pdfData);

pdfData = tradePDF.return(order);
fs.writeFileSync(folder + "3_return.pdf", pdfData);

pdfData = tradePDF.receipt(order, payment);
fs.writeFileSync(folder + "4_receipt.pdf", pdfData);

pdfData = tradePDF.refund(order);
fs.writeFileSync(folder + "5_refund.pdf", pdfData);

console.log("Successfully generated pdf(s)");

/*
console.log("Language options: " + tradePDF.getLanguages());
tradePDF.init({
  logo: fs.readFileSync("test/logo.jpg"),
  company: {
    company: "Your Company Name",
    email: "your@buzz.com",
    web: "https://that-buzz.org",
  },
});

const pdfData = tradePDF.invoice({
  id: "S4TIX8GX",
  date: {
    created: 1659372135311,
    due: 1655118412147,
  },
  bill: {
    company: "SomeTarget Inc.",
    email: "star@buzz.com",
  },
  items: [
    {
      id: "w85",
      desc: "Expensive Watch",
      tax: "21",
      qty: "18",
      price: "2545.25",
    },
    {
      id: "s63",
      desc: "Repair service in hours",
      tax: "9",
      qty: "2",
      price: "32.0",
    },
  ],
  total: {
    discount: 41,
    stateTax: 10,
    fedTax: 5.1,
    ship: 7.24,
  },
});
fs.writeFileSync(folder + "simple.pdf", pdfData);
*/

/* EOF */
