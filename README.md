# chrome-extensions

## What are extensions?
拡張機能はHTML、JavaScript、CSSなどのWeb技術で構築されたブラウザ（Chrome）で動作するソフトウェア。そのため、ブラウザが提供するすべてのAPI(XMLHttpRequest、JSON、HTML5など）を利用できる。

拡張ファイルは、ユーザーがダウンロードしてインストールする単一の.crxパッケージに圧縮される。そのため、拡張機能は通常のWebアプリケーションとは異なり、Webのコンテンツに依存ない。

拡張機能はChromeデベロッパーダッシュボードを介して配布され、Chromeウェブストアに公開される。

## Getting Started Tutorial
https://developer.chrome.com/extensions/getstarted

以下tutorialで利用する主要なAPI

- [chrome.runtime API](https://developer.chrome.com/apps/runtime)
- [chrome.tabs API](https://developer.chrome.com/extensions/tabs)
- [chrome.declarativeContent API](https://developer.chrome.com/extensions/declarativeContent)

## Architecture
多くの拡張機能にはbackground pages（拡張機能のメインロジックを保持する目に見えないページ）がある。

拡張機能には、その拡張機能のUIを表示する他のページも含めることができる。ユーザーが読み込んだWebページと対話する必要がある場合はcontent scriptを使用する必要がある。

### Background pages（Event pages）
`background.html`で定義されたbackground pageには、拡張機能の動作を制御するJavaScriptコードを含めることができる。

background pagesには、永続的な[persistent background pages](https://developer.chrome.com/extensions/background_pages)と[event pages](https://developer.chrome.com/extensions/event_pages)の2種類がある。名前が示すように、persistent background pagesは常に開いておる、event pagesは必要に応じて開閉される。

background pagesを常に実行する必要がある場合を除き、event pagesを利用すべき。

### UI pages
拡張機能には、拡張機能のUIを表示する通常のHTMLページを含めることができる。

たとえば、ブラウザアクションにはポップアップがあり、これはHTMLファイルによって実装される。また、拡張機能には任意のオプションページがあり、拡張機能の動作方法をカスタマイズできる。

`tabs.create`、`window.open()`を使用して、拡張機能に含まれる他のHTMLファイルを表示もできる。

拡張内のHTMLページはお互いのDOMへの完全なアクセスを持ち、お互いの関数を呼び出すことができる。例えばui pages（ポップアップんど）の`popup.html`とbackground pagesの`background.html`はお互いの機能を呼び出すことができるため、コードを複製する必要はない。

### Content scripts
拡張機能がWebページとやりとりする必要がある場合は、content scriptが必要。

content scriptはブラウザに読み込まれたページのコンテキストで実行されるJavaScript。そのため、ブラウザが訪れるウェブページの詳細を読むこみ、ページ内容を変更できる。

content scriptはbackground pageやUI pagesとは切り離されたものなので、background pageなどのDOMを変更することはできないし、機能の共有もできない。

とはいえ、完全に切り離されてはいないため、`sendMessage`、`onMessage`などでやりとりできる。content scriptからbackground pageにメーセージを送ることもできるし、その逆も可能。

## Event pages
background pagesの省エネバージョン。

background pagesは常に実行されているのに対し、event Pagesは「必要なとき」読み込まれ、再びアイドル状態になるとアンロードされる。

以下はEvent Pagesが読み込みされる例。

- アプリまたは拡張機能はが最初にインストールされるか、新しいバージョンに更新された時（[イベントを登録するため](https://developer.chrome.com/extensions/event_pages#registration)）
- event pagesがイベントをリッスンしていて、イベントがディスパッチされた時
- content script、またた他の拡張がメッセージを送信した時（`sendMessage`など）
- 拡張機能の別のビュー（ポップアップなど）が`runtime.getBackgroundPage`を呼び出した時

以下はイベントページの特徴

- 読み込まれると、event pagesはアクティブである限り実行されたままになる
- event pagesはすべての表示可能なビュー（ポップアップウィンドウなど）が閉じられ、すべてのメッセージポートが閉じられるまでアンロードされない
- ビューを開くだけでevent pagesが読み込まれることはないが、読み込まれるとevent pagesは閉じられない
- Chromeのタスクマネージャを開いて、event Pagesの有効期間を確認できる（プロセスのリストに拡張機能のエントリが表示されたときに、event Pagesのロードとアンロードを確認できる）
- event Pagesが短時間（数秒間）アイドル状態になると、 `runtime.onSuspend`イベントが送信される
- event Pagesは強制的にアンロードされる前にこのイベントを処理するのに数秒間ある
- ↑の時間中にevent pagesがロードされるイベントが発生すると、サスペンドはキャンセルされ、`runtime.onSuspendCanceled`イベントが送信される

### Event registration
Chromeは、アプリケーションや拡張機能がリスナーを追加したイベントを追跡する。このようなイベントをディスパッチすると、event pagesがロードされる。

逆に、アプリケーションまたは拡張機能が`removeListener`を呼び出してイベントのすべてのリスナーを削除すると、Chromeはそのイベントのevent pagesを読み込まなくなる。

リスナー自体はevent pagesのコンテキスト内にのみ存在するため、event pagesが読み込まれるたびに`addListener`を使用する必要がある（`runtime.onInstalled`で行うだけでは不十分）

### Best practices when using event pages
一般的な落とし穴を避けるためにevent pagesを使用する場合は、これらのヒントを念頭に置いておく。

1.Event Pagesが読み込まれるたびに、あなたの拡張が関心のあるイベントを受信するために登録します。Event Pagesは、新バージョンのエクステンションごとに1回ロードされます。その後、登録されたイベントを配信するためにのみロードされます。これは、一般に、イベントリスナーをEvent Pagesの最上位レベルのスコープに追加する必要があります。そうでない場合は、Event Pagesがリロードされたときに使用できないことがあります。
1.拡張機能のインストールまたはアップグレード時に初期化を行う必要がある場合は、runtime.onInstalledイベントを待機します。これは、declarativeWebRequestルール、contextMenuエントリ、およびその他のそのようなワンタイム初期化に登録するのに適しています。
1.ブラウザセッション中にランタイム状態をメモリに保持する必要がある場合は、ストレージAPIまたはIndexedDBを使用します。Event Pagesは長時間ロードされないため、実行時状態のグローバル変数に依存することはできません。
1.イベントフィルタを使用して、必要な場合にイベント通知を制限します。たとえば、tabs.onUpdatedイベントをリッスンする場合は、フィルタを使用してwebNavigation.onCompletedイベントを使用してみてください（タブAPIはフィルタをサポートしていません）。そうすることで、あなたのEvent Pagesは興味のあるイベントのためだけに読み込まれます。
1.Event Pagesがシャットダウンする前に最後の2回目のクリーンアップを実行する必要がある場合は、runtime.onSuspendイベントを聞きます。ただし、代わりに定期的に永続化することをお勧めします。そうすることで、拡張機能がonSuspendを受信せずにクラッシュした場合、データは通常失われません。
1.メッセージパッシングを使用している場合は、未使用のメッセージポートを閉じてください。すべてのメッセージポートが閉じられるまで、Event Pagesはシャットダウンしません。
1.コンテキストメニューAPIを使用している場合は、文字列idパラメータをcontextMenus.createに渡し、contextMenus.createのonclickパラメータの代わりにcontextMenus.onClickedコールバックを使用します。
1.Event Pagesがアンロードされてから再ロードされたときに正しく動作することをテストすることを忘れないでください。数秒間使用しないと発生します。一般的な間違いには、ページの読み込み時に不要な作業（拡張機能がインストールされているときにのみ行う必要がある場合）があります。ページロード時にアラームを設定する（以前のアラームをリセットする）。ページ読み込み時にイベントリスナーを追加しないでください。