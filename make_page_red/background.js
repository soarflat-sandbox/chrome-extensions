// chrome.browserAction.onClickedはブラウザのアクションアイコンがクリックされたときに発生する
// ブラウザのアクションにポップアップがある場合、このイベントは発生しない
chrome.browserAction.onClicked.addListener(tab => {
  // 特に権限とか必要なく実行できる
  console.log('Turning ' + tab.url + ' red!');

  // executeScriptはJavaScriptコードをページに挿入する。
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"'
  });
});
