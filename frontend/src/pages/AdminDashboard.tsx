
import { useEffect, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  Clock3,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
const SalesChart = lazy(() => import('../components/SalesChart'));



interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
}

interface SalesTrend {
  date: string;
  revenue: number;
}

interface RecentOrder {
  id: number;
  orderNumber: string;
  status: string;
  total: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  payment: {
    status: string;
    amount: string;
  } | null;
}

export default function AdminDashboard() {
  const { user, token } = useAuth();

  const [overview, setOverview] = useState<DashboardData | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [salesTrend, setSalesTrend] = useState<SalesTrend[]>([]);


  useEffect(() => {
    const loadDashboard = async () => {
      if (!token || user?.role !== 'ADMIN') {
        setError('Administrator access is required.');
        setLoading(false);
        return;
      }

      try {
        const data = await api.getAdminDashboard(token);
        setOverview(data.overview);
        setRecentOrders(data.recentOrders);
        setSalesTrend(data.salesTrend);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load dashboard.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token, user]);

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${Number(overview?.totalRevenue ?? 0).toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'bg-[#eee8dc]',
    },
    {
      label: 'Total Orders',
      value: overview?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: 'bg-[#e8ece5]',
    },
    {
      label: 'Customers',
      value: overview?.totalCustomers ?? 0,
      icon: Users,
      color: 'bg-[#eee7e8]',
    },
    {
      label: 'Active Products',
      value: overview?.totalProducts ?? 0,
      icon: Package,
      color: 'bg-[#e8e9ef]',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="animate-spin" size={28} />
        <span className="ml-3">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="border border-black px-6 py-3 text-sm"
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] px-5 py-12 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center gap-3">
  <a
    href="/admin"
    className="border border-[#a58a5c] bg-[#a58a5c] px-6 py-3 text-xs tracking-widest text-white transition-colors hover:bg-[#8e744b]"
  >
    DASHBOARD
  </a>

  <a
    href="/admin/orders"
    className="border border-[#e8e5dd] bg-white px-6 py-3 text-xs tracking-widest text-[#252525] transition-colors hover:border-[#a58a5c] hover:text-white"
  >
    MANAGE ORDERS
  </a>

  <a
  href="/admin/products"
  className="border border-[#e8e5dd] bg-white px-6 py-3 text-xs tracking-widest text-[#252525] transition-colors hover:border-[#a58a5c] hover:bg-[#a58a5c] hover:text-white"
>
  MANAGE PRODUCTS
</a>

  <a
  href="/admin/customers"
  className="border border-[#e8e5dd] bg-white px-6 py-3 text-xs tracking-widest text-[#252525] transition-colors hover:border-[#a58a5c] hover:bg-[#a58a5c] hover:text-white"
>
  MANAGE CUSTOMERS
</a>

</div>

        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs tracking-[0.3em] text-[#9a8052]">
              SHOPSPHERE / ADMINISTRATION
            </p>
            <h1 className="display-font text-4xl md:text-5xl">
              Dashboard Overview
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              Welcome back, {user?.name}. Here's your store performance.
            </p>
          </div>

          <div className="text-xs tracking-widest text-gray-500">
            LIVE STORE OVERVIEW
          </div>
        </div>

        <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-[#e8e5dd] bg-white p-6"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-xs tracking-widest text-gray-500">
                    {stat.label.toUpperCase()}
                  </span>
                  <div className={`rounded-full p-3 ${stat.color}`}>
                    <Icon size={19} />
                  </div>
                </div>

                <p className="display-font text-3xl">
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mb-10 border border-[#e8e5dd] bg-white p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Clock3 size={20} />
            <h2 className="display-font text-2xl">
              Orders Awaiting Processing
            </h2>
          </div>
          <p className="mt-4 display-font text-4xl">
            {overview?.pendingOrders ?? 0}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Orders currently in pending status
          </p>
        </div>


<div className="mb-10 border border-[#e8e5dd] bg-white p-6 md:p-8">
  <div className="mb-8">
    <p className="mb-2 text-xs tracking-[0.25em] text-[#9a8052]">
      REVENUE PERFORMANCE
    </p>
    <h2 className="display-font text-2xl">
      Seven-Day Sales Trend
    </h2>
    <p className="mt-2 text-sm text-gray-500">
      Daily revenue from successfully completed payments
    </p>
  </div>

<Suspense
  fallback={
    <div className="flex h-[320px] items-center justify-center text-sm text-[#a58a5c]">
      Loading sales chart...
    </div>
  }
>
  <SalesChart data={salesTrend} />
</Suspense>

  {salesTrend.length === 0 && (
    <p className="mt-3 text-center text-sm text-gray-400">
      No completed sales recorded in the last seven days.
    </p>
  )}
</div>


        

        <section className="border border-[#e8e5dd] bg-white">
          <div className="border-b border-[#e8e5dd] px-6 py-6 md:px-8">
            <p className="mb-2 text-xs tracking-[0.25em] text-[#9a8052]">
              STORE ACTIVITY
            </p>
            <h2 className="display-font text-2xl">
              Recent Orders
            </h2>
          </div>

          {recentOrders.length === 0 ? (
            <p className="p-8 text-sm text-gray-500">
              No orders found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-[#f7f6f2] text-xs tracking-widest text-gray-500">
                  <tr>
                    <th className="px-6 py-4">ORDER</th>
                    <th className="px-6 py-4">CUSTOMER</th>
                    <th className="px-6 py-4">DATE</th>
                    <th className="px-6 py-4">TOTAL</th>
                    <th className="px-6 py-4">PAYMENT</th>
                    <th className="px-6 py-4">STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-[#eeeae2] text-sm"
                    >
                      <td className="px-6 py-5 font-medium">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-5">
                        <p>{order.user.name}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {order.user.email}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-5">
                        ₹{Number(order.total).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-5">
                        {order.payment?.status ?? 'N/A'}
                      </td>
                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#eee8dc] px-3 py-1 text-xs">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
