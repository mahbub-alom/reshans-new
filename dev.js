#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const binDir = path.join(__dirname, 'node_modules', '.bin');
const nextBin = path.join(binDir, 'next');

const child = spawn(nextBin, ['dev', '-H', '0.0.0.0', '-p', '3000'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    PORT: '3000',
    PATH: `${binDir}:${process.env.PATH || ''}`,
  },
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
