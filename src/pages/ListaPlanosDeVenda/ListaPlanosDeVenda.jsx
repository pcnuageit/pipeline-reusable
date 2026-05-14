import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router";
import {
  getPlanosDeVendasAction,
  postPlanoDeVendasAction,
} from "../../actions/actions";

import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import { toast } from "react-toastify";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
/* import SetDefaultAppAccount from '../../components/SetDefaultAppAccount/SetDefaultAppAccount'; */

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "0px",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  tableContainer: { marginTop: "1px" },
  pageTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
  },
}));

const columns = [
  { headerText: "Nome", key: "name" },
  { headerText: "ECs ativos", key: "ec_count" },
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data) => {
      const date = new Date(data);
      const option = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const [dia] = date.toLocaleDateString("pt-br", option).split(" ");
      return <Typography align="center">{dia}</Typography>;
    },
  },
];

const ListaPlanosDeVenda = () => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    plan_name: "",
    order: "",
    mostrar: "",
  });
  const debouncedPlanName = useDebounce(filters.plan_name, 800);
  const [loading, setLoading] = useState(false);
  const token = useAuth();
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const [modalNovoPlano, setModalNovoPlano] = useState(false);
  const [nomeNovoPlano, setNomeNovoPlano] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getPlanosDeVendasAction(
        token,
        page,
        debouncedPlanName,
        filters.order,
        filters.mostrar,
      ),
    );
  }, [page, debouncedPlanName, filters.order, filters.mostrar]);

  const planoVendas = useSelector((state) => state.planoVendas);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleClickRow = (row) => {
    const path = generatePath("/dashboard/plano-de-venda/:id/detalhes", {
      id: row.id,
    });
    history.push(path);
  };

  const handleCriarPlanoDeVendas = async () => {
    setLoading(true);
    const resCriarPlanoDeVendas = await dispatch(
      postPlanoDeVendasAction(token, nomeNovoPlano),
    );
    if (resCriarPlanoDeVendas) {
      setErrors(resCriarPlanoDeVendas);
      setLoading(false);
      toast.error("Falha ao criar novo plano de vendas");
    } else {
      setLoading(false);
      setModalNovoPlano(false);
      toast.success("Plano de vendas criado com sucesso!");
      await dispatch(
        getPlanosDeVendasAction(
          token,
          page,
          debouncedPlanName,
          filters.order,
          filters.mostrar,
        ),
      );
    }
  };

  const Editar = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [disabled, setDisabled] = useState(false);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <Box>
        {/* 	<IconButton
					style={{ height: '15px', width: '10px' }}
					aria-controls="simple-menu"
					aria-haspopup="true"
					onClick={handleClick}
				>
					<SettingsIcon
						style={{
							borderRadius: 33,
							fontSize: '35px',
							backgroundColor: APP_CONFIG.mainCollors.primary,
							color: 'white',
						}}
					/>
				</IconButton>
				<Menu
					id="simple-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem
						onClick={() => handlePermissions(row)}
						style={{ color: APP_CONFIG.mainCollors.secondary }}
					>
						Permissões
					</MenuItem>
					<MenuItem
						onClick={() => handleExcluirAdmin(row)}
						style={{ color: APP_CONFIG.mainCollors.secondary }}
					>
						Excluir
					</MenuItem>

					<MenuItem
						onClick={() => handleReenviarTokenUsuario(row)}
						style={{ color: APP_CONFIG.mainCollors.secondary }}
					>
						Reenviar Token de Confirmação
					</MenuItem>
				</Menu> */}
      </Box>
    );
  };

  return (
    <Box className={classes.root}>
      <Dialog
        onClose={() => setModalNovoPlano(false)}
        open={modalNovoPlano}
        className={classes.SplitModal}
      >
        <Box display="flex" flexDirection="column" width="500px">
          <LoadingScreen isLoading={loading} />
          <DialogTitle className={classes.saqueHeader}>
            <Typography align="center" variant="h6">
              Criar novo plano de vendas
            </Typography>
          </DialogTitle>

          <Box margin="20px">
            <FormControl fullWidth>
              <Box marginTop={2}>
                <Typography variant="h6">Nome do novo plano:</Typography>
                <TextField
                  value={nomeNovoPlano}
                  onChange={(event) => setNomeNovoPlano(event.target.value)}
                  style={{
                    marginBottom: "6px",
                    width: "100%",
                  }}
                  error={errors.name}
                  helperText={errors.name ? errors.name.join(" ") : null}
                />
                {/* {storePosError ? (
									<FormHelperText
										style={{
											marginBottom: '6px',
											width: '60%',
											color: 'red',
										}}
									>
										{storePosError.token
											? storePosError.token[0]
											: null}
									</FormHelperText>
								) : null} */}
              </Box>
            </FormControl>
          </Box>

          <Box
            width="50%"
            alignSelf="end"
            display="flex"
            justifyContent="space-around"
            padding="12px 24px"
          >
            <Box margin="6px 0">
              <Button
                variant="outlined"
                style={{ borderRadius: "37px", marginRight: "10px" }}
                onClick={handleCriarPlanoDeVendas}
              >
                Criar
              </Button>
            </Box>
            <Box>
              <Button
                style={{ borderRadius: "37px", margin: "6px 0" }}
                variant="outlined"
                onClick={() => setModalNovoPlano(false)}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
      <Box className={classes.headerContainer}>
        <Box style={{ marginBottom: "10px" }}>
          <CustomHeader pageTitle="Planos de venda" />
        </Box>
        <Box style={{ alignSelf: "flex-end", marginBottom: "10px" }}>
          <IconButton
            style={{
              backgroundColor: APP_CONFIG.mainCollors.backgrounds,
              color: APP_CONFIG.mainCollors.primary,
            }}
            onClick={() => window.location.reload(false)}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
        <Box
          style={{
            width: "100%",
            backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            borderTopLeftRadius: 27,
            borderTopRightRadius: 27,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignContent="center"
            alignItems="center"
            style={{ margin: 30 }}
          >
            <TextField
              label="Pesquisar por nome do plano de vendas"
              size="small"
              variant="outlined"
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                width: "400px",
              }}
              /* onChange={(e) =>
							
							setFilters({
								...filters,
								like: e.target.value,
							})
						} */
              onChange={(e) => {
                setPage(1);
                setFilters({
                  ...filters,
                  like: e.target.value,
                });
              }}
            />

            <Box style={{ display: "flex" }}>
              <CustomButton
                onClick={() => {
                  setModalNovoPlano(true);
                }}
                color="purple"
              >
                <Box display="flex" alignItems="center">
                  <Typography style={{ fontSize: "11px" }}>
                    Novo plano de vendas
                  </Typography>
                </Box>
              </CustomButton>
            </Box>

            <Dialog
              open={open}
              onClose={() => {
                setOpen(false);
              }}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Criar Administrador
              </DialogTitle>
              <form /* onSubmit={(e) => criarAdmin(e)} */>
                {/* 	<DialogContent>
									<DialogContentText>
										Para criar um administrador preencha os campos
										abaixo. Enviaremos um token logo em seguida.
									</DialogContentText>

									<TextField
										InputLabelProps={{ shrink: true }}
										value={dadosAdministrador.email}
										onChange={(e) =>
											setDadosAdministrador({
												...dadosAdministrador,
												email: e.target.value,
											})
										}
										error={errors.email ? errors.email : null}
										helperText={
											errors.email ? errors.email.join(' ') : null
										}
										autoFocus
										margin="dense"
										label="E-mail"
										fullWidth
									/>

									<TextField
										InputLabelProps={{ shrink: true }}
										value={dadosAdministrador.nome}
										onChange={(e) =>
											setDadosAdministrador({
												...dadosAdministrador,
												nome: e.target.value,
											})
										}
										autoFocus
										margin="dense"
										label="Nome"
										fullWidth
									/>
									<InputMask
										maskChar=""
										mask={'999.999.999-99'}
										value={dadosAdministrador.documento}
										onChange={(e) =>
											setDadosAdministrador({
												...dadosAdministrador,
												documento: e.target.value,
											})
										}
									>
										{() => (
											<TextField
												InputLabelProps={{ shrink: true }}
												inputProps={{ backgroundColor: 'black' }}
												error={
													errors.documento
														? errors.documento
														: null
												}
												helperText={
													errors.documento
														? errors.documento.join(' ')
														: null
												}
												autoFocus
												label="Documento"
												fullWidth
											/>
										)}
									</InputMask>
									<InputMask
										maskChar=""
										mask="(99) 99999-9999"
										value={dadosAdministrador.celular}
										onChange={(e) =>
											setDadosAdministrador({
												...dadosAdministrador,
												celular: e.target.value,
											})
										}
									>
										{() => (
											<TextField
												InputLabelProps={{ shrink: true }}
												inputProps={{ backgroundColor: 'black' }}
												error={
													errors.celular ? errors.celular : null
												}
												helperText={
													errors.celular
														? errors.celular.join(' ')
														: null
												}
												autoFocus
												label="Celular"
												fullWidth
											/>
										)}
									</InputMask>
								</DialogContent> */}
                <DialogActions>
                  <Button
                    onClick={() => {
                      setOpen(false);
                    }}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    Enviar
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </Box>
        </Box>
      </Box>

      <Box className={classes.tableContainer}>
        {planoVendas.data && planoVendas.per_page ? (
          <CustomTable
            columns={columns}
            data={planoVendas.data}
            Editar={Editar}
            handleClickRow={handleClickRow}
          />
        ) : (
          <Box width="60vw">
            <LinearProgress color="secondary" />
          </Box>
        )}

        <Box
          display="flex"
          alignSelf="flex-end"
          marginTop="8px"
          justifyContent="space-between"
        >
          <Pagination
            variant="outlined"
            color="secondary"
            size="large"
            count={planoVendas.last_page}
            onChange={handleChangePage}
            page={page}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ListaPlanosDeVenda;
