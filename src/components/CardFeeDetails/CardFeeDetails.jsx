import { useMediaQuery } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { APP_CONFIG } from "../../constants/config";
import CardFeesBox from "../CardFeesBox/CardFeesBox";
import CardFeesSum from "../CardFeesSum/CardFeesSum";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tabSelected: {
    backgroundColor: theme.palette.secondary.light,
  },
}));

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ width: "100%" }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const flagOrders = [
  "MasterCard",
  "Visa",
  "Elo",
  "American Express",
  "Hiper",
  "Hipercard",
  "Diners Club",
  "Discover",
  "Cabal",
  "Banescard",
  "Aura",
  "JCB",
  "Maestro",
  "Visa Electron",
  "Outros",
];

const sortInstallment = (flagA, flagB) => {
  const flagAIndex = flagOrders.findIndex(
    (flagOrder) => flagA.card_brand === flagOrder,
  );
  const flagBIndex = flagOrders.findIndex(
    (flagOrder) => flagB.card_brand === flagOrder,
  );

  return flagAIndex - flagBIndex;
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const CardFeeDetails = ({
  feesGroupedByInstallments,
  disableAll,
  baseFeesGroupedByInstallments,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const userPermissions = useSelector((state) => state.userPermissao.permissao);
  const permissionsName = userPermissions.map((permission) => permission.tipo);
  /* const canSeeAndEditAllFees = useMemo(
		() =>
			permissionsName.includes(ADM_PERMISSIONS.INTTEGRAR) ||
			permissionsName.includes(
				ADM_PERMISSIONS.APP_SALES_PLAN_FEE_MANAGEMENT
			),
		[permissionsName]
	); */
  /* const isSalesPlanManager = useMemo(
		() => permissionsName.includes(ADM_PERMISSIONS.SALES_PLAN_MANAGEMENT),
		[permissionsName]
	);
	const isAdm = useMemo(
		() => permissionsName.includes(ADM_PERMISSIONS.ADMIN),
		[permissionsName]
	); */

  const [value, setValue] = useState(0);
  const [keys, setKeys] = useState([]);
  const [personHeight, setPersonHeighy] = useState();

  useEffect(() => {
    setPersonHeighy(matches ? "700px" : "100%");
  }, [matches]);

  useEffect(() => {
    if (feesGroupedByInstallments) {
      setKeys(Object.keys(feesGroupedByInstallments));
    }
  }, [feesGroupedByInstallments]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
        style={{
          height: personHeight,
          width: "100px",
          alignItems: "center",
        }}
      >
        {keys.map((key) => (
          <Tab
            label={`${key}x`}
            {...a11yProps(key)}
            classes={{ selected: classes.tabSelected }}
          />
        ))}
      </Tabs>

      {Object.entries(feesGroupedByInstallments).map(
        ([installment, installmentFees], numerickey) => {
          const sortedInstallmentFees = Object.entries(installmentFees).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: [...value].sort(sortInstallment),
            }),
            {},
          );

          const sortedBaseInstallmentFees = Object.entries(
            baseFeesGroupedByInstallments
              ? baseFeesGroupedByInstallments[installment]
              : {},
          ).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: [...value].sort(sortInstallment),
            }),
            {},
          );

          return (
            <TabPanel value={value} index={numerickey}>
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-around"
                alignItems="start"
                width="100%"
              >
                <>
                  {
                    sortedInstallmentFees.partner && (
                      <CardFeesBox
                        cardFees={sortedInstallmentFees.partner}
                        label="PARCEIRO"
                        editable={false}
                      />
                    ) // sera removido no futuro
                  }
                  {sortedInstallmentFees.zoop && (
                    <CardFeesBox
                      cardFees={sortedInstallmentFees.zoop}
                      label="SISTEMA"
                      editable={false}
                    />
                  )}
                  {sortedInstallmentFees.aplication && (
                    <CardFeesBox
                      cardFees={sortedInstallmentFees.aplication}
                      label={APP_CONFIG.name}
                      editable={true && !disableAll}
                    />
                  )}

                  {sortedBaseInstallmentFees.zoop && (
                    <CardFeesSum
                      label="BASE"
                      zoopFees={sortedBaseInstallmentFees.zoop}
                      partnerFees={sortedBaseInstallmentFees.partner}
                      aplicationFees={sortedBaseInstallmentFees.aplication}
                    />
                  )}

                  {sortedInstallmentFees.agent && (
                    <CardFeesBox
                      cardFees={sortedInstallmentFees.agent}
                      label="REPRESENTANTE"
                      editable={false}
                    />
                  )}

                  {sortedInstallmentFees.zoop && (
                    <CardFeesSum
                      label="TOTAL"
                      zoopFees={sortedInstallmentFees.zoop}
                      partnerFees={sortedInstallmentFees.partner}
                      aplicationFees={sortedInstallmentFees.aplication}
                      agentFees={sortedInstallmentFees.agent}
                    />
                  )}

                  {sortedBaseInstallmentFees.zoop && (
                    <CardFeesSum
                      label="TOTAL"
                      zoopFees={sortedBaseInstallmentFees.zoop}
                      partnerFees={sortedBaseInstallmentFees.partner}
                      aplicationFees={sortedBaseInstallmentFees.aplication}
                      agentFees={sortedInstallmentFees.agent}
                    />
                  )}
                </>
              </Box>
            </TabPanel>
          );
        },
      )}
    </div>
  );
};

export default CardFeeDetails;
