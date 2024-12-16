CREATE TABLE
    user_subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
        stripe_subscription_id TEXT,
        stripe_price_id TEXT,
        status TEXT NOT NULL CHECK (
            status IN ('ACTIVE', 'TRIALING', 'CANCELLED', 'EXPIRED')
        ),
        subscription_tier TEXT NOT NULL CHECK (
            subscription_tier IN ('FREE', 'ESSENTIALS', 'FOUNDERS')
        ),
        billing_period TEXT CHECK (
            billing_period IN ('MONTHLY', 'YEARLY', 'LIFETIME')
        ),
        billing_plan TEXT CHECK (billing_plan IN ('RECURRING', 'ONE_TIME')),
        end_date TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );