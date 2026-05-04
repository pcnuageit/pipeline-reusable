import axios from "axios";
import moment from "moment";

const API_URL = `${process.env.REACT_APP_API_URL}/concorrencia`;

export const getBeneficios = async (
  token,
  id,
  page = 1,
  like = "",
  filters = "",
) => {
  //conta_secretaria_id para user adm e documento para user secretaria
  const url = `${API_URL}/tipo-beneficio?conta_secretaria_id=${id}&page=${page}&like=${like}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postAddBeneficio = async (token, data) => {
  // 'conta_id' => ['required', 'uuid', 'exists:conta_conta,id'] 2b91753d-3732-43dc-811f-be8efcf3a336
  // 'nome_prefeitura' => ['required', 'string', 'max:255'] Prefeitura teste que funciona
  // 'nome_beneficio' => ['required', 'string', 'max:255'] Bolsa Pc gamer
  // 'sigla' => ['required', 'string', 'max:255', Rule::unique('tipo_beneficios', 'sigla')] BLSGR
  // 'documento' => ['required', 'string', 'max:20', 'cpf_cnpj'] 08876217000171
  // 'cdProduto' => ['required', 'integer', 'min:1'] 1
  // 'tipo' => ['required', 'string', Rule::in(TipoBeneficio::toArray())] "beneficiario" || "cartao"
  // 'is_contrato' => ['nullable', 'boolean']
  // 'is_alterar_chave_pix' => ['nullable', 'boolean']
  // 'conta_mdr_id' => ['required', 'uuid', 'exists:conta_conta,id'] 2b91753d-3732-43dc-811f-be8efcf3a336
  const url = `${API_URL}/tipo-beneficio/`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
};

export const putUpdateBeneficio = async (token, id, data) => {
  const url = `${API_URL}/tipo-beneficio/${id}`;

  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
};

export const deleteBeneficio = async (token, id) => {
  const url = `${API_URL}/tipo-beneficio/${id}`;

  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getBeneficiarios = async (token, id, page = 1, filters = "") => {
  const url = `${API_URL}/beneficiario?conta_id=${id}&mostrar=10&page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteBeneficiario = async (token, userID) => {
  const url = `${API_URL}/beneficiario/${userID}`;

  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const putUpdateBeneficiario = async (token, userID, data) => {
  // data: {
  //     "beneficiario": {
  //         "email": "",
  //         "documento": "",
  //         "nome": "",
  //         "celular": ""
  //     },
  //     "endereco": {
  //         "cep": "",
  //         "rua": "",
  //         "bairro": "",
  //         "numero": "",
  //         "complemento": "",
  //         "cidade": "",
  //         "estado": ""
  //     }
  // }
  const url = `${API_URL}/beneficiario/${userID}`;

  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      ...data,
      beneficiario: {
        ...data.beneficiario,
        data_nascimento: moment(
          data.beneficiario.data_nascimento,
          "DD/MM/YYYY",
        ).format("YYYY-MM-DD"),
      },
    },
  });
};

export const postAddBeneficiario = async (token, conta_id, data) => {
  // data: {
  //     "beneficiario": {
  //         "nome": "",
  //         "email": "",
  //         "data_nascimento": "",
  //         "documento": "",
  //         "celular": ""
  //     },
  //     "endereco": {
  //         "cep": "",
  //         "rua": "",
  //         "bairro": "",
  //         "numero": "",
  //         "complemento": "",
  //         "cidade": "",
  //         "estado": ""
  //     }
  // }
  const url = `${API_URL}/beneficiario`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id,
      ...data,
      beneficiario: {
        ...data.beneficiario,
        data_nascimento: moment(
          data.beneficiario.data_nascimento,
          "DD/MM/YYYY",
        ).format("YYYY-MM-DD"),
      },
    },
  });
};

export const postAddLoteBeneficiarios = async (token, id, file) => {
  const url = `${API_URL}/beneficiario/arquivo-lote`;

  const fileForm = new FormData();
  fileForm.append("file", file);
  fileForm.append("conta_id", id);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: fileForm,
  });
};

export const getTransacoes = async (token, page = 1, filter = "") => {
  const url = `${API_URL}/extrato?page=${page}&${filter}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransacoesVoucher = (token, page = 1, filters = "") => {
  const url = `${API_URL}/aluguel-conta?page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransacoesPre = async (token, cartao, page, like) => {
  const url = `${process.env.REACT_APP_API_URL}/conta/cartao-pre-pago-externo/${cartao}/history?mostrar=10&page=${page}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransacaoBeneficiario = async (token, id, page, like) => {
  const url = `${API_URL}/extrato?user_id=${id}&mostrar=10&page=${page}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCartoes = async (
  token,
  id,
  page = 1,
  like = "",
  filters = "",
) => {
  const url = `${API_URL}/beneficiario/cartoes-privados?conta_id=${id}&mostrar=10&page=${page}&like=${like}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postCartoesTrocarStatus = async (
  token,
  id,
  page = "",
  filters = "",
  novo_status, //“aguardando” “bloqueado”.
  schedule_at, //YYYY-MM-DD
  cartoes, //id array
) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/trocar-status-bulk?conta_id=${id}&page=${page}&${filters}`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      novo_status,
      schedule_at,
      cartoes,
    },
  });
};

export const postLiberarCartoes = async (
  token,
  conta_id,
  cartao_ids,
  liberar_todos = false,
  tipo_beneficio_id = "",
  filters = "",
  password
) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/liberar?${filters}`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id,
      ...(cartao_ids.length > 0
        ? {
            cartao_ids: cartao_ids,
          }
        : null),
      liberar_todos,
      tipo_beneficio_id,
      password
    },
  });
};

export const getCartoesPre = async (token, page, like) => {
  const url = `${process.env.REACT_APP_API_URL}/conta/cartao-pre-pago?mostrar=10&page=${page}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCartao = async (token, cardID) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/${cardID}`;

  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postAddCartao = async (token, tipo_beneficio_id, data) => {
  //  data: {
  //    documento: "543.697.620-49",
  //    data_solicitacao: "2024-12-09"
  //  }
  const url = `${API_URL}/beneficiario/cartoes-privados`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      tipo_beneficio_id,
      documento: data.documento,
      data_solicitacao: moment(data.data_solicitacao, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      ),
      municipio: data?.municipio,
      curso: data?.curso,
    },
  });
};

export const postAddLoteCartoes = async (token, id, file, password) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/arquivo-lote`;

  const fileForm = new FormData();
  fileForm.append("file", file);
  fileForm.append("conta_id", id);
  fileForm.append("password", password);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: fileForm,
  });
};

export const getVouchers = async (
  token,
  id,
  page = 1,
  like = "",
  filters = "",
) => {
  const url = `${API_URL}/beneficiario/contas?conta_id=${id}&mostrar=10&page=${page}&like=${like}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteVoucher = async (token, cardID) => {
  const url = `${API_URL}/beneficiario/contas/${cardID}`;

  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postAddVoucher = async (
  token,
  conta_id,
  tipo_beneficio_id,
  data,
) => {
  //  data: {
  // documento
  // cvc
  // tipo_transferencia
  // chave_pix
  // nome_conta
  // documento_conta
  // tipo_conta
  // agencia
  // conta
  // conta_digito
  //  }
  const url = `${API_URL}/beneficiario/contas`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id,
      tipo_beneficio_id,
      documento: data?.documento,
      cvc: data?.cvc,
      tipo_transferencia: data?.tipo_transferencia,
      ...(data?.tipo_transferencia === "Dict"
        ? { chave_pix: data?.chave_pix }
        : {
            nome_conta: data?.nome_conta,
            documento_conta: data?.documento_conta,
            banco: data?.banco,
            tipo_conta: data?.tipo_conta,
            agencia: data?.agencia,
            conta: data?.conta + "-" + data?.conta_digito,
          }),
    },
  });
};

export const postAddLoteVouchers = async (token, id, file) => {
  const url = `${API_URL}/beneficiario/contas/arquivo-lote`;

  const fileForm = new FormData();
  fileForm.append("file", file);
  fileForm.append("conta_id", id);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: fileForm,
  });
};

export const postAddLoteVouchersEmbossing = async (token, id, file) => {
  const url = `${API_URL}/embossing/conta-voucher`;

  const fileForm = new FormData();
  fileForm.append("file", file);
  fileForm.append("conta_id", id);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: fileForm,
  });
};

export const getPagamentosVoucher = (
  token,
  id,
  page = 1,
  like = "",
  filters = "",
) => {
  const url = `${API_URL}/pagamento-aluguel?conta_id=${id}&page=${page}&like=${like}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getShowPagamentoVoucher = (token, id) => {
  const url = `${API_URL}/pagamento-aluguel/${id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePagamentosVoucher = (token, id) => {
  const url = `${API_URL}/pagamento-aluguel/${id}`;

  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const patchPagamentosVoucherStatusToCreated = (token, id) => {
  const url = `${API_URL}/aluguel-conta/pagamento/${id}/update-status`;

  return axios({
    method: "patch",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const patchPagamentosVoucherStatusToCreatedLote = (
  token,
  pagamentos_ids,
) => {
  const url = `${API_URL}/aluguel-conta/pagamento/update-status-lote`;

  return axios({
    method: "patch",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      pagamentos_ids,
      status: "created",
    },
  });
};

export const deletePagamentosVoucherLote = (token, id) => {
  const url = `${API_URL}/aluguel-conta/${id}`;

  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagamentosEstabelecimento = (
  token,
  id,
  page = 1,
  like = "",
  filters = "",
) => {
  const url = `${API_URL}/pagamento-estabelecimento?conta_id=${id}&page=${page}&like=${like}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getShowPagamentoEstabelecimento = (token, id) => {
  const url = `${API_URL}/pagamento-estabelecimento/${id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePagamentosEstabelecimento = (token, id) => {
  const url = `${API_URL}/pagamento-estabelecimento/${id}`;

  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagamentosEstabelecimentoDetalhamento = (
  token,
  pagamento_estabelecimento_id = "",
  page = 1,
  filters = "",
) => {
  const url = `${API_URL}/estabelecimento-conta?pagamento_estabelecimento_id=${pagamento_estabelecimento_id}&page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagamentosEstabelecimentoTransacoes = (
  token,
  pagamento_estabelecimento_id = "",
  page = 1,
  filters = "",
) => {
  const url = `${API_URL}/estabelecimento/transacoes?pagamento_estabelecimento_id=${pagamento_estabelecimento_id}&page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagamentosCartaoPrivado = (
  token,
  id,
  page = 1,
  like = "",
  filters = "",
) => {
  const url = `${API_URL}/cartao-privado-pagamento?conta_id=${id}&page=${page}&like=${like}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getShowPagamentoCartaoPrivado = (token, id) => {
  const url = `${API_URL}/cartao-privado-pagamento/${id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePagamentosCartaoPrivado = (token, id) => {
  const url = `${API_URL}/cartao-privado-pagamento/${id}`;

  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getArquivoLote = (
  token,
  type, //pagamento-estabelecimento, pagamento-aluguel, cartao-privado-pagamento, beneficiario, beneficiario-conta, cartao-privado, estabelecimento, notificacao-beneficiario, cartao-privado-cancelamento
  id,
  page,
) => {
  const url = `${process.env.REACT_APP_API_URL}/arquivo/by/type/${type}?conta_id=${id}&page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postAddLotePagamentoCartao = (
  token,
  id,
  arquivo,
  descricao,
  data_pagamento,
  competencia,
  password,
) => {
  const url = `${API_URL}/cartao-privado-pagamento-lote`;

  const bodyFormData = new FormData();
  bodyFormData.append("pagamentos", arquivo);
  bodyFormData.append("descricao", descricao);
  bodyFormData.append("data_pagamento", data_pagamento);
  bodyFormData.append("competencia", competencia);
  bodyFormData.append("password", password);
  bodyFormData.append("conta_id", id);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const postLotePagamentoCartaoReprocessar = (token, arquivo_id) => {
  const url = `${API_URL}/cartao-privado-pagamento-lote/${arquivo_id}`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postAddLoteCancelamentoCartao = (
  token,
  id,
  arquivo,
  schedule_at,
  //"cartoes" = [ids] || .csv
) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/cancelar-bulk`;
  const bodyFormData = new FormData();
  bodyFormData.append("file", arquivo);
  bodyFormData.append("conta_id", id);
  bodyFormData.append("schedule_at", schedule_at);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const postAddLoteBloquearCartao = (
  token,
  id,
  arquivo,
  schedule_at,
  //"cartoes" = [ids] || .csv
) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/bloqueio-sac`;
  const bodyFormData = new FormData();
  bodyFormData.append("file", arquivo);
  bodyFormData.append("conta_id", id);
  bodyFormData.append("schedule_at", schedule_at);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const getAuditSGC = (token, arquivo_id, page, filters = "") => {
  const url = `${API_URL}/audit-sgc?arquivo_id=${arquivo_id}&page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postAuditSGCReprocessar = (token, arquivo_id) => {
  const url = `${API_URL}/audit-sgc/reprocessamento`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      arquivo_id,
    },
  });
};

export const postAddLoteStatusCartao = (
  token,
  id,
  arquivo,
  schedule_at,
  //"cartoes" = [ids] || .csv
) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/trocar-status-arquivo-lote`;
  const bodyFormData = new FormData();
  bodyFormData.append("file", arquivo);
  bodyFormData.append("conta_id", id);
  bodyFormData.append("schedule_at", schedule_at);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const postAddLoteSegundaViaCartao = (token, id, arquivo) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/nova-via/arquivo-lote`;
  const bodyFormData = new FormData();
  bodyFormData.append("file", arquivo);
  bodyFormData.append("conta_id", id);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const postAddLotePagamentoEstabelecimento = (
  token,
  id,
  arquivo,
  descricao,
  data_pagamento,
) => {
  const url = `${API_URL}/pagamento-estabelecimento-lote`;

  const bodyFormData = new FormData();
  bodyFormData.append("pagamentos", arquivo);
  bodyFormData.append("descricao", descricao);
  bodyFormData.append("data_pagamento", data_pagamento);
  bodyFormData.append("conta_id", id);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const postAddLotePagamentoVoucher = (
  token,
  id,
  arquivo,
  descricao,
  data_pagamento,
  competencia,
) => {
  const url = `${API_URL}/pagamento-aluguel-lote`;

  const bodyFormData = new FormData();
  bodyFormData.append("pagamentos", arquivo);
  bodyFormData.append("descricao", descricao);
  bodyFormData.append("data_pagamento", data_pagamento);
  bodyFormData.append("competencia", competencia);
  bodyFormData.append("conta_id", id);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const postLotePagamentoVoucherReprocessar = (token, arquivo_id) => {
  const url = `${API_URL}/pagamento-aluguel-lote/${arquivo_id}`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postAddLoteContratoAluguel = (token, id, arquivo) => {
  const url = `${API_URL}/contrato-aluguel/store-from-file`;

  const bodyFormData = new FormData();
  bodyFormData.append("file", arquivo);
  bodyFormData.append("conta_id", id);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const postExcluirLoteContratoAluguel = (token, id, arquivo) => {
  const url = `${API_URL}/contrato-aluguel/update-status-from-file`;

  const bodyFormData = new FormData();
  bodyFormData.append("file", arquivo);
  bodyFormData.append("conta_id", id);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const postAddLotePagamentoContratoAluguel = (
  token,
  id,
  arquivo,
  descricao,
) => {
  const url = `${API_URL}/contrato-aluguel-pagamento/store-from-file`;

  const bodyFormData = new FormData();
  bodyFormData.append("file", arquivo);
  bodyFormData.append("descricao", descricao);
  bodyFormData.append("conta_id", id);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const postAddLoteEstabelecimento = (token, arquivo) => {
  const url = `${API_URL}/estabelecimento/import`;

  const bodyFormData = new FormData();
  bodyFormData.append("file", arquivo);
  // bodyFormData.append("id", id);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const getAutorizarPagamentosEstabelecimento = (
  token,
  id,
  page = 1,
  like = "",
  filters = "",
) => {
  const url = `${API_URL}/pagamento-estabelecimento/aprovar?conta_id=${id}&page=${page}&like=${like}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAutorizarPagamentosVoucher = (
  token,
  id,
  page = 1,
  like = "",
  filters = "",
) => {
  const url = `${API_URL}/pagamento-aluguel/aprovar?conta_id=${id}&page=${page}&like=${like}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAutorizarPagamentosCartaoPrivado = (
  token,
  id,
  page = 1,
  like = "",
  filters = "",
) => {
  const url = `${API_URL}/cartao-privado-pagamento/aprovar?conta_id=${id}&page=${page}&like=${like}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postAutorizarPagamentosEstabelecimento = (
  token,
  id,
  password,
  registros = [],
  todos_registros = true,
  aprovar = true,
) => {
  const url = `${API_URL}/pagamento-estabelecimento/aprovar?conta_id=${id}`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      password,
      registros,
      todos_registros,
      aprovar,
    },
  });
};

export const postAutorizarPagamentosVoucher = (
  token,
  id,
  password,
  registros,
  todos_registros = true,
  aprovar = true,
  filters = "",
) => {
  const url = `${API_URL}/pagamento-aluguel/aprovar?conta_id=${id}&${filters}`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      password,
      registros,
      todos_registros,
      aprovar,
    },
  });
};

export const postAutorizarPagamentosCartaoPrivado = (
  token,
  id,
  password,
  registros,
  todos_registros = true,
  aprovar = true,
  filters = "",
) => {
  const url = `${API_URL}/cartao-privado-pagamento/aprovar?conta_id=${id}&${filters}`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      password,
      registros,
      todos_registros,
      aprovar,
    },
  });
};

export const getExportTable = (
  token,
  apiURL = "", // extrato || aluguel-conta || beneficiario || beneficiario/contas || beneficiario/cartoes-privados || cartao-privado-pagamento || pagamento-estabelecimento || pagamento-aluguel || pagamento-pix || conta/notificacao/export
  export_type = "xlsx", //xlsx || pdf
  page = 1,
  filters = "",
) => {
  const url = `${apiURL}?export_type=${export_type}&page=${page}&${filters}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAuditoriaPagamentoEstabelecimento = (
  token,
  page = 1,
  filters = "",
) => {
  const url = `${API_URL}/reembolsos?page=${page}&${filters}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postCriarFolhaPagamentoEstabelecimento = (
  token,
  descricao,
  data_pagamento,
) => {
  const url = `${API_URL}/pagamento-estabelecimento`;

  return axios({
    method: "POST",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      descricao,
      data_pagamento,
    },
  });
};

export const postAuditoriaPagamentoEstabelecimento = (
  token,
  folha_pagamento_id,
  reembolso, //[id]
  filters = "",
) => {
  const url = `${API_URL}/auditoria/reembolso?${filters}`;

  return axios({
    method: "POST",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      folha_pagamento_id,
      ...(filters && { filters }),
      reembolso,
    },
  });
};

export const getContratosAluguel = (token, id, page = 1, filters = "") => {
  const url = `${API_URL}/contrato-aluguel?conta_id=${id}&page=${page}&${filters}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postContratosAluguel = (token, tipo_beneficio_id, data) => {
  // "tipo_beneficio_id": "9d853605-1927-46f3-b397-507ae6cd8c7c"

  // "data_inicio": "2025-02-06",
  // "data_fim": "2025-07-06",
  // "documento": "301.714.581-68",
  // "telefone": "",
  // "valor": 5.00,
  // "tipo_transacao": "Manual" || "Dict"

  // Manual
  // "nome": "Charles Egidio",
  // "agencia": "0001",
  // "conta": "54365",
  // "banco": "06271464",

  // Pix
  // "chave_pix": "68c44e36-9381-4711-bbd8-fdbd01a863c2",

  const url = `${API_URL}/contrato-aluguel`;

  return axios({
    method: "POST",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      tipo_beneficio_id,
      ...data,
    },
  });
};

export const updateContratosAluguel = (token, id, data) => {
  // "tipo_beneficio_id": "9d853605-1927-46f3-b397-507ae6cd8c7c"

  // "data_inicio": "2025-02-06",
  // "data_fim": "2025-07-06",
  // "documento": "301.714.581-68",
  // "telefone": "",
  // "valor": 5.00,
  // "tipo_transacao": "Manual" || "Dict"

  // Manual
  // "nome": "Charles Egidio",
  // "agencia": "0001",
  // "conta": "54365",
  // "banco": "06271464",

  // Pix
  // "chave_pix": "68c44e36-9381-4711-bbd8-fdbd01a863c2",
  const url = `${API_URL}/contrato-aluguel/${id}`;

  return axios({
    method: "PUT",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
};

export const deleteContratoAluguel = (token, id) => {
  const url = `${API_URL}/contrato-aluguel/${id}`;

  return axios({
    method: "DELETE",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateStatusContratoAluguel = (
  token,
  id,
  status, // "pendente" "reprovado" "aprovado"
) => {
  const url = `${API_URL}/contrato-aluguel/${id}/update-status`;

  return axios({
    method: "PATCH",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      status,
    },
  });
};

export const getPagamentosContratoAluguel = (
  token,
  id,
  page = 1,
  like = "",
  filters = "",
) => {
  const url = `${API_URL}/contrato-aluguel-pagamento?conta_id=${id}&page=${page}&like=${like}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePagamentosContratoAluguel = (token, id) => {
  const url = `${API_URL}/contrato-aluguel-pagamento/${id}`;

  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagamentosContratoAluguelGrouped = (
  token,
  id,
  page = 1,
  filters = "",
) => {
  const url = `${API_URL}/contrato-aluguel-pagamento/grouped-index?conta_id=${id}&page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAutorizarPagamentosContratoAluguel = (
  token,
  id,
  page = 1,
  like = "",
  filters = "",
) => {
  const url = `${API_URL}/contrato-aluguel-pagamento/aprovar?conta_id=${id}&page=${page}&like=${like}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postAutorizarPagamentosContratoAluguel = (
  token,
  id,
  password,
  registros = [],
  todos_registros = true,
  aprovar = true,
  filters = "",
) => {
  const url = `${API_URL}/contrato-aluguel-pagamento/aprovar?conta_id=${id}&${filters}`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      password,
      registros,
      todos_registros,
      aprovar,
    },
  });
};

export const patchPagamentosContratoAluguelStatusToCreated = (token, id) => {
  const url = `${API_URL}/contrato-aluguel-pagamento/${id}/update-status`;

  return axios({
    method: "patch",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const patchPagamentosContratoAluguelStatusToCreatedLote = (
  token,
  pagamentos_ids,
) => {
  const url = `${API_URL}/contrato-aluguel-pagamento/update-status-lote`;

  return axios({
    method: "patch",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      pagamentos_ids,
      status: "created",
    },
  });
};

export const postBlockCard = (token, id, schedule_at) => {
  const url = `${API_URL}/beneficiario/card/${id}/block`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      schedule_at,
    },
  });
};

export const postUnblockCard = (token, id, schedule_at) => {
  const url = `${API_URL}/beneficiario/card/${id}/unblock`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      schedule_at,
    },
  });
};

export const postCancelCard = (token, id, schedule_at) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/${id}/cancelar-cartao`;

  return axios({
    method: "patch",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      schedule_at,
    },
  });
};

export const getAuditoriaLog = (token, page, filters = "") => {
  const url = `${API_URL}/auditoria?page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getHistoricoTransacoes = (token, page = 1, filters = "") => {
  const url = `${API_URL}/transacoes?page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getNotasFiscais = (token, page = 1, filters = "") => {
  const url = `${API_URL}/nota-fiscal?page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getHistoricoTransacoesEntradas = (
  token,
  page = 1,
  filters = "",
) => {
  const url = `${API_URL}/operacoes?page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCursoSearch = (token) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/cursos`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fluxo Segunda Via Cartão - primeiro passo
export const getSegundaViaMotivoSearch = (token, documento = "") => {
  const url = `${API_URL}/beneficiario/cartoes-privados/nova-via/listar-motivos?documento=${documento}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fluxo Segunda Via Cartão - segundo passo
export const postSegundaViaCriar = (
  token,
  id_motivo,
  cartoes, // ids - string[]
  descricao,
) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/nova-via/criar-segunda-via`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      id_motivo,
      cartoes,
      descricao,
    },
  });
};

// Fluxo Segunda Via Cartão - terceiro passo
export const getSegundaViaList = (token, conta_id, page = 1, filters = "") => {
  const url = `${API_URL}/beneficiario/cartoes-privados/nova-via?conta_id=${conta_id}&page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fluxo Segunda Via Cartão - último passo
export const postSegundaViaSolicitar = (
  token,
  password,
  solicitacoes, // ids - string[]
) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/nova-via/solicitar-segunda-via`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      password,
      solicitacoes,
    },
  });
};

export const postSegundaViaNegarSolicitacao = (
  token,
  password,
  solicitacoes, // ids - string[]
) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/nova-via/negar-solicitacao`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      password,
      ids: solicitacoes,
    },
  });
};

export const postSegundaViaMarcarEntregue = (
  token,
  password,
  solicitacoes, // ids - string[]
) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/nova-via/marcar-entregue`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      password,
      ids: solicitacoes,
    },
  });
};

export const getBeneficiariosBloqueados = (token, page = 1, filters = 0) => {
  const url = `${API_URL}/beneficiario/beneficiarios-bloqueados?page=${page}&${filters}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postBeneficiarioDesbloquear = (token, user_ids) => {
  const url = `${API_URL}/beneficiario/desbloquear-beneficiarios`;

  return axios({
    method: "POST",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      user_ids,
    },
  });
};

export const getDevices = (token, page = 1, filters = "") => {
  const url = `${API_URL}/devices?page=${page}&${filters}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const patchDeviceChangeStatus = (token, id, status) => {
  const url = `${API_URL}/devices/change-status/${id}`;

  return axios({
    method: "PATCH",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      status,
    },
  });
};

export const deleteDevice = (token, id) => {
  const url = `${API_URL}/devices/${id}`;

  return axios({
    method: "DELETE",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const patchUserDeviceChangeStatus = (token, id, status) => {
  const url = `${API_URL}/devices/device-user/change-status/${id}`;

  return axios({
    method: "PATCH",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      status,
    },
  });
};

export const deleteUserDevice = (token, id) => {
  const url = `${API_URL}/devices/device-user/detach/${id}`;

  return axios({
    method: "DELETE",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDevicesWhitelist = (token, page = 1, filters = "") => {
  const url = `${API_URL}/devices/whitelist?page=${page}&${filters}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postDeviceAddToWhitelist = (token, documentos) => {
  const url = `${API_URL}/devices/whitelist`;

  return axios({
    method: "POST",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      documentos,
    },
  });
};

export const deleteDeviceFromWhitelist = (token, id) => {
  const url = `${API_URL}/devices/whitelist/${id}`;

  return axios({
    method: "DELETE",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postDevicesAddToWhitelist = (
  token,
  devices, // id[]
) => {
  const url = `${API_URL}/devices/master-whitelist`;

  return axios({
    method: "POST",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { devices },
  });
};

export const getDevicesAddedToWhitelist = (token, page = 1, filters = "") => {
  const url = `${API_URL}/devices/master-whitelist?page=${page}&${filters}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDashboardIndicadoresGerais = (
  token,
  page = 1,
  filters = "",
) => {
  const url = `${API_URL}/dashboard/indicadores-gerais?page=${page}&${filters}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDashboardSaldoPorCartao = (token, page = 1, filters = "") => {
  const url = `${API_URL}/dashboard/saldo-por-cartao?page=${page}&${filters}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDashboardSaldoPorCidade = (token, page = 1, filters = "") => {
  const url = `${API_URL}/dashboard/saldo-por-cidade?page=${page}&${filters}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDashboardFornecedoresPorCidade = (token, estado = "") => {
  const url = `${API_URL}/dashboard/fornecedores-por-cidade?estado=${estado}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCursos = (token, page, filters = "") => {
  const url = `${API_URL}/cursos?page=${page}&${filters}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCurso = (token, id) => {
  const url = `${API_URL}/cursos/${id}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postCurso = (token, data) => {
  const url = `${API_URL}/cursos`;

  return axios({
    method: "POST",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: data,
  });
};

export const updateCurso = (token, id, data) => {
  const url = `${API_URL}/cursos/${id}`;

  return axios({
    method: "PATCH",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: data,
  });
};

export const deleteCurso = (token, id) => {
  const url = `${API_URL}/cursos/${id}`;

  return axios({
    method: "DELETE",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCondicoesComerciais = (token, page, filters = "") => {
  const url = `${API_URL}/condicoes-comerciais?page=${page}&${filters}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postCondicaoComercialToggleStatus = (token, id) => {
  const url = `${API_URL}/condicoes-comerciais/${id}`;

  return axios({
    method: "POST",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postCondicaoComercial = (token, data) => {
  const url = `${API_URL}/condicoes-comerciais`;

  return axios({
    method: "POST",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: data,
  });
};

export const updateCondicaoComercial = (token, id, data) => {
  const url = `${API_URL}/condicoes-comerciais/${id}`;

  return axios({
    method: "PATCH",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: data,
  });
};

export const deleteCondicaoComercial = (token, id) => {
  const url = `${API_URL}/condicoes-comerciais/${id}`;

  return axios({
    method: "DELETE",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
