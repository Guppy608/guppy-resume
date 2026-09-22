(function() {
    "use strict";

    // Interface copy lives in content.js; articles live in essays.js.
    var essays = Array.isArray(window.CV_ESSAYS) ? window.CV_ESSAYS : [];
    var track = document.querySelector('[data-slider="essays"]');
    var section = document.querySelector(".essays-section");
    var dialog = document.getElementById("essayReader");
    if (!track || !section || !dialog || !essays.length) return;

    var title = document.getElementById("essayReaderTitle");
    var body = document.getElementById("essayReaderBody");
    var number = dialog.querySelector(".essay-paper-number");
    var meta = dialog.querySelector(".essay-reader-meta");
    var activeEssay = null;
    var opener = null;
    var backdropPointerDown = false;

    function language() {
        return document.documentElement.lang === "en" ? "en" : "zh";
    }

    function readingTime(essay) {
        // An estimate, based on approximately 350 non-whitespace characters/min.
        var minutes = Math.max(1, Math.ceil(essay.body.replace(/\s/g, "").length / 350));
        return language() === "en" ? "~" + minutes + " min · Chinese" : "约 " + minutes + " 分钟 · 中文";
    }

    function formattedDate(essay) {
        var parts = String(essay.date || "").split("-").map(Number);
        if (parts.length !== 3 || parts.some(function(part) { return !part; })) return essay.date || "";
        return new Intl.DateTimeFormat(language() === "en" ? "en-US" : "zh-CN", {
            year: "numeric",
            month: language() === "en" ? "short" : "long",
            day: "numeric",
            timeZone: "UTC"
        }).format(new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])));
    }

    function element(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    essays.forEach(function(essay, index) {
        var card = element("article", "essay-card");
        var top = element("div", "essay-card-top");
        top.appendChild(element("span", "", "ESSAY / " + String(index + 1).padStart(2, "0")));
        var date = element("time", "essay-date", formattedDate(essay));
        date.dateTime = essay.date;
        top.appendChild(date);

        var heading = element("h4", "", essay.title);
        heading.id = "essay-title-" + essay.id;
        heading.lang = "zh-CN";
        var bottom = element("div", "essay-card-bottom");
        bottom.appendChild(element("span", "essay-reading-time", readingTime(essay)));
        var open = element("button", "essay-open");
        open.type = "button";
        open.id = "essay-open-" + essay.id;
        open.setAttribute("data-i18n", "essays.open");
        open.setAttribute("aria-labelledby", open.id + " " + heading.id);
        open.setAttribute("aria-haspopup", "dialog");
        open.setAttribute("aria-controls", "essayReader");
        open.addEventListener("click", function() { openEssay(essay, index, open); });
        bottom.appendChild(open);
        card.append(top, heading, bottom);
        track.appendChild(card);
    });
    track.dataset.single = String(essays.length === 1);
    section.hidden = false;

    function updateLanguage() {
        var lang = language();
        track.querySelectorAll(".essay-date").forEach(function(node, index) {
            node.textContent = formattedDate(essays[index]);
        });
        track.querySelectorAll(".essay-reading-time").forEach(function(node, index) {
            node.textContent = readingTime(essays[index]);
        });
        section.querySelector('[data-slider-prev="essays"]').setAttribute("aria-label", lang === "en" ? "Previous essay" : "上一篇随笔");
        section.querySelector('[data-slider-next="essays"]').setAttribute("aria-label", lang === "en" ? "Next essay" : "下一篇随笔");
        if (activeEssay) meta.textContent = formattedDate(activeEssay) + "　/　" + readingTime(activeEssay);
    }

    function openEssay(essay, index, button) {
        if (dialog.open) return;
        activeEssay = essay;
        opener = button;
        title.textContent = essay.title;
        number.textContent = "ESSAY / " + String(index + 1).padStart(2, "0");
        body.replaceChildren();
        // textContent keeps punctuation and literal symbols intact, without HTML execution.
        essay.body.trim().split(/\n\s*\n/).forEach(function(paragraph) {
            body.appendChild(element("p", "", paragraph));
        });
        updateLanguage();
        document.documentElement.classList.add("essay-reader-open");
        dialog.showModal();
        dialog.scrollTop = 0;
    }

    dialog.querySelectorAll("[data-close-essay]").forEach(function(button) {
        button.addEventListener("click", function() { dialog.close(); });
    });
    dialog.addEventListener("pointerdown", function(event) {
        backdropPointerDown = event.target === dialog;
    });
    dialog.addEventListener("click", function(event) {
        if (event.target === dialog && backdropPointerDown) dialog.close();
    });
    // Native dialog handles Escape, focus trapping, and inert background content.
    dialog.addEventListener("close", function() {
        document.documentElement.classList.remove("essay-reader-open");
        activeEssay = null;
        if (opener) opener.focus({ preventScroll: true });
    });
    document.addEventListener("cv:languagechange", updateLanguage);
})();
