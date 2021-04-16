/**
 * 回调节流
 *
 * @export
 * @param {*} action 回调
 * @param {*} delay 等待的时间
 * @param {*} context this指针
 * @param {Boolean} iselapsed 是否等待上一次
 * @returns {Function}
 */
export default function throttle (action, delay, context, iselapsed) {
    let timeout = null;
    let lastRun = 0;
    return function () {
        if (timeout) {
            if (iselapsed) {
                return;
            } else {
                clearTimeout(timeout);
                timeout = null;
            }
            // return;
        }
        let elapsed = Date.now() - lastRun;
        let args = arguments;
        if (iselapsed && elapsed >= delay) {
            runCallback();
        } else {
            timeout = setTimeout(runCallback, delay);
        }
        /**
         * 执行回调
         */
        function runCallback() {
            lastRun = Date.now();
            timeout = false;
            action.apply(context, args);
        }
    };
}