import {
	Box,
	Button,
	LinearProgress,
	TextField,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable/CustomTable';
import SearchBar from '../../components/CustomTextField/CustomTextField';

import CustomBreadcrumbs from '../../components/CustomBreadcrumbs/CustomBreadcrumbs';

import { useDispatch, useSelector } from 'react-redux';
import { generatePath, Link, useHistory, useParams } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import { faCopy, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useDebounce from '../../hooks/useDebounce';
import useAuth from '../../hooks/useAuth';
import { loadLinkPagamentoFilter } from '../../actions/actions';
import { APP_CONFIG } from '../../constants/config';

const columns = [
	{
		headerText: 'Criado em',
		key: 'created_at',
		CustomValue: (data) => {
			const date = new Date(data);
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
		headerText: 'Link de acesso',
		key: 'id',
		CustomValue: (id) => {
			return (
				<Box display="flex" justifyContent="center">
					<TextField
						value={
							APP_CONFIG.linkDePagamento +
							'/link-pagamento/' +
							id +
							'/pagar'
						}
					/>
					<Tooltip title="Copiar">
						<CopyToClipboard
							text={
								APP_CONFIG.linkDePagamento +
								'/link-pagamento/' +
								id +
								'/pagar'
							}
						>
							<Button
								aria="Copiar"
								style={{
									marginLeft: '6px',
									width: '60px',
									height: '20px',
									alignSelf: 'center',
									color: 'green',
								}}
								onClick={() =>
									toast.success('Link copiado com sucesso', {
										autoClose: 2000,
									})
								}
							>
								<FontAwesomeIcon
									style={{ width: '60px', height: '20px' }}
									icon={faCopy}
								/>
							</Button>
						</CopyToClipboard>
					</Tooltip>
				</Box>
			);
		},
	},

	{
		headerText: 'Situação',
		key: 'status',
		CustomValue: (status) => {
			return status === 'Ativo' ? (
				<Typography
					style={{
						color: 'green',
						fontWeight: 'bold',
						borderRadius: '27px',
					}}
				>
					{status}
				</Typography>
			) : (
				<Typography
					style={{
						color: '#dfad06',
						fontWeight: 'bold',
						borderRadius: '27px',
					}}
				>
					{status}
				</Typography>
			);
		},
	},
	{ headerText: 'Parcelas', key: 'limite_parcelas' },
	{ headerText: 'Limite', key: 'quantidade_utilizacoes' },
	{
		headerText: 'Vencimento',
		key: 'vencimento',
		CustomValue: (data) => {
			if (data !== null) {
				const p = data.split(/\D/g);
				const dataFormatada = [p[2], p[1], p[0]].join('/');
				return <Typography align="center">{dataFormatada}</Typography>;
			}
		},
	},
	{
		headerText: 'Valor',
		key: 'valor',
		CustomValue: (valor) => {
			return (
				<>
					R${' '}
					{parseFloat(valor).toLocaleString('pt-br', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</>
			);
		},
	},
	{
		headerText: 'Descrição',
		key: 'descricao',
		CustomValue: (descricao) => {
			return (
				<Tooltip title={descricao ? descricao : 'Sem descrição'}>
					<Box>
						<FontAwesomeIcon icon={faQuestionCircle} />
					</Box>
				</Tooltip>
			);
		},
	},
];

const AccountStatement = () => {
	const token = useAuth();
	const [filters, setFilters] = useState({
		like: '',
		order: '',
		mostrar: '',
	});
	const debouncedLike = useDebounce(filters.like, 800);
	const dispatch = useDispatch();
	const [page, setPage] = useState(1);
	const theme = useTheme();
	const history = useHistory();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));
	const userData = useSelector((state) => state.userData);
	const { id } = useParams();
	useEffect(() => {
		return () => {
			setFilters({ ...filters });
		};
	}, []);

	useEffect(() => {
		dispatch(
			loadLinkPagamentoFilter(
				token,
				page,
				debouncedLike,
				filters.order,
				filters.mostrar,
				id
			)
		);
	}, [page, debouncedLike, filters.order, filters.mostrar, id]);

	const linkPagamentos = useSelector((state) => state.linkPagamentos);

	const handleChangePage = (e, value) => {
		setPage(value);
	};

	/* const handleClickRow = (row) => {
		const path = generatePath('/dashboard/detalhes-link/:id/ver', {
			id: row.id,
		});
		history.push(path);
	}; */

	return (
		<Box display="flex" flexDirection="column">
			<Box
				display="flex"
				justifyContent="space-between"
				flexDirection={matches ? 'column' : null}
			>
				<Typography
					style={{
						marginTop: '8px',
						color: APP_CONFIG.mainCollors.primary,
						marginBottom: 30,
					}}
					variant="h4"
				>
					Link de Pagamento
				</Typography>

				{/* {token && userData === '' ? null : (
					<Link to="novo-link-pagamento">
						<GradientButton buttonText="+Novo Link" />
					</Link>
				)} */}
			</Box>
			<Box
				style={{
					width: '100%',
					backgroundColor: APP_CONFIG.mainCollors.backgrounds,
					borderTopLeftRadius: 27,
					borderTopRightRadius: 27,
				}}
			>
				<Box marginTop="16px" marginBottom="16px" style={{ margin: 30 }}>
					<TextField
						variant="outlined"
						fullWidth
						placeholder="Pesquisar por valor, descrição, número do pedido..."
						value={filters.like}
						onChange={(e) =>
							setFilters({
								...filters,
								like: e.target.value,
							})
						}
					/>
				</Box>
			</Box>

			{linkPagamentos.data && linkPagamentos.per_page ? (
				<CustomTable
					columns={columns}
					data={linkPagamentos.data}
					/* handleClickRow={handleClickRow} */
				/>
			) : (
				<LinearProgress />
			)}
			<Box alignSelf="flex-end" marginTop="8px">
				<Pagination
					variant="outlined"
					color="secondary"
					size="large"
					count={linkPagamentos.last_page}
					onChange={handleChangePage}
					page={page}
				/>
			</Box>
		</Box>
	);
};

export default AccountStatement;
