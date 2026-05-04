import useQuery from "../../modules/AntecipacaoSalarial/hooks/useQuery";
import WhitelistDeDeviceDevices from "./WhitelistDeDeviceDevices";
import WhitelistDeDeviceUsers from "./WhitelistDeDeviceUsers";

export default function WhitelistDeDevice() {
  const type = useQuery()?.get("type") ?? ""; //user | device

  if (type === "user") {
    return <WhitelistDeDeviceUsers />;
  }

  if (type === "device") {
    return <WhitelistDeDeviceDevices />;
  }

  return null;
}
