import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  makeStyles,
  TableContainer,
  TextField,
  Typography,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { useEffect, useState } from "react";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { getContas } from "../../services/services";
import px2vw from "../../utils/px2vw";
import CustomTable from "../CustomTable/CustomTable";

export default function SelectConta({
  label = "",
  value = "",
  onChange = (id) => null,
  required = false,
  error,
  helperText,
  type, // secretaria estabelecimento
}) {
  const [valueLabel, setValueLabel] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!value) setValueLabel("");
  }, [value]);

  return (
    <>
      <TextField
        label={label}
        value={valueLabel}
        placeholder="Selecione"
        onClick={() => setShow(true)}
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        fullWidth
        required={required}
        error={error}
        helperText={helperText}
      />

      <ModalContas
        show={show}
        setShow={setShow}
        onChange={onChange}
        value={value}
        setValueLabel={setValueLabel}
        type={type}
      />
    </>
  );
}

const columns = [
  {
    headerText: "Nome",
    key: "",
    FullObject: (data) => {
      return <Typography>{data?.nome ?? data?.razao_social}</Typography>;
    },
  },
];

function ModalContas({
  show = false,
  setShow = () => null,
  onChange,
  value,
  setValueLabel,
  type, // secretaria estabelecimento
}) {
  const token = useAuth();
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  function defaultData() {
    if (type) return { data: [] };

    return {
      data: [
        {
          nome: "Cartão - Integra (conta transacional)",
          id: "4e5134e7-4f7b-4269-a92c-ba011e7f8f3c",
        },
        {
          nome: "Cartão - Integra (conta MDR)",
          id: "f4b362ba-c44c-4c94-957c-5ac879e72a9b",
        },
      ],
    };
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    headerContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      marginBottom: "25px",
      width: px2vw("100%"),
      "@media (max-width: 1440px)": {
        width: "950px",
      },
      "@media (max-width: 1280px)": {
        width: "850px",
      },
    },
    tableContainer: { marginTop: "1px" },
    pageTitle: {
      color: APP_CONFIG.mainCollors.primary,
      fontFamily: "Montserrat-SemiBold",
    },
  }))();

  const handleClose = () => {
    setShow(false);
  };

  const handleSelect = (v) => {
    handleClose();
    setValueLabel(v?.nome ?? v?.razao_social);
    onChange(v?.id);
  };

  async function getData() {
    setLoading(true);
    try {
      const { data } = await getContas(
        token,
        page,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        type === "estabelecimento" ? true : "",
        type === "secretaria" ? true : "",
        "",
        "",
        "",
      );
      setData((prev) => ({
        ...data,
        data: [...prev?.data, ...data?.data],
      }));
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  async function setInitialLabel() {
    if (!value) return;

    try {
      const { data } = await getContas(
        token,
        page,
        "",
        "",
        "",
        value,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        type === "estabelecimento" ? true : "",
        type === "secretaria" ? true : "",
        "",
        "",
        "",
      );
      setValueLabel(data?.data[0]?.nome ?? data?.data[0]?.razao_social);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    setInitialLabel();
  }, [token]);

  useEffect(() => {
    getData();
  }, [token, page]);

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Selecione uma conta</DialogTitle>
      <DialogContent>
        <Box className={useStyles.tableContainer}>
          {!loading && data?.data && data?.per_page ? (
            <Box>
              <TableContainer style={{ overflowX: "auto" }}>
                <CustomTable
                  columns={columns}
                  data={data?.data}
                  handleClickRow={(row) => handleSelect(row)}
                />
              </TableContainer>
            </Box>
          ) : (
            <Box>
              <LinearProgress color="secondary" />
            </Box>
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
              count={data?.last_page}
              onChange={(e, value) => setPage(value)}
              page={page}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
