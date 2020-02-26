import React from 'react';
import ReactDOM from 'react-dom';
import fs from 'fs';
import App from './app'

class TaskList {

  static execute() {
    let wrapper = document.querySelector('#plugin-wrapper');
    ReactDOM.render(<App showDialog={true} />, wrapper);
  }

}

export default TaskList;

window.app.registerPluginItemCallback('table-info', TaskList.execute);