import type { Product } from "../types/product";

const API_URL = "http://localhost:5001/api";

interface BackendProduct {
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
    name: string;
  };
}

interface AuthResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'CUSTOMER' | 'ADMIN';
  };
  token: string;
}

interface AddressInput {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderInput {
  addressId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}


export const api = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    return (data.products as BackendProduct[]).map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category.name,
      price: Number(product.price),
      originalPrice: product.originalPrice
        ? Number(product.originalPrice)
        : undefined,
      image: product.imageUrl,
      description: product.description,
      rating: 4.5,
      featured: product.isFeatured,
      stock: product.stock,
      slug: product.slug,
      sku: product.sku,
      isActive: product.isActive,
    }));
  },

  async getCategories() {
    const response = await fetch(`${API_URL}/categories`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return response.json();
  },

    async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  },

    async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },

  async createAddress(
    address: AddressInput,
    token: string
  ) {
    const response = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(address),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save shipping address');
    }

    return data;
  },

  async createOrder(
  order: OrderInput,
  token: string
) {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(order),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create order');
  }

  return data;
  },

  async createRazorpayOrder(
  orderId: number,
  token: string
) {
  const response = await fetch(`${API_URL}/payments/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to initialize payment');
  }

  return data;
  },

  async verifyRazorpayPayment(
  payment: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  },
  token: string
) {
  const response = await fetch(`${API_URL}/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payment),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Payment verification failed');
  }

  return data;
},



  getAdminProducts: async (token: string) => {
    const response = await fetch(`${API_URL}/products/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch products');
    }

    return data;
  },

  createProduct: async (product: Record<string, unknown>, token: string) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create product');
    }

    return data;
  },

  updateProduct: async (
    productId: number,
    product: Record<string, unknown>,
    token: string
  ) => {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update product');
    }

    return data;
  },

  deactivateProduct: async (productId: number, token: string) => {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to deactivate product');
    }

    return data;
  },


  getAdminOrders: async (token: string) => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }

    return data;
  },

  updateOrderStatus: async (
    orderId: number,
    status: string,
    token: string
  ) => {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update order status');
    }

    return data;
  },


  getAdminDashboard: async (token: string) => {
    const response = await fetch(`${API_URL}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to load dashboard');
    }

    return data;
  },

  getAdminCustomers: async (token: string, search = "") => {
  const query = search
    ? `?search=${encodeURIComponent(search)}`
    : "";

  const response = await fetch(
    `${API_URL}/admin/customers${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch customers");
  }

  return data;
},


uploadProductImage: async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `${API_URL}/products/upload-image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Image upload failed");
  }

  return data;
},




};

