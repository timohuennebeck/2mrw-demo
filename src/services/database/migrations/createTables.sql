CREATE TYPE SubscriptionStatusEnums AS ENUM ('ACTIVE', 'TRIALING', 'CANCELLED', 'EXPIRED');

CREATE TYPE SubscriptionTierEnums AS ENUM ('FREE', 'ESSENTIALS', 'FOUNDERS');

CREATE TYPE BillingPlanEnums AS ENUM ('RECURRING', 'ONE_TIME');

CREATE TYPE BillingPeriodEnums AS ENUM ('MONTHLY', 'YEARLY', 'LIFETIME');

CREATE TABLE
    users (
        id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid (),
        stripe_customer_id TEXT,
        email TEXT NOT NULL,
        first_name TEXT,
        profile_image_url TEXT,
        created_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ
    );

CREATE TABLE
    user_subscriptions (
        id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
        stripe_price_id TEXT REFERENCES public.stripe_prices (stripe_price_id) ON DELETE CASCADE NOT NULL,
        stripe_subscription_id TEXT,
        status SubscriptionStatusEnums NOT NULL,
        subscription_tier SubscriptionTierEnums NOT NULL,
        billing_plan BillingPlanEnums NOT NULL,
        billing_period BillingPeriodEnums NOT NULL,
        end_date TIMESTAMPTZ,
        created_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ
    );