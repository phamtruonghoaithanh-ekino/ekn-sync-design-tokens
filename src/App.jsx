import { useEffect, useMemo, useState } from 'react';
import lightThemeHref from './styles/css/vars-react-light.css?url';
import darkThemeHref from './styles/css/vars-react-dark.css?url';

const themes = {
  light: {
    label: 'Light',
    file: 'vars-react-light.css',
    href: lightThemeHref,
  },
  dark: {
    label: 'Dark',
    file: 'vars-react-dark.css',
    href: darkThemeHref,
  },
};

const tokenGroups = [
  {
    label: 'Color',
    tokens: [
      ['--color-brand-primary', 'Brand primary'],
      ['--color-brand-secondary', 'Brand secondary'],
      ['--color-surface-default', 'Surface default'],
      ['--color-surface-subtle', 'Surface subtle'],
      ['--color-text-default', 'Text default'],
      ['--color-neutral-0', 'Neutral 0'],
      ['--color-neutral-900', 'Neutral 900'],
    ],
  },
  {
    label: 'Spacing',
    tokens: [
      ['--spacing-sm', 'Small'],
      ['--spacing-md', 'Medium'],
      ['--spacing-lg', 'Large'],
    ],
  },
  {
    label: 'Radius',
    tokens: [
      ['--radius-sm', 'Small'],
      ['--radius-md', 'Medium'],
    ],
  },
  {
    label: 'Button component',
    tokens: [
      ['--component-button-primary-background-color', 'Primary background'],
      ['--component-button-primary-color', 'Primary text'],
      ['--component-button-primary-padding-x', 'Primary padding x'],
      ['--component-button-primary-padding-y', 'Primary padding y'],
      ['--component-button-primary-border-radius', 'Primary radius'],
      ['--component-button-primary-font-weight', 'Primary weight'],
      ['--component-button-secondary-background-color', 'Secondary background'],
      ['--component-button-secondary-color', 'Secondary text'],
      ['--component-button-secondary-border-color', 'Secondary border'],
    ],
  },
  {
    label: 'Card component',
    tokens: [
      ['--component-card-default-background-color', 'Background'],
      ['--component-card-default-color', 'Text'],
      ['--component-card-default-padding', 'Padding'],
      ['--component-card-default-border-radius', 'Radius'],
    ],
  },
];

const getTokenValue = (token) =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim();

const isColorValue = (value) => /^#|^rgb|^hsl/.test(value);

const slugify = (value) => value.toLowerCase().replace(/\s+/g, '-');

function useThemeStylesheet(activeTheme) {
  const [loadedTheme, setLoadedTheme] = useState(activeTheme);

  useEffect(() => {
    const theme = themes[activeTheme];
    const linkId = 'active-theme';
    const nextHref = new URL(theme.href, window.location.href).href;
    let link = document.getElementById(linkId);
    let cancelled = false;

    document.documentElement.dataset.theme = activeTheme;

    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.append(link);
    }

    const markLoaded = () => {
      if (!cancelled) {
        setLoadedTheme(activeTheme);
      }
    };

    if (link.href === nextHref) {
      requestAnimationFrame(markLoaded);
      return () => {
        cancelled = true;
      };
    }

    link.addEventListener('load', markLoaded, { once: true });
    link.href = theme.href;

    return () => {
      cancelled = true;
      link.removeEventListener('load', markLoaded);
    };
  }, [activeTheme]);

  return loadedTheme;
}

function useTokenValues(loadedTheme) {
  const [values, setValues] = useState({});

  useEffect(() => {
    const nextValues = Object.fromEntries(
      tokenGroups.flatMap((group) =>
        group.tokens.map(([token]) => [token, getTokenValue(token)])
      )
    );

    setValues(nextValues);
  }, [loadedTheme]);

  return values;
}

function ThemeSwitch({ activeTheme, onThemeChange }) {
  return (
    <div className="theme-switch">
      {Object.entries(themes).map(([id, theme]) => (
        <button
          aria-pressed={id === activeTheme}
          className="theme-option"
          data-theme={id}
          key={id}
          onClick={() => onThemeChange(id)}
          type="button"
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
}

function SwatchGrid({ values }) {
  return (
    <div className="swatch-grid">
      {tokenGroups[0].tokens.map(([token, label]) => (
        <article className="swatch" key={token}>
          <span
            className="swatch__sample"
            style={{ '--swatch': `var(${token})` }}
          />
          <div>
            <strong>{label}</strong>
            <code>{token}</code>
            <span>{values[token]}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function TokenInventory({ values }) {
  return tokenGroups.map((group) => (
    <section
      aria-labelledby={`${slugify(group.label)}-heading`}
      className="token-group"
      key={group.label}
    >
      <h3 id={`${slugify(group.label)}-heading`}>{group.label}</h3>
      <div className="token-list">
        {group.tokens.map(([token, label]) => {
          const value = values[token] ?? '';
          const preview = isColorValue(value) ? (
            <span
              className="token-row__chip"
              style={{ '--chip': `var(${token})` }}
            />
          ) : (
            <span className="token-row__measure">{value}</span>
          );

          return (
            <div className="token-row" key={token}>
              <div>
                <strong>{label}</strong>
                <code>{token}</code>
              </div>
              <div className="token-row__value">
                {preview}
                <span>{value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  ));
}

export default function App() {
  const [activeTheme, setActiveTheme] = useState('light');
  const loadedTheme = useThemeStylesheet(activeTheme);
  const values = useTokenValues(loadedTheme);
  const theme = themes[activeTheme];
  const themeLabel = useMemo(() => theme.label, [theme.label]);

  return (
    <main className="demo-shell">
      <header className="masthead">
        <div>
          <p className="eyebrow">EKN design tokens</p>
          <h1>Theme demo</h1>
        </div>
        <div aria-label="Theme" className="theme-panel">
          <ThemeSwitch
            activeTheme={activeTheme}
            onThemeChange={setActiveTheme}
          />
          <code>{theme.file}</code>
        </div>
      </header>

      <section aria-label="Component preview" className="preview-grid">
        <article className="card-preview">
          <p className="eyebrow">Card composition</p>
          <h2>Build once. Theme from tokens.</h2>
          <p>
            This preview reads component, color, spacing, border, and radius
            values from the active generated CSS file.
          </p>
          <div className="actions">
            <button className="button-primary" type="button">
              Primary action
            </button>
            <button className="button-secondary" type="button">
              Secondary
            </button>
          </div>
        </article>

        <aside aria-label="Surface preview" className="surface-preview">
          <div className="surface-preview__top">
            <span />
            <span />
            <span />
          </div>
          <div className="surface-preview__body">
            <strong>{themeLabel} theme</strong>
            <p>Surface, text, and component tokens update together.</p>
          </div>
        </aside>
      </section>

      <section aria-labelledby="swatches-heading" className="swatch-section">
        <div className="section-heading">
          <p className="eyebrow">Runtime values</p>
          <h2 id="swatches-heading">Color tokens</h2>
        </div>
        <SwatchGrid values={values} />
      </section>

      <section aria-labelledby="tokens-heading" className="token-section">
        <div className="section-heading">
          <p className="eyebrow">Generated variables</p>
          <h2 id="tokens-heading">Token inventory</h2>
        </div>
        <TokenInventory values={values} />
      </section>
    </main>
  );
}
