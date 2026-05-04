import {
  CLEAR_PRE_CONTA_ID,
  CLEAR_TRANSACAO,
  DELETE_ADMIN,
  DELETE_DOCUMENTO,
  DELETE_PERFIL_TAXA,
  DEL_CONTA_BANCARIA,
  DEL_PAGADOR,
  GET_APROVAR_CONTA,
  GET_ASSINATURA_PLANO_VENDAS,
  GET_BLACKLIST_SELFIE,
  GET_CARTOES,
  GET_CHAVES_PIX,
  GET_CONTA_EMPRESA,
  GET_CONTA_PADRAO,
  GET_ENVIAR_DOCUMENTO_IDWALL,
  GET_EXPORTACOES_SOLICITADAS,
  GET_EXTRATO_ADQUIRENCIA,
  GET_FOLHA_DE_PAGAMENTO,
  GET_FOLHA_PAGAMENTO_FUNCIONARIO,
  GET_FUNCIONARIO,
  GET_GRAFICO_CONTA_BAR_DASHBOARD,
  GET_GRAFICO_CONTA_LINE_DASHBOARD,
  GET_LISTA_ADMINISTRADOR,
  GET_LISTA_BANNER,
  GET_LOGS,
  GET_MEUS_ECS,
  GET_MINHAS_ASSINATURAS,
  GET_MINHAS_TAXAS,
  GET_PAGAMENTO_BOLETO,
  GET_PAGAMENTO_CONTA,
  GET_PAGAMENTO_CONTA_EXTRATO,
  GET_PAGAMENTO_PIX,
  GET_PAGAMENTO_PIX_EXTRATO,
  GET_PLANO_VENDAS,
  GET_PLANO_VENDAS_ID,
  GET_PLANO_VENDAS_ZOOP,
  GET_PLANO_VENDAS_ZOOP_ID,
  GET_REENVIAR_TOKEN_USUARIO,
  GET_REPRESENTANTES,
  GET_RESUMO_CONTA_DASHBOARD,
  GET_TED_EXTRATO,
  GET_TERMINAIS_POS,
  GET_TERMINAL_POS,
  GET_TERMINAL_POS_TRANSACTIONS,
  GET_TRANSACAO_PIX,
  GET_TRANSACAO_PIX_ID,
  GET_TRANSACAO_TARIFAS,
  GET_TRANSACAO_TED,
  GET_TRANSACAO_TED_ID,
  GET_TRANSFERENCIA_EXTRATO,
  GET_TRANSFERENCIA_P2P,
  GET_TRANSFERENCIA_TED,
  LOAD_ALL_CONTAS,
  LOAD_ASSINATURAS,
  LOAD_BANCOS,
  LOAD_BOLETOS,
  LOAD_CARNE,
  LOAD_COBRANCAS_CARTAO,
  LOAD_CONTAS,
  LOAD_CONTA_BANCARIA,
  LOAD_CONTA_ID,
  LOAD_DETALHES_GIFT_CARD,
  LOAD_DETALHES_RECARGA,
  LOAD_DOCUMENTO,
  LOAD_EXPORT_EXTRATO,
  LOAD_EXPORT_TRANSACAO,
  LOAD_EXPORT_TRANSFERENCIA,
  LOAD_EXTRATO,
  LOAD_HISTORICO_TRANSACAO,
  LOAD_HISTORICO_TRANSFERENCIA,
  LOAD_LANCAMENTOS_FUTUROS,
  LOAD_LINK_PAGAMENTOS,
  LOAD_LISTAR_PRODUTOS_GIFT_CARD,
  LOAD_LISTAR_RECARGAS,
  LOAD_LISTA_DEVICE_BLOQUEADO,
  LOAD_LISTA_PRE_CONTAS,
  LOAD_LISTA_PRE_CONTA_ID,
  LOAD_PAGADORES,
  LOAD_PARTNER_TRANSACTIONS,
  LOAD_PERFIL_TAXA,
  LOAD_PERFIL_TAXA_ID,
  LOAD_PERFIL_TAXA_PADRAO,
  LOAD_PERFIL_TAXA_PADRAO_ID,
  LOAD_PERMISSAO,
  LOAD_PERMISSAO_GERENCIAR,
  LOAD_PLANOS,
  LOAD_TRANSACAO,
  LOAD_TRANSFERENCIA_ID,
  LOAD_USER_DATA,
  POST_AUTH_ME,
  POST_CAPTURA,
  POST_CONTA,
  POST_CONTA_BANCARIA,
  POST_CONTA_FISICA_ZOOP,
  POST_CONTA_JURIDICA_ZOOP,
  POST_DOCUMENTO,
  POST_EMAIL,
  POST_LOGIN,
  POST_PERFIL_TAXA,
  POST_PRIMEIRO_ACESSO,
  POST_SPLIT,
  POST_VINCULAR_PERFIL_TAXA,
  PUT_PERFIL_TAXA,
  SET_SESSION_AUTH,
  SET_STATE,
  UPDATE_USER_CONTA,
} from "../constants/actionsStrings";

export const INITIAL_STATE = {
  adminEmail: {},
  primeiroUsuario: {},
  listaAdministrador: {},
  exportTransferencia: {},
  historicoTransferencia: {
    data: [
      {
        origem: {},
        destino: {},
      },
    ],
  },
  transacao: {},
  chavesPix: {
    data: [{}],
  },
  pix: {
    data: [{}],
  },
  userData: {
    saldo: {
      valor: "",
    },
  },
  ted: {
    data: [{}],
  },
  pagadores: {
    data: [{}],
  },
  exportTransacao: {},
  historicoTransacao: {
    data: [{}],
  },
  planosList: {
    data: [{}],
  },
  assinaturasList: {
    data: [{}],
  },
  exportExtrato: {},
  extrato: {
    data: [{}],
  },
  lancamentosFuturos: {
    data: [{}],
  },
  linkPagamentos: {
    data: [{}],
  },
  carneList: {
    data: [{}],
  },
  boletos: {
    data: [{}],
  },
  split: {},
  cobrancaCartaoList: {
    data: [{}],
  },
  cobrancaCartao: {},
  graficoLinha: [],
  graficoBarra: [],
  contadores: [],
  allContas: {},
  contas: {},
  conta: {
    id: "",
    tipo: "",
    documento: "",
    documentos: [],
    conta_id: "",
    nome: "",
    celular: "",
    data_nascimento: "",
    email: "",
    endereco: {
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  },
  perfilTaxas: {
    data: [],
  },
  perfilTaxaPadrao: {},
  transacoesTarifas: {},
  perfilTaxaId: {},
  perfilTaxaPadraoId: {},
  gerenciarPermissao: {
    permissao: [{}],
  },
  userPermissao: {
    permissao: [{}],
  },
  me: {},
  logs: {},
  giftCards: {},
  detalhesGiftCard: {},
  recargas: {},
  detalhesRecarga: {},
  listaPreContas: {},
  preContaId: {},
  transferenciaId: {},
  tedId: {},
  pixId: {},
  partnerTransactions: {
    data: [{}],
  },
  listaDeviceBloqueado: {},
  blacklist_selfie: {},
  folhaDePagamento: {},
  listaBanner: {},
  funcionarios: {},
  listaCartoes: {},
  transferenciaExtrato: {},
  tedExtrato: {},
  pagamentoContaExtrato: {},
  pagamentoPixExtrato: {},
  contaEmpresa: {},
  folhaPagamentoFuncionario: {},
  pagamentoPix: {},
  transferenciaP2p: {},
  transferenciaTED: {},
  pagamentoConta: {},
  pagamentoBoleto: {},
  refreshAuth: {},
  terminaisPOS: {},
  exportacoesSolicitadas: {},
  minhasAssinaturas: {},
  minhasTaxas: {},
  extratoAdquirencia: {},
  planoVendas: {},
  planoVendasID: {},
  planoVendasZoop: {},
  contaPadrao: {},
  planoVendasZoopID: {},
  terminalPOS: {},
  terminalPOSTransaction: {},
  representantes: {},
  assinaturaPlanoVendas: {},
  meusEcs: {},
  novaContaAdquirencia: {},
};

export const rootReducer = (state, action) => {
  switch (action.type) {
    case SET_STATE:
      return action.payload;

    case LOAD_CONTAS:
      return { ...state, contas: action.payload };

    case LOAD_ALL_CONTAS:
      return { ...state, allContas: action.payload };

    case POST_LOGIN:
      return { ...state };

    case LOAD_CONTA_ID:
      return { ...state, conta: action.payload };

    case POST_CONTA:
      return { ...state, conta: action.payload };

    case LOAD_BANCOS:
      return { ...state, bancos: action.payload };

    case POST_CONTA_BANCARIA:
      return { ...state, contaBancaria: action.payload };

    case LOAD_CONTA_BANCARIA:
      return { ...state, contasBancarias: action.payload };

    case DEL_CONTA_BANCARIA:
      return {
        ...state,
        contasBancarias: state.contasBancarias.filter(
          (item) => item.id !== action.payload
        ),
      };

    case GET_APROVAR_CONTA:
      return {
        ...state,
      };

    case LOAD_DOCUMENTO:
      return { ...state, arquivoDocumento: action.payload };

    case DELETE_DOCUMENTO:
      return {
        ...state,
        conta: {
          ...state.conta,
          documentos: state.conta.documentos.filter(
            (item) => item.id !== action.payload
          ),
        },
      };

    case POST_DOCUMENTO:
      return { ...state, documentoImagem: action.payload };

    case GET_ENVIAR_DOCUMENTO_IDWALL:
      return { ...state };

    case GET_RESUMO_CONTA_DASHBOARD:
      return { ...state, contadores: action.payload };

    case GET_GRAFICO_CONTA_LINE_DASHBOARD:
      return { ...state, graficoLinha: action.payload };

    case GET_GRAFICO_CONTA_BAR_DASHBOARD:
      return { ...state, graficoBarra: action.payload };

    case POST_CAPTURA:
      return { ...state, cobrancaCartao: action.payload };

    case LOAD_COBRANCAS_CARTAO:
      return { ...state, cobrancaCartaoList: action.payload };

    case POST_SPLIT:
      return { ...state, split: action.payload };

    case LOAD_BOLETOS:
      return { ...state, boletos: action.payload };

    case LOAD_CARNE:
      return { ...state, carneList: action.payload };

    case LOAD_LINK_PAGAMENTOS:
      return { ...state, linkPagamentos: action.payload };

    case LOAD_LANCAMENTOS_FUTUROS:
      return { ...state, lancamentosFuturos: action.payload };

    case LOAD_EXTRATO:
      return { ...state, extrato: action.payload };

    case LOAD_EXPORT_EXTRATO:
      return { ...state, exportExtrato: action.payload };

    case LOAD_ASSINATURAS:
      return { ...state, assinaturasList: action.payload };

    case LOAD_PLANOS:
      return { ...state, planosList: action.payload };

    case LOAD_HISTORICO_TRANSACAO:
      return { ...state, historicoTransacao: action.payload };

    case LOAD_EXPORT_TRANSACAO:
      return { ...state, exportTransacao: action.payload };

    case LOAD_PAGADORES:
      return { ...state, pagadores: action.payload };

    case GET_TRANSACAO_TED:
      return { ...state, ted: action.payload };

    case GET_TRANSACAO_PIX:
      return { ...state, pix: action.payload };

    case GET_CHAVES_PIX:
      return { ...state, chavesPix: action.payload };

    case UPDATE_USER_CONTA:
      return { ...state, userData: action.payload };

    case LOAD_TRANSACAO:
      return { ...state, transacao: action.payload };

    case CLEAR_TRANSACAO:
      return { ...state, transacao: {} };

    case LOAD_HISTORICO_TRANSFERENCIA:
      return { ...state, historicoTransferencia: action.payload };

    case LOAD_EXPORT_TRANSFERENCIA:
      return { ...state, exportTransferencia: action.payload };

    case LOAD_PARTNER_TRANSACTIONS:
      return { ...state, partnerTransactions: action.payload };

    case LOAD_USER_DATA:
      return { ...state, userData: action.payload };

    case GET_LISTA_ADMINISTRADOR:
      return { ...state, listaAdministrador: action.payload };

    case DEL_PAGADOR:
      return {
        ...state,
        pagadores: {
          ...state.pagadores,
          data: state.pagadores.data.filter(
            (item) => item.id !== action.payload
          ),
        },
      };

    case POST_PRIMEIRO_ACESSO:
      return { ...state, primeiroUsuario: action.payload };

    case POST_EMAIL:
      return { ...state };

    case DELETE_ADMIN:
      return {
        ...state,
        listaAdministrador: {
          ...state.listaAdministrador,
          data: state.listaAdministrador.data.filter(
            (item) => item.id !== action.payload
          ),
        },
      };

    case GET_REENVIAR_TOKEN_USUARIO:
      return { ...state };

    case LOAD_PERFIL_TAXA:
      return { ...state, perfilTaxas: action.payload };

    case LOAD_PERFIL_TAXA_PADRAO:
      return { ...state, perfilTaxaPadrao: action.payload };

    case GET_TRANSACAO_TARIFAS:
      return { ...state, transacoesTarifas: action.payload };

    case LOAD_PERFIL_TAXA_ID:
      return { ...state, perfilTaxaId: action.payload };

    case LOAD_PERFIL_TAXA_PADRAO_ID:
      return { ...state, perfilTaxaPadraoId: action.payload };

    case POST_PERFIL_TAXA:
      return { ...state, perfilTaxaId: action.payload };

    case PUT_PERFIL_TAXA:
      return { ...state, perfilTaxaId: action.payload };

    case DELETE_PERFIL_TAXA:
      return {
        ...state,
        perfilTaxas: {
          ...state.perfilTaxas,
          data: state.perfilTaxas.data.filter(
            (item) => item.id !== action.payload
          ),
        },
      };

    case LOAD_PERMISSAO_GERENCIAR:
      return { ...state, gerenciarPermissao: action.payload };

    case LOAD_PERMISSAO:
      return { ...state, userPermissao: action.payload };

    case POST_VINCULAR_PERFIL_TAXA:
      return { ...state };

    case POST_AUTH_ME:
      return { ...state, me: action.payload };

    case GET_LOGS:
      return { ...state, logs: action.payload };

    case LOAD_LISTAR_PRODUTOS_GIFT_CARD:
      return { ...state, giftCards: action.payload };

    case LOAD_DETALHES_GIFT_CARD:
      return { ...state, detalhesGiftCard: action.payload };

    case LOAD_LISTAR_RECARGAS:
      return { ...state, recargas: action.payload };

    case LOAD_DETALHES_RECARGA:
      return { ...state, detalhesRecarga: action.payload };

    case LOAD_LISTA_PRE_CONTAS:
      return { ...state, listaPreContas: action.payload };

    case LOAD_LISTA_PRE_CONTA_ID:
      return { ...state, preContaId: action.payload };

    case LOAD_TRANSFERENCIA_ID:
      return { ...state, transferenciaId: action.payload };

    case GET_TRANSACAO_TED_ID:
      return { ...state, tedId: action.payload };

    case GET_TRANSACAO_PIX_ID:
      return { ...state, pixId: action.payload };

    case LOAD_LISTA_DEVICE_BLOQUEADO:
      return { ...state, listaDeviceBloqueado: action.payload };

    case CLEAR_PRE_CONTA_ID:
      return { ...state, preContaId: INITIAL_STATE.preContaId };

    case GET_BLACKLIST_SELFIE:
      return { ...state, blacklist_selfie: action.payload };

    case GET_FOLHA_DE_PAGAMENTO:
      return { ...state, folhaDePagamento: action.payload };

    case GET_LISTA_BANNER:
      return { ...state, listaBanner: action.payload };

    case GET_FUNCIONARIO:
      return { ...state, funcionarios: action.payload };

    case GET_CARTOES:
      return { ...state, listaCartoes: action.payload };

    case GET_TRANSFERENCIA_EXTRATO:
      return { ...state, transferenciaExtrato: action.payload };

    case GET_TED_EXTRATO:
      return { ...state, tedExtrato: action.payload };

    case GET_PAGAMENTO_CONTA_EXTRATO:
      return { ...state, pagamentoContaExtrato: action.payload };

    case GET_PAGAMENTO_PIX_EXTRATO:
      return { ...state, pagamentoPixExtrato: action.payload };

    case GET_CONTA_EMPRESA:
      return { ...state, contaEmpresa: action.payload };

    case GET_FOLHA_PAGAMENTO_FUNCIONARIO:
      return { ...state, folhaPagamentoFuncionario: action.payload };

    case GET_PAGAMENTO_PIX:
      return { ...state, pagamentoPix: action.payload };

    case GET_TRANSFERENCIA_P2P:
      return { ...state, transferenciaP2p: action.payload };

    case GET_TRANSFERENCIA_TED:
      return { ...state, transferenciaTED: action.payload };

    case GET_PAGAMENTO_CONTA:
      return { ...state, pagamentoConta: action.payload };

    case GET_PAGAMENTO_BOLETO:
      return { ...state, pagamentoBoleto: action.payload };

    case GET_TERMINAIS_POS:
      return { ...state, terminaisPOS: action.payload };

    case GET_EXPORTACOES_SOLICITADAS:
      return { ...state, exportacoesSolicitadas: action.payload };

    case GET_MINHAS_TAXAS:
      return { ...state, minhasTaxas: action.payload };

    case GET_MINHAS_ASSINATURAS:
      return { ...state, minhasAssinaturas: action.payload };

    case GET_EXTRATO_ADQUIRENCIA:
      return { ...state, extratoAdquirencia: action.payload };

    case GET_PLANO_VENDAS:
      return { ...state, planoVendas: action.payload };

    case GET_PLANO_VENDAS_ID:
      return { ...state, planoVendasID: action.payload };

    case GET_PLANO_VENDAS_ZOOP:
      return { ...state, planoVendasZoop: action.payload };

    case GET_CONTA_PADRAO:
      return { ...state, contaPadrao: action.payload };

    case GET_PLANO_VENDAS_ZOOP_ID:
      return { ...state, planoVendasZoopID: action.payload };

    case GET_TERMINAL_POS:
      return { ...state, terminalPOS: action.payload };

    case GET_TERMINAL_POS_TRANSACTIONS:
      return { ...state, terminalPOSTransaction: action.payload };

    case GET_REPRESENTANTES:
      return { ...state, representantes: action.payload };

    case GET_ASSINATURA_PLANO_VENDAS:
      return { ...state, assinaturaPlanoVendas: action.payload };

    case GET_MEUS_ECS:
      return { ...state, meusEcs: action.payload };

    case POST_CONTA_FISICA_ZOOP:
      return { ...state, novaContaAdquirencia: action.payload };

    case POST_CONTA_JURIDICA_ZOOP:
      return { ...state, novaContaAdquirencia: action.payload };

    case SET_SESSION_AUTH:
      return { ...state, refreshAuth: action.payload };

    default:
      return { ...state };
  }
};
