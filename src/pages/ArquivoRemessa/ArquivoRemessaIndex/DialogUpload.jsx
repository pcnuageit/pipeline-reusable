import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";

import { useState } from "react";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { postArquivoRemessaAction } from "../../../actions/actions";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import { useUploadArquivoRemessaMutation } from "../../../services/api";

const useStyles = makeStyles((theme) => ({
  dialogHeader: {
    background: APP_CONFIG.mainCollors.backgrounds,
    color: APP_CONFIG.mainCollors.primary,
  },
  dialogTitle: {
    background: APP_CONFIG.mainCollors.backgrounds,
    color: APP_CONFIG.mainCollors.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  dialogSelectFile: {
    margin: "10px auto",
  },
}));
const DialogUpload = ({ open, handleClose }) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useAuth();
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [uploadArquivoRemessa] = useUploadArquivoRemessaMutation();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  /* 	const handleUpload = async () => {
		try {
			const response = await uploadArquivoRemessa({
				file: selectedFile,
			}).unwrap();
			toast.success('Arquivo enviado com sucesso!');
			history.push('/dashboard/criar-arquivo-remessa', { response });
		} catch (e) {
			if (e.status === 422) toast.error(e.data.message);
			else toast.error('Erro ao carregar o arquivo de remessa.');
		}
	}; */

  const handleUpload = async () => {
    setLoading(true);
    const response = await dispatch(
      postArquivoRemessaAction(token, selectedFile),
    );
    console.log(response);
    if (response) {
      setLoading(false);
      history.push("/dashboard/criar-arquivo-remessa", {
        response,
      });
    } else {
      toast.error("Erro ao enviar arquivo");
      setLoading(false);
    }
  };

  /* useEffect(() => {
		console.log(selectedFile);
	}, [selectedFile]); */

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <LoadingScreen isLoading={loading} />
      <DialogTitle className={classes.dialogTitle}>
        Carregar arquivo CNBA-400
      </DialogTitle>
      <input
        type="file"
        onChange={handleFileChange}
        className={classes.dialogSelectFile}
      />

      <DialogActions>
        <Button
          style={{
            minWidth: 120,
            height: 40,
          }}
          onClick={handleClose}
          variant="outlined"
          color="secondary"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleUpload}
          color="default"
          variant="outlined"
          autoFocus
          style={{
            minWidth: 120,
            height: 40,
          }}
        >
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogUpload;
