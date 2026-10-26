---
name: deck-from-docs
description: "Turn a doc or notes into a slide deck in the user's presentation tool. Use when the user says 'make this a deck', 'turn these notes into slides', or asks for a presentation from existing content."
---

# deck-from-docs

## When to use
- User has a document, notes, or chat content and wants slides built from it.
- User asks to add sections to an existing presentation from source material.
- User wants a first-draft deck to refine themselves.
- User wants speaker notes drafted for an existing outline or deck.

## Steps
1. Check connections first. For each connector below, confirm it is signed in and that you can use the tools this skill needs there. Access can be granted per tool, so check the tools, not just the connector. Sort each one:
   - Needs sign-in: tell the user how to connect it.
   - Needs access: name the tools that are missing and how to get them.
   - Ready: carry on.
   How to check:
   - On Agent Handler: run the connector's validate_credential tool; a reauth_required error names the authenticate tool to give the user. Then run search_tools with connector_slugs set to the connector and an intent naming what this skill does there. Tools listed only under `requestable_tools` need access: offer to request exactly those with request_tool_access, and send the request only on the user's yes.
   - Elsewhere: use your setup's connection status if it has one; otherwise make this skill's first read call on each connector and sort by the error it returns.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: one of google_slides, gamma, or canva. Optional: none. If no slides tool is ready, write the outline and deliver it as Markdown (step 9).
2. Confirm the source (pasted text, a doc the user shares, or prior conversation content) and the target tool: google_slides, gamma, or canva. Ask for the audience and rough slide count if not stated; default to 8 to 12 slides.
3. Outline first. Draft a slide-by-slide outline: title, one-line purpose, and the 3 to 5 bullets or figure each slide carries. Keep one idea per slide. Present the outline and get approval before creating anything; creating the deck is a write.
4. On approval, create the presentation: find the create-presentation tool on the chosen connector. Record the new presentation ID and URL.
5. Build slides in order: find the create-slide and text-insertion tools on the connector. For google_slides, batch related edits where the connector supports batch updates rather than one call per text box.
6. Where the source contains tables or numbered data, render them as native tables (find the create-table tool) instead of paragraph text. Do not fabricate charts from numbers the source does not contain.
7. Add a closing slide with next steps only if the source states them.
8. Return the deck link and a slide-by-slide map so the user can request targeted edits ("rewrite slide 4"). Apply edit requests via the connector's update tools without rebuilding the deck.
9. If the target tool is not connected or the create fails, deliver the approved outline as Markdown so no work is lost.

## Output
- First: the proposed outline for approval.
- After build: the presentation URL plus a numbered list of slides with their titles.
- Any source content that was cut for space, listed so the user can pull items back in.
- Speaker notes per slide when requested, kept out of the slide body.
- The approved outline retained in the reply so the deck can be rebuilt elsewhere.

## Anti-patterns
- Do not create the presentation before the outline is approved.
- Do not paste dense paragraphs onto slides; slides carry headlines and bullets, the doc stays the reference.
- Do not invent data, quotes, or attributions absent from the source.
- Do not overwrite an existing presentation unless the user explicitly points at it and confirms.
