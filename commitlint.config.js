module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "style",
        "test",
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "subject-case": [2, "always", ["sentence-case", "lower-case"]],
    "subject-full-stop": [2, "never", "."],
    "header-min-length": [2, "always", 10],
  },
};
