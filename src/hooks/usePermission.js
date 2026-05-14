import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postAuthMeAction } from "../actions/actions";
import { PERMISSIONS } from "../constants/permissions";
import useAuth from "./useAuth";

export default function usePermission(cadastro = false) {
  const dispatch = useDispatch();
  const token = useAuth();
  const me = useSelector((state) => state.me);
  const userPermissions = me?.permissao?.map(({ tipo }) => tipo);
  const permissaoMaster = me?.permissao_master;

  useEffect(() => {
    if (!cadastro) dispatch(postAuthMeAction(token));
  }, [cadastro, dispatch, token]);

  function hasPermission(permission) {
    if (permissaoMaster) return true;
    if (userPermissions?.includes(PERMISSIONS.FULL_ACCESS)) return true;

    return !!userPermissions?.includes(permission);
  }

  return { hasPermission };
}
