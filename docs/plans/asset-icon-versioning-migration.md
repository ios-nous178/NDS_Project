# Asset/Icon Versioning And S3 Migration Plan

## Goal

Split binary asset and icon delivery from the DS code release train so design assets can move faster during development without forcing a full DS/MCPB version bump.

## Current Findings

- `@nudge-design/assets` and `@nudge-design/icons` are currently part of the fixed Changesets group with React, tokens, styles, Tailwind preset, and HTML.
- `scripts/sync-mcpb-version.mjs` uses `assets` and `icons` when deriving the root and MCPB manifest version.
- `scripts/pack-local-packages.mjs` requires all packed packages to match the root DS version, including `assets` and `icons`.
- `packages/assets/src` mixes brand, purpose, and product-specific assets at the root. NudgeEAP-only files such as `psych-tests`, `menu-app`, `rank`, and `eap-profiles` are not scoped by brand.
- Runtime fallbacks already exist:
  - assets: `NUDGE_DS_ASSETS_DIR` then package `dist/files` then MCPB sidecar
  - icons: `NUDGE_DS_ICONS_VANILLA` then package `vanilla` then MCPB sidecar

## Version Model

- DS code version remains the version for React, tokens, styles, Tailwind preset, HTML, root package, and MCPB `version`.
- `@nudge-design/assets` starts again at `0.0.1` and follows an independent asset SemVer.
- `@nudge-design/icons` starts again at `0.0.1` and follows an independent icon SemVer.
- MCPB manifest records all three versions:
  - `version`: DS/MCPB version
  - `asset_version`: bundled asset version
  - `icon_version`: bundled icon version

## Asset Taxonomy

Use brand-first paths for product-specific visuals, and `shared` only for truly cross-brand or third-party assets.

```txt
files/
  brand/
    trost/
      logos/
    geniet/
      logos/
    nudge-eap/
      logos/
      images/
        psych-tests/
        menu-app/
        menu-web/
        circle-icons/
        consult/
        gift/
        three-d/
        rank/
      profiles/
    cashwalk-biz/
      logos/
      illustrations/
    runmile/
      logos/
      illustrations/
      marathon-events/
      profiles/
  shared/
    sns-logos/
```

Naming rules:

- No source/Figma implementation names in public paths (`nudge-img` is removed from public naming).
- Use brand slug directory for all brand/product assets.
- Use `images` for generic app imagery that is not a reusable illustration system.
- Use `illustrations` only for reusable empty/error/banner illustration assets.
- Use `three-d` instead of `3d` in public paths to avoid awkward URL and identifier handling.
- Preserve file stems where possible to reduce visual/content churn.

## S3 Layout

```txt
https://asset.nudge-dev.com/nds-assets/
  assets/
    0.0.1/
      manifest.json
      files/...
  icons/
    0.0.1/
      manifest.json
      vanilla.js
  channels/
    assets-dev/
      manifest.json
      files/...
    icons-dev/
      manifest.json
      vanilla.js
  blobs/
    sha256/
      ab/cd/<hash>
```

Release paths are immutable. Channel paths are mutable and are used for day-to-day design/development iteration.

Recommended environment values:

```bash
NUDGE_DS_ASSET_CDN_ORIGIN=https://asset.nudge-dev.com
NUDGE_DS_ASSET_BASE_URL=https://asset.nudge-dev.com/nds-assets/assets/0.0.1/files
NUDGE_DS_ICON_BASE_URL=https://asset.nudge-dev.com/nds-assets/icons/0.0.1
```

For mutable development channels:

```bash
NUDGE_DS_ASSET_CDN_ORIGIN=https://asset.nudge-dev.com
NUDGE_DS_ASSET_BASE_URL=https://asset.nudge-dev.com/nds-assets/channels/assets-dev/files
NUDGE_DS_ICON_BASE_URL=https://asset.nudge-dev.com/nds-assets/channels/icons-dev
```

`NUDGE_DS_ASSET_CDN_ORIGIN` controls publish dry-run/output URLs. `NUDGE_DS_ASSET_BASE_URL` and
`NUDGE_DS_ICON_BASE_URL` control runtime consumption. The package helper defaults are fallback only.

## S3 Size Strategy

Do not store full copies forever once releases become frequent.

- Phase 1: publish full release folders and mutable channels.
- Phase 2: add `sha256` and `size` to manifests.
- Phase 3: move binary payloads to `blobs/sha256/...` and make versioned release manifests point to blobs.
- Lifecycle:
  - keep release manifests indefinitely
  - keep release blobs indefinitely unless no manifest references them
  - expire old mutable channel objects after 30 days

## Migration Phases

### Phase 1: Repo Version Split And Folder Taxonomy

- Remove `assets` and `icons` from the fixed Changesets group.
- Exclude `assets` and `icons` from DS root/MCPB version derivation.
- Set `packages/assets/package.json` and `packages/icons/package.json` to `0.0.1`.
- Add `asset_version` and `icon_version` to `packages/mcp/manifest.json`.
- Move `packages/assets/src` binary files into the brand-first `files/` taxonomy.
- Update asset metadata filenames to the new public paths.
- Keep the existing `@nudge-design/assets/nudge-img` export as a deprecated compatibility alias for now, but change returned filenames to the new paths.

### Phase 2: Remote Resolver

- Add `NUDGE_DS_ASSET_BASE_URL` and `NUDGE_DS_ICON_BASE_URL`.
- Keep local package/sidecar fallback for MCPB and offline single-file HTML.
- Add helpers that turn metadata filenames into CDN URLs when a base URL is provided.

### Phase 3: Publish Tooling

- Generate asset and icon manifests with version, sha256, size, mime type, and path.
- Add upload scripts for release and channel targets.
- Add dry-run and diff output before upload.

### Phase 4: Dedupe

- Store unique binary payloads in `blobs/sha256`.
- Make version manifests reference blob keys.
- Keep channel manifests mutable while preserving release immutability.

## Non-Goals For Phase 1

- No S3 credentials or upload execution.
- No removal of local package fallback.
- No breaking of public JS exports.
