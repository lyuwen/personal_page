/**
 * UIPageScrolling.js v2.0
 *
 * JQuery plugin
 *
 * Credit to Nikita Mostovoy for creating the script
 * 
 * Change made to the Mouse Whell event part
 * 
 * Mod by Lyuwen Fu
 */

(function($) {
    /**
     * section {String}
     * easing {String} - transition-timing-function
     * time {Number}
     * beforeMoveFunc {Function}
     * afterMoveFunc {Function}
     * isCyclic {Boolean}
     * isVertical {Boolean}
     * sectionsControl {String}
     * captureKeyboard {Boolean}
     * captureTouch {Boolean}
     */
    var defaults = {
        sections : "section",
        easing : "ease",
        time : 1000,
        beforeMoveFunc : null,
        afterMoveFunc : null,
        isCyclic : false,
        isVertical : true,
        sectionsControl : null,
        responsiveFallback: false,
        captureKeyboard : false,
        captureTouch : false
    };

    /**
     * Create a scrolling for a given div
     * @param settings - user settings
     * @returns {* | HTMLElement} JQuery object
     */
    $.fn.UIPageScrolling = function (settings) {
        var options = $.extend({}, defaults, settings),
            index = 0,
            current = $(this),
            maxIndex = 0,
            lastDelta=0;
            lastDDelta=0;
            lockNext = false,
            lockPrev = false;

        /**
         * reset mouse events
         */
        function unbindMouseEvents() {
            current.unbind("mousemove")
                .unbind("mouseup")
                .bind("mousedown", mouseDownEvent);
        };

        /**
         * mouse down and move events
         */
        function mouseDownEvent() {
            var lastClient = -1;
            current.bind("mousemove", function(e) {
                var delta;
                if (lastClient == -1) {
                    lastClient = options.isVertical? e.clientY : e.clientX;
                }
                delta = lastClient - (options.isVertical? e.clientY : e.clientX);
                if (delta > 150) {
                    current.moveNext();
                }
                if (delta < -150) {
                    current.movePrevious();
                }
            })
                .bind("mouseup", unbindMouseEvents)
                .unbind("mousedown");
        };

        /**
         * touch event
         */
        function touchStartEvent(e) {
            e = window.event || e.originalEvent;
            var lastClient = options.isVertical? e.touches[0].pageY : e.touches[0].pageX;
            current.bind("touchmove", function(e) {
                    e = window.event || e.originalEvent;
                    var delta = lastClient - (options.isVertical? e.touches[0].pageY : e.touches[0].pageX);
                    if (delta >= 50) {
                        current.moveNext();
                     }
                     if (delta <= -50) {
                         current.movePrevious();
                     }
                    if (Math.abs(delta) >= 50) {
                        current.unbind("touchmove");
                    }
                });
        }

        /**
          * Transfer the slide to a given
          * @param Position - the position (in percent)
          * @param Options - options
          * @param Index - the index of the target slide
          * @returns {* | HTMLElement}
          */
         function transformPageTo(index) {

            var position = index * 100,
                positionX = 0,
                positionY = 0;

            $('.ui-page-scrolling-section_active').removeClass('ui-page-scrolling-section_active');
            $('.ui-page-scrolling-control_active').removeClass('ui-page-scrolling-control_active');

            $('.ui-page-scrolling-control[data-index=' + index + ']').addClass('ui-page-scrolling-control_active');
            $('.ui-page-scrolling-section[data-index=' + index + ']').addClass('ui-page-scrolling-section_active');
            if (options.beforeMoveFunc instanceof Function) options.beforeMoveFunc(index);

            if (position > 0) {
                position = -position;
            }

            if (options.isVertical) {
                positionY = position;
            } else {
                positionX = position;
            }

            $(this).css({
                "-webkit-transform": "translate3d(" + positionX + "%, " + positionY + "%, 0)",
                "-webkit-transition": "all " + options.time + "ms " + options.easing,
                "-moz-transform": "translate3d(" + positionX + "%, " + positionY + "%, 0)",
                "-moz-transition": "all " + options.time + "ms " + options.easing,
                "-ms-transform": "translate3d(" + positionX + "%, " + positionY + "%, 0)",
                "-ms-transition": "all " + options.time + "ms " + options.easing,
                "transform": "translate3d(" + positionX + "%, " + positionY + "%, 0)",
                "transition": "all " + options.time + "ms " + options.easing
            })
                .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                    options.lockManager();
                    if (options.afterMoveFunc instanceof Function) options.afterMoveFunc(index);
                });
        }

        transformPageTo = transformPageTo.bind(this);

        /**
         * Move to certain page
         * @param index
         */
        $.fn.moveTo = function(index) {
            if (index < 0 || index > maxIndex) throw new Error("Index must be smaller than count of existing pages and greater than 0");
            transformPageTo(index);
        };

        /**
         * Move to next page
         */
        $.fn.moveNext = function() {
            if (lockNext) return;
            var lastIndex = $('.ui-page-scrolling-section_active').attr('data-index');
            lastIndex++;
            if (lastIndex > maxIndex && options.isCyclic) lastIndex = 0;
            if (lastIndex <= maxIndex) {
                lockNext = true;
                lockPrev = false;
                $(this).moveTo(lastIndex);
            }
        };

        /**
         * Move to previous page
         */
        $.fn.movePrevious = function() {
            if (lockPrev) return;
            var lastIndex = $('.ui-page-scrolling-section_active').attr('data-index');
            lastIndex--;
            if (lastIndex < 0 && options.isCyclic) lastIndex = maxIndex;
            if (lastIndex >= 0) {
                lockNext = false;
                lockPrev = true;
                $(this).moveTo(lastIndex);
            }
        };

        /**
         * Process keyboard input
         * @param {Event} e
         */
        function processKeyEvent(e) {
            switch (e.keyCode) {
                case 38:
                case 37:
                case 33:
                    $(this).movePrevious();
                    break;
                case 40:
                case 39:
                case 34:
                    $(this).moveNext();
                    break;
            }
        }

        processKeyEvent = processKeyEvent.bind(this);

    function responsive() {
      //start modification
      var valForTest = false;
      var typeOfRF = typeof options.responsiveFallback

      if(typeOfRF == "number"){
      	valForTest = $(window).width() < options.responsiveFallback;
      }
      if(typeOfRF == "boolean"){
      	valForTest = options.responsiveFallback;
      }
      if(typeOfRF == "function"){
      	valFunction = options.responsiveFallback();
      	valForTest = valFunction;
      	typeOFv = typeof valForTest;
      	if(typeOFv == "number"){
      		valForTest = $(window).width() < valFunction;
      	}
      }

      //end modification
      if (valForTest) {
        $("body").addClass("disabled-onepage-scroll");
        $(document).unbind('mousewheel DOMMouseScroll MozMousePixelScroll');
        el.swipeEvents().unbind("swipeDown swipeUp");
      } else {
        if($("body").hasClass("disabled-onepage-scroll")) {
          $("body").removeClass("disabled-onepage-scroll");
          $("html, body, .wrapper").animate({ scrollTop: 0 }, "fast");
        }


        el.swipeEvents().bind("swipeDown",  function(event){
          if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
          el.moveUp();
        }).bind("swipeUp", function(event){
          if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
          el.moveDown();
        });

        $(document).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(event) {
          event.preventDefault();
          var delta = event.originalEvent.wheelDelta || -(120)*event.originalEvent.detail;
          processMouseWheel(event, delta);
        });
      }
    }

        /**
         * Process Mouse Whell event
         * 
         * I add an alternative algorithm to
         * track the extreme speed of the wheel event
         * at which point the scroll will be triggered
         * 
         * This is to prevent too much scroll been triggered
         * during single scroll gesture
         * 
         * @param e
         */
        function processMouseWheel(event, delta) {
              var topDelta = 40,
                  timeNow = new Date().getTime(),
                  curDDelta=delta-lastDelta;
              if (curDDelta*lastDDelta < 0){
                  if (delta < -topDelta) $(this).moveNext();
                  if (delta > topDelta) $(this).movePrevious();
              }
              lastDDelta=curDDelta;
              lastDelta=delta;
              //if (event.wheelDelta) topDelta = 10;
              /*if (delta < -topDelta) $(this).moveNext();
              if (delta > topDelta) $(this).movePrevious()
              }
              lastAnim = timeNow;*/
        }

        processMouseWheel = processMouseWheel.bind(this);

        /**
         * remove the lock on the scrolling
         */
        options.lockManager = function() {
            lockNext = false;
            lockPrev = false;
        };

        //Slide setting (status, data-attributes)
        current.children(options.sections)
            .addClass("ui-page-scrolling-section").each(function () {
                if (options.isVertical) {
                    $(this).css({top: index * 100 + "%"});
                } else {
                    $(this).css({left: index * 100 + "%"});
                }
                $(this).attr('data-index',index++);
            });


        maxIndex = index-1;

        //Setting switches (if any)
        index = 0;
        if (options.sectionsControl) {
            $(options.sectionsControl)
                .addClass("ui-page-scrolling-control").each(function () {
                    $(this).attr('data-index', index++).bind("click keypress", function () {
                        current.moveTo($(this).attr('data-index'));
                    });
                });
        }

        //capture mouse and touch
        if (options.captureTouch) {
            current.bind("mousedown", mouseDownEvent);
            current.bind("touchstart", touchStartEvent);
        }

        //default setting
        current.addClass('ui-page-scrolling-main')
            .bind("mousewheel DOMMouseScroll", function(event) {
                event.preventDefault();
                var delta = event.originalEvent.wheelDelta || -(120)*event.originalEvent.detail;
                if(!$("body").hasClass("disabled-onepage-scroll")) processMouseWheel(event,delta);
                });

        transformPageTo(0);

        //capture keystrokes
        if (options.captureKeyboard) {
            $(window).bind("keydown", processKeyEvent);
        }

        if(settings.responsiveFallback != false) {
        $(window).resize(function() {
            responsive();
        });

        responsive();
        }

        return $(this);
    }



})(window.jQuery);