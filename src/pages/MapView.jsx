import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { getCurrentPosition, getDistance } from "@/lib/location";
import { getSharedInterests } from "@/lib/interests";
import UserCard from "@/components/UserCard";
import { MapPin, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const userIcon = new L.DivIcon({
  html: `<div style="width:32px;height:32px;background:hsl(10,80%,68%);border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: "",
});

const myIcon = new L.DivIcon({
  html: `<div style="width:36px;height:36px;background:hsl(214,70%,55%);border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none"><circle cx="12" cy="12" r="5"/></svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  className: "",
});

export default function MapView({ myProfile }) {
  const [position, setPosition] = useState(null);
  const [loadingPos, setLoadingPos] = useState(true);

  useEffect(() => {
    getCurrentPosition()
      .then((pos) => {
        setPosition(pos);
        setLoadingPos(false);
        base44.entities.UserProfile.update(myProfile.id, {
          latitude: pos.latitude,
          longitude: pos.longitude,
          last_active: new Date().toISOString(),
        });
      })
      .catch(() => setLoadingPos(false));
  }, [myProfile.id]);

  const { data: allProfiles = [] } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => base44.entities.UserProfile.filter({ is_visible: true, profile_setup_complete: true }),
  });

  const nearbyProfiles = allProfiles
    .filter((p) => p.user_id !== myProfile.user_id && p.latitude && p.longitude)
    .map((p) => ({
      ...p,
      distance: position ? getDistance(position.latitude, position.longitude, p.latitude, p.longitude) : 999,
      sharedInterests: getSharedInterests(myProfile.interests || [], p.interests || []),
    }))
    .filter((p) => p.distance <= 2 && p.sharedInterests.length > 0)
    .sort((a, b) => a.distance - b.distance);

  if (loadingPos) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!position) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-6 text-center">
        <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-bold">Enable Location</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Friendli needs your location to find nearby people. Please enable location services.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="h-[45vh] rounded-b-3xl overflow-hidden shadow-lg">
        <MapContainer
          center={[position.latitude, position.longitude]}
          zoom={14}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          <Circle
            center={[position.latitude, position.longitude]}
            radius={3218}
            pathOptions={{ color: "hsl(214,70%,55%)", fillColor: "hsl(214,70%,55%)", fillOpacity: 0.05, weight: 1 }}
          />
          <Marker position={[position.latitude, position.longitude]} icon={myIcon}>
            <Popup>You are here</Popup>
          </Marker>
          {nearbyProfiles.map((p) => (
            <Marker key={p.id} position={[p.latitude, p.longitude]} icon={userIcon}>
              <Popup>
                <strong>{p.display_name}</strong>
                <br />
                {p.sharedInterests.map((t) => `#${t}`).join(" ")}
                <br />
                {p.distance.toFixed(1)} mi
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="px-4 py-4">
        <h2 className="text-lg font-extrabold mb-3">Nearby Users</h2>
        {nearbyProfiles.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No nearby users with shared interests found within 2 miles.
          </p>
        ) : (
          <div className="space-y-3">
            {nearbyProfiles.map((p) => (
              <UserCard
                key={p.id}
                profile={p}
                distance={p.distance}
                sharedInterests={p.sharedInterests}
                onPing={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}