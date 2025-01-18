import { PersonalInfoSection } from "./components/PersonalInfoSection";
import { ProfilePictureSection } from "./components/ProfilePictureSection";

const UserProfilePage = () => {
    return (
        <div className="flex max-w-6xl flex-col gap-12">
            <ProfilePictureSection />
            <PersonalInfoSection />
        </div>
    );
};

export default UserProfilePage;
