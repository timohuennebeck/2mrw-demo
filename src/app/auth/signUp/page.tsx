import FormDivider from "@/components/FormDivider";
import FormHeader from "@/components/FormHeader";
import GoogleSignUpButton from "@/components/GoogleSignUpButton";
import InputField from "@/components/InputField";
import FormButton from "@/components/FormButton";
import RememberMeCheckbox from "@/components/RememberMeCheckbox";
import SignUpLink from "@/components/SignUpLink";
import { signUp } from "./action";

const Logo = () => {
    return (
        <div className="flex justify-center mb-6">
            <svg className="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                    fill="#4285F4"
                />
            </svg>
        </div>
    );
};

const LoginForm = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full">
                <Logo />
                <FormHeader
                    title="Sign Up"
                    subtitle="Sign up using email or another service to continue with Forj (it's free)!"
                />

                <form>
                    <InputField label="First Name" id="firstName" name="firstName" type="text" />
                    <InputField label="Email" id="email" name="email" type="email" />
                    <InputField label="Password" id="password" name="password" type="password" />
                    <InputField label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" />

                    <div className="flex items-center justify-between mb-6">
                        <RememberMeCheckbox />
                    </div>

                    <FormButton title="Sign Up" onPress={signUp} />
                </form>

                <div className="mt-6">
                    <SignUpLink title="Have an account?" buttonText="Sign In" link="/auth/signIn" />
                    <FormDivider />
                    <GoogleSignUpButton />
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
