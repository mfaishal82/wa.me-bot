# wa.me-bot

## Introduction
This project is a simple WhatsApp bot that uses `wwebjs.dev` and `Gemini` to respond to received messages. The bot can be easily initialized and can respond to messages using a generative model from Gemini.

## Prerequisites
- Node.js
- NPM or Yarn
- WhatsApp account
- Gemini API Key

## Installation
1. Clone this repository:
    ```bash
    git clone https://github.com/mfaishal82/wa.me-bot
    cd wa.me-bot
    ```

2. Install dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3. Create a `.env` file in the root directory of the project and add your Gemini API Key:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

## Running the Bot
To run the bot, use the following command:
    ```
    npm run dev
    ```
    or
    ```
    nodemon app
    ```
Then, wait for the QR code to appear. Scan the QR code with your WhatsApp account. Once the "Client is ready" message appears in the terminal, the bot is ready to use.