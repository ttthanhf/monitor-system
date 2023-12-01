const os = require('os');
const si = require('systeminformation');

const { formatDate, secondsToHms } = require('./format')

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

function ramInfo() {
    let totalMemory = os.totalmem();
    let freeMemory = os.freemem();
    let usedMemory = (totalMemory - freeMemory)
    let percentUsed = (usedMemory / totalMemory) * 100;

    return {
        percentUsed,
        totalMemory,
        usedMemory
    };
}

async function swapInfo() {
    const swapData = await si.mem();
    let totalSwap = swapData.swaptotal;
    let usedSwap = swapData.swapused;
    let percentUsed = (usedSwap / totalSwap) * 100;

    return {
        totalSwap,
        usedSwap,
        percentUsed
    }
}

async function diskInfo() {
    const diskData = await si.fsSize();
    let totalDisk = diskData[0].size;
    let usedDisk = diskData[0].used;
    let percentUsed = (usedDisk / totalDisk) * 100;

    return {
        totalDisk,
        usedDisk,
        percentUsed
    }
}

async function netUsage() {
    return si.networkStats()
        .then(data => {
            return { tranfer: data[0].tx_sec | 0, receive: data[0].rx_sec | 0 };
        })
        .catch(error => { });
}

function uptimeServer() {
    return secondsToHms(os.uptime())
}

function timeSystem() {
    let timenow = new Date();
    timenow = formatDate(timenow)
    return timenow;
}

module.exports = {
    cpuPercent,
    ramInfo,
    swapInfo,
    diskInfo,
    netUsage,
    uptimeServer,
    timeSystem
}