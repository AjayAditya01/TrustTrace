(function () {
  const D = () => window.TrustTraceData,
    T = () => window.TrustTrace;
  const byId = (id) => document.getElementById(id);
  const riskKind = (risk) =>
    risk >= 70 ? "high" : risk >= 40 ? "medium" : "low";
  const statusClass = (status) =>
    status === "Success" || status === "Active"
      ? "status-success"
      : status === "Blocked" || status === "Suspended"
        ? "status-blocked"
        : "status-review";
  const statusLabel = (status) =>
    status === "Success"
      ? "Success"
      : status === "Active"
        ? "Active"
        : status === "Blocked"
          ? "Blocked"
          : status === "Suspended"
            ? "Suspended"
            : "Review";
  const pill = (status) =>
    `<span class="status-pill ${statusClass(status)}">${D().esc(statusLabel(status))}</span>`;
  const searchKey = (...parts) =>
    D().esc(parts.filter(Boolean).join(" ").toLowerCase());
  function applyFilters(selector, predicate) {
    const global = (byId("globalSearch")?.value || "").trim().toLowerCase();
    const rows = [...document.querySelectorAll(selector)];
    rows.forEach((el) => {
      const local = !predicate(el);
      el.dataset.filterHidden = String(local);
      const globalHidden =
        !!global && !el.dataset.search.toLowerCase().includes(global);
      el.hidden = local || globalHidden;
    });
    const q = (
      document.querySelector("[data-local-search]")?.value || global
    ).trim();
    const visible = rows.filter((el) => !el.hidden).length;
    const count =
      byId("visibleCount") || document.querySelector("[data-search-count]");
    if (count)
      count.textContent = q
        ? `${visible} matching result${visible === 1 ? "" : "s"}`
        : "";
  }
  function exportCsv(filename, headers, records) {
    const quote = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [
      headers.map(quote).join(","),
      ...records.map((row) => row.map(quote).join(",")),
    ].join("\r\n");
    const blob = new Blob(["\ufeff" + lines], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    T().toast("Your demo CSV has been downloaded.");
  }
  function renderDashboard() {
    const recent = byId("recentLogins"),
      alerts = byId("recentAlerts");
    if (!recent || !alerts) return;
    recent.innerHTML = D()
      .loginActivities.slice(0, 5)
      .map(
        (r) =>
          `<tr data-search="${searchKey(r.name, r.email, r.ip, r.location, r.device, r.status)}"><td><div class="user-cell"><span class="mini-avatar">${D().esc(D().initials(r.name))}</span><div><strong>${D().esc(r.name)}</strong><small>${D().esc(r.email)}</small></div></div></td><td>${D().esc(r.location)}</td><td>${D().fmtTime(r.time, { hour: "numeric", minute: "2-digit" })}</td><td>${pill(r.status)}</td><td><a class="table-action" href="login-details.html?id=${encodeURIComponent(r.id)}" aria-label="View ${D().esc(r.name)} login details"><i class="bi bi-arrow-up-right"></i></a></td></tr>`,
      )
      .join("");
    const allAlerts = D().getAlertStates();
    const open = allAlerts.filter((a) => a.status === "Open");
    alerts.innerHTML = (open.length ? open.slice(0, 3) : allAlerts.slice(0, 3))
      .map(
        (a) =>
          `<div class="alert-item ${a.severity === "Medium" ? "medium" : ""}"><span class="alert-symbol"><i class="bi ${D().esc(a.icon)}"></i></span><div class="alert-copy"><strong>${D().esc(a.title)}</strong><p>${D().esc(a.user)} · ${D().esc(a.location)}</p><span class="alert-meta">${D().fmtTime(a.time, { hour: "numeric", minute: "2-digit" })} · ${D().esc(a.severity)} risk</span></div><a class="alert-open" href="login-details.html?id=${encodeURIComponent(a.loginId)}" aria-label="Open alert details"><i class="bi bi-arrow-up-right"></i></a></div>`,
      )
      .join("");
    const openCount = allAlerts.filter((a) => a.status === "Open").length;
    const metric = byId("openAlertMetric");
    if (metric) metric.textContent = openCount;
    const badge = byId("navAlertCount");
    if (badge) badge.textContent = openCount;
    const range = byId("dateRange");
    let chart;
    const sets = {
      7: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        success: [170, 220, 195, 290, 248, 330, 302],
        blocked: [11, 18, 14, 22, 17, 31, 24],
      },
      30: {
        labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
        success: [1240, 1490, 1370, 1680],
        blocked: [92, 108, 81, 115],
      },
      90: {
        labels: ["Aug", "Sep", "Oct"],
        success: [4820, 5230, 5510],
        blocked: [241, 226, 208],
      },
    };
    const canvas = byId("activityChart");
    if (canvas && window.Chart) {
      byId("activityFallback")?.setAttribute("hidden", "");
      chart = new Chart(canvas, {
        type: "line",
        data: {
          labels: sets[7].labels,
          datasets: [
            {
              label: "Successful",
              data: sets[7].success,
              borderColor: "#22d3ee",
              backgroundColor: "rgba(34,211,238,.11)",
              fill: true,
              tension: 0.38,
              pointRadius: 2,
              pointBackgroundColor: "#22d3ee",
              borderWidth: 2,
            },
            {
              label: "Blocked",
              data: sets[7].blocked,
              borderColor: "#f04458",
              backgroundColor: "rgba(240,68,88,.02)",
              fill: false,
              tension: 0.38,
              pointRadius: 2,
              pointBackgroundColor: "#f04458",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: {
                color: "#91a5b9",
                boxWidth: 8,
                boxHeight: 8,
                usePointStyle: true,
                font: { family: "DM Sans", size: 10 },
                padding: 16,
              },
            },
            tooltip: {
              backgroundColor: "#10243b",
              borderColor: "#2a4967",
              borderWidth: 1,
              titleColor: "#f1f5f9",
              bodyColor: "#c3d2df",
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: "#74889f", font: { size: 10 } },
              border: { display: false },
            },
            y: {
              beginAtZero: true,
              grid: { color: "rgba(119,150,178,.11)" },
              ticks: { color: "#74889f", font: { size: 10 } },
              border: { display: false },
            },
          },
        },
      });
    }
    const updateChart = () => {
      const period = Number(range?.value || 7),
        data = sets[period];
      const label = document.getElementById("chartRangeLabel");
      if (label) label.textContent = `Last ${period} days`;
      const rangeLabel = byId("chartRangeLabel");
      if (rangeLabel) rangeLabel.textContent = `Last ${period} days`;
      if (chart) {
        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.success;
        chart.data.datasets[1].data = data.blocked;
        chart.update("none");
      }
      T().toast(`Dashboard updated to the last ${period} days.`);
    };
    range?.addEventListener("change", updateChart);
    byId("exportReport")?.addEventListener("click", () =>
      exportCsv(
        "trusttrace-demo-report.csv",
        [
          "Event ID",
          "Name",
          "Email",
          "IP address",
          "Location",
          "Device",
          "Timestamp",
          "Outcome",
          "Risk score",
        ],
        D().loginActivities.map((r) => [
          r.id,
          r.name,
          r.email,
          r.ip,
          r.location,
          r.device,
          r.time,
          r.status,
          r.risk,
        ]),
      ),
    );
  }
  function renderActivities() {
    const body = byId("activityRows");
    if (!body) return;
    const rows = D().loginActivities;
    body.innerHTML = rows
      .map(
        (r) =>
          `<tr data-search="${searchKey(r.id, r.name, r.email, r.ip, r.location, r.device, r.status)}" data-risk="${r.risk}" data-status="${D().esc(r.status)}"><td><div class="user-cell"><span class="mini-avatar">${D().esc(D().initials(r.name))}</span><div><strong>${D().esc(r.name)}</strong><small>${D().esc(r.email)}</small></div></div></td><td>${D().esc(r.ip)}</td><td>${D().esc(r.location)}</td><td>${D().esc(r.device)}</td><td>${D().fmtTime(r.time)}</td><td><span class="severity-pill severity-${riskKind(r.risk)}">${r.risk} · ${riskKind(r.risk)}</span></td><td>${pill(r.status)}</td><td><a class="table-action" href="login-details.html?id=${encodeURIComponent(r.id)}">Details <i class="bi bi-arrow-right"></i></a></td></tr>`,
      )
      .join("");
    const query = byId("activitySearch"),
      status = byId("activityStatus"),
      risk = byId("activityRisk");
    const filter = () => {
      const q = (query.value || "").trim().toLowerCase(),
        s = status.value,
        r = risk.value;
      applyFilters(
        "#activityRows tr",
        (el) =>
          (!q || el.dataset.search.includes(q)) &&
          (s === "all" || el.dataset.status === s) &&
          (r === "all" ||
            (r === "high" && Number(el.dataset.risk) >= 70) ||
            (r === "medium" &&
              Number(el.dataset.risk) >= 40 &&
              Number(el.dataset.risk) < 70) ||
            (r === "low" && Number(el.dataset.risk) < 40)),
      );
      const shown = [...body.querySelectorAll("tr")].filter(
        (x) => !x.hidden,
      ).length;
      const footer = byId("activityFooter");
      if (footer)
        footer.textContent = `Showing ${shown} of ${rows.length} simulated events`;
    };
    query?.addEventListener("input", filter);
    status?.addEventListener("change", filter);
    risk?.addEventListener("change", filter);
    byId("globalSearch")?.addEventListener("input", filter);
    filter();
    byId("exportActivities")?.addEventListener("click", () =>
      exportCsv(
        "trusttrace-login-activities.csv",
        [
          "Event ID",
          "Name",
          "Email",
          "IP address",
          "Location",
          "Device",
          "Timestamp",
          "Outcome",
          "Risk score",
        ],
        rows.map((r) => [
          r.id,
          r.name,
          r.email,
          r.ip,
          r.location,
          r.device,
          r.time,
          r.status,
          r.risk,
        ]),
      ),
    );
  }
  function renderAlerts() {
    const grid = byId("alertGrid");
    if (!grid) return;
    const alerts = D().getAlertStates();
    grid.innerHTML = alerts
      .map((a) => {
        const severity = a.severity.toLowerCase();
        return `<article class="card alert-card ${severity}" id="${D().esc(a.id)}" data-search="${searchKey(a.id, a.title, a.description, a.user, a.email, a.ip, a.location, a.severity, a.status)}" data-severity="${D().esc(a.severity)}" data-status="${D().esc(a.status)}"><div class="alert-card-top"><span class="alert-large-icon"><i class="bi ${D().esc(a.icon)}"></i></span><div><h3>${D().esc(a.title)}</h3><p>${D().esc(a.description)}</p></div><span class="severity-pill severity-${severity}">${D().esc(a.severity)}</span></div><div class="alert-facts"><span><i class="bi bi-person"></i>${D().esc(a.user)}</span><span><i class="bi bi-geo-alt"></i>${D().esc(a.location)}</span><span><i class="bi bi-globe"></i>${D().esc(a.ip)}</span></div><div class="alert-card-footer"><small>${D().fmtTime(a.time)} · ${D().esc(a.status)}</small><div class="table-actions"><a class="table-action" href="login-details.html?id=${encodeURIComponent(a.loginId)}">Investigate <i class="bi bi-arrow-right"></i></a><button class="btn btn-sm ${a.status === "Open" ? "btn-secondary" : "btn-ghost"}" data-alert-toggle="${D().esc(a.id)}">${a.status === "Open" ? "Mark reviewed" : "Reopen"}</button></div></div></article>`;
      })
      .join("");
    const search = byId("alertSearch"),
      severity = byId("alertSeverity"),
      state = byId("alertState");
    const updateCount = () => {
      const open = alerts.filter((a) => a.status === "Open").length;
      const count = byId("openAlertCount");
      if (count) count.textContent = open;
      const nav = byId("navAlertCount");
      if (nav) nav.textContent = open;
    };
    const filter = () => {
      const q = (search?.value || "").trim().toLowerCase(),
        s = severity?.value || "all",
        st = state?.value || "all";
      applyFilters(
        ".alert-card",
        (el) =>
          (!q || el.dataset.search.includes(q)) &&
          (s === "all" || el.dataset.severity === s) &&
          (st === "all" || el.dataset.status === st),
      );
    };
    const change = (e) => {
      const button = e.target.closest("[data-alert-toggle]");
      if (!button) return;
      const id = button.dataset.alertToggle;
      const updated = alerts.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "Open" ? "Reviewed" : "Open" }
          : a,
      );
      D().saveAlertStates(updated);
      T().toast(
        `Alert ${id} marked ${updated.find((a) => a.id === id).status.toLowerCase()} in this demo.`,
      );
      renderAlerts();
    };
    search?.addEventListener("input", filter);
    severity?.addEventListener("change", filter);
    state?.addEventListener("change", filter);
    byId("globalSearch")?.addEventListener("input", filter);
    grid.addEventListener("click", change);
    filter();
    updateCount();
  }
  function renderUsers() {
    const body = byId("userRows");
    if (!body) return;
    const users = D().getUsers();
    const update = () => {
      const current = D().getUsers();
      body.innerHTML = current
        .map(
          (u) =>
            `<tr data-search="${searchKey(u.id, u.name, u.email, u.role, u.status)}" data-status="${D().esc(u.status)}" data-role="${D().esc(u.role)}"><td><div class="user-cell"><span class="mini-avatar">${D().esc(D().initials(u.name))}</span><div><strong>${D().esc(u.name)}</strong><small>${D().esc(u.email)}</small></div></div></td><td><span class="role-pill">${D().esc(u.role)}</span></td><td>${pill(u.status)}</td><td>${D().fmtTime(u.lastSeen, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</td><td><span class="muted small">${D().esc(u.id)}</span></td><td><button class="btn btn-sm ${u.status === "Active" ? "btn-ghost" : "btn-secondary"}" data-user-toggle="${D().esc(u.id)}">${u.status === "Active" ? "Suspend" : "Activate"}</button></td></tr>`,
        )
        .join("");
      const count = byId("userCount");
      if (count) count.textContent = current.length;
      filter();
    };
    const q = byId("userSearch"),
      st = byId("userStatus"),
      role = byId("userRole");
    const filter = () => {
      const query = (q?.value || "").trim().toLowerCase(),
        s = st?.value || "all",
        r = role?.value || "all";
      applyFilters(
        "#userRows tr",
        (el) =>
          (!query || el.dataset.search.includes(query)) &&
          (s === "all" || el.dataset.status === s) &&
          (r === "all" || el.dataset.role === r),
      );
    };
    q?.addEventListener("input", filter);
    st?.addEventListener("change", filter);
    role?.addEventListener("change", filter);
    byId("globalSearch")?.addEventListener("input", filter);
    body.addEventListener("click", (e) => {
      const button = e.target.closest("[data-user-toggle]");
      if (!button) return;
      const id = button.dataset.userToggle;
      const next = D()
        .getUsers()
        .map((u) =>
          u.id === id
            ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
            : u,
        );
      D().saveUsers(next);
      update();
      T().toast("Demo account status updated in this browser.");
    });
    const modal = byId("userModal"),
      form = byId("addUserForm");
    const close = () => {
      modal.hidden = true;
    };
    byId("addUserButton")?.addEventListener("click", () => {
      modal.hidden = false;
      byId("newUserName")?.focus();
    });
    byId("closeUserModal")?.addEventListener("click", close);
    byId("cancelUserModal")?.addEventListener("click", close);
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const list = D().getUsers();
      list.unshift({
        id: `U-${Date.now().toString().slice(-6)}`,
        name: values.get("name").trim(),
        email: values.get("email").trim(),
        role: values.get("role"),
        status: "Active",
        lastSeen: new Date().toISOString(),
      });
      D().saveUsers(list);
      form.reset();
      close();
      update();
      T().toast("Demo user added to this browser.");
    });
    update();
  }
  function initSettings() {
    const profileForm = byId("profileSettingsForm");
    if (!profileForm) return;
    let profile = { name: "Admin User", email: "admin@trusttrace.demo" };
    try {
      profile = {
        ...profile,
        ...JSON.parse(localStorage.getItem("tt_demo_profile") || "{}"),
      };
    } catch (_) {}
    byId("settingsName").value = profile.name;
    byId("settingsEmail").value = profile.email;
    let prefs = {};
    try {
      prefs =
        JSON.parse(localStorage.getItem("tt_demo_preferences") || "{}") || {};
    } catch (_) {}
    [
      "prefMfa",
      "prefNewDevice",
      "prefRiskReview",
      "notifyHigh",
      "notifyDevice",
      "notifyWeekly",
    ].forEach((id) => {
      if (typeof prefs[id] === "boolean") byId(id).checked = prefs[id];
    });
    if (prefs.timezone) byId("settingsTimezone").value = prefs.timezone;
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!profileForm.reportValidity()) return;
      profile = {
        name: byId("settingsName").value.trim(),
        email: byId("settingsEmail").value.trim(),
      };
      localStorage.setItem("tt_demo_profile", JSON.stringify(profile));
      const name = byId("topName"),
        ava = byId("topAvatar"),
        pop = byId("profileName");
      if (name) name.textContent = profile.name;
      if (pop) pop.textContent = profile.name;
      if (ava) ava.textContent = D().initials(profile.name);
      const value = JSON.parse(
        localStorage.getItem("tt_demo_preferences") || "{}",
      );
      value.timezone = byId("settingsTimezone").value;
      localStorage.setItem("tt_demo_preferences", JSON.stringify(value));
      T().toast("Local demo profile saved.");
    });
    byId("savePreferences")?.addEventListener("click", () => {
      const value = {};
      [
        "prefMfa",
        "prefNewDevice",
        "prefRiskReview",
        "notifyHigh",
        "notifyDevice",
        "notifyWeekly",
      ].forEach((id) => (value[id] = byId(id).checked));
      value.timezone = byId("settingsTimezone").value;
      localStorage.setItem("tt_demo_preferences", JSON.stringify(value));
      T().toast("Demo preferences saved in this browser.");
    });
  }
  function initDetails() {
    const score = byId("detailScore");
    if (!score) return;
    const params = new URLSearchParams(location.search),
      id = params.get("id") || "LG-2047";
    const row =
      D().loginActivities.find((item) => item.id === id) ||
      D().loginActivities[1];
    const related = D().alerts.find((a) => a.loginId === row.id);
    const risk = row.risk,
      kind = riskKind(risk);
    score.textContent = risk;
    byId("detailScoreRing").style.background =
      `conic-gradient(${kind === "high" ? "#f04458" : kind === "medium" ? "#fbbf24" : "#10d6a0"} 0 ${risk}%,#1c344c ${risk}% 100%)`;
    const pillEl = byId("detailRiskPill");
    pillEl.className = `severity-pill severity-${kind}`;
    pillEl.textContent = `${kind[0].toUpperCase() + kind.slice(1)} risk`;
    byId("detailTitle").textContent =
      related?.title ||
      (kind === "high"
        ? "Unusual login attempt"
        : kind === "medium"
          ? "Login needs review"
          : "Routine sign-in");
    byId("detailSubtitle").textContent =
      `A simulated risk signal was recorded for ${row.name}.`;
    byId("detailEventId").textContent = row.id;
    byId("detailEventTime").textContent = D().fmtTime(row.time);
    byId("detailUser").textContent = row.name;
    byId("detailEmail").textContent = row.email;
    byId("detailLocation").textContent = row.location;
    byId("detailIp").textContent = row.ip;
    byId("detailDevice").textContent = row.device;
    byId("detailStatus").textContent = `${row.status} in demo`;
    if (related)
      byId("relatedAlertLink").href =
        `fraud-alerts.html#${encodeURIComponent(related.id)}`;
    const actions = document.querySelectorAll("[data-detail-action]");
    actions.forEach((button) =>
      button.addEventListener("click", () => {
        const act = button.dataset.detailAction;
        if (act === "review") {
          button.innerHTML = '<i class="bi bi-check2-circle"></i> Reviewed';
          button.disabled = true;
          T().toast(`${row.id} marked reviewed in this demo.`);
        } else
          T().toast(`A simulated block action was recorded for ${row.ip}.`);
      }),
    );
  }
  document.addEventListener("DOMContentLoaded", () => {
    switch (document.body.dataset.page) {
      case "dashboard":
        renderDashboard();
        break;
      case "activities":
        renderActivities();
        break;
      case "alerts":
        renderAlerts();
        break;
      case "users":
        renderUsers();
        break;
      case "settings":
        initSettings();
        break;
      case "details":
        initDetails();
        break;
    }
  });
})();
