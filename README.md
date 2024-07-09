## Setting Up Stripe

- paste in the stripe api key inside the .env file under "STRIPE_API_KEY"

- run brew install "stripe/stripe-cli/stripe" if you haven't installed the stripe-cli 
- then, run "stripe login" inside the terminal to log in to stripe
$ stripe listen --forward-to localhost:3000/api/webhooks/stripe
- you'll receive a webhook key - paste that key inside the .env file under "STRIPE_WEBHOOK_SECRET"

