const currentHostname = location.hostname;
const currentPathname = location.pathname;

const MAX_TRY_COUNT = 10;
const PRE_TRY_OFFSET = 500;

// 递归探测页面
// detectFn(Function): 执行detectCb的条件
// detectCb(Function): 探测的回调函数
function detectPage(detectFn, detectCb, time) {
  time = time || 0;
  if (time >= MAX_TRY_COUNT) return;
  if (detectFn()) {
    detectCb();
    return;
  } else {
    setTimeout(() => {
      detectPage(detectFn, detectCb, time + 1);
    }, PRE_TRY_OFFSET)
  }
}

// 美化掘金文章
function prettifyJuejinArticle() {
  // 移除头部Header
  detectPage(() => $('.main-header-box').length > 0, () => {
    $('.main-header-box').remove();
  });
  // 移除右侧边栏
  detectPage(() => $('.sidebar').length > 0, () => {
    $('.sidebar').remove();
  });
  // 移除文章头部图片
  detectPage(() => $('.article-hero').length > 0, () => {
    $('.article-hero').remove();
  });
  // 文章区域宽度设置为100%
  detectPage(() => $('.main-area').length === 2, () => {
    $('.main-area').css('width', '100%');
  });
  // 移除反馈按钮
  detectPage(() => $('.meiqia-btn').length > 0, () => {
    $('.meiqia-btn').remove();
  });
  // 移除左侧悬浮栏
  detectPage(() => $('.article-suspended-panel').length > 0, () => {
    $('.article-suspended-panel').remove();
  });
}

function prettifyJuejin() {
  // 移除右侧边栏
  detectPage(() => $('.index-aside').length > 0, () => {
    $('.index-aside').remove();
    $('.timeline-entry-list').css('width', '100%');
    $('.user-action-nav').css('width', '100%');
  });
  // 移除反馈按钮
  detectPage(() => $('.meiqia-btn').length > 0, () => {
    $('.meiqia-btn').remove();
  });
}

if (currentHostname === 'juejin.im') {  // 掘金
  if (/^\/post\//.test(currentPathname)) {  // 掘金文章页
    prettifyJuejinArticle();
  } else {  // 掘金其他页面
    prettifyJuejin();
  }
}