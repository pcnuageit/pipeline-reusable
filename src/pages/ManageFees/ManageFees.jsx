import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  IconButton,
  LinearProgress,
  makeStyles,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router";
import { delPerfilTaxa, loadPerfilTaxaAction } from "../../actions/actions";

import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RefreshIcon from "@material-ui/icons/Refresh";
import SettingsIcon from "@material-ui/icons/Settings";
import { Pagination } from "@material-ui/lab";
import CurrencyFormat from "react-currency-format";
import { toast } from "react-toastify";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomCollapseTable from "../../components/CustomCollapseTable/CustomCollapseTable";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    paddingRight: 50,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: "0px",
  },
  tableContainer: { marginTop: "1px" },
  pageTitle: {
    color: "#9D9CC6",
    fontFamily: "Montserrat-SemiBold",
  },
}));

const options = {
  displayType: "text",
  thousandSeparator: ".",
  decimalSeparator: ",",
  prefix: "R$ ",
  decimalScale: 2,
  fixedDecimalScale: true,
};

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data) => {
      const date = new Date(data);
      const option = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const formatted = date.toLocaleDateString("pt-br", option);
      return (
        <Box display="flex" justifyContent="center">
          <FontAwesomeIcon icon={faCalendar} size="lg" />
          <Typography style={{ marginLeft: "6px" }}>{formatted}</Typography>
        </Box>
      );
    },
  },
  {
    headerText: "Nome",
    key: "nome",
    CustomValue: (nome) => <Typography>{nome}</Typography>,
  },
  /* {
		headerText: 'Recebimento Maquina Virtual',
		key: '',
		CustomValue: (taxa) => <CurrencyFormat {...options} value={taxa} />,
	}, */
  {
    headerText: "Recebimento Boleto",
    key: "",
    FullObject: (row) => (
      <CurrencyFormat
        {...options}
        value={row.cash_in_boleto}
        prefix={row.tipo_cash_in_boleto === "Fixo" ? "R$ " : ""}
        suffix={row.tipo_cash_in_boleto === "Percentual" ? "%" : ""}
      />
    ),
  },
  {
    headerText: "Recebimento TED",
    key: "",
    FullObject: (row) => (
      <CurrencyFormat
        {...options}
        value={row.cash_in_ted}
        prefix={row.tipo_cash_in_ted === "Fixo" ? "R$ " : ""}
        suffix={row.tipo_cash_in_ted === "Percentual" ? "%" : ""}
      />
    ),
  },
  {
    headerText: "Recebimento PIX",
    key: "",
    FullObject: (row) => (
      <CurrencyFormat
        {...options}
        value={row.cash_in_pix}
        prefix={row.tipo_cash_in_pix === "Fixo" ? "R$ " : ""}
        suffix={row.tipo_cash_in_pix === "Percentual" ? "%" : ""}
      />
    ),
  },
  {
    headerText: "Recebimento P2P",
    key: "",
    FullObject: (row) => (
      <CurrencyFormat
        {...options}
        value={row.cash_in_p2p}
        prefix={row.tipo_cash_in_p2p === "Fixo" ? "R$ " : ""}
        suffix={row.tipo_cash_in_p2p === "Percentual" ? "%" : ""}
      />
    ),
  },
  {
    headerText: "Trânsferencia P2P",
    key: "",
    FullObject: (row) => (
      <CurrencyFormat
        {...options}
        value={row.cash_out_p2p}
        prefix={row.tipo_cash_out_p2p === "Fixo" ? "R$ " : ""}
        suffix={row.tipo_cash_out_p2p === "Percentual" ? "%" : ""}
      />
    ),
  },
  {
    headerText: "Trânsferencia TED",
    key: "",
    FullObject: (row) => (
      <CurrencyFormat
        {...options}
        value={row.cash_out_ted}
        prefix={row.tipo_cash_out_ted === "Fixo" ? "R$ " : ""}
        suffix={row.tipo_cash_out_ted === "Percentual" ? "%" : ""}
      />
    ),
  },
  {
    headerText: "Trânsferencia PIX",
    key: "",
    FullObject: (row) => (
      <CurrencyFormat
        {...options}
        value={row.cash_out_pix}
        prefix={row.tipo_cash_out_pix === "Fixo" ? "R$ " : ""}
        suffix={row.tipo_cash_out_pix === "Percentual" ? "%" : ""}
      />
    ),
  },
  {
    headerText: "",
    key: "menu",
  },
];

const itemColumns = [
  {
    headerText: "Nome",
    key: "nome",
    CustomValue: (nome) => <Typography>{nome}</Typography>,
  },
  {
    headerText: "Documento",
    key: "documento",
    CustomValue: (documento) => <Typography>{documento}</Typography>,
  },
  {
    headerText: "Celular",
    key: "celular",
    CustomValue: (data) => <Typography>{phoneMask(data)}</Typography>,
  },
  {
    headerText: "Email",
    key: "email",
    CustomValue: (email) => <Typography>{email}</Typography>,
  },
  {
    headerText: "Razão Social",
    key: "razao_social",
    CustomValue: (razao_social) => (
      <Typography>{razao_social !== null ? razao_social : "*"}</Typography>
    ),
  },
  {
    headerText: "CNPJ",
    key: "cnpj",
    CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
  },
];

const ManageFees = () => {
  const token = useAuth();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const perfilTaxas = useSelector((state) => state.perfilTaxas);
  const [filters, setFilters] = useState({
    like: "",
  });
  const debouncedLike = useDebounce(filters.like, 800);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    dispatch(loadPerfilTaxaAction(token, filters.like));
  }, [page, debouncedLike]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const Editar = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleEditar = (event) => {
      const path = generatePath("/dashboard/taxa/:id/editar", {
        id: row.id,
      });
      history.push(path);
    };
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleExcluir = async () => {
      const { success, status } = await dispatch(delPerfilTaxa(token, row.id));
      if (success) {
        toast.success("Taxa excluida com sucesso!");
      } else {
        toast.error(`Erro ao excluir taxa: ${status}`);
      }
    };

    return (
      <Box>
        <IconButton
          style={{
            height: "15px",
            width: "10px",
          }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <SettingsIcon
            style={{
              borderRadius: 33,
              fontSize: "35px",
              backgroundColor: APP_CONFIG.mainCollors.primary,
              color: "white",
            }}
          />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={handleEditar}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
          >
            Editar
          </MenuItem>
          <MenuItem
            onClick={handleExcluir}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
          >
            Excluir
          </MenuItem>
        </Menu>
      </Box>
    );
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.headerContainer}>
        <Box style={{ marginBottom: "20px" }}>
          <Typography className={classes.pageTitle}>Taxas</Typography>
        </Box>
        <Box
          style={{
            width: "100%",
            backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            borderTopLeftRadius: 27,
            borderTopRightRadius: 27,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            style={{ margin: 30 }}
          >
            <TextField
              placeholder="Pesquisar por nome..."
              size="small"
              variant="outlined"
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                width: "400px",
              }}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  like: e.target.value,
                })
              }
            />

            <CustomButton onClick={() => history.push("/dashboard/nova-taxa")}>
              Nova Tarifa
            </CustomButton>
          </Box>
        </Box>
      </Box>

      <Box className={classes.tableContainer}>
        {perfilTaxas && perfilTaxas.per_page ? (
          <Box minWidth={!matches ? "800px" : null}>
            <CustomCollapseTable
              data={perfilTaxas.data}
              columns={columns}
              itemColumns={itemColumns}
              conta={true}
              Editar={Editar}
            />
          </Box>
        ) : (
          <LinearProgress />
        )}
        <Box
          display="flex"
          alignSelf="flex-end"
          marginTop="8px"
          justifyContent="space-between"
        >
          <Pagination
            variant="outlined"
            color="secondary"
            size="large"
            count={perfilTaxas.last_page}
            onChange={handleChangePage}
            page={page}
          />
          <IconButton
            style={{
              backgroundColor: "white",
              boxShadow: "0px 0px 5px 0.7px grey",
            }}
            onClick={() => window.location.reload(false)}
          >
            <RefreshIcon></RefreshIcon>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ManageFees;
