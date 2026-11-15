import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import {
  MapPin,
  Info,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  Navigation,
  Edit3,
  Calendar,
  Layers,
  Sprout,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Skeleton, Btn, Card, inputCls } from "@/components/kit";
import { pageHead } from "@/lib/page-head";
import { AuthModal } from "@/components/AuthModal";
import { deleteFarmField, setPrimaryFarmField } from "@/lib/farm-fields-service";
import { getCurrentBrowserCoordinates, reverseGeocodeCoordinates } from "@/lib/geolocation-service";
import { supabase } from "@/integrations/supabase/client";

const MyFarmMap = lazy(() => import("@/components/MyFarmMap"));

export const Route = createFileRoute("/my-farm")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — Farmer Profile & Multi-Plot Management",
      "Manage your personalized farmer profile, registered agricultural plots, cadastral boundaries, and GPS locations.",
    ),
  component: MyFarm,
});

function MyFarm() {
  const {
    t,
    lang,
    user,
    profile,
    refreshProfile,
    farmFields,
    selectedField,
    setSelectedField,
    reloadFarmFields,
    currentGpsLocationName,
    setCurrentGpsLocationName,
  } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(profile?.full_name ?? "");
  const [profilePhone, setProfilePhone] = useState(profile?.phone_number ?? "");
  const [profileDistrict, setProfileDistrict] = useState(profile?.district ?? "");
  const [profileMunicipality, setProfileMunicipality] = useState(profile?.municipality ?? "");
  const [locatingGps, setLocatingGps] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const fb = <Skeleton className="h-[calc(100dvh-20rem)] min-h-[420px] w-full rounded-2xl" />;

  const handleAcquireGps = async () => {
    setLocatingGps(true);
    try {
      const gps = await getCurrentBrowserCoordinates();
      const geocoded = await reverseGeocodeCoordinates(gps.latitude, gps.longitude);
      setCurrentGpsLocationName(geocoded.displayName);

      if (user) {
        await supabase
          .from("user_profiles")
          .update({
            current_location_name: geocoded.displayName,
            current_latitude: gps.latitude,
            current_longitude: gps.longitude,
          })
          .eq("id", user.id);
        await refreshProfile();
      }
    } catch (err: any) {
      alert(err.message || "Could not retrieve GPS coordinates.");
    } finally {
      setLocatingGps(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          full_name: profileName.trim(),
          phone_number: profilePhone.trim() || null,
          district: profileDistrict.trim() || null,
          municipality: profileMunicipality.trim() || null,
        })
        .eq("id", user.id);
      if (error) throw error;
      await refreshProfile();
      setEditingProfile(false);
    } catch (err: any) {
      alert(`Error updating profile: ${err.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!confirm("Are you sure you want to delete this agricultural plot?")) return;
    try {
      await deleteFarmField(fieldId);
      await reloadFarmFields();
    } catch (err: any) {
      alert(`Error deleting field: ${err.message}`);
    }
  };

  const handleSetPrimary = async (fieldId: string) => {
    if (!user) return;
    try {
      await setPrimaryFarmField(fieldId, user.id);
      await reloadFarmFields();
    } catch (err: any) {
      alert(`Error setting primary field: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                Personalized Agricultural Management
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Farmer Profile & Registered Plots
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Manage your personal identity, current geographic coordinates, cadastral boundaries,
              and crop inventory.
            </p>
          </div>

          {!user && (
            <Btn
              onClick={() => setAuthModalOpen(true)}
              className="self-start sm:self-auto font-bold text-xs"
            >
              Sign In to Save Plots
            </Btn>
          )}
        </div>
      </div>

      {/* Grid: Profile Card + Multi-Plot List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Farmer Profile & GPS (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">
                    {profile?.full_name ?? user?.email ?? "Farmer Profile"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {user ? "Verified Account" : "Unauthenticated Guest"}
                  </p>
                </div>
              </div>

              {user && (
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  {editingProfile ? "Cancel" : "Edit"}
                </button>
              )}
            </div>

            {/* Profile Info Details or Edit Form */}
            {editingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-foreground mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-foreground mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className={inputCls}
                    placeholder="+977-98..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-foreground mb-1">District</label>
                    <input
                      type="text"
                      value={profileDistrict}
                      onChange={(e) => setProfileDistrict(e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Sunsari"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-foreground mb-1">Municipality</label>
                    <input
                      type="text"
                      value={profileMunicipality}
                      onChange={(e) => setProfileMunicipality(e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Itahari"
                    />
                  </div>
                </div>
                <Btn
                  type="submit"
                  size="sm"
                  disabled={savingProfile}
                  className="w-full font-bold mt-2"
                >
                  {savingProfile ? "Saving..." : "Save Profile Details"}
                </Btn>
              </form>
            ) : (
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <dt className="text-muted-foreground">Email:</dt>
                  <dd className="font-semibold text-foreground">
                    {user?.email ?? "Not logged in"}
                  </dd>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <dt className="text-muted-foreground">Phone:</dt>
                  <dd className="font-semibold text-foreground">{profile?.phone_number || "—"}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <dt className="text-muted-foreground">Location:</dt>
                  <dd className="font-semibold text-foreground">
                    {[profile?.municipality, profile?.district, profile?.country]
                      .filter(Boolean)
                      .join(", ") || "Not set"}
                  </dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-muted-foreground">Preferred Language:</dt>
                  <dd className="font-semibold text-primary uppercase">{lang}</dd>
                </div>
              </dl>
            )}

            {/* Dynamic GPS Current Location Card */}
            <div className="p-3.5 rounded-xl bg-secondary/40 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Navigation className="h-3.5 w-3.5 text-primary" />
                  Current Device Location
                </span>
                <button
                  type="button"
                  onClick={handleAcquireGps}
                  disabled={locatingGps}
                  className="text-[11px] font-bold text-primary hover:underline"
                >
                  {locatingGps ? "Acquiring..." : "Update GPS"}
                </button>
              </div>
              <p className="text-xs font-semibold text-foreground font-mono">
                {currentGpsLocationName ?? "GPS not acquired. Click Update GPS to detect."}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Your current device GPS is separate from your agricultural farmland location.
              </p>
            </div>
          </Card>

          {/* Registered Plots List */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-sm font-extrabold text-foreground">
                  Registered Plots ({farmFields.length})
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Switch or manage your farmland parcels
                </p>
              </div>
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-2xs hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Plot
              </Link>
            </div>

            {farmFields.length === 0 ? (
              <div className="p-5 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl space-y-2">
                <AlertCircle className="h-6 w-6 text-muted-foreground mx-auto" />
                <p className="font-semibold">No farm registered yet.</p>
                <p>Add your first agricultural plot to enable personalized monitoring.</p>
                <Link
                  to="/onboarding"
                  className="inline-block text-primary font-bold hover:underline pt-1"
                >
                  Start Registration →
                </Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {farmFields.map((f) => {
                  const isSelected = selectedField?.id === f.id;
                  return (
                    <div
                      key={f.id}
                      className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <strong className="text-foreground text-sm">{f.fieldName}</strong>
                            {f.isPrimary && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary text-primary-foreground">
                                Primary
                              </span>
                            )}
                          </div>
                          <span className="text-muted-foreground text-[11px] block mt-0.5">
                            {f.municipality || "Nepal"} · {f.cropType} · {f.areaM2} m²
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedField(f)}
                            className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "border border-border bg-card text-foreground hover:bg-muted"
                            }`}
                          >
                            {isSelected ? "Active" : "Select"}
                          </button>
                          <button
                            onClick={() => handleDeleteField(f.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                            title="Delete plot"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {!f.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(f.id)}
                          className="text-[10px] font-semibold text-primary hover:underline"
                        >
                          Mark as Primary Plot
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Cadastral Boundary Interactive Map (Col 7) */}
        <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Cadastral Parcel Map
              </h3>
              <span className="text-xs text-muted-foreground">
                {selectedField
                  ? `Viewing: ${selectedField.fieldName} (${selectedField.areaM2} m²)`
                  : "No active parcel selected"}
              </span>
            </div>
            {selectedField && (
              <span className="text-xs font-mono font-bold text-foreground">
                {selectedField.latitude.toFixed(4)}° N, {selectedField.longitude.toFixed(4)}° E
              </span>
            )}
          </div>

          <div className="rounded-xl overflow-hidden border border-border">
            <ClientOnly fallback={fb}>
              <Suspense fallback={fb}>
                <MyFarmMap />
              </Suspense>
            </ClientOnly>
          </div>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
