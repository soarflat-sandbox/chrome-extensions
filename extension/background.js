// chrome.runtime APIを使用して、バックグラウンドページを取得し、マニフェストの詳細を返し、
// アプリケーションライフサイクルまたは拡張ライフサイクルのイベントをリッスンして応答する。
// onInstalledは拡張機能が最初にインストールされたとき、拡張機能が新しいバージョンに更新されたとき、
// およびChromeが新しいバージョンに更新されたときに発火する。
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: '#3aa757' }, () => {
    console.log("The color is green.");
  });

  // chrome.declarativeContent APIを使用すると、ページのコンテンツを読み取る権限を必要とせずに、
  // ページのコンテンツに応じてアクションを実行できる。

  // Declarative Content APIを使用すると、WebページのURLとそのコンテンツが一致するCSSページのURLに応じて、
  // ホストのアクセス権やコンテンツスクリプトを挿入する必要なく拡張機能のページアクションを表示できる。
  // ユーザーがページアクションをクリックした後でページとやり取りできるようにするには、activeTab権限を使用する。

  // onPageChangedはaddRules、removeRules、およびgetRulesで構成されるDeclarative Event APIを提供する。
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      // アクションをトリガーできる条件のリスト。
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        // URLのホスト名が指定された文字列と等しい場合にマッチする
        pageUrl: { hostEquals: 'developer.chrome.com' },
      })
      ],
      // 対応する条件が満たされている間、拡張機能のページアクションを有効にする。
      // 拡張機能にactiveTab権限がある場合、ページアクションをクリックするとアクティブなタブへのアクセスが許可される。
      // 今回の場合、該当したページを開いた時にポップアップが有効になり、開くことができる
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
