import { Box, Button, Collapse } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  AttachMoney,
  CenterFocusStrong,
  ConfirmationNumber,
  ExpandLess,
  ExpandMore,
  HistorySharp,
  ListAlt,
  School,
} from "@material-ui/icons";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AssignmentIcon from "@material-ui/icons/Assignment";
import BlockIcon from "@material-ui/icons/Block";
import GroupIcon from "@material-ui/icons/Group";
import HomeIcon from "@material-ui/icons/Home";
import LockIcon from "@material-ui/icons/Lock";
import PersonIcon from "@material-ui/icons/Person";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
  DocumentScanner,
  Download,
  FilePresentSharp,
  Key,
  PersonOff,
} from "@mui/icons-material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaidIcon from "@mui/icons-material/Paid";
import PercentIcon from "@mui/icons-material/Percent";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PixIcon from "@mui/icons-material/Pix";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link, useParams } from "react-router-dom";
import { loadContaId } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import { PERMISSIONS as PERM } from "../../constants/permissions";
import useAuth from "../../hooks/useAuth";
import usePermission from "../../hooks/usePermission";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    background: APP_CONFIG.mainCollors.secondaryGradient,
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    borderRightWidth: "0px",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function CustomSideBar(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id, section } = useParams();
  const token = useAuth();
  const { hasPermission, PERMISSIONS } = usePermission();
  const contaSelecionada = useSelector((state) => state.conta);
  const userData = useSelector((state) => state.userData);
  const me = useSelector((state) => state.me);
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const AbaGestao = APP_CONFIG.AbaGestao;

  const canShowFinancialSupport =
    hasPermission(PERM.MANAGE_FINANCIAL_PROPOSAL) ||
    hasPermission(PERM.MANAGE_FINANCIAL_SUPPORT);

  const [openCreditCollapse, setOpenCreditCollapse] = useState(false);
  const [openTransferenciaCollapse, setOpenTransferenciaCollapse] =
    useState(false);
  const [openTarifasCollapse, setOpenTarifasCollapse] = useState(false);
  const [openRelatoriosCollapse, setOpenRelatoriosCollapse] = useState(false);

  useEffect(() => {
    if (id && token && section !== "taxa" && section !== "apoio-financeiro") {
      dispatch(loadContaId(token, id));
    }
  }, [dispatch, id, section, token, userData]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const drawer = (
    <Box
      style={{
        background: APP_CONFIG.mainCollors.secondaryGradient,
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <Box
        style={{
          width: "100%",
          justifyContent: "center",
          display: "flex",
          marginTop: "50px",
        }}
      >
        <img
          src={APP_CONFIG.assets.smallWhiteLogo}
          alt=""
          style={{ width: "130px", alignSelf: "center" }}
        />
      </Box>
      <Box className={classes.toolbar} />

      <List style={{ marginLeft: "30px" }}>
        <MenuItem
          text="Home"
          path="/dashboard/home"
          Icon={HomeIcon}
          index={0}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        {me?.email !== "aamaral@tce.go.gov.br" &&
        me?.email !== "balfeu@tce.go.gov.br" &&
        me?.email !== "ifreitas@tce.go.gov.br" &&
        me?.email !== "rdarc@tce.go.gov.br" ? (
          <MenuItem
            text="Contas"
            path="/dashboard/lista-de-contas"
            Icon={PersonIcon}
            index={1}
            selectedIndex={selectedIndex}
            handleListItemClick={handleListItemClick}
          />
        ) : null}

        <MenuItem
          text="Contas Adquirência"
          path="/dashboard/lista-de-contas-adquirencia"
          Icon={PersonOutlineIcon}
          index={17}
          show={!AbaGestao}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Estabelecimentos"
          path="/dashboard/lista-de-contas-estabelecimentos"
          Icon={PersonOutlineIcon}
          index={24}
          show={
            AbaGestao && hasPermission(PERMISSIONS.estabelecimentos.list.view)
          }
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Secretarias"
          path="/dashboard/lista-de-contas-secretarias"
          Icon={PersonOutlineIcon}
          index={50}
          show={AbaGestao && hasPermission(PERMISSIONS.secretarias.list.view)}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Beneficiários"
          path="/dashboard/lista-de-contas-beneficiarios"
          Icon={PersonOutlineIcon}
          index={51}
          show={AbaGestao && hasPermission(PERMISSIONS.beneficiarios.list.view)}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Benefícios"
          path="/dashboard/lista-de-contas-beneficios"
          Icon={PersonOutlineIcon}
          index={52}
          show={AbaGestao && hasPermission(PERMISSIONS.beneficios.list.view)}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Cursos"
          path="/dashboard/lista-de-cursos"
          Icon={School}
          index={57}
          show={AbaGestao}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Pré contas"
          path="/dashboard/lista-pre-contas"
          Icon={PersonAddIcon}
          index={2}
          show={hasPermission(PERMISSIONS.pre_contas.list.view)}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Administradores"
          path="/dashboard/lista-de-administradores"
          Icon={AccountBoxIcon}
          index={3}
          show={hasPermission(PERMISSIONS.administradores.list.view)}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Painel centralizador"
          path="/dashboard/painel-centralizador"
          Icon={CenterFocusStrong}
          index={30}
          show={true}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Pagamento estabelecimento"
          path="/dashboard/gerenciar-pagamento-estabelecimento"
          Icon={AttachMoneyIcon}
          index={53}
          show={AbaGestao}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Crédito"
          path="#"
          Icon={AccountBalanceIcon}
          index={false}
          show={APP_CONFIG.AbaCredito && canShowFinancialSupport}
          selectedIndex={selectedIndex}
          handleListItemClick={() => setOpenCreditCollapse((open) => !open)}
          showMoreIcon={openCreditCollapse}
        />
        <MenuSubItem
          text="Apoio Financeiro"
          path="/dashboard/apoio-financeiro"
          Icon={AttachMoney}
          index={11}
          show={openCreditCollapse}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuSubItem
          text="Antecipação Salarial"
          path="/dashboard/antecipacao-salarial"
          Icon={RequestQuoteIcon}
          index={20}
          show={openCreditCollapse}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Transações"
          path="#"
          Icon={PaidIcon}
          index={false}
          show={true}
          selectedIndex={selectedIndex}
          handleListItemClick={() =>
            setOpenTransferenciaCollapse((open) => !open)
          }
          showMoreIcon={openTransferenciaCollapse}
        />
        <MenuSubItem
          text="Trasações Adquirência"
          path="/dashboard/transacoes"
          Icon={ImportExportIcon}
          index={22}
          show={!AbaGestao && openTransferenciaCollapse}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuSubItem
          text="Histórico de transações"
          path="/dashboard/historico-transacoes"
          Icon={HistorySharp}
          index={56}
          show={
            openTransferenciaCollapse &&
            AbaGestao &&
            hasPermission(PERMISSIONS.transacoes.historico.list.view)
          }
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuSubItem
          text="Notas fiscais"
          path="/dashboard/transacoes-notas-fiscais"
          Icon={FilePresentSharp}
          index={58}
          show={
            openTransferenciaCollapse && AbaGestao
            // && hasPermission(PERMISSIONS.transacoes.historico.list.view)
          }
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuSubItem
          text="PIX"
          path="/dashboard/transacoes-pix"
          Icon={PixIcon}
          index={12}
          show={
            openTransferenciaCollapse &&
            hasPermission(PERMISSIONS.transacoes.pix.list.view)
          }
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuSubItem
          text="P2P"
          path="/dashboard/transacoes-p2p"
          Icon={CompareArrowsIcon}
          index={13}
          show={
            openTransferenciaCollapse &&
            hasPermission(PERMISSIONS.transacoes.p2p.list.view)
          }
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuSubItem
          text="TED"
          path="/dashboard/transacoes-ted"
          Icon={LocalAtmIcon}
          index={14}
          show={!AbaGestao && openTransferenciaCollapse}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuSubItem
          text="Pagamento Conta"
          path="/dashboard/transacoes-pagamento-conta"
          Icon={AttachMoneyIcon}
          index={15}
          show={!AbaGestao && openTransferenciaCollapse}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuSubItem
          text="Boletos"
          path="/dashboard/transacoes-pagamento-boleto"
          Icon={ReceiptIcon}
          index={16}
          show={!AbaGestao && openTransferenciaCollapse}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        {/* <MenuSubItem
          text="Transações cartões"
          path="/dashboard/transacoes-cartoes"
          Icon={CreditCard}
          index={54}
          show={
            AbaGestao &&
            openTransferenciaCollapse &&
            hasPermission(PERMISSIONS.transacoes.cartoes.list.view)
          }
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        /> */}
        <MenuSubItem
          text="Transações voucher"
          path="/dashboard/transacoes-voucher"
          Icon={ConfirmationNumber}
          index={55}
          show={
            AbaGestao &&
            openTransferenciaCollapse &&
            hasPermission(PERMISSIONS.transacoes.voucher.list.view)
          }
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Dispositivos bloqueados"
          path="/dashboard/lista-dispositivos-bloqueados"
          Icon={LockIcon}
          index={4}
          show={
            !AbaGestao &&
            hasPermission(PERMISSIONS.dispositivos_bloqueados.list.view)
          }
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Bloqueio de device"
          path="/dashboard/bloqueio-device"
          Icon={LockIcon}
          index={26}
          show={
            AbaGestao &&
            hasPermission(PERMISSIONS.dispositivos_bloqueados.list.view)
          }
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Blacklist"
          path="/dashboard/blacklist"
          Icon={BlockIcon}
          index={27}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Usuários bloqueados"
          path="/dashboard/usuarios-bloqueados"
          Icon={PersonOff}
          index={31}
          show={true}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Tarifas"
          path="#"
          Icon={AssignmentIcon}
          index={false}
          show={!AbaGestao}
          selectedIndex={selectedIndex}
          handleListItemClick={() => setOpenTarifasCollapse((open) => !open)}
          showMoreIcon={openTarifasCollapse}
        />
        <MenuSubItem
          text="Taxas"
          path="/dashboard/taxas"
          Icon={PercentIcon}
          index={5.1}
          show={openTarifasCollapse}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuSubItem
          text="Tarifa Padrão"
          path="/dashboard/taxa-padrao"
          Icon={AssessmentIcon}
          index={5.2}
          show={openTarifasCollapse}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuSubItem
          text="Transações Tarifas"
          path="/dashboard/transacoes-tarifas"
          Icon={AutoAwesomeMotionIcon}
          index={5.3}
          show={openTarifasCollapse}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Visualizar logs"
          path="/dashboard/logs"
          Icon={VisibilityIcon}
          index={6}
          show={hasPermission(PERMISSIONS.logs.list.view)}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Logs Auditoria"
          path="/dashboard/logs-auditoria"
          Icon={VisibilityIcon}
          index={25}
          show={
            hasPermission("Concorrência - Acesso Audits Logs") ||
            hasPermission(PERMISSIONS.logs_auditoria.list.view)
          }
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Representantes"
          path="/dashboard/representantes"
          Icon={AccessibilityNewIcon}
          index={21}
          show={!AbaGestao}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Parceiros"
          path="/dashboard/parceiros"
          Icon={GroupIcon}
          index={7}
          show={!AbaGestao}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Blacklist Selfie"
          path="/dashboard/blacklist-selfie"
          Icon={BlockIcon}
          index={8}
          show={!AbaGestao}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Banners"
          path="/dashboard/banners"
          Icon={ViewCarouselIcon}
          index={9}
          show={hasPermission(PERMISSIONS.banners.list.view)}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Notificações"
          path="/dashboard/notificacoes"
          Icon={NotificationsIcon}
          index={18}
          show={!AbaGestao}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Notificações"
          path="/dashboard/notificacoes-gestao"
          Icon={NotificationsIcon}
          index={18}
          show={AbaGestao && hasPermission(PERMISSIONS.notificacoes.list.view)}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Planos de vendas"
          path="/dashboard/plano-vendas"
          Icon={MenuBookIcon}
          index={19}
          show={!AbaGestao}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Cartões"
          path="/dashboard/cartoes"
          Icon={CreditCardIcon}
          index={10}
          show={APP_CONFIG.AbaCartoes}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Arquivos exportados"
          path="/dashboard/arquivos-exportados"
          Icon={Download}
          index={20}
          show={
            AbaGestao &&
            hasPermission(PERMISSIONS.arquivos_exportados.list.view)
          }
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Relatórios"
          path="/dashboard/relatorios"
          Icon={ListAlt}
          index={28}
          show={APP_CONFIG.estado === "GO" && AbaGestao}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Relatórios"
          path="#"
          Icon={ListAlt}
          index={false}
          show={APP_CONFIG.estado === "MT" && AbaGestao}
          selectedIndex={selectedIndex}
          handleListItemClick={() => setOpenRelatoriosCollapse((open) => !open)}
          showMoreIcon={openRelatoriosCollapse}
        />
        <MenuSubItem
          text="Relatórios"
          path="/dashboard/relatorios"
          Icon={ListAlt}
          index={28}
          show={openRelatoriosCollapse}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuSubItem
          text="Relatório BI"
          path="/dashboard/relatorio-bi"
          Icon={AttachMoney}
          index={29}
          show={openRelatoriosCollapse}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Tokens públicos"
          path="/dashboard/tokens-publicos"
          Icon={Key}
          index={23}
          show={hasPermission(PERMISSIONS.tokens_publicos.list.view)}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Condições Comerciais"
          path="/dashboard/condicoes-comerciais"
          Icon={DocumentScanner}
          index={32}
          show={AbaGestao}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
      </List>

      {id &&
      token &&
      section !== "taxa" &&
      section !== "apoio-financeiro" &&
      section !== "detalhes-pre-conta" ? (
        <Box
          style={{ color: "black" }}
          display="flex"
          flexDirection="column"
          alignContent="center"
          alignItems="center"
          marginBottom="30px"
        >
          <Typography variant="h5" style={{ color: "white" }}>
            Conta Selecionada:
          </Typography>
          <Typography
            style={{ wordWrap: "break-word", color: "white" }}
            align="center"
          >
            {contaSelecionada?.nome}
          </Typography>
          <Typography
            style={{ wordWrap: "break-word", color: "white" }}
            align="center"
          >
            {contaSelecionada?.razao_social}
          </Typography>
          <Typography style={{ color: "white" }}>
            {contaSelecionada?.cnpj ?? contaSelecionada?.documento}
          </Typography>
          <Typography style={{ color: "white" }}>
            {contaSelecionada.saldo ? (
              <CurrencyFormat
                value={contaSelecionada.saldo.valor.replace(".", ",")}
                displayType={"text"}
                thousandSeparator={"."}
                decimalSeparator={","}
                prefix={"R$ "}
                renderText={(value) => <div> Saldo: {value}</div>}
              />
            ) : null}
          </Typography>
        </Box>
      ) : null}

      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            display: "flex",
            marginBottom: "10px",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography style={{ fontSize: "12px", color: "white" }}>
            Versão: {APP_CONFIG.versao}
          </Typography>
          <Typography style={{ fontSize: "12px", color: "white" }}>
            Data da Versão: {APP_CONFIG.dataVersao}
          </Typography>
        </Box>
        <Box
          style={{
            marginBottom: "20px",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <img
						src={ItaLogo}
						alt=""
						style={{ width: '200px', marginBottom: 10 }}
					/> */}
          <Button
            style={{ width: "0.9rem" }}
            variant="contained"
            onClick={() => {
              localStorage.removeItem("@auth");
              history.push("/login");
            }}
          >
            Sair
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />

      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

CustomSideBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default CustomSideBar;

function MenuItem({
  text,
  path,
  Icon = () => null,
  index,
  show = true,
  selectedIndex,
  handleListItemClick,
  showMoreIcon = null,
}) {
  const isSelected = selectedIndex === index;
  const getSideBarItemBackgroundColor = (index) =>
    isSelected ? "white" : null;
  const getSideBarItemColor = (index) =>
    isSelected ? APP_CONFIG.mainCollors.primary : "white";

  const ShowMoreIcon = () => {
    if (showMoreIcon === null) return null;

    if (showMoreIcon)
      return (
        <ExpandLess
          style={{
            fontSize: "32px",
            color: "white",
          }}
        />
      );
    else
      return (
        <ExpandMore
          style={{
            fontSize: "32px",
            color: "white",
          }}
        />
      );
  };

  if (!show) return null;

  return (
    <ListItem
      component={Link}
      button
      selected={isSelected}
      onClick={(event) => handleListItemClick(event, index)}
      to={path}
      style={
        isSelected
          ? {
              backgroundColor: "white",
              borderTopLeftRadius: 32,
              borderBottomLeftRadius: 32,
            }
          : {}
      }
    >
      <ListItemIcon style={{ width: "60px" }}>
        <Icon
          fontSize="50px"
          style={{
            backgroundColor: getSideBarItemBackgroundColor(index),
            color: getSideBarItemColor(index),
            width: "48px",
            marginRight: "10px",
            fontSize: "48px",
            borderRadius: "33px",
            padding: "5px",
          }}
        />
      </ListItemIcon>
      <ListItemText>
        <Typography
          style={{
            fontFamily: "Montserrat-Regular",
            fontSize: "14px",
            ...(isSelected
              ? {
                  fontWeight: "bold",
                  color: APP_CONFIG.mainCollors.primary,
                }
              : {
                  color: "white",
                }),
          }}
        >
          {text}
        </Typography>
      </ListItemText>
      <ShowMoreIcon />
    </ListItem>
  );
}

function MenuSubItem({
  text,
  path,
  Icon = () => null,
  index,
  show = false,
  selectedIndex,
  handleListItemClick,
}) {
  const classes = useStyles();
  const isSelected = selectedIndex === index;
  const getSideBarItemBackgroundColor = (index) =>
    isSelected ? "white" : null;
  const getSideBarItemColor = (index) =>
    isSelected ? APP_CONFIG.mainCollors.primary : "white";

  return (
    <Collapse in={show} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <ListItem
          button
          selected={isSelected}
          onClick={(event) => handleListItemClick(event, index)}
          component={Link}
          to={path}
          className={classes.nested}
          style={
            isSelected
              ? {
                  backgroundColor: "white",
                  borderTopLeftRadius: 32,
                  borderBottomLeftRadius: 32,
                }
              : {}
          }
        >
          <ListItemIcon>
            <Icon
              style={{
                width: "38px",
                marginRight: "10px",
                fontSize: "48px",
                backgroundColor: getSideBarItemBackgroundColor(index),
                color: getSideBarItemColor(index),
                borderRadius: "33px",
                padding: "5px",
              }}
            />
          </ListItemIcon>
          <Typography
            style={{
              fontFamily: "Montserrat-Regular",
              fontSize: "14px",
              ...(isSelected
                ? {
                    fontWeight: "bold",
                    color: APP_CONFIG.mainCollors.primary,
                  }
                : {
                    color: "white",
                  }),
            }}
          >
            {text}
          </Typography>
        </ListItem>
      </List>
    </Collapse>
  );
}
