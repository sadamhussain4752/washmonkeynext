"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/app/utils/config";
import {
  User,
  Car,
  MapPin,
  Package,
  Wallet,
  Image as ImageIcon,
  FileText,
  Share2,
  Star,
  HelpCircle,
  LogOut,
  Trash2,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  XOctagon
} from "lucide-react";


/* ================= NAV CONFIG ================= */

type NavItem = {
  label: string;
  icon: React.ReactNode;
  route?: string;
  url?: string;
  action?: "share" | "rate" | "logout" | "delete" | 'profile';
};

const navItems: NavItem[] = [
  { label: "Profile", icon: <User size={20} />, action: "profile" },
  { label: "Vehicles", icon: <Car size={20} />, route: "/vehicles" },
  { label: "Addresses", icon: <MapPin size={20} />, route: "/addresses" },
  { label: "Orders", icon: <Package size={20} />, route: "/orders" },
  { label: "Transaction History", icon: <Wallet size={20} />, route: "/wallet" },
//   { label: "Gallery", icon: <ImageIcon size={20} />, route: "/gallery" },
  {
    label: "T & C",
    icon: <FileText size={20} />,
    url: "https://washmonkey.in/terms-and-conditions",
  },
  { label: "Share App", icon: <Share2 size={20} />, action: "share" },
  { label: "Rate Our App", icon: <Star size={20} />, action: "rate" },
  { label: "Help & Support", icon: <HelpCircle size={20} />, route: "/help" },
  { label: "Logout", icon: <LogOut size={20} />, action: "logout" },
  {
    label: "Delete Account",
    icon: <Trash2 size={20} className="text-red-600" />,
    action: "delete",
  },
];

function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md rounded-2xl p-5 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        {children}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function NavCard({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition flex items-center gap-3"
    >
      <span className="text-red-600">{icon}</span>
      <span className="font-semibold text-gray-800">{label}</span>
    </div>
  );
}


function RenderSocialMediaCards() {
  const socialMedia = [
    {
      label: "Facebook",
      url: "https://www.facebook.com/share/1Gb5WahkWp/",
      icon: <Facebook size={22} />,
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com",
      icon: <Linkedin size={22} />,
    },
    // {
    //   label: "Twitter / X",
    //   url: "https://www.twitter.com",
    //   icon: <Twitter size={22} />,
    // },
    {
      label: "Instagram",
      url: "https://www.instagram.com/washmonkey.in?utm_source=qr&igsh=MW96emEyeWNjcGNmNA==",
      icon: <Instagram size={22} />,
    },
    {
      label: "YouTube",
      url: "https://www.youtube.com",
      icon: <Youtube size={22} />,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="text-gray-800 font-semibold mb-4 text-sm">
        Follow Us
      </h3>

      <div className="flex flex-wrap items-center justify-between gap-6">
        {socialMedia.map((item, index) => (
          <button
            key={index}
            onClick={() => window.open(item.url, "_blank")}
            className="flex flex-col items-center gap-2 hover:scale-105 transition"
          >
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              {item.icon}
            </div>
            <span className="text-[11px] text-gray-700 text-center">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}


/* ================= PAGE ================= */

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState({
  firstname: "",
  lastname: "",
  email: "",
  mobilenumber: "",
});
const [imageFile, setImageFile] = useState<File | null>(null);
const [preview, setPreview] = useState<string | null>(null);
const [editModalOpen, setEditModalOpen] = useState(false);
  /* ---------- Read localStorage ---------- */
  useEffect(() => {
    const uid = localStorage.getItem("userId");
    const tok = localStorage.getItem("token");

    if (!uid) {
      router.push("/login");
      return;
    }

    setUserId(uid);
    setToken(tok);
  }, [router]);

  /* ---------- Fetch Profile ---------- */
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}api/user/userGetById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(res.data?.User);
        setUser(res.data?.User);

setFormData({
  firstname: res.data?.User?.firstname || "",
  lastname: res.data?.User?.lastname || "",
  email: res.data?.User?.email || "",
  mobilenumber: res.data?.User?.mobilenumber || "",
});
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  /* ---------- Nav Actions ---------- */
  const handleNavClick = (item: NavItem) => {
    if (item.url) {
      window.open(item.url, "_blank");
      return;
    }

    if (item.action === "share") {
      if (navigator.share) {
        navigator.share({
          title: "Wash Monkey",
          text: "Check out Wash Monkey app",
          url: "https://play.google.com/store/apps/details?id=com.washmonkey",
        });
      } else {
        alert("Sharing not supported on this device");
      }
      return;
    }

    if (item.action === "rate") {
      window.open(
        "https://play.google.com/store/apps/details?id=com.washmonkey",
        "_blank"
      );
      return;
    }
if (item.action === "profile") {
     setEditModalOpen(true)
      return;
    }

    if (item.action === "logout") {
      localStorage.clear();
      router.push("/login");
      return;
    }

    if (item.action === "delete") {
      if (confirm("Are you sure you want to delete your account?")) {
        router.push("/delete-account");
      }
      return;
    }

    if (item.route) {
      router.push(item.route);
    }
  };


  const handleChange = (e: any) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleImageChange = (e: any) => {
  const file = e.target.files[0];
  if (file) {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }
};

const handleUpdate = async () => {
  try {
    const form = new FormData();

    form.append("firstName", formData.firstname);
    form.append("lastName", formData.lastname);
    form.append("email", formData.email);
    form.append("mobilenumber", formData.mobilenumber);

    if (imageFile) {
      form.append("file", imageFile); // ✅ MUST MATCH MULTER
    }

    const res = await axios.post(
      `${BASE_URL}api/user/UserImage/${userId}`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res?.data?.success) {
      setUser(res.data.user);
      setIsEditing(false);
      setPreview(null);
      alert("Profile updated successfully");
    } else {
      alert("Update failed");
    }
  } catch (err: any) {
    console.error("Upload error:", err?.response?.data || err.message);
  }
};
  if (loading) {
    return <div className="py-20 text-center">Loading profile...</div>;
  }

  /* ================= UI ================= */

  return (
   <>
  <div className="min-h-screen bg-gray-100">

    {/* ================= DESKTOP UI ================= */}
    <div className="hidden md:block">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-red-600 to-red-500">
        <div className="max-w-7xl mx-auto px-6 py-12 flex items-center gap-6 text-white">
          <img
            src={user?.profile_img || "/avatar.png"}
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold">
              {user?.firstname} {user?.lastname}
            </h1>
            <p className="text-sm opacity-90">{user?.email}</p>
            <p className="text-sm opacity-90">{user?.mobilenumber}</p>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {navItems.map((item, index) => (
          <NavCard
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={() => handleNavClick(item)}
          />
        ))}
      </div>

      {/* SOCIAL */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <RenderSocialMediaCards />
      </div>
    </div>

    {/* ================= MOBILE UI ================= */}
    <div className="block md:hidden max-w-md mx-auto p-4 space-y-4 pb-24">

      {/* PROFILE CARD */}
      <div className="bg-white rounded-2xl p-5 shadow-sm text-center relative">

  <div className="relative w-20 h-20 mx-auto mb-3">
    <img
      src={preview || user?.profile_img || "/avatar.png"}
      className="w-20 h-20 rounded-full object-cover"
    />

    {isEditing && (
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    )}
  </div>

  {isEditing ? (
    <>
      <input
        name="firstname"
        value={formData.firstname}
        onChange={handleChange}
        placeholder="First Name"
        className="border p-2 rounded w-full mb-2"
      />

      <input
        name="lastname"
        value={formData.lastname}
        onChange={handleChange}
        placeholder="Last Name"
        className="border p-2 rounded w-full mb-2"
      />

      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 rounded w-full mb-2"
      />

      <input
        name="mobilenumber"
        value={formData.mobilenumber}
        onChange={handleChange}
        placeholder="Mobile"
        className="border p-2 rounded w-full mb-2"
      />

      <button
        onClick={handleUpdate}
        className="bg-red-600 text-white px-4 py-2 rounded mt-2"
      >
        Save
      </button>
    </>
  ) : (
    <>
      <h2 className="font-semibold text-lg text-gray-800">
        {user?.firstname} {user?.lastname}
      </h2>
      <p className="text-sm text-gray-500">{user?.email}</p>
    </>
  )}

 <button
  onClick={() => setEditModalOpen(true)}
  className="absolute right-4 top-4 text-red-600 text-xs font-medium"
>
  Edit
</button>
</div>

      {/* SETTINGS LIST */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {navItems.map((item, i) => (
          <div
            key={i}
            onClick={() => handleNavClick(item)}
            className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-600">{item.icon}</span>
              <span className="text-sm font-medium text-gray-800">
                {item.label}
              </span>
            </div>

            <span className="text-gray-400 text-sm">›</span>
          </div>
        ))}
      </div>

      {/* SOCIAL */}
      <RenderSocialMediaCards />

    </div>
  </div>
  <Modal
  open={editModalOpen}
  title="Edit Profile"
  onClose={() => setEditModalOpen(false)}
>
  <div className="space-y-3">

    {/* IMAGE */}
    <div className="flex flex-col items-center">
      <img
        src={preview || user?.profile_img || "/avatar.png"}
        className="w-20 h-20 rounded-full object-cover mb-2"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="text-xs"

      />
    </div>

    {/* FIRST NAME */}
    <input
      name="firstname"
      value={formData.firstname}
      onChange={handleChange}
      placeholder="First Name"
      className="border p-2 rounded w-full"
    />

    {/* LAST NAME */}
    <input
      name="lastname"
      value={formData.lastname}
      onChange={handleChange}
      placeholder="Last Name"
      className="border p-2 rounded w-full"
    />

    {/* EMAIL */}
    <input
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Email"
      className="border p-2 rounded w-full"
      disabled
    />

    {/* MOBILE */}
    <input
      name="mobilenumber"
      value={formData.mobilenumber}
      onChange={handleChange}
      placeholder="Mobile"
      className="border p-2 rounded w-full"
      disabled
    />

    {/* ACTIONS */}
    <div className="flex gap-2 pt-2">
      <button
        onClick={() => setEditModalOpen(false)}
        className="flex-1 bg-gray-200 py-2 rounded"
      >
        Cancel
      </button>

      <button
        onClick={async () => {
          await handleUpdate();
          setEditModalOpen(false);
        }}
        className="flex-1 bg-red-600 text-white py-2 rounded"
      >
        Save
      </button>
    </div>
  </div>
</Modal>
</>
    
  );
}
