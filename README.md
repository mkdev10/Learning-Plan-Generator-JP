## AWS Amplify Learning Plan Generator JP
このアプリはワークショプ [Learning Plan Generator with AWS Amplify](https://catalog.us-east-1.prod.workshops.aws/workshops/950b2f47-7b52-46dd-b760-a8144de7f1db/en-US/introduction) で作成できるアプリの日本語化、機能を追加したものです。

2024年7月31日に開催された [Amplify Boost Up #06](https://aws-amplify-jp.connpass.com/event/321534/) にて登壇した際に反響があったのでソースコードを公開しています。

登壇内容については [生成AIを使ってAmplifyGen2を楽しく学べるワークショプをやってみた](https://speakerdeck.com/mkdev10/sheng-cheng-aiwoshi-tuteamplifygen2wole-sikuxue-beruwakusiyopuwoyatutemita) をご覧ください。


### 追加した機能
- UIの日本語化
- 生成結果の日本語化
- 保存した学習プラン詳細の閲覧機能
- 学習プランの削除機能

### 実行手順
プロジェクトの初期化
```sh
npm ci
```

Amplify Sandboxの作成
```sh
npx ampx sandbox
```

Nextローカル環境の作成
```sh
npm run dev
```


### 注意事項
このアプリではBedrockを使用する関係上、対象の生成AIを有効にする必要があります。
手順については元のワークショップをご覧ください。

また生成AIの利用はクレジット（無償クーポン）が利用できません。
多少の課金が発生することはご了承ください。

ローカル環境で開発した都合上、動作保証はできません。

不明点があればお気軽に[X:@_mkdev](https://x.com/mkdev_10)までお問い合わせください。

以下、元のReadme

## AWS Amplify Learning Plan Generator

Learning plan generator is a web app that enables users generate learning plans for different roles (e.g Solutions Architect, Product Designer). This is a NextJs application built with AWS Amplify. Amazon Bedrock is be used to generate questions for rating and the learning plan

## Features
- **Web-based User Interface**: Web interface built with Amplify libraries
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Integration with Amazon Bedrock**
- **Database**: Real-time database powered by Amazon DynamoDB.
- **Authentication**: Setup with Amazon Cognito for secure user authentication.

## Installation

### Clone the Repo
``` git clone repo_url```

### Install Dependencies

Run `npm install`

### Run Project
run `npm run dev`

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/#deploy-a-fullstack-app-to-aws) of our documentation.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.