-- insert the commands below into the SQL Editor in Supabase to create the corresponding tables

CREATE TABLE free_trials (
    id INT8 PRIMARY KEY,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE,
    is_active BOOLEAN
);

CREATE TABLE subscriptions (
    id INT8 PRIMARY KEY,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    stripe_price_id TEXT,
    subscription_plan TEXT,
    has_premium BOOLEAN,
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE
);

CREATE TABLE users {
    id INT8 PRIMARY KEY,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    email TEXT,
    full_name TEXT,
    user_id TEXT,
}