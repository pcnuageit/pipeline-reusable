import React, { useEffect, useState } from 'react';
import {
	faBarcode,
	faCheck,
	faCopy,
	faCreditCard,
	faDesktop,
	faDollarSign,
	faForward,
	faHandHoldingUsd,
	faHistory,
	faLink,
	faMobile,
	faSignOutAlt,
	faTags,
	faUndo,
	faUsers,
	faWallet,
	faGift,
	faMobileAlt,
	faBookmark,
	faListAlt,
	faMoneyBill,faArchive, faDolly, faMoneyBillWave, faListOl, faListUl, faThList, faList
} from '@fortawesome/free-solid-svg-icons';
import { Box, makeStyles, Typography } from '@material-ui/core';
import AccountCollectionItem from './AccountCollectionItem/AccountCollectionItem';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { loadPermissao, postAuthMeAction } from '../../actions/actions';
import useAuth from '../../hooks/useAuth';
import { APP_CONFIG } from '../../constants/config';

const useStyles = makeStyles((theme) => ({
	accountCollectionContainer: {
		width: '60%',
		display: 'flex',
		height: '100%',
		flexDirection: 'column',
		color: theme.palette.primary.main,
		[theme.breakpoints.down(850)]: {
			width: '100%',
		},
	},
}));

const AccountCollections = ({
	ted,
	pix,
	pagamentoConta,
	chavespix,
	cartao,
	boleto,
	carne,
	assinaturas,
	cobranca,
	link,
	extrato,
	historicoTransacoes,
	lancamentosFuturos,
	realizarTransferencia,
	historicoTransferencia,
	criarContaDigital,
	pagadores,
	solicitarCartao,
	cartoesPre,
	terminais,
	area,
	todos,
	giftCard,
	recarga,
	folhaPagamento,exportacoesSolicitadas,tarifas,extrato_adquirencia
}) => {
const [permissoes, setPermissoes] = useState([]);
const token = useAuth();
const me = useSelector((state) => state.me);
const userPermissao = useSelector((state) => state.userPermissao);
const dispatch = useDispatch();
	const classes = useStyles();
	const {id} = useParams();

	/* const userPermissao = useSelector((state) => state.userPermissao);
	const [permissoes, setPermissoes] = useState([]);

	useEffect(() => {
		const { permissao } = userPermissao;
		setPermissoes(permissao.map((item) => item.tipo));
	}, [userPermissao]);

	useEffect(() => {
		return () => {
			setPermissoes([]);
		};
	}, []); */
	useEffect(() => {
		dispatch(postAuthMeAction(token));
	}, []);

	useEffect(() => {
		const { permissao } = userPermissao;
		setPermissoes(permissao.map((item) => item.tipo));
	}, [userPermissao]);

	useEffect(() => {
		if (me.id !== undefined) {
			dispatch(loadPermissao(token, me.id));
		}
	}, [me.id]);

	

	

	
		return (
			<Box className={classes.accountCollectionContainer}>
				<Typography variant="h6">{area}</Typography>
				<Box display="flex">
					{cartao ? (
						<AccountCollectionItem
							link=/* {permissoes.includes('Cobranca - Cartao') ?  */'cobrancas-credito'/*  : null} */
							text="Máquina Virtual"
							icon={faCreditCard}
						/>
					) : null}

					{boleto ? (
						<AccountCollectionItem
							link='boleto'
							text="Boleto"
							icon={faBarcode}
						/>
					) : null}

					{carne ? (
						<AccountCollectionItem
							link=/* {permissoes.includes('Cobranca - Carne') ?  */'carne'/*  : null} */
							text="Carnê"
							icon={faCopy}
						/>
					) : null}
				</Box>
				<Box display="flex">
					{link ? (
						<AccountCollectionItem
							link=/* {permissoes.includes('Cobranca - Link Pagamento') ?  */'link-pagamento'/*  : null} */
							text="Link de Pagamento"
							icon={faLink}
						/>
					) : null}

					{pagadores ? (
						<AccountCollectionItem
							link='pagadores'
							text="Pagadores"
							icon={faUsers}
						/>
					) : null}

					{extrato ? (
						<AccountCollectionItem
							link={permissoes.includes('Atendimento - Consulta de extrato') || permissoes.includes('Administrador - Acesso total') ? 'extrato' : null}
							text="Extrato"
							icon={faDollarSign}
						/>
					) : null}
					
				</Box>

				<Box display="flex">
					{assinaturas ? (
						<AccountCollectionItem
							link=/* {permissoes.includes('Cobranca - Assinatura') ?  */'assinaturas'/*  : null} */
							text="Cobrança Recorrente"
							icon={faUndo}
						/>
					) : null}
					{historicoTransacoes ? (
						<AccountCollectionItem
							link={
								permissoes.includes('Operações - Transações e histórico de transações não concluídas') || permissoes.includes('Administrador - Acesso total')
									? 'historico-de-transacoes'
									: null
							}
							text="Histórico de Transações"
							icon={faDesktop}
						/>
					) : null}
					
					
					{historicoTransferencia ? (
						<AccountCollectionItem
							link='historico-transferencia'
							text="Histórico de Transferência"
							icon={faHistory}
						/>
					) : null}
					
				</Box>
				<Box display='flex'>
					{ted ? (
						<AccountCollectionItem
						link='transferencia-ted'
						text="Transferência TED"
						icon={faUsers}
					/>
					): null}
					{pix ? (
						<AccountCollectionItem
						link='transacoes-pix'
						text="Transações PIX"
						icon={faWallet}
					/>
					): null}
					{chavespix ? (
						<AccountCollectionItem
						link='chaves-pix'
						text="Chaves PIX"
						icon={faTags}
					/>
					): null}
				</Box>
				<Box display='flex'>
					{pagamentoConta ? (
						<AccountCollectionItem
						link='pagamento-conta'
						text="Pagamento Conta"
						icon={faMoneyBill}
					/>
					): null}
					
					
				{/* {giftCard ? (
						<AccountCollectionItem
						link='gift-cards'
						text="Gift Card"
						icon={faGift}
					/>
					): null} */}
					{recarga ? (
						<AccountCollectionItem
						link='recarga-celular'
						text="Recarga"
						icon={faMobileAlt}
					/>):null}{extrato_adquirencia ? (
						<AccountCollectionItem
							link={'extrato-adquirencia'}
							text="Extrato Adquirência"
							icon={faList}
						/>
					) : null}
					
				</Box>
				<Box display='flex'>{terminais ? (
						<AccountCollectionItem
						link='terminais-pos'
						text="Terminais - POS"
						icon={faMobile}
					/>
					): null}
				{exportacoesSolicitadas ? (
						<AccountCollectionItem
							link={'exportacoes-solicitadas'}
							text="Exportações Solicitadas"
							icon={faArchive}
						/>
					) : null}
					{tarifas ? (
						<AccountCollectionItem
							link={'tarifas'}
							text="Tarifas"
							icon={faMoneyBill}
						/>
					) : null}
					
				</Box>
				<Box display='flex'>
					{folhaPagamento ? (
						<AccountCollectionItem
						link='folha-de-pagamento'
						text="Folha de Pagamento"
						icon={faListAlt}
					/>
					): null}
					{extrato_adquirencia ? (
						<AccountCollectionItem
							link={'extrato-adquirencia'}
							text="Extrato Benéficos"
							icon={faList}
						/>
					) : null}
				</Box>
			
			</Box>
		);
	} 


export default AccountCollections;
