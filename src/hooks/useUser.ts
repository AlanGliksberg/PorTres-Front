import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function useUser() {
  const { user } = useContext(AuthContext);

  return { user };
}
