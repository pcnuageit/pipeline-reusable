import { Box } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "@material-ui/styles";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import { loadPreContaId } from "../../actions/actions";
import NewAccount from "../../components/NewAccount/NewAccount";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";

const DetalhesPreConta = () => {
  const id = useParams()?.id ?? "";
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useAuth();
  const preContaId = useSelector((state) => state.preContaId);

  useEffect(() => {
    dispatch(loadPreContaId(token, id));
  }, [id]);

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        style={{
          backgroundColor: APP_CONFIG.mainCollors.backgrounds,
          display: "flex",
          flexDirection: "column",
          borderRadius: 27,
          alignSelf: "center",
          [theme.breakpoints.down("sm")]: {
            width: "100%",
          },
          padding: 20,
          maxWidth: 1000,
        }}
      >
        <NewAccount
          conta={{
            ...preContaId,
            endereco: {
              bairro: preContaId.bairro,
              cep: preContaId.cep,
              cidade: preContaId.cidade,
              complemento: preContaId.complemento,
              estado: preContaId.estado,
              numero: preContaId.numero,
              rua: preContaId.rua,
            },
          }}
          setConta={() => null}
          errosConta={{}}
          disableEditar="true"
          preConta="true"
        />
      </Box>
    </Box>
  );
};

export default DetalhesPreConta;
