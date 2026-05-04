import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  withStyles,
} from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import { makeStyles } from "@material-ui/styles";
import { get } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import useAuth from "../../hooks/useAuth";
import useQuery from "../../modules/AntecipacaoSalarial/hooks/useQuery";
import {
  getShowPagamentoCartaoPrivado,
  getShowPagamentoEstabelecimento,
  getShowPagamentoVoucher,
} from "../../services/beneficiarios";

import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    borderRadius: "0px",
    [theme.breakpoints.down("sm")]: {},
  },
  table: {
    [theme.breakpoints.down("sm")]: {},
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    boxSizing: "",
    fontSize: 17,
    fontFamily: "Montserrat-Regular",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    color: APP_CONFIG.mainCollors.primary,
    [theme.breakpoints.down("sm")]: {},
  },
  body: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-Regular",
    fontSize: 15,

    [theme.breakpoints.down("sm")]: {},
  },
}))(TableCell);

const cartaoColumns = [
  {
    headerText: "Nome",
    key: "cartao.user.nome",
    CustomValue: (nome) => (
      <Typography style={{ lineBreak: "loose" }}>{nome}</Typography>
    ),
  },
  {
    headerText: "Cartão",
    key: "cartao.external_msk",
  },
  {
    headerText: "Cidade",
    key: "cartao.municipio",
  },
  {
    headerText: "CPF",
    key: "cartao.user.documento",
    CustomValue: (documento) => (
      <Typography style={{ lineBreak: "anywhere" }}>
        {documentMask(documento)}
      </Typography>
    ),
  },
  {
    headerText: "Contato",
    key: "cartao.user.celular",
    CustomValue: (celular) => (
      <Typography style={{ lineBreak: "anywhere" }}>
        {celular ? phoneMask(celular) : "*"}
      </Typography>
    ),
  },
  {
    headerText: "Valor",
    key: "valor_pagamento",
    CustomValue: (valor) => (
      <Typography style={{ lineBreak: "auto" }}>
        R$
        {parseFloat(valor).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    ),
  },
  {
    headerText: "Tipo Pagamento",
    key: "tipo_pagamento",
    CustomValue: (tipo_pagamento) => (
      <Typography style={{ lineBreak: "loose" }}>{tipo_pagamento}</Typography>
    ),
  },
  {
    headerText: "Status Transação",
    key: "status",
    CustomValue: (status) => (
      <Typography style={{ lineBreak: "loose" }}>{status}</Typography>
    ),
  },
  // {
  //   headerText: "",
  //   key: "menuCollapse",
  // },
];

const voucherEEstabelecimentoColumns = [
  {
    headerText: "Nome",
    key: "conta.user.nome",
    CustomValue: (nome) => (
      <Typography style={{ lineBreak: "loose" }}>{nome}</Typography>
    ),
  },
  {
    headerText: "Email",
    key: "conta.user.email",
    CustomValue: (email) => (
      <Typography style={{ lineBreak: "anywhere" }}>{email}</Typography>
    ),
  },
  {
    headerText: "CPF",
    key: "conta.user.documento",
    CustomValue: (documento) => (
      <Typography style={{ lineBreak: "anywhere" }}>
        {documentMask(documento)}
      </Typography>
    ),
  },
  {
    headerText: "Contato",
    key: "conta.user.celular",
    CustomValue: (celular) => (
      <Typography style={{ lineBreak: "anywhere" }}>
        {celular ? phoneMask(celular) : "*"}
      </Typography>
    ),
  },
  {
    headerText: "Valor",
    key: "valor_pagamento",
    CustomValue: (valor) => (
      <Typography style={{ lineBreak: "auto" }}>
        R$
        {parseFloat(valor).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    ),
  },
  {
    headerText: "Tipo Pagamento",
    key: "tipo_pagamento",
    CustomValue: (tipo_pagamento) => (
      <Typography style={{ lineBreak: "loose" }}>{tipo_pagamento}</Typography>
    ),
  },
  {
    headerText: "Status Transação",
    key: "status",
    CustomValue: (status) => (
      <Typography style={{ lineBreak: "loose" }}>{status}</Typography>
    ),
  },
  // {
  //   headerText: "",
  //   key: "menuCollapse",
  // },
];

export default function PrintFolhaDePagamento() {
  const id = useParams()?.subsection ?? "";
  const type = useQuery()?.get("type") ?? "";
  const token = useAuth();
  const classes = useStyles();
  const me = useSelector((state) => state.me);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [ip, setIp] = useState("");

  const typeSelector = (() => {
    switch (type) {
      case "pagamento_cartao":
        return { data: data?.beneficiarios ?? [], columns: cartaoColumns };
      case "pagamento_voucher":
        return {
          data: data?.aluguel ?? [],
          columns: voucherEEstabelecimentoColumns,
        };
      case "pagamento_estabelecimento":
        return {
          data: data?.estabelecimentos ?? [],
          columns: voucherEEstabelecimentoColumns,
        };
      default:
        return { data: [], columns: [] };
    }
  })();

  const Editar = () => {
    const handlePrint = () => {
      const title = document.title;
      console.log(data);
      const beneficio =
        data?.beneficiarios != undefined
          ? data?.beneficiarios[0]?.cartao?.tipo_beneficio?.nome_beneficio
          : data?.aluguel[0]?.conta?.tipo_beneficio?.nome_beneficio;
      if (beneficio) document.title = title + " - " + beneficio;
      window.print();
    };

    return (
      <>
        <Typography
          style={{
            color: APP_CONFIG.mainCollors.primary,
            fontSize: 17,
            fontFamily: "Montserrat-Regular",
          }}
        >
          IMPRIMIR
        </Typography>
        <Button onClick={handlePrint}>
          <PrintIcon style={{ color: APP_CONFIG.mainCollors.primary }} />
        </Button>
      </>
    );
  };

  const getIP = async () => {
    const resp = await fetch("https://api.ipify.org/?format=json");
    const userIP = (await resp.json())?.ip;
    setIp(userIP);
  };

  const getData = async () => {
    setLoading(true);
    try {
      let res;
      if (type === "pagamento_cartao") {
        res = await getShowPagamentoCartaoPrivado(token, id);
      }
      if (type === "pagamento_voucher") {
        res = await getShowPagamentoVoucher(token, id);
      }
      if (type === "pagamento_estabelecimento") {
        res = await getShowPagamentoEstabelecimento(token, id);
      }
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    getIP();
  }, [token]);

  const columnsHeader = [
    {
      headerText: "",
      key: "",
      CustomValue: () => {
        return (
          <>
            <img
              src={APP_CONFIG.assets.smallColoredLogo}
              width={"100px"}
              alt=""
            ></img>
          </>
        );
      },
    },
    {
      headerText: "DATA",
      key: "created_at",
      CustomValue: () => {
        return <>{moment.utc(data.created_at).format("DD MMMM YYYY")}</>;
      },
    },
    {
      headerText: "DESCRIÇÃO",
      key: "descricao",
      CustomValue: () => data.descricao,
    },
    {
      ...(type === "pagamento_cartao" && data?.beneficiarios?.length > 0
        ? {
            headerText: "BENEFÍCIO",
            key: "",
            CustomValue: () => (
              <Typography>
                {data?.beneficiarios[0]?.cartao?.tipo_beneficio?.nome_beneficio}
              </Typography>
            ),
          }
        : {}),
    },
    {
      headerText: "STATUS",
      key: "status_aprovado",
      CustomValue: () => data.status_aprovado,
    },
    {
      headerText: "DATA DE PAGAMENTO",
      key: "data_pagamento",
      CustomValue: () => {
        return <>{moment.utc(data.data_pagamento).format("DD MMMM YYYY")}</>;
      },
    },
    {
      headerText: "Valor Total",
      key: "valor_total",
      CustomValue: () => {
        return (
          <>
            R$
            {parseFloat(data.valor_total).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </>
        );
      },
    },
    {
      headerText: "Sucesso",
      key: "status_sucesso",
      CustomValue: () => data.status_sucesso,
    },
    {
      headerText: "Aguardando",
      key: "status_aguardando",
      CustomValue: () => data.status_aguardando,
    },
    {
      headerText: "Falha",
      key: "status_falha",
      CustomValue: () => data.status_falha,
    },
    {
      headerText: "",
      key: "menu",
    },
  ];

  if (loading)
    return (
      <Box width="80vw">
        <LinearProgress color="secondary" />
      </Box>
    );

  return (
    <Box>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              {columnsHeader.map((item) => (
                <StyledTableCell
                  key={item.headerText}
                  align="center"
                  style={{
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box>{item.headerText}</Box>
                    <Box>
                      {item.CustomValue
                        ? item.CustomValue(get(item, item.key))
                        : get(item, item.key)}
                    </Box>
                    <Box>{item.key === "menu" ? <Editar /> : null}</Box>
                    <Box>{item.FullObject ? item.FullObject(item) : null}</Box>
                  </Box>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <CustomTable columns={typeSelector.columns} data={typeSelector.data} />

      <Box style={{ display: "flex", justifyContent: "flex-end" }}>
        <Typography
          style={{ fontSize: "0.7rem", color: APP_CONFIG.mainCollors.primary }}
        >
          Usuário: {me?.email} - Emissão:{" "}
          {moment().format("DD/MM/YYYY HH:mm\\h")} - IP: {ip}
        </Typography>
      </Box>
    </Box>
  );
}
