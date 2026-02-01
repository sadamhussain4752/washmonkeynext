"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { User, MapPin, Package, Image as ImageIcon, Trash2, Share2 } from "lucide-react";
import { BASE_URL } from "../utils/config";

type Address = {
  _id?: string;
  fullName: string;
  phone: string;
  companyName?: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  email: string;
  addressType?: string;
  latitude?: number;
  longitude?: number;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Address>({
    fullName: "",
    phone: "",
    companyName: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    email: "",
    addressType: "",
  });

  /* ---------------- FETCH ADDRESSES ---------------- */
  const fetchAddresses = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await axios.get(`${BASE_URL}api/address/getByIdAddress/${userId}`);
      setAddresses(res.data?.Addresslist || []);
    } catch {
      alert("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  /* ---------------- FORM VALIDATION ---------------- */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName) newErrors.fullName = "Full name is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.street) newErrors.street = "Street is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.pinCode) newErrors.pinCode = "Pincode is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.addressType) newErrors.addressType = "Address type is required";
    if (form.addressType === "Office" && !form.companyName) newErrors.companyName = "Company name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- LOCATION ---------------- */
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
      },
      () => alert("Location permission denied")
    );
  };

  /* ---------------- SAVE OR UPDATE ADDRESS ---------------- */
  const handleSave = async () => {
    if (!location) {
      alert("Location is required");
      return;
    }
    if (!validateForm()) return;

    try {
      setSaving(true);
      const userId = localStorage.getItem("userId");

      if (editingId) {
        await axios.put(`${BASE_URL}api/address/updateAddress/${editingId}`, {
          ...form,
          userId,
          latitude: location.lat,
          longitude: location.lng,
        });
      } else {
        await axios.post(`${BASE_URL}api/address/createAddress`, {
          ...form,
          userId,
          latitude: location.lat,
          longitude: location.lng,
        });
      }

      setShowModal(false);
      setEditingId(null);
      setForm({
        fullName: "",
        phone: "",
        companyName: "",
        street: "",
        city: "",
        state: "",
        pinCode: "",
        email: "",
        addressType: "",
      });
      setErrors({});
      fetchAddresses();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- EDIT ADDRESS ---------------- */
  const handleEdit = (addr: Address) => {
    setForm(addr);
    setEditingId(addr._id || null);
    setLocation({ lat: addr.latitude || 0, lng: addr.longitude || 0 });
    setShowModal(true);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2"><User /> Addresses</h1>
        <Button
          onClick={() => {
            setEditingId(null);
            setForm({ fullName: "", phone: "", companyName: "", street: "", city: "", state: "", pinCode: "", email: "", addressType: "" });
            setShowModal(true);
            getCurrentLocation();
          }}
        >
          + Add Address
        </Button>
      </div>

      {/* Address List */}
      {addresses.length === 0 ? (
        <p className="text-gray-500">No saved addresses</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((item) => (
            <Card key={item._id} className="p-4 cursor-pointer hover:bg-gray-50">
              <h3 className="font-semibold flex items-center gap-2"><User /> {item.fullName}</h3>
              <p className="flex items-center gap-2"><ImageIcon /> {item.email}</p>
              <p className="flex items-center gap-2"><MapPin /> {item.street}, {item.city}, {item.state}</p>
              <p className="flex items-center gap-2"><Package /> {item.pinCode}</p>
              {item.companyName && <p className="flex items-center gap-2"><Share2 /> {item.companyName}</p>}
              <div className="flex gap-2 mt-2 flex-wrap">
                <Button onClick={() => handleEdit(item)} variant="outline" size="sm" className="flex-1 sm:flex-none"><User /> Edit</Button>
                {/* <Button onClick={async () => {
                  await axios.delete(`${BASE_URL}api/address/deleteAddress/${item._id}`);
                  fetchAddresses();
                }} variant="destructive" size="sm" className="flex-1 sm:flex-none"><Trash2 /> Delete</Button> */}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 sm:p-6 overflow-auto">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Address" : "Add New Address"}</h2>

            {/* Map */}
            {location && (
              <iframe
                className="w-full h-56 rounded mb-4"
                src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=17&output=embed`}
                loading="lazy"
              />
            )}

            <div className="flex flex-col gap-2">
              {["fullName", "phone", "street", "city", "state", "pinCode", "email"].map((field) => (
                <div key={field}>
                  <Input placeholder={field} value={(form as any)[field]} onChange={(e: any) => setForm({ ...form, [field]: e.target.value })} />
                  {errors[field] && <p className="text-red-500 text-xs">{errors[field]}</p>}
                </div>
              ))}

              <Select value={form.addressType} onValueChange={(value) => setForm({ ...form, addressType: value })}>
                <SelectTrigger><SelectValue placeholder="Select Address Type" /></SelectTrigger>
                <SelectContent>
                  {["Apartment", "Individual House", "Villa", "Office", "Shop"].map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.addressType && <p className="text-red-500 text-xs">{errors.addressType}</p>}

              {form.addressType === "Office" && (
                <>
                  <Input placeholder="Company Name" value={form.companyName} onChange={(e: any) => setForm({ ...form, companyName: e.target.value })} />
                  {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName}</p>}
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button onClick={handleSave} disabled={saving} className="flex-1">{saving ? "Saving..." : editingId ? "Update" : "Save"}</Button>
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
