# brain-companion

The memory of a Claude Code "brain" (its companion), shared by every machine the brain runs on.
It holds open threads, decisions, videos on their way to public, and the growth loop's months and
experiments. Every record is checked against its kind, and every change is kept as an event with
the machine that made it. Assistants reach it over Strapi's built-in `/mcp` server.

It is a port of the brain's local companion (a SQLite file behind Python scripts) with the same
kinds, statuses, checks and tools. A local plugin for now, to move to npm later.

## MCP tools

| Tool | Does |
| --- | --- |
| `companion__brief` | What a session reads first: open threads, running experiments, the month, videos in flight, Standards; pass `today` (the caller's local date) or it uses the server's UTC date |
| `companion__search` | Every term must match a word of the key, title, fields or tags, as a prefix |
| `companion__list` | Records by kind and/or status |
| `companion__show` | One record with its history |
| `companion__growth` | The growth log as markdown |
| `companion__kinds` | The kinds, statuses, fields and enums |
| `companion__put` | Create or merge a record; a plan unless `confirm: true` (writes) |
| `companion__close` | Close a record with its kind's default status; a plan unless `confirm: true` (writes) |
| `companion__export` | Every record and event as JSON, the same shape as the brain's `recall.py export` |
| `companion__import` | Bring in such an export; idempotent; a count unless `confirm: true` (writes) |

Each tool has its own admin permission, `plugin::brain-companion.tool.<name>`, so a token is
granted only the tools it needs.

## A token for the brain

`/mcp` takes admin-kind tokens only (Settings > API Tokens makes content tokens, which it refuses).
From the app's root, with the app's Node (22):

```bash
node src/plugins/brain-companion/scripts/mint-token.js              # every companion tool
node src/plugins/brain-companion/scripts/mint-token.js --read-only  # no put, close or import
```

It prints `ACCESS_KEY=...` on stdout. Revoke a token in the admin.

## Data

Two content types: `record` (one row per kind and key; the title as `text`, since titles can pass
Postgres's 255-character `string` limit; fields in `payload`, status in `state`,
because Strapi 5 reserves `status`) and `event` (one row per change, never deleted). Records are
never deleted either: a thread is closed, a decision superseded. Both types are hidden from the
Content Manager, so every change goes through the tools: validated, with its event, in one transaction.

## Tests

```bash
node --test src/plugins/brain-companion/test/*.test.js
```

The unit tests run the logic against an in-memory store with made-up records. This repo is
public: never put real brain records in a test, seed or example.
