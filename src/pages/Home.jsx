import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import MapView from "./MapView";
import ProfileSetup from "./ProfileSetup";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [setupDone, setSetupDone] = useState(false);

  const fetchUser = useCallback(async () => {
    const u = await base44.auth.me();
    setUser(u);
    setLoadingUser(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const { data: profiles = [], isLoading: profilesLoading, refetch } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: () => base44.entities.UserProfile.filter({ user_id: user.id }),
    enabled: !!user?.id,
  });

  const myProfile = profiles[0];

  if (loadingUser || profilesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!myProfile || !myProfile.profile_setup_complete) {
    return (
      <ProfileSetup
        user={user}
        onComplete={() => {
          refetch();
          setSetupDone(true);
        }}
      />
    );
  }

  return <MapView myProfile={myProfile} />;
}