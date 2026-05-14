// banking api ------------------------------------------------------
export const sgaLoginMutation = () => ({
  url: `/api-sga/login`,
  method: "post",
});

export const storeAproveckBoletoMutation = (data) => ({
  url: `/api-sga/carne`,
  method: "post",
  body: { ...data },
});

export const updateAproveckBoletoMutation = ({ boleto_id, data }) => ({
  url: `/boleto/${boleto_id}`,
  method: "put",
  body: { ...data },
});

export const cancelarAproveckBoletoMutation = ({ boleto_id }) => ({
  url: `/boleto/${boleto_id}/cancel`,
  method: "patch",
});

export const sendAproveckBoletoByEmailMutation = ({ boleto_id }) => ({
  url: `/enviar/${boleto_id}/boleto`,
  method: "post",
});

// hinova sga api ------------------------------------------------------
export const indexAproveckBoletosQuery = (params) => ({
  url: `/hinova-sga/listar-boletos`,
  method: "get",
  params: { ...params },
});

export const getAproveckBoletoQuery = ({ nosso_numero }) => ({
  url: `/hinova-sga/buscar-boleto/${nosso_numero}`,
  method: "get",
});

export const editarVencimentoAproveckBoletoMutation = (boleto_id, data) => ({
  url: `/hinova-sga/alterar-boleto-vencimento/${boleto_id}`,
  method: "patch",
  body: { ...data },
});

export const editarSituacaoAproveckBoletoMutation = (boleto_id, data) => ({
  url: `/hinova-sga/alterar-boleto-situacao/${boleto_id}`,
  method: "patch",
  body: { ...data },
});

export const getAproveckAssociadoQuery = ({ documento }) => ({
  url: `/hinova-sga/buscar-associado`,
  method: "get",
  params: { documento },
});

export const editAproveckAssociadoMutation = ({ data }) => ({
  url: `/hinova-sga/atualizar-associado`,
  method: "put",
  body: { ...data },
});

export const indexAproveckVeiculosQuery = (params) => ({
  url: `/hinova-sga/listar-veiculos`,
  method: "get",
  params: { ...params },
});

export const getAproveckVeiculoQuery = ({ placa }) => ({
  url: `/hinova-sga/buscar-veiculo`,
  method: "get",
  params: { placa },
});

export const indexAproveckIndicacoesQuery = ({ situacao, page }) => ({
  url: `/hinova-sga/listar-indicacoes-externas`,
  method: "get",
  params: { situacao, page },
});

export const getAproveckIndicacaoQuery = (params) => ({
  url: `/hinova-sga/buscar-indicacao-externa`,
  method: "get",
  params: { ...params },
});

export const indexAproveckEventosQuery = ({ placa_ou_codigo, page }) => ({
  url: `/hinova-sga/listar-eventos`,
  method: "get",
  params: { placa_ou_codigo, page },
});
