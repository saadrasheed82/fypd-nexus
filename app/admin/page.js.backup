"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiGrid, FiUserPlus } from "react-icons/fi";

export default function AdminPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    department: "Computer Science",
  });
  const [loading, setLoading] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/create-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create credentials");
      }

      setCreatedCredentials(data.user);
      toast.success("Credentials created successfully!");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "student",
        department: "Computer Science",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!createdCredentials) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/send-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createdCredentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email");
      }

      toast.success("Credentials sent to email!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!createdCredentials) return;

    const pdfContent = `
FYDP Nexus - Login Credentials
================================

Name: ${createdCredentials.name}
Email: ${createdCredentials.email}
Password: ${createdCredentials.password}
Role: ${createdCredentials.role}

Please keep these credentials safe and change your password after first login.

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([pdfContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `credentials-${createdCredentials.email}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-6 flex gap-4">
          <Link href="/admin/dashboard">
            <button className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-md">
              <FiGrid />
              View Dashboard
            </button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <FiUserPlus className="text-3xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Create User Credentials
            </h1>
          </div>
          <p className="text-gray-600 mb-8">
            Generate login credentials for teachers and students
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter department"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Credentials"}
            </button>
          </form>

          {createdCredentials && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-lg"
            >
              <h2 className="text-xl font-bold text-green-900 mb-4">
                Credentials Created Successfully!
              </h2>
              <div className="space-y-2 mb-6">
                <p className="text-gray-700">
                  <span className="font-semibold">Name:</span>{" "}
                  {createdCredentials.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span>{" "}
                  {createdCredentials.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Password:</span>{" "}
                  <span className="font-mono bg-white px-2 py-1 rounded">
                    {createdCredentials.password}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Role:</span>{" "}
                  {createdCredentials.role}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSendEmail}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Send via Email
                </button>
                <button
                  onClick={downloadPDF}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Download PDF
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
