"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@/app/utils/config";
import { Car } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
/* =========================
   MASTER DATA
========================= */
type ColorKey =
  | "#ffffff"
  | "#000000"
  | "#6b7280"
  | "#d1d5db"
  | "#dc2626"
  | "#2563eb"
  | "#059669"
  | "#7c3aed"
  | "#f59e0b";


const COLOR_MAP: Record<ColorKey, any> = {
  "#ffffff": "White",
  "#000000": "Black",
  "#6b7280": "Grey",
  "#d1d5db": "Silver",
  "#dc2626": "Red",
  "#2563eb": "Blue",
  "#059669": "Green",
  "#7c3aed": "Purple",
  "#f59e0b": "Yellow",
};
const BRANDS = [
  { name: "Audi", image: "/assets/image/brands/car1.png" },
  { name: "BMW", image: "/assets/image/brands/car9.png" },
  { name: "Benz", image: "/assets/image/brands/car16.png" },
  { name: "Honda", image: "/assets/image/brands/car15.png" },
  { name: "Hyundai", image: "/assets/image/brands/car8.png" },
  { name: "Kia", image: "/assets/image/brands/car7.png" },
  { name: "Mahindra", image: "/assets/image/brands/car14.png" },
  { name: "Maruti Suzuki", image: "/assets/image/brands/car13.png" },
  { name: "MG", image: "/assets/image/brands/car6.png" },
  { name: "Nissan", image: "/assets/image/brands/car12.png" },
  { name: "Range Rover", image: "/assets/image/brands/car11.png" },
  { name: "Renault", image: "/assets/image/brands/car5.png" },
  { name: "Skoda", image: "/assets/image/brands/car4.png" },
  { name: "Tata", image: "/assets/image/brands/car3.png" },
  { name: "Toyota", image: "/assets/image/brands/car2.png" },
  { name: "Volkswagen", image: "/assets/image/brands/car10.png" },
];

const vehicleData: Record<string, string[]> = {
  Audi: ["A3", "A4", "A6", "Q5"],
  BMW: ["3 Series", "5 Series", "X1", "X5"],
  Benz: ["C-Class", "E-Class", "GLA", "GLS"],
  Honda: ["City", "Amaze"],
  Hyundai: ["Creta", "i20", "Venue"],
  Kia: ["Seltos", "Sonet"],
  Mahindra: ["Thar", "Scorpio"],
  "Maruti Suzuki": ["Swift", "Baleno"],
  MG: ["Hector", "ZS EV"],
  Nissan: ["Magnite"],
  "Range Rover": ["Velar"],
  Renault: ["Kwid"],
  Skoda: ["Slavia"],
  Tata: ["Nexon", "Harrier"],
  Toyota: ["Fortuner"],
  Volkswagen: ["Virtus"],
};

const VEHICLE_TYPES = [
  { label: "Hatchback", image: "/assets/image/brands/c1.png" },
  { label: "Sedan", image: "/assets/image/brands/c2.png" },
  { label: "SUV", image: "/assets/image/brands/c3.png" },
  { label: "Coupe", image: "/assets/image/brands/c4.png" },
  { label: "Van", image: "/assets/image/brands/c5.png" },
];

const COLORS = [
  "#ffffff", "#000000", "#6b7280", "#d1d5db",
  "#dc2626", "#2563eb", "#059669", "#7c3aed", "#f59e0b",
];


const FUELS = ["Petrol", "Diesel", "CNG", "Electric"];

/* =========================
   COMPONENT
========================= */

export default function VehiclePage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCheckout = searchParams.get("from") === "checkout";
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [color, setColor] = useState<ColorKey | "">("");
  const [fuelType, setFuelType] = useState("");
  const [reg, setReg] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const fetchVehicles = async () => {
    if (!userId) return;
    const res = await axios.get(`${BASE_URL}api/vehicles/getvehicle/${userId}`);
    setVehicles(res.data?.vehicles || []);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleEdit = (vehicle: any) => {
    setEditId(vehicle._id);

    setBrand(vehicle.brand);
    setModel(vehicle.model);
    setVehicleType(vehicle.vehicleType);
    setFuelType(vehicle.fuelType || "");
    setReg(vehicle.registrationNumber || "");

    // reverse color mapping (optional safe fallback)
    const matchedColor = COLORS.find((c) => COLOR_MAP[c as ColorKey] === vehicle.color);
    setColor((matchedColor as ColorKey) || "");

    setStep(1); // jump into edit flow
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}api/vehicles/getvehicle/${id}`);

      toast.success("Vehicle deleted");
      fetchVehicles();
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!brand || !model || !vehicleType) {
      return toast.error("Fill all required fields");
    }

    try {
      if (editId) {
        // UPDATE
        await axios.put(`${BASE_URL}api/vehicles/updatevehicle/${editId}`, {
          userId,
          brand,
          model,
          vehicleType,
          color: (COLOR_MAP as any)[color],
          fuelType,
          registrationNumber: reg,
        });

        toast.success("Vehicle Updated 🚗");
      } else {
        // CREATE
        await axios.post(`${BASE_URL}api/vehicles/createvehicle`, {
          userId,
          brand,
          model,
          vehicleType,
          color: (COLOR_MAP as any)[color],
          fuelType,
          registrationNumber: reg,
        });

        toast.success("Vehicle Added 🚗");
      }

      // reset
      setStep(0);
      setEditId(null);
      setBrand("");
      setModel("");
      setVehicleType("");
      setColor("");
      setFuelType("");
      setReg("");

      fetchVehicles();
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };
  /* ========================= UI ========================= */

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">

      {/* HEADER */}
      <div className="p-4 font-semibold flex items-center justify-between bg-white shadow">
        <div className="flex items-center gap-2">
          <Car size={18} /> Manage Vehicles
        </div>

        {fromCheckout && (
          <button
            onClick={() => router.back()}
            className="text-sm border px-3 py-1 rounded"
          >
            ← Go Back
          </button>
        )}
      </div>

      {/* LIST */}
      {step === 0 && (
        <div className="p-4 space-y-3">
          {vehicles.map((v,i) => (
            <div key={v._id} className="bg-white p-3 rounded-xl shadow flex justify-between items-center">

              {/* LEFT INFO */}
              <div>
                <p className="font-medium">{v.brand} {v.model}</p>
                <p className="text-xs text-gray-500">{v.registrationNumber}</p>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex gap-2">

                {/* EDIT */}
                <button
                  onClick={() => handleEdit(v)}
                  className="text-blue-500 text-xs border px-2 py-1 rounded"
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  onClick={() => handleDelete(v._id)}
                  className="text-red-500 text-xs border px-2 py-1 rounded"
                  disabled={i === 0}
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
          <button
            onClick={() => setStep(1)}
            className="w-full border-dashed border p-3 rounded-xl text-red-500"
          >
            + Add Vehicle
          </button>
        </div>
      )}

      {/* STEP 1: BRAND */}
      {step === 1 && (
        <div className="p-4 grid grid-cols-3 gap-3">
          {BRANDS.map((b) => (
            <div
              key={b.name}
              onClick={() => setBrand(b.name)}
              className={`p-3 bg-white rounded-xl border text-center cursor-pointer
              ${brand === b.name && "border-red-500"}`}
            >
              <Image
                src={b.image}
                alt={b.name}
                width={50}
                height={50}
                className="mx-auto"
              />
              <p className="text-xs">{b.name}</p>
            </div>
          ))}

          <button
            onClick={() => setStep(2)}
            className="col-span-3 bg-red-500 text-white py-2 rounded mt-4"
          >
            Next
          </button>
        </div>
      )}

      {/* STEP 2: MODEL */}
      {step === 2 && (
        <div className="p-4">
          <p className="text-sm mb-2">Select Model</p>

          <div className="grid grid-cols-2 gap-2">
            {vehicleData[brand]?.map((m) => (
              <div
                key={m}
                onClick={() => setModel(m)}
                className={`p-2 bg-white border rounded text-xs text-center cursor-pointer
                ${model === m && "border-red-500"}`}
              >
                {m}
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full bg-red-500 text-white py-2 mt-4 rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* STEP 3: TYPE */}
      {step === 3 && (
        <div className="p-4 grid grid-cols-2 gap-3">
          {VEHICLE_TYPES.map((v) => (
            <div
              key={v.label}
              onClick={() => setVehicleType(v.label)}
              className={`bg-white p-3 rounded-xl border text-center cursor-pointer
              ${vehicleType === v.label && "border-red-500"}`}
            >
              <Image
                src={v.image}
                alt={v.label}
                width={60}
                height={60}
                className="mx-auto"
              />
              <p className="text-xs">{v.label}</p>
            </div>
          ))}

          <button
            onClick={() => setStep(4)}
            className="col-span-2 bg-red-500 text-white py-2 rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* STEP 4: FINAL */}
      {step === 4 && (
        <div className="p-4 space-y-3">

          <input
            placeholder="Registration Number"
            value={reg}
            onChange={(e) => setReg(e.target.value)}
            className="w-full border p-2 rounded"
          />

          {/* COLORS */}
          <div className="flex gap-2">
            {COLORS.map((c: any) => (
              <div
                key={c}
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded-full border cursor-pointer
                ${color === c && "ring-2 ring-black"}`}
              />
            ))}
          </div>

          {/* FUEL */}
          <div className="flex gap-2">
            {FUELS.map((f) => (
              <button
                key={f}
                onClick={() => setFuelType(f)}
                className={`px-3 py-1 text-xs rounded
                ${fuelType === f ? "bg-red-500 text-white" : "bg-gray-200"}`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Save Vehicle
          </button>
        </div>
      )}
    </div>
  );
}