const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';

class MyPromise {
  constructor(executor) {
    this.value = undefined;
    this.reason = undefined;
    this.status = PENDING;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    let resolve = (value) => {
      if (this.status === PENDING) {
        this.status = RESOLVED;
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    }

    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }

    try {
      executor(resolve, reject);
    }
    catch (e) {
      reject(e);
    }
  }

  then(onFullfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      if (this.status === RESOLVED) {
        setTimeout(() => {
          try {
            let value = typeof onFullfilled === 'function' && onFullfilled(this.value);
            resolveFunctionResult(this, value, resolve, reject);
          }
          catch (e) {
            reject(e);
          }
        }, 0)
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let reason = typeof onRejected === 'function' && onRejected(this.reason);
            resolveFunctionResult(this, reason, resolve, reject);
          }
          catch (e) {
            reject(e);
          }
        }, 0)
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let value = typeof onFullfilled === 'function' && onFullfilled(this.value);
              resolveFunctionResult(this, value, resolve, reject);
            }
            catch (e) {
              reject(e);
            }
          }, 0)
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let reason = typeof onRejected === 'function' && onRejected(this.reason);
              resolveFunctionResult(this, reason, resolve, reject);
            }
            catch (e) {
              reject(e);
            }
          }, 0)
        })
      }
    });
  }

  catch(callback) {
    return this.then(null, callback);
  }
}

function resolveFunctionResult(promise2, value, resolve, reject) {
  if (promise2 === value) {
    console.error('Cannot chain method call by itself');
  }
  let called;
  if (typeof value === 'object' && value !== null || typeof value === 'function') {
    try {
      let then = value.then;
      if (typeof then === 'function') {
        then.call(value, value => {
          if (called) return;
          called = true;
          resolveFunctionResult(promise2, value, resolve, reject);
        }, reason => {
          if (called) return;
          called = true;
          reject(reason);
        })
      }
      else {
        resolve(value)
      }
    }
    catch (e) {
      if (called) return;
      called = true;
      reject(e)
    }
  }
  else {
    resolve(value);
  }
}