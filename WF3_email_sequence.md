# WF3 — Storm Guide Download + 3-Email Nurture Sequence

> Source: Storm Damage Guide download form on `index.html`
> Tag: `storm-guide-download`
> Total cadence: 7 days, 3 emails
> From: Cole Bishop · `hello@lc.bishoproofing.company`

---

## EMAIL 1 — DAY 0 (Immediate)

**Subject:** Here's your Texas Storm Damage Guide, {{first_name}}

**Preheader:** Plus a quick note on what to do BEFORE the next storm hits.

**Body:**

Hey {{first_name}},

Cole Bishop here from Bishop Roofing. Your free guide is attached — 12 pages on documenting hail damage, the 1-year insurance claim deadline most Texans miss, and what actually qualifies for an insurance payout vs. what doesn't.

A quick note before you dive in:

If your roof has been through a storm in the last 12 months and you haven't filed a claim yet, you're probably leaving money on the table. Hail damage gets **worse** over time — and insurers will deny claims that should have been filed sooner.

The guide explains exactly what to look for and how to document it. Worth 10 minutes of your time before the next storm.

If you have questions, just hit reply. Travis (my brother / co-owner / the guy on the roof) and I read every email.

— Cole Bishop
Bishop Roofing & Exteriors
RCAT #100-4821-2024 · Cedar Park, TX

**P.S.** — If you're seeing damage right now, we do free 48-hour inspections. No pressure, just a written report with drone photos so you know what you're dealing with. Reply with your address if you want one scheduled.

**Attachments:** `texas-storm-damage-guide.pdf`

---

## ⏰ WAIT 3 DAYS

---

## EMAIL 2 — DAY 3 (Educational)

**Subject:** 3 mistakes that get Texas hail claims denied

**Preheader:** #2 is the one that costs homeowners $5,000+ on average.

**Body:**

{{first_name}},

I see this every storm season — homeowners with legitimate hail damage who get their insurance claim **denied** because of one of these three mistakes. Don't let it happen to you.

### Mistake #1: Waiting too long to file.

You have ONE YEAR from the storm date to file a claim in Texas. After that, insurers can (and do) deny. I've watched families lose $15K+ payouts because they "didn't want to bother the insurance company."

If you suspect damage, file the claim. You can always withdraw it. You can never recover from missing the deadline.

### Mistake #2: Doing the temporary repairs yourself.

I get it — there's a tarp situation, water's leaking, you want to fix it fast. But if you climb up there and slip, fall, or make it worse, you've voided the claim. And if you cover the damage with a DIY patch, the adjuster can't document it properly.

Call a licensed roofer for the temporary fix. We charge nothing for emergency tarping when you're filing an insurance claim through us. It's part of the job.

### Mistake #3: Accepting the first adjuster estimate without a second opinion.

Insurance adjusters are NOT roofers. They miss damage. They under-estimate replacement cost. They lowball materials.

The fix: have a licensed roofer walk the adjuster on-site. Together. That's literally what Travis does on every Bishop claim — and we recover an average of **$6,800 additional** on every job by catching what the adjuster missed.

---

If you've had a recent storm and any of these sound familiar, hit reply. We do free inspections within 48 hours — drone photos, written report, no sales pressure.

— Cole Bishop
Bishop Roofing & Exteriors
RCAT #100-4821-2024

---

## ⏰ WAIT 4 DAYS

---

## EMAIL 3 — DAY 7 (Soft Pitch / Final Ask)

**Subject:** One last thing about your roof, {{first_name}}

**Preheader:** Then I'll leave you alone — promise.

**Body:**

{{first_name}},

This is the last email in this sequence — promise. I just want to be sure you got what you needed from the guide.

If you've already filed a claim or scheduled an inspection, you're good. Stop reading here.

If you're still on the fence, here's what I'd suggest:

### Get a free inspection. Even if you don't hire us.

We're booked about 2 weeks out for new installs, but inspections we can do within 48 hours. Travis goes up on the roof (or sends a drone, depending on access), takes 30–50 photos, and writes a 2–3 page report with what he sees.

You get the report whether you hire us or not. No sales pressure. No upselling. Just data so you know what you're dealing with.

Most folks who get the report end up doing one of three things:

1. **Nothing** — turns out the roof's fine (~30% of inspections)
2. **Filing an insurance claim** — we can walk that adjuster for you (~50%)
3. **Paying out of pocket** for a small repair (~20%)

All three are fine outcomes. We just want you to know what's going on up there.

**Reply with your address if you want one scheduled, or call (512) 487-3204 — that's my cell.**

Either way — good luck out there.

— Cole Bishop
Bishop Roofing & Exteriors
(512) 487-3204
hello@bishoproofing.company
RCAT #100-4821-2024

**P.S.** — Want to hear from us next storm season? Just hit reply with "yes" and you'll go on the storm watch list. Otherwise this is the last you'll hear from me.

---

## Build Notes

**GHL workflow setup (Crestline sub-account):**

1. **Trigger:** Inbound Webhook (paste URL into `ghl-modal.js` → `WORKFLOW_VARIANTS['storm-guide'].webhook`)
2. **Create/Update Contact** — match by email
3. **Add Tag** — `storm-guide-download`
4. **Send Email** — Email 1 above (attach PDF via GHL Media Storage)
5. **Wait** — 3 days
6. **Send Email** — Email 2 above
7. **Wait** — 4 days
8. **Send Email** — Email 3 above
9. **End workflow** (contact stays in CRM, tagged for re-engagement later)

**Variables used:**
- `{{first_name}}` — auto-pulled from contact record

**Sending domain:** `lc.bishoproofing.company` (already verified in GHL)

**PDF:** `texas-storm-damage-guide.pdf` — you'll need to write/generate this 12-page guide and upload to GHL Media Storage before Email 1 fires.

**Total emails:** 3 over 7 days · light enough to feel helpful, heavy enough to convert ~5–10% of downloads into inspection bookings.
