
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface AdminOrder {
  id: number;
  orderNumber: string;
  status: string;
  total: string | number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  payment: {
    status: string;
    amount: string | number;
  } | null;
}

const statuses = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export default function AdminOrders() {
  const { user, token } = useAuth();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    if (!token || user?.role !== 'ADMIN') {
      setError('Administrator access is required.');
      setLoading(false);
      return;
    }

    try {
      setError('');
      const data = await api.getAdminOrders(token);
      setOrders(data.orders);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load orders.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token, user]);

  const handleStatusChange = async (
    orderId: number,
    status: string
  ) => {
    if (!token) return;

    try {
      setUpdatingId(orderId);
      setError('');

      await api.updateOrderStatus(orderId, status, token);

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update order status.'
      );
      await loadOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders =
    filter === 'ALL'
      ? orders
      : orders.filter((order) => order.status === filter);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <RefreshCw className="animate-spin" size={26} />
        <span className="ml-3">Loading orders...</span>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <p className="mb-5 text-red-600">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              loadOrders();
            }}
            className="border border-black px-6 py-3 text-sm"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] px-5 py-12 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-center gap-3">
  <a
    href="/admin"
    className="border border-[#e8e5dd] bg-white px-6 py-3 text-xs tracking-widest text-[#252525] transition-colors hover:border-[#a58a5c] hover:bg-[#a58a5c] hover:text-white"
  >
    DASHBOARD
  </a>

  <a
    href="/admin/orders"
    className="border border-[#a58a5c] bg-[#a58a5c] px-6 py-3 text-xs tracking-widest text-white"
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

        <div className="mb-10">
          <p className="mb-3 text-xs tracking-[0.3em] text-[#9a8052]">
            SHOPSPHERE / ADMINISTRATION
          </p>

          <h1 className="display-font text-4xl md:text-5xl">
            Order Management
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Review customer orders and manage their fulfillment.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Package size={19} />

          <span className="text-sm text-gray-500">
            {orders.length} total orders
          </span>

          <div className="ml-auto">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="border border-[#e8e5dd] bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="ALL">All Orders</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="mb-5 text-sm text-red-600">{error}</p>
        )}

        <section className="border border-[#e8e5dd] bg-white">
          {filteredOrders.length === 0 ? (
            <p className="p-10 text-center text-sm text-gray-500">
              No orders found for this filter.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-[#f7f6f2] text-xs tracking-widest text-gray-500">
                  <tr>
                    <th className="px-6 py-5">ORDER</th>
                    <th className="px-6 py-5">CUSTOMER</th>
                    <th className="px-6 py-5">DATE</th>
                    <th className="px-6 py-5">TOTAL</th>
                    <th className="px-6 py-5">PAYMENT</th>
                    <th className="px-6 py-5">STATUS</th>
                    <th className="px-6 py-5">UPDATE</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
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

                      <td className="px-6 py-5">
                        <select
                          value={order.status}
                          disabled={
                            updatingId === order.id ||
                            order.status === 'DELIVERED' ||
                            order.status === 'CANCELLED'
                          }
                          onChange={(event) =>
                            handleStatusChange(order.id, event.target.value)
                          }
                          className="border border-[#e8e5dd] bg-white px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        {updatingId === order.id && (
                          <span className="ml-2 text-xs text-gray-400">
                            Saving...
                          </span>
                        )}
                      </td>
                    </motion.tr>
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
