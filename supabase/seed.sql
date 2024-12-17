-- create test users in auth.users
INSERT INTO
    auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at
    )
VALUES
    (
        '00000000-0000-0000-0000-000000000000',
        'active.trial@test.com',
        crypt ('password123', gen_salt ('bf')),
        now () - interval '30 days',
        now () - interval '30 days',
        now () - interval '30 days'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'expired.trial@test.com',
        crypt ('password123', gen_salt ('bf')),
        now () - interval '30 days',
        now () - interval '30 days',
        now () - interval '30 days'
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'no.trial@test.com',
        crypt ('password123', gen_salt ('bf')),
        now () - interval '30 days',
        now () - interval '30 days',
        now () - interval '30 days'
    );

-- create corresponding users in public.users
INSERT INTO
    public.users (
        id,
        email,
        first_name,
        auth_method,
        onboarding_completed
    )
VALUES
    (
        '00000000-0000-0000-0000-000000000000',
        'active.trial@test.com',
        'Active Trial User',
        'password',
        true
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'expired.trial@test.com',
        'Expired Trial User',
        'password',
        true
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'no.trial@test.com',
        'No Trial User',
        'password',
        true
    );

-- create user subscriptions
INSERT INTO
    public.user_subscriptions (
        user_id,
        status,
        subscription_tier,
        stripe_price_id,
        billing_plan,
        billing_period,
        stripe_subscription_id,
        end_date
    )
VALUES
    -- active trial user on Essentials plan
    (
        '00000000-0000-0000-0000-000000000000',
        'TRIALING',
        'ESSENTIALS',
        'price_essentials_monthly',
        'RECURRING',
        'MONTHLY',
        'sub_active_trial',
        now () + interval '7 days'
    ),
    -- expired trial and expired subscription user on Founders plan
    (
        '22222222-2222-2222-2222-222222222222',
        'ACTIVE',
        'FOUNDERS',
        'price_founders_monthly',
        'RECURRING',
        'MONTHLY',
        'sub_expired_trial',
        now () - interval '1 day' -- subscription expired yesterday
    ),
    -- user with no trial on Free plan
    (
        '44444444-4444-4444-4444-444444444444',
        'ACTIVE',
        'FREE',
        'price_free',
        null,
        null,
        null,
        null
    );

-- create free trials
INSERT INTO
    public.free_trials (
        user_id,
        stripe_subscription_id,
        subscription_tier,
        status,
        start_date,
        end_date
    )
VALUES
    -- active trial (ends in 7 days)
    (
        '00000000-0000-0000-0000-000000000000',
        'sub_active_trial',
        'ESSENTIALS',
        'ACTIVE',
        now (),
        now () + interval '7 days'
    ),
    -- expired trial (ended yesterday)
    (
        '22222222-2222-2222-2222-222222222222',
        'sub_expired_trial',
        'FOUNDERS',
        'ACTIVE',
        now () - interval '14 days',
        now () - interval '1 day'
    );