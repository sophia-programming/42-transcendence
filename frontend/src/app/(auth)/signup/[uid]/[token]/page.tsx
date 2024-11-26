import { redirect } from "next/navigation";
import { completeSignup } from "@/actions/user";
import { getAuthSession } from "@/lib/nextauth";
import { Button } from "react-bootstrap";
import Link from "next/link";

interface CompleteSignupPageProps {
  params: {
    uid: string;
    token: string;
  };
}

const CompleteSignupPage = async ({ params }: CompleteSignupPageProps) => {
  const { uid, token } = await params;

  const user = await getAuthSession();

  if (user) {
    redirect("/");
  }

  const res = await completeSignup({ uid, token });

  if (res.success) {
    return (
      <div className="container d-flex justify-content-center">
        <div className="w-50 text-center">
          <h2 className="fw-bold mb-4">本登録完了</h2>
          <p>アカウント本登録が完了しました。</p>
          <p className="mb-4">ログインしてください。</p>
          <Button variant="primary" className="w-100">
            <Link href="/login" className="text-white text-decoration-none">
              ログイン
            </Link>
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container d-flex justify-content-center">
        <div className="w-50 text-center">
          <h2 className="fw-bold mb-4">本登録失敗</h2>
          <p>アカウント本登録に失敗しました。</p>
          <p className="mb-4">再度アカウント仮登録を行ってください。</p>
          <Button variant="secondary" className="w-100">
            <Link href="/signup" className="text-white text-decoration-none">
              新規登録
            </Link>
          </Button>
        </div>
      </div>
    );
  }
};

export default CompleteSignupPage;
