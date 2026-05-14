import {
  CLEAR_PRE_CONTA_ID,
  CLEAR_QRCODE_COBRAR,
  CLEAR_TRANSACAO,
  DELETE_ADMIN,
  DELETE_BANNER,
  DELETE_DOCUMENTO,
  DELETE_DOCUMENTO_PRE_CONTA,
  DELETE_FAVORITO_P2P,
  DELETE_FAVORITO_PIX,
  DELETE_FAVORITO_TED,
  DELETE_FAVORITO_WALLET,
  DELETE_PAGAMENTO_PIX_APROVAR,
  DELETE_PERFIL_TAXA,
  DEL_ASSINATURA,
  DEL_ASSINATURA_PLANO_VENDAS,
  DEL_CHAVE,
  DEL_CONTA_BANCARIA,
  DEL_FOLHA_DE_PAGAMENTO_FUNCIONARIO,
  DEL_FUNCIONARIO,
  DEL_FUNCIONARIO_GRUPO,
  DEL_GERAR_TOKEN,
  DEL_PAGADOR,
  DEL_PERMISSAO,
  DEL_PLANO,
  DEL_PLANO_ASSINATURA,
  DEL_PLANO_ASSINATURA_EC,
  DEL_PLANO_VENDAS,
  DEL_REPRESENTANTE,
  DEL_SOCIO,
  DEL_TERMINAL_POS,
  DEL_USER_REPRESENTANTE,
  GET_ACESSO_WEB,
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
  GET_CONTAS_EXPORT,
  GET_DOCUMENTO_PRE_CONTA,
  GET_ENVIAR_DOCUMENTO_IDWALL,
  GET_EXPORTACOES_SOLICITADAS,
  GET_EXPORT_DOWNLOAD,
  GET_EXTRATO_ADQUIRENCIA,
  GET_FAVORITOS_P2P,
  GET_FAVORITOS_PIX,
  GET_FAVORITOS_TED,
  GET_FAVORITOS_WALLET,
  GET_FINALIZAR_CADASTRO_CONTA,
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
  GET_REENVIAR_CODIGO,
  GET_REENVIAR_TOKEN_USUARIO,
  GET_REPRESENTANTE,
  GET_RESUMO_CONTA_DASHBOARD,
  GET_SINCRONIZAR_EXTRATO,
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
  POST_ACEITAR_TERMO_ABERTURA,
  POST_ACESSAR_WEB,
  POST_ARQUIVO_REMESSA,
  POST_ASSINATURA,
  POST_ASSINATURA_PLAN,
  POST_ASSINATURA_PLANO_VENDAS,
  POST_AUTH_ME,
  POST_BANNER,
  POST_BLACK_LIST_SELFIE,
  POST_BLOQUEAR_DEVICE,
  POST_BUSCAR_CONTA_CNPJ,
  POST_BUSCAR_CONTA_CPF,
  POST_CAPTURA,
  POST_CARTAO_PAGADOR,
  POST_COBRANCA_CARTAO,
  POST_CONFIRMAR_PROPRIEDADE,
  POST_CONTA,
  POST_CONTA_BANCARIA,
  POST_CONTA_PJ,
  POST_CRIAR_CHAVE,
  POST_CRIAR_TAXAS_PADRAO,
  POST_DESBLOQUEAR_DEVICE,
  POST_DESBLOQUEAR_PERFIL_TAXA,
  POST_DOCUMENTO,
  POST_DOCUMENTO_PRE_CONTA,
  POST_EMAIL,
  POST_ENVIAR_COMPROVANTE_FOLHA,
  POST_ETAPA_1,
  POST_ETAPA_2,
  POST_ETAPA_3,
  POST_ETAPA_4,
  POST_ETAPA_5,
  POST_FOLHA_DE_PAGAMENTO_APROVAR,
  POST_FOLHA_DE_PAGAMENTO_APROVAR_BENE,
  POST_FOLHA_DE_PAGAMENTO_APROVAR_CONC,
  POST_FOLHA_DE_PAGAMENTO_APROVAR_VOUCHER,
  POST_FOLHA_DE_PAGAMENTO_LOTE,
  POST_FOLHA_DE_PAGAMENTO_LOTE_BENE,
  POST_FOLHA_DE_PAGAMENTO_LOTE_CONC,
  POST_FOLHA_DE_PAGAMENTO_LOTE_VOUCHER,
  POST_FOLHA_PAGAMENTO,
  POST_FOLHA_PAGAMENTO_FUNCIONARIO_MULTI,
  POST_FUNCIONARIO,
  POST_FUNCIONARIO_GRUPO,
  POST_FUNCIONARIO_LOTE,
  POST_GERAR_QRCODE,
  POST_GERAR_TOKEN,
  POST_LER_QRCODE,
  POST_LINK_PAGAMENTOS,
  POST_LOGIN,
  POST_PAGADOR,
  POST_PAGAMENTO_APROVAR,
  POST_PAGAMENTO_BOLETO,
  POST_PAGAMENTO_PIX,
  POST_PAGAMENTO_PIX_APROVAR,
  POST_PAGAMENTO_TED_APROVAR,
  POST_PAGAMENTO_TRANSFERENCIA_APROVAR,
  POST_PAGAMENTO_WALLET_APROVAR,
  POST_PERFIL_TAXA,
  POST_PERMISSAO,
  POST_PLANO,
  POST_PLANO_VENDAS,
  POST_PRIMEIRO_ACESSO,
  POST_RECUPERAR_SENHA,
  POST_REENVIAR_FOLHA_DE_PAGAMENTO_LOTE,
  POST_REENVIAR_TOKEN,
  POST_REIVINDICAR_PORTABILIDADE,
  POST_REIVINDICAR_PROPRIEDADE,
  POST_REPRESENTANTE,
  POST_SOCIO,
  POST_SOLICITAR_RESET,
  POST_SPLIT,
  POST_STATUS_CARTAO_PRE,
  POST_TERMINAL_POS,
  POST_USER_BLOQUEAR_DESBLOQUEAR,
  POST_USER_REPRESENTANTE,
  POST_VALIDAR_TOKEN,
  POST_VERIFICAR_CONTATO,
  POST_VINCULAR_PERFIL_TAXA,
  PUT_ASSINATURA,
  PUT_FEES,
  PUT_FUNCIONARIO,
  PUT_FUNCIONARIO_GRUPO,
  PUT_OPERADOR,
  PUT_PAGADOR,
  PUT_PERFIL_TAXA,
  PUT_PLANO,
  PUT_REPRESENTANTE,
  PUT_SOCIO,
  PUT_TERMINAL_POS,
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
import {
  delAssinaturaPlanoVendas,
  delChave,
  delGerarToken,
  delPlanoVendas,
  deleteAdmin,
  deleteAssinatura,
  deleteBanner,
  deleteContaBancaria,
  deleteDocumento,
  deleteDocumentoPreConta,
  deleteFavoritoP2P,
  deleteFavoritoPix,
  deleteFavoritoTED,
  deleteFavoritoWallet,
  deleteFolhaDePagamentoFuncionario,
  deleteFuncionario,
  deleteFuncionarioGrupo,
  deletePagador,
  deletePagamentoPixAprovar,
  deletePerfilTaxa,
  deletePermissao,
  deletePlano,
  deletePlanoAssinatura,
  deletePlanoAssinaturaEC,
  deleteRepresentante,
  deleteSocio,
  deleteTerminalPOS,
  deleteUserRepresentante,
  getAcessoWeb,
  getAprovarConta,
  getArquivoLote,
  getArquivoLoteBene,
  getArquivoLoteComprovante,
  getArquivoLoteConc,
  getArquivoLoteFuncionario,
  getArquivoLoteVoucher,
  getAssinaturaPlanoVendas,
  getAssinaturasFilters,
  getBancos,
  getBlacklist,
  getBoletos,
  getBoletosFilter,
  getCarneFilters,
  getCartaoHistoricoTransacao,
  getChavesPix,
  getCobrancasCartaoFilters,
  getCobrancasCompartilhadas,
  getConsultaChavePix,
  getContaBancaria,
  getContaId,
  getContas,
  getContasExport,
  getDetalhesGiftCard,
  getDetalhesRecarga,
  getDocumento,
  getDocumentoPreConta,
  getEnviarDocumentoIdWall,
  getExportDownload,
  getExportExtrato,
  getExportHistoricoTransacao,
  getExportHistoricoTransferencia,
  getExportPartnerTransacions,
  getExportacoesSolicitadas,
  getExtratoAdquirenciaFilters,
  getExtratoFilters,
  getFavoritosP2P,
  getFavoritosPix,
  getFavoritosTED,
  getFavoritosWallet,
  getFinalizarCadastroConta,
  getFolhaDePagamento,
  getFolhaDePagamentoAprovar,
  getFolhaDePagamentoAprovarBene,
  getFolhaDePagamentoAprovarConc,
  getFolhaDePagamentoAprovarVoucher,
  getFolhaDePagamentoBene,
  getFolhaDePagamentoConc,
  getFolhaDePagamentoFuncionario,
  getFolhaDePagamentoShow,
  getFolhaDePagamentoVoucher,
  getFuncionario,
  getFuncionarioGrupo,
  getGerarToken,
  getGraficoContaBarDashboard,
  getGraficoContaLineDashboard,
  getHistoricoTransacaoFilters,
  getHistoricoTransferencia,
  getHistoricoTransferenciaFilters,
  getLancamentosFuturos,
  getLinkPagamentoId,
  getLinkPagamentosFilter,
  getListaAdministrador,
  getListaBanner,
  getListaCobrancasRecebidasWallet,
  getListaDeviceBloqueado,
  getListaPreConta,
  getListarProdutosGiftCard,
  getListarProdutosGiftCardAdmin,
  getListarRecargas,
  getListarRecargasAdmin,
  getLogs,
  getMeusEcs,
  getMinhasAssinaturas,
  getMinhasCobrancas,
  getMinhasTaxas,
  getPagadorId,
  getPagadores,
  getPagadoresFilter,
  getPagamentoAprovar,
  getPagamentoContaExtrato,
  getPagamentoPix,
  getPagamentoPixAprovar,
  getPagamentoPixExtrato,
  getPagamentoTEDAprovar,
  getPagamentoTransferenciaAprovar,
  getPagamentoWalletAprovar,
  getPagamentos,
  getPartnerTransacions,
  getPerfilTaxa,
  getPerfilTaxaId,
  getPermissao,
  getPlanoId,
  getPlanosAll,
  getPlanosDeVendas,
  getPlanosDeVendasID,
  getPlanosFilters,
  getPreContaId,
  getPreContaJuridicaId,
  getRecebiveisId,
  getReenviarCodigo,
  getReenviarTokenUsuario,
  getRepresentante,
  getResumoCompletoRecebiveis,
  getResumoContaDashboard,
  getResumoRecebiveisFuturos,
  getSincronizarExtratoConta,
  getSocio,
  getTedExtrato,
  getTerminaisPOS,
  getTerminalPOS,
  getTerminalPOSTransactions,
  getTransacaoId,
  getTransacaoPix,
  getTransacaoPixId,
  getTransacaoTed,
  getTransacaoTedCliente,
  getTransacaoTedId,
  getTransferenciaExtrato,
  getTransferenciaId,
  getUserData,
  postAceitarTermoAbertura,
  postAcessoWeb,
  postArquivoRemessa,
  postAssinaturaPlan,
  postAssinaturaPlanoVendas,
  postAssinaturas,
  postAuthMe,
  postBanner,
  postBlackListSelfie,
  postBloquearDeviceAdm,
  postBuscarConta,
  postCapturaCobranca,
  postCartaoAssinatura,
  postCartaoStatus,
  postCobrancaCartao,
  postCobrancaEstornar,
  postConfirmarPropriedade,
  postContaBancaria,
  postContaPJ,
  postCriarAdmin,
  postCriarChave,
  postCriarTaxasPadrao,
  postDesbloquearDeviceAdm,
  postDesvincularPerfilTaxa,
  postDocumentoPreConta,
  postDocumentos,
  postDocumentosAdm,
  postEnviarComprovanteFolha,
  postEtapa1,
  postEtapa2,
  postEtapa3,
  postEtapa4,
  postEtapa5,
  postFirstAcess,
  postFolhaDePagamentoLote,
  postFolhaDePagamentoLoteBene,
  postFolhaDePagamentoLoteConc,
  postFolhaDePagamentoLoteVoucher,
  postFolhaPagamento,
  postFolhaPagamentoAprovar,
  postFolhaPagamentoAprovarBene,
  postFolhaPagamentoAprovarConc,
  postFolhaPagamentoAprovarVoucher,
  postFolhaPagamentoFuncionarioMulti,
  postFuncionario,
  postFuncionarioGrupo,
  postFuncionarioLote,
  postGerarQrCode,
  postGerarToken,
  postLerQrCode,
  postLinkPagamento,
  postLogin,
  postPagador,
  postPagamentoAprovar,
  postPagamentoPix,
  postPagamentoPixAprovar,
  postPagamentoTEDAprovar,
  postPagamentoTransferenciaAprovar,
  postPagamentoWalletAprovar,
  postPagarBoleto,
  postPerfilTaxa,
  postPermissao,
  postPlano,
  postPlanoDeVendas,
  postPreContaRepresentante,
  postReenviarFolhaDePagamentoLote,
  postReenviarToken,
  postReivindicarPropriedade,
  postReivindicaçãoPortabilidade,
  postResetPassword,
  postSendReset,
  postSocio,
  postSplit,
  postTerminalPos,
  postUserBloquearDesbloquear,
  postUserRepresentante,
  postValidarToken,
  postVerificarContato,
  postVincularPerfilTaxa,
  putAssinaturas,
  putConta,
  putFees,
  putPagador,
  putPerfilTaxa,
  putPlano,
  putRepresentante,
  putSocio,
  putTerminalPOS,
  putUpdateFuncionario,
  putUpdateFuncionarioGrupo,
  putUserConta,
  putUserOperador,
} from "../services/services";

import { toast } from "react-toastify";
import { getBeneficios } from "../services/beneficiarios";

export const getContasAction =
  (
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
    conta_id_filter,
  ) =>
  async (dispatch) => {
    try {
      const res = await getContas(
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
        conta_id_filter,
      );
      dispatch({
        type: LOAD_CONTAS,
        payload: res.data,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

export const getAllContasAction = (token, mostrar) => async (dispatch) => {
  try {
    const res = await getContas(token, "", "", "", mostrar);
    dispatch({
      type: LOAD_ALL_CONTAS,
      payload: res.data,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const postLoginAction = (email, password) => async (dispatch) => {
  try {
    const res = await postLogin(email, password);
    dispatch({
      type: POST_LOGIN,
      payload: res.data,
    });
    return res;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const loadContaId =
  (token, id, representante = false, empresa = false, socio = false) =>
  async (dispatch) => {
    try {
      const res = await getContaId(
        token,
        id,
        (representante = false),
        (empresa = false),
        (socio = false),
      );
      dispatch({
        type: LOAD_CONTA_ID,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const updateConta = (token, conta, id) => async (dispatch) => {
  try {
    const res = await putConta(token, conta, id);
    dispatch({
      type: POST_CONTA,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro no cadastro");
      return err;
    }
  }
};

export const loadBancos = (token) => async (dispatch) => {
  try {
    const res = await getBancos(token);
    dispatch({
      type: LOAD_BANCOS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const loadBoletoList =
  (token, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getBoletos(token, page, like, order, mostrar);

      dispatch({
        type: LOAD_BOLETO_LIST,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadPagamentosList =
  (token, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getPagamentos(token, page, like, order, mostrar);

      dispatch({
        type: LOAD_PAGAMENTOS_LIST,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const postContaBancariaAction =
  (token, conta, conta_id) => async (dispatch) => {
    try {
      const res = await postContaBancaria(token, conta, conta_id);
      dispatch({
        type: POST_CONTA_BANCARIA,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro no cadastro");
        return null;
      }
    }
  };

export const loadContaBancaria = (token, conta_id) => async (dispatch) => {
  try {
    const res = await getContaBancaria(token, conta_id);
    dispatch({
      type: LOAD_CONTA_BANCARIA,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAprovarContaAction = (token, id) => async (dispatch) => {
  try {
    const res = await getAprovarConta(token, id);
    dispatch({
      type: GET_APROVAR_CONTA,
      payload: res.data,
    });
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getFinalizarCadastroContaAction =
  (token, id) => async (dispatch) => {
    try {
      const res = await getFinalizarCadastroConta(token, id);
      dispatch({
        type: GET_FINALIZAR_CADASTRO_CONTA,
        payload: res.data,
      });
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

export const delContaBancaria =
  (token, id, conta_id) => async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: DEL_CONTA_BANCARIA,
        payload: id,
      });
      await deleteContaBancaria(token, id, conta_id);
    } catch (err) {
      dispatch({
        type: SET_STATE,
        payload: state,
      });
      toast.error("Erro ao excluir conta Bancaria");
      console.error(err);
    }
  };

export const delDocumento = (token, id) => async (dispatch, getState) => {
  const state = getState();
  try {
    dispatch({
      type: DELETE_DOCUMENTO,
      payload: id,
    });
    await deleteDocumento(token, id);
  } catch (err) {
    console.log(err);
    dispatch({
      type: SET_STATE,
      payload: state,
    });
    toast.error("Erro ao deletar documento");
  }
};

export const loadDocumentos = (token, conta_id) => async (dispatch) => {
  try {
    const res = await getDocumento(token, conta_id);
    dispatch({
      type: LOAD_DOCUMENTO,
      payload: res.data.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const postDocumentoAction =
  (token, documento, categoria) => async (dispatch) => {
    const documentoObjeto = { ...documento };
    try {
      const res = await postDocumentos(
        token,
        documentoObjeto[0].file,
        categoria,
        documentoObjeto[0].file.type,
      );
      dispatch({
        type: POST_DOCUMENTO,
        payload: res.data,
      });
      toast.success("Documento adicionado com sucesso");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao adicionar o documento");
    }
  };

export const postDocumentoActionAdm =
  (token, documento, categoria, conta_id) => async (dispatch) => {
    const documentoObjeto = { ...documento };
    try {
      const res = await postDocumentosAdm(
        token,
        documentoObjeto[0].file,
        categoria,
        conta_id,
        documentoObjeto[0].file.type,
      );
      dispatch({
        type: POST_DOCUMENTO,
        payload: res.data,
      });
      toast.success("Documento adicionado com sucesso");
    } catch (err) {
      if (err.response.status === 422) {
        console.log(err.response.data.errors);
      } else {
        console.log(err);
        toast.error("erro");
        console.log(err.response.data.errors);
      }
      console.log(err);
      toast.error("Erro ao adicionar o documento");
    }
  };

export const getEnviarDocumentoIdWallAction =
  (token, id) => async (dispatch) => {
    try {
      const res = await getEnviarDocumentoIdWall(token, id);
      dispatch({
        type: GET_ENVIAR_DOCUMENTO_IDWALL,
        payload: res.data,
      });

      console.log(res.data);
      return false;
    } catch (err) {
      console.log(err);
      toast.error("Erro ao reenviar");
      return true;
    }
  };

export const getResumoContaDashboardAction = (token) => async (dispatch) => {
  try {
    const res = await getResumoContaDashboard(token);
    dispatch({
      type: GET_RESUMO_CONTA_DASHBOARD,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getGraficoContaLineDashboardAction =
  (token) => async (dispatch) => {
    try {
      const res = await getGraficoContaLineDashboard(token);
      dispatch({
        type: GET_GRAFICO_CONTA_LINE_DASHBOARD,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const getGraficoContaBarDashboardAction =
  (token) => async (dispatch) => {
    try {
      const res = await getGraficoContaBarDashboard(token);
      dispatch({
        type: GET_GRAFICO_CONTA_BAR_DASHBOARD,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const getContasExportAction =
  (
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
  ) =>
  async (dispatch) => {
    try {
      const res = await getContasExport(
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
      );
      dispatch({
        type: GET_CONTAS_EXPORT,
        payload: res.data,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

export const postCapturaCobrancaAction =
  (token, id, valor) => async (dispatch) => {
    try {
      const res = await postCapturaCobranca(token, id, valor);
      dispatch({
        type: POST_CAPTURA,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        console.log(err);
        toast.error("erro");
        return null;
      }
    }
  };

export const loadCobrancasCartaoFilters =
  (token, page = "", like = "", order = "", mostrar = "", conta_id = "") =>
  async (dispatch) => {
    try {
      const res = await getCobrancasCartaoFilters(
        token,
        page,
        like,
        order,
        mostrar,
        conta_id,
      );
      dispatch({
        type: LOAD_COBRANCAS_CARTAO,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const postCobrancaEstornarAction = (token, id) => async () => {
  try {
    const res = await postCobrancaEstornar(token, id);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const postSplitAction = (token, transacao) => async (dispatch) => {
  try {
    const res = await postSplit(token, transacao);
    dispatch({
      type: POST_SPLIT,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro");
      return err;
    }
  }
};

export const loadBoletosFilter =
  (token, page, like, order, mostrar, conta_id) => async (dispatch) => {
    try {
      const res = await getBoletosFilter(
        token,
        page,
        like,
        order,
        mostrar,
        conta_id,
      );
      dispatch({
        type: LOAD_BOLETOS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadCarneFilters =
  (token, page, like, order, mostrar, conta_id) => async (dispatch) => {
    try {
      const res = await getCarneFilters(
        token,
        page,
        like,
        order,
        mostrar,
        conta_id,
      );
      dispatch({
        type: LOAD_CARNE,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadLinkPagamentoFilter =
  (token, page, like, order, mostrar, conta_id) => async (dispatch) => {
    try {
      const res = await getLinkPagamentosFilter(
        token,
        page,
        like,
        order,
        mostrar,
        conta_id,
      );
      dispatch({
        type: LOAD_LINK_PAGAMENTOS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadLancamentosFuturos =
  (token, page, data_liberacao_inicial, data_liberacao_final) =>
  async (dispatch) => {
    try {
      const res = await getLancamentosFuturos(
        token,
        page,
        data_liberacao_inicial,
        data_liberacao_final,
      );
      dispatch({
        type: LOAD_LANCAMENTOS_FUTUROS,
        payload: res.data,
      });
    } catch (err) {
      if (err.response.status === 422) {
        toast.warn(err.response.data.message);
      }
    }
  };

export const loadExtratoFilter =
  (
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
  ) =>
  async (dispatch) => {
    try {
      const res = await getExtratoFilters(
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
      );
      dispatch({
        type: LOAD_EXTRATO,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadExportExtrato =
  (
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
    export_type = "",
  ) =>
  async (dispatch) => {
    try {
      const res = await getExportExtrato(
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
      );
      dispatch({
        type: LOAD_EXPORT_EXTRATO,
        payload: res.data,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      toast.error("Erro ao exportar");
      return null;
    }
  };

export const loadAssinaturasFilters =
  (token, page, like, plano, order, mostrar, conta_id) => async (dispatch) => {
    try {
      const res = await getAssinaturasFilters(
        token,
        page,
        like,
        plano,
        order,
        mostrar,
        conta_id,
      );
      dispatch({
        type: LOAD_ASSINATURAS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadPlanosAll = (token) => async (dispatch) => {
  try {
    const res = await getPlanosAll(token);
    dispatch({
      type: LOAD_PLANOS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const loadHistoricoTransacaoFilter =
  (
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
  ) =>
  async (dispatch) => {
    try {
      const res = await getHistoricoTransacaoFilters(
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
      );
      dispatch({
        type: LOAD_HISTORICO_TRANSACAO,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadExportHistoricoTransacao =
  (
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
  ) =>
  async (dispatch) => {
    try {
      const res = await getExportHistoricoTransacao(
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
      );
      dispatch({
        type: LOAD_EXPORT_TRANSACAO,
        payload: res.data,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      toast.error("Erro ao exportar");
      return null;
    }
  };

export const loadPagadoresFilter =
  (token, page, like, order, mostrar, conta_id) => async (dispatch) => {
    try {
      const res = await getPagadoresFilter(
        token,
        page,
        like,
        order,
        mostrar,
        conta_id,
      );
      dispatch({
        type: LOAD_PAGADORES,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };
export const loadPagadores =
  (token, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getPagadores(token, page, like, order, mostrar);
      dispatch({
        type: LOAD_PAGADORES_USER,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadCobrancasRecebidasWallet =
  (token, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getListaCobrancasRecebidasWallet(
        token,
        page,
        like,
        order,
        mostrar,
      );
      dispatch({
        type: LOAD_COBRANCAS_RECEBIDAS_WALLET,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadListaCobrancasCompartilhadas =
  (token, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getCobrancasCompartilhadas(
        token,
        page,
        like,
        order,
        mostrar,
      );
      dispatch({
        type: LOAD_COBRANCAS_COMPARTILHADAS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadMinhasCobrancasWallet =
  (token, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getMinhasCobrancas(token, page, like, order, mostrar);
      dispatch({
        type: LOAD_MINHAS_COBRANCAS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const setPagadorId = (pagadorId) => (dispatch) => {
  dispatch({
    type: SET_PAGADOR_ID,
    payload: pagadorId,
  });
};

export const setDadosBoleto = (dados) => (dispatch) => {
  dispatch({
    type: SET_DADOS_BOLETO_GERADO,
    payload: dados,
  });
};

export const setCobrancaQrCode = (dados) => (dispatch) => {
  dispatch({
    type: SET_DADOS_QR_CODE_COBRANCA,
    payload: dados,
  });
};

export const setDadosCobranca = (dados) => (dispatch) => {
  dispatch({
    type: SET_DADOS_COBRANCA_WALLET,
    payload: dados,
  });
};

export const delPagador = (token, id) => async (dispatch, getState) => {
  const state = getState();
  try {
    dispatch({
      type: DEL_PAGADOR,
      payload: id,
    });
    await deletePagador(token, id);
  } catch (err) {
    dispatch({
      type: SET_STATE,
      payload: state,
    });
    toast.error("Erro ao excluir o pagador");
  }
};

export const getTransacaoTedAction =
  (token, page, like, order, mostrar, conta_id) => async (dispatch) => {
    try {
      const res = await getTransacaoTed(
        token,
        page,
        like,
        order,
        mostrar,
        conta_id,
      );
      dispatch({
        type: GET_TRANSACAO_TED,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadTedTransactionsList =
  (token, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getTransacaoTedCliente(
        token,
        page,
        like,
        order,
        mostrar,
      );
      dispatch({
        type: LOAD_HISTORICO_TED,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const getTransacaoTedIdAction = (token, id) => async (dispatch) => {
  try {
    const res = await getTransacaoTedId(token, id);
    dispatch({
      type: GET_TRANSACAO_TED_ID,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getTransacaoPixAction =
  (token, page, like, order, mostrar, conta_id) => async (dispatch) => {
    try {
      const res = await getTransacaoPix(
        token,
        page,
        like,
        order,
        mostrar,
        conta_id,
      );
      dispatch({
        type: GET_TRANSACAO_PIX,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const getTransacaoPixIdAction = (token, id) => async (dispatch) => {
  try {
    const res = await getTransacaoPixId(token, id);
    dispatch({
      type: GET_TRANSACAO_PIX_ID,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getChavesPixAction =
  (token, page, like, order, mostrar, conta_id) => async (dispatch) => {
    try {
      const res = await getChavesPix(
        token,
        page,
        like,
        order,
        mostrar,
        conta_id,
      );
      dispatch({
        type: GET_CHAVES_PIX,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const updateUserConta = (token, conta) => async (dispatch) => {
  try {
    const res = await putUserConta(token, conta);
    dispatch({
      type: UPDATE_USER_CONTA,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro no cadastro");
      return null;
    }
  }
};

export const loadTransacaoId = (token, id) => async (dispatch) => {
  try {
    const res = await getTransacaoId(token, id);
    dispatch({
      type: LOAD_TRANSACAO,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const loadRecebiveisId = (token, id) => async (dispatch) => {
  try {
    const res = await getRecebiveisId(token, id);
    dispatch({
      type: LOAD_RECEBIVEIS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const loadTransferenciaId = (token, id) => async (dispatch) => {
  try {
    const res = await getTransferenciaId(token, id);
    dispatch({
      type: LOAD_TRANSFERENCIA_ID,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const clearTransacao = () => async (dispatch) => {
  dispatch({
    type: CLEAR_TRANSACAO,
  });
};

export const loadHistoricoTransferenciaFilters =
  (token, page, like, valor, data, conta_id) => async (dispatch) => {
    try {
      const res = await getHistoricoTransferenciaFilters(
        token,
        page,
        like,
        valor,
        data,
        conta_id,
      );
      dispatch({
        type: LOAD_HISTORICO_TRANSFERENCIA,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadHistoricoTransferencia =
  (token, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getHistoricoTransferencia(
        token,
        page,
        like,
        order,
        mostrar,
      );
      dispatch({
        type: LOAD_HISTORICO_TRANSFERENCIA,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadExportHistoricoTransferencia =
  (token, page, like, valor, data, conta_id) => async (dispatch) => {
    try {
      const res = await getExportHistoricoTransferencia(
        token,
        page,
        like,
        valor,
        data,
        conta_id,
      );
      dispatch({
        type: LOAD_EXPORT_TRANSFERENCIA,
        payload: res.data,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      toast.error("Erro ao exportar");
      return null;
    }
  };

export const loadUserData = (token) => async (dispatch) => {
  try {
    const res = await getUserData(token);
    dispatch({
      type: LOAD_USER_DATA,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const atualizarView = (dado) => (dispatch) => {
  dispatch({
    type: SET_UPDATE_VIEW,
    payload: dado,
  });
};

export const postStatusCartaoPre = (token, id) => async (dispatch) => {
  try {
    const res = await postCartaoStatus(token, id);
    dispatch({
      type: POST_STATUS_CARTAO_PRE,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: POST_STATUS_CARTAO_PRE,
      payload: null,
    });
    console.log(err);
    return false;
  }
};

export const getListaAdministradorAction =
  (token, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getListaAdministrador(
        token,
        page,
        like,
        order,
        mostrar,
      );
      dispatch({
        type: GET_LISTA_ADMINISTRADOR,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const delAdmin = (token, id) => async (dispatch, getState) => {
  const state = getState();
  try {
    dispatch({
      type: DELETE_ADMIN,
      payload: id,
    });
    await deleteAdmin(token, id);
  } catch (err) {
    console.log(err);
    dispatch({
      type: SET_STATE,
      payload: state,
    });
    toast.error("Erro ao deletar documento");
  }
};

export const getReenviarTokenUsuarioAction =
  (token, id) => async (dispatch) => {
    try {
      const res = await getReenviarTokenUsuario(token, id);
      dispatch({
        type: GET_REENVIAR_TOKEN_USUARIO,
        payload: res.data,
      });

      return false;
    } catch (err) {
      toast.error("Erro ao reenviar");
      return true;
    }
  };

export const postPrimeiroAcesso = (user) => async (dispatch) => {
  try {
    const res = await postFirstAcess(user);
    dispatch({
      type: POST_PRIMEIRO_ACESSO,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro no cadastro");
      return null;
    }
  }
};

export const postRecuperarSenha = (user) => async (dispatch) => {
  try {
    const res = await postResetPassword(user);
    dispatch({
      type: POST_RECUPERAR_SENHA,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro no recuperar senha");
      return null;
    }
  }
};

export const postSolicitarReset = (user) => async (dispatch) => {
  try {
    const res = await postSendReset(user);
    dispatch({
      type: POST_SOLICITAR_RESET,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro no solicitar reset senha");
      return null;
    }
  }
};

export const postCriarAdminAction = (token, email) => async (dispatch) => {
  try {
    const res = await postCriarAdmin(token, email);
    dispatch({
      type: POST_EMAIL,
      payload: res.data,
    });
    return null;
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro no cadastro");
      return true;
    }
  }
};

export const loadPerfilTaxaAction = (token, like) => async (dispatch) => {
  try {
    const res = await getPerfilTaxa(token, like);
    dispatch({
      type: LOAD_PERFIL_TAXA,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const loadPerfilTaxaIdAction = (token, id) => async (dispatch) => {
  try {
    const res = await getPerfilTaxaId(token, id);
    dispatch({
      type: LOAD_PERFIL_TAXA_ID,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const postPerfilTaxaAction =
  (
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
  ) =>
  async (dispatch) => {
    try {
      const res = await postPerfilTaxa(
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
      );
      dispatch({
        type: POST_PERFIL_TAXA,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error(`Erro: ${err.response.status}`);
        return true;
      }
    }
  };

export const putPerfilTaxaAction =
  (
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
  ) =>
  async (dispatch) => {
    try {
      const res = await putPerfilTaxa(
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
      );
      dispatch({
        type: PUT_PERFIL_TAXA,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error(`Erro: ${err.response.status}`);
        return true;
      }
    }
  };

export const delPerfilTaxa = (token, id) => async (dispatch, getState) => {
  const state = getState();
  try {
    dispatch({
      type: DELETE_PERFIL_TAXA,
      payload: id,
    });
    await deletePerfilTaxa(token, id);
    return { success: true };
  } catch (err) {
    console.log(err);
    dispatch({
      type: SET_STATE,
      payload: state,
    });
    return { success: false, status: err.response.status };
  }
};

export const postVincularPerfilTaxaAction =
  (token, id, conta_id) => async (dispatch) => {
    try {
      const res = await postVincularPerfilTaxa(token, id, conta_id);
      dispatch({
        type: POST_VINCULAR_PERFIL_TAXA,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error(`Erro: ${err.response.status}`);
        return true;
      }
    }
  };

export const postUserBloquearDesbloquearAction =
  (token, id) => async (dispatch) => {
    try {
      const res = await postUserBloquearDesbloquear(token, id);
      dispatch({
        type: POST_USER_BLOQUEAR_DESBLOQUEAR,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error(`Erro: ${err.response.status}`);
        return true;
      }
    }
  };

export const loadPermissaoGerenciar = (token, id) => async (dispatch) => {
  try {
    const res = await getPermissao(token, id);
    dispatch({
      type: LOAD_PERMISSAO_GERENCIAR,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const postPermissaoAction =
  (token, id, tipoPermissao) => async (dispatch) => {
    try {
      const res = await postPermissao(token, id, tipoPermissao);
      dispatch({
        type: POST_PERMISSAO,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const delPermissao = (token, id, tipoPermissao) => async (dispatch) => {
  try {
    const res = await deletePermissao(token, id, tipoPermissao);
    dispatch({
      type: DEL_PERMISSAO,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const postAuthMeAction = (token) => async (dispatch) => {
  try {
    const res = await postAuthMe(token);
    dispatch({
      type: POST_AUTH_ME,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const loadPermissao = (token, id) => async (dispatch) => {
  try {
    const res = await getPermissao(token, id);
    dispatch({
      type: LOAD_PERMISSAO,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getLogsAction =
  (token, user_id, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getLogs(token, user_id, page, like, order, mostrar);
      dispatch({
        type: GET_LOGS,
        payload: res.data,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

export const loadListarProdutosGiftCard =
  (token, conta_id, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getListarProdutosGiftCard(
        token,
        conta_id,
        page,
        like,
        order,
        mostrar,
      );
      dispatch({
        type: LOAD_LISTAR_PRODUTOS_GIFT_CARD,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadListarProdutosGiftCardAdmin =
  (
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
  ) =>
  async (dispatch) => {
    try {
      const res = await getListarProdutosGiftCardAdmin(
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
      );
      dispatch({
        type: LOAD_LISTAR_PRODUTOS_GIFT_CARD,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadDetalhesGiftCard = (token, id) => async (dispatch) => {
  try {
    const res = await getDetalhesGiftCard(token, id);
    dispatch({
      type: LOAD_DETALHES_GIFT_CARD,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const loadListarRecargas =
  (token, conta_id, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getListarRecargas(
        token,
        conta_id,
        page,
        like,
        order,
        mostrar,
      );
      dispatch({
        type: LOAD_LISTAR_RECARGAS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadListarRecargasAdmin =
  (
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
  ) =>
  async (dispatch) => {
    try {
      const res = await getListarRecargasAdmin(
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
      );
      dispatch({
        type: LOAD_LISTAR_RECARGAS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadDetalhesRecarga = (token, id) => async (dispatch) => {
  try {
    const res = await getDetalhesRecarga(token, id);
    dispatch({
      type: LOAD_DETALHES_RECARGA,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const loadListaPreConta =
  (token, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getListaPreConta(token, page, like, order, mostrar);
      dispatch({
        type: LOAD_LISTA_PRE_CONTAS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadPreContaId = (token, id) => async (dispatch) => {
  try {
    const res = await getPreContaId(token, id);
    dispatch({
      type: LOAD_LISTA_PRE_CONTA_ID,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};
export const loadPreContaJuridicaId = (id) => async (dispatch) => {
  try {
    const res = await getPreContaJuridicaId(id);
    dispatch({
      type: LOAD_LISTA_PRE_CONTA_JURIDICA_ID,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const clearPreContaID = () => (dispatch) => {
  dispatch({
    type: CLEAR_PRE_CONTA_ID,
    payload: null,
  });
};

export const loadPartnerTransactions =
  (
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
  ) =>
  async (dispatch) => {
    try {
      const res = await getPartnerTransacions(
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
      );
      dispatch({
        type: LOAD_PARTNER_TRANSACTIONS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const loadExportPartnerTransactions =
  (
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
  ) =>
  async (dispatch) => {
    try {
      const res = await getExportPartnerTransacions(
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
      );
      dispatch({
        type: LOAD_EXPORT_TRANSACAO,
        payload: res.data,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      toast.error("Erro ao exportar");
      return null;
    }
  };

export const postBloquearDeviceAdmAction =
  (token, conta_id, descricao) => async (dispatch) => {
    try {
      const res = await postBloquearDeviceAdm(token, conta_id, descricao);
      dispatch({
        type: POST_BLOQUEAR_DEVICE,
        payload: res.data,
      });
      return { success: true };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        errors: err.response.data.errors,
        status: err.response.status,
      };
    }
  };

export const postDesbloquearDeviceAdmAction =
  (token, conta_id) => async (dispatch) => {
    try {
      const res = await postDesbloquearDeviceAdm(token, conta_id);
      dispatch({
        type: POST_DESBLOQUEAR_DEVICE,
        payload: res.data,
      });
      return { success: true };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        errors: err.response.data.errors,
        status: err.response.status,
      };
    }
  };

export const getListaDeviceBloqueadoAction =
  (token, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getListaDeviceBloqueado(
        token,
        page,
        like,
        order,
        mostrar,
      );
      dispatch({
        type: LOAD_LISTA_DEVICE_BLOQUEADO,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const postDesvincularPerfilTaxaAction =
  (token, conta_id, taxa_id) => async (dispatch) => {
    try {
      const res = await postDesvincularPerfilTaxa(token, conta_id, taxa_id);
      dispatch({
        type: POST_DESBLOQUEAR_PERFIL_TAXA,
        payload: res.data,
      });
      return { success: true };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        errors: err.response.data.errors,
        status: err.response.status,
      };
    }
  };

export const postBlackListSelfieAction =
  (token, conta_id, blacklist_selfie) => async (dispatch) => {
    try {
      const res = await postBlackListSelfie(token, conta_id, blacklist_selfie);
      dispatch({
        type: POST_BLACK_LIST_SELFIE,
        payload: res.data,
      });
      return { success: true };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        errors: err.response.data.errors,
        status: err.response.status,
      };
    }
  };

export const getBlacklistAction =
  (token, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getBlacklist(token, page, like, order, mostrar);
      dispatch({
        type: GET_BLACKLIST,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const postBuscarContaCPFAction = (documento) => async (dispatch) => {
  try {
    const res = await postBuscarConta(documento);
    dispatch({
      type: POST_BUSCAR_CONTA_CPF,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      /* toast.error('Erro'); */
      return false;
    }
  }
};

export const postBuscarContaFuncionarioCPFAction =
  (documento) => async (dispatch) => {
    try {
      const res = await postBuscarConta(documento);
      dispatch({
        type: POST_BUSCAR_CONTA_CPF,
        payload: res.data,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return false;
      } else {
        /* toast.error('Erro'); */
        return false;
      }
    }
  };

export const postBuscarContaCNPJAction = (documento) => async (dispatch) => {
  try {
    const res = await postBuscarConta(documento);
    dispatch({
      type: POST_BUSCAR_CONTA_CNPJ,
      payload: res.data,
    });
    return false;
  } catch (err) {
    /* console.log(err); */
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      /* toast.error('Erro'); */
      return err;
    }
  }
};

export const postEtapa1Action = (etapa1) => async (dispatch) => {
  try {
    const res = await postEtapa1(etapa1);
    dispatch({
      type: POST_ETAPA_1,
      payload: res.data,
    });
    return false;
  } catch (err) {
    /* console.log(err); */
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      /* toast.error('Erro'); */
      return err;
    }
  }
};

export const postEtapa2Action = (etapa2) => async (dispatch) => {
  try {
    const res = await postEtapa2(etapa2);
    dispatch({
      type: POST_ETAPA_2,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    /* console.log(err); */
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      /* toast.error('Erro'); */
      return err;
    }
  }
};

export const postEtapa3Action = (documento) => async (dispatch) => {
  try {
    const res = await postEtapa3(documento);
    dispatch({
      type: POST_ETAPA_3,
      payload: res.data,
    });
    return false;
  } catch (err) {
    /* console.log(err); */
    if (err.response && err.response.status === 422) {
      if (err.response.data.errors.password) {
        err.response.data.errors.password.map((item) => {
          toast.error(item);
        });
      }
      return err.response.data.errors;
    } else {
      /* toast.error('Erro'); */
      return err;
    }
  }
};

export const postVerificarContatoAction =
  (documento, email, celular) => async (dispatch) => {
    try {
      const res = await postVerificarContato(documento, email, celular);
      dispatch({
        type: POST_VERIFICAR_CONTATO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      /* console.log(err); */
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        /* toast.error('Erro'); */
        return err;
      }
    }
  };

export const postReenviarTokenAction =
  (documento, tipo) => async (dispatch) => {
    try {
      const res = await postReenviarToken(documento, tipo);
      dispatch({
        type: POST_REENVIAR_TOKEN,
        payload: res.data,
      });
      return false;
    } catch (err) {
      /* console.log(err); */
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        /* toast.error('Erro'); */
        return err;
      }
    }
  };

export const postValidarTokenAction = (validarToken) => async (dispatch) => {
  try {
    const res = await postValidarToken(validarToken);
    dispatch({
      type: POST_VALIDAR_TOKEN,
      payload: res.data,
    });
    return false;
  } catch (err) {
    /* console.log(err); */
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      /* toast.error('Erro'); */
      return err;
    }
  }
};

export const postEtapa4Action = (etapa4) => async (dispatch) => {
  try {
    const res = await postEtapa4(etapa4);
    dispatch({
      type: POST_ETAPA_4,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro");
      return err;
    }
  }
};

export const postPreContaRepresentanteAction =
  (representante) => async (dispatch) => {
    try {
      const res = await postPreContaRepresentante(representante);
      dispatch({
        type: POST_REPRESENTANTE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else if (err.response.status === 403) {
        return toast.error(err.response.data.message);
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const putRepresentanteAction =
  (representante, id) => async (dispatch) => {
    try {
      const res = await putRepresentante(representante, id);
      dispatch({
        type: PUT_REPRESENTANTE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else if (err.response.status === 403) {
        return toast.error(err.response.data.message);
      } else {
        toast.error("Erro ao adicionar representante");
        return err;
      }
    }
  };

export const deleteRepresentanteAction = (id) => async (dispatch) => {
  try {
    const res = await deleteRepresentante(id);
    dispatch({
      type: DEL_REPRESENTANTE,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro ao deletar representante");
      return err;
    }
  }
};

export const getRepresentanteAction = (id) => async (dispatch) => {
  try {
    const res = await getRepresentante(id);
    dispatch({
      type: GET_REPRESENTANTE,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro carregar lista representantes");
      return err;
    }
  }
};

export const postEtapa5Action = (etapa5) => async (dispatch) => {
  try {
    const res = await postEtapa5(etapa5);
    dispatch({
      type: POST_ETAPA_5,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro");
      return err;
    }
  }
};

export const delDocumentoPrecontaAction =
  (id) => async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: DELETE_DOCUMENTO_PRE_CONTA,
        payload: id,
      });
      await deleteDocumentoPreConta(id);
      return false;
    } catch (err) {
      console.log(err);
      dispatch({
        type: SET_STATE,
        payload: state,
      });
      toast.error("Erro ao deletar documento");
    }
  };

export const getDocumentoPreContaAction = (conta_id) => async (dispatch) => {
  try {
    const res = await getDocumentoPreConta(conta_id);
    dispatch({
      type: GET_DOCUMENTO_PRE_CONTA,
      payload: res.data.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const postDocumentoPrecontaAction =
  (preconta_id, documento, categoria) => async (dispatch) => {
    const documentoObjeto = { ...documento };
    try {
      const res = await postDocumentoPreConta(
        preconta_id,
        documentoObjeto[0].file,
        categoria,
        documentoObjeto[0].file.type,
      );
      dispatch({
        type: POST_DOCUMENTO_PRE_CONTA,
        payload: res.data,
      });
      toast.success("Documento adicionado com sucesso");
      return false;
    } catch (err) {
      console.log(err);
      toast.error("Erro ao adicionar o documento");
    }
  };

export const postContaPJAction = (contaPJ) => async (dispatch) => {
  try {
    const res = await postContaPJ(contaPJ);
    dispatch({
      type: POST_CONTA_PJ,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro");
      return err;
    }
  }
};

export const postAcessarWebAction = () => async (dispatch) => {
  try {
    const res = await postAcessoWeb();
    dispatch({
      type: POST_ACESSAR_WEB,
      payload: res.data,
    });

    return res.data.id;
  } catch (err) {
    console.log(err);

    toast.error("Erro");
  }
};

export const getAcessoWebAction = (id) => async (dispatch) => {
  try {
    const res = await getAcessoWeb(id);
    dispatch({
      type: GET_ACESSO_WEB,
      payload: res.data.data,
    });
    return true;
  } catch (err) {
    console.log(err);
  }
};

export const getPagamentoPixAction =
  (token, page, id, day, order, mostrar, tipo, conta_id) =>
  async (dispatch) => {
    try {
      const res = await getPagamentoPix(
        token,
        page,
        id,
        day,
        order,
        mostrar,
        tipo,
        conta_id,
      );
      dispatch({
        type: GET_PAGAMENTO_PIX,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const getConsultaChavePixAction = (token, chave) => async (dispatch) => {
  try {
    const res = await getConsultaChavePix(token, chave);
    dispatch({
      type: GET_CONSULTA_CHAVE,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
  }
};

export const postPagamentoPixAction =
  (
    token,
    tipo_cashout,
    tipo,
    chave_recebedor,
    valor,
    favorito,
    descricao,
    dataToken,
    pagador,
    ExternalIdentifier,
    emv,
  ) =>
  async (dispatch) => {
    try {
      const res = await postPagamentoPix(
        token,
        tipo_cashout,
        tipo,
        chave_recebedor,
        valor,
        favorito,
        descricao,
        dataToken,
        pagador,
        ExternalIdentifier,
        emv,
      );
      dispatch({
        type: POST_PAGAMENTO_PIX,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
        return err.response.data.errors;
      }
      if (err.response && err.response.status === 400) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postGerarQrCodeAction =
  (token, mensagem, valor, tipo_cashin, expiracao_data, pagador) =>
  async (dispatch) => {
    try {
      const res = await postGerarQrCode(
        token,
        mensagem,
        valor,
        tipo_cashin,
        expiracao_data,
        pagador,
      );
      dispatch({
        type: POST_GERAR_QRCODE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
        return err.response.data.errors;
      } else {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }

        return err;
      }
    }
  };

export const clearQrCodeCobrar = () => (dispatch) => {
  dispatch({
    type: CLEAR_QRCODE_COBRAR,
  });
};

export const postLerQrCodeAction = (token, codigo) => async (dispatch) => {
  try {
    const res = await postLerQrCode(token, codigo);
    dispatch({
      type: POST_LER_QRCODE,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro");
      return true;
    }
  }
};

export const postCriarChaveAction = (token, criarChave) => async (dispatch) => {
  try {
    const res = await postCriarChave(token, criarChave);
    dispatch({
      type: POST_CRIAR_CHAVE,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    }
    if (err.response && err.response.status === 400) {
      return err.response.data.errors;
    } else {
      toast.error(err.response.data.message);
      return err;
    }
  }
};
export const delChaveAction = (token, chave_id) => async (dispatch) => {
  try {
    const res = await delChave(token, chave_id);
    dispatch({
      type: DEL_CHAVE,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      toast.error(err.response.data.message);
      return err.response.data.errors;
    } else {
      toast.error(err.response.data.message);
      return err;
    }
  }
};

export const postConfirmarPropriedadeAction =
  (token, chave_id, codigo) => async (dispatch) => {
    try {
      const res = await postConfirmarPropriedade(token, chave_id, codigo);
      dispatch({
        type: POST_CONFIRMAR_PROPRIEDADE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }

        return err;
      }
    }
  };

export const getReenviarCodigoAction =
  (token, chave_id) => async (dispatch) => {
    try {
      const res = await getReenviarCodigo(token, chave_id);
      dispatch({
        type: GET_REENVIAR_CODIGO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      if (err.response.data) {
        toast.error(err.response.data.message);
      }

      console.log(err);
    }
  };

export const deleteUserRepresentanteAction =
  (token, id) => async (dispatch) => {
    try {
      const res = await deleteUserRepresentante(token, id);
      dispatch({
        type: DEL_USER_REPRESENTANTE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro ao deletar representante");
        return err;
      }
    }
  };

export const postUserRepresentanteAction =
  (token, representante) => async (dispatch) => {
    try {
      const res = await postUserRepresentante(token, representante);
      dispatch({
        type: POST_USER_REPRESENTANTE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error(err.response.data.message);
        return err;
      }
    }
  };

export const putUserOperadorAction =
  (token, id, nome, permissao) => async (dispatch) => {
    try {
      const res = await putUserOperador(token, id, nome, permissao);
      dispatch({
        type: PUT_OPERADOR,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        if (err.response?.data?.message) toast.error(err.response.data.message);
      }
      return err;
    }
  };

export const getPagamentoPixAprovarAction =
  (token, page) => async (dispatch) => {
    try {
      const res = await getPagamentoPixAprovar(token, page);
      dispatch({
        type: GET_PAGAMENTO_PIX_APROVAR,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getPagamentoAprovarAction = (token, page) => async (dispatch) => {
  try {
    const res = await getPagamentoAprovar(token, page);
    dispatch({
      type: GET_PAGAMENTO_APROVAR,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro");
      return err;
    }
  }
};
export const getPagamentoTEDAprovarAction =
  (token, page) => async (dispatch) => {
    try {
      const res = await getPagamentoTEDAprovar(token, page);
      dispatch({
        type: GET_PAGAMENTO_TED_APROVAR,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };
export const getPagamentoTransferenciaAprovarAction =
  (token, page) => async (dispatch) => {
    try {
      const res = await getPagamentoTransferenciaAprovar(token, page);
      dispatch({
        type: GET_PAGAMENTO_TRANSFERENCIA_APROVAR,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getPagamentoWalletAprovarAction =
  (token, page) => async (dispatch) => {
    try {
      const res = await getPagamentoWalletAprovar(token, page);
      dispatch({
        type: GET_PAGAMENTO_WALLET_APROVAR,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postPagamentoPixAprovarAction =
  (token, aprovar, todos_registros, registros, dataToken) =>
  async (dispatch) => {
    try {
      const res = await postPagamentoPixAprovar(
        token,
        aprovar,
        todos_registros,
        registros,
        dataToken,
      );
      dispatch({
        type: POST_PAGAMENTO_PIX_APROVAR,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
        return err.response.data.errors;
      }
      if (err.response && err.response.status === 400) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const deletePagamentoPixAprovarAction =
  (token, id) => async (dispatch) => {
    try {
      const res = await deletePagamentoPixAprovar(token, id);
      dispatch({
        type: DELETE_PAGAMENTO_PIX_APROVAR,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
        return err.response.data.errors;
      }
      if (err.response && err.response.status === 400) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postPagamentoAprovarAction =
  (token, aprovar, todos_registros, registros, dataToken) =>
  async (dispatch) => {
    try {
      const res = await postPagamentoAprovar(
        token,
        aprovar,
        todos_registros,
        registros,
        dataToken,
      );
      dispatch({
        type: POST_PAGAMENTO_APROVAR,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
        return err.response.data.errors;
      }
      if (err.response && err.response.status === 400) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postPagamentoTEDAprovarAction =
  (token, aprovar, todos_registros, registros, dataToken) =>
  async (dispatch) => {
    try {
      const res = await postPagamentoTEDAprovar(
        token,
        aprovar,
        todos_registros,
        registros,
        dataToken,
      );
      dispatch({
        type: POST_PAGAMENTO_TED_APROVAR,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
        return err.response.data.errors;
      }
      if (err.response && err.response.status === 400) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postPagamentoTransferenciaAprovarAction =
  (token, aprovar, todos_registros, registros, dataToken) =>
  async (dispatch) => {
    try {
      const res = await postPagamentoTransferenciaAprovar(
        token,
        aprovar,
        todos_registros,
        registros,
        dataToken,
      );
      dispatch({
        type: POST_PAGAMENTO_TRANSFERENCIA_APROVAR,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
        return err.response.data.errors;
      }
      if (err.response && err.response.status === 400) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
      } else {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }

        return err;
      }
    }
  };

export const postPagamentoWalletAprovarAction =
  (token, aprovar, todos_registros, registros, dataToken) =>
  async (dispatch) => {
    try {
      const res = await postPagamentoWalletAprovar(
        token,
        aprovar,
        todos_registros,
        registros,
        dataToken,
      );
      dispatch({
        type: POST_PAGAMENTO_WALLET_APROVAR,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
        return err.response.data.errors;
      }
      if (err.response && err.response.status === 400) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getFuncionarioAction =
  (token, grupo_id = "", page = "", like = "", order = "", mostrar = "") =>
  async (dispatch) => {
    try {
      const res = await getFuncionario(
        token,
        grupo_id,
        page,
        like,
        order,
        mostrar,
      );
      dispatch({
        type: GET_FUNCIONARIO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };
export const getFuncionarioGrupoAction =
  (token, page = null, like = "") =>
  async (dispatch) => {
    try {
      const res = await getFuncionarioGrupo(token, page, like);
      dispatch({
        type: GET_FUNCIONARIO_GRUPO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postFuncionarioAction =
  (token, conta_funcionario_id, grupo_id) => async (dispatch) => {
    try {
      const res = await postFuncionario(token, conta_funcionario_id, grupo_id);
      dispatch({
        type: POST_FUNCIONARIO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postFuncionarioGrupoAction =
  (token, nome, descricao) => async (dispatch) => {
    try {
      const res = await postFuncionarioGrupo(token, nome, descricao);
      dispatch({
        type: POST_FUNCIONARIO_GRUPO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const putUpdateFuncionarioAction =
  (token, grupo_id, id) => async (dispatch) => {
    try {
      const res = await putUpdateFuncionario(token, grupo_id, id);
      dispatch({
        type: PUT_FUNCIONARIO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };
export const putUpdateFuncionarioGrupoAction =
  (token, nome, descricao, id) => async (dispatch) => {
    try {
      const res = await putUpdateFuncionarioGrupo(token, nome, descricao, id);
      dispatch({
        type: PUT_FUNCIONARIO_GRUPO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const deleteFuncionarioAction = (token, id) => async (dispatch) => {
  try {
    const res = await deleteFuncionario(token, id);
    dispatch({
      type: DEL_FUNCIONARIO,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro ao deletar representante");
      return err;
    }
  }
};

export const deleteFuncionarioGrupoAction = (token, id) => async (dispatch) => {
  try {
    const res = await deleteFuncionarioGrupo(token, id);
    dispatch({
      type: DEL_FUNCIONARIO_GRUPO,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro ao deletar representante");
      return err;
    }
  }
};

export const getFolhaDePagamentoAction =
  (token, page = null, like = "") =>
  async (dispatch) => {
    try {
      const res = await getFolhaDePagamento(token, page, like);
      dispatch({
        type: GET_FOLHA_DE_PAGAMENTO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getFolhaDePagamentoBeneAction =
  (token, page = null, like = "") =>
  async (dispatch) => {
    try {
      const res = await getFolhaDePagamentoBene(token, page, like);
      dispatch({
        type: GET_FOLHA_DE_PAGAMENTO_BENE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getFolhaDePagamentoConcAction =
  (token, page = 1, filters = "") =>
  async (dispatch) => {
    try {
      const res = await getFolhaDePagamentoConc(token, page, filters);
      dispatch({
        type: GET_FOLHA_DE_PAGAMENTO_CONC,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getFolhaDePagamentoVoucherAction =
  (token, page = 1, filters = "") =>
  async (dispatch) => {
    try {
      const res = await getFolhaDePagamentoVoucher(token, page, filters);
      dispatch({
        type: GET_FOLHA_DE_PAGAMENTO_VOUCHER,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postFolhaPagamentoAprovarAction =
  (token, aprovar, todos_registros, registros, dataToken) =>
  async (dispatch) => {
    try {
      const res = await postFolhaPagamentoAprovar(
        token,
        aprovar,
        todos_registros,
        registros,
        dataToken,
      );
      dispatch({
        type: POST_FOLHA_DE_PAGAMENTO_APROVAR,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postFolhaPagamentoAprovarConcAction =
  (token, aprovar, todos_registros, registros, dataToken) =>
  async (dispatch) => {
    try {
      const res = await postFolhaPagamentoAprovarConc(
        token,
        aprovar,
        todos_registros,
        registros,
        dataToken,
      );
      dispatch({
        type: POST_FOLHA_DE_PAGAMENTO_APROVAR_CONC,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postFolhaPagamentoAprovarBeneAction =
  (token, aprovar, todos_registros, registros, dataToken) =>
  async (dispatch) => {
    try {
      const res = await postFolhaPagamentoAprovarBene(
        token,
        aprovar,
        todos_registros,
        registros,
        dataToken,
      );
      dispatch({
        type: POST_FOLHA_DE_PAGAMENTO_APROVAR_BENE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postFolhaPagamentoAprovarVoucherAction =
  (token, aprovar, todos_registros, registros, dataToken) =>
  async (dispatch) => {
    try {
      const res = await postFolhaPagamentoAprovarVoucher(
        token,
        aprovar,
        todos_registros,
        registros,
        dataToken,
      );
      dispatch({
        type: POST_FOLHA_DE_PAGAMENTO_APROVAR_VOUCHER,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getFolhaDePagamentoShowAction =
  (token, id) => async (dispatch) => {
    try {
      const res = await getFolhaDePagamentoShow(token, id);
      dispatch({
        type: GET_FOLHA_DE_PAGAMENTO_SHOW,
        payload: res.data,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getFolhaDePagamentoAprovarAction =
  (token, page = null, like = "") =>
  async (dispatch) => {
    try {
      const res = await getFolhaDePagamentoAprovar(token, page, like);
      dispatch({
        type: GET_FOLHA_DE_PAGAMENTO_APROVAR,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getFolhaDePagamentoAprovarConcAction =
  (token, page = 1, filters = "") =>
  async (dispatch) => {
    try {
      const res = await getFolhaDePagamentoAprovarConc(token, page, filters);
      dispatch({
        type: GET_FOLHA_DE_PAGAMENTO_APROVAR_CONC,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(JSON.stringify(err));
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getFolhaDePagamentoAprovarBeneAction =
  (token, page = null, like = "") =>
  async (dispatch) => {
    try {
      const res = await getFolhaDePagamentoAprovarBene(token, page, like);
      dispatch({
        type: GET_FOLHA_DE_PAGAMENTO_APROVAR_BENE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getFolhaDePagamentoAprovarVoucherAction =
  (token, page = null, like = "") =>
  async (dispatch) => {
    try {
      const res = await getFolhaDePagamentoAprovarVoucher(token, page, like);
      dispatch({
        type: GET_FOLHA_DE_PAGAMENTO_APROVAR_VOUCHER,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postFolhaPagamentoAction =
  (token, data_pagamento, descricao) => async (dispatch) => {
    try {
      const res = await postFolhaPagamento(token, data_pagamento, descricao);
      dispatch({
        type: POST_FOLHA_PAGAMENTO,
        payload: res.data,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postFolhaPagamentoFuncionarioMultiAction =
  (token, funcionarios, folha_pagamento_id) => async (dispatch) => {
    try {
      const res = await postFolhaPagamentoFuncionarioMulti(
        token,
        funcionarios,
        folha_pagamento_id,
      );
      dispatch({
        type: POST_FOLHA_PAGAMENTO_FUNCIONARIO_MULTI,
        payload: res.data,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const setAutorizarPagamentoModal = (open) => (dispatch) => {
  dispatch({
    type: SET_AUTORIZAR_MODAL,
    payload: open,
  });
};
export const setAutorizarTodos = (todos) => (dispatch) => {
  dispatch({
    type: SET_AUTORIZAR_TODOS,
    payload: todos,
  });
};

export const setPreContaJuridicaId = (id) => (dispatch) => {
  dispatch({
    type: SET_PRE_CONTA_JURIDICA_ID,
    payload: id,
  });
};

export const deleteFolhaDePagamentoFuncionarioAction =
  (token, id) => async (dispatch) => {
    try {
      const res = await deleteFolhaDePagamentoFuncionario(token, id);
      dispatch({
        type: DEL_FOLHA_DE_PAGAMENTO_FUNCIONARIO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro ao remover funcionario");
        return err;
      }
    }
  };

export const getFolhaDePagamentoFuncionarioAction =
  (token, page = null, like = "") =>
  async (dispatch) => {
    try {
      const res = await getFolhaDePagamentoFuncionario(token, page, like);
      dispatch({
        type: GET_FOLHA_DE_PAGAMENTO_FUNCIONARIO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const setHeaderLike = (like) => (dispatch) => {
  dispatch({
    type: SET_HEADER_LIKE,
    payload: like,
  });
};

export const setCadastrarLoteModal = (open) => (dispatch) => {
  dispatch({
    type: SET_CADASTRAR_LOTE_MODAL,
    payload: open,
  });
};

export const setRedirecionarTransferencia = (redirect) => (dispatch) => {
  dispatch({
    type: SET_REDIRECIONAR_TRANSFERENCIA,
    payload: redirect,
  });
};
export const setRedirecionarValorTransferencia = (valor) => (dispatch) => {
  dispatch({
    type: SET_REDIRECIONAR_VALOR_TRANSFERENCIA,
    payload: valor,
  });
};
export const setRedirecionarValorRetirada = (valor) => (dispatch) => {
  dispatch({
    type: SET_REDIRECIONAR_VALOR_RETIRADA,
    payload: valor,
  });
};

export const postFuncionarioLoteAction =
  (token, arquivo) => async (dispatch) => {
    const documentoObjeto = { ...arquivo };
    try {
      const res = await postFuncionarioLote(token, documentoObjeto[0].file);
      dispatch({
        type: POST_FUNCIONARIO_LOTE,
        payload: res.data,
      });
      toast.success("Lote adicionado com sucesso");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao adicionar lote");
      return false;
    }
  };

export const getListaBannerAction =
  (token, page = null, like = "", order = "", mostrar = null) =>
  async (dispatch) => {
    try {
      const res = await getListaBanner(token, page, like, order, mostrar);
      dispatch({
        type: GET_LISTA_BANNER,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const postBannerAction = (token, banner, tipo) => async (dispatch) => {
  const documentoObjeto = { ...banner };
  try {
    const res = await postBanner(token, documentoObjeto[0].file, tipo);
    dispatch({
      type: POST_BANNER,
      payload: res.data,
    });
    toast.success("Banner adicionado com sucesso");
  } catch (err) {
    console.log(err);
    toast.error("Erro ao adicionar banner");
    return false;
  }
};

export const delBannerAction = (token, id) => async (dispatch, getState) => {
  const state = getState();
  try {
    dispatch({
      type: DELETE_BANNER,
      payload: id,
    });
    await deleteBanner(token, id);
  } catch (err) {
    console.log(err);
    dispatch({
      type: SET_STATE,
      payload: state,
    });
    toast.error("Erro ao deletar banner");
  }
};

export const getArquivoLoteAction =
  (token, page = null) =>
  async (dispatch) => {
    try {
      const res = await getArquivoLote(token, page);
      dispatch({
        type: GET_ARQUIVO_LOTE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getArquivoLoteConcAction =
  (token, page = null) =>
  async (dispatch) => {
    try {
      const res = await getArquivoLoteConc(token, page);
      dispatch({
        type: GET_ARQUIVO_LOTE_CONC,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getArquivoLoteBeneAction =
  (token, page = null) =>
  async (dispatch) => {
    try {
      const res = await getArquivoLoteBene(token, page);
      dispatch({
        type: GET_ARQUIVO_LOTE_BENE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getArquivoLoteVoucherAction =
  (token, page = null) =>
  async (dispatch) => {
    try {
      const res = await getArquivoLoteVoucher(token, page);
      dispatch({
        type: GET_ARQUIVO_LOTE_VOUCHER,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getArquivoLoteFuncionarioAction =
  (token, page = null) =>
  async (dispatch) => {
    try {
      const res = await getArquivoLoteFuncionario(token, page);
      dispatch({
        type: GET_ARQUIVO_LOTE_FUNCIONARIO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getArquivoLoteComprovanteAction =
  (token, page = null) =>
  async (dispatch) => {
    try {
      const res = await getArquivoLoteComprovante(token, page);
      dispatch({
        type: GET_ARQUIVO_LOTE_COMPROVANTE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postFolhaDePagamentoLoteAction =
  (token, arquivo, descricao, data_pagamento) => async (dispatch) => {
    const documentoObjeto = { ...arquivo };
    try {
      const res = await postFolhaDePagamentoLote(
        token,
        documentoObjeto[0].file,
        descricao,
        data_pagamento,
      );
      dispatch({
        type: POST_FOLHA_DE_PAGAMENTO_LOTE,
        payload: res.data,
      });
      toast.success("Lote adicionado com sucesso");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao adicionar lote");
      return false;
    }
  };

export const postFolhaDePagamentoLoteConcAction =
  (token, arquivo, descricao, data_pagamento) => async (dispatch) => {
    const documentoObjeto = { ...arquivo };
    try {
      const res = await postFolhaDePagamentoLoteConc(
        token,
        documentoObjeto[0].file,
        descricao,
        data_pagamento,
      );
      dispatch({
        type: POST_FOLHA_DE_PAGAMENTO_LOTE_CONC,
        payload: res.data,
      });
      toast.success("Lote adicionado com sucesso");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao adicionar lote");
      return false;
    }
  };

export const postFolhaDePagamentoLoteBeneAction =
  (token, arquivo, descricao, data_pagamento) => async (dispatch) => {
    const documentoObjeto = { ...arquivo };
    try {
      const res = await postFolhaDePagamentoLoteBene(
        token,
        documentoObjeto[0].file,
        descricao,
        data_pagamento,
      );
      dispatch({
        type: POST_FOLHA_DE_PAGAMENTO_LOTE_BENE,
        payload: res.data,
      });
      toast.success("Lote adicionado com sucesso");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao adicionar lote");
      return false;
    }
  };

export const postFolhaDePagamentoLoteVoucherAction =
  (token, arquivo, descricao, data_pagamento) => async (dispatch) => {
    const documentoObjeto = { ...arquivo };
    try {
      const res = await postFolhaDePagamentoLoteVoucher(
        token,
        documentoObjeto[0].file,
        descricao,
        data_pagamento,
      );
      dispatch({
        type: POST_FOLHA_DE_PAGAMENTO_LOTE_VOUCHER,
        payload: res.data,
      });
      toast.success("Lote adicionado com sucesso");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao adicionar lote");
      return false;
    }
  };

export const postReenviarFolhaDePagamentoLoteAction =
  (token, arquivo_id) => async (dispatch) => {
    try {
      const res = await postReenviarFolhaDePagamentoLote(token, arquivo_id);
      dispatch({
        type: POST_REENVIAR_FOLHA_DE_PAGAMENTO_LOTE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getTransferenciaExtratoAction =
  (token, document_number) => async (dispatch) => {
    try {
      const res = await getTransferenciaExtrato(token, document_number);
      dispatch({
        type: GET_TRANSFERENCIA_EXTRATO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getTedExtratoAction =
  (token, document_number) => async (dispatch) => {
    try {
      const res = await getTedExtrato(token, document_number);
      dispatch({
        type: GET_TED_EXTRATO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getPagamentoContaExtratoAction =
  (token, document_number) => async (dispatch) => {
    try {
      const res = await getPagamentoContaExtrato(token, document_number);
      dispatch({
        type: GET_PAGAMENTO_CONTA_EXTRATO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getPagamentoPixExtratoAction =
  (token, document_number) => async (dispatch) => {
    try {
      const res = await getPagamentoPixExtrato(token, document_number);
      dispatch({
        type: GET_PAGAMENTO_PIX_EXTRATO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postReivindicarPropriedadeAction =
  (token, chave_id) => async (dispatch) => {
    try {
      const res = await postReivindicarPropriedade(token, chave_id);
      dispatch({
        type: POST_REIVINDICAR_PROPRIEDADE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
        return err;
      }
    }
  };

export const postReivindicaçãoPortabilidadeAction =
  (token, confirmar, chave_id) => async (dispatch) => {
    try {
      const res = await postReivindicaçãoPortabilidade(
        token,
        confirmar,
        chave_id,
      );
      dispatch({
        type: POST_REIVINDICAR_PORTABILIDADE,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
        return err;
      }
    }
  };

export const getCartaoHistoricoTransacaoAction =
  (token, page = null, like = "", order = "", mostrar = null) =>
  async (dispatch) => {
    try {
      const res = await getCartaoHistoricoTransacao(
        token,
        page,
        like,
        order,
        mostrar,
      );
      dispatch({
        type: GET_CARTAO_HISTORICO_TRANSACAO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postEnviarComprovanteFolhaAction =
  (token, id) => async (dispatch) => {
    try {
      const res = await postEnviarComprovanteFolha(token, id);
      dispatch({
        type: POST_ENVIAR_COMPROVANTE_FOLHA,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const getFavoritosPixAction = (token) => async (dispatch) => {
  try {
    const res = await getFavoritosPix(token);
    dispatch({
      type: GET_FAVORITOS_PIX,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro");
      return err;
    }
  }
};

export const delFavoritoPixAction =
  (token, id) => async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: DELETE_FAVORITO_PIX,
        payload: id,
      });
      await deleteFavoritoPix(token, id);
      return false;
    } catch (err) {
      console.log(err);
      dispatch({
        type: SET_STATE,
        payload: state,
      });
      toast.error("Erro ao deletar favorito");
    }
  };
export const getFavoritosTEDAction = (token) => async (dispatch) => {
  try {
    const res = await getFavoritosTED(token);
    dispatch({
      type: GET_FAVORITOS_TED,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro");
      return err;
    }
  }
};

export const delFavoritoTEDAction =
  (token, id) => async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: DELETE_FAVORITO_TED,
        payload: id,
      });
      await deleteFavoritoTED(token, id);
      return false;
    } catch (err) {
      console.log(err);
      dispatch({
        type: SET_STATE,
        payload: state,
      });
      toast.error("Erro ao deletar banner");
    }
  };
export const getFavoritosP2PAction = (token) => async (dispatch) => {
  try {
    const res = await getFavoritosP2P(token);
    dispatch({
      type: GET_FAVORITOS_P2P,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro");
      return err;
    }
  }
};

export const delFavoritoP2PAction =
  (token, id) => async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: DELETE_FAVORITO_P2P,
        payload: id,
      });
      await deleteFavoritoP2P(token, id);
      return false;
    } catch (err) {
      console.log(err);
      dispatch({
        type: SET_STATE,
        payload: state,
      });
      toast.error("Erro ao deletar banner");
    }
  };
export const getFavoritosWalletAction = (token) => async (dispatch) => {
  try {
    const res = await getFavoritosWallet(token);
    dispatch({
      type: GET_FAVORITOS_WALLET,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro");
      return err;
    }
  }
};

export const delFavoritoWalletAction =
  (token, id) => async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: DELETE_FAVORITO_WALLET,
        payload: id,
      });
      await deleteFavoritoWallet(token, id);
      return false;
    } catch (err) {
      console.log(err);
      dispatch({
        type: SET_STATE,
        payload: state,
      });
      toast.error("Erro ao deletar banner");
    }
  };

export const postPagamentoBoletoAction =
  (
    token,
    juros,
    desconto,
    codigoDeBarras,
    valor,
    descricao,
    vencimento,
    tokenApp,
  ) =>
  async (dispatch) => {
    try {
      const res = await postPagarBoleto(
        token,
        juros,
        desconto,
        codigoDeBarras,
        valor,
        descricao,
        vencimento,
        tokenApp,
      );
      dispatch({
        type: POST_PAGAMENTO_BOLETO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
        return err.response.data.errors;
      }
      if (err.response && err.response.status === 400) {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const postLinkPagamentos =
  (token, linkPagamentos) => async (dispatch) => {
    try {
      const res = await postLinkPagamento(token, linkPagamentos);
      dispatch({
        type: POST_LINK_PAGAMENTOS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro no cadastro");
        return err;
      }
    }
  };

export const loadPagadorId = (token, id) => async (dispatch) => {
  try {
    const res = await getPagadorId(token, id);
    dispatch({
      type: LOAD_PAGADOR_ID,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
  }
};

export const loadLinkPagamentoId = (token, id) => async (dispatch) => {
  try {
    const res = await getLinkPagamentoId(token, id);
    dispatch({
      type: LOAD_LINK_PAGAMENTOS_ID,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const EditPagador = (token, pagador, id) => async (dispatch) => {
  try {
    const res = await putPagador(token, pagador, id);
    dispatch({
      type: PUT_PAGADOR,
      payload: res.data,
    });
    return null;
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro no cadastro");
      return err;
    }
  }
};

export const postPagadores = (token, pagador) => async (dispatch) => {
  try {
    const res = await postPagador(token, pagador);
    dispatch({
      type: POST_PAGADOR,
      payload: res.data,
    });
    return null;
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro no cadastro");
      return err;
    }
  }
};

export const postCobrancaCartaoAction =
  (token, cobrancaCartao) => async (dispatch) => {
    try {
      const res = await postCobrancaCartao(token, cobrancaCartao);
      dispatch({
        type: POST_COBRANCA_CARTAO,
        payload: res.data,
      });
    } catch (err) {
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        return err;
      }
    }
  };

export const updateAssinaturaAction =
  (token, id, plano) => async (dispatch) => {
    try {
      const res = await putAssinaturas(token, id, plano);
      dispatch({
        type: PUT_ASSINATURA,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro no cadastro");
        return null;
      }
    }
  };

export const delAssinatura = (token, id) => async (dispatch, getState) => {
  const state = getState();
  try {
    dispatch({
      type: DEL_ASSINATURA,
      payload: id,
    });
    await deleteAssinatura(token, id);
    toast.success("Assinatura excluída com sucesso");
  } catch (err) {
    console.log(err);
    dispatch({
      type: SET_STATE,
      payload: state,
    });
    toast.error("Erro ao excluir a assinatura");
  }
};

export const loadPlanosFilters =
  (token, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getPlanosFilters(token, page, like, order, mostrar);
      dispatch({
        type: LOAD_PLANOS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const delPlano = (token, id) => async (dispatch, getState) => {
  const state = getState();
  try {
    dispatch({
      type: DEL_PLANO,
      payload: id,
    });
    await deletePlano(token, id);
    return false;
  } catch (err) {
    console.log(err);
    dispatch({
      type: SET_STATE,
      payload: state,
    });
    toast.error("Erro ao excluir o plano");
  }
};

export const loadPlanoId = (token, id) => async (dispatch) => {
  try {
    const res = await getPlanoId(token, id);
    dispatch({
      type: LOAD_PLANO_ID,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const postPlanoAction = (token, plano) => async (dispatch) => {
  try {
    const res = await postPlano(token, plano);
    dispatch({
      type: POST_PLANO,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      console.log(err);
      toast.error("erro");
      return null;
    }
  }
};

export const updatePlano = (token, id, plano) => async (dispatch) => {
  try {
    const res = await putPlano(token, id, plano);
    dispatch({
      type: PUT_PLANO,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro no cadastro");
      return null;
    }
  }
};

export const postAssinaturaAction = (token, plano) => async (dispatch) => {
  try {
    const res = await postAssinaturas(token, plano);
    dispatch({
      type: POST_ASSINATURA,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      console.log(err);
      toast.error("erro");
      return err;
    }
  }
};

export const getMinhasAssinaturasAction =
  (token, conta_id) => async (dispatch) => {
    try {
      const res = await getMinhasAssinaturas(token, conta_id);
      dispatch({
        type: GET_MINHAS_ASSINATURAS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const getMinhasTaxasAction = (token, conta_id) => async (dispatch) => {
  try {
    const res = await getMinhasTaxas(token, conta_id);
    dispatch({
      type: GET_MINHAS_TAXAS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const postCartaoAssinaturaAction =
  (token, id, cartao) => async (dispatch) => {
    try {
      const res = await postCartaoAssinatura(token, id, cartao);
      dispatch({
        type: POST_CARTAO_PAGADOR,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro no cadastro");
        return err;
      }
    }
  };

export const postAssinaturaPlanAction =
  (token, conta_id, plano_venda_id) => async (dispatch) => {
    try {
      const res = await postAssinaturaPlan(token, conta_id, plano_venda_id);
      dispatch({
        type: POST_ASSINATURA_PLAN,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        }

        return err.response.data.errors;
      } else {
        toast.error("Erro no cadastro");
        return err;
      }
    }
  };

export const deletePlanoAssinaturaAction =
  (token, plan_id) => async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: DEL_PLANO_ASSINATURA,
        payload: plan_id,
      });
      await deletePlanoAssinatura(token, plan_id);
      return false;
    } catch (err) {
      console.log(err);
      dispatch({
        type: SET_STATE,
        payload: state,
      });
      toast.error("Erro ao excluir plano de assinatura");
    }
  };

export const deletePlanoAssinaturaECAction =
  (token, subscription_id) => async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: DEL_PLANO_ASSINATURA_EC,
        payload: subscription_id,
      });
      await deletePlanoAssinaturaEC(token, subscription_id);
      return false;
    } catch (err) {
      console.log(err);
      dispatch({
        type: SET_STATE,
        payload: state,
      });
      toast.error("Erro ao excluir plano de assinatura EC");
    }
  };

export const getExportacoesSolicitadasAction =
  (
    token = "",
    page = "",
    like = "",
    order = "",
    mostrar = "",
    type = "",
    conta_id = "",
  ) =>
  async (dispatch) => {
    try {
      const res = await getExportacoesSolicitadas(
        token,
        page,
        like,
        order,
        mostrar,
        type,
        conta_id,
      );
      dispatch({
        type: GET_EXPORTACOES_SOLICITADAS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const getExportDownloadAction =
  (token, conta_id, export_id) => async (dispatch) => {
    try {
      const res = await getExportDownload(token, conta_id, export_id);
      dispatch({
        type: GET_EXPORT_DOWNLOAD,
        payload: res.data,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

export const getTerminaisPOSAction =
  (token = "", page = "", conta_id = "", like = "", order = "", mostrar = "") =>
  async (dispatch) => {
    try {
      const res = await getTerminaisPOS(
        token,
        page,
        conta_id,
        like,
        order,
        mostrar,
      );
      dispatch({
        type: GET_TERMINAIS_POS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };
export const getTerminalPOSAction =
  (token = "", posId = "") =>
  async (dispatch) => {
    try {
      const res = await getTerminalPOS(token, posId);
      dispatch({
        type: GET_TERMINAL_POS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const getTerminalPOSTransactionsAction =
  (token = "", posId = "", page = "") =>
  async (dispatch) => {
    try {
      const res = await getTerminalPOSTransactions(token, posId, page);
      dispatch({
        type: GET_TERMINAL_POS_TRANSACTIONS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const deleteTerminalPOSAction =
  (token, posId) => async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: DEL_TERMINAL_POS,
        payload: posId,
      });
      await deleteTerminalPOS(token, posId);
      return false;
    } catch (err) {
      console.log(err);
      dispatch({
        type: SET_STATE,
        payload: state,
      });
      toast.error("Erro ao excluir terminal - POS");
    }
  };

export const putTerminalPOSAction =
  (token, posId, name) => async (dispatch) => {
    try {
      const res = await putTerminalPOS(token, posId, name);
      dispatch({
        type: PUT_TERMINAL_POS,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro ao editar terminal - POS");
        return null;
      }
    }
  };

export const postAceitarTermoAberturaAction =
  (nome, cpf) => async (dispatch) => {
    try {
      const res = await postAceitarTermoAbertura(nome, cpf);
      dispatch({
        type: POST_ACEITAR_TERMO_ABERTURA,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        if (err.response && err.response.data && err.response.data.errors) {
          toast.error(err.response.data.message);

          return err.response.data.errors;
        }
      } else {
        console.log(err);
        toast.error("erro");
        return null;
      }
    }
  };

export const postTerminalPosAction =
  (token, conta_id, tokenPOS) => async (dispatch) => {
    try {
      const res = await postTerminalPos(token, conta_id, tokenPOS);
      dispatch({
        type: POST_TERMINAL_POS,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
        return err;
      }
    }
  };

export const postSocioAction = (socio) => async (dispatch) => {
  try {
    const res = await postSocio(socio);
    dispatch({
      type: POST_SOCIO,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else if (err.response.status === 403) {
      return toast.error(err.response.data.message);
    } else {
      toast.error("Erro");
      return err;
    }
  }
};

export const putSocioAction = (socio, id) => async (dispatch) => {
  try {
    const res = await putSocio(socio, id);
    dispatch({
      type: PUT_SOCIO,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else if (err.response.status === 403) {
      return toast.error(err.response.data.message);
    } else {
      toast.error("Erro ao adicionar sócio");
      return err;
    }
  }
};

export const deleteSocioAction = (id) => async (dispatch) => {
  try {
    const res = await deleteSocio(id);
    dispatch({
      type: DEL_SOCIO,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro ao deletar sócio");
      return err;
    }
  }
};

export const getSocioAction = (id) => async (dispatch) => {
  try {
    const res = await getSocio(id);
    dispatch({
      type: GET_SOCIO,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro carregar lista de sócios");
      return err;
    }
  }
};

export const getPlanosDeVendasAction =
  (token, page, plan_name, order, mostrar) => async (dispatch) => {
    try {
      const res = await getPlanosDeVendas(
        token,
        page,
        plan_name,
        order,
        mostrar,
      );
      dispatch({
        type: GET_PLANO_VENDAS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const postPlanoDeVendasAction = (token, nome) => async (dispatch) => {
  try {
    const res = await postPlanoDeVendas(token, nome);
    dispatch({
      type: POST_PLANO_VENDAS,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else if (err.response.status === 403) {
      return toast.error(err.response.data.message);
    } else {
      if (err.response.data) {
        toast.error(err.response.data.message);
      }
      return err;
    }
  }
};

export const delPlanoVendasAction =
  (token, plan_id) => async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: DEL_PLANO_VENDAS,
        payload: plan_id,
      });
      await delPlanoVendas(token, plan_id);
    } catch (err) {
      console.log(err);
      dispatch({
        type: SET_STATE,
        payload: state,
      });
      toast.error("Erro ao deletar plano de venda");
    }
  };

export const getPlanosDeVendasIDAction = (token, id) => async (dispatch) => {
  try {
    const res = await getPlanosDeVendasID(token, id);
    dispatch({
      type: GET_PLANO_VENDAS_ID,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const postCriarTaxasPadraoAction =
  (token, sales_plan_id) => async (dispatch) => {
    try {
      const res = await postCriarTaxasPadrao(token, sales_plan_id);
      dispatch({
        type: POST_CRIAR_TAXAS_PADRAO,
        payload: res.data,
      });
      return null;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else if (err.response.status === 403) {
        return toast.error(err.response.data.message);
      } else {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
        return err;
      }
    }
  };

export const postAssinaturaPlanoVendasAction =
  (token, conta_id, plano_venda_id) => async (dispatch) => {
    try {
      const res = await postAssinaturaPlanoVendas(
        token,
        conta_id,
        plano_venda_id,
      );
      dispatch({
        type: POST_ASSINATURA_PLANO_VENDAS,
        payload: res.data,
      });
      return null;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else if (err.response.status === 403) {
        return toast.error(err.response.data.message);
      } else {
        if (err.response.data) {
          toast.error(err.response.data.message);
        }
        return err;
      }
    }
  };

export const getSincronizarExtratoContaAction =
  (token, conta_id = "", data_inicial = "", data_final = "") =>
  async (dispatch) => {
    try {
      const res = await getSincronizarExtratoConta(
        token,
        conta_id,
        data_inicial,
        data_final,
      );
      dispatch({
        type: GET_SINCRONIZAR_EXTRATO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro");
        return err;
      }
    }
  };

export const loadExtratoAdquirenciaFilter =
  (
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
  ) =>
  async (dispatch) => {
    try {
      const res = await getExtratoAdquirenciaFilters(
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
      );
      dispatch({
        type: GET_EXTRATO_ADQUIRENCIA,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const getAssinaturaPlanoVendasAction =
  (
    token,
    like = "",
    page = "",
    plano_venda_id = "",
    order = "",
    mostrar = "",
  ) =>
  async (dispatch) => {
    try {
      const res = await getAssinaturaPlanoVendas(
        token,
        like,
        page,
        plano_venda_id,
        order,
        mostrar,
      );
      dispatch({
        type: GET_ASSINATURA_PLANO_VENDAS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const delAssinaturaPlanoVendasAction =
  (token, subscription_id) => async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: DEL_ASSINATURA_PLANO_VENDAS,
        payload: subscription_id,
      });
      await delAssinaturaPlanoVendas(token, subscription_id);
    } catch (err) {
      console.log(err);
      dispatch({
        type: SET_STATE,
        payload: state,
      });
      toast.error("Erro ao deletar assinatura de plano de venda");
    }
  };

export const getMeusEcsAction =
  (token = "", agent_id) =>
  async (dispatch) => {
    try {
      const res = await getMeusEcs(token, agent_id);
      dispatch({
        type: GET_MEUS_ECS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const putFeesAction =
  (token, fee_id, percent_amount, dollar_amount) => async (dispatch) => {
    try {
      const res = await putFees(token, fee_id, percent_amount, dollar_amount);
      dispatch({
        type: PUT_FEES,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        toast.error("Erro ao editar tarifa");
        return null;
      }
    }
  };

export const getGerarTokenAction = (token) => async (dispatch) => {
  try {
    const res = await getGerarToken(token);
    dispatch({
      type: GET_GERAR_TOKEN,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro");
      return err;
    }
  }
};

export const postGerarTokenAction = (token, id) => async (dispatch) => {
  try {
    const res = await postGerarToken(token, id);
    dispatch({
      type: POST_GERAR_TOKEN,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else if (err.response.status === 403) {
      return toast.error(err.response.data.message);
    } else {
      toast.error("Erro");
      return err;
    }
  }
};

/* export const delGerarTokenAction =
	(token, id) => async (dispatch, getState) => {
		const state = getState();
		try {
			dispatch({
				type: DEL_GERAR_TOKEN,
				payload: id,
			});
			await delGerarToken(token, id);
		} catch (err) {
			console.log(err);
			dispatch({
				type: SET_STATE,
				payload: state,
			});
		}
	}; */

export const delGerarTokenAction = (token, id) => async (dispatch) => {
  try {
    const res = await delGerarToken(token, id);
    dispatch({
      type: DEL_GERAR_TOKEN,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      toast.error("Erro ao excluir token");
      return err;
    }
  }
};

export const postArquivoRemessaAction = (token, file) => async (dispatch) => {
  const documentoObjeto = { ...file };
  try {
    const res = await postArquivoRemessa(token, file);
    dispatch({
      type: POST_ARQUIVO_REMESSA,
      payload: res.data,
    });

    toast.success("Arquivo de remessa carregado com sucesso");
    return res.data;
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) toast.error(err.response.data.message);
    else toast.error("Erro ao carregar o arquivo de remessa.");
    return false;
  }
};

export const loadTransacoesFuturas = (token, date) => async (dispatch) => {
  try {
    const res = await getResumoRecebiveisFuturos(token, date);
    dispatch({
      type: LOAD_TRANSACOES_FUTUROS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const loadResumoTransacao = (token, date) => async (dispatch) => {
  try {
    const res = await getResumoCompletoRecebiveis(token, date);
    dispatch({
      type: LOAD_RESUMO_TRANSACAO,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getTransferenciaExtratoActionClear = () => (dispatch) => {
  dispatch({
    type: GET_TRANSFERENCIA_EXTRATO,
    payload: {},
  });
};

export const getTedExtratoActionClear = () => (dispatch) => {
  dispatch({
    type: GET_TED_EXTRATO,
    payload: {},
  });
};

export const getPagamentoContaExtratoActionClear = () => (dispatch) => {
  dispatch({
    type: GET_PAGAMENTO_CONTA_EXTRATO,
    payload: {},
  });
};

export const getPagamentoPixExtratoActionClear = () => (dispatch) => {
  dispatch({
    type: GET_PAGAMENTO_PIX_EXTRATO,
    payload: {},
  });
};

export const getBeneficiosAction = (token, documento) => async (dispatch) => {
  try {
    const res = await getBeneficios(token, documento);
    dispatch({
      type: GET_BENEFICIOS,
      payload: res.data.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const UserTypeAction = (userType) => (dispatch) => {
  dispatch({
    type: USER_TYPE,
    payload: userType,
  });
};
