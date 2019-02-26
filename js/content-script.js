const currentHostname = location.hostname;
const currentPathname = location.pathname;

const MAX_TRY_COUNT = 10;
const PRE_TRY_OFFSET = 500;

let localPrettifyConfig = {};
let localType = '';

// 添加监听函数
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'prettify' && request.id === localType) {
    if (request.action === 'reload') {
      window.location.reload();
    }
  }
});

// 获取后台配置
function getBackgroundConfig() {
  chrome.runtime.sendMessage('prettify', response => {
    localPrettifyConfig = response;
    run();
  });
}

function run() {
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

  // 优化掘金文章网页布局
  function prettifyJuejinArticle() {
    // 移除头部Header
    $('.main-header-box').remove();
    // 移除右侧边栏
    $('.sidebar').remove();
    // 移除文章头部图片
    detectPage(() => $('.article-hero').length > 0, () => {
      $('.article-hero').remove();
    });
    // 文章区域宽度设置为100%
    $('.main-area').css('width', '100%');
    // 移除反馈按钮
    $('.meiqia-btn').remove();
    // 移除左侧悬浮栏
    $('.article-suspended-panel').remove();
  }

  function prettifyJuejinBook() {
    detectPage(() => $('.book-content__header').length > 0, () => {
      $('.book-content__header').remove();
      $('.book-summary').hide();
      $('.book-content').css('margin-left', '0px');
      $('.book-body').css('padding-top', '0px');
    });

    window.onkeydown = function (e) {
      if (e.keyCode == 16) {  // shift
        console.log(e.keyCode);
        $('.book-summary').toggle();
      }
    }
  }

  function prettifyJuejin() {
    // 移除右侧边栏
    detectPage(() => $('.index-aside').length > 0, () => {
      $('.index-aside').remove();
      $('.user-action-nav').remove();
      $('.main-header-box').remove();
      $('.view-nav').remove();
      $('.meiqia-btn').remove();
      $('.timeline-entry-list').css('width', '100%');
      $('.user-action-nav').css('width', '100%');
    });
  }

  function prettifyZhihuArticle() {
    $('.AppHeader').remove(); // 移除悬浮头部
    $('.QuestionHeader-side').remove(); // 移除头部关注人数
    $('.QuestionHeader-tags').remove(); // 移除头部标签
    $('.QuestionHeader-footer').remove(); // 移除头部页脚
    $('.Question-sideColumn').remove(); // 移除侧边广告栏
    $('.Question-mainColumn').css('width', '100%'); // 主题内容设置为100%宽度
    setTimeout(() => {
      $('button[data-tooltip="建议反馈"]').each(function () {
        const $this = $(this);
        $this.parent().remove();
      })
    }, 3000);
  }

  function prettifyZhihu() {
    $('.AppHeader').remove(); // 移除悬浮头部
    $('.GlobalSideBar').remove(); // 移除右侧广告栏
    $('.Topstory-mainColumn').css('width', '100%'); // 主体内容设置为100%宽度
    setTimeout(() => {
      $('button[data-tooltip="建议反馈"]').each(function () {
        const $this = $(this);
        $this.parent().remove();
      })
    }, 3000);
  }

  function prettifyCSDNArticle() {
    $('#csdn-toolbar').remove(); // 移除头部
    $('.article_info_click').remove(); // 移除头部'更多'按钮
    $('aside').remove(); // 移除侧边栏
    $('.pulllog-box').remove(); // 移除底部蒙层
    $('.recommend-right').remove(); // 移除右侧推荐栏
    $('[id^=dmp_ad]').remove(); // 移除广告
    $('.recommend-box').remove(); // 移除推荐文章栏目
    $('.indexSuperise').remove(); // 移除超级广告
    $('.meau-gotop-box').remove(); // 移除右下角悬浮栏
    $('.tool-box').remove(); // 移除工具栏
    $('#mainBox').css({
      'display': 'flex',
      'justify-content': 'center'
    }); // 主体内容设置样式
    $('#mainBox main').css('width', '80%'); // 主体内容设置为100%宽度
    $('iframe').remove(); // 移除所有iframe
    detectPage(() => $('#btn-readmore').length > 0, () => {
      $('#btn-readmore')[0].click();
    });
  }

  if (currentHostname === 'juejin.im') { // 掘金
    localType = 'juejin';
    if (!localPrettifyConfig['juejin']) return;
    if (/^\/post\//.test(currentPathname)) { // 掘金文章页
      prettifyJuejinArticle();
    } else if (/^\/book\//.test(currentPathname)) { // 掘金小册页
      prettifyJuejinBook();
    } else { // 掘金其他页面
      prettifyJuejin();
    }
  } else if (currentHostname === 'www.zhihu.com') { // 知乎
    localType = 'zhihu';
    if (!localPrettifyConfig['zhihu']) return;
    if (/^\/question\//.test(currentPathname)) { // 知乎文章页
      prettifyZhihuArticle();
    } else { // 知乎其他页面
      prettifyZhihu();
    }
  } else if (currentHostname === 'blog.csdn.net') { // csdn
    localType = 'csdn';
    if (!localPrettifyConfig['csdn']) return;
    if (/\/article\/details\//.test(currentPathname)) { // csdn文章页
      prettifyCSDNArticle();
    }
  }
}

getBackgroundConfig();