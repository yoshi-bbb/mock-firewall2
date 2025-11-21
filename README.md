# Gatekeeper AI Firewall

AIエージェントと物理アクチュエータを監視・制御するためのコントロールルームUIモックアップです。

## 機能

- **ダッシュボード**: 全体のステータス監視、緊急停止（E-STOP）ボタン
- **エージェント管理**: 個別のAIエージェントの停止・再開・隔離
- **インシデントログ**: 自動停止や手動介入の監査ログ
- **緊急モード**: 全システムを強制停止する緊急モード

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## GitHub Pagesへのデプロイ手順

このリポジトリにはGitHub Actionsのワークフローが含まれており、`main`ブランチにプッシュするだけで自動的にデプロイされます。

1. **リポジトリの初期化とプッシュ**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git push -u origin main
```

2. **GitHubでの設定**

1. GitHubリポジトリのページを開きます。
2. **Settings** > **Pages** に移動します。
3. **Source** の設定を確認します。`.github/workflows/deploy.yml` が存在するため、通常は自動的に **GitHub Actions** がソースとして選択されます。
   - もし "Deploy from a branch" になっている場合は、特に変更しなくてもActionsが優先されることが多いですが、Actionsタブでワークフローが走っているか確認してください。
4. デプロイが完了すると、同ページに公開URLが表示されます（例: `https://<USERNAME>.github.io/<REPO>/`）。

## 技術スタック

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (Icons)
- Recharts (Charts)
