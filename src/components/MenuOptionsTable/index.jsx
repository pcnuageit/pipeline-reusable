import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TableContainer,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  BorderAll,
  CompareArrows,
  Delete,
  Lock,
  LockOpen,
  PictureAsPdf,
  Print,
  ReplayOutlined,
  Search,
} from "@material-ui/icons";
import { DataObject, Download, FileOpenOutlined } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import {
  generatePath,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import {
  ExportTableButtons,
  TableHeaderButton,
} from "../../components/TableHeaderButtons";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import {
  getExportTable,
  getHistoricoTransacoes,
  getHistoricoTransacoesEntradas,
  patchPagamentosContratoAluguelStatusToCreated,
  patchPagamentosVoucherStatusToCreated,
  postBlockCard,
  postUnblockCard,
} from "../../services/beneficiarios";
import { translateStatus } from "../../utils/translateStatus";
import CustomTable from "../CustomTable/CustomTable";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import SelectBeneficio from "../SelectBeneficio";
import TextFieldCpfCnpj from "../TextFieldCpfCnpj";

export function MenuOptionsTable({
  row,
  getData,
  hasPermission,
  printType,
  deleteCallback,
  editType,
  transactionsType,
  infoTableColumns,
  JSONResponse,
  patchStatus,
  blockUnblockCard,
  cancelCard,
  navigateTo,
  cancelPix,
  sendSMS,
  exportRow,
  viewAttachedFiles,
}) {
  const history = useHistory();
  const [showDeletarModal, setShowDeletarModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [showInfoTableModal, setShowInfoTableModal] = useState(false);
  const [showJSONResponseModal, setShowJSONResponseModal] = useState(false);
  const [showPatchStatusModal, setShowPatchStatusModal] = useState(false);
  const [showBlockUnblockCardModal, setShowBlockUnblockCardModal] =
    useState(false);
  const [showCancelCardModal, setShowCancelCardModal] = useState(false);
  const [showCancelPixModal, setShowCancelPixModal] = useState(false);
  const [showSendSMSModal, setShowSendSMSModal] = useState(false);
  const [showViewAttachedFilesModal, setShowViewAttachedFiles] =
    useState(false);

  return (
    <Box style={{ display: "flex", flexDirection: "row" }}>
      {printType ? <PrintButton row={row} type={printType} /> : null}

      {hasPermission && deleteCallback ? (
        <>
          <Delete
            style={{ color: "#ED757D", fontSize: "28px" }}
            onClick={() => setShowDeletarModal(true)}
          />

          <ConfirmarDeletarModal
            show={showDeletarModal}
            setShow={setShowDeletarModal}
            row={row}
            getData={getData}
            callback={deleteCallback}
          />
        </>
      ) : null}

      {/* {editType ? (
        <>
          <Edit
            style={{ color: APP_CONFIG.mainCollors.primary, fontSize: "28px" }}
            onClick={() => setShowEditModal(true)}
          />

          <ModalManager.NovoCadastro
            show={showEditModal}
            setShow={setShowEditModal}
            data={row}
            getData={getData}
            tipo={editType}
            update={true}
          />
        </>
      ) : null} */}

      {transactionsType ? (
        <>
          <CompareArrows
            style={{ color: "#202020", fontSize: "28px" }}
            onClick={() => setShowTransactionsModal(true)}
          />

          <ExtratoBeneficiarioModal
            show={showTransactionsModal}
            setShow={() => setShowTransactionsModal(false)}
            data={row}
          />
        </>
      ) : null}

      {infoTableColumns ? (
        <>
          <Search
            style={{ color: "#202020", fontSize: "28px" }}
            onClick={() => setShowInfoTableModal(true)}
          />

          <InfoTableModal
            show={showInfoTableModal}
            setShow={() => setShowInfoTableModal(false)}
            data={row}
            columns={infoTableColumns}
          />
        </>
      ) : null}

      {JSONResponse ? (
        <>
          <DataObject
            style={{ color: "#202020", fontSize: "28px" }}
            onClick={() => setShowJSONResponseModal(true)}
          />

          <JSONResponseModal
            show={showJSONResponseModal}
            setShow={() => setShowJSONResponseModal(false)}
            data={row}
            json={JSONResponse}
          />
        </>
      ) : null}

      {patchStatus ? (
        <>
          <ReplayOutlined
            style={{ color: "#202020", fontSize: "28px" }}
            onClick={() => setShowPatchStatusModal(true)}
          />

          <PatchStatusModal
            show={showPatchStatusModal}
            setShow={() => setShowPatchStatusModal(false)}
            data={row}
            getData={getData}
            type={patchStatus}
          />
        </>
      ) : null}

      {hasPermission && blockUnblockCard ? (
        <>
          {row?.is_blocked ? (
            <LockOpen
              style={{ color: "#202020", fontSize: "28px" }}
              onClick={() => setShowBlockUnblockCardModal(true)}
            />
          ) : (
            <Lock
              style={{ color: "#202020", fontSize: "28px" }}
              onClick={() => setShowBlockUnblockCardModal(true)}
            />
          )}

          <BlockUnblockCardModal
            show={showBlockUnblockCardModal}
            setShow={() => setShowBlockUnblockCardModal(false)}
            data={row}
            getData={getData}
          />
        </>
      ) : null}

      {/* {cancelCard ? (
        <>
          <Cancel
            style={{ color: "#202020", fontSize: "28px" }}
            onClick={() => setShowCancelCardModal(true)}
          />

          <CancelCardModal
            show={showCancelCardModal}
            setShow={() => setShowCancelCardModal(false)}
            data={row}
            getData={getData}
          />
        </>
      ) : null} */}

      {/* {cancelPix ? (
        <>
          <ReplayOutlined
            style={{ color: "#202020", fontSize: "28px" }}
            onClick={() => setShowCancelPixModal(true)}
          />

          <CancelPixModal
            show={showCancelPixModal}
            setShow={() => setShowCancelPixModal(false)}
            data={row}
            getData={getData}
          />
        </>
      ) : null} */}

      {/* {sendSMS ? (
        <>
          <Mail
            style={{ color: "#202020", fontSize: "28px" }}
            onClick={() => setShowSendSMSModal(true)}
          />

          <SendSMSModal
            show={showSendSMSModal}
            setShow={() => setShowSendSMSModal(false)}
            data={sendSMS}
          />
        </>
      ) : null} */}

      {exportRow ? <ExportRow path={exportRow} row={row} /> : null}

      {!!viewAttachedFiles?.length ? (
        <>
          <FileOpenOutlined
            style={{ color: "#202020", fontSize: "28px" }}
            onClick={() => setShowViewAttachedFiles(true)}
          />

          <ViewAttachedFiles
            show={showViewAttachedFilesModal}
            setShow={() => setShowViewAttachedFiles(false)}
            data={viewAttachedFiles}
          />
        </>
      ) : null}

      {navigateTo ? (
        <IconButton onClick={() => history.push(navigateTo.path)}>
          <navigateTo.icon style={{ color: "#202020", fontSize: "28px" }} />
        </IconButton>
      ) : null}
    </Box>
  );
}

const ConfirmarDeletarModal = ({
  show = false,
  setShow = () => false,
  row = {},
  callback = () => null,
  getData = () => null,
}) => {
  const token = useAuth();
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  const handleDeletarBeneficiario = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await callback(token, row?.id);
      await getData(token);
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel deletar o item. Tente novamente.",
      );
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />
      <DialogTitle id="form-dialog-title">Excluir</DialogTitle>
      <form onSubmit={handleDeletarBeneficiario}>
        <DialogContent style={{ overflow: "hidden" }}>
          <DialogContentText>
            Você gostaria de excluir o item:
          </DialogContentText>

          <DialogContentText>
            {row?.nome_beneficio ? (
              <>
                {row?.nome_beneficio} <br />
              </>
            ) : null}
            {row?.nome_prefeitura ? (
              <>
                {row?.nome_prefeitura} - {row?.sigla} <br />
              </>
            ) : null}
            {row?.nome ? (
              <>
                {row?.nome} <br />
              </>
            ) : null}
            {row?.user?.nome ? (
              <>
                {row?.user?.nome} <br />
              </>
            ) : null}
            {row?.documento ? (
              <>
                {row?.documento} <br />
              </>
            ) : null}
            {row?.user?.documento ? (
              <>
                {row?.user?.documento} <br />
              </>
            ) : null}
            {row?.email ? (
              <>
                {row?.email} <br />
              </>
            ) : null}
            {row?.chave_pix ? (
              <>
                Chave Pix: {row?.chave_pix} <br />
              </>
            ) : null}
            {row?.descricao ? (
              <>
                {row?.descricao} <br />
              </>
            ) : null}
          </DialogContentText>

          <DialogContentText>Essa ação é irreversível.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Excluir
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const ExtratoBeneficiarioModal = ({
  show = false,
  setShow = () => false,
  data = {},
}) => {
  const token = useAuth();
  const [filter, setFilter] = useState({
    documento_conta: "",
    // documento_beneficiario: "",
    tipo_beneficio_id: "",
    data_inicio: "",
    data_fim: "",
    status: " ",
    tipo_operacao: " ",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [transactionType, setTransactionType] = useState("out"); // in || out
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagamentos, setPagamentos] = useState([]);

  const resetFilter = () => {
    setPage(1);
    setFilter({
      documento_conta: "",
      // documento_beneficiario: "",
      tipo_beneficio_id: "",
      data_inicio: "",
      data_fim: "",
      status: " ",
      tipo_operacao: " ",
    });
  };

  const filters = `user_id=${data?.id}&documento_conta=${debouncedFilter.documento_conta}&documento_beneficiario=${data?.documento}&tipo_beneficio_id=${debouncedFilter.tipo_beneficio_id}&data_inicio=${debouncedFilter.data_inicio}&data_fim=${debouncedFilter.data_fim}&status=${debouncedFilter.status}&tipo_operacao=${debouncedFilter.tipo_operacao}`;

  const getData = async () => {
    setLoading(true);
    try {
      if (transactionType === "out") {
        const { data } = await getHistoricoTransacoes(token, page, filters);
        setPagamentos(data);
      } else {
        const { data } = await getHistoricoTransacoesEntradas(
          token,
          page,
          filters,
        );
        setPagamentos(data);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const getDataCallback = useCallback(getData, [
    token,
    page,
    filters,
    transactionType,
  ]);

  useEffect(() => {
    if (show) getDataCallback();
  }, [show, getDataCallback, debouncedFilter, transactionType]);

  const handleClose = () => {
    setShow(false);
  };

  const columns = [
    {
      headerText: "Data",
      key: "",
      FullObject: (data) => {
        return (
          <Typography align="center">
            {moment(data?.data_transacao ?? data?.created_at).format(
              "DD/MM/YYYY HH:mm",
            )}
          </Typography>
        );
      },
    },
    {
      headerText: "Valor",
      key: "valor",
      CustomValue: (valor) => {
        const value = parseFloat(valor) * (transactionType === "out" ? -1 : 1);
        const parsedValue = value.toLocaleString("pt-br", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        const valueColor = transactionType === "out" && value < 0 ? "red" : "";

        if (!valor) return <Typography>-</Typography>;
        return (
          <Typography style={{ color: valueColor }}>
            R$ {parsedValue}
          </Typography>
        );
      },
    },
    transactionType === "out"
      ? {
          headerText: "Saldo",
          key: "saldo_final",
          CustomValue: (valor) => {
            const parsedValue = parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });

            if (!valor) return <Typography>-</Typography>;
            return <Typography>R$ {parsedValue}</Typography>;
          },
        }
      : {},
    transactionType === "out"
      ? {
          headerText: "NSU",
          key: "nsu",
        }
      : {},
    transactionType === "out"
      ? {
          headerText: "status",
          key: "status",
          CustomValue: (data) => (
            <Typography style={data === "pending" ? { color: "orange" } : {}}>
              {translateStatus(data)}
            </Typography>
          ),
        }
      : {},
    transactionType === "out"
      ? {
          headerText: "Credenciado",
          key: "transactionable_to",
          CustomValue: (data) => (
            <>
              <Typography>{data?.razao_social ?? data?.nome}</Typography>
              <Typography>{data?.cnpj ?? data?.documento}</Typography>
            </>
          ),
        }
      : {},
    {
      headerText: "Benefício",
      key: "",
      FullObject: (obj) => (
        <Typography>
          {obj?.concorrencia_cartao?.tipo_beneficio?.nome_beneficio ??
            obj?.cartao_privado?.tipo_beneficio?.nome_beneficio}
        </Typography>
      ),
    },
    {
      headerText: "Cartão",
      key: "",
      FullObject: (obj) => {
        const v = obj?.external_msk ?? obj?.concorrencia_cartao?.external_msk;
        // obj?.cartao_privado?.external_msk;
        return <Typography>{v?.replace(/\D/g, "")}</Typography>;
      },
    },
    transactionType === "in"
      ? {
          headerText: "Operação",
          key: "tipo_operacao",
          CustomValue: (data) => {
            const name = () => {
              switch (data) {
                case "C":
                  return "Crédito";
                case "D":
                  return "Devolução";
                default:
                  return data;
              }
            };

            return <Typography>{name()}</Typography>;
          },
        }
      : {},
  ];

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth={"lg"}
      minWidth={"lg"}
      width={"lg"}
      scroll={"paper"}
    >
      <DialogContent style={{ paddingBottom: 40, minWidth: "60%" }}>
        <Box>
          <Box
            style={{
              width: "100%",
              backgroundColor: APP_CONFIG.mainCollors.backgrounds,
              borderTopLeftRadius: 27,
              borderTopRightRadius: 27,
            }}
          >
            <Box style={{ margin: "30px 30px 1px 30px", paddingTop: 16 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <Select
                    variant="outlined"
                    fullWidth
                    style={{ marginTop: "10px" }}
                    value={transactionType}
                    onChange={(e) => {
                      resetFilter();
                      setTransactionType(e.target.value);
                    }}
                  >
                    <MenuItem
                      value="out"
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Movimentações
                    </MenuItem>
                    <MenuItem
                      value="in"
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Cargas
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    label="Data inicial"
                    value={filter.data_inicio}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        data_inicio: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      color: APP_CONFIG.mainCollors.secondary,
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    label="Data final"
                    value={filter.data_fim}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        data_fim: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextFieldCpfCnpj
                    placeholder="Pesquisar por conta"
                    value={filter.documento_conta}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        documento_conta: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <SelectBeneficio
                    state={filter?.tipo_beneficio_id}
                    setState={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        tipo_beneficio_id: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                {transactionType === "out" && (
                  <Grid item xs={12} sm={4}>
                    <InputLabel id="status-label" shrink="true">
                      Status
                    </InputLabel>
                    <Select
                      labelId="status-label"
                      variant="outlined"
                      fullWidth
                      required
                      value={filter.status}
                      onChange={(e) => {
                        setPage(1);
                        setFilter((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }));
                      }}
                    >
                      <MenuItem value={" "}>Todos</MenuItem>
                      <MenuItem value={"success"}>
                        {translateStatus("success")}
                      </MenuItem>
                      <MenuItem value={"pending"}>
                        {translateStatus("pending")}
                      </MenuItem>
                    </Select>
                  </Grid>
                )}

                {transactionType === "in" && (
                  <Grid item xs={12} sm={4}>
                    <InputLabel id="operation-label" shrink="true">
                      Operação
                    </InputLabel>
                    <Select
                      labelId="operation-label"
                      variant="outlined"
                      fullWidth
                      required
                      value={filter.tipo_operacao}
                      onChange={(e) => {
                        setPage(1);
                        setFilter((prev) => ({
                          ...prev,
                          tipo_operacao: e.target.value,
                        }));
                      }}
                    >
                      <MenuItem value={" "}>Todos</MenuItem>
                      <MenuItem value={"C"}>Crédito</MenuItem>
                      <MenuItem value={"D"}>Devolução</MenuItem>
                    </Select>
                  </Grid>
                )}

                {/* <Grid item xs={12} sm={3}>
                  <ReactInputMask
                    mask={"999.999.999-99"}
                    value={filter.documento_beneficiario}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        documento_beneficiario: e.target.value,
                      });
                    }}
                  >
                    {() => (
                      <TextField
                        fullWidth
                        placeholder="Pesquisar por beneficiário"
                        variant="outlined"
                      />
                    )}
                  </ReactInputMask>
                </Grid> */}

                <ExportTableButtons
                  token={token}
                  path={transactionType === "out" ? "transacoes" : "operacoes"}
                  page={page}
                  filters={filters}
                />

                <TableHeaderButton
                  Icon={Delete}
                  text="Limpar"
                  color="red"
                  onClick={resetFilter}
                />
              </Grid>
            </Box>
          </Box>

          <Box>
            {!loading && pagamentos.data && pagamentos.per_page ? (
              <Box minWidth={"800px"}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    columns={columns ? columns : null}
                    data={pagamentos.data}
                  />
                </TableContainer>
              </Box>
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
                count={pagamentos.last_page}
                onChange={(e, value) => setPage(value)}
                page={page}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Voltar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const InfoTableModal = ({
  show = false,
  setShow = () => false,
  data = [],
  columns = [],
}) => {
  const handleClose = () => {
    setShow(false);
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth={"lg"}
      minWidth={"lg"}
      width={"lg"}
      scroll={"paper"}
    >
      <DialogContent style={{ paddingBottom: 40, minWidth: "60%" }}>
        <CustomTable data={data} columns={columns} />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Voltar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const JSONResponseModal = ({
  show = false,
  setShow = () => false,
  data = {},
  json,
}) => {
  const handleClose = () => {
    setShow(false);
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth={"lg"}
      minWidth={"lg"}
      width={"lg"}
      scroll={"paper"}
    >
      <DialogContent style={{ paddingBottom: 40, minWidth: "60%" }}>
        <DialogTitle>JSON Response</DialogTitle>

        <DialogContentText style={{ whiteSpace: "pre" }}>
          {JSON.stringify(json, null, 4)}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Voltar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PrintButton = ({ row, type }) => {
  const redirectPrintFolha = () => {
    let path = generatePath(`/dashboard/print/:id??type=${type}`, {
      id: row?.id,
    });

    if (type === "pagamento_voucher") {
      path = generatePath(
        "/dashboard/folha-de-pagamento/acao/print/:id??type=pagamento_voucher",
        { id: row?.id },
      );
    }

    const newWindow = window.open(path, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  return (
    <Print
      onClick={redirectPrintFolha}
      style={{ color: APP_CONFIG.mainCollors.primary }}
    />
  );
};

const PatchStatusModal = ({
  show = false,
  setShow = () => false,
  data = {},
  getData = () => null,
  type,
}) => {
  const token = useAuth();
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  const handleResetStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === "voucher")
        await patchPagamentosVoucherStatusToCreated(token, data?.id);
      if (type === "contrato")
        await patchPagamentosContratoAluguelStatusToCreated(token, data?.id);

      toast.success("Status alterado com sucesso.");
      await getData(token);
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel alterar o status do item. Tente novamente.",
      );
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />
      <DialogTitle id="form-dialog-title">Reverter status</DialogTitle>
      <form onSubmit={handleResetStatus}>
        <DialogContent style={{ overflow: "hidden" }}>
          <DialogContentText>
            Você gostaria de reverter o status do item:
          </DialogContentText>

          <DialogContentText>
            {data?.conta?.user?.nome ||
              data?.contrato_aluguel?.locatario?.user?.nome}
            <br />
            {data?.conta?.user?.documento ||
              data?.contrato_aluguel?.locatario?.user?.documento}
            <br />
            Status: {data?.status}
            <br />
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Reverter
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const BlockUnblockCardModal = ({
  show = false,
  setShow = () => false,
  data = {},
  getData = async () => null,
}) => {
  const token = useAuth();
  const [dataAgendamento, setDataAgendamento] = useState(null);
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  const actionName = data?.is_blocked ? "desbloquear" : "bloquear";

  const handleResetStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (data?.is_blocked) {
        await postUnblockCard(token, data?.id, dataAgendamento);
      } else await postBlockCard(token, data?.id, dataAgendamento);

      await getData(token);
    } catch (err) {
      console.log(err);
      toast.error(
        `Ocorreu um erro, não possivel ${actionName} o cartão. Tente novamente.`,
      );
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />
      <DialogTitle id="form-dialog-title">{`Você gostaria de ${actionName} o cartão?`}</DialogTitle>
      <form onSubmit={handleResetStatus}>
        <DialogContent style={{ overflow: "hidden" }}>
          <DialogContentText>
            {data?.user?.nome}
            <br />
            {data?.user?.documento}
            <br />
            Status: {data?.status}
            <br />
            {data?.external_msk ? (
              <>
                {data?.external_msk}
                <br />
              </>
            ) : null}
          </DialogContentText>

          <TextField
            fullWidth
            label="Data de agendamento"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
              pattern: "d {4}- d {2}- d {2} ",
            }}
            type="date"
            value={dataAgendamento}
            onChange={(e) => setDataAgendamento(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            {actionName}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// const CancelCardModal = ({
//   show = false,
//   setShow = () => false,
//   data = {},
//   getData = async () => null,
// }) => {
//   const token = useAuth();
//   const [dataAgendamento, setDataAgendamento] = useState(null);
//   const [loading, setLoading] = useState("");

//   const handleClose = () => {
//     setShow(false);
//   };

//   const handleCancel = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await postCancelCard(token, data?.id, dataAgendamento);
//       await getData(token);
//     } catch (err) {
//       console.log(err);
//       toast.error(
//         `Ocorreu um erro, não possivel cancelar o cartão. Tente novamente.`,
//       );
//     } finally {
//       handleClose();
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog
//       open={show}
//       onClose={handleClose}
//       aria-labelledby="form-dialog-title"
//     >
//       <LoadingScreen isLoading={loading} />
//       <DialogTitle id="form-dialog-title">
//         Você gostaria de cancelar o cartão?
//       </DialogTitle>
//       <form onSubmit={handleCancel}>
//         <DialogContent style={{ overflow: "hidden" }}>
//           <DialogContentText>
//             {data?.user?.nome}
//             <br />
//             {data?.user?.documento}
//             <br />
//             Status: {data?.status}
//             <br />
//             {data?.external_msk ? (
//               <>
//                 {data?.external_msk}
//                 <br />
//               </>
//             ) : null}
//           </DialogContentText>

//           <TextField
//             fullWidth
//             label="Data de agendamento"
//             variant="outlined"
//             InputLabelProps={{
//               shrink: true,
//               pattern: "d {4}- d {2}- d {2} ",
//             }}
//             type="date"
//             value={dataAgendamento}
//             onChange={(e) => setDataAgendamento(e.target.value)}
//           />
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Voltar
//           </Button>
//           <Button color="primary" type="submit">
//             Cancelar cartão
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// };

// const CancelPixModal = ({
//   show = false,
//   setShow = () => false,
//   data = {},
//   getData = () => null,
// }) => {
//   const token = useAuth();
//   const [loading, setLoading] = useState("");

//   const handleClose = () => {
//     setShow(false);
//   };

//   const handleCancelPix = async () => {
//     setLoading(true);
//     try {
//       await postCancelPix(token, data?.id);
//       toast.success("Agendamento de Pix cancelado com sucesso!");
//       getData();
//       setShow(false);
//     } catch (err) {
//       console.log(err);
//       toast.error("Ocorreu um erro. Tente novamente.");
//     }
//     setLoading(false);
//   };

//   return (
//     <Dialog
//       open={show}
//       onClose={handleClose}
//       aria-labelledby="form-dialog-title"
//       maxWidth={"lg"}
//       minWidth={"lg"}
//       width={"lg"}
//       scroll={"paper"}
//     >
//       <DialogContent style={{ paddingBottom: 40, minWidth: "60%" }}>
//         <DialogTitle>Deseja cancelar o Pix agendado?</DialogTitle>

//         <DialogContentText style={{ whiteSpace: "pre" }}>
//           {data?.id}
//           <br />
//           Origem:
//           <br />
//           {data?.conta?.razao_social ?? data?.conta?.nome}
//           <br />
//           {data?.conta?.cnpj ?? data?.conta?.documento}
//           <br />
//           <br />
//           Destino:
//           <br />
//           {data?.nome_recebedor}
//           <br />
//           {documentMask(data?.documento_recebedor)}
//           <br />
//           <br />
//           R${" "}
//           {parseFloat(data?.valor).toLocaleString("pt-br", {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           })}
//         </DialogContentText>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={handleClose} color="primary">
//           Voltar
//         </Button>
//         <Button onClick={handleCancelPix} color="primary">
//           Confirmar
//         </Button>
//       </DialogActions>

//       <LoadingScreen isLoading={loading} />
//     </Dialog>
//   );
// };

// const SendSMSModal = ({ show, setShow, data }) => {
//   const dispatch = useDispatch();
//   const token = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [dadosNotificacao, setDadosNotificacao] = useState({
//     titulo: "",
//     mensagem: "",
//   });

//   const handleEnviarNotificacao = async () => {
//     setLoading(true);
//     try {
//       const resEnviarNotificacao = await dispatch(
//         postNotificacaoAction(
//           token,
//           dadosNotificacao.titulo,
//           dadosNotificacao.mensagem,
//           data?.id,
//           false,
//           "",
//         ),
//       );
//       if (resEnviarNotificacao) {
//         toast.error("Erro ao enviar notificação");
//         setErrors(resEnviarNotificacao);
//       } else {
//         toast.success("Notificação enviada!");
//         setShow(false);
//         setDadosNotificacao({
//           titulo: "",
//           mensagem: "",
//         });
//       }
//     } catch (err) {
//       console.log(err);
//     }
//     setLoading(false);
//   };

//   return (
//     <>
//       <LoadingScreen isLoading={loading} />

//       <Dialog
//         open={show}
//         onClose={() => {
//           setShow(false);
//         }}
//         aria-labelledby="form-dialog-title"
//       >
//         <DialogTitle id="form-dialog-title">Enviar Notificação</DialogTitle>

//         <DialogContent>
//           <DialogContentText>
//             Para enviar uma notificação preencha os campos abaixo.
//           </DialogContentText>

//           <TextField
//             InputLabelProps={{ shrink: true }}
//             value={dadosNotificacao.titulo}
//             onChange={(e) =>
//               setDadosNotificacao({
//                 ...dadosNotificacao,
//                 titulo: e.target.value,
//               })
//             }
//             error={errors.titulo ? errors.titulo : null}
//             helperText={errors.titulo ? errors.titulo.join(" ") : null}
//             autoFocus
//             margin="dense"
//             label="Título"
//             fullWidth
//             required
//           />

//           <TextField
//             InputLabelProps={{ shrink: true }}
//             value={dadosNotificacao.nome}
//             onChange={(e) =>
//               setDadosNotificacao({
//                 ...dadosNotificacao,
//                 mensagem: e.target.value,
//               })
//             }
//             error={errors.mensagem ? errors.mensagem : null}
//             helperText={errors.mensagem ? errors.mensagem.join(" ") : null}
//             autoFocus
//             margin="dense"
//             label="Mensagem"
//             fullWidth
//             required
//           />
//         </DialogContent>

//         <DialogActions>
//           <Button
//             onClick={() => {
//               setShow(false);
//             }}
//             color="primary"
//           >
//             Cancel
//           </Button>
//           <Button color="primary" onClick={() => handleEnviarNotificacao()}>
//             Enviar
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

function ExportRow({ path = "", row = {} }) {
  const id = useParams()?.id ?? "";
  const token = useAuth();
  const [loading, setLoading] = useState({
    xlsx: false,
    pdf: false,
  });

  const API_URL = `${process.env.REACT_APP_API_URL}`;
  const url = `${API_URL}/concorrencia/${path}/export`;
  const filters = `conta_id=${id}&id=${row?.id}`;

  async function handleExportRow(type) {
    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const { data } = await getExportTable(token, url, type, "", filters);
      toast.warn(
        data?.message ??
          `Exportando arquivo ${type}. Você poderá fazer o download na área "Arquivos exportados"`,
      );
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro ao exportar o arquivo. Tente novamente.");
    }
    setLoading((prev) => ({ ...prev, [type]: false }));
  }

  return (
    <>
      <IconButton
        onClick={() => handleExportRow("xlsx")}
        disabled={loading?.xlsx}
      >
        {loading?.xlsx ? (
          <CircularProgress size={24} />
        ) : (
          <BorderAll style={{ color: APP_CONFIG.mainCollors.primary }} />
        )}
      </IconButton>

      <IconButton
        onClick={() => handleExportRow("pdf")}
        disabled={loading?.pdf}
      >
        {loading?.pdf ? (
          <CircularProgress size={24} />
        ) : (
          <PictureAsPdf style={{ color: APP_CONFIG.mainCollors.primary }} />
        )}
      </IconButton>
    </>
  );
}

const ViewAttachedFiles = ({ show, setShow, data }) => {
  const handleDownload = (row) => {
    if (!row?.arquivo) {
      toast.error("Arquivo não disponível");
      return;
    }

    const link = document.createElement("a");
    link.href = row?.arquivo;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      headerText: "Criado em",
      key: "created_at",
      CustomValue: (text) => (
        <Typography align="center">
          {moment(text).format("DD/MM/YYYY")}
        </Typography>
      ),
    },
    {
      headerText: "Nome",
      key: "nome",
    },
    { headerText: "", key: "menu" },
  ];

  return (
    <>
      <Dialog
        open={show}
        onClose={() => {
          setShow(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Arquivos anexados</DialogTitle>

        <DialogContent>
          <CustomTable
            columns={columns}
            data={data ?? []}
            Editar={({ row }) => (
              <Download onClick={() => handleDownload(row)} />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setShow(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
