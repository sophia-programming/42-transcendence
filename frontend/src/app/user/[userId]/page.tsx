import { getUserDetail } from "@/actions/user";
import UserDetail from "@/components/user/UserDetail";

interface UserDetailPageProps {
  params: {
    userId: string;
  };
}

const UserDetailPage = async ({ params }: UserDetailPageProps) => {
  const { userId } = await params;
  const { success, user } = await getUserDetail({ userId });

  if (!success) {
    return (
      <div className="text-center text-sm text-gray-500">
        ユーザーの取得に失敗しました
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-sm text-gray-500">
        ユーザーは存在しません
      </div>
    );
  }

  return <UserDetail user={user} />;
};

export default UserDetailPage;
