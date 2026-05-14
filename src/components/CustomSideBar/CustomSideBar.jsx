import { Box, Button, Divider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { CompareArrows, PersonOutline } from "@material-ui/icons";
import AssignmentIcon from "@material-ui/icons/Assignment";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import { Download, Pix } from "@mui/icons-material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ComputerIcon from "@mui/icons-material/Computer";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import GroupsIcon from "@mui/icons-material/Groups";
import PaymentsIcon from "@mui/icons-material/Payments";
import PixIcon from "@mui/icons-material/Pix";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getBeneficiosAction, loadUserData } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import { PERMISSIONS } from "../../constants/permissions";
import useAuth from "../../hooks/useAuth";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: "white",
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
    background: APP_CONFIG.mainCollors.drawerSideBar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function CustomSideBar(props) {
  const dispatch = useDispatch();
  const token = useAuth();
  const me = useSelector((state) => state.me);
  /* const contaSelecionada = useSelector((state) => state.conta); */
  /* const userData = useSelector((state) => state.userData); */
  /* const me = useSelector((state) => state.me); */
  const [subMenuTransferencia, setSubMenuTransferencia] = useState(false);
  const [subMenuWallet, setSubMenuWallet] = useState(false);
  const userData = useSelector((state) => state.userData);
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSaldoVisible, setIsSaldoVisible] = useState(true);
  const userPermissao = useSelector((state) => state.userPermissao);
  const beneficios = useSelector((state) => state.beneficios);
  const userType = useSelector((state) => state.userType);
  const [permissoes, setPermissoes] = useState([]);
  const isBankConc =
    userType?.isBanking &&
    (APP_CONFIG?.isEstabelecimento || APP_CONFIG?.isGestao);

  useEffect(() => {
    const { permissao } = userPermissao;
    setPermissoes(permissao.map((item) => item.tipo));
  }, [userPermissao]);

  useEffect(() => {
    if (!props?.cadastro) dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    if (userType?.isGestao)
      dispatch(getBeneficiosAction(token, userData?.cnpj));
  }, [token, userType, userData]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const drawer = (
    <Box
      style={{
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
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
        {APP_CONFIG.titleLogin === "Firminópolis" ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <img
              src={APP_CONFIG.assets.smallWhiteLogo}
              alt={""}
              style={{
                width: "260px",
                alignSelf: "center",
              }}
            />
          </div>
        ) : (
          <img
            src={APP_CONFIG.assets.smallWhiteLogo}
            alt={""}
            style={{
              width: "50px",
              alignSelf: "center",
              ...(APP_CONFIG.titleLogin === "Aprobank" ||
              APP_CONFIG.titleLogin === "Simer Bank" ||
              APP_CONFIG.name ===
                "Dashboard da Polícia Militar do Estado de Goiás - PMGO"
                ? { width: "170px" }
                : {}),
              ...(APP_CONFIG.name === "Dashboard da prefeitura de Itaberaí" ||
              APP_CONFIG.name === "Dashboard da prefeitura de Corumbaíba"
                ? { width: "230px" }
                : {}),
              ...(APP_CONFIG.name ===
                "Dashboard da Secretaria de Estado da Educação – SEDUC" ||
              APP_CONFIG.name ===
                "Dashboard da Secretaria de Estado da Retomada" ||
              APP_CONFIG.name ===
                "Dashboard da Secretaria de Estado de Desenvolvimento Social – SEDS" ||
              APP_CONFIG.name ===
                "Dashboard da Agência Goiana de Habitação - Agehab" ||
              APP_CONFIG.name ===
                "Dashboard da Secretaria Da Ciência, Tecnologia, Inovação E Educação Profissional - SECTI" ||
              APP_CONFIG.name ===
                "Dashboard da Secretaria de Estado de Agricultura, Pecuária e Abastecimento – SEAPA" ||
              APP_CONFIG.name ===
                "Desenvolve MT - Dashboard da Agência de Crédito do Empreendedor" ||
              APP_CONFIG.name ===
                "Desenvolve MT - Dashboard da Secretaria de Estado de Agricultura Familiar – SEAF" ||
              APP_CONFIG.name === "Dashboard da Secretaria Goiânia"
                ? { width: "240px" }
                : {}),
            }}
          />
        )}
      </Box>
      <Box className={classes.toolbar} />

      <List style={{ marginLeft: "30px" }}>
        <MenuItem
          text="Home"
          Icon={HomeIcon}
          path="/dashboard/home"
          disabled={props.cadastro}
          show={true}
          index={0}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuItem
          text={
            isBankConc
              ? "Dados da Conta"
              : userType.isBanking
                ? "Conta digital"
                : "Perfil"
          }
          Icon={PersonIcon}
          path="/dashboard/conta-digital"
          disabled={props.cadastro}
          show={true}
          index={1}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuItem
          text="Pix"
          Icon={PixIcon}
          path="/dashboard/pix"
          disabled={props.cadastro}
          show={userType.isBanking}
          index={2}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuItem
          text="Transferências"
          Icon={CompareArrowsIcon}
          path="#"
          disabled={props.cadastro}
          show={userType.isBanking && !isBankConc}
          index={3}
          selectedIndex={selectedIndex}
          handleListItemClick={() => {
            setSubMenuTransferencia(!subMenuTransferencia);
            setSubMenuWallet(false);
          }}
        />
        <MenuSubItem
          text="P2P"
          path="/dashboard/extratoP2P"
          show={subMenuTransferencia}
          index={3.1}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuSubItem
          text="TED"
          path="/dashboard/extratoTED"
          show={subMenuTransferencia && APP_CONFIG.areaTed}
          index={3.2}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuItem
          text={userType.isBanking ? "Pagamentos" : "Gestão de Benefício"}
          Icon={PaymentsIcon}
          path={
            !userData?.is_gestao_concorrencia
              ? "/dashboard/lista-pagamentos"
              : "/dashboard/folha-de-pagamento"
          }
          disabled={props.cadastro}
          show={!userData?.is_estabelecimento && !isBankConc}
          index={4}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuItem
          text="Cartões"
          Icon={CreditCardIcon}
          path="/dashboard/cartoes"
          disabled={props.cadastro}
          show={APP_CONFIG.AbaCartoes}
          index={6}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuItem
          text="Boleto"
          Icon={ReceiptIcon}
          path="/dashboard/lista-boletos"
          disabled={props.cadastro}
          show={userType.isBanking && !isBankConc}
          index={7}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuItem
          text="Antecipação salarial"
          Icon={RequestQuoteIcon}
          path="/dashboard/antecipacao-salarial"
          disabled={props.cadastro}
          show={userType.isBanking && !isBankConc}
          index={11}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Extrato"
          Icon={PersonOutline}
          path="/dashboard/extrato"
          disabled={props.cadastro}
          show={userType.isBanking}
          index={20}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Arquivo de remessa"
          Icon={FolderIcon}
          path="/dashboard/arquivo-remessa"
          disabled={props.cadastro}
          show={userType.isBanking && !isBankConc}
          index={10}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuItem
          text="APROVEC"
          Icon={FolderIcon}
          path="/dashboard/aproveck-boletos"
          disabled={props.cadastro}
          show={
            permissoes.includes(PERMISSIONS.APROVEC) && APP_CONFIG.AbaAprovec
          }
          index={12}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        {/* <MenuItem
          text="Wallet"
          Icon={PaymentsIcon}
          path="#"
          disabled={props.cadastro}
          show={
            permissoes.includes(PERMISSIONS.APROVEC) && APP_CONFIG.AbaAprovec
          }
          index={8}
          selectedIndex={selectedIndex}
          handleListItemClick={() => {
            setSubMenuWallet(!subMenuWallet);
            setSubMenuTransferencia(false);
          }}
        />
        <MenuSubItem
          text={APP_CONFIG?.sidebarRede}
          path="/dashboard/walletVBank"
          show={subMenuWallet}
          index={8.1}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuSubItem
          text="Cobranças compartilhadas"
          path="/dashboard/walletCompartilhado"
          show={subMenuWallet}
          index={8.2}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        /> */}
        <MenuItem
          text="Adquirência"
          Icon={CreditScoreIcon}
          path="/dashboard/adquirencia"
          disabled={props.cadastro}
          show={userData?.status_adquirencia === "approved"}
          index={9}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        {userData?.agent ? (
          <>
            <Divider
              style={{
                backgroundColor: "gray",
                width: "90%",
                alignSelf: "center",
                marginTop: "10px",
              }}
            />
            <Typography
              style={{
                color: "#fff",
                alignSelf: "center",
                marginTop: "5px",
              }}
              align="center"
            >
              Representante
            </Typography>

            <List style={{ marginTop: "10px" }}>
              <MenuItem
                text="Dashboard"
                Icon={DashboardIcon}
                path="/dashboard/adm"
                disabled={props.cadastro}
                show={userData?.agent}
                index={11}
                selectedIndex={selectedIndex}
                handleListItemClick={handleListItemClick}
              />

              <MenuItem
                text="Gerenciar Contas"
                Icon={GroupsIcon}
                path="/dashboard/lista-contas"
                disabled={props.cadastro}
                show={userData?.agent}
                index={12}
                selectedIndex={selectedIndex}
                handleListItemClick={handleListItemClick}
              />

              <MenuItem
                text="Transações"
                Icon={ComputerIcon}
                path="/dashboard/historico-de-transacoes"
                disabled={props.cadastro}
                show={userData?.agent}
                index={13}
                selectedIndex={selectedIndex}
                handleListItemClick={handleListItemClick}
              />

              <MenuItem
                text="Planos de Vendas"
                Icon={ComputerIcon}
                path="/dashboard/planos-de-venda"
                disabled={props.cadastro}
                show={userData?.agent}
                index={14}
                selectedIndex={selectedIndex}
                handleListItemClick={handleListItemClick}
              />

              <MenuItem
                text="Logs"
                Icon={VisibilityIcon}
                path="/dashboard/logs"
                disabled={props.cadastro}
                show={userData?.agent}
                index={15}
                selectedIndex={selectedIndex}
                handleListItemClick={handleListItemClick}
              />
            </List>
          </>
        ) : null}
        {/* Concorrencia */}
        <MenuItem
          text="Gerenciar Contas"
          Icon={GroupsIcon}
          path="/dashboard/lista-contas-secretaria"
          disabled={props.cadastro}
          show={userType.isGestao}
          index={12}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Transações Cartão"
          Icon={CompareArrowsIcon}
          path="/dashboard/beneficiarios/acao/transacoes"
          disabled={props.cadastro}
          show={userType.isGestao}
          index={3}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Transações PIX"
          Icon={Pix}
          path="/dashboard/beneficiarios/acao/lista-transacao-pix"
          disabled={props.cadastro}
          show={userType.isGestao}
          index={17}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Liberar Cartões"
          Icon={CreditCardIcon}
          path="/dashboard/liberar-cartao"
          disabled={props.cadastro}
          show={userType.isGestao}
          index={18}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Histórico de transações"
          Icon={CompareArrows}
          path="/dashboard/beneficiarios/acao/transacoes"
          disabled={props.cadastro}
          show={userData?.is_estabelecimento}
          index={19}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Beneficiários"
          Icon={PersonOutline}
          path="/dashboard/lista-de-contas-beneficiarios"
          disabled={props.cadastro}
          show={userType.isGestao}
          index={5}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        <MenuItem
          text="Benefícios"
          Icon={PersonOutline}
          path="/dashboard/lista-de-contas-beneficios"
          disabled={props.cadastro}
          show={userType.isGestao}
          index={6}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />

        <MenuItem
          text="Arquivos exportados"
          path="/dashboard/arquivos-exportados"
          Icon={Download}
          disabled={props.cadastro}
          show={true}
          index={16}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
        />
        {beneficios?.map((item, index) => {
          const hasPermission = () => {
            return me?.tipo_beneficios?.find((obj) => obj?.id === item?.id);
          };

          if (!hasPermission()) return null;
          return (
            <MenuItem
              text={item?.nome_beneficio}
              Icon={AssignmentIcon}
              path={`/dashboard/beneficiarios/${item.id}?type=${
                item.tipo
              }&is_contrato=${item?.is_contrato || false}`}
              disabled={props.cadastro}
              show={userType.isGestao}
              index={50 + index}
              selectedIndex={selectedIndex}
              handleListItemClick={handleListItemClick}
            />
          );
        })}
      </List>

      {userData?.saldo?.valor && (
        <Box
          style={{
            display: "flex",
            alignSelf: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            style={{
              fontFamily: "Montserrat-Regular",
              fontSize: "20px",
              color: "white",
              marginTop: "30px",
            }}
          >
            Saldo disponível:
          </Typography>
          {isSaldoVisible ? (
            <>
              <Typography
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: "25px",
                  color: "white",
                  marginTop: "10px",
                }}
              >
                R${" "}
                {parseFloat(userData?.saldo?.valor).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </>
          ) : (
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "25px",
                color: "white",
                marginTop: "10px",
              }}
            >
              *******
            </Typography>
          )}

          <Button onClick={() => setIsSaldoVisible(!isSaldoVisible)}>
            {isSaldoVisible ? (
              <VisibilityOffIcon style={{ color: "white" }} />
            ) : (
              <VisibilityIcon style={{ color: "white" }} />
            )}
          </Button>

          {userType?.isBanking &&
            userData?.agencia &&
            userData?.conta_sem_digito && (
              <>
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "20px",
                    color: "white",
                    marginTop: "30px",
                  }}
                >
                  Agência: {userData?.agencia}
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "20px",
                    color: "white",
                  }}
                >
                  Conta: {userData?.conta_sem_digito}-{userData?.digito_conta}
                </Typography>
              </>
            )}
        </Box>
      )}

      {/* {id &&
			token &&
			section !== 'taxa' &&
			section !== 'detalhes-pre-conta' ? (
				<Box
					style={{ color: 'black' }}
					display="flex"
					flexDirection="column"
					alignContent="center"
					alignItems="center"
					marginBottom="30px"
				>
					<Typography variant="h5" style={{ color: 'white' }}>
						Conta Selecionada:{' '}
					</Typography>
					<Typography
						style={{ wordWrap: 'break-word', color: 'white' }}
						align="center"
					>
						{contaSelecionada.nome ? contaSelecionada.nome : null}
					</Typography>
					<Typography
						style={{ wordWrap: 'break-word', color: 'white' }}
						align="center"
					>
						{contaSelecionada.razao_social
							? contaSelecionada.razao_social
							: null}
					</Typography>
					<Typography style={{ color: 'white' }}>
						{contaSelecionada.documento
							? contaSelecionada.documento
							: null}
					</Typography>
					<Typography style={{ color: 'white' }}>
						{contaSelecionada.cnpj ? contaSelecionada.cnpj : null}
					</Typography>
					<Typography style={{ color: 'white' }}>
						{contaSelecionada.saldo ? (
							<CurrencyFormat
								value={contaSelecionada.saldo.valor.replace('.', ',')}
								displayType={'text'}
								thousandSeparator={'.'}
								decimalSeparator={','}
								prefix={'R$ '}
								renderText={(value) => <div> Saldo: {value}</div>}
							/>
						) : null}
					</Typography>
				</Box>
			) : null} */}

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
            marginBottom: "0px",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <CustomButton
						color="purple"
						style={{ width: '0.9rem' }}
						variant="contained"
						onClick={() => {
							localStorage.removeItem('@auth');
							history.push('/login');
						}}
					>
						Sair
					</CustomButton> */}
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
  Icon,
  path,
  disabled = false,
  show = false,
  index,
  selectedIndex,
  handleListItemClick = () => null,
}) {
  const isSelected = selectedIndex === index;

  if (!show) return null;

  return (
    <ListItem
      disabled={disabled}
      style={
        isSelected
          ? {
              backgroundColor: "white",
              borderTopLeftRadius: 32,
              borderBottomLeftRadius: 32,
            }
          : {}
      }
      button
      selected={isSelected}
      onClick={(event) => handleListItemClick(event, index)}
      component={Link}
      to={path}
    >
      <ListItemIcon>
        <Icon
          style={{
            width: "48px",
            marginRight: "10px",
            fontSize: "48px",
            backgroundColor: isSelected ? "white" : null,
            color: isSelected ? APP_CONFIG.mainCollors.primary : "white",
            borderRadius: "33px",
            padding: "5px",
          }}
        />
      </ListItemIcon>
      <Typography
        style={
          isSelected
            ? {
                fontWeight: "bold",
                fontFamily: "Montserrat-SemiBold",
                fontSize: "14px",
                color: APP_CONFIG.mainCollors.primary,
              }
            : {
                fontFamily: "Montserrat-Regular",
                fontSize: "14px",
                color: "white",
              }
        }
      >
        {text}
      </Typography>
    </ListItem>
  );
}

function MenuSubItem({
  text,
  path,
  show = false,
  index,
  selectedIndex,
  handleListItemClick = () => null,
}) {
  const isSelected = selectedIndex === index;

  if (!show) return null;

  return (
    <ListItem
      style={{
        marginBottom: 10,
        marginTop: 10,
        ...(isSelected
          ? {
              backgroundColor: "white",
              borderTopLeftRadius: 32,
              borderBottomLeftRadius: 32,
            }
          : {}),
      }}
      button
      selected={isSelected}
      onClick={(event) => {
        handleListItemClick(event, index);
      }}
      to={path}
      component={Link}
    >
      <Typography
        style={{
          fontWeight: "bold",
          fontFamily: "Montserrat-SemiBold",
          fontSize: "14px",
          color: isSelected ? APP_CONFIG.mainCollors.primary : "white",
        }}
      >
        {text}
      </Typography>
    </ListItem>
  );
}
