import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import Profile from "@/components/settings/Profile";

const ProfilePage = async () => {
  const user = await getAuthSession();
  if (!user) {
    redirect("/login");
  }
  return <Profile user={user} />;
};

export default ProfilePage;
