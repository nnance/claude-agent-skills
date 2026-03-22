#!/usr/bin/env node

import { FathomClient } from "./client.ts";

const VERSION = "0.0.1";

function printUsage(): void {
	console.log(`fathom-cli v${VERSION}

Usage: fathom <command> [options]

Commands:
  list-meetings          List meetings with optional filters
  get-summary            Get the summary for a recording
  get-transcript         Get the transcript for a recording
  download-transcript    Download a transcript to a file

Options:
  --help                 Show this help message
  --version              Show version number

list-meetings options:
  --created-after <date>         ISO 8601 date filter (after)
  --created-before <date>        ISO 8601 date filter (before)
  --include-summary              Include meeting summaries
  --include-transcript           Include transcripts
  --include-action-items         Include action items
  --calendar-invitees <emails>   Comma-separated invitee emails
  --recorded-by <emails>         Comma-separated recorder emails
  --cursor <str>                 Pagination cursor

get-summary options:
  <recording-id>                 The recording ID (required)

get-transcript options:
  <recording-id>                 The recording ID (required)

download-transcript options:
  <recording-id>                 The recording ID (required)
  <file-path>                    Output file path (required)

Environment:
  FATHOM_API_KEY                 Fathom API key (required)`);
}

function parseArgs(argv: string[]): {
	command: string;
	flags: Record<string, string | boolean>;
	positional: string[];
} {
	const args = argv.slice(2);
	const flags: Record<string, string | boolean> = {};
	const positional: string[] = [];
	let command = "";

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (!arg) continue;

		if (!command && !arg.startsWith("--")) {
			command = arg;
			continue;
		}

		if (arg.startsWith("--")) {
			const key = arg.slice(2);
			const next = args[i + 1];
			if (next && !next.startsWith("--")) {
				flags[key] = next;
				i++;
			} else {
				flags[key] = true;
			}
		} else {
			positional.push(arg);
		}
	}

	return { command, flags, positional };
}

function getClient(): FathomClient {
	const apiKey = process.env.FATHOM_API_KEY;
	if (!apiKey) {
		console.error("Error: FATHOM_API_KEY environment variable is required.");
		process.exit(1);
	}
	return new FathomClient(apiKey);
}

function requirePositional(
	positional: string[],
	index: number,
	name: string,
): string {
	const value = positional[index];
	if (!value) {
		console.error(`Error: <${name}> is required.`);
		process.exit(1);
	}
	return value;
}

async function listMeetings(
	flags: Record<string, string | boolean>,
): Promise<void> {
	const client = getClient();
	const options: Record<string, unknown> = {};

	if (typeof flags["created-after"] === "string") {
		options.createdAfter = flags["created-after"];
	}
	if (typeof flags["created-before"] === "string") {
		options.createdBefore = flags["created-before"];
	}
	if (flags["include-summary"]) {
		options.includeSummary = true;
	}
	if (flags["include-transcript"]) {
		options.includeTranscript = true;
	}
	if (flags["include-action-items"]) {
		options.includeActionItems = true;
	}
	if (typeof flags["calendar-invitees"] === "string") {
		options.calendarInvitees = flags["calendar-invitees"].split(",");
	}
	if (typeof flags["recorded-by"] === "string") {
		options.recordedBy = flags["recorded-by"].split(",");
	}
	if (typeof flags.cursor === "string") {
		options.cursor = flags.cursor;
	}

	const result = await client.listMeetings(options);
	console.log(JSON.stringify(result, null, 2));
}

async function getSummary(positional: string[]): Promise<void> {
	const client = getClient();
	const recordingId = Number(requirePositional(positional, 0, "recording-id"));
	if (Number.isNaN(recordingId)) {
		console.error("Error: <recording-id> must be a number.");
		process.exit(1);
	}

	const result = await client.getSummary(recordingId);
	console.log(JSON.stringify(result, null, 2));
}

async function getTranscript(positional: string[]): Promise<void> {
	const client = getClient();
	const recordingId = Number(requirePositional(positional, 0, "recording-id"));
	if (Number.isNaN(recordingId)) {
		console.error("Error: <recording-id> must be a number.");
		process.exit(1);
	}

	const result = await client.getTranscript(recordingId);
	console.log(JSON.stringify(result, null, 2));
}

async function downloadTranscript(positional: string[]): Promise<void> {
	const client = getClient();
	const recordingId = Number(requirePositional(positional, 0, "recording-id"));
	if (Number.isNaN(recordingId)) {
		console.error("Error: <recording-id> must be a number.");
		process.exit(1);
	}
	const filePath = requirePositional(positional, 1, "file-path");

	const result = await client.downloadTranscript(recordingId, filePath);
	console.log(result);
}

async function main(): Promise<void> {
	const { command, flags, positional } = parseArgs(process.argv);

	if (flags.help || command === "help") {
		printUsage();
		process.exit(0);
	}

	if (flags.version) {
		console.log(`fathom-cli v${VERSION}`);
		process.exit(0);
	}

	if (!command) {
		printUsage();
		process.exit(1);
	}

	switch (command) {
		case "list-meetings":
			await listMeetings(flags);
			break;
		case "get-summary":
			await getSummary(positional);
			break;
		case "get-transcript":
			await getTranscript(positional);
			break;
		case "download-transcript":
			await downloadTranscript(positional);
			break;
		default:
			console.error(`Error: Unknown command "${command}".`);
			printUsage();
			process.exit(1);
	}
}

main().catch((error) => {
	console.error("Error:", error instanceof Error ? error.message : error);
	process.exit(1);
});
