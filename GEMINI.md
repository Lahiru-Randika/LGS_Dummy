# Antigravity & Gemini Project Rules: gstack Integration

This project is enabled with the **gstack** AI engineering skill suite adapted for Google Antigravity and Gemini.

## Skills Location & Usage
- Workspace skills are located in `.agents/skills/gstack-*`
- Global skills are registered in `~/.gemini/config/skills/` and `~/.gemini/antigravity-cli/skills/`
- Every skill is invoked via its prefixed command (e.g. `/gstack-office-hours`, `/gstack-review`, `/gstack-qa`, `/gstack-ship`) to prevent collisions with Antigravity built-ins.

## Tool Mappings for Antigravity
- `AskUserQuestion` → `ask_question`
- `Bash` → `run_command`
- `Read` → `view_file` (inspect remaining ranges if lines exceed 800)
- `Write` → `write_to_file`
- `Edit` → `replace_file_content` / `multi_replace_file_content`
- `Grep` → `grep_search`
- `Glob` → `find_by_name`
- `Agent` → `invoke_subagent`
- Plan mode completion → notify user that plan is ready and wait.

## Core Directives
1. **Reuse Ladder**: Before adding code or dependencies, check: (1) repo components, (2) standard APIs, (3) CSS/Tailwind platform features, (4) existing installed npm packages.
2. **Boil the Ocean**: Provide complete implementations with error boundaries, edge case handling, and TypeScript typing.
3. **Investigation Iron Law**: Do not propose or apply speculative bug fixes without root-cause diagnosis via `/gstack-investigate`.
4. **Pre-commit Reviews**: Run `/gstack-review` on diffs before committing or preparing releases with `/gstack-ship`.

For full documentation and skill inventory, see [AGENTS.md](file:///d:/Suleco_Works/LGS/LGS_Tailwind_Only_Full_Project/LGS_Tailwind_Only/AGENTS.md).
