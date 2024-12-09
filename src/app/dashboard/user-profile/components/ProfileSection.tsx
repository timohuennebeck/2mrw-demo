interface ProfileSectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export const ProfileSection = ({ title, description, children }: ProfileSectionProps) => {
    return (
        <div className="flex flex-col gap-32 md:flex-row">
            <div className="md:w-2/5">
                <h2 className="text-sm font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="md:w-3/5 mr-20">{children}</div>
        </div>
    );
};
