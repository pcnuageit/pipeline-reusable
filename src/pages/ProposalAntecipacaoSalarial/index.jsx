import {
  Box,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { Settings } from "@material-ui/icons";
import React, { useState } from "react";
import { useHistory } from "react-router";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomTable from "../../components/CustomTable/CustomTable";
import { formatMoney } from "../../modules/AntecipacaoSalarial/utils/money";

import ProposalPublicBadge from "../../modules/AntecipacaoSalarial/components/ProposalPublicBadge";
import ProposalStatusBadge from "../../modules/AntecipacaoSalarial/components/ProposalStatusBadge";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { APP_CONFIG } from "../../constants/config";
import { PERMISSIONS } from "../../constants/permissions";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import usePermission from "../../hooks/usePermission";
import {
  useDeleteAntecipacaoSalarialProposalMutation,
  useGetAntecipacaoSalarialProposalsQuery,
} from "../../modules/AntecipacaoSalarialProposal/services/AntecipacaoSalarialProposal";
import { useGetAccountsQuery } from "../../services/api";
import CreateProposalDialog from "./components/CreateProposalDialog";
import EditProposalDialog from "./components/EditProposalDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  headerContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
  },
  contadorStyle: {
    display: "flex",
    fontSize: "30px",
    fontFamily: "Montserrat-SemiBold",
  },
  sectionTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    marginTop: "10px",
  },
}));

function ProposalAtencipacaoSalarial() {
  const classes = useStyles();
  const [filters, setFilters] = useState({
    like: "",
  });
  const debouncedLike = useDebounce(filters.like, 800);
  const dispatch = useDispatch();
  const token = useAuth();
  const {
    data: antecipacaoSalarialProposalApi,
    isLoading,
    refetch,
  } = useGetAntecipacaoSalarialProposalsQuery();

  const { data: accounts } = useGetAccountsQuery(
    {
      like: debouncedLike,
      status: "approved",
      mostrar: 10,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [deleteProposal] = useDeleteAntecipacaoSalarialProposalMutation();

  const canModifyProposals = usePermission([
    PERMISSIONS.FULL_ACCESS,
    PERMISSIONS.MODIFY_FINANCIAL_PROPOSAL,
  ]);

  const canManageProposal = usePermission([
    PERMISSIONS.FULL_ACCESS,
    PERMISSIONS.MANAGE_FINANCIAL_PROPOSAL,
  ]);

  const canManageFinancialSupport = usePermission([
    PERMISSIONS.MANAGE_FINANCIAL_SUPPORT,
    PERMISSIONS.FULL_ACCESS,
  ]);

  const [openCreateProposal, setOpenCreateProposal] = useState(false);

  const columns = [
    { headerText: "Nome", key: "nome" },
    {
      headerText: "Valor Liberado",
      key: "valor_liberado",
      CustomValue: formatMoney,
    },
    {
      headerText: "Valor Inicial",
      key: "valor_inicial",
      CustomValue: formatMoney,
    },
    {
      headerText: "Valor Final",
      key: "valor_final",
      CustomValue: formatMoney,
    },

    {
      headerText: "Status",
      key: "active",
      CustomValue: (active) => <ProposalStatusBadge active={active} />,
    },
    {
      headerText: "Visualização",
      key: "is_public",
      CustomValue: (isPublic) => <ProposalPublicBadge isPublic={isPublic} />,
    },
    { headerText: "", key: "menu" },
  ];

  const EditFinancialProposalMenu = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openEditProposal, setOpenEditProposal] = useState(undefined);
    const history = useHistory();

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <Box>
        {openEditProposal && (
          <EditProposalDialog
            filters={filters}
            setFilters={setFilters}
            accounts={accounts}
            open={openEditProposal}
            proposal={row}
            onClose={() => {
              setOpenEditProposal(undefined);
              refetch();
            }}
          />
        )}
        <>
          <IconButton
            style={{
              height: "15px",
              width: "10px",
            }}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <Settings
              style={{
                borderRadius: 33,
                fontSize: "35px",
                backgroundColor: APP_CONFIG.mainCollors.primary,
                color: "white",
              }}
            />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {canManageProposal && (
              <MenuItem
                style={{ color: APP_CONFIG.mainCollors.secondary }}
                onClick={() =>
                  history.push(`/dashboard/antecipacao-salarial/${row.id}/info`)
                }
              >
                Ver mais
              </MenuItem>
            )}
            {canManageFinancialSupport && (
              <MenuItem
                style={{ color: APP_CONFIG.mainCollors.secondary }}
                onClick={() =>
                  history.push(
                    `/dashboard/antecipacao-salarial/${row.id}/listagem`
                  )
                }
              >
                Ver listagem
              </MenuItem>
            )}
            {/* {canManageProposal && (
							<MenuItem
								style={{ color: APP_CONFIG.mainCollors.secondary }}
								onClick={() =>
									history.push(
										`/dashboard/antecipacao-salarial/${row.id}/gerenciar-contas`
									)
								}
							>
								Liberar / Remover Contas
							</MenuItem>
						)} */}
            {canModifyProposals && (
              <MenuItem
                style={{ color: APP_CONFIG.mainCollors.secondary }}
                onClick={() => {
                  handleClose();
                  setOpenEditProposal(row);
                }}
              >
                Editar
              </MenuItem>
            )}
            {canModifyProposals && (
              <MenuItem
                style={{ color: APP_CONFIG.mainCollors.secondary }}
                onClick={async () => {
                  try {
                    await deleteProposal(row.id).unwrap();
                    handleClose();
                    toast.success("Proposta deletada com sucesso");
                  } catch (e) {
                    if (e.data && e.data.message) {
                      return toast.error(e.data.message);
                    }

                    toast.error("Erro ao deletar proposta");
                  }
                }}
              >
                Remover
              </MenuItem>
            )}
          </Menu>
        </>
      </Box>
    );
  };

  return (
    !isLoading && (
      <Box className={classes.root}>
        <Box
          display="flex"
          justifyContent="space-between"
          bgcolor={APP_CONFIG.mainCollors.backgrounds}
          borderRadius="28px 28px 0 0"
          paddingBottom={4}
        >
          <Typography
            style={{
              color: APP_CONFIG.mainCollors.primary,
              fontFamily: "Montserrat-SemiBold",
              marginTop: "20px",
              alignSelf: "center",
              marginLeft: "30px",
            }}
          >
            Propostas de Antecipação Salarial
          </Typography>

          {canModifyProposals ? (
            <Box
              style={{
                marginTop: "20px",
                marginRight: "10px",
              }}
            >
              <CustomButton
                size="small"
                color="purple"
                onClick={() => setOpenCreateProposal(true)}
              >
                Nova Proposta
              </CustomButton>
              <CreateProposalDialog
                filters={filters}
                setFilters={setFilters}
                accounts={accounts}
                open={openCreateProposal}
                onClose={() => {
                  setOpenCreateProposal(false);
                  refetch();
                }}
              />
            </Box>
          ) : null}
        </Box>
        <Box style={{ marginBottom: "40px", width: "100%" }}>
          {antecipacaoSalarialProposalApi &&
          antecipacaoSalarialProposalApi.data &&
          antecipacaoSalarialProposalApi.per_page ? (
            <CustomTable
              boxShadowTop={true}
              columns={columns}
              data={antecipacaoSalarialProposalApi.data || []}
              Editar={EditFinancialProposalMenu}
            />
          ) : null}
        </Box>
      </Box>
    )
  );
}

export default ProposalAtencipacaoSalarial;
