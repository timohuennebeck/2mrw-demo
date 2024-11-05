CREATE TYPE SubscriptionStatusEnums AS ENUM ('ACTIVE', 'EXPIRED', 'NOT_PURCHASED', 'CANCELLED');

CREATE TYPE FreeTrialStatusEnums AS ENUM ('ACTIVE', 'EXPIRED', 'NOT_STARTED', 'CANCELLED');

CREATE TYPE SubscriptionTierEnums AS ENUM ('TIER_ZERO', 'TIER_ONE', 'TIER_TWO');

CREATE TYPE PricingModel AS ENUM ('SUBSCRIPTION', 'ONE_TIME');

CREATE TABLE
    users (
        id UUID PRIMARY KEY UNIQUE DEFAULT NOT NULL,
        stripe_customer_id TEXT,
        profile_image_url TEXT,
        email TEXT NOT NULL,
        first_name TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL
    );

CREATE TABLE
    products (
        id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid (),
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        pricing JSONB NOT NULL,
        is_highlighted BOOLEAN NOT NULL,
        is_active BOOLEAN NOT NULL,
        features JSONB NOT NULL,
        subscription_tier SubscriptionTierEnums NOT NULL,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL
    );

CREATE TABLE
    free_trials (
        id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid (),
        start_date TIMESTAMPTZ NOT NULL,
        end_date TIMESTAMPTZ NOT NULL,
        stripe_price_id TEXT NOT NULL,
        user_id UNIQUE UUID REFERENCES public.users (id) ON DELETE CASCADE NOT NULL,
        status FreeTrialStatusEnums NOT NULL
    );

CREATE TABLE
    purchased_subscriptions (
        id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid (),
        stripe_price_id TEXT NOT NULL,
        stripe_subscription_id TEXT,
        user_id UNIQUE UUID REFERENCES public.users (id) ON DELETE CASCADE NOT NULL,
        status SubscriptionStatusEnums NOT NULL,
        end_date TIMESTAMPTZ,
        subscription_tier SubscriptionTierEnums NOT NULL,
        pricing_model PricingModel NOT NULL,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL
    );