module.exports = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      // Allow compound types like perf/seo, perf/security
      headerPattern: /^(\w+(?:\/\w+)?)(?:\(([^)]*)\))?!?:\s(.+)$/,
      headerCorrespondence: ["type", "scope", "subject"],
    },
  },
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "test",
        "docs",
        "chore",
        "ci",
        "infra",
        "style",
        "perf",
        "perf/seo",
        "perf/security",
        "merge",
      ],
    ],
    "subject-max-length": [2, "always", 100],
  },
};
