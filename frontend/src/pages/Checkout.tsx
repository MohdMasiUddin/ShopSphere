
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, type FormEvent } from 'react';
import { api } from '../services/api';

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}


export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [address, setAddress] = useState({
  fullName: user?.name || '',
  phone: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
});
const [isProcessing, setIsProcessing] = useState(false);
const [error, setError] = useState('');

const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!token) {
    setError('Please sign in again to continue.');
    return;
  }

  setIsProcessing(true);
  setError('');

  try {
    // Load Razorpay checkout
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      throw new Error('Unable to load Razorpay. Please try again.');
    }

    // Save shipping address
    const addressResult = await api.createAddress(address, token);

    // Create order using backend product prices
    const orderResult = await api.createOrder(
      {
        addressId: addressResult.address.id,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      },
      token
    );

    // Create Razorpay payment order
    const paymentResult = await api.createRazorpayOrder(
      orderResult.order.id,
      token
    );

    // Open Razorpay checkout
    const razorpay = new window.Razorpay({
      key: paymentResult.keyId,
      amount: paymentResult.razorpayOrder.amount,
      currency: paymentResult.razorpayOrder.currency,
      name: 'ShopSphere',
      description: 'Purchase from ShopSphere',
      order_id: paymentResult.razorpayOrder.id,
      prefill: {
        name: address.fullName,
        email: user.email,
        contact: address.phone,
      },
      handler: async (paymentResponse) => {
        try {
          // Verify payment on the backend
          await api.verifyRazorpayPayment(paymentResponse, token);

          // Clear cart only after successful verification
          clearCart();

          navigate('/order-success', {
            state: { order: orderResult.order },
          });
        } catch (verificationError) {
          setError(
            verificationError instanceof Error
              ? verificationError.message
              : 'Payment verification failed.'
          );
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
        },
      },
    });

    razorpay.open();
  } catch (checkoutError) {
    setError(
      checkoutError instanceof Error
        ? checkoutError.message
        : 'Something went wrong during checkout.'
    );
    setIsProcessing(false);
  }
};

  const formatPrice = (price: number) =>
    `₹${price.toLocaleString('en-IN')}`;

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f8f7f3] px-6 py-24 text-center">
        <h1 className="display-font text-3xl">Sign in to continue</h1>
        <p className="mt-4 text-sm text-[#77736b]">
          Please sign in to complete your purchase.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block bg-[#24231f] px-8 py-4 text-xs tracking-widest text-white"
        >
          RETURN TO SHOP
        </Link>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f7f3] px-6 py-24 text-center">
        <h1 className="display-font text-3xl">Your bag is empty</h1>
        <Link
          to="/"
          className="mt-8 inline-block bg-[#24231f] px-8 py-4 text-xs tracking-widest text-white"
        >
          CONTINUE SHOPPING
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs tracking-widest text-[#77736b] hover:text-[#b18b4d]"
        >
          <ArrowLeft size={15} />
          CONTINUE SHOPPING
        </Link>

        <div className="mt-10 mb-12">
          <p className="text-xs tracking-[0.2em] text-[#b18b4d]">
            SHOPSPHERE / CHECKOUT
          </p>
          <h1 className="display-font mt-3 text-4xl sm:text-5xl">
            Complete your order.
          </h1>
          <p className="mt-3 text-sm text-[#77736b]">
            Welcome, {user.name}. Just a few details before your purchase.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr]">
          <section>
            <h2 className="display-font text-2xl">
              Shipping Information
            </h2>

{error && (
  <div
    role="alert"
    className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
  >
    {error}
  </div>
)}


            <form 
              id="checkout-form"
              onSubmit={handleCheckout}
              className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs tracking-wider">
                  FULL NAME
                </label>
                <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) =>
                        setAddress({ ...address, fullName: e.target.value })
                    }
                    required
                    className="mt-2 w-full border border-[#e5e1d8] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#b18b4d]"
                    />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  defaultValue={user.email}
                  required
                  className="w-full border border-[#dedad1] bg-white px-4 py-3 text-sm outline-none focus:border-[#b18b4d]"
                  placeholder="Email address"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                  required
                  className="mt-2 w-full border border-[#e5e1d8] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#b18b4d]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs tracking-wider">
                  STREET ADDRESS
                </label>
                <input
                    type="text"
                    value={address.street}
                    onChange={(e) =>
                        setAddress({ ...address, street: e.target.value })
                    }
                    placeholder="House number, street, area"
                  required
                  className="mt-2 w-full border border-[#e5e1d8] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#b18b4d]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  CITY
                </label>
                <input
                    type="text"
                    value={address.city}
                    onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                    }
                    placeholder="Enter City"
                  required
                  className="mt-2 w-full border border-[#e5e1d8] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#b18b4d]"
                  
                />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  STATE
                </label>
                <input
                    type="text"
                    value={address.state}
                    onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                    }
                    placeholder="Enter State"
                  required
                  className="mt-2 w-full border border-[#e5e1d8] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#b18b4d]"
                
                />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  POSTAL CODE
                </label>
                <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) =>
                        setAddress({ ...address, postalCode: e.target.value })
                    }
                    placeholder="Enter Postal Code"
                  required
                  maxLength={10}
                  className="mt-2 w-full border border-[#e5e1d8] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#b18b4d]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  COUNTRY
                </label>
                <input
                    type="text"
                    value={address.country}
                    onChange={(e) =>
                        setAddress({ ...address, country: e.target.value })
                    }
                
                  required
                  className="mt-2 w-full border border-[#e5e1d8] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#b18b4d]"
                />
              </div>
            </form>
          </section>

          <aside className="h-fit border border-[#e5e1d8] bg-white p-7">
            <h2 className="display-font text-2xl">Order Summary</h2>

            <div className="mt-7 space-y-5">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-16 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="display-font text-base">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#77736b]">
                      Quantity: {item.quantity}
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 border-t border-[#e5e1d8] pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#77736b]">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-[#77736b]">Shipping</span>
                <span>Calculated next</span>
              </div>

              <div className="mt-5 flex justify-between border-t border-[#e5e1d8] pt-5">
                <span className="font-medium">Estimated Total</span>
                <span className="text-xl font-semibold">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-[#77736b]">
              <Lock size={14} />
              Secure checkout
            </div>

            <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="mt-7 w-full bg-[#24231f] py-4 text-xs tracking-[0.18em] text-white transition-colors hover:bg-[#b18b4d] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isProcessing ? 'PROCESSING...' : `PAY ${formatPrice(cartTotal)}`}
             </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

