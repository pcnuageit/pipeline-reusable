import { Box, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
	loadPermissao,
	postAuthMeAction,
	postRefreshAuthAction,
	setSessionAuth,
} from '../actions/actions';
import { useDispatch, useSelector } from 'react-redux';

import AccountStatement from '../pages/AccountStatement/AccountStatement';
import AccountSubscriptions from '../pages/AccountSubscriptions/AccountSubscriptions';
import ChavesPix from '../pages/ChavesPix/ChavesPix';
import CreditCardBillingList from '../pages/CreditCardBillingList/CreditCardBillingList';
import CustomSideBar from '../components/CustomSideBar/CustomSideBar';
import Dashboard from '../pages/Dashboard/Dashboard';
import DetalhesPreConta from '../pages/DetalhesPreConta/DetalhesPreConta';
import EditFees from '../pages/EditFees/EditFees';
import EditarDadosDaConta from '../pages/EditarDadosDaConta/EditarDadosDaConta';
import GerenciarListaDeContas from '../pages/GerenciarListaDeContas/GerenciarListaDeContas';
import GerenciarListaPreContas from '../pages/GerenciarListaPreContas/GerenciarListaPreContas';
import GiftCardDetails from '../pages/GiftCardDetails/GiftCardDetails';
import GiftCardsList from '../pages/GiftCardsList/GiftCardsList';
import JeittoAdm from '../pages/JeittoAdm/index';
import ListPartner from '../pages/ListPartners/ListPartners';
import ListaDeAdministradores from '../pages/ListaDeAdministradores/ListaDeAdministradores';
import ListaDeContas from '../pages/ListaDeContas/ListaDeContas';
import ListaDispositivosBloqueados from '../pages/ListaDispositivosBloqueados/ListaDispositivosBloqueados';
import Logs from '../pages/Logs/Logs';
import ManageFees from '../pages/ManageFees/ManageFees';
import NewAccountFees from '../pages/NewAccountFees/NewAccountFees';
import Payers from '../pages/Payers/Payers';
import PaymentBooklet from '../pages/PaymentBooklet/PaymentBooklet';
import PaymentLink from '../pages/PaymentLink/PaymentLink';
import PaymentSlipList from '../pages/PaymentSlipList/PaymentSlipList';
import PixDetails from '../pages/PixDetails/PixDetails';
import PixTransactions from '../pages/PixTransactions/PixTransactions';
import RechargeCellphoneDetails from '../pages/RechargeCellphoneDetails/RechargeCellphoneDetails';
import RechargeCellphoneList from '../pages/RechargeCellphoneList/RechargeCellphoneList';
import RechargeCellphoneListAdmin from '../pages/RechargeCellphoneListAdmin/RechargeCellphoneListAdmin';
import GiftCardsListAdmin from '../pages/GiftCardsListAdmin/GiftCardsListAdmin';
import TedDetails from '../pages/TedDetails/TedDetails';
import TedTransactions from '../pages/TedTransactions/TedTransactions';
import TransactionDetails from '../pages/TransactionDetails/TransactionDetails';
import TransactionHistory from '../pages/TransactionHistory/TransactionHistory';
import TransferDetails from '../pages/TransferDetails/TransferDetails';
import TransferHistory from '../pages/TransferHistory/TransferHistory';
import UserPermissions from '../pages/UserPermissions/UserPermissions';
import useAuth from '../hooks/useAuth';
import { useParams } from 'react-router';
import Blacklist from '../pages/Blacklist/Blacklist';
import FinancialSupport from '../pages/FinancialSupport';
import ProposalFinancialSupport from '../pages/ProposalFinancialSupport';
import ProposalAntecipacaoSalarial from '../pages/ProposalAntecipacaoSalarial';
import FinancialSupportListPage from '../modules/FinancialSupport/pages/FinancialSupportList';
import FinancialSupportItemPage from '../modules/FinancialSupport/pages/FinancialSupportItem';
import AntecipacaoSalarialItemPage from '../modules/AntecipacaoSalarial/pages/AntecipacaoSalarialItem';
import EditarDadosDaContaPj from '../pages/EditarDadosDaContaPj/EditarDadosDaContaPj';
import ListaFolhaDePagamento from '../pages/ListaFolhaDePagamento/ListaFolhaDePagamento';
import ListaDeBanners from '../pages/ListaDeBanners/ListaDeBanners';

import ListaDeCartoes from '../pages/ListaDeCartoes/ListaDeCartoes';
import TransacaoPix from '../pages/TransacaoPix/TransacaoPix';
import TransacaoP2p from '../pages/TransacaoP2p/TransacaoP2p';
import TransacaoTed from '../pages/TransacaoTed/TransacaoTed';
import TransacaoPagamentoConta from '../pages/TransacaoPagamentoConta/TransacaoPagamentoConta';
import PagamentoConta from '../pages/PagamentoConta/PagamentoConta';
import ProposalFinancialSupportAccounts from '../modules/FinancialSupportProposal/pages/ProposalFinancialSupportAccounts';
import TransacaoPagamentoBoleto from '../pages/TransacaoPagamentoBoleto/TransacaoPagamentoBoleto';
import ListaDeContasAdquirencia from '../pages/ListaDeContasAdquirencia/ListaDeContasAdquirencia';
import ListaDeContasEstabelecimentos from '../pages/ListaDeContasEstabelecimentos/ListaDeContasEstabelecimentos';
import Notificacoes from '../pages/Notificacoes/Notificacoes';
import ListaTerminaisPOS from '../pages/ListaTerminaisPOS/ListaTerminaisPOS';
import ListaExportacoesSolicitadas from '../pages/ListaExportacoesSolicitadas/ListaExportacoesSolicitadas';
import ListaTarifas from '../pages/ListaTarifas/ListaTarifas';
import ListaExtratoAdquirencia from '../pages/ListaExtratoAdquirencia/ListaExtratoAdquirencia';
import ListaPlanosDeVenda from '../pages/ListaPlanosDeVenda/ListaPlanosDeVenda';
import PlanoDeVendaDetalhes from '../pages/PlanodeVendaDetalhes/PlanoDeVendaDetalhes';
import ListaPlanosDeVendaZoop from '../pages/ListaPlanosDeVendaZoop/ListaPlanosDeVendaZoop';
import px2vw from '../utils/px2vw';
import AntecipacaoSalarial from '../pages/AntecipacaoSalarial';
import AntecipacaoSalarialListPage from '../modules/AntecipacaoSalarial/pages/AntecipacaoSalarialList';
import ProposalAntecipacaoSalarialAccounts from '../modules/AntecipacaoSalarialProposal/pages/ProposalAntecipacaoSalarialAccounts';
import PlanoDeVendaDetalhesZoop from '../pages/PlanoDeVendasDetalhesZoop/PlanoDeVendasDetalhesZoop';
import DetalhesTerminalPOS from '../pages/DetalhesTerminalPOS/DetalhesTerminalPOS';
import StickyBox from 'react-sticky-box';
import { APP_CONFIG } from '../constants/config';
import ListaRepresentantes from '../pages/ListaRepresentantes/ListaRepresentantes';
import ListaTransacoesGerais from '../pages/ListaTransacoesGerais/ListaTransacoesGerais';
import CriarConta from '../pages/CriarConta/CriarConta';
import EditarDadosDaContaAdquirencia from '../pages/EditarDadosDaContaAdquirencia/EditarDadosDaContaAdquirencia';
import EditarDadosDaContaPjAdquirencia from '../pages/EditarDadosDaContaPjAdquirencia/EditarDadosDaContaPjAdquirencia';
import ManageFeesPadrao from '../pages/ManageFeesPadrao/ManageFeesPadrao';
import NewAccountFeesPadrao from '../pages/NewAccountFeesPadrao/NewAccountFeesPadrao';
import EditFeesPadrao from '../pages/EditFeesPadrao/EditFeesPadrao';
import TransacoesTarifas from '../pages/TransacoesTarifas/TransacoesTarifas';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		height: '100vh',
		width: px2vw('100%'),

		backgroundColor: '#fff',
	},
	sideBarContainer: {
		display: 'flex',
		FlexDirection: 'column',
		width: px2vw('25%'),
		height: '100vh',
	},
	contentAreaContainer: {
		backgroundColor: '#fff',
		width: '80%',
		padding: '0px 50px 0px 0px',
		marginLeft: px2vw(50),
		marginTop: px2vw(50),
		marginRight: px2vw(50),
		marginBottom: px2vw(10),
	},
	pageHeaderContainer: {
		backgroundColor: 'white',
		width: '75%',
		height: '35%',
	},
}));

const SwitchContents = () => {
	const classes = useStyles();
	const { section, id, subsection, subsectionId } = useParams();
	const token = useAuth();
	const auth = useAuth();
	const dispatch = useDispatch();
	const me = useSelector((state) => state.me);
	const userPermissao = useSelector((state) => state.userPermissao);
	const [tokenAuth, setTokenAuth] = useState('');
	const gerenciarPermissao = useSelector((state) => state.gerenciarPermissao);
	const [permissoes, setPermissoes] = useState([]);

	useEffect(() => {
		dispatch(postAuthMeAction(token));
	}, []);

	if (token) {
		window.$crisp = [];
		window.CRISP_WEBSITE_ID = APP_CONFIG.crispId;
		(function () {
			var d = document;
			var s = d.createElement('script');
			s.src = 'https://client.crisp.chat/l.js';
			s.async = 1;
			d.getElementsByTagName('head')[0].appendChild(s);
		})();
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
	useEffect(() => {
		const { permissao } = userPermissao;
		setPermissoes(permissao.map((item) => item.tipo));
	}, [userPermissao]);

	useEffect(() => {
		if (me.id !== undefined) {
			dispatch(loadPermissao(token, me.id));
		}
	}, [me.id]);

	let content = null;

	switch (section) {
		case 'home':
			content = <Dashboard />;
			break;

		case 'lista-de-contas':
			content = <ListaDeContas />;
			break;

		case 'criar-conta-adquirencia':
			content = <CriarConta />;
			break;

		case 'lista-de-contas-adquirencia':
			content = <ListaDeContasAdquirencia />;
			break;
			
		case 'lista-de-contas-estabelecimentos':
			content = <ListaDeContasEstabelecimentos />;
			break;

		case 'notificacoes':
			content = <Notificacoes />;
			break;

		case 'editar-conta':
			switch (id) {
				default:
					content =
						permissoes.includes(
							'Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)'
						) || permissoes.includes('Administrador - Acesso total') ? (
							<EditarDadosDaConta />
						) : null;
			}

			break;
		case 'editar-conta-pj':
			switch (id) {
				default:
					content =
						permissoes.includes(
							'Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)'
						) || permissoes.includes('Administrador - Acesso total') ? (
							<EditarDadosDaContaPj />
						) : null;
			}

			break;
		case 'editar-conta-adquirencia':
			switch (id) {
				default:
					content =
						permissoes.includes(
							'Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)'
						) || permissoes.includes('Administrador - Acesso total') ? (
							<EditarDadosDaContaAdquirencia />
						) : null;
			}

			break;
		case 'editar-conta-pj-adquirencia':
			switch (id) {
				default:
					content =
						permissoes.includes(
							'Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)'
						) || permissoes.includes('Administrador - Acesso total') ? (
							<EditarDadosDaContaPjAdquirencia />
						) : null;
			}

			break;

		case 'representantes':
			switch (id) {
				default:
					content = <ListaRepresentantes />;
					switch (subsection) {
						case 'plano-vendas-representante':
							content = <ListaPlanosDeVenda />;
							break;

						default:
					}
			}
			break;

		case 'gerenciar-contas':
			switch (id) {
				default:
					content =
						permissoes.includes(
							'Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação'
						) || permissoes.includes('Administrador - Acesso total') ? (
							<GerenciarListaDeContas />
						) : null;
					switch (subsection) {
						case 'cobrancas-credito':
							content = <CreditCardBillingList />;
							break;

						case 'boleto':
							content = <PaymentSlipList />;
							break;

						case 'carne':
							content = <PaymentBooklet />;
							break;

						case 'link-pagamento':
							content = <PaymentLink />;
							break;

						/* case 'lancamentos-futuros':
							content = <FutureTransactions />;
							break; */

						case 'extrato':
							content =
								permissoes.includes(
									'Atendimento - Consulta de extrato'
								) ||
								permissoes.includes('Administrador - Acesso total') ? (
									<AccountStatement />
								) : null;
							break;

						case 'assinaturas':
							content = <AccountSubscriptions />;
							break;

						case 'historico-de-transacoes':
							content =
								permissoes.includes(
									'Operações - Transações e histórico de transações não concluídas'
								) ||
								permissoes.includes('Administrador - Acesso total') ? (
									<TransactionHistory />
								) : null;

							break;

						case 'historico-transferencia':
							content = <TransferHistory />;

							break;

						case 'detalhes-transacao':
							content = <TransactionDetails />;

							break;

						case 'pagadores':
							content = <Payers />;
							break;

						case 'transferencia-ted':
							content = <TedTransactions />;
							break;

						case 'pagamento-conta':
							content = <PagamentoConta />;
							break;

						case 'transacoes-pix':
							content = <PixTransactions />;
							break;

						case 'chaves-pix':
							content = <ChavesPix />;
							break;

						case 'gift-cards':
							content = <GiftCardsList />;
							break;

						case 'detalhes-gift-card':
							content = <GiftCardDetails />;
							break;

						case 'recarga-celular':
							content = <RechargeCellphoneList />;
							break;

						case 'folha-de-pagamento':
							content = <ListaFolhaDePagamento />;
							break;

						case 'detalhes-recarga':
							content = <RechargeCellphoneDetails />;
							break;

						case 'detalhes-transferencia':
							content = <TransferDetails />;
							break;

						case 'detalhes-ted':
							content = <TedDetails />;
							break;

						case 'detalhes-pix':
							content = <PixDetails />;
							break;

						case 'terminais-pos':
							content = <ListaTerminaisPOS />;
							break;

						case 'detalhes-terminal-pos':
							content = <DetalhesTerminalPOS />;

							break;

						case 'exportacoes-solicitadas':
							content = <ListaExportacoesSolicitadas />;
							break;

						case 'tarifas':
							content = <ListaTarifas />;
							break;

						case 'extrato-adquirencia':
							content = <ListaExtratoAdquirencia />;
							break;

						default:
					}
			}
			break;

		case 'transacoes':
			content = <ListaTransacoesGerais />;
			break;

		case 'transacoes-pix':
			content = <TransacaoPix />;
			break;

		case 'transacoes-p2p':
			content = <TransacaoP2p />;
			break;

		case 'transacoes-ted':
			content = <TransacaoTed />;
			break;

		case 'transacoes-pagamento-conta':
			content = <TransacaoPagamentoConta />;
			break;

		case 'transacoes-pagamento-boleto':
			content = <TransacaoPagamentoBoleto />;
			break;

		case 'lista-de-administradores':
			switch (id) {
				default:
					content =
						permissoes.includes(
							'Operações - Gerencimento de administradores'
						) || permissoes.includes('Administrador - Acesso total') ? (
							<ListaDeAdministradores />
						) : null;
					switch (subsection) {
						case 'permissoes':
							content =
								permissoes.includes(
									'Operações - Gerencimento de administradores'
								) ||
								permissoes.includes('Administrador - Acesso total') ? (
									<UserPermissions />
								) : null;
							break;

						default:
					}
			}
			break;

		case 'taxas':
			content = <ManageFees />;
			break;

		case 'taxa-padrao':
			content = <ManageFeesPadrao />;
			break;

		case 'parceiros':
			content = <ListPartner />;
			break;

		/* case 'representantes':
			content = <ListaRepresentantes />;
			break; */

		case 'banners':
			content = <ListaDeBanners />;
			break;

		case 'plano-vendas-zoop':
			content = <ListaPlanosDeVendaZoop />;
			break;

		/* case 'plano-vendas':
			content = <ListaPlanosDeVenda />;
			break; */

		case 'plano-de-venda':
			switch (id) {
				default:
					content = <PlanoDeVendaDetalhes />;
					break;
			}
			break;

		case 'plano-de-venda-zoop':
			switch (id) {
				default:
					content = <PlanoDeVendaDetalhesZoop />;
					break;
			}
			break;

		case 'plano-vendas':
			switch (id) {
				default:
					content = <ListaPlanosDeVenda />;

					switch (subsection) {
						case 'detalhes':
							<PlanoDeVendaDetalhes />;

							break;

						default:
					}
			}
			break;

		case 'jeitto':
			content =
				permissoes.includes('Parceiros - Visualizar Jeitto') ||
				permissoes.includes('Administrador - Acesso total') ? (
					<JeittoAdm />
				) : null;
			break;

		case 'recarga-celular-admin':
			content =
				permissoes.includes('Parceiros - Visualizar Recargar') ||
				permissoes.includes('Administrador - Acesso total') ? (
					<RechargeCellphoneListAdmin />
				) : null;
			break;

		case 'gift-cards-admin':
			content =
				permissoes.includes('Parceiros - Visualizar GiftCard') ||
				permissoes.includes('Administrador - Acesso total') ? (
					<GiftCardsListAdmin />
				) : null;
			break;

		case 'logs':
			content =
				permissoes.includes('Operações - Visualizar Logs') ||
				permissoes.includes('Administrador - Acesso total') ? (
					<Logs />
				) : null;
			break;

		case 'taxa':
			switch (subsection) {
				case 'editar': {
					switch (id) {
						default:
							content = <EditFees />;
							break;
					}
					break;
				}
				case 'editar-padrao': {
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

		case 'nova-taxa':
			content = <NewAccountFees />;
			break;

		case 'nova-taxa-padrao':
			content = <NewAccountFeesPadrao />;
			break;

		case 'transacoes-tarifas':
			content = <TransacoesTarifas />;
			break;

		case 'lista-pre-contas':
			content = <GerenciarListaPreContas />;
			break;

		case 'lista-dispositivos-bloqueados':
			content = <ListaDispositivosBloqueados />;
			break;

		case 'blacklist':
			content = <Blacklist />;
			break;

		case 'cartoes':
			content = <ListaDeCartoes />;
			break;

		case 'detalhes-pre-conta':
			switch (id) {
				default:
					content = <DetalhesPreConta />;
					break;
			}
			break;

		case 'apoio-financeiro':
			content =
				permissoes.includes('Administrador - Acesso total') ||
				permissoes.includes('Crédito - Proposta Apoio Financeiro') ? (
					<ProposalFinancialSupport />
				) : null;

			if (subsection === 'gerenciar-contas') {
				content =
					permissoes.includes('Administrador - Acesso total') ||
					permissoes.includes('Crédito - Proposta Apoio Financeiro') ? (
						<ProposalFinancialSupportAccounts />
					) : null;
			}

			if (subsection === 'info') {
				content =
					permissoes.includes('Administrador - Acesso total') ||
					permissoes.includes('Crédito - Proposta Apoio Financeiro') ? (
						<FinancialSupport />
					) : null;
			}

			if (subsection === 'listagem') {
				content =
					permissoes.includes('Administrador - Acesso total') ||
					permissoes.includes('Crédito - Apoio Financeiro') ? (
						<FinancialSupportListPage />
					) : null;
			}

			if (subsection === 'proposta') {
				content =
					permissoes.includes('Administrador - Acesso total') ||
					permissoes.includes('Crédito - Apoio Financeiro') ? (
						<FinancialSupportItemPage />
					) : null;
			}
			break;

		case 'antecipacao-salarial':
			content =
				permissoes.includes('Administrador - Acesso total') ||
				permissoes.includes('Crédito - Proposta Apoio Financeiro') ? (
					<ProposalAntecipacaoSalarial />
				) : null;

			if (subsection === 'gerenciar-contas') {
				content =
					permissoes.includes('Administrador - Acesso total') ||
					permissoes.includes('Crédito - Proposta Apoio Financeiro') ? (
						<ProposalAntecipacaoSalarialAccounts />
					) : null;
			}

			if (subsection === 'info') {
				content =
					permissoes.includes('Administrador - Acesso total') ||
					permissoes.includes('Crédito - Proposta Apoio Financeiro') ? (
						<AntecipacaoSalarial />
					) : null;
			}

			if (subsection === 'listagem') {
				content =
					permissoes.includes('Administrador - Acesso total') ||
					permissoes.includes('Crédito - Apoio Financeiro') ? (
						<AntecipacaoSalarialListPage />
					) : null;
			}

			if (subsection === 'proposta') {
				content =
					permissoes.includes('Administrador - Acesso total') ||
					permissoes.includes('Crédito - Apoio Financeiro') ? (
						<AntecipacaoSalarialItemPage />
					) : null;
			}
			break;

		default:
			content = null;
			break;
	}

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
