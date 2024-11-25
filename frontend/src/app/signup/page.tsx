import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import Signup from "@/components/auth/Signup";

const SignupPage = async () => {
  const user = await getAuthSession();

  if (user) {
    redirect("/");
  }

  return <Signup />;
};

export default SignupPage;
