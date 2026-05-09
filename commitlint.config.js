module.exports = {
  extends: ["@commitlint/config-conventional"],
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
        "merge",
      ],
    ],
    "subject-max-length": [2, "always", 100],
  },
};
