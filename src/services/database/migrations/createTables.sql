CREATE TYPE SubscriptionStatusEnums AS ENUM ('ACTIVE', 'TRIALING', 'CANCELLED', 'EXPIRED');

CREATE TYPE SubscriptionTierEnums AS ENUM ('FREE', 'ESSENTIALS', 'FOUNDERS');

CREATE TYPE BillingPlan AS ENUM ('NONE', 'ONE_TIME', 'RECURRING');

CREATE TYPE SubscriptionInterval AS ENUM ('NONE', 'MONTHLY', 'YEARLY');

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
    products (
        id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid (),
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        is_highlighted BOOLEAN NOT NULL,
        is_active BOOLEAN NOT NULL,
        subscription_tier SubscriptionTierEnums NOT NULL,
        billing_plan BillingPlan NOT NULL,
        created_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ
    );

CREATE TABLE
    user_subscriptions (
        id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid (),
        user_id UNIQUE UUID REFERENCES public.users (id) ON DELETE CASCADE NOT NULL,
        stripe_price_id TEXT REFERENCES public.stripe_prices (stripe_price_id) ON DELETE CASCADE NOT NULL,
        stripe_subscription_id TEXT,
        status SubscriptionStatusEnums NOT NULL,
        subscription_tier SubscriptionTierEnums NOT NULL,
        end_date TIMESTAMPTZ,
        billing_plan BillingPlan NOT NULL,
        created_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ
    );

CREATE TABLE
    stripe_prices (
        id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid (),
        product_id UUID REFERENCES public.products (id) ON DELETE CASCADE NOT NULL,
        subscription_interval SubscriptionInterval NOT NULL,
        stripe_price_id TEXT NOT NULL,
        current_amount NUMERIC NOT NULL,
        previous_amount NUMERIC,
        is_active BOOLEAN NOT NULL,
        billing_plan BillingPlan NOT NULL,
        created_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ
    );