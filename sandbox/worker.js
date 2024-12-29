const { workerData } = require('worker_threads')
console.log('worker.js: %O', workerData)
