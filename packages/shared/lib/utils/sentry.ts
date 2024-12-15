import { BrowserClient, defaultStackParser, getDefaultIntegrations, makeFetchTransport, Scope } from '@sentry/browser';

const integrations = getDefaultIntegrations({}).filter(defaultIntegration => {
  console.log({ defaultIntegration });
  return !['BrowserApiErrors', 'Breadcrumbs', 'GlobalHandlers'].includes(defaultIntegration.name);
});

export const sentryClient = new BrowserClient({
  dsn: 'https://d9c194b14eed5aa9c8278dd7316cb969@o4508474214514689.ingest.de.sentry.io/4508474223427664',
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  integrations: integrations,
});

const scope = new Scope();
scope.setClient(sentryClient);

export function captureException(error: Error) {
  scope.captureException(error);
}
