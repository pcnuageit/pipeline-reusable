import { useState } from "react";

import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import Cards from "react-credit-cards";

import "react-credit-cards/es/styles-compiled.css";

import CurrencyInput from "react-currency-input";
import InputMask from "react-input-mask";
import { APP_CONFIG } from "../../constants/config";

const useStyles = makeStyles((theme) => ({
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

const RegistrarCartaoCredito = ({
  linkPagamentoPagar,
  setLinkPagamentoPagar,
  handlePost,
  errosLink,
  vendaSimples,
}) => {
  const classes = useStyles();
  const [validade, setValidade] = useState("");

  const handleSetValidade = (e) => {
    const [mes, ano] = e.target.value.split("/");
    return (
      setValidade(e.target.value),
      setLinkPagamentoPagar({
        ...linkPagamentoPagar,
        cartao: {
          ...linkPagamentoPagar.cartao,
          mes: parseInt(mes),
          ano: ano,
        },
      })
    );
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box marginBottom="12px" marginTop="24px">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginBottom="12px"
        >
          <FormControl error={errosLink.valor}>
            <Typography
              style={{
                alignSelf: "center",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Valor da Cobrança
            </Typography>
            <CurrencyInput
              className={classes.currency}
              decimalSeparator=","
              thousandSeparator="."
              prefix="R$ "
              value={linkPagamentoPagar.valor}
              onChangeEvent={(event, maskedvalue, floatvalue) =>
                setLinkPagamentoPagar({
                  ...linkPagamentoPagar,
                  valor: floatvalue,
                })
              }
              style={{
                marginBottom: "6px",
                width: "60%",
                alignSelf: "center",
                color: APP_CONFIG.mainCollors.primary,
              }}
            />
            {errosLink.valor ? (
              <FormHelperText>{errosLink.valor.join(" ")}</FormHelperText>
            ) : null}
          </FormControl>
        </Box>
        <Cards
          cvc={linkPagamentoPagar.cartao.cvv}
          expiry={validade}
          focused={linkPagamentoPagar.cartao.focus}
          name={linkPagamentoPagar.cartao.nome}
          number={linkPagamentoPagar.cartao.numero}
          placeholders={{ name: "NOME DO TITULAR" }}
        />
      </Box>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InputMask
              name="number"
              mask="9999999999999999"
              maskChar=" "
              value={linkPagamentoPagar.cartao.numero}
              onFocus={(e) =>
                setLinkPagamentoPagar({
                  ...linkPagamentoPagar,
                  cartao: {
                    ...linkPagamentoPagar.cartao,
                    focus: e.target.name,
                  },
                })
              }
              onChange={(e) =>
                setLinkPagamentoPagar({
                  ...linkPagamentoPagar,
                  cartao: {
                    ...linkPagamentoPagar.cartao,
                    numero: e.target.value,
                  },
                })
              }
            >
              {() => (
                <TextField
                  error={errosLink["cartao.numero"]}
                  helperText={
                    errosLink["cartao.numero"]
                      ? errosLink["cartao.numero"].join(" ")
                      : null
                  }
                  name="number"
                  required
                  fullWidth
                  label="Número do Cartão"
                />
              )}
            </InputMask>
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={errosLink["cartao.nome"]}
              helperText={
                errosLink["cartao.nome"]
                  ? errosLink["cartao.nome"].join(" ")
                  : null
              }
              value={linkPagamentoPagar.cartao.nome}
              onFocus={(e) =>
                setLinkPagamentoPagar({
                  ...linkPagamentoPagar,
                  cartao: {
                    ...linkPagamentoPagar.cartao,
                    focus: e.target.name,
                  },
                })
              }
              onChange={(e) =>
                setLinkPagamentoPagar({
                  ...linkPagamentoPagar,
                  cartao: {
                    ...linkPagamentoPagar.cartao,
                    nome: e.target.value,
                  },
                })
              }
              required
              name="name"
              fullWidth
              label="Nome do títular"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <InputMask
              value={validade}
              onChange={(e) => handleSetValidade(e)}
              onFocus={(e) =>
                setLinkPagamentoPagar({
                  ...linkPagamentoPagar,
                  cartao: {
                    ...linkPagamentoPagar.cartao,
                    focus: e.target.name,
                  },
                })
              }
              name="expiry"
              mask="99/9999"
            >
              {() => (
                <TextField
                  error={errosLink["cartao.mes"] + errosLink["cartao.ano"]}
                  helperText={
                    errosLink["cartao.mes"]
                      ? errosLink["cartao.mes"].join(" ")
                      : null || errosLink["cartao.ano"]
                        ? errosLink["cartao.ano"].join(" ")
                        : null
                  }
                  name="expiry"
                  required
                  fullWidth
                  label="Validade"
                />
              )}
            </InputMask>
          </Grid>

          <Grid item xs={12} sm={3}>
            <InputMask
              name="cvv"
              value={linkPagamentoPagar.cartao.cvv}
              onFocus={(e) =>
                setLinkPagamentoPagar({
                  ...linkPagamentoPagar,
                  cartao: {
                    ...linkPagamentoPagar.cartao,
                    focus: e.target.name,
                  },
                })
              }
              onChange={(e) =>
                setLinkPagamentoPagar({
                  ...linkPagamentoPagar,
                  cartao: {
                    ...linkPagamentoPagar.cartao,
                    cvv: e.target.value,
                  },
                })
              }
              mask="999"
              maskChar=" "
            >
              {() => (
                <TextField
                  name="cvc"
                  error={errosLink["cartao.cvv"]}
                  helperText={
                    errosLink["cartao.cvv"]
                      ? errosLink["cartao.cvv"].join(" ")
                      : null
                  }
                  required
                  fullWidth
                  label="CVV"
                />
              )}
            </InputMask>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              value={linkPagamentoPagar.parcelas}
              onChange={(e) =>
                setLinkPagamentoPagar({
                  ...linkPagamentoPagar,
                  parcelas: e.target.value,
                })
              }
              error={errosLink.parcelas}
              helperText={
                errosLink.parcelas ? errosLink.parcelas.join(" ") : null
              }
              required
              fullWidth
              label="Quantidade de parcelas"
              type="number"
              min="0"
              max="12"
            />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default RegistrarCartaoCredito;
