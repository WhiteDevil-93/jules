# Jules Extension for VSCode

[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
[![Status](https://img.shields.io/badge/status-development-yellow.svg)]
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> "VSCodeでGoogle Julesと共に、コーディングの未来を体験しよう"

Jules Extensionは、GoogleのAIコーディングエージェント**Jules**をVSCode内から直接操作できるようにする拡張機能です。
あなたのコーディングワークフローに、知的なパートナーを迎え入れましょう。

## ✨ コンセプト

この拡張機能は、あなたの開発体験を次のレベルへと引き上げるために作成されました。

- **シームレスな統合:** 使い慣れたVSCode環境を離れることなく、Julesの強力な機能にアクセスできます。
- **リアルタイムな連携:** コーディングセッションの作成から進捗の確認まで、すべてがリアルタイムで行われます。
- **生産性の飛躍:** 面倒な作業はJulesに任せ、あなたは創造的な仕事に集中できます。

## 🚀 主な機能

| 機能 | 説明 | コマンド / アイコン |
| :--- | :--- | :--- |
| **GitHubでサインイン** | GitHubアカウントでサインインし、JulesがプライベートリポジトリのPRステータスを確認できるようにします。 | `jules-extension.signInGitHub` |
| **APIキーの設定** | 初回利用時にAPIキーを設定し、Julesアカウントに接続します。キーはVSCodeのSecretStorageに安全に保存されます。 | `jules-extension.setApiKey` / `$(key)` |
| **セッションの作成** | `> Jules: Create Session`コマンドで、Julesに新しいコーディングタスクを割り当てます。 | `jules-extension.createSession` / `$(add)` |
| **セッションの表示と管理** | Julesの現在の作業状況（`Running`、`Active`、`Done`など）をサイドバーで一覧表示し、管理します。 | `julesSessionsView` / `$(robot)` |
| **進捗の更新** | `↻`（更新）ボタンで、最新のセッション状況とアクティビティリストを即座に取得・表示します。 | `jules-extension.refreshSessions` / `$(refresh)` |
| **アクティビティの表示** | セッションを選択すると、Julesが実行したコマンド、編集したファイル、思考プロセスなどの詳細なログが表示されます。 | `jules-extension.showActivities` |
| **メッセージの送信** | アクティブなセッションに追加の指示やフィードバックを送信します。 | `jules-extension.sendMessage` |
| **プランの承認** | 実行前にJulesが生成したプランを確認し、承認します。 | `jules-extension.approvePlan` / `$(check)` |
| **設定を開く** | 拡張機能に関する設定をGUIで開きます。 | `jules-extension.openSettings` / `$(settings-gear)` |
| **セッションの削除** | ローカルキャッシュからセッションを削除します。 | `jules-extension.deleteSession` / `$(trash)` |

## 📦 インストール

[Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)からインストールしてください。

または、VS Codeの拡張機能ビューで "Jules Extension" を検索してください。

### Marketplaceから（推奨）

1. VSCodeのMarketplaceで "Jules Extension" を検索
2. `インストール`ボタンをクリック

### VSIXファイルから（手動インストール）

まだMarketplaceに公開されていない最新の機能を試したい場合は、リリースページから`.vsix`ファイルを直接ダウンロードしてインストールできます。

1. **リリースページに移動:**
   [GitHub Releases](https://github.com/is0692vs/jules-extension/releases)にアクセスし、最新のリリースバージョンを見つけます。

2. **VSIXファイルをダウンロード:**
   `Assets`から`.vsix`ファイル（例: `jules-extension-0.1.0.vsix`）をダウンロードします。

3. **VSCodeにインストール:**
   - VSCodeを開きます。
   - `拡張機能`ビューに移動します（`Ctrl+Shift+X`）。
   - ビューの上部にある`...`（その他のアクション）メニューをクリックし、`VSIXからのインストール...`を選択します。
   - ダウンロードした`.vsix`ファイルを選択してインストールします。

## 🔑 APIキーの取得

Jules Extensionを利用するには、JulesのAPIキーが必須です。下記の手順に従ってキーを取得してください。

1. **アカウント作成とログイン**
   - [Jules公式サイト](https://jules.google/docs)にアクセスし、アカウントを作成またはログインします。

2. **APIキーの生成**
   - アカウント設定画面にある「APIキー」または「開発者設定」セクションに移動します。
   - 「新しいシークレットキーを作成」をクリックし、キーに任意の名前（例: "VSCode Extension"）を付けて生成します。

3. **キーのコピーと設定**
   - 生成されたAPIキーをコピーします。
   - VSCodeでコマンドパレットを開き（`Ctrl+Shift+P`）、`> Jules: Set Jules API Key` を実行して、コピーしたキーを貼り付けます。

> **重要:** APIキーはパスワードと同様に扱ってください。第三者に漏洩しないよう、Gitリポジトリなどにはコミットしないでください。

## 認証

### GitHub OAuthによるサインイン（推奨）

JulesがリポジトリのPRステータスなどを正確に把握するため、GitHubアカウントでの認証を推奨します。

**認証手順:**
1. コマンドパレット（`Ctrl+Shift+P`）から `> Jules: Sign in to GitHub` を実行します。
2. ブラウザが起動し、GitHubの認証ページにリダイレクトされます。
3. 画面の指示に従い、VSCodeへのアクセスを許可してください。

認証情報は安全に保管され、Julesからのリクエスト時にのみ使用されます。

### GitHub PAT（非推奨）
GitHub Personal Access Token（PAT）による認証は非推奨となりました。将来のバージョンでサポートが終了する予定ですので、OAuthによるサインインへの移行をお願いします。

## ⚙️ 拡張機能の設定

本拡張機能は、以下の設定項目を提供します。VSCodeの `設定` (`Ctrl+,`) から `Jules Extension` を検索して変更できます。

| ID | 説明 | デフォルト値 |
| :--- | :--- | :--- |
| `jules-extension.apiKey` | Jules APIに接続するためのAPIキーです。`Set Jules API Key`コマンドで設定することを推奨します。 | `""` |
| `jules-extension.autoRefresh.enabled` | セッションリストを自動で更新するかどうかを設定します。 | `false` |
| `jules-extension.autoRefresh.interval` | 自動更新の間隔を秒単位で設定します（最小10秒）。 | `30` |
| `jules-extension.customPrompt` | Julesへの全てのリクエストの先頭に自動で付与されるカスタムプロンプトです。永続的な指示として機能します。（例: `常に日本語で応答してください。`） | `""` |
| `jules-extension.hideClosedPRSessions` | クローズまたはマージされたプルリクエストを持つセッションを自動的に非表示にします。 | `true` |
| `jules.defaultBranch` | セッション作成時にデフォルトで選択されるブランチの挙動を定義します。 | `"current"` |

## クイックスタート

1. `Ctrl + Shift + P`（または`Cmd + Shift + P`）を押して、コマンドパレットを開きます。
2. `> Jules: Set Jules API Key`を実行し、APIキーを入力します。
3. サイドバーの`$(robot)`アイコンをクリックして、Julesセッションビューを開きます。
4. `> Jules: Create Jules Session`を実行して、最初のコーディングセッションを開始しましょう！

## コマンド

本拡張機能で利用可能なコマンド一覧です。コマンドパレット (`Ctrl+Shift+P`) から実行できます。

- `Jules: Sign in to GitHub`: GitHubアカウントでサインインします。
- `Jules: Set Jules API Key`: JulesのAPIキーを設定します。
- `Jules: Verify Jules API Key`: APIキーの有効性を検証します。
- `Jules: List Jules Sources`: 利用可能なソース（リポジトリなど）を一覧表示します。
- `Jules: Create Jules Session`: 新しいコーディングセッションを開始します。
- `Jules: Refresh Jules Sessions`: セッションリストを最新の状態に更新します。
- `Jules: Show Jules Activities`: 選択したセッションのアクティビティログを表示します。
- `Jules: Refresh Jules Activities`: アクティビティログを最新の状態に更新します。
- `Jules: Send Message to Jules Session`: アクティブなセッションにメッセージを送信します。
- `Jules: Approve Jules Plan`: Julesが提案したプランを承認します。
- `Jules: Open Jules Settings`: 拡張機能の設定画面を開きます。
- `Jules: Delete Session from Local Cache`: ローカルにキャッシュされたセッションを削除します。
- `Jules: Clear Jules Cache`: 全てのローカルキャッシュを消去します。

## 📚 リンク

- [Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
- [GitHubリポジトリ](https://github.com/is0692vs/jules-extension.git)
- [課題の報告](https://github.com/is0692vs/jules-extension/issues)

## 🤝 コントリビューション

このプロジェクトはまだ始まったばかりです。バグ報告、機能提案、プルリクエストなど、あらゆる形のコントリビューションを歓迎します！
Issue TrackerやPull Requestsをご確認ください。

## 📝 ライセンス

[MIT](LICENSE)
