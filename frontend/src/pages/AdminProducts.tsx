import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  originalPrice: string | number | null;
  sku: string;
  stock: number;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  category: {
    id: number;
    name: string;
  };
}

interface AdminCategory {
  id: number;
  name: string;
}


export default function AdminProducts() {
  const { user, token } = useAuth();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showForm, setShowForm] = useState(false);
const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
const [saving, setSaving] = useState(false);
const [uploadingImage, setUploadingImage] = useState(false);



const [formData, setFormData] = useState({
  name: '',
  slug: '',
  description: '',
  price: '',
  originalPrice: '',
  sku: '',
  stock: '0',
  imageUrl: '',
  categoryId: '',
  isFeatured: false,
});




  const loadProducts = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await api.getAdminProducts(token);
      setProducts(data.products);
      const categoryData = await api.getCategories();
      setCategories(categoryData.categories);
      setError('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load products'
      );
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
  setEditingProduct(null);

  setFormData({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    sku: '',
    stock: '0',
    imageUrl: '',
    categoryId: '',
    isFeatured: false,
  });

  setShowForm(true);
};

const openEditForm = (product: AdminProduct) => {
  setEditingProduct(product);

  setFormData({
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: String(product.price),
    originalPrice: product.originalPrice
      ? String(product.originalPrice)
      : '',
    sku: product.sku,
    stock: String(product.stock),
    imageUrl: product.imageUrl,
    categoryId: String(product.category.id),
    isFeatured: product.isFeatured,
  });

  setShowForm(true);
};


const handleImageUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file || !token) return;

  setUploadingImage(true);
  setError('');

  try {
    const data = await api.uploadProductImage(file, token);

    setFormData((previous) => ({
      ...previous,
      imageUrl: data.imageUrl,
    }));
  } catch (err) {
    setError(
      err instanceof Error ? err.message : 'Image upload failed'
    );
  } finally {
    setUploadingImage(false);
  }
};


const handleSaveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!token) return;

  if (uploadingImage) {
  setError('Please wait until the image upload finishes.');
  return;
}

if (!formData.imageUrl.trim()) {
  setError('Please upload a product image before saving.');
  return;
}


  try {
    setSaving(true);
    setError('');

    const productData = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice
        ? Number(formData.originalPrice)
        : null,
      stock: Number(formData.stock),
      categoryId: Number(formData.categoryId),
    };

    if (editingProduct) {
      await api.updateProduct(editingProduct.id, productData, token);
    } else {
      await api.createProduct(productData, token);
    }

    setShowForm(false);
    setEditingProduct(null);
    await loadProducts();
  } catch (err) {
    setError(
      err instanceof Error ? err.message : 'Failed to save product'
    );
  } finally {
    setSaving(false);
  }
};

const handleDeactivateProduct = async (productId: number) => {
  if (!token) return;

  const confirmed = window.confirm(
    'Are you sure you want to deactivate this product?'
  );

  if (!confirmed) return;

  try {
    setError('');
    await api.deactivateProduct(productId, token);
    await loadProducts();
  } catch (err) {
    setError(
      err instanceof Error ? err.message : 'Failed to deactivate product'
    );
  }
};


  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4] px-6 py-12 md:px-12">
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
    className="border border-[#e8e5dd] bg-white px-6 py-3 text-xs tracking-widest text-[#252525] transition-colors hover:border-[#a58a5c] hover:bg-[#a58a5c] hover:text-white"
  >
    MANAGE ORDERS
  </a>

  <a
    href="/admin/products"
    className="border border-[#a58a5c] bg-[#a58a5c] px-6 py-3 text-xs tracking-widest text-white"
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

        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs tracking-[0.3em] text-[#9B8055]">
              ADMINISTRATION / INVENTORY
            </p>
            <h1 className="display-font text-4xl text-[#252525] md:text-5xl">
              Product Management
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              Manage your catalogue, pricing and inventory.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
  <button
    onClick={openCreateForm}
    className="rounded-full bg-[#a58a5c] px-6 py-3 text-xs tracking-widest text-white transition hover:bg-[#8e744b]"
  >
    + ADD PRODUCT
  </button>

  <button
    onClick={loadProducts}
    className="rounded-full border border-[#252525] px-6 py-3 text-xs tracking-widest transition hover:bg-[#252525] hover:text-white"
  >
    REFRESH PRODUCTS
  </button>
</div>
        </div>

        {showForm && (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 md:p-8"
  >
    <div className="mb-6 flex items-center justify-between">
      <h2 className="display-font text-2xl text-[#252525]">
        {editingProduct ? 'Edit Product' : 'Add New Product'}
      </h2>

      <button
        type="button"
        onClick={() => setShowForm(false)}
        className="text-sm text-gray-500 hover:text-black"
      >
        CLOSE ✕
      </button>
    </div>

    <form onSubmit={handleSaveProduct} className="grid gap-5 md:grid-cols-2">

{[
  { label: 'Product Name', key: 'name', required: true },
  { label: 'Slug', key: 'slug', required: true },
  { label: 'SKU', key: 'sku', required: true },
  { label: 'Price (₹)', key: 'price', required: true },
  { label: 'Original Price (₹)', key: 'originalPrice', required: false },
  { label: 'Stock Quantity', key: 'stock', required: true },
].map((field) => (
  <label key={field.key} className="text-xs tracking-wide text-gray-500">
    {field.label}
    <input
      required={field.required}
      type={
        field.key === 'price' ||
        field.key === 'originalPrice' ||
        field.key === 'stock'
          ? 'number'
          : 'text'
      }
      min={
        field.key === 'stock' ? 0 :
        field.key === 'originalPrice' ? 0.01 :
        field.key === 'price' ? 0.01 : undefined
      }
      step={
        field.key === 'price' || field.key === 'originalPrice'
          ? '0.01'
          : '1'
      }
      value={formData[field.key as keyof typeof formData] as string}
      onChange={(event) =>
        setFormData((previous) => ({
          ...previous,
          [field.key]: event.target.value,
        }))
      }
      className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#a58a5c]"
    />
  </label>
))}

<div className="md:col-span-2">
  <label className="text-xs tracking-wide text-gray-500">
    PRODUCT IMAGE
    <input
      type="file"
      accept="image/jpeg,image/png,image/webp,image/avif"
      onChange={handleImageUpload}
      disabled={uploadingImage}
      className="mt-2 block w-full rounded-lg border border-gray-200 bg-white p-3 text-sm"
    />
  </label>

  {uploadingImage && (
    <p className="mt-3 text-sm text-[#a58a5c]">
      Uploading image to Cloudinary...
    </p>
  )}

  {formData.imageUrl && (
    <div className="mt-4 flex items-center gap-4">
      <img
        src={formData.imageUrl}
        alt="Product preview"
        className="h-24 w-24 rounded-xl border border-gray-200 object-cover"
      />
      <div>
        <p className="text-sm font-medium text-[#252525]">
          Image uploaded
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Your product image is ready.
        </p>
      </div>
    </div>
  )}
</div>



      <label className="text-xs tracking-wide text-gray-500">
        Category
        <select
          required
          value={formData.categoryId}
          onChange={(event) =>
            setFormData((previous) => ({
              ...previous,
              categoryId: event.target.value,
            }))
          }
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm"
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="md:col-span-2 text-xs tracking-wide text-gray-500">
        Description
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(event) =>
            setFormData((previous) => ({
              ...previous,
              description: event.target.value,
            }))
          }
          className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#a58a5c]"
        />
      </label>

      <label className="flex items-center gap-3 text-sm text-gray-600 md:col-span-2">
        <input
          type="checkbox"
          checked={formData.isFeatured}
          onChange={(event) =>
            setFormData((previous) => ({
              ...previous,
              isFeatured: event.target.checked,
            }))
          }
        />
        Feature this product on the homepage
      </label>

      <div className="flex gap-3 md:col-span-2">
        <button
          type="submit"
          disabled={saving || uploadingImage}
          className="rounded-full bg-[#a58a5c] px-8 py-3 text-xs tracking-widest text-white transition hover:bg-[#8e744b] disabled:opacity-50"
        >
          {saving ? 'SAVING...' : editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
        </button>

        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="rounded-full border border-gray-200 px-8 py-3 text-xs tracking-widest"
        >
          CANCEL
        </button>
      </div>
    </form>
  </motion.div>
)}


        {loading ? (
          <p className="py-16 text-center text-gray-500">
            Loading products...
          </p>
        ) : error ? (
          <p className="py-16 text-center text-red-600">{error}</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
          >
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-sm font-semibold tracking-wide">
                PRODUCT CATALOGUE
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {products.length} products found
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8F7F4] text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-[#252525]">
                              {product.name}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              SKU: {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {product.category?.name}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {product.stock}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            product.isActive
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
  <div className="flex items-center gap-4">
    <button
      onClick={() => openEditForm(product)}
      className="text-xs font-semibold tracking-wider text-[#9B8055] transition hover:text-[#252525]"
    >
      EDIT
    </button>

    {product.isActive && (
      <button
        onClick={() => handleDeactivateProduct(product.id)}
        className="text-xs font-semibold tracking-wider text-red-600 transition hover:text-red-800"
      >
        DEACTIVATE
      </button>
    )}
  </div>
</td>
                    </tr>
                  ))}


                  {products.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
