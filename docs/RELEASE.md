# Release record — 14 November 2026

- Source repository: https://github.com/meahmadkarim/ChemLab-KG (private).
- Application release commit: `876faf4`.
- GitHub Actions: https://github.com/meahmadkarim/ChemLab-KG/actions/runs/43513062335 — lint, typecheck and all seven unit tests passed. Its optional database-configured build step was skipped; production builds were verified locally and through Vercel separately.
- Local production build: 390 pages, successful. Runtime smoke test and all four desktop/mobile Chrome cases passed against the final local build on port 3001.
- Previous production URL https://chemlab-kg.vercel.app also passed the API smoke suite and four Chrome cases.
- Initial staged release `dpl_CkpXWMBMVhBfubxML7h7hVdmRBqe` was blocked by Vercel because the Git author email differed from the authenticated Vercel owner. The application commit is preserved; this follow-up uses the verified owner email for release attribution.
- Phase comparison and remaining scope: [PHASE_STATUS.md](PHASE_STATUS.md).
