/* ════════════════════════════════════════════════════════════════
   LIFE AT INNOV ARCH — PAGE DATA
   ────────────────────────────────────────────────────────────────
   This is the ONLY file you need to edit to add new photos.

   HOW TO ADD A NEW SATURDAY SESSION
   1. Put photos in  images/life/  (webp, ~1600px wide is plenty).
      Optional: a smaller "-thumb" version (~800px) for faster loading.
   2. Copy one block inside `saturdays` below, paste it at the TOP,
      and change the date / title / presenter / note / photos.
      title     = what the session was about (e.g. "Veneers and laminates")
      presenter = the visiting brand or company (shown as "Presented by …")

   HOW TO ADD A CELEBRATION OR A VISIT
   Same idea — copy a block in `celebrations` or `visits`, paste at top.

   Each photo:  { src: "full image", thumb: "small image (optional)", alt: "describe the photo" }
   Newest entries go FIRST. Everything (timeline, albums, gallery) updates automatically.
   ════════════════════════════════════════════════════════════════ */

window.LIFE_DATA = {

  /* ── SATURDAY SESSIONS ─────────────────────────────────────── */
  saturdays: [
    {
      date: "2026-11-14",
      title: "Product session in the studio",   // ← e.g. "Engineered wood flooring"
      presenter: "",                           // ← brand / company name, e.g. "XYZ Woods" (leave "" to hide)
      note: "A visiting supplier presented their products to the whole team in the conference room, with samples passed around the table.",
      photos: [
        { src: "images/life/saturday-session-2.webp", thumb: "images/life/saturday-session-2-thumb.webp", alt: "A visiting supplier presenting to the Innov Arch team at a Saturday session" },
        { src: "images/life/saturday-session-1.webp", thumb: "images/life/saturday-session-1-thumb.webp", alt: "Innov Arch architects and designers listening to a product presentation in the conference room" }
      ]
    }
  ],

  /* ── CELEBRATIONS ──────────────────────────────────────────── */
  celebrations: [
    {
      title: "Diwali 2026",
      date: "2026-11",
      note: "Marigolds, ethnic wear and the whole studio under one roof — our Diwali celebration at the office.",
      photos: [
        { src: "images/life/diwali-2026-team.webp", thumb: "images/life/diwali-2026-team-thumb.webp", alt: "Innov Architects & Interiors team celebrating Diwali 2026 at the studio" },
        { src: "images/life/diwali-2026-leadership.webp", thumb: "images/life/diwali-2026-leadership-thumb.webp", alt: "Innov Arch leadership team dressed in ethnic wear for Diwali 2026" }
      ]
    }
  ],

  /* ── VISITS (award functions & architecture events can go here too) ── */
  visits: [
    {
      title: "Out on a visit",               // ← e.g. "Visit to XYZ Resort" or "IIID Awards 2026"
      date: "2026-11",
      note: "Walking the spaces in person — because the best design lessons happen on site.",
      photos: [
        { src: "images/life/visit-1.webp", thumb: "images/life/visit-1-thumb.webp", alt: "Innov Arch team visiting a resort property" },
        { src: "images/life/visit-2.webp", thumb: "images/life/visit-2-thumb.webp", alt: "Innov Arch designers in discussion during a venue visit" }
      ]
    }
  ]
};
