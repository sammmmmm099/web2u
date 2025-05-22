#!/bin/bash
# Install all dependencies including dev dependencies
# Install all dependencies
npm install
# Install vite globally
npm install -g vite
# Create a simple index.html for the client
mkdir -p dist
mkdir -p dist/public
# Run the build commands
vite build
# Create a bundled server
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
