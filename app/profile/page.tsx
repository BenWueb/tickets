import type { Metadata } from "next";
import { ProfileView } from "@/components/ProfileView";
import { RequireAuth } from "@/components/RequireAuth";

export const metadata: Metadata = {
  title: "Profile — Show Tickets",
};

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileView />
    </RequireAuth>
  );
}
