import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const accessToken = useAppSelector(
    (state: RootState) => state.auth.accessToken
  );
  const router = useRouter();

  if (!accessToken) router.push("/auth/login");

  return <>{children}</>;
};

export default ProtectedRoute;
