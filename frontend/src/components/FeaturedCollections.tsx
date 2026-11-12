
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const collections = [
  {
    title: 'Fashion & Apparel',
    subtitle: 'STYLE THAT SPEAKS',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85',
    link: '#fashion',
  },
  {
    title: 'Home & Living',
    subtitle: 'MAKE IT YOURS',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85',
    link: '#home',
  },
  {
    title: 'Accessories',
    subtitle: 'THE FINISHING TOUCH',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85',
    link: '#accessories',
  },
];

export default function FeaturedCollections() {
  return (
    <section id="collections" className="bg-[#f8f7f3] px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <p className="mb-4 text-[10px] tracking-[0.3em] text-[#a68753]">
              THOUGHTFULLY SELECTED
            </p>

            <h2 className="display-font text-4xl text-[#24231f] sm:text-5xl">
              Explore our <span className="italic">collections.</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-[#77736b]">
            Discover carefully curated pieces that bring
            together timeless design and everyday elegance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {collections.map((collection, index) => (
            <motion.a
              href="#product-grid"
              onClick={() => {
                window.dispatchEvent(
                    new CustomEvent('shopsphere:select-category', {
                        detail: collection.title,
                    })
                );
              }}

              key={collection.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative block h-[420px] overflow-hidden bg-[#e9e4da] sm:h-[480px]"
            >
              <img
                src={collection.image}
                alt={collection.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

              <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-7 text-white">
                <div>
                  <p className="mb-3 text-[10px] tracking-[0.25em] text-[#e1c99d]">
                    {collection.subtitle}
                  </p>

                  <h3 className="display-font text-3xl sm:text-4xl">
                    {collection.title}
                  </h3>
                </div>

                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 transition-all duration-300 group-hover:border-[#c6a66b] group-hover:bg-[#c6a66b]">
                  <ArrowUpRight size={20} />
                </span>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
