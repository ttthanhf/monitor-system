const http = require('http');
const {
    cpuPercent,
    ramInfo,
    swapInfo,
    diskInfo,
    netUsage,
    uptimeServer
} = require('./utils/systeminfo')

const path = require('path')
const fs = require('fs')

const args = process.argv.slice(2);
let customURL = '';
if (args.length < 1) {
    customURL = 'http://localhost:10000/';
} else {
    customURL = args[0];
}

http.createServer((req, res) => {
    if (req.url == '/') {
        const filePath = path.join(__dirname, '..', 'public', 'index.html');
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Internal server error');
            } else {
                customURL = customURL.charAt(customURL.length - 1) == '/' ? customURL : customURL + "/";
                content = content.replace('REPLACE_WITH_DYNAMIC_URL', customURL + "stream");
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    }
    else if (req.url === '/stream') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'X-Accel-Buffering': 'no'
        });

        const interval = setInterval(async () => {
            let cpuUsage = await cpuPercent() / 100;

            let ramUsage = ramInfo();
            ramUsage.percentUsed = ramUsage.percentUsed / 100;

            let swapUsage = await swapInfo();
            swapUsage.percentUsed = swapUsage.percentUsed / 100;

            let diskUsage = await diskInfo();
            diskUsage.percentUsed = diskUsage.percentUsed / 100;

            let internetUsage = await netUsage();

            let uptime = uptimeServer();

            res.write(`data: ${JSON.stringify({ cpuUsage, ramUsage, internetUsage, uptime, swapUsage, diskUsage })}\n\n`);

        }, 1000);

        req.on('close', () => {
            clearInterval(interval);
        });
    }
    else if (req.url.includes('/libs') || req.url.includes('/js')) {
        const filePath = path.join(__dirname, '..', 'public', req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found!');
            } else {
                res.writeHead(200);
                res.end(data);
            }
        });
    }
    else {
        res.writeHead(404);
        res.end();
    }
}).listen(10000);
