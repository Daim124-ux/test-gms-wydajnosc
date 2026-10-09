import { registerOTel } from '@vercel/otel';

export async function register() {
  registerOTel({
    serviceName: process.env.OTEL_SERVICE_NAME || 'gms-web-app',
  });
}
