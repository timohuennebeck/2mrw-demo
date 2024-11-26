interface SectionProps {
    children: React.ReactNode;
    id?: string;
    className?: string;
}

const Section = ({ children, className = "", id }: SectionProps) => {
    return (
        <section id={id} className={className}>
            {children}
        </section>
    );
};

export default Section;
