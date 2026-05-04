import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Add, Close } from "@material-ui/icons";
import { Circle } from "@mui/icons-material";
import { toast } from "react-toastify";
import CustomButton from "../../components/CustomButton/CustomButton";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import {
  deleteProfile,
  getPermissionsList,
  getProfilePermissionsList,
  getProfiles,
  getUSerProfile,
  patchProfile,
  postProfile,
  postUSerResetProfile,
  postUSerSetProfile,
} from "../../services/services";
import SelectPermission from "./SelectPermission";

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 27,
    padding: "16px",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    color: "#35322f",
    height: "140px",
    "&:hover": {
      // cursor: "pointer",
      backgroundColor: theme.palette.secondary.light,
      transform: "scale(1.05)",
      color: "white",
    },
    transition: `${theme.transitions.create(["background-color", "transform"], {
      duration: theme.transitions.duration.standard,
    })}`,
    animation: `$myEffect 500ms ${theme.transitions.easing.easeInOut}`,
    [theme.breakpoints.down("md")]: {
      width: "170px",
      height: "100px",
      margin: "16px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100px",
      height: "110px",
      margin: "6px",
    },
  },
}));

const parseObj = (type, id, nome) => ({
  type,
  perfil: {
    id,
    nome,
  },
});

export default function UserProfiles() {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const id = useParams()?.id ?? "";
  const [data, setData] = useState([]);
  const [userProfile, setUserProfile] = useState();
  const [showModalCreateEditProfile, setShowModalCreateEditProfile] =
    useState(false); //create || perfil_id
  const [showActionModal, setShowActionModal] = useState(false); //false || {type: "deletar"|"vincular"|"desvincular", perfil}

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getProfiles(token);
      setData(data?.data);
    } catch (err) {
      console.log(err);
    }

    try {
      const { data } = await getUSerProfile(token, id);
      setUserProfile(data?.perfil);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <Typography
          style={{ color: APP_CONFIG.mainCollors.primary }}
          variant="h4"
        >
          Gerenciar Perfis
        </Typography>

        {userProfile?.id && (
          <CustomButton
            color="red"
            onClick={() =>
              setShowActionModal(
                parseObj("desvincular", userProfile?.id, userProfile?.nome)
              )
            }
          >
            <Box display="flex" alignItems="center">
              <Close />
              Desvincular perfil
            </Box>
          </CustomButton>
        )}

        <CustomButton
          color="purple"
          onClick={() => setShowModalCreateEditProfile("create")}
        >
          <Box display="flex" alignItems="center">
            <Add />
            Criar perfil
          </Box>
        </CustomButton>
      </Box>

      <LoadingScreen isLoading={loading} />

      {data.length > 0 ? (
        <Grid container spacing={3}>
          {data.map((obj) => (
            <ProfileCard
              id={obj?.id}
              nome={obj?.nome}
              isUserProfile={userProfile?.id === obj?.id}
              handleEdit={(obj) => setShowModalCreateEditProfile(obj)}
              handleAction={(obj) => setShowActionModal(obj)}
            />
          ))}
        </Grid>
      ) : (
        <Typography>Você ainda não tem nenhum perfil</Typography>
      )}

      <ModalCreateEditProfile
        show={showModalCreateEditProfile}
        setShow={setShowModalCreateEditProfile}
        getData={getData}
      />

      <ActionModal
        show={showActionModal}
        setShow={setShowActionModal}
        getData={getData}
      />
    </Box>
  );
}

function ProfileCard({ id, nome, isUserProfile, handleEdit, handleAction }) {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={4}>
      <Box className={classes.iconContainer}>
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography color="primary">{nome}</Typography>

          {isUserProfile && <Circle />}
        </Box>
        <Box style={{ display: "flex" }}>
          <MenuItem
            onClick={() => handleAction(parseObj("vincular", id, nome))}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
            disabled={isUserProfile}
          >
            Vincular
          </MenuItem>
          <MenuItem
            onClick={() => handleEdit({ id, nome })}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
          >
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => handleAction(parseObj("deletar", id, nome))}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
          >
            Deletar
          </MenuItem>
        </Box>
      </Box>
    </Grid>
  );
}

function ModalCreateEditProfile({
  show = false, //create || perfil
  setShow = () => false,
  getData = (token) => null,
}) {
  const token = useAuth();
  const [allPermissions, setAllPermissions] = useState({});
  const [profile, setProfile] = useState({ nome: "", permissoes: [] });
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setShow(false);
    setProfile({ nome: "", permissoes: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (show === "create") {
        await postProfile(token, profile);
      } else {
        await patchProfile(token, show?.id, profile);
      }
      getData(token);
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro. Tente novamente mais tarde.");
    }
    setLoading(false);
  };

  const getAllPermissions = async () => {
    setLoading(true);
    try {
      const { data } = await getPermissionsList(token);
      setAllPermissions(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const getProfilePermissions = async () => {
    setLoading(true);
    try {
      const { data } = await getProfilePermissionsList(token, show?.id);
      const arrIds = data?.map((obj) => obj?.id);
      setProfile({ nome: show?.nome, permissoes: arrIds });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllPermissions();
  }, []);

  useEffect(() => {
    //get permissions of profile to edit
    if (!!show && show !== "create") {
      getProfilePermissions();
    }
  }, [show]);

  return (
    <Dialog
      open={!!show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />

      <DialogTitle id="form-dialog-title">
        {show === "create" ? "Criar" : "Editar"} perfil
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent style={{ overflow: "hidden" }}>
          <TextField
            label="Nome do perfil"
            value={profile?.nome}
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                nome: e.target.value,
              }))
            }
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <SelectPermission
            permissions={allPermissions}
            state={profile}
            setState={setProfile}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            {show === "create" ? "Criar" : "Editar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function ActionModal({
  show = false, //false || {type: "deletar"|"vincular"|"desvincular", perfil}
  setShow = () => false,
  getData = (token) => null,
}) {
  const userId = useParams()?.id ?? "";
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const title = !!show
    ? show?.type[0]?.toUpperCase() + show?.type?.substring(1)
    : "";

  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (show?.type === "deletar")
        await deleteProfile(token, show?.perfil?.id);
      if (show?.type === "vincular")
        await postUSerSetProfile(token, userId, show?.perfil?.id);
      if (show?.type === "desvincular")
        await postUSerResetProfile(token, userId, show?.perfil?.id);

      getData(token);
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro. Tente novamente mais tarde.");
    }
    setLoading(false);
  };

  return (
    <Dialog
      open={!!show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />

      <DialogTitle id="form-dialog-title">{title} perfil</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent style={{ overflow: "hidden" }}>
          <Typography>
            Deseja {show?.type} o perfil {show?.perfil?.nome}?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>

          <Button color="primary" type="submit">
            {title}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
