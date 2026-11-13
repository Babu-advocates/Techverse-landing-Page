import { products } from '@/content';

export default function Products() {
  const product = products.items[0];

  return (
    <section className="section section--products" id="products" aria-labelledby="products-h">
      <div className="wrap">
        <div className="section-head section-head--left">
          <p className="t-label">{products.label}</p>
          <h2 id="products-h">{products.headline}</h2>
          <p className="lead">{products.description}</p>
        </div>

        <article className="product-feature">
          <div className="product-feature__visual">
            <div className="product-feature__mark">
              <img
                src={product.logo}
                alt={product.logoAlt}
                width={280}
                height={280}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="product-feature__body">
            <p className="product-feature__eyebrow">{product.tagline}</p>
            <h3 className="product-feature__name">{product.name}</h3>
            <p className="product-feature__copy">{product.description}</p>

            <ul className="product-feature__highlights">
              {product.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <a
              className="product-feature__store"
              href={product.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/google-play-badge.jpg"
                alt={product.ctaLabel}
                width={180}
                height={54}
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
