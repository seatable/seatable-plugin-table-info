# Seatable 插件开发流程

在这个指南中，我们会一步步的演示怎么给 SeaTable 写一个扩展。这个扩展可以显示表格基本信息，包括

- 子表的个数
- 总的记录数
- 协作人数目

插件开发实例的代码很简单，你可以点击这个 github 链接获取源码 (https://github.com/seatable/seatable-plugin-table-info)。

插件开发流程如下。

## 插件开发基本流程

### 1. 克隆插件开发模板

克隆插件开发模板（ seatable-plugin-template）到本地

~~~bash
git clone https://github.com/seatable/seatable-plugin-template.git
~~~

安装依赖

~~~bash
cd seatable-plugin-template
npm install
~~~

### 2. 修改插件配置

修改 plugin-config 文件夹中 info.json 配置文件

```
"name": '',                   // 插件英文名字，只能包含字母、数字、下划线、中划线
"version": '',                // 插件版本号
"display_name": '',           // 插件显示的名字
"description": '',            // 插件功能相关描述
```

这里不需要添加其他配置参数，其他参数由打包工具自动生成。

可选操作

- 在 plugin-config 文件夹中添加自定义的 icon.png 作为插件的图标（可不提供，采用默认图标。icon.png 要求是 128x128 像素)
- 在 plugin-config 文件夹中添加自定义的 card_image.png 作为插件图标的背景图（可不提供，显示默认背景。card_image.png 要求是 1840x400 像素，实际显示为 920x200 像素，这是为了在高清屏上显示不会模糊)

### 3. 修改插件开发配置文件

修改 src 文件夹中的 settings.js 配置文件，配置文件用于本地开发获取 dtable 数据。

```js
const config = {
  APIToken: "**",               // 需添加插件的 dtable 的 apiToken
  server: "**",                 // 需添加插件的 dtable 的部署网址
  workspaceID: "**",            // 需添加插件的 dtable 所在的 workspace 的 id 值
  dtableName: "**",             // 需添加插件的 dtable 的名字
  lang: "**"                    // 插件默认语言类型，en 或者 zh-cn
};
```


### 4. 开始开发

运行本地开发环境

~~~bash
npm start
~~~

在浏览器上打开 localhost:3000 可以看到插件对话框已经打开，对话框中默认显示 dtable-value 和 dtable-collaborators 信息

主要代码及用途

/src/index.js 本地开发插件的入口文件

/src/entry.js 与 Seatable 协同开发的入口文件

/src/App.js 插件主要代码

### 5. 显示表格基本信息

写一个 TableInfo 的组件，这个组件需要传入 tables 和 collaborators 两个 Props

~~~jsx
class TableInfo extends React.Component {

  getTablesNumber = (tables) => {
    return (tables && Array.isArray(tables)) ? tables.length : 0;
  }

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
  }

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
  }

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
}

TableInfo.propTypes = propTypes;

export default TableInfo;
~~~

在父组件 App.js 中调用 TableInfo 组件，并修改 App.js 中的 render 函数，传入 tables 和 collaborators。

~~~jsx
import TableInfo from './table-info';

class App extends React.Component{
  render() {
    let tables = dtableStore.value.tables;
    return (
      <Modal isOpen={showDialog} toggle={this.onPluginToggle} contentClassName="dtable-plugin plugin-container" size='lg'>
        <ModalHeader className="test-plugin-header" toggle={this.onPluginToggle}>{'插件'}</ModalHeader>
        <ModalBody className="test-plugin-content">
          <TableInfo tables={tables} collaborators={collaborators}/>
        </ModalBody>
      </Modal>
    );
  }
}
~~~

新增 /css/table-info.css 文件，修改插件的样式。

即可在浏览器上 localhost: 3000 看到下面的信息。

~~~md
子表的个数: X
总的记录数: XXX
协作人数量: X
~~~

## 5. 打包上传插件

1. 执行 npm run build-plugin 打包插件，打包后插件的路径为 /plugin/task.zip 

2. 上传插件到 dtable 中
