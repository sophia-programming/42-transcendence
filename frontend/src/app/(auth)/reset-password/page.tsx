import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import ForgotPassword from "@/components/auth/ForgotPassword";

const ForgotPasswordPage = async () => {
  const user = await getAuthSession();

  if (user) {
    redirect("/");
  }

  return <ForgotPassword />;
};

export default ForgotPasswordPage;
