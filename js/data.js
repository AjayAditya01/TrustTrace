/* TrustTrace demo data. Every record and risk indicator in this file is simulated. */
(function () {
  const hoursAgo = (hours) =>
    new Date(Date.now() - hours * 3600000).toISOString();
  const loginActivities = [
    {
      id: "LG-2048",
      name: "Maya Patel",
      email: "maya.patel@northstar.io",
      ip: "185.72.44.19",
      location: "New York, US",
      device: "Chrome · macOS",
      time: hoursAgo(0.15),
      status: "Success",
      risk: 12,
    },
    {
      id: "LG-2047",
      name: "Ethan Brooks",
      email: "ethan.brooks@northstar.io",
      ip: "103.84.12.206",
      location: "Singapore, SG",
      device: "Safari · iPhone",
      time: hoursAgo(0.55),
      status: "Blocked",
      risk: 94,
    },
    {
      id: "LG-2046",
      name: "Sofia Kim",
      email: "sofia.kim@northstar.io",
      ip: "44.201.8.37",
      location: "Austin, US",
      device: "Edge · Windows",
      time: hoursAgo(1.3),
      status: "Success",
      risk: 8,
    },
    {
      id: "LG-2045",
      name: "Noah Williams",
      email: "noah.w@northstar.io",
      ip: "91.204.18.77",
      location: "London, UK",
      device: "Firefox · Windows",
      time: hoursAgo(2.1),
      status: "Review",
      risk: 68,
    },
    {
      id: "LG-2044",
      name: "Ava Chen",
      email: "ava.chen@northstar.io",
      ip: "172.16.24.8",
      location: "San Francisco, US",
      device: "Chrome · Android",
      time: hoursAgo(3.8),
      status: "Success",
      risk: 15,
    },
    {
      id: "LG-2043",
      name: "Liam Garcia",
      email: "liam.garcia@northstar.io",
      ip: "185.72.44.19",
      location: "New York, US",
      device: "Chrome · macOS",
      time: hoursAgo(5.4),
      status: "Blocked",
      risk: 88,
    },
    {
      id: "LG-2042",
      name: "Olivia Martin",
      email: "olivia.m@northstar.io",
      ip: "20.55.104.62",
      location: "Toronto, CA",
      device: "Safari · macOS",
      time: hoursAgo(8),
      status: "Success",
      risk: 10,
    },
    {
      id: "LG-2041",
      name: "Lucas Wilson",
      email: "lucas.w@northstar.io",
      ip: "45.134.22.3",
      location: "Amsterdam, NL",
      device: "Chrome · Linux",
      time: hoursAgo(11),
      status: "Review",
      risk: 74,
    },
    {
      id: "LG-2040",
      name: "Amara Okafor",
      email: "amara.o@northstar.io",
      ip: "68.112.201.7",
      location: "Chicago, US",
      device: "Chrome · Windows",
      time: hoursAgo(17),
      status: "Success",
      risk: 9,
    },
    {
      id: "LG-2039",
      name: "Jack Turner",
      email: "jack.turner@northstar.io",
      ip: "103.84.12.206",
      location: "Singapore, SG",
      device: "Safari · iPad",
      time: hoursAgo(22),
      status: "Blocked",
      risk: 91,
    },
    {
      id: "LG-2038",
      name: "Maya Patel",
      email: "maya.patel@northstar.io",
      ip: "185.72.44.19",
      location: "New York, US",
      device: "Chrome · macOS",
      time: hoursAgo(27),
      status: "Success",
      risk: 11,
    },
    {
      id: "LG-2037",
      name: "Sofia Kim",
      email: "sofia.kim@northstar.io",
      ip: "194.26.135.8",
      location: "Frankfurt, DE",
      device: "Chrome · Android",
      time: hoursAgo(31),
      status: "Review",
      risk: 63,
    },
  ];
  const alerts = [
    {
      id: "FA-0301",
      loginId: "LG-2047",
      title: "Impossible travel detected",
      description:
        "A sign-in from Singapore followed a session in New York less than 18 minutes earlier.",
      user: "Ethan Brooks",
      email: "ethan.brooks@northstar.io",
      ip: "103.84.12.206",
      location: "Singapore, SG",
      time: hoursAgo(0.5),
      severity: "High",
      status: "Open",
      icon: "bi-globe2",
    },
    {
      id: "FA-0300",
      loginId: "LG-2045",
      title: "Unrecognized device fingerprint",
      description:
        "The device and browser combination has not been seen on this account before.",
      user: "Noah Williams",
      email: "noah.w@northstar.io",
      ip: "91.204.18.77",
      location: "London, UK",
      time: hoursAgo(2),
      severity: "Medium",
      status: "Open",
      icon: "bi-fingerprint",
    },
    {
      id: "FA-0299",
      loginId: "LG-2043",
      title: "Repeated password attempts",
      description:
        "Seven failed attempts from the same address were observed in a short interval.",
      user: "Liam Garcia",
      email: "liam.garcia@northstar.io",
      ip: "185.72.44.19",
      location: "New York, US",
      time: hoursAgo(5),
      severity: "High",
      status: "Open",
      icon: "bi-shield-exclamation",
    },
    {
      id: "FA-0298",
      loginId: "LG-2041",
      title: "Unusual sign-in hour",
      description:
        "A new sign-in occurred outside this account’s usual activity window.",
      user: "Lucas Wilson",
      email: "lucas.w@northstar.io",
      ip: "45.134.22.3",
      location: "Amsterdam, NL",
      time: hoursAgo(11),
      severity: "Medium",
      status: "Reviewed",
      icon: "bi-moon-stars",
    },
    {
      id: "FA-0297",
      loginId: "LG-2039",
      title: "Known proxy network",
      description: "The connection matched a demo proxy reputation signal.",
      user: "Jack Turner",
      email: "jack.turner@northstar.io",
      ip: "103.84.12.206",
      location: "Singapore, SG",
      time: hoursAgo(22),
      severity: "High",
      status: "Reviewed",
      icon: "bi-hdd-network",
    },
  ];
  const users = [
    {
      id: "U-1001",
      name: "Maya Patel",
      email: "maya.patel@northstar.io",
      role: "Admin",
      status: "Active",
      lastSeen: hoursAgo(0.15),
    },
    {
      id: "U-1002",
      name: "Ethan Brooks",
      email: "ethan.brooks@northstar.io",
      role: "Analyst",
      status: "Active",
      lastSeen: hoursAgo(0.55),
    },
    {
      id: "U-1003",
      name: "Sofia Kim",
      email: "sofia.kim@northstar.io",
      role: "Analyst",
      status: "Active",
      lastSeen: hoursAgo(1.3),
    },
    {
      id: "U-1004",
      name: "Noah Williams",
      email: "noah.w@northstar.io",
      role: "Member",
      status: "Active",
      lastSeen: hoursAgo(2.1),
    },
    {
      id: "U-1005",
      name: "Ava Chen",
      email: "ava.chen@northstar.io",
      role: "Member",
      status: "Active",
      lastSeen: hoursAgo(3.8),
    },
    {
      id: "U-1006",
      name: "Liam Garcia",
      email: "liam.garcia@northstar.io",
      role: "Member",
      status: "Suspended",
      lastSeen: hoursAgo(5.4),
    },
    {
      id: "U-1007",
      name: "Olivia Martin",
      email: "olivia.m@northstar.io",
      role: "Analyst",
      status: "Active",
      lastSeen: hoursAgo(8),
    },
    {
      id: "U-1008",
      name: "Lucas Wilson",
      email: "lucas.w@northstar.io",
      role: "Member",
      status: "Active",
      lastSeen: hoursAgo(11),
    },
    {
      id: "U-1009",
      name: "Amara Okafor",
      email: "amara.o@northstar.io",
      role: "Member",
      status: "Active",
      lastSeen: hoursAgo(17),
    },
    {
      id: "U-1010",
      name: "Jack Turner",
      email: "jack.turner@northstar.io",
      role: "Member",
      status: "Active",
      lastSeen: hoursAgo(22),
    },
  ];
  const safeRead = (key, fallback) => {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return Array.isArray(v) ? v : fallback;
    } catch (_) {
      return fallback;
    }
  };
  const safeWrite = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  };
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const fmtTime = (
    date,
    options = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  ) => new Intl.DateTimeFormat(undefined, options).format(new Date(date));
  const initials = (name) =>
    String(name || "TT")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0] || "")
      .join("")
      .toUpperCase();
  window.TrustTraceData = {
    loginActivities,
    alerts,
    users,
    getUsers: () => safeRead("tt_demo_users", users),
    saveUsers: (value) => safeWrite("tt_demo_users", value),
    getAlertStates: () => safeRead("tt_demo_alerts", alerts),
    saveAlertStates: (value) => safeWrite("tt_demo_alerts", value),
    esc,
    fmtTime,
    initials,
  };
})();
