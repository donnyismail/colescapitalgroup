// Pine Ridge Cottage — booking sidebar. Uses the unit-tested booking module.
import { quote, validateStay, otaSavings } from './assets/booking.js';

const RATE = 285;
const CLEAN = 95;
const MIN_NIGHTS = 2;

const $ = (id) => document.getElementById(id);
const iso = (d) => d.toISOString().split('T')[0];
const money = (n) => '$' + n.toLocaleString('en-US');

const ci = $('ci'), co = $('co');
const now = new Date();
const inDate = new Date(now.getTime() + 5 * 86400000);
const outDate = new Date(now.getTime() + 9 * 86400000);
ci.min = iso(now); ci.value = iso(inDate);
co.min = iso(now); co.value = iso(outDate);

function recalc() {
  const stay = validateStay(ci.value, co.value, { today: iso(now), minNights: MIN_NIGHTS });
  const err = $('bookErr');
  if (!stay.valid) {
    err.textContent = stay.reason;
    err.hidden = false;
    return;
  }
  err.hidden = true;
  const q = quote({ rate: RATE, nights: stay.nights, cleaning: CLEAN });
  $('nl').textContent = `${money(RATE)} × ${stay.nights} night${stay.nights === 1 ? '' : 's'}`;
  $('sub').textContent = money(q.subtotal);
  $('tot').textContent = money(q.total);
  $('saveAmt').textContent = 'Save ~' + money(otaSavings(q.subtotal));
}

ci.addEventListener('change', () => {
  if (co.value <= ci.value) {
    const d = new Date(ci.value); d.setDate(d.getDate() + MIN_NIGHTS); co.value = iso(d);
  }
  co.min = ci.value;
  recalc();
});
co.addEventListener('change', recalc);

$('reserve').addEventListener('click', () => {
  const stay = validateStay(ci.value, co.value, { today: iso(now), minNights: MIN_NIGHTS });
  const btn = $('reserve');
  if (!stay.valid) { recalc(); return; }
  // Real reservation posts to the OwnerRez booking engine once properties are live.
  btn.textContent = 'Request sent ✓';
  btn.style.background = 'var(--moss)';
  setTimeout(() => { btn.textContent = 'Reserve'; btn.style.background = ''; }, 2200);
});

recalc();
