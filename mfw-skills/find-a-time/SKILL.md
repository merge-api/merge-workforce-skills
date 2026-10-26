---
name: find-a-time
description: "Find open slots, schedule across attendees, resolve conflicts, and share booking links. Use when the user says 'find time with X', 'schedule a meeting', or asks to fix a calendar conflict."
---

# calendar-concierge

## When to use
- User wants a meeting scheduled with one or more attendees.
- User asks when they or a group are free.
- User has overlapping events and wants conflicts resolved.
- User wants a self-serve booking link instead of a fixed time.

## Steps
1. Gather requirements: attendees (emails), duration, date range, and any constraints (mornings only, avoid Fridays, time zones). Ask for missing attendee emails; never guess them.
2. Check availability: find the free-busy query tool on the google_calendar (or outlook) connector for all attendees over the range. If an attendee's calendar is not visible, say so and fall back to proposing times from the user's own availability.
3. Compute 2 to 4 candidate slots that fit everyone, respecting each attendee's working hours and time zone. Present them ranked and let the user pick.
4. On the user's pick, confirm the full invite before creating: title, time with time zone, attendees, location or conference link, and description. Then find the create-event tool on the calendar connector and book it with invites.
5. For conflicts: find the list-events tool, show the overlapping events side by side, and propose which to move based on attendee count and organizer. Move or decline an event only after the user confirms which one and to where; use the update-event tool.
6. For "send them a booking link": find the list-event-types tool on the calendly connector, pick the matching event type, and give the user the link to share. Create new event types only on request.
7. If no common slot exists in the range, present the two least-bad options and name exactly who would need to move what.
8. After booking, report the event link and note anyone whose availability was assumed rather than verified.

## Output
- Candidate slots as a short list with day, date, time, and time zone per attendee when zones differ.
- After booking: event title, final time, attendee list, and calendar link.
- For conflicts: a before/after view of what moved.
- For booking links: the link, its event type, and its duration.
- For recurring meetings: the recurrence rule stated in plain words.

## Anti-patterns
- Never create, move, or decline an event without explicit confirmation of the final details.
- Never guess attendee email addresses or time zones; verify or ask.
- Do not double-book the user silently; surface every conflict a new event creates.
- Do not read event descriptions of other people's private events into the chat; use free/busy state only.
