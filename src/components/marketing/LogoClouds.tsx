import Image from "next/image";

const LogoCloud = () => {
    return (
        <section className="py-16">
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                <Image
                    src="/logos/transistor.svg"
                    alt="Transistor"
                    width={158}
                    height={48}
                    className="h-8 w-auto"
                />
                <Image
                    src="/logos/reform.svg"
                    alt="Reform"
                    width={158}
                    height={48}
                    className="h-8 w-auto"
                />
                <Image
                    src="/logos/tuple.svg"
                    alt="Tuple"
                    width={158}
                    height={48}
                    className="h-8 w-auto"
                />
                <Image
                    src="/logos/savvycal.svg"
                    alt="SavvyCal"
                    width={158}
                    height={48}
                    className="h-8 w-auto"
                />
                <Image
                    src="/logos/statamic.svg"
                    alt="Statamic"
                    width={158}
                    height={48}
                    className="h-8 w-auto"
                />
            </div>
        </section>
    );
};

export default LogoCloud;
