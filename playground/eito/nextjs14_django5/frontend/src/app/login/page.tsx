import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import Login from "@/components/auth/Login";

const LoginPage = async () => {
  const user = await getAuthSession();
  if (user) {
    redirect("/");
  }

  return <Login />;
};

export default LoginPage;
