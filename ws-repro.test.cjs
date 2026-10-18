const WebSocket = require('ws');
const { test } = require('node:test');
const assert = require('node:assert/strict');

console.log('Node:', process.version);
console.log('Platform:', process.platform, process.arch);

for (const name of [
  '@nestjs/core',
  '@nestjs/websockets',
  '@nestjs/platform-ws',
  'ws',
]) {
  console.log(`${name}: ${require(`./node_modules/${name}/package.json`).version}`);
}

function request(event, data) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket('ws://127.0.0.1:3055/ws');
    let finished = false;

    const timer = setTimeout(() => {
      finish(new Error(`No response within 5 seconds for "${event}"`));
    }, 5000);

    function finish(error, response) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      socket.terminate();

      if (error) reject(error);
      else resolve(response);
    }

    socket.once('open', () => {
      const message = JSON.stringify({ event, data });
      console.log(`SEND [${event}]: ${message}`);
      socket.send(message);
    });

    socket.once('message', (buffer) => {
      const raw = buffer.toString();
      console.log(`RECEIVE [${event}]: ${raw}`);

      try {
        finish(null, JSON.parse(raw));
      } catch (error) {
        finish(error);
      }
    });

    socket.once('error', (error) => finish(error));

    socket.once('close', () => {
      finish(new Error(`Connection closed before response for "${event}"`));
    });
  });
}

const payload = { text: 'hello', count: 1 };

test('plain return: client receives the payload itself', async () => {
  const response = await request('plain', payload);
  assert.deepStrictEqual(response, payload);
});

test('wrapped return: client receives the event/data object', async () => {
  const response = await request('wrapped', payload);
  assert.deepStrictEqual(response, {
    event: 'reply',
    data: payload,
  });
});

