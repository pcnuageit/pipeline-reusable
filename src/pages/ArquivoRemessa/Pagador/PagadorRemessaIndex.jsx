import {
  Box,
  Dialog,
  LinearProgress,
  makeStyles,
  Typography,
  useTheme,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";

import { useLocation } from "react-router-dom/cjs/react-router-dom";
import CustomButton from "../../../components/CustomButton/CustomButton";
import CustomHeader from "../../../components/CustomHeader/CustomHeader";

import CustomTable from "../../../components/CustomTable/CustomTable";
import DateTimeColumn from "../../../components/TableColumns/DateTimeColumn";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import { useIndexPagadoresRemessaQuery } from "../../../services/api";
import { documentMask } from "../../../utils/documentMask";
import EditarPagador from "../../EditarPagador/EditarPagador";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5px",
  },
  closeModalButton: {
    alignSelf: "end",
    padding: "5px",
    "&:hover": {
      backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
      cursor: "pointer",
    },
  },
}));

const columns = [
  { headerText: "Nome", key: "nome" },
  {
    headerText: "Documento",
    CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
  },
  { headerText: "E-mail", key: "email" },
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (created_at) => {
      return <DateTimeColumn dateTime={created_at} />;
    },
  },
];

const PagadorRemessaIndex = () => {
  const { id } = useParams();
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const accountId = useLocation().state?.accountId;
  const [page, setPage] = useState(1);
  const token = useAuth();
  const dispatch = useDispatch();
  const [modalEditarPagador, setModalEditarPagador] = useState(false);
  const [rowPagador, setRowPagador] = useState({});

  const {
    data: payers,
    isLoading,
    isError,
    isUninitialized,
  } = useIndexPagadoresRemessaQuery(
    {
      page,
      arquivo_remessa_id: id,
    },
    { refetchOnMountOrArgChange: true },
  );

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  /* const handleClickRow = (row) => {
		if (accountId) return;
		const path = generatePath('/dashboard/arquivo-remessa/:id/editar', {
			id: row.id,
		});
		history.push(path);
	}; */
  const handleClickRow = (row) => {
    setRowPagador(row);
    setModalEditarPagador(true);
  };

  return (
    <Box className={classes.root}>
      <Box style={{ padding: "10px" }}>
        <CustomHeader pageTitle="Pagadores da Remessa" />
      </Box>
      <Box
        style={{
          display: "flex",
          backgroundColor: APP_CONFIG.mainCollors.backgrounds,
          /* alignItems: 'center', */
          borderTopRightRadius: "17px",
          borderTopLeftRadius: "17px",
          flexDirection: "column",
          /* maxWidth: '90%', */
          minWidth: "100%",
          padding: "10px",

          /* alignItems: 'center', */
        }}
      >
        <Box style={{ display: "flex", alignSelf: "flex-end" }}>
          <CustomButton
            color="purple"
            variant="outlined"
            style={{ marginTop: "8px", marginBottom: "12px" }}
            onClick={() => history.goBack()}
          >
            ITENS DA REMESSA
          </CustomButton>
        </Box>
      </Box>

      <>
        {!isLoading && !isError && !isUninitialized ? (
          <>
            <CustomTable
              columns={columns}
              data={payers.data}
              handleClickRow={handleClickRow}
            />
            <Box alignSelf="flex-end" marginTop="8px">
              <Pagination
                variant="outlined"
                color="secondary"
                size="large"
                count={payers.last_page}
                onChange={handleChangePage}
                page={page}
              />
            </Box>
          </>
        ) : (
          <LinearProgress />
        )}
      </>
      <Dialog
        onClose={() => setModalEditarPagador(false)}
        open={modalEditarPagador}
        onBackdropClick={() => setModalEditarPagador(false)}
        maxWidth="md"
      >
        <EditarPagador rowPagador={rowPagador} />
      </Dialog>
    </Box>
  );
};

export default PagadorRemessaIndex;
