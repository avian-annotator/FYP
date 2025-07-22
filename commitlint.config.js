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
    'jira-ticket-required': (parsed) => {
    if (!parsed || !parsed.header) {
      return [false, 'No commit header found'];
    }
    const jiraPattern = /\bAA-\d+\b/;
    return jiraPattern.test(parsed.header)
      ? [true]
      : [false, 'Commit message must include Jira ticket in format AA-<number>'];
  },
  },
 
};
