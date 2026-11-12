
import FeaturedCollections from '../components/FeaturedCollections';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductGrid from '../features/products/ProductGrid';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[650px] overflow-hidden bg-[#e9e4da]">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2000&q=85"
          alt="Elegant fashion boutique interior"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-8 py-20 sm:px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="max-w-2xl text-white"
          >
            <p className="mb-6 text-xs tracking-[0.3em] sm:text-sm">
              THE ART OF EVERYDAY LIVING
            </p>

            <h1 className="display-font text-5xl leading-[1.1] sm:text-7xl lg:text-8xl">
              Discover a world of
              <span className="block italic text-[#e1c99d]">
                beautiful things.
              </span>
            </h1>

            <p className="mt-7 max-w-md text-sm leading-7 text-white/85 sm:text-base">
              Thoughtfully curated essentials, timeless pieces, and
              extraordinary finds for the way you live.
            </p>

            <a
              href="#shop"
              className="mt-10 inline-flex items-center gap-4 border border-white px-7 py-4 text-xs tracking-[0.18em] transition-all duration-300 hover:bg-white hover:text-[#24231f]"
            >
              EXPLORE COLLECTION <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-8 right-8 text-[10px] tracking-[0.2em] text-white/80">
          CURATED FOR YOU · EST. 2026
        </div>
      </section>

      {/* Collections */}
      <FeaturedCollections />

      {/* Products */}
      <section id="shop" className="scroll-mt-24">
        <ProductGrid />
      </section>

      {/* Our Story */}
      <section
        id="about"
        className="scroll-mt-24 bg-[#f1eee7] px-6 py-24 sm:px-12 lg:px-20 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-6 text-xs tracking-[0.3em] text-[#a58a5c]">
              THE STORY BEHIND SHOPSPHERE
            </p>

            <h2 className="display-font text-5xl leading-tight text-[#25241f] sm:text-6xl">
              More than shopping.
              <span className="block italic text-[#b18b4d]">
                A way of living.
              </span>
            </h2>

            <p className="mt-8 max-w-xl text-sm leading-8 text-[#68665f] sm:text-base">
              We believe the things we surround ourselves with should
              inspire us. ShopSphere was created with a simple idea:
              bring thoughtfully selected essentials, timeless design,
              and everyday quality together in one beautiful destination.
            </p>

            <p className="mt-5 max-w-xl text-sm leading-8 text-[#68665f] sm:text-base">
              From personal style to the spaces we call home, every
              collection is curated to make everyday living feel a little
              more extraordinary.
            </p>

            <a
              href="#collections"
              className="mt-9 inline-flex items-center gap-3 border-b border-[#a58a5c] pb-3 text-xs tracking-[0.18em] text-[#25241f] transition-colors hover:text-[#a58a5c]"
            >
              DISCOVER OUR COLLECTIONS
              <ArrowRight size={15} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=85"
              alt="Thoughtfully designed contemporary living space"
              className="h-[420px] w-full object-cover sm:h-[550px]"
            />

            <div className="absolute -bottom-6 -left-6 hidden bg-[#b18b4d] px-8 py-7 text-white sm:block">
              <p className="display-font text-3xl italic">
                ShopSphere.
              </p>
              <p className="mt-2 text-[10px] tracking-[0.2em]">
                CURATED FOR EVERYDAY LIVING
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
