import { Box, makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import { postAuthMeAction } from "../actions/actions";
import CustomSideBar from "../components/CustomSideBar/CustomSideBar";
import { APP_CONFIG } from "../constants/config";
import useAuth from "../hooks/useAuth";
import usePermission from "../hooks/usePermission";
import px2vw from "../utils/px2vw";

import AntecipacaoSalarialItemPage from "../modules/AntecipacaoSalarial/pages/AntecipacaoSalarialItem";
import AntecipacaoSalarialListPage from "../modules/AntecipacaoSalarial/pages/AntecipacaoSalarialList";
import ProposalAntecipacaoSalarialAccounts from "../modules/AntecipacaoSalarialProposal/pages/ProposalAntecipacaoSalarialAccounts";
import FinancialSupportItemPage from "../modules/FinancialSupport/pages/FinancialSupportItem";
import FinancialSupportListPage from "../modules/FinancialSupport/pages/FinancialSupportList";
import ProposalFinancialSupportAccounts from "../modules/FinancialSupportProposal/pages/ProposalFinancialSupportAccounts";

import AccountStatement from "../pages/AccountStatement/AccountStatement";
import AccountSubscriptions from "../pages/AccountSubscriptions/AccountSubscriptions";
import AntecipacaoSalarial from "../pages/AntecipacaoSalarial";
import ArquivosExportados from "../pages/ArquivosExportados";
import Blacklist from "../pages/Blacklist";
import BlacklistSelfie from "../pages/BlacklistSelfie/";
import BloqueioDeDevice from "../pages/BloqueioDeDevice";
import ChavesPix from "../pages/ChavesPix/ChavesPix";
import CondicoesComerciais from "../pages/CondicoesComerciais";
import ContasAutorizadas from "../pages/ContasAutorizadas";
import CreditCardBillingList from "../pages/CreditCardBillingList/CreditCardBillingList";
import CriarConta from "../pages/CriarConta/CriarConta";
import Dashboard from "../pages/Dashboard/Dashboard";
import DetalhesPreConta from "../pages/DetalhesPreConta/DetalhesPreConta";
import DetalhesTerminalPOS from "../pages/DetalhesTerminalPOS/DetalhesTerminalPOS";
import EditFees from "../pages/EditFees/EditFees";
import EditFeesPadrao from "../pages/EditFeesPadrao/EditFeesPadrao";
import EditarDadosDaConta from "../pages/EditarDadosDaConta/EditarDadosDaConta";
import EditarDadosDaContaAdquirencia from "../pages/EditarDadosDaContaAdquirencia/EditarDadosDaContaAdquirencia";
import EditarDadosDaContaPj from "../pages/EditarDadosDaContaPj/EditarDadosDaContaPj";
import EditarDadosDaContaPjAdquirencia from "../pages/EditarDadosDaContaPjAdquirencia/EditarDadosDaContaPjAdquirencia";
import FinancialSupport from "../pages/FinancialSupport";
import {
  AuditoriaPagamentoEstabelecimento,
  AutorizarPagamentoBeneficiariosEstabelecimento,
  AutorizarPagamentoBeneficiariosVoucher,
  AutorizarPagamentoContratoAluguel,
  GerenciarPagamentoEstabelecimento,
  ListaArquivosDeLote,
  ListaBeneficiarios,
  ListaBeneficiariosCartao,
  ListaBeneficiariosVoucher,
  ListaBeneficios,
  ListaContratoAluguel,
  ListaTransacoesCartao,
  ListaTransacoesVoucher,
  PagamentoBeneficiariosCartao,
  PagamentoBeneficiariosEstabelecimento,
  PagamentoBeneficiariosVoucher,
  PagamentoContratoAluguel,
} from "../pages/GerenciarContasSecretarias";
import AutorizarPagamentoBeneficiariosCartao from "../pages/GerenciarContasSecretarias/AutorizarPagamentoBeneficiariosCartao";
import DetalhamentoCancelarCartao from "../pages/GerenciarContasSecretarias/DetalhamentoCancelarCartao";
import ListaBeneficiariosEstabelecimentoDetalhamento from "../pages/GerenciarContasSecretarias/GerenciarPagamentoEstabelecimento/ListaBeneficiariosEstabelecimentoDetalhamento";
import PagamentoBeneficiariosEstabelecimentoTransacoes from "../pages/GerenciarContasSecretarias/GerenciarPagamentoEstabelecimento/PagamentoBeneficiariosEstabelecimentoTransacoes";
import LiberarBeneficiariosCartao from "../pages/GerenciarContasSecretarias/LiberarBeneficiariosCartao";
import ListaCartaoSegundaVia from "../pages/GerenciarContasSecretarias/ListaCartaoSegundaVia";
import ListaPagamentoBeneficiariosVoucherDetalhes from "../pages/GerenciarContasSecretarias/PagamentoBeneficiariosVoucherDetalhes";
import PagamentoContratoAluguelDescricao from "../pages/GerenciarContasSecretarias/PagamentoContratoAluguelDescricao";
import GerenciarListaDeContas from "../pages/GerenciarListaDeContas/GerenciarListaDeContas";
import GerenciarListaPreContas from "../pages/GerenciarListaPreContas/GerenciarListaPreContas";
import GiftCardDetails from "../pages/GiftCardDetails/GiftCardDetails";
import GiftCardsList from "../pages/GiftCardsList/GiftCardsList";
import GiftCardsListAdmin from "../pages/GiftCardsListAdmin/GiftCardsListAdmin";
import HistoricoNotificacoes from "../pages/HistoricoNotificacoes";
import HistoricoTransacoes from "../pages/HistoricoTransacoes";
import JeittoAdm from "../pages/JeittoAdm/index";
import ListPartner from "../pages/ListPartners/ListPartners";
import ListaDeAdministradores from "../pages/ListaDeAdministradores/ListaDeAdministradores";
import ListaDeBanners from "../pages/ListaDeBanners/ListaDeBanners";
import ListaDeCartoes from "../pages/ListaDeCartoes/ListaDeCartoes";
import ListaDeContas from "../pages/ListaDeContas/ListaDeContas";
import ListaDeContasAdquirencia from "../pages/ListaDeContasAdquirencia/ListaDeContasAdquirencia";
import ListaDeContasEstabelecimentos from "../pages/ListaDeContasEstabelecimentos/ListaDeContasEstabelecimentos";
import ListaDeContasSecretarias from "../pages/ListaDeContasSecretarias/ListaDeContasSecretarias";
import ListaDeCursos from "../pages/ListaDeCursos";
import ListaDispositivosBloqueados from "../pages/ListaDispositivosBloqueados/ListaDispositivosBloqueados";
import ListaExportacoesSolicitadas from "../pages/ListaExportacoesSolicitadas/ListaExportacoesSolicitadas";
import ListaExtratoAdquirencia from "../pages/ListaExtratoAdquirencia/ListaExtratoAdquirencia";
import ListaFolhaDePagamento from "../pages/ListaFolhaDePagamento/ListaFolhaDePagamento";
import ListaPlanosDeVenda from "../pages/ListaPlanosDeVenda/ListaPlanosDeVenda";
import ListaPlanosDeVendaZoop from "../pages/ListaPlanosDeVendaZoop/ListaPlanosDeVendaZoop";
import ListaRepresentantes from "../pages/ListaRepresentantes/ListaRepresentantes";
import ListaTarifas from "../pages/ListaTarifas/ListaTarifas";
import ListaTerminaisPOS from "../pages/ListaTerminaisPOS/ListaTerminaisPOS";
import ListaTransacoesGerais from "../pages/ListaTransacoesGerais/ListaTransacoesGerais";
import Logs from "../pages/Logs/Logs";
import LogsAuditoria from "../pages/LogsAuditoria";
import ManageFees from "../pages/ManageFees/ManageFees";
import ManageFeesPadrao from "../pages/ManageFeesPadrao/ManageFeesPadrao";
import NewAccountFees from "../pages/NewAccountFees/NewAccountFees";
import NewAccountFeesPadrao from "../pages/NewAccountFeesPadrao/NewAccountFeesPadrao";
import Notificacoes from "../pages/Notificacoes/Notificacoes";
import NotificacoesGestao from "../pages/NotificacoesGestao";
import PagamentoConta from "../pages/PagamentoConta/PagamentoConta";
import PainelCentralizador from "../pages/PainelCentralizador";
import Payers from "../pages/Payers/Payers";
import PaymentBooklet from "../pages/PaymentBooklet/PaymentBooklet";
import PaymentLink from "../pages/PaymentLink/PaymentLink";
import PaymentSlipList from "../pages/PaymentSlipList/PaymentSlipList";
import PixDetails from "../pages/PixDetails/PixDetails";
import PixTransactions from "../pages/PixTransactions/PixTransactions";
import PlanoDeVendaDetalhesZoop from "../pages/PlanoDeVendasDetalhesZoop/PlanoDeVendasDetalhesZoop";
import PlanoDeVendaDetalhes from "../pages/PlanodeVendaDetalhes/PlanoDeVendaDetalhes";
import Print from "../pages/Print";
import ProposalAntecipacaoSalarial from "../pages/ProposalAntecipacaoSalarial";
import ProposalFinancialSupport from "../pages/ProposalFinancialSupport";
import RechargeCellphoneDetails from "../pages/RechargeCellphoneDetails/RechargeCellphoneDetails";
import RechargeCellphoneList from "../pages/RechargeCellphoneList/RechargeCellphoneList";
import RechargeCellphoneListAdmin from "../pages/RechargeCellphoneListAdmin/RechargeCellphoneListAdmin";
import { RelatorioBI, Relatorios } from "../pages/Relatorios";
import TedDetails from "../pages/TedDetails/TedDetails";
import TedTransactions from "../pages/TedTransactions/TedTransactions";
import TokensPublicos from "../pages/TokensPublicos";
import TransacaoP2p from "../pages/TransacaoP2p/TransacaoP2p";
import TransacaoPagamentoBoleto from "../pages/TransacaoPagamentoBoleto/TransacaoPagamentoBoleto";
import TransacaoPagamentoConta from "../pages/TransacaoPagamentoConta/TransacaoPagamentoConta";
import TransacaoPix from "../pages/TransacaoPix/TransacaoPix";
import TransacaoTed from "../pages/TransacaoTed/TransacaoTed";
import TransacoesNotasFiscais from "../pages/TransacoesNotasFiscais";
import TransacoesTarifas from "../pages/TransacoesTarifas/TransacoesTarifas";
import TransactionDetails from "../pages/TransactionDetails/TransactionDetails";
import TransactionHistory from "../pages/TransactionHistory/TransactionHistory";
import TransferDetails from "../pages/TransferDetails/TransferDetails";
import TransferHistory from "../pages/TransferHistory/TransferHistory";
import UserPermissions from "../pages/UserPermissions/UserPermissions";
import UserProfiles from "../pages/UserProfiles";
import UsuariosBloqueados from "../pages/UsuariosBloqueados";
import WhitelistDeDevice from "../pages/WhitelistDeDevice";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    width: px2vw("100%"),
    backgroundColor: "#fff",
  },
  sideBarContainer: {
    display: "flex",
    FlexDirection: "column",
    width: px2vw("25%"),
    height: "100vh",
  },
  contentAreaContainer: {
    backgroundColor: "#fff",
    width: "83%",
    padding: "16px",
  },
  pageHeaderContainer: {
    backgroundColor: "white",
    width: "75%",
    height: "35%",
  },
}));

const SwitchContents = () => {
  const classes = useStyles();
  const { section, id, subsection, subsectionId } = useParams();
  const token = useAuth();
  const dispatch = useDispatch();
  const { hasPermission, PERMISSIONS } = usePermission();

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [dispatch, token]);

  // console.log("Debug params:", { section, id, subsection, subsectionId });

  // CHAT CONFIG
  if (token) {
    if (APP_CONFIG.crispId) {
      window.CRISP_WEBSITE_ID = APP_CONFIG.crispId;
      window.$crisp = [];
      (function () {
        var d = document;
        var s = d.createElement("script");
        s.src = "https://client.crisp.chat/l.js";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);
      })();
    }

    if (APP_CONFIG.zohoId) {
      window.$zoho = window.$zoho || {};
      window.$zoho.salesiq = window.$zoho.salesiq || {
        ready: function () {},
      };

      (function () {
        var d = document;
        var s = d.createElement("script");
        s.id = "zsiqscript";
        s.src = `https://salesiq.zohopublic.com/widget?wc=${APP_CONFIG.zohoId}`;
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);
      })();
    }
  }

  /* setInterval(async () => {
		await dispatch(postRefreshAuthAction(token));
	}, 5000); */

  /* useEffect(() => {
		setInterval(() => {
			dispatch(postRefreshAuthAction(token));
		}, 9000);
	}, [token]); */

  /* const refreshLogin = async () => {
		const resRefreshAuth = await dispatch(postRefreshAuthAction(token));
		if (resRefreshAuth) {
			const login_time = new Date().getTime();
			await dispatch(
				setSessionAuth({ ...resRefreshAuth.data, login_time: login_time })
			);
		}
	}; */

  /* const refreshAuth = async () => {
		const resRefreshAuth = await dispatch(postRefreshAuthAction(auth));
		if (resRefreshAuth) {
			await localStorage.setItem(
				'@auth',
				JSON.stringify({
					...resRefreshAuth.data,
					login_time: new Date().getTime(),
				})
			);
		}
	}; */

  /* useEffect(() => {
		setInterval(() => {
			refreshAuth();
		}, 12000);
	}, []);
 */

  let content = null;

  switch (section) {
    case "home":
      content = <Dashboard />;
      break;

    case "lista-de-contas":
      content = <ListaDeContas />;
      break;

    case "criar-conta-adquirencia":
      content = <CriarConta />;
      break;

    case "lista-de-contas-adquirencia":
      content = <ListaDeContasAdquirencia />;
      break;

    case "lista-de-contas-estabelecimentos":
      content = <ListaDeContasEstabelecimentos />;
      break;

    case "lista-de-contas-secretarias":
      content = <ListaDeContasSecretarias />;
      break;

    case "lista-de-contas-beneficiarios":
      content = <ListaBeneficiarios />;
      break;

    case "lista-de-contas-beneficios":
      content = <ListaBeneficios />;
      break;

    case "lista-de-cursos":
      content = <ListaDeCursos />;
      break;

    case "tokens-publicos":
      content = <TokensPublicos />;
      break;

    case "print":
      content = <Print />;
      break;

    case "gerenciar-pagamento-estabelecimento":
      switch (subsection) {
        case "pagamento-beneficiarios-estabelecimento":
          content = <PagamentoBeneficiariosEstabelecimento />;
          break;

        //subsection of "pagamento-beneficiarios-estabelecimento"
        case "detalhamento":
          content = <ListaBeneficiariosEstabelecimentoDetalhamento />;
          break;

        //subsection of "pagamento-beneficiarios-estabelecimento"
        case "transacoes":
          content = <PagamentoBeneficiariosEstabelecimentoTransacoes />;
          break;

        case "auditoria-pagamento-estabelecimento":
          content = <AuditoriaPagamentoEstabelecimento />;
          break;

        case "autorizar-pagamento-beneficiarios-estabelecimento":
          content = <AutorizarPagamentoBeneficiariosEstabelecimento />;
          break;

        case "extrato-reembolso":
          content = <PagamentoBeneficiariosEstabelecimentoTransacoes />;
          break;

        default:
          content = <GerenciarPagamentoEstabelecimento />;
      }
      break;

    case "painel-centralizador":
      switch (subsection) {
        default:
          content = <PainelCentralizador />;
      }
      break;

    case "notificacoes":
      content = <Notificacoes />;
      break;

    case "notificacoes-gestao":
      content = <NotificacoesGestao />;
      break;

    case "arquivos-exportados":
      content = <ArquivosExportados />;
      break;

    case "relatorios":
      content = <Relatorios />;
      break;

    case "relatorio-bi":
      content = <RelatorioBI />;
      break;

    case "editar-conta":
      switch (id) {
        default:
          content =
            hasPermission(
              "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)",
            ) || hasPermission(PERMISSIONS.contas.actions.edit) ? (
              <EditarDadosDaConta />
            ) : null;
      }

      break;

    case "editar-conta-pj":
      switch (id) {
        default:
          content =
            hasPermission(
              "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)",
            ) || hasPermission(PERMISSIONS.contas.actions.edit) ? (
              <EditarDadosDaContaPj />
            ) : null;
      }

      break;

    case "editar-conta-adquirencia":
      switch (id) {
        default:
          content =
            hasPermission(
              "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)",
            ) || hasPermission(PERMISSIONS.estabelecimentos.list.create) ? (
              <EditarDadosDaContaAdquirencia />
            ) : null;
      }

      break;

    case "editar-conta-pj-adquirencia":
      switch (id) {
        default:
          content =
            hasPermission(
              "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)",
            ) || hasPermission(PERMISSIONS.contas.actions.edit) ? (
              <EditarDadosDaContaPjAdquirencia />
            ) : null;
      }

      break;

    case "representantes":
      switch (id) {
        default:
          content = <ListaRepresentantes />;
          switch (subsection) {
            case "plano-vendas-representante":
              content = <ListaPlanosDeVenda />;
              break;

            default:
          }
      }
      break;

    case "lista-arquivos-de-lote":
      content = <ListaArquivosDeLote />;
      break;

    case "gerenciar-contas":
      switch (id) {
        default:
          content =
            hasPermission(
              "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação",
            ) || hasPermission(PERMISSIONS.contas.list.view) ? (
              <GerenciarListaDeContas />
            ) : null;
          switch (subsection) {
            case "cobrancas-credito":
              content = <CreditCardBillingList />;
              break;

            case "boleto":
              content = <PaymentSlipList />;
              break;

            case "carne":
              content = <PaymentBooklet />;
              break;

            case "link-pagamento":
              content = <PaymentLink />;
              break;

            /* case 'lancamentos-futuros':
							content = <FutureTransactions />;
							break; */

            case "extrato":
              content = hasPermission("Atendimento - Consulta de extrato") ? (
                <AccountStatement />
              ) : null;
              break;

            case "assinaturas":
              content = <AccountSubscriptions />;
              break;

            case "historico-de-transacoes":
              content = hasPermission(
                "Operações - Transações e histórico de transações não concluídas",
              ) ? (
                <TransactionHistory />
              ) : null;
              break;

            case "historico-transferencia":
              content = <TransferHistory />;
              break;

            case "detalhes-transacao":
              content = <TransactionDetails />;
              break;

            case "pagadores":
              content = <Payers />;
              break;

            case "transferencia-ted":
              content = <TedTransactions />;
              break;

            case "pagamento-conta":
              content = <PagamentoConta />;
              break;

            case "transacoes-pix":
              content = <PixTransactions />;
              break;

            case "chaves-pix":
              content = <ChavesPix />;
              break;

            case "gift-cards":
              content = <GiftCardsList />;
              break;

            case "detalhes-gift-card":
              content = <GiftCardDetails />;
              break;

            case "recarga-celular":
              content = <RechargeCellphoneList />;
              break;

            case "folha-de-pagamento":
              content = <ListaFolhaDePagamento />;
              break;

            case "detalhes-recarga":
              content = <RechargeCellphoneDetails />;
              break;

            case "detalhes-transferencia":
              content = <TransferDetails />;
              break;

            case "detalhes-ted":
              content = <TedDetails />;
              break;

            case "detalhes-pix":
              content = <PixDetails />;
              break;

            case "terminais-pos":
              content = <ListaTerminaisPOS />;
              break;

            case "detalhes-terminal-pos":
              content = <DetalhesTerminalPOS />;

              break;

            case "exportacoes-solicitadas":
              content = <ListaExportacoesSolicitadas />;
              break;

            case "tarifas":
              content = <ListaTarifas />;
              break;

            case "extrato-adquirencia":
              content = <ListaExtratoAdquirencia />;
              break;

            case "lista-beneficiarios":
              content = <ListaBeneficiarios />;
              break;

            case "lista-beneficiarios-voucher":
              content = <ListaBeneficiariosVoucher />;
              break;

            case "lista-beneficiarios-cartao":
              content = <ListaBeneficiariosCartao />;
              break;

            case "segunda-via-cartao":
              content = <ListaCartaoSegundaVia />;
              break;

            case "lista-beneficios":
              content = <ListaBeneficios />;
              break;

            case "lista-contrato-aluguel":
              content = <ListaContratoAluguel />;
              break;

            case "pagamento-beneficiarios-cartao":
              content = <PagamentoBeneficiariosCartao />;
              break;

            case "liberar-beneficiarios-cartao":
              content = <LiberarBeneficiariosCartao />;
              break;

            case "pagamento-beneficiarios-estabelecimento":
              content = <PagamentoBeneficiariosEstabelecimento />;
              break;

            case "pagamento-beneficiarios-voucher":
              content = <PagamentoBeneficiariosVoucher />;
              if (subsectionId) {
                content = <ListaPagamentoBeneficiariosVoucherDetalhes />;
              }
              break;

            case "pagamento-contrato-aluguel":
              content = <PagamentoContratoAluguel />;
              break;

            case "pagamento-contrato-aluguel-descricao":
              content = <PagamentoContratoAluguelDescricao />;
              break;

            case "autorizar-pagamento-beneficiarios-estabelecimento":
              content = <AutorizarPagamentoBeneficiariosEstabelecimento />;
              break;

            case "autorizar-pagamento-beneficiarios-voucher":
              content = <AutorizarPagamentoBeneficiariosVoucher />;
              break;

            case "autorizar-pagamento-contrato-aluguel":
              content = <AutorizarPagamentoContratoAluguel />;
              break;

            case "autorizar-pagamento-cartao":
              content = <AutorizarPagamentoBeneficiariosCartao />;
              break;

            case "lista-arquivos-de-lote":
              content = <ListaArquivosDeLote />;
              break;

            case "contas-autorizadas":
              content = <ContasAutorizadas />;
              break;

            case "detalhamento-acao-cartao":
              content = <DetalhamentoCancelarCartao />;
              break;

            default:
          }
      }
      break;

    case "transacoes":
      content = <ListaTransacoesGerais />;
      break;

    case "historico-transacoes":
      content = <HistoricoTransacoes />;
      break;

    case "transacoes-notas-fiscais":
      content = <TransacoesNotasFiscais />;
      break;

    case "transacoes-pix":
      content = <TransacaoPix />;
      break;

    case "transacoes-p2p":
      content = <TransacaoP2p />;
      break;

    case "transacoes-ted":
      content = <TransacaoTed />;
      break;

    case "transacoes-pagamento-conta":
      content = <TransacaoPagamentoConta />;
      break;

    case "transacoes-pagamento-boleto":
      content = <TransacaoPagamentoBoleto />;
      break;

    case "transacoes-cartoes":
      content = <ListaTransacoesCartao />;
      break;

    case "transacoes-voucher":
      content = <ListaTransacoesVoucher />;
      break;

    case "lista-de-administradores":
      switch (id) {
        default:
          content =
            hasPermission("Operações - Gerencimento de administradores") ||
            hasPermission(PERMISSIONS.administradores.list.view) ? (
              <ListaDeAdministradores />
            ) : null;
          switch (subsection) {
            case "permissoes":
              content =
                hasPermission("Operações - Gerencimento de administradores") ||
                hasPermission(
                  PERMISSIONS.administradores.actions.manage_permissions,
                ) ? (
                  <UserPermissions />
                ) : null;
              break;
            case "perfis":
              content = <UserProfiles />;
              break;

            default:
          }
      }
      break;

    case "taxas":
      content = <ManageFees />;
      break;

    case "taxa-padrao":
      content = <ManageFeesPadrao />;
      break;

    case "parceiros":
      content = <ListPartner />;
      break;

    /* case 'representantes':
			content = <ListaRepresentantes />;
			break; */

    case "banners":
      content = <ListaDeBanners />;
      break;

    case "plano-vendas-zoop":
      content = <ListaPlanosDeVendaZoop />;
      break;

    /* case 'plano-vendas':
			content = <ListaPlanosDeVenda />;
			break; */

    case "plano-de-venda":
      switch (id) {
        default:
          content = <PlanoDeVendaDetalhes />;
          break;
      }
      break;

    case "plano-de-venda-zoop":
      switch (id) {
        default:
          content = <PlanoDeVendaDetalhesZoop />;
          break;
      }
      break;

    case "plano-vendas":
      switch (id) {
        default:
          content = <ListaPlanosDeVenda />;

          switch (subsection) {
            case "detalhes":
              <PlanoDeVendaDetalhes />;
              break;

            default:
          }
      }
      break;

    case "jeitto":
      content = hasPermission("Parceiros - Visualizar Jeitto") ? (
        <JeittoAdm />
      ) : null;
      break;

    case "recarga-celular-admin":
      content = hasPermission("Parceiros - Visualizar Recargar") ? (
        <RechargeCellphoneListAdmin />
      ) : null;
      break;

    case "gift-cards-admin":
      content = hasPermission("Parceiros - Visualizar GiftCard") ? (
        <GiftCardsListAdmin />
      ) : null;
      break;

    case "logs":
      content =
        hasPermission("Operações - Visualizar Logs") ||
        hasPermission(PERMISSIONS.logs.list.view) ? (
          <Logs />
        ) : null;
      break;

    case "logs-auditoria":
      content = <LogsAuditoria />;
      break;

    case "condicoes-comerciais":
      content = <CondicoesComerciais />;
      break;

    case "taxa":
      switch (subsection) {
        case "editar": {
          switch (id) {
            default:
              content = <EditFees />;
              break;
          }
          break;
        }
        case "editar-padrao": {
          switch (id) {
            default:
              content = <EditFeesPadrao />;
              break;
          }
          break;
        }
        default:
          content = null;
      }
      break;

    case "nova-taxa":
      content = <NewAccountFees />;
      break;

    case "nova-taxa-padrao":
      content = <NewAccountFeesPadrao />;
      break;

    case "transacoes-tarifas":
      content = <TransacoesTarifas />;
      break;

    case "lista-pre-contas":
      content = <GerenciarListaPreContas />;
      break;

    case "lista-dispositivos-bloqueados":
      content = <ListaDispositivosBloqueados />;
      break;

    case "bloqueio-device":
      content = <BloqueioDeDevice />;
      break;

    case "whitelist-device":
      content = <WhitelistDeDevice />;
      break;

    case "blacklist-selfie":
      content = <BlacklistSelfie />;
      break;

    case "blacklist":
      content = <Blacklist />;
      break;

    case "usuarios-bloqueados":
      content = <UsuariosBloqueados />;
      break;

    case "cartoes":
      content = <ListaDeCartoes />;
      break;

    case "detalhes-pre-conta":
      switch (id) {
        default:
          content = <DetalhesPreConta />;
          break;
      }
      break;

    case "apoio-financeiro":
      content = hasPermission("Administrador - Acesso total") ? (
        <ProposalFinancialSupport />
      ) : null;

      if (subsection === "gerenciar-contas") {
        content = hasPermission("Crédito - Proposta Apoio Financeiro") ? (
          <ProposalFinancialSupportAccounts />
        ) : null;
      }

      if (subsection === "info") {
        content = hasPermission("Crédito - Proposta Apoio Financeiro") ? (
          <FinancialSupport />
        ) : null;
      }

      if (subsection === "listagem") {
        content = hasPermission("Crédito - Apoio Financeiro") ? (
          <FinancialSupportListPage />
        ) : null;
      }

      if (subsection === "proposta") {
        content = hasPermission("Crédito - Apoio Financeiro") ? (
          <FinancialSupportItemPage />
        ) : null;
      }
      break;

    case "antecipacao-salarial":
      content = hasPermission("Crédito - Proposta Apoio Financeiro") ? (
        <ProposalAntecipacaoSalarial />
      ) : null;

      if (subsection === "gerenciar-contas") {
        content = hasPermission("Crédito - Proposta Apoio Financeiro") ? (
          <ProposalAntecipacaoSalarialAccounts />
        ) : null;
      }

      if (subsection === "info") {
        content = hasPermission("Crédito - Proposta Apoio Financeiro") ? (
          <AntecipacaoSalarial />
        ) : null;
      }

      if (subsection === "listagem") {
        content = hasPermission("Crédito - Apoio Financeiro") ? (
          <AntecipacaoSalarialListPage />
        ) : null;
      }

      if (subsection === "proposta") {
        content = hasPermission("Crédito - Apoio Financeiro") ? (
          <AntecipacaoSalarialItemPage />
        ) : null;
      }
      break;

    case "historico-notificacoes":
      content = <HistoricoNotificacoes />;
      break;

    default:
      content = null;
      break;
  }

  if (section === "print")
    return <Box className={classes.contentAreaContainer}>{content}</Box>;

  return (
    <Box className={classes.root}>
      <Box className={classes.sidebarContainer}>
        <CustomSideBar />

        <Box className={classes.pageHeaderContainer}></Box>
      </Box>

      <Box className={classes.contentAreaContainer}>{content}</Box>
    </Box>
  );
};

export default SwitchContents;
