interface VideoProps {
    src: string;
    aspectRatio?: "16:9" | "4:3" | "1:1";
    className?: string;
}

const aspectRatioClasses = {
    "16:9": "pb-[56.25%]",
    "4:3": "pb-[75%]",
    "1:1": "pb-[100%]",
};

const CustomVideo = ({ src, aspectRatio = "16:9", className }: VideoProps) => {
    return (
        <div className="relative w-full">
            <div className={aspectRatioClasses[aspectRatio]}>
                <video
                    src={src}
                    className={`absolute inset-0 h-full w-full rounded-lg object-cover shadow-2xl ${className ?? ""}`}
                    autoPlay
                    muted
                    loop
                    playsInline // better mobile support
                />
            </div>
        </div>
    );
};

export default CustomVideo;
