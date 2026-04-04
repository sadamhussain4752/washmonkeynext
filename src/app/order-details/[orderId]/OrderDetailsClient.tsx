"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/app/utils/config";

/* ================= TYPES ================= */

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

/* ================= COMPONENT ================= */

const OrderDetailsPage = ({ orderId }: Props) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<
    { task_id: string; assign_date: string }[]
  >([]);
  const [rescheduleTask, setRescheduleTask] = useState<{ task_id: string } | null>(null);
  const [showAllTasks, setShowAllTasks] = useState(false);

  /* ================= FETCH ================= */

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}api/order/orderGetById/${orderId}`
      );
      if (res.data?.success) setOrder(res.data.order);
    } catch {
      alert("Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  /* ================= HELPERS ================= */

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getServiceInfo = (tasks: Task[] = []) => {
    const completed = tasks.filter((t) => t.is_done).length;
    return { completed, total: tasks.length };
  };

  const isFutureDate = (date: string) => {
    const taskDate = new Date(date);
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return taskDate >= tomorrow;
  };

  const getTaskStatus = (task: Task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(task.assign_date);
    taskDate.setHours(0, 0, 0, 0);

    if (task.is_done) return "Completed";
    if (taskDate.getTime() === today.getTime()) return "Processing";
    if (taskDate > today) return "Pending";
    return "Expired";
  };

  /* ================= TASK ACTIONS ================= */

  const handleSelectTask = (taskId: string, assignDate: string) => {
    setSelectedTasks((prev) => {
      const exists = prev.find((t) => t.task_id === taskId);
      if (exists) return prev.filter((t) => t.task_id !== taskId);
      return [...prev, { task_id: taskId, assign_date: assignDate }];
    });
  };

  const updateTasks = async () => {
    if (!selectedTasks.length) return alert("Select tasks");

    await axios.put(
      `${BASE_URL}api/order/taskupdateOrderById/${orderId}`,
      { task_id: selectedTasks.map((t) => t.task_id) }
    );

    setModalOpen(false);
    setSelectedTasks([]);
    fetchOrderDetails();
  };

  const rescheduleTaskOrder = async () => {
    if (!rescheduleTask || !selectedTasks.length) return;

    await axios.put(
      `${BASE_URL}api/order/rescheduleTaskOrderById/${orderId}`,
      {
        old_id: rescheduleTask.task_id,
        task_id: selectedTasks[0].task_id,
        new_date: selectedTasks[0].assign_date,
      }
    );

    setModalOpen(false);
    setRescheduleTask(null);
    setSelectedTasks([]);
    fetchOrderDetails();
  };

  /* ================= UI ================= */

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (!order)
    return <p className="text-center mt-10 text-red-500">Order not found</p>;

  const service = getServiceInfo(order.tasks);

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen p-3">

      {/* ORDER CARD */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border mb-4 text-sm">
        <div className="flex justify-between mb-1">
          <p className="text-xs text-gray-500">
            {formatDate(order.bookingTime)}
          </p>
          <p className="font-semibold">₹{order.totalAmount}</p>
        </div>

        <div className="flex justify-between mb-2">
          <p className="text-xs text-gray-500">
            Order ID: #{order._id.slice(-6)}
          </p>
          <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded">
            {order.paymentStatus}
          </span>
        </div>

        <div className="border-t pt-2 mt-2 text-xs space-y-1">
          <p>
            {order.vehicle.vehicleType}
            <span className="float-right">1 x ₹{order.totalAmount}</span>
          </p>
          <p>
            Booking Time
            <span className="float-right">{order.bookingTime}</span>
          </p>
          <p>
            Payment Type
            <span className="float-right">{order.delivery}</span>
          </p>
          <p>
            Service History
            <span className="float-right">
              {service.completed}/{service.total} Days
            </span>
          </p>
          <p>
            Vehicle
            <span className="float-right">
              {order.vehicle.brand} {order.vehicle.model}
            </span>
          </p>
        </div>
      </div>

      {/* TASKS */}
      <div className="space-y-3">
        {(showAllTasks ? order.tasks : order.tasks.slice(0, 4)).map((task) => {
          const status = getTaskStatus(task);

          return (
            <div
              key={task._id}
              className={`rounded-xl p-3 border text-xs ${
                status === "Processing"
                  ? "bg-green-50 border-green-500"
                  : "bg-white"
              }`}
            >
              <div className="flex justify-between">
                <p>
                  {status} - {formatDate(task.assign_date)}
                </p>

                <span className="text-[10px] px-2 py-1 bg-gray-100 rounded">
                  {task.interior ? "Interior" : "Exterior"}
                </span>
              </div>

              <p className="text-gray-400 mt-1 text-[10px]">
                Assigned to: N/A
              </p>

              {task.interior && isFutureDate(task.assign_date) && (
                <div className="text-right mt-2">
                  <button
                    onClick={() => {
                      setRescheduleTask(task);
                      setModalOpen(true);
                    }}
                    className="bg-red-500 text-white text-[10px] px-3 py-1 rounded-full"
                  >
                    Reschedule
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* VIEW MORE */}
        {order.tasks.length > 4 && (
          <div className="text-right">
            <button
              onClick={() => setShowAllTasks(!showAllTasks)}
              className="text-red-500 text-xs"
            >
              {showAllTasks ? "View Less" : "View More"}
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-xl w-[90%] max-w-sm">
            <h3 className="font-semibold mb-3 text-sm">Select Task</h3>

            <div className="max-h-60 overflow-y-auto">
              {order.tasks.map((task) => (
                <label key={task._id} className="flex gap-2 text-xs mb-2">
                  <input
                    type="checkbox"
                    checked={selectedTasks.some(
                      (t) => t.task_id === task.task_id
                    )}
                    onChange={() =>
                      handleSelectTask(task.task_id, task.assign_date)
                    }
                  />
                  {formatDate(task.assign_date)}
                </label>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-200 px-3 py-1 text-xs rounded"
              >
                Close
              </button>

              {rescheduleTask ? (
                <button
                  onClick={rescheduleTaskOrder}
                  className="bg-red-500 text-white px-3 py-1 text-xs rounded"
                >
                  Confirm
                </button>
              ) : (
                <button
                  onClick={updateTasks}
                  className="bg-blue-500 text-white px-3 py-1 text-xs rounded"
                >
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="p-3 border-t mb-[50px]"></div>
    </div>

  );
};

export default OrderDetailsPage;