import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import SignUp from "@/components/auth/Signup";

const SignUpPage = async () => {
  const user = await getAuthSession();

  if (user) {
    redirect("/");
  }

  return <SignUp />;
};

export default SignUpPage;
