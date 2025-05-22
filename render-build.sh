#!/bin/bash
# Install all dependencies including dev dependencies
npm install

# Run the build commands
npx vite build
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
