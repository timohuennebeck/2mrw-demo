CREATE TABLE
    users (
        id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid () REFERENCES auth.users (id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        first_name TEXT,
        stripe_customer_id TEXT,
        profile_image_url TEXT,
        position TEXT,
        bio TEXT,
        auth_method TEXT NOT NULL CHECK (
            auth_method IN ('password', 'magicLink', 'google')
        ),
        onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

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

CREATE TABLE
    free_trials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
        stripe_subscription_id TEXT NOT NULL,
        subscription_tier TEXT NOT NULL CHECK (
            subscription_tier IN ('FREE', 'ESSENTIALS', 'FOUNDERS')
        ),
        status TEXT NOT NULL CHECK (
            status IN ('ACTIVE', 'CONVERTED', 'CANCELLED', 'EXPIRED')
        ),
        start_date TIMESTAMPTZ NOT NULL,
        end_date TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );