function sleep(value, time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(value);
      resolve(value)
    }, time)
  })
}

async function scheduler(promise_list, limit) {
  let promise_all = []
  let pool = new Set()
  const fn_call = async (fn) => await fn()
  for(let item of promise_list) {
    let promise = fn_call(item)
    pool.add(promise)
    promise_all.push(promise)
    promise.then(res => pool.delete(promise))
    if (pool.size >= limit) {
      await Promise.race(pool)
    }
  }
  return Promise.all(promise_all)
}

const sleeps = [
  () => sleep("hi1", 1100),
  () => sleep("hi2", 500),
  () => sleep("hi3", 1000),
  () => sleep("hi4", 1000),
  () => sleep("hi5", 4000)
]

let start = +new Date()
console.log(await scheduler(sleeps, 1));
console.log((+new Date() - start) / 1000 + 's');
