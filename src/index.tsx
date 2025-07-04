import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import { CookiesProvider } from 'react-cookie'; // Import CookiesProvider
import App from './app';

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <CookiesProvider> 
        <App />
      </CookiesProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);