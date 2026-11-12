import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  _count: {
    orders: number;
  };
}

export default function AdminCustomers() {
  const { user, token } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const data = await api.getAdminCustomers(token, search);
        setCustomers(data.customers);
        setError("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load customers"
        );
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchCustomers, 300);

    return () => clearTimeout(timeout);
  }, [token, search]);

  if (user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f1] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-xs tracking-[0.3em] text-[#a58a52]">
            SHOPSPHERE / ADMINISTRATION
          </p>

          <h1 className="display-font mt-3 text-4xl text-[#25231f]">
            Customer Management
          </h1>

          <p className="mt-2 text-sm text-[#77736b]">
            View and search your registered customers.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 rounded-xl border border-[#e7e1d5] bg-white px-5 py-4">
            <Users className="text-[#a58a52]" />
            <div>
              <p className="text-xs text-[#88837a]">Total customers</p>
              <p className="text-2xl font-semibold text-[#25231f]">
                {customers.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#e7e1d5] bg-white px-4 py-3 sm:w-80">
            <Search size={18} className="text-[#88837a]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e7e1d5] bg-white">
          {loading ? (
            <p className="p-8 text-center text-sm text-[#77736b]">
              Loading customers...
            </p>
          ) : error ? (
            <p className="p-8 text-center text-sm text-red-600">
              {error}
            </p>
          ) : customers.length === 0 ? (
            <p className="p-8 text-center text-sm text-[#77736b]">
              No customers found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f4f1e9] text-xs uppercase tracking-wider text-[#77736b]">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Orders</th>
                    <th className="px-6 py-4">Registered</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer, index) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="border-t border-[#eee9df] text-sm"
                    >
                      <td className="px-6 py-5">
                        <p className="font-medium text-[#25231f]">
                          {customer.name}
                        </p>
                        <p className="mt-1 text-xs text-[#88837a]">
                          {customer.email}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-[#77736b]">
                        {customer.phone || "—"}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#f4f1e9] px-3 py-1 text-xs font-medium">
                          {customer._count.orders}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-[#77736b]">
                        {new Date(customer.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

