const CUT_OFF_RULES = {
  "HelloFresh": {
    deliveryDays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    cutoffDays: {
      "Sat": "Prev Mon",
      "Sun": "Prev Tue",
      "Mon": "Prev Wed",
      "Tue": "Prev Thu",
      "Wed": "Prev Fri",
      "Thu": "Prev Sat",
      "Fri": "Prev Sun"
    },
    cutoffHourOffset: 5,
    cutoffMinute: 59,
    internalHourOffset: 6,
    internalMinute: 59,
    graceActions: {
      Initial: ["Box Cancellation", "Meal Selection", "Delivery Address Change"],
      Recurring: ["Meal Selection", "Delivery Address Change"]
    }
  },
  "EveryPlate": {
    deliveryDays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    cutoffDays: {
      "Sat": "Prev Mon",
      "Sun": "Prev Tue",
      "Mon": "Prev Wed",
      "Tue": "Prev Thu",
      "Wed": "Prev Fri",
      "Thu": "Prev Sat",
      "Fri": "Prev Sun"
    },
    cutoffHourOffset: 5,
    cutoffMinute: 59,
    internalHourOffset: 6,
    internalMinute: 59,
    graceActions: {
      Initial: ["Box Cancellation", "Meal Selection", "Delivery Address Change"],
      Recurring: ["Meal Selection", "Delivery Address Change"]
    }
  },
  "Green Chef": {
    deliveryDays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    cutoffDays: {
      "Sat": "Prev Mon",
      "Sun": "Prev Tue",
      "Mon": "Prev Wed",
      "Tue": "Prev Thu",
      "Wed": "Prev Fri",
      "Thu": "Prev Sat",
      "Fri": "Prev Sun"
    },
    cutoffHourOffset: 5,
    cutoffMinute: 59,
    internalHourOffset: 6,
    internalMinute: 59,
    graceActions: {
      Initial: ["Box Cancellation", "Meal Selection", "Delivery Address Change"],
      Recurring: ["Meal Selection", "Delivery Address Change"]
    }
  },
  "Factor 75": {
    deliveryDays: ["Sat", "Sun", "Mon", "Tue"],
    cutoffDays: {
      "Sat": "Prev Mon",
      "Sun": "Prev Tue",
      "Mon": "Prev Wed",
      "Tue": "Prev Wed"
    },
    cutoffHourOffset: 5,
    cutoffMinute: 59,
    internalHourOffset: 6,
    internalMinute: 59,
    graceActions: {
      Initial: [],
      Recurring: []
    }
  },
  "Factor Form": {
    deliveryDays: ["Sat", "Sun", "Mon"],
    cutoffDays: {
      "Sat": "Prev Mon",
      "Sun": "Prev Tue",
      "Mon": "Prev Wed"
    },
    cutoffUnavailable: true,
    graceActions: {
      Initial: ["Box Cancellation", "Meal Selection", "Delivery Address Change"],
      Recurring: ["Meal Selection", "Delivery Address Change"]
    }
  },
  "Good Chop": {
    deliveryDays: ["Tue", "Wed", "Thu", "Fri"],
    cutoffDays: {
      "Tue": "Prev Fri",
      "Wed": "Prev Sat",
      "Thu": "Prev Sun",
      "Fri": "Prev Mon"
    },
    cutoffHourOffset: 5,
    cutoffMinute: 59,
    internalHourOffset: 6,
    internalMinute: 59,
    transit: {
      "Tue": "1-Day Transit",
      "Wed": "2-Day Transit",
      "Thu": "2-Day Transit",
      "Fri": "2-Day Transit"
    },
    graceActions: {
      Initial: ["Box Cancellation", "Meal Selection", "Delivery Address Change"],
      Recurring: ["Meal Selection", "Delivery Address Change"]
    }
  },
  "The Pets Table": {
    deliveryDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    cutoffDays: {
      "Mon": "Prev Wed",
      "Tue": "Prev Thu",
      "Wed": "Prev Thu",
      "Thu": "Prev Sun",
      "Fri": "Prev Mon"
    },
    cutoffHourOffset: 5,
    cutoffMinute: 59,
    internalHourOffset: 6,
    internalMinute: 29,
    graceActions: {
      Initial: ["Box Cancellation"],
      Recurring: ["Box Cancellation"]
    }
  }
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatEasternClockTime() {
  return new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
}

function nowEasternDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date());

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return new Date(`${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`);
}

function parseInputDate(dateStr) {
  return new Date(`${dateStr}T12:00:00`);
}

function formatSelectedLabel(date) {
  return `${DAY_NAMES_LONG[date.getDay()]}, ${MONTH_NAMES_LONG[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function toDateInputValue(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function subtractDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
}

function prevOccurrence(baseDate, targetDayName) {
  const targetIndex = DAY_NAMES.indexOf(targetDayName);
  const currentIndex = baseDate.getDay();
  let diff = currentIndex - targetIndex;
  if (diff <= 0) diff += 7;
  return subtractDays(baseDate, diff);
}

function parsePrevRule(deliveryDate, rule) {
  if (!rule || !rule.startsWith("Prev ")) return null;
  const dayName = rule.replace("Prev ", "").trim();
  return prevOccurrence(deliveryDate, dayName);
}

function formatPDTDateTime(date, hourOffset = 5, minute = 59) {
  const d = new Date(date);
  d.setHours(hourOffset, minute, 0, 0);
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${String(hourOffset).padStart(2, "0")}:${String(minute).padStart(2, "0")} PM PDT`
    .replace("05:", "5:")
    .replace("06:", "6:")
    .replace("07:", "7:")
    .replace("08:", "8:")
    .replace("09:", "9:");
}

function buildDeadline(date, hourOffset = 5, minute = 59) {
  const d = new Date(date);
  d.setHours(hourOffset + 19, minute, 0, 0);
  return d;
}

function formatDuration(ms) {
  if (ms <= 0) return "0m";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function renderQuickDates(selectedDate) {
  const container = document.getElementById("cutoffQuickDates");
  const input = document.getElementById("cutoffDeliveryDate");
  const label = document.getElementById("cutoffSelectedLabel");
  if (!container || !input || !label) return;

  label.textContent = formatSelectedLabel(selectedDate);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  container.innerHTML = `
    ${days.map((d) => {
      const value = toDateInputValue(d);
      const active = value === toDateInputValue(selectedDate);
      return `
        <button type="button" class="cutoff-day-chip${active ? " active" : ""}" data-date="${value}">
          <span class="dow">${DAY_NAMES[d.getDay()]}</span>
          <span class="dom">${d.getDate()}</span>
          <span class="mon">${MONTH_NAMES[d.getMonth()]}</span>
        </button>
      `;
    }).join("")}
    <button type="button" class="cutoff-more-btn">More</button>
  `;

  container.querySelectorAll(".cutoff-day-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      input.value = btn.dataset.date;
      updateCutoffUI();
    });
  });

  const moreBtn = container.querySelector(".cutoff-more-btn");
  if (moreBtn) {
    moreBtn.addEventListener("click", () => input.showPicker?.());
  }
}

function renderBrandCards(selectedDate) {
  const container = document.getElementById("cutoffBrandCards");
  if (!container) return;

  const now = nowEasternDate();
  const deliveryDay = DAY_NAMES[selectedDate.getDay()];

  container.innerHTML = Object.entries(CUT_OFF_RULES).map(([brand, config]) => {
    const delivers = config.deliveryDays.includes(deliveryDay);

    if (!delivers) {
      return `
        <div class="cutoff-card">
          <div class="cutoff-card-head">
            <div class="cutoff-brand">${brand}</div>
            <div class="cutoff-pill na">NO DELIVERIES</div>
          </div>
        </div>
      `;
    }

    if (config.cutoffUnavailable) {
      return `
        <div class="cutoff-card">
          <div class="cutoff-card-head">
            <div class="cutoff-brand">${brand}</div>
            <div class="cutoff-pill unavailable">CUTOFF INFO UNAVAILABLE</div>
          </div>
        </div>
      `;
    }

    const cutoffRule = config.cutoffDays[deliveryDay];
    const cutoffBaseDate = parsePrevRule(selectedDate, cutoffRule);
    const customerDeadline = buildDeadline(cutoffBaseDate, config.cutoffHourOffset, config.cutoffMinute);
    const internalDeadline = buildDeadline(cutoffBaseDate, config.internalHourOffset, config.internalMinute);

    const isBefore = now < customerDeadline;
    const diff = Math.abs(customerDeadline - now);

    const transitText = config.transit?.[deliveryDay] || "";
    const timerText = isBefore
      ? `Customer Cutoff Ends In: ${formatDuration(diff)}`
      : `Time Since Grace Period Closed: ${formatDuration(diff)}`;

    return `
      <div class="cutoff-card">
        ${transitText ? `
          <div class="cutoff-transit-row">
            <span class="cutoff-transit-badge ${transitText === "1-Day Transit" ? "active" : ""}">1-Day Transit</span>
            <span class="cutoff-transit-badge ${transitText === "2-Day Transit" ? "active" : ""}">2-Day Transit</span>
          </div>
        ` : ""}

        <div class="cutoff-card-head">
          <div class="cutoff-brand">${brand}</div>
          <div class="cutoff-pill ${isBefore ? "before" : "after"}">${isBefore ? "BEFORE CUTOFF" : "AFTER CUTOFF"}</div>
        </div>

        <div class="cutoff-meta"><strong>Customer Cutoff:</strong> ${formatPDTDateTime(cutoffBaseDate, config.cutoffHourOffset, config.cutoffMinute)}</div>
        <div class="cutoff-meta"><strong>Internal Cutoff:</strong> ${formatPDTDateTime(cutoffBaseDate, config.internalHourOffset, config.internalMinute)}</div>
        <div class="cutoff-timer ${isBefore ? "before" : ""}">${timerText}</div>
      </div>
    `;
  }).join("");
}

function renderDeliveryScheduleTable() {
  const el = document.getElementById("deliveryScheduleTable");
  if (!el) return;

  const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  el.innerHTML = `
    <table class="cutoff-table">
      <thead>
        <tr>
          <th>Brand</th>
          ${days.map((d) => `<th>${d}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${Object.entries(CUT_OFF_RULES).map(([brand, config]) => `
          <tr>
            <td>${brand}</td>
            ${days.map((day) => `<td>${config.deliveryDays.includes(day) ? '<span class="cutoff-check">✓</span>' : '<span class="cutoff-dash">—</span>'}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderCutoffRulesTable() {
  const el = document.getElementById("cutoffRulesTable");
  if (!el) return;

  const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  el.innerHTML = `
    <table class="cutoff-table">
      <thead>
        <tr>
          <th>Brand</th>
          ${days.map((d) => `<th>${d}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${Object.entries(CUT_OFF_RULES).map(([brand, config]) => `
          <tr>
            <td>${brand}</td>
            ${days.map((day) => `<td>${config.cutoffDays[day] || '<span class="cutoff-dash">—</span>'}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderGracePeriodTable() {
  const el = document.getElementById("gracePeriodTable");
  if (!el) return;

  const cols = ["Box Cancellation", "Meal Selection", "Delivery Address Change"];

  el.innerHTML = `
    <table class="cutoff-table">
      <thead>
        <tr>
          <th>Brand</th>
          <th>Type</th>
          ${cols.map((c) => `<th>${c}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${Object.entries(CUT_OFF_RULES).map(([brand, config]) => `
          ${["Initial", "Recurring"].map((type) => `
            <tr>
              <td>${brand}</td>
              <td>${type}</td>
              ${cols.map((col) => `<td>${config.graceActions[type].includes(col) ? '<span class="cutoff-check">✓</span>' : '<span class="cutoff-dash">—</span>'}</td>`).join("")}
            </tr>
          `).join("")}
        `).join("")}
      </tbody>
    </table>
  `;
}

function updateCutoffUI() {
  const input = document.getElementById("cutoffDeliveryDate");
  const timeEl = document.getElementById("cutoffCurrentTime");
  if (!input || !timeEl) return;

  const selectedDate = parseInputDate(input.value);
  timeEl.textContent = formatEasternClockTime();

  renderQuickDates(selectedDate);
  renderBrandCards(selectedDate);
  renderDeliveryScheduleTable();
  renderCutoffRulesTable();
  renderGracePeriodTable();
}

export function initCutoffClock() {
  const input = document.getElementById("cutoffDeliveryDate");
  const timeEl = document.getElementById("cutoffCurrentTime");
  if (!input || !timeEl) return;

  input.value = toDateInputValue(new Date());
  updateCutoffUI();

  input.addEventListener("change", updateCutoffUI);
  setInterval(() => {
    timeEl.textContent = formatEasternClockTime();
    renderBrandCards(parseInputDate(input.value));
  }, 1000);
}
