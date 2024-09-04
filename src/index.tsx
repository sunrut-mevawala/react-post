import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AppRoutes from './routes/routes';
import { BrowserRouter } from 'react-router-dom';
import HeaderComponent from './packages/component/homeComponent/headerComponent';
import CategoryTable from './packages/component/Operations/CategoryTable';
import ProductTable from './packages/component/Operations/ProductTable';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
     <HeaderComponent/>
      <AppRoutes/>  
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
