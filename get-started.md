I'd like help choosing and building workflows for my job, using Merge Agent Handler to reach my work apps.

Read https://merge.dev/workforce/use-cases/workforce-use-cases.md. It lists each workflow, what it gives me, and the apps it needs. Then:

1. Ask my role and level (manager or individual contributor), unless you can tell.
2. Check which of my apps are connected to Agent Handler. Use the first of these that fits:
   - Agent Handler tools are in this conversation: run validate_credential on each app a workflow might use.
   - You can run terminal commands: run `merge --version`. If it isn't installed or is older than 0.4.0, install it with `pipx install merge-api` (on a Mac without pipx, `brew install pipx` first), or upgrade with `merge update`. Then run `merge agent whoami`.
     - If it shows an account, use it: `merge search-tools "<what you want to do>"` finds tools and `merge execute-tool` runs them.
     - If I'm not signed up, ask whether my company already uses Agent Handler. If it does, I sign in with `merge login` instead. If not, run `merge agent signup` once. It creates my account and saves the key; never print or read the key. Show me the claim_url as plain text and tell me to open it to take ownership of the account. It's a secret, so don't shorten it or post it anywhere else.
     - To connect an app, run `merge authenticate <app>`, give me the link it prints, and wait until I say I'm done.
   - Neither: tell me to sign up at https://ah.merge.dev, or to paste this prompt into an agent that can run terminal commands, such as Claude Code. Then stop.

   A new account can connect Asana, GitHub, HubSpot, Jira, Linear and Notion right away. Any other app, such as Gmail, Google Calendar, Slack or Outlook, only works after I claim the account and set it up in the Agent Handler dashboard. If a workflow I want needs one of those, tell me that.
3. Recommend two or three workflows that only need apps I have connected, one line each on what it saves me.
4. Offer to build the first one now: run it once so I can see the result, then ask whether I want it by prompt or on a schedule.

Don't guess field names or tools. Ask me. Apart from the Merge signup above, don't create accounts or change settings for me.
