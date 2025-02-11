const TestSequencer = require('@jest/test-sequencer').default;

const priorityOrder = [
  // 'auth/A_create-user.e2e-spec.ts',
  // 'auth/B_resendEmailValidation.e2e-spec.ts',
  // 'auth/C_verifyEmail.e2e-spec.ts',
  // 'auth/D_resetPassword.e2e-spec.ts',
  'auth/E_login.e2e-spec.ts',
];

class CustomSequencer extends TestSequencer {
  sort(tests) {
    return tests.sort((a, b) => {
      const aIndex = priorityOrder.findIndex((name) => a.path.endsWith(name));
      const bIndex = priorityOrder.findIndex((name) => b.path.endsWith(name));
      return (
        (aIndex === -1 ? Infinity : aIndex) -
        (bIndex === -1 ? Infinity : bIndex)
      );
    });
  }
}

module.exports = CustomSequencer;
