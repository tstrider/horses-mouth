---
name: horses-mouth
description: Get facts straight from the source. Use whenever the answer is a fact that one owner controls, such as a price, MSRP, fee, rate, release date, spec, limit, policy, rule, or requirement, or whenever the user says "official", "published", "confirmed", "exact", "current", or "according to" a company. Also use when web sources disagree or a figure rests on one source. Makes Claude open the owner's own pages (the maker, company, agency, or official docs) before answering, settle conflicts instead of offering to check later, and label every figure as official, calculated, or unofficial.
---

# Horse's Mouth

Get the fact from the owner, not from someone repeating it.

The **owner** is whoever controls the fact:
- Product price or spec: the maker. A store's price: that store.
- Law, fee, or rating: the agency that sets it.
- Company policy: that company.
- Software behavior or limits: the project's official docs, changelog, or source.

Everyone else is secondary, even when they write "the company announced..."

## Procedure

1. **Name the owner** and their domain before you search.
2. **Open the owner's pages first.** If an owner page appears in results, fetch it before any third-party page. Open it even if the title does not promise the answer. News posts, buyer's guides, FAQs, and help pages often hold the numbers. A search snippet is not a source. Open the page.
3. **Search the owner's site** if the first page lacks the answer, for example `site:<owner-domain> <product> price`. Try 2 or 3 owner pages before you fall back.
4. **Fall back only for gaps.** Use third-party pages only for figures the owner does not publish. Label those figures unofficial and name the source.
5. **Resolve, don't offer.** If sources conflict or a figure rests on one source, run the extra fetch now. If the owner's own pages disagree, prefer the most recent and most specific page (the live product or pricing page over an old announcement), and mention the other figure. Never end with "I can check X" when checking X is one tool call.
6. **No unverified math.** Add or multiply figures only when the owner confirms the counts (items per box, pods per pack). Label the result calculated.
7. **Stop when done.** Once the owner answers every figure, stop searching. Do not pad the answer with more third-party pages.

## Answer format

Label every figure:
- **official**: from the owner's page. Link it.
- **calculated**: math on official figures. Show the math.
- **unofficial**: secondary source only. Name it.

Give the region or currency when prices vary by country. Add "as of <date>" when the fact can change. If the owner publishes nothing on it, say so and list what you checked.

Keep the reply short. Brevity applies to the answer, never to the research.

## Before you send

- [ ] Did I open at least one page on the owner's domain? (If it would not load after 2 or 3 tries, say so and list what you tried.)
- [ ] Is every figure labeled official, calculated, or unofficial?
- [ ] Did I settle every conflict instead of offering to?
- [ ] Is every calculated number built only on counts the owner confirmed?

If any box is unchecked, keep working.

## When not to use

The user wants street, resale, or sale prices across stores, opinions, reviews, or a rough estimate where "official" does not matter. Answer normally.
