# gstack for Antigravity & Gemini — Engineering Workflow

gstack is an AI engineering workflow providing specialized roles across the software development lifecycle: CEO reviewer, eng manager, designer, QA lead, security auditor, and release engineer.

All skills are adapted for **Google Antigravity** and **Gemini**, located in `.agents/skills/` (and globally in `~/.gemini/antigravity-cli/skills` and `~/.gemini/config/skills`).

---

## Tool & Environment Glossary (Antigravity)

When executing gstack skills, map tool directives as follows:
- **`AskUserQuestion`** → `ask_question` tool (options presented as choices).
- **`Bash`** → `run_command` tool.
- **`Read`** → `view_file` tool. Note that `view_file` defaults to reading up to 800 lines; when reading a long skill or file, inspect remaining line ranges with `StartLine`/`EndLine` before completing the action.
- **`Write`** → `write_to_file` tool.
- **`Edit`** → `replace_file_content` (or `multi_replace_file_content` for multiple edits in a single file).
- **`Grep`** → `grep_search`.
- **`Glob` / `Find`** → `find_by_name`.
- **`Agent`** → `invoke_subagent`.
- **Plan Mode / `ExitPlanMode`** → Notify the user that the plan is complete, present the choices/findings, and await confirmation.

---

## The Sprint Workflow

Skills run in sprint order:

$$\text{Think} \longrightarrow \text{Plan} \longrightarrow \text{Build} \longrightarrow \text{Review} \longrightarrow \text{Test} \longrightarrow \text{Ship} \longrightarrow \text{Reflect}$$

### 1. Think
- `/gstack-office-hours`: 6 forcing questions challenging problem framing, finding the narrowest wedge, and producing a comprehensive design doc.

### 2. Plan
- `/gstack-plan-ceo-review`: Challenge scope and discover the 10-star product experience.
- `/gstack-plan-eng-review`: Lock architecture, state machines, ASCII data flows, failure modes, and test matrices.
- `/gstack-plan-design-review`: Rate 10 design dimensions (0-10) and refine UX before writing UI code.
- `/gstack-plan-devex-review`: Evaluate Developer Experience, onboarding, and time-to-hello-world (TTHW).
- `/gstack-autoplan`: Runs CEO → Design → DX → Eng review in sequence, resolving automated gates.
- `/gstack-spec`: Turn vague intent into an executable specification with mandatory code-reading.

### 3. Build & Design
- `/gstack-design-shotgun`: Generate multiple design alternatives with comparison boards.
- `/gstack-design-html`: Transform mockups into clean, production-ready HTML/Tailwind/CSS with zero bloat.
- `/gstack-deslop-shared-libs`: Detect duplicate code and recommend clean shared extractions.
- `/gstack-investigate`: Systematic root-cause debugging. Iron law: no fixes without investigation.

### 4. Review
- `/gstack-review`: Staff engineer review. Catches production edge cases, race conditions, and gate integrity.
- `/gstack-cso`: Security audit covering OWASP, authentication, authorization, and data validation.
- `/gstack-test-audit`: Audit existing test suites to remove brittle or low-value tests.
- `/gstack-design-review`: Live UI audit with before/after visual inspection.

### 5. Test
- `/gstack-qa`: End-to-end testing across browser, API, CLI, or workers. Reproduces bugs and writes regression tests.
- `/gstack-qa-only`: Exploratory testing and reporting without code mutations.
- `/gstack-browse`: Headless/headed Chromium browser engine for interactive testing and DOM exploration.
- `/gstack-scrape`: Extract structured data from pages.

### 6. Ship & Release
- `/gstack-ship`: Sync branch, verify test suite, review diff, bump version, update changelog, and open PR.
- `/gstack-land-and-deploy`: Merge PR, monitor CI, and verify deployment health.
- `/gstack-canary`: Post-deploy monitoring loop watching for console errors and regressions.
- `/gstack-benchmark`: Baseline performance metrics (Core Web Vitals, page load).
- `/gstack-document-release`: Audit changed behavior against documentation.
- `/gstack-document-generate`: Author comprehensive documentation using the Diataxis framework.

### 7. Reflect & Operational Memory
- `/gstack-retro`: Engineering retrospective analyzing shipping velocity and codebase health.
- `/gstack-learn`: Search, review, and manage cross-session learnings.
- `/gstack-health`: Codebase health dashboard (types, linter, tests, dead code).
- `/gstack-upgrade`: Keep gstack skills and runtime components up to date.

---

## Engineering Ethos

- **Boil the Ocean**: AI makes completeness cheap. Implement complete solutions including tests, edge cases, and proper error handling. Shortcuts require explicit recorded decisions.
- **Search Before Building**: Thoroughly check the existing codebase and patterns before writing new code.
- **User Sovereignty**: Models recommend; the user decides. Confirm direction before making architectural pivots.
- **Build for Yourself**: Concrete problems beat hypothetical generality.

## The Reuse Ladder

Before writing new code, stop at the first rung that holds:
1. A helper, component, or pattern already in this repository.
2. Standard library / runtime capabilities.
3. Native platform features (Tailwind / CSS over JavaScript, DB constraints over application checks).
4. An already-installed package (`package.json`) — avoid adding new dependencies when existing ones suffice.

## Communication Voice

- Direct, concrete, builder-to-builder.
- Always name the file, component, function, or command.
- Focus on user-visible impact without unnecessary AI boilerplate.
