---
name: access-request-review
description: Review pending access requests (ServiceNow or Jira Service Management) against the requester's Okta role, groups and peers' access, and recommend approve, deny, or send to a human, with a reason. Recommendations only by default. Use when asked "review the pending access requests" or "should <user> get access to <app/group>?". DRAFT — unpublished, not confirmed with Merge IT.
---

# Access request review (DRAFT, unpublished)

## Steps
1. Check connections first. For each connector below, run its validate_credential tool, and run Agent Handler search_tools with connector_slugs set to it and an intent naming what this skill does there (for example "search open deals", "create a note"). Access is granted per tool, and a connector's tools can show up in search before anyone has signed in, so sort by both results:
   - Needs sign-in: validate_credential fails (for example reauth_required). Give the user the authenticate tool the error names, such as authenticate_salesforce.
   - Needs access: a tool this skill needs comes back only under `requestable_tools`. Offer to request exactly those tools with request_tool_access, and send the request only on the user's yes.
   - Ready: validate_credential succeeds and the tools this skill needs come back under `tools`.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: servicenow or jira_service_management; okta. Optional: slack. Stop if either side is not ready; a recommendation needs both the request and the requester's groups.
2. **Get requests.** Read pending access requests from ServiceNow (`list_sc_req_items` / `list_sc_requests`, state = pending approval) or Jira Service Management (`search_requests`, status = waiting for approval). If the user names one person/app, review just that request.
3. **Look up the requester in Okta.** `get_user` for title, department and manager; get their current groups and app assignments.
4. **Find peers.** Users with the same title + department (fall back to department only; say so). Need at least 3 peers or the comparison is "insufficient".
5. **Compare.** For the requested group/app, count how many peers already have it (`list_group_users` / `list_app_users`). Note whether the requester already has it.
6. **Classify the target.** Privileged if the group/app name or description matches admin, super, root, owner, prod, billing, security, finance-approver, okta-*, or is on IT's privileged list. Privileged targets always go to a human.
7. **Recommend.**
   - Approve: not privileged AND at least 60% of peers have it.
   - Deny: not privileged AND under 20% of peers have it AND no business reason in the ticket.
   - Needs human review: privileged, 20-60% of peers, fewer than 3 peers, requester already has it, or data missing.
8. **Output the table** (below). Stop here unless IT approves specific rows.
9. **Only after explicit per-request IT approval** (the approver names the ticket number in this conversation): add the user to the approved non-privileged group, then update that ticket with what changed. One change per approved ticket. Never batch-approve.

## Output
| Ticket | Requester (title, dept) | Requested | Recommendation | Reason |
|---|---|---|---|---|

- **Reason must cite:** requester's relevant current groups, and peer comparison as "N of M peers (title, dept) have it".
- Privileged rows: recommendation is always "Needs human review (privileged)", never "Approve".
- Footer: "No changes made. Approve individual tickets to apply them." (or after approval: list of changes made + tickets updated).

## Rules
- Read-only by default. No group, app or ticket changes without explicit, per-ticket IT approval in the conversation.
- Never add or remove anyone from admin/privileged groups or apps, even with approval (v1).
- Never remove access. Never change passwords, credentials or app profiles.
- Never message the requester or approver; IT does that.
- If Okta or the service desk is not accessible, stop and say which tool is missing. Do not guess groups or peers.
- Every change must appear in the Agent Handler audit log; cite the ticket number in the change note.
- Peer data is a signal, not a policy. Say when the peer group is small or approximated.

## Tools (Agent Handler)
- Okta (read): `get_user`, `list_users`, `list_user_groups`*, `list_group_users`, `list_app_users`, `list_group_apps`, `get_group`
- Okta (write, approval only): `add_user_to_group`
- ServiceNow (read): `list_sc_req_items`, `list_sc_requests`, `get_sc_request` — or JSM: `search_requests`, `list_requests`, `get_request`
- Service desk (write, approval only): ticket update/comment tool
- *Tool names marked * not yet confirmed in Agent Handler search.
