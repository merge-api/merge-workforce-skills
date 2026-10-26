---
name: vendor-bill-review
description: "Weekly review of open vendor bills: what is due, what is overdue, and what looks like a duplicate or is missing details. Use when the user says 'which bills are due this week', 'check for duplicate bills', or asks for a pre-payment-run review."
---

# vendor-bill-review

## When to use
- Before a payment run, to catch duplicates and bills missing details.
- User asks which vendor bills are due this week or overdue.
- Scheduled weekly summary for accounts payable.
- User asks whether a specific bill looks like a duplicate.

## Steps
1. Check connections first. For each connector below, confirm it is signed in and that you can use the tools this skill needs there. Access can be granted per tool, so check the tools, not just the connector. Sort each one:
   - Needs sign-in: tell the user how to connect it.
   - Needs access: name the tools that are missing and how to get them.
   - Ready: carry on.
   How to check:
   - On Agent Handler: run the connector's validate_credential tool; a reauth_required error names the authenticate tool to give the user. Then run search_tools with connector_slugs set to the connector and an intent naming what this skill does there. Tools listed only under `requestable_tools` need access: offer to request exactly those with request_tool_access, and send the request only on the user's yes.
   - Elsewhere: use your setup's connection status if it has one; otherwise make this skill's first read call on each connector and sort by the error it returns.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: netsuite or quickbooks_online. Optional: slack, gmail. Stop if no accounting system is ready. Without slack or gmail, show the summary in chat.
2. Confirm the accounting system (netsuite or quickbooks_online) and, on the first run, whether the company requires a PO on bills. Reuse the answer for the session.
3. Pull open vendor bills: find the list-bills or search-bills tool on the accounting connector. Fetch vendor, bill ID, invoice number, bill date, due date, amount, currency, memo, and PO reference. Cap at 500 bills and say how many were covered if there are more.
4. Sort into due in the next 7 days and overdue (due date before today, still open).
5. Flag likely duplicates: same vendor and amount, with the same invoice number or bill dates within 3 days of each other. Bills with the same vendor and amount about a month apart are recurring (rent, subscriptions); list them separately as "recurring, check if expected" with the reason, so Finance can dismiss them quickly.
6. Flag missing details: no due date, no memo, or no PO where the company requires one.
7. Present the summary. For delivery, confirm the destination once (a Slack channel via the slack post-message tool, or an email via gmail) and send after the user approves the text. On a scheduled run, use the destination confirmed at setup.

## Output
- Four sections: Due this week, Overdue, Possible duplicates, Missing details.
- Each flagged bill with vendor, bill ID, amount, dates, and why it was flagged; duplicates show the matching bill IDs side by side.
- Totals per section in each currency.
- A "recurring, check if expected" list kept apart from the duplicates.

## Anti-patterns
- Do not create, approve, pay, edit, or void any bill; this skill is read-only.
- Do not call a bill a duplicate without the matching bill ID next to it.
- Do not sum amounts across currencies.
- Do not post the summary anywhere the user has not confirmed.
