import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Root } from './Root';
import { AuthProvider } from './AuthProvider';
import 'focus-visible';

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
