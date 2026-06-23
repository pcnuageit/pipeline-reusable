import { Box, makeStyles, Typography } from "@material-ui/core";
import moment from "moment";
import { APP_CONFIG } from "../../../constants/config";
import { documentMask } from "../../../utils/documentMask";

const useStyles = makeStyles((theme) => ({
  row: {
    display: "flex",
    flexDirection: "row",
    gap: "16px",
    justifyContent: "space-between",
    margin: "16px 0",
    "& > *:nth-child(2)": {
      textAlign: "right",
    },
  },
  title: {
    fontFamily: "Montserrat-ExtraBold",
    color: APP_CONFIG.mainCollors.primary,
    margin: "20px 0",
    textAlign: "center",
  },
  line: {
    border: `1px solid ${APP_CONFIG.mainCollors.primary}`,
  },
}));

export function Comprovante({ data = {} }) {
  const classes = useStyles();

  return (
    <Box style={{ padding: "16px" }}>
      <Typography
        style={{
          color: APP_CONFIG.mainCollors.primary,
          fontSize: "20px",
        }}
      >
        {data?.titulo}
      </Typography>

      <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
        {moment.utc(data?.created_at).format("DD/MM/YYYY, HH:mm")}
      </Typography>

      <Box className={classes.row}>
        <Typography
          style={{
            fontFamily: "Montserrat-ExtraBold",
            color: APP_CONFIG.mainCollors.primary,
          }}
        >
          Status
        </Typography>

        <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
          {data.status}
        </Typography>
      </Box>

      <Box className={classes.row}>
        <Typography
          style={{
            fontFamily: "Montserrat-ExtraBold",
            color: APP_CONFIG.mainCollors.primary,
          }}
        >
          Valor
        </Typography>

        <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            R${" "}
            {parseFloat(data?.valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Typography>
      </Box>

      {data?.taxa && (
        <Box className={classes.row}>
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Taxa
          </Typography>

          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
              {parseFloat(data?.taxa).toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              %
            </Typography>
          </Typography>
        </Box>
      )}

      {data?.tipo && (
        <Box className={classes.row}>
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Tipo de transferência
          </Typography>

          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            {data?.tipo}
          </Typography>
        </Box>
      )}

      {data?.id ? (
        <Box className={classes.row}>
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            ID
          </Typography>

          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            {data?.id}
          </Typography>
        </Box>
      ) : null}

      {data?.external_msk ? (
        <Box className={classes.row}>
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Cartão
          </Typography>

          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            {data?.external_msk}
          </Typography>
        </Box>
      ) : null}

      {data?.beneficio ? (
        <Box className={classes.row}>
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Benefício
          </Typography>

          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            {data?.beneficio}
          </Typography>
        </Box>
      ) : null}

      {data?.descricao ? (
        <Box style={{ marginBottom: "16px" }}>
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Descrição
          </Typography>

          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            {data?.descricao}
          </Typography>
        </Box>
      ) : null}

      <Details titulo="Destino" data={data?.destino} />

      <Details titulo="Origem" data={data?.origem} />

      <Details titulo="Beneficiário" data={data?.beneficiario} />
    </Box>
  );
}

function Details({ titulo, data = {} }) {
  const classes = useStyles();

  if (!data.nome && !data.documento && !data.banco) return null;

  return (
    <>
      <Box className={classes.line} />

      <Typography className={classes.title}>{titulo}</Typography>

      <Box className={classes.line} />
      <Box className={classes.row}>
        <Typography
          style={{
            fontFamily: "Montserrat-ExtraBold",
            color: APP_CONFIG.mainCollors.primary,
          }}
        >
          Nome
        </Typography>
        <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
          {data?.nome}
        </Typography>
      </Box>

      <Box className={classes.row}>
        <Typography
          style={{
            fontFamily: "Montserrat-ExtraBold",
            color: APP_CONFIG.mainCollors.primary,
          }}
        >
          Documento
        </Typography>
        <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
          {documentMask(data?.documento)}
        </Typography>
      </Box>

      {data?.chavePix ? (
        <Box className={classes.row}>
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Chave Pix
          </Typography>
          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            {data?.chavePix}
          </Typography>
        </Box>
      ) : null}

      {data?.banco ? (
        <Box className={classes.row}>
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Instituição
          </Typography>
          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            {data?.banco}
          </Typography>
        </Box>
      ) : null}
    </>
  );
}
