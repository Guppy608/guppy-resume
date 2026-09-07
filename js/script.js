(function() {
    "use strict";

    var currentLang = localStorage.getItem("language") === "en" ? "en" : "zh";
    var langToggle = document.getElementById("langToggle");
    var typingEl = document.querySelector(".typing-text");
    var typingTimer = null;
    var roleIndex = 0;

    function renderLanguage(lang) {
        document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
        document.querySelectorAll("[data-i18n]").forEach(function(el) {
            var key = el.getAttribute("data-i18n");
            var value = CV_CONTENT[key] && CV_CONTENT[key][lang];
            if (typeof value === "string") {
                el.innerHTML = value;
            }
        });

        ["aria-label", "alt"].forEach(function(attribute) {
            document.querySelectorAll("[data-i18n-" + attribute + "]").forEach(function(el) {
                var key = el.getAttribute("data-i18n-" + attribute);
                if (CV_CONTENT[key]) el.setAttribute(attribute, CV_CONTENT[key][lang]);
            });
        });
        var description = document.querySelector('meta[name="description"]');
        if (description) description.content = CV_CONTENT["site.description"][lang];
        if (langToggle) {
            langToggle.textContent = lang === "zh" ? "EN" : "中文";
            langToggle.setAttribute("aria-label", lang === "zh" ? "Switch to English" : "切换至中文");
        }

        document.dispatchEvent(new CustomEvent("cv:languagechange", { detail: { language: lang } }));

        roleIndex = 0;
        startRoleLoop();
    }

    function startRoleLoop() {
        if (!typingEl) return;
        if (typingTimer) window.clearTimeout(typingTimer);

        var roles = CV_CONTENT["hero.roles"][currentLang];
        var role = roles[roleIndex % roles.length];
        var charIndex = 0;
        typingEl.textContent = "";

        function typeNext() {
            if (charIndex < role.length) {
                typingEl.textContent = role.slice(0, charIndex + 1);
                charIndex += 1;
                typingTimer = window.setTimeout(typeNext, currentLang === "zh" ? 105 : 48);
                return;
            }

            typingTimer = window.setTimeout(function() {
                roleIndex = (roleIndex + 1) % roles.length;
                startRoleLoop();
            }, 1700);
        }

        typeNext();
    }

    if (langToggle) {
        langToggle.addEventListener("click", function() {
            currentLang = currentLang === "zh" ? "en" : "zh";
            localStorage.setItem("language", currentLang);
            renderLanguage(currentLang);
        });
    }

    renderLanguage(currentLang);

    /* Reveal elements only when they enter the story. */
    var revealElements = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-revealed");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

        revealElements.forEach(function(el) {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(function(el) {
            el.classList.add("is-revealed");
        });
    }

    /* Active navigation, panel state, and the thin reading-progress line. */
    var panels = document.querySelectorAll("[data-panel]");
    var navLinks = document.querySelectorAll("[data-section-link]");
    var header = document.querySelector(".site-header");
    var progress = document.querySelector(".section-progress span");

    if ("IntersectionObserver" in window) {
        var panelObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                var panelName = entry.target.getAttribute("data-panel");
                entry.target.classList.add("is-visible");
                navLinks.forEach(function(link) {
                    link.classList.toggle("is-active", link.getAttribute("data-section-link") === panelName);
                });
            });
        }, { threshold: 0, rootMargin: "-20% 0px -65% 0px" });

        panels.forEach(function(panel) {
            panelObserver.observe(panel);
        });
    }

    var scrollTicking = false;
    function updatePageProgress() {
        var scrollable = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
        if (progress) progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, ratio)) + ")";
        if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
        scrollTicking = false;
    }

    window.addEventListener("scroll", function() {
        if (!scrollTicking) {
            window.requestAnimationFrame(updatePageProgress);
            scrollTicking = true;
        }
    }, { passive: true });
    updatePageProgress();

    /* Horizontal chapters: buttons, keyboard, vertical-wheel conversion, mouse drag. */
    document.querySelectorAll("[data-slider]").forEach(function(track) {
        var name = track.getAttribute("data-slider");
        var isEssayTrack = name === "essays";
        var items = Array.prototype.slice.call(track.children);
        var prevButton = document.querySelector("[data-slider-prev=\"" + name + "\"]");
        var nextButton = document.querySelector("[data-slider-next=\"" + name + "\"]");
        var count = document.querySelector("[data-slider-count=\"" + name + "\"]");
        var activeIndex = 0;
        var countFrame = null;
        var drag = { active: false, moved: false, startX: 0, startScroll: 0 };

        function itemStride() {
            if (items.length < 2) return items[0] ? items[0].getBoundingClientRect().width : track.clientWidth;
            return items[1].offsetLeft - items[0].offsetLeft;
        }

        function updateCount() {
            var anchor = track.scrollLeft + Math.min(80, track.clientWidth * 0.12);
            var closestDistance = Infinity;
            items.forEach(function(item, index) {
                var distance = Math.abs(anchor - item.offsetLeft);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    activeIndex = index;
                }
            });
            if (isEssayTrack && track.scrollWidth > track.clientWidth + 1 && track.scrollLeft >= track.scrollWidth - track.clientWidth - 1) {
                activeIndex = items.length - 1;
            }
            if (count) {
                count.textContent = String(activeIndex + 1).padStart(2, "0") + " / " + String(items.length).padStart(2, "0");
            }
            if (isEssayTrack) {
                if (prevButton) prevButton.disabled = track.scrollLeft <= 1;
                if (nextButton) nextButton.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
            }
            countFrame = null;
        }

        function go(direction) {
            track.scrollBy({ left: direction * itemStride(), behavior: "smooth" });
        }

        if (prevButton) prevButton.addEventListener("click", function() { go(-1); });
        if (nextButton) nextButton.addEventListener("click", function() { go(1); });

        track.addEventListener("scroll", function() {
            if (!countFrame) countFrame = window.requestAnimationFrame(updateCount);
        }, { passive: true });

        track.addEventListener("keydown", function(event) {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                go(1);
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                go(-1);
            }
        });

        track.addEventListener("pointerdown", function(event) {
            if (isEssayTrack) drag.moved = false;
            if (event.pointerType !== "mouse" || event.button !== 0) return;
            if (event.target.closest("a, button") && !(isEssayTrack && event.target.closest(".essay-open"))) return;
            drag.active = true;
            drag.moved = false;
            drag.startX = event.clientX;
            drag.startScroll = track.scrollLeft;
            if (!isEssayTrack) {
                track.classList.add("is-dragging");
                track.setPointerCapture(event.pointerId);
            }
        });

        track.addEventListener("pointermove", function(event) {
            if (!drag.active) return;
            if (isEssayTrack && !drag.moved) {
                if (Math.abs(event.clientX - drag.startX) < 6) return;
                drag.moved = true;
                track.classList.add("is-dragging");
                track.setPointerCapture(event.pointerId);
            }
            track.scrollLeft = drag.startScroll - (event.clientX - drag.startX);
        });

        function stopDrag(event) {
            if (!drag.active) return;
            drag.active = false;
            track.classList.remove("is-dragging");
            if (track.hasPointerCapture && track.hasPointerCapture(event.pointerId)) {
                track.releasePointerCapture(event.pointerId);
            }
        }

        track.addEventListener("pointerup", stopDrag);
        track.addEventListener("pointercancel", stopDrag);
        if (isEssayTrack) {
            track.addEventListener("click", function(event) {
                if (drag.moved && event.detail !== 0) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }, true);
            track.addEventListener("pointerleave", function(event) {
                if (!drag.moved) stopDrag(event);
            });
            if ("ResizeObserver" in window) new ResizeObserver(updateCount).observe(track);
        }
        updateCount();
    });

    /* A lightweight, original canvas network for the hero—no 3D dependency required. */
    var canvas = document.getElementById("heroCanvas");
    var heroPanel = document.querySelector(".hero-panel");
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canvas && heroPanel && canvas.getContext) {
        var context = canvas.getContext("2d");
        var canvasWidth = 0;
        var canvasHeight = 0;
        var canvasDpr = Math.min(window.devicePixelRatio || 1, 2);
        var points = [];
        var pointer = { x: 0, y: 0, active: false };
        var animationFrame = null;

        function resizeCanvas() {
            var rect = heroPanel.getBoundingClientRect();
            canvasWidth = Math.max(1, rect.width);
            canvasHeight = Math.max(1, rect.height);
            canvas.width = Math.round(canvasWidth * canvasDpr);
            canvas.height = Math.round(canvasHeight * canvasDpr);
            canvas.style.width = canvasWidth + "px";
            canvas.style.height = canvasHeight + "px";
            context.setTransform(canvasDpr, 0, 0, canvasDpr, 0, 0);

            var pointCount = Math.min(54, Math.max(24, Math.round(canvasWidth / 28)));
            points = Array.from({ length: pointCount }, function(_, index) {
                return {
                    x: Math.random() * canvasWidth,
                    y: Math.random() * canvasHeight,
                    vx: (Math.random() - 0.5) * 0.22,
                    vy: (Math.random() - 0.5) * 0.22,
                    r: index % 9 === 0 ? 2 : 1
                };
            });
        }

        function drawNetwork() {
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            points.forEach(function(point, index) {
                if (!reducedMotion) {
                    point.x += point.vx;
                    point.y += point.vy;
                    if (point.x < 0 || point.x > canvasWidth) point.vx *= -1;
                    if (point.y < 0 || point.y > canvasHeight) point.vy *= -1;
                }

                if (pointer.active) {
                    var pointerDx = pointer.x - point.x;
                    var pointerDy = pointer.y - point.y;
                    var pointerDistance = Math.sqrt(pointerDx * pointerDx + pointerDy * pointerDy);
                    if (pointerDistance < 150 && pointerDistance > 1) {
                        point.x -= pointerDx / pointerDistance * 0.18;
                        point.y -= pointerDy / pointerDistance * 0.18;
                    }
                }

                for (var j = index + 1; j < points.length; j += 1) {
                    var other = points[j];
                    var dx = point.x - other.x;
                    var dy = point.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 115) {
                        context.beginPath();
                        context.strokeStyle = "rgba(255,255,255," + (0.12 * (1 - distance / 115)) + ")";
                        context.lineWidth = 0.6;
                        context.moveTo(point.x, point.y);
                        context.lineTo(other.x, other.y);
                        context.stroke();
                    }
                }

                context.beginPath();
                context.fillStyle = point.r > 1 ? "rgba(239,106,58,0.9)" : "rgba(255,255,255,0.48)";
                context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
                context.fill();
            });

            if (!reducedMotion) animationFrame = window.requestAnimationFrame(drawNetwork);
        }

        heroPanel.addEventListener("pointermove", function(event) {
            var rect = heroPanel.getBoundingClientRect();
            pointer.x = event.clientX - rect.left;
            pointer.y = event.clientY - rect.top;
            pointer.active = true;
        }, { passive: true });

        heroPanel.addEventListener("pointerleave", function() {
            pointer.active = false;
        }, { passive: true });

        window.addEventListener("resize", function() {
            window.cancelAnimationFrame(animationFrame);
            resizeCanvas();
            drawNetwork();
        }, { passive: true });

        document.addEventListener("visibilitychange", function() {
            if (document.hidden) {
                window.cancelAnimationFrame(animationFrame);
            } else if (!reducedMotion) {
                drawNetwork();
            }
        });

        resizeCanvas();
        drawNetwork();
    }

    document.querySelectorAll("img").forEach(function(img) {
        img.addEventListener("error", function() {
            this.closest("figure") && this.closest("figure").classList.add("image-missing");
            console.warn("Image failed to load:", this.src);
        });
    });
})();
