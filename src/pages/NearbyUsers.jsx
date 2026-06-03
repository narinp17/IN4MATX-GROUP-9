import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentPosition, getDistance } from "@/lib/location";
import { getSharedInterests } from "@/lib/interests";
import UserCard from "@/components/UserCard";
import { Link } from "react-router-dom";
import { Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NearbyUsers({ myProfile }) {
  const [position, setPosition] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    getCurrentPosition().then(setPosition).catch(() => {});
  }, []);

  const { data: allProfiles = [], isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => base44.entities.UserProfile.filter({ is_visible: true, profile_setup_complete: true }),
  });

  const { data: myPings = [] } = useQuery({
    queryKey: ["my-pings", myProfile.user_id],
    queryFn: () => base44.entities.Ping.filter({ sender_id: myProfile.user_id }),
  });

  const sendPingMutation = useMutation({
    mutationFn: async (targetProfile) => {
      const shared = getSharedInterests(myProfile.interests || [], targetProfile.interests || []);
      return base44.entities.Ping.create({
        sender_id: myProfile.user_id,
        sender_name: myProfile.display_name,
        receiver_id: targetProfile.user_id,
        receiver_name: targetProfile.display_name,
        status: "pending",
        shared_interests: shared,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-pings"] });
      toast.success("Wave sent! 👋");
    },
  });

  const nearbyProfiles = allProfiles
    .filter((p) => p.user_id !== myProfile.user_id && p.latitude && p.longitude)
    .map((p) => ({
      ...p,
      distance: position
        ? getDistance(position.latitude, position.longitude, p.latitude, p.longitude)
        : 999,
      sharedInterests: getSharedInterests(myProfile.interests || [], p.interests || []),
    }))
    .filter((p) => p.distance <= 2 && p.sharedInterests.length > 0)
    .sort((a, b) => a.distance - b.distance);

  const getPingStatus = (userId) => {
    const ping = myPings.find((p) => p.receiver_id === userId);
    return ping?.status;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-extrabold">Nearby</h1>
      </div>

      {nearbyProfiles.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            No one nearby with shared interests right now.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {nearbyProfiles.map((p) => (
            <Link key={p.id} to={`/user/${p.user_id}`}>
              <UserCard
                profile={p}
                distance={p.distance}
                sharedInterests={p.sharedInterests}
                onPing={(e) => {
                  e?.preventDefault?.();
                  e?.stopPropagation?.();
                  sendPingMutation.mutate(p);
                }}
                pingStatus={getPingStatus(p.user_id)}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}