interface HeaderWithDescription {
    title: string;
    description: string;
    isPageHeader?: boolean;
}

const HeaderWithDescription = ({
    title,
    description,
    isPageHeader = false,
}: HeaderWithDescription) => {
    return (
        <div className={`${isPageHeader ? "mb-12" : "mb-4"}`}>
            <h3 className={`mb-2 ${isPageHeader ? "text-2xl" : "text-lg"} font-medium`}>{title}</h3>
            <p className="mb-4 text-sm text-gray-500">{description}</p>
        </div>
    );
};

export default HeaderWithDescription;
