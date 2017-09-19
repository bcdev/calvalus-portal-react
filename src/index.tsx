import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import {reducers} from './reducers';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

const logger = createLogger({
    level: 'info',
    collapsed: true,
    diff: true
});

const middleware = applyMiddleware(
    thunkMiddleware,
    logger
);

const store = createStore(reducers, middleware);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
