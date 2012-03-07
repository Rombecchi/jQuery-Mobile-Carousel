/*!
* jQuery Mobile Carousel
* Source: https://github.com/blackdynamo/jQuery-Mobile-Carousel
* Demo: http://jsfiddle.net/blackdynamo/yxhzU/
* Blog: http://developingwithstyle.blogspot.com
*
* Copyright 2010, Donnovan Lewis
* Edits: Benjamin Gleitzman (gleitz@mit.edu)
* Licensed under the MIT
*/

(function ($) {
    var doton = '<img src="images/bullet_on.png">';
	var dotoff = '<img src="images/bullet_off.png">';
	var dotlist = "";
    var methods = {
        init: function (options) {
            var settings = {
                duration: 300,
                direction: "horizontal",
                minimumDrag: 20,
                beforeStart: function () { },
                afterStart: function () { },
                beforeStop: function () { },
                afterStop: function () { }
            };

            $.extend(settings, options || {});

            return this.each(function () {
                if (this.tagName.toLowerCase() != "ul") return;

                var originalList = $(this);
                var originalId = originalList[0].id;
                var pages = originalList.children();
                var width = originalList.parent().width();
                var height = originalList.parent().height();
				var navigator = $('#navigator');
				var arrows = $('#arrows');

                //Css
                var containerCss = { position: "relative", overflow: "hidden", width: width, height: height };
                var listCss = { position: "relative", padding: "0", margin: "0", listStyle: "none", width: pages.length * width };
                var listItemCss = { width: width, height: height };

                var container = $("<div>").css(containerCss);
                var list = $("<ul>").css(listCss);
                list[0].id = originalId;				

                var currentPage = 1;
                var start, stop;

                list.data("settings", settings);
                list.data("width", width);
                list.data("list", list);
                list.data("height", height);
                list.data("currentPage", currentPage);
                if (settings.direction.toLowerCase() === "horizontal") {
                    list.css({ float: "left" });
                    $.each(pages, function (i) {
                        var li = $("<li>")
                            .css($.extend(listItemCss, { float: "left" }))
                            .html($(this).html());
                        list.append(li);
						dotlist = dotlist + '<span>' + dotoff + '</span>';
                    });
					navigator.html(dotlist);
					navigator.find('span').first().html(doton);

                    list.draggable({
                        axis: "x",
                        start: function (event) {
                            currentPage = list.data("currentPage");
                            settings.beforeStart.apply(list, arguments);

                            var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                            start = {
                                coords: [event.originalEvent.clientX, event.originalEvent.clientY]
                            };

                            settings.afterStart.apply(list, arguments);
                        },
                        stop: function (event) {
                            settings.beforeStop.apply(list, arguments);

                            var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                            stop = {
                                coords: [event.originalEvent.clientX, event.originalEvent.clientY]
                            };

                            start.coords[0] > stop.coords[0] ? moveLeft() : moveRight();

                            function moveLeft() {
                                if (currentPage === pages.length || dragDelta() < settings.minimumDrag) {
                                    list.animate({ left: "+=" + dragDelta() }, settings.duration);
                                    return;
                                }
                                var new_width = -1 * width * currentPage;
                                list.animate({ left: new_width }, settings.duration);
								navigator.find('span').siblings().html(dotoff);
								navigator.find('span').eq(currentPage).html(doton);
                                currentPage++;
                            }

                            function moveRight() {
                                if (currentPage === 1 || dragDelta() < settings.minimumDrag) {
                                    list.animate({ left: "-=" + dragDelta() }, settings.duration);
                                    return;
                                }
                                var new_width = -1 * width * (currentPage - 1);
                                list.animate({ left: -1 * width * (currentPage - 2) }, settings.duration);
                                currentPage--;
								navigator.find('span').siblings().html(dotoff);
								navigator.find('span').eq(currentPage-1).html(doton);
                            }

                            function dragDelta() {
                                return Math.abs(start.coords[0] - stop.coords[0]);
                            }

                            function adjustment() {
                                return width - dragDelta();
                            }

                            settings.afterStop.apply(list, arguments);
                            list.data("currentPage", currentPage);
                        }
                    });
                } else if (settings.direction.toLowerCase() === "vertical") {
                    $.each(pages, function (i) {
                        var li = $("<li>")
                            .css(listItemCss)
                            .html($(this).html());
                        list.append(li);
                    });
					navigator.addClass('vertical');
					arrows.addClass('verticalarr');
					navigator.html(dotlist);
					navigator.find('span').first().html(doton);

                    list.draggable({
                        axis: "y",
                        start: function (event) {
                            currentPage = list.data("currentPage");
                            settings.beforeStart.apply(list, arguments);

                            var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                            start = {
                                coords: [event.originalEvent.clientX, event.originalEvent.clientY]
                            };

                            settings.afterStart.apply(list, arguments);
                        },
                        stop: function (event) {
                            settings.beforeStop.apply(list, arguments);

                            var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                            stop = {
                                coords: [event.originalEvent.clientX, event.originalEvent.clientY]
                            };

                            start.coords[1] > stop.coords[1] ? moveUp() : moveDown();

                            function moveUp() {
                                if (currentPage === pages.length || dragDelta() < settings.minimumDrag) {
                                    list.animate({ top: "+=" + dragDelta() }, settings.duration);
                                    return;
                                }
                                var new_width = -1 * height * currentPage;
                                list.animate({ top: new_width }, settings.duration);
								navigator.find('span').siblings().html(dotoff);
								navigator.find('span').eq(currentPage).html(doton);
                                currentPage++;
                            }

                            function moveDown() {
                                if (currentPage === 1 || dragDelta() < settings.minimumDrag) {
                                    list.animate({ top: "-=" + dragDelta() }, settings.duration);
                                    return;
                                }
                                var new_width = -1 * height * (currentPage - 2);
                                list.animate({ top: new_width }, settings.duration);
                                currentPage--;
								navigator.find('span').siblings().html(dotoff);
								navigator.find('span').eq(currentPage-1).html(doton);
                            }

                            function dragDelta() {
                                return Math.abs(start.coords[1] - stop.coords[1]);
                            }

                            function adjustment() {
                                return height - dragDelta();
                            }

                            settings.afterStop.apply(list, arguments);
                            list.data("currentPage", currentPage);
                        }
                    });
                }

                container.append(list);

                originalList.replaceWith(container);
            });
        },
        next: function () {
            var originalList = $(this);
            var pages = originalList.children();
            var settings = $(this).data("settings");
            var width = $(this).data("width");
            var list = $(this).data("list");
            var height = $(this).data("height");
            var currentPage = $(this).data("currentPage");
            var navigator = $('#navigator');            			
			
			if (currentPage === pages.length) {return;}
			navigator.find('span').siblings().html(dotoff);
			navigator.find('span').eq(currentPage).html(doton);
            if (settings.direction.toLowerCase() === "horizontal") {
                var new_width = -1 * width * currentPage;
                list.animate({ left: new_width }, settings.duration);
                currentPage++;
            }
            else if (settings.direction.toLowerCase() === "vertical") {
                var new_width = -1 * height * currentPage;
                list.animate({ top: new_width }, settings.duration);
                currentPage++;
            }				
            $(this).data("currentPage", currentPage);
        },
        previous: function () {
            var originalList = $(this);
            var pages = originalList.children();
            var settings = $(this).data("settings");
            var width = $(this).data("width");
            var list = $(this).data("list");
            var height = $(this).data("height");
            var currentPage = $(this).data("currentPage");
            var navigator = $('#navigator');

            if (currentPage === 1) {return;}
            if (settings.direction.toLowerCase() === "horizontal") {
                var new_width = -1 * width * (currentPage - 1);
                list.animate({ left: -1 * width * (currentPage - 2) }, settings.duration);
                currentPage--;
            }
            else if (settings.direction.toLowerCase() === "vertical") {
                var new_width = -1 * height * (currentPage - 2);
                list.animate({ top: new_width }, settings.duration);
                currentPage--;
            }
			navigator.find('span').siblings().html(dotoff);
			navigator.find('span').eq(currentPage-1).html(doton);	
            $(this).data("currentPage", currentPage);
        }
    };

    $.fn.carousel = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + method + ' does not exist in this jQuery plugin.');            
        }
    };
})(jQuery);