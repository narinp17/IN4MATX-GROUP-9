# Friendli — Test Suite

Everything you need is in this folder.

## Structure

```
tests/
├── all.test.js                  ← master test file (run this)
├── unit/
│   ├── location.test.js
│   ├── interests.test.js
│   ├── blackout.test.js
│   └── timeAgo.test.js
├── integration/
│   ├── ping.test.js
│   └── nearby.test.js
└── coverage/
    └── index.html               ← open in browser to view coverage report
```

## How to run

```bash
npm install
npx jest tests/all.test.js
```

## View coverage report

Just open `coverage/index.html` in your browser (double-click the file).