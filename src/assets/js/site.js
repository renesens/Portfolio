// Small interactive bits: case filters, screenshot lightbox, mobile steps toggle, contact form.
(function () {
  // ── Case filters on the home page ──
  var chips = document.querySelectorAll(".chipbtn[data-filter]");
  var cards = document.querySelectorAll(".case[data-cat]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      cards.forEach(function (card) {
        card.hidden = !(f === "all" || card.getAttribute("data-cat") === f);
      });
    });
  });

  // ── Lightbox for screenshots ──
  var zooms = document.querySelectorAll(".zoom[data-lb-src]");
  if (zooms.length) {
    var lb = document.createElement("div");
    lb.className = "lb";
    lb.hidden = true;
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML =
      '<button type="button" class="lb-close" aria-label="Close"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18"><path d="M3 3 L15 15 M15 3 L3 15" stroke="#2B2320" stroke-width="2" stroke-linecap="round" fill="none"></path></svg></button>' +
      "<img alt=\"\"><p></p>";
    document.body.appendChild(lb);
    var img = lb.querySelector("img");
    var cap = lb.querySelector("p");
    var lastBtn = null;
    var close = function () {
      lb.hidden = true;
      if (lastBtn) lastBtn.focus();
    };
    zooms.forEach(function (btn) {
      btn.addEventListener("click", function () {
        lastBtn = btn;
        img.src = btn.getAttribute("data-lb-src");
        img.alt = btn.getAttribute("data-lb-alt") || "";
        img.className = btn.getAttribute("data-lb-type") === "crm" ? "lb-crm" : "lb-make";
        cap.textContent = btn.getAttribute("data-lb-caption") || "";
        lb.setAttribute("aria-label", cap.textContent);
        lb.hidden = false;
        lb.querySelector(".lb-close").focus();
      });
    });
    lb.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lb.hidden) close();
    });
  }

  // ── "Read the steps" toggle on phones ──
  document.querySelectorAll(".steps-toggle").forEach(function (btn) {
    var list = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      var open = !list.classList.contains("is-open");
      list.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = btn.getAttribute(open ? "data-hide" : "data-show");
    });
  });

  // ── Contact form → n8n webhook ──
  var form = document.getElementById("contact-form");
  if (form) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector('button[type="submit"]');
    var show = function (text, isError) {
      status.textContent = text;
      status.classList.toggle("is-error", !!isError);
      status.hidden = false;
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var v = function (n) { return (form.elements.namedItem(n).value || "").trim(); };
      var data = {
        name: v("name"),
        email: v("email"),
        company: v("company"),
        topic: v("topic"),
        message: v("message"),
        website: v("website"), // hidden spam trap, should stay empty
        page: location.href,
        sent_at: new Date().toISOString()
      };
      var url = form.getAttribute("data-webhook");
      if (!url) { show(form.getAttribute("data-error"), true); return; }
      button.disabled = true;
      show(form.getAttribute("data-sending"));
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          form.reset();
          show(form.getAttribute("data-success"));
        })
        .catch(function () { show(form.getAttribute("data-error"), true); })
        .then(function () { button.disabled = false; });
    });
  }
})();
