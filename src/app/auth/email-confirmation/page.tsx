"use client";

import ConfirmationPage from "@/components/application/ConfirmationPage";
import { TextConstants } from "@/constants/TextConstants";

const EmailConfirmedPage = () => {
    return (
        <ConfirmationPage
            title="Email Confirmed!"
            description={`Your email has been confirmed. You can now continue using ${TextConstants.TEXT__COMPANY_TITLE}.`}
            redirectPath="/choose-pricing-plan"
            buttonText="Continue"
        />
    );
};

export default EmailConfirmedPage;
