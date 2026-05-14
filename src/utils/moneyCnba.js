export const formatMoneyCnba = (value) => {
  if (value === "0000000000000") return "0,00";

  const wholePart = value.toString().slice(0, -2).replace(/^0+/, "");

  const decimalPart = value.toString().slice(-2).replace(",", "");

  const valueFormatted = `${wholePart},${decimalPart}`;

  return valueFormatted;
};
