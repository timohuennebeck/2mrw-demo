interface SectionProps {
    children: React.ReactNode;
    className?: string;
}

const Section = ({ children, className = "" }: SectionProps) => {
    return <section className={`bg-red-200 ${className}`}>{children}</section>;
};

export default Section; 