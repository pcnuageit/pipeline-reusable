import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	LinearProgress,
	MenuItem,
	Select,
	TextField,
	Tooltip,
	Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { useAddAccountsMutation } from '../../../services/proposal';
import { useGetAccountsQuery } from '../../../../../services/api';
import useDebounce from '../../../../../hooks/useDebounce';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomTable from '../../../../../components/CustomTable/CustomTable';
import { APP_CONFIG } from '../../../../../constants/config';
import { InfoOutlined } from '@material-ui/icons';
import Popover from '../../../../FinancialSupport/components/Popover';

function AddAccountsDialog({ proposal, open = false, onClose = () => {} }) {
	const [addAccounts] = useAddAccountsMutation();
	const [page, setPage] = useState(1);
	const [contaPjId, setContaPjId] = useState('');
	const [accountIdListToAdd, setAccountIdListToAdd] = useState([]);
	const [showAccounts, setShowAccounts] = useState(false);
	const [filters, setFilters] = useState({
		like: '',
		pjLike: '',
		tipo: '1',
	});
	const debouncedLike = useDebounce(filters.like, 800);
	const debouncedPjLike = useDebounce(filters.pjLike, 800);

	const { data: accounts, isLoading: isLoadingAccounts } = useGetAccountsQuery(
		{
			except_proposta_id: proposal.id,
			conta_empresa_id: contaPjId,
			status: 'approved',
			tipo: '1',
			like: debouncedLike,
			page,
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	const { data: pjAccounts } = useGetAccountsQuery(
		{
			except_proposta_id: proposal.id,
			status: 'approved',
			tipo: '2',
			like: debouncedPjLike,
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	const handleSubmit = async () => {
		try {
			await addAccounts({
				proposalId: proposal.id,
				accountIdList: accountIdListToAdd,
			}).unwrap();

			toast.success('Proposta liberada para as contas com sucesso!');
			onClose();
		} catch (e) {
			toast.error('Erro ao liberar proposta para contas!');
		}
	};

	const handleSubmitPj = async () => {
		try {
			await addAccounts({
				proposalId: proposal.id,
				accountIdList: [contaPjId],
			}).unwrap();

			toast.success('Proposta liberada para as contas com sucesso!');
			onClose();
		} catch (e) {
			toast.error('Erro ao liberar proposta para contas!');
		}
	};

	const handleChangePage = (e, value) => {
		setPage(value);
	};

	const handleAddAccountId = (id) => {
		setAccountIdListToAdd((current) => [...current, id]);
	};

	const handleRemoveAccountId = (id) => {
		setAccountIdListToAdd((current) => {
			const copy = [...current];

			const key = copy.indexOf(id);
			copy.splice(key, 1);

			return copy;
		});
	};

	useEffect(() => {
		if (filters.tipo === '1') setShowAccounts(true);
		if (filters.tipo === '2' && contaPjId) setShowAccounts(true);
		if (filters.tipo === '2' && !contaPjId) setShowAccounts(false);
	}, [accounts, filters.tipo, contaPjId]);

	const columns = [
		{ headerText: 'ID', key: 'id' },
		{
			headerText: 'EC',
			key: 'custom_nome',
			FullObject: (conta) => conta.razao_social ?? conta.nome,
		},
		{
			headerText: 'Documento',
			key: 'custom_documento',
			FullObject: (conta) => conta.cnpj ?? conta.documento,
		},
		{ headerText: 'Email', key: 'email' },
		{
			headerText: 'Menu',
			key: 'custom_menu_delete',
			FullObject: (conta) => {
				if (conta.cnpj) return null;
				return accountIdListToAdd.includes(conta.id) ? (
					<Tooltip title="Cancelar">
						<IconButton onClick={() => handleRemoveAccountId(conta.id)}>
							<FontAwesomeIcon color="red" icon={faTimes} />
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip title="Adicionar">
						<IconButton
							onClick={() => {
								handleAddAccountId(conta.id);
							}}
						>
							<FontAwesomeIcon color="green" icon={faPlus} />
						</IconButton>
					</Tooltip>
				);
			},
		},
	];

	return accounts?.data ? (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="form-dialog-title"
			fullWidth
			maxWidth={'md'}
		>
			<DialogTitle>
				<Typography
					variant="h5"
					style={{
						color: APP_CONFIG.mainCollors.primary,
						fontFamily: 'Montserrat-SemiBold',
						marginBottom: '20px',
					}}
				>
					Liberar Proposta de Apoio Financeiro
				</Typography>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							size="small"
							placeholder="Pesquisar por nome, documento, email..."
							value={filters.like}
							onChange={(e) => {
								setPage(1);
								setFilters({
									...filters,
									like: e.target.value,
								});
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<Select
							style={{
								color: APP_CONFIG.mainCollors.secondary,
							}}
							fullWidth
							size="small"
							value={filters.tipo}
							onChange={(e) => {
								setPage(1);
								setFilters({ ...filters, tipo: e.target.value });
								setContaPjId('');
							}}
						>
							<MenuItem
								style={{
									color: APP_CONFIG.mainCollors.secondary,
								}}
								value={'1'}
							>
								Pessoa Física
							</MenuItem>
							<MenuItem
								style={{
									color: APP_CONFIG.mainCollors.secondary,
								}}
								value={'2'}
							>
								Pessoa Jurídica
							</MenuItem>
						</Select>
					</Grid>
					<Grid item xs={12} sm={3}>
						<Typography
							style={{
								color: APP_CONFIG.mainCollors.primary,
								fontFamily: 'Montserrat-SemiBold',
							}}
						>
							Contas selecionadas: {accountIdListToAdd.length}
						</Typography>
					</Grid>
					{filters.tipo === '2' && (
						<Grid item xs={12} sm={12}>
							<Autocomplete
								fullWidth
								options={pjAccounts.data}
								getOptionLabel={(account) =>
									account.razao_social
										? `${account.razao_social}, ${account.cnpj}, agência: ${account.agencia}, banco: ${account.banco}, conta: ${account.conta}`
										: `${account.nome}, ${account.documento}, agência: ${account.agencia}, banco: ${account.banco}, conta: ${account.conta}`
								}
								onInputChange={(_event, value, reason) => {
									if (reason !== 'reset') {
										setFilters({ ...filters, pjLike: value });
									}
								}}
								onChange={(_event, option) => {
									setContaPjId(option ? option.id : '');
								}}
								renderInput={(params) => (
									<TextField {...params} label="Conta PJ" />
								)}
							/>
						</Grid>
					)}
				</Grid>
			</DialogTitle>

			<DialogContent
				style={{
					minWidth: 500,
				}}
			>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={12}>
						{accounts && !isLoadingAccounts ? (
							<Box>
								{filters.tipo === '2' && (
									<Box
										display="flex"
										alignItems="center"
										marginBottom="10px"
									>
										<Typography
											variant="h6"
											style={{
												color: APP_CONFIG.mainCollors.primary,
												fontFamily: 'Montserrat-SemiBold',
											}}
										>
											Lista de Funcionários
										</Typography>
										<Popover buttonContent={<InfoOutlined />}>
											<Typography
												variant="body2"
												style={{
													maxWidth: '500px',
													textAlign: 'justify',
												}}
											>
												Lista de Funcionários que ainda não foram
												liberados para utilizar essa proposta de
												apoio financeiro.
											</Typography>
										</Popover>
										<Button
											variant="outlined"
											disabled={!contaPjId}
											onClick={handleSubmitPj}
											color="primary"
										>
											Liberar para empresa
										</Button>
										<Popover buttonContent={<InfoOutlined />}>
											<Typography
												variant="body2"
												style={{
													maxWidth: '500px',
													textAlign: 'justify',
												}}
											>
												Lista de Funcionários que ainda não foram
												liberados para utilizar essa proposta de
												apoio financeiro.
											</Typography>
										</Popover>
									</Box>
								)}
								<CustomTable
									columns={columns ?? []}
									data={showAccounts ? accounts?.data : []}
								/>
							</Box>
						) : (
							<Box>
								<LinearProgress color="secondary" />
							</Box>
						)}
					</Grid>
				</Grid>
			</DialogContent>

			<DialogActions>
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					width="100%"
					padding={2}
				>
					<Box>
						<Pagination
							variant="outlined"
							size="small"
							color="primary"
							count={accounts?.last_page}
							onChange={handleChangePage}
							page={page}
						/>
					</Box>
					<Box>
						<Button
							variant="outlined"
							onClick={onClose}
							style={{ marginRight: '10px' }}
						>
							Cancelar
						</Button>
						<Button
							variant="outlined"
							disabled={accountIdListToAdd.length === 0}
							onClick={() => setAccountIdListToAdd([])}
							style={{ marginRight: '10px' }}
						>
							Limpar
						</Button>
						<Button
							variant="outlined"
							disabled={accountIdListToAdd.length === 0}
							onClick={handleSubmit}
							color="primary"
						>
							Liberar
						</Button>
					</Box>
				</Box>
			</DialogActions>
		</Dialog>
	) : null;
}

export default AddAccountsDialog;
