import {
  Box,
  Collapse,
  IconButton,
  LinearProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  loadResumoTransacao,
  loadTransacoesFuturas,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useCustomDate from "../../hooks/useCustomDate";

const useStyles = makeStyles((theme) => ({
  transactionsArea: {
    display: "flex",
    marginBottom: "30px",
    justifyContent: "space-between",
    background: APP_CONFIG.mainCollors.primary,
    padding: "30px",
    color: "#fff",
    borderRadius: "0 0 30px 30px",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      padding: "15px 30px",
    },
    [theme.breakpoints.only("xs")]: {},
  },
  transactionsItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  transactionsLine: {
    display: "flex",
    flexDirection: "column",
  },
  overlineWrapper: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.7rem",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.6rem",
    },
  },
  valueWrapper: {
    fontSize: "2.0rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.3rem",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.0rem",
    },
  },

  responsiveWrapper: {
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      margin: "6px",
    },
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  boxContent: {
    background: APP_CONFIG.mainCollors.primary,
    borderRadius: "30px 30px 0 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const FullTransactionSummary = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [checked, setChecked] = useState(false);
  const resumoTransacao = useSelector((state) => state.resumoTransacao);
  const transacoesFuturas = useSelector((state) => state.transacoesFuturas);
  const { date } = props;
  const token = useAuth();
  const { month, year } = useCustomDate({ date });

  useEffect(() => {
    dispatch(loadTransacoesFuturas(token, date));
    dispatch(loadResumoTransacao(token, date));
  }, [month, year, dispatch]);

  if (transacoesFuturas.aprovado === undefined) {
    return (
      <LinearProgress
        className={classes.boxContent}
        color="secondary"
        style={{ borderRadius: "30px", height: "48px" }}
      />
    );
  } else {
    return (
      <Box display="flex" flexDirection="column">
        <Box
          className={classes.boxContent}
          style={!checked ? { borderRadius: "30px" } : null}
        >
          <Typography style={{ color: "white" }} variant="h6">
            Resumo de Transações {date ? `${month}-${year}` : null}
          </Typography>
          <IconButton
            style={{ justifySelf: "flex-end" }}
            className={clsx(classes.expand, {
              [classes.expandOpen]: checked,
            })}
            onClick={() => setChecked(!checked)}
            aria-label="show more"
          >
            <ExpandMoreIcon style={{ color: "white" }} />
          </IconButton>
        </Box>
        <Collapse in={checked}>
          <Box className={classes.transactionsArea}>
            <Box
              className={classes.transactionsLine}
              style={{ marginBottom: "10px" }}
            >
              <Box className={classes.transactionsItem}>
                <Typography
                  variant="overline"
                  className={classes.overlineWrapper}
                >
                  Transacionado no Mês
                </Typography>
                <Typography variant="h3" className={classes.valueWrapper}>
                  R${" "}
                  {transacoesFuturas.transacionado
                    ? transacoesFuturas.transacionado
                        .replace(".", ",")
                        .replace(",", ".")
                    : null}
                </Typography>
              </Box>
              <Box className={classes.transactionsItem}>
                <Typography
                  variant="overline"
                  className={classes.overlineWrapper}
                >
                  Transações Aprovadas
                </Typography>
                <Typography variant="h3" className={classes.valueWrapper}>
                  R${" "}
                  {transacoesFuturas.aprovado
                    ? transacoesFuturas.aprovado
                        .replace(".", ",")
                        .replace(",", ".")
                    : null}
                </Typography>
              </Box>
              <Box className={classes.transactionsItem}>
                <Typography
                  variant="overline"
                  className={classes.overlineWrapper}
                >
                  Transações Negadas
                </Typography>
                <Typography variant="h3" className={classes.valueWrapper}>
                  R${" "}
                  {transacoesFuturas.recusado
                    ? transacoesFuturas.recusado
                        .replace(".", ",")
                        .replace(",", ".")
                    : null}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.transactionsLine}>
              <Box className={classes.transactionsItem}>
                <Typography
                  variant="overline"
                  className={classes.overlineWrapper}
                >
                  Recebíveis Previstos
                </Typography>
                <Typography variant="h3" className={classes.valueWrapper}>
                  R${" "}
                  {resumoTransacao.previsto
                    ? resumoTransacao.previsto
                        .replace(".", ",")
                        .replace(",", ".")
                    : null}
                </Typography>
              </Box>
              <Box className={classes.transactionsItem}>
                <Typography
                  variant="overline"
                  className={classes.overlineWrapper}
                >
                  Recebíveis Pagos
                </Typography>
                <Typography variant="h3" className={classes.valueWrapper}>
                  R${" "}
                  {resumoTransacao.pago
                    ? resumoTransacao.pago.replace(".", ",").replace(",", ".")
                    : null}
                </Typography>
              </Box>
              <Box className={classes.transactionsItem}>
                <Typography
                  variant="overline"
                  className={classes.overlineWrapper}
                >
                  Recebíveis Pendentes
                </Typography>
                <Typography variant="h3" className={classes.valueWrapper}>
                  R${" "}
                  {resumoTransacao.pendente
                    ? resumoTransacao.pendente
                        .replace(".", ",")
                        .replace(",", ".")
                    : null}
                </Typography>
              </Box>
            </Box>
            <Box
              className={classes.transactionsLine}
              style={{ justifyContent: "center" }}
            >
              <Box className={classes.transactionsItem}>
                <Typography
                  variant="overline"
                  className={classes.overlineWrapper}
                >
                  Taxa de Conversão
                </Typography>
                <Typography variant="h3" className={classes.valueWrapper}>
                  {transacoesFuturas.conversao &&
                  transacoesFuturas.conversao > 0
                    ? String(transacoesFuturas.conversao).replace(".", ",") +
                      "%"
                    : "0.00%"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Box>
    );
  }
};

export default FullTransactionSummary;
