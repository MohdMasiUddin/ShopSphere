import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package } from 'lucide-react';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f7f3] px-6 py-20">
      <div className="w-full max-w-xl border border-[#e5e1d8] bg-white px-8 py-14 text-center sm:px-14">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#edf3e9]">
          <CheckCircle2 size={38} className="text-[#637d55]" />
        </div>

        <p className="mt-8 text-xs tracking-[0.2em] text-[#b18b4d]">
          SHOPSPHERE / ORDER CONFIRMED
        </p>

        <h1 className="display-font mt-4 text-4xl">
          Thank you for your order.
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#77736b]">
          Your payment has been verified successfully.
          We're preparing your order with care.
        </p>

        {order && (
          <div className="mt-9 border-y border-[#e5e1d8] py-6">
            <Package size={22} className="mx-auto text-[#b18b4d]" />

            <p className="mt-3 text-xs tracking-widest text-[#77736b]">
              ORDER NUMBER
            </p>

            <p className="mt-2 text-lg font-medium">
              {order.orderNumber}
            </p>
          </div>
        )}

        <Link
          to="/"
          className="mt-9 inline-flex items-center justify-center gap-3 bg-[#24231f] px-8 py-4 text-xs tracking-widest text-white transition-colors hover:bg-[#b18b4d]"
        >
          CONTINUE SHOPPING
          <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
