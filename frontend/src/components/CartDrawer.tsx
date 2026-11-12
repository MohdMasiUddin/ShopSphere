import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';

import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
}: CartDrawerProps) {
    const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const formatPrice = (price: number) =>
    `₹${price.toLocaleString('en-IN')}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close shopping bag"
            onClick={onClose}
            className="absolute inset-0 h-full w-full bg-black/45"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#f8f7f3] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#e5e1d8] px-7 py-6">
              <div>
                <h2 className="display-font text-2xl">
                  Your Shopping Bag
                </h2>
                <p className="mt-1 text-xs text-[#88837a]">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>

              <button
                onClick={onClose}
                aria-label="Close cart"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e1d8] transition-colors hover:bg-[#24231f] hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <ShoppingBag size={42} strokeWidth={1} className="text-[#b18b4d]" />

                <h3 className="display-font mt-6 text-2xl">
                  Your bag is waiting.
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#77736b]">
                  Discover something beautiful and add it to your collection.
                </p>

                <button
                  onClick={onClose}
                  className="mt-7 border border-[#24231f] px-7 py-3 text-xs tracking-widest transition-colors hover:bg-[#24231f] hover:text-white"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-6 overflow-y-auto px-7 py-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-[#e5e1d8] pb-6"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-32 w-24 shrink-0 object-cover"
                      />

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className="text-[10px] tracking-[0.18em] text-[#a68753]">
                              {item.category.toUpperCase()}
                            </p>

                            <h3 className="display-font mt-2 text-lg leading-tight">
                              {item.name}
                            </h3>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="h-fit text-[#99948a] transition-colors hover:text-red-600"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

                        <p className="mt-3 text-sm font-medium">
                          {formatPrice(item.price)}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-[#e5e1d8]">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                              className="p-2 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Minus size={13} />
                            </button>

                            <span className="min-w-8 text-center text-xs">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="p-2"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <p className="text-sm font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#e5e1d8] bg-white px-7 py-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#77736b]">Subtotal</span>
                    <span className="font-semibold">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#99948a]">
                    Shipping and taxes calculated at checkout.
                  </p>

                  <button
                    onClick={() => {
                        onClose();
                            navigate('/checkout');
       }}
                className="mt-6 flex w-full items-center justify-center gap-3 bg-[#24231f] py-4 text-xs tracking-[0.17em] text-white transition-colors hover:bg-[#b18b4d]"
       >
                     PROCEED TO CHECKOUT <ArrowRight size={16} />
                </button>

                  <button
                    onClick={onClose}
                    className="mt-4 w-full py-2 text-xs tracking-wider text-[#77736b] underline underline-offset-4"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

