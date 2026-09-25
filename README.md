<div align="center">

# Horse's Mouth

**Answers straight from the source. Even on low effort.**

Before Claude tells you a fact, it reads the official source. The maker, the agency, the law itself, the docs, the study, or the person who said it.

[![Claude Skill](https://img.shields.io/badge/Claude-Skill-D97757)](#install)
[![Built for low effort](https://img.shields.io/badge/built%20for-low%20effort-2ea44f)](#built-for-low-effort)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[Install](#install) · [What it covers](#what-it-covers) · [How it works](#how-it-works) · [Example](#before-and-after) · [FAQ](#faq)

</div>

---

Horse's Mouth is a skill for Claude. A skill is a short set of steps that Claude picks up when a question calls for it. This one makes Claude check the original source before it answers.

## The problem

Ask Claude to look something up and it searches the web. Then it can read whatever shows up first: a news story, a blog, a forum post. The official source may sit right there in the results, never opened.

So you get an answer that sounds sure but is secondhand, and it might be out of date or wrong. It may even end with "I can check the official site if you'd like."

## The fix

Horse's Mouth gives Claude one habit: **go to the source first.**

The source is whoever sets, measures, says, or first publishes the fact. Everyone else is repeating them.

## What it covers

Any fact with an official source. For example:

| You ask about | Claude reads first |
|---|---|
| A product's price, specs, or release date | The maker's own site |
| A store's price or return policy | That store |
| A law, rule, or court ruling | The official text |
| A tax deadline, fee, or government form | The agency that runs it |
| Health or safety advice | The public health agency |
| A company's terms or plans | The company's own pages |
| How an app or code library works | Its official docs, release notes, or code |
| A statistic | The group that measured it |
| What a study found | The study, not the news story about it |
| Whether someone really said something | The original video, transcript, or post |
| Sports rules or results | The league |
| An event's date or details | The organizer |

## How it works

When your question involves a fact like these, Claude picks up the skill and follows seven steps:

1. **Name the source** before searching.
2. **Read the source first**, even when the page title looks unhelpful. Help pages, FAQs, and PDFs often hold the answer.
3. **Search the source's own site** if it did not show up in the results, or if its first page falls short.
4. **Use other sites only for gaps**, and say so.
5. **Settle conflicts now** instead of offering to check later.
6. **No math on unconfirmed numbers.**
7. **Stop once the source answers.**

Then it labels each fact:

- **official**: read on the official source, with a link
- **calculated**: math on official numbers, with the math shown
- **secondhand**: found only on another site, which it names
- **unchecked**: from memory, only when it cannot reach any source

## Before and after

*An illustration. Acme is a made-up company.*

> **You:** Did Acme's CEO really say they're killing the free plan?

**Without the skill**

> Yes. According to a tech news site, Acme's CEO said the free plan ends in June. Want me to check Acme's announcement to confirm?

Behind that answer: one news story. Acme's own announcement was in the search results. Claude never opened it.

**With Horse's Mouth**

> Not quite.
>
> - Acme's free plan closes to **new** sign-ups on June 1. **official** ([Acme's blog post](#before-and-after))
> - Current free accounts keep working. **official** (same post)
> - The "killing the free plan" line appears in one news story. It is not in Acme's post or in the CEO's own posts. **secondhand**

Every fact has a source. The claim that did not hold up says where it came from.

## Built for low effort

Low effort is a Claude setting. It answers faster and costs less. It also does less checking on its own.

This skill fills that gap. Claude does not have to work out for itself that it should check the source. The steps tell it to. So you can keep Claude on low effort for everyday questions and still get answers from the source.

It stays light. Claude reads the full skill only when a question calls for it. Going to the source first often means reading fewer pages, and the search ends once the source answers.

It works at any effort level. It is written so low effort can follow it.

## Install

### Claude apps (web, desktop, Cowork)

1. Download **[horses-mouth.zip](https://github.com/tstrider/horses-mouth/releases/latest/download/horses-mouth.zip)**.
2. Make sure code execution is on in your settings. Skills need it.
3. Go to **Customize → Skills**. Click **+**, then **Create skill**, then **Upload a skill**, and choose the zip.

Uploaded skills work in both chat and Cowork. [Anthropic's help article](https://support.claude.com/en/articles/12512180-using-skills-in-claude) has more detail.

### Claude Code

**Option 1: plugin.** Run these inside Claude Code:

```
/plugin marketplace add tstrider/horses-mouth
/plugin install horses-mouth@horses-mouth
```

**Option 2: copy the folder.** Run this in a Mac or Linux terminal:

```bash
mkdir -p ~/.claude/skills && curl -fsSL https://github.com/tstrider/horses-mouth/releases/latest/download/horses-mouth.zip -o /tmp/horses-mouth.zip && unzip -o /tmp/horses-mouth.zip -d ~/.claude/skills
```

Then start a new Claude Code session. To update later, run the same command again.

### Claude API

Upload the `skills/horses-mouth` folder with the Skills API, then attach it to your requests. See [Anthropic's docs on skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview).

## Optional: a backup line

Claude picks up a skill when your question matches the skill's description. Sometimes it misses. For a safety net, add this line to your custom instructions:

> When I ask about a fact that has an official source, read that source before answering. Label each fact official, calculated, or secondhand. If sources disagree, check before replying. Don't offer to check later.

- **Claude apps:** paste it into **Instructions for Claude** in Settings. Older versions call it personal preferences.
- **Claude Code:** add it to `~/.claude/CLAUDE.md`.

## FAQ

**What kinds of questions does it handle?**
Any question with an official source. Prices, dates, specs, laws, rules, policies, deadlines, statistics, study results, quotes, software docs, and more.

**What if there is no single official source?**
Claude uses the most direct evidence it can find, like original documents or official data, and tells you that is what it used.

**What if the source never published the answer?**
Claude says so, lists what it checked, and labels anything from other sites as secondhand.

**Will it slow down everyday chat?**
No. It skips opinions, brainstorming, creative writing, and common knowledge.

**How do I use it on purpose?**
In Claude Code, type `/horses-mouth`. In the Claude apps, ask Claude to use the horses-mouth skill.

**Which versions of Claude does it work with?**
Any version of Claude that supports skills.

## What's in the repo

```
skills/horses-mouth/SKILL.md      the skill (it's short, read it)
.claude-plugin/marketplace.json   lets Claude Code install it as a plugin
```

## License

MIT. Free to use and change.
