"use client";

import { PlaceholderState } from "@/components/application/placeholder-state";
import { SmilePlus } from "lucide-react";

const DemoPage = () => {
    return (
        <PlaceholderState
            icon={SmilePlus}
            title="Custom Title"
            description="This is a custom placeholder state that can be edited"
            ctaLabel="CTA"
            onClick={() => {}}
        />
    );
};

export default DemoPage;
