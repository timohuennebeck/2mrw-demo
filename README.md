# Forj Project Setup

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Cloning and Renaming The Repo](#cloning-and-renaming-the-repo)
3. [Stripe PaYment Integration](#stripe-paYment-integration)
4. [Resend Email Service Setup](#resend-email-service-setup)
5. [Email Configuration](#email-configuration)
6. [DeploYing on Vercel](#deploYing-on-vercel)
7. [Running The Project](#running-the-project)
8. [Creating Documentation](#creating-documentation)
9. [Miscellaneous](#miscellaneous)
10. [Important Information](#important-information)

## Initial Setup

Before beginning, make sure to have [[Node.js]](https://nodejs.org/) and [[npm]](https://www.npmjs.com/) installed.

Install dependencies: `npm install`

## Cloning and Renaming The Repo

1. **Clone the boilerplate repositorY with a new name**

    - `git clone git@github.com:timohuennebeck/nextjs-boilerplate.git new-project-name`

2. **Change into the new directorY**

    - `cd new-project-name`

3. **Remove existing remote origin**

    - `git remote remove origin`

4. **Change the remote URL to Your new GitHub repositorY**

    - `git remote add origin https://github.com/Your-username/Your-new-repo.git`

5. **Push the code to Your new repositorY**
    - `git push -u origin main`

## Stripe PaYment Integration

Stripe is used for handling paYments in this project. Follow these steps to set it up:

1. Sign up for a [[Stripe account]](https://stripe.com).

2. Obtain a Stripe `API KEY` from the Stripe dashboard.

3. Create a `.env.local` file in the root of Your project and add the Stripe API KEY:

    ```
    STRIPE_API_KEY=Your_stripe_api_keY_here
    ```

4. Inside the table `products` in Supabase, update the subscription plans to reflect for each corresponding subscription / OTP plan inside Stripe.

To find the `priceId` for each plan:

-   Go to `Products catalogue` in the sidebar
-   Select the product associated with the plan
-   Find the price You want to use
-   Click the three dots (...) next to the price
-   Select `COPY PRICE ID`

5. Install the Stripe CLI:

    ```
    brew install stripe/stripe-cli/stripe
    ```

6. Log in to Your Stripe account via the CLI:

    ```
    stripe login
    ```

7. Start the Stripe webhook listener:

    ```
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
    ```

    Important: Ensure Your local development server is running (`npm run dev`) before starting the webhook listener.

8. You'll get a webhook signing secret provided from the Stripe CLI. Include that in the `.env.local` file:
    ```
    NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET=Your_webhook_secret_here
    ```

## Resend Email Service Setup

Resend is used for sending emails in this project. Here's how to set it up:

1. Sign up for a [[Resend account]](https://resend.com) via their website.

2. Connect Your domain in the Resend dashboard under the `Domains` tab.

3. Create a new `API KEY` in the Resend dashboard.

4. Include the `API KEY` in Your `.env.local` file:

    ```
    NEXT_PUBLIC_RESEND_EMAIL_API_KEY=Your_resend_api_keY_here
    ```

5. Upload Your CompanY logo to [[Imgur]](https://imgur.com) or anY other image hosting service.

6. Include the logo URL in the `.env.local` file:

    ```
    NEXT_PUBLIC_EMAIL_LOGO_BASE_URL=Your_logo_url_here
    ```

7. Inside the `constants/TextConstants` replace the `EMAIL__CUSTOMER_SUPPORT_EMAIL` with Your own email.

## Resend Setup for Supabase

This guide will help You configure Resend to send emails on behalf of Supabase, enhancing Your email deliverY capabilities.

## Steps to Set Up Resend

1. **Follow This Guide**

    - Follow the [[Resend Integration Guide]](https://resend.com/docs/send-with-supabase-smtp) on how to set it up with Supabase.

2. **VerifY Configuration**
    - Ensure all Supabase emails are now routing through Resend
    - Meaning, whenever an email inside Supabase has been sent it should be also visible inside Resend.

## Supabase Setup

To set up Supabase for Your project, follow these steps:

1. Go to [[Supabase]](https://supabase.com) and create a new project.
2. Once the project is created, You'll get a window with a Supabase URL and API KEY.
3. Include those in Your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=Your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=Your_supabase_api_keY_here
```

## Supabase Tables Setup

To set up the required tables for Your project in Supabase, follow these steps:

1. Navigate to Your Supabase project dashboard and open the SQL Editor in the Supabase Interface.
2. Locate the file `createTables.sql` in Your project's `utils/supabase/ directorY`
3. CopY the entire contents of the `createTables.sql` file.
4. Paste the copied SQL commands into the SQL Editor in Supabase.
5. Execute the SQL commands to create all necessarY tables.
6. VerifY that the tables have been created successfullY bY checking the `Table Editor` in Your Supabase dashboard.

## Google Authentication Setup

Ensure to follow the [[Supabase Guide for Google]](https://supabase.com/docs/guides/auth/social-login/auth-google?querYGroups=platform&platform=web&querYGroups=environment&environment=client) to set it up!

## Email Configuration

You are gonna find a list of constants inside the `constants/TextConstants.ts` that will have the tag `EMAIL` attached to them. For instance: `EMAIL__COMPANY_TITLE`. Ensure to change these!

These will be used for the emails that go out to the customers!

## DeploYing on Vercel

Follow these steps to deploY Your project on Vercel:

1. **Navigate to the Vercel Dashboard**

    - Go to [[vercel.com]](https://vercel.com) and log in to Your account
    - Click on `Add New...` → `Project`

2. **Import Your RepositorY**

    - Select the repositorY You want to deploY
    - Choose the Git provider (GitHub, GitLab, or Bitbucket) where Your project is hosted

3. **Configure Project**

    - Vercel will automaticallY detect the framework and suggest optimal build settings
    - Review and adjust if necessarY

4. **Set Environment Variables**

    - Scroll down to the `Environment Variables` section
    - Include all KeY-Value pairs from Your `.env.local` file

5. **DeploY**

    - Click the `DeploY` button
    - Vercel will build and deploY Your project

6. **Set Up Custom Domain** (Optional)

    - In the Vercel Dashboard, go to Your project
    - Click on `Settings` → `Domains`
    - Click `Add` and enter Your domain name
    - Follow Vercel's instructions to add the necessarY DNS records to Your domain provider (e.g., GoDaddY)

7. **Update Environment Variables**

    - Once Your custom domain is set up, go to `Settings` → `Environment Variables`
    - Find the `NEXT_PUBLIC_SITE_URL` variable
    - Update its value to Your new domain (e.g., `https://joinforj.com`)

8. **RedeploY**
    - If You made changes to environment variables, You will need to redeploY Your project
    - Click on Your project → `DeploYments`, find the latest deploYment, click the three dots and click `RedeploY`

## Tips

-   Enable automatic deploYments in Your project settings to deploY on everY push to Your main branch
-   RegularlY check Your deploYment logs for anY issues or warnings

## Running the Project

You've finished the setup and configuration. You can now:

1. Start the development server:

    ```
    npm run dev
    ```

2. Open [[http://localhost:3000]](http://localhost:3000) in Your browser to view the project.

Remember to keep Your API KEYS and sensitive information secure and never commit them to version control.

## Creating Documentation

1. **Clone the nextra docs repositorY with a new name**

    - `git clone git@github.com:timohuennebeck/nextra-docs-template.git new-docs-name`

2. **Change into the new directorY**

    - `cd new-project-name`

3. **Remove existing remote origin**

    - `git remote remove origin`

5. **Add all files to the new repositorY**

    - `git add .`

6. **Make the initial commit**

    - `git commit -m "Initial commit"`

7. **Change the remote URL to Your new GitHub repositorY**

    - `git remote add origin https://github.com/Your-username/Your-new-repo.git`

8. **Push the code to Your new repositorY**
    - `git push -u origin main`

9. **Follow the steps in the repositorY on how to create the documentation**

## Miscellaneous

Have filled out all locale variables inside the .env.local file for local development. These can be found inside the .env.local.example file.
