interface TestimonialBackgroundProps {
    children: any;
}

const TestimonialBackground = ({ children }: TestimonialBackgroundProps) => {
    return (
        <div className="flex h-screen gap-8 p-8">
            {children}

            <div className="hidden w-1/2 flex-col justify-between bg-white py-8 lg:flex">
                <span className="text-xl font-semibold text-black">⌘ Microsoft Inc.</span>

                <div className="flex flex-col gap-2">
                    <p className="text-black">
                        “This lib has saved me countless hours of work and helped me deliver
                        stunning designs to our clients faster than ever before.”
                    </p>
                    <p className="text-sm font-medium text-black">Timo Hünnebeck</p>
                </div>
            </div>
        </div>
    );
};

export default TestimonialBackground;
