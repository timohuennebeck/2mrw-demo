CREATE TYPE SubscriptionStatusEnums AS ENUM ('ACTIVE', 'EXPIRED', 'NOT_PURCHASED');
CREATE TYPE FreeTrialStatusEnums AS ENUM ('ACTIVE', 'EXPIRED', 'NOT_STARTED');
CREATE TYPE SubscriptionTierEnums AS ENUM ('TIER_ZERO', 'TIER_ONE', 'TIER_TWO');

CREATE TABLE users (
    id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid(),
    email TEXT,
    full_name TEXT,
    user_id UUID UNIQUE,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

CREATE TABLE products (
    id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid(),
    name TEXT,
    description TEXT,
    previous_price FLOAT8,
    current_price FLOAT8,
    stripe_price_id TEXT UNIQUE,
    is_highlighted BOOLEAN,
    is_active BOOLEAN,
    features JSONB,
    subscription_tier SubscriptionTierEnums,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

CREATE TABLE free_trials (
    id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid(),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    stripe_price_id TEXT REFERENCES public.products(stripe_price_id) ON DELETE CASCADE,
    user_id UNIQUE UUID REFERENCES public.users(user_id) ON DELETE CASCADE,
    status FreeTrialStatusEnums
);

CREATE TABLE purchased_subscriptions (
    id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid(),
    stripe_price_id TEXT REFERENCES public.products(stripe_price_id) ON DELETE CASCADE,
    user_id UNIQUE UUID REFERENCES public.users(user_id) ON DELETE CASCADE,
    status SubscriptionStatusEnums,
    subscription_tier SubscriptionTierEnums,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);