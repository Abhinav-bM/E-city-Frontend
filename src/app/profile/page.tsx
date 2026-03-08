"use client";

import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/api/profile";
import { Mail, Phone, User, Save, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    getProfile()
      .then((res) => {
        if (res.success && res.data) {
          setProfile({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
          });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name: profile.name, email: profile.email });
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Personal Info</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your basic profile information.
        </p>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Name */}
            <div className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm font-medium text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Invoices and notifications will be sent here.
                </p>
              </div>

              {/* Phone (Read Only Example - usually tied to OTP) */}
              <div className="space-y-1.5 opacity-70 cursor-not-allowed">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={profile.phone}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 outline-none"
                  />
                  <ShieldCheck
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"
                    size={18}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  Phone number is verified and cannot be changed here.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
