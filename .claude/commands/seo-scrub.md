---
description: Pass over a page's prose to remove AI-sounding patterns and make it read more natural/human
argument-hint: <path-to-page.html>
---

Scrub **$ARGUMENTS** for AI-sounding writing patterns. Prose polish only — do
not change facts, prices, structure, headings, or schema.

Read the target file's visible body copy (inside `<article class="post-content">`
or equivalent) and fix, without changing meaning:

- **Repetitive sentence openers** — runs of sentences starting the same way
  ("This means...", "It's important to...").
- **Empty hedging/filler** — "it's worth noting that", "in today's world",
  "when it comes to X" used as a throat-clear rather than to add meaning.
- **Over-symmetrical triads** — lists or clauses padded to exactly three items
  when two or four would be more natural.
- **Vague intensifiers** — "very", "truly", "significantly" doing no real
  work; cut or replace with the concrete number/fact already in the paragraph.
- **Overuse of em dashes or semicolons** as a crutch — vary sentence
  construction instead.
- **Generic transitions** — "Furthermore", "Moreover", "Additionally" stacked
  paragraph after paragraph.
- Keep sentences that already read naturally; don't rewrite for the sake of it.

HARD RULES:
- Do not alter any number, price, date, claim, link, or heading text.
- Do not touch JSON-LD, meta tags, or markup structure — text nodes only.
- Edit surgically, sentence by sentence — this is a polish pass, not a rewrite.

Finish with a short before/after sample (2-3 sentences) so the user can see the
tone shift, and a one-line summary of how many changes were made.
