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

4. Install the Stripe CLI:

    ```
    brew install stripe/stripe-cli/stripe
    ```

5. Log in to Your Stripe account via the CLI:

    ```
    stripe login
    ```

6. Start the Stripe webhook listener:

    ```
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
    ```

    Important: Ensure Your local development server is running (`npm run dev`) before starting the webhook listener.

7. You'll get a webhook signing secret provided from the Stripe CLI. Include that in the `.env.local` file:
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
