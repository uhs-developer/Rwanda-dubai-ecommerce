import { createClient, fetchExchange } from 'urql';
import { authExchange } from '@urql/exchange-auth';

export const graphqlClient = createClient({
  url: 'http://localhost:8000/graphql',
  fetchOptions: () => {
    const token = localStorage.getItem('auth_token');
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  },
  exchanges: [fetchExchange],
});

