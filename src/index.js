import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import './setting';

ReactDOM.render(<App />, document.getElementById('root'));

window.app = window.app ? window.app : {};
window.app.onClosePlugin = function() {

}

