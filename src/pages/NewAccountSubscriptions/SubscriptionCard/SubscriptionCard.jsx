import { Box, Grid, TextField } from "@material-ui/core";
import { useState } from "react";
import Cards from "react-credit-cards";
import InputMask from "react-input-mask";

const SubscriptionCard = ({ pagador, setPagador, errosPagador }) => {
  const [validade, setValidade] = useState("");

  const handleSetValidade = (e) => {
    const [mes, ano] = e.target.value.split("/");
    return (
      setValidade(e.target.value),
      setPagador({
        ...pagador,
        cartao: {
          ...pagador.cartao,
          mes: mes,
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
        ></Box>
        <Cards
          cvc={pagador.cartao.cvv}
          expiry={validade}
          focused={pagador.cartao.focus}
          name={pagador.cartao.nome}
          number={pagador.cartao.numero}
          placeholders={{ name: "NOME DO TITULAR" }}
        />
      </Box>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InputMask
              name="number"
              mask="9999 9999 9999 9999"
              maskChar=" "
              value={pagador.cartao.numero}
              onFocus={(e) =>
                setPagador({
                  ...pagador,
                  cartao: {
                    ...pagador.cartao,
                    focus: e.target.name,
                  },
                })
              }
              onChange={(e) =>
                setPagador({
                  ...pagador,
                  cartao: {
                    ...pagador.cartao,
                    numero: e.target.value,
                  },
                })
              }
            >
              {() => (
                <TextField
                  error={errosPagador["numero"]}
                  helperText={
                    errosPagador["numero"]
                      ? errosPagador["numero"].join(" ")
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
              error={errosPagador["nome"]}
              helperText={
                errosPagador["nome"] ? errosPagador["nome"].join(" ") : null
              }
              value={pagador.cartao.nome}
              onFocus={(e) =>
                setPagador({
                  ...pagador,
                  cartao: {
                    ...pagador.cartao,
                    focus: e.target.name,
                  },
                })
              }
              onChange={(e) =>
                setPagador({
                  ...pagador,
                  cartao: {
                    ...pagador.cartao,
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
                setPagador({
                  ...pagador,
                  cartao: {
                    ...pagador.cartao,
                    focus: e.target.name,
                  },
                })
              }
              name="expiry"
              mask="99/9999"
            >
              {() => (
                <TextField
                  error={errosPagador["mes"] + errosPagador["ano"]}
                  helperText={
                    errosPagador["mes"]
                      ? errosPagador["mes"].join(" ")
                      : null || errosPagador["ano"]
                        ? errosPagador["ano"].join(" ")
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
              value={pagador.cartao.cvv}
              onFocus={(e) =>
                setPagador({
                  ...pagador,
                  cartao: {
                    ...pagador.cartao,
                    focus: e.target.name,
                  },
                })
              }
              onChange={(e) =>
                setPagador({
                  ...pagador,
                  cartao: {
                    ...pagador.cartao,
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
                  error={errosPagador["cvv"]}
                  helperText={
                    errosPagador["cvv"] ? errosPagador["cvv"].join(" ") : null
                  }
                  required
                  fullWidth
                  label="CVV"
                />
              )}
            </InputMask>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default SubscriptionCard;
