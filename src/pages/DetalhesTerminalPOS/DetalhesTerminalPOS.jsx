import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  FormControl,
  LinearProgress,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router";

import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination } from "@material-ui/lab";

import { faCopy } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "moment/locale/pt-br";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  deleteTerminalPOSAction,
  getTerminalPOSAction,
  getTerminalPOSTransactionsAction,
  loadUserData,
  putTerminalPOSAction,
} from "../../actions/actions";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  SplitModal: {},
  updatePosHeader: {
    background: APP_CONFIG.mainCollors.primary,
    color: "white",
  },
}));

const DetalhesTerminalPOS = () => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const { id, subsectionId } = useParams();
  const token = useAuth();
  const dispatch = useDispatch();
  const history = useHistory();
  const userData = useSelector((state) => state.userData);
  const data = useSelector((state) => state.terminalPOS);
  const terminalPOSTransaction = useSelector(
    (state) => state.terminalPOSTransaction
  );
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [namePos, setNamePos] = useState("");

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    dispatch(getTerminalPOSAction(token, subsectionId ? subsectionId : id));
  }, [subsectionId, id]);

  useEffect(() => {
    dispatch(
      getTerminalPOSTransactionsAction(
        token,
        subsectionId ? subsectionId : id,
        page
      )
    );
  }, [subsectionId, id, page]);

  /* const handleDeletePos = async () => {
		try {
			await deletePos({ posId: id }).unwrap();
			toast.success('POS excluido!');
			history.goBack();
		} catch (e) {
			toast.error('Erro ao excluir POS!');
		} finally {
			setOpenDeleteDialog(false);
		}
	};

	const handleUpdatePos = async () => {
		try {
			await updatePos({ posId: id, name: namePos }).unwrap();
			toast.success('POS atualizado!');
			setOpenUpdateDialog(false);
			setNamePos('');
			refetch();
		} catch (e) {
			toast.error('Erro ao atualizar POS!');
		}
	}; */

  const handleDeletePos = async () => {
    setLoading(true);
    const resDeletePos = await dispatch(deleteTerminalPOSAction(token, id));
    if (resDeletePos) {
      toast.error("Falha ao deleter terminal - POS");
      setOpenDeleteDialog(false);
      setLoading(false);
    } else {
      toast.success("Terminal - POS deletado com sucesso!");
      history.goBack();
      setLoading(false);
    }
  };

  const handleUpdatePos = async () => {
    setLoading(true);
    const resPutTerminalPOS = await dispatch(
      putTerminalPOSAction(token, id, namePos)
    );
    if (resPutTerminalPOS) {
      toast.error("Erro ao atualizar POS!");
      setLoading(false);
      setErrors(resPutTerminalPOS);
    } else {
      toast.success("POS atualizado!");
      setOpenUpdateDialog(false);
      setNamePos("");
      setLoading(false);
    }
  };

  const handleClickRow = (row) => {
    if (row.transaction && row.transaction.id) {
      const path = generatePath(
        "/dashboard/gerenciar-contas/:id/detalhes-transacao",
        {
          id: row.transaction.id,
        }
      );
      history.push(path);
    }
  };

  const handleChangePage = useCallback((e, value) => {
    setPage(value);
  }, []);

  const columns = [
    {
      headerText: "Criado em",
      key: "created_at",
      CustomValue: (data_criacao) => {
        const date = new Date(data_criacao);
        const option = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        };
        const formatted = date.toLocaleDateString("pt-br", option);
        return <Typography align="center">{formatted}</Typography>;
      },
    },
    {
      headerText: "Pagador",
      key: "pagador",
      CustomValue: (pagador) => (
        <Box display="flex" flexDirection="column">
          <Typography>{pagador ? pagador.nome : null}</Typography>
          <Typography>{pagador ? pagador.documento : null}</Typography>
        </Box>
      ),
    },
    {
      headerText: "Situação",
      key: "transaction.status",
      CustomValue: (status) => {
        if (status === "succeeded") {
          return (
            <Typography
              style={{
                color: "green",
                borderRadius: "27px",
              }}
            >
              SUCESSO
            </Typography>
          );
        }
        if (status === "failed") {
          return (
            <Typography
              style={{
                color: "red",
                borderRadius: "27px",
              }}
            >
              FALHADA
            </Typography>
          );
        }
        if (status === "canceled") {
          return (
            <Typography
              style={{
                color: "red",
                borderRadius: "27px",
              }}
            >
              CANCELADA
            </Typography>
          );
        }
        if (status === "pending") {
          return (
            <Typography
              style={{
                color: "#dfad06",
                borderRadius: "27px",
              }}
            >
              PENDENTE
            </Typography>
          );
        }
        if (status === "new") {
          return (
            <Typography
              style={{
                color: "green",
                borderRadius: "27px",
              }}
            >
              NOVO
            </Typography>
          );
        }
        if (status === "pre_authorized") {
          return (
            <Typography
              style={{
                color: "#dfad06",
                borderRadius: "27px",
              }}
            >
              PRÉ-AUTORIZADO
            </Typography>
          );
        }
        if (status === "reversed") {
          return (
            <Typography
              style={{
                color: "",
                borderRadius: "27px",
              }}
            >
              REVERTIDO
            </Typography>
          );
        }
        if (status === "refunded") {
          return (
            <Typography
              style={{
                color: "",
                borderRadius: "27px",
              }}
            >
              REEMBOLSADO
            </Typography>
          );
        }
        if (status === "dispute") {
          return (
            <Typography
              style={{
                color: "",
                borderRadius: "27px",
              }}
            >
              DISPUTA
            </Typography>
          );
        }
        if (status === "charged_back") {
          return (
            <Typography
              style={{
                color: "",
                borderRadius: "27px",
              }}
            >
              DEBITADO
            </Typography>
          );
        }
        if (status === "requested") {
          return (
            <Typography
              style={{
                color: "#dfad06",
                borderRadius: "27px",
              }}
            >
              CANC. SOLICITADO
            </Typography>
          );
        }
        if (status === "refused") {
          return (
            <Typography
              style={{
                color: "red",
                borderRadius: "27px",
              }}
            >
              CANC. RECUSADO POR STATUS
            </Typography>
          );
        }
        if (status === "rejected") {
          return (
            <Typography
              style={{
                color: "red",
                borderRadius: "27px",
              }}
            >
              CANC. REJEITADO
            </Typography>
          );
        }
        if (status === "error") {
          return (
            <Typography
              style={{
                color: "red",
                borderRadius: "27px",
              }}
            >
              ERRO CANCELAMENTO
            </Typography>
          );
        }
        if (status === "finished") {
          return (
            <Typography
              style={{
                color: "green",
                borderRadius: "27px",
              }}
            >
              CANC. FINALIZADO
            </Typography>
          );
        }
      },
    },
    {
      headerText: "Validação",
      key: "",
      FullObject: (data) => (
        <Box display="flex" flexDirection="column">
          {data.transaction &&
          data.transaction.error &&
          data.transaction.error.message_display ? (
            data.transaction.error.message_display
          ) : (
            <Typography style={{ color: "green" }}>APROVADO</Typography>
          )}
        </Box>
      ),
    },
    {
      headerText: "Tipo",
      key: "transaction",
      CustomValue: (transaction) => {
        const type = transaction.payment_type;
        if (type === "credit") {
          const installments = transaction.installment_plan
            ? transaction.installment_plan.number_installments
            : 1;
          const flag = transaction.payment_method.card_brand;
          return (
            <Typography>
              Crédito {installments}x - {flag}
            </Typography>
          );
        }
        if (type === "debit") {
          return <Typography>Débito</Typography>;
        }
        if (type === "boleto") {
          return <Typography>Boleto</Typography>;
        }
        if (type === "commission") {
          return <Typography>Comissão</Typography>;
        }
      },
    },
    {
      headerText: "Valor Bruto",
      key: "transaction.amount",
      CustomValue: (value) => <Typography>R${value}</Typography>,
    },
    {
      headerText: "Valor da taxa",
      key: "transaction.fees",
      CustomValue: (value) => <Typography>R${value}</Typography>,
    },

    {
      headerText: "Valor Líquido",
      key: "transaction",
      CustomValue: (transaction) => {
        const { fees, amount } = transaction;
        const valorLiquido = (amount - fees).toFixed(2);
        return <Typography>R${valorLiquido}</Typography>;
      },
    },
  ];

  return (
    <Box display="flex" flexDirection="column">
      <Dialog
        onClose={() => setOpenUpdateDialog(false)}
        open={openUpdateDialog}
        className={classes.SplitModal}
      >
        <LoadingScreen isLoading={loading} />
        <DialogTitle className={classes.updatePosHeader}>
          <Typography
            style={{ color: APP_CONFIG.mainCollors.primary }}
            align="center"
            variant="h6"
          >
            Atualizar nome do POS
          </Typography>
        </DialogTitle>
        <Box style={{ padding: "20px" }}>
          <Box>
            <FormControl fullWidth>
              <Typography
                style={{ color: APP_CONFIG.mainCollors.primary }}
                variant="h6"
              >
                Novo nome do terminal POS
              </Typography>
              <TextField
                inputProps={{ maxLength: 60 }}
                className={classes.currency}
                value={namePos}
                onChange={(event) => setNamePos(event.target.value)}
                style={{
                  marginBottom: "6px",
                }}
                error={errors.name ? errors.name : null}
                helperText={errors.name ? errors.name.join(" ") : null}
              />
              {/* {updatePosError ? (
								<FormHelperText
									style={{
										marginBottom: '6px',
										width: '60%',
										color: 'red',
									}}
								>
									{updatePosError.name ? updatePosError.name[0] : null}
								</FormHelperText>
							) : null} */}
            </FormControl>
          </Box>

          <Box
            alignSelf="end"
            display="flex"
            justifyContent="space-around"
            marginTop={"20px"}
          >
            <Box>
              <CustomButton
                color="purple"
                buttonText={"Atualizar"}
                onClick={handleUpdatePos}
              >
                Atualizar
              </CustomButton>
            </Box>
            <Box>
              <Button
                style={{ borderRadius: "37px" }}
                variant="outlined"
                onClick={() => setOpenUpdateDialog(false)}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Deseja realmente excluir este POS?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={handleDeletePos}
            variant="outlined"
            color="secondary"
          >
            Sim
          </Button>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="default"
            variant="outlined"
            autoFocus
          >
            Não
          </Button>
        </DialogActions>
      </Dialog>

      <Box display="flex" justifyContent="">
        <Typography
          style={{ color: APP_CONFIG.mainCollors.primary }}
          variant="h4"
        >
          Terminal POS
        </Typography>
      </Box>

      <Divider style={{ marginTop: 16, marginBottom: 8 }} />

      <>
        <Box display="flex" flexWrap="wrap" justifyContent="space-around">
          <Box display="flex" flexDirection="column">
            <Typography
              style={{ color: APP_CONFIG.mainCollors.primary }}
              variant="h6"
            >
              Detalhes do terminal POS:
            </Typography>

            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="space-between"
              marginTop="12px"
            >
              <Box>
                <Typography
                  style={{ color: APP_CONFIG.mainCollors.primary }}
                  variant="h6"
                >
                  ID do terminal POS: <br />
                  <TextField value={data.id ? data.id : "-"} />
                  <Tooltip title="Copiar ID da transação">
                    <CopyToClipboard text={data.id ? data.id : "-"}>
                      <Button
                        aria="Copiar"
                        style={{
                          marginLeft: "6px",
                          width: "60px",
                          height: "20px",
                          alignSelf: "center",
                          color: "green",
                        }}
                        onClick={() =>
                          toast.success("Copiado para area de transferência", {
                            autoClose: 2000,
                          })
                        }
                      >
                        <FontAwesomeIcon
                          style={{
                            width: "60px",
                            height: "20px",
                          }}
                          icon={faCopy}
                        />
                      </Button>
                    </CopyToClipboard>
                  </Tooltip>
                </Typography>
              </Box>
              <Box>
                <Typography
                  style={{ color: APP_CONFIG.mainCollors.primary }}
                  variant="h6"
                >
                  ID de Conciliação: <br />
                  <TextField value={data.terminal_id || "-"} />
                  <Tooltip title="Copiar ID Conciliação">
                    <CopyToClipboard text={data.terminal_id || "-"}>
                      <Button
                        aria="Copiar"
                        style={{
                          marginLeft: "6px",
                          width: "60px",
                          height: "20px",
                          alignSelf: "center",
                          color: "green",
                        }}
                        onClick={() =>
                          toast.success("Copiado para area de transferência", {
                            autoClose: 2000,
                          })
                        }
                      >
                        <FontAwesomeIcon
                          style={{
                            width: "60px",
                            height: "20px",
                          }}
                          icon={faCopy}
                        />
                      </Button>
                    </CopyToClipboard>
                  </Tooltip>
                </Typography>
              </Box>
            </Box>
            <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
              Nome:
            </Typography>
            <Typography
              style={{ color: APP_CONFIG.mainCollors.primary }}
              variant="h6"
            >
              {data.name ? data.name : "-"}
            </Typography>
            <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
              Status:
            </Typography>
            <Typography
              style={{ color: APP_CONFIG.mainCollors.primary }}
              variant="h6"
            >
              {data.status || "sem status"}
            </Typography>
            <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
              Criado em:
            </Typography>
            <Typography
              style={{ color: APP_CONFIG.mainCollors.primary }}
              variant="h6"
            >
              {data.created_at
                ? moment.utc(data.created_at).format("dd/MM/yyyy HH:mm:ss")
                : "-"}
            </Typography>
            <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
              Ultima atualização:
            </Typography>
            <Typography
              style={{ color: APP_CONFIG.mainCollors.primary }}
              variant="h6"
            >
              {data.updated_at
                ? moment.utc(data.updated_at).format("dd/MM/yyyy HH:mm:ss")
                : "-"}
            </Typography>
            <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
              Token de ativação utilizado:
            </Typography>
            <Typography
              style={{ color: APP_CONFIG.mainCollors.primary }}
              variant="h6"
            >
              {data.token || "-"}
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column">
            <Typography
              style={{ color: APP_CONFIG.mainCollors.primary }}
              align="center"
              variant="h6"
            >
              Opções
            </Typography>
            <Box marginTop="8px" display="flex" justifyContent="center">
              <CustomButton
                color="purple"
                buttonText="Atualizar POS"
                onClick={() => setOpenUpdateDialog(true)}
                disabled={false}
              >
                Atualizar POS
              </CustomButton>
            </Box>
            <Box marginTop="8px" display="flex" justifyContent="center">
              <CustomButton
                color="purple"
                buttonText="Excluir POS"
                onClick={() => setOpenDeleteDialog(true)}
                disabled={false}
              >
                Excluir POS
              </CustomButton>
            </Box>
          </Box>
        </Box>

        <Divider style={{ marginTop: 16, marginBottom: 8 }} />

        {terminalPOSTransaction && terminalPOSTransaction.per_page ? (
          <>
            <Typography
              style={{ color: APP_CONFIG.mainCollors.primary }}
              variant="h6"
            >
              Transações
            </Typography>
            <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
              Total encontradas: {terminalPOSTransaction.total || "0"}{" "}
              transações
            </Typography>

            <CustomTable
              columns={columns}
              data={terminalPOSTransaction.data}
              handleClickRow={handleClickRow}
            />

            <Box alignSelf="flex-end" marginTop="8px">
              <Pagination
                variant="outlined"
                color="secondary"
                size="large"
                count={terminalPOSTransaction.last_page}
                onChange={handleChangePage}
                page={page}
              />
            </Box>
          </>
        ) : (
          <LinearProgress />
        )}
      </>
    </Box>
  );
};

export default DetalhesTerminalPOS;
