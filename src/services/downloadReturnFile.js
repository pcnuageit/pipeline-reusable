import { format } from "date-fns";
import { toast } from "react-toastify";
import { api } from "./api";

export const downloadReturnFile = async ({ id, accountId }) => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "ddMMyyyyHHmmss");
  const fileName = `arquivo_retorno_${formattedDate}.txt`;

  try {
    const { data } = await api.get("/arquivo-retorno/download", {
      params: {
        arquivo_retorno_id: id,
        conta_id: accountId,
      },
    });
    downloadBase64File("text/html", data, fileName);
  } catch (error) {
    toast.error("Erro ao baixar arquivo!");
  }
};

function downloadBase64File(contentType, base64Data, fileName) {
  const linkSource = `data:${contentType};base64,${base64Data}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}
