module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "improve",
        "style",
        "break",
        "refactor",
        "perf",
        "fix",
        "docs",
        "note",
        "test",
        "chore",
        "release",
        "preview"
      ]
    ]
  }
}
