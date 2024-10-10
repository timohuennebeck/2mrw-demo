import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CircleUserRound } from "lucide-react";

interface DropdownSelectionProps {
    dropDownItems: { name: string; onClick: () => void }[];
}

const DropdownSelection = ({ dropDownItems }: DropdownSelectionProps) => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-neutral-500 outline-none hover:bg-neutral-100">
                <CircleUserRound size={20} strokeWidth={1.5} />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className="mb-2 ml-2 flex flex-col rounded-md border bg-white p-1 shadow-sm">
                    {dropDownItems.map((i, index) => (
                        <DropdownMenu.Item
                            key={index}
                            className="cursor-pointer whitespace-nowrap rounded px-2 py-1 text-start text-xs text-neutral-600 outline-none hover:bg-neutral-100"
                            onClick={i.onClick}
                        >
                            {i.name}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

export default DropdownSelection;
