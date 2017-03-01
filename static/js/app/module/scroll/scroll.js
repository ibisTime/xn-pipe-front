define([
    'jquery',
    'iScroll',
], function ($, iScroll) {
    var myScroll;
    var defaultOption = {
        wrapper: "wrapper",
        pullDownEl: '#pullDown',
        loadMore: function () {
            setTimeout(function () {
                myScroll.refresh();
            }, 2000);
        },
        refresh: function () {
            setTimeout(function () {
                myScroll.refresh();
            }, 2000);
        }
    };

    return {
        init: function (option) {
            option = option || {};

            $.extend(option, defaultOption);

            var pullDownEl, pullDownOffset, $pullDownEl;

            function pullDownAction () {
                isEnd = false;
                // getPageLine(true);
            }
            $pullDownEl = $(option.pullDownEl);

            pullDownEl = $pullDownEl[0];
            pullDownOffset = pullDownEl.offsetHeight;
            
            myScroll = new iScroll(option.wrapper, {
                useTransition: false,
                topOffset: pullDownOffset,
                onRefresh: function () {
                    if ($pullDownEl.hasClass('scroll-loading')) {
                        $pullDownEl.removeClass('scroll-loading flip');
                    }
                },
                onScrollMove: function () {
                    if (this.y > 5 && !$pullDownEl.hasClass("flip")) {
                        $pullDownEl.addClass("flip");
                        this.minScrollY = 0;
                    } else if (this.y < 5 && $pullDownEl.hasClass("flip")) {
                        $pullDownEl.removeClass("flip");
                        this.minScrollY = -pullDownOffset;
                    } else if (this.y - 120 < this.maxScrollY) {
                        option.loadMore();
                    }
                },
                onScrollEnd: function () {
                    if ($pullDownEl.hasClass("flip")) {
                        $pullDownEl.addClass("scroll-loading");
                        option.refresh();
                    }
                }
            });
        }
    }
});