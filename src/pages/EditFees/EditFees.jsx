import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import {
  loadPerfilTaxaIdAction,
  putPerfilTaxaAction,
} from "../../actions/actions";

import { isNumber } from "lodash";
import CurrencyFormat from "react-currency-format";
import { toast } from "react-toastify";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    position: "relative",
    flexDirection: "column",
  },
  headerContainer: {
    marginBottom: "25px",
  },
  pageTitle: {
    color: "#9D9CC6",
    fontFamily: "Montserrat-SemiBold",
  },
}));

const EditFees = () => {
  const perfilTaxaId = useSelector((state) => state.perfilTaxaId);

  const token = useAuth();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [tipoTaxa, setTipoTaxa] = useState({
    inBoleto: 1,
    inTed: 1,
    inPix: 1,
    inP2p: 1,
    outP2p: 1,
    outTed: 1,
    outPix: 1,
  });
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [taxa, setTaxa] = useState({
    nome: "",
    cash_in_payout_zoop: "0.00",
    cash_in_boleto: "0.00",
    cash_in_ted: "0.00",
    cash_in_pix: "0.00",
    cash_in_p2p: "0.00",
    cash_out_p2p: "0.00",
    cash_out_ted: "0.00",
    cash_out_pix: "0.00",
  });

  useEffect(() => {
    if (id) {
      const fetch = async () => {
        await dispatch(loadPerfilTaxaIdAction(token, id));
      };
      fetch();
    }
  }, [id]);

  useEffect(() => {
    setTaxa(perfilTaxaId);
  }, [perfilTaxaId]);

  useEffect(() => {
    setTipoTaxa({
      inBoleto: perfilTaxaId.tipo_cash_in_boleto === "Fixo" ? 1 : 2,
      inTed: perfilTaxaId.tipo_cash_in_ted === "Fixo" ? 1 : 2,
      inPix: perfilTaxaId.tipo_cash_in_pix === "Fixo" ? 1 : 2,
      inP2p: perfilTaxaId.tipo_cash_in_p2p === "Fixo" ? 1 : 2,
      outP2p: perfilTaxaId.tipo_cash_out_p2p === "Fixo" ? 1 : 2,
      outTed: perfilTaxaId.tipo_cash_out_ted === "Fixo" ? 1 : 2,
      outPix: perfilTaxaId.tipo_cash_out_pix === "Fixo" ? 1 : 2,
    });
  }, [perfilTaxaId]);

  const handleAlterar = async () => {
    setLoading(true);
    const res = await dispatch(
      putPerfilTaxaAction(
        token,
        taxa.nome,
        isNumber(taxa.cash_in_payout_zoop)
          ? taxa.cash_in_payout_zoop
          : parseFloat(taxa.cash_in_payout_zoop),
        tipoTaxa.inBoleto,
        isNumber(taxa.cash_in_boleto)
          ? taxa.cash_in_boleto
          : parseFloat(taxa.cash_in_boleto),
        tipoTaxa.inTed,
        isNumber(taxa.cash_in_ted)
          ? taxa.cash_in_ted
          : parseFloat(taxa.cash_in_ted),
        tipoTaxa.inPix,
        isNumber(taxa.cash_in_pix)
          ? taxa.cash_in_pix
          : parseFloat(taxa.cash_in_pix),
        tipoTaxa.inP2p,
        isNumber(taxa.cash_in_p2p)
          ? taxa.cash_in_p2p
          : parseFloat(taxa.cash_in_p2p),
        tipoTaxa.outP2p,
        isNumber(taxa.cash_out_p2p)
          ? taxa.cash_out_p2p
          : parseFloat(taxa.cash_out_p2p),
        tipoTaxa.outTed,
        isNumber(taxa.cash_out_ted)
          ? taxa.cash_out_ted
          : parseFloat(taxa.cash_out_ted),
        tipoTaxa.outPix,
        isNumber(taxa.cash_out_pix)
          ? taxa.cash_out_pix
          : parseFloat(taxa.cash_out_pix),
        id,
      ),
    );
    if (res) {
      setErrors(res);
      toast.error("Erro ao alterar Tarifa");
      setLoading(false);
    } else {
      toast.success("Tarifa alterada com sucesso!");
      history.push("/dashboard/taxas");
      setLoading(false);
    }
  };

  const options = {
    displayType: "input",
    thousandSeparator: ".",
    decimalSeparator: ",",
    allowNegative: false,
    isNumericString: true,
    customInput: CustomTextField,
    style: { width: "100%" },
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.headerContainer}>
        <Box style={{ marginBottom: "20px" }}>
          <Typography className={classes.pageTitle}>Editar Tarifa</Typography>
        </Box>
      </Box>
      <Paper
        style={{
          alignSelf: "center",
          justifySelf: "center",
          maxWidth: 800,
          padding: 50,
          backgroundColor: APP_CONFIG.mainCollors.backgrounds,
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography
              align="center"
              variant="h5"
              style={{
                fontFamily: "Montserrat-SemiBold",
              }}
            >
              Insira os dados da tarifa
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              style={{
                fontFamily: "Montserrat-SemiBold",
                marginLeft: "15px",
                marginBottom: "5px",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              Nome da tarifa
            </Typography>
            <TextField
              shrink
              style={{ width: "100%" }}
              value={taxa.nome}
              onChange={(e) =>
                setTaxa({
                  ...taxa,
                  nome: e.target.value,
                })
              }
              helperText={errors.nome ? errors.nome.join("") : null}
              error={errors.nome}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
						<CurrencyFormat
							{...options}
							value={taxa.cash_in_payout_zoop}
							onValueChange={({ value }) =>
								setTaxa({
									...taxa,
									cash_in_payout_zoop: value,
								})
							}
							label="Recebimento M. Virtual"
							helperText={
								errors.cash_in_payout_zoop ? errors.cash_in_payout_zoop.join('') : null
							}
							error={errors.cash_in_payout_zoop}
						/>
					</Grid> */}
          <Grid item xs={12} sm={6}>
            <Typography
              style={{
                fontFamily: "Montserrat-SemiBold",
                marginLeft: "15px",
                marginBottom: "5px",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              Recebimento Boleto
            </Typography>
            <ButtonGroup
              size="small"
              style={{
                marginBottom: "0px",
                marginLeft: "15px",

                fontSize: 5,
              }}
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button
                style={{
                  backgroundColor: `${
                    tipoTaxa.inBoleto === 1 ? "black" : "#cfcfcf"
                  }`,
                  color: "white",
                }}
                onClick={() => setTipoTaxa({ ...tipoTaxa, inBoleto: 1 })}
                disabled={tipoTaxa.inBoleto === 1 ? true : false}
              >
                Fixo
              </Button>
              <Button
                style={{
                  backgroundColor: `${
                    tipoTaxa.inBoleto === 2 ? "black" : "#cfcfcf"
                  }`,
                  color: "white",
                }}
                onClick={() => setTipoTaxa({ ...tipoTaxa, inBoleto: 2 })}
                disabled={tipoTaxa.inBoleto === 2 ? true : false}
              >
                %
              </Button>
            </ButtonGroup>

            <CurrencyFormat
              {...options}
              prefix={tipoTaxa.inBoleto === 1 ? "R$ " : ""}
              suffix={tipoTaxa.inBoleto === 2 ? "%" : ""}
              value={taxa.cash_in_boleto}
              onValueChange={({ value }) =>
                setTaxa({
                  ...taxa,
                  cash_in_boleto: value,
                })
              }
              helperText={
                errors.cash_in_boleto ? errors.cash_in_boleto.join("") : null
              }
              error={errors.cash_in_boleto}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              style={{
                fontFamily: "Montserrat-SemiBold",
                marginLeft: "15px",
                marginBottom: "5px",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              Recebimento TED
            </Typography>
            <ButtonGroup
              size="small"
              style={{ marginBottom: "0px", marginLeft: "15px" }}
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button
                style={{
                  backgroundColor: `${
                    tipoTaxa.inTed === 1 ? "black" : "#cfcfcf"
                  }`,
                  color: "white",
                }}
                onClick={() => setTipoTaxa({ ...tipoTaxa, inTed: 1 })}
                disabled={tipoTaxa.inTed === 1 ? true : false}
              >
                Fixo
              </Button>
              <Button
                style={{
                  backgroundColor: `${
                    tipoTaxa.inTed === 2 ? "black" : "#cfcfcf"
                  }`,
                  color: "white",
                }}
                onClick={() => setTipoTaxa({ ...tipoTaxa, inTed: 2 })}
                disabled={tipoTaxa.inTed === 2 ? true : false}
              >
                %
              </Button>
            </ButtonGroup>
            <CurrencyFormat
              {...options}
              prefix={tipoTaxa.inTed === 1 ? "R$ " : ""}
              suffix={tipoTaxa.inTed === 2 ? "%" : ""}
              value={taxa.cash_in_ted}
              onValueChange={({ value }) =>
                setTaxa({
                  ...taxa,
                  cash_in_ted: value,
                })
              }
              helperText={
                errors.cash_in_ted ? errors.cash_in_ted.join("") : null
              }
              error={errors.cash_in_ted}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              style={{
                fontFamily: "Montserrat-SemiBold",
                marginLeft: "15px",
                marginBottom: "5px",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              Recebimento PIX
            </Typography>
            <ButtonGroup
              size="small"
              style={{ marginBottom: "0px", marginLeft: "15px" }}
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button
                style={{
                  backgroundColor: `${
                    tipoTaxa.inPix === 1 ? "black" : "#cfcfcf"
                  }`,
                  color: "white",
                }}
                onClick={() => setTipoTaxa({ ...tipoTaxa, inPix: 1 })}
                disabled={tipoTaxa.inPix === 1 ? true : false}
              >
                Fixo
              </Button>
              <Button
                style={{
                  backgroundColor: `${
                    tipoTaxa.inPix === 2 ? "black" : "#cfcfcf"
                  }`,
                  color: "white",
                }}
                onClick={() => setTipoTaxa({ ...tipoTaxa, inPix: 2 })}
                disabled={tipoTaxa.inPix === 2 ? true : false}
              >
                %
              </Button>
            </ButtonGroup>
            <CurrencyFormat
              {...options}
              prefix={tipoTaxa.inPix === 1 ? "R$ " : ""}
              suffix={tipoTaxa.inPix === 2 ? "%" : ""}
              value={taxa.cash_in_pix}
              onValueChange={({ value }) =>
                setTaxa({
                  ...taxa,
                  cash_in_pix: value,
                })
              }
              helperText={
                errors.cash_in_pix ? errors.cash_in_pix.join("") : null
              }
              error={errors.cash_in_pix}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              style={{
                fontFamily: "Montserrat-SemiBold",
                marginLeft: "15px",
                marginBottom: "5px",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              Recebimento P2P
            </Typography>
            <ButtonGroup
              size="small"
              style={{ marginBottom: "0px", marginLeft: "15px" }}
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button
                style={{
                  backgroundColor: `${
                    tipoTaxa.inP2p === 1 ? "black" : "#cfcfcf"
                  }`,
                  color: "white",
                }}
                onClick={() => setTipoTaxa({ ...tipoTaxa, inP2p: 1 })}
                disabled={tipoTaxa.inP2p === 1 ? true : false}
              >
                Fixo
              </Button>
              <Button
                style={{
                  backgroundColor: `${
                    tipoTaxa.inP2p === 2 ? "black" : "#cfcfcf"
                  }`,
                  color: "white",
                }}
                onClick={() => setTipoTaxa({ ...tipoTaxa, inP2p: 2 })}
                disabled={tipoTaxa.inP2p === 2 ? true : false}
              >
                %
              </Button>
            </ButtonGroup>
            <CurrencyFormat
              {...options}
              prefix={tipoTaxa.inP2p === 1 ? "R$ " : ""}
              suffix={tipoTaxa.inP2p === 2 ? "%" : ""}
              value={taxa.cash_in_p2p}
              onValueChange={({ value }) =>
                setTaxa({
                  ...taxa,
                  cash_in_p2p: value,
                })
              }
              helperText={
                errors.cash_in_p2p ? errors.cash_in_p2p.join("") : null
              }
              error={errors.cash_in_p2p}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              style={{
                fontFamily: "Montserrat-SemiBold",
                marginLeft: "15px",
                marginBottom: "5px",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              Transferência P2P
            </Typography>
            <ButtonGroup
              size="small"
              style={{ marginBottom: "0px", marginLeft: "15px" }}
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button
                style={{
                  backgroundColor: `${
                    tipoTaxa.outP2p === 1 ? "black" : "#cfcfcf"
                  }`,
                  color: "white",
                }}
                onClick={() => setTipoTaxa({ ...tipoTaxa, outP2p: 1 })}
                disabled={tipoTaxa.outP2p === 1 ? true : false}
              >
                Fixo
              </Button>
              <Button
                style={{
                  backgroundColor: `${
                    tipoTaxa.outP2p === 2 ? "black" : "#cfcfcf"
                  }`,
                  color: "white",
                }}
                onClick={() => setTipoTaxa({ ...tipoTaxa, outP2p: 2 })}
                disabled={tipoTaxa.outP2p === 2 ? true : false}
              >
                %
              </Button>
            </ButtonGroup>
            <CurrencyFormat
              {...options}
              prefix={tipoTaxa.outP2p === 1 ? "R$ " : ""}
              suffix={tipoTaxa.outP2p === 2 ? "%" : ""}
              value={taxa.cash_out_p2p}
              onValueChange={({ value }) =>
                setTaxa({
                  ...taxa,
                  cash_out_p2p: value,
                })
              }
              helperText={
                errors.cash_out_p2p ? errors.cash_out_p2p.join("") : null
              }
              error={errors.cash_out_p2p}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              style={{
                fontFamily: "Montserrat-SemiBold",
                marginLeft: "15px",
                marginBottom: "5px",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              Transferência TED
            </Typography>
            <ButtonGroup
              size="small"
              style={{ marginBottom: "0px", marginLeft: "15px" }}
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button
                style={{
                  backgroundColor: `${
                    tipoTaxa.outTed === 1 ? "black" : "#cfcfcf"
                  }`,
                  color: "white",
                }}
                onClick={() => setTipoTaxa({ ...tipoTaxa, outTed: 1 })}
                disabled={tipoTaxa.outTed === 1 ? true : false}
              >
                Fixo
              </Button>
              <Button
                style={{
                  backgroundColor: `${
                    tipoTaxa.outTed === 2 ? "black" : "#cfcfcf"
                  }`,
                  color: "white",
                }}
                onClick={() => setTipoTaxa({ ...tipoTaxa, outTed: 2 })}
                disabled={tipoTaxa.outTed === 2 ? true : false}
              >
                %
              </Button>
            </ButtonGroup>
            <CurrencyFormat
              {...options}
              prefix={tipoTaxa.outTed === 1 ? "R$ " : ""}
              suffix={tipoTaxa.outTed === 2 ? "%" : ""}
              value={taxa.cash_out_ted}
              onValueChange={({ value }) =>
                setTaxa({
                  ...taxa,
                  cash_out_ted: value,
                })
              }
              helperText={
                errors.cash_out_ted ? errors.cash_out_ted.join("") : null
              }
              error={errors.cash_out_ted}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              style={{
                fontFamily: "Montserrat-SemiBold",
                marginLeft: "15px",
                marginBottom: "5px",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              Transferência Pix
            </Typography>
            <ButtonGroup
              size="small"
              style={{ marginBottom: "0px", marginLeft: "15px" }}
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button
                style={{
                  backgroundColor: `${
                    tipoTaxa.outPix === 1 ? "black" : "#cfcfcf"
                  }`,
                  color: "white",
                }}
                onClick={() => setTipoTaxa({ ...tipoTaxa, outPix: 1 })}
                disabled={tipoTaxa.outPix === 1 ? true : false}
              >
                Fixo
              </Button>
              <Button
                style={{
                  backgroundColor: `${
                    tipoTaxa.outPix === 2 ? "black" : "#cfcfcf"
                  }`,
                  color: "white",
                }}
                onClick={() => setTipoTaxa({ ...tipoTaxa, outPix: 2 })}
                disabled={tipoTaxa.outPix === 2 ? true : false}
              >
                %
              </Button>
            </ButtonGroup>
            <CurrencyFormat
              {...options}
              prefix={tipoTaxa.outPix === 1 ? "R$ " : ""}
              suffix={tipoTaxa.outPix === 2 ? "%" : ""}
              value={taxa.cash_out_pix}
              onValueChange={({ value }) =>
                setTaxa({
                  ...taxa,
                  cash_out_pix: value,
                })
              }
              helperText={
                errors.cash_out_pix ? errors.cash_out_pix.join("") : null
              }
              error={errors.cash_out_pix}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CustomButton color="black" onClick={handleAlterar}>
                Criar
              </CustomButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <LoadingScreen isLoading={loading} />
    </Box>
  );
};

export default EditFees;
