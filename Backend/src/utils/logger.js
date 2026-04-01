import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '../logs');

// Garantir que a pasta de logs existe
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'app.log');

export function log(message, type = 'INFO') {
  const timestamp = new Date().toLocaleString('pt-BR');
  const logMessage = `[${timestamp}] [${type}] ${message}\n`;
  
  // Log no console
  console.log(logMessage);
  
  // Log no arquivo
  fs.appendFileSync(logFile, logMessage, 'utf8');
}

export function error(message, error = null) {
  let fullMessage = message;
  if (error) {
    fullMessage += ` | ${error.message}`;
    if (error.stack) {
      fullMessage += ` | Stack: ${error.stack}`;
    }
  }
  log(fullMessage, 'ERROR');
}

export function info(message) {
  log(message, 'INFO');
}

export function warn(message) {
  log(message, 'WARN');
}

export function success(message) {
  log(message, 'SUCCESS');
}

export default {
  log,
  error,
  info,
  warn,
  success
};
