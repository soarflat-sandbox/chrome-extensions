console.log('pages.js in messaging_passing');
//メッセージ送信
chrome.runtime.sendMessage({ name: "Joseph" }, (response) => {
  console.log(response);
});