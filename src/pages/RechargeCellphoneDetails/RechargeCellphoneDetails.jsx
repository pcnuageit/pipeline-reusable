import {
	Box,
	CircularProgress,
	Paper,
	Typography,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
	loadDetalhesGiftCard,
	loadDetalhesRecarga,
} from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import CustomBreadcrumbs from '../../components/CustomBreadcrumbs/CustomBreadcrumbs';
import CustomTable from '../../components/CustomTable/CustomTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import useAuth from '../../hooks/useAuth';
import moment from 'moment';
import 'moment/locale/pt-br';
import { APP_CONFIG } from '../../constants/config';

const columns = [
	{
		headerText: 'Criado em',
		key: 'created_at',
		CustomValue: (data) => {
			/* 	const date = new Date(data);
			const option = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
			 	second: 'numeric'
			};
			const formatted = date.toLocaleDateString('pt-br', option);
			return (
				<Box display="flex" justifyContent="center">
					<FontAwesomeIcon icon={faCalendarAlt} size="lg" />
					<Typography style={{ marginLeft: '6px' }}>{formatted}</Typography>
				</Box>
			); */
			return (
				<Box
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<FontAwesomeIcon icon={faCalendarAlt} size="lg" />
					{moment.utc(data).format('DD MMMM YYYY, hh:mm')}
				</Box>
			);
		},
	},
	{
		headerText: 'Id da transferência',
		key: '',
		FullObject: (obj) => {
			return (
				<Typography>
					{obj.transferencia ? obj.transferencia.id : 'Não realizada'}
				</Typography>
			);
		},
	},
	{
		headerText: 'Operadora',
		key: 'produto_celcoin',
		FullObject: (obj) => {
			return (
				<Typography>{obj.celular ? obj.celular.operadora : ''}</Typography>
			);
		},
	},
	{
		headerText: 'Situação',
		key: 'status',
		CustomValue: (status) => {
			if (
				status === 'SUCESSO' ||
				status === 'Confirmada' ||
				status === 'Aprovado' ||
				status === 'Criada'
			) {
				return (
					<Typography
						style={{
							color: 'green',
							fontWeight: 'bold',

							borderRadius: '27px',
						}}
					>
						{status}
					</Typography>
				);
			}
			if (status === 'Pendente') {
				return (
					<Typography
						style={{
							color: '#CCCC00',
							fontWeight: 'bold',

							borderRadius: '27px',
						}}
					>
						{status}
					</Typography>
				);
			}
			return (
				<Typography
					style={{
						color: 'red',
						fontWeight: 'bold',
						borderRadius: '27px',
					}}
				>
					{status}
				</Typography>
			);
		},
	},
	{
		headerText: 'Valor',
		key: 'valor',
		CustomValue: (valor) => {
			return (
				<Typography>
					R$ <b>{valor}</b>
				</Typography>
			);
		},
	},
];

const RechargeCellphoneDetails = () => {
	const token = useAuth();
	const history = useHistory();
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));
	const { subsectionId } = useParams();
	const dispatch = useDispatch();
	const detalhesRecarga = useSelector((state) => state.detalhesRecarga);
	const userData = useSelector((state) => state.userData);

	const [arrayObject, setArrayObject] = useState([{}]);

	moment.locale('pt-br');

	useEffect(() => {
		if (subsectionId) {
			dispatch(loadDetalhesRecarga(token, subsectionId));
		}
	}, [subsectionId]);

	useEffect(() => {
		if (detalhesRecarga.created_at) {
			setArrayObject([detalhesRecarga]);
		}
	}, [detalhesRecarga]);

	return detalhesRecarga.id ? (
		<Box
			display="flex"
			flexDirection="column"
			style={{ position: 'absolute', maxWidth: 1200 }}
		>
			<Paper
				style={{
					width: '100%',
					justifyContent: 'center',

					display: 'flex',
					flexDirection: 'column',
					padding: 16,
				}}
			>
				<Typography variant="h4" style={{ marginBottom: 16 }}>
					Detalhes
				</Typography>
				<CustomTable data={arrayObject} columns={columns} />

				<Typography style={{ margin: '10px 0' }}>
					<b>Número</b>: {detalhesRecarga.celular.numero}
				</Typography>
				<Typography paragraph align="justify" style={{ margin: '10px 0' }}>
					<b>Protocolo</b>:{' '}
					{detalhesRecarga.transaction_celcoin.receipt.receiptformatted}
				</Typography>
			</Paper>
		</Box>
	) : (
		<CircularProgress />
	);
};

export default RechargeCellphoneDetails;
