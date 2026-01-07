// script.js

// 1) CONFIG
const CURRENT_TOPIC = "Culture";
const DOMAIN_URL = "https://stories.polynesianpride.co"; // không có "/" ở cuối để tránh double-slash
const POSTS_LIMIT = 6;

// 2) DATA (demo). Thực tế bạn có thể thay bằng data từ Shopify / Storefront API / Liquid render.
const blogPosts = [
  // --- POLYNESIA ---
  { id: 1, title: "Điệu nhảy Hula: Linh hồn của Hawaii", region: "Polynesia", country: "Hawaii", tags: ["Culture", "Dance"], img: "https://images.unsplash.com/photo-1462400362591-9ca55235346a?q=80&w=1132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", date: "2024-01-15" },
  { id: 2, title: "Lễ hội xăm mình Tattoo tại Samoa", region: "Polynesia", country: "Samoa", tags: ["Culture", "Art"], img: "https://images.unsplash.com/photo-1596323086961-419b6e87a270?q=80&w=600&auto=format&fit=crop", date: "2024-02-10" },
  { id: 3, title: "Haka: Tiếng gầm của chiến binh Maori", region: "Polynesia", country: "New Zealand", tags: ["Culture", "History"], img: "https://images.unsplash.com/photo-1469521669194-babb45f835ae?q=80&w=600&auto=format&fit=crop", date: "2024-03-05" },
  { id: 4, title: "Bí mật đằng sau hoa Lei", region: "Polynesia", country: "Hawaii", tags: ["Culture", "Nature"], img: "https://images.unsplash.com/photo-1589394666421-26c715974419?q=80&w=600&auto=format&fit=crop", date: "2024-03-12" },
  { id: 5, title: "Ẩm thực Tahiti: Cá sống Poisson Cru", region: "Polynesia", country: "Tahiti", tags: ["Culture", "Food"], img: "https://images.unsplash.com/photo-1532966527582-730ce972627e?q=80&w=600&auto=format&fit=crop", date: "2023-12-20" },

  // --- MELANESIA ---
  { id: 6, title: "Nghi lễ Kava tại Fiji", region: "Melanesia", country: "Fiji", tags: ["Culture", "Drink"], img: "https://images.unsplash.com/photo-1598327105654-706f9d453667?q=80&w=600&auto=format&fit=crop", date: "2024-02-01" },
  { id: 7, title: "Bộ lạc vùng cao nguyên Papua", region: "Melanesia", country: "Papua New Guinea", tags: ["Culture", "People"], img: "https://images.unsplash.com/photo-1550850839-8dc894ed385a?q=80&w=600&auto=format&fit=crop", date: "2024-01-20" },
  { id: 8, title: "Lặn biển xác tàu Vanuatu", region: "Melanesia", country: "Vanuatu", tags: ["Culture", "History"], img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop", date: "2023-11-15" },

  // --- MICRONESIA ---
  { id: 10, title: "Đá tiền Yap: Đơn vị tiền tệ khổng lồ", region: "Micronesia", country: "Yap", tags: ["Culture", "History"], img: "https://images.unsplash.com/photo-1596522518420-56247c7d424b?q=80&w=600&auto=format&fit=crop", date: "2024-01-05" },
  { id: 11, title: "Truyền thuyết hồ sứa Palau", region: "Micronesia", country: "Palau", tags: ["Culture", "Nature"], img: "https://images.unsplash.com/photo-1551068832-720485662705?q=80&w=600&auto=format&fit=crop", date: "2024-02-28" },
  { id: 12, title: "Chiến tranh Thái Bình Dương tại Guam", region: "Micronesia", country: "Guam", tags: ["Culture", "History"], img: "https://images.unsplash.com/photo-1518081461904-7d8fbed95449?q=80&w=600&auto=format&fit=crop", date: "2023-09-15" }
];

// Fallback mô tả (nếu bạn không render data-desc từ metafield)
const fallbackDescriptions = {
  "Polynesia": "Khám phá tam giác Polynesia huyền bí với Hawaii, New Zealand và Samoa.",
  "Melanesia": "Vùng đất đa dạng ngôn ngữ, văn hóa thổ dân nguyên sơ.",
  "Micronesia": "Hàng ngàn đảo nhỏ rải rác như ngọc, văn hóa hàng hải đặc sắc."
};

// 3) HELPERS
function toSlug(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function buildBlogUrl(country) {
  // /blogs/[country-slug]/tagged/[topic-slug]
  return `${DOMAIN_URL}/blogs/${toSlug(country)}/tagged/${toSlug(CURRENT_TOPIC)}`;
}

function getDescription({ region, country, sourceBtn }) {
  // Ưu tiên mô tả từ "metafield" (render vào data-desc)
  const fromBtn = (sourceBtn?.dataset?.desc || "").trim();
  if (fromBtn) return fromBtn;

  // Fallback: mô tả theo region
  return fallbackDescriptions[region] || "Đang cập nhật mô tả...";
}

function guessPostUrl(post) {
  // Demo URL (tuỳ hệ thống thật mà thay)
  // Shopify thường: /blogs/{blog-handle}/{article-handle}
  return `${DOMAIN_URL}/blogs/${toSlug(post.country)}/${toSlug(post.title)}`;
}

// 4) CORE
function updateUI(region, country, sourceBtn) {
  const regionKey = region.toLowerCase();

  const titleEl = document.getElementById(`title-${regionKey}`);
  const descEl = document.getElementById(`desc-${regionKey}`);
  const linkEl = document.getElementById(`link-${regionKey}`);

  if (!titleEl || !descEl || !linkEl) return;

  // (1) H3: Country Blogs
  titleEl.textContent = `${country} Blogs`;

  // (2) Description: metafield (data-desc) -> fallback
  descEl.classList.add("fading");
  window.setTimeout(() => {
    descEl.textContent = getDescription({ region, country, sourceBtn });
    descEl.classList.remove("fading");
  }, 150);

  // CTA: View all
  linkEl.href = buildBlogUrl(country);
  linkEl.innerHTML = `Xem tất cả ${country} (${CURRENT_TOPIC}) <span class="arrow">→</span>`;

  // (3) Latest posts
  renderPosts(region, country);
}

function renderPosts(region, country) {
  const gridEl = document.getElementById(`grid-${region.toLowerCase()}`);
  if (!gridEl) return;

  let posts = blogPosts.filter(p =>
    p.region === region &&
    p.country === country &&
    p.tags?.includes(CURRENT_TOPIC)
  );

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  posts = posts.slice(0, POSTS_LIMIT);

  gridEl.innerHTML = "";

  if (posts.length === 0) {
    gridEl.innerHTML = `<div class="no-data">Chưa có bài viết mới nhất cho <strong>${country}</strong>.</div>`;
    return;
  }

  const fallbackImg = "https://placehold.co/600x400?text=No+Image";

  gridEl.innerHTML = posts.map(post => {
    const url = post.url || guessPostUrl(post);

    return `
      <article class="post-card">
        <div class="card-img">
          <img
            src="${post.img}"
            alt="${post.title}"
            loading="lazy"
            onerror="this.onerror=null;this.src='${fallbackImg}';"
          />
        </div>
        <div class="card-body">
          <span class="card-meta">${post.country}</span>
          <h4 class="card-title"><a href="${url}">${post.title}</a></h4>
          <span class="card-date">${post.date}</span>
        </div>
      </article>
    `;
  }).join("");
}

// 5) INIT + EVENTS
function initRegion(region) {
  const filterEl = document.querySelector(`.country-filter[data-region="${region}"]`);
  if (!filterEl) return;

  const buttons = Array.from(filterEl.querySelectorAll(".filter-btn"));
  if (buttons.length === 0) return;

  // Default chọn button đầu tiên
  buttons.forEach((btn, idx) => {
    const isActive = idx === 0;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  const firstBtn = buttons[0];
  updateUI(region, firstBtn.dataset.country, firstBtn);
}

document.addEventListener("DOMContentLoaded", () => {
  initRegion("Polynesia");
  initRegion("Melanesia");
  initRegion("Micronesia");

  // Event delegation cho từng region menu
  document.querySelectorAll(".country-filter").forEach(filterEl => {
    filterEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn || !filterEl.contains(btn)) return;

      const region = filterEl.dataset.region;
      const country = btn.dataset.country;

      // Active state
      filterEl.querySelectorAll(".filter-btn").forEach(sib => {
        sib.classList.remove("active");
        sib.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      updateUI(region, country, btn);
    });
  });
});
