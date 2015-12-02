# 設計指針

React + (独自)Flux  
独自Fluxは、RxJSを使って実現しています。


## Actionについて

Actionごとに `Rx.Subject` を作ります。 

```js
const signInSubject = new Rx.Subject();
```

これを、 `observeOn(Rx.Scheduler.async)` させた結果のObservableをエクスポートします。

```js
export const signInSource = signInSubject.observeOn(Rx.Scheduler.async);
```

また、Subjectの `onNext` を呼び出す関数をAction Creatorとしてエクスポートします。

```js
export function signIn(name, password) {
  signInSubject.onNext({
    name: name,
    password: password,
  });
}
```

`Rx.Scheduler.async` で監視させることで、StoreからActionを発生させたり、
ComponentのcomponentDidMountでActionを発生させたとしても、
Componentの更新がネストしないようにしています。


## Storeについて

StoreもObservableです。
ActionのObservableにoperatorを適用して作ったObservableをStoreとしてエクスポートすることで、
Actionのディスパッチの代わりにします。

```js
// サインイン処理
const signInProcess = AuthActions.signInSource
.map((params) => {
  ...
})
.switch()
.shareReplay(1);

// サインアウト処理
const signOutProcess = AuthActions.signOutSource
.doOnNext(() => {
  Parse.User.logOut();
})
.map(() => Immutable.Map({
  status: AuthStatus.NOT_SIGNED_IN,
  user: null,
}))
.shareReplay(1);

// authStateStore
export default Rx.Observable.merge(signInProcess, signOutProcess)
.startWith(getInitialState())
.shareReplay(1);
```

また、他のStore（＝Observable）をoperatorで使うのもアリです。
これによってStore同士の依存関係ができあがります。（waitForが不要）

```js
// リロードアクションが実行されたとき（サインインしているなら）
const loadTrigger = FamilyMasterActions.reloadSource
.withLatestFrom(authStateStore, (x, y) => y)
.filter(authState => authState.get("status") == AuthStatus.SIGNED_IN);

export default loadTrigger1
.map(() => {
  ...
})
.switch()
.shareReplay(1);
```

ただし、Storeで他のStoreをSubscribeすることはありません。
また、最終的にエクスポートするObservableは最後に `shareReplay` operatorを使っておきます。
こうすることで、Storeを複数箇所でSubscribeしても同じ値が得られるようにします。
また、Storeのoperatorによる副作用が複数回発生しないようにする効果もあります。


## Componentについて

StoreをSubscribeして、自身のStateを更新します。


## 注意点

### Actionは無視されるかも

Actionが発生しても、そのActionを扱うStoreがどこからもSubscribeされていなければ、
そのActionは無視されてしまいます。

サーバーから情報を読み取るだけの非同期処理はStoreでやって問題ありませんが、
サーバーのデータを更新するような非同期処理はAction Creatorのメソッド内で行う方がよいと思います。

