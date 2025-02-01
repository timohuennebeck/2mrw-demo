interface VideoProps {
    src: string; // YouTube video URL or ID
    aspectRatio?: "16:9" | "4:3" | "1:1";
}

const aspectRatioClasses = {
    "16:9": "pb-[56.25%]", // 16:9 aspect ratio
    "4:3": "pb-[75%]", // 4:3 aspect ratio
    "1:1": "pb-[100%]", // 1:1 aspect ratio
};

const YouTubeVideo = ({ src, aspectRatio = "16:9" }: VideoProps) => {
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/; // extract the YouTube video ID from the URL
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeId(src);

    if (!videoId) {
        console.error("Invalid YouTube URL");
        return null;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div className="relative w-full">
            <div className={aspectRatioClasses[aspectRatio]}>
                <iframe
                    src={embedUrl}
                    className="absolute inset-0 h-full w-full rounded-lg shadow-2xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video player"
                />
            </div>
        </div>
    );
};

export default YouTubeVideo;
