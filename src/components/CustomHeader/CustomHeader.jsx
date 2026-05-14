import { Box, makeStyles, TextField, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { generatePath, Link, useHistory } from "react-router-dom";

import { ArrowBack } from "@mui/icons-material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AddIcon from "@mui/icons-material/Add";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  setAutorizarPagamentoModal,
  setAutorizarTodos,
  setCadastrarLoteModal,
  setHeaderLike,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useDebounce from "../../hooks/useDebounce";
import usePermission from "../../hooks/usePermission";
import CustomButton from "../CustomButton/CustomButton";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    alignContent: "center",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "70px",
  },
  filterButton: {
    "&:hover": {
      background: APP_CONFIG.mainCollors.buttonGradientVariant,
    },
  },
  titleFilterButton: {
    "&:hover": {
      color: "white",
    },
  },
}));

export default function CustomHeader({
  pageTitle,
  cadastro = false,
  isSearchVisible,
  autorizarButtons,
  arquivosLote,
  customButtons,
  routeForCreateEmployees,
  routeForCreatePayroll,
  routeForGestao, //null || estabelecimento || cartao || voucher
}) {
  const classes = useStyles();

  return (
    <Box className={classes.header}>
      <PageTitle pageTitle={pageTitle} />

      <LikeSearch show={isSearchVisible} />

      <ActionAutorizar show={autorizarButtons} cadastro={cadastro} />

      <ActionLote
        show={arquivosLote}
        cadastro={cadastro}
        routeForCreateEmployees={routeForCreateEmployees}
        routeForCreatePayroll={routeForCreatePayroll}
        routeForGestao={routeForGestao}
      />

      <ActionCustomButtons customButtons={customButtons} cadastro={cadastro} />

      <UserDetails
        show={
          !isSearchVisible &&
          !autorizarButtons &&
          !arquivosLote &&
          !customButtons
        }
      />

      <Navigation />
    </Box>
  );
}

function Divider() {
  return (
    <Box
      style={{
        height: "50px",
        width: "1px",
        backgroundColor: APP_CONFIG.mainCollors.primary,
        margin: "0px 16px",
      }}
    />
  );
}

function PageTitle({ pageTitle }) {
  if (!pageTitle) return null;

  return (
    <Box style={{ display: "flex", alignItems: "center" }}>
      <Typography
        style={{
          fontSize: "19px",
          color: APP_CONFIG.mainCollors.primary,
        }}
      >
        {pageTitle}
      </Typography>

      <Divider />
    </Box>
  );
}

function Navigation() {
  const history = useHistory();

  return (
    <Box style={{ display: "flex" }}>
      <Divider />

      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          marginRight: "16px",
        }}
        onClick={() => {
          history.goBack();
        }}
      >
        <ArrowBack
          style={{
            fontSize: "40px",
            color: APP_CONFIG.mainCollors.primary,
            marginRight: "10px",
          }}
        />
        <Typography
          style={{
            fontSize: "16px",
            color: APP_CONFIG.mainCollors.primary,
          }}
        >
          VOLTAR
        </Typography>
      </Box>

      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={() => {
          localStorage.removeItem("@auth");
          history.push("/login");
        }}
      >
        <LogoutRoundedIcon
          style={{
            fontSize: "40px",
            color: APP_CONFIG.mainCollors.primary,
            marginRight: "10px",
          }}
        />
        <Typography
          style={{
            fontSize: "16px",
            color: APP_CONFIG.mainCollors.primary,
          }}
        >
          SAIR
        </Typography>
      </Box>
    </Box>
  );
}

function UserDetails({ show = false }) {
  const dadosCadastrais = useSelector((state) => state.cadastroEtapa3);
  const userData = useSelector((state) => state.userData);
  const me = useSelector((state) => state.me);

  if (!show) return null;

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AccountCircleRoundedIcon
        style={{
          fontSize: "50px",
          color: APP_CONFIG.mainCollors.primary,
          marginRight: "10px",
        }}
      />

      <Box style={{ display: "flex", flexDirection: "column" }}>
        <Typography
          style={{
            fontSize: "16px",
            color: APP_CONFIG.mainCollors.primary,
            minWidth: "180px",
          }}
        >
          {dadosCadastrais?.razao_social ?? userData?.razao_social}
        </Typography>

        {/* <Typography
          style={{
            fontSize: "16px",
            color: APP_CONFIG.mainCollors.primary,
            minWidth: "180px",
          }}
        >
          {me?.nome ?? userData?.nome}
        </Typography> */}

        <Typography
          style={{
            fontSize: "15px",
            color: APP_CONFIG.mainCollors.primary,
          }}
        >
          {dadosCadastrais?.documento_socio ?? userData?.cnpj}
        </Typography>
      </Box>
    </Box>
  );
}

function LikeSearch({ show = false }) {
  const dispatch = useDispatch();
  const [buscarHeader, setBuscarHeader] = useState("");
  const debouncedLike = useDebounce(buscarHeader, 500);

  useEffect(() => {
    dispatch(setHeaderLike(debouncedLike));
  }, [debouncedLike]);

  if (!show) return null;

  return (
    <TextField
      value={buscarHeader}
      onChange={(e) => setBuscarHeader(e.target.value)}
      variant="outlined"
      label=""
      style={{ width: "40%" }}
      InputProps={{
        endAdornment: (
          <SearchIcon
            style={{
              fontSize: "30px",
              color: APP_CONFIG.mainCollors.primary,
            }}
          />
        ),
      }}
    />
  );
}

function ActionCustomButtons({ customButtons, cadastro = false }) {
  const { hasPermission } = usePermission(cadastro);

  if (!customButtons) return null;

  return (
    <Box style={{ display: "flex" }}>
      {customButtons?.map((obj) => (
        <Box style={{ marginLeft: "16px" }}>
          <CustomButton
            color={obj.color ?? "purple"}
            onClick={obj.callback}
            disabled={!hasPermission()}
          >
            {obj.icon}
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "14px",
                color: "white",
              }}
            >
              {obj.text}
            </Typography>
          </CustomButton>
        </Box>
      ))}
    </Box>
  );
}

function ActionAutorizar({ show = false, cadastro = false }) {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission(cadastro);

  if (!show) return null;

  return (
    <Box style={{ display: "flex" }}>
      <Box style={{ marginLeft: "16px" }}>
        <CustomButton
          color="purple"
          disabled={!hasPermission()}
          onClick={() => {
            dispatch(setAutorizarPagamentoModal(true));
            dispatch(setAutorizarTodos(true));
          }}
        >
          <Typography>Autorizar Todos</Typography>
        </CustomButton>
      </Box>

      <Box style={{ marginLeft: "16px" }}>
        <CustomButton
          color="horizontalGradient"
          disabled={!hasPermission()}
          onClick={() => {
            dispatch(setAutorizarPagamentoModal(true));
            dispatch(setAutorizarTodos(false));
          }}
        >
          <AddIcon style={{ color: "white" }} />
          <Typography>Autorizar pagamento</Typography>
        </CustomButton>
      </Box>
    </Box>
  );
}

function ActionLote({
  show = false,
  cadastro = false,
  pageTitle = "",
  routeForCreateEmployees,
  routeForCreatePayroll,
  routeForGestao, //null || estabelecimento || cartao || voucher
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.userType);
  const { hasPermission } = usePermission(cadastro);
  const [openAutorizarModal, setOpenAutorizarModal] = useState(false);
  const [openCadastrarLoteModal, setOpenCadastrarLoteModal] = useState(false);

  useEffect(() => {
    dispatch(setAutorizarPagamentoModal(openAutorizarModal));
  }, [openAutorizarModal]);

  useEffect(() => {
    dispatch(setCadastrarLoteModal(openCadastrarLoteModal));
  }, [openCadastrarLoteModal]);

  const handleRedirectArquivosLote = () => {
    let path = "/dashboard/folha-de-pagamento/acao/";

    if (userType.isBanking) path += "arquivos-lote";

    if (userType.isGestao) {
      const basePath = "lista-arquivos-de-lote?type=";
      switch (
        routeForGestao //null || estabelecimento || cartao || voucher
      ) {
        case "estabelecimento":
          path += basePath + "pagamento_estabelecimento";
          break;
        case "cartao":
          path += basePath + "pagamento_cartao";
          break;
        case "voucher":
          path += basePath + "pagamento_voucher";
          break;
        default:
          path += basePath;
      }
    }

    history.push(generatePath(path));
  };

  const buttonTitleRedirect = () => {
    if (userType.isBanking) {
      return "Folha de Pagamento";
    }

    if (userType.isGestao) {
      switch (
        routeForGestao //null || estabelecimento || cartao || voucher
      ) {
        case "estabelecimento":
          return "Pagamento de Estabelecimento";
        case "cartao":
          return "Recarga de Cartão";
        case "voucher":
          return "Recarga de Voucher";
        default:
          return "";
      }
    }
  };

  const handleRedirectFolhaDePagamento = () => {
    let path = "";
    if (userType.isBanking) {
      path = "/dashboard/folha-de-pagamento/acao/lista-folhas-de-pagamento";
    }

    if (userType.isGestao) {
      switch (
        routeForGestao //null || estabelecimento || cartao || voucher
      ) {
        case "estabelecimento":
          path =
            "/dashboard/folha-de-pagamento/acao/lista-folhas-de-pagamento-bene";
          break;
        case "cartao":
          path =
            "/dashboard/folha-de-pagamento/acao/lista-folhas-de-pagamento-conc";
          break;
        case "voucher":
          path =
            "/dashboard/folha-de-pagamento/acao/lista-folhas-de-pagamento-voucher";
          break;
        default:
          path =
            "/dashboard/folha-de-pagamento/acao/lista-folhas-de-pagamento-conc";
      }
    }
    history.push(generatePath(path));
  };

  const handleNovoCadastro = () => {
    if (routeForCreateEmployees) return "cadastrar-funcionarios-e-grupos";
    if (routeForCreatePayroll) return "cadastrar-folha-de-pagamento";
    return "folha-de-pagamento/acao/cadastrar-funcionarios-e-grupos";
  };

  if (!show) return null;

  if (pageTitle === "Arquivos em lote") {
    return (
      <>
        <Box style={{ marginLeft: "16px" }}>
          <CustomButton
            color="purple"
            onClick={handleRedirectFolhaDePagamento}
            disabled={!hasPermission()}
          >
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "12px",
                color: "white",
              }}
            >
              {buttonTitleRedirect()}
            </Typography>
          </CustomButton>
        </Box>

        <Box style={{ marginLeft: "16px" }}>
          <CustomButton
            color="horizontalGradient"
            onClick={() => dispatch(setCadastrarLoteModal(true))}
            disabled={!hasPermission()}
          >
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "14px",
                color: "white",
              }}
            >
              Cadastrar em Lote por arquivo
            </Typography>
          </CustomButton>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box style={{ marginLeft: "16px" }}>
        <CustomButton
          color="purple"
          disabled={!hasPermission()}
          onClick={() =>
            true
              ? handleRedirectArquivosLote()
              : dispatch(setCadastrarLoteModal(true))
          }
        >
          <Typography>
            {true ? "Arquivos em Lote" : "Cadastrar em Lote por arquivo"}
          </Typography>
        </CustomButton>
      </Box>

      {userType.isBanking ? (
        <Box
          style={{ marginLeft: "16px" }}
          component={Link}
          to={handleNovoCadastro}
        >
          <CustomButton color="horizontalGradient">
            <AddIcon style={{ color: "white", marginRight: "10px" }} />
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "14px",
                color: "white",
              }}
            >
              Novo cadastro
            </Typography>
          </CustomButton>
        </Box>
      ) : null}
    </>
  );
}
