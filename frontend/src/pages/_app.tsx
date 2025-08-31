import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import apiClient from '@/services/api';
import '@/styles/globals.css';

// SWR configuration
const swrConfig = {
  fetcher: (url: string) => apiClient.client.get(url).then(res => res.data),
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  onError: (error: any) => {
    console.error('SWR Error:', error);
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={swrConfig}>
      <Component {...pageProps} />
    </SWRConfig>
  );
}
