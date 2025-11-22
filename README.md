# Jules拡張機能 for VSCode

[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
[![Status](https://img.shields.io/badge/status-development-yellow.svg)]
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> "Google Julesと共に、未来のコーディングをVSCodeで体験しよう"

Jules拡張機能は、GoogleのAIコーディングエージェント**Jules**をVSCode内から直接操作できるようにする拡張機能です。
あなたのコーディングワークフローに、知的なパートナーを迎え入れましょう。

## ✨ コンセプト

この拡張機能は、あなたの開発体験を次のレベルに引き上げるために作られました。

- **シームレスな統合:** 使い慣れたVSCode環境を離れることなく、Julesの強力な機能にアクセスできます。
- **リアルタイムな連携:** コーディングセッションの作成から進捗の確認まで、すべてがリアルタイムで行われます。
- **生産性の飛躍:** 面倒な作業はJulesに任せ、あなたは創造的な仕事に集中できます。

## 🚀 主な機能

| 機能                   | 説明                                                                                                                                                                                                                 | コマンド / アイコン                 |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------- |
| **APIキーの設定**        | 初回使用時に、Julesアカウントに接続するためのAPIキーを設定します。キーはVSCodeのSecretStorageに安全に保管され、以降のリクエストで自動的に使用されます。                                                               | `jules-extension.setApiKey`         |
| **APIキーの検証**        | API接続をテストし、キーが有効で正常に動作していることを確認します。                                                                                                                                                  | `jules-extension.verifyApiKey`      |
| **ソースの表示**         | Julesが利用可能なデータソースを閲覧します。                                                                                                                                                                          | `jules-extension.listSources`       |
| **セッション管理**       | `> Jules: Create Session`コマンドを使用して、Julesに新しいコーディングタスクを割り当てます。過去のセッションも一覧表示され、作業の再開や完了したタスクの履歴確認がいつでも可能です。                               | `jules-extension.createSession`     |
| **リアルタイム監視**     | Julesの現在の作業状況（`Running`、`Active`、`Done`など）を専用のサイドバービューで一目で確認できます。ブラウザとエディタを行き来する必要はもうありません。                                                              | `julesSessionsView`                 |
| **進捗の更新**           | Julesがどこまで進んだか気になりますか？`↻`（更新）ボタンをクリックするだけで、最新のセッションステータスとアクティビティリストを即座に取得・表示します。                                                                   | `jules-extension.refreshSessions`   |
| **アクティビティ表示**   | セッションを選択すると、Julesが実行したコマンド、編集したファイル、思考プロセスなどの詳細なログが表示されます。まるでJulesの心の中を覗いているかのような、透明性の高い開発体験を提供します。                       | `jules-extension.showActivities`    |
| **アクティビティの更新** | 現在のセッションのアクティビティビューを更新して、最新の進捗を確認します。                                                                                                                                         | `jules-extension.refreshActivities` |
| **メッセージの送信**     | アクティブなJulesセッションにフォローアップメッセージを送信し、追加の指示やフィードバックを提供します。                                                                                                               | `jules-extension.sendMessage`       |
| **プランの承認**         | Julesが生成したプランを実行前にレビューし、承認します。                                                                                                                                                              | `jules-extension.approvePlan`       |
| **設定を開く**           | Jules拡張機能の設定を開きます。                                                                                                                                                                                      | `jules-extension.openSettings`      |
| **セッションの削除**     | ローカルキャッシュからセッションを削除します。                                                                                                                                                                       | `jules-extension.deleteSession`     |
| **GitHubトークンの設定** | PRのステータスを確認するために、GitHubのパーソナルアクセストークンを安全に設定します。                                                                                                                               | `jules-extension.setGithubToken`    |
| **キャッシュのクリア**   | Jules拡張機能のキャッシュをクリアします。                                                                                                                                                                            | `jules-extension.clearCache`        |
| **GitHubへのサインイン** | GitHubアカウントにサインインして、プライベートリポジトリへのアクセスを許可します。                                                                                                                                 | `jules-extension.signInGitHub`      |

## 📦 インストール

[Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)からインストールします。

または、VSCodeの拡張機能ビューで「Jules Extension」を検索してください。

### Marketplaceから（推奨）

1. VSCode Marketplaceで「Jules Extension」を検索します。
2. `Install`ボタンをクリックします。

### VSIXファイルから（手動インストール）

まだMarketplaceに公開されていない最新の機能を試したい場合は、リリースページから`.vsix`ファイルを直接ダウンロードしてインストールできます。

1. **リリースページに移動:**
   [GitHub Releases](https://github.com/is0692vs/jules-extension/releases)にアクセスし、最新のリリースバージョンを見つけます。

2. **VSIXファイルをダウンロード:**
   `Assets`から`.vsix`ファイル（例: `jules-extension-0.1.0.vsix`）をダウンロードします。

3. **VSCodeにインストール:**
   - VSCodeを開きます。
   - `拡張機能`ビューに移動します（`Ctrl+Shift+X`）。
   - ビューの上部にある`...`（その他のアクション）メニューをクリックし、`Install from VSIX...`を選択します。
   - ダウンロードした`.vsix`ファイルを選択してインストールします。

## 🔑 APIキーの取得方法

Jules拡張機能を使用するには、JulesのAPIキーが必要です。以下の手順で取得してください。

1. **アカウントの作成:**

   - [Jules公式サイト](https://jules.google/docs)にアクセスします。
   - 新規アカウントを登録するか、既にお持ちの場合はログインします。

2. **APIキーの生成:**

   - アカウントダッシュボードの「APIキー」または「開発者設定」セクションに移動します。
   - 「新しいシークレットキーを作成」をクリックします。
   - キーに分かりやすい名前（例：「VSCode拡張機能」）を付けて生成します。

3. **キーのコピー:**
   - 新しいAPIキーが表示されます。クリップボードにコピーしてください。
   - 後で再度キーを確認する必要がある場合でも、Julesの設定ページでいつでも見ることができます。

> **重要:** APIキーはパスワードのように扱ってください。公に共有したり、バージョン管理にコミットしたりしないでください。

## 認証

### OAuthサインイン（推奨）✅

`Jules: Sign in to GitHub`コマンドを使用します。

**使い方:**

1. コマンドパレット（`Cmd+Shift+P`）を開きます。
2. `Jules: Sign in to GitHub`を実行します。
3. ブラウザで認証します。

---

### GitHub PAT（非推奨）⚠️

**PATのサポートは非推奨であり、将来のバージョンで削除される予定です。**

OAuthサインインへの移行をお願いします。

## ⚙️ 拡張機能の設定

本拡張機能は、以下の設定を提供します。

- `jules-extension.apiKey`: 認証用のJules APIキーです（安全に保管されます）。
- `jules-extension.autoRefresh.enabled`: セッションリストの自動更新を有効にします（デフォルト：`false`）。
- `jules-extension.autoRefresh.interval`: 自動更新の間隔を秒単位で指定します（デフォルト：`60`、最小：`10`）。
- `jules-extension.autoRefresh.fastInterval`: 特定の操作中（ブランチ読み込みなど）の自動更新間隔を秒単位で指定します（デフォルト：`30`、最小：`5`）。
- `jules-extension.customPrompt`: Julesに送信するすべてのメッセージの先頭に自動的に付加されるカスタムプロンプトです。永続的な指示として機能します。
- `jules-extension.hideClosedPRSessions`: クローズまたはマージされたプルリクエストを持つセッションをセッションリストから自動的に非表示にします（デフォルト：`true`）。
- `jules.defaultBranch`: Julesセッションを作成する際のデフォルトのブランチ選択動作を定義します。
  - `current`: 現在のGitブランチを使用します。
  - `default`: リポジトリのデフォルトブランチを使用します。
  - `main`: `main`ブランチを使用し、存在しない場合はリポジトリのデフォルトブランチを使用します。

### 非推奨の設定 ⚠️

- `jules-extension.githubToken`: この設定は非推奨です。代わりに`Jules: Set GitHub Token`コマンドを使用してください。
- `jules.githubPat`: この設定は非推奨です。代わりに`Jules: Sign in to GitHub`コマンドによるOAuthサインインを使用してください。

## クイックスタート

1. `Ctrl + Shift + P`（または`Cmd + Shift + P`）を押して、コマンドパレットを開きます。
2. `> Jules: Set Jules API Key`を実行し、APIキーを入力します。
3. サイドバーの`$(robot)`アイコンをクリックして、Julesセッションビューを開きます。
4. `> Jules: Create Jules Session`を実行して、最初のコーディングセッションを開始しましょう！

## ⚠️ 注意事項

- **カードブロックのレンダリング:** カードブロックとして表示される機能を使用する際は、コンテンツの構造が正しくレンダリングされるように注意してください。

## コマンド一覧

- `Jules: Set Jules API Key`: APIクレデンシャルを設定します。
- `Jules: Verify Jules API Key`: API接続をテストします。
- `Jules: List Jules Sources`: 利用可能なソースを閲覧します。
- `Jules: Create Jules Session`: 新しい分析セッションを開始します。
- `Jules: Refresh Jules Sessions`: セッションリストを再読み込みします。
- `Jules: Show Jules Activities`: セッションのアクティビティを表示します。
- `Jules: Refresh Jules Activities`: アクティビティビューを更新します。
- `Jules: Send Message to Jules Session`: アクティブなセッションにフォローアップ指示を投稿します。
- `Jules: Approve Jules Plan`: 生成されたプランの実行を承認します。
- `Jules: Open Jules Settings`: 拡張機能の設定を開きます。
- `Jules: Delete Session from Local Cache`: ローカルキャッシュからセッションを削除します。
- `Jules: Set GitHub Token (for PR Status)`: GitHubトークンを設定します（PRステータス確認用）。
- `Jules: Clear Jules Cache`: 拡張機能のキャッシュをクリアします。
- `Jules: Sign in to GitHub`: GitHubにサインインします。
- `Jules: [DEPRECATED] Set GitHub PAT`: GitHub PATを設定します（非推奨）。

## 📚 関連リンク

- [Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
- [GitHubリポジトリ](https://github.com/is0692vs/jules-extension.git)
- [問題報告](https://github.com/is0692vs/jules-extension/issues)

## 🤝 コントリビューション

このプロジェクトはまだ始まったばかりです。バグ報告、機能提案、プルリクエストなど、あらゆる形の貢献を歓迎します！
Issue TrackerやPull Requestsをご確認ください。

## 📝 ライセンス

[MIT](LICENSE)
