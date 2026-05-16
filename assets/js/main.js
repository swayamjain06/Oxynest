
    // ── PARTICLES ──────────────────────────────────────────────
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");
    let W,
      H,
      particles = [];
    function resizeCanvas() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H + H;
        this.r = Math.random() * 3 + 1;
        this.speed = Math.random() * 0.5 + 0.2;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.drift = (Math.random() - 0.5) * 0.3;
      }
      update() {
        this.y -= this.speed;
        this.x += this.drift;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${this.opacity})`;
        ctx.fill();
      }
    }
    for (let i = 0; i < 80; i++) particles.push(new Particle());
    function animateParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ── NAVBAR ─────────────────────────────────────────────────
    window.addEventListener("scroll", () => {
      document
        .getElementById("navbar")
        .classList.toggle("scrolled", window.scrollY > 60);
    });

    // ── MOBILE MENU ────────────────────────────────────────────
    function toggleMobileMenu() {
      document.getElementById("mobileMenu").classList.toggle("active");
    }

    // ── SCROLL REVEAL ──────────────────────────────────────────
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.15 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((el) => observer.observe(el));

    // ── COUNTER ANIMATION ──────────────────────────────────────
    function animateCounter(el) {
      const target = parseInt(el.dataset.count);
      const duration = 2000;
      const start = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCounter(e.target);
            counterObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    document
      .querySelectorAll("[data-count]")
      .forEach((el) => counterObs.observe(el));

    // ── THERAPY TABS ───────────────────────────────────────────
    function showTherapy(id) {
      document
        .querySelectorAll(".page-section")
        .forEach((s) => s.classList.remove("active"));
      document
        .querySelectorAll(".page-tab")
        .forEach((t) => t.classList.remove("active"));
      document.getElementById("therapy-" + id).classList.add("active");
      const tabs = document.querySelectorAll(".page-tab");
      const map = { hbot: 0, sauna: 1, hydro: 2 };
      if (tabs[map[id]]) tabs[map[id]].classList.add("active");
    }

    // ── FAQ ACCORDION ──────────────────────────────────────────
    function toggleFaq(btn) {
      const answer = btn.nextElementSibling;
      const isOpen = answer.classList.contains("open");
      document.querySelectorAll(".faq-question").forEach((b) => {
        b.classList.remove("open");
        b.nextElementSibling.classList.remove("open");
      });
      if (!isOpen) {
        btn.classList.add("open");
        answer.classList.add("open");
      }
    }

    // ── TESTIMONIALS SLIDER ────────────────────────────────────
    let sliderIndex = 0;
    function slideTestimonials(dir) {
      const track = document.getElementById("testimonialTrack");
      const cards = track.querySelectorAll(".testimonial-card");
      const cardW = cards[0].offsetWidth + 24;
      const maxIndex =
        cards.length - Math.floor(track.parentElement.offsetWidth / cardW);
      sliderIndex = Math.max(0, Math.min(sliderIndex + dir, maxIndex));
      track.style.transform = `translateX(-${sliderIndex * cardW}px)`;
    }
    setInterval(() => slideTestimonials(1), 5000);

    // ── CALENDAR ───────────────────────────────────────────────
    let calDate = new Date();
    function renderCalendar() {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      document.getElementById("calMonth").textContent =
        `${months[calDate.getMonth()]} ${calDate.getFullYear()}`;
      const grid = document.getElementById("calGrid");
      grid.innerHTML = "";
      const first = new Date(
        calDate.getFullYear(),
        calDate.getMonth(),
        1,
      ).getDay();
      const days = new Date(
        calDate.getFullYear(),
        calDate.getMonth() + 1,
        0,
      ).getDate();
      const today = new Date();
      for (let i = 0; i < first; i++) {
        const d = document.createElement("div");
        d.className = "cal-day empty";
        grid.appendChild(d);
      }
      for (let d = 1; d <= days; d++) {
        const el = document.createElement("div");
        el.className = "cal-day";
        el.textContent = d;
        const thisDate = new Date(
          calDate.getFullYear(),
          calDate.getMonth(),
          d,
        );
        if (
          thisDate <
          new Date(today.getFullYear(), today.getMonth(), today.getDate())
        )
          el.classList.add("past");
        else if (
          d === today.getDate() &&
          calDate.getMonth() === today.getMonth() &&
          calDate.getFullYear() === today.getFullYear()
        )
          el.classList.add("today");
        else
          el.addEventListener("click", function () {
            document
              .querySelectorAll(".cal-day")
              .forEach((x) => x.classList.remove("selected"));
            this.classList.add("selected");
          });
        grid.appendChild(el);
      }
    }
    function changeMonth(dir) {
      calDate.setMonth(calDate.getMonth() + dir);
      renderCalendar();
    }
    renderCalendar();

    // ── TIME SLOT ──────────────────────────────────────────────
    function selectTime(el) {
      document
        .querySelectorAll(".time-slot")
        .forEach((s) => s.classList.remove("selected"));
      el.classList.add("selected");
    }

    // ── THERAPY BOOKING OPTION ─────────────────────────────────
    function selectTherapyOption(el, name) {
      document.querySelectorAll(".booking-card .glass-card").forEach((c) => {
        c.style.borderColor = "";
        c.style.background = "";
      });
      el.style.borderColor = "var(--aqua)";
      el.style.background = "rgba(34,211,238,.1)";
    }

    // ── SUBMIT BOOKING ─────────────────────────────────────────
    function submitBooking() {
      const name = document.getElementById("bookName").value;
      const phone = document.getElementById("bookPhone").value;
      if (!name || !phone) {
        alert("Please fill in your name and phone number.");
        return;
      }
      showPopup();
    }

    // ── SUBMIT CONTACT ─────────────────────────────────────────
    function submitContact(e) {
      e.preventDefault();
      showPopup();
    }

    // ── POPUP ──────────────────────────────────────────────────
    function showPopup() {
      document.getElementById("overlayBg").classList.add("active");
      document.getElementById("successPopup").classList.add("active");
    }
    function closePopup() {
      document.getElementById("overlayBg").classList.remove("active");
      document.getElementById("successPopup").classList.remove("active");
    }

    // ── VIDEO FILTER ───────────────────────────────────────────
    let activeCategory = "all";
    function filterVideos() {
      const query = document
        .getElementById("videoSearch")
        .value.toLowerCase();
      document.querySelectorAll("#videoGrid .video-card").forEach((card) => {
        const title = card.dataset.title;
        const cat = card.dataset.cat;
        const matchCat =
          activeCategory === "all" || cat.includes(activeCategory);
        const matchSearch = !query || title.includes(query);
        card.style.display = matchCat && matchSearch ? "" : "none";
      });
    }
    function filterByCategory(cat, btn) {
      activeCategory = cat;
      document
        .querySelectorAll(".filter-tab")
        .forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");
      filterVideos();
    }

    // ── CHATBOT ────────────────────────────────────────────────
    const chatReplies = {
      "what is hbot":
        "HBOT (Hyperbaric Oxygen Therapy) delivers 100% pure oxygen at elevated pressure inside a specialized chamber, accelerating your body's natural healing. Sessions are 60–90 minutes. 🫧",
      "book appointment":
        "I'd be happy to help you book! Please scroll to our Booking section, or call us at +91 9594133323. You can also send us your preferred date and time here! 📅",
      prices:
        "Our session prices: HBOT from ₹2,500/session, Infrared Sauna from ₹1,200/session, Hydrocolon from ₹2,000/session. Package deals available. Contact us for a personalized quote! 💳",
      location:
        "We're located at Unit No: 4, Blue Orbit, Sunder Nagar Rd, Malad West, Mumbai 400064. Open Tue–Sun 10am–6pm, Monday closed. 📍",
      safety:
        "All our therapies are completely safe under certified medical supervision. We follow ECHM, UHMS and ISO standards. Every patient undergoes a thorough medical intake screening before treatment. 🛡️",
      "infrared sauna":
        "Our infrared sauna uses far-infrared rays that penetrate 4–5cm into tissue, promoting deep detox, stress relief, muscle recovery and skin rejuvenation. Sessions are 30–45 minutes. 🌡️",
      hydrocolon:
        "Hydrocolon therapy is a gentle colon cleanse using warm, purified water via FDA-approved equipment. It helps with digestion, bloating, detox and gut wellness. Sessions are 45–60 minutes. 💧",
    };
    function sendChat() {
      const input = document.getElementById("chatInput");
      const msg = input.value.trim();
      if (!msg) return;
      addChatMsg(msg, "user");
      input.value = "";
      setTimeout(() => {
        const key = Object.keys(chatReplies).find((k) =>
          msg.toLowerCase().includes(k),
        );
        const reply = key
          ? chatReplies[key]
          : "Thank you for your message! For detailed assistance, please call us at +91 9594133323 or email enquiry.oxynest@gmail.com. Our team typically responds within 2 hours. 😊";
        addChatMsg(reply, "bot");
      }, 600);
    }
    function quickAsk(q) {
      document.getElementById("chatInput").value = q;
      sendChat();
    }
    function addChatMsg(text, type) {
      const msgs = document.getElementById("chatMessages");
      const div = document.createElement("div");
      div.className = `chat-msg ${type}`;
      div.textContent = text;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }
    function toggleChatbot() {
      document.getElementById("chatbotWindow").classList.toggle("active");
    }

    // ── THEME TOGGLE ───────────────────────────────────────────
    let lightMode = false;
    function toggleTheme() {
      lightMode = !lightMode;
      document.getElementById("themeBtn").textContent = lightMode
        ? "☀️"
        : "🌙";
      const r = document.documentElement.style;
      if (lightMode) {
        r.setProperty("--navy", "#f0f8ff");
        r.setProperty("--navy-mid", "#e6f4ff");
        r.setProperty("--navy-card", "#daeeff");
        r.setProperty("--text-primary", "#0c1a2e");
        r.setProperty("--text-muted", "#4a6580");
        r.setProperty("--glass", "rgba(0,0,0,.04)");
        r.setProperty("--glass-border", "rgba(0,0,0,.1)");
      } else {
        r.setProperty("--navy", "#0c1a2e");
        r.setProperty("--navy-mid", "#112240");
        r.setProperty("--navy-card", "#162a45");
        r.setProperty("--text-primary", "#e2f8ff");
        r.setProperty("--text-muted", "#94a3b8");
        r.setProperty("--glass", "rgba(255,255,255,.06)");
        r.setProperty("--glass-border", "rgba(255,255,255,.12)");
      }
    }

    // ── NEWSLETTER ─────────────────────────────────────────────
    function subscribeNewsletter() {
      const inp = document.querySelector(".newsletter-input");
      if (inp.value && inp.value.includes("@")) {
        inp.value = "✓ Subscribed! Thank you";
        inp.style.color = "var(--sage)";
        inp.disabled = true;
      }
    }

    // ── SMOOTH ACTIVE NAV ──────────────────────────────────────
    const sections = [
      "home",
      "about",
      "therapies",
      "videos",
      "research",
      "contact",
      "booking",
    ];
    window.addEventListener("scroll", () => {
      const pos = window.scrollY + 200;
      sections.forEach((id) => {
        const el =
          document.getElementById(id) ||
          document.getElementById(id + "-preview");
        if (!el) return;
        if (pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          document.querySelectorAll(".nav-links a").forEach((a) => {
            a.style.color =
              a.getAttribute("href") === "#" + id ? "var(--aqua)" : "";
          });
        }
      });
    });
  