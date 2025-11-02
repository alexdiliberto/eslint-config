module.exports = {
  extends: ['@commitlint/config-conventional'],
  // optional extra guardrails:
  rules: {
    // enforce lower-case types, allow chore by default in this preset
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
  },
};
