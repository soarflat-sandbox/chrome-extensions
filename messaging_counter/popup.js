function setChildTextNode(elementId, text) {
  document.getElementById(elementId).innerText = text;
}

function testMessage() {
  setChildTextNode('resultsMessage', 'running...');
  // chrome.tabs APIを使用して、ブラウザのタブシステムと対話します
  // このAPIを使用して、ブラウザでタブを作成、変更、再配置できます。
  // 指定されたプロパティを持つすべてのタブ、またはプロパティが指定されていない場合はすべてのタブを取得します。
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const callback = (response) => {
      console.log(response);
      if (response.counter < 1000) {
        chrome.tabs.sendMessage(tab.id, { counter: response.counter }, callback);
      } else {
        setChildTextNode('resultsMessage', 'End');
      }
    };
    chrome.tabs.sendMessage(tab.id, { counter: 1 }, callback);
  });
}

function testConnect() {
  setChildTextNode('resultsConnect', 'running...');

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // 指定したタブのコンテンツスクリプトに接続します。
    // runtime.onConnectイベントは、現在の拡張機能の指定されたタブで実行されている各コンテンツスクリプトで発生します。
    // 詳細については、「コンテンツスクリプトメッセージング」を参照してください。
    const port = chrome.tabs.connect(tabs[0].id);
    port.postMessage({ counter: 1 });
    port.onMessage.addListener(function getResp(response) {
      console.log(response);
      if (response.counter < 1000) {
        port.postMessage({ counter: response.counter });
      } else {
        setChildTextNode('resultsConnect', 'End');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#testMessage').addEventListener(
    'click', testMessage);
  document.querySelector('#testConnect').addEventListener(
    'click', testConnect);
});