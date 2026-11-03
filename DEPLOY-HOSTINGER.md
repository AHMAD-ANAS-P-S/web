# Deploying AARA Computers on Hostinger

Upload ONLY the contents of `public_html/` (not this file). Keep this guide private.

## 1. Before you upload
- The site assumes your domain is **aaracomputers.com**. If your Hostinger domain is different, replace it in
  `index.html` (and other pages: canonical/og tags), `sitemap.xml` and `robots.txt`.
- Turn on SSL first: hPanel > Websites > Manage > **Security > SSL** (free Let's Encrypt). The `.htaccess`
  forces HTTPS and removes `www`; it will cause a redirect error if SSL is not active yet.

## 2. Upload (pick one)
- **hPanel File Manager:** open `public_html`, delete the default `default.php`/placeholder, upload `public_html.zip`
  contents, then use *Extract*. Make sure `.htaccess` (hidden file) is present next to `index.html`.
- **FTP (FileZilla):** hPanel > Files > FTP Accounts, then upload everything inside `public_html/` to the server's `public_html/`.

## 3. Check after upload
- https://yourdomain/ loads, and https://yourdomain/about and /about.html both work.
- Check http:// redirects to https://, and https://www. redirects to non-www.
- Test headers at securityheaders.com. Submit `https://yourdomain/sitemap.xml` in Google Search Console.
- If Google Maps on the Contact page is blank, check the browser console for CSP messages.

## 4. Updating later
Edit text in the `.html` files. Styling is in `assets/css/`. Keep photos under about 1.5 MB (the optimized set is already in place).
