import {
  CLEAR_PRE_CONTA_ID,
  CLEAR_QRCODE_COBRAR,
  CLEAR_TRANSACAO,
  DELETE_ADMIN,
  DELETE_DOCUMENTO,
  DELETE_PERFIL_TAXA,
  DEL_CONTA_BANCARIA,
  DEL_PAGADOR,
  GET_APROVAR_CONTA,
  GET_ARQUIVO_LOTE,
  GET_ARQUIVO_LOTE_BENE,
  GET_ARQUIVO_LOTE_COMPROVANTE,
  GET_ARQUIVO_LOTE_CONC,
  GET_ARQUIVO_LOTE_FUNCIONARIO,
  GET_ARQUIVO_LOTE_VOUCHER,
  GET_ASSINATURA_PLANO_VENDAS,
  GET_BENEFICIOS,
  GET_BLACKLIST,
  GET_CARTAO_HISTORICO_TRANSACAO,
  GET_CHAVES_PIX,
  GET_CONSULTA_CHAVE,
  GET_DOCUMENTO_PRE_CONTA,
  GET_ENVIAR_DOCUMENTO_IDWALL,
  GET_EXPORTACOES_SOLICITADAS,
  GET_EXTRATO_ADQUIRENCIA,
  GET_FAVORITOS_P2P,
  GET_FAVORITOS_PIX,
  GET_FAVORITOS_TED,
  GET_FAVORITOS_WALLET,
  GET_FOLHA_DE_PAGAMENTO,
  GET_FOLHA_DE_PAGAMENTO_APROVAR,
  GET_FOLHA_DE_PAGAMENTO_APROVAR_BENE,
  GET_FOLHA_DE_PAGAMENTO_APROVAR_CONC,
  GET_FOLHA_DE_PAGAMENTO_APROVAR_VOUCHER,
  GET_FOLHA_DE_PAGAMENTO_BENE,
  GET_FOLHA_DE_PAGAMENTO_CONC,
  GET_FOLHA_DE_PAGAMENTO_FUNCIONARIO,
  GET_FOLHA_DE_PAGAMENTO_SHOW,
  GET_FOLHA_DE_PAGAMENTO_VOUCHER,
  GET_FUNCIONARIO,
  GET_FUNCIONARIO_GRUPO,
  GET_GERAR_TOKEN,
  GET_GRAFICO_CONTA_BAR_DASHBOARD,
  GET_GRAFICO_CONTA_LINE_DASHBOARD,
  GET_LISTA_ADMINISTRADOR,
  GET_LISTA_BANNER,
  GET_LOGS,
  GET_MEUS_ECS,
  GET_MINHAS_ASSINATURAS,
  GET_MINHAS_TAXAS,
  GET_PAGAMENTO_APROVAR,
  GET_PAGAMENTO_CONTA_EXTRATO,
  GET_PAGAMENTO_PIX,
  GET_PAGAMENTO_PIX_APROVAR,
  GET_PAGAMENTO_PIX_EXTRATO,
  GET_PAGAMENTO_TED_APROVAR,
  GET_PAGAMENTO_TRANSFERENCIA_APROVAR,
  GET_PAGAMENTO_WALLET_APROVAR,
  GET_PLANO_VENDAS,
  GET_PLANO_VENDAS_ID,
  GET_REENVIAR_TOKEN_USUARIO,
  GET_REPRESENTANTE,
  GET_RESUMO_CONTA_DASHBOARD,
  GET_SOCIO,
  GET_TED_EXTRATO,
  GET_TERMINAIS_POS,
  GET_TERMINAL_POS,
  GET_TERMINAL_POS_TRANSACTIONS,
  GET_TRANSACAO_PIX,
  GET_TRANSACAO_PIX_ID,
  GET_TRANSACAO_TED,
  GET_TRANSACAO_TED_ID,
  GET_TRANSFERENCIA_EXTRATO,
  LOAD_ALL_CONTAS,
  LOAD_ASSINATURAS,
  LOAD_BANCOS,
  LOAD_BOLETOS,
  LOAD_BOLETO_LIST,
  LOAD_CARNE,
  LOAD_COBRANCAS_CARTAO,
  LOAD_COBRANCAS_COMPARTILHADAS,
  LOAD_COBRANCAS_RECEBIDAS_WALLET,
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
  LOAD_HISTORICO_TED,
  LOAD_HISTORICO_TRANSACAO,
  LOAD_HISTORICO_TRANSFERENCIA,
  LOAD_LANCAMENTOS_FUTUROS,
  LOAD_LINK_PAGAMENTOS,
  LOAD_LINK_PAGAMENTOS_ID,
  LOAD_LISTAR_PRODUTOS_GIFT_CARD,
  LOAD_LISTAR_RECARGAS,
  LOAD_LISTA_DEVICE_BLOQUEADO,
  LOAD_LISTA_PRE_CONTAS,
  LOAD_LISTA_PRE_CONTA_ID,
  LOAD_LISTA_PRE_CONTA_JURIDICA_ID,
  LOAD_MINHAS_COBRANCAS,
  LOAD_PAGADORES,
  LOAD_PAGADORES_USER,
  LOAD_PAGADOR_ID,
  LOAD_PAGAMENTOS_LIST,
  LOAD_PARTNER_TRANSACTIONS,
  LOAD_PERFIL_TAXA,
  LOAD_PERFIL_TAXA_ID,
  LOAD_PERMISSAO,
  LOAD_PERMISSAO_GERENCIAR,
  LOAD_PLANOS,
  LOAD_PLANO_ID,
  LOAD_RECEBIVEIS,
  LOAD_RESUMO_TRANSACAO,
  LOAD_TRANSACAO,
  LOAD_TRANSACOES_FUTUROS,
  LOAD_TRANSFERENCIA_ID,
  LOAD_USER_DATA,
  POST_ACESSAR_WEB,
  POST_AUTH_ME,
  POST_BUSCAR_CONTA_CNPJ,
  POST_BUSCAR_CONTA_CPF,
  POST_CAPTURA,
  POST_CONTA,
  POST_CONTA_BANCARIA,
  POST_DOCUMENTO,
  POST_EMAIL,
  POST_ETAPA_1,
  POST_ETAPA_2,
  POST_ETAPA_3,
  POST_ETAPA_4,
  POST_ETAPA_5,
  POST_GERAR_QRCODE,
  POST_GERAR_TOKEN,
  POST_LER_QRCODE,
  POST_LINK_PAGAMENTOS,
  POST_LOGIN,
  POST_PERFIL_TAXA,
  POST_PRIMEIRO_ACESSO,
  POST_REPRESENTANTE,
  POST_SPLIT,
  POST_STATUS_CARTAO_PRE,
  POST_VERIFICAR_CONTATO,
  POST_VINCULAR_PERFIL_TAXA,
  PUT_PERFIL_TAXA,
  SET_AUTORIZAR_MODAL,
  SET_AUTORIZAR_TODOS,
  SET_CADASTRAR_LOTE_MODAL,
  SET_DADOS_BOLETO_GERADO,
  SET_DADOS_COBRANCA_WALLET,
  SET_DADOS_QR_CODE_COBRANCA,
  SET_HEADER_LIKE,
  SET_PAGADOR_ID,
  SET_PRE_CONTA_JURIDICA_ID,
  SET_REDIRECIONAR_TRANSFERENCIA,
  SET_REDIRECIONAR_VALOR_RETIRADA,
  SET_REDIRECIONAR_VALOR_TRANSFERENCIA,
  SET_STATE,
  SET_UPDATE_VIEW,
  UPDATE_USER_CONTA,
  USER_TYPE,
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
  historicoTed: {
    data: [
      {
        origem: {},
        destino: {},
      },
    ],
  },
  transacao: {},
  recebiveis: {},
  /* chavesPix: {
		data: [{}],
	}, */
  chavesPix: [],
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
  pagadorId: "",
  pagadoresUser: {
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
  boletosList: {
    data: [{}],
  },
  dadosBoletoGerado: {
    data: [{}],
  },
  pagamentosList: {
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
  perfilTaxaId: {},
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
  preContaJuridicaId: {},
  setPreContaJuridicaId: {},
  transferenciaId: {},
  tedId: {},
  pixId: {},
  partnerTransactions: {
    data: [{}],
  },
  listaDeviceBloqueado: {},
  blacklist: {},
  verificarCPF: {},
  verificarCNPJ: {},
  cadastroEtapa1: {},
  cadastroEtapa2: {},
  cadastroEtapa3: {},
  cadastroEtapa4: {},
  cadastroEtapa5: {},
  verificarContato: {},
  representante: {},
  listaRepresentante: {},
  documentoPreConta: {},
  qrCodeValue: {},
  pagamentoPix: [],
  consultaChave: {},
  qrCodeCobrar: {},
  lerQrCode: {},
  pagamentoPixAprovar: {},
  pagamentoAprovar: {},
  pagamentoTEDAprovar: {},
  pagamentoTransferenciaAprovar: {},
  listaCobrancasRecebidasWallet: {},
  cobrancaDados: {},
  cobrancaWalletDados: {},
  listaMinhasCobrancasWallet: {},
  listaCobrancasCompartilhadas: {},
  qrCodeCobrancaDados: {},
  funcionarios: {},
  grupos: {},
  folhaDePagamento: {},
  folhaDePagamentoShow: {},
  folhaDePagamentoAprovar: {},
  folhaDePagamentoConc: {},
  folhaDePagamentoAprovarConc: {},
  folhaDePagamentoBene: {},
  folhaDePagamentoAprovarBene: {},
  folhaDePagamentoVoucher: {},
  folhaDePagamentoAprovarVoucher: {},
  autorizarModal: null,
  autorizarTodos: null,
  headerLike: "",
  folhaDePagamentoFuncionario: {},
  cadastrarLoteModal: null,
  listaBanner: {},
  arquivoLoteBene: {},
  arquivoLoteVoucher: {},
  arquivoLoteConc: {},
  arquivoLote: {},
  arquivoLoteFuncionario: {},
  statusCartaoPre: null,
  atualizarView: false,
  redirecionarTransferencia: null,
  redirecionarValorTransferencia: null,
  redirecionarValorRetirada: null,
  transferenciaExtrato: {},
  tedExtrato: {},
  pagamentoContaExtrato: {},
  pagamentoPixExtrato: {},
  pagamentoWalletAprovar: {},
  cartaoHistoricoTransacao: {},
  arquivoLoteComprovante: {},
  favoritosPix: {},
  favoritosTED: {},
  favoritosP2P: {},
  favoritosWallet: {},
  pagador: {
    id: "",
    tipo: "",
    documento: "",
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

  linkPagamentoId: {
    data: [{}],
  },
  plano: {},
  minhasAssinaturas: {},
  minhasTaxas: {},
  exportacoesSolicitadas: {},
  terminaisPOS: {},
  terminaLPOS: {},
  terminalPOSTransaction: {},
  listaSocio: {},
  planoVendas: {},
  planoVendasID: {},
  extratoAdquirencia: {},
  assinaturaPlanoVendas: {},
  meusEcs: {},
  transacoesFuturas: {},
  resumoTransacao: {},
  gerarToken: {},
  publicToken: {},
  beneficios: [],
  userType: { isGestao: false, isBanking: false },
};

/* const enhancer = compose(applyMiddleware(thunk)); */
export const rootReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_STATE:
      return action.payload;

    case SET_UPDATE_VIEW:
      return { ...state, atualizarView: action.payload };

    case POST_STATUS_CARTAO_PRE:
      return { ...state, statusCartaoPre: action.payload };

    case SET_DADOS_QR_CODE_COBRANCA:
      return { ...state, qrCodeCobrancaDados: action.payload };

    case LOAD_COBRANCAS_COMPARTILHADAS:
      return { ...state, listaCobrancasCompartilhadas: action.payload };

    case LOAD_MINHAS_COBRANCAS:
      return { ...state, listaMinhasCobrancasWallet: action.payload };

    case SET_DADOS_COBRANCA_WALLET:
      return { ...state, cobrancaDados: action.payload };

    case LOAD_COBRANCAS_RECEBIDAS_WALLET:
      return { ...state, listaCobrancasRecebidasWallet: action.payload };

    case LOAD_CONTAS:
      return { ...state, contas: action.payload };

    case LOAD_ALL_CONTAS:
      return { ...state, allContas: action.payload };

    case POST_LOGIN:
      return { ...state };

    case SET_PAGADOR_ID:
      return { ...state, pagadorId: action.payload };

    case LOAD_CONTA_ID:
      return { ...state, conta: action.payload };

    case SET_DADOS_BOLETO_GERADO:
      return { ...state, dadosBoletoGerado: action.payload };

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
          (item) => item.id !== action.payload,
        ),
      };

    case GET_APROVAR_CONTA:
      return {
        ...state,
      };

    case LOAD_BOLETO_LIST:
      return {
        ...state,
        boletosList: action.payload,
      };

    case LOAD_PAGAMENTOS_LIST:
      return {
        ...state,
        pagamentosList: action.payload,
      };

    case LOAD_DOCUMENTO:
      return { ...state, arquivoDocumento: action.payload };

    case DELETE_DOCUMENTO:
      return {
        ...state,
        conta: {
          ...state.conta,
          documentos: state.conta.documentos.filter(
            (item) => item.id !== action.payload,
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

    case LOAD_PLANO_ID:
      return { ...state, plano: action.payload };

    case LOAD_HISTORICO_TRANSACAO:
      return { ...state, historicoTransacao: action.payload };

    case LOAD_EXPORT_TRANSACAO:
      return { ...state, exportTransacao: action.payload };

    case LOAD_PAGADORES:
      return { ...state, pagadores: action.payload };

    case LOAD_PAGADORES_USER:
      return { ...state, pagadoresUser: action.payload };

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

    case LOAD_RECEBIVEIS:
      return { ...state, recebiveis: action.payload };

    case CLEAR_TRANSACAO:
      return { ...state, transacao: {} };

    case LOAD_HISTORICO_TRANSFERENCIA:
      return { ...state, historicoTransferencia: action.payload };

    case LOAD_HISTORICO_TED:
      return { ...state, historicoTed: action.payload };

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
            (item) => item.id !== action.payload,
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
            (item) => item.id !== action.payload,
          ),
        },
      };

    case GET_REENVIAR_TOKEN_USUARIO:
      return { ...state };

    case LOAD_PERFIL_TAXA:
      return { ...state, perfilTaxas: action.payload };

    case LOAD_PERFIL_TAXA_ID:
      return { ...state, perfilTaxaId: action.payload };

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
            (item) => item.id !== action.payload,
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

    case LOAD_LISTA_PRE_CONTA_JURIDICA_ID:
      return { ...state, preContaJuridicaId: action.payload };

    case SET_PRE_CONTA_JURIDICA_ID:
      return { ...state, setPreContaJuridicaId: action.payload };

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

    case GET_BLACKLIST:
      return { ...state, blacklist: action.payload };

    case POST_BUSCAR_CONTA_CPF:
      return { ...state, verificarCPF: action.payload };

    case POST_BUSCAR_CONTA_CNPJ:
      return { ...state, verificarCNPJ: action.payload };

    case POST_ETAPA_1:
      return { ...state, cadastroEtapa1: action.payload };

    case POST_ETAPA_2:
      return { ...state, cadastroEtapa2: action.payload };

    case POST_ETAPA_3:
      return { ...state, cadastroEtapa3: action.payload };

    case POST_ETAPA_4:
      return { ...state, cadastroEtapa4: action.payload };

    case POST_ETAPA_5:
      return { ...state, cadastroEtapa5: action.payload };

    case POST_VERIFICAR_CONTATO:
      return { ...state, verificarContato: action.payload };

    case POST_REPRESENTANTE:
      return { ...state, representante: action.payload };

    case GET_REPRESENTANTE:
      return { ...state, listaRepresentante: action.payload };

    /* case DEL_REPRESENTANTE:
				return {
					...state,
					perfilTaxas: {
						...state.perfilTaxas,
						data: state.perfilTaxas.data.filter(
							(item) => item.id !== action.payload
						),
					},
				};	
 */

    case GET_DOCUMENTO_PRE_CONTA:
      return { ...state, documentoPreConta: action.payload };

    /* case POST_DOCUMENTO:
			return { ...state, documentoImagem: action.payload }; */

    case POST_ACESSAR_WEB:
      return { ...state, qrCodeValue: action.payload };

    case GET_PAGAMENTO_PIX:
      return { ...state, pagamentoPix: action.payload };

    case GET_CONSULTA_CHAVE:
      return { ...state, consultaChave: action.payload };

    case POST_GERAR_QRCODE:
      return { ...state, qrCodeCobrar: action.payload };

    case CLEAR_QRCODE_COBRAR:
      return { ...state, qrCodeCobrar: INITIAL_STATE.qrCodeCobrar };

    case POST_LER_QRCODE:
      return { ...state, lerQrCode: action.payload };

    case GET_PAGAMENTO_PIX_APROVAR:
      return { ...state, pagamentoPixAprovar: action.payload };

    case GET_PAGAMENTO_APROVAR:
      return { ...state, pagamentoAprovar: action.payload };

    case GET_PAGAMENTO_TED_APROVAR:
      return { ...state, pagamentoTEDAprovar: action.payload };

    case GET_PAGAMENTO_TRANSFERENCIA_APROVAR:
      return { ...state, pagamentoTransferenciaAprovar: action.payload };

    case GET_PAGAMENTO_WALLET_APROVAR:
      return { ...state, pagamentoWalletAprovar: action.payload };

    case GET_FUNCIONARIO:
      return { ...state, funcionarios: action.payload };

    case GET_FUNCIONARIO_GRUPO:
      return { ...state, grupos: action.payload };

    case GET_FOLHA_DE_PAGAMENTO:
      return { ...state, folhaDePagamento: action.payload };

    case GET_FOLHA_DE_PAGAMENTO_BENE:
      return { ...state, folhaDePagamentoBene: action.payload };

    case GET_FOLHA_DE_PAGAMENTO_SHOW:
      return { ...state, folhaDePagamentoShow: action.payload };

    case GET_FOLHA_DE_PAGAMENTO_APROVAR:
      return { ...state, folhaDePagamentoAprovar: action.payload };

    case GET_FOLHA_DE_PAGAMENTO_CONC:
      return { ...state, folhaDePagamentoConc: action.payload };

    case GET_FOLHA_DE_PAGAMENTO_APROVAR_CONC:
      return { ...state, folhaDePagamentoAprovarConc: action.payload };

    case GET_FOLHA_DE_PAGAMENTO_APROVAR_BENE:
      return { ...state, folhaDePagamentoAprovarBene: action.payload };

    case GET_FOLHA_DE_PAGAMENTO_VOUCHER:
      return { ...state, folhaDePagamentoVoucher: action.payload };

    case GET_FOLHA_DE_PAGAMENTO_APROVAR_VOUCHER:
      return { ...state, folhaDePagamentoAprovarVoucher: action.payload };

    case SET_AUTORIZAR_MODAL:
      return { ...state, autorizarModal: action.payload };

    case SET_AUTORIZAR_TODOS:
      return { ...state, autorizarTodos: action.payload };

    case GET_FOLHA_DE_PAGAMENTO_FUNCIONARIO:
      return { ...state, folhaDePagamentoFuncionario: action.payload };

    case SET_HEADER_LIKE:
      return { ...state, headerLike: action.payload };

    case SET_CADASTRAR_LOTE_MODAL:
      return { ...state, cadastrarLoteModal: action.payload };

    case GET_LISTA_BANNER:
      return { ...state, listaBanner: action.payload };

    case GET_ARQUIVO_LOTE_CONC:
      return { ...state, arquivoLoteConc: action.payload };

    case GET_ARQUIVO_LOTE_BENE:
      return { ...state, arquivoLoteBene: action.payload };

    case GET_ARQUIVO_LOTE_VOUCHER:
      return { ...state, arquivoLoteVoucher: action.payload };

    case GET_ARQUIVO_LOTE:
      return { ...state, arquivoLote: action.payload };

    case GET_ARQUIVO_LOTE_FUNCIONARIO:
      return { ...state, arquivoLoteFuncionario: action.payload };

    case SET_REDIRECIONAR_TRANSFERENCIA:
      return { ...state, redirecionarTransferencia: action.payload };

    case SET_REDIRECIONAR_VALOR_TRANSFERENCIA:
      return { ...state, redirecionarValorTransferencia: action.payload };

    case SET_REDIRECIONAR_VALOR_RETIRADA:
      return { ...state, redirecionarValorRetirada: action.payload };

    case GET_TRANSFERENCIA_EXTRATO:
      return { ...state, transferenciaExtrato: action.payload };

    case GET_TED_EXTRATO:
      return { ...state, tedExtrato: action.payload };

    case GET_PAGAMENTO_CONTA_EXTRATO:
      return { ...state, pagamentoContaExtrato: action.payload };

    case GET_PAGAMENTO_PIX_EXTRATO:
      return { ...state, pagamentoPixExtrato: action.payload };

    case GET_CARTAO_HISTORICO_TRANSACAO:
      return { ...state, cartaoHistoricoTransacao: action.payload };

    case GET_ARQUIVO_LOTE_COMPROVANTE:
      return { ...state, arquivoLoteComprovante: action.payload };

    case GET_FAVORITOS_PIX:
      return { ...state, favoritosPix: action.payload };

    case GET_FAVORITOS_TED:
      return { ...state, favoritosTED: action.payload };

    case GET_FAVORITOS_P2P:
      return { ...state, favoritosP2P: action.payload };

    case GET_FAVORITOS_WALLET:
      return { ...state, favoritosWallet: action.payload };

    case LOAD_PAGADOR_ID:
      return { ...state, pagador: action.payload };

    case POST_LINK_PAGAMENTOS:
      return { ...state, linkPagamentos: action.payload };

    case LOAD_LINK_PAGAMENTOS_ID:
      return { ...state, linkPagamentoId: action.payload };

    case GET_MINHAS_ASSINATURAS:
      return { ...state, minhasAssinaturas: action.payload };

    case GET_MINHAS_TAXAS:
      return { ...state, minhasTaxas: action.payload };

    case GET_EXPORTACOES_SOLICITADAS:
      return { ...state, exportacoesSolicitadas: action.payload };

    case GET_TERMINAIS_POS:
      return { ...state, terminaisPOS: action.payload };

    case GET_TERMINAL_POS:
      return { ...state, terminalPOS: action.payload };

    case GET_TERMINAL_POS_TRANSACTIONS:
      return { ...state, terminalPOSTransaction: action.payload };

    case GET_SOCIO:
      return { ...state, listaSocio: action.payload };

    case GET_PLANO_VENDAS:
      return { ...state, planoVendas: action.payload };

    case GET_PLANO_VENDAS_ID:
      return { ...state, planoVendasID: action.payload };

    case GET_EXTRATO_ADQUIRENCIA:
      return { ...state, extratoAdquirencia: action.payload };

    case GET_ASSINATURA_PLANO_VENDAS:
      return { ...state, assinaturaPlanoVendas: action.payload };

    case GET_MEUS_ECS:
      return { ...state, meusEcs: action.payload };

    case LOAD_RESUMO_TRANSACAO:
      return { ...state, resumoTransacao: action.payload };

    case LOAD_TRANSACOES_FUTUROS:
      return { ...state, transacoesFuturas: action.payload };

    case GET_GERAR_TOKEN:
      return { ...state, gerarToken: action.payload };

    case POST_GERAR_TOKEN:
      return { ...state, publicToken: action.payload };

    case GET_BENEFICIOS:
      return { ...state, beneficios: action.payload };

    case USER_TYPE:
      return { ...state, userType: action.payload };

    default:
      return { ...state };
  }
};

/* const store = createStore(state, enhancer);

export { store }; */
