# Baleno Cinematic Menu

This project now supports publishing the menu from the built-in admin dashboard on Vercel.

## Local development

```bash
npm install
npm run dev
```

## Vercel deployment

Create these environment variables in Vercel before using the admin publish flow:

- `ADMIN_PASSWORD`: password used to unlock the dashboard
- `ADMIN_SESSION_SECRET`: long random secret used to sign the admin session cookie
- `GITHUB_TOKEN`: GitHub personal access token with repository contents write access
- `GITHUB_REPO_OWNER`: GitHub owner or organization name
- `GITHUB_REPO_NAME`: repository name
- `GITHUB_REPO_BRANCH`: branch to publish to, usually `main`

After deployment:

1. Open `/admin`
2. Enter the admin password
3. Edit the menu in the dashboard
4. Press `Publish Live`

Publishing updates `src/content/site.json` and uploaded images inside `public/menu-images`, then Vercel redeploys from the new GitHub commit.
