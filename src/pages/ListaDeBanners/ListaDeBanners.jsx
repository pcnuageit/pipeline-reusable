import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import ClearIcon from "@material-ui/icons/Clear";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DropzoneAreaBase } from "material-ui-dropzone";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  delBannerAction,
  getListaBannerAction,
  postBannerAction,
} from "../../actions/actions";
import CustomTable from "../../components/CustomTable/CustomTable";
import TableHeaderButton from "../../components/TableHeaderButton";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import usePermission from "../../hooks/usePermission";

const estado = APP_CONFIG?.estado;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  tableContainer: { marginTop: "1px" },
  pageTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
  },
  dropzoneAreaBaseClasses: {
    width: "70%",
    height: "250px",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
  },
  dropzoneContainer: {
    margin: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px",
    minHeight: "422px",
    fontSize: "12px",
  },
  textoDropzone: {
    fontSize: "1.2rem",
    color: APP_CONFIG.mainCollors.primary,
  },
}));

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (created_at) => (
      <Typography>{moment.utc(created_at).format("DD/MM/YYYY")}</Typography>
    ),
  },
  {
    headerText: "Imagem",
    key: "imagem",
    CustomValue: (imagem) => {
      console.log(imagem);
      return (
        <Box
          style={{
            display: "flex",
            width: "100px",
            height: "100px",
            alignSelf: "center",
          }}
        >
          <CardMedia
            style={{
              alignSelf: "center",
              width: "100%",
              // marginLeft: "147px",
            }}
            component="img"
            alt="Arquivo de Identificação"
            height="100"
            width="100"
            image={imagem}
            onClick={() => window.open(imagem)}
          />
        </Box>
      );
    },
  },
  {
    headerText: "Tipo",
    key: "tipo",
    CustomValue: (tipo) => {
      return <Typography>{getBannerById(tipo)?.name}</Typography>;
    },
  },
  { headerText: "", key: "menu" },
];

const ListaDeBanners = () => {
  const [tipo, setTipo] = useState(" ");
  const [urlBanner, setUrlBanner] = useState("");
  const [imagemBanner, setImagemBanner] = useState("");
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    like: "",
    order: "desc",
    mostrar: "15",
    tipo: " ",
    created_at: "",
  });
  const { hasPermission, PERMISSIONS } = usePermission();
  const debouncedLike = useDebounce(filters.like, 800);
  const [loading, setLoading] = useState(false);
  const token = useAuth();
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const listaBanner = useSelector((state) => state.listaBanner);
  const [errors, setErrors] = useState({});

  const resetFilters = () => {
    setPage(1);
    setFilters({
      like: "",
      order: "desc",
      mostrar: "15",
      tipo: " ",
      created_at: "",
    });
  };

  var firstBanner = imagemBanner[0];
  useEffect(() => {
    dispatch(
      getListaBannerAction(
        token,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
        filters.tipo,
        filters.created_at
      )
    );
  }, [
    page,
    debouncedLike,
    filters.order,
    filters.mostrar,
    filters.tipo,
    filters.created_at,
  ]);

  const handleExcluirArquivo = async (item) => {
    setImagemBanner("");
  };

  const onDropBanner = async (picture) => {
    setLoading(true);

    setImagemBanner(
      picture.map((item, index) => {
        return item;
      })
    );

    setLoading(false);
  };

  const criarBanner = async (e) => {
    e.preventDefault();
    setLoading(true);

    const postBanner = await dispatch(
      postBannerAction(token, imagemBanner, tipo, urlBanner)
    );
    if (postBanner) {
      setLoading(false);
      setErrors(postBanner);
      toast.error("Erro ao adicionar banner");
    } else {
      toast.success("Banner adicionado com sucesso!");
      setLoading(false);
      setOpen(false);
    }
    await dispatch(
      getListaBannerAction(
        token,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
        filters.tipo
      )
    );
  };

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const Editar = (row) => {
    const handleExcluirBanner = async () => {
      if (!hasPermission(PERMISSIONS.banners.actions.delete)) return;

      await dispatch(delBannerAction(token, row.row.id));
      await dispatch(
        getListaBannerAction(
          token,
          page,
          debouncedLike,
          filters.order,
          filters.mostrar,
          filters.tipo
        )
      );
    };

    return (
      <Box>
        <IconButton
          style={{ height: "15px", width: "10px" }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={() => handleExcluirBanner()}
        >
          <DeleteForeverIcon
            style={{
              borderRadius: 33,
              fontSize: "35px",
              color: "#ED757D",
            }}
          />
        </IconButton>
      </Box>
    );
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.headerContainer}>
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography className={classes.pageTitle}>Banners</Typography>
          <Box style={{ alignSelf: "flex-end" }}>
            <IconButton
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                color: APP_CONFIG.mainCollors.primary,
              }}
              onClick={() => window.location.reload(false)}
            >
              <RefreshIcon></RefreshIcon>
            </IconButton>
          </Box>
        </Box>
        <Box
          style={{
            width: "100%",
            backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            borderTopLeftRadius: 27,
            borderTopRightRadius: 27,
          }}
        >
          <Box style={{ margin: 30 }}>
            <Grid container spacing={3}>
              {hasPermission(PERMISSIONS.banners.list.view) && (
                <>
                  <Grid item xs={12} sm={4}>
                    <InputLabel id="tipo_label" shrink="true">
                      Tipo
                    </InputLabel>
                    <Select
                      labelId="tipo_label"
                      label="Filtrar por tipo"
                      variant="outlined"
                      fullWidth
                      value={filters.tipo}
                      onChange={(e) =>
                        setFilters({ ...filters, tipo: e.target.value })
                      }
                    >
                      <MenuItem value={" "}>Todos</MenuItem>
                      {estado != "MT"
                        ? bannerTypes.map((obj) => (
                            <MenuItem value={obj?.id}>{obj?.name}</MenuItem>
                          ))
                        : bannerTypesMt.map((obj) => (
                            <MenuItem value={obj?.id}>{obj?.name}</MenuItem>
                          ))}
                    </Select>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        pattern: "d {4}- d {2}- d {2} ",
                      }}
                      type="date"
                      label="Data de criação"
                      value={filters.created_at}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          created_at: e.target.value,
                        })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <InputLabel id="mostrar_label" shrink="true">
                      Itens por página
                    </InputLabel>
                    <Select
                      labelId="mostrar_label"
                      value={filters.mostrar}
                      onChange={(e) => {
                        setPage(1);
                        setFilters({ ...filters, mostrar: e.target.value });
                      }}
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value={"15"}>15</MenuItem>
                      <MenuItem value={"30"}>30</MenuItem>
                      <MenuItem value={"45"}>45</MenuItem>
                      <MenuItem value={"50"}>50</MenuItem>
                    </Select>
                  </Grid>

                  <TableHeaderButton
                    text="Limpar"
                    onClick={resetFilters}
                    Icon={Delete}
                    color="red"
                  />
                </>
              )}

              {hasPermission(PERMISSIONS.banners.actions.create) && (
                <TableHeaderButton
                  text="Criar Banner"
                  onClick={() => {
                    {
                      setImagemBanner("");
                      setOpen(true);
                    }
                  }}
                />
              )}
            </Grid>

            <Dialog
              open={open}
              onClose={() => {
                setOpen(false);
              }}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Criar Banner</DialogTitle>
              <form onSubmit={(e) => criarBanner(e)}>
                <DialogContent>
                  <DialogContentText>
                    Para criar um Banner insira um arquivo e o tipo.
                  </DialogContentText>

                  {hasPermission(PERMISSIONS.banners.actions.upload_image) && (
                    <Box className={classes.dropzoneContainer}>
                      <DropzoneAreaBase
                        dropzoneParagraphClass={classes.textoDropzone}
                        maxFileSize={3145728}
                        onDropRejected={() => {
                          toast.error("Tamanho máximo: 3mb ");
                          toast.error(
                            "Arquivos suportados: .pdf .png .jpg .jpeg"
                          );
                        }}
                        acceptedFiles={["image/*", "application/pdf"]}
                        dropzoneClass={classes.dropzoneAreaBaseClasses}
                        onAdd={onDropBanner}
                        filesLimit={1}
                        dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
                        showPreviews={false}
                        showPreviewsInDropzone={false}
                      />
                      <Box width="300px" style={{ marginTop: "10px" }}>
                        <Grid container>
                          {imagemBanner ? (
                            <Grid item xs={6}>
                              <Card className={classes.card}>
                                <CardActionArea>
                                  <Box position="absolute">
                                    <IconButton
                                      onClick={() =>
                                        handleExcluirArquivo(imagemBanner)
                                      }
                                      size="small"
                                      style={{
                                        color: "white",
                                        backgroundColor: "red",
                                      }}
                                    >
                                      <ClearIcon />
                                    </IconButton>
                                  </Box>
                                  <CardMedia
                                    component="img"
                                    alt="Arquivo de Identificação"
                                    height="100"
                                    image={firstBanner.data}
                                    onClick={() =>
                                      window.open(firstBanner.data)
                                    }
                                  />
                                </CardActionArea>
                              </Card>
                            </Grid>
                          ) : null}
                        </Grid>
                      </Box>
                    </Box>
                  )}

                  {hasPermission(PERMISSIONS.banners.actions.add_link) && (
                    <>
                      <TextField
                        error={errors.url ? errors.url : null}
                        fullWidth
                        style={{
                          marginTop: "20px",
                          color: APP_CONFIG.mainCollors.secondary,
                          border: "solid",
                          borderRadius: "25px",
                          borderWidth: "2px",
                        }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        placeholder="https://exemplo.com.br"
                        label="Adicionar um link"
                        value={urlBanner}
                        onChange={(e) => setUrlBanner(e.target.value)}
                      />
                      {errors.url ? (
                        <FormHelperText
                          style={{
                            fontSize: 14,
                            fontFamily: "Montserrat-ExtraBold",
                            color: "red",
                          }}
                        >
                          {errors.url.join(" ")}
                        </FormHelperText>
                      ) : null}
                    </>
                  )}

                  {hasPermission(PERMISSIONS.banners.actions.define_type) && (
                    <Select
                      required
                      style={{
                        marginTop: "20px",
                        color: APP_CONFIG.mainCollors.secondary,
                        border: "solid",

                        borderWidth: "2px",
                      }}
                      variant="outlined"
                      fullWidth
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                    >
                      <MenuItem value={" "}>Tipo</MenuItem>
                      {estado != "MT"
                        ? bannerTypes.map((obj) => (
                            <MenuItem value={obj?.id}>{obj?.name}</MenuItem>
                          ))
                        : bannerTypesMt.map((obj) => (
                            <MenuItem value={obj?.id}>{obj?.name}</MenuItem>
                          ))}
                    </Select>
                  )}
                </DialogContent>

                <DialogActions>
                  <Button
                    onClick={() => {
                      setOpen(false);
                    }}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    Enviar
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </Box>
        </Box>
      </Box>

      {hasPermission(PERMISSIONS.banners.list.view) && (
        <Box className={classes.tableContainer}>
          {listaBanner.data && listaBanner.per_page ? (
            <CustomTable
              columns={columns}
              data={listaBanner.data}
              Editar={Editar}
            />
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
              count={listaBanner.last_page}
              onChange={handleChangePage}
              page={page}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ListaDeBanners;

const bannerTypes = [
  { id: "home", name: "Página inicial" },
  { id: "home_app_pf", name: "Banner APP PF" },
  { id: "home_app_pj", name: "Banner APP PJ" },
  { id: "home_web_pj", name: "Banner Internet Banking PJ" },
  { id: "9d7fd77e-1a50-49d6-9198-f76b15506557", name: "CARTÃO – XIXÁ" },
  {
    id: "5b7cb626-7137-4e2f-84e3-d1abde18f0fb",
    name: "Pra Ter Onde Morar – Aluguel Social",
  },
  {
    id: "9d853119-3209-4590-9e94-46a377f66c14",
    name: "Quem Ama Cuida  – Aluguel Social",
  },
  { id: "8e676deb-8478-4d03-9d37-e2bbdfdc61fc", name: "Programa: Renda Mais" },
  {
    id: "686bfac7-75db-4914-aec9-3a30070282cb",
    name: "Programa: Mão Solidaria",
  },
  {
    id: "002e4a29-9491-437e-a25d-c58b3b6dad72",
    name: "Programa: Mais Alimentos",
  },
  {
    id: "78d37872-1628-45c2-8a46-2d1268353146",
    name: "CRÉDITO SOCIAL - SEAPA",
  },
  {
    id: "47e5811a-63fa-467e-960d-58810807ff89",
    name: "CRÉDITO SOCIAL - SECTI",
  },
  { id: "04b48121-608b-4752-a73e-d3465328c19d", name: "MÃES DE GOIÁS - SEDS" },
  { id: "4eedc5d4-5076-42db-9e96-dd68f8eeb0be", name: "Bolsa SEDS Voucher" },
  {
    id: "f3f222ab-e049-4e95-8b29-23cf77058412",
    name: "CRÉDITO SOCIAL - RETOMADA",
  },
  {
    id: "cf9a11be-ee7d-4fe8-9d2d-835582dc166d",
    name: "BOLSA QUALIFICAÇÃO RETOMADA",
  },
  { id: "9d853605-1927-46f3-b397-507ae6cd8c7c", name: "Bolsa SEDS" },
  { id: "4e37672c-929c-46d3-a7c7-d3e7381a50ac", name: "CRÉDITO SOCIAL - SEDS" },
  { id: "9e2595e5-8d50-4c72-a304-26926c109405", name: "GOIÁS POR ELAS - SEDS" },
  {
    id: "9e2596a3-1222-4e5b-8df8-1873976dd02b",
    name: "APRENDIZ DO FUTURO - SEDS",
  },
  { id: "9e259727-138b-45d5-8aa2-cc48cab96312", name: "DIGNIDADE - SEDS" },
  {
    id: "6e7454fc-e3c2-4aa1-86f8-1926758a4c70",
    name: "Bolsa Alfabetizador - SEDUC",
  },

  {
    id: "883e29c1-645e-42a0-ba7b-9176ce304606",
    name: "GOIÁS + INCLUSIVO - SEDS",
  },
  { id: "3e598b14-7729-40e5-b707-de8252d8c4cf", name: "GOIANIA + HUMANA" },
  {
    id: "5bae610c-088c-4091-9dd0-be7bcabfe7b0",
    name: "DE VOLTA PARA CASA - SEDS",
  },
  { id: "b8f4a939-9dbd-4c00-a41d-8c91d57714e7", name: "CARTÃO SOLIDÁRIO" },
  {
    id: "b0b22a79-de90-4298-b870-7b51943b5374",
    name: "BOLSA PROFISSIONALIZANTE - SECTI",
  },
  { id: "9c51f0c4-c261-44f0-8aa9-1eafc49d22ea", name: "BOLSA UNIFORME" },
  { id: "9e259727-138b-45d5-8aa2-cc48cab96312", name: "DIGNIDADE - SEDS" },
  {
    id: "b71aee04-7c2f-49b3-9081-b11eba58a39d",
    name: "Família Acolhedora - SEDS",
  },
];

const bannerTypesMt = [
  { id: "home", name: "Página inicial" },
  { id: "home_app_pf", name: "Banner APP PF" },
  { id: "home_app_pj", name: "Banner APP PJ" },
  { id: "home_web_pj", name: "Banner Internet Banking PJ" },
  { id: "08bef324-9147-427a-8810-b10eff34949b", name: "FUNDAAF MT - SEAF" },
];

function getBannerById(id) {
  //alert(estado);
  if (estado != "MT") {
    for (const key in bannerTypes) {
      if (bannerTypes[key]?.id === id) return bannerTypes[key];
    }
  } else {
    for (const key in bannerTypesMt) {
      if (bannerTypesMt[key]?.id === id) return bannerTypesMt[key];
    }
  }
}
