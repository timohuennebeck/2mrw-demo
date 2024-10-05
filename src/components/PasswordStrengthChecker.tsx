import { TextConstants } from "@/constants/TextConstants";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const PasswordStrengthChecker = ({ password }: { password: string }) => {
    const isLongEnough = password.length >= 6;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);

    const passwordRequirements = [
        {
            condition: isLongEnough,
            text: TextConstants.TEXT__HAS_SIX_PLUS_CHARACTERS,
        },
        {
            condition: hasLowercase,
            text: TextConstants.TEXT__HAS_ONE_LOWER_CASE_LETTER,
        },
        {
            condition: hasUppercase,
            text: TextConstants.TEXT__HAS_ONE_UPPER_CASE_LETTER,
        },
        {
            condition: hasDigit,
            text: TextConstants.TEXT__HAS_ONE_DIGIT,
        },
    ];

    return (
        <div className="flex flex-col gap-2">
            {passwordRequirements.map((requirement, index) => (
                <div key={index} className="flex flex-row items-center gap-2">
                    <CheckCircleIcon
                        className={`w-4 ${requirement.condition ? "text-neutral-800" : "text-neutral-300"}`}
                    />
                    <p className="text-xs">{requirement.text}</p>
                </div>
            ))}
        </div>
    );
};

export default PasswordStrengthChecker;
