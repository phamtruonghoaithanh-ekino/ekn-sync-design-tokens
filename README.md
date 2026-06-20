# EKN design token sync fixture

A small Vite page for visually validating design tokens delivered by another repository.

The token files are intentionally not included in this repository's initial state. They must be supplied by the source repository before installing or building the fixture.

## Token contract

The source repository should update these files in its merge request:

- `src/styles/tokens/variables.css` — runtime CSS custom properties
- `src/styles/tokens/_variables.scss` — compile-time Sass variables

Keep the paths and token names stable. The fixture intentionally consumes tokens directly, so a missing or renamed SCSS variable fails the build and CSS color changes appear on the page.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Validate an automated token update before merging:

```sh
npm run build
```

## Suggested cross-repository workflow

1. Generate `variables.css` and `_variables.scss` in the source repository.
2. Clone this repository in the source pipeline.
3. Copy the generated files to the stable paths above.
4. Create a branch such as `chore/sync-design-tokens-<version>`.
5. Run `npm install && npm run build` (use `npm ci` after this repository has committed its lockfile).
6. Commit the two token files and open a merge request.

Do not generate or update `main.scss`; it is the consumer contract used to catch breaking token changes.
