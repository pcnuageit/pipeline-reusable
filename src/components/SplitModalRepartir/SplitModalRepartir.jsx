import {
  Box,
  Dialog,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { loadContasAll } from "actions/actions";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { APP_CONFIG } from "../../constants/config";
import {
  useCreateSplitMutation,
  useUpdateSplitMutation,
} from "../../services/api";
import CustomButton from "../CustomButton/CustomButton";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const useStyles = makeStyles((theme) => ({
  UserInfosContainer: {
    width: "40%",
    display: "flex",
    flexDirection: "column",
    color: theme.palette.primary.main,
  },
  userContentsContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.secondary.light,
    padding: "8px",
    borderRadius: "27px",
  },
  userContentItem: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    padding: "12px",
    margin: "8px",
    borderRadius: "27px",
  },
  SplitModal: {
    padding: "20px",
  },
  saqueHeader: {
    background: APP_CONFIG.mainCollors.backgrounds,
    color: "white",
  },
  currency: {
    font: "inherit",
    color: "currentColor",
    width: "100%",
    border: "0px",
    borderBottom: "1px solid gray",
    height: "1.1876em",
    margin: 0,
    display: "block",
    padding: "6px 0 7px",
    minWidth: 0,
    background: "none",
    boxSizing: "content-box",
    animationName: "mui-auto-fill-cancel",
    letterSpacing: "inherit",
    animationDuration: "10ms",
    appearance: "textfield",
    textAlign: "start",
    paddingLeft: "5px",
  },
}));

const defaultInfo = {
  conta_id: "",
  porcentagem: 0,
  valor: 0,
  usar_valor_liquido: false,
};

const SplitModalRepartir = ({
  open,
  onClose,
  selectedValue,
  id,
  onSplit,
  info,
  splitId,
  accountId,
}) => {
  const [errosSplit] = useState({});
  const [tipoSplit, setTipoSplit] = useState("porcentagem");
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [updateSplit] = useUpdateSplitMutation();
  const [createSplit] = useCreateSplitMutation();

  const { data: contas } = useSelector((state) => state.contas);

  useEffect(() => {
    dispatch(loadContasAll(accountId));
  }, [dispatch, accountId]);

  const [transacaoInfos, setTransacaoInfos] = useState({
    ...defaultInfo,
  });

  useEffect(() => {
    setTransacaoInfos((values) => ({
      ...values,
      cobranca_boleto_ou_cartao_id: id,
    }));
  }, [id]);

  useEffect(() => {
    if (info) {
      setTransacaoInfos((values) => ({
        ...values,
        ...info,
      }));

      setTipoSplit(info.porcentagem > 0 ? "porcentagem" : "valor");
    } else {
      setTransacaoInfos((values) => ({
        ...values,
        ...defaultInfo,
      }));
    }
  }, [info]);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleSplit = async () => {
    setLoading(true);
    try {
      const split = {
        ...transacaoInfos,
        responsavel_pelo_prejuizo: true,
      };

      if (splitId) {
        await updateSplit({
          split,
          splitId: splitId,
        }).unwrap();
      } else {
        await createSplit({ split }).unwrap();
      }

      toast.success("Valor repartido com sucesso!");
      handleClose();
      onSplit();
    } catch (e) {
      toast.error(
        splitId
          ? "Não foi possível alterar a repartição de valor!"
          : "Não foi possível efetuar a repartição de valores!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} className={classes.SplitModal}>
      <Box width="500px">
        <LoadingScreen isLoading={loading} />
        <DialogTitle className={classes.saqueHeader}>
          <Typography align="center" variant="h6">
            Repartir valor
          </Typography>
        </DialogTitle>
        <Box display="flex" flexDirection="column" padding="12px 24px">
          <Box display="flex" flexDirection="column">
            <Box margin="6px 0">
              <FormControl
                fullWidth
                error={errosSplit.valor || errosSplit.porcentagem}
              >
                <InputLabel>Tipo de repartição</InputLabel>
                <Select
                  fullWidth
                  value={tipoSplit}
                  onChange={(e) => {
                    setTipoSplit(e.target.value);
                    setTransacaoInfos({
                      ...transacaoInfos,
                      valor: 0,
                      porcentagem: 0,
                    });
                  }}
                >
                  <MenuItem value="valor">Valor</MenuItem>
                  <MenuItem value="porcentagem">Porcentagem</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {tipoSplit === "valor" ? (
              <Box margin="6px 0">
                <FormControl fullWidth error={errosSplit.valor}>
                  <Typography
                    style={{
                      alignSelf: "center",
                    }}
                  >
                    Valor a ser repartido
                  </Typography>
                  <CurrencyInput
                    className={classes.currency}
                    decimalSeparator=","
                    thousandSeparator="."
                    prefix="R$ "
                    value={transacaoInfos.valor}
                    onChangeEvent={(event, maskedvalue, floatvalue) =>
                      setTransacaoInfos({
                        ...transacaoInfos,
                        valor: floatvalue,
                      })
                    }
                    style={{
                      marginBottom: "6px",
                      width: "60%",
                      alignSelf: "center",
                    }}
                  />
                  <FormHelperText
                    style={{
                      marginBottom: "6px",
                      width: "60%",
                      alignSelf: "center",
                    }}
                  >
                    {errosSplit.valor ? errosSplit.valor.join(" ") : null}
                  </FormHelperText>
                </FormControl>
              </Box>
            ) : (
              <Box margin="6px 0">
                <FormControl fullWidth error={errosSplit.porcentagem}>
                  <Typography
                    style={{
                      alignSelf: "center",
                    }}
                  >
                    Porcentagem a ser repartida
                  </Typography>
                  <CurrencyInput
                    className={classes.currency}
                    decimalSeparator=","
                    thousandSeparator="."
                    suffix=" %"
                    value={transacaoInfos.porcentagem}
                    onChangeEvent={(event, maskedvalue, floatvalue) =>
                      setTransacaoInfos({
                        ...transacaoInfos,
                        porcentagem: floatvalue,
                      })
                    }
                    style={{
                      marginBottom: "6px",
                      width: "60%",
                      alignSelf: "center",
                    }}
                  />
                  <FormHelperText
                    style={{
                      marginBottom: "6px",
                      width: "60%",
                      alignSelf: "center",
                    }}
                  >
                    {errosSplit.porcentagem
                      ? errosSplit.porcentagem.join(" ")
                      : null}
                  </FormHelperText>
                </FormControl>
              </Box>
            )}
            {tipoSplit === "porcentagem" && (
              <Box margin="6px 0">
                <InputLabel>Dividir Taxas</InputLabel>
                <Select
                  fullWidth
                  value={transacaoInfos.usar_valor_liquido}
                  onChange={(e) =>
                    setTransacaoInfos({
                      ...transacaoInfos,
                      usar_valor_liquido: e.target.value,
                    })
                  }
                >
                  <MenuItem value={true}>Sim</MenuItem>
                  <MenuItem value={false}>Não</MenuItem>
                </Select>
              </Box>
            )}
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            marginTop="20px"
          >
            <Typography variant="h6">Escolha a conta</Typography>
            <FormControl fullWidth error={errosSplit.conta_id}>
              <InputLabel>Conta</InputLabel>
              <Select
                fullWidth
                value={transacaoInfos.conta_id}
                onChange={(e) =>
                  setTransacaoInfos({
                    ...transacaoInfos,
                    conta_id: e.target.value,
                  })
                }
              >
                {contas.map((conta) => {
                  return (
                    <MenuItem key={conta.id} value={conta.id}>
                      {conta.nome}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText
                style={{
                  marginBottom: "6px",
                  width: "60%",
                  alignSelf: "center",
                }}
              >
                {errosSplit.conta_id ? errosSplit.conta_id.join(" ") : null}
              </FormHelperText>
            </FormControl>
          </Box>

          <Box alignSelf="flex-end" margin="6px 0">
            <CustomButton
              color="purple"
              buttonText={info ? "Alterar" : "Repartir"}
              onClick={handleSplit}
            />
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default SplitModalRepartir;
