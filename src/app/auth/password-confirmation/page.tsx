"use client";

import ConfirmationPage from "@/components/application/ConfirmationPage";
import { TextConstants } from "@/constants/TextConstants";

const PasswordUpdatedPage = () => {
    return (
        <ConfirmationPage
            title="Password Updated!"
            description={`Your password has been updated. You can now continue using ${TextConstants.TEXT__COMPANY_TITLE}.`}
            redirectPath="/dashboard"
            buttonText="Continue to Dashboard"
        />
    );
};

export default PasswordUpdatedPage;
