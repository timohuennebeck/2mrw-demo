CREATE TABLE
    users (
        id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid (),
        email TEXT NOT NULL,
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