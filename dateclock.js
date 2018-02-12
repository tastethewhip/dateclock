// Lunisolar Date Clock. (c) JP 2009 (concept). (c) JP 2018 (code).

// 1hr Day didn’t update after midnight, see screenshots, on airplane mode.
// 1hr Start outlines “on”, turn off after pageload.
// 2hr Cookie settings.
// 2hr Troubleshoot older iOS.
// 8hr Add lunar calculations.
// 2hr Audit performance. Minify. Reactify.

document.addEventListener('DOMContentLoaded', function () {
    function focusMonth (evt) {
        els.handMonth.classList.add('focus');
        els.supertitleMonth.classList.add('focus');
        els.digitMonth.classList.add('focus');
    }
    function blurMonth (evt) {
        els.handMonth.classList.remove('focus');
        els.supertitleMonth.classList.remove('focus');
        els.digitMonth.classList.remove('focus');
    }
    function focusDay () {
        els.handDay.classList.add('focus');
        els.supertitleDay.classList.add('focus');
        els.digitDay.classList.add('focus');
    }
    function blurDay () {
        els.handDay.classList.remove('focus');
        els.supertitleDay.classList.remove('focus');
        els.digitDay.classList.remove('focus');
    }
    function focusHour () {
        els.handHour.classList.add('focus');
        els.supertitleHour.classList.add('focus');
        els.digitHour.classList.add('focus');
    }
    function blurHour () {
        els.handHour.classList.remove('focus');
        els.supertitleHour.classList.remove('focus');
        els.digitHour.classList.remove('focus');
    }
    function focusMinute () {
        els.handMinute.classList.add('focus');
        els.supertitleMinute.classList.add('focus');
        els.digitMinute.classList.add('focus');
    }
    function blurMinute () {
        els.handMinute.classList.remove('focus');
        els.supertitleMinute.classList.remove('focus');
        els.digitMinute.classList.remove('focus');
    }
    function focusSecond () {
        els.handSecond.classList.add('focus');
        els.supertitleSecond.classList.add('focus');
        els.digitSecond.classList.add('focus');
    }
    function blurSecond () {
        els.handSecond.classList.remove('focus');
        els.supertitleSecond.classList.remove('focus');
        els.digitSecond.classList.remove('focus');
    }
    function drawPipMonth () { // Draw 1 thru 12.
        let i, el, degs;
        for (i = 1; i <= 12; i++) {
            el = i % 3 - 1 === 0 ? document.createElement('strong') : document.createElement('span');
            el.textContent = i;
            degs = (i - 1) / 12 * 360; // Subtract 1 for 1-index (natural count).
            el.style.transform = `rotate(${degs}deg)`;
            els.pipMonth.appendChild(el);
        }
    }
    function drawPipDay (datetime = new Date()) { // Draw 1 thru 28, 29, 30, or 31.
        let daysInMonth = getDaysInMonth(datetime);
        let i, el, degs;
        els.pipDay.innerHTML = '';
        for (i = 1; i <= daysInMonth; i++) {
            el = i % 7 - 1 === 0 ? document.createElement('strong') : document.createElement('span');
            el.textContent = i;
            degs = (i - 1) / daysInMonth * 360; // Subtract 1 for 1-index (natural count).
            el.style.transform = `rotate(${degs}deg)`;
            els.pipDay.appendChild(el);
        }
        numberOfDayPips = daysInMonth;
    }
    function drawPipHour () { // Draw 0 thru 23.
        let i, el, degs;
        for (i = 0; i < 24; i++) {
            el = i % 3 === 0 ? document.createElement('strong') : document.createElement('span');
            el.textContent = i;
            degs = i / 24 * 360;
            el.style.transform = `rotate(${degs}deg)`;
            els.pipHour.appendChild(el);
        }
    }
    function drawPipMinute () { // Draw 0 thru 59.
        let i, el, degs;
        for (i = 0; i < 60; i++) {
            el = i % 5 === 0 ? document.createElement('strong') : document.createElement('span');
            el.textContent = i;
            degs = i / 60 * 360;
            el.style.transform = `rotate(${degs}deg)`;
            els.pipMinute.appendChild(el);
        }
    }
    function rotate(el, degs) {
        el.style.transform = `rotate(${degs}deg)`;
    }
    function getDaysInMonth(datetime) {
        return new Date(datetime.getFullYear(), datetime.getMonth() + 1, 0).getDate();
    }
    function getHoursInDst (datetime = new Date()) {
        let januaryOffsetHours = new Date(datetime.getFullYear(), 0, 1).getTimezoneOffset() / 60;
        let julyOffsetHours = new Date(datetime.getFullYear(), 6, 1).getTimezoneOffset() / 60;
        return Math.abs(januaryOffsetHours - julyOffsetHours);
    }
    function isDstExpected (datetime = new Date()) {
        let currentOffsetHours = datetime.getTimezoneOffset() / 60; // 8
        return hoursInDst - currentOffsetHours === 0;
    }
    function setOffset (datetime = new Date()) {
        let offset = new Date().getTimezoneOffset() / 60;
        if (offset > 0) {
            els.utcOffset.textContent = `UTC\u002d${offset}h`; // hyphen-minus sign
        } else if (offset < 0) {
            els.utcOffset.textContent = `UTC\u002b${offset}h`; // plus sign
        } else {
            els.utcOffset.textContent = `UTC\u00b1${offset}h`; // plus-minus sign
        }
    }
    function setMonth (datetime = new Date()) {
        let month = datetime.getMonth() + 1; // Add one month for natural counting.
        let day = datetime.getDate();
        let daysInMonth = getDaysInMonth(datetime);
        let degs = (month - 1 + (day - 1) / daysInMonth) / 12 * 360; // Subtract one month (and day) for zero indexing.
        rotate(els.handMonth, degs);
        els.digitMonth.textContent = month < 10 ? `0${month}` : month;
        if (daysInMonth !== numberOfDayPips) { // Update pips for days of month, if total days changes.
            drawPipDay(datetime);
        }
    }
    function setDay (datetime = new Date()) {
        let day = datetime.getDate();
        let hour = datetime.getHours();
        let daysInMonth = getDaysInMonth(datetime);
        let degs = (day - 1 + hour / 24) / daysInMonth * 360; // Subtract one day for zero indexing.
        rotate(els.handDay, degs);
        els.digitDay.textContent = day < 10 ? `0${day}` : day;
        prevSetDay = datetime;
    }
    function setHour (datetime = new Date()) {
        let hour = datetime.getHours();
        let minute = datetime.getMinutes();
        let degs = (hour + minute / 60) / 24 * 360;
        rotate(els.handHour, degs);
        els.digitHour.textContent = hour < 10 ? `0${hour}` : hour;
        if (minute === 0 || datetime - prevSetDay > 1000 * 60 * 60) { // Update day, month, & offset each hour.
            setDay(datetime);
            setMonth(datetime);
            setOffset(datetime);
        }
        prevSetHour = datetime;
    }
    function setMinute (datetime = new Date()) {
        let minute = datetime.getMinutes();
        let second = datetime.getSeconds();
        let degs = (minute + second / 60) / 60 * 360;
        rotate(els.handMinute, degs);
        els.digitMinute.textContent = minute < 10 ? `0${minute}` : minute;
        if (second === 0 || datetime - prevSetHour > 1000 * 60) { // Update hour each minute.
            setHour(datetime);
        }
        prevSetMinute = datetime;
    }
    function setClock (datetime = new Date()) { // Set seconds. Set larger units as needed.
        if (isDstExpected(datetime) && !els.toggleTime.checked) {
            datetime = new Date(datetime.valueOf() - hoursInDst * 60 * 60 * 1000);
        } else if (!isDstExpected(datetime) && els.toggleTime.checked) {
            datetime = new Date(datetime.valueOf() + hoursInDst * 60 * 60 * 1000);
        }
        let second = datetime.getSeconds();
        let millisecond = datetime.getMilliseconds();
        let degs = (second + millisecond / 1000) / 60 * 360;
        rotate(els.handSecond, degs);
        els.digitSecond.textContent = second < 10 ? `0${second}` : second;
        if (millisecond === 0 || datetime - prevSetMinute > 1000) { // Update minute each second.
            setMinute(datetime);
        }
    }

    let datetime = new Date();
    // datetime = new Date(1970, 10 - 1, 7, 9, 35, 18); // "Factory Display"

    let numberOfDayPips = getDaysInMonth(datetime);
    let hoursInDst = getHoursInDst(datetime) || 1; // Default one if no DST for locale.

    let prevSetDay = 0;
    let prevSetHour = 0;
    let prevSetMinute = 0;

    let els = {};

    els.toggleTime = document.getElementById('toggle-time');

    els.supertitleMonth = document.getElementById('supertitle-month');
    els.supertitleDay = document.getElementById('supertitle-day');
    els.supertitleHour = document.getElementById('supertitle-hour');
    els.supertitleMinute = document.getElementById('supertitle-minute');
    els.supertitleSecond = document.getElementById('supertitle-second');
    els.utcOffset = document.getElementById('utc-offset');
    els.pipMonth = document.getElementById('pip-month');
    els.pipDay = document.getElementById('pip-day');
    els.pipHour = document.getElementById('pip-hour');
    els.pipMinute = document.getElementById('pip-minute');
    els.handMonth = document.getElementById('hand-month');
    els.handDay = document.getElementById('hand-day');
    els.handHour = document.getElementById('hand-hour');
    els.handMinute = document.getElementById('hand-minute');
    els.handSecond = document.getElementById('hand-second');
    els.digitMonth = document.getElementById('digit-month');
    els.digitDay = document.getElementById('digit-day');
    els.digitHour = document.getElementById('digit-hour');
    els.digitMinute = document.getElementById('digit-minute');
    els.digitSecond = document.getElementById('digit-second');
    els.toggleLabelTime = document.getElementById('toggle-label-time');
    els.panel = document.getElementById('panel');
    els.toggleLabelPanel = document.getElementById('toggle-label-panel');

    els.handMonth.addEventListener('touchstart', focusMonth);
    els.handMonth.addEventListener('mouseenter', focusMonth);
    els.handMonth.addEventListener('touchend', blurMonth);
    els.handMonth.addEventListener('mouseleave', blurMonth);

    els.digitMonth.addEventListener('touchstart', focusMonth);
    els.digitMonth.addEventListener('mouseenter', focusMonth);
    els.digitMonth.addEventListener('touchend', blurMonth);
    els.digitMonth.addEventListener('mouseleave', blurMonth);

    els.handDay.addEventListener('touchstart', focusDay);
    els.handDay.addEventListener('mouseenter', focusDay);
    els.handDay.addEventListener('touchend', blurDay);
    els.handDay.addEventListener('mouseleave', blurDay);

    els.digitDay.addEventListener('touchstart', focusDay);
    els.digitDay.addEventListener('mouseenter', focusDay);
    els.digitDay.addEventListener('touchend', blurDay);
    els.digitDay.addEventListener('mouseleave', blurDay);

    els.handHour.addEventListener('touchstart', focusHour);
    els.handHour.addEventListener('mouseenter', focusHour);
    els.handHour.addEventListener('touchend', blurHour);
    els.handHour.addEventListener('mouseleave', blurHour);

    els.digitHour.addEventListener('touchstart', focusHour);
    els.digitHour.addEventListener('mouseenter', focusHour);
    els.digitHour.addEventListener('touchend', blurHour);
    els.digitHour.addEventListener('mouseleave', blurHour);

    els.handMinute.addEventListener('touchstart', focusMinute);
    els.handMinute.addEventListener('mouseenter', focusMinute);
    els.handMinute.addEventListener('touchend', blurMinute);
    els.handMinute.addEventListener('mouseleave', blurMinute);

    els.digitMinute.addEventListener('touchstart', focusMinute);
    els.digitMinute.addEventListener('mouseenter', focusMinute);
    els.digitMinute.addEventListener('touchend', blurMinute);
    els.digitMinute.addEventListener('mouseleave', blurMinute);

    els.handSecond.addEventListener('touchstart', focusSecond);
    els.handSecond.addEventListener('mouseenter', focusSecond);
    els.handSecond.addEventListener('touchend', blurSecond);
    els.handSecond.addEventListener('mouseleave', blurSecond);

    els.digitSecond.addEventListener('touchstart', focusSecond);
    els.digitSecond.addEventListener('mouseenter', focusSecond);
    els.digitSecond.addEventListener('touchend', blurSecond);
    els.digitSecond.addEventListener('mouseleave', blurSecond);

    els.toggleLabelTime.addEventListener('click', () => { // Trigger re-calculations.
        prevSetDay = 0;
        prevSetHour = 0;
        prevSetMinute = 0;
    });

    els.toggleLabelPanel.addEventListener('click', () => {
        els.panel.scrollTo(0, 0);
    });

    els.toggleTime.checked = isDstExpected(datetime);

    drawPipMonth();
    drawPipDay(datetime);
    drawPipHour();
    drawPipMinute();

    setClock(datetime);
    setInterval(setClock, 40); // Arbitray rate that looks good enough onscreen.

});
