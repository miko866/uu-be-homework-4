/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
  return {
    globalSetup: '<rootDir>/jest.setup.js',
  };
};
