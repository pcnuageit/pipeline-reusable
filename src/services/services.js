import axios from "axios";
import { Query } from "../helpers/cogent-js";

const API_URL = process.env.REACT_APP_API_URL;

export const getContas = (
  token,
  page = "",
  like = "",
  order = "",
  mostrar = "",
  id = "",
  seller = "",
  status = "",
  numero_documento = "",
  tipo,
  conta_id_filter = "",
) => {
  const url = `${API_URL}/contas?
	page=${page}
	&like=${like}
	&order=${order}
	&mostrar=${mostrar}
	&id=${id}
	&seller=${seller}
	&status=${status}
	&numero_documento=${numero_documento}
	&tipo=${tipo}&conta_id_filter=${conta_id_filter}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postLogin = (email, password) => {
  const url = `${API_URL}/auth/login`;
  return axios({
    method: "post",
    url,
    data: { email, password },
  });
};

export const getContaId = (
  token,
  id,
  representante = false,
  empresa = false,
  socio = false,
) => {
  const url = `${API_URL}/conta/${id}?representante=${representante}empresa=${empresa}socio=${socio}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const putConta = (token, conta, id) => {
  const url = `${API_URL}/conta/${id}`;

  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      nome: conta.nome,
      razao_social: conta.razao_social,
      celular: conta.celular,
      site: conta.site,
      endereco: {
        cep: conta.endereco.cep,
        rua: conta.endereco.rua,
        numero: conta.endereco.numero,
        complemento: conta.endereco.complemento,
        bairro: conta.endereco.bairro,
        cidade: conta.endereco.cidade,
        estado: conta.endereco.estado,
      },
    },
  });
};

export const getBancos = (token) => {
  const url = `${API_URL}/banco`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postContaBancaria = (token, conta, conta_id) => {
  const url = `${API_URL}/conta-bancaria?conta_id=${conta_id}`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id: conta.conta_id,
      banco: conta.banco,
      agencia: conta.agencia,
      tipo: conta.tipo,
      conta: conta.conta,
    },
  });
};

export const getContaBancaria = (token, conta_id) => {
  const url = `${API_URL}/conta-bancaria?conta_id=${conta_id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteContaBancaria = (token, id, conta_id) => {
  const url = `${API_URL}/conta-bancaria/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAprovarConta = (token, id) => {
  const url = `${API_URL}/conta/${id}/aprovar`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFinalizarCadastroConta = (token, id) => {
  const url = `${API_URL}/conta/${id}/finalizar`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDocumento = (token, conta_id) => {
  const url = `${API_URL}/documento?conta_id=${conta_id}&mostrar=100`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteDocumento = (token, id) => {
  const url = `${API_URL}/documento/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postDocumentos = (token, documento, categoria, descricao) => {
  const url = `${API_URL}/documento`;
  var bodyFormData = new FormData();
  bodyFormData.append("arquivo", documento);
  bodyFormData.append("categoria", categoria);
  bodyFormData.append("descricao", descricao);
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const postDocumentosAdm = (
  token,
  documento,
  categoria,
  conta_id,
  descricao,
) => {
  const url = `${API_URL}/documento_admin`;
  var bodyFormData = new FormData();
  bodyFormData.append("conta_id", conta_id);
  bodyFormData.append("documento", documento);
  bodyFormData.append("categoria", categoria);
  bodyFormData.append("descricao", descricao);
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const getEnviarDocumentoIdWall = (token, id) => {
  const url = `${API_URL}/conta/${id}/sendidwall`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getResumoContaDashboard = (token) => {
  const url = `${API_URL}/conta-quantidade`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getGraficoContaLineDashboard = (token) => {
  const url = `${API_URL}/grafico-cadastro-line`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getGraficoContaBarDashboard = (token) => {
  const url = `${API_URL}/grafico-cadastro-bar`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getContasExport = (
  token,
  id,
  page,
  like,
  id_conta,
  seller,
  status,
  numero_documento,
  tipo,
  order,
  mostrar,
) => {
  const url = `${API_URL}/export/conta?page=${page}&like=${like}&id=${id_conta}&seller=${seller}&status=${status}&numero_documento=${numero_documento}&tipo=${tipo}&order=${order}&mostrar=${mostrar}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postCapturaCobranca = (token, id, valor) => {
  const url = `${API_URL}/cartao/${id}/captura`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      valor: valor,
    },
  });
};

export const getCobrancasCartaoFilters = (
  token,
  page,
  like,
  order,
  mostrar,
  conta_id,
) => {
  const url = `${API_URL}/cartao?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&conta_id=${conta_id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postPagarComSaldo = (token, tokenQrcode, id, valor) => {
  const url = `${API_URL}/financa/qr-code/${id}/pagar-com-saldo`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      valor,
      token: tokenQrcode,
    },
  });
};

export const getMinhasCobrancas = (token, page, like, order, mostrar) => {
  const url = `${API_URL}/cobranca/qr-code?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postCobrancaCompartilhada = (token, valor, descricao) => {
  const url = `${API_URL}/conta/qr-code`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      valor,
      descricao,
      expiracao: "",
      tipo: 1,
      status: 1,
    },
  });
};

export const getCobrancasCompartilhadas = (
  token,
  page,
  like,
  order,
  mostrar,
) => {
  const url = `${API_URL}/conta/qr-code?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postBuscarContaQrCode = (token, like) => {
  const url = `${API_URL}/conta/qrcode/buscar`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      like,
    },
  });
};

export const postEfetuarPagamentoWallet = (
  token,
  conta_pagador_id,
  valor,
  descricao,
) => {
  const url = `${API_URL}/cobranca/qr-code`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      valor,
      descricao,
      vencimento: "",
      status: 1,
      conta_pagador_id,
    },
  });
};

export const getShowCobranca = (token, id) => {
  const url = `${API_URL}/cobranca/qr-code/${id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postCobrancaEstornar = (token, id) => {
  const url = `${API_URL}/cartao/${id}/estornar`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postSplit = (token, transacao) => {
  const url = `${API_URL}/split`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      cobranca_boleto_ou_cartao_id: transacao.cobranca_boleto_ou_cartao_id,
      conta_id: transacao.conta_id,
      porcentagem: transacao.porcentagem,
      valor: transacao.valor,
      responsavel_pelo_prejuizo: transacao.responsavel_pelo_prejuizo,
      usar_valor_liquido: transacao.usar_valor_liquido,
    },
  });
};

export const getBoletosFilter = (
  token,
  page,
  like,
  order,
  mostrar,
  conta_id,
) => {
  const url = `${API_URL}/boleto?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&conta_id=${conta_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getBoletos = (token, page, like, order, mostrar) => {
  const url = `${API_URL}/boleto?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagamentos = (token, page, like, order, mostrar) => {
  const url = `${API_URL}/pagamento?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCarneFilters = (
  token,
  page,
  like,
  order,
  mostrar,
  conta_id,
) => {
  const url = `${API_URL}/carne?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&conta_id=${conta_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getLinkPagamentosFilter = (
  token,
  page,
  like,
  order,
  mostrar,
  conta_id,
) => {
  const url = `${API_URL}/link-pagamento?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&conta_id=${conta_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getLancamentosFuturos = (
  token,
  page,
  data_liberacao_inicial,
  data_liberacao_final,
) => {
  const url = `${API_URL}/lancamento-futuro?page=${page}&data_liberacao_inicial=${data_liberacao_inicial}&data_liberacao_final=${data_liberacao_final}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getExtratoFilters = (
  token,
  page,
  id,
  day,
  order,
  mostrar,
  tipo,
  conta_id,
  data_inicial,
  data_final,
) => {
  const url = `${API_URL}/extrato?page=${page}&day=${day}&id=${id}&order=${order}&mostrar=${mostrar}&tipo=${tipo}&conta_id=${conta_id}&data_inicial=${data_inicial}&data_final=${data_final}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getExportExtrato = (
  token,
  page,
  id,
  day,
  order,
  mostrar,
  tipo,
  conta_id,
  data_inicial,
  data_final,
  export_type,
) => {
  const url = `${API_URL}/export/extrato?page=${page}&day=${day}&id=${id}&order=${order}&mostrar=${mostrar}&tipo=${tipo}&conta_id=${conta_id}&data_inicial=${data_inicial}&data_final=${data_final}&export_type=${export_type}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getExportExtratoTransacoesBeneficiarios = (
  token,
  page,
  conta_id,
  export_type,
  filters,
) => {
  const url = `${API_URL}/export/extrato?page=${page}&conta_id=${conta_id}&export_type=${export_type}&${filters}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAssinaturasFilters = (
  token,
  page,
  like,
  plano,
  order,
  mostrar,
  conta_id,
) => {
  const url = `${API_URL}/assinatura?page=${page}&like=${like}&plano=${plano}&order=${order}&mostrar=${mostrar}&conta_id=${conta_id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPlanosAll = (token) => {
  const url = `${API_URL}/plano-assinatura`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getHistoricoTransacaoFilters = (
  token,
  page,
  day,
  order,
  mostrar,
  status,
  like,
  payment_type,
  data_inicial,
  data_final,
  id,
  documento,
  vencimento_inicial,
  vencimento_final,
  pagamento_inicial,
  pagamento_final,
  conta_id,
) => {
  const url = `${API_URL}/transacao?page=${page}&id=${id}&day=${day}&order=${order}&mostrar=${mostrar}&status=${status}&like=${like}&payment_type=${payment_type}&documento=${documento}&data_inicial=${data_inicial}&data_final=${data_final}&vencimento_inicial=${vencimento_inicial}&vencimento_final=${vencimento_final}&conta_id=${conta_id}&pagamento_inicial=${pagamento_inicial}&pagamento_final=${pagamento_final}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getExportHistoricoTransacao = (
  token,
  page,
  day,
  order,
  mostrar,
  status,
  like,
  payment_type,
  data_inicial,
  data_final,
  id,
  documento,
  vencimento_inicial,
  vencimento_final,
  pagamento_inicial,
  pagamento_final,
  conta_id,
) => {
  const url = `${API_URL}/export/transacao?page=${page}&id=${id}&day=${day}&order=${order}&mostrar=${mostrar}&status=${status}&like=${like}&payment_type=${payment_type}&documento=${documento}&data_inicial=${data_inicial}&data_final=${data_final}&vencimento_inicial=${vencimento_inicial}&vencimento_final=${vencimento_final}&conta_id=${conta_id}&pagamento_inicial=${pagamento_inicial}&pagamento_final=${pagamento_final}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagadoresFilter = (
  token,
  page,
  like,
  order,
  mostrar,
  conta_id,
) => {
  const url = `${API_URL}/pagador?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&conta_id=${conta_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagadores = (token, page, like, order, mostrar) => {
  const url = `${API_URL}/pagador?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePagador = (token, id) => {
  const url = `${API_URL}/pagador/${id}`;

  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransacaoTed = (
  token,
  page,
  like,
  order,
  mostrar,
  conta_id,
) => {
  const url = `${API_URL}/ted?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&conta_id=${conta_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransacaoTedCliente = (token, page, like, order, mostrar) => {
  const url = `${API_URL}/ted?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransacaoTedId = (token, id) => {
  const url = `${API_URL}/ted/${id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postTransacaoTed = async (
  token,
  tokenApp,
  banco,
  agencia,
  conta,
  digitoConta,
  tipo_conta,
  documento,
  nome,
  valor,
  favorito,
) => {
  const url = `${API_URL}/ted`;

  return axios({
    method: "post",
    url,
    data: {
      banco,
      token: tokenApp,
      agencia,
      conta,
      digito_conta: digitoConta,
      tipo_conta,
      documento,
      nome,
      valor,
      favorito,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const postNovoPagador = async (
  token,
  documento,
  nome,
  celular,
  data_nascimento,
  email,
  cep,
  rua,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
) => {
  const url = `${API_URL}/pagador`;

  return axios({
    method: "post",
    url,
    data: {
      documento,
      nome,
      celular,
      data_nascimento,
      email,
      endereco: {
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
      },
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransacaoPix = (
  token,
  page,
  like,
  order,
  mostrar,
  conta_id,
) => {
  const url = `${API_URL}/pagamento-pix?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&conta_id=${conta_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransacaoPixId = (token, id) => {
  const url = `${API_URL}/pagamento-pix/${id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getChavesPix = (token, page, like, order, mostrar, conta_id) => {
  const url = `${API_URL}/dict-pix?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&conta_id=${conta_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const putUserConta = (token, conta) => {
  const url = `${API_URL}/perfil`;

  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      nome: conta.nome,
      razao_social: conta.razao_social,
      celular: conta.celular,
      site: conta.site,
      endereco: {
        cep: conta.endereco.cep,
        rua: conta.endereco.rua,
        numero: conta.endereco.numero,
        complemento: conta.endereco.complemento,
        bairro: conta.endereco.bairro,
        cidade: conta.endereco.cidade,
        estado: conta.endereco.estado,
      },
    },
  });
};

export const getTransacaoId = (token, id) => {
  const url = `${API_URL}/transacao/${id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getRecebiveisId = (token, id) => {
  const url = `${API_URL}/transacao-recebiveis/${id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransferenciaId = (token, id) => {
  const url = `${API_URL}/transferencia/${id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getHistoricoTransferenciaFilters = (
  token,
  page,
  like,
  valor,
  data,
  conta_id,
) => {
  const url = `${API_URL}/transferencia?page=${page}&like=${like}&valor=${valor}&data=${data}&conta_id=${conta_id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getHistoricoTransferencia = (
  token,
  page,
  like,
  order,
  mostrar,
) => {
  const url = `${API_URL}/transferencia?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getExportHistoricoTransferencia = (
  token,
  page,
  like,
  valor,
  data,
  conta_id,
) => {
  const url = `${API_URL}/export/transferencia?page=${page}&like=${like}&valor=${valor}&data=${data}&conta_id=${conta_id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserData = (token) => {
  const url = `${API_URL}/perfil`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getListaCartoes = (token) => {
  const url = `${API_URL}/conta/cartao-pre-pago`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postSolicitarCartao = (token, type) => {
  const url = `${API_URL}/conta/cartao-pre-pago`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      type,
    },
  });
};

export const postConfirmarCartao = (token, id) => {
  const url = `${API_URL}/conta/cartao-pre-pago/${id}/confirm/card/request`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const postBloquearDesbloquearCartao = (token, id, pin, reazon_code) => {
  const url = `${API_URL}/conta/cartao-pre-pago/${id}/lock/unlock`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // data: {
    //   pin,
    //   reazon_code,
    // },
  });
};
export const delCancelarCartao = (token, id, pin, reazon_code) => {
  const url = `${API_URL}/conta/cartao-pre-pago/${id}`;

  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      // pin,
      reazon_code,
    },
  });
};

export const postCartaoStatus = (token, id) => {
  const url = `${API_URL}/conta/cartao-pre-pago/${id}/status`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postAtivarCartao = (token, id, barcode, tokenId) => {
  const url = `${API_URL}/conta/cartao-pre-pago/${id}/enable`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      barcode: barcode,
      token2: tokenId,
    },
  });
};

export const postPrimeiraSenhaCartao = (token, id, pin, pinConfirmation) => {
  const url = `${API_URL}/conta/cartao-pre-pago/${id}/change/pin`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      new_pin: pin,
      new_pin_confirmation: pinConfirmation,
    },
  });
};

export const postAlterarSenhaCartao = (
  token,
  id,
  pinAtual,
  pin,
  pinConfirmation,
) => {
  const url = `${API_URL}/conta/cartao-pre-pago/${id}/change/pin`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      current_pin: pinAtual,
      new_pin: pin,
      new_pin_confirmation: pinConfirmation,
    },
  });
};

export const getListaAdministrador = (token, page, like, order, mostrar) => {
  const url = `${API_URL}/administrador?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteAdmin = (token, id) => {
  const url = `${API_URL}/administrador/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getReenviarTokenUsuario = (token, id) => {
  const url = `${API_URL}/reenviar_token/${id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postFirstAcess = (user) => {
  const url = `${API_URL}/administrador/criar-senha`;

  return axios({
    method: "post",
    url,
    data: {
      email: user.email,
      token: user.token,
      password: user.password,
      password_confirmation: user.password_confirmation,
    },
  });
};

export const postResetPassword = (user) => {
  const url = `${API_URL}/auth/reset/password`;

  return axios({
    method: "post",
    url,
    data: {
      email: user.email,
      token: user.token,
      password: user.password,
      password_confirmation: user.password_confirmation,
    },
  });
};

export const postSendReset = (user) => {
  const url = `${API_URL}/auth/reset-password`;

  return axios({
    method: "post",
    url,
    data: {
      email: user.email,
    },
  });
};

export const postCriarAdmin = (token, email) => {
  const url = `${API_URL}/administrador`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { email },
  });
};

export const getCep = (cep) => {
  const url = `https://viacep.com.br/ws/${cep}/json`;

  return axios({
    method: "get",
    url,
  });
};

export const getPerfilTaxa = (token, like) => {
  const url = `${API_URL}/conta/perfil-taxa?like=${like}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPerfilTaxaId = (token, id) => {
  const url = `${API_URL}/conta/perfil-taxa/${id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postPerfilTaxa = (
  token,
  nome,
  cash_in_payout_zoop,
  tipo_cash_in_boleto,
  cash_in_boleto,
  tipo_cash_in_ted,
  cash_in_ted,
  tipo_cash_in_pix,
  cash_in_pix,
  tipo_cash_in_p2p,
  cash_in_p2p,
  tipo_cash_out_p2p,
  cash_out_p2p,
  tipo_cash_out_ted,
  cash_out_ted,
  tipo_cash_out_pix,
  cash_out_pix,
) => {
  const url = `${API_URL}/conta/perfil-taxa`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      nome,
      cash_in_payout_zoop,
      tipo_cash_in_boleto,
      cash_in_boleto,
      tipo_cash_in_ted,
      cash_in_ted,
      tipo_cash_in_pix,
      cash_in_pix,
      tipo_cash_in_p2p,
      cash_in_p2p,
      tipo_cash_out_p2p,
      cash_out_p2p,
      tipo_cash_out_ted,
      cash_out_ted,
      tipo_cash_out_pix,
      cash_out_pix,
    },
  });
};

export const putPerfilTaxa = (
  token,
  nome,
  cash_in_payout_zoop,
  tipo_cash_in_boleto,
  cash_in_boleto,
  tipo_cash_in_ted,
  cash_in_ted,
  tipo_cash_in_pix,
  cash_in_pix,
  tipo_cash_in_p2p,
  cash_in_p2p,
  tipo_cash_out_p2p,
  cash_out_p2p,
  tipo_cash_out_ted,
  cash_out_ted,
  tipo_cash_out_pix,
  cash_out_pix,
  id,
) => {
  const url = `${API_URL}/conta/perfil-taxa/${id}`;
  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      nome,
      cash_in_payout_zoop,
      tipo_cash_in_boleto,
      cash_in_boleto,
      tipo_cash_in_ted,
      cash_in_ted,
      tipo_cash_in_pix,
      cash_in_pix,
      tipo_cash_in_p2p,
      cash_in_p2p,
      tipo_cash_out_p2p,
      cash_out_p2p,
      tipo_cash_out_ted,
      cash_out_ted,
      tipo_cash_out_pix,
      cash_out_pix,
    },
  });
};

export const deletePerfilTaxa = (token, id) => {
  const url = `${API_URL}/conta/perfil-taxa/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postVincularPerfilTaxa = (token, id, conta_id) => {
  const url = `${API_URL}/conta/perfil-taxa/${id}/vincular`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id,
    },
  });
};

export const postUserBloquearDesbloquear = (token, id) => {
  const url = `${API_URL}/user/${id}/bloquear-debloquear`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPermissao = (token, id) => {
  const url = `${API_URL}/permissao/${id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postPermissao = (token, id, tipoPermissao) => {
  const url = `${API_URL}/permissao`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      tipo: tipoPermissao,
      user_id: id,
    },
  });
};

export const deletePermissao = (token, id, tipoPermissao) => {
  const url = `${API_URL}/permissao`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      tipo: tipoPermissao,
      user_id: id,
    },
  });
};

export const postAuthMe = (token) => {
  const url = `${API_URL}/auth/me`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {},
  });
};

export const getLogs = (token, user_id, page, like, order, mostrar) => {
  const url = `${API_URL}/conta/log?user_id=${user_id}&page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getListarProdutosGiftCard = (
  token,
  conta_id,
  page,
  like,
  order,
  mostrar,
) => {
  const url = `${API_URL}/cobranca/gift-card?conta_id=${conta_id}&page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getListaCobrancasRecebidasWallet = (
  token,
  page,
  like,
  order,
  mostrar,
) => {
  const url = `${API_URL}/cobranca/qr-code-debit?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getListarProdutosGiftCardAdmin = (
  token,
  page,
  like,
  cpf,
  status,
  created_at_between_start,
  created_at_between_end,
  nsu_transaction,
  id_transaction,
  value_start,
  value_end,
  order,
  mostrar,
) => {
  const url = `${API_URL}/cobranca/gift-card?page=${page}&like=${like}&cpf=${cpf}&status=${status}&data_inicial=${created_at_between_start}&data_final=${created_at_between_end}&nsu_transaction=${nsu_transaction}&id_transaction=${id_transaction}&valor_inicial=${value_start}&valor_final=${value_end}&order=${order}&mostrar=${mostrar}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDetalhesGiftCard = (token, id) => {
  const url = `${API_URL}/cobranca/gift-card-show/${id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getListarRecargas = (
  token,
  conta_id,
  page,
  like,
  order,
  mostrar,
) => {
  const url = `${API_URL}/cobranca/recarga-celular?conta_id=${conta_id}&page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getListarRecargasAdmin = (
  token,
  page,
  like,
  cpf,
  status,
  created_at_between_start,
  created_at_between_end,
  nsu_transaction,
  id_transaction,
  value_start,
  value_end,
  order,
  mostrar,
) => {
  const url = `${API_URL}/cobranca/recarga-celular?page=${page}&like=${like}&cpf=${cpf}&status=${status}&data_inicial=${created_at_between_start}&data_final=${created_at_between_end}&nsu_transaction=${nsu_transaction}&id_transaction=${id_transaction}&valor_inicial=${value_start}&valor_final=${value_end}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPartnerTransacions = (
  token,
  page,
  order,
  status,
  mostrar,
  cpf,
  expiration_date_start,
  expiration_date_end,
  created_at_between_start,
  created_at_between_end,
  nsu_transaction,
  email,
  name,
  ddd_phone,
  value_start,
  value_end,
  agency_code,
) => {
  const query = new Query({
    base_url: `${API_URL}/partner-transaction`,
  });

  const url = query
    .for("list-transaction")
    .whereIn("created_at_between", [
      created_at_between_start,
      created_at_between_end,
    ])
    .whereIn("expired_date_between", [
      expiration_date_start,
      expiration_date_end,
    ])
    .whereIn("value_between", [value_start, value_end])
    .where("nsu_transaction", nsu_transaction)
    .where("email", email)
    .where("name", name)
    .where("ddd_phone", ddd_phone)
    .where("cpf", cpf)
    .where("agency_code", agency_code)
    .where("status", status)
    .page(page)
    .sort(order.replace(" ", "") === "" ? "-created_at" : order)
    .limit(mostrar === " " ? 10 : parseInt(mostrar))
    .url();

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDetalhesRecarga = (token, id) => {
  const url = `${API_URL}/cobranca/recarga-celular/${id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getListaPreConta = (token, page, like, order, mostrar) => {
  const url = `${API_URL}/pre-conta?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPreContaId = (token, id) => {
  const url = `${API_URL}/pre-conta/${id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getPreContaJuridicaId = (id) => {
  const url = `${API_URL}/pre-conta-juridica/${id}`;

  return axios({
    method: "get",
    url,
  });
};

export const getExportPartnerTransacions = (
  token,
  page,
  order,
  status,
  mostrar,
  cpf,
  expiration_date_start,
  expiration_date_end,
  created_at_between_start,
  created_at_between_end,
  nsu_transaction,
  email,
  name,
  ddd_phone,
  value_start,
  value_end,
  agency_code,
) => {
  const query = new Query({
    base_url: `${API_URL}/partner-transaction`,
  });

  const url = query
    .for("export-transactions")
    .whereIn("created_at_between", [
      created_at_between_start,
      created_at_between_end,
    ])
    .whereIn("expired_date_between", [
      expiration_date_start,
      expiration_date_end,
    ])
    .whereIn("value_between", [value_start, value_end])
    .where("nsu_transaction", nsu_transaction)
    .where("email", email)
    .where("name", name)
    .where("ddd_phone", ddd_phone)
    .where("cpf", cpf)
    .where("status", status)
    .where("agency_code", agency_code)
    .sort(order.replace(" ", "") === "" ? "-created_at" : order)
    .url();

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postBloquearDeviceAdm = (token, conta_id, descricao) => {
  const url = `${API_URL}/conta/device-bloqueado`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id,
      descricao,
    },
  });
};

export const postDesbloquearDeviceAdm = (token, conta_id) => {
  const url = `${API_URL}/conta/verificacao-seguranca/${conta_id}/desbloquear`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getListaDeviceBloqueado = (token, page, like, order, mostrar) => {
  const url = `${API_URL}/conta/device-bloqueado?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postDesvincularPerfilTaxa = (token, conta_id, taxa_id) => {
  const url = `${API_URL}/conta/perfil-taxa/${taxa_id}/desvincular`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { conta_id },
  });
};

export const postBlackListSelfie = (token, conta_id, blacklist_selfie) => {
  const url = `${API_URL}/conta/black-list-selfie`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id,
      blacklist_selfie,
    },
  });
};

export const getBlacklist = (token, page, like, order, mostrar) => {
  const url = `${API_URL}/conta/black-list-selfie?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postBuscarConta = (documento) => {
  const url = `${API_URL}/conta/buscar`;
  return axios({
    method: "post",
    url,
    data: { documento: documento },
  });
};

export const postEtapa1 = (etapa1) => {
  const url = `${API_URL}/pre-conta-juridica/etapa1`;
  return axios({
    method: "post",
    url,
    data: etapa1,
  });
};

export const postEtapa2 = (etapa2) => {
  const url = `${API_URL}/pre-conta-juridica/etapa2`;
  return axios({
    method: "post",
    url,
    data: etapa2,
  });
};

export const postEtapa3 = (documento) => {
  const url = `${API_URL}/pre-conta-juridica/etapa3`;
  return axios({
    method: "post",
    url,
    data: {
      documento: documento,
    },
  });
};

export const postVerificarContato = (documento, email, celular) => {
  const url = `${API_URL}/verifica_contato/`;
  return axios({
    method: "post",
    url,
    data: { documento: documento, email: email, celular: celular },
  });
};

export const postReenviarToken = (documento, tipo) => {
  const url = `${API_URL}/reenviar_token/`;
  return axios({
    method: "post",
    url,
    data: {
      documento: documento,
      tipo: tipo,
    },
  });
};

export const postValidarToken = (validarToken) => {
  const url = `${API_URL}/validar_token/`;
  return axios({
    method: "post",
    url,
    data: validarToken,
  });
};

export const postEtapa4 = (etapa4) => {
  const url = `${API_URL}/pre-conta-juridica/etapa4`;
  return axios({
    method: "post",
    url,
    data: etapa4,
  });
};

export const postPreContaRepresentante = (representante) => {
  const url = `${API_URL}/pre-conta-representante`;
  return axios({
    method: "post",
    url,
    data: representante,
  });
};

export const putRepresentante = (representante, id) => {
  const url = `${API_URL}/pre-conta-representante/${id}`;

  return axios({
    method: "put",
    url,
    data: representante,
  });
};

export const deleteRepresentante = (id) => {
  const url = `${API_URL}/pre-conta-representante/${id}`;
  return axios({
    method: "delete",
    url,
  });
};

export const getRepresentante = (id) => {
  const url = `${API_URL}/pre-conta-representante?preconta_id=${id}`;

  return axios({
    method: "get",
    url,
  });
};

export const postEtapa5 = (etapa5) => {
  const url = `${API_URL}/pre-conta-juridica/etapa5`;
  return axios({
    method: "post",
    url,
    data: etapa5,
  });
};

export const getDocumentoPreConta = (id) => {
  const url = `${API_URL}/pre-conta-documento?preconta_id=${id}&mostrar=100`;
  return axios({
    method: "get",
    url,
  });
};

export const deleteDocumentoPreConta = (id) => {
  const url = `${API_URL}/pre-conta-documento/${id}`;
  return axios({
    method: "delete",
    url,
  });
};

export const postDocumentoPreConta = (
  preconta_id,
  documento,
  categoria,
  descricao,
) => {
  const url = `${API_URL}/pre-conta-documento`;
  var bodyFormData = new FormData();
  bodyFormData.append("preconta_id", preconta_id);
  bodyFormData.append("documento", documento);
  bodyFormData.append("categoria", categoria);
  bodyFormData.append("descricao", descricao);

  return axios({
    method: "post",
    url,

    data: bodyFormData,
  });
};

export const postContaPJ = (contaPJ) => {
  const url = `${API_URL}/conta-juridica`;
  return axios({
    method: "post",
    url,
    data: contaPJ,
  });
};

export const postAcessoWeb = () => {
  const url = `${API_URL}/acesso-web`;
  return axios({
    method: "post",
    url,
  });
};

export const getAcessoWeb = (id) => {
  const url = `${API_URL}/acesso-web/${id}`;
  return axios({
    method: "get",
    url,
  });
};

export const getPagamentoPix = (token, page, filters) => {
  const url = `${API_URL}/pagamento-pix?page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getConsultaChavePix = (token, chave) => {
  chave = chave.replace("/", "").replace(".", "");

  const url = `${API_URL}/pagamento-pix/${chave}/consultar`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getConsultarCodigoDeBarras = (token, codigo) => {
  const url = `${API_URL}/pagamento/${codigo}/consultar`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postPagarBoleto = (
  token,
  juros,
  desconto,
  codigoDeBarras,
  valor,
  descricao,
  vencimento,
  tokenApp,
) => {
  const url = `${API_URL}/pagamento`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      juros,
      desconto,
      codigo_barras: codigoDeBarras,
      valor,
      descricao,
      vencimento,
      token: tokenApp,
    },
  });
};

export const postGerarBoleto = (
  token,
  pagadorId,
  valor,
  descricao,
  instrucao1,
  instrucao2,
  instrucao3,
  dataVencimento,
  tipoMulta,
  valorMulta,
  tipoJuros,
  valorJuros,
  tipoDesconto,
  valorDesconto,
  dataLimiteDesconto,
) => {
  const url = `${API_URL}/boleto`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      pagador_id: pagadorId,
      tipo: "Charge",
      valor,
      descricao,
      instrucao1,
      instrucao2,
      instrucao3,
      data_vencimento: dataVencimento,
      tipo_multa: tipoMulta,
      valor_multa: valorMulta,
      multa: valorMulta <= 0 ? false : true,
      tipo_juros: tipoJuros,
      valor_juros: valorJuros,
      juros: valorJuros <= 0 ? false : true,
      tipo_desconto: tipoDesconto,
      valor_desconto: valorDesconto,
      data_limite_valor_desconto: dataLimiteDesconto,
      data_desconto: dataLimiteDesconto,
      desconto: valorDesconto <= 0 ? false : true,
    },
  });
};
export const postPagamentoPix = (
  token,
  tipo_cashout, //Emv, Dict, Manual
  tipo,
  chave_recebedor,
  valor,
  favorito,
  descricao,
  dataToken,
  pagador,
  ExternalIdentifier,
  emv,
) => {
  const url = `${API_URL}/pagamento-pix`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      tipo_cashout,
      ...(tipo_cashout === "Manual"
        ? { pagador }
        : {
            tipo,
            chave_recebedor,
          }),
      valor,
      favorito,
      descricao,
      token: dataToken,
      ExternalIdentifier,
      emv,
    },
  });
};

export const postGerarQrCode = (
  token,
  mensagem,
  valor,
  tipo_cashin,
  expiracao_data,
  pagador,
) => {
  const url = `${API_URL}/dict-pix/qrcode`;
  (() => {
    if (pagador.documento.length > 14) {
      pagador.cnpj = pagador.documento;
    } else {
      pagador.cpf = pagador.documento;
    }
  })();

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      mensagem: mensagem,
      valor: valor,
      tipo_cashin: tipo_cashin,
      ...(expiracao_data ? { expiracao_data } : ""),
      ...(pagador.nome && pagador.documento ? { pagador } : ""),
    },
  });
};
export const postLerQrCode = (token, codigo) => {
  const url = `${API_URL}/dict-pix/ler-qrcode`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      codigo,
    },
  });
};
export const postTransferenciaP2P = async (
  token,
  contaDestino,
  valor,
  descricao = "",
  favorito = false,
  tokenQrcode,
) => {
  const url = `${API_URL}/transferencia`;

  return axios({
    method: "post",
    url,
    data: {
      conta_destino_id: contaDestino,
      valor: valor,
      descricao: descricao,
      favorito: favorito,
      token: tokenQrcode,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postCriarChave = (token, criarChave) => {
  const url = `${API_URL}/dict-pix`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: criarChave,
  });
};

export const delChave = (token, chave_id) => {
  const url = `${API_URL}/dict-pix/${chave_id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postConfirmarPropriedade = (token, chave_id, codigo) => {
  const url = `${API_URL}/dict-pix/${chave_id}/confirmar-propriedade`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { codigo: codigo },
  });
};

export const getReenviarCodigo = (token, chave_id) => {
  const url = `${API_URL}/dict-pix/${chave_id}/reenviar-2fac`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteUserRepresentante = (token, id) => {
  const url = `${API_URL}/user/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postUserRepresentante = (token, representante) => {
  const url = `${API_URL}/user`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: representante,
  });
};

export const putUserOperador = (token, id, nome, permissao) => {
  const url = `${API_URL}/user/${id}`;
  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      nome: nome,
      permissao: permissao,
    },
  });
};

export const getPagamentoPixAprovar = (token, page) => {
  const url = `${API_URL}/pagamento-pix/aprovar?page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagamentoAprovar = (token, page) => {
  const url = `${API_URL}/pagamento/aprovar?page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagamentoTEDAprovar = (token, page) => {
  const url = `${API_URL}/ted/aprovar?page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagamentoTransferenciaAprovar = (token, page) => {
  const url = `${API_URL}/transferencia/aprovar?page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagamentoWalletAprovar = (token, page) => {
  const url = `${API_URL}/financa/qr-code/aprovar?page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postPagamentoPixAprovar = (
  token,
  aprovar,
  todos_registros,
  registros,
  dataToken,
) => {
  const url = `${API_URL}/pagamento-pix/aprovar`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      aprovar,
      todos_registros,
      registros,
      token: dataToken,
    },
  });
};

export const deletePagamentoPixAprovar = (token, id) => {
  const url = `${API_URL}/pagamento-pix/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const postPagamentoAprovar = (
  token,
  aprovar,
  todos_registros,
  registros,
  dataToken,
) => {
  const url = `${API_URL}/pagamento/aprovar`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      aprovar,
      todos_registros,
      registros,
      token: dataToken,
    },
  });
};
export const postPagamentoTEDAprovar = (
  token,
  aprovar,
  todos_registros,
  registros,
  dataToken,
) => {
  const url = `${API_URL}/ted/aprovar`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      aprovar,
      todos_registros,
      registros,
      token: dataToken,
    },
  });
};
export const postPagamentoTransferenciaAprovar = (
  token,
  aprovar,
  todos_registros,
  registros,
  dataToken,
) => {
  const url = `${API_URL}/transferencia/aprovar`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      aprovar,
      todos_registros,
      registros,
      token: dataToken,
    },
  });
};

export const postPagamentoWalletAprovar = (
  token,
  aprovar,
  todos_registros,
  registros,
  dataToken,
) => {
  const url = `${API_URL}/financa/qr-code/aprovar`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      aprovar,
      todos_registros,
      registros,
      token: dataToken,
    },
  });
};

export const getFuncionario = (token, grupo_id, page, like, order, mostrar) => {
  const url = `${API_URL}/conta/funcionario?grupo_id=${grupo_id}&page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getFuncionarioGrupo = (token, page, like) => {
  const url = `${API_URL}/conta/funcionario-grupo?page=${page}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postFuncionario = (token, conta_funcionario_id, grupo_id) => {
  const url = `${API_URL}/conta/funcionario`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      token,
      conta_funcionario_id,
      grupo_id,
    },
  });
};

export const postFuncionarioGrupo = (token, nome, descricao) => {
  const url = `${API_URL}/conta/funcionario-grupo`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      token,
      nome,
      descricao,
    },
  });
};

export const putUpdateFuncionario = (token, grupo_id, id) => {
  const url = `${API_URL}/conta/funcionario/${id}`;

  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      grupo_id: grupo_id,
    },
  });
};

export const putUpdateFuncionarioGrupo = (token, nome, descricao, id) => {
  const url = `${API_URL}/conta/funcionario-grupo/${id}`;

  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      nome: nome,
      descricao: descricao,
    },
  });
};

export const deleteFuncionario = (token, id) => {
  const url = `${API_URL}/conta/funcionario/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteFuncionarioGrupo = (token, id) => {
  const url = `${API_URL}/conta/funcionario-grupo/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFolhaDePagamento = (token, page, like) => {
  const url = `${API_URL}/conta/folha-pagamento?page=${page}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFolhaDePagamentoBene = (token, page, like) => {
  const url = `${API_URL}/concorrencia/pagamento-estabelecimento?page=${page}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFolhaDePagamentoConc = (token, page = 1, filters = "") => {
  const url = `${API_URL}/concorrencia/cartao-privado-pagamento?page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getShowFolhaDePagamentoConc = (token, id) => {
  const url = `${API_URL}/concorrencia/cartao-privado-pagamento/${id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteFolhaDePagamentoConc = (token, id) => {
  const url = `${API_URL}/concorrencia/cartao-privado-pagamento/${id}`;

  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFolhaDePagamentoVoucher = (token, page = 1, filters = "") => {
  const url = `${API_URL}/concorrencia/pagamento-aluguel?page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getShowFolhaDePagamentoVoucher = (token, id) => {
  const url = `${API_URL}/concorrencia/pagamento-aluguel/${id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFolhaDePagamentoShow = (token, id) => {
  const url = `${API_URL}/conta/folha-pagamento/${id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postFolhaPagamentoAprovar = (
  token,
  aprovar,
  todos_registros,
  registros,
  dataToken,
) => {
  const url = `${API_URL}/conta/folha-pagamento/aprovar`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      aprovar,
      todos_registros,
      registros,
      token: dataToken,
    },
  });
};

export const postFolhaPagamentoAprovarConc = (
  token,
  aprovar,
  todos_registros,
  registros,
  dataToken,
) => {
  const url = `${API_URL}/concorrencia/cartao-privado-pagamento/aprovar`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      aprovar,
      todos_registros,
      registros,
      token: dataToken,
    },
  });
};

export const postFolhaPagamentoAprovarBene = (
  token,
  aprovar,
  todos_registros,
  registros,
  dataToken,
) => {
  const url = `${API_URL}/concorrencia/pagamento-estabelecimento/aprovar`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      aprovar,
      todos_registros,
      registros,
      token: dataToken,
    },
  });
};

export const postFolhaPagamentoAprovarVoucher = (
  token,
  aprovar,
  todos_registros,
  registros,
  dataToken,
) => {
  const url = `${API_URL}/concorrencia/pagamento-aluguel/aprovar`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      aprovar,
      todos_registros,
      registros,
      token: dataToken,
    },
  });
};

export const getFolhaDePagamentoAprovar = (token, page, like) => {
  const url = `${API_URL}/conta/folha-pagamento/aprovar?page=${page}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFolhaDePagamentoAprovarConc = (
  token,
  page = 1,
  filters = "",
) => {
  const url = `${API_URL}/concorrencia/cartao-privado-pagamento/aprovar?page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFolhaDePagamentoAprovarBene = (token, page, like) => {
  const url = `${API_URL}/concorrencia/pagamento-estabelecimento/aprovar?page=${page}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFolhaDePagamentoAprovarVoucher = (token, page, like) => {
  const url = `${API_URL}/concorrencia/pagamento-aluguel/aprovar?page=${page}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postFolhaPagamento = (token, data_pagamento, descricao) => {
  const url = `${API_URL}/conta/folha-pagamento`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      token,
      data_pagamento,
      descricao,
    },
  });
};
export const postFolhaPagamentoFuncionarioMulti = (
  token,
  funcionarios,
  folha_pagamento_id,
) => {
  const url = `${API_URL}/conta/folha-pagamento-funcionario/multi/${folha_pagamento_id}`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      token,
      funcionarios,
    },
  });
};

export const deleteFolhaDePagamentoFuncionario = (token, id) => {
  const url = `${API_URL}/conta/folha-pagamento-funcionario/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFolhaDePagamentoFuncionario = (token, page, like) => {
  const url = `${API_URL}/conta/folha-pagamento-funcionario?page=${page}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postFuncionarioLote = (token, arquivo) => {
  const url = `${API_URL}/conta/funcionario-lote`;
  var bodyFormData = new FormData();
  bodyFormData.append("funcionarios", arquivo);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const getListaBanner = (token, page, like, order, mostrar) => {
  const url = `${API_URL}/conta/banner?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&tipo=home_web_pj`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postBanner = (token, banner, tipo) => {
  const url = `${API_URL}/conta/banner`;
  var bodyFormData = new FormData();
  bodyFormData.append("imagem", banner);
  bodyFormData.append("tipo", tipo);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const deleteBanner = (token, id) => {
  const url = `${API_URL}/conta/banner/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getArquivoLote = (token, page) => {
  const url = `${API_URL}/arquivo/by/type/folha-pagamento?page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getArquivoLoteConc = (token, page) => {
  const url = `${API_URL}/arquivo/by/type/cartao-privado-pagamento?page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getArquivoLoteBene = (token, page) => {
  const url = `${API_URL}/arquivo/by/type/pagamento-estabelecimento?page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getArquivoLoteVoucher = (token, page) => {
  const url = `${API_URL}/arquivo/by/type/pagamento-aluguel?page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getArquivoLoteFuncionario = (token, page) => {
  const url = `${API_URL}/arquivo/by/type/funcionario?page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getArquivoLoteComprovante = (token, page) => {
  const url = `${API_URL}/arquivo/by/type/comprovante-folhapagamento?page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postFolhaDePagamentoLote = (
  token,
  arquivo,
  descricao,
  data_pagamento,
) => {
  const url = `${API_URL}/conta/folha-pagamento-lote`;
  var bodyFormData = new FormData();
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

export const postFolhaDePagamentoLoteConc = (
  token,
  arquivo,
  descricao,
  data_pagamento,
) => {
  const url = `${API_URL}/concorrencia/cartao-privado-pagamento-lote`;
  var bodyFormData = new FormData();
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

export const postFolhaDePagamentoLoteBene = (
  token,
  arquivo,
  descricao,
  data_pagamento,
) => {
  const url = `${API_URL}/concorrencia/pagamento-estabelecimento-lote`;
  var bodyFormData = new FormData();
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

export const postFolhaDePagamentoLoteVoucher = (
  token,
  arquivo,
  descricao,
  data_pagamento,
) => {
  const url = `${API_URL}/concorrencia/pagamento-aluguel-lote`;
  var bodyFormData = new FormData();
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

export const postReenviarFolhaDePagamentoLote = (token, arquivo_id) => {
  const url = `${API_URL}/conta/folha-pagamento-lote/${arquivo_id}`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      token,
    },
  });
};

export const getTransferenciaExtrato = (token, document_number) => {
  const url = `${API_URL}/transferencia_extrato/${document_number}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getTedExtrato = (token, document_number) => {
  const url = `${API_URL}/ted_extrato/${document_number}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getPagamentoContaExtrato = (token, document_number) => {
  const url = `${API_URL}/pagamento_extrato/${document_number}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getPagamentoPixExtrato = (token, document_number) => {
  const url = `${API_URL}/pagamento-pix/${document_number}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postReivindicarPropriedade = (token, chave_id) => {
  const url = `${API_URL}/dict-pix/${chave_id}/confirmar-reinvindicacao`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postReivindicaçãoPortabilidade = (token, confirmar, chave_id) => {
  const url = `${API_URL}/dict-pix/${chave_id}/confirmar-portabilidade`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      confirmar: confirmar,
    },
  });
};

export const getCartaoHistoricoTransacao = (
  token,
  page,
  like,
  order,
  mostrar,
) => {
  const url = `${API_URL}/financa/cartao-pre-pago`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postEnviarComprovanteFolha = (token, id) => {
  const url = `${API_URL}/conta/folha-pagamento/enviar-comprovante/${id}`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFavoritosPix = (token, page = 1, like = "") => {
  const url = `${API_URL}/favorito/pix?page=${page}&ike=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteFavoritoPix = (token, id) => {
  const url = `${API_URL}/favorito/pix/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getFavoritosTED = (token) => {
  const url = `${API_URL}/favorito/ted`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteFavoritoTED = (token, id) => {
  const url = `${API_URL}/favorito/ted/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getFavoritosP2P = (token) => {
  const url = `${API_URL}/favorito/transferencia`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteFavoritoP2P = (token, id) => {
  const url = `${API_URL}/favorito/transferencia/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getFavoritosWallet = (token) => {
  const url = `${API_URL}/favorito/transferencia-qr-code`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteFavoritoWallet = (token, id) => {
  const url = `${API_URL}/favorito/transferencia-qr-code/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postLinkPagamento = (token, linkPagamento) => {
  const url = `${API_URL}/link-pagamento`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      valor: linkPagamento.valor,
      limite_parcelas: linkPagamento.limite_parcelas,
      vencimento: linkPagamento.vencimento,
      quantidade_utilizacoes: linkPagamento.quantidade_utilizacoes,
      senha: linkPagamento.senha,
      numero_pedido: linkPagamento.numero_pedido,
      descricao: linkPagamento.descricao,
      status: linkPagamento.status,
      pagador_id: linkPagamento.pagador_id,
      pagamento: linkPagamento.pagamento,
    },
  });
};

export const getPagadorId = (token, id) => {
  const url = `${API_URL}/pagador/${id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getLinkPagamentoId = (token, id) => {
  const url = `${API_URL}/link-pagamento/${id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const putPagador = (token, pagador, id) => {
  const url = `${API_URL}/pagador/${id}`;
  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id: pagador.conta_id,
      documento: pagador.documento,
      nome: pagador.nome,
      celular: pagador.celular,
      data_nascimento: pagador.data_nascimento,
      email: pagador.email,
      endereco: {
        cep: pagador.endereco.cep,
        rua: pagador.endereco.rua,
        numero: pagador.endereco.numero,
        complemento: pagador.endereco.complemento,
        bairro: pagador.endereco.bairro,
        cidade: pagador.endereco.cidade,
        estado: pagador.endereco.estado,
      },
    },
  });
};

export const postPagador = (token, pagador) => {
  const url = `${API_URL}/pagador`;
  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id: pagador.conta_id,
      documento: pagador.documento,
      tipo: pagador.tipo,
      nome: pagador.nome,
      celular: pagador.celular,
      data_nascimento: pagador.data_nascimento,
      email: pagador.email,
      endereco: {
        cep: pagador.endereco.cep,
        rua: pagador.endereco.rua,
        numero: pagador.endereco.numero,
        complemento: pagador.endereco.complemento,
        bairro: pagador.endereco.bairro,
        cidade: pagador.endereco.cidade,
        estado: pagador.endereco.estado,
      },
    },
  });
};

export const postCobrancaCartao = (token, cobrancaCartao) => {
  const url = `${API_URL}/cartao`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      pagador_id: cobrancaCartao.pagador_id,
      parcelas: cobrancaCartao.parcelas,
      valor: cobrancaCartao.valor,
      captura: cobrancaCartao.captura,
      cartao: {
        nome: cobrancaCartao.cartao.nome,
        numero: cobrancaCartao.cartao.numero,
        cvv: cobrancaCartao.cartao.cvv,
        mes: cobrancaCartao.cartao.mes,
        ano: cobrancaCartao.cartao.ano,
      },
    },
  });
};

export const putAssinaturas = (token, id, planoId) => {
  const url = `${API_URL}/assinatura/${id}`;
  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      plano_id: planoId,
    },
  });
};

export const deleteAssinatura = (token, id) => {
  const url = `${API_URL}/assinatura/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPlanosFilters = (token, page, like, order, mostrar) => {
  const url = `${API_URL}/plano-assinatura?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePlano = (token, id) => {
  const url = `${API_URL}/plano-assinatura/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPlanoId = (token, id) => {
  const url = `${API_URL}/plano-assinatura/${id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postPlano = (token, plano) => {
  const url = `${API_URL}/plano-assinatura`;
  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      nome: plano.nome,
      valor: plano.valor,
      frequencia: plano.frequencia,
      descricao: plano.descricao,
      duracao: plano.duracao,
    },
  });
};

export const putPlano = (token, id, plano) => {
  const url = `${API_URL}/plano-assinatura/${id}`;
  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      nome: plano.nome,
      valor: plano.valor,
      frequencia: plano.frequencia,
      descricao: plano.descricao,
      duracao: plano.duracao,
    },
  });
};

export const postAssinaturas = (token, assinatura) => {
  const url = `${API_URL}/assinatura`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      plano_id: assinatura.plano_id,
      pagador_id: assinatura.pagador_id,
    },
  });
};

export const postCartaoAssinatura = (token, id, cartao) => {
  const url = `${API_URL}/pagador/${id}/cartao`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      nome: cartao.nome,
      numero: cartao.numero,
      cvv: cartao.cvv,
      mes: cartao.mes,
      ano: cartao.ano,
    },
  });
};

export const postAssinaturaPlan = (token, conta_id, plano_venda_id) => {
  const url = `${API_URL}/assinatura-plano-vendas`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id: conta_id,
      plano_venda_id: plano_venda_id,
    },
  });
};

export const getMinhasAssinaturas = (token, conta_id) => {
  const url = `${API_URL}/minhas-assinaturas-plano-vendas?conta_id=${conta_id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMinhasTaxas = (token, conta_id) => {
  const url = `${API_URL}/minhas-taxas-plano-vendas?conta_id=${conta_id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePlanoAssinatura = (token, plan_id) => {
  const url = `${API_URL}/plano-vendas/${plan_id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePlanoAssinaturaEC = (token, subscription_id) => {
  const url = `${API_URL}/assinatura-plano-vendas/${subscription_id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getExportacoesSolicitadas = (
  token,
  page,
  like,
  order,
  mostrar,
  type,
  conta_id,
) => {
  const url = `${API_URL}/exports-by-account?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&conta_id=${conta_id}&type=${type}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getExportDownload = (token, conta_id, export_id) => {
  const url = `${API_URL}/exports-download?conta_id=${conta_id}&export_id=${export_id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTerminaisPOS = (
  token,
  page,
  conta_id,
  like,
  order,
  mostrar,
) => {
  const url = `${API_URL}/point-of-sales?page=${page}&conta_id=${conta_id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTerminalPOS = (token, posId) => {
  const url = `${API_URL}/point-of-sales/${posId}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTerminalPOS = (token, posId) => {
  const url = `${API_URL}/point-of-sales/${posId}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTerminalPOSTransactions = (token, posId, page) => {
  const url = `${API_URL}/point-of-sales/${posId}/transactions?page=${page}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const putTerminalPOS = (token, posId, name) => {
  const url = `${API_URL}/point-of-sales/${posId}`;
  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      name: name,
    },
  });
};

export const postAceitarTermoAbertura = (nome, cpf) => {
  const url = `${API_URL}/aceite/termo-abertura`;
  return axios({
    method: "post",
    url,

    data: {
      nome: nome,
      cpf: cpf,
    },
  });
};

export const postTerminalPos = (token, conta_id, tokenPOS) => {
  const url = `${API_URL}/point-of-sales`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id: conta_id,
      token: tokenPOS,
    },
  });
};

export const postSocio = (dadosSocio) => {
  const url = `${API_URL}/pre-conta-socio`;
  return axios({
    method: "post",
    url,
    data: dadosSocio,
  });
};

export const putSocio = (dadosSocio, id) => {
  const url = `${API_URL}/pre-conta-socio/${id}`;

  return axios({
    method: "put",
    url,
    data: dadosSocio,
  });
};

export const deleteSocio = (id) => {
  const url = `${API_URL}/pre-conta-socio/${id}`;
  return axios({
    method: "delete",
    url,
  });
};

export const getSocio = (id) => {
  const url = `${API_URL}/pre-conta-socio?preconta_id=${id}`;

  return axios({
    method: "get",
    url,
  });
};

export const getPlanosDeVendas = (token, page, plan_name, order, mostrar) => {
  const url = `${API_URL}/plano-vendas?page=${page}&plan_name=${plan_name}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postPlanoDeVendas = (token, nome) => {
  const url = `${API_URL}/plano-vendas`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      name: nome,
    },
  });
};

export const delPlanoVendas = (token, plan_id) => {
  const url = `${API_URL}/plano-vendas/${plan_id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPlanosDeVendasID = (token, id) => {
  const url = `${API_URL}/plano-vendas/${id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postCriarTaxasPadrao = (token, sales_plan_id) => {
  const url = `${API_URL}/plano-vendas/${sales_plan_id}/create-default-fees`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {},
  });
};
export const postAssinaturaPlanoVendas = (token, conta_id, plano_venda_id) => {
  const url = `${API_URL}/assinatura-plano-vendas`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id: conta_id,
      plano_venda_id: plano_venda_id,
    },
  });
};

export const getSincronizarExtratoConta = (
  token,
  conta_id,
  data_inicial,
  data_final,
) => {
  const url = `${API_URL}/conta/${conta_id}/sincronizar_extrato?data_inicial=${data_inicial}&data_final=${data_final}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getExtratoAdquirenciaFilters = (
  token,
  page,
  id,
  day,
  order,
  mostrar,
  tipo,
  conta_id,
  data_inicial,
  data_final,
) => {
  const url = `${API_URL}/extrato_zoop?page=${page}&day=${day}&id=${id}&order=${order}&mostrar=${mostrar}&tipo=${tipo}&conta_id=${conta_id}&data_inicial=${data_inicial}&data_final=${data_final}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAssinaturaPlanoVendas = (
  token,
  like,
  page,
  plano_venda_id,
  order,
  mostrar,
) => {
  const url = `${API_URL}/assinatura-plano-vendas?like=${like}&page=${page}&plano_venda_id=${plano_venda_id}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const delAssinaturaPlanoVendas = (token, subscription_id) => {
  const url = `${API_URL}/assinatura-plano-vendas/${subscription_id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMeusEcs = (token, agent_id) => {
  const url = `${API_URL}/plano-vendas-meus-ecs/${agent_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const putFees = (token, fee_id, percent_amount, dollar_amount) => {
  const url = `${API_URL}/sales-plan-fees/${fee_id}`;
  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      percent_amount,
      dollar_amount,
    },
  });
};

export const getResumoRecebiveisFuturos = (token, date) => {
  const url = `${API_URL}/transacao-recebimentos-futuros?date=${date}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getResumoCompletoRecebiveis = (token, date) => {
  const url = `${API_URL}/transacao-todos-recebimentos?date=${date}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getGerarToken = (token, page) => {
  const url = `${API_URL}/tokens`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postGerarToken = (token, nome) => {
  const url = `${API_URL}/tokens/create`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      token_name: nome,
    },
  });
};

export const delGerarToken = (token, id) => {
  const url = `${API_URL}/tokens/${id}`;
  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postArquivoRemessa = (token, file) => {
  const url = `${API_URL}/arquivo-remessa/upload`;
  var bodyFormData = new FormData();
  bodyFormData.append("file", file);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: bodyFormData,
  });
};

export const getArquivosExportados = async (
  token,
  conta_id,
  page = 1,
  like = "",
  filters = "",
) => {
  const url = `${API_URL}/exports-by-account?conta_id=${conta_id}&page=${page}&like=${like}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDownloadArquivoExportado = async (
  token,
  export_id,
  conta_id = "",
) => {
  const url = `${API_URL}/exports-download?export_id=${export_id}&conta_id=${conta_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getArquivoDownload = async (token, arquivo_id) => {
  const url = `${API_URL}/arquivo-download?arquivo_id=${arquivo_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getEstadoSearch = (like = "") => {
  const url = `${API_URL}/estado_search?like=${like}`;

  return axios({
    method: "get",
    url,
  });
};

export const getCidadeSearch = (estado, like = "") => {
  const url = `${API_URL}/cidade_search/${estado}?like=${like}`;

  return axios({
    method: "get",
    url,
  });
};
