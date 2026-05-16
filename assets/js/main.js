
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
  

// -----------------------------------------------------------------
// GOOGLE REVIEWS INTEGRATION
// -----------------------------------------------------------------
function loadGoogleReviews() {
  // TODO: Replace with your actual Google API Key and Place ID
  const apiKey = "AIzaSyDGtOW2Y2geuQ87Q5fEcfycpZHxdHIA8XQ"; 
  const placeId = "YOUR_GOOGLE_PLACE_ID"; 
  
  const track = document.getElementById("testimonialTrack");
  if (!track) return;

  // If credentials are not set, load the beautifully styled fallback dummy data
  if (apiKey === "YOUR_GOOGLE_API_KEY" || placeId === "YOUR_GOOGLE_PLACE_ID") {
    renderDummyReviews(track);
    return;
  }

  // Load Google Maps Script dynamically for Places API
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = () => fetchReviewsWithPlaces(placeId, track);
  document.head.appendChild(script);
}

function fetchReviewsWithPlaces(placeId, track) {
  const dummyDiv = document.createElement("div");
  const service = new google.maps.places.PlacesService(dummyDiv);
  
  service.getDetails({
    placeId: placeId,
    fields: ['reviews']
  }, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews) {
      renderReviews(place.reviews, track);
    } else {
      console.error("Failed to load Google reviews. Status:", status);
      renderDummyReviews(track); // Fallback if it fails
    }
  });
}

function renderReviews(reviews, track) {
  track.innerHTML = ""; // Clear loading text
  
  reviews.forEach(review => {
    const card = document.createElement("div");
    card.className = "glass-card testimonial-card";
    
    // Generate star rating
    const rating = Math.round(review.rating);
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    
    // Provide a default avatar if Google doesn't return one
    const avatar = review.profile_photo_url || "https://via.placeholder.com/40?text="+review.author_name.charAt(0);
    
    card.innerHTML = `
      <div class="testimonial-stars" style="color: #fbbf24; font-size: 1.2rem; letter-spacing: 2px;">${stars}</div>
      <p class="testimonial-text">"${review.text}"</p>
      <div class="testimonial-author">
        <img src="${avatar}" alt="${review.author_name}" class="testimonial-avatar" style="border-radius: 50%; width: 45px; height: 45px; object-fit: cover; border: 2px solid var(--aqua);">
        <div>
          <div class="testimonial-name" style="font-weight: 600;">${review.author_name}</div>
          <div class="testimonial-therapy" style="color: var(--text-muted); font-size: 0.75rem;">
            Google Review • ${review.relative_time_description}
          </div>
        </div>
      </div>
    `;
    track.appendChild(card);
  });
}

function renderDummyReviews(track) {
  const dummyData = [
    { rating: 5, text: "After my knee surgery, I was told recovery would take 6 months. With HBOT at OXYNEST, I was back running in 10 weeks. The team was exceptional — knowledgeable, caring and always available.", author_name: "Rajesh Kapoor", profile_photo_url: "", relative_time_description: "A month ago" },
    { rating: 5, text: "I came to the clinic struggling with chronic fatigue for two years. The combination of HBOT and infrared sauna completely transformed my energy levels. I feel like myself again — it's been life-changing.", author_name: "Sunita Agarwal", profile_photo_url: "", relative_time_description: "2 months ago" },
    { rating: 5, text: "The hydrocolon therapy resolved my decade-long bloating and digestive issues. I was skeptical at first but the team was so professional and thorough. Highly recommend!", author_name: "Preethi Menon", profile_photo_url: "", relative_time_description: "3 months ago" },
    { rating: 5, text: "As a competitive swimmer, recovery is everything. Regular infrared sauna sessions at OXYNEST have dramatically reduced my muscle soreness and improved my sleep quality. An absolute game changer.", author_name: "Arjun Verma", profile_photo_url: "", relative_time_description: "4 months ago" }
  ];
  renderReviews(dummyData, track);
}

// Ensure the Google Reviews logic runs after page load
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("testimonialTrack")) {
    loadGoogleReviews();
  }
});
