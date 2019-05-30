import React from 'react';
import ReactDOM from 'react-dom';

import Index from './pages/index';

const render = () => {
    ReactDOM.render(<Index />, document.querySelector('#root'));
}

render();

// Hot reloading
if (module.hot) {
    // Reload components
    module.hot.accept('./pages/index', () => {
        render();
    });
};
