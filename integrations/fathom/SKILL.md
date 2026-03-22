---
name: fathom
description: Access Fathom meeting recordings, summaries, and transcripts. Use when the user asks about meetings, meeting notes, transcripts, or action items from Fathom.
---

# Fathom Meeting Data CLI

Access Fathom meeting recordings, summaries, and transcripts via the CLI.

## Requirements

- `FATHOM_API_KEY` environment variable must be set

## Commands

All commands are run from the repository root:

```bash
node ./integrations/fathom/cli/src/index.ts <command> [options]
```

### list-meetings

List meetings with optional filters.

```bash
node ./integrations/fathom/cli/src/index.ts list-meetings [options]
```

Options:
- `--created-after <date>` — ISO 8601 date filter (after)
- `--created-before <date>` — ISO 8601 date filter (before)
- `--include-summary` — Include meeting summaries
- `--include-transcript` — Include transcripts
- `--include-action-items` — Include action items
- `--calendar-invitees <emails>` — Comma-separated invitee emails
- `--recorded-by <emails>` — Comma-separated recorder emails
- `--cursor <str>` — Pagination cursor

### get-summary

Get the summary for a specific recording.

```bash
node ./integrations/fathom/cli/src/index.ts get-summary <recording-id>
```

### get-transcript

Get the transcript for a specific recording.

```bash
node ./integrations/fathom/cli/src/index.ts get-transcript <recording-id>
```

### download-transcript

Download a transcript to a file.

```bash
node ./integrations/fathom/cli/src/index.ts download-transcript <recording-id> <file-path>
```

## Typical Workflow

1. List recent meetings to find the recording ID:
   ```bash
   node ./integrations/fathom/cli/src/index.ts list-meetings --created-after 2025-01-01T00:00:00Z
   ```

2. Get the summary for a meeting:
   ```bash
   node ./integrations/fathom/cli/src/index.ts get-summary 12345
   ```

3. Get or download the full transcript:
   ```bash
   node ./integrations/fathom/cli/src/index.ts get-transcript 12345
   node ./integrations/fathom/cli/src/index.ts download-transcript 12345 ./transcript.txt
   ```

All commands output JSON to stdout. Errors are written to stderr.
