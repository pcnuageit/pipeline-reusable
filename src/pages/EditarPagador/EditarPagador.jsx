import { Box, makeStyles, Paper } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import { EditPagador, loadPagadorId } from "../../actions/actions";
import CustomButton from "../../components/CustomButton/CustomButton";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import NovoPagador from "../../components/NovoPagador/NovoPagador";
import useAuth from "../../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },

  paper: {
    marginBottom: theme.spacing(6),
    padding: theme.spacing(3),
    borderRadius: "27px",
    alignSelf: "center",
    display: "flex",
    flexDirection: "column",
    width: "800px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

const EditarPagador = ({ rowPagador, disableBreadcrumbs }) => {
  const classes = useStyles();
  const history = useHistory();
  const token = useAuth();
  const { id, subsectionId, subsection } = useParams();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [pagador, setPagador] = useState({
    conta_id: null,
    documento: "",
    tipo: "",
    nome: "",
    celular: "",
    email: "",
    data_nascimento: "",
    endereco: {
      cep: " ",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });
  useEffect(() => {
    dispatch(loadPagadorId(token, subsectionId));
  }, [subsectionId]);

  useEffect(() => {
    dispatch(loadPagadorId(token, id));
  }, [id]);

  const pagadorId = useSelector((state) => state.pagador);

  useEffect(() => {
    setPagador({ ...pagadorId });
  }, [pagadorId]);
  const [errosPagador, setErrosPagador] = useState({});

  const disableEditarAll = true;

  const handleAlterar = async () => {
    setLoading(true);
    const resPagador = await dispatch(
      EditPagador(token, pagador, subsectionId ? subsectionId : id),
    );

    if (resPagador) {
      setErrosPagador(resPagador);
      toast.error("Erro ao alterar dados");
      setLoading(false);
    } else {
      toast.success("Dados alterados com sucesso!");
      history.push("/dashboard/pagadores");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(pagador);
  }, [pagador]);

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Paper className={classes.paper}>
        <NovoPagador
          rowPagador={rowPagador}
          cobrarRoute
          pagador={pagador}
          setPagador={setPagador}
          errosPagador={errosPagador}
          disableEditar={true}
          disableEditarAll={subsection === "cobrar" ? disableEditarAll : null}
        />
        {subsection === "cobrar" || subsection === "pagadores" ? null : (
          <Box alignSelf="flex-end" marginTop="16px">
            <CustomButton
              disabled={subsection === "cobrar" ? disableEditarAll : null}
              onClick={handleAlterar}
            >
              {pagador.id || rowPagador ? "Atualizar" : "Cadastrar"}
            </CustomButton>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default EditarPagador;
