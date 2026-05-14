import { Box, CircularProgress } from "@material-ui/core";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearTransacao,
  loadRecebiveisId,
  loadTransacaoId,
} from "../../actions/actions";

import { useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import TransactionDetailsCard from "./TransactionDetailsCard/TransactionDetailsCard";
import TransactionDetailsCommission from "./TransactionDetailsCommission/TransactionDetailsCommission";
import TransactionDetailsSlip from "./TransactionDetailsSlip/TransactionDetailsSlip";

const TransactionDetails = () => {
  const token = useAuth();
  const dispatch = useDispatch();
  const { subsectionId } = useParams();
  const transacaoId = useSelector((state) => state.transacao);
  const recebiveis = useSelector((state) => state.recebiveis);

  const loadTransaction = useCallback(() => {
    dispatch(loadTransacaoId(token, subsectionId));
    dispatch(loadRecebiveisId(token, subsectionId));
  }, [subsectionId, dispatch]);

  useEffect(() => {
    loadTransaction();
  }, [loadTransaction]);

  useEffect(() => {
    return () => {
      dispatch(clearTransacao());
    };
  }, []);

  if (transacaoId === undefined || transacaoId.id === undefined) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{ position: "absolute" }}
      >
        <CircularProgress />
      </Box>
    );
  } else {
    const tipo = transacaoId.transaction.payment_type;
    if (tipo === "boleto") {
      return (
        <Box>
          <TransactionDetailsSlip
            transacaoId={transacaoId}
            reloadTransaction={loadTransaction}
          />
        </Box>
      );
    }
    if (tipo === "credit" || tipo === "debit") {
      return (
        <Box>
          <TransactionDetailsCard
            reloadTransaction={loadTransaction}
            transacaoId={transacaoId}
            recebiveis={recebiveis}
          />
          ;
        </Box>
      );
    }
    if (tipo === "commission") {
      return (
        <Box>
          <TransactionDetailsCommission transacaoId={transacaoId} />;
        </Box>
      );
    }
    if (tipo === "pix") {
      return (
        <Box>
          <TransactionDetailsCommission transacaoId={transacaoId} />;
        </Box>
      );
    } else {
      return <div />;
    }
  }
};

export default TransactionDetails;
