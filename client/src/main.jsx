import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { AuthProvider } from './context/AuthComp.jsx'
import { Provider } from 'react-redux'
import store from './store.js'


const theme = createTheme({
  fontFamily: "Roboto, sans-serif",
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <AuthProvider>
    <MantineProvider theme={theme}>
       <App />
    </MantineProvider>
    </AuthProvider>
    </Provider>
  </StrictMode>,
)
