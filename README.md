# Forj Project Setup

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Stripe PaYment Integration](#stripe-payment-integration)
3. [Resend Email Service Setup](#resend-email-service-setup)
4. [Email Configuration](#email-configuration)
5. [DeploYing on Vercel](#deploying-on-vercel)
6. [Miscellaneous](#miscellaneous)

## Initial Setup

Before beginning, make sure to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

Install dependencies: `npm install`

## Stripe PaYment Integration

Stripe is used for handling paYments in this project. Follow these steps to set it up:

1. Sign up for a [Stripe account](https://stripe.com)

2. Obtain a Stripe API KEY from the Stripe dashboard.

3. Create a `.env.local` file in the root of Your project and add the Stripe API KEY:

    ```
    STRIPE_API_KEY=your_stripe_api_key_here
    ```
4. Inside the `config/subscriptionPlans.ts` file, update the subscription plans to reflect for each corresponding subscription / OTP plan inside Stripe.

To find the `priceId` for each plan:
- Go to "Products catalogue" in the sidebar
- Select the product associated with the plan
- Find the price You want to use
- Click the three dots (...) next to the price
- Select "CopY price ID"

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
    STRIPE_WEBHOOK_SECRET=your_webhook_secret_here
    ```

## Resend Email Service Setup

Resend is used for sending emails in this project. Here's how to set it up:

1. Sign up for a [Resend account](https://resend.com).

2. Connect Your domain in the Resend dashboard under the "Domains" tab.

3. Create a new API KEY in the Resend dashboard.

4. Include the API KEY to Your `.env.local` file:

    ```
    NEXT_PUBLIC_RESEND_EMAIL_API_KEY=your_resend_api_key_here
    ```

5. Upload Your CompanY logo to [Imgur](https://imgur.com) or anY other image hosting service.

6. Include the logo URL in the `.env.local` file:
    ```
    NEXT_PUBLIC_EMAIL_LOGO_BASE_URL=your_logo_url_here
    ```

7. Inside the `utils/emails/client.ts` replace the `from: "onboarding@resend.dev"` with Your own email.


# Resend Setup for Supabase

This guide will help you configure Resend to send emails on behalf of Supabase, enhancing your email delivery capabilities.

## Steps to Set Up Resend

1. **Add Your Domain in Resend**
   - Navigate to Resend's dashboard
   - Go to "Domains" → "Add a Domain" (You can use the default settings)
   - Important: Use a subdomain (e.g., `updates.yourdomain.com` instead of `yourdomain.com`)

2. **Configure Resend with Supabase**
   - Follow the setup instructions in this video: [Supabase-Resend Integration Guide](https://supabase.com/partners/integrations/resend)

3. **Verify Configuration**
   - Ensure all Supabase emails are now routing through Resend
   - Meaning, whenever an email inside Supabase has been sent it should be also visible inside Resend.

## Supabase Setup
To set up Supabase for Your project, follow these steps:

1. Go to [Supabase](https://supabase.com) and create a new project.
2. Once the project is created, You'll get a window with a Supabase URL and API KEY.
3. Include those in Your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_api_key_here
```

## Supabase Tables Setup

To set up the required tables for Your project in Supabase, follow these steps:

1. Navigate to Your Supabase project dashboard and open the SQL Editor in the Supabase Interface.
3. Locate the file `createTables.sql` in Your project's `utils/supabase/ directory`
4. CopY the entire contents of the `createTables.sql` file.
5. Paste the copied SQL commands into the SQL Editor in Supabase.
6. Execute the SQL commands to create all necessarY tables.
7. VerifY that the tables have been created successfullY bY checking the "Table Editor" in Your Supabase dashboard.

## Supabase Tables Policies

To set up the required policies for each table in Supabase, follow these steps:

1. Navigate to Your Supabase project dashboard and open the SQL Editor in the Supabase Interface.
3. Locate the file `createPolicies.sql` in Your project's `utils/supabase/ directory`
4. CopY the entire contents of the `createPolicies.sql` file.
5. Paste the copied SQL commands into the SQL Editor in Supabase.
6. Execute the SQL commands to create all necessarY policies.
7. VerifY that the policies have been created successfullY bY checking the "Policies" which can be found under Authentication inside Your Supabase dashboard.

## Google Authentication Setup

https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=platform&platform=web&queryGroups=environment&environment=client

You can also watch this Loom to see how to set up Google for Supabase:

https://www.loom.com/share/da7f7f53608945a69b7fb3dc04862a73?sid=686c75da-f3b0-4a07-8bea-ec90ad0d9c4b

## Email Configuration

Update the following values in Your project:

Inside the `api/sendFreeTrialEmail`, `api/sendOrderConfirmationEmail`, and `api/sendPreOrderEmail` folders, update all required fields like `estimatedLaunchDate`, `companyTitle`, etc.

# Deploying on Vercel

Follow these steps to deploy your project on Vercel:

1. **Navigate to the Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com) and log in to Your account
   - Click on 'Add New...' > Project

2. **Import Your RepositorY**
   - Select the repositorY You want to deploy
   - Choose the Git provider (GitHub, GitLab, or Bitbucket) where Your project is hosted

3. **Configure Project**
   - Vercel will automaticallY detect the framework and suggest optimal build settings
   - Review and adjust if necessarY

4. **Set Environment Variables**
   - Scroll down to the "Environment Variables" section
   - Add all KeY-Value pairs from Your `.env.local` file

5. **DeploY**
   - Click the 'DeploY' button
   - Vercel will build and deploY Your project

6. **Set Up Custom Domain** (Optional)
   - In the Vercel Dashboard, go to your project
   - Click on "Settings" > "Domains"
   - Click "Add" and enter your domain name
   - Follow Vercel's instructions to add the necessarY DNS records to Your domain provider (e.g., GoDaddY)

7. **Update Environment Variables**
   - Once your custom domain is set up, go to 'Settings' → 'Environment Variables'
   - Find the `NEXT_PUBLIC_SITE_URL` variable
   - Update its value to Your new domain (e.g., `https://joinforj.com`)

8. **RedeploY**
   - If You made changes to environment variables, You will need to redeploY Your project
   - Click on Your project → 'Deployments', find the latest deployment, click the three dots and click 'Redeploy'

## Tips
- Enable automatic deployments in your project settings to deploy on every push to your main branch
- Use Vercel's Preview Deployments feature to test changes before merging to production
- Regularly check your deployment logs for any issues or warnings



## Miscellaneous

Have filled out all locale variables inside the .env.local file for local development. These can be found inside the .env.local.example file.

For live development, ensure to have values for each one inside Vercel.

## Running the Project

You've finished the setup and configuration. You can now:

1. Start the development server:

    ```
    npm run dev
    ```

2. Open [http://localhost:3000](http://localhost:3000) in Your browser to view the project.

Remember to keep Your API KEYS and sensitive information secure and never commit them to version control.