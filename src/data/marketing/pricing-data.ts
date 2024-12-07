export const defaultPricingPlans = {
    monthly: [
        {
            name: "Lorem",
            price: "$19",
            period: "/month",
            buttonVariant: "secondary",
            onClick: () =>
                window.open(
                    "https://buy.stripe.com/6oEcQjcpE6ZBanC9AA?prefilled_promo_code=LAUNCH30",
                    "_blank",
                ),
        },
        {
            name: "Ipsum",
            price: "$49",
            period: "/month",
            buttonVariant: "primary",
            onClick: () => {},
        },
        {
            name: "Dolor",
            price: "$99",
            period: "/month",
            buttonVariant: "secondary",
            onClick: () => {},
        },
    ],
    annual: [
        {
            name: "Lorem",
            price: "$190",
            period: "/year",
            buttonVariant: "secondary",
            onClick: () =>
                window.open(
                    "https://buy.stripe.com/annual-link",
                    "_blank",
                ),
        },
        {
            name: "Ipsum",
            price: "$490",
            period: "/year",
            buttonVariant: "primary",
            onClick: () => {},
        },
        {
            name: "Dolor",
            price: "$990",
            period: "/year",
            buttonVariant: "secondary",
            onClick: () => {},
        },
    ],
};

export const defaultPricingFeatures = [
    {
        category: "Lorem",
        items: [
            {
                name: "Lorem ipsum dolor sit amet",
                starter: true,
                growth: true,
                scale: true,
            },
            {
                name: "Consectetur adipiscing elit",
                starter: false,
                growth: true,
                scale: true,
            },
            {
                name: "Sed do eiusmod tempor",
                starter: false,
                growth: true,
                scale: true,
            },
            {
                name: "Ut labore et dolore",
                starter: false,
                growth: true,
                scale: true,
            },
            {
                name: "Magna aliqua ut enim",
                starter: false,
                growth: false,
                scale: true,
            },
        ],
    },
    {
        category: "Ipsum",
        items: [
            {
                name: "Minim veniam",
                starter: "10 GB",
                growth: "50 GB",
                scale: "500 GB",
            },
            {
                name: "Quis nostrud exercitation",
                starter: "100 GB",
                growth: "500 GB",
                scale: "Unlimited",
            },
            {
                name: "Ullamco laboris",
                starter: "1",
                growth: "5",
                scale: "Unlimited",
            },
        ],
    },
];
