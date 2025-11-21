$(document).ready(function () {

 /*mask*/
 $('.mask').inputmask("+380(99)-999-99-99");

 /*start*/
 startSwiper.on('slideChange', function () {
  startPoint = $('.start-tabs_point.swiper-slide-thumb-active').find('.start-tabs_name').text();
  $('.start-tabs_text b').text(startPoint);
  return false;
 });


 /*scroll*/
 $('.btn-scroll').click(function () {
  $('html, body').animate({
   scrollTop: $($(this).attr('href')).offset().top - 50
  }, {
   duration: 2000,
   easing: 'swing'
  });
  return false;
 });
 
 /*review*/
 $(window).scroll(function () {
  var scrollReview = $(this).scrollTop();
  $('.review-video').each(function () {
   if (scrollReview >= $(this).offset().top - 500) {
    if ($('.review-video_one').hasClass('active')) {
     $('.review-video_one')[0].play();
    }
    $('.review-video_one').removeClass('active');
   }
  });
 });

 $(window).scroll(function () {
  var scrollReview = $(this).scrollTop();
  $('.review-video').each(function () {
   if (scrollReview >= $(this).offset().top - 500) {
    if ($('.review-video_two').hasClass('active')) {
     $('.review-video_two')[0].play();
    }
    $('.review-video_two').removeClass('active');
   }
  });
 });

 /*gallery*/
 $('.gallery-tabs_point').eq(0).addClass('active');
 $('.gallery-slider').eq(0).addClass('active');
 $('.gallery-tabs_point').click(function () {
  if (!$(this).hasClass('active')) {
   var i = $(this).index();
   $('.gallery-tabs_point.active').removeClass('active');
   $('.gallery-slider.active').removeClass('active');
   $(this).addClass('active');
   $($('.gallery-sliders').children('.gallery-slider')[i]).addClass('active');
  }
 });

 /*tabs*/
 $('.tabs-list').each(function () {
  var tabsPoint = $(this).find('.tabs-list_point');
  var tabsPointOne = $(this).find('.tabs-list_point:nth-child(1)');
  var tabsPointTwo = $(this).find('.tabs-list_point:nth-child(1) .tabs-list_bottom');
  tabsPointOne.eq(0).addClass('active');
  tabsPointTwo.eq(0).show();
  tabsPoint.click(function () {
   $(this).siblings().removeClass('active');
   $(this).siblings().find('.tabs-list_bottom').slideUp();
   $(this).addClass('active');
   $(this).find('.tabs-list_bottom').slideDown();
   return false;
  });
 });

 /*faq*/
 $('.faq-list').each(function () {
  var faqPoint = $(this).find('.faq-list_point');
  var faqPointOne = $(this).find('.faq-list_point:nth-child(1)');
  var faqPointTwo = $(this).find('.faq-list_point:nth-child(1) .faq-list_bottom');
  faqPointOne.eq(0).addClass('active');
  faqPointTwo.eq(0).show();
  faqPoint.click(function () {
   $(this).siblings().removeClass('active');
   $(this).siblings().find('.faq-list_bottom').slideUp();
   $(this).addClass('active');
   $(this).find('.faq-list_bottom').slideDown();
   return false;
  });
 });

 /*popup*/
 $('.comments-btn').click(function () {
  $('.popup-comments').fadeIn();
 });
 $('.btn-modal').click(function () {
	
	var selected_product = $(this).data("id");
	//localStorage.setItem('selected_product', selected_product);
    var pr_name = $(this).parent().find(".products-text_title").text();
    var pr_price = $(this).parent().find(".price-total").text();
    var pr_old_price = $(this).parent().find(".price-discount").text();
    console.log(pr_old_price);
	$("#form-popup2 input[name=product]").val(selected_product);

	if (!pr_name) {
       pr_name = 'До кінця акції залишилося';
    }
    if(!pr_price) {
        pr_price = $('.start-wrap .start-text .price-total').text();
    }
    if(!pr_old_price) {
         pr_old_price = '';
    }
	$("#form-popup2").parent().find(".popup-title").text(pr_name);
	$("#form-popup2").parent().find(".price-total").text(pr_price);
	$("#form-popup2").parent().find(".price-discount").text(pr_old_price);


	//var saved_product = localStorage.getItem('selected_product');
	//var saved_time_end = localStorage.getItem('saved_time_end');

	//if(saved_time_start == null) {
		//localStorage.setItem('saved_time_end', time+day);
	//}	
	$('.popup-order').fadeIn();
 });
 $('.popup-close').click(function () {
  $(this).parent().parent().parent().fadeOut();
 });

 /*popup order*/
 setTimeout(function () {
  $('.popup-order').fadeIn();
 }, 350000);

 $(window).scroll(function () {
  var $sections = $('.main-wrap');
  $sections.each(function (i, el) {
   var top = $(el).offset().top - 0;
   var bottom = top + $(el).height();
   var scroll = $(window).scrollTop();
   var id = $(el).attr('id');
   if (scroll > top && scroll < bottom) {
    $('.action').addClass('active');
   } else {
    $('.action').removeClass('active');
   }
  })
 });

 /*timer*/
 function update() {
  var Now = new Date(), Finish = new Date();
  Finish.setHours(23);
  Finish.setMinutes(59);
  Finish.setSeconds(59);
  if (Now.getHours() === 23 && Now.getMinutes() === 59 && Now.getSeconds === 59) {
   Finish.setDate(Finish.getDate() + 1);
  }
  var sec = Math.floor((Finish.getTime() - Now.getTime()) / 1000);
  var hrs = Math.floor(sec / 3600);
  sec -= hrs * 3600;
  var min = Math.floor(sec / 60);
  sec -= min * 60;
  $(".timer-list_hours").html(pad(hrs));
  $(".timer-list_minutes").html(pad(min));
  $(".timer-list_seconds").html(pad(sec));
  setTimeout(update, 200);
 }
 function pad(s) {
  s = ("00" + s).substr(-2);
  return "<span class='timespan'>" + s[0] + "</span><span class='timespan'>" + s[1] + "</span>";
 }
 update();

});

/*start-tabs*/
var startTabsSwiper = new Swiper('.start-tabs', {
 observer: true,
 observeParents: true,
 slidesPerView: 'auto',
 spaceBetween: 5,
 speed: 800,
 freeMode: true,
 watchSlidesProgress: true,
});

/*start-slider*/
if (matchMedia('only screen and (min-width: 801px)').matches) {
 var startSwiper = new Swiper('.start-slider', {
  observer: true,
  observeParents: true,
  slidesPerView: 1,
  spaceBetween: 0,
  speed: 800,
  effect: 'fade',
  grabCursor: true,
  keyboard: {
   enabled: true,
  },
  navigation: {
   prevEl: '.start-prev',
   nextEl: '.start-next',
  },
  pagination: {
   el: '.start-fraction',
   type: "fraction",
  },
  thumbs: {
   swiper: startTabsSwiper,
  },
 });
}
if (matchMedia('only screen and (max-width: 800px)').matches) {
 var startSwiper = new Swiper('.start-slider', {
  loop: true,
  observer: true,
  observeParents: true,
  slidesPerView: 1,
  spaceBetween: 0,
  speed: 800,
  effect: 'fade',
  pagination: {
   el: '.start-pagination',
  },
  thumbs: {
   swiper: startTabsSwiper,
  },
 });
}

/*gallery-slider*/
if (matchMedia('only screen and (min-width: 1201px)').matches) {
 var gallerySwiper = new Swiper('.gallery-slider', {
  observer: true,
  observeParents: true,
  slidesPerView: 'auto',
  spaceBetween: 15,
  speed: 800,
  effect: 'fade',
  grabCursor: true,
  keyboard: {
   enabled: true,
  },
  navigation: {
   prevEl: '.gallery-prev',
   nextEl: '.gallery-next',
  },
  pagination: {
   el: '.gallery-pagination',
  },
 });
}
if (matchMedia('only screen and (max-width: 1200px)').matches) {
 var gallerySwiper = new Swiper('.gallery-slider', {
  loop: true,
  observer: true,
  observeParents: true,
  slidesPerView: 'auto',
  spaceBetween: 15,
  speed: 800,
  grabCursor: true,
  navigation: {
   prevEl: '.gallery-prev',
   nextEl: '.gallery-next',
  },
  pagination: {
   el: '.gallery-pagination',
  },
  breakpoints: {
   800: {
    spaceBetween: 30,
   },
  },
 });
}

/*products-slider*/
if (matchMedia('only screen and (min-width: 1201px)').matches) {
 var productsSwiper = new Swiper('.products-slider', {
  observer: true,
  observeParents: true,
  slidesPerView: 'auto',
  spaceBetween: 15,
  speed: 800,
  effect: 'fade',
  grabCursor: true,
  keyboard: {
   enabled: true,
  },
  navigation: {
   prevEl: '.products-prev',
   nextEl: '.products-next',
  },
  pagination: {
   el: '.products-pagination',
  },
 });
}
if (matchMedia('only screen and (max-width: 1200px)').matches) {
 var productsSwiper = new Swiper('.products-slider', {
  loop: true,
  observer: true,
  observeParents: true,
  slidesPerView: 1,
  speed: 800,
  effect: 'fade',
  navigation: {
   prevEl: '.products-prev',
   nextEl: '.products-next',
  },
  pagination: {
   el: '.products-pagination',
  },
 });
}

/*comments-slider*/
var commentsSwiper = new Swiper('.comments-slider', {
 loop: true,
 observer: true,
 observeParents: true,
 slidesPerView: 3,
 speed: 800,
 grabCursor: true,
 centeredSlides: true,
 keyboard: {
  enabled: true,
 },
 navigation: {
  prevEl: '.comments-prev',
  nextEl: '.comments-next',
 },
});

// Reviews chat slider
var reviewsChatSwiper = new Swiper('.reviews-chat-slider', {
 loop: true,
 observer: true,
 observeParents: true,
 slidesPerView: 1,
 spaceBetween: 30,
 speed: 800,
 grabCursor: true,
 autoplay: {
  delay: 5000,
  disableOnInteraction: false,
 },
 pagination: {
  el: '.swiper-pagination',
  clickable: true,
 },
 navigation: {
  prevEl: '.swiper-button-prev',
  nextEl: '.swiper-button-next',
 },
 breakpoints: {
  768: {
   slidesPerView: 2,
  },
  1024: {
   slidesPerView: 3,
  },
 },
});
