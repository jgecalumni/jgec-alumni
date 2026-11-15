# Workspace Guidelines

## Context Mode Usage
- **Always use `context-mode`**:
  - Prioritize `context-mode` MCP tools (`ctx_execute`, `ctx_search`, `ctx_index`, `ctx_batch_execute`, etc.) whenever analyzing, inspecting, searching, counting, comparing, or deriving information across files, directories, codebases, logs, or execution results.
  - Compute, filter, and summarize within sandboxed code so raw output never floods the conversation context.
