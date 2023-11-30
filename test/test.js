const si = require('systeminformation');

// Lấy thông tin lưu lượng mạng
function internetUsage() {
    return si.networkStats()
        .then(data => {
            return data;
        })
        .catch(error => { });
}


setInterval(() => {
    internetUsage().then(e => console.log(e))
}, 1000)
