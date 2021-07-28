import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import DTable from 'dtable-sdk';
import TableInfo from './table-info';
import './assets/css/plugin-layout.css';

const propTypes = {
  showDialog: PropTypes.bool
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showDialog: props.showDialog || false,
    };
    this.dtable = new DTable();
  }

  componentDidMount() {
    this.initPluginDTableData();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({showDialog: nextProps.showDialog});
  } 

  async initPluginDTableData() {
    if (window.app === undefined) {
      // local develop
      window.app = {};
      await this.dtable.init(window.dtablePluginConfig);
      this.dtable.subscribe('dtable-connect', () => { this.onDTableConnect(); });
      this.dtable.subscribe('remote-data-changed', () => { this.onDTableChanged(); });
      await this.dtable.syncWithServer();
      this.resetData();
    } else {
      // integrated to dtable app
      this.dtable.initInBrowser(window.app.dtableStore);
      this.dtable.subscribe('remote-data-changed', () => { this.onDTableChanged(); });
      await this.dtable.init(window.dtablePluginConfig);
      this.resetData();
    }
  }

  onDTableConnect = () => {
    this.resetData();
  }

  onDTableChanged = () => {
    this.resetData();
  }

  resetData = () => {
    this.setState({
      isLoading: false,
      showDialog: true
    });
  }

  onPluginToggle = () => {
    this.setState({showDialog: false});
    window.app.onClosePlugin();
  }

  render() {
    let { isLoading, showDialog } = this.state;
    if (isLoading) {
      return '';
    }
    let tables = this.dtable.getTables();
    let collaborators = this.dtable.getRelatedUsers();
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
