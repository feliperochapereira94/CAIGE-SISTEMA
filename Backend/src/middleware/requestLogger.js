import { info } from "../utils/logger.js";

export function requestLogger(req, res, next) {
  const startTime = Date.now();
  
  // Log da requisição
  info(`→ ${req.method} ${req.path} | IP: ${req.ip}`);
  
  // Interceptar o response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    info(`  ← ${req.method} ${req.path} | Status: ${res.statusCode} | ${duration}ms`);
    return originalJson.call(this, data);
  };
  
  next();
}

export default requestLogger;
