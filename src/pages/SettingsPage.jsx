import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  User,
  MapPin,
  Lock,
  Mail,
  Info,
  Moon,
  MoreHorizontal,
  LogOut,
  Shield,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage({ myProfile, user, onProfileUpdate }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(myProfile.is_visible !== false);
  const [blackoutZones, setBlackoutZones] = useState(myProfile.blackout_zones || []);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneLat, setNewZoneLat] = useState("");
  const [newZoneLng, setNewZoneLng] = useState("");
  const [newZoneRadius, setNewZoneRadius] = useState("200");
  const [showAddZone, setShowAddZone] = useState(false);

  const toggleVisibility = async (checked) => {
    setIsVisible(checked);
    await base44.entities.UserProfile.update(myProfile.id, { is_visible: checked });
    onProfileUpdate();
    toast.success(checked ? "You're now visible" : "You're now hidden");
  };

  const addBlackoutZone = async () => {
    if (!newZoneName || !newZoneLat || !newZoneLng) return;
    const newZone = {
      name: newZoneName,
      latitude: parseFloat(newZoneLat),
      longitude: parseFloat(newZoneLng),
      radius_meters: parseInt(newZoneRadius) || 200,
    };
    const updated = [...blackoutZones, newZone];
    setBlackoutZones(updated);
    await base44.entities.UserProfile.update(myProfile.id, { blackout_zones: updated });
    onProfileUpdate();
    setNewZoneName("");
    setNewZoneLat("");
    setNewZoneLng("");
    setShowAddZone(false);
    toast.success("Blackout zone added");
  };

  const removeZone = async (index) => {
    const updated = blackoutZones.filter((_, i) => i !== index);
    setBlackoutZones(updated);
    await base44.entities.UserProfile.update(myProfile.id, { blackout_zones: updated });
    onProfileUpdate();
    toast.success("Blackout zone removed");
  };

  const SettingsGroup = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
        {title}
      </h3>
      <div className="bg-card rounded-2xl shadow-sm border border-border/50 divide-y divide-border/50">
        {children}
      </div>
    </div>
  );

  const SettingsRow = ({ icon: Icon, label, right, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/30 transition-colors"
    >
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      {right || <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />}
    </button>
  );

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-primary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center mr-6">Settings</h1>
      </div>

      {/* Profile Picture */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-secondary mx-auto flex items-center justify-center mb-2">
          <User className="w-10 h-10 text-secondary-foreground" />
        </div>
        <p className="text-xs text-primary font-semibold">Edit Profile Picture</p>
      </div>

      {/* Privacy & Security */}
      <SettingsGroup title="Privacy & Security">
        <SettingsRow
          icon={MapPin}
          label="Location Services"
          right={
            <Switch checked={isVisible} onCheckedChange={toggleVisibility} />
          }
        />
        <SettingsRow icon={Lock} label="Passwords" />
        <div className="px-4 py-3.5">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">Blackout Zones</span>
            <button
              onClick={() => setShowAddZone(!showAddZone)}
              className="text-primary"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {blackoutZones.map((zone, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2 mb-2 text-xs"
            >
              <span className="font-medium">{zone.name}</span>
              <button onClick={() => removeZone(i)} className="text-destructive">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          {showAddZone && (
            <div className="space-y-2 mt-2 bg-muted/30 p-3 rounded-xl">
              <Input
                placeholder="Zone name (e.g., Home)"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                className="text-xs h-8 rounded-lg"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Latitude"
                  value={newZoneLat}
                  onChange={(e) => setNewZoneLat(e.target.value)}
                  className="text-xs h-8 rounded-lg"
                  type="number"
                  step="any"
                />
                <Input
                  placeholder="Longitude"
                  value={newZoneLng}
                  onChange={(e) => setNewZoneLng(e.target.value)}
                  className="text-xs h-8 rounded-lg"
                  type="number"
                  step="any"
                />
              </div>
              <Input
                placeholder="Radius (meters)"
                value={newZoneRadius}
                onChange={(e) => setNewZoneRadius(e.target.value)}
                className="text-xs h-8 rounded-lg"
                type="number"
              />
              <Button onClick={addBlackoutZone} size="sm" className="w-full rounded-lg h-8 text-xs">
                Add Zone
              </Button>
            </div>
          )}
        </div>
      </SettingsGroup>

      {/* Account */}
      <SettingsGroup title="Account">
        <SettingsRow icon={Mail} label="Emails" />
        <SettingsRow icon={Info} label="Account Information" />
      </SettingsGroup>

      {/* App Settings */}
      <SettingsGroup title="App Settings">
        <SettingsRow icon={Moon} label="Appearance" />
        <SettingsRow icon={MoreHorizontal} label="More" />
      </SettingsGroup>

      {/* Sign Out */}
      <div className="mt-8 mb-4">
        <Button
          variant="ghost"
          onClick={() => base44.auth.logout()}
          className="w-full rounded-2xl h-12 text-destructive hover:bg-destructive/5 font-bold"
        >
          <LogOut className="w-5 h-5 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
}