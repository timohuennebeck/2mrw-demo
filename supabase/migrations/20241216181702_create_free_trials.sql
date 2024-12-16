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