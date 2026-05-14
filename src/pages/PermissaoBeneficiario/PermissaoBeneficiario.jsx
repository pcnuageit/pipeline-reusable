import {
  faBarcode,
  faCopy,
  faCreditCard,
  faLink,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Switch,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import {
  delPermissao,
  loadPermissaoGerenciar,
  postPermissaoAction,
} from "../../actions/actions";

import AccountCollectionItem from "../../components/AccountCollections/AccountCollectionItem/AccountCollectionItem";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import useAuth from "../../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    /* padding: '80px 400px ', */
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: "25px",
  },
  pageTitle: {
    color: "#c6930a",
    fontFamily: "Montserrat-SemiBold",
  },
  subTitleContainer: {
    margin: "15px 15px",
    display: "flex",
    justifyContent: "space-between",
  },
  contentContainer: {
    marginTop: "20px",
  },
  responsiveContainer: {
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down(850)]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
}));

const PermissaoBeneficiario = () => {
  const classes = useStyles();
  const token = useAuth();
  const history = useHistory();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams();
  const dispatch = useDispatch();

  const gerenciarPermissao = useSelector((state) => state.gerenciarPermissao);
  const [permissoes, setPermissoes] = useState([]);

  useEffect(() => {
    dispatch(loadPermissaoGerenciar(token, id));
  }, []);

  useEffect(() => {
    const { permissao } = gerenciarPermissao;
    setPermissoes(permissao.map((item) => item.tipo));
  }, [gerenciarPermissao, gerenciarPermissao.permissao.length]);

  useEffect(() => {
    return () => {
      setPermissoes([]);
    };
  }, []);

  const handlePermissoes = async (event) => {
    setLoading(true);
    if (permissoes.includes(event.target.name)) {
      await dispatch(delPermissao(token, id, event.target.value));
      await dispatch(loadPermissaoGerenciar(token, id));
      setLoading(false);
    } else {
      await dispatch(postPermissaoAction(token, id, event.target.value));
      await dispatch(loadPermissaoGerenciar(token, id));
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" className={classes.root}>
      <LoadingScreen isLoading={loading} />
      {/* <CustomBreadcrumbs
				path1="Administradores"
				to1="goBack"
				path2="Gerenciar Permissões"
			/> */}
      <Typography style={{ marginTop: "8px" }} variant="h4">
        Gerenciar Permissões
      </Typography>

      <Box className={classes.responsiveContainer}>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Concorrência - Todos Programas"
            icon={faCreditCard}
          />
          <Switch
            name={"Concorrência - Todos Programas"}
            value={21}
            checked={
              permissoes.includes("Concorrência - Todos Programas")
                ? true
                : false
            }
            onClick={handlePermissoes}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Concorrência - Gestão Programa SEDS - Mães de Goiás"
            icon={faBarcode}
          />
          <Switch
            name={"Concorrência - Gestão Programa SEDS - Mães de Goiás"}
            value={22}
            checked={
              permissoes.includes(
                "Concorrência - Gestão Programa SEDS - Mães de Goiás",
              )
                ? true
                : false
            }
            onClick={handlePermissoes}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Concorrência - Gestão Programa SEDUC - Bolsa Aluno"
            icon={faCopy}
          />
          <Switch
            name={"Concorrência - Gestão Programa SEDUC - Bolsa Aluno"}
            value={23}
            checked={
              permissoes.includes(
                "Concorrência - Gestão Programa SEDUC - Bolsa Aluno",
              )
                ? true
                : false
            }
            onClick={handlePermissoes}
          />
        </Box>
      </Box>

      <Box className={classes.responsiveContainer}>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Concorrência - Cadastro Cartão Beneficiário"
            icon={faUndo}
          />
          <Switch
            name={"Concorrência - Cadastro Cartão Beneficiário"}
            value={24}
            checked={
              permissoes.includes("Concorrência - Cadastro Cartão Beneficiário")
                ? true
                : false
            }
            onClick={handlePermissoes}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Concorrência - Cadastro Saldo Cartão Beneficiário"
            typographyStyle={{ fontSize: 14 }}
            icon={faLink}
          />
          <Switch
            name={"Concorrência - Cadastro Saldo Cartão Beneficiário"}
            value={25}
            checked={
              permissoes.includes(
                "Concorrência - Cadastro Saldo Cartão Beneficiário",
              )
                ? true
                : false
            }
            onClick={handlePermissoes}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PermissaoBeneficiario;
