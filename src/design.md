# 設計指針

React + (独自)Flux  
独自Fluxは、RxJSを使って実現しています。


## Actionについて

`Rx.Subject` を作り、これをストリームのソースとします。
ActionCreatorとしてエクスポートした関数の中から、このSubjectの `onNext` を
呼び出すことでストリームにイベントを流します。

ActionそのものはObservableです。
`declareAction` 関数を使って宣言します。
Action名と、ActionとなるObservableを生成する関数を引数に渡します。
この生成関数は、ストリームのソースであるSubjectに、必要に応じて演算を施し、
最終的にできあがったObservableを返します。

Actionは自動的に `Rx.Scheduler.async` でobserveされるようになります。
これは、StoreからActionを発生させたり、
ComponentのcomponentDidMountでActionを発生させたとしても、
Componentの更新がネストしないようにするためです。


## Storeについて

StoreもObservableです。
`declareStore` 関数を使って宣言します。
Store名と、そのStoreが依存する他のStore（必要な場合のみ）、StoreとなるObservableを生成する関数を引数に渡します。
生成関数には引数としてActionと依存するStoreが格納されたObjectが渡されます。
この中からStoreに必要なActionに演算を施し、最終的にできあがったObservableをStoreとして返します。
また、依存する他のStoreのObservableを演算に使っても構いません。

StoreはObservableに直接演算を行って作るため、Dispatcherはありません。

なお、StoreでActionや他のStoreをSubscribeすることはありません。


## Componentについて

StoreをSubscribeして、自身のStateを更新します。
ユーザーによるボタンのクリックなど、処理するイベントハンドラの中でActionCreatorの関数を呼び出します。

