import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faMinusCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Grid,
  IconButton,
  LinearProgress,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Autocomplete, Pagination } from "@material-ui/lab";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import CustomTable from "../../../../components/CustomTable/CustomTable";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../../../constants/config";
import useDebounce from "../../../../hooks/useDebounce";
import { useGetAccountsQuery } from "../../../../services/api";
import { documentMask } from "../../../../utils/documentMask";
import Popover from "../../../AntecipacaoSalarial/components/Popover";
import { formatMoney } from "../../../AntecipacaoSalarial/utils/money";
import {
  useGetAntecipacaoSalarialProposalQuery,
  useRemoveAntecipacaoSalarialProposalAccountsMutation,
} from "../../services/AntecipacaoSalarialProposal";
import AddAccountsDialog from "./AddAccountsDialog";
import ConfirmRemoveAccountsDialog from "./ConfirmRemoveAccountsDialog";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    padding: 24,
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "medium",
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
  },
}));

const ProposalAntecipacaoSalarialAccounts = () => {
  const id = useParams()?.id ?? "";
  const classes = useStyles();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [contaPjId, setContaPjId] = useState("");
  const [openAddAccounts, setOpenAddAccounts] = useState(false);
  const [openRemovePjAccount, setOpenRemovePjAccount] = useState(false);
  const [openRemoveAccounts, setOpenRemoveAccounts] = useState(false);
  const [accountIdListToRemove, setAccountIdListToRemove] = useState([]);
  const [showAccounts, setShowAccounts] = useState(false);
  const [removeAccounts] =
    useRemoveAntecipacaoSalarialProposalAccountsMutation();
  const [filters, setFilters] = useState({
    like: "",
    pjLike: "",
    tipo: "1",
    only_allowed_pj: false,
  });
  const debouncedLike = useDebounce(filters.like, 800);
  const debouncedPjLike = useDebounce(filters.pjLike, 800);

  const {
    data: proposal,
    isLoading: isLoadingProposal,
    isError,
    isUninitialized,
    refetch: refetchProposal,
  } = useGetAntecipacaoSalarialProposalQuery(id, {
    skip: !id,
  });

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    refetch: refetchAccounts,
  } = useGetAccountsQuery(
    {
      proposta_id: proposal?.id,
      conta_empresa_id: contaPjId,
      status: "approved",
      tipo: "1",
      like: debouncedLike,
      page,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !proposal?.id,
    }
  );

  const {
    data: pjAccounts,
    isLoading: isLoadingPjAccounts,
    refetch: refetchPjAccounts,
  } = useGetAccountsQuery(
    {
      with_proposta_id: proposal?.id,
      proposta_id: filters.only_allowed_pj ? proposal.id : "",
      status: "approved",
      tipo: "2",
      like: debouncedPjLike,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !proposal?.id,
    }
  );

  const {
    data: pjAccountAllowed,
    isLoading: isLoadingPjAccountAllowed,
    refetch: refetchPjAccountAllowed,
  } = useGetAccountsQuery(
    {
      proposta_id: proposal?.id,
      id: contaPjId,
      status: "approved",
      tipo: "2",
      like: debouncedPjLike,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !contaPjId,
    }
  );

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleRemoveAccounts = async () => {
    try {
      await removeAccounts({
        proposalId: proposal.id,
        accountIdList: accountIdListToRemove,
      }).unwrap();

      toast.success("Proposta removida das contas com sucesso!");
      setOpenRemoveAccounts(false);
      setAccountIdListToRemove([]);
    } catch (e) {
      toast.error("Erro ao remover proposta das contas!");
    }
    refetchAccounts();
    refetchProposal();
  };

  const handleRemovePjAccount = async () => {
    try {
      await removeAccounts({
        proposalId: proposal.id,
        accountIdList: [contaPjId],
      }).unwrap();

      toast.success("Proposta removida da conta pj com sucesso!");
      setOpenRemovePjAccount(false);
    } catch (e) {
      toast.error("Erro ao remover proposta da conta pj!");
    }
    refetchPjAccountAllowed();
    refetchPjAccounts();
    refetchAccounts();
    refetchProposal();
  };

  const handleAddAccountId = (id) => {
    setAccountIdListToRemove((current) => [...current, id]);
  };

  const handleRemoveAccountId = (id) => {
    setAccountIdListToRemove((current) => {
      const copy = [...current];

      const key = copy.indexOf(id);
      copy.splice(key, 1);

      return copy;
    });
  };

  useEffect(() => {
    if (isError) {
      toast.error("Erro ao carregar Proposta!");
      history.goBack();
    }
  }, [isLoadingProposal, isUninitialized, isError, history]);

  useEffect(() => {
    if (filters.tipo === "1") setShowAccounts(true);
    if (filters.tipo === "2" && contaPjId) setShowAccounts(true);
    if (filters.tipo === "2" && !contaPjId) setShowAccounts(false);
  }, [accounts, filters.tipo, contaPjId]);

  const columns = [
    { headerText: "ID", key: "id" },
    {
      headerText: "EC",
      key: "custom_nome",
      FullObject: (conta) => conta.razao_social ?? conta.nome,
    },
    {
      headerText: "Documento",
      key: "custom_documento",
      FullObject: (data) => (
        <Typography>{documentMask(data.cnpj ?? data.documento)}</Typography>
      ),
    },
    { headerText: "Email", key: "email" },
    {
      headerText: "Menu",
      key: "custom_menu_delete",
      FullObject: (conta) => {
        if (conta.cnpj) return null;
        return accountIdListToRemove.includes(conta.id) ? (
          <Tooltip title="Cancelar">
            <IconButton onClick={() => handleRemoveAccountId(conta.id)}>
              <FontAwesomeIcon color="red" icon={faTimes} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Remover">
            <IconButton
              onClick={() => {
                handleAddAccountId(conta.id);
              }}
            >
              <FontAwesomeIcon icon={faMinusCircle} />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
      <LoadingScreen
        isLoading={
          isLoadingProposal ||
          isLoadingAccounts ||
          isLoadingPjAccounts ||
          isLoadingPjAccountAllowed
        }
      />

      {proposal && !isUninitialized && !isLoadingProposal && !isError && (
        <Grid container spacing={2}>
          {openAddAccounts && (
            <AddAccountsDialog
              proposal={proposal}
              open={openAddAccounts}
              onClose={() => {
                setOpenAddAccounts(false);
                refetchAccounts();
                refetchProposal();
                refetchPjAccounts();
                refetchPjAccountAllowed();
              }}
            />
          )}

          {openRemoveAccounts && (
            <ConfirmRemoveAccountsDialog
              open={openRemoveAccounts}
              onConfirm={() => {
                handleRemoveAccounts();
              }}
              onClose={() => {
                setOpenRemoveAccounts(false);
              }}
            />
          )}

          {openRemovePjAccount && (
            <ConfirmRemoveAccountsDialog
              open={openRemovePjAccount}
              onConfirm={() => {
                handleRemovePjAccount();
              }}
              onClose={() => {
                setOpenRemovePjAccount(false);
              }}
            />
          )}

          <Grid item spacing={2} xs={12}>
            <Grid item xs={12}>
              <Box className={classes.card}>
                <Box marginBottom={2}>
                  <Typography className={classes.cardTitle}>
                    Detalhes da Proposta
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex">
                      <TextField
                        fullWidth
                        label="ID da Proposta de Antecipação Salarial"
                        value={proposal?.id}
                        disabled
                      />
                      <Box display="flex" marginTop="24px">
                        <Tooltip title="Copiar">
                          <CopyToClipboard text={proposal?.id}>
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
                                  width: "60px",
                                  height: "20px",
                                }}
                                icon={faCopy}
                              />
                            </Button>
                          </CopyToClipboard>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome da proposta"
                      value={proposal?.nome}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Valor da proposta"
                      value={formatMoney(proposal?.valor)}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Valor da tarifa"
                      value={formatMoney(proposal?.valor_tarifa)}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Contas Liberadas"
                      value={proposal?.qty_contas_liberadas}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Contas PJ Liberadas"
                      value={proposal?.qty_contas_liberadas_pj}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Contas PF Liberadas"
                      value={proposal?.qty_contas_liberadas_pf}
                      disabled
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box className={classes.card}>
              <Box
                marginBottom={2}
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Typography className={classes.cardTitle}>
                  Contas Liberadas
                </Typography>
                <Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ marginRight: "10px" }}
                    disabled={accountIdListToRemove.length === 0}
                    onClick={() => setAccountIdListToRemove([])}
                  >
                    Limpar
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ marginRight: "10px" }}
                    disabled={accountIdListToRemove.length === 0}
                    onClick={() => setOpenRemoveAccounts(true)}
                  >
                    Remover Contas
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={accountIdListToRemove.length !== 0}
                    onClick={() => setOpenAddAccounts(true)}
                  >
                    Liberar Contas
                  </Button>
                </Box>
              </Box>
              <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    style={{ margin: "0" }}
                    fullWidth
                    variant="outlined"
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
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={filters.tipo}
                    onChange={(e) => {
                      setPage(1);
                      setFilters({
                        ...filters,
                        tipo: e.target.value,
                      });
                      setContaPjId("");
                    }}
                  >
                    <MenuItem
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                      value={"1"}
                    >
                      Pessoa Física
                    </MenuItem>
                    <MenuItem
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                      value={"2"}
                    >
                      Pessoa Jurídica
                    </MenuItem>
                  </Select>
                </Grid>
                {filters.tipo === "2" && (
                  <Grid item xs={12} sm={3}>
                    <Select
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={filters.only_allowed_pj}
                      onChange={(e) => {
                        setPage(1);
                        setFilters({
                          ...filters,
                          only_allowed_pj: e.target.value,
                        });
                        setContaPjId("");
                      }}
                    >
                      <MenuItem
                        style={{
                          color: APP_CONFIG.mainCollors.secondary,
                        }}
                        value={false}
                      >
                        Todos
                      </MenuItem>
                      <MenuItem
                        style={{
                          color: APP_CONFIG.mainCollors.secondary,
                        }}
                        value={true}
                      >
                        Liberados
                      </MenuItem>
                    </Select>
                  </Grid>
                )}
                <Grid item xs={12} sm={3}>
                  <Typography
                    align="middle"
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                  >
                    Contas selecionadas: {accountIdListToRemove.length}
                  </Typography>
                </Grid>
                {filters.tipo === "2" && (
                  <Grid item xs={12} sm={12}>
                    <Autocomplete
                      fullWidth
                      options={pjAccounts.data}
                      getOptionLabel={(account) =>
                        `${
                          account.propostas_apoio_liberadas[0]?.id
                            ? "EPRESA LIBERADA - "
                            : ""
                        }${account.razao_social}, ${account.cnpj}, agência: ${
                          account.agencia
                        }, banco: ${account.banco}, conta: ${account.conta}`
                      }
                      onInputChange={(_event, value, reason) => {
                        if (reason !== "reset") {
                          setFilters({
                            ...filters,
                            pjLike: value,
                          });
                        }
                      }}
                      onChange={(_event, option) => {
                        setContaPjId(option ? option.id : "");
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Conta PJ" />
                      )}
                    />
                  </Grid>
                )}
              </Grid>
              {accounts && !isLoadingAccounts ? (
                <Box>
                  {filters.tipo === "2" && (
                    <Box display="flex" alignItems="center" marginBottom="10px">
                      <Typography
                        variant="h6"
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                          fontFamily: "Montserrat-SemiBold",
                        }}
                      >
                        Lista de Funcionários
                      </Typography>
                      <Popover buttonContent={<InfoOutlined />}>
                        <Typography
                          variant="body2"
                          style={{
                            maxWidth: "500px",
                            textAlign: "justify",
                          }}
                        >
                          Lista de Funcionários que já foram liberados para
                          utilizar essa proposta de antecipação salarial.
                        </Typography>
                      </Popover>
                      <Button
                        variant="outlined"
                        disabled={
                          !isLoadingPjAccountAllowed &&
                          !(contaPjId === pjAccountAllowed?.data[0]?.id)
                        }
                        onClick={() => setOpenRemovePjAccount(true)}
                        color="primary"
                      >
                        Remover empresa
                      </Button>
                      <Popover buttonContent={<InfoOutlined />}>
                        <Typography
                          variant="body2"
                          style={{
                            maxWidth: "500px",
                            textAlign: "justify",
                          }}
                        >
                          Se este botão está ativo, significa que a emprea já
                          foi liberada para utilizar a Proposta de Antecipação
                          Salarial, assim como todos os seus funcionários.
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{
                            maxWidth: "500px",
                            textAlign: "justify",
                          }}
                        >
                          Remover a empresa (conta PJ) da Proposta de
                          Antecipação Salarial, fará com que seus funcionários
                          não possam mais solicitar essa Antecipação Salarial, a
                          não ser que seja feita a liberação para o funcionário
                          em especifico.
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
            </Box>
            <Box
              display="flex"
              alignSelf="flex-end"
              marginTop="8px"
              justifyContent="space-between"
            >
              <Pagination
                variant="outlined"
                color="primary"
                size="large"
                count={accounts?.last_page}
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
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default ProposalAntecipacaoSalarialAccounts;
