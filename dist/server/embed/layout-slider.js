export const layoutSlider = function buildSlider(el, data) {
    var videos = data.carousel.videos || [];
    if (!videos.length)
        return;
    if (videos.length < 6) {
        var original = videos.slice();
        while (videos.length < 6) {
            videos = videos.concat(original);
        }
    }
    var previewTime = data.carousel.previewTime || 3;
    var uid = "vslider-" + Math.floor(Math.random() * 1000000);
    el.classList.add("vidshop-slider-carousel", uid);
    el.setAttribute("data-preview-time", String(previewTime * 1000));
    var headerHtml = '';
    if (data.carousel.title || data.carousel.subtitle) {
        headerHtml += '<div style="text-align: center; margin-bottom: 24px; padding: 0 16px; width: 100%;">';
        if (data.carousel.title) {
            headerHtml += '<h2 style="margin: 0 0 8px 0; font-family: inherit; font-size: 28px; font-weight: 700; color: ' + escAttr(data.carousel.titleColor || '#000000') + ';">' + escAttr(data.carousel.title) + '</h2>';
        }
        if (data.carousel.subtitle) {
            headerHtml += '<p style="margin: 0; font-family: inherit; font-size: 16px; color: ' + escAttr(data.carousel.subtitleColor || '#666666') + ';">' + escAttr(data.carousel.subtitle) + '</p>';
        }
        headerHtml += '</div>';
    }
    var playIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    var html = headerHtml + '<div class="vidshop-slider-track">';
    videos.forEach(function (v) {
        html += '<div class="vidshop-slider-slide">';
        html += '<video loop playsinline preload="metadata" poster="' + (v.thumbnailUrl ? escAttr(v.thumbnailUrl) : '') + '">';
        html += '<source src="' + escAttr(v.mediaUrl) + '" type="video/mp4">';
        html += '</video>';
        html += '<div class="vidshop-slider-play-overlay">' + playIcon + '</div>';
        if (data.carousel.showProducts && v.productsList && v.productsList.length > 0) {
            v.productsList.forEach(function (p) {
                var priceHtml = p.price ? '<p class="frc-product-price">' + escAttr(p.price) + '</p>' : '';
                var imgHtml = p.imageLink ? '<img class="frc-product-img" src="' + escAttr(p.imageLink) + '" alt=""/>' : '<div class="frc-product-img" style="background: #333;"></div>';
                var cartIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>';
                var link = p.link ? escAttr(p.link) : '#';
                html += '<div class="frc-product-card" data-start="' + p.startTime + '" data-end="' + p.endTime + '">' +
                    imgHtml +
                    '<div class="frc-product-info">' +
                    '<h3 class="frc-product-title">' + escAttr(p.title) + '</h3>' +
                    priceHtml +
                    '</div>' +
                    '<a href="' + link + '" target="_blank" class="frc-product-btn" aria-label="Comprar">' + cartIcon + '</a>' +
                    '</div>';
            });
        }
        html += '</div>';
    });
    html += '</div>';
    el.innerHTML = html;
    initSliderLogic(el);
    function initSliderLogic(root) {
        if (root.dataset.vsSliderInitialized === "true")
            return;
        root.dataset.vsSliderInitialized = "true";
        var slides = Array.from(root.querySelectorAll(".vidshop-slider-slide"));
        var videos = slides.map(function (s) { return s.querySelector("video"); });
        var track = root.querySelector(".vidshop-slider-track");
        var previewTime = Number(root.dataset.previewTime || 3000);
        var isManualPause = false;
        var currentPreview = -1;
        var previewTimer = null;
        var observer = null;
        function playPreview(index) {
            if (isManualPause)
                return;
            if (currentPreview !== -1 && videos[currentPreview]) {
                videos[currentPreview].pause();
                slides[currentPreview].classList.remove("is-playing");
            }
            currentPreview = index;
            var video = videos[currentPreview];
            var slide = slides[currentPreview];
            if (!video)
                return;
            video.muted = true;
            video.currentTime = 0;
            var p = video.play();
            if (p && p.catch)
                p.catch(function () { });
            clearTimeout(previewTimer);
            previewTimer = setTimeout(function () {
                var nextIndex = (currentPreview + 1) % videos.length;
                var nextSlide = slides[nextIndex];
                // Scroll the track so next slide is visible
                var slideWidth = nextSlide.offsetWidth + 16; // including gap
                var maxScroll = track.scrollWidth - track.clientWidth;
                var targetScroll = nextSlide.offsetLeft - track.offsetLeft;
                // If we reached the end, loop back
                if (targetScroll > maxScroll || nextIndex === 0) {
                    track.scrollTo({ left: 0, behavior: 'smooth' });
                }
                else {
                    track.scrollTo({ left: targetScroll, behavior: 'smooth' });
                }
                // Wait for scroll animation before playing next
                setTimeout(function () { playPreview(nextIndex); }, 400);
            }, previewTime);
        }
        if (window.IntersectionObserver) {
            observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        if (!isManualPause && currentPreview === -1) {
                            playPreview(0); // start auto-play cycle
                        }
                    }
                    else {
                        clearTimeout(previewTimer);
                        if (currentPreview !== -1 && videos[currentPreview]) {
                            videos[currentPreview].pause();
                        }
                        currentPreview = -1;
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(root);
        }
        else {
            // Fallback if no observer
            setTimeout(function () { playPreview(0); }, 500);
        }
        videos.forEach(function (video, index) {
            var slide = slides[index];
            var productCards = Array.from(slide.querySelectorAll(".frc-product-card"));
            if (productCards.length > 0) {
                video.addEventListener("timeupdate", function () {
                    var ct = video.currentTime;
                    productCards.forEach(function (card) {
                        var start = Number(card.dataset.start);
                        var end = Number(card.dataset.end);
                        if (ct >= start && ct <= end) {
                            if (!card.classList.contains("is-active"))
                                card.classList.add("is-active");
                        }
                        else {
                            if (card.classList.contains("is-active"))
                                card.classList.remove("is-active");
                        }
                    });
                });
            }
            slide.addEventListener("click", function (e) {
                if (e.target.closest('.frc-product-card'))
                    return;
                isManualPause = true; // User interacted, stop auto-preview strictly
                clearTimeout(previewTimer);
                if (video.paused) {
                    videos.forEach(function (v) { if (v !== video)
                        v.pause(); });
                    slides.forEach(function (s) { if (s !== slide)
                        s.classList.remove("is-playing"); });
                    video.muted = false;
                    var p = video.play();
                    if (p && p.catch)
                        p.catch(function () { });
                    slide.classList.add("is-playing");
                }
                else {
                    video.pause();
                    slide.classList.remove("is-playing");
                }
            });
            video.addEventListener("ended", function () {
                video.currentTime = 0;
                if (isManualPause) {
                    var p = video.play();
                    if (p && p.catch)
                        p.catch(function () { });
                    slide.classList.add("is-playing");
                }
            });
        });
    } // end initSliderLogic
} // end buildSlider
;
