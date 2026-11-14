# Living Life Album（週刊・人生のアルバム）— 実装版

30秒のケア音声から、**公的記録**と**家族の面会対話を生む伝記マガジン**を同時生成するAIシステムの実装版です。
（Google AI Challenge 2026 応募作品）

> 自動再生デモ版（サンプルデータ）は別リポジトリ: https://github.com/kenjio-source/living-life-album

## 主な機能

1. **1入力・3変換**：ケア音声の文字起こしから、公的ケア記録・AI人生年表アルバム・面会用質問ガイドを Gemini API で同時生成
2. **時代考証に基づく3つの情景候補選択と画風切替**（昭和絵本風SVG / AI水彩 / 昭和セピア）
3. 音声入力（対応ブラウザのみ。ブラウザ標準の音声認識を使用）

## 使い方

1. [Google AI Studio](https://aistudio.google.com/) でGemini APIキーを発行
2. 画面にAPIキーを貼り付け（保存されません。ページを閉じると消えます）
3. 文字起こしを入力または音声入力し、「3つに変換する」を押す

**注意**：入力内容は Google の Gemini API に送信されます。実在の利用者の個人情報は入力しないでください。AIの出力は必ず職員が確認してください。

## 使用技術

React, Tailwind CSS, Google Gemini API (gemini-2.5-flash), Google Apps Script (GAS), NotebookLM

## 開発

```bash
npm install
npm run dev
npm run deploy
```
