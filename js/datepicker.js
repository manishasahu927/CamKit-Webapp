(function() {
  'use strict';

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  let activeWrap = null;
  let viewYear, viewMonth;
  let panel, titleEl, gridEl;

  function fmt(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function fmtDisplay(d) {
    return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)}`;
  }

  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function buildPanel() {
    const overlay = document.createElement('div');
    overlay.className = 'datepicker';
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="datepicker__backdrop"></div>
      <div class="datepicker__panel" role="dialog" aria-label="Choose date">
        <div class="datepicker__header">
          <button type="button" class="datepicker__nav" data-action="prev" aria-label="Previous month">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <span class="datepicker__title"></span>
          <button type="button" class="datepicker__nav" data-action="next" aria-label="Next month">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <div class="datepicker__weekdays">
          ${WEEKDAYS.map(d => `<span>${d}</span>`).join('')}
        </div>
        <div class="datepicker__grid"></div>
        <div class="datepicker__footer">
          <button type="button" class="datepicker__btn datepicker__btn--ghost" data-action="cancel">cancel</button>
          <button type="button" class="datepicker__btn datepicker__btn--today" data-action="today">today</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    panel = overlay;
    titleEl = overlay.querySelector('.datepicker__title');
    gridEl = overlay.querySelector('.datepicker__grid');

    overlay.querySelector('.datepicker__backdrop').addEventListener('click', close);
    overlay.querySelectorAll('.datepicker__nav').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.action === 'prev') {
          viewMonth--;
          if (viewMonth < 0) { viewMonth = 11; viewYear--; }
        } else {
          viewMonth++;
          if (viewMonth > 11) { viewMonth = 0; viewYear++; }
        }
        renderGrid();
      });
    });
    overlay.querySelector('[data-action="cancel"]').addEventListener('click', close);
    overlay.querySelector('[data-action="today"]').addEventListener('click', () => {
      pickDate(new Date());
    });
    document.addEventListener('keydown', (e) => {
      if (!panel.hidden && e.key === 'Escape') close();
    });
  }

  function open(wrap) {
    activeWrap = wrap;
    const input = wrap.querySelector('input[type="date"]');
    const current = input?.value ? new Date(input.value + 'T00:00:00') : new Date();
    viewYear = current.getFullYear();
    viewMonth = current.getMonth();
    renderGrid();
    panel.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    panel.hidden = true;
    activeWrap = null;
    document.body.style.overflow = '';
  }

  function renderGrid() {
    titleEl.textContent = `${MONTHS[viewMonth]} ${viewYear}`;

    const input = activeWrap?.querySelector('input[type="date"]');
    const minDate = input?.min ? new Date(input.min + 'T00:00:00') : null;
    const selectedDate = input?.value ? new Date(input.value + 'T00:00:00') : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDay = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];
    // Leading days from previous month
    for (let i = startWeekday - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, otherMonth: true, date: new Date(viewYear, viewMonth - 1, daysInPrevMonth - i) });
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, otherMonth: false, date: new Date(viewYear, viewMonth, d) });
    }
    // Trailing days from next month to fill last row
    while (cells.length % 7 !== 0) {
      const lastDate = cells[cells.length - 1].date;
      const next = new Date(lastDate);
      next.setDate(next.getDate() + 1);
      cells.push({ day: next.getDate(), otherMonth: true, date: next });
    }
    while (cells.length < 42) {
      const lastDate = cells[cells.length - 1].date;
      const next = new Date(lastDate);
      next.setDate(next.getDate() + 1);
      cells.push({ day: next.getDate(), otherMonth: true, date: next });
    }

    gridEl.innerHTML = cells.map(c => {
      const classes = ['datepicker__cell'];
      if (c.otherMonth) classes.push('datepicker__cell--muted');
      if (selectedDate && isSameDay(c.date, selectedDate)) classes.push('datepicker__cell--selected');
      if (isSameDay(c.date, today)) classes.push('datepicker__cell--today');
      const disabled = minDate && c.date < minDate;
      if (disabled) classes.push('datepicker__cell--disabled');
      return `<button type="button" class="${classes.join(' ')}" data-date="${fmt(c.date)}"${disabled ? ' disabled' : ''}>${c.day}</button>`;
    }).join('');

    gridEl.querySelectorAll('.datepicker__cell').forEach(cell => {
      cell.addEventListener('click', () => {
        if (cell.disabled) return;
        const [y, m, d] = cell.dataset.date.split('-').map(Number);
        pickDate(new Date(y, m - 1, d));
      });
    });
  }

  function pickDate(date) {
    if (!activeWrap) return;
    const input = activeWrap.querySelector('input[type="date"]');
    if (!input) return;
    input.value = fmt(date);
    input.dispatchEvent(new Event('change', { bubbles: true }));
    close();
  }

  function init() {
    buildPanel();
    document.querySelectorAll('.date-input-wrap').forEach(wrap => {
      wrap.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        open(wrap);
      }, true);
      const input = wrap.querySelector('input[type="date"]');
      if (input) {
        input.addEventListener('focus', (e) => {
          e.preventDefault();
          input.blur();
          open(wrap);
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
