"use client";

import React, { useEffect, useState } from "react";
import {
  getProfile,
  addAddress,
  removeAddress,
  updateAddress,
} from "@/api/profile";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Home,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";

const AddressModal = ({
  editId,
  formData,
  addressesLength,
  setShowModal,
  handleInputChange,
  handleSubmit,
}: {
  editId: string | null;
  formData: any;
  addressesLength: number;
  setShowModal: (show: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 w-full">
    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">
          {editId ? "Edit Address" : "Add New Address"}
        </h3>
        <button
          onClick={() => setShowModal(false)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          ×
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Full Name
            </label>
            <input
              required
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Phone
            </label>
            <input
              required
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              pattern="[0-9]{10}"
              title="10 digit phone number"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Address Line 1
          </label>
          <input
            required
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Address Line 2 (Optional)
          </label>
          <input
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">City</label>
            <input
              required
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              State
            </label>
            <input
              required
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              ZIP Code
            </label>
            <input
              required
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            disabled={addressesLength === 0} // First is always default
            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <label
            htmlFor="isDefault"
            className="text-sm font-medium text-slate-700 cursor-pointer"
          >
            Set as Default Address
          </label>
        </div>

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-md shadow-slate-900/10"
          >
            Save Address
          </button>
        </div>
      </form>
    </div>
  </div>
);

const AddressBookPage = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    isDefault: false,
  });

  const fetchAddresses = () => {
    setLoading(true);
    getProfile()
      .then((res) => {
        if (res.success && res.data.addresses) {
          setAddresses(res.data.addresses);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openModal = (addr?: any) => {
    if (addr) {
      setEditId(addr._id);
      setFormData({
        fullName: addr.fullName,
        phone: addr.phone,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2 || "",
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        isDefault: addr.isDefault,
      });
    } else {
      setEditId(null);
      setFormData({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        isDefault: addresses.length === 0,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateAddress(editId, formData);
        toast.success("Address updated successfully");
      } else {
        await addAddress(formData);
        toast.success("Address added successfully");
      }
      setShowModal(false);
      fetchAddresses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this address?")) {
      try {
        await removeAddress(id);
        toast.success("Address removed");
        fetchAddresses();
      } catch (err: any) {
        toast.error("Failed to remove address");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Address Book</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your shipping and billing addresses
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 shrink-0"
        >
          <Plus size={18} />
          Add New Address
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <MapPin size={32} className="text-slate-300" />
          </div>
          <p className="text-base font-bold text-slate-900">
            No Addresses Saved
          </p>
          <p className="text-sm text-slate-500 mt-1 max-w-xs">
            Add an address so we know where to ship your next amazing gadget!
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`relative p-5 rounded-2xl border transition-all ${
                addr.isDefault
                  ? "bg-slate-50/50 border-slate-900 shadow-[0_0_0_1px_#0f172a]"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              {addr.isDefault && (
                <span className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                  <CheckCircle size={12} /> Default
                </span>
              )}

              <h3 className="text-sm font-bold text-slate-900 pr-20">
                {addr.fullName}
              </h3>
              <p className="text-sm font-medium text-slate-600 mt-1 mb-3">
                {addr.phone}
              </p>

              <div className="text-sm text-slate-500 leading-relaxed min-h-[60px]">
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>
                  {addr.city}, {addr.state} {addr.postalCode}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => openModal(addr)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors ml-auto"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressBookPage;
