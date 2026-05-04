import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router";
import { getPlanosDeVendasZoopAction } from "../../actions/actions";

import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
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
  { headerText: "Id", key: "id" },
];

const ListaPlanosDeVendaZoop = () => {
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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getPlanosDeVendasZoopAction(
        token,
        page,
        debouncedPlanName,
        filters.order,
        filters.mostrar
      )
    );
  }, [page, debouncedPlanName, filters.order, filters.mostrar]);

  const planoVendasZoop = useSelector((state) => state.planoVendasZoop);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleClickRow = (row) => {
    const path = generatePath("/dashboard/plano-de-venda-zoop/:id/detalhes", {
      id: row.id,
    });
    history.push(path);
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
      <Box className={classes.headerContainer}>
        <Box style={{ marginBottom: "20px" }}>
          <Typography className={classes.pageTitle}>
            Planos de Vendas Zoop
          </Typography>
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
              placeholder="Pesquisar por nome do plano de vendas"
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
            ></TextField>

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
        {planoVendasZoop.items && planoVendasZoop.total > 0 ? (
          <CustomTable
            columns={columns}
            data={planoVendasZoop.items}
            Editar={Editar}
            handleClickRow={handleClickRow}
          />
        ) : (
          <Box>
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
            count={planoVendasZoop.last_page}
            onChange={handleChangePage}
            page={page}
          />
          <IconButton
            style={{
              backgroundColor: "white",
              boxShadow: "0px 0px 5px 0.7px grey",
            }}
            onClick={() => window.location.reload(false)}
          >
            <RefreshIcon></RefreshIcon>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ListaPlanosDeVendaZoop;
