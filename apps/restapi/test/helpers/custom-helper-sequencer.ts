const TestSequencer = require('@jest/test-sequencer').default;

const priorityOrder = [
  'auth/A_create-user.e2e-spec.ts',
  'auth/B_verifyEmail.e2e-spec.ts',
  'auth/C_resetPassword.e2e-spec.ts',
];

class CustomSequencer extends TestSequencer {
  sort(tests) {
    return tests.sort((a, b) => {
      const aIndex = priorityOrder.findIndex((name) => a.path.endsWith(name));
      const bIndex = priorityOrder.findIndex((name) => b.path.endsWith(name));
      return aIndex - bIndex;
    });
  }
}

module.exports = CustomSequencer;
