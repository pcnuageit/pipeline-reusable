import { Box } from "@material-ui/core";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import {
  postEtapa1Action,
  postEtapa2Action,
  postEtapa3Action,
  postEtapa4Action,
  postEtapa5Action,
  postValidarTokenAction,
  postVerificarContatoAction,
} from "../../actions/actions";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import ConfirmarDadosEtapa from "./ConfirmarDadosEtapa";
import CriarAcessoEtapa from "./CriarAcessoEtapa";
import DadosComplementaresEtapa from "./DadosComplementaresEtapa";
import EnderecoEtapa from "./EnderecoEtapa";
import RepresentantesEtapa from "./RepresentantesEtapa";
import ResumoEtapa from "./ResumoEtapa";
import SociosEtapa from "./SociosEtapa";
import TokenCelularEtapa from "./TokenCelularEtapa";
import TokenEmailEtapa from "./TokenEmailEtapa";

export default function Cadastro() {
  const [etapa, setEtapa] = useState(1);
  const dispatch = useDispatch();
  const history = useHistory();
  const [modalVerificarContato, setModalVerificarContato] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorsEtapa1, setErrorsEtapa1] = useState("");
  const [errorsEtapa2, setErrorsEtapa2] = useState("");
  //const [errorsEtapa3, setErrorsEtapa3] = useState('');
  const [errorsEtapa4, setErrorsEtapa4] = useState("");
  const [errorsEtapa5, setErrorsEtapa5] = useState("");

  const getNextEtapa = (props) => {
    setLoading(true);
    switch (etapa) {
      case 1:
        const handleEnviar = async () => {
          const resEtapa1 = await dispatch(postEtapa1Action(props.dadosEtapa1));
          if (resEtapa1) {
            setErrorsEtapa1(resEtapa1);
            toast.error("Erro");
          } else {
            setEtapa(2);
          }
        };
        handleEnviar();
        break;

      case 2:
        const handleEnviar2 = async () => {
          const resEtapa2 = await dispatch(postEtapa2Action(props.dadosEtapa2));

          if (resEtapa2.etapa > 3) {
            if (resEtapa2.etapa === 4) {
              setEtapa(6);
            }
            if (resEtapa2.etapa === 5) {
              setEtapa(9);
            }
          } else if (resEtapa2.etapa === 2) {
            const resVerificarContato = await dispatch(
              postVerificarContatoAction(
                props.dadosEtapa2.documento,
                props.dadosEtapa2.email,
                props.dadosEtapa2.celular,
              ),
            );
            if (resVerificarContato) {
              toast.error("Erro ao verificar contato");
            } else {
              setEtapa(3);
            }
          } else if (resEtapa2.etapa === 3) {
            setEtapa(5);
          } else {
            setErrorsEtapa2(resEtapa2);
            toast.error("Erro");
            setModalVerificarContato(false);
          }
        };
        handleEnviar2();
        break;

      /* 	case 3:
				const handleEnviar3 = async () => {
					const resEtapa3 = await dispatch(
						postEtapa3Action(props.dadosEtapa3)
					);
					if (resEtapa3) {
						setErrorsEtapa3(resEtapa3);
						toast.error('Erro ao criar senha');
					} else {
						const resVerificarContato = await dispatch(
							postVerificarContatoAction(props.verificarContato)
						);
						if (resVerificarContato) {
							toast.error('Erro ao verificar contato');
						} else {
							setEtapa(4);
						}
					}
				};
				handleEnviar3();
				break; */

      case 3:
        const handleEnviar4 = async () => {
          const resEtapa4 = await dispatch(
            postValidarTokenAction(props.dadosToken),
          );
          if (resEtapa4) {
            toast.error("Erro ao validar Token");
          } else {
            toast.success("Token validado com sucesso");
            setEtapa(4);
          }
        };
        handleEnviar4();
        break;

      case 4:
        const handleEnviar5 = async () => {
          const resEtapa5 = await dispatch(
            postValidarTokenAction(props.dadosTokenCelular),
          );
          if (resEtapa5) {
            toast.error("Erro ao validar Token");
          } else {
            const resEtapa3 = await dispatch(
              postEtapa3Action(props.dadosTokenCelular.documento),
            );
            if (resEtapa3) {
              toast.error("Erro ao concluir etapa");
            } else {
              toast.success("Token validado com sucesso");
              setEtapa(5);
            }
          }
        };
        handleEnviar5();
        break;

      case 5:
        const handleEnviar6 = async () => {
          const resEtapa6 = await dispatch(
            postEtapa4Action(props.dadosEndereco),
          );
          if (resEtapa6) {
            setErrorsEtapa4(errorsEtapa4);
            toast.error("Erro ao cadastrar endereço");
          } else {
            toast.success("Endereço cadastrado com sucesso");
            setEtapa(6);
          }
        };
        handleEnviar6();
        break;

      case 6:
        const handleEnviar7 = () => {
          if (props.voltar === true) {
            setEtapa(5);
          } else {
            setEtapa(7);
          }
        };
        handleEnviar7();
        break;

      case 7:
        const handleEnviar8 = () => {
          if (props.voltar === true) {
            setEtapa(6);
          } else {
            setEtapa(8);
          }
        };
        handleEnviar8();
        break;

      case 8:
        const handleEnviar9 = async () => {
          if (props.voltar === true) {
            setEtapa(7);
            return;
          }
          const resEtapa9 = await dispatch(
            postEtapa5Action(props.dadosComplementares),
          );
          if (resEtapa9) {
            setErrorsEtapa5(resEtapa9);
            toast.error("Erro ao enviar dados");
          } else {
            toast.success("Dados enviados com sucesso");
            setEtapa(9);
          }
        };
        handleEnviar9();
        break;

      case 9:
        const handleEnviar10 = () => {
          if (props.voltar === true) {
            setEtapa(8);
          } else {
            setEtapa(10);
          }
        };
        handleEnviar10();
        break;

      case 10:
        const handleEnviar11 = () => {
          if (props.voltar === true) {
            setEtapa(9);
          } else {
            history.push("cadastro/conta-cadastrada");
          }
        };
        handleEnviar11();
        break;

      default:
        break;
    }
    setLoading(false);
  };

  const renderPage = () => {
    switch (etapa) {
      case 1:
        return (
          <CriarAcessoEtapa
            getNextEtapa={getNextEtapa}
            errorsEtapa1={errorsEtapa1}
          />
        );

      case 2:
        return (
          <ConfirmarDadosEtapa
            getNextEtapa={getNextEtapa}
            errorsEtapa2={errorsEtapa2}
            modalVerificarContato={modalVerificarContato}
            setModalVerificarContato={setModalVerificarContato}
          />
        );

      /* 	case 3:
				return (
					<CriarSenhaEtapa
						getNextEtapa={getNextEtapa}
						errorsEtapa3={errorsEtapa3}
					/>
				); */

      case 3:
        return <TokenEmailEtapa getNextEtapa={getNextEtapa} />;

      case 4:
        return <TokenCelularEtapa getNextEtapa={getNextEtapa} />;

      case 5:
        return (
          <EnderecoEtapa
            getNextEtapa={getNextEtapa}
            errorsEtapa4={errorsEtapa4}
          />
        );

      case 6:
        return <SociosEtapa getNextEtapa={getNextEtapa} />;

      case 7:
        return <RepresentantesEtapa getNextEtapa={getNextEtapa} />;

      case 8:
        return (
          <DadosComplementaresEtapa
            getNextEtapa={getNextEtapa}
            errorsEtapa5={errorsEtapa5}
          />
        );

      // case 9:
      //   return <EnviarDocumentosEtapa getNextEtapa={getNextEtapa} />;

      case 9:
        return <ResumoEtapa getNextEtapa={getNextEtapa} />;

      default:
        break;
    }
  };

  return (
    <Box>
      {renderPage()}
      <LoadingScreen isLoading={loading} />
    </Box>
  );
}
