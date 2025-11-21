import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import { Provider as UrqlProvider } from 'urql'
import { graphqlClient } from './lib/graphqlClient'
import { AppRouter } from './router/AppRouter.tsx'
import './index.css'
import './i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UrqlProvider value={graphqlClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AppRouter />
      </ThemeProvider>
    </UrqlProvider>
  </React.StrictMode>,
)
