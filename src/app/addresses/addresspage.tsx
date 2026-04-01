"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/app/utils/config";
import { useSearchParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCheckout = searchParams.get("from") === "checkout";
const {
  ready,
  value,
  setValue,
  suggestions: { status, data },
  clearSuggestions,
} = usePlacesAutocomplete({
  requestOptions: {
    componentRestrictions: { country: "in" }, // optional (India only)
  },
  debounce: 300,
});
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const [form, setForm] = useState<Address>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    email: "",
    addressType: "Home",
  });

  /* ================= FETCH ================= */
const fetchAddresses = async () => {
  try {
    if (typeof window === "undefined") return;

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const res = await axios.get(
      `${BASE_URL}api/address/getByIdAddress/${userId}`
    );

    setAddresses(res.data?.Addresslist || []);
  } finally {
    setLoading(false);
  }
};
  const handleSelect = async (suggestion: any) => {
  const description = suggestion.description;

  setValue(description, false);
  clearSuggestions();

  try {
    const results = await getGeocode({ address: description });
    const { lat, lng } = await getLatLng(results[0]);

    setLocation({ lat, lng });

    const address = results[0].address_components;

    const getComponent = (type: string) =>
      address.find((c: any) => c.types.includes(type))?.long_name || "";

    setForm((prev) => ({
      ...prev,
      street: description,
      city: getComponent("locality"),
      state: getComponent("administrative_area_level_1"),
      pinCode: getComponent("postal_code"),
    }));
  } catch (error) {
    console.log("Error: ", error);
  }
};

  useEffect(() => {
    fetchAddresses();
  }, []);

  /* ================= LOCATION ================= */
  const getCurrentLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setLocation({ lat, lng });

      // Auto fill address
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );

        const data = res.data;

        setForm((prev) => ({
          ...prev,
          street: data.address.road || "",
          city: data.address.city || data.address.town || "",
          state: data.address.state || "",
          pinCode: data.address.postcode || "",
        }));
      } catch {}
    });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const userId = localStorage.getItem("userId");

    if (!location) return alert("Please select location");

    try {
      setSaving(true);

      if (editingId) {
        await axios.put(
          `${BASE_URL}api/address/updateAddress/${editingId}`,
          { ...form, userId, ...location }
        );
      } else {
        await axios.post(`${BASE_URL}api/address/createAddress`, {
          ...form,
          userId,
          ...location,
        });
      }

      setShowModal(false);
      setEditingId(null);

      setForm({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pinCode: "",
        email: "",
        addressType: "Home",
      });

      fetchAddresses();

      if (fromCheckout) router.push("/checkout");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;

    await axios.delete(`${BASE_URL}api/address/deleteAddress/${id}`);
    fetchAddresses();
  };

  /* ================= EDIT ================= */
  const handleEdit = (item: Address) => {
    setForm(item);
    setEditingId(item._id || null);
    setLocation({
      lat: item.latitude,
      lng: item.longitude,
    });
    setShowModal(true);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-white px-4 py-4 shadow-sm font-semibold text-lg">
        Addresses
      </div>

      {/* LIST */}
      <div className="p-4 space-y-4 pb-32">
        {addresses.map((item) => (
          <div
            key={item._id}
            onClick={() => setSelectedAddress(item._id!)}
            className={`p-4 rounded-2xl border cursor-pointer ${
              selectedAddress === item._id
                ? "border-red-500 bg-red-50"
                : "bg-white"
            }`}
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">{item.fullName}</h3>

              <div className="flex gap-2 text-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                  className="text-red-500"
                >
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item._id!);
                  }}
                  className="text-gray-400"
                >
                  Remove
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {item.street}, {item.city}, {item.state} - {item.pinCode}
            </p>

            <div className="flex gap-4 text-xs text-gray-400 mt-2">
              <span>📞 {item.phone}</span>
              <span>✉️ {item.email}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD BUTTON */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <button
          onClick={() => {
            setShowModal(true);
            getCurrentLocation();
          }}
          className="w-full border-2 border-dashed border-red-400 text-red-500 py-3 rounded-xl font-medium"
        >
          + Add Address
        </button>
      </div>

      {/* CHECKOUT BUTTON */}
      {fromCheckout && selectedAddress && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-red-500 text-white py-3 rounded-xl"
          >
            Deliver to this address
          </button>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-4 max-h-[95vh] overflow-y-auto relative">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-3">
              {editingId ? "Edit Address" : "Add Address"}
            </h2>
            <div className="mb-3 relative">
  <input
    value={value}
    onChange={(e) => setValue(e.target.value)}
    disabled={!ready}
    placeholder="Search your location..."
    className="w-full p-3 rounded-xl bg-gray-100"
  />

  {/* Suggestions */}
  {status === "OK" && (
    <div className="absolute bg-white w-full shadow-md rounded-xl mt-1 z-50 max-h-40 overflow-y-auto">
      {data.map((suggestion) => {
        const {
          place_id,
          structured_formatting: { main_text, secondary_text },
        } = suggestion;

        return (
          <div
            key={place_id}
            onClick={() => handleSelect(suggestion)}
            className="p-3 hover:bg-gray-100 cursor-pointer"
          >
            <p className="font-medium">{main_text}</p>
            <p className="text-xs text-gray-500">{secondary_text}</p>
          </div>
        );
      })}
    </div>
  )}
</div>

            {/* MAP */}
            {location && (
              <iframe
                className="w-full h-44 rounded-xl mb-3"
                src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
              />
            )}

            <button
              onClick={getCurrentLocation}
              className="text-red-500 text-sm mb-3"
            >
              📍 Use Current Location
            </button>

            {/* FORM */}
            <div className="space-y-3">
              {["fullName", "email", "street", "city", "state", "pinCode", "phone"].map(
                (field) => (
                  <input
                    key={field}
                    placeholder={field}
                    value={(form as any)[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-gray-100 outline-none"
                  />
                )
              )}

              {/* TYPE */}
              <div className="flex gap-2">
                {["Home", "Office", "Others"].map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setForm({ ...form, addressType: type })
                    }
                    className={`flex-1 py-2 rounded-xl ${
                      form.addressType === type
                        ? "bg-red-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* SAVE */}
            <div className="sticky bottom-0 bg-white pt-4 ">
              <button
                onClick={handleSave}
                className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold mb-17"
              >
                {saving ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}