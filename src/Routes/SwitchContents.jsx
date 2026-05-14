import { Box, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { loadPermissao, postAuthMeAction } from "../actions/actions";
import CustomSideBar from "../components/CustomSideBar/CustomSideBar";
import { APP_CONFIG } from "../constants/config";
import { PERMISSIONS } from "../constants/permissions";
import useAuth from "../hooks/useAuth";
import px2vw from "../utils/px2vw";

import AntecipacaoSalarialItemPage from "../modules/AntecipacaoSalarial/pages/AntecipacaoSalarialItem";
import AntecipacaoSalarialListPage from "../modules/AntecipacaoSalarial/pages/AntecipacaoSalarialList";
import ProposalAntecipacaoSalarialAccounts from "../modules/AntecipacaoSalarialProposal/pages/ProposalAntecipacaoSalarialAccounts";

import AccountStatement from "../pages/AccountStatement/AccountStatement";
import AccountSubscriptions from "../pages/AccountSubscriptions/AccountSubscriptions";
import Adquirencia from "../pages/Adquirencia/Adquirencia";
import AntecipacaoSalarial from "../pages/AntecipacaoSalarial";
import ShowAproveckAssociado from "../pages/Aproveck/Associados/ShowAproveckAssociado";
import CriarBoletoAproveck from "../pages/Aproveck/Boletos/CriarBoletoAproveck/CriarBoletoAproveck";
import IndexAproveckBoletos from "../pages/Aproveck/Boletos/IndexAproveckBoletos";
import ShowAproveckBoleto from "../pages/Aproveck/Boletos/ShowAproveckBoleto";
import IndexAproveckVeiculos from "../pages/Aproveck/Veiculos/IndexAproveckVeiculos";
import ShowAproveckVeiculo from "../pages/Aproveck/Veiculos/ShowAproveckVeiculo";
import ArquivoRemessaForm from "../pages/ArquivoRemessa/ArquivoRemessaForm/ArquivoRemessaForm";
import ArquivoRemessaIndex from "../pages/ArquivoRemessa/ArquivoRemessaIndex/ArquivoRemessaIndex";
import ItensRemessa from "../pages/ArquivoRemessa/ItensRemessa/ItensRemessa";
import PagadorRemessaIndex from "../pages/ArquivoRemessa/Pagador/PagadorRemessaIndex";
import ArquivoRetornoIndex from "../pages/ArquivoRetorno/ArquivoRetornoIndex";
import ArquivosExportados from "../pages/ArquivosExportados";
import {
  Beneficiarios,
  ListaBeneficiarios,
  ListaBeneficiariosCartoes,
  ListaBeneficiariosCartoesPre,
  ListaBeneficiariosVouchers,
  ListaBeneficios,
  ListaTransacaoPix,
  TransacoesBeneficiarios,
  TransacoesBeneficiariosPre,
} from "../pages/Beneficiarios";
import ListaBeneficiariosCartoesSegundaVia from "../pages/Beneficiarios/Acao/ListaBeneficiariosCartoesSegundaVia";
import ListaContratoAluguel from "../pages/Beneficiarios/Acao/ListaContratoAluguel";
import PagamentoContratoAluguel from "../pages/Beneficiarios/Acao/PagamentoContratoAluguel";
import Blacklist from "../pages/Blacklist/Blacklist";
import CadastrarFolhaDePagamento from "../pages/CadastrarFolhaDePagamento/CadastrarFolhaDePagamento";
import CadastrarFuncionariosGrupos from "../pages/CadastrarFuncionariosGrupos/CadastrarFuncionariosGrupos";
import Cartoes from "../pages/Cartoes/Cartoes";
import ChavesPix from "../pages/ChavesPix/ChavesPix";
import CobrarUsuario from "../pages/CobrarUsuario/CobrarUsuario";
import ContaDigital from "../pages/ContaDigital/ContaDigital";
import CreditCardBillingList from "../pages/CreditCardBillingList/CreditCardBillingList";
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardRepresentante from "../pages/DashboardRepresentante/DashboardRepresentante";
import DetalhesLinkPagamento from "../pages/DetalhesLinkPagamento/DetalhesLinkPagamento";
import DetalhesPreConta from "../pages/DetalhesPreConta/DetalhesPreConta";
import DetalhesTerminalPOS from "../pages/DetalhesTerminalPOS/DetalhesTerminalPOS";
import EditFees from "../pages/EditFees/EditFees";
import EditarDadosDaConta from "../pages/EditarDadosDaConta/EditarDadosDaConta";
import {
  PagamentosFuturos,
  PagamentosRecebidos,
} from "../pages/Estabelecimentos";
import ExtratoP2P from "../pages/ExtratoP2P/ExtratoP2P";
import ExtratoPix from "../pages/ExtratoPix/ExtratoPix";
import ExtratoTED from "../pages/ExtratoTED/ExtratoTED";
import FolhaDePagamento from "../pages/FolhaDePagamento/FolhaDePagamento";
import GerenciarListaDeContas from "../pages/GerenciarListaDeContas/GerenciarListaDeContas";
import GiftCardDetails from "../pages/GiftCardDetails/GiftCardDetails";
import GiftCardsList from "../pages/GiftCardsList/GiftCardsList";
import GiftCardsListAdmin from "../pages/GiftCardsListAdmin/GiftCardsListAdmin";
import JeittoAdm from "../pages/JeittoAdm/index";
import LiberarCartoes from "../pages/LiberarCartoes";
import ListPartner from "../pages/ListPartners/ListPartners";
import ListaArquivosDeLoteConcorrencia from "../pages/ListaArquivosDeLoteConcorrencia/";
import ListaArquivosLote from "../pages/ListaArquivosLote/ListaArquivosLote";
import ListaCobrar from "../pages/ListaCobrar/ListaCobrar";
import ListaConsultaPagamento from "../pages/ListaConsultaPagamento/ListaConsultaPagamento";
import ListaDeAdministradores from "../pages/ListaDeAdministradores/ListaDeAdministradores";
import ListaDeContas from "../pages/ListaDeContas/ListaDeContas";
import ListaContasSecretaria from "../pages/ListaDeContasSecretaria";
import ListaDispositivosBloqueados from "../pages/ListaDispositivosBloqueados/ListaDispositivosBloqueados";
import ListaExportacoesSolicitadas from "../pages/ListaExportacoesSolicitadas/ListaExportacoesSolicitadas";
import ListaExtratoAdquirencia from "../pages/ListaExtratoAdquirencia/ListaExtratoAdquirencia";
import ListaFolhaDePagamento from "../pages/ListaFolhaDePagamento/ListaFolhaDePagamento";
import ListaFolhaDePagamentoAutorizar from "../pages/ListaFolhaDePagamentoAutorizar/ListaFolhaDePagamentoAutorizar";
import ListaFolhaDePagamentoAutorizarBene from "../pages/ListaFolhaDePagamentoAutorizarBene/ListaFolhaDePagamentoAutorizarBene";
import ListaFolhaDePagamentoAutorizarConc from "../pages/ListaFolhaDePagamentoAutorizarConc/ListaFolhaDePagamentoAutorizarConc";
import ListaFolhaDePagamentoBene from "../pages/ListaFolhaDePagamentoBene/ListaFolhaDePagamentoBene";
import ListaFolhaDePagamentoConc from "../pages/ListaFolhaDePagamentoConc/ListaFolhaDePagamentoConc";
import ListaFolhaDePagamentoVoucher from "../pages/ListaFolhaDePagamentoVoucher/ListaFolhaDePagamentoVoucher";
import ListaFolhaDePagamentoVoucherDetalhes from "../pages/ListaFolhaDePagamentoVoucherDetalhes";
import ListaFuncionariosGrupos from "../pages/ListaFuncionariosGrupos/ListaFuncionariosGrupos";
import ListaHistoricoDeTransacoes from "../pages/ListaHistoricoDeTransacoes/ListaHistoricoDeTransacoes";
import ListaHistoricoDeTransacoesRepresentante from "../pages/ListaHistoricoDeTransacoesRepresentante/ListaHistoricoDeTransacoesRepresentante";
import ListaLancamentosFuturos from "../pages/ListaLancamentosFuturos/ListaLancamentosFuturos";
import ListaLinkPagamento from "../pages/ListaLinkPagamento/ListaLinkPagamento";
import ListaMaquinaVirtualCartao from "../pages/ListaMaquinaVituralCartao/ListaMaquinaVirtualCartao";
import ListaPagadores from "../pages/ListaPagadores/ListaPagadores";
import ListaPlanosDeVenda from "../pages/ListaPlanosDeVenda/ListaPlanosDeVenda";
import ListaTarifas from "../pages/ListaTarifas/ListaTarifas";
import ListaTerminaisPOS from "../pages/ListaTerminaisPOS/ListaTerminaisPOS";
import Logs from "../pages/Logs/Logs";
import ManageFees from "../pages/ManageFees/ManageFees";
import NewAccountFees from "../pages/NewAccountFees/NewAccountFees";
import NewAccountSubscriptions from "../pages/NewAccountSubscriptions/NewAccountSubscriptions";
import NewSubscriptionPlans from "../pages/NewSubscriptionPlans/NewSubscriptionPlans";
import NovoLinkPagamento from "../pages/NovoLinkPagamento/NovoLinkPagamento";
import PaginaBoletos from "../pages/PaginaBoletos/PaginaBoletos";
import PaginaPagamentos from "../pages/PaginaPagamentos/PaginaPagamentos";
import Payers from "../pages/Payers/Payers";
import PaymentBooklet from "../pages/PaymentBooklet/PaymentBooklet";
import PaymentLink from "../pages/PaymentLink/PaymentLink";
import PaymentLinkDetails from "../pages/PaymentLinkDetails/PaymentLinkDetails";
import PaymentSlipList from "../pages/PaymentSlipList/PaymentSlipList";
import PermissaoBeneficiario from "../pages/PermissaoBeneficiario/PermissaoBeneficiario";
import PixDetails from "../pages/PixDetails/PixDetails";
import PixTransactions from "../pages/PixTransactions/PixTransactions";
import PlanoDeVendaDetalhes from "../pages/PlanoDeVendaDetalhes/PlanoDeVendaDetalhes";
import Print from "../pages/Print";
import ProposalAntecipacaoSalarial from "../pages/ProposalAntecipacaoSalarial";
import RechargeCellphoneDetails from "../pages/RechargeCellphoneDetails/RechargeCellphoneDetails";
import RechargeCellphoneList from "../pages/RechargeCellphoneList/RechargeCellphoneList";
import RechargeCellphoneListAdmin from "../pages/RechargeCellphoneListAdmin/RechargeCellphoneListAdmin";
import SubscriptionPlans from "../pages/SubscriptionPlans/SubscriptionPlans";
import TedDetails from "../pages/TedDetails/TedDetails";
import TedTransactions from "../pages/TedTransactions/TedTransactions";
import TransactionDetails from "../pages/TransactionDetails/TransactionDetails";
import TransactionHistory from "../pages/TransactionHistory/TransactionHistory";
import TransferDetails from "../pages/TransferDetails/TransferDetails";
import TransferHistory from "../pages/TransferHistory/TransferHistory";
import UserPermissions from "../pages/UserPermissions/UserPermissions";

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
    width: "100%",
    padding: "0px 18px",
  },
  pageHeaderContainer: {
    backgroundColor: "white",
    width: "100%",
    height: "35%",
  },
}));

const SwitchContents = () => {
  const token = useAuth();
  const classes = useStyles();
  const { section, id, subsection, subsectionId } = useParams();
  const dispatch = useDispatch();
  const me = useSelector((state) => state.me);
  const userPermissao = useSelector((state) => state.userPermissao);
  const userData = useSelector((state) => state.userData);
  const gerenciarPermissao = useSelector((state) => state.gerenciarPermissao);
  const [permissoes, setPermissoes] = useState([]);

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

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [dispatch, token]);

  useEffect(() => {
    const { permissao } = userPermissao;
    setPermissoes(permissao.map((item) => item.tipo));
  }, [userPermissao]);

  useEffect(() => {
    if (me.id !== undefined) {
      dispatch(loadPermissao(token, me.id));
    }
  }, [dispatch, me.id, token]);

  let content = null;

  switch (section) {
    case "home":
      content = <Dashboard />;
      break;

    case "conta-digital":
      content = <ContaDigital />;
      break;

    case "extrato":
      content = <AccountStatement />;
      break;

    case "arquivos-exportados":
      content = <ArquivosExportados />;
      break;

    case "print":
      content = <Print />;
      break;

    case "folha-de-pagamento":
      content = <FolhaDePagamento />;
      switch (subsection) {
        case "autorizar-pagamentos-de-salarios":
          content = <ListaFolhaDePagamentoAutorizar />;
          break;

        case "autorizar-pagamentos-de-salarios-conc":
          content = <ListaFolhaDePagamentoAutorizarConc />;
          break;

        case "autorizar-pagamentos-de-salarios-bene":
          content = <ListaFolhaDePagamentoAutorizarBene />;
          break;

        case "lista-folhas-de-pagamento":
          content = <ListaFolhaDePagamento />;
          break;

        case "lista-folhas-de-pagamento-conc":
          content = <ListaFolhaDePagamentoConc />;
          break;

        case "lista-folhas-de-pagamento-voucher":
          content = <ListaFolhaDePagamentoVoucher />;
          if (subsectionId) {
            content = <ListaFolhaDePagamentoVoucherDetalhes />;
          }
          break;

        case "lista-folhas-de-pagamento-bene":
          content = <ListaFolhaDePagamentoBene />;
          break;

        case "cadastrar-funcionarios-e-grupos":
          content = <CadastrarFuncionariosGrupos />;
          break;

        case "cadastrar-folha-de-pagamento":
          content = <CadastrarFolhaDePagamento />;
          break;

        case "lista-funcionarios-e-grupos":
          content = <ListaFuncionariosGrupos />;
          break;

        case "consultar-pagamentos":
          content = <ListaConsultaPagamento />;
          break;

        case "arquivos-lote":
          content = <ListaArquivosLote />;
          break;

        case "lista-arquivos-de-lote":
          content = <ListaArquivosDeLoteConcorrencia />;
          break;

        case "print":
          content = <Print />;
          break;
        default:
      }

      break;

    case "liberar-cartao":
      content = <LiberarCartoes />;
      break;

    case "lista-de-contas-beneficiarios":
      content = <ListaBeneficiarios />;
      break;

    case "lista-de-contas-beneficios":
      content = <ListaBeneficios />;
      break;

    case "beneficiarios":
      content = <Beneficiarios />;
      switch (subsection) {
        case "lista-beneficiarios":
          content = <ListaBeneficiarios />;
          break;

        case "lista-cartoes":
          content = <ListaBeneficiariosCartoes />;
          break;

        case "lista-cartoes-segunda-via":
          content = <ListaBeneficiariosCartoesSegundaVia />;
          break;

        case "lista-cartoes-pre":
          content = <ListaBeneficiariosCartoesPre />;
          break;

        case "lista-vouchers":
          content = <ListaBeneficiariosVouchers />;
          break;

        case "lista-contrato-aluguel":
          content = <ListaContratoAluguel />;
          break;

        case "pagamento-contrato-aluguel":
          content = <PagamentoContratoAluguel />;
          break;

        case "lista-transacao-pix":
          content = <ListaTransacaoPix />;
          break;

        case "transacoes":
          content = <TransacoesBeneficiarios />;
          break;

        case "transacoes-pre":
          content = <TransacoesBeneficiariosPre />;
          break;

        case "lista-arquivos-de-lote":
          content = <ListaArquivosDeLoteConcorrencia />;
          break;

        default:
      }

      break;

    case "permissao-beneficiario":
      content = <PermissaoBeneficiario />;
      break;

    case "antecipacao-salarial":
      content =
        permissoes.includes("Administrador - Acesso total") ||
        permissoes.includes("Crédito - Proposta Apoio Financeiro") ? (
          <ProposalAntecipacaoSalarial />
        ) : null;

      if (subsection === "gerenciar-contas") {
        content =
          permissoes.includes("Administrador - Acesso total") ||
          permissoes.includes("Crédito - Proposta Apoio Financeiro") ? (
            <ProposalAntecipacaoSalarialAccounts />
          ) : null;
      }

      if (subsection === "info") {
        content =
          permissoes.includes("Administrador - Acesso total") ||
          permissoes.includes("Crédito - Proposta Apoio Financeiro") ? (
            <AntecipacaoSalarial />
          ) : null;
      }

      if (subsection === "listagem") {
        content =
          permissoes.includes("Administrador - Acesso total") ||
          permissoes.includes("Crédito - Apoio Financeiro") ? (
            <AntecipacaoSalarialListPage />
          ) : null;
      }

      if (subsection === "proposta") {
        content =
          permissoes.includes("Administrador - Acesso total") ||
          permissoes.includes("Crédito - Apoio Financeiro") ? (
            <AntecipacaoSalarialItemPage />
          ) : null;
      }
      break;

    case "arquivo-remessa":
      content = <ArquivoRemessaIndex />;

      switch (subsection) {
        case "itens":
          content = <ItensRemessa />;

          break;
        case "pagadores":
          content = <PagadorRemessaIndex />;

          break;
        /* case 'editar':
					content = <EditarPagador />;

					break; */

        default:
      }
      break;

    case "criar-arquivo-remessa":
      content = <ArquivoRemessaForm />;

      break;

    case "detalhes-arquivo-remessa":
      switch (id) {
        default:
          content = <ArquivoRemessaForm />;

          break;
      }
      break;

    case "arquivo-retorno":
      content = <ArquivoRetornoIndex />;
      break;

    case "aproveck-boletos":
      content = permissoes.includes(PERMISSIONS.APROVEC) ? (
        <IndexAproveckBoletos />
      ) : null;
      switch (subsection) {
        case "detalhes":
          content = permissoes.includes(PERMISSIONS.APROVEC) ? (
            <ShowAproveckBoleto />
          ) : null;

          break;

        default:
      }
      break;

    case "aproveck-boletos-criar":
      content = permissoes.includes(PERMISSIONS.APROVEC) ? (
        <CriarBoletoAproveck />
      ) : null;
      break;

    case "aproveck-veiculos":
      content = permissoes.includes(PERMISSIONS.APROVEC) ? (
        <IndexAproveckVeiculos />
      ) : null;
      switch (subsection) {
        case "detalhes":
          content = permissoes.includes(PERMISSIONS.APROVEC) ? (
            <ShowAproveckVeiculo />
          ) : null;

          break;

        default:
      }
      break;

    case "aproveck-associado":
      switch (subsection) {
        case "detalhes":
          content = permissoes.includes(PERMISSIONS.APROVEC) ? (
            <ShowAproveckAssociado />
          ) : null;

          break;

        default:
      }
      break;

    case "adquirencia":
      content = userData.status_adquirencia === "approved" && <Adquirencia />;
      switch (subsection) {
        case "maquina-virtual-cartao":
          content = userData.status_adquirencia === "approved" && (
            <ListaMaquinaVirtualCartao />
          );
          if (subsectionId) {
            content = userData.status_adquirencia === "approved" && (
              <TransactionDetails />
            );
          }
          /* switch (subsectionId) {
						case !null:
							content = null;
							break;
					} */
          break;

        case "cobrar":
          content = userData.status_adquirencia === "approved" && (
            <ListaCobrar />
          );
          if (subsectionId) {
            content = userData.status_adquirencia === "approved" && (
              <CobrarUsuario />
            );
          }
          break;

        case "lancamentos-futuros":
          content = userData.status_adquirencia === "approved" && (
            <ListaLancamentosFuturos />
          );

          break;

        case "pagadores":
          content = userData.status_adquirencia === "approved" && (
            <ListaPagadores />
          );

          break;

        case "historico-de-transacoes":
          content = userData.status_adquirencia === "approved" && (
            <ListaHistoricoDeTransacoes />
          );

          break;

        case "link-de-pagamento":
          content = userData.status_adquirencia === "approved" && (
            <ListaLinkPagamento />
          );
          if (subsectionId) {
            content = userData.status_adquirencia === "approved" && (
              <DetalhesLinkPagamento />
            );
          }
          break;

        case "novo-link-pagamento":
          content = userData.status_adquirencia === "approved" && (
            <NovoLinkPagamento />
          );

          break;

        case "cobranca-recorrente":
          content = userData.status_adquirencia === "approved" && (
            <AccountSubscriptions />
          );

          break;

        case "nova-assinatura":
          content = userData.status_adquirencia === "approved" && (
            <NewAccountSubscriptions />
          );

          break;

        case "planos-de-assinaturas":
          content = userData.status_adquirencia === "approved" && (
            <SubscriptionPlans />
          );
          if (subsectionId) {
            content = userData.status_adquirencia === "approved" && (
              <NewSubscriptionPlans />
            );
          }
          break;

        case "criar-plano-de-assinatura":
          content = userData.status_adquirencia === "approved" && (
            <NewSubscriptionPlans />
          );

          break;

        case "tarifas":
          content = userData.status_adquirencia === "approved" && (
            <ListaTarifas />
          );

          break;

        case "exportacoes-solicitadas":
          content = userData.status_adquirencia === "approved" && (
            <ListaExportacoesSolicitadas />
          );

          break;

        case "terminais-pos":
          content = userData.status_adquirencia === "approved" && (
            <ListaTerminaisPOS />
          );
          if (subsectionId) {
            content = userData.status_adquirencia === "approved" && (
              <DetalhesTerminalPOS />
            );
          }
          break;
        /* case 'lista-folhas-de-pagamento':
					content = <ListaFolhaDePagamento />;
					break;

				case 'cadastrar-funcionarios-e-grupos':
					content = <CadastrarFuncionariosGrupos />;
					break;

				case 'cadastrar-folha-de-pagamento':
					content = <CadastrarFolhaDePagamento />;
					break;

				case 'lista-funcionarios-e-grupos':
					content = <ListaFuncionariosGrupos />;
					break;

				case 'consultar-pagamentos':
					content = <ListaConsultaPagamento />;
					break;

				case 'arquivos-lote':
					content = <ListaArquivosLote />;
					break;

				case 'print':
					content = <PrintFolhaDePagamento />;
					break; */
        default:
      }

      break;

    /* case 'taxa':
				switch (subsection) {
					case 'editar': {
						switch (id) {
							default:
								content = <EditFees />;
								break;
						}
						break;
					}
					default:
						content = null;
				}
				break; */

    case "editar-conta":
      switch (id) {
        default:
          content =
            permissoes.includes(
              "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)",
            ) || permissoes.includes("Administrador - Acesso total") ? (
              <EditarDadosDaConta />
            ) : null;
      }

      break;

    case "gerenciar-contas":
      switch (id) {
        default:
          content =
            permissoes.includes(
              "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação",
            ) || permissoes.includes("Administrador - Acesso total") ? (
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

            case "detalhes-link":
              content = <PaymentLinkDetails />;

              break;

            /* case 'lancamentos-futuros':
							content = <FutureTransactions />;
							break; */

            /* case 'extrato':
							content =
								permissoes.includes(
									'Atendimento - Consulta de extrato'
								) ||
								permissoes.includes('Administrador - Acesso total') ? (
									<AccountStatement />
								) : null;
							break; */

            case "assinaturas":
              content = <AccountSubscriptions />;
              break;

            case "historico-de-transacoes":
              content =
                permissoes.includes(
                  "Operações - Transações e histórico de transações não concluídas",
                ) || permissoes.includes("Administrador - Acesso total") ? (
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

            case "extrato-adquirencia":
              content = <ListaExtratoAdquirencia />;
              break;

            case "terminais-pos":
              content = <ListaTerminaisPOS />;
              break;

            case "exportacoes-solicitadas":
              content = <ListaExportacoesSolicitadas />;
              break;

            case "tarifas":
              content = <ListaTarifas />;
              break;

            case "arquivo-remessa":
              switch (id) {
                default:
                  content = <ArquivoRemessaIndex />;

                  break;
              }
              break;

            default:
          }
      }
      break;

    case "lista-de-administradores":
      switch (id) {
        default:
          content =
            permissoes.includes(
              "Operações - Gerencimento de administradores",
            ) || permissoes.includes("Administrador - Acesso total") ? (
              <ListaDeAdministradores />
            ) : null;
          switch (subsection) {
            case "permissoes":
              content =
                permissoes.includes(
                  "Operações - Gerencimento de administradores",
                ) || permissoes.includes("Administrador - Acesso total") ? (
                  <UserPermissions />
                ) : null;
              break;

            default:
          }
      }
      break;

    case "taxas":
      content = <ManageFees />;
      break;

    case "partners":
      content = <ListPartner />;
      break;

    case "jeitto":
      content =
        permissoes.includes("Parceiros - Visualizar Jeitto") ||
        permissoes.includes("Administrador - Acesso total") ? (
          <JeittoAdm />
        ) : null;
      break;

    case "recarga-celular-admin":
      content =
        permissoes.includes("Parceiros - Visualizar Recargar") ||
        permissoes.includes("Administrador - Acesso total") ? (
          <RechargeCellphoneListAdmin />
        ) : null;
      break;

    case "gift-cards-admin":
      content =
        permissoes.includes("Parceiros - Visualizar GiftCard") ||
        permissoes.includes("Administrador - Acesso total") ? (
          <GiftCardsListAdmin />
        ) : null;
      break;

    /* case 'logs':
			content =
				permissoes.includes('Operações - Visualizar Logs') ||
				permissoes.includes('Administrador - Acesso total') ? (
					<Logs />
				) : null;
			break; */

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
        default:
          content = null;
      }
      break;

    case "nova-taxa":
      content = <NewAccountFees />;
      break;

    /* case 'lista-pre-contas':
			content = <GerenciarListaPreContas />;
			break; */

    case "extratoTED":
      content = <ExtratoTED />;
      break;

    /* case 'walletVBank':
			content = <WalletVBank />;
			break;

		case 'walletCompartilhado':
			content = <WalletCompartilhada />;
			break; */

    case "extratoP2P":
      content = <ExtratoP2P />;
      break;

    case "cartoes":
      content = APP_CONFIG.AbaCartoes && <Cartoes />;
      break;

    case "pix":
      content = <ExtratoPix />;
      break;

    case "lista-pagamentos":
      content = <PaginaPagamentos />;
      break;

    case "lista-boletos":
      content = <PaginaBoletos />;
      break;

    case "lista-dispositivos-bloqueados":
      content = <ListaDispositivosBloqueados />;
      break;

    case "blacklist":
      content = <Blacklist />;
      break;

    case "detalhes-pre-conta":
      switch (id) {
        default:
          content = <DetalhesPreConta />;
          break;
      }
      break;

    case "adm":
      content = userData && userData.agent && <DashboardRepresentante />;
      break;

    case "lista-contas":
      content = userData && userData.agent && <ListaDeContas />;
      break;

    case "lista-contas-secretaria":
      content = <ListaContasSecretaria />;
      break;

    case "detalhes-transacao":
      content = userData && userData.agent && <TransactionDetails />;
      break;

    case "historico-de-transacoes":
      content = userData && userData.agent && (
        <ListaHistoricoDeTransacoesRepresentante />
      );
      break;

    case "planos-de-venda":
      content = userData && userData.agent && <ListaPlanosDeVenda />;

      break;

    case "plano-de-venda":
      switch (id) {
        default:
          content = userData && userData.agent && <PlanoDeVendaDetalhes />;
          break;
      }
      break;

    case "logs":
      content = userData && userData.agent && <Logs />;
      break;

    case "pagamentos-futuros":
      content = <PagamentosFuturos />;
      break;

    case "pagamentos-recebidos":
      content = <PagamentosRecebidos />;
      break;

    default:
      content = null;
      break;
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.sidebarContainer}>
        {section === "print" || subsection === "print" ? null : (
          <CustomSideBar cadastro={false} />
        )}

        <Box className={classes.pageHeaderContainer}></Box>
      </Box>

      <Box className={classes.contentAreaContainer}>{content}</Box>
    </Box>
  );
};

export default SwitchContents;
