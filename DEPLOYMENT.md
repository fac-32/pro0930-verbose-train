# Deployment Instructions

This guide provides instructions for deploying the Verbose Train application. The recommended platform for its simplicity and performance with Node.js applications is **Vercel**.

## Deploying to Vercel

### 1. Prerequisites

- Ensure all your latest code is pushed to your GitHub repository.
- Have your API keys (`OPENAI_API_KEY`, `TFL_API_KEY`, `GOOGLE_MAPS_API_KEY`) ready.

### 2. Initial Setup

1. Go to [vercel.com](https://vercel.com) and sign up or log in, preferably with your GitHub account.
2. From your dashboard, click **"Add New..."** -> **"Project"**.
3. Find and **"Import"** the project repository.

### 3. Project Configuration

This is the most important step. When Vercel shows the configuration screen:

- **Project Name:** Give your project a name.
- **Framework Preset:** Vercel should automatically detect "Express.js / Node.js".
- **Root Directory:** Should be the default (`.`).

#### For a Production Deployment (from `main` branch):

- **Production Branch:** Ensure the branch is set to `main`.
- **Environment Variables:**
    1. Expand the "Environment Variables" section.
    2. Add each key and value from your `.env` file (`OPENAI_API_KEY`, `TFL_API_KEY`, etc.).

#### For a Personal Deployment (from a feature branch):

- **Production Branch:** **Change this setting.** Click the dropdown and select the feature branch you want to deploy (e.g., `feature/google-places-integration`).
- **Environment Variables:**
    1. Expand the "Environment Variables" section.
    2. Add your personal API keys.

### 4. Deploy

- Click the **"Deploy"** button.

Vercel will now build and deploy your application. After a minute or two, it will provide you with a live URL. The deployment will automatically update whenever you push new commits to the specific branch you chose to deploy.
