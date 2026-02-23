# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Telegram bot for group Quran khatam (completion) challenges built with **Deno**, **grammY** (Telegram bot framework), and **Firebase Firestore**. Groups can set a target date, track individual reading progress, and view collective progress toward completing the Quran.

## Running the Bot

```bash
# Local development (polling mode via bot.start() in bot.ts)
deno run --allow-net --allow-env --allow-read bot.ts

# Debug mode
export DEBUG="grammy*"
deno run --allow-net --allow-env --allow-read bot.ts
```

The production entry point is `index.ts` which uses webhook mode via `sift` HTTP server. The development entry point is `bot.ts` which uses grammY's built-in polling.

## Environment Variables

- `BOT_API_KEY` - Telegram Bot API token
- `FIREBASE_CONFIG` - JSON string of Firebase config object

Loaded via `dotenv` in `configs/appConfig.ts`.

## Architecture

### Two-phase command pattern
Bot commands use a prompt-reply pattern: a command handler sends a prompt message asking for input, then the catch-all `bot.on("message")` handler in `bot.ts` matches replies to those prompts by `messageId` and routes them to the appropriate reply trigger.

- `CommandTriggers` — initial command handlers (in `bot-triggers/`)
- `ReplyTriggers` — handlers for user replies to bot prompts (also in `bot-triggers/`)
- Prompt state is tracked via `PromptRes` objects (`{messageId, userId}`) stored in module-level variables in `bot.ts`

### Key modules
- `bot-triggers/` — each file exports a command trigger and optionally a reply trigger
- `db-queries/` — all Firestore operations (single `DbQueries` namespace)
- `utils/CtxDetails.ts` — helper class to extract chatId, userId, userName from grammY context
- `constants/quran.ts` — Quran metadata (total pages)
- `constants/botCommands.ts` — command names and descriptions enum

### Data model
Firestore collection `groups` keyed by chatId. Each document holds `khatamDate`, `khatamPages`, `createdAt`, and a `participants` map keyed by userId containing `{name, pagesRead, lastReadAt}`.

## Conventions

- All imports use Deno-style URL imports (no package.json/node_modules)
- TypeScript with Deno runtime — no build step required
- Date handling uses `dayjs` via esm.sh
