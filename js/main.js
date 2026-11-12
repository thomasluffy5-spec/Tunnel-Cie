/* =========================================================
   TUNNEL & CIE — Scripts
   Un seul fichier pour les trois pages : chaque module
   vérifie que ses éléments existent avant de s'exécuter.
   ========================================================= */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

  /* ---------- 1. Menu mobile ---------- */
  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.getElementById("nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      links.classList.toggle("is-open", !open);
    });

    // Ferme le menu après un clic sur un lien
    links.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("is-open");
      }
    });
  }

  /* ---------- 2. Apparition au défilement ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* ---------- 3. Compteur national de minutes englouties ---------- */
  function initCounter() {
    const el = document.getElementById("minutes-counter");
    if (!el) return;

    // Base qui augmente avec le temps réel, pour que le chiffre change à chaque visite
    const epoch = Date.UTC(2026, 0, 1);
    let value = 12847392 + Math.floor((Date.now() - epoch) / 60000) * 3;
    const fmt = (n) => n.toLocaleString("fr-FR");
    el.textContent = fmt(value);

    if (prefersReducedMotion) return;
    setInterval(() => {
      value += 1 + Math.floor(Math.random() * 4);
      el.textContent = fmt(value);
    }, 900);
  }

  /* ---------- 4. Terminal rétro ---------- */
  function initTerminal() {
    const screen = document.getElementById("terminal-screen");
    if (!screen) return;

    const lines = [
      "> TUNNEL-OS v7.4 (C) 1974 TUNNEL & CIE",
      "> INITIALISATION DU MODULE DE DIGRESSION... OK",
      "> CHARGEMENT DES ANECDOTES............... OK",
      "",
      "> ANALYSE DE LA CIBLE : PROFESSEUR DE MATHS",
      "> NIVEAU DE POLITESSE DÉTECTÉ : ÉLEVÉ",
      "> RÉSERVE DE PATIENCE : 87 %",
      "> SUJET D'ACCROCHE : L'INFINI",
      "> PROBABILITÉ DE RETOUR AU COURS : 3 %",
      "",
      "> STATUT : TUNNEL ENGAGÉ.",
      "> BONNE CHANCE, CITOYEN."
    ];
    const fullText = lines.join("\n");
    const cursor = '<span class="cursor"></span>';

    if (prefersReducedMotion) {
      screen.innerHTML = escapeHTML(fullText) + "\n" + cursor;
      return;
    }

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      let i = 0;
      const tick = () => {
        i++;
        screen.innerHTML = escapeHTML(fullText.slice(0, i)) + cursor;
        if (i < fullText.length) {
          const ch = fullText[i - 1];
          // petite pause en fin de ligne, comme un vieux terminal
          setTimeout(tick, ch === "\n" ? 260 : 22 + Math.random() * 30);
        }
      };
      tick();
    };

    screen.innerHTML = cursor;
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          start();
          obs.disconnect();
        }
      }, { threshold: 0.4 });
      obs.observe(screen);
    } else {
      start();
    }
  }

  /* ---------- 5. Générateur d'amorces de tunnel ---------- */
  function initOpener() {
    const quote = document.getElementById("opener-quote");
    const btn = document.getElementById("opener-btn");
    if (!quote || !btn) return;

    const openers = [
      "Monsieur, si les Romains avaient eu Internet, est-ce que l'Empire serait tombé quand même ?",
      "Attendez, mais en vrai, l'infini, il s'arrête où ?",
      "Ça me fait penser : vous savez comment on construisait les cathédrales sans grue ?",
      "Papi, raconte encore comment c'était, le service militaire.",
      "Tonton, c'est quoi la vraie différence entre un diesel et un essence ?",
      "Madame, vous pensez que Napoléon aurait été bon sur les réseaux sociaux ?",
      "Si on creusait un trou à travers la Terre et qu'on sautait dedans, il se passe quoi ?",
      "Monsieur, c'était comment, vos études à vous ?",
      "Mamie, comment vous vous êtes rencontrés avec Papi ?",
      "Mais du coup, les dinosaures, ils avaient des plumes ou pas ?",
      "Madame, pourquoi on dit « l'heure tourne » alors que c'est l'aiguille qui tourne ?",
      "Monsieur, si on remontait le temps et qu'on empêchait ce cours d'exister, on aurait quand même l'interro ?"
    ];
    let last = 0;

    btn.addEventListener("click", () => {
      let next;
      do { next = Math.floor(Math.random() * openers.length); } while (next === last);
      last = next;

      quote.classList.add("swap");
      setTimeout(() => {
        quote.textContent = "« " + openers[next] + " »";
        quote.classList.remove("swap");
      }, prefersReducedMotion ? 0 : 220);
    });
  }

  /* ---------- 6. Configurateur de tunnel ---------- */
  function initConfigurator() {
    const form = document.getElementById("config-form");
    if (!form) return;

    const FORMULES = {
      petit:  { label: "Petit Tunnel",          price: 4.99,  min: 5,   max: 10,  base: 35 },
      moyen:  { label: "Moyen Tunnel",          price: 14.99, min: 20,  max: 30,  base: 55 },
      grand:  { label: "Grand Tunnel",          price: 29.99, min: 45,  max: 60,  base: 72 },
      manche: { label: "Tunnel sous la Manche", price: 89.99, min: 120, max: 240, base: 88 }
    };
    const DOMAINES = {
      historique:   { label: "Historique",        mult: 1.2 },
      scientifique: { label: "Scientifique",      mult: 1.1 },
      famille:      { label: "Repas de famille",  mult: 1.5 },
      philo:        { label: "Philosophique",     mult: 1.3 },
      meca:         { label: "Mécanique",         mult: 1.0 },
      lore:         { label: "Lore de jeu vidéo", mult: 1.4 }
    };
    const CIBLES = {
      prof:  { label: "Professeur",     mult: 1.0, surcharge: 0,   bonus: 0 },
      oncle: { label: "Oncle bavard",   mult: 1.3, surcharge: 2,   bonus: 6 },
      chef:  { label: "Chef de projet", mult: 0.9, surcharge: 5,   bonus: -6 },
      mamie: { label: "Grand-mère",     mult: 2.0, surcharge: 0,   bonus: 12 }
    };
    const OPTIONS = {
      relance:  { price: 3, time: 8,  bonus: 6 },
      anecdote: { price: 5, time: 6,  bonus: 4 },
      tableau:  { price: 4, time: 10, bonus: 5 },
      question: { price: 2, time: 3,  bonus: 2 },
      garantie: { price: 9, time: 0,  bonus: 9 }
    };

    const out = {
      formule: document.getElementById("out-formule"),
      domaine: document.getElementById("out-domaine"),
      cible: document.getElementById("out-cible"),
      temps: document.getElementById("out-temps"),
      indice: document.getElementById("out-indice"),
      gauge: document.getElementById("gauge-fill"),
      verdict: document.getElementById("out-verdict"),
      total: document.getElementById("out-total")
    };

    // Pré-sélection via l'URL (?formule=grand)
    const params = new URLSearchParams(window.location.search);
    const preset = params.get("formule");
    if (preset && FORMULES[preset]) form.formule.value = preset;

    // Les boutons "Choisir" des cartes : sélection sans rechargement
    document.querySelectorAll("[data-formule]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        form.formule.value = link.dataset.formule;
        compute();
        document.getElementById("configurateur").scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
        history.replaceState(null, "", "?formule=" + link.dataset.formule + "#configurateur");
      });
    });

    function formatDuration(min) {
      if (min < 60) return Math.round(min) + " min";
      const h = Math.floor(min / 60);
      const m = Math.round(min % 60);
      return h + " h" + (m ? " " + String(m).padStart(2, "0") : "");
    }

    function verdictFor(indice) {
      if (indice < 45) return "Tunnel de courtoisie. La cible s'en remettra.";
      if (indice < 65) return "Bonne aspiration. Prévoyez une excuse pour le retard.";
      if (indice < 85) return "Cible probablement perdue.";
      if (indice < 97) return "Cible perdue. Le cours ne reprendra pas.";
      return "Point de non-retour. Prévenez sa famille.";
    }

    function compute() {
      const f = FORMULES[form.formule.value];
      const d = DOMAINES[form.domaine.value];
      const c = CIBLES[form.cible.value];
      const opts = [...form.querySelectorAll('input[name="option"]:checked')].map((i) => OPTIONS[i.value]);

      const optPrice = opts.reduce((s, o) => s + o.price, 0);
      const optTime = opts.reduce((s, o) => s + o.time, 0);
      const optBonus = opts.reduce((s, o) => s + o.bonus, 0);

      const total = f.price + c.surcharge + optPrice;
      const mult = d.mult * c.mult;
      const tMin = f.min * mult + optTime;
      const tMax = f.max * mult + optTime;
      const indice = Math.max(5, Math.min(99, Math.round(f.base + (d.mult - 1) * 20 + c.bonus + optBonus)));

      out.formule.textContent = f.label;
      out.domaine.textContent = d.label;
      out.cible.textContent = c.label;
      out.temps.textContent = formatDuration(tMin) + " à " + formatDuration(tMax);
      out.indice.textContent = indice + " %";
      out.gauge.style.width = indice + "%";
      out.verdict.textContent = verdictFor(indice);
      out.total.textContent = (form.formule.value === "manche" ? "dès " : "") + euro.format(total);

      return { f, d, c, total, tMin, tMax, indice };
    }

    form.addEventListener("change", compute);
    compute();

    // Commande (fictive) → modale
    const modal = document.getElementById("order-modal");
    const closeBtn = document.getElementById("modal-close");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const r = compute();
      document.getElementById("order-number").textContent =
        "TNL-" + String(Math.floor(1000 + Math.random() * 9000));
      document.getElementById("order-summary").textContent =
        r.f.label + " " + r.d.label.toLowerCase() + ", cible : " + r.c.label.toLowerCase() +
        ". Durée estimée : " + formatDuration(r.tMin) + " à " + formatDuration(r.tMax) +
        ". Un technicien se met en route. Il parle déjà.";

      if (modal && typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        alert("Commande enregistrée (fictivement). Site parodique : rien n'est facturé.");
      }
    });

    if (modal && closeBtn) {
      closeBtn.addEventListener("click", () => modal.close());
      // Clic sur le fond = fermeture
      modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
    }
  }

  /* ---------- 7. Témoignages : filtres + ajout ---------- */
  function initTestimonials() {
    const grid = document.getElementById("testi-grid");
    if (!grid) return;

    const buttons = document.querySelectorAll(".filter-btn");
    let current = "all";

    function applyFilter() {
      grid.querySelectorAll(".testi").forEach((card) => {
        const show = current === "all" || card.dataset.cat === current;
        card.classList.toggle("is-hidden", !show);
        if (show) card.classList.add("is-visible");
      });
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-pressed", String(b === btn));
        });
        current = btn.dataset.filter;
        applyFilter();
      });
    });

    const form = document.getElementById("testi-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nom = form.nom.value.trim();
      const texte = form.texte.value.trim();
      if (!nom || !texte) {
        form.reportValidity();
        return;
      }
      const role = form.role.value.trim() || "Client anonyme";
      const note = Number(form.note.value);
      const cat = form.cat.value;

      const card = document.createElement("article");
      card.className = "testi is-new is-visible";
      card.dataset.cat = cat;

      const stars = document.createElement("p");
      stars.className = "testi-stars";
      stars.setAttribute("aria-label", note + " étoiles sur 5");
      stars.textContent = "★".repeat(note) + "☆".repeat(5 - note);

      const text = document.createElement("p");
      text.className = "testi-text";
      text.textContent = "« " + texte + " »";

      const author = document.createElement("p");
      author.className = "testi-author";
      author.textContent = nom + " ";
      const roleSpan = document.createElement("span");
      roleSpan.textContent = "— " + role;
      author.appendChild(roleSpan);

      const stamp = document.createElement("span");
      stamp.className = "stamp " + (cat === "cible" ? "stamp-red" : "stamp-blue");
      stamp.textContent = "Nouveau";

      card.append(stars, text, author, stamp);
      grid.prepend(card);

      form.reset();
      // Affiche la catégorie du nouveau témoignage si un autre filtre est actif
      if (current !== "all" && current !== cat) {
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBtn) allBtn.click();
      }
      card.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
    });
  }

  /* ---------- Utilitaire ---------- */
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------- Lancement ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initReveal();
    initCounter();
    initTerminal();
    initOpener();
    initConfigurator();
    initTestimonials();
  });
})();
