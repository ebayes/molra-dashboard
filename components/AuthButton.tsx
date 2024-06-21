import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AuthButton() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <Link href="/login" className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
      Login
    </Link>
  );
}