console.log('pages.js in messaging_counter');
// chrome.runtime APIを使用して、バックグラウンドページを取得し、マニフェストの詳細を返し、
// アプリケーションライフサイクルまたは拡張ライフサイクルのイベントをリッスンして応答する
// このAPIを使用して、URLの相対パスを完全修飾URLに変換することもできます。
//
// onConnectは拡張プロセスまたはcontents script（runtime.connectによる）からの接続が行われたときに発生する
//
// runtime.connectは
// 拡張機能/アプリケーション（バックグラウンドページなど）内のリスナー、またはその他の拡張機能/アプリケーションへの接続を試みる
// これは拡張プロセス、アプリケーション間/内線通信、Webメッセージングに接続するcontents scriptに便利
// ※contents scriptのリスナーには接続しないので注意。拡張機能はtabs.connectを介してタブに埋め込まれたcontents scriptに接続することがある。
//
// onConnectのコールバックでportオブジェクト（他のページとの双方向通信を可能にするオブジェクト）を返す
// 詳細はhttps://developer.chrome.com/apps/messaging#connect
chrome.runtime.onConnect.addListener(port => {
  console.log(port);
  // port.onMessageはもう一方のポートでpostMessageが呼び出されたときに発火する
  // 最初のパラメータはメッセージで、2番目のパラメータはメッセージを受信したポート
  // そのため今回はmsgにメッセージが格納されている
  port.onMessage.addListener(msg => {
    // もう一方のポートにメッセージを送信する。ポートが切断されると、エラーが投げられる。
    // 送信するメッセージのオブジェクトはJSONでなければいけない。
    port.postMessage({ counter: msg.counter + 1 });
  });
});

// chrome.extension APIには、任意の拡張ページで使用できるユーティリティがあす。
// これには、メッセージパッシング（https://developer.chrome.com/extensions/messaging）で詳しく説明されているように、
// 拡張とcontents script間、または拡張と拡張間のメッセージの交換がサポートされている
// onRequestはDeprecatedなのでruntime.onMessageを使えと書いてあった
// chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
//拡張プロセス（runtime.sendMessageによる）またはコンテンツスクリプト（tabs.sendMessageによる）のいずれかからメッセージが送信されたときに発火する。
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log(msg);
  // あなたが応答したときに呼び出す機能（多くても1回）。引数は任意のJSON可能オブジェクトでなければなりません。
  // 同じドキュメント内に複数のonMessageリスナがある場合、1つだけが応答を送信することができます。
  // イベントリスナーからtrueを返さない限り、この関数はイベントリスナーが返っても無効になります
  // （これは、sendResponseが呼び出されるまで、メッセージチャネルを反対側に開いたままにします）。
  sendResponse({ counter: msg.counter + 1 });
});