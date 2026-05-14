export const uploadArquivoRemessaMutation = ({ file }) => {
  var bodyFormData = new FormData();
  bodyFormData.append("file", file);
  return {
    url: `/arquivo-remessa/upload`,
    method: "post",
    data: bodyFormData,
  };
};

export const storeArquivoRemessaMutation = ({
  name,
  header,
  details,
  trailer,
}) => {
  return {
    url: `/arquivo-remessa`,
    method: "post",
    data: {
      name,
      header,
      details,
      trailer,
    },
  };
};

export const getArquivoRemessaQuery = ({
  nome,
  page,
  data_inicial,
  data_final,
  boleto_id,
  conta_id,
}) => ({
  url: `/arquivo-remessa`,
  method: "get",
  params: { nome, page, data_inicial, data_final, boleto_id, conta_id },
});

export const showArquivoRemessaQuery = ({ id }) => ({
  url: `/arquivo-remessa/${id}`,
  method: "get",
});

export const getItemRemessaQuery = ({ page, arquivo_remessa_id }) => ({
  url: `/item-remessa`,
  method: "get",
  params: { page, arquivo_remessa_id },
});

export const exportArquivoRetornoQuery = ({ data_inicial, data_final }) => ({
  url: `/arquivo-retorno/export`,
  method: "get",
  params: { data_inicial, data_final },
});

export const getArquivoRetornoQuery = ({
  page,
  data_inicial,
  data_final,
  conta_id,
}) => ({
  url: `/arquivo-retorno`,
  method: "get",
  params: { page, data_inicial, data_final, conta_id },
});

export const getPagadoresRemessaQuery = ({ page, arquivo_remessa_id }) => ({
  url: `/arquivo-remessa/${arquivo_remessa_id}/payers`,
  method: "get",
  params: { page, arquivo_remessa_id },
});

export const getRetryItemsQuery = ({ arquivo_remessa_id }) => ({
  url: `/arquivo-remessa/${arquivo_remessa_id}/retry-items`,
  method: "get",
  params: { arquivo_remessa_id },
});
