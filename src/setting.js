const config = {
  APIToken: "xxx",
  server: "xxx",
  workspaceID: "xxx",
  dtableName: "xxx",
  lang: "en"
};

const dtablePluginConfig = Object.assign({}, config, {server: config.server.replace(/\/+$/, "")}) ;
window.dtablePluginConfig = dtablePluginConfig;