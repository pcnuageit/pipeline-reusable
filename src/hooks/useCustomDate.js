const useCustomDate = ({ date }) => {
  if (!date) return {};

  const p = date.split(/\D/g);
  const dataFormatada = [p[2], p[1], p[0]].join("/");
  const HoraFormatada = [p[3], p[4], p[5]].join(":");

  return {
    date: dataFormatada,
    time: HoraFormatada,
    year: p[0],
    month: p[1],
    day: p[2],
    hour: p[3],
    minute: p[4],
    second: p[5],
  };
};

export default useCustomDate;
