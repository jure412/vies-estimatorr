import React, { Suspense, useEffect } from 'react';
import {
  Route,
  Switch,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from 'styled-components';
import { PageLoader } from 'components/PageLoader';
import { theme } from 'themes/base';
import { GlobalStyle } from 'styles/GlobalStyle';
import { Login } from 'pages/Login';
import { useAuth } from './AuthProvider';
import { App } from './App';

const Registration = React.lazy(() =>
  import('pages/Registration').then(module => ({
    default: module.Registration,
  }))
);

export const Root: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    return history.listen((_, action) => {
      if (action === 'PUSH') {
        window.scrollTo(0, 0);
      }
    });
  }, [history]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AnimatePresence>
        <Suspense fallback={<PageLoader background="primary" />}>
          <Switch location={location} key={location.pathname}>
            <Route path="/login">
              <AnimatedPage>
                <Login />
              </AnimatedPage>
            </Route>
            <Route path="/signup">
              <AnimatedPage>
                <Registration />
              </AnimatedPage>
            </Route>
            <Route path="/">
              {isAuthenticated ? (
                <AnimatedPage>
                  <App />
                </AnimatedPage>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
          </Switch>
        </Suspense>
      </AnimatePresence>
    </ThemeProvider>
  );
};

const AnimatedPage = styled(motion.div).attrs(() => ({
  initial: 'initial',
  animate: 'in',
  exit: 'out',
  variants: {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  },
}))`
  min-height: 100vh;
`;
