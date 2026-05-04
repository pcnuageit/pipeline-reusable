export function documentMask(doc = "", secure = false) {
  if (!doc || typeof doc !== "string") return "";

  //Caso já venha com máscara
  if (doc.includes("*") || doc.includes("/")) return doc;

  const parsedDoc = doc.replace(/\D/g, "");

  //Documento incompleto para aplicar máscara segura
  if (parsedDoc.length === 6) {
    return `***.${parsedDoc.substring(0, 3)}.${parsedDoc.substring(3, 6)}-**`;
  }

  if (secure) {
    //Aplicar máscara segura CPF
    if (parsedDoc.length === 11) {
      return `***.${parsedDoc.substring(3, 6)}.${parsedDoc.substring(6, 9)}-**`;
    }
  } else {
    //Aplicar máscara CPF
    if (parsedDoc.length === 11) {
      return `${parsedDoc.substring(0, 3)}.${parsedDoc.substring(
        3,
        6
      )}.${parsedDoc.substring(6, 9)}-${parsedDoc.substring(9, 11)}`;
    }
  }

  //Aplicar máscara CNPJ
  if (parsedDoc.length === 14) {
    return `${parsedDoc.substring(0, 2)}.${parsedDoc.substring(
      2,
      5
    )}.${parsedDoc.substring(5, 8)}/${parsedDoc.substring(
      8,
      12
    )}-${parsedDoc.substring(12)}`;
  }

  return doc;
}
