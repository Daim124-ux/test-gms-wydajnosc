import { registerOTel } from '@vercel/otel';

export async function register() {
  let customInstrumentations: any[] = [];

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Dynamiczny import zapobiega błędom w Edge Runtime
    const { HttpInstrumentation } = await import('@opentelemetry/instrumentation-http');
    const { AwsInstrumentation } = await import('@opentelemetry/instrumentation-aws-sdk');

    customInstrumentations = [
      // Łapie wszystkie zapytania HTTP po stronie Node (część Supabase może z tego korzystać)
      new HttpInstrumentation(),
      // Łapie zapytania AWS SDK (np. s3, cloudfront) z pełnymi szczegółami operacji
      new AwsInstrumentation({
        suppressInternalInstrumentation: true,
      }),
    ];
  }

  registerOTel({
    serviceName: process.env.OTEL_SERVICE_NAME || 'gms-web-app',
    instrumentations: customInstrumentations,
  });
}
