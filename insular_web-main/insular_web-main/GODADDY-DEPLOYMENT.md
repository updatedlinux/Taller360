# GoDaddy Deployment Setup

This branch is configured for automatic deployment to GoDaddy hosting via GitHub Actions.

## What Changed

1. **Base Path**: Changed from `/insular-cambios/` to `/` in `vite.config.ts`
2. **GitHub Actions**: Added `.github/workflows/deploy-godaddy.yml` for auto-deploy
3. **.htaccess**: Already configured for React Router SPA support

## Setup Instructions

### 1. Get Your GoDaddy FTP Credentials

1. Log into your GoDaddy account
2. Go to **Web Hosting** → **Manage**
3. Find your **FTP credentials**:
   - **FTP Server**: Usually `ftp.yourdomain.com` or similar
   - **FTP Username**: Provided by GoDaddy
   - **FTP Password**: Use your hosting password or create one

### 2. Add GitHub Secrets

Go to your GitHub repo: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these three secrets:

| Secret Name | Example Value | Where to Find |
|-------------|---------------|---------------|
| `FTP_SERVER` | `ftp.yourdomain.com` | GoDaddy hosting control panel |
| `FTP_USERNAME` | `youruser@yourdomain.com` | GoDaddy FTP settings |
| `FTP_PASSWORD` | `your-ftp-password` | GoDaddy FTP settings |

### 3. Deploy

Once secrets are configured:

```bash
# Push to this branch
git push origin godaddy-deployment
```

The GitHub Action will:
1. Build your site (`npm run build`)
2. Upload the `dist/` folder to GoDaddy's `public_html/` directory via FTP
3. Your site goes live automatically!

## Manual Deployment (If Needed)

If you prefer to deploy manually:

```bash
# Build the site
npm run build

# Upload the contents of the dist/ folder to your GoDaddy public_html/ via:
# - FTP client (FileZilla, Cyberduck, etc.)
# - GoDaddy File Manager in cPanel
```

## Important Notes

- The workflow only triggers on pushes to the `godaddy-deployment` branch
- You can also trigger it manually from GitHub Actions tab (workflow_dispatch)
- The `.htaccess` file ensures React Router works properly (no 404s on page refresh)
- First deployment might take a few minutes depending on file size

## Troubleshooting

**Site shows 404 errors:**
- Make sure `.htaccess` is uploaded to `public_html/`
- Verify Apache `mod_rewrite` is enabled on your hosting

**FTP deployment fails:**
- Double-check your GitHub secrets are correct
- Verify your GoDaddy hosting allows FTP access
- Check that `server-dir` matches your hosting structure (might be `/` instead of `/public_html/`)

**Images/assets not loading:**
- Verify the base path in `vite.config.ts` is set to `/`
- Check file paths are relative, not absolute

## Switching Back to GitHub Pages

If you want to go back to GitHub Pages deployment:

1. Switch to `main` branch (which has `base: '/insular-cambios/'`)
2. The GitHub Pages workflow will automatically deploy
