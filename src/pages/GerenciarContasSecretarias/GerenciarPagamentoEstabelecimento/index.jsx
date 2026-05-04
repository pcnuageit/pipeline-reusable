import {
  faCheck,
  faList,
  faSearchDollar,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import { Box, makeStyles, Typography } from "@material-ui/core";

import AccountCollectionItem from "../../../components/AccountCollections/AccountCollectionItem/AccountCollectionItem";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  accountCollectionContainer: {
    width: "60%",
    display: "flex",
    height: "100%",
    flexDirection: "column",
    color: theme.palette.primary.main,
    [theme.breakpoints.down(850)]: {
      width: "100%",
    },
  },
}));

export default function GerenciarPagamentoEstabelecimento() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.accountCollectionContainer}>
        <Typography variant="h6">
          Gerenciar pagamentos de estabelecimentos
        </Typography>
      </Box>

      <Box display="flex">
        <AccountCollectionItem
          link={
            "gerenciar-pagamento-estabelecimento/pagamento-beneficiarios-estabelecimento"
          }
          text="Todos Pagamentos"
          icon={faStore}
        />

        <AccountCollectionItem
          link={
            "gerenciar-pagamento-estabelecimento/auditoria-pagamento-estabelecimento"
          }
          text="Auditar Pagamentos"
          icon={faSearchDollar}
        />

        <AccountCollectionItem
          link={
            "gerenciar-pagamento-estabelecimento/autorizar-pagamento-beneficiarios-estabelecimento"
          }
          text="Autorizar Pagamentos"
          icon={faCheck}
        />

        <AccountCollectionItem
          link={"gerenciar-pagamento-estabelecimento/extrato-reembolso"}
          text="Extrato do Reembolso"
          icon={faList}
        />
      </Box>
    </Box>
  );
}
