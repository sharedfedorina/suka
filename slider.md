Так виглядає слайдер для продукту. 

<div class="swiper-slide products-slide">
                                        <picture>
                                            <source srcset="img/products/product_6.jpg" media="(min-width: 800px)">
                                            <img src="img/products/product_6_m.webp" alt="img">
                                        </picture>
                                    </div>
                                    <div class="swiper-slide products-slide">
                                        <picture>
                                            <source srcset="img/products/product_6_1.jpg" media="(min-width: 800px)">
                                            <img src="img/products/product_6_1_m.webp" alt="img">
                                        </picture>
                                    </div>
                                    <div class="swiper-slide products-slide">
                                        <picture>
                                            <source srcset="img/products/product_6_2.jpg" media="(min-width: 800px)">
                                            <img src="img/products/product_6_2_m.webp" alt="img">
                                        </picture>
                                    </div>
                                    <div class="swiper-slide products-slide">
                                        <picture>
                                            <source srcset="img/products/product_6_3.jpg" media="(min-width: 800px)">
                                            <img src="img/products/product_6_3_m.webp" alt="img">
                                        </picture>
                                    </div>
                                    <div class="swiper-slide products-slide">
                                        <picture>
                                            <source srcset="img/products/product_6_4.jpg" media="(min-width: 800px)">
                                            <img src="img/products/product_6_4_m.webp" alt="img">
                                        </picture>
                                    </div>
                                    <div class="swiper-slide products-slide">
                                        <picture>
                                            <source srcset="img/products/product_6_5.jpg" media="(min-width: 800px)">
                                            <img src="img/products/product_6_5_m.webp" alt="img">
                                        </picture>
                                    </div>
                                    <div class="swiper-slide products-slide">
                                        <picture>
                                            <source srcset="img/products/product_6_6.jpg" media="(min-width: 800px)">
                                            <img src="img/products/product_6_6_m.webp" alt="img">
                                        </picture>
                                    </div>
                                </div>

Так виглядає продукт.
в user config файлі 
"product1Images": [
"/public/img/products/product-1762647828725.jpg",
"/public/img/products/product-1762647828757.jpg",
"/public/img/products/product-1762647828784.jpg",
"/public/img/products/product-1762647828809.jpg"
]


Ось що має вийти на виході для кожного фото

 <div class="swiper-slide products-slide">
    <picture>
        <source srcset="/public/img/products/product-1762647828725.jpg" media="(min-width: 800px)">
        <img src="/public/img/products/product-1762647828725.jpg" alt="img">
    </picture>
</div>

в прикладі 4 фото для продукту, відповідно має бути 4 фото в слайдері.
це буде замінено у відповідному місці з відповідним плейсхолдером.