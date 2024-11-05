import { FEATURES } from "@/config/featureConfig";
import { SubscriptionTier } from "@/enums/SubscriptionTier";

export class FeatureService {
    static getFeaturesWithAvailability(tier: SubscriptionTier) {
        return Object.values(FEATURES).map((feature) => ({
            id: feature.id,
            name: feature.name,
            description: feature.description,
            isAvailable: feature.enabled && feature.availableIn.includes(tier),
        }));
    }
}
