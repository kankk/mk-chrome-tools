// 获取background对象
const bg = chrome.extension.getBackgroundPage();
const localPrettifyConfig = bg.getPrettifyConfig();

// 初始化本地配置
$('#prettify').find('input[type=checkbox]').each(function () {
  const $this = $(this);
  const id = $this.attr('id');
  let configVal = false;
  if (localPrettifyConfig.hasOwnProperty(id)) {
    configVal = !!localPrettifyConfig[id];
  }
  $this.attr('checked', configVal);
})

// 向content-script发送消息
function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, message, response => {
      if (callback) callback(response);
    });
  });
}

// 初始化所有布局优化的监听事件
$('#prettify').find('input[type=checkbox]').each(function () {
  const $this = $(this);
  const id = $this.attr('id');
  $(`#${id}`).on('change', () => {
    const val = $(`#${id}`).is(':checked');
    bg.setPrettifyItem(id, val);
    sendMessageToContentScript({
      type: 'prettify',
      id: id,
      action: 'reload'
    })
  });
});

$('#tools').find('#tools-url-md').on('click', function(e) {
  sendMessageToContentScript({
    type: 'url-md',
    action: 'fetch'
  }, function(res) {
    console.log(res);
    const resultString = `* [${decodeURIComponent(res.title)}](${decodeURIComponent(res.href)})`;
    const $resultInput = $('#tools').find('#tools-url-md-text');
    $resultInput.val(resultString);
    $resultInput.select();
    document.execCommand('Copy');
  })
});