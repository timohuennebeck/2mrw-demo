CREATE TYPE SubscriptionStatusEnums AS ENUM ('ACTIVE', 'EXPIRED', 'NOT_PURCHASED');
CREATE TYPE FreeTrialStatusEnums AS ENUM ('ACTIVE', 'EXPIRED', 'NOT_STARTED');
CREATE TYPE SubscriptionTierEnums AS ENUM ('TIER_ZERO', 'TIER_ONE', 'TIER_TWO');

CREATE TABLE free_trials (
    id INT8 PRIMARY KEY,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    stripe_price_id TEXT REFERENCES public.products(stripe_price_id) ON DELETE CASCADE,
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE,
    status SubscriptionTierEnums
);

CREATE TABLE products (
    id INT8 PRIMARY KEY,
    name TEXT,
    description TEXT,
    stripe_purchase_link TEXT,
    previous_price FLOAT8,
    current_price FLOAT8,
    stripe_price_id TEXT,
    is_highlighted BOOLEAN,
    is_active BOOLEAN,
    features JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    subscription_tier SubscriptionTierEnums
);

CREATE TABLE purchased_subscriptions (
    id INT8 PRIMARY KEY,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    stripe_price_id TEXT REFERENCES public.products(stripe_price_id) ON DELETE CASCADE,
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE,
    status SubscriptionStatusEnums
    subscription_tier SubscriptionTierEnums
);

CREATE TABLE users {
    id INT8 PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    user_id TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
}