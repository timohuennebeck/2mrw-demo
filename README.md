# Forj Project Setup

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Stripe PaYment Integration](#stripe-payment-integration)
3. [Resend Email Service Setup](#resend-email-service-setup)
4. [Configuration](#configuration)

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


we'll also need to setup resend to send supabase emails on behalf of it
first, inside resend go to domains -> add an domain -> its best to use a subdomain. For instance, instead of using joinforj.com, use updates.joinforj.com
Heres a setup video: https://supabase.com/partners/integrations/resend
now all emails from supabase will be sent via resend

Insert Loom Link:



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

## Google Authentication Setup

https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=platform&platform=web&queryGroups=environment&environment=client

Loom:

## Configuration

Update the following values in Your project:

1. Inside the `api/webhooks/stripe/route.ts`, update:

    - `estimatedLaunchDate`
    - `companyName`
    - `customerSupportEmail`

## Running the Project

You've finished the setup and configuration. You can now:

1. Start the development server:

    ```
    npm run dev
    ```

2. Open [http://localhost:3000](http://localhost:3000) in Your browser to view the project.

Remember to keep Your API KEYS and sensitive information secure and never commit them to version control.