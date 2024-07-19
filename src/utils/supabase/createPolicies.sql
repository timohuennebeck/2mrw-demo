CREATE POLICY "Enable read access for authenticated users"
ON public.free_trials
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable update access for authenticated users"
ON public.free_trials
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Enable write access for authenticated users"
ON public.free_trials
FOR INSERT
TO authenticated
USING (true);


CREATE POLICY "Enable read access for authenticated users"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable update access for authenticated users"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Enable write access for authenticated users"
ON public.subscriptions
FOR INSERT
TO authenticated
USING (true);


CREATE POLICY "Enable read access for authenticated users"
ON public.users
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable update access for authenticated users"
ON public.users
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Enable write access for authenticated users"
ON public.users
FOR INSERT
TO authenticated
USING (true);