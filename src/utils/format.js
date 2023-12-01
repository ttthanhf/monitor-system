function roundNumber(number, pos = 2) {
    return number.toFixed(pos)
}

function formatDate(date) {
    const currentDate = date;

    const hours = ('0' + currentDate.getHours()).slice(-2);
    const minutes = ('0' + currentDate.getMinutes()).slice(-2);
    const seconds = ('0' + currentDate.getSeconds()).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const year = currentDate.getFullYear();

    const timezoneOffsetInMinutes = currentDate.getTimezoneOffset();
    const timezoneOffsetHours = ('0' + Math.floor(Math.abs(timezoneOffsetInMinutes) / 60)).slice(-2);
    const timezoneOffsetMinutes = ('0' + (Math.abs(timezoneOffsetInMinutes) % 60)).slice(-2);
    const timezoneOffsetStr = (timezoneOffsetInMinutes > 0 ? '-' : '+') + timezoneOffsetHours + ':' + timezoneOffsetMinutes;

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thus', 'Fri', 'Sat'];
    const dayOfWeekIndex = currentDate.getDay();
    const dayOfWeek = daysOfWeek[dayOfWeekIndex];

    const formattedDateTime = `${hours}:${minutes}:${seconds} - ${dayOfWeek}, ${day}/${month}/${year} - (${timezoneOffsetStr})`;

    return formattedDateTime;
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : " 0 second";
    return hDisplay + mDisplay + sDisplay;
}

module.exports = {
    roundNumber,
    formatDate,
    secondsToHms
}