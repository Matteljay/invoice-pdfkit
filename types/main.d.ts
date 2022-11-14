type Settings = {
  logo?: any;
  company?: YourCompany;
  language?: string;
  locale?: string;
  currency?: string;
  page?: PDFDocumentOptions | undefined;
  fontName?: string;
  fontNameBold?: string;
  fontSize?: number;
};

type Identity = {
  company?: string;
  name?: string;
  addr1?: string;
  addr2?: string;
  city?: string;
  zip?: string;
  state?: string;
  country?: string;
  email?: string;
};

type CompanyInfo = Identity & {
  tel?: string;
  web?: string;
  account?: string;
  bankID?: string;
  registration?: string;
  taxID?: string;
  extras?: string | string[];
  termsURL?: string;
  terms?: string | string[];
  tagline?: string;
  ship?: Identity;
};

type OrderDate = {
  created?: number;
  add?: number;
  edit?: number;
  due?: number;
  paid?: number;
  refunded?: number;
};

type OrderTotal = {
  discount?: number;
  vat?: number;
  stateTax?: number;
  fedTax?: number;
  ship?: number;
  exchangeTo?: string;
  exchangeRate?: number;
  exchangePrecision?: number;
};

type OrderItem = {
  id?: string;
  desc?: string;
  qty?: string;
  qtyShip?: string;
  price?: string;
  discount?: string;
  tax?: string;
};

type Order = {
  id?: string;
  date?: OrderDate;
  paymentID?: string;
  trackingID?: string;
  note?: string;
  clientID?: string;
  bill?: Identity;
  ship?: Identity;
  items?: OrderItem[];
  total?: OrderTotal;
};

type Payment = {
  method?: string;
  name?: string;
  note?: string;
  mailCompany?: string;
  mailID?: string;
  transaction?: string;
};

declare module "TradePDF" {
  function init(settings?: Settings): void;
  function getLanguages(): string[] | Buffer[] | fs.Dirent[];
  function invoice(order?: Order, payment?: Payment): string | Buffer;
  function packing(order?: Order): string | Buffer;
  function ret(order?: Order): string | Buffer;
  function receipt(order?: Order, payment?: Payment): string | Buffer;
  function refund(order?: Order, payment?: Payment): string | Buffer;
  export = { init, invoice, packing, return: ret, receipt, refund };
}

// EOF
