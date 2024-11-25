import { redirect } from "next/navigation";
import { completeSignup } from "@/actions/user";
import { getAuthSession } from "@/lib/nextauth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CompleteSignupProps {
  params: {
    uid: string;
    token: string;
  };
}

const CompleteSignupPage = async ({ params }: CompleteSignupProps) => {
  const { uid, token } = params;

  const user = await getAuthSession();
  if (user) {
    redirect("/");
  }

  const res = await completeSignup({ uid, token });
  if (res.success) {
    return (
      <div className="max-w-[400px] m-auto text-center">
        <div className="text-2xl font-bold mb-10">本登録完了</div>
        <div>アカウント本登録が完了しました</div>
        <div className="mb-5">ログインしてください</div>
        <Button asChild className="font-bold">
          <Link href="/login">ログイン</Link>
        </Button>
      </div>
    );
  } else {
    return (
      <div className="max-w-[400px] m-auto text-center">
        <div className="text-2xl font-bold mb-10">本登録失敗</div>
        <div>アカウント本登録に失敗しました</div>
        <div className="mb-5">再度仮登録を行ってください</div>
        <Button asChild className="font-bold">
          <Link href="/signup">新規登録</Link>
        </Button>
      </div>
    );
  }
};

export default CompleteSignupPage;
