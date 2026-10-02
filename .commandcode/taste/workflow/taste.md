# Workflow

- Ships projects on Cloudflare using its git-integrated build pipeline: Bun as the package manager/runtime (`bun install --frozen-lockfile`, `bun run build`) plus Wrangler as the deploy command (`npx wrangler deploy`). Deploy/build config lives in the repo (e.g. `wrangler.toml`, README) so the committed setup matches the dashboard build settings. Confidence: 0.6
- Pastes raw build/deploy logs or error output with no commentary and expects the agent to diagnose the root cause and fix the config in the repo. Confidence: 0.5
