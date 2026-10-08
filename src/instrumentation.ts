export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');

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
        }),
      ],
    });

    sdk.start();
  }
}
