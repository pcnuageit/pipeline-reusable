import { useSelector } from "react-redux";

const usePermission = (permission) => {
  const userPermissions = useSelector(
    (state) => state.userPermissao.permissao
  ).map(({ tipo }) => tipo);

  if (Array.isArray(permission)) {
    return permission.some((p) => userPermissions.includes(p));
  }

  return userPermissions.includes(permission);
};

export default usePermission;
