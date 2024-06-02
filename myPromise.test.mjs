import { expect } from 'chai';
import MyPromise from './myPromise.mjs';

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

describe('MyPromise', () => {
  describe('Constructor', () => {
    it('should initialize with state PENDING', () => {
      const promise = new MyPromise((resolve, reject) => {});
      expect(promise.state).to.equal(PENDING);
      expect(promise.result).to.be.undefined;
      expect(promise.reason).to.be.undefined;
    });

    it('should resolve correctly', (done) => {
      const promise = new MyPromise((resolve, reject) => {
        resolve('success');
      });

      setTimeout(() => {
        expect(promise.state).to.equal(FULFILLED);
        expect(promise.result).to.equal('success');
        done();
      }, 0);
    });

    it('should reject correctly', (done) => {
      const promise = new MyPromise((resolve, reject) => {
        reject('error');
      });

      setTimeout(() => {
        expect(promise.state).to.equal(REJECTED);
        expect(promise.reason).to.equal('error');
        done();
      }, 0);
    });

    it('should handle exceptions thrown in executor', (done) => {
      const promise = new MyPromise((resolve, reject) => {
        throw new Error('executor error');
      });

      setTimeout(() => {
        expect(promise.state).to.equal(REJECTED);
        expect(promise.reason).to.be.an('error');
        expect(promise.reason.message).to.equal('executor error');
        done();
      }, 0);
    });
  });

  describe('resolve', () => {
    it('should resolve with a value', (done) => {
      MyPromise.resolve(42).then(value => {
        expect(value).to.equal(42);
        done();
      });
    });
  });

  describe('reject', () => {
    it('should reject with a reason', (done) => {
      MyPromise.reject(new Error('Something went wrong')).catch(error => {
        expect(error).to.be.an('error');
        expect(error.message).to.equal('Something went wrong');
        done();
      });
    });
  });

  describe('then', () => {
    it('should chain promises', (done) => {
      MyPromise.resolve(42)
        .then(value => {
          return value + 1;
        })
        .then(value => {
          expect(value).to.equal(43);
          done();
        });
    });

    it('should catch errors in the chain', (done) => {
      MyPromise.resolve(42)
        .then(() => {
          throw new Error('Something went wrong');
        })
        .catch(error => {
          expect(error).to.be.an('error');
          expect(error.message).to.equal('Something went wrong');
          done();
        });
    });
  });

  describe('catch', () => {
    it('should handle rejected promises', (done) => {
      MyPromise.reject(new Error('Something went wrong')).catch(error => {
        expect(error).to.be.an('error');
        expect(error.message).to.equal('Something went wrong');
        done();
      });
    });
  });

  describe('finally', () => {
    it('should call finally handler when the promise is fulfilled', (done) => {
      let finallyCalled = false;

      MyPromise.resolve(42)
        .then(value => {
          expect(value).to.equal(42);
          return value;
        })
        .finally(() => {
          finallyCalled = true;
        })
        .then(value => {
          expect(finallyCalled).to.be.true;
          expect(value).to.equal(42);
          done();
        });
    });

    it('should call finally handler when the promise is rejected', (done) => {
      let finallyCalled = false;

      MyPromise.reject(new Error('Something went wrong'))
        .catch(error => {
          expect(error).to.be.an('error');
          expect(error.message).to.equal('Something went wrong');
          throw error;
        })
        .finally(() => {
          finallyCalled = true;
        })
        .catch(error => {
          expect(finallyCalled).to.be.true;
          expect(error).to.be.an('error');
          expect(error.message).to.equal('Something went wrong');
          done();
        });
    });

    it('should pass the resolved value through finally handler', (done) => {
      MyPromise.resolve(42)
        .finally(() => {
          // some cleanup task
        })
        .then(value => {
          expect(value).to.equal(42);
          done();
        });
    });

    it('should pass the rejection reason through finally handler', (done) => {
      MyPromise.reject(new Error('Something went wrong'))
        .finally(() => {
          // some cleanup task
        })
        .catch(error => {
          expect(error).to.be.an('error');
          expect(error.message).to.equal('Something went wrong');
          done();
        });
    });

    it('should handle the case where finally handler throws an error', (done) => {
      MyPromise.resolve(42)
        .finally(() => {
          throw new Error('Error in finally');
        })
        .then(() => {
          done(new Error('Expected promise to be rejected'));
        })
        .catch(error => {
          expect(error).to.be.an('error');
          expect(error.message).to.equal('Error in finally');
          done();
        });
    });

    it('should handle the case where finally handler returns a promise', (done) => {
      MyPromise.resolve(42)
        .finally(() => {
          return new Promise(resolve => setTimeout(resolve, 100));
        })
        .then(value => {
          expect(value).to.equal(42);
          done();
        });
    });
  });

  describe('all', () => {
    it('should resolve when all promises resolve', (done) => {
      const promise1 = MyPromise.resolve(1);
      const promise2 = MyPromise.resolve(2);
      const promise3 = MyPromise.resolve(3);

      MyPromise.all([promise1, promise2, promise3]).then(values => {
        expect(values).to.deep.equal([1, 2, 3]);
        done();
      });
    });

    it('should reject when one of the promises rejects', (done) => {
      const promise1 = MyPromise.resolve(1);
      const promise2 = MyPromise.reject(new Error('Failed'));
      const promise3 = MyPromise.resolve(3);

      MyPromise.all([promise1, promise2, promise3]).catch(error => {
        expect(error).to.be.an('error');
        expect(error.message).to.equal('Failed');
        done();
      });
    });
  });

  describe('race', () => {
    it('should resolve with the first resolved promise', (done) => {
      const promise1 = new MyPromise(resolve => setTimeout(resolve, 500, 'one'));
      const promise2 = new MyPromise(resolve => setTimeout(resolve, 100, 'two'));

      MyPromise.race([promise1, promise2]).then(value => {
        expect(value).to.equal('two');
        done();
      });
    });

    it('should reject with the first rejected promise', (done) => {
      const promise1 = new MyPromise((resolve) => setTimeout(resolve, 500, 'one'));
      const promise2 = new MyPromise((_, reject) => setTimeout(reject, 100, 'error'));

      MyPromise.race([promise1, promise2]).catch(error => {
        expect(error).to.equal('error');
        done();
      });
    });
  });
});
