const { config, docH } = require("../globals");

const Company = (doc) => {
  const { company } = config;
  if (!company) return;
  const startY = doc.y;
  const keys = [
    "company",
    "addr1",
    "addr2",
    "city",
    "zip",
    "state",
    "country",
    "",
    "email",
    "web",
    "tel",
    "fax",
    "",
    "account",
    "bankID",
    "taxID",
    "registration",
    "extras",
  ];
  const values = keys.map((k) =>
    k ? (Array.isArray(company[k]) ? [...company[k]] : [company[k]]) : " "
  );
  doc.fontSize(config.fontSize * 0.9);
  docH.pTextArgs = [doc.page.width / 2, undefined, { align: "right" }];
  docH.pText(values);
  doc.fontSize(config.fontSize);
  doc.moveDown(2.5);
  return docH.returnPos({ startY });
};

module.exports = Company;
