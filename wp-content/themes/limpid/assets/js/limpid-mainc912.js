(function ($) {
    'use strict';
    $(document).on('ready', function () { 
        
        // Navbar JS
		try {
			const nav = document.querySelector('.navbar');
			let navTop = nav.offsetTop;
			function fixedNav() {
				if (window.scrollY >= navTop) {
					nav.classList.add('sticky');
				} else {
					nav.classList.remove('sticky');
				}
			}
			window.addEventListener('scroll', fixedNav);
		} catch (err) {}

		// Header Sticky Js
		window.addEventListener('scroll', event => {
			const height = 150;
			const { scrollTop } = event.target.scrollingElement;
			document.querySelector('#navbar').classList.toggle('sticky', scrollTop >= height);
		});

		// Back to Top
		const getId = document.getElementById("backtotop");
		if (getId) {
			const topbutton = document.getElementById("backtotop");
			topbutton.onclick = function (e) {
				window.scrollTo({ top: 0, behavior: "smooth" });
			};
			window.onscroll = function () {
				if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
					topbutton.style.opacity = "1";
				} else {
					topbutton.style.opacity = "0";
				}
			};
		}

		
		// MixItUp JS
		try {
			var mixer = mixitup('#Container', {
				controls: {
					toggleDefault: 'none'
				}
			});
		} catch (err) {}

		// Preloader JS
		const getPreloaderId = document.getElementById('preloader');
		if (getPreloaderId) {
			getPreloaderId.style.display = 'none';
		}
    
    });

    $( window ).on( 'elementor/frontend/init', function() {
		elementorFrontend.hooks.addAction( 'frontend/element_ready/global', function( $scope ) {  

            // Hover JS
			try {
				var elements = document.querySelectorAll("[id^='my-element']");
					elements.forEach(function(element) {
					element.addEventListener("mouseover", function() {
						elements.forEach(function(el) {
						el.classList.remove("active");
						});
						element.classList.add("active");
					});
				});
			
			} catch (err) {}

			// Scroll Animation
			window.addEventListener('scroll', reveal);
			function reveal(){
				var reveals = document.querySelectorAll('.reveal');
				for (var i = 0; i < reveals.length; i++){
					var win_height = window.innerHeight;
					var reveal_top = reveals[i].getBoundingClientRect().top;
					var reveal_point = 100;
					if (reveal_top < win_height - reveal_point) {
					reveals[i].classList.add('active');
					} 
				}
			}
			
			// Scroll Animation
			window.addEventListener('scroll', reveal2);
			function reveal2(){
				var reveals = document.querySelectorAll('.reveal2');
				for (var i = 0; i < reveals.length; i++){
					var win_height = window.innerHeight;
					var reveal_top = reveals[i].getBoundingClientRect().top;
					var reveal_point = 100;
					if (reveal_top < win_height - reveal_point) {
					reveals[i].classList.add('active');
					} 
				}
			}

			// Scroll Animation
			window.addEventListener('scroll', reveal3);
			function reveal3(){
				var reveals = document.querySelectorAll('.reveal3');
				for (var i = 0; i < reveals.length; i++){
					var win_height = window.innerHeight;
					var reveal_top = reveals[i].getBoundingClientRect().top;
					var reveal_point = 100;
					if (reveal_top < win_height - reveal_point) {
					reveals[i].classList.add('active');
					} 
				}
			}

			// Scroll Animation
			window.addEventListener('scroll', reveal4);
			function reveal4(){
				var reveals = document.querySelectorAll('.reveal4');
				for (var i = 0; i < reveals.length; i++){
					var win_height = window.innerHeight;
					var reveal_top = reveals[i].getBoundingClientRect().top;
					var reveal_point = 100;
					if (reveal_top < win_height - reveal_point) {
					reveals[i].classList.add('active');
					} 
				}
			}

			// Popup Video
			$('.popup-video').magnificPopup({
				disableOn: 320,
				type: 'iframe',
				mainClass: 'mfp-fade',
				removalDelay: 160,
				preloader: false,
				fixedContentPos: false
			});

			// Counter Js
			try {
				if ("IntersectionObserver" in window) {
					let counterObserver = new IntersectionObserver(function (entries, observer) {
						entries.forEach(function (entry) {
							if (entry.isIntersecting) {
							let counter = entry.target;
							let target = parseInt(counter.innerText);
							let step = target / 200;
							let current = 0;
							let timer = setInterval(function () {
								current += step;
								counter.innerText = Math.floor(current);
								if (parseInt(counter.innerText) >= target) {
								clearInterval(timer);
								}
							}, 10);
							counterObserver.unobserve(counter);
							}
						});
					});

					let counters = document.querySelectorAll(".counter");
						counters.forEach(function (counter) {
						counterObserver.observe(counter);
					});
				}
			} catch {}

        });
    });

}(jQuery));