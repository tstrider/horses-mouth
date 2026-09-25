<div align="center">

# 🐴 Horse's Mouth

**Official answers, straight from the source. Even on low effort.**

A skill for Claude that checks the owner's own website before it tells you an "official" price, date, spec, or policy.

[![Claude Skill](https://img.shields.io/badge/Claude-Skill-D97757)](#install)
[![Built for low effort](https://img.shields.io/badge/built%20for-low%20effort-2ea44f)](#built-for-low-effort)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[Install](#install) · [How it works](#how-it-works) · [Example](#before-and-after) · [FAQ](#faq)

</div>

---

## The problem

Ask Claude for the official price of something. Here is what can go wrong, especially on low effort:

1. It runs one search.
2. It opens the two pages whose titles promise a price table. Usually blogs.
3. It skips the company's own page, because that title looked less useful.
4. It calls the blog's numbers "official."
5. It ends with "I can check the official site if you'd like."

The answer sounds sure. It is secondhand. Sometimes it is wrong.

## The fix: go to the owner first

The **owner** is whoever controls the fact.

| Fact | Owner |
|---|---|
| A product's price or specs | The maker |
| A store's price | That store |
| A fee, law, or rating | The agency that sets it |
| A company policy | That company |
| An API limit or software behavior | The official docs, changelog, or source code |

Everyone else is repeating the owner. Horse's Mouth makes Claude read the owner first.

## How it works

When a question involves an owner-controlled fact, Claude loads the skill and follows seven steps:

1. **Name the owner** and their website before searching.
2. **Open the owner's pages first**, even when the titles look unhelpful. FAQs, help pages, and news posts often hold the numbers.
3. **Search the owner's site** directly if the first page falls short.
4. **Use other sites only for gaps**, and label those figures unofficial.
5. **Settle conflicts now.** No "I can check later."
6. **No math on unconfirmed counts.** It won't multiply a price by a box count it never verified.
7. **Stop when the owner answers.** No extra reading.

Then it labels every figure:

- **official**: from the owner's page, with the link
- **calculated**: math on official figures, with the math shown
- **unofficial**: from another source, which it names

## Before and after

*An illustration. Acme is a made-up company.*

> **You:** What's the official price of the Acme Brew coffee maker and its pods?

**Without the skill**

> The Acme Brew is $129 (official MSRP), and pods run about 60¢ each. Want me to check Acme's site to confirm?

Behind that answer: two review blogs, one of them out of date. Acme's own pages showed up in the search. Claude never opened them.

**With Horse's Mouth**

> | Item | Price | Source |
> |---|---|---|
> | Acme Brew coffee maker | $149.99 | official ([acme.example/brew](#before-and-after)) |
> | Pods, box of 24 | $17.99 | official ([acme.example/pods](#before-and-after)) |
> | Price per pod | $0.75 | calculated ($17.99 ÷ 24) |
> | Travel mug | $24.00 | unofficial (one retailer; Acme lists no price) |
>
> US prices, as of today.

Every number has a source. The one Claude could not confirm says so.

## Built for low effort

Low effort is Claude's cheap, fast setting. It is also the setting most likely to stop at the first page that looks like an answer.

That is the gap this skill fills. Claude does not have to reason its way to "check the source first." The checklist tells it to. So you can leave Claude on low effort for everyday lookups and still get answers traced to the source.

It stays light:

- **Under 600 words.** Until a question needs it, only the skill's short description sits in Claude's context.
- **Fewer wasted reads.** Going to the owner first often replaces several third-party pages.
- **A hard stop.** Once the owner answers every figure, the search ends.

It works at any effort level. It is written so that low effort can follow it.

## Install

### Claude Code

**Option 1: plugin.** Run these inside Claude Code:

```
/plugin marketplace add tstrider/horses-mouth
/plugin install horses-mouth@horses-mouth
```

**Option 2: copy the folder.** Run this in a macOS or Linux terminal:

```bash
mkdir -p ~/.claude/skills && curl -fsSL https://github.com/tstrider/horses-mouth/releases/latest/download/horses-mouth.zip -o /tmp/horses-mouth.zip && unzip -o /tmp/horses-mouth.zip -d ~/.claude/skills
```

Then start a new Claude Code session.

### Claude apps (web, desktop, Cowork)

1. Download **[horses-mouth.zip](https://github.com/tstrider/horses-mouth/releases/latest/download/horses-mouth.zip)**.
2. Make sure code execution is on in your settings. Skills need it.
3. Go to **Customize → Skills**. Click **+**, then **Create skill**, then **Upload a skill**, and choose the zip.

Uploaded skills work in both chat and Cowork. [Anthropic's help article](https://support.claude.com/en/articles/12512180-using-skills-in-claude) has screenshots.

### Claude API

Upload the `skills/horses-mouth` folder with the Skills API, then attach it to your requests. See [Anthropic's Agent Skills docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview).

## Optional: an always-on backup line

Claude loads a skill when a question matches its description. On low effort, that match can miss. For a safety net, add this line to your custom instructions:

> When I ask for an official fact (price, date, spec, policy), check the owner's own website before answering. Label each figure official, calculated, or unofficial. If sources disagree, check before replying. Don't offer to check later.

- **Claude Code:** add it to `~/.claude/CLAUDE.md`.
- **Claude apps:** paste it into your personal preferences in Settings.

## FAQ

**Is it only for prices?**
No. It covers release dates, specs, fees, limits, policies, and rules. Anything one owner controls.

**What if the owner never published the number?**
Claude says so, lists what it checked, and labels any outside figure unofficial.

**Will it slow down everyday chat?**
No. It loads only for owner-controlled facts. Opinions, reviews, and street prices get a normal answer.

**How do I call it on purpose?**
In Claude Code, type `/horses-mouth`. In the Claude apps, ask Claude to use the horses-mouth skill.

**Which models does it work with?**
Any Claude model that supports skills.

## What's in the repo

```
skills/horses-mouth/SKILL.md      the skill (it's short, read it)
.claude-plugin/marketplace.json   lets Claude Code install it as a plugin
```

## License

MIT. Use it, fork it, improve it.
