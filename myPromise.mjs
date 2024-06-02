const FULFILLED = 'fulfilled'
const PENDING = 'pending'
const REJECTED = 'rejected'

export default class MyPromise {
  constructor(executor) {
    this.state = PENDING
    this.result = undefined
    this.reason = undefined

    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED
        this.result = value

        this.onFulfilledCallbacks.forEach((fn) => fn(value))
      }
    }

    const reject = (error) => {
      if (this.state === PENDING) {
        this.state = REJECTED
        this.reason = error

        this.onRejectedCallbacks.forEach((fn) => fn(error))
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : result => result
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    return new MyPromise((resolve, reject) => {
      const fulfilledTask = () => {
        try {
          const x = onFulfilled(this.result)

          resolvePromise(x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }

      const rejectedTask = () => {
        try {
          const x = onRejected(this.reason)

          resolvePromise(x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }

      if (this.state === FULFILLED) {
        queueMicrotask(fulfilledTask)
      } else if (this.state === REJECTED) {
        queueMicrotask(rejectedTask)
      } else if (this.state === PENDING) {
        this.onFulfilledCallbacks.push(() => queueMicrotask(fulfilledTask));
        this.onRejectedCallbacks.push(() => queueMicrotask(rejectedTask));
      }
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(onFinally) {
    return this.then((result) => {
      return MyPromise.resolve(onFinally()).then(() => result)
    }, (reason) => {
      return MyPromise.resolve(onFinally()).then(() => { throw reason })
    })
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise(resolve => resolve(value))
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason))
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let results = []
      let completed = 0

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then((result) => {
          results[index] = result
          completed += 1

          if (completed === promises.length) {
            resolve(results)
          }
        }, (reason) => {
          reject(reason)
        })
      })
    })
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        MyPromise.resolve(promise).then(resolve, reject)
      })
    })
  }
}

function resolvePromise(x, resolve, reject) {
  if (x === this) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
}
