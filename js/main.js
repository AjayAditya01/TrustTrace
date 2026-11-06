(function () {
  const D = () => window.TrustTraceData;
  const navItems = [
    ["dashboard.html", "bi-grid-1x2", "Overview"],
    ["login-activities.html", "bi-clock-history", "Login Activities"],
    ["fraud-alerts.html", "bi-shield-exclamation", "Fraud Alerts"],
    ["users.html", "bi-people", "User Management"],
    ["settings.html", "bi-gear", "Settings"],
  ];
  function toast(message, type = "success") {
    let host = document.querySelector(".toast-host");
    if (!host) {
      host = document.createElement("div");
      host.className = "toast-host";
      host.setAttribute("aria-live", "polite");
      document.body.append(host);
    }
    const el = document.createElement("div");
    el.className = "toast-message" + (type === "error" ? " error" : "");
    el.innerHTML = `<i class="bi ${type === "error" ? "bi-exclamation-circle" : "bi-check-circle"}"></i>${D()?.esc(message) || message}`;
    host.append(el);
    setTimeout(() => el.remove(), 3400);
  }
  function renderShell() {
    const side = document.getElementById("sidebar"),
      top = document.getElementById("topbar");
    if (!side || !top) return;
    const current = location.pathname.split("/").pop() || "dashboard.html";
    side.innerHTML = `<div class="brand"><div class="brand-mark"><img src="assets/brand-mark.svg" alt=""></div><div class="brand-name">Trust<span>Trace</span></div></div><div class="nav-caption">Workspace</div><nav class="side-nav">${navItems.map(([href, icon, label]) => `<a class="nav-link ${current === href ? "active" : ""}" href="${href}"><i class="bi ${icon}"></i><span>${label}</span>${label === "Fraud Alerts" ? '<span class="nav-badge" id="navAlertCount">3</span>' : ""}</a>`).join("")}</nav><div class="sidebar-bottom"><div class="sidebar-demo"><strong><i class="bi bi-info-circle text-cyan"></i> Demo workspace</strong><p>All activity and risk signals are simulated locally.</p></div><div class="sidebar-foot"><a href="login.html" class="nav-link" data-action="logout"><i class="bi bi-box-arrow-left"></i><span>Sign out</span></a></div></div>`;
    top.innerHTML = `<button class="icon-button mobile-menu" id="menuToggle" aria-label="Open navigation"><i class="bi bi-list"></i></button><label class="global-search"><i class="bi bi-search"></i><input id="globalSearch" type="search" placeholder="Search users, IP addresses..." aria-label="Search this page"></label><div class="top-spacer"></div><button class="icon-button" id="notificationToggle" aria-label="Notifications"><i class="bi bi-bell"></i><span class="notification-dot"></span></button><div class="profile-wrap"><button class="profile-trigger" id="profileToggle" aria-label="Open profile menu"><span class="avatar" id="topAvatar">AD</span><span class="profile-meta"><strong id="topName">Admin User</strong><span>Security admin</span></span><i class="bi bi-chevron-down muted small"></i></button></div><div class="header-popover" id="notificationPanel" hidden><div class="popover-head"><strong>Notifications</strong><button type="button" data-action="read-notifications">Mark all read</button></div><div class="notice-item"><i class="bi bi-exclamation-triangle notice-icon"></i><div><p>New high-risk sign-in blocked</p><small>Singapore · 30 minutes ago</small></div></div><div class="notice-item"><i class="bi bi-person-plus notice-icon"></i><div><p>2 new users added this week</p><small>Workspace activity · Today</small></div></div></div><div class="header-popover" id="profilePanel" hidden><div class="popover-head"><strong id="profileName">Admin User</strong><span class="role-pill">Administrator</span></div><p class="muted small" style="margin:0 0 12px">Local demo profile</p><a href="settings.html" class="table-action">Account settings&nbsp; →</a><hr style="border-color:#223b55;opacity:.65"><a href="login.html" class="table-action" data-action="logout">Sign out</a></div>`;
    let backdrop = document.querySelector(".mobile-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "mobile-backdrop";
      document.body.append(backdrop);
    }
  }
  function setProfile() {
    let profile = { name: "Admin User", email: "admin@trusttrace.demo" };
    try {
      profile = {
        ...profile,
        ...JSON.parse(localStorage.getItem("tt_demo_profile") || "{}"),
      };
    } catch (_) {}
    const name = document.getElementById("topName"),
      ava = document.getElementById("topAvatar"),
      pop = document.getElementById("profileName");
    if (name) name.textContent = profile.name;
    if (pop) pop.textContent = profile.name;
    if (ava) ava.textContent = D()?.initials(profile.name) || "AD";
  }
  function init() {
    renderShell();
    setProfile();
    const menu = document.getElementById("menuToggle"),
      side = document.getElementById("sidebar"),
      back = document.querySelector(".mobile-backdrop");
    menu?.addEventListener("click", () => {
      side.classList.toggle("open");
      back.classList.toggle("show");
    });
    back?.addEventListener("click", () => {
      side.classList.remove("open");
      back.classList.remove("show");
    });
    const np = document.getElementById("notificationPanel"),
      pp = document.getElementById("profilePanel");
    document
      .getElementById("notificationToggle")
      ?.addEventListener("click", () => {
        np.hidden = !np.hidden;
        pp.hidden = true;
      });
    document.getElementById("profileToggle")?.addEventListener("click", () => {
      pp.hidden = !pp.hidden;
      np.hidden = true;
    });
    document.addEventListener("click", (e) => {
      const action = e.target.closest("[data-action]")?.dataset.action;
      if (action === "logout") {
        e.preventDefault();
        localStorage.removeItem("tt_demo_session");
        location.href = "login.html";
      }
      if (action === "read-notifications") {
        document.querySelector(".notification-dot")?.remove();
        np.hidden = true;
        toast("Demo notifications marked as read.");
      }
      if (action === "dismiss-toast")
        e.target.closest(".toast-message")?.remove();
      if (!e.target.closest("#notificationToggle,#notificationPanel"))
        np && (np.hidden = true);
      if (!e.target.closest("#profileToggle,#profilePanel"))
        pp && (pp.hidden = true);
    });
    const search = document.getElementById("globalSearch");
    search?.addEventListener("input", () => filterCurrent(search.value));
    document.querySelectorAll("[data-demo-toast]").forEach((el) =>
      el.addEventListener("click", (e) => {
        if (el.tagName === "A" && el.getAttribute("href") === "#")
          e.preventDefault();
        toast(el.dataset.demoToast);
      }),
    );
  }
  function filterCurrent(query) {
    const q = query.trim().toLowerCase();
    const rows = [
      ...document.querySelectorAll(
        "tbody tr[data-search],.alert-card[data-search]",
      ),
    ];
    rows.forEach((row) => {
      const localHidden = row.dataset.filterHidden === "true";
      row.dataset.globalHidden = String(
        !!q && !row.dataset.search.toLowerCase().includes(q),
      );
      row.hidden = localHidden || row.dataset.globalHidden === "true";
    });
    const count = rows.filter((row) => !row.hidden).length;
    const meta = document.querySelector("[data-search-count]");
    if (meta)
      meta.textContent = q
        ? `${count} matching result${count === 1 ? "" : "s"}`
        : "";
  }
  window.TrustTrace = { toast, filterCurrent, init };
  document.addEventListener("DOMContentLoaded", init);
})();
