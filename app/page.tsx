export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="intro">
        <div className="hero-copy">
          <h1 id="intro">Philippine banking,<br /><em>in simulation.</em></h1>
          <p className="lede">
            Tiwalo is a digital banking project built around fictional customers
            and Philippine pesos.
          </p>
          <a className="action" href="https://github.com/Tiwalo/banking-web">
            Explore the project <span aria-hidden="true">↗</span>
          </a>
        </div>
        <picture>
          <source
            srcSet="/images/terraces-720.webp 720w, /images/terraces-1440.webp 1440w"
            sizes="(min-width: 1280px) 600px, (min-width: 800px) 50vw, 100vw"
            type="image/webp"
          />
          <img
            className="landscape"
            src="/images/terraces-720.webp"
            width="720"
            height="405"
            alt="A green ink illustration of rice terraces in the Philippine Cordillera."
          />
        </picture>
      </section>
      <section className="about" id="about" aria-labelledby="about-title" tabIndex={-1}>
        <h2 id="about-title">About the simulation</h2>
        <div>
          <p>
            The project models customer accounts, internal transfers and read-only
            bank investigations. All balances are fictional. The simulation cannot
            accept deposits or move real money.
          </p>
          <p><a className="action" href="/sign-in">Customer sign-in</a></p>
        </div>
      </section>
    </>
  );
}
