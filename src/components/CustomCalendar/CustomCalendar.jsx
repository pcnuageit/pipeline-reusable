import { Box, Typography, makeStyles } from "@material-ui/core";
import {
  addHours,
  getDate,
  getDaysInMonth,
  isSameDay,
  isValid,
  setDate,
} from "date-fns";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { APP_CONFIG } from "../../constants/config";
import { formatMoney } from "../../utils/money";

const useStyles = makeStyles((theme) => ({
  days: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, max-content))",
    gridGap: "10px",
    justifyContent: "center",
    marginTop: "10px",
    padding: "10px",
  },
  day: {
    background: APP_CONFIG.mainCollors.primary,
    minWidth: "300px",
    width: "100%",
    maxWidth: "400px",
    height: "250px",
    position: "relative",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  dayInformation: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    color: "white",
  },
  overlineWrapper: {
    fontWeight: "bold",
  },
}));

const CustomCalendar = (props) => {
  const classes = useStyles();
  const resumoTransacao = useSelector((state) => state.resumoTransacao);
  const { date } = props;

  const buildCalendarDays = useMemo(() => {
    const selectedDate = isValid(new Date(date)) ? new Date(date) : new Date();
    const days = getDaysInMonth(selectedDate);
    return Array.from({ length: days }, (_, index) =>
      setDate(selectedDate, index + 1),
    );
  }, [date]);

  const amountCalculation = (data, date) => {
    if (!data) return 0;

    const dataPerDay = data.filter((value) => {
      const expectedDate = addHours(new Date(value.expected_on), 3);
      return isSameDay(date, expectedDate);
    });

    return dataPerDay.reduce(
      (acc, obj) => parseFloat(acc) + parseFloat(obj.amount),
      0,
    );
  };

  const calculationPaidAmount = useCallback(
    (date) => amountCalculation(resumoTransacao.month_paid_receivables, date),
    [resumoTransacao],
  );

  const calculationPendingAmount = useCallback(
    (date) =>
      amountCalculation(resumoTransacao.month_pending_receivables, date),
    [resumoTransacao],
  );

  const totalValueCalculation = (paid, pending) => paid + pending;

  const handleSelectDate = (date) => {
    props.handleModalVisible(true);
    props.handleSelectedCalendarDate(date);
  };

  const fillCalendarDays = useMemo(() => {
    return buildCalendarDays.map((date) => {
      const paidAmount = calculationPaidAmount(date);
      const pendingAmount = calculationPendingAmount(date);
      const total = totalValueCalculation(paidAmount, pendingAmount);
      const day = getDate(date);

      return { paidAmount, pendingAmount, total, day, date };
    });
  }, [buildCalendarDays, calculationPaidAmount, calculationPendingAmount]);

  return (
    <Box className={classes.days}>
      {fillCalendarDays.map((value, index) => (
        <Box
          key={index}
          className={classes.day}
          onClick={() => handleSelectDate(value.date)}
        >
          <Box
            style={{
              margin: "5px",
              color: "#fff",
              position: "absolute",
              top: 8,
              left: 8,
            }}
          >
            <Typography variant="h4" className={classes.overlineWrapper}>
              {value.day}
            </Typography>
          </Box>
          <Box className={classes.dayInformation}>
            <Box>
              <Typography variant="overline">Pago</Typography>
              <Typography variant="h5" className={classes.overlineWrapper}>
                {formatMoney(value.paidAmount)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="overline">Pendente</Typography>
              <Typography variant="h5" className={classes.overlineWrapper}>
                {formatMoney(value.pendingAmount)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="overline">Total</Typography>
              <Typography variant="h5" className={classes.overlineWrapper}>
                {formatMoney(value.total)}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CustomCalendar;
