import './styles/tokens/variables.css';
import './styles/main.scss';

const cssTokens = [
  ['--color-primary', 'Primary'],
  ['--color-accent', 'Accent'],
  ['--color-surface', 'Surface'],
  ['--color-ink', 'Ink'],
];

const rootStyles = getComputedStyle(document.documentElement);

const scssTokens = [
  ['--compiled-space-unit', 'Space unit'],
  ['--compiled-radius', 'Card radius'],
  ['--compiled-border-width', 'Border width'],
];

const swatches = cssTokens
  .map(([token, label]) => {
    const value = rootStyles.getPropertyValue(token).trim();
    return `
      <article class="swatch">
        <div class="swatch__color" style="--swatch: var(${token})"></div>
        <div class="swatch__meta">
          <strong>${label}</strong>
          <code>${token}</code>
          <span>${value}</span>
        </div>
      </article>
    `;
  })
  .join('');

const measurements = scssTokens
  .map(([token, label]) => `
    <div>
      <dt>${label}</dt>
      <dd>${rootStyles.getPropertyValue(token).trim()}</dd>
    </div>
  `)
  .join('');

document.querySelector('#app').innerHTML = `
  <main>
    <header class="hero">
      <p class="eyebrow">EKN / Design systems</p>
      <div class="hero__title">
        <h1>Token<br />Lab</h1>
        <div class="status"><span></span> Sync fixture online</div>
      </div>
      <p class="hero__intro">
        A small visual contract for generated CSS custom properties and compiled SCSS variables.
      </p>
    </header>

    <section class="section" aria-labelledby="css-heading">
      <div class="section__heading">
        <div>
          <p class="section__number">01</p>
          <h2 id="css-heading">Runtime colors</h2>
        </div>
        <code>src/styles/tokens/variables.css</code>
      </div>
      <div class="swatch-grid">${swatches}</div>
    </section>

    <section class="section" aria-labelledby="scss-heading">
      <div class="section__heading">
        <div>
          <p class="section__number">02</p>
          <h2 id="scss-heading">Compiled decisions</h2>
        </div>
        <code>src/styles/tokens/_variables.scss</code>
      </div>

      <div class="component-stage">
        <article class="sample-card">
          <p class="sample-card__label">Component preview</p>
          <h3>Tokens should make decisions visible.</h3>
          <p>
            Radius, spacing, border, type scale and shadow on this card are all sourced from SCSS variables.
          </p>
          <button type="button">Test interaction <span aria-hidden="true">↗</span></button>
        </article>

        <dl class="measurements">${measurements}</dl>
      </div>
    </section>
  </main>
`;
