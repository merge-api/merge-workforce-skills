---
name: email-campaign-builder
description: "Builds, segments, and schedules email campaigns in the marketing platform. Use when the user says 'set up the newsletter send', 'build a campaign for the launch', 'email this segment', or wants a campaign scheduled."
---

# email-campaign-builder

## When to use
- User wants a one-off campaign (launch, newsletter, announcement) built in klaviyo, sendgrid, activecampaign, or hubspot.
- User wants an existing draft campaign retargeted to a different segment or rescheduled.
- User asks which list or segment a campaign should go to.
- User wants a test send reviewed before the real audience gets it.

## Steps
1. Check connections first. For each connector below, confirm it is signed in and that the tools this skill needs are available; access can be granted per tool, so a signed-in connector can still be missing one. Tell the user which connectors need sign-in or an access request and what that rules out, then continue with the ready ones.
   - On Agent Handler: validate_credential shows sign-in; a reauth_required error names the authenticate tool to give the user. search_tools with connector_slugs set to the connector and an intent naming what this skill does there shows access; tools listed only under `requestable_tools` need it. Offer request_tool_access for exactly those, and send it only on the user's yes.
   - Elsewhere: make this skill's first read call on each connector and report the error it returns.
   Required: one of klaviyo, sendgrid, activecampaign, or hubspot. Optional: none. Stop if no email platform is ready.
2. Confirm the platform and gather the campaign brief: goal, audience description, subject line direction, content source, and desired send time with timezone.
3. Resolve the audience:
   - Find the tool that lists segments or lists on the platform and match the user's description to a real segment ID. Report the segment's size.
   - If no segment fits, propose the closest existing ones.
   - Create a new segment only if the user asks, and show its filter logic and resulting size first.
4. Draft the email: subject, preview text, and body. Respect the platform's template system where one exists (find the list-templates tool) rather than raw HTML from scratch. Include the unsubscribe block; never remove it.
5. Check sender identity: find the tool that lists verified senders or sending domains and use one that is verified. If none exists, stop and tell the user; do not send from an unverified address.
6. Create the campaign in draft state with the platform's create-campaign tool. Send a test to the user's own address if the platform supports it and the user wants one.
7. Present the full package for confirmation: segment name and size, sender, subject, preview text, body, and exact send time with timezone. Only after an explicit yes, schedule or send with the platform's schedule tool. Recap what was scheduled.

## Output
- Campaign summary: platform, campaign ID and edit URL, segment (name, size), sender, subject, scheduled time with timezone, status.
- The final body content as staged.
- Segment resolution notes: which segments were considered and why one was chosen.
- Test send status, if one was sent.

## Anti-patterns
- Do not send or schedule without explicit confirmation of audience, content, and time together.
- Do not build a segment by guessing filters; confirm the logic and show the resulting size.
- Do not send to a whole account list when the user described a subset.
- Do not weaken or remove unsubscribe and compliance footers.
