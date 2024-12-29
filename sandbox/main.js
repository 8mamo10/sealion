const { Worker } = require('worker_threads')
const worker = new Worker('./worker.js', {
  workerData: 'message from main.js',
})
const workerData = [1, 2, 3];
const worker2 = new Worker('./worker2.js', { workerData })
setTimeout(() => console.log('main.js: %O', workerData), 1000)

// signle thread
const { highLoadTask } = require('./load.js');
console.time('total')

console.time('task#1')
highLoadTask();
console.timeEnd('task#1')

console.time('task#2')
highLoadTask();
console.timeEnd('task#2')

console.time('task#3')
highLoadTask();
console.timeEnd('task#3')

console.timeEnd('total')

// multi thread
console.time('total')
const w1 = new Worker('./worker3.js', {
  workerData: 'worker1'
})
const w2 = new Worker('./worker3.js', {
  workerData: 'worker2'
})
const w3 = new Worker('./worker3.js', {
  workerData: 'worker3'
})
Promise.all([
  new Promise(r => w1.on('exit', r)),
  new Promise(r => w2.on('exit', r)),
  new Promise(r => w3.on('exit', r)),
]).then(() => console.timeEnd('total'))