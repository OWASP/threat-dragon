// https://stackoverflow.com/a/53486112

export default function (fn, delay) {
    let timeoutID = null;
    return function () {
        clearTimeout(timeoutID);
        const args = arguments;
        const that = this;
        timeoutID = setTimeout(function () {
            fn.apply(that, args);
        }, delay);
    };
}
