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
  Audi: ["A3", "A4", "A6", "e-tron", "Q2", "Q3", "Q5", "Q7", "Q8", "RS / S"],

  BMW: ["3 Series", "5 Series", "7 Series", "i4", "iX", "X1", "X3", "X5", "X7", "Z4"],

  Benz: [
    "A-Class",
    "C-Class",
    "E-Class",
    "EQB",
    "EQS",
    "GLA",
    "GLB",
    "GLC",
    "GLE",
    "GLS",
    "S-Class"
  ],

  Honda: ["Amaze", "City", "Elevate", "Jazz"],

  Hyundai: [
    "Alcazar",
    "Aura",
    "Creta / Creta N Line",
    "Exter",
    "i10 / Grand i10 Nios",
    "i20 / i20 N Line",
    "Ioniq 5",
    "Prime HB",
    "Prime SD",
    "Tucson",
    "Venue / Venue N Line",
    "Verna"
  ],

  Kia: ["Carens", "Carnival", "Seltos", "Sonet", "Syros"],

  Mahindra: [
    "BE 6",
    "Bolero / Bolero Neo",
    "Scorpio N / Scorpio Classic",
    "Thar / Thar Roxx",
    "XEV 4e",
    "XEV 9e",
    "XUV3XO",
    "XUV700 / XUV7XO"
  ],

  "Maruti Suzuki": [
    "Alto 800 / Alto K10",
    "Baleno",
    "Brezza",
    "Celerio",
    "Ciaz",
    "Dzire",
    "Eeco",
    "Ertiga",
    "Fronx",
    "Grand Vitara",
    "Ignis",
    "Invicto",
    "Jimny",
    "S-Presso",
    "Swift",
    "Victoris",
    "Wagon R",
    "XL6"
  ],

  MG: ["Astor", "Comet EV", "Gloster", "Hector", "Hector Plus", "ZS EV"],

  Nissan: ["Gravite", "Kicks", "Magnite", "Tekton"],

  "Range Rover": [
    "Defender",
    "Discovery",
    "Discovery Sport",
    "Range Rover",
    "Range Rover Sport",
    "Range Rover Velar"
  ],

  Renault: ["Bigster", "Duster", "Kwid", "Triber"],

  Skoda: ["Kodiaq", "Kushaq", "Octavia / Octavia RS", "Slavia", "Superb"],

  Tata: [
    "Altroz",
    "Avinya / Avinya X",
    "Curvv",
    "Harrier",
    "Nexon",
    "Punch",
    "Safari",
    "Sierra",
    "Tiago",
    "Tiago NRG",
    "Tigor"
  ],

  Toyota: [
    "Camry",
    "Corolla",
    "Fortuner",
    "Glanza",
    "Hilux",
    "Innova",
    "Innova Hycross",
    "Land Cruiser",
    "Prado",
    "Urban Cruiser / Urban Cruiser Hyryder"
  ],

  Volkswagen: [
    "Polo",
    "Taigun",
    "Tiguan / Tiguan Allspace",
    "Vento",
    "Virtus"
  ]
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
  const [isValid, setIsValid] = useState(true);

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
  if (!brand) return toast.error("Brand is required");
  if (!model) return toast.error("Model is required");
  if (!vehicleType) return toast.error("Vehicle type is required");
  if (!reg) return toast.error("Registration number is required");
  if (!fuelType) return toast.error("Please select fuel type");
  if (!color) return toast.error("Please select vehicle color");

  // REGEX validation for vehicle number (India format basic)
  const regRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/i;
  if (!regRegex.test(reg.replace(/\s/g, ""))) {
    return toast.error("Invalid registration number (e.g. KA01AB1234)");
  }

  try {
    if (editId) {
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

    // RESET
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

const handleRegistrationChange = (text: any) => {
  const upper = text.toUpperCase().replace(/\s/g, "");
  setReg(upper);

  const regex = /^TN\d{2}[A-Z]{1,2}\d{1,4}$/;
  setIsValid(regex.test(upper));
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
                  className="text-primary text-xs border px-2 py-1 rounded"
                  disabled={i === 0}
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
          <button
  onClick={() => setStep(1)}
  className="w-full border-2 border-dashed border-primary text-primary py-2 rounded-xl 
  flex items-center justify-center gap-2 font-medium 
  hover:bg-primary hover:text-white transition-all duration-200 
  hover:shadow-md active:scale-95"
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
              ${brand === b.name && "border-primary"}`}
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
  onClick={() => {
    if (!brand) {
      return toast.error("Please select a brand");
    }
    setStep(2);
  }}
  className="col-span-3 bg-primary text-white py-2 rounded mt-4"
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
                ${model === m && "border-primary"}`}
              >
                {m}
              </div>
            ))}
          </div>

          <button
  onClick={() => {
    if (!model) {
      return toast.error("Please select a model");
    }
    setStep(3);
  }}
  className="w-full bg-primary text-white py-2 mt-4 rounded"
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
              ${vehicleType === v.label && "border-primary"}`}
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
  onClick={() => {
    if (!vehicleType) {
      return toast.error("Please select vehicle type");
    }
    setStep(4);
  }}
  className="col-span-2 bg-primary text-white py-2 rounded"
>
  Next
</button>
        </div>
      )}

      {/* STEP 4: FINAL */}
      {step === 4 && (
  <div className="p-6 space-y-5">

    {/* REGISTRATION */}
    <div>
      <label className="text-sm font-medium text-gray-700">
        Registration Number
      </label>
      <input
        placeholder="TN01AB1234"
        value={reg}
        onChange={(e) => handleRegistrationChange(e.target.value)}
        className="w-full border p-3 rounded mt-1 focus:ring-2 focus:ring-red-400 outline-none"
        maxLength={10}
      />

      {!isValid && reg && (
        <p className="text-primary text-xs mt-1">
          Invalid registration number (e.g. TN01AB1234)
        </p>
      )}
    </div>

    {/* COLOR */}
    <div>
      <label className="text-sm font-medium text-gray-700">
        Select Color
      </label>

      <div className="flex gap-3 mt-2 flex-wrap">
        {COLORS.map((c: any) => (
          <div
            key={c}
            onClick={() => setColor(c)}
            style={{ backgroundColor: c }}
            className={`w-7 h-7 rounded-full border cursor-pointer
            ${color === c && "ring-2 ring-black scale-110"}`}
          />
        ))}
      </div>
    </div>

    {/* FUEL */}
    <div>
      <label className="text-sm font-medium text-gray-700">
        Fuel Type
      </label>

      <div className="flex gap-2 mt-2 flex-wrap">
        {FUELS.map((f) => (
          <button
            key={f}
            onClick={() => setFuelType(f)}
            className={`px-4 py-2 text-sm rounded border transition
            ${
              fuelType === f
                ? "bg-primary text-white border-primary"
                : "bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>

    {/* SAVE BUTTON */}
    <button
      onClick={handleSave}
      className="w-full bg-primary hover:bg-primary text-white py-2 rounded font-medium transition mt-4"
    >
      Save Vehicle
    </button>
  </div>
)}
      <div className="max-w-5xl mx-auto p-4 pb-[100px]"></div>
    </div>
  );
}