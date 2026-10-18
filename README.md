# NestJS WsAdapter return-value reproduction

Reproduction for:
https://github.com/nestjs/docs.nestjs.com/pull/3623

## Tested environment
- Node.js 24.19.0
- Windows x64
- @nestjs/core, @nestjs/websockets, @nestjs/platform-ws: 12.1.3
- ws: 8.22.0

## Run
In the first terminal:

    npm ci
    npm run build
    node dist/main.js

Wait for WS_REPRO_READY, then run in a second terminal:

    node --test ws-repro.test.cjs

The server listens at ws://127.0.0.1:3055/ws.

## Observed results
Both handlers receive {"text":"hello","count":1}.

- return data:
  Client receives {"text":"hello","count":1}

- return { event: 'reply', data }:
  Client receives {"event":"reply","data":{"text":"hello","count":1}}

Both automated assertions passed: 2 tests, 0 failures.
The captured output is in ws-repro-results.txt.

For this object payload, WsAdapter sends the returned value as JSON
without automatically adding an event/data envelope.

This experiment does not cover primitive, null, or undefined returns.
