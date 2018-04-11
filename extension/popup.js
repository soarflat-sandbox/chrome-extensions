let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', (data) => {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = (element) => {
  let color = element.target.value;
  console.log(color);

  // chrome.tabs APIを使用して、ブラウザのタブシステムと対話する。
  // このAPIを使用して、ブラウザでタブを作成、変更、再配置できる。
  // executeScriptはJavaScriptコードをページに挿入する。
  // 詳細はhttps://developer.chrome.com/extensions/content_scripts#pi
  chrome.tabs.executeScript(
    { code: `document.body.style.backgroundColor = "${color}";` });
};