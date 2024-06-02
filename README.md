# MyPromise

`MyPromise` is a custom implementation of the Promise class, conforming to the Promises/A+ specification. This project provides basic functionality for working with promises, including the methods `then`, `catch`, `finally`, and static methods `resolve`, `reject`, `all`, and `race`.

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [Methods](#methods)
  - [then](#then)
  - [catch](#catch)
  - [finally](#finally)
  - [resolve](#resolve)
  - [reject](#reject)
  - [all](#all)
  - [race](#race)
- [Testing](#testing)
- [License](#license)

## Installation

Clone the repository to your local machine:

```sh
git clone https://github.com/yourusername/mypromise.git
cd mypromise
```

Install the dependencies for testing:

```sh
npm install
```

## Usage

You can use `MyPromise` similar to standard JavaScript promises.

```javascript
const MyPromise = require('./MyPromise');

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('Hello, World!');
  }, 1000);
});

promise.then(value => {
  console.log(value); // 'Hello, World!'
});
```

## Methods

### then

The `then` method is used to add handlers for a promise's fulfillment and rejection.

```javascript
MyPromise.resolve(42).then(value => {
  console.log(value); // 42
});
```

### catch

The `catch` method is used to add a handler for a promise's rejection.

```javascript
MyPromise.reject(new Error('Something went wrong')).catch(error => {
  console.error(error); // Error: Something went wrong
});
```

### finally

The `finally` method is used to add a handler that will be called regardless of the promise's outcome.

```javascript
MyPromise.resolve(42)
  .finally(() => {
    console.log('Cleanup');
  })
  .then(value => {
    console.log(value); // 42
  });
```

### resolve

The static `resolve` method creates a fulfilled promise with the given value.

```javascript
MyPromise.resolve(42).then(value => {
  console.log(value); // 42
});
```

### reject

The static `reject` method creates a rejected promise with the given reason.

```javascript
MyPromise.reject(new Error('Error')).catch(error => {
  console.error(error); // Error: Error
});
```

### all

The static `all` method takes an array of promises and returns a new promise that resolves when all of the promises in the array are resolved, or rejects if any of the promises are rejected.

```javascript
MyPromise.all([MyPromise.resolve(1), MyPromise.resolve(2)])
  .then(values => {
    console.log(values); // [1, 2]
  });
```

### race

The static `race` method takes an array of promises and returns a new promise that resolves or rejects as soon as the first promise in the array resolves or rejects.

```javascript
MyPromise.race([MyPromise.resolve(1), new MyPromise((resolve) => setTimeout(resolve, 100, 2))])
  .then(value => {
    console.log(value); // 1
  });
```

## Testing

To run the tests, use the following command:

```sh
npx mocha test.js
```

The tests are written using `mocha` and `chai`.

### Example Tests

In the `test.js` file, you will find tests for the `then`, `catch`, and `finally` methods, as well as for the static methods `resolve`, `reject`, `all`, and `race`.

```javascript
const { expect } = require('chai');
const MyPromise = require('./MyPromise');

describe('MyPromise', () => {
  // Your tests here...
});
```

---
