import Image from "next/image";

const TestimonialRating = () => {
    return (
        <div className="mb-16 flex items-center justify-center gap-4">
            <div className="flex">
                {[1, 2, 3, 4, 5].map((avatar) => (
                    <Image
                        key={avatar}
                        src="/avatar-circle.png"
                        alt="User avatar"
                        width={32}
                        height={32}
                        className="-ml-2 h-12 w-12 rounded-full border-2 border-white bg-gray-200 first:ml-0"
                    />
                ))}
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
                <span className="font-medium">569 founders sleep better</span>
            </div>
        </div>
    );
};

export default TestimonialRating;
