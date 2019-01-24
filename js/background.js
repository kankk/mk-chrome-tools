const KEY_PRETTIFY = 'KEY_PRETTIFY';

// 读取本地布局优化的缓存
let localPrettifyConfig = {};
const localPrettifyConfigStr = window.localStorage.getItem(KEY_PRETTIFY);
if (localPrettifyConfigStr) {
  localPrettifyConfig = JSON.parse(localPrettifyConfigStr);
}

// 设置布局优化的本地缓存
function setPrettifyItem(key, value) {
  localPrettifyConfig[key] = value;
  window.localStorage.setItem(KEY_PRETTIFY, JSON.stringify(localPrettifyConfig));
}

// 获取布局优化的本地配置
function getPrettifyConfig() {
  return localPrettifyConfig;
}

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === 'prettify') {
    sendResponse(localPrettifyConfig);
  }
});