export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  offerPrice?: number;
  image: string;
  features: string[];
  isNew?: boolean;
  isHot?: boolean;
  vehicleType: string;
}

export interface ServicePlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  image: string;
  popular?: boolean;
}

export const servicePlans: ServicePlan[] = [
  {
    id: "daily",
    name: "Daily Care",
    description: "Essential cleaning for everyday maintenance",
    price: 299,
    features: [
      "Exterior wash & wax",
      "Tire cleaning",
      "Quick interior vacuum",
      "Dashboard cleaning"
    ],
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500&h=300&fit=crop",
  },
  {
    id: "premium",
    name: "Premium Shine",
    description: "Comprehensive cleaning with premium products",
    price: 599,
    features: [
      "Deep exterior wash & wax",
      "Tire & wheel detailing",
      "Complete interior vacuum",
      "Dashboard & upholstery cleaning",
      "Window cleaning (inside & out)",
      "Air freshener"
    ],
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500&h=300&fit=crop",
    popular: true
  },
  {
    id: "royal",
    name: "Royal Treatment",
    description: "Ultimate premium service with eco-friendly products",
    price: 999,
    features: [
      "Premium exterior wash & ceramic coating",
      "Professional wheel & tire detailing",
      "Deep interior shampooing",
      "Leather conditioning",
      "Complete glass treatment",
      "Engine bay cleaning",
      "Premium air purification",
      "Complimentary air freshener"
    ],
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500&h=300&fit=crop",
  }
];

export const products: Product[] = [
  {
    id: "hatchback-basic",
    name: "Hatchback Basic Wash",
    category: "Basic Wash",
    description: "Quick and efficient wash for your hatchback",
    price: 299,
    offerPrice: 249,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop",
    features: ["Exterior wash", "Tire cleaning", "Quick vacuum"],
    isNew: true,
    vehicleType: "Hatchback"
  },
  {
    id: "sedan-premium",
    name: "Sedan Premium Service",
    category: "Premium",
    description: "Complete care package for sedans",
    price: 599,
    offerPrice: 499,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&h=300&fit=crop",
    features: ["Deep wash", "Interior detailing", "Polish & wax", "Tire shine"],
    isHot: true,
    vehicleType: "Sedan"
  },
  {
    id: "suv-royal",
    name: "SUV Royal Treatment",
    category: "Royal",
    description: "Ultimate premium service for your SUV",
    price: 999,
    offerPrice: 849,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500&h=300&fit=crop",
    features: ["Ceramic coating", "Full interior shampooing", "Engine cleaning", "Premium wax"],
    isHot: true,
    vehicleType: "SUV"
  },
  {
    id: "hatchback-premium",
    name: "Hatchback Premium",
    category: "Premium",
    description: "Premium cleaning for compact cars",
    price: 549,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=300&fit=crop",
    features: ["Full exterior wash", "Interior vacuum", "Dashboard polish"],
    vehicleType: "Hatchback"
  },
  {
    id: "sedan-basic",
    name: "Sedan Basic Clean",
    category: "Basic Wash",
    description: "Essential cleaning for your sedan",
    price: 349,
    offerPrice: 299,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop",
    features: ["Exterior wash", "Tire cleaning", "Interior wipe"],
    isNew: true,
    vehicleType: "Sedan"
  },
  {
    id: "suv-basic",
    name: "SUV Basic Service",
    category: "Basic Wash",
    description: "Quick clean for large vehicles",
    price: 449,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop",
    features: ["Exterior wash", "Wheel cleaning", "Basic vacuum"],
    vehicleType: "SUV"
  }
];

export const vehicleTypes = ["All", "Hatchback", "Sedan", "SUV"];
export const categories = ["All", "Basic Wash", "Premium", "Royal"];
export const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under ₹300", min: 0, max: 300 },
  { label: "₹300 - ₹600", min: 300, max: 600 },
  { label: "Above ₹600", min: 600, max: Infinity }
];
