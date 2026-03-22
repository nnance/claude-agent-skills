# Claude Agent Skills

A personal toolbox of skills for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and the [Claude Agent SDK](https://docs.anthropic.com/en/docs/claude-code/agent-sdk). This is a curated collection of skills I use across most of my projects — some authored by me, others collected from the community and adapted to fit my workflow.

## Skills

### Toolchain

Dev tools, project scaffolding, and build configuration.

| Skill | Description |
|-------|-------------|
| **node-ts-cli** | Generate production-ready Node.js CLI projects with TypeScript, ESM, Biome, and Node's built-in test runner. |

### Integrations

Skills for accessing third-party services and APIs.

| Skill | Description |
|-------|-------------|
| **fathom** | Access Fathom meeting recordings, summaries, and transcripts. Requires a `FATHOM_API_KEY` environment variable. |

## Installation

### Claude Code

Install via the Claude Code CLI:

```bash
claude install-skill https://github.com/nnance/claude-agent-skills
```

Once installed, skills are automatically available in your Claude Code sessions — just ask Claude to use them.

### Claude Agent SDK

Add skills to your agent configuration:

```typescript
import { Agent } from "claude-agent-sdk";

const agent = new Agent({
  skills: ["https://github.com/nnance/claude-agent-skills"],
});
```

## Project Structure

```
toolchain/                  # Dev tools and scaffolding
  node-ts-cli/
    SKILL.md
integrations/               # Third-party service integrations
  fathom/
    SKILL.md
    cli/                    # Fathom CLI tool (Node.js >= 22.6)
      src/
        index.ts
        client.ts
      package.json
      tsconfig.json
.claude-plugin/
  marketplace.json          # Skill registry for Claude Code
```
