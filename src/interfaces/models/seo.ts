import { ChangeFrequency, SitemapPriority } from "@/config/seo.config";

export enum CardType {
    SUMMARY = "summary",
    SUMMARY_LARGE_IMAGE = "summary_large_image",
    APP = "app",
    PLAYER = "player",
}

interface OGImage {
    url: string;
    width: number;
    height: number;
    alt: string;
}

interface TwitterConfig {
    handle: string;
    site: string;
    cardType: CardType;
}

interface SEODefaults {
    title: string;
    template: string;
    description: string;
    keywords: string[];
    url: string;
    locale: string;
    ogImage: OGImage;
    twitter: TwitterConfig;
}

interface PublicRoute {
    path: string;
    changefreq: ChangeFrequency;
    priority: SitemapPriority;
}

export interface SEOConfig {
    default: SEODefaults;
    pages: {
        public: PublicRoute[];
        protected: string[];
    };
}
