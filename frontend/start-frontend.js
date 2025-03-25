import { spawn } from 'child_process';

const viteProcess = spawn('cmd', ['/c', 'npx vite'], {
  cwd: process.cwd(),
  windowsHide: true
});

viteProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

viteProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

viteProcess.on('error', (error) => {
  console.error(`Error al iniciar Vite: ${error.message}`);
});

viteProcess.on('close', (code) => {
  console.log(`Proceso de Vite finalizó con el código ${code}`);
});
