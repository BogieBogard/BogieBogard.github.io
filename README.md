# mbogard.com

This repo is served by GitHub Pages at **mbogard.com**.

- **/** — interactive 3D driving portfolio (compiled build). Source lives in the
  `drive-local` repo; the production bundle is copied here.
- **/portfolio/** — the original 2D portfolio site.

## Deploying an update to the driving game

1. Make changes in `drive-local` and `NODE_OPTIONS=--openssl-legacy-provider npm run build`.
2. Copy the build into this repo's root (excluding source maps):
   `rsync -a --exclude='*.map' --exclude='.DS_Store' /path/to/drive-local/dist/ ./`
3. Commit and push.
