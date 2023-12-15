import React from 'react';
import PropTypes from 'prop-types';
import './assets/css/table-info.css';

class TableInfo extends React.Component {

  getTablesNumber = (tables) => {
    return (tables && Array.isArray(tables)) ? tables.length : 0;
  };

  getRecords = (tables) => {
    let recordsNumber = 0;
    if (!tables) return recordsNumber;
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const rows = table.rows;
      if (rows && Array.isArray(rows)) {
        recordsNumber += rows.length;
      }
    }
    return recordsNumber;
  };

  renderCollaborators = (collaborators) => {
    if (!collaborators || !Array.isArray(collaborators)) {
      return null;
    }
    return collaborators.map((collaborator, index) => {
      return (
        <div key={index} className="collaborator">
          <span className="collaborator-avatar-container">
            <img className="collaborator-avatar" alt='' src={collaborator.avatar_url}/>
          </span>
          <span className="collaborator-name">{collaborator.name}</span>
        </div>
      );
    });
  };

  render() {
    const { tables, collaborators } = this.props;
    return (
      <div>
        <div>{'子表的个数: '}{this.getTablesNumber(tables)}</div><br/>
        <div>{'总的记录数: '}{this.getRecords(tables)}</div><br/>
        <div>{'协作人数量: '}{collaborators ? collaborators.length : 0}</div><br/>
        <div className="plugin-collaborators">{this.renderCollaborators(collaborators)}</div>
      </div>
    );
  }
}

const propTypes = {
  tables: PropTypes.array.isRequired,
  collaborators: PropTypes.array.isRequired,
};

TableInfo.defaultProps = {
  tables: [],
  collaborators: [],
};

TableInfo.propTypes = propTypes;

export default TableInfo;
