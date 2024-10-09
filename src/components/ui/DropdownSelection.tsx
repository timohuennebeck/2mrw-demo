interface DropdownSelectionProps {
    dropDownItems: { name: string; onClick: () => void }[];
}

const DropdownSelection = ({ dropDownItems }: DropdownSelectionProps) => {
    return (
        <div className="absolute bottom-12 left-0 flex flex-col rounded-md border bg-white p-1 shadow-sm">
            {dropDownItems.map((i, index) => {
                return (
                    <button
                        key={index}
                        className="cursor-pointer whitespace-nowrap rounded px-2 py-1 text-start text-xs hover:bg-neutral-100 text-neutral-600"
                        onClick={i.onClick}
                    >
                        {i.name}
                    </button>
                );
            })}
        </div>
    );
};

export default DropdownSelection;
