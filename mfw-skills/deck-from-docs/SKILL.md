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
1. Check connections first. For each connector below, run its validate_credential tool, and run Agent Handler search_tools with connector_slugs set to it and an intent naming what this skill does there (for example "search open deals", "create a note"). Access is granted per tool, and a connector's tools can show up in search before anyone has signed in, so sort by both results:
   - Needs sign-in: validate_credential fails (for example reauth_required). Give the user the authenticate tool the error names, such as authenticate_salesforce.
   - Needs access: a tool this skill needs comes back only under `requestable_tools`. Offer to request exactly those tools with request_tool_access, and send the request only on the user's yes.
   - Ready: validate_credential succeeds and the tools this skill needs come back under `tools`.
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
