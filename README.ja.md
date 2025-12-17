# VSCode用 Jules拡張機能

[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
[![Status](https://img.shields.io/badge/status-development-yellow.svg)]
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> "Google Julesと共に、未来のコーディングをVSCodeで体験しよう"

Jules拡張機能は、GoogleのAIコーディングエージェント**Jules**をVSCode内から直接操作できるようにする拡張機能です。
あなたのコーディングワークフローに、知的なパートナーを迎え入れましょう。

## ✨ コンセプト

この拡張機能は、あなたの開発体験を次のレベルへと引き上げるために作成されました。

- **シームレスな統合:** 使い慣れたVSCode環境を離れることなく、Julesの強力な機能にアクセスできます。
- **リアルタイムな連携:** コーディングセッションの作成から進捗の確認まで、すべてがリアルタイムで行われます。
- **生産性の飛躍:** 面倒な作業はJulesに任せ、あなたは創造的な仕事に集中できます。

## 🚀 主な機能

| 機能 | 説明 | コマンド / アイコン |
| :--- | :--- | :--- |
| **APIキーの設定** | 初回利用時にAPIキーを設定し、Julesアカウントに接続します。キーはVSCodeのSecretStorageに安全に保管され、以降のすべてのリクエストで自動的に使用されます。 | `Jules: Set Jules API Key` |
| **APIキーの検証** | API接続をテストし、キーが有効で正常に動作することを確認します。 | `Jules: Verify Jules API Key` |
| **ソースの表示** | Julesが作業可能なデータソースを一覧表示します。 | `Jules: List Jules Sources` |
| **セッションの作成** | `> Jules: Create Jules Session` コマンドで、新しいコーディングタスクをJulesに割り当てます。過去のセッションも一覧表示され、いつでも作業を再開したり、完了したタスクの履歴を確認したりできます。 | `Jules: Create Jules Session` |
| **リアルタイム監視** | 専用のサイドバービューで、Julesの現在の作業状況（`Running`、`Active`、`Done`など）を一目で確認できます。もうブラウザとエディタを行き来する必要はありません。 | `julesSessionsView` (View) |
| **セッションの更新** | Julesがどこまで進んだか気になりますか？ `↻` (更新) ボタンをクリックすると、最新のセッション状況とアクティビティリストを即座に取得して表示します。 | `Jules: Refresh Jules Sessions` |
| **アクティビティの表示** | セッションを選択すると、Julesが実行したコマンド、編集したファイル、その思考プロセスなどの詳細なログが表示されます。まるでJulesの心の中を覗いているかのような、透明性の高い開発体験を提供します。 | `Jules: Show Jules Activities` |
| **アクティビティの更新** | 現在のセッションのアクティビティビューを更新し、最新の進捗を確認します。 | `Jules: Refresh Jules Activities` |
| **メッセージの送信** | アクティブなJulesセッションにフォローアップメッセージを送信し、追加の指示やフィードバックを提供します。 | `Jules: Send Message to Jules Session` |
| **プランの承認** | Julesが生成した計画を実行前にレビューし、承認します。 | `Jules: Approve Plan` |
| **設定を開く** | Jules拡張機能の設定を開きます。 | `Jules: Open Settings` |
| **セッションの削除** | ローカルキャッシュからセッションを削除します。 | `Jules: Delete Session from Local Cache` |
| **GitHubトークンの設定** | PRのステータスを確認するために、GitHubのパーソナルアクセストークンを設定します。 | `Jules: Set GitHub Token (for PR Status)` |
| **キャッシュのクリア** | Jules拡張機能のキャッシュをクリアします。 | `Jules: Clear Jules Cache` |
| **GitHubへのサインイン** | GitHubアカウントにサインインします。 | `Jules: Sign in to GitHub` |

## 📦 インストール

[Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)からインストールしてください。

または、VS Codeの拡張機能ビューで "Jules Extension" を検索してください。

### Marketplaceから (推奨)

1. VSCode Marketplaceで "Jules Extension" を検索します。
2. `インストール` ボタンをクリックします。

### VSIXファイルから (手動インストール)

まだMarketplaceで公開されていない最新の機能を試したい場合は、リリースページから `.vsix` ファイルを直接ダウンロードしてインストールできます。

1. **リリースページへ移動:**
   [GitHub Releases](https://github.com/is0692vs/jules-extension/releases) にアクセスし、最新のリリースバージョンを見つけます。

2. **VSIXファイルをダウンロード:**
   `Assets` から `.vsix` ファイル（例: `jules-extension-0.1.0.vsix`）をダウンロードします。

3. **VSCodeにインストール:**
   - VSCodeを開きます。
   - `拡張機能` ビューに移動します (`Ctrl+Shift+X`)。
   - ビューの上部にある `...` (その他のアクション) メニューをクリックし、`VSIXからのインストール...` を選択します。
   - ダウンロードした `.vsix` ファイルを選択してインストールします。

### 特定のバージョンをインストールする

特定のバージョンの拡張機能をインストールするには：

1. [GitHubリリースページ](https://github.com/is0692vs/jules-extension/releases)にアクセスします。
2. インストールしたいバージョンを見つけ、その `Assets` から `.vsix` ファイルをダウンロードします。
3. 上記の「VSCodeにインストール」の手順に従います。

## 🔑 APIキーの取得方法

Jules拡張機能を使用するには、JulesのAPIキーが必要です。以下の手順で取得してください：

1. **アカウントの作成:**

   - [Jules公式サイト](https://jules.google/docs)にアクセスします。
   - 新規アカウントを登録するか、既にお持ちの場合はログインします。

2. **APIキーの生成:**

   - アカウントのダッシュボードで、「APIキー」または「開発者設定」セクションに移動します。
   - 「新しいシークレットキーを作成」をクリックします。
   - キーに分かりやすい名前（例：「VSCode拡張機能」）を付けて生成します。

3. **キーのコピー:**
   - 新しいAPIキーが表示されます。クリップボードにコピーしてください。
   - 後でキーを再確認する必要がある場合は、いつでもJulesの設定ページで見つけることができます。

> **重要:** APIキーはパスワードのように扱ってください。公に共有したり、バージョン管理にコミットしたりしないでください。

## 認証

### OAuthサインイン (推奨) ✅

`Jules: Sign in to GitHub` コマンドを使用してください。

**使い方:**

1. コマンドパレット (`Cmd+Shift+P`)
2. `Jules: Sign in to GitHub` を実行
3. ブラウザで認証

---

### GitHub PAT (非推奨) ⚠️

**PATのサポートは非推奨となり、将来のバージョンで削除される予定です。**

OAuthサインインへの移行をお願いします。

## ⚙️ 拡張機能の設定

この拡張機能は以下の設定を提供します:

- `jules-extension.apiKey`: 認証用のJules APIキー（安全に保管されます）。
- `jules-extension.autoRefresh.enabled`: セッションリストの自動更新を有効にします（デフォルト: `false`）。
- `jules-extension.autoRefresh.interval`: 自動更新の間隔（秒）（デフォルト: `60`、最小: 10）。
- `jules-extension.autoRefresh.fastInterval`: 特定の操作中（ブランチの読み込みなど）の自動更新間隔（秒）。最小: 5。（デフォルト: `30`）。
- `jules-extension.customPrompt`: Julesに送信するすべてのメッセージの先頭に自動的に付加されるカスタムプロンプト。
- `jules-extension.hideClosedPRSessions`: クローズまたはマージされたプルリクエストを持つセッションをセッションリストから自動的に非表示にします（デフォルト: `true`）。
- `jules.defaultBranch`: Julesセッション作成時のデフォルトブランチ選択の挙動 (`current`, `default`, `main`)。

### 非推奨の設定 ⚠️

- `jules-extension.githubToken`: この設定は非推奨です。代わりに `Jules: Set GitHub Token` コマンドを使用してください。
- `jules.githubPat`: この設定は非推奨です。代わりに `Jules: Sign in to GitHub` コマンドを使用してください。

## クイックスタート

1. `Ctrl + Shift + P` (または `Cmd + Shift + P`) を押してコマンドパレットを開きます。
2. `> Jules: Set Jules API Key` を実行し、APIキーを入力します。
3. サイドバーの `$(robot)` アイコンをクリックして、Julesセッションビューを開きます。
4. `> Jules: Create Jules Session` を実行して、最初のコーディングセッションを開始しましょう！

## ⚠️ 注意事項

- **カードブロックのレンダリング:** カードブロックとして表示される機能を使用する際は、コンテンツの構造が正しくレンダリングされるように注意してください。

## 📚 リンク

- [Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
- [GitHubリポジトリ](https://github.com/is0692vs/jules-extension)
- [問題の報告](https://github.com/is0692vs/jules-extension/issues)

## 🤝 コントリビューション

このプロジェクトはまだ始まったばかりです。バグ報告、機能提案、プルリクエストなど、あらゆる形の貢献を歓迎します！
Issue TrackerやPull Requestsをご確認ください。

## 📝 ライセンス

[MIT](LICENSE)
