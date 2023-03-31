class Scheduler {
  constructor() {
    this.queue = [];
    this.maxCount = 2; // 同时执行的最大任务数
    this.runningCount = 0; // 当前正在执行的任务数
  }

  add(promiseCreator) {
    this.queue.push(promiseCreator);
  }

  start() {
    for (let i = 0; i < this.maxCount; i++) {
      this.next();
    }
  }

  next() {
    if (!this.queue.length || this.runningCount >= this.maxCount) {
      return;
    }

    this.runningCount++;

    const promiseCreator = this.queue.shift();
    const task = promiseCreator();

    task.then(() => {
      this.runningCount--;
      this.next();
    });
  }
}

// 示例使用
const timeout = time => new Promise(resolve => setTimeout(resolve, time));
const scheduler = new Scheduler();

const addTask = (time, order) => {
  scheduler.add(() => timeout(time).then(() => console.log(order)));
};

addTask(4000, 1);
addTask(1000, 2);
addTask(3000, 3);
addTask(2000, 4);

scheduler.start();
