"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/config";

interface Task {
  _id: string;
  task_id: string;
  assign_date: string;
  interior?: boolean;
  is_done: boolean;
}

interface Product {
  _id: string;
  name: string;
  category?: string[];
  image: string;
  days: number;
  exterior: string;
  interior: string;
  price: number;
}

interface Vehicle {
  vehicleType: string;
  brand: string;
  model: string;
  registrationNumber: string;
  color: string;
  fuelType: string;
}

interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  email: string;
}

interface Order {
  _id: string;
  totalAmount: number;
  paymentStatus: string;
  delivery: string;
  walletamount: number;
  applycoupon?: string;
  bookingTime: string;
  products: Product[];
  vehicle: Vehicle;
  address: Address;
  tasks: Task[];
}

interface Props {
  orderId: string;
}

const OrderDetailsPage = ({ orderId }: Props) => {


  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<{ task_id: string; assign_date: string }[]>([]);
  const [rescheduleTask, setRescheduleTask] = useState<{ task_id: string } | null>(null);

  /* ---------------- FETCH ORDER ---------------- */
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}api/order/orderGetById/${orderId}`);
      if (res.data?.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      alert("Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  /* ---------------- SELECT TASK ---------------- */
  const handleSelectTask = (taskId: string, assignDate: string) => {
    setSelectedTasks((prev) => {
      const exists = prev.find((t) => t.task_id === taskId);
      if (exists) {
        return prev.filter((t) => t.task_id !== taskId);
      }
      return [...prev, { task_id: taskId, assign_date: assignDate }];
    });
  };

  /* ---------------- UPDATE TASK ---------------- */
  const updateTasks = async () => {
    if (!selectedTasks.length) return alert("Select tasks to update");
    try {
      await axios.put(`${BASE_URL}api/order/taskupdateOrderById/${orderId}`, {
        task_id: selectedTasks.map((t) => t.task_id),
      });
      setModalOpen(false);
      setSelectedTasks([]);
      fetchOrderDetails();
    } catch {
      alert("Task update failed");
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const getServiceInfo = (tasks: Task[] = []) => {
    const completed = tasks.filter((t) => t.is_done).length;
    const remaining = tasks.length - completed;
    return { completed, remaining };
  };

  const isFutureDate = (date: string) => {
    const taskDate = new Date(date);
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return taskDate >= tomorrow;
  };

  /* ---------------- RESCHEDULE ---------------- */
  const rescheduleTaskOrder = async () => {
    if (!rescheduleTask || !selectedTasks.length) return alert("Select a task");

    try {
      await axios.put(`${BASE_URL}api/order/rescheduleTaskOrderById/${orderId}`, {
        old_id: rescheduleTask.task_id,
        task_id: selectedTasks[0].task_id,
        new_date: selectedTasks[0].assign_date,
      });
      setModalOpen(false);
      setRescheduleTask(null);
      setSelectedTasks([]);
      fetchOrderDetails();
    } catch {
      alert("Reschedule failed");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (!order) return <p className="text-center mt-10 text-red-500">Order not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* ORDER INFO */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="font-semibold text-lg mb-3">Order ID: #{order._id.slice(-6)}</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <p>Total Amount: <span className="font-semibold">₹{order.totalAmount}</span></p>
          <p>Payment: <span className="font-semibold">{order.paymentStatus}</span></p>
          <p>Payment Mode: <span className="font-semibold">{order.delivery}</span></p>
          <p>Wallet Used: <span className="font-semibold">₹{order.walletamount}</span></p>
          <p>Coupon: <span className="font-semibold">{order.applycoupon || "N/A"}</span></p>
          <p>Booking Time: <span className="font-semibold">{order.bookingTime}</span></p>
        </div>
      </div>

      {/* SERVICE HISTORY */}
      {(() => {
        const { completed, remaining } = getServiceInfo(order.tasks);
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-green-700">
              Service History: {completed} Completed / {remaining} Remaining
            </p>
          </div>
        );
      })()}

      {/* PRODUCTS */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h3 className="font-semibold mb-4">Products</h3>
        {order.products.map((p) => (
          <div key={p._id} className="flex gap-4 mb-3">
            <img src={p.image} className="w-20 h-20 rounded-lg object-cover" />
            <div className="text-sm">
              <p className="font-semibold">{p.name}</p>
              <p className="text-gray-600">{p.category?.[0]}</p>
              <p>Days: <strong>{p.days}</strong></p>
              <p>Exterior: <strong>{p.exterior}</strong></p>
              <p>Interior: <strong>{p.interior}</strong></p>
              <p className="font-semibold mt-1">₹{p.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ADDRESS */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h3 className="font-semibold mb-3">Address</h3>
        <p className="text-sm font-medium">{order.address.fullName}</p>
        <p className="text-sm">{order.address.street}</p>
        <p className="text-sm">
          {order.address.city}, {order.address.state} - {order.address.pinCode}
        </p>
        <p className="text-sm">📞 {order.address.phone}</p>
        <p className="text-sm">✉️ {order.address.email}</p>
      </div>

      {/* VEHICLE */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h3 className="font-semibold mb-3">Vehicle</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <p>Type: <strong>{order?.vehicle?.vehicleType}</strong></p>
          <p>Brand: <strong>{order?.vehicle?.brand}</strong></p>
          <p>Model: <strong>{order?.vehicle?.model}</strong></p>
          <p>Reg No: <strong>{order?.vehicle?.registrationNumber}</strong></p>
          <p>Color: <strong>{order?.vehicle?.color}</strong></p>
          <p>Fuel: <strong>{order?.vehicle?.fuelType}</strong></p>
        </div>
      </div>

      {/* TASKS */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h3 className="font-semibold mb-4">Tasks</h3>
        {order.tasks.map((task) => {
          const canReschedule = task.interior && isFutureDate(task.assign_date);
          return (
            <div key={task._id} className="border rounded-lg p-4 mb-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{task.is_done ? "✅ Done" : "⏳ Pending"}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(task.assign_date)} • {task.interior ? "Interior Wash" : "Exterior Wash"}
                </p>
              </div>

              {canReschedule && (
                <button
                  onClick={() => {
                    setRescheduleTask(task);
                    setModalOpen(true);
                  }}
                  className="bg-red-500 text-white px-4 py-2 text-xs rounded-lg hover:bg-red-600"
                >
                  Reschedule
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[90%] max-w-md p-6">
            <h3 className="font-semibold mb-4">Select Tasks</h3>
            <div className="max-h-60 overflow-y-auto">
              {order.tasks?.map((task) => (
                <label key={task._id} className="flex items-center gap-2 mb-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedTasks.some((t) => t.task_id === task.task_id)}
                    onChange={() => handleSelectTask(task.task_id, task.assign_date)}
                  />
                  {new Date(task.assign_date).toDateString()}
                </label>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-200 text-sm">
                Close
              </button>
              {rescheduleTask ? (
                <button onClick={rescheduleTaskOrder} className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm">
                  Reschedule
                </button>
              ) : (
                <button onClick={updateTasks} className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm">
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
