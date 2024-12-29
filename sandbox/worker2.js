const { workerData } = require('worker_threads')
console.log("worker2.js %O", workerData)
workerData.push(4, 5, 6);
console.log('worker2.js %O', workerData)

