import { Box, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import { Person } from "@material-ui/icons";
import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { delFavoritoPixAction } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { getFavoritosPix } from "../../services/services";

const useStyles = makeStyles((theme) => ({
  boxFavorito: {
    display: "flex",
    alignItems: "center",
    marginTop: "15px",
    padding: 10,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: APP_CONFIG.mainCollors.disabledTextfields,
      borderRadius: 27,
    },
  },
  boxFavoritoIcon: {
    marginRight: "10px",
    backgroundColor: APP_CONFIG.mainCollors.primary,
    display: "flex",
    flexDirection: "column",
    height: "50px",
    width: "50px",
    borderRadius: "32px",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function FavoritosPixTable({ callback = () => null }) {
  const token = useAuth();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [favoritos, setFavoritos] = useState();
  const [page, setPage] = useState(1);
  const [like, setLike] = useState("");

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getFavoritosPix(token, page, like);
      setFavoritos(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleDeleteFavorito = async (id) => {
    setLoading(true);
    const resDeleteFavorito = await dispatch(delFavoritoPixAction(token, id));
    if (resDeleteFavorito) {
      toast.error("Erro ao excluir conta autorizada");
    } else {
      await getData();
      toast.success("Contato excluído das contas autorizadas");
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [token, page, like]);

  if (loading)
    return (
      <Box>
        <LinearProgress color="primary" />
      </Box>
    );

  return (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      {favoritos?.data?.length > 0 ? (
        <>
          {favoritos?.data?.map((item) => (
            <>
              <Box
                className={classes.boxFavorito}
                onClick={() => callback(item)}
              >
                <Box className={classes.boxFavoritoIcon}>
                  <Person
                    style={{
                      color: "white",
                      fontSize: "30px",
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    style={{
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                  >
                    {item.nome}
                  </Typography>
                  <Typography>
                    {item?.chave_recebedor
                      ? item?.chave_recebedor
                      : item?.banco +
                        " - " +
                        item?.agencia +
                        " - " +
                        item?.numero_conta}
                  </Typography>
                </Box>
              </Box>
            </>
          ))}

          <Pagination
            variant="outlined"
            color="secondary"
            size="large"
            count={favoritos.last_page}
            onChange={(e, v) => setPage(v)}
            page={page}
          />
        </>
      ) : (
        <Typography
          style={{
            color: APP_CONFIG.mainCollors.primary,
          }}
        >
          Você não tem contas autorizadas.
        </Typography>
      )}
    </Box>
  );
}
