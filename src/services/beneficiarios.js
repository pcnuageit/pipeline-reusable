import axios from "axios";
import moment from "moment";

const API_URL = `${process.env.REACT_APP_API_URL}/concorrencia`;

export const getBeneficios = async (token, documento, page, filters = "") => {
  //conta_secretaria_id para user adm e documento para user secretaria
  const url = `${API_URL}/tipo-beneficio?documento=${documento}${
    page ? `&page=${page}` : ""
  }&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postAddBeneficio = async (token, conta_id, data) => {
  //   "nome_prefeitura": "Prefeitura teste que funciona",
  //   "nome_beneficio": "Bolsa Pc gamer",
  //   "sigla": "BLSGR",
  //   "conta_id": "2b91753d-3732-43dc-811f-be8efcf3a336",
  //   "documento":"08876217000171"
  //   "cdProduto": 0
  //   tipo: "beneficiario" || "cartao"
  const url = `${API_URL}/tipo-beneficio/`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id,
      ...data,
    },
  });
};

export const putUpdateBeneficio = async (token, id, conta_id, data) => {
  const url = `${API_URL}/tipo-beneficio/${id}`;

  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id,
      ...data,
    },
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

export const getBeneficiarios = async (
  token,
  id = "[]",
  page = 1,
  filters = "",
) => {
  const url = `${API_URL}/beneficiario?tipo_beneficio_id=${id}&mostrar=10&page=${page}&${filters}`;

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

export const postAddBeneficiario = async (token, tipo_beneficio_id, data) => {
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
      ...data,
      beneficiario: {
        ...data.beneficiario,
        data_nascimento: moment(
          data.beneficiario.data_nascimento,
          "DD/MM/YYYY",
        ).format("YYYY-MM-DD"),
        tipo_beneficio_id,
      },
    },
  });
};

export const postAddLoteBeneficiarios = async (token, file) => {
  const url = `${API_URL}/beneficiario/arquivo-lote`;

  const fileForm = new FormData();
  fileForm.append("file", file);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: fileForm,
  });
};

export const getTransacoes = async (token, page, filters) => {
  const url = `${API_URL}/extrato?mostrar=10&page=${page}&${filters}`;

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

export const getHistoricoTransacao = (token, id) => {
  const url = `${API_URL}/transacoes/${id}`;

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

export const getCartoes = async (token, page = 1, like = "", filters = "") => {
  const url = `${API_URL}/beneficiario/cartoes-privados?mostrar=10&page=${page}&like=${like}&${filters}`;

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
  novo_status, //“aguardando” “bloqueado” "pendente".
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
      cartoes,
    },
  });
};

export const postLiberarCartoes = async (
  token,
  conta_id,
  cartao_ids,
  liberar_todos = false,
  filters = "",
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
      cartao_ids,
      liberar_todos,
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
    },
  });
};

export const postAddLoteCartoes = async (token, file) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/arquivo-lote`;

  const fileForm = new FormData();
  fileForm.append("file", file);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: fileForm,
  });
};

// Fluxo Segunda Via Cartão - primeiro passo
export const getSegundaViaMotivoSearch = (token) => {
  const url = `${API_URL}/beneficiario/cartoes-privados/nova-via/listar-motivos`;

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

export const getTransacaoVoucherBeneficiario = async (
  token,
  id,
  page = 1,
  like = "",
) => {
  const url = `${API_URL}/aluguel-conta?user_id=${id}&mostrar=10&page=${page}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getVouchers = async (token, id, page = 1, filters = "") => {
  const url = `${API_URL}/beneficiario/contas?tipo_beneficio_id=${id}&mostrar=10&page=${page}&${filters}`;

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

export const postAddVoucher = async (token, tipo_beneficio_id, data) => {
  //  data: {
  // documento
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
      tipo_beneficio_id,
      documento: data?.documento,
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

export const putUpdateVoucher = async (token, id, data) => {
  const url = `${API_URL}/beneficiario/contas/${id}`;

  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      // documento: data?.documento,
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

export const postAddLoteVouchers = async (token, file) => {
  const url = `${API_URL}/beneficiario/contas/arquivo-lote`;

  const fileForm = new FormData();
  fileForm.append("file", file);

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
  page = 1,
  like = "",
  filters = "",
) => {
  const url = `${API_URL}/pagamento-aluguel?page=${page}&like=${like}&${filters}`;

  return axios({
    method: "get",
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

export const getPagamentosEstabelecimento = (token, id, page, like) => {
  const url = `${API_URL}/pagamento-estabelecimento?conta_id=${id}&page=${page}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagamentosCartaoPrivado = (token, id, page, like) => {
  const url = `${API_URL}/cartao-privado-pagamento?conta_id=${id}&page=${page}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getArquivoLote = (
  token,
  type, //pagamento-estabelecimento, pagamento-aluguel, cartao-privado-pagamento, beneficiario, beneficiario-conta, cartao-privado
  page,
) => {
  const url = `${process.env.REACT_APP_API_URL}/arquivo/by/type/${type}?page=${page}`;

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
  arquivo,
  descricao,
  data_pagamento,
  password,
) => {
  const url = `${API_URL}/cartao-privado-pagamento-lote`;

  const bodyFormData = new FormData();
  bodyFormData.append("pagamentos", arquivo);
  bodyFormData.append("descricao", descricao);
  bodyFormData.append("data_pagamento", data_pagamento);
  bodyFormData.append("password", password);

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
  arquivo,
  descricao,
  data_pagamento,
) => {
  const url = `${API_URL}/pagamento-estabelecimento-lote`;

  const bodyFormData = new FormData();
  bodyFormData.append("pagamentos", arquivo);
  bodyFormData.append("descricao", descricao);
  bodyFormData.append("data_pagamento", data_pagamento);

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
  arquivo,
  descricao,
  data_pagamento,
) => {
  const url = `${API_URL}/pagamento-aluguel-lote`;

  const bodyFormData = new FormData();
  bodyFormData.append("pagamentos", arquivo);
  bodyFormData.append("descricao", descricao);
  bodyFormData.append("data_pagamento", data_pagamento);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const postAddLoteContratoAluguel = (token, arquivo) => {
  const url = `${API_URL}/contrato-aluguel/store-from-file`;

  const bodyFormData = new FormData();
  bodyFormData.append("file", arquivo);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const postAddLotePagamentoContratoAluguel = (token, arquivo) => {
  const url = `${API_URL}/contrato-aluguel-pagamento/store-from-file`;

  const bodyFormData = new FormData();
  bodyFormData.append("file", arquivo);

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
  page,
  like,
) => {
  const url = `${API_URL}/pagamento-estabelecimento/aprovar?conta_id=${id}&page=${page}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAutorizarPagamentosVoucher = (token, id, page, like) => {
  const url = `${API_URL}/pagamento-aluguel/aprovar?conta_id=${id}&page=${page}&like=${like}`;

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
  otp,
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
      token: otp,
      registros,
      todos_registros,
      aprovar,
    },
  });
};

export const postAutorizarPagamentosVoucher = (
  token,
  id,
  otp,
  registros,
  todos_registros = true,
  aprovar = true,
) => {
  const url = `${API_URL}/pagamento-aluguel/aprovar?conta_id=${id}`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      token: otp,
      registros,
      todos_registros,
      aprovar,
    },
  });
};

export const getExportTable = (
  token,
  apiURL = "", // extrato || aluguel-conta || beneficiario || beneficiario/contas || beneficiario/cartoes-privados || cartao-privado-pagamento || pagamento-estabelecimento || pagamento-aluguel || pagamento-pix
  export_type = "xlsx", //xlsx || pdf
  page = 1,
  filters = "",
) => {
  const url = `${apiURL}/export?export_type=${export_type}&page=${page}&${filters}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getContratosAluguel = (token, id, page = 1, filters = "") => {
  const url = `${API_URL}/contrato-aluguel?tipo_beneficio_id=${id}&page=${page}&${filters}`;

  return axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
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

export const postBlockCard = (token, id) => {
  const url = `${API_URL}/beneficiario/card/${id}/block`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postUnblockCard = (token, id) => {
  const url = `${API_URL}/beneficiario/card/${id}/unblock`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPermissoesBeneficios = (token, user_id = "") => {
  const url = `${API_URL}/tipo-beneficio-permissoes/list?user_id=${user_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postPermissoesBeneficioSync = (
  token,
  user_id,
  tipo_beneficio_ids,
) => {
  const url = `${API_URL}/tipo-beneficio-permissoes/sync`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      user_id,
      tipo_beneficio_ids,
    },
  });
};

export const getExtratoEstabelecimento = async (token, page = 1) => {
  const url = `${API_URL}/estabelecimento/extrato-geral?page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransacoesEstabelecimento = async (
  token,
  page = 1,
  filters = "",
) => {
  const url = `${API_URL}/estabelecimento/transacoes?page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
