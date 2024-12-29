const workerData = require('worker_threads')
const { highLoadTask } = require('./load.js')
console.time(workerData);
highLoadTask();
console.timeEnd(workerData);