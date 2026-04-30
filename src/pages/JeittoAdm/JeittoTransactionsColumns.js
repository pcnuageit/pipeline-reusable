import { Box, Typography } from '@material-ui/core';
import React from 'react';

const columns = [
	{
		headerText: 'Criado em',
		key: 'created_at',
		CustomValue: (created_at) => {
			const date = new Date(created_at);
			const option = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
			};
			const formatted = date.toLocaleDateString('pt-br', option);
			return <Typography align="center"> {formatted}</Typography>;
		},
	},
	{
		headerText: 'Expira em',
		key: 'expiration_date',
		CustomValue: (expiration_date) => {
			const date = new Date(expiration_date + ' 12:00:00');
			const option = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
			};
			const formatted = date.toLocaleDateString('pt-br', option);
			return <Typography align="center"> {formatted}</Typography>;
		},
	},
	{
		headerText: 'Nome',
		key: 'name',
		CustomValue: (name) => (
			<Box display="flex" flexDirection="column">
				<Typography>{name}</Typography>
			</Box>
		),
	},
	{
		headerText: 'CPF',
		key: 'cpf',
		CustomValue: (cpf) => (
			<Box display="flex" flexDirection="column">
				<Typography>{cpf}</Typography>
			</Box>
		),
	},
	{
		headerText: 'Status',
		key: 'status',
		CustomValue: (status) => {
			if (status === 8) {
				return (
					<Box
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Box
							style={{
								borderRadius: 32,
								backgroundColor: '#ECC9D2',
								maxWidth: '120px',
								padding: '5px',
							}}
						>
							<Typography style={{ color: '#ED757D', width: '100%' }}>
								NEGADO
							</Typography>
						</Box>
					</Box>
				);
			}
			if (status === 7) {
				return (
					<Box
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Box
							style={{
								borderRadius: 32,
								backgroundColor: '#ECC9D2',
								maxWidth: '120px',
								padding: '5px',
							}}
						>
							<Typography style={{ color: '#ED757D', width: '100%' }}>
								LIMITE BLOQUEADO
							</Typography>
						</Box>
					</Box>
				);
			}
			if (status === 6) {
				return (
					<Box
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Box
							style={{
								borderRadius: 32,
								backgroundColor: '#ECC9D2',
								maxWidth: '120px',
								padding: '5px',
							}}
						>
							<Typography style={{ color: '#ED757D', width: '100%' }}>
								VALOR NÃO ALCANÇADO
							</Typography>
						</Box>
					</Box>
				);
			}
			if (status === 5 || status === 3) {
				return (
					<Box
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Box
							style={{
								borderRadius: 32,
								backgroundColor: '#ECC9D2',
								maxWidth: '120px',
								padding: '5px',
							}}
						>
							<Typography style={{ color: '#ED757D', width: '100%' }}>
								SEM LIMITE
							</Typography>
						</Box>
					</Box>
				);
			}
			if (status === 4) {
				return (
					<Box
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Box
							style={{
								borderRadius: 32,
								backgroundColor: '#ECC9D2',
								maxWidth: '120px',
								padding: '5px',
							}}
						>
							<Typography style={{ color: '#ED757D', width: '100%' }}>
								ERRO TRANSAÇÃO
							</Typography>
						</Box>
					</Box>
				);
			}
			if (status === 2) {
				return (
					<Box
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Box
							style={{
								borderRadius: 32,
								backgroundColor: '#C9ECE7',
								maxWidth: '120px',
								padding: '5px',
							}}
						>
							<Typography style={{ color: '#00B57D', width: '100%' }}>
								CONFIRMADA
							</Typography>
						</Box>
					</Box>
				);
			}
			if (status === 1) {
				return (
					<Box
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Box
							style={{
								borderRadius: 32,
								backgroundColor: '#ECC9D2',
								maxWidth: '120px',
								padding: '5px',
							}}
						>
							<Typography style={{ color: '#ED757D', width: '100%' }}>
								EXPIRADA
							</Typography>
						</Box>
					</Box>
				);
			}
			if (status === 0) {
				return (
					<Box
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Box
							style={{
								borderRadius: 32,
								backgroundColor: '#F1E3D4',
								maxWidth: '120px',
								padding: '5px',
							}}
						>
							<Typography style={{ color: 'orange', width: '100%' }}>
								PENDENTE
							</Typography>
						</Box>
					</Box>
				);
			}
		},
	},

	{
		headerText: 'Descrição do status',
		key: 'status_description',
		CustomValue: (status_description) => (
			<Typography>{status_description}</Typography>
		),
	},

	{
		headerText: 'Valor',
		key: 'value',
		CustomValue: (value) => <Typography>R$ {value}</Typography>,
	},

	{
		headerText: 'NSU',
		key: 'nsu_transaction',
		CustomValue: (nsu_transaction) => {
			return <Typography>{nsu_transaction}</Typography>;
		},
	},
	{
		headerText: 'Email',
		key: 'email',
		CustomValue: (email) => {
			return <Typography>{email}</Typography>;
		},
	},
	{
		headerText: 'Código da agência',
		key: 'agency_code',
		CustomValue: (agency_code) => {
			return <Typography>{agency_code}</Typography>;
		},
	},
];

export default columns;
