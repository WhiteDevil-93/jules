# Jules Extension for VSCode (日本語版)

[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
[![Status](https://img.shields.io/badge/status-development-yellow.svg)]
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> "VSCodeでGoogle Julesと共に未来のコーディングを体験しよう"

Jules Extensionは、GoogleのAIコーディングエージェント**Jules**をVSCode内から直接操作できるようにする拡張機能です。
あなたのコーディングワークフローに、知的なパートナーを迎え入れましょう。

## ✨ コンセプト

この拡張機能は、あなたの開発体験を次のレベルへと引き上げるために作られました。

- **シームレスな統合:** 使い慣れたVSCode環境を離れることなく、Julesの強力な機能にアクセスできます。
- **リアルタイムな連携:** コーディングセッションの作成から進捗の確認まで、すべてがリアルタイムで行われます。
- **生産性の飛躍:** 面倒な作業はJulesに任せ、あなたは創造的な仕事に集中できます。

## 🚀 主な機能

| 機能 | 説明 | コマンド / アイコン |
| :--- | :--- | :--- |
| **APIキーの設定** | 初回利用時にAPIキーを設定し、Julesアカウントに接続します。キーはVSCodeのSecretStorageに安全に保管され、以降のリクエストで自動的に使用されます。 | `jules-extension.setApiKey` |
| **APIキーの検証** | API接続をテストし、キーが有効で正常に動作していることを確認します。 | `jules-extension.verifyApiKey` |
| **ソース一覧の表示** | Julesが利用可能なデータソースを閲覧します。 | `jules-extension.listSources` |
| **セッション管理** | `> Jules: Create Session` コマンドで新しいコーディングタスクをJulesに割り当てます。過去のセッションも一覧表示され、いつでも作業を再開したり、完了したタスクの履歴を確認したりできます。 | `jules-extension.createSession` |
| **リアルタイム監視** | Julesの現在の作業状況（`Running`, `Active`, `Done`など）を専用のサイドバービューで一目で確認できます。ブラウザとエディタを行き来する必要はもうありません。 | `julesSessionsView` |
| **進捗の更新** | Julesがどこまで進んだか気になりますか？ `↻` (更新) ボタンをクリックすると、最新のセッション状況とアクティビティリストを即座に取得・表示します。 | `jules-extension.refreshSessions` |
| **アクティビティ表示** | セッションを選択すると、Julesが実行したコマンド、編集したファイル、その思考プロセスなどの詳細なログを表示します。まるでJulesの心の中を覗いているかのような、透明性の高い開発体験を提供します。 | `jules-extension.showActivities` |
| **アクティビティの更新** | 現在のセッションのアクティビティビューを更新し、最新の進捗を確認します。 | `jules-extension.refreshActivities` |
| **メッセージの送信** | アクティブなJulesセッションにフォローアップメッセージを送信し、追加の指示やフィードバックを提供します。 | `jules-extension.sendMessage` |
| **計画の承認** | Julesが生成した計画を実行前にレビューし、承認します。 | `jules-extension.approvePlan` |
| **設定を開く** | Jules拡張機能に関連する設定画面を開きます。 | `jules-extension.openSettings` |
| **GitHubでのサインイン** | OAuth認証を使用してGitHubアカウントに安全にサインインします。 | `jules-extension.signInGitHub` |

## 📦 インストール

[Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)からインストールしてください。

または、VS Codeの拡張機能ビューで "Jules Extension" を検索してください。

### Marketplaceから (推奨)

1. VSCode Marketplaceで "Jules Extension" を検索します。
2. `インストール` ボタンをクリックします。

### VSIXファイルから (手動インストール)

まだMarketplaceに公開されていない最新の機能を試したい場合は、リリースページから`.vsix`ファイルを直接ダウンロードしてインストールできます。

1. **リリースページへ移動:**
   [GitHub Releases](https://github.com/is0692vs/jules-extension/releases)にアクセスし、最新のリリースバージョンを見つけます。

2. **VSIXファイルのダウンロード:**
   `Assets`から`.vsix`ファイル（例: `jules-extension-1.1.1.vsix`）をダウンロードします。

3. **VSCodeでインストール:**
   - VSCodeを開きます。
   - `拡張機能`ビューに移動します (`Ctrl+Shift+X`)。
   - ビューの上部にある `...` (その他のアクション) メニューをクリックし、`VSIXからのインストール...` を選択します。
   - ダウンロードした`.vsix`ファイルを選択してインストールします。

## 🔑 APIキーの取得方法

Jules Extensionを使用するには、JulesのAPIキーが必要です。以下の手順で取得してください：

1. **アカウントの作成:**
   - [Jules公式サイト](https://jules.google/docs)にアクセスします。
   - 新しいアカウントをサインアップするか、既にお持ちの場合はログインします。

2. **APIキーの生成:**
   - アカウントダッシュボードの「API Keys」または「Developer Settings」セクションに移動します。
   - 「Create a new secret key」をクリックします。
   - キーに分かりやすい名前（例: "VSCode Extension"）を付けて生成します。

3. **キーのコピー:**
   - 新しいAPIキーが表示されます。クリップボードにコピーしてください。
   - 後でキーを再度確認する必要がある場合でも、いつでもJulesの設定ページで見つけることができます。

> **重要:** APIキーはパスワードのように扱ってください。公に共有したり、バージョン管理にコミットしたりしないでください。

## 認証

### OAuthサインイン (推奨) ✅

`Jules: Sign in to GitHub` コマンドを使用してください。

**使い方:**

1. コマンドパレット (`Cmd+Shift+P`) を開きます。
2. `Jules: Sign in to GitHub` を実行します。
3. ブラウザで認証を許可します。

---

### GitHub PAT (非推奨) ⚠️

**PATのサポートは非推奨となり、将来のバージョンで削除される予定です。**

OAuthサインインへの移行をお願いします。

## ⚙️ 拡張機能の設定

この拡張機能は以下の設定を提供します：

- `jules-extension.apiKey`: Jules API認証用のAPIキー（安全に保管されます）。
- `jules-extension.autoRefresh.enabled`: セッションリストの自動更新を有効にします（デフォルト: `false`）。
- `jules-extension.autoRefresh.interval`: 自動更新の間隔を秒単位で指定します（デフォルト: `30`, 最小: `10`）。
- `jules-extension.customPrompt`: Julesに送信するすべてのメッセージの先頭に自動的に付加されるカスタムプロンプト。永続的な指示として機能します。
- `jules-extension.hideClosedPRSessions`: クローズまたはマージされたプルリクエストを持つセッションをセッションリストから自動的に非表示にします（デフォルト: `true`）。
- `jules.defaultBranch`: Julesセッション作成時のデフォルトブランチ選択の挙動を定義します（`current`, `default`, `main`から選択）。
- `jules-extension.githubToken`: **[非推奨]** 代わりに `Jules: Set GitHub Token (for PR Status)` コマンドを使用してください。
- `jules.githubPat`: **[非推奨]** 代わりに `Jules: Sign in to GitHub` コマンドを使用してください。

## クイックスタート

1. `Ctrl + Shift + P` (または `Cmd + Shift + P`) を押してコマンドパレットを開きます。
2. `> Jules: Set Jules API Key` を実行し、APIキーを入力します。
3. サイドバーの `$(robot)` アイコンをクリックしてJulesセッションビューを開きます。
4. `> Jules: Create Jules Session` を実行して、最初のコーディングセッションを開始します！

## ⚠️ 注意事項

- **カードブロックのレンダリング:** カードブロックとして表示される機能を使用する際は、コンテンツの構造が正しくレンダリングされるように注意してください。

## コマンド

- `Jules Extension: Set Jules API Key` - API認証情報を設定します。
- `Jules Extension: Verify Jules API Key` - API接続をテストします。
- `Jules Extension: List Jules Sources` - 利用可能なソースを閲覧します。
- `Jules Extension: Create Jules Session` - 新しい分析セッションを開始します。
- `Jules Extension: Refresh Jules Sessions` - セッションリストを再読み込みします。
- `Jules Extension: Show Jules Activities` - セッションのアクティビティを表示します。
- `Jules Extension: Refresh Jules Activities` - アクティビティビューを更新します。
- `Jules Extension: Send Message to Jules Session` - アクティブなセッションに追加の指示を送信します。
- `Jules Extension: Approve Jules Plan` - 生成された計画を実行前に承認します。
- `Jules Extension: Open Jules Settings` - Jules関連の設定を開きます。
- `Jules Extension: Delete Session from Local Cache` - ローカルキャッシュからセッションを削除します。
- `Jules Extension: Set GitHub Token (for PR Status)` - PRステータス確認用のGitHubトークンを設定します。
- `Jules Extension: Clear Jules Cache` - Julesのキャッシュをクリアします。
- `Jules Extension: Sign in to GitHub` - GitHubにサインインします。
- `Jules Extension: [DEPRECATED] Set GitHub PAT` - **[非推奨]** のコマンドです。

## 📚 リンク

- [Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
- [GitHubリポジトリ](https://github.com/is0692vs/jules-extension.git)
- [問題の報告](https://github.com/is0692vs/jules-extension/issues)

## 🤝 コントリビューション

このプロジェクトはまだ始まったばかりです。バグ報告、機能提案、プルリクエストなど、あらゆる形の貢献を歓迎します！
Issue TrackerやPull Requestsをご確認ください。

## 📝 ライセンス

[MIT](LICENSE)
