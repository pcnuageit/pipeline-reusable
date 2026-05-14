import {
  Box,
  LinearProgress,
  Typography,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { useState } from "react";
import { generatePath, useHistory, useParams } from "react-router";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { toast } from "react-toastify";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { useIndexItemRemessaQuery } from "../../../services/api";
import ResumeRemessa from "../ArquivoRemessaIndex/ResumeRemessa";
import columns from "./ItensRemessaColumn";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

const ItensRemessa = () => {
  const { id } = useParams();
  const theme = useTheme();
  const history = useHistory();
  const accountId = useLocation().state?.accountId;
  const classes = useStyles();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isUninitialized } =
    useIndexItemRemessaQuery(
      {
        page,
        arquivo_remessa_id: id,
      },
      { refetchOnMountOrArgChange: true },
    );

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleClickRow = (row) => {
    try {
      const path = generatePath("/dashboard/detalhes-transacao/:id/ver", {
        id: row.boleto.transaction_id,
      });
      history.push(path);
    } catch (e) {
      toast.error("Não foi possível encontrar o boleto");
    }
  };

  return (
    <Box className={classes.root}>
      <Box marginBottom={2}>
        <Typography
          variant="h4"
          style={{ color: theme.palette.background.default }}
        >
          ITENS DA REMESSA
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <ResumeRemessa
          data={data}
          arquivoRemessaId={id}
          accountId={accountId}
        />
      </Box>
      <>
        {!isLoading && !isError && !isUninitialized ? (
          <>
            <CustomTable
              columns={columns}
              data={data.itens_remessa.data}
              handleClickRow={handleClickRow}
            />
            <Box alignSelf="flex-end" marginTop="8px">
              <Pagination
                variant="outlined"
                color="secondary"
                size="large"
                count={data.itens_remessa.last_page}
                onChange={handleChangePage}
                page={page}
              />
            </Box>
          </>
        ) : (
          <LinearProgress />
        )}
      </>
    </Box>
  );
};

export default ItensRemessa;
