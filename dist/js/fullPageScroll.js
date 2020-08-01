(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        window.fullPageScroll = factory();
    }
}(function () {
    "use strict";

    var COUNTER_THRESHOLD = 5; // Change this to decrease/increase senstivity
    var COUNTER_RESET_DURATION = 400;

    var animating = false;
    var counter = 0;

    var handleScroll = function (event) {
        //event.wheelDelta can be positive or negative based on the direction of scroll
        counter += 1 * (Math.sign(event.wheelDelta));

        //Scroll down if value of counter is negative and absolute value is greater than threshold
        if (!animating && (Math.abs(counter) >= COUNTER_THRESHOLD) && counter < 0) {
            var targetSection = $('section.active').next('section');
            if (targetSection.length) {
                scrollToSection(targetSection);
            }
        }
        //Scroll up if value of counter is positive and absolute value is greater than threshold
        else if (!animating && (Math.abs(counter) >= COUNTER_THRESHOLD) && counter > 0) {
            var targetSection = $('section.active').prev('section');
            if (targetSection.length) {
                scrollToSection(targetSection);
            }
        }
        // prevent default scrolling behaviour of mouse wheel
        event.preventDefault();

        //Reset counter to 0 , 400 miliseconds after stopping the mousewheel
        debouncedReset();
    };

    var scrollToSection = function (target) {
        animating = true;
        $('html, body').animate({
            scrollTop: target.offset().top
        }, 800, function () {
            animating = false;
            $('section.active').removeClass('active');
            target.addClass('active');
        });
    };

    var debounce = function (func, delay) {
        var debounceTimer;
        return function () {
            var context = this;
            var args = arguments
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function () {
                func.apply(context, args);
            }, delay);
        };
    };

    var resetCounter = function () {
        counter = 0;
    };
    var debouncedReset = debounce(resetCounter, COUNTER_RESET_DURATION);

    var init = function () {
        //Test support for passive listeners
        var supportsPassive = false;
        try {
            var options = Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassive = true;
                }
            });
            window.addEventListener("testPassive", null, options);
            window.removeEventListener("testPassive", null, options);
        } catch (e) { }

        var wheelOptions = supportsPassive ? {
            passive: false
        } : false;

        // Older browsers used 'mousewheel' event
        var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

        document.addEventListener(wheelEvent, handleScroll, wheelOptions);
    };

    return {
        init: init
    };

}));