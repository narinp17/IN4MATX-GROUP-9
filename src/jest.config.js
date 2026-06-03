/* eslint-disable */
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["src/lib/**/*.js", "src/pages/**/*.jsx"],
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text", "lcov"],
};