import '../../fonts/Montserrat-SemiBold.otf';

import { Box, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import {
	filters_historico_pix,
	filters_historico_ted,
	filters_historico_transacoes,
	filters_historico_transferencia,
} from '../../constants/localStorageStrings';

import AccountCollections from '../../components/AccountCollections/AccountCollections';
import { useParams } from 'react-router';
import { APP_CONFIG } from '../../constants/config';

const useStyles = makeStyles((theme) => ({
	root: {
		position: 'absolute',
		display: 'flex',
		flexDirection: 'column',
	},
	headerContainer: {
		/* padding: '80px 400px ', */
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		marginBottom: '25px',
	},
	pageTitle: {
		color: '#c6930a',
		fontFamily: 'Montserrat-SemiBold',
	},
	subTitleContainer: {
		margin: '15px 15px',
		display: 'flex',
		justifyContent: 'space-between',
	},
	contentContainer: {
		marginTop: '20px',
	},
}));

const GerenciarListaDeContas = () => {
	const classes = useStyles();
	const { subsection } = useParams();

	useEffect(() => {
		localStorage.removeItem(filters_historico_transacoes);
		localStorage.removeItem(filters_historico_transferencia);
		localStorage.removeItem(filters_historico_ted);
		localStorage.removeItem(filters_historico_pix);
	}, []);

	return (
		<Box className={classes.root}>
			<AccountCollections
				ted
				pix
				pagamentoConta
				chavespix
				cartao
				boleto
				carne
				assinaturas
				link
				cobranca
				extrato
				extrato_adquirencia
				historicoTransacoes
				lancamentosFuturos
				realizarTransferencia
				historicoTransferencia
				criarContaDigital
				pagadores
				solicitarCartao
				cartoesPre
				terminais
				giftCard
				exportacoesSolicitadas
				recarga
				tarifas
				folhaPagamento={
					subsection === 'lista-conta-juridica' ? true : false
				}
				todos={true}
				area="Todos"
			/>
		</Box>
	);
};

export default GerenciarListaDeContas;
