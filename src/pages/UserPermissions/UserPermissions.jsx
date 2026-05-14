import {
  faBan,
  faBarcode,
  faCheck,
  faCopy,
  faCreditCard,
  faDesktop,
  faDollarSign,
  faForward,
  faGift,
  faHistory,
  faLink,
  faList,
  faMobileAlt,
  faSignOutAlt,
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
import CustomBreadcrumbs from "../../components/CustomBreadcrumbs/CustomBreadcrumbs";
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

const UserPermissions = () => {
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
      <CustomBreadcrumbs
        path1="Administradores"
        to1="goBack"
        path2="Gerenciar Permissões"
      />
      <Typography style={{ marginTop: "8px" }} variant="h4">
        Gerenciar Permissões
      </Typography>

      <Box className={classes.responsiveContainer}>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem text="Acesso total" icon={faCreditCard} />
          <Switch
            name={"Administrador - Acesso total"}
            value={1}
            checked={
              permissoes.includes("Administrador - Acesso total") ? true : false
            }
            onClick={handlePermissoes}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem text="Bloquear device" icon={faBarcode} />
          <Switch
            name={"Operações - Bloquear device"}
            value={2}
            checked={
              permissoes.includes("Operações - Bloquear device") ? true : false
            }
            onClick={handlePermissoes}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem text="Cancelamento de conta" icon={faCopy} />
          <Switch
            name={"Operações - Cancelamento de conta"}
            value={3}
            checked={
              permissoes.includes("Operações - Cancelamento de conta")
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
            text="Operações Gerenciamento de Conta"
            icon={faUndo}
          />
          <Switch
            name={
              "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar"
            }
            value={4}
            checked={
              permissoes.includes(
                "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar",
              )
                ? true
                : false
            }
            onClick={handlePermissoes}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Transações e histórico de transações não concluídas"
            typographyStyle={{ fontSize: 14 }}
            icon={faLink}
          />
          <Switch
            name={
              "Operações - Transações e histórico de transações não concluídas"
            }
            value={5}
            checked={
              permissoes.includes(
                "Operações - Transações e histórico de transações não concluídas",
              )
                ? true
                : false
            }
            onClick={handlePermissoes}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Bloqueio de dispositivo por perda ou roubo"
            icon={faDesktop}
          />
          <Switch
            name={"Atendimento - Bloqueio de dispositivo por perda ou roubo"}
            value={11}
            checked={
              permissoes.includes(
                "Atendimento - Bloqueio de dispositivo por perda ou roubo",
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
            text="Consulta de extrato"
            icon={faDollarSign}
          />
          <Switch
            name={"Atendimento - Consulta de extrato"}
            value={6}
            checked={
              permissoes.includes("Atendimento - Consulta de extrato")
                ? true
                : false
            }
            onClick={handlePermissoes}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Consulta de status da conta"
            icon={faHistory}
          />
          <Switch
            name={"Atendimento - Consulta de status da conta"}
            value={7}
            checked={
              permissoes.includes("Atendimento - Consulta de status da conta")
                ? true
                : false
            }
            onClick={handlePermissoes}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            typographyStyle={{ fontSize: "0.85rem" }}
            text="Consulta ao motivo de pendências de abertura de conta"
            icon={faForward}
          />
          <Switch
            name={
              "Atendimento - Consulta ao motivo de pendências de abertura de conta"
            }
            value={8}
            checked={
              permissoes.includes(
                "Atendimento - Consulta ao motivo de pendências de abertura de conta",
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
            typographyStyle={{ fontSize: 13 }}
            text="Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)"
            icon={faSignOutAlt}
          />
          <Switch
            name={
              "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)"
            }
            value={9}
            checked={
              permissoes.includes(
                "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)",
              )
                ? true
                : false
            }
            onClick={handlePermissoes}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem text="Número da conta" icon={faCheck} />
          <Switch
            name={"Atendimento - Número da conta"}
            value={10}
            checked={
              permissoes.includes("Atendimento - Número da conta")
                ? true
                : false
            }
            onClick={handlePermissoes}
          />
          <AccountCollectionItem
            typographyStyle={{ fontSize: 14 }}
            text="Gerencimento de administradores"
            icon={faBan}
          />
          <Switch
            name={"Operações - Gerencimento de administradores"}
            value={12}
            checked={
              permissoes.includes("Operações - Gerencimento de administradores")
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
            text="Parceiros - Visualizar Jeitto"
            icon={faCreditCard}
          />
          <Switch
            name={"Parceiros - Visualizar Jeitto"}
            value={14}
            checked={
              permissoes.includes("Parceiros - Visualizar Jeitto")
                ? true
                : false
            }
            onClick={handlePermissoes}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Parceiros - Visualizar Recargar"
            icon={faMobileAlt}
          />
          <Switch
            name={"Parceiros - Visualizar Recargar"}
            value={15}
            checked={
              permissoes.includes("Parceiros - Visualizar Recargar")
                ? true
                : false
            }
            onClick={handlePermissoes}
          />
          <AccountCollectionItem
            text="Parceiros - Visualizar GiftCard"
            icon={faGift}
          />
          <Switch
            name={"Parceiros - Visualizar GiftCard"}
            value={16}
            checked={
              permissoes.includes("Parceiros - Visualizar GiftCard")
                ? true
                : false
            }
            onClick={handlePermissoes}
          />
        </Box>
      </Box>
      <Box className={classes.responsiveContainer}>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem text="Visualizar Logs" icon={faList} />
          <Switch
            name={"Operações - Visualizar Logs"}
            value={13}
            checked={
              permissoes.includes("Operações - Visualizar Logs") ? true : false
            }
            onClick={handlePermissoes}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UserPermissions;
