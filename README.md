# Bishop Roofing — Marketing System Demo

A fully functional demo of a complete marketing system for a fictional Central Texas roofing contractor. Built by [Joshua Solomon](https://github.com/JoshuaRalphz) as a portfolio piece for the freelance CRM & Automation Specialist business.

**Live site:** [bishoproofing.company](https://bishoproofing.company)

## What this demonstrates

This isn't a static landing page — it's an end-to-end system showing what a real "Done-For-You Marketing Build" looks like:

- 🏠 **Multi-page custom-coded website** (7 pages, mobile-responsive, no CMS)
- 🔌 **Real form-to-CRM integration** via webhook → GoHighLevel
- 📋 **Live GHL workflow** that creates contact, drops into pipeline, sends branded email, creates task, fires internal alert — all within 30 seconds of form submit
- 🎬 **Interactive "How It Works" page** that visualizes the GHL backend in real-time as the form submits

## Stack

| Layer | Tool |
|---|---|
| **Frontend** | Hand-coded HTML / CSS / JS (no framework, no build step) |
| **Hosting** | Cloudflare Pages |
| **Domain + DNS** | Cloudflare (registered at Hostinger) |
| **CRM + Workflow** | GoHighLevel |
| **Email delivery** | GHL + Mailgun (via lc.bishoproofing.company subdomain) |
| **SSL** | Automatic via Cloudflare |

## Structure

```
.
├── index.html           # Home — hero, services preview, process, projects, reviews
├── services.html        # 4 detailed service breakdowns with pricing
├── projects.html        # 12 completed projects, filterable by city + type
├── reviews.html         # 12 testimonials + star rating breakdown
├── about.html           # Bishop brothers story + 14-year timeline + certifications
├── how-it-works.html    # Interactive demo: submit form, watch GHL respond
├── contact.html         # Inspection request form (wired to live GHL webhook)
├── styles.css           # Shared stylesheet — design system in CSS variables
├── favicon.svg          # Chevron brand mark
└── images/              # 10 verified Unsplash photos (local, no external CDN)
```

## What's behind the demo

The contact form on `/contact.html` and the demo form on `/how-it-works.html` POST to a live GoHighLevel webhook that runs a 6-step automation:

1. **Create Contact** — populates name, email, phone, address, custom fields
2. **Add Tag** — `inspection-request` for segmentation
3. **Create Opportunity** — drops into "New Lead" stage of the Sales Pipeline at $15,000 estimated value
4. **Send Email** — branded HTML email from `hello@lc.bishoproofing.company` with mobile-responsive template
5. **Create Task** — assigned with 1-hour SLA
6. **Internal Notification** — Email + in-app alert to the team

Every step is real. The "How It Works" page renders a styled visualization of this sequence so non-technical visitors can see the system without opening GHL.

## Why I built this

Most freelance contractors land clients by saying *"I can build you a marketing system."* The conversation always stalls because prospects can't imagine what that means.

This demo answers the question by *showing the working system on a real domain with a real CRM behind it.* Visitors can submit the form, get a real email back, and verify the contact actually appears in the CRM. That's a 10-second pitch.

## Local development

The site is pure HTML/CSS/JS — no build step.

```bash
# Spin up a local preview server
python -m http.server 8000

# Then open http://localhost:8000
```

For deploys, the repo is connected to Cloudflare Pages — every push to `main` triggers an automatic deploy.

## License

This is a portfolio demonstration project. The Bishop Roofing brand, persona, and content are fictional. The technical implementation patterns are free to study or adapt — credit appreciated but not required.

---

**Joshua Solomon** · CRM & Automation Specialist · [solomonjoshua101602@gmail.com](mailto:solomonjoshua101602@gmail.com)
