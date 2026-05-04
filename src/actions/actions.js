import {
  CLEAR_PRE_CONTA_ID,
  CLEAR_TRANSACAO,
  DELETE_ADMIN,
  DELETE_BANNER,
  DELETE_DOCUMENTO,
  DELETE_PERFIL_TAXA,
  DELETE_PERFIL_TAXA_PADRAO,
  DEL_ASSINATURA_PLANO_VENDAS,
  DEL_CONTA_BANCARIA,
  DEL_PAGADOR,
  DEL_PERMISSAO,
  DEL_PLANO_VENDAS,
  DEL_TERMINAL_POS,
  DEL_USER_REPRESENTANTE,
  GET_APROVAR_CONTA,
  GET_ASSINATURA_PLANO_VENDAS,
  GET_BLACKLIST_SELFIE,
  GET_CARTAO_EXPORT,
  GET_CARTOES,
  GET_CHAVES_PIX,
  GET_CONTAS_EXPORT,
  GET_CONTA_PADRAO,
  GET_ENVIAR_DOCUMENTO_IDWALL,
  GET_ENVIAR_FITBANK,
  GET_EXPORTACOES_SOLICITADAS,
  GET_EXPORT_DOWNLOAD,
  GET_EXTRATO_ADQUIRENCIA,
  GET_FINALIZAR_CADASTRO_CONTA,
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
  GET_REAPROVAR_CONTA,
  GET_REENVIAR_DOCUMENTO,
  GET_REENVIAR_DOCUMENTO_SOCIO,
  GET_REENVIAR_TOKEN_USUARIO,
  GET_REPRESENTANTES,
  GET_RESUMO_CONTA_DASHBOARD,
  GET_SINCRONIZAR_CONTA,
  GET_SINCRONIZAR_EXTRATO,
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
  POST_ASSINATURA_PLANO_VENDAS,
  POST_AUTH_ME,
  POST_BANNER,
  POST_BLACK_LIST_SELFIE,
  POST_BLOQUEAR_DEVICE,
  POST_CANCELAR_TRANSACAO,
  POST_CANCEL_CARD,
  POST_CAPTURA,
  POST_CONFIRM_REQUEST_CARD,
  POST_CONTA,
  POST_CONTA_BANCARIA,
  POST_CONTA_FISICA_ZOOP,
  POST_CONTA_JURIDICA_ZOOP,
  POST_CRIAR_REPRESENTANTE,
  POST_CRIAR_SELLER_ZOOP,
  POST_CRIAR_TAXAS_PADRAO,
  POST_DESBLOQUEAR_DEVICE,
  POST_DESBLOQUEAR_PERFIL_TAXA,
  POST_DOCUMENTO,
  POST_EMAIL,
  POST_IMPORTAR_REPRESENTANTE,
  POST_LOGIN,
  POST_NOTIFICACAO,
  POST_PERFIL_TAXA,
  POST_PERFIL_TAXA_PADRAO,
  POST_PERMISSAO,
  POST_PLANO_VENDAS_ZOOP,
  POST_PRIMEIRO_ACESSO,
  POST_RECUPERAR_SENHA,
  POST_RECUSAR_SELLER_ZOOP,
  POST_SET_CONTA_PADRAO,
  POST_SET_PLANO_PADRAO,
  POST_SOLICITAR_RESET,
  POST_SPLIT,
  POST_TERMINAL_POS,
  POST_USER_BLOQUEAR_DESBLOQUEAR,
  POST_USER_REPRESENTANTE,
  POST_VINCULAR_PERFIL_TAXA,
  PUT_FEES,
  PUT_PERFIL_TAXA,
  PUT_PERFIL_TAXA_PADRAO,
  PUT_TERMINAL_POS,
  SET_SESSION_AUTH,
  SET_STATE,
  UPDATE_USER_CONTA,
} from "../constants/actionsStrings";
import {
  delAssinaturaPlanoVendas,
  delPlanoVendas,
  deleteAdmin,
  deleteBanner,
  deleteContaBancaria,
  deleteDocumento,
  deletePagador,
  deletePerfilTaxa,
  deletePerfilTaxaPadrao,
  deletePermissao,
  deleteTerminalPOS,
  deleteUserRepresentante,
  getAprovarConta,
  getAssinaturaPlanoVendas,
  getAssinaturasFilters,
  getBancos,
  getBlacklistSelfie,
  getBoletosFilter,
  getCarneFilters,
  getCartaoExport,
  getCartoes,
  getChavesPix,
  getCobrancasCartaoFilters,
  getContaBancaria,
  getContaId,
  getContaPadrao,
  getContas,
  getContasExport,
  getDetalhesGiftCard,
  getDetalhesRecarga,
  getDocumento,
  getEnviarDocumentoIdWall,
  getEnviarFitbank,
  getExportDownload,
  getExportExtrato,
  getExportHistoricoTransacao,
  getExportHistoricoTransferencia,
  getExportPartnerTransacions,
  getExportacoesSolicitadas,
  getExtratoAdquirenciaFilters,
  getExtratoFilters,
  getFinalizarCadastroConta,
  getFolhaDePagamento,
  getFolhaPagamentoFuncionario,
  getFuncionario,
  getGraficoContaBarDashboard,
  getGraficoContaLineDashboard,
  getHistoricoTransacaoFilters,
  getHistoricoTransferencia,
  getHistoricoTransferenciaFilters,
  getLancamentosFuturos,
  getLinkPagamentosFilter,
  getListaAdministrador,
  getListaBanner,
  getListaDeviceBloqueado,
  getListaPreConta,
  getListarProdutosGiftCard,
  getListarProdutosGiftCardAdmin,
  getListarRecargas,
  getListarRecargasAdmin,
  getLogs,
  getMeusEcs,
  getMinhasAssinaturas,
  getMinhasTaxas,
  getPagadoresFilter,
  getPagamentoBoleto,
  getPagamentoConta,
  getPagamentoContaExtrato,
  getPagamentoPix,
  getPagamentoPixExtrato,
  getPartnerTransacions,
  getPerfilTaxa,
  getPerfilTaxaId,
  getPerfilTaxaPadrao,
  getPerfilTaxaPadraoId,
  getPermissao,
  getPlanosAll,
  getPlanosDeVendas,
  getPlanosDeVendasID,
  getPlanosDeVendasZoop,
  getPlanosDeVendasZoopID,
  getPreContaId,
  getReaprovarConta,
  getReenviarDocumento,
  getReenviarDocumentoSocio,
  getReenviarTokenUsuario,
  getRepresentantes,
  getResumoContaDashboard,
  getSincronizarConta,
  getSincronizarExtratoConta,
  getTedExtrato,
  getTerminaisPOSFilter,
  getTerminalPOS,
  getTerminalPOSTransactions,
  getTransacaoId,
  getTransacaoPix,
  getTransacaoPixId,
  getTransacaoTarifas,
  getTransacaoTed,
  getTransacaoTedId,
  getTransferenciaExtrato,
  getTransferenciaId,
  getTransferenciaP2p,
  getTransferenciaTED,
  getUserData,
  postAssinaturaPlanoVendas,
  postAuthMe,
  postBanner,
  postBlackListSelfie,
  postBloquearDeviceAdm,
  postCancelCard,
  postCancelarTransacao,
  postCapturaCobranca,
  postCobrancaEstornar,
  postConfirmRequestCard,
  postContaBancaria,
  postContaFisicaZoop,
  postContaJuridicaZoop,
  postCriarAdmin,
  postCriarRepresentante,
  postCriarSellerZoop,
  postCriarTaxasPadrao,
  postDesbloquearDeviceAdm,
  postDesvincularPerfilTaxa,
  postDocumentos,
  postDocumentosAdm,
  postFirstAcess,
  postImportarRepresentante,
  postLogin,
  postNotificacao,
  postPerfilTaxa,
  postPerfilTaxaPadrao,
  postPermissao,
  postPlanosDeVendasZoop,
  postRecusarSellerZoop,
  postRefreshAuth,
  postResetPassword,
  postSendReset,
  postSetContaPadrao,
  postSetPlanoPadrao,
  postSplit,
  postTerminalPos,
  postUserBloquearDesbloquear,
  postUserRepresentante,
  postVincularPerfilTaxa,
  putConta,
  putFees,
  putPerfilTaxa,
  putPerfilTaxaPadrao,
  putTerminalPOS,
  putUserConta,
} from "../services/services";

import { toast } from "react-toastify";

export const getContasAction =
  (
    token = "",
    page = "",
    like = "",
    order = "",
    mostrar = "",
    id = "",
    seller = "",
    status = "",
    numero_documento = "",
    tipo = "",
    cnpj = "",
    status_adquirencia = "",
    solicitado_adquirencia = "",
    agent_id = "",
    is_estabelecimento = "",
    is_gestao_concorrencia = "",
    tipo_beneficio_id = "",
    cpf = "",
    created_at = "",
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
          cnpj,
          status_adquirencia,
          solicitado_adquirencia,
          agent_id,
          is_estabelecimento,
          is_gestao_concorrencia,
          tipo_beneficio_id,
          cpf,
          created_at
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

export const getAllContasAction =
  (
    token = "",
    page = "",
    like = "",
    order = "",
    mostrar = "",
    id = "",
    seller = "",
    status = "",
    numero_documento = "",
    tipo = "",
    cnpj = "",
    status_adquirencia = "",
    solicitado_adquirencia = "",
    agent_id = "",
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
          cnpj,
          status_adquirencia,
          solicitado_adquirencia,
          agent_id
        );
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
    if (err?.response?.status === 422) {
      return err?.response?.data?.errors;
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

export const getAprovarContaAction =
  (token, id, sendToken = true) =>
    async (dispatch) => {
      try {
        const res = await getAprovarConta(token, id, sendToken);
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

export const getReaprovarContaAction = (token, id) => async (dispatch) => {
  try {
    const res = await getReaprovarConta(token, id);
    dispatch({
      type: GET_REAPROVAR_CONTA,
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
    cnpj,
    export_type,
    accountTypeFilters,
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
          cnpj,
          export_type,
          accountTypeFilters
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

export const getCartaoExportAction =
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
        const res = await getCartaoExport(
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
          mostrar
        );
        dispatch({
          type: GET_CARTAO_EXPORT,
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
  (token, page, like, order, mostrar, conta_id) => async (dispatch) => {
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
  (token, page, data_liberacao) => async (dispatch) => {
    try {
      const res = await getLancamentosFuturos(token, page, data_liberacao);
      dispatch({
        type: LOAD_LANCAMENTOS_FUTUROS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
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
          data_final
        );
        dispatch({
          type: LOAD_EXTRATO,
          payload: res.data,
        });
      } catch (err) {
        console.log(err);
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
          data_final
        );
        dispatch({
          type: GET_EXTRATO_ADQUIRENCIA,
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
          export_type
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
    terminal_id,
    seller_like,
    holder_name,
    is_physical_sale,
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
          terminal_id,
          seller_like,
          holder_name,
          is_physical_sale
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
    terminal_id,
    seller_like,
    holder_name,
    is_physical_sale,
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
          terminal_id,
          seller_like,
          holder_name,
          is_physical_sale
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

export const loadHistoricoTransferencia = (token, page) => async (dispatch) => {
  try {
    const res = await getHistoricoTransferencia(token, page);
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

export const getListaAdministradorAction =
  (token, page, like, order, mostrar, created_at, filters) =>
  async (dispatch) => {
    try {
      const res = await getListaAdministrador(
        token,
        page,
        like,
        order,
        mostrar,
        created_at,
        filters,
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

      console.log(res.data);
      return false;
    } catch (err) {
      console.log(err);
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

export const postCriarAdminAction =
  (token, email, nome, documento, celular) => async (dispatch) => {
    try {
      const res = await postCriarAdmin(token, email, nome, documento, celular);
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

export const loadPerfilTaxaPadraoAction = (token, like) => async (dispatch) => {
  try {
    const res = await getPerfilTaxaPadrao(token, like);
    dispatch({
      type: LOAD_PERFIL_TAXA_PADRAO,
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

export const loadPerfilTaxaPadraoIdAction = (token, id) => async (dispatch) => {
  try {
    const res = await getPerfilTaxaPadraoId(token, id);
    dispatch({
      type: LOAD_PERFIL_TAXA_PADRAO_ID,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getTransacaoTarifasAction =
  (
    token,
    page = "",
    like = "",
    transacao_id = "",
    conta_perfil_taxa_id = "",
    data_inicial = "",
    data_final = "",
    tipo = "",
    order = "",
    mostrar = "",
  ) =>
    async (dispatch) => {
      try {
        const res = await getTransacaoTarifas(
          token,
          page,
          like,
          transacao_id,
          conta_perfil_taxa_id,
          data_inicial,
          data_final,
          tipo,
          order,
          mostrar
        );
        dispatch({
          type: GET_TRANSACAO_TARIFAS,
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
  ) =>
    async (dispatch) => {
      try {
        const res = await postPerfilTaxa(
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
          cash_out_pagamento_conta
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
export const postPerfilTaxaPadraoAction =
  (
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
  ) =>
    async (dispatch) => {
      try {
        const res = await postPerfilTaxaPadrao(
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
          conta_id
        );
        dispatch({
          type: POST_PERFIL_TAXA_PADRAO,
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
  ) =>
    async (dispatch) => {
      try {
        const res = await putPerfilTaxa(
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
          id
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

export const putPerfilTaxaPadraoAction =
  (
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
  ) =>
    async (dispatch) => {
      try {
        const res = await putPerfilTaxaPadrao(
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
          conta_id
        );
        dispatch({
          type: PUT_PERFIL_TAXA_PADRAO,
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

export const delPerfilTaxaPadrao =
  (token, id) => async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: DELETE_PERFIL_TAXA_PADRAO,
        payload: id,
      });
      await deletePerfilTaxaPadrao(token, id);
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
  (token, user_id, page, like, order, mostrar, created_at) =>
    async (dispatch) => {
      try {
        const res = await getLogs(
          token,
          user_id,
          page,
          like,
          order,
          mostrar,
          created_at
        );
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
          mostrar
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
          mostrar
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
          agency_code
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
          agency_code
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

export const getBlacklistSelfieAction =
  (token, page, like, order, mostrar) => async (dispatch) => {
    try {
      const res = await getBlacklistSelfie(token, page, like, order, mostrar);
      dispatch({
        type: GET_BLACKLIST_SELFIE,
        payload: res.data,
      });
    } catch (err) {
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
        /* toast.error(err.response.data.result.Message); */
        return err;
      }
    }
  };

export const getFolhaDePagamentoAction =
  (token, page = null, conta_id, like) =>
    async (dispatch) => {
      try {
        const res = await getFolhaDePagamento(token, page, conta_id, like);
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

export const getListaBannerAction =
  (token, page, like, order, mostrar, tipo, created_at) => async (dispatch) => {
    try {
      const res = await getListaBanner(
        token,
        page,
        like,
        order,
        mostrar,
        tipo,
        created_at,
      );
      dispatch({
        type: GET_LISTA_BANNER,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const postBannerAction =
  (token, banner, tipo, urlBanner) => async (dispatch) => {
    const documentoObjeto = { ...banner };
    try {
      const res = await postBanner(
        token,
        documentoObjeto[0].file,
        tipo,
        urlBanner,
      );
      dispatch({
        type: POST_BANNER,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 422) {
        toast.error(err.response.data.errors.url);
        return err.response.data.errors;
      } else {
        if (err.response.data.result) {
          toast.error(err.response.data.result.Message);
        }

        return err;
      }
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

export const getFuncionarioAction =
  (
    token,
    grupo_id = "",
    page = "",
    like = "",
    order = "",
    mostrar = "",
    conta_id = "",
  ) =>
    async (dispatch) => {
      try {
        const res = await getFuncionario(
          token,
          grupo_id,
          page,
          like,
          order,
          mostrar,
          conta_id
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

export const getCartoesAction =
  (
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
  ) =>
    async (dispatch) => {
      try {
        const res = await getCartoes(
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
          tipo
        );
        dispatch({
          type: GET_CARTOES,
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

export const postConfirmRequestCardAction = (token, id) => async (dispatch) => {
  try {
    const res = await postConfirmRequestCard(token, id);
    dispatch({
      type: POST_CONFIRM_REQUEST_CARD,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 422) {
      return err.response.data.errors;
    } else {
      if (err.response.data.result) {
        toast.error(err.response.data.result.Message);
      }

      return err;
    }
  }
};

export const postCancelCardAction = (token, id) => async (dispatch) => {
  try {
    const res = await postCancelCard(token, id);
    dispatch({
      type: POST_CANCEL_CARD,
      payload: res.data,
    });
    return false;
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      return err.response.data.errors;
    } else {
      if (err.response.data.result) {
        toast.error(err.response.data.result.Message);
      }
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
      if (res.status === 200 && res.data === "") {
        return true;
      } else {
        return false;
      }
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
      if (res.status === 200 && res.data === "") {
        return true;
      } else {
        return false;
      }
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

      if (res.status === 200 && res.data === "") {
        return true;
      } else {
        return false;
      }
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
  (token, transactionId) => async (dispatch) => {
    try {
      const res = await getPagamentoPixExtrato(token, transactionId);
      dispatch({
        type: GET_PAGAMENTO_PIX_EXTRATO,
        payload: res.data,
      });
      if (res.status === 200 && res.data === "") {
        return true;
      } else {
        return false;
      }
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

export const getFolhaPagamentoFuncionarioAction =
  (token, conta_id, conta_funcionario_id) => async (dispatch) => {
    try {
      const res = await getFolhaPagamentoFuncionario(
        token,
        conta_id,
        conta_funcionario_id,
      );
      dispatch({
        type: GET_FOLHA_PAGAMENTO_FUNCIONARIO,
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

export const getPagamentoPixAction =
  (
    token,
    nome = "",
    documento = "",
    cnpj = "",
    email = "",
    id = "",
    status = "",
    data_inicial = "",
    data_final = "",
    page = "",
  ) =>
    async (dispatch) => {
      try {
        const res = await getPagamentoPix(
          token,
          nome,
          documento,
          cnpj,
          email,
          id,
          status,
          data_inicial,
          data_final,
          page
        );
        dispatch({
          type: GET_PAGAMENTO_PIX,
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
export const getTransferenciaP2pAction =
  (
    token,
    nome = "",
    documento = "",
    cnpj = "",
    email = "",
    id = "",
    status = "",
    data_inicial = "",
    data_final = "",
    page = "",
  ) =>
    async (dispatch) => {
      try {
        const res = await getTransferenciaP2p(
          token,
          nome,
          documento,
          cnpj,
          email,
          id,
          status,
          data_inicial,
          data_final,
          page
        );
        dispatch({
          type: GET_TRANSFERENCIA_P2P,
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

export const getTransferenciaTEDAction =
  (
    token,
    nome = "",
    documento = "",
    cnpj = "",
    email = "",
    id = "",
    status = "",
    data_inicial = "",
    data_final = "",
    page = "",
  ) =>
    async (dispatch) => {
      try {
        const res = await getTransferenciaTED(
          token,
          nome,
          documento,
          cnpj,
          email,
          id,
          status,
          data_inicial,
          data_final,
          page
        );
        dispatch({
          type: GET_TRANSFERENCIA_TED,
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

export const getPagamentoContaAction =
  (
    token,
    nome = "",
    documento = "",
    cnpj = "",
    email = "",
    id = "",
    status = "",
    data_inicial = "",
    data_final = "",
    page = "",
    like = "",
    order = "",
    mostrar = "",
    conta_id = "",
  ) =>
    async (dispatch) => {
      try {
        const res = await getPagamentoConta(
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
          conta_id
        );
        dispatch({
          type: GET_PAGAMENTO_CONTA,
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

export const getSincronizarContaAction =
  (token, conta_id = "") =>
    async (dispatch) => {
      try {
        const res = await getSincronizarConta(token, conta_id);
        dispatch({
          type: GET_SINCRONIZAR_CONTA,
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

export const postRefreshAuthAction = (token) => async () => {
  try {
    const res = await postRefreshAuth(token);
    console.log(res);
    return false;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getReenviarDocumentoAction =
  (token, conta_id = "") =>
    async (dispatch) => {
      try {
        const res = await getReenviarDocumento(token, conta_id);
        dispatch({
          type: GET_REENVIAR_DOCUMENTO,
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

export const getReenviarDocumentoSocioAction =
  (token, socio_id = "") =>
    async (dispatch) => {
      try {
        const res = await getReenviarDocumentoSocio(token, socio_id);
        dispatch({
          type: GET_REENVIAR_DOCUMENTO_SOCIO,
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

export const getPagamentoBoletoAction =
  (
    token,
    nome = "",
    documento = "",
    cnpj = "",
    email = "",
    id = "",
    status = "",
    data_inicial = "",
    data_final = "",
    vencimento_inicial = "",
    vencimento_final = "",
    page = "",
    like = "",
    order = "",
    mostrar = "",
    conta_id = "",
  ) =>
    async (dispatch) => {
      try {
        const res = await getPagamentoBoleto(
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
          conta_id
        );
        dispatch({
          type: GET_PAGAMENTO_BOLETO,
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

export const getEnviarFitbankAction =
  (token, conta_id = "") =>
    async (dispatch) => {
      try {
        const res = await getEnviarFitbank(token, conta_id);
        dispatch({
          type: GET_ENVIAR_FITBANK,
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

export const getSincronizarExtratoContaAction =
  (token, conta_id = "", data_inicial = "", data_final = "") =>
    async (dispatch) => {
      try {
        const res = await getSincronizarExtratoConta(
          token,
          conta_id,
          data_inicial,
          data_final
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

export const postCriarSellerZoopAction =
  (token, conta_id) => async (dispatch) => {
    try {
      const res = await postCriarSellerZoop(token, conta_id);
      dispatch({
        type: POST_CRIAR_SELLER_ZOOP,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        if (err.response.data.result) {
          toast.error(err.response.data.result.Message);
        }
        return err;
      }
    }
  };

export const postRecusarSellerZoopAction =
  (token, seller_id) => async (dispatch) => {
    try {
      const res = await postRecusarSellerZoop(token, seller_id);
      dispatch({
        type: POST_RECUSAR_SELLER_ZOOP,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        if (err.response.data.result) {
          toast.error(err.response.data.result.Message);
        }
        return err;
      }
    }
  };

export const postNotificacaoAction =
  (
    token,
    titulo = "",
    mensagem = "",
    contas = "",
    selectedTab = "",
    sendToALL = false,
    filters = "",
  ) =>
    async (dispatch) => {
      try {
        const res = await postNotificacao(
          token,
          titulo,
          mensagem,
          contas,
          selectedTab,
          sendToALL,
          filters
        );
        dispatch({
          type: POST_NOTIFICACAO,
          payload: res.data,
        });
        return null;
      } catch (err) {
        console.log(err);
        if (err.response.status === 422) {
          return err.response.data.errors;
        } else {
          if (err.response.data.result) {
            toast.error(err.response.data.result.Message);
          }
          return err;
        }
      }
    };

export const getTerminaisPOSFilterAction =
  (token = "", page = "", like = "", conta_id = "") =>
    async (dispatch) => {
      try {
        const res = await getTerminaisPOSFilter(token, page, like, conta_id);
        dispatch({
          type: GET_TERMINAIS_POS,
          payload: res.data,
        });
      } catch (err) {
        console.log(err);
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
      return res.data;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        if (err.response.data.result) {
          toast.error(err.response.data.result.Message);
        }
        return err;
      }
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
          conta_id
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

export const getPlanosDeVendasAction =
  (token, page, plan_name, order, mostrar, agent_id = "") =>
    async (dispatch) => {
      try {
        const res = await getPlanosDeVendas(
          token,
          page,
          plan_name,
          order,
          mostrar,
          agent_id
        );
        dispatch({
          type: GET_PLANO_VENDAS,
          payload: res.data,
        });
      } catch (err) {
        console.log(err);
      }
    };

export const getPlanosDeVendasZoopAction =
  (token, page, plan_name, order, mostrar) => async (dispatch) => {
    try {
      const res = await getPlanosDeVendasZoop(
        token,
        page,
        plan_name,
        order,
        mostrar,
      );
      dispatch({
        type: GET_PLANO_VENDAS_ZOOP,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
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

export const getPlanosDeVendasZoopIDAction =
  (token, id) => async (dispatch) => {
    try {
      const res = await getPlanosDeVendasZoopID(token, id);
      dispatch({
        type: GET_PLANO_VENDAS_ZOOP_ID,
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
          mostrar
        );
        dispatch({
          type: GET_ASSINATURA_PLANO_VENDAS,
          payload: res.data,
        });
      } catch (err) {
        console.log(err);
      }
    };

export const postPlanosDeVendasZoopAction =
  (token, zoop_plan_id) => async (dispatch) => {
    try {
      const res = await postPlanosDeVendasZoop(token, zoop_plan_id);
      dispatch({
        type: POST_PLANO_VENDAS_ZOOP,
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
        if (err.response.data.result) {
          toast.error(err.response.data.result.Message);
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
      return false;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else if (err.response.status === 403) {
        return toast.error(err.response.data.message);
      } else {
        if (err.response.data.result) {
          toast.error(err.response.data.result.Message);
        }
        return err;
      }
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
      return false;
    } catch (err) {
      console.log(err);
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else if (err.response.status === 403) {
        return toast.error(err.response.data.message);
      } else {
        if (err.response.data.result) {
          toast.error(err.response.data.result.Message);
        }
        return err;
      }
    }
  };

export const postSetPlanoPadraoAction =
  (token, sales_plan_id) => async (dispatch) => {
    try {
      const res = await postSetPlanoPadrao(token, sales_plan_id);
      dispatch({
        type: POST_SET_PLANO_PADRAO,
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
        if (err.response.data.result) {
          toast.error(err.response.data.result.Message);
        }
        return err;
      }
    }
  };

export const getContaPadraoAction = (token) => async (dispatch) => {
  try {
    const res = await getContaPadrao(token);
    dispatch({
      type: GET_CONTA_PADRAO,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const postSetContaPadraoAction =
  (token, conta_id) => async (dispatch) => {
    try {
      const res = await postSetContaPadrao(token, conta_id);
      dispatch({
        type: POST_SET_CONTA_PADRAO,
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
        if (err.response.data.result) {
          toast.error(err.response.data.result.Message);
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

export const postCancelarTransacaoAction =
  (token, transactionId, is_full_amount, amount) => async (dispatch) => {
    try {
      const res = await postCancelarTransacao(
        token,
        transactionId,
        is_full_amount,
        amount,
      );
      dispatch({
        type: POST_CANCELAR_TRANSACAO,
        payload: res.data,
      });
      return false;
    } catch (err) {
      console.log(err);
      if (err.response.status === 403 && err.response.data.error.message) {
        toast.error(err.response.data.error.message);
      }
      if (err.response.status === 422) {
        return err.response.data.errors;
      } else {
        if (err.response.data.result) {
          toast.error(err.response.data.result.Message);
        }
        return err;
      }
    }
  };

export const getRepresentantesAction =
  (token, page, like, trashed_agents) => async (dispatch) => {
    try {
      const res = await getRepresentantes(token, page, like, trashed_agents);
      dispatch({
        type: GET_REPRESENTANTES,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const postImportarRepresentanteAction =
  (token, account_id) => async (dispatch) => {
    try {
      const res = await postImportarRepresentante(token, account_id);
      dispatch({
        type: POST_IMPORTAR_REPRESENTANTE,
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
        if (err.response.data.result) {
          toast.error(err.response.data.result.Message);
        }
        return err;
      }
    }
  };

export const postCriarRepresentanteAction =
  (token, agent) => async (dispatch) => {
    try {
      const res = await postCriarRepresentante(token, agent);
      dispatch({
        type: POST_CRIAR_REPRESENTANTE,
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
        if (err.response.data.result) {
          toast.error(err.response.data.result.Message);
        }
        return err;
      }
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

export const postContaFisicaZoopAction =
  (
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
  ) =>
    async (dispatch) => {
      try {
        const res = await postContaFisicaZoop(
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
          taxa_transacao
        );
        dispatch({
          type: POST_CONTA_FISICA_ZOOP,
          payload: res.data,
        });
        return false;
      } catch (err) {
        console.log(err);
        if (err.response.status === 422) {
          return err.response.data.errors;
        } else if (err.response.status === 400) {
          return toast.error(err.response.data.message);
        } else {
          if (err.response.data.result) {
            toast.error(err.response.data.result.Message);
          }
          return err;
        }
      }
    };

export const postContaJuridicaZoopAction =
  (
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
  ) =>
    async (dispatch) => {
      try {
        const res = await postContaJuridicaZoop(
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
          taxa_transacao
        );
        dispatch({
          type: POST_CONTA_JURIDICA_ZOOP,
          payload: res.data,
        });
        return false;
      } catch (err) {
        console.log(err);
        if (err.response.status === 422) {
          return err.response.data.errors;
        } else if (err.response.status === 400) {
          return toast.error(err.response.data.message);
        } else {
          if (err.response.data.result) {
            toast.error(err.response.data.message);
          }
          return err;
        }
      }
    };

export const setSessionAuth = (authData) => (dispatch) => {
  dispatch({
    type: SET_SESSION_AUTH,
    payload: authData,
  });
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
