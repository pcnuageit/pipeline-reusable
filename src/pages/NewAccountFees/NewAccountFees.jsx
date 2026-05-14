import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useState } from "react";

import CurrencyFormat from "react-currency-format";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { postPerfilTaxaAction } from "../../actions/actions";
import CustomButton from "../../components/CustomButton/CustomButton";
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

const options = {
  displayType: "input",
  thousandSeparator: ".",
  decimalSeparator: ",",
  allowNegative: false,
  isNumericString: true,
  customInput: TextField,
  style: { width: "100%" },
};

const NewAccountFees = () => {
  const [tipoTaxa, setTipoTaxa] = useState({
    inBoleto: 1,
    inTed: 1,
    inPix: 1,
    inP2p: 1,
    outP2p: 1,
    outTed: 1,
    outPix: 1,
  });
  const token = useAuth();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [taxa, setTaxa] = useState({
    nome: "",
    cash_in_payout_zoop: "",
    cash_in_boleto: "",
    cash_in_ted: "",
    cash_in_pix: "",
    cash_in_p2p: "",
    cash_out_p2p: "",
    cash_out_ted: "",
    cash_out_pix: "",
  });

  const handleCriar = async () => {
    setLoading(true);
    const res = await dispatch(
      postPerfilTaxaAction(
        token,
        taxa.nome,
        parseFloat(taxa.cash_in_payout_zoop),
        tipoTaxa.inBoleto,
        parseFloat(taxa.cash_in_boleto),
        tipoTaxa.inTed,
        parseFloat(taxa.cash_in_ted),
        tipoTaxa.inPix,
        parseFloat(taxa.cash_in_pix),
        tipoTaxa.inP2p,

        parseFloat(taxa.cash_in_p2p),
        tipoTaxa.outP2p,
        parseFloat(taxa.cash_out_p2p),
        tipoTaxa.outTed,

        parseFloat(taxa.cash_out_ted),
        tipoTaxa.outPix,
        parseFloat(taxa.cash_out_pix),
      ),
    );
    if (res) {
      setErrors(res);
      toast.error("Erro ao criar Tarifa");
      setLoading(false);
    } else {
      toast.success("Tarifa criada com sucesso");
      history.push("/dashboard/taxas");
      setLoading(false);
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.headerContainer}>
        <Box style={{ marginBottom: "20px" }}>
          <Typography className={classes.pageTitle}>Criar Tarifa</Typography>
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
                color: "#9D9CC6",
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
                color: "#9D9CC6",
              }}
            >
              Nome da tarifa
            </Typography>
            <TextField
              variant="outlined"
              shrink
              style={{ width: "100%" }}
              value={taxa.nome}
              onChange={(e) =>
                setTaxa({
                  ...taxa,
                  nome: e.target.value,
                })
              }
              helperText={errors.nome ? errors.nome[0] : null}
              error={errors.nome}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
						<CurrencyFormat
						variant='outlined'
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
								errors.cash_in_payout_zoop
									? errors.cash_in_payout_zoop[0]
									: null
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
                color: "#9D9CC6",
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
                    tipoTaxa.inBoleto === 1 ? "#4C4B97" : "#cfcfcf"
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
                    tipoTaxa.inBoleto === 2 ? "#4C4B97" : "#cfcfcf"
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
              variant="outlined"
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
                errors.cash_in_boleto ? errors.cash_in_boleto[0] : null
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
                color: "#9D9CC6",
              }}
            >
              Recebimento TED
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
                    tipoTaxa.inTed === 1 ? "#4C4B97" : "#cfcfcf"
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
                    tipoTaxa.inTed === 2 ? "#4C4B97" : "#cfcfcf"
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
              variant="outlined"
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
              helperText={errors.cash_in_ted ? errors.cash_in_ted[0] : null}
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
                color: "#9D9CC6",
              }}
            >
              Recebimento Pix
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
                    tipoTaxa.inPix === 1 ? "#4C4B97" : "#cfcfcf"
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
                    tipoTaxa.inPix === 2 ? "#4C4B97" : "#cfcfcf"
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
              variant="outlined"
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
              helperText={errors.cash_in_pix ? errors.cash_in_pix[0] : null}
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
                color: "#9D9CC6",
              }}
            >
              Recebimento P2P
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
                    tipoTaxa.inP2p === 1 ? "#4C4B97" : "#cfcfcf"
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
                    tipoTaxa.inP2p === 2 ? "#4C4B97" : "#cfcfcf"
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
              variant="outlined"
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
              helperText={errors.cash_in_p2p ? errors.cash_in_p2p[0] : null}
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
                color: "#9D9CC6",
              }}
            >
              Transferência P2P
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
                    tipoTaxa.outP2p === 1 ? "#4C4B97" : "#cfcfcf"
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
                    tipoTaxa.outP2p === 2 ? "#4C4B97" : "#cfcfcf"
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
              variant="outlined"
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
              helperText={errors.cash_out_p2p ? errors.cash_out_p2p[0] : null}
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
                color: "#9D9CC6",
              }}
            >
              Transferência TED
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
                    tipoTaxa.outTed === 1 ? "#4C4B97" : "#cfcfcf"
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
                    tipoTaxa.outTed === 2 ? "#4C4B97" : "#cfcfcf"
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
              variant="outlined"
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
              helperText={errors.cash_out_ted ? errors.cash_out_ted[0] : null}
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
                color: "#9D9CC6",
              }}
            >
              Transferência Pix
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
                    tipoTaxa.outPix === 1 ? "#4C4B97" : "#cfcfcf"
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
                    tipoTaxa.outPix === 2 ? "#4C4B97" : "#cfcfcf"
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
              variant="outlined"
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
              helperText={errors.cash_out_pix ? errors.cash_out_pix[0] : null}
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
              <CustomButton color="purple" onClick={handleCriar}>
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

export default NewAccountFees;
