bytes = 1;

const prefix = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'KYB', 'MYB', 'GYB', 'TYB', 'PYB', 'EYB', 'ZYB', 'YYB'];
const toByteCode = function(long) {
    let j = long;
    let str = `${j.toFixed(2)} ${prefix[0]}`;
    for(let i = 1; j >= 1000; i++) {
        j /= 1000;
        str = `${j.toFixed(2)} ${prefix[i]}`;
    }
    return str;
}

const setByteCount = function(amt) {
    bytes += amt;
    $('#bitcount').text(toByteCode(bytes));
    $('title').text(toByteCode(bytes));
}