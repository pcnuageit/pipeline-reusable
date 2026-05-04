import axios from "axios";
import { Query } from "../helpers/cogent-js";
import { parse } from "date-fns";

const API_URL = process.env.REACT_APP_API_URL;

export const getContas = (
  token,
  page,
  like,
  order,
  mostrar,
  id,
  seller,
  status,
  numero_documento,
  tipo,
  cnpj,
  status_adquirencia,
  solicitado_adquirencia,
  agent_id,
  is_estabelecimento,
  is_gestao_concorrencia,
  tipo_beneficio_id = "",
  cpf = "",
  created_at = "",
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
	&tipo=${tipo}&cnpj=${cnpj}&status_adquirencia=${status_adquirencia}&solicitado_adquirencia=${solicitado_adquirencia}&agent_id=${agent_id}&is_estabelecimento=${is_estabelecimento}&is_gestao_concorrencia=${is_gestao_concorrencia}&tipo_beneficio_id=${tipo_beneficio_id}&cpf=${cpf}&created_at=${created_at}`;

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
  const url = `${API_URL}/conta/${id}?representante=${representante}&empresa=${empresa}&socio=${socio}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteConta = (token, id) => {
  const url = `${API_URL}/conta/${id}`;

  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const putConta = (token, conta, id) => {
  const url = `${API_URL}/conta/${id}`;

  const cepMask = (cep) => {
    const parsed = cep?.replace(/\D/g, "");
    const masked = parsed.slice(0, 5) + "-" + parsed.slice(5);
    return masked;
  };

  console.log(conta?.taxa_transacao);

  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      nome: conta?.nome,
      razao_social: conta?.razao_social,
      data_nascimento: conta?.data_nascimento,
      nome_mae: conta?.nome_mae,
      nome_pai: conta?.nome_pai,
      celular: conta?.celular,
      email: conta?.email,
      site: conta?.site,
      endereco: {
        cep: cepMask(conta?.endereco?.cep),
        rua: conta?.endereco?.rua,
        numero: conta?.endereco?.numero,
        complemento: conta?.endereco?.complemento,
        bairro: conta?.endereco?.bairro,
        cidade: conta?.endereco?.cidade,
        estado: conta?.endereco?.estado,
      },
      renda_mensal: conta?.renda_mensal,
      tipo_transferencia: conta?.tipo_transferencia,
      ...(conta?.tipo_transferencia === "Manual"
        ? {
          banco: conta?.banco,
          agencia: conta?.agencia,
          conta: conta?.conta,
        }
        : { chave_pix: conta?.chave_pix }),
      is_terceiro_autorizado: conta?.is_terceiro_autorizado,
      ...(conta?.documento_conta
        ? {
          documento_conta: conta?.documento_conta,
        }
        : null),
      // documento_conta: conta?.documento_conta != null ? conta?.documento_conta : "",
      ...(conta?.taxa_transacao
        ? {
          taxa_transacao: parseFloat(conta?.taxa_transacao).toFixed(2),
        }
        : null),
      //taxa_transacao: parseFloat(conta?.taxa_transacao != "" ? conta?.taxa_transacao.toFixed(2) : 0.00),
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

export const getAprovarConta = (token, id, sendToken = true) => {
  const url = `${API_URL}/conta/${id}/aprovar?enviar_primero_acesso=${sendToken}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getReaprovarConta = (token, id) => {
  const url = `${API_URL}/conta/${id}/reaprovar`;
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
  cnpj,
  export_type,
  accountTypeFilters = "",
) => {
  const url = `${API_URL}/export/conta?page=${page}&like=${like}&id=${id_conta}&seller=${seller}&status=${status}&numero_documento=${numero_documento}&tipo=${tipo}&order=${order}&mostrar=${mostrar}&cnpj=${cnpj}&export_type=${export_type}&${accountTypeFilters}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCartaoExport = (
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
  const url = `${API_URL}/conta/export/cartao-pre-pago?page=${page}&like=${like}&id=${id_conta}&seller=${seller}&status=${status}&numero_documento=${numero_documento}&tipo=${tipo}&order=${order}&mostrar=${mostrar}`;
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

export const getLancamentosFuturos = (token, page, data_liberacao) => {
  const url = `${API_URL}/lancamento-futuro?page=${page}&data_liberacao=${data_liberacao}`;

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
  const url = `${API_URL}/concorrencia/extrato?page=${page}&day=${day}&id=${id}&order=${order}&mostrar=${mostrar}&tipo=${tipo}&conta_id=${conta_id}&data_inicial=${data_inicial}&data_final=${data_final}`;

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
  terminal_id,
  seller_like,
  holder_name,
  is_physical_sale,
) => {
  const url = `${API_URL}/transacao?page=${page}&id=${id}&day=${day}&order=${order}&mostrar=${mostrar}&status=${status}&like=${like}&payment_type=${payment_type}&documento=${documento}&data_inicial=${data_inicial}&data_final=${data_final}&vencimento_inicial=${vencimento_inicial}&vencimento_final=${vencimento_final}&conta_id=${conta_id}&pagamento_inicial=${pagamento_inicial}&pagamento_final=${pagamento_final}&terminal_id=${terminal_id}&seller_like=${seller_like}&holder_name=${holder_name}&is_physical_sale=${is_physical_sale}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//page=1&id=&terminal_id=&day=&order=&mostrar=&status=&like=&seller_like=&is_physical_sale=&payment_type=&documento=&data_inicial=&data_final=&vencimento_final=&vencimento_inicial=&conta_id=&pagamento_final=&pagamento_inicial=&holder_name=

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
  terminal_id,
  seller_like,
  holder_name,
  is_physical_sale,
) => {
  const url = `${API_URL}/export/transacao?page=${page}&id=${id}&day=${day}&order=${order}&mostrar=${mostrar}&status=${status}&like=${like}&payment_type=${payment_type}&documento=${documento}&data_inicial=${data_inicial}&data_final=${data_final}&vencimento_inicial=${vencimento_inicial}&vencimento_final=${vencimento_final}&conta_id=${conta_id}&pagamento_inicial=${pagamento_inicial}&pagamento_final=${pagamento_final}&terminal_id=${terminal_id}&seller_like=${seller_like}&holder_name=${holder_name}&is_physical_sale=${is_physical_sale}`;
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

export const getHistoricoTransferencia = (token, page) => {
  const url = `${API_URL}/transferencia?page=${page}`;
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

export const getListaAdministrador = (
  token,
  page,
  like,
  order,
  mostrar,
  created_at,
  filters,
) => {
  const url = `${API_URL}/administrador?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&created_at=${created_at}&${filters}`;

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

export const postCriarAdmin = (token, data) => {
  const url = `${API_URL}/administrador`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
};

export const putEditarAdmin = (token, id, data) => {
  const url = `${API_URL}/administrador/${id}`;

  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
};

export const getCep = (cep) => {
  const url = `https://viacep.com.br/ws/${cep}/json`;
  const url2 = `https://brasilapi.com.br/api/cep/v1/${cep}`;

  return axios({
    method: "get",
    url,
  }).catch((err) => {
    return axios({
      method: "get",
      url: url2,
    });
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

export const getPerfilTaxaPadrao = (token, like) => {
  const url = `${API_URL}/financa/taxa-padrao`;
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

export const getPerfilTaxaPadraoId = (token, id) => {
  const url = `${API_URL}/financa/taxa-padrao/${id}`;
  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransacaoTarifas = (
  token,
  page,
  like,
  transacao_id,
  conta_perfil_taxa_id,
  data_inicial,
  data_final,
  tipo,
  order,
  mostrar,
) => {
  const url = `${API_URL}/financa/taxa-transacao?page=${page}&like=${like}&transacao_id=${transacao_id}&conta_perfil_taxa_id=${conta_perfil_taxa_id}&data_inicial=${data_inicial}&data_final=${data_final}&tipo=${tipo}&order=${order}&mostrar=${mostrar}`;
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
  tipo_cash_in_boleto,
  cash_in_boleto,
  tipo_cash_in_pix,
  cash_in_pix,
  tipo_cash_in_p2p,
  cash_in_p2p,
  tipo_cash_out_p2p,
  cash_out_p2p,
  tipo_cash_out_pix,
  cash_out_pix,
  tipo_cash_in_wallet,
  cash_in_wallet,
  tipo_cash_out_wallet,
  cash_out_wallet,
  tipo_cash_out_pagamento_conta,
  cash_out_pagamento_conta,
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
      tipo_cash_in_boleto,
      cash_in_boleto,
      tipo_cash_in_pix,
      cash_in_pix,
      tipo_cash_in_p2p,
      cash_in_p2p,
      tipo_cash_out_p2p,
      cash_out_p2p,
      tipo_cash_out_pix,
      cash_out_pix,
      tipo_cash_in_wallet,
      cash_in_wallet,
      tipo_cash_out_wallet,
      cash_out_wallet,
      tipo_cash_out_pagamento_conta,
      cash_out_pagamento_conta,
    },
  });
};
export const postPerfilTaxaPadrao = (
  token,
  tipo_cash_in_boleto,
  cash_in_boleto,
  tipo_cash_in_pix,
  cash_in_pix,
  tipo_cash_in_p2p,
  cash_in_p2p,
  tipo_cash_out_p2p,
  cash_out_p2p,
  tipo_cash_out_pix,
  cash_out_pix,
  tipo_cash_in_wallet,
  cash_in_wallet,
  tipo_cash_out_wallet,
  cash_out_wallet,
  tipo_cash_out_pagamento_conta,
  cash_out_pagamento_conta,
  conta_id,
) => {
  const url = `${API_URL}/financa/taxa-padrao`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      tipo_cash_in_boleto,
      cash_in_boleto,
      tipo_cash_in_pix,
      cash_in_pix,
      tipo_cash_in_p2p,
      cash_in_p2p,
      tipo_cash_out_p2p,
      cash_out_p2p,
      tipo_cash_out_pix,
      cash_out_pix,
      tipo_cash_in_wallet,
      cash_in_wallet,
      tipo_cash_out_wallet,
      cash_out_wallet,
      tipo_cash_out_pagamento_conta,
      cash_out_pagamento_conta,
      conta_id,
    },
  });
};

export const putPerfilTaxa = (
  token,
  nome,
  tipo_cash_in_boleto,
  cash_in_boleto,
  tipo_cash_in_pix,
  cash_in_pix,
  tipo_cash_in_p2p,
  cash_in_p2p,
  tipo_cash_out_p2p,
  cash_out_p2p,
  tipo_cash_out_pix,
  cash_out_pix,
  tipo_cash_in_wallet,
  cash_in_wallet,
  tipo_cash_out_wallet,
  cash_out_wallet,
  tipo_cash_out_pagamento_conta,
  cash_out_pagamento_conta,
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
      tipo_cash_in_boleto,
      cash_in_boleto,
      tipo_cash_in_pix,
      cash_in_pix,
      tipo_cash_in_p2p,
      cash_in_p2p,
      tipo_cash_out_p2p,
      cash_out_p2p,
      tipo_cash_out_pix,
      cash_out_pix,
      tipo_cash_in_wallet,
      cash_in_wallet,
      tipo_cash_out_wallet,
      cash_out_wallet,
      tipo_cash_out_pagamento_conta,
      cash_out_pagamento_conta,
    },
  });
};
export const putPerfilTaxaPadrao = (
  token,
  tipo_cash_in_boleto,
  cash_in_boleto,
  tipo_cash_in_pix,
  cash_in_pix,
  tipo_cash_in_p2p,
  cash_in_p2p,
  tipo_cash_out_p2p,
  cash_out_p2p,
  tipo_cash_out_pix,
  cash_out_pix,
  tipo_cash_in_wallet,
  cash_in_wallet,
  tipo_cash_out_wallet,
  cash_out_wallet,
  tipo_cash_out_pagamento_conta,
  cash_out_pagamento_conta,
  id,
  conta_id,
) => {
  const url = `${API_URL}/financa/taxa-padrao/${id}`;
  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      tipo_cash_in_boleto,
      cash_in_boleto,
      tipo_cash_in_pix,
      cash_in_pix,
      tipo_cash_in_p2p,
      cash_in_p2p,
      tipo_cash_out_p2p,
      cash_out_p2p,
      tipo_cash_out_pix,
      cash_out_pix,
      tipo_cash_in_wallet,
      cash_in_wallet,
      tipo_cash_out_wallet,
      cash_out_wallet,
      tipo_cash_out_pagamento_conta,
      cash_out_pagamento_conta,
      conta_id,
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

export const deletePerfilTaxaPadrao = (token, id) => {
  const url = `${API_URL}/financa/taxa-padrao/${id}`;
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

export const putEditartUser = (token, id, data) => {
  const url = `${API_URL}/user/${id}`;
  return axios({
    method: "put",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
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

export const getLogs = (
  token,
  user_id,
  page,
  like,
  order,
  mostrar,
  created_at,
) => {
  const url = `${API_URL}/conta/log?user_id=${user_id}&page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&created_at=${created_at}`;
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
  const url = `${API_URL}/pre-conta-fisica?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPreContaId = (token, id) => {
  const url = `${API_URL}/pre-conta-fisica/${id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

export const getBlacklistSelfie = (token, page, like, order, mostrar) => {
  const url = `${API_URL}/conta/black-list-selfie?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

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

export const getFolhaDePagamento = (token, page, conta_id, like) => {
  const url = `${API_URL}/conta/folha-pagamento?page=${page}&conta_id=${conta_id}&like=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getListaBanner = (
  token,
  page,
  like,
  order,
  mostrar,
  tipo,
  created_at,
) => {
  const url = `${API_URL}/conta/banner?page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&tipo=${tipo}&created_at=${created_at}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postBanner = (token, banner, tipo, urlBanner) => {
  const url = `${API_URL}/conta/banner`;
  var bodyFormData = new FormData();
  bodyFormData.append("imagem", banner);
  bodyFormData.append("tipo", tipo);
  bodyFormData.append("url", urlBanner);

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

export const getFuncionario = (
  token,
  grupo_id,
  page,
  like,
  order,
  mostrar,
  conta_id,
) => {
  const url = `${API_URL}/conta/funcionario?grupo_id=${grupo_id}&page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&conta_id=${conta_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCartoes = (
  token,
  page,
  like,
  order,
  mostrar,
  id,
  identificador,
  seller,
  status,
  numero_documento,
  tipo,
) => {
  const url = `${API_URL}/conta/cartao-pre-pago?
	page=${page}
	&like=${like}
	&order=${order}
	&mostrar=${mostrar}
	&id=${id}
	&seller=${seller}
	&identificador=${identificador}
	&status=${status}
	&numero_documento=${numero_documento}
	&tipo=${tipo}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postConfirmRequestCard = (token, id) => {
  const url = `${API_URL}/conta/cartao-pre-pago/${id}/confirm/card/request`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postCancelCard = (token, id) => {
  const url = `${API_URL}/conta/cartao-pre-pago/${id}/cancel/card/request`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
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
export const getPagamentoPixExtrato = (token, transactionId) => {
  const url = `${API_URL}/pagamento-pix/${transactionId}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFolhaPagamentoFuncionario = (
  token,
  conta_id,
  conta_funcionario_id,
) => {
  const url = `${API_URL}/conta/folha-pagamento-funcionario?conta_id=${conta_id}&funcionario_id=${conta_funcionario_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagamentoPix = (token, page = 1, filters = "") => {
  const url = `${API_URL}/pagamento-pix?page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransferenciaP2p = (
  token,
  nome,
  documento,
  cnpj,
  email,
  id,
  status,
  data_inicial,
  data_final,
  page,
) => {
  const url = `${API_URL}/transferencia?nome=${nome}&documento=${documento}&cnpj=${cnpj}&email=${email}&id=${id}&status=${status}&data_inicial=${data_inicial}&data_final=${data_final}&page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransferenciaTED = (
  token,
  nome,
  documento,
  cnpj,
  email,
  id,
  status,
  data_inicial,
  data_final,
  page,
) => {
  const url = `${API_URL}/ted?nome=${nome}&documento=${documento}&cnpj=${cnpj}&email=${email}&id=${id}&status=${status}&data_inicial=${data_inicial}&data_final=${data_final}&page=${page}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagamentoConta = (
  token,
  nome,
  documento,
  cnpj,
  email,
  id,
  status,
  data_inicial,
  data_final,
  page,
  like,
  order,
  mostrar,
  conta_id,
) => {
  const url = `${API_URL}/pagamento?nome=${nome}&documento=${documento}&cnpj=${cnpj}&email=${email}&id=${id}&status=${status}&data_inicial=${data_inicial}&data_final=${data_final}&page=${page}&like=${like}&order=${order}&mostrar=${mostrar}&conta_id=${conta_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getSincronizarConta = (token, conta_id) => {
  const url = `${API_URL}/conta/${conta_id}/sincronizar`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postRefreshAuth = (token) => {
  const url = `${API_URL}/auth/refresh`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getReenviarDocumento = (token, conta_id) => {
  const url = `${API_URL}/conta/${conta_id}/reenviar_documento`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getReenviarDocumentoSocio = (token, socio_id) => {
  const url = `${API_URL}/socio/${socio_id}/reenviar_documento`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPagamentoBoleto = (
  token,
  nome,
  documento,
  cnpj,
  email,
  id,
  status,
  data_inicial,
  data_final,
  vencimento_inicial,
  vencimento_final,
  page,
  like,
  order,
  mostrar,
  conta_id,
) => {
  const url = `${API_URL}/boleto?nome=${nome}&documento=${documento}&cnpj=${cnpj}&email=${email}&id=${id}&status=${status}&data_inicial=${data_inicial}&data_final=${data_final}&vencimento_inicial=${vencimento_inicial}&vencimento_final=${vencimento_final}&page=${page}&like=${like}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getEnviarFitbank = (token, conta_id) => {
  const url = `${API_URL}/conta/${conta_id}/enviar_cadastro_fitbank`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
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

export const getNotificacaoConta = (token, arquivo_id, page, filters = "") => {
  const url = `${API_URL}/conta/notificacao?arquivo_id=${arquivo_id}&page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postCriarSellerZoop = (token, conta_id) => {
  const url = `${API_URL}/conta-pagamento/seller`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id: conta_id,
    },
  });
};

export const postRecusarSellerZoop = (token, seller_id) => {
  const url = `${API_URL}/solicita-adquirencia/recusa/${seller_id}`;
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {},
  });
};

export const postNotificacao = (
  token,
  titulo,
  mensagem,
  contas,
  selectedTab,
  sendToALL = false,
  filters = "",
) => {
  const url = `${API_URL}/enviar/notificacao?${filters}`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      titulo: titulo,
      mensagem: mensagem,
      ...(selectedTab === 0
        ? { beneficiarios: contas }
        : { estabelecimentos: contas }),
      ...(sendToALL && selectedTab === 0
        ? { send_all_beneficiarios: true }
        : {}),
      ...(sendToALL && selectedTab === 1
        ? { send_all_estabelecimentos: true }
        : {}),
    },
  });
};

export const postAddLoteNotificacao = (token, arquivo) => {
  const url = `${API_URL}/enviar/notificacao/lote`;

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

export const getTerminaisPOSFilter = (token, page, like, conta_id) => {
  const url = `${API_URL}/point-of-sales?page=${page}&like=${like}&conta_id=${conta_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
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

export const getPlanosDeVendas = (
  token,
  page,
  plan_name,
  order,
  mostrar,
  agent_id,
) => {
  const url = `${API_URL}/plano-vendas?page=${page}&plan_name=${plan_name}&order=${order}&mostrar=${mostrar}&agent_id=${agent_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPlanosDeVendasZoop = (
  token,
  page,
  plan_name,
  order,
  mostrar,
) => {
  const url = `${API_URL}/plano-vendas-zoop?page=${page}&zoop_plan_name=${plan_name}&order=${order}&mostrar=${mostrar}`;

  return axios({
    method: "get",
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

export const getPlanosDeVendasZoopID = (token, id) => {
  const url = `${API_URL}/plano-vendas-zoop/${id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postPlanosDeVendasZoop = (token, zoop_plan_id) => {
  const url = `${API_URL}/plano-vendas-zoop/store`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      zoop_plan_id: zoop_plan_id,
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

export const postSetPlanoPadrao = (token, sales_plan_id) => {
  const url = `${API_URL}/plano-vendas/${sales_plan_id}/set-default`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {},
  });
};

export const getContaPadrao = (token) => {
  const url = `${API_URL}/plano-vendas-conta-app-padrao`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postSetContaPadrao = (token, conta_id) => {
  const url = `${API_URL}/plano-vendas-conta-app-padrao`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { conta_id: conta_id },
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

export const postCancelarTransacao = (
  token,
  transactionId,
  is_full_amount,
  amount,
) => {
  const url = `${API_URL}/transacao/cancelar`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      transaction_id: transactionId,
      is_full_amount: is_full_amount,
      amount: amount,
    },
  });
};

export const getRepresentantes = (token, page, like, trashed_agents) => {
  const url = `${API_URL}/agents?page=${page}&like=${like}&trashed_agents=${trashed_agents}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postImportarRepresentante = (token, account_id) => {
  const url = `${API_URL}/agents/import-agent-from-account`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      account_id: account_id,
    },
  });
};

export const postCriarRepresentante = (token, agent) => {
  const url = `${API_URL}/agents/import-agent-from-account`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      agent: {
        owner_cpf: agent.owner_cpf,
        owner_first_name: agent.owner_first_name,
        owner_last_name: agent.owner_last_name,
        owner_birth_date: agent.owner_birth_date,
        cnpj: agent.cnpj,
        business_name: agent.business_name,
        contact_email: agent.contact_email,
        contact_number: agent.contact_number,
        business_description: agent.business_description,
      },
      site: agent.site,
      address: {
        cep: agent.endereco?.cep,
        rua: agent.endereco?.rua,
        bairro: agent.endereco?.bairro,
        numero: agent.endereco?.numero,
        complemento: agent.endereco?.complemento,
        cidade: agent.endereco?.cidade,
        estado: agent.endereco?.estado,
      },
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

export const postContaFisicaZoop = (
  token,
  documento,
  nome,
  nome_mae,
  nome_pai,
  sexo,
  estado_civil,
  uf_naturalidade,
  cidade_naturalidade,
  numero_documento,
  uf_documento,
  data_emissao,
  renda_mensal,
  celular,
  data_nascimento,
  email,
  site,
  cep,
  rua,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
  banco,
  agencia,
  conta,
  tipo_transferencia,
  chave_pix,
  is_terceiro_autorizado,
  documento_conta,
  taxa_transacao,
) => {
  const url = `${API_URL}/conta-zoop`;
  console.log(taxa_transacao);
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      documento,
      nome,
      nome_mae,
      nome_pai,
      sexo,
      estado_civil,
      uf_naturalidade,
      cidade_naturalidade,
      numero_documento,
      uf_documento,
      data_emissao,
      renda_mensal,
      celular,
      data_nascimento,
      email,
      site,
      endereco: {
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
      },
      banco,
      agencia,
      conta,
      tipo_transferencia,
      chave_pix,
      is_terceiro_autorizado,
      ...(documento_conta
        ? {
          documento_conta: documento_conta,
        }
        : null),
      ...(taxa_transacao
        ? {
          taxa_transacao: parseFloat(taxa_transacao).toFixed(2),
        }
        : null),

    },
  });
};

export const postContaJuridicaZoop = (
  token,
  documento,
  cnpj,
  razao_social,
  nome,
  renda_mensal,
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
  banco,
  agencia,
  conta,
  tipo_transferencia,
  chave_pix,
  is_terceiro_autorizado,
  documento_conta,
  taxa_transacao,
) => {
  const url = `${API_URL}/conta-juridica-zoop`;
  console.log(taxa_transacao);
  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      documento: documento,
      cnpj: cnpj,
      razao_social: razao_social,
      nome: nome,
      renda_mensal: renda_mensal,
      celular: celular,
      data_nascimento: data_nascimento,
      email: email,
      endereco: {
        cep: cep,
        rua: rua,
        numero: numero,
        complemento: complemento,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
      },
      banco: banco,
      agencia: agencia,
      conta: conta,
      tipo_transferencia,
      chave_pix,
      is_terceiro_autorizado,
      ...(documento_conta
        ? {
          documento_conta: documento_conta,
        }
        : null),
      ...(taxa_transacao
        ? {
          taxa_transacao: parseFloat(taxa_transacao).toFixed(2),
        }
        : null),
    },
  });
};

export const getArquivosExportados = async (
  token,
  page = 1,
  like = "",
  filters = "",
) => {
  const url = `${API_URL}/exports?page=${page}&like=${like}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDownloadArquivoExportadoVoucher = async (
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

export const getDownloadArquivoExportado = async (token, arquivo_id) => {
  const url = `${API_URL}/arquivo-download?arquivo_id=${arquivo_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTokensPublicos = (token) => {
  const url = `${API_URL}/tokens`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postCriarTokenPublico = (token, token_name) => {
  const url = `${API_URL}/tokens/create`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      token_name,
    },
  });
};

export const deleteTokenPublico = (token, id) => {
  const url = `${API_URL}/tokens/${id}`;
  return axios({
    method: "delete",
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

export const postCancelPix = (token, id) => {
  const url = `${API_URL}/pagamento-pix/${id}/cancel-schedule`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPermissionsList = (token) => {
  const url = `${API_URL}/auth/permissoes`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getProfiles = (token) => {
  const url = `${API_URL}/auth/perfil`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postProfile = (token, data) => {
  const url = `${API_URL}/auth/perfil`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
};

export const patchProfile = (token, perfil_id, data) => {
  const url = `${API_URL}/auth/perfil/${perfil_id}`;

  return axios({
    method: "patch",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      ...data,
      overwrite: true,
    },
  });
};

export const deleteProfile = (token, perfil_id) => {
  const url = `${API_URL}/auth/perfil/${perfil_id}`;

  return axios({
    method: "delete",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getProfilePermissionsList = (token, perfil_id) => {
  const url = `${API_URL}/auth/perfil/${perfil_id}/permissoes`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUSerProfile = (token, user_id) => {
  const url = `${API_URL}/auth/perfil/user/${user_id}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postUSerSetProfile = (token, user_id, perfil_id) => {
  const url = `${API_URL}/auth/perfil/attach/${user_id}/${perfil_id}`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postUSerResetProfile = (token, user_id, perfil_id) => {
  const url = `${API_URL}/auth/perfil/detach/${user_id}/`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postSendPushNotification = (
  token,
  titulo,
  mensagem,
  send_all_estabelecimentos = false,
  send_all_beneficiarios = false,
  beneficiarios = [],
) => {
  const url = `${API_URL}/enviar/notificacao`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      titulo,
      mensagem,
      send_all_estabelecimentos,
      send_all_beneficiarios,
      beneficiarios,
    },
  });
};

export const getBlacklist = (token, page, filters = "") => {
  const url = `${API_URL}/contas/blacklist?page=${page}&${filters}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postAddRemoveFromBlacklist = (token, conta_id, titulo, motivo) => {
  const url = `${API_URL}/contas/blacklist`;

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id,
      titulo,
      motivo,
    },
  });
};

export const getFavoritosPix = (token, conta_id, page = 1, like = "") => {
  const url = `${API_URL}/favorito/pix?conta_id=${conta_id}&page=${page}&ike=${like}`;

  return axios({
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postAddFavoritePix = (token, conta_id, data) => {
  const url = `${API_URL}/favorito/pix`;
  console.log(data);

  return axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      conta_id,
      nome: data?.nome,
      tipo_transferencia: data?.tipo_transferencia, //"Dict" "Manual"
      ...(data?.tipo_transferencia === "Manual"
        ? {
          nome_conta: data?.nome_conta,
          documento_conta: data?.documento_conta,
          numero_conta: data?.numero_conta + data?.digito_conta,
          banco: data?.banco,
          agencia: data?.agencia,
          tipo_conta: data?.tipo_conta, //"conta_corrente" "conta_salario" "conta_poupanca" "conta_pagamento"
        }
        : {
          tipo: data?.tipo, //CPF = 0 CNPJ = 1 EMAIL = 2 PHONE = 3 EVP = 4
          chave_recebedor: data?.chave_recebedor,
          documento: data?.documento,
        }),
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
