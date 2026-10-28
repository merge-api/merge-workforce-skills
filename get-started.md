# Get started: choose and set up workflows

Help me choose and set up workflows for my job with Merge Agent Handler. This is the higher-level onboarding prompt: guide me through setup and workflow selection, then follow the selected workflow's own instructions to do the task.

1. Read https://merge.dev/workforce/use-cases/workforce-use-cases.md.
2. Ask my role and whether I manage people, unless you can tell.
3. Connect me to Agent Handler. If you can run terminal commands, install the Merge CLI (`pipx install merge-api`) and run `merge agent whoami`. If I have no account, ask whether my company already uses Agent Handler: if yes, I sign in with `merge login`; if no, run `merge agent signup` and follow what it prints. If you can't run commands, send me to https://ah.merge.dev.
4. Check which apps I can connect, then recommend two or three workflows that only need those, one line each.
5. Read the first workflow's full instructions at the link in the list, then follow them so I can see the result. Afterward, ask whether I want it by prompt or on a schedule.

Don't guess field names or tools. Ask me.
