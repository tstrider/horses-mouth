---
name: horses-mouth
description: Get facts straight from the official source. Use whenever an answer depends on a checkable fact that a specific person, company, agency, or project is responsible for, such as a price, date, spec, rule, law, policy, fee, deadline, requirement, statistic, quote, study result, version number, or how a product or piece of software works. Also use when the user asks to confirm, verify, or fact-check a claim, asks if something is true, or asks what the official answer is or what a source says, and whenever sources disagree or a claim rests on one secondhand source. Makes Claude read the official source before blogs, news, or forums, settle conflicts instead of offering to check later, and label each fact as official, calculated, or secondhand. Skip for casual chat, opinions, brainstorming, creative work, settled common knowledge, and routine coding where the answer is in the user's own files.
---

# Horse's Mouth

Get the fact from the official source, not from someone repeating it.

## 1. Find the official source

The official source is whoever sets, measures, says, or first publishes the fact.

| Fact | Official source |
|---|---|
| Product price, specs, or release date | The maker |
| A store's price, stock, or return policy | That store |
| Law, regulation, or court ruling | The official text from the government or court |
| Government fee, form, deadline, or benefit | The agency that runs it |
| Health or safety guidance | The public health agency or regulator |
| A company's terms, plans, or policies | That company's own pages |
| How software works, its limits, or versions | Official docs, changelog, release notes, or source code (in a project, the installed version) |
| Statistic | The agency or group that measured it |
| Study finding | The study itself, not news about it |
| Quote or statement | The original video, transcript, or post |
| Sports rules or results | The league or governing body |
| Event dates or details | The organizer |

Everything else is secondhand: news, blogs, forums, wikis, AI summaries, and search snippets. That holds even when they write "X announced..."

If no one owns the fact (history, broad science), use the most direct evidence you can find, such as original documents, official data, or peer-reviewed research. Say that is what you used.

## 2. Procedure

1. **Name the source first.** Before searching, decide who the official source is and where they publish.
2. **Read the source first.** If it appears in results, open it before any secondhand page. Open it even if the title looks unhelpful. FAQs, help pages, press releases, PDFs, and changelogs often hold the answer. A search snippet is not a source. Open the page.
3. **Search the source directly** if it did not show up in results or its first page falls short, for example `site:<domain> <topic>`. Try 2 or 3 of its pages before you fall back.
4. **Use secondhand pages only for gaps.** Label those facts secondhand and name where they came from.
5. **Resolve, don't offer.** If sources disagree or a fact rests on one secondhand source, check now. If the official source's own pages disagree, prefer the newest and most specific page, and mention the other. Never end with "I can check X" when checking X is one step away.
6. **No unconfirmed math.** Combine numbers only when the source confirms every input. Label the result calculated and show the math.
7. **Stop when done.** Once the official source answers everything, stop. Do not pad the answer with more pages.

## 3. Answer format

Label each key fact or figure:
- **official**: read on the official source. Link it.
- **calculated**: math on official figures. Show the math.
- **secondhand**: found only elsewhere. Name the source.
- **unchecked**: from memory, only when you cannot reach any source. Say why.

In a long answer, one label per table row or section is enough. Name the place or version when the fact varies (country, plan, software version). Add "as of <date>" when it can change. If the official source says nothing, say so and list what you checked.

Keep the reply short. Brevity applies to the answer, never to the research.

## 4. Before you send

- [ ] Did I open the official source itself? (If I have no web access, say so, label every fact unchecked, and name the source to check. If it would not load after 2 or 3 tries, say so and list what I tried.)
- [ ] Is every key fact labeled?
- [ ] Did I settle every conflict instead of offering to?
- [ ] Is every calculated number built only on confirmed inputs?

If any box is unchecked, keep working. If a box cannot be checked (no web access, the source will not load, or sources still disagree after checking), say so in the answer and stop.

## When not to use

Skip it for opinions, brainstorming, creative work, and settled common knowledge, like a country's capital. Also skip it when the user wants secondhand views on purpose, such as reviews or commentary.
