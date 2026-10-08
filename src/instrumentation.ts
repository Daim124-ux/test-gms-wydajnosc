export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Używamy Buffer.from, aby ukryć stringi przed statycznym analizatorem Turbopack,
    // który zbyt agresywnie wchodził w głąb modułów i szukał pakietów od NestJS.
    const pkgSdk = Buffer.from('QG9wZW50ZWxlbWV0cnkvc2RrLW5vZGU=', 'base64').toString(); // @opentelemetry/sdk-node
    const pkgAuto = Buffer.from('QG9wZW50ZWxlbWV0cnkvYXV0by1pbnN0cnVtZW50YXRpb25zLW5vZGU=', 'base64').toString(); // @opentelemetry/auto-instrumentations-node
    const pkgExporter = Buffer.from('QG9wZW50ZWxlbWV0cnkvZXhwb3J0ZXItdHJhY2Utb3RscC1odHRw', 'base64').toString(); // @opentelemetry/exporter-trace-otlp-http

    const { NodeSDK } = await import(pkgSdk);
    const { getNodeAutoInstrumentations } = await import(pkgAuto);
    const { OTLPTraceExporter } = await import(pkgExporter);

    const traceExporter = new OTLPTraceExporter({
      url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'https://otlp-gateway-prod-eu-west-2.grafana.net/otlp'}/v1/traces`,
      headers: {
        Authorization: process.env.OTEL_EXPORTER_OTLP_HEADERS || '',
      },
    });

    const sdk = new NodeSDK({
      serviceName: process.env.OTEL_SERVICE_NAME || 'gms-web-app',
      traceExporter,
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-fs': { enabled: false }, // wyłącz zbędny szum operacji na plikach
          '@opentelemetry/instrumentation-nestjs-core': { enabled: false }, // naprawia błąd w Turbopack dev
        }),
      ],
    });

    sdk.start();
  }
}
