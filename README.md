# Meta Business Suite Content Table Cleaner & Pager

Userscript for Tampermonkey that cleans up the Meta Business Suite content tables in **Insights → Content** and **Content → Published posts**.

It works locally in your browser: it hides promotion buttons and overflow menus, then displays the loaded content rows eight at a time with a simple pager when pagination is needed.

## Features

- Hides **Promote / Boost** controls and row overflow menus (the three dots).
- Adds **Previous / Next** controls and shows eight rows per page only when more than eight rows are loaded. The controls are removed when eight or fewer rows are available.
- Recognizes common promotion labels in English, Spanish, Portuguese, French, German, Italian, Dutch, several Nordic and Central European languages, Turkish, Indonesian, Vietnamese, Russian, Chinese, Japanese, Korean, Arabic and Hebrew.
- Runs only on Meta Business Suite's Content Insights and Published posts pages.
- Does not change posts, account settings, or analytics data.

## Installation with Tampermonkey

1. Install the [Tampermonkey browser extension](https://www.tampermonkey.net/).
2. In Chrome, open Tampermonkey's extension settings and enable **Allow User Scripts**. If that option is unavailable, enable **Developer mode** at `chrome://extensions`.
3. Open the Tampermonkey dashboard and select **Create a new script**.
4. Replace the starter code with the contents of [`ocultar-controles-meta.user.js`](./ocultar-controles-meta.user.js).
5. Save the script and make sure it is enabled.
6. Open or reload Meta Business Suite → Insights → Content or Content → Published posts.

The pager appears at the bottom-right corner of the screen.

## Privacy and permissions

This script is designed to be privacy-friendly:

- It does not make network requests.
- It does not read, store, transmit, or log account data, cookies, tokens, post text, or analytics.
- It only examines the page's DOM to identify table controls, then applies local CSS/attributes.
- Its URL match is limited to `https://business.facebook.com/latest/insights/content*` and `https://business.facebook.com/latest/posts/published_posts*`.

## Important limitation

Meta may virtualize long tables and load more rows while you scroll. The pager operates on the rows currently loaded in the page, so it is a visual convenience rather than a replacement for Meta's own data navigation.

## Credits

**Author:** Daidaros  
**Project:** digiSTART

## Disclaimer

This is an independent userscript and is not affiliated with, endorsed by, or maintained by Meta.
