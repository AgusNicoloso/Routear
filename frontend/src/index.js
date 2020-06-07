import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import "./index.scss"
import * as Sentry from '@sentry/browser';
import settings from './settings'
import { store } from './flows'
import { Provider } from 'react-redux'
import "./plugins/font-awesome-4.7.0/css/font-awesome.min.css"
import "./plugins/OwlCarousel2-2.2.1/owl.carousel.css"
import "./plugins/OwlCarousel2-2.2.1/owl.theme.default.css"
import "./plugins/OwlCarousel2-2.2.1/animate.css"
import "./styles/main_styles.css"
import "./styles/responsive.css"
// Sentry
Sentry.init({ dsn: settings.SETNRY_DSN });

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
