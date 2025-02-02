import { PersonalInfoSection } from "./components/personal-info-section";
import { ProfilePictureSection } from "./components/profile-picture-section";

const UserProfilePage = () => {
    return (
        <div className="flex max-w-6xl flex-col gap-12">
            <ProfilePictureSection />
            <PersonalInfoSection />
        </div>
    );
};

export default UserProfilePage;
