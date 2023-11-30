const http = require('http');
const {
    cpuPercent,
    ramPercent,
    netUsage
} = require('./utils/systeminfo')

function roundNumber(number, pos = 2) {
    return number.toFixed(pos)
}

const path = require('path')
const fs = require('fs')

http.createServer((req, res) => {
    if (req.url == '/') {
        const filePath = path.join(__dirname, '..', 'public', 'index.html');
        console.log(filePath)
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Internal server error');
            } else {
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
            'Access-Control-Allow-Origin': '*'
        });

        const interval = setInterval(async () => {
            let cpuUsage = roundNumber(await cpuPercent()) / 100;
            let ramUsage = (ramPercent()) / 100;
            let internetUsage = await netUsage();
            res.write(`data: ${JSON.stringify({ cpuUsage, ramUsage, internetUsage })}\n\n`);
        }, 1000);

        req.on('close', () => {
            console.log('Client disconnected');
            clearInterval(interval);
        });
    }
    else if (req.url.includes('/libs')) {
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
