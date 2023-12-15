import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import TableInfo from './table-info';

import './assets/css/plugin-layout.css';

const propTypes = {
  isDevelopment: PropTypes.bool,
  showDialog: PropTypes.bool,
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showDialog: props.showDialog || false,
    };
  }

  componentDidMount() {
    this.initPluginDTableData();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({showDialog: nextProps.showDialog});
  }

  async initPluginDTableData() {
    if (this.props.isDevelopment) {
      // local develop
      window.dtableSDK.subscribe('dtable-connect', () => { this.onDTableConnect(); });
    }
    this.resetData();
    window.dtableSDK.subscribe('remote-data-changed', () => { this.onDTableChanged(); });
  }

  onDTableConnect = () => {
    this.resetData();
  };

  onDTableChanged = () => {
    this.resetData();
  };

  resetData = () => {
    this.setState({
      isLoading: false,
      showDialog: true
    });
  };

  onPluginToggle = () => {
    this.setState({showDialog: false});
    window.app.onClosePlugin();
  };

  render() {
    let { isLoading, showDialog } = this.state;
    if (isLoading) {
      return '';
    }
    const { collaborators } = window.app.state;
    const tables = window.dtableSDK.getTables();
    return (
      <Modal isOpen={showDialog} toggle={this.onPluginToggle} className="dtable-plugin plugin-container" size='lg'>
        <ModalHeader className="test-plugin-header" toggle={this.onPluginToggle}>{'插件'}</ModalHeader>
        <ModalBody className="test-plugin-content">
          <TableInfo tables={tables} collaborators={collaborators}/>
        </ModalBody>
      </Modal>
    );
  }
}

App.propTypes = propTypes;

export default App;
