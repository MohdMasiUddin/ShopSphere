
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { api } from '../../services/api';
import type { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';

const categories = ['All', 'Fashion & Apparel', 'Home & Living', 'Accessories'];

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [addedProduct, setAddedProduct] = useState<number | null>(null);
  const { cartCount, addToCart } = useCart();

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);


useEffect(() => {
  const handleCategoryChange = (event: Event) => {
    const customEvent = event as CustomEvent<string>;
    setCategory(customEvent.detail);
  };

  window.addEventListener(
    'shopsphere:select-category',
    handleCategoryChange
  );

  return () => {
    window.removeEventListener(
      'shopsphere:select-category',
      handleCategoryChange
    );
  };
}, []);

useEffect(() => {
  const handleSearch = (event: Event) => {
    const customEvent = event as CustomEvent<string>;
    setSearchQuery(customEvent.detail);
  };

  window.addEventListener('shopsphere:search', handleSearch);

  return () => {
    window.removeEventListener('shopsphere:search', handleSearch);
  };
}, []);





  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

let result = products.filter((product) => {
  const matchesCategory =
    category === 'All' || product.category === category;

  const matchesSearch =
    product.name.toLowerCase().includes(normalizedSearch) ||
    product.category.toLowerCase().includes(normalizedSearch);

  return matchesCategory && matchesSearch;
});

    if (sort === 'low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === 'high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else {
      result = [...result].sort(
        (a, b) => Number(b.featured) - Number(a.featured)
      );
    }

    return result;
  }, [products, category, sort, searchQuery]);

const handleAddToCart = (productId: number) => {
  const product = products.find((item) => item.id === productId);

  if (!product || product.stock <= 0) return;

  addToCart(product);
  setAddedProduct(productId);

  window.setTimeout(() => {
    setAddedProduct(null);
  }, 1600);
};

  return (
    <section id="shop" className="bg-[#f8f7f3] px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 text-[10px] tracking-[0.3em] text-[#a68753]">
              THE SHOPSPHERE EDIT
            </p>

            <h2 className="display-font text-4xl text-[#24231f] sm:text-5xl">
              Pieces worth <span className="italic">keeping.</span>
            </h2>

            <p className="mt-4 text-sm text-[#77736b]">
              Thoughtful finds for every part of your life.
            </p>
          </div>

          <p className="text-xs tracking-wider text-[#77736b]">
            BAG ITEMS: {cartCount}
          </p>
        </div>

        {loading && (
  <p className="py-12 text-center text-sm text-[#77736b]">
    Loading products...
  </p>
)}

{error && (
  <p className="py-12 text-center text-sm text-red-600">
    {error}
  </p>
)}


        <div className="mb-9 flex flex-col justify-between gap-5 border-y border-[#e5e1d8] py-5 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-5 py-2.5 text-xs tracking-wider transition-all duration-300 ${
                  category === item
                    ? 'bg-[#24231f] text-white'
                    : 'border border-[#e5e1d8] text-[#55534d] hover:border-[#b18b4d]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal size={16} className="text-[#77736b]" />

            <label htmlFor="product-sort" className="text-xs text-[#77736b]">
              Sort by
            </label>

            <select
              id="product-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="bg-transparent text-xs text-[#24231f] outline-none"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            id = "product-grid"
            key={category + sort}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProducts.map((product, index) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="group"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe8e0]">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {product.originalPrice && (
                    <span className="absolute left-4 top-4 bg-[#f8f7f3] px-3 py-2 text-[10px] tracking-wider text-[#8c7044]">
                      SPECIAL PRICE
                    </span>
                  )}

                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 bg-[#f8f7f3] py-4 text-xs tracking-[0.15em] text-[#24231f] opacity-100 transition-all duration-300 hover:bg-[#24231f] hover:text-white sm:translate-y-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
                  >
                    <ShoppingBag size={15} />
                    {addedProduct === product.id ? 'ADDED TO BAG' : 'ADD TO BAG'}
                  </button>

                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#24231f] opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowUpRight size={17} />
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 pt-5">
                  <div>
                    <p className="mb-2 text-[10px] tracking-[0.18em] text-[#a68753]">
                      {product.category.toUpperCase()}
                    </p>

                    <h3 className="display-font text-xl text-[#24231f]">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-xs text-[#77736b]">
                      ★ {product.rating.toFixed(1)} / 5
                    </p>
                  </div>

                  <div className="whitespace-nowrap text-right">
                    <p className="text-sm font-medium text-[#24231f]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>

                    {product.originalPrice && (
                      <p className="mt-1 text-xs text-[#99948a] line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <p className="py-16 text-center text-sm text-[#77736b]">
            No products found.
          </p>
        )}
      </div>
    </section>
  );
}
