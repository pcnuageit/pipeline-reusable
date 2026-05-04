import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCopy, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "moment/locale/pt-br";
import CopyToClipboard from "react-copy-to-clipboard";
/* import AddSalesPlanSubscriptionModal from "./AddSalesPlanSubscriptionModal"; */

import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
/* import FeeDetails from "./FeeDetails"; */
import CustomButton from "../../components/CustomButton/CustomButton";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

import {
  delPlanoVendasAction,
  getPlanosDeVendasZoopIDAction,
  loadUserData,
  postCriarTaxasPadraoAction,
  postPlanosDeVendasZoopAction,
} from "../../actions/actions";
import AddAgentSalesPlanSubscriptionModal from "../../components/AddAgentSalesPlanSubscriptionModal/AddAgentSalesPlanSubscriptionModal";
import FeeDetails from "../../components/FeeDetails/FeeDetails";
import { documentMask } from "../../utils/documentMask";

const useStyles = makeStyles((theme) => ({
  dialogHeader: {
    background: APP_CONFIG.mainCollors.primary,
    color: "white",
  },
  inputLabelNoShrink: {
    transform: "translate(45px, 15px) scale(1)",
  },
}));

const PlanoDeVendaDetalhesZoop = () => {
  const classes = useStyles();
  const id = useParams()?.id ?? "";
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  /* const subscriptions = useSelector((state) => state.minhasTaxas); */
  const salesPlan = useSelector((state) => state.planoVendasZoopID);
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [openCreateDefaultFees, setOpenCreateDefaultFees] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddSubscriptionDialog, setOpenAddSubscriptionDialog] =
    useState(false);
  const [openRemoveSubscriptionDialog, setOpenRemoveSubscriptionDialog] =
    useState(false);
  const [openStoreDialog, setOpenStoreDialog] = useState(false);
  const [page, setPage] = useState(1);

  const [subscriptionToDelete, setSubscriptionToDelete] = useState({});

  const [filters, setFilters] = useState({
    like: "",
  });

  const debouncedFilters = useDebounce(filters, 800);

  const shrink = filters.like.length > 0;

  const columns = [
    { headerText: "ID Assinatura", key: "id" },
    {
      headerText: "EC",
      key: "ec_name",
      Teste: (item) => (
        <Typography>
          {item?.conta?.razao_social ?? item?.conta?.nome}
        </Typography>
      ),
    },
    { headerText: "Email", key: "conta.email" },
    {
      headerText: "Documento",
      key: "teste_1",
      Teste: (item) => (
        <Typography>
          {documentMask(item?.conta?.cnpj ?? item?.conta?.documento)}
        </Typography>
      ),
    },
    {
      headerText: "Menu",
      key: "teste_2",
      Teste: (item) => {
        return (
          <Tooltip title="Remover assinatura">
            <IconButton
              onClick={() => {
                setSubscriptionToDelete(item);
                setOpenRemoveSubscriptionDialog(true);
              }}
            >
              <FontAwesomeIcon icon={faMinusCircle} />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    if (userData) {
      dispatch(getPlanosDeVendasZoopIDAction(token, id));
    }
  }, [userData]);

  /* useEffect(() => {
		if (userData) {
			dispatch(getMinhasTaxasAction(token, id));
		}
	}, [userData]); */

  /* useEffect(() => {
		if (isErrorSalesPlan) {
			toast.error('Aconteceu um erro tente novamente!');
			history.goBack();
		}
	}, [isErrorSalesPlan, history]); */

  const handleChangePage = useCallback((e, value) => {
    setPage(value);
  }, []);

  /* 	const handleCreateDefaultFees = async () => {
		setIsLoading(true);
		try {
		  await createDefaultFees({ sales_plan_id: id }).unwrap();
		  toast.success("Tarifas da aplicação criadas com sucesso!");
		  refetchSalesPlan();
		} catch (e) {
		  toast.error("Erro ao criar tarifas da aplicação!");
		  if(e.status === 403 && e.data?.message) toast.error(e.data.message);
		} finally {
		  setOpenCreateDefaultFees(false);
		  setIsLoading(false);
		}
	 }; */

  const handleCreateDefaultFees = async () => {
    setLoading(true);
    const resCriarTaxaPadrao = await dispatch(
      postCriarTaxasPadraoAction(token, id)
    );
    if (resCriarTaxaPadrao) {
      toast.error("Erro ao criar tarifas da aplicação!");
      setOpenCreateDefaultFees(false);
      setLoading(false);
    } else {
      toast.success("Tarifas da aplicação criadas com sucesso!");
      setOpenCreateDefaultFees(false);
      setLoading(false);
    }
  };

  /* const handleSetDefaultSalesPlan = async () => {
		setLoading(true);
		const resSetPlanoPadrao = await dispatch(
			postSetPlanoPadraoAction(token, id)
		);
		if (resSetPlanoPadrao) {
			toast.error('Erro ao definir Plano de Venda como padrão!');
			setOpenCreateDefaultFees(false);
			setLoading(false);
		} else {
			toast.success('Plano de Venda definido como padrão!');
			setOpenCreateDefaultFees(false);
			setLoading(false);
		}
	}; */

  const handleStoreSalesPlan = async () => {
    setLoading(true);
    const resPostPlanoVendasZoop = await dispatch(
      postPlanosDeVendasZoopAction(token, id)
    );
    if (resPostPlanoVendasZoop) {
      toast.error("Erro ao excluir Plano de Venda!");
      setOpenStoreDialog(false);
      setLoading(false);
    } else {
      toast.success("Plano de Venda excluido!");
      setOpenStoreDialog(false);
      setLoading(false);
    }
  };

  const handleDeleteSalesPlan = async () => {
    setLoading(true);
    const resDelPlanoVenda = await dispatch(delPlanoVendasAction(token, id));
    if (resDelPlanoVenda) {
      toast.error("Erro ao excluir Plano de Venda!");
      setOpenDeleteDialog(false);
      setLoading(false);
    } else {
      toast.success("Plano de Venda excluido!");
      setOpenDeleteDialog(false);
      setLoading(false);
    }
  };

  return (
    <>
      {salesPlan && salesPlan.fee_details ? (
        <Box display="flex" flexDirection="column">
          <LoadingScreen style={{ zIndex: "10" }} isLoading={loading} />

          <Box
            display="flex"
            justifyContent="space-between"
            flexDirection={matches ? "column" : null}
          >
            <Typography
              style={{
                marginTop: "8px",
                marginBottom: 30,
                color: APP_CONFIG.mainCollors.primary,
              }}
              variant="h4"
            >
              Plano de Vendas
            </Typography>
          </Box>

          {/* {salesPlan?.source === 'aplication' && (
						
					)} */}
          {/* <AddAplicationSalesPlanSubscriptionModal
						openDialog={openAddSubscriptionDialog}
						setOpenDialog={setOpenAddSubscriptionDialog}
						planId={id}
						isLoading={loading}
						setIsLoading={setLoading}
					/> */}

          {/* {salesPlan?.source === 'agent' && (
						
					)} */}
          <AddAgentSalesPlanSubscriptionModal
            openDialog={openAddSubscriptionDialog}
            setOpenDialog={setOpenAddSubscriptionDialog}
            planId={id}
            isLoading={loading}
            setIsLoading={setLoading}
            agentId={salesPlan.agent_id}
          />

          {openStoreDialog && (
            <Dialog
              open={openStoreDialog}
              onClose={() => setOpenStoreDialog(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              style={{ zIndex: "1" }}
            >
              <DialogTitle className={classes.dialogHeader}>
                <Typography align="center" variant="h6">
                  Adicionar Plano de Venda
                </Typography>
              </DialogTitle>
              <Box display="flex" flexDirection="column" padding="12px 24px">
                <Typography>
                  {"Deseja realmente adicionar este Plano de Vendas na Aplicação " +
                    APP_CONFIG.name +
                    "?"}
                </Typography>
              </Box>
              <DialogActions>
                <Button
                  onClick={handleStoreSalesPlan}
                  variant="outlined"
                  color="secondary"
                >
                  Adicionar
                </Button>
                <Button
                  onClick={() => setOpenStoreDialog(false)}
                  color="default"
                  variant="outlined"
                  autoFocus
                >
                  Cancelar
                </Button>
              </DialogActions>
            </Dialog>
          )}

          {/* {openCreateDefaultFees && (
						<Dialog
							open={openCreateDefaultFees}
							onClose={() => {
								setSubscriptionToDelete({});
								setOpenCreateDefaultFees(false);
							}}
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
							style={{ zIndex: 1000 }}
						>
							<DialogTitle className={classes.dialogHeader}>
								<Typography align="center" variant="h6">
									Criar Tarifas Padrão
								</Typography>
							</DialogTitle>
							<Box
								display="flex"
								flexDirection="column"
								padding="12px 24px"
							>
								<Typography>
									{`Deseja realmente criar tarifas da aplicação ${APP_CONFIG.name} para o Plano de Vendas ${salesPlan.name}?`}
								</Typography>
							</Box>
							<DialogActions>
								<Button
									onClick={handleCreateDefaultFees}
									variant="outlined"
									color="default"
								>
									Criar
								</Button>
								<Button
									onClick={() => {
										setOpenCreateDefaultFees(false);
									}}
									color="default"
									variant="outlined"
									autoFocus
								>
									Cancelar
								</Button>
							</DialogActions>
						</Dialog>
					)}
 */}
          {/* {openDeleteDialog && (
						<Dialog
							open={openDeleteDialog}
							onClose={() => setOpenDeleteDialog(false)}
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
							style={{ zIndex: '1' }}
						>
							<DialogTitle className={classes.dialogHeader}>
								<Typography
									style={{ color: APP_CONFIG.mainCollors.primary }}
									align="center"
									variant="h6"
								>
									Remover Plano de Venda
								</Typography>
							</DialogTitle>
							<Box
								display="flex"
								flexDirection="column"
								padding="12px 24px"
							>
								<Typography
									style={{ color: APP_CONFIG.mainCollors.primary }}
								>
									{'Deseja realmente remover este Plano de Vendas da Aplicação ' +
										APP_CONFIG.name +
										'?'}
								</Typography>
							</Box>
							<DialogActions>
								<Button
									style={{ color: APP_CONFIG.mainCollors.primary }}
									onClick={handleDeleteSalesPlan}
									variant="outlined"
								>
									Sim
								</Button>
								<Button
									style={{ color: APP_CONFIG.mainCollors.primary }}
									onClick={() => setOpenDeleteDialog(false)}
									variant="outlined"
									autoFocus
								>
									Cancelar
								</Button>
							</DialogActions>
						</Dialog>
					)} */}

          <Box style={{ padding: "10px" }}>
            <Box
              style={{
                display: "flex",
                flexWrap: "wrap",
                padding: "40px",
                borderRadius: "27px",
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
              }}
            >
              <Box display="flex" flexDirection="column" flexGrow={1}>
                <Typography
                  style={{ color: APP_CONFIG.mainCollors.primary }}
                  variant="h6"
                >
                  Detalhes do Plano de Vendas:
                </Typography>
                <Box display="flex" flexWrap="wrap" marginTop="12px">
                  <Box flexGrow={1}>
                    <Typography
                      style={{
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                      variant="h6"
                    >
                      ID do Plano de Vendas: <br />
                      <Box width="100%" maxWidth={330} display="flex">
                        <TextField
                          fullWidth
                          value={salesPlan.id ? salesPlan.id : "-"}
                        />
                        <Tooltip title="Copiar ID da transação">
                          <CopyToClipboard
                            text={salesPlan.id ? salesPlan.id : "-"}
                          >
                            <Button
                              aria="Copiar"
                              style={{
                                marginLeft: "8px",
                                padding: 0,
                                minWidth: 0,
                                width: "20px",
                                height: "20px",
                                alignSelf: "center",
                                color: "green",
                              }}
                              onClick={() =>
                                toast.success(
                                  "Copiado para area de transferência",
                                  {
                                    autoClose: 2000,
                                  }
                                )
                              }
                            >
                              <FontAwesomeIcon
                                style={{
                                  width: "20px",
                                  height: "20px",
                                }}
                                icon={faCopy}
                              />
                            </Button>
                          </CopyToClipboard>
                        </Tooltip>
                      </Box>
                    </Typography>
                    <Box marginTop="12px">
                      <Typography
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                      >
                        Nome:
                      </Typography>
                      <Typography
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                        variant="h6"
                      >
                        {salesPlan.name ?? "-"}
                      </Typography>
                    </Box>
                    <Box marginTop="12px">
                      <Typography
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                      >
                        Situação do Plano de Vendas:
                      </Typography>
                      <Typography
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                        variant="h6"
                      >
                        {salesPlan &&
                        salesPlan.sales_plan &&
                        salesPlan.sales_plan.is_active
                          ? "Ativo"
                          : "Inativo"}
                      </Typography>
                    </Box>
                    <Box marginTop="12px">
                      <Typography
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                      >
                        Total de ECs neste Plano de Vendas:
                      </Typography>
                      <Typography
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                        variant="h6"
                      >
                        {salesPlan.ec_count ?? "0"}
                      </Typography>
                    </Box>
                    <Box marginTop="12px">
                      <Typography
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                      >
                        Valor máximo:
                      </Typography>
                      <Typography
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                        variant="h6"
                      >
                        R$ {(salesPlan.maximum_amount / 100).toFixed(2) ?? "-"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box flexGrow={1}>
                    <Typography
                      style={{
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                      variant="h6"
                    >
                      ID de Conciliação: <br />
                      <Box
                        width="100%"
                        maxWidth={`${
                          (salesPlan && salesPlan.sales_plan && salesPlan.id
                            ? salesPlan.id.length
                            : 10) * 0.82
                        }ch`}
                        display="flex"
                      >
                        <TextField fullWidth value={salesPlan.id || "-"} />
                        <Tooltip title="Copiar ID Conciliação">
                          <CopyToClipboard text={salesPlan.id || "-"}>
                            <Button
                              aria="Copiar"
                              style={{
                                marginLeft: "8px",
                                padding: 0,
                                minWidth: 0,
                                width: "20px",
                                height: "20px",
                                alignSelf: "center",
                                color: "green",
                              }}
                              onClick={() =>
                                toast.success(
                                  "Copiado para area de transferência",
                                  {
                                    autoClose: 2000,
                                  }
                                )
                              }
                            >
                              <FontAwesomeIcon
                                style={{
                                  width: "20px",
                                  height: "20px",
                                }}
                                icon={faCopy}
                              />
                            </Button>
                          </CopyToClipboard>
                        </Tooltip>
                      </Box>
                    </Typography>
                    <Box marginTop="12px">
                      <Typography
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                      >
                        Descrição:
                      </Typography>
                      <Typography
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                        variant="h6"
                      >
                        {salesPlan.description ?? "-"}
                      </Typography>
                    </Box>
                    <Box marginTop="12px">
                      <Typography
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                      >
                        Criado em:
                      </Typography>
                      <Typography
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                        variant="h6"
                      >
                        {salesPlan.created_at
                          ? moment
                              .utc(salesPlan.created_at)
                              .format("dd/MM/yyyy HH:mm:ss")
                          : "-"}
                      </Typography>
                    </Box>
                    <Box marginTop="12px">
                      <Typography
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                      >
                        Ultima atualização:
                      </Typography>
                      <Typography
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                        variant="h6"
                      >
                        {salesPlan.updated_at
                          ? moment
                              .utc(salesPlan.updated_at)
                              .format("dd/MM/yyyy HH:mm:ss")
                          : "-"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" flexGrow={1}>
                <Box marginTop="8px" display="flex" justifyContent="center">
                  <CustomButton
                    onClick={() => setOpenStoreDialog(true)}
                    disabled={false}
                  >
                    Adicionar
                  </CustomButton>
                </Box>

                {/* <Box
									marginTop="8px"
									display="flex"
									justifyContent="center"
								>
									<CustomButton
										buttonText="Criar Tarifas Padrão"
										onClick={() => setOpenCreateDefaultFees(true)}
									>
										Criar Tarifas Padrão
									</CustomButton>
								</Box> */}

                {/* {userData.owner_agent_id === salesPlan.agent_id
									? <Box
									marginTop="8px"
									display="flex"
									justifyContent="center"
								>
									<CustomButton
										buttonText="Definar como Padrão"
										onClick={handleSetDefaultSalesPlan}
										disabled={salesPlan.is_default}
									>
										Definar como Padrão
									</CustomButton>
								</Box>
									: null} */}

                {/* <Box
									marginTop="8px"
									display="flex"
									justifyContent="center"
								>
									<CustomButton
										buttonText="Remover Plano de Vendas"
										onClick={() => setOpenDeleteDialog(true)}
										disabled={salesPlan.ec_count !== 0}
									>
										Remover Plano de Vendas
									</CustomButton>
								</Box> */}
              </Box>

              {/* <Box display="flex" flexDirection="column">
								<Typography
									style={{ color: APP_CONFIG.mainCollors.primary }}
									align="center"
									variant="h6"
								>
									Opções
								</Typography>
								<Box
									marginTop="8px"
									display="flex"
									justifyContent="center"
								>
									<CustomButton
										color="purple"
										onClick={() => setOpenAddSubscriptionDialog(true)}
										disabled={false}
									>
										Adicionar EC
									</CustomButton>
								</Box>

								<Box
									marginTop="8px"
									display="flex"
									justifyContent="center"
								>
									<CustomButton
										color="purple"
										onClick={() => setOpenDeleteDialog(true)}
										disabled={salesPlan.ec_count !== 0}
									>
										Remover Plano de Vendas
									</CustomButton>
								</Box>
							</Box> */}
            </Box>

            <Divider style={{ marginTop: 16, marginBottom: 16 }} />

            {salesPlan && salesPlan.fee_details && (
              <FeeDetails feeDetails={salesPlan.fee_details} />
            )}

            {/* <Box style={{ padding: '40px' }}>
							<Typography
								style={{ color: APP_CONFIG.mainCollors.primary }}
								variant="h6"
							>
								Assinaturas
							</Typography>
							<Box marginBottom="16px" marginTop="40px">
								<TextField
									fullWidth
									value={filters.like}
									onChange={(e) =>
										setFilters({
											...filters,
											like: e.target.value,
										})
									}
									InputLabelProps={{
										shrink: shrink,
										className: shrink
											? undefined
											: classes.inputLabelNoShrink,
									}}
									variant="outlined"
									label="Buscar por nome, documento..."
									style={{ width: '100%' }}
									InputProps={{
										startAdornment: (
											<SearchIcon
												style={{
													fontSize: '30px',
													color: APP_CONFIG.mainCollors.primary,
												}}
											/>
										),
									}}
								/>
							</Box>

							<CustomTable columns={columns} data={subscriptions} />

							<Box alignSelf="flex-end" marginTop="8px">
								<Pagination
									variant="outlined"
									color="secondary"
									size="large"
									count={subscriptions.last_page}
									onChange={handleChangePage}
									page={page}
								/>
							</Box>
						</Box> */}
          </Box>

          <LoadingScreen isLoading={loading} />
        </Box>
      ) : (
        <LinearProgress />
      )}
    </>
  );
};

export default PlanoDeVendaDetalhesZoop;
