"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { BASE_URL } from "@/utils/config";
import { Trash2, Car } from "lucide-react";

// ----------------- DATA -----------------
const vehicleData: Record<string, string[]> = {
  Audi: ["A3", "A4", "A6", "e-tron", "Q2", "Q3", "Q5", "Q7", "Q8", "RS / S"],
  BMW: ["3 Series", "5 Series", "7 Series", "i4", "iX", "X1", "X3", "X5", "X7", "Z4"],
  Honda: ["Amaze", "City", "Elevate", "Jazz"],
  Hyundai: ["Alcazar", "Aura", "Creta / Creta N Line", "Exter", "i10 / Grand i10 Nios", "i20 / i20 N Line", "Ioniq 5", "Prime HB", "Prime SD", "Tucson", "Venue / Venue N Line", "Verna"],
  Kia: ["Carens", "Carnival", "Seltos", "Sonet", "Syros"],
  Mahindra: ["BE 6", "Bolero / Bolero Neo", "Scorpio N / Scorpio Classic", "Thar / Thar Roxx", "XEV 4e", "XEV 9e", "XUV3XO", "XUV700 / XUV7XO"],
  "Maruti Suzuki": ["Alto 800 / Alto K10", "Baleno", "Brezza", "Celerio", "Ciaz", "Dzire", "Eeco", "Ertiga", "Fronx", "Grand Vitara", "Ignis", "Invicto", "Jimny", "S-Presso", "Swift", "Victoris", "Wagon R", "XL6"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "EQB", "EQS", "GLA", "GLB", "GLC", "GLE", "GLS", "S-Class"],
  "MG Motor": ["Astor", "Comet EV", "Gloster", "Hector", "Hector Plus", "ZS EV"],
  Nissan: ["Gravite", "Kicks", "Magnite", "Tekton"],
  "Range Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport", "Range Rover Velar"],
  Renault: ["Bigster", "Duster", "Kwid", "Triber"],
  Skoda: ["Kodiaq", "Kushaq", "Octavia / Octavia RS", "Slavia", "Superb"],
  "Tata Motors": ["Altroz", "Avinya / Avinya X", "Curvv", "Harrier", "Nexon", "Punch", "Safari", "Sierra", "Tiago", "Tiago NRG", "Tigor"],
  Toyota: ["Camry", "Corolla", "Fortuner", "Glanza", "Hilux", "Innova", "Innova Hycross", "Land Cruiser", "Prado", "Urban Cruiser / Urban Cruiser Hyryder"],
  Volkswagen: ["Polo", "Taigun", "Tiguan / Tiguan Allspace", "Vento", "Virtus"]
};

const VEHICLE_TYPES = ["Sedan", "SUV", "Hatchback", "Coupe", "Van"];
const COLORS = ["White", "Black", "Red", "Blue", "Grey", "Silver"];
const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric"];

interface Vehicle {
  _id?: string;
  vehicleType: string;
  brand: string;
  model: string;
  color: string;
  fuelType: string;
  registrationNumber: string;
}

// ----------------- COMPONENT -----------------
export default function VehicleManagementPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleType, setVehicleType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const brands = Object.keys(vehicleData);
  const modelsByBrand = brand ? vehicleData[brand] ?? [] : [];

  const API_BASE = BASE_URL;

  // ----------------- FETCH VEHICLES -----------------
  const fetchVehicles = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE}api/vehicles/getvehicle/${userId}`);
      setVehicles(res.data?.vehicles || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // ----------------- RESET FORM -----------------
  const resetForm = () => {
    setVehicleType("");
    setBrand("");
    setModel("");
    setColor("");
    setFuelType("");
    setRegistrationNumber("");
    setEditingId(null);
  };

  // ----------------- SAVE / UPDATE VEHICLE -----------------
  const handleSave = async () => {
    if (!vehicleType || !brand || !model || !color || !fuelType || !registrationNumber) {
      alert("Please fill all fields");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const payload = { userId, vehicleType, brand, model, color, fuelType, registrationNumber };

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`${API_BASE}api/vehicles/vehicle/${editingId}`, payload);
      } else {
        await axios.post(`${API_BASE}api/vehicles/createvehicle`, payload);
      }
      fetchVehicles();
      resetForm();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (v: Vehicle) => {
    setVehicleType(v.vehicleType);
    setBrand(v.brand);
    setModel(v.model);
    setColor(v.color);
    setFuelType(v.fuelType);
    setRegistrationNumber(v.registrationNumber);
    setEditingId(v._id || null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await axios.delete(`${API_BASE}api/vehicles/vehicle/${id}`);
      fetchVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Car /> Manage Vehicles
        </h1>
        <Button onClick={() => { resetForm(); setModalOpen(true); }}>+ Add Vehicle</Button>
      </div>

      {/* VEHICLE LIST */}
      {vehicles.length === 0 ? (
        <p className="text-gray-500">No vehicles added yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vehicles.map((v) => (
            <Card key={v._id} className="p-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Car /> {v.brand} {v.model}
              </h3>
              <p>Reg: {v.registrationNumber}</p>
              <p>{v.vehicleType} | {v.fuelType} | {v.color}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Button onClick={() => handleEdit(v)} size="sm" variant="outline" className="flex-1 sm:flex-none">
                  Edit
                </Button>
                {/* <Button onClick={() => handleDelete(v._id!)} size="sm" variant="destructive" className="flex-1 sm:flex-none">
                  <Trash2 /> Delete
                </Button> */}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 sm:p-6 overflow-auto">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Vehicle" : "Add Vehicle"}</h2>

            {/* Vehicle Type */}
            <Select value={vehicleType} onValueChange={(v) => { setVehicleType(v); setBrand(""); setModel(""); }}>
              <SelectTrigger><SelectValue placeholder="Select Vehicle Type" /></SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Brand */}
            <Select value={brand} onValueChange={(v) => { setBrand(v); setModel(""); }} >
              <SelectTrigger><SelectValue placeholder="Select Brand" /></SelectTrigger>
              <SelectContent>
                {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Model */}
            <Select value={model} onValueChange={setModel}  disabled={!brand}>
              <SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger>
              <SelectContent>
                {modelsByBrand.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Color */}
            <Select value={color} onValueChange={setColor} >
              <SelectTrigger><SelectValue placeholder="Select Color" /></SelectTrigger>
              <SelectContent>
                {COLORS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Fuel Type */}
            <Select value={fuelType} onValueChange={setFuelType} >
              <SelectTrigger><SelectValue placeholder="Select Fuel Type" /></SelectTrigger>
              <SelectContent>
                {FUEL_TYPES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>

            <Input
              placeholder="Registration Number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
              className="mt-2"
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button onClick={handleSave} className="flex-1">{editingId ? "Update Vehicle" : "Add Vehicle"}</Button>
              <Button onClick={() => setModalOpen(false)} variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
