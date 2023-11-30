const os = require('os');
const si = require('systeminformation');

function cpuAverage() {
    var totalIdle = 0, totalTick = 0;
    var cpus = os.cpus();
    for (var i = 0, len = cpus.length; i < len; i++) {
        var cpu = cpus[i];
        for (var type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    }
    return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}

function cpuPercent(delay = 1000) {
    return new Promise((resolve) => {
        var startMeasure = cpuAverage();
        setTimeout(function () {
            var endMeasure = cpuAverage();
            var idleDifference = endMeasure.idle - startMeasure.idle;
            var totalDifference = endMeasure.total - startMeasure.total;
            var percentageCPU = 100 - (100 * idleDifference / totalDifference);
            resolve(percentageCPU);
        }, delay);
    });
}

function ramPercent() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const percentUsed = ((totalMemory - freeMemory) / totalMemory) * 100;
    return percentUsed;
}

async function netUsage() {
    return si.networkStats()
        .then(data => {
            return { tranfer: data[0].tx_sec | 0, receive: data[0].rx_sec | 0 };
        })
        .catch(error => { });
}

module.exports = {
    cpuPercent,
    ramPercent,
    netUsage
}