// Sidebar Menu
(function($) {
    $(document).ready(function() {
        'use strict';

        function initMenu() {
            if ($('.responsive-navbar .navbar-nav .dropdown-toggle').length === 0) {
                $('.responsive-navbar .navbar-nav li.menu-item-has-children > a').after('<span class="dropdown-toggle"></span>');

                $('.responsive-navbar .navbar-nav li.menu-item-has-children > a').each(function() {
                    var href = $(this).attr('href');
                    if (!href || href === '#' || href === 'javascript:void(0)') {
                        $(this).addClass('no-link');
                    }
                });

                $('.responsive-navbar .navbar-nav').on('click.mobile', '.dropdown-toggle', function(e) {
                    e.preventDefault();
                    var element = $(this).parent('li');

                    if (element.hasClass('open')) {
                        element.removeClass('open');
                        element.find('li').removeClass('open');
                        element.find('ul').slideUp();
                    } else {
                        element.addClass('open');
                        element.children('ul').slideDown();
                        element.siblings('li').children('ul').slideUp();
                        element.siblings('li').removeClass('open');
                        element.siblings('li').find('li').removeClass('open');
                        element.siblings('li').find('ul').slideUp();
                    }
                });

                $('.responsive-navbar .navbar-nav').on('click.mobile', 'a.no-link', function(e) {
                    e.preventDefault();
                    $(this).siblings('.dropdown-toggle').trigger('click');
                });
            }
        }

        function destroyMenu() {
            $('.responsive-navbar .navbar-nav .dropdown-toggle').remove();
            $('.responsive-navbar .navbar-nav li.menu-item-has-children > a').removeClass('no-link');
            $('.responsive-navbar .navbar-nav li').removeClass('open');
            $('.responsive-navbar .navbar-nav ul').removeAttr('style');
            $('.responsive-navbar .navbar-nav').off('.mobile');
        }

        function checkMenu() {
            if ($(window).width() <= 991) {
                initMenu();
            } else {
                destroyMenu();
            }
        }

        checkMenu();

        var resizeTimer;
        $(window).on('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(checkMenu, 100);
        });
    });
})(jQuery);

