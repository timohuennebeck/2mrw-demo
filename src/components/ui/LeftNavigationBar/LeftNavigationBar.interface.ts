export type NavigationItem =
    | {
          name: string;
          icon: React.ReactNode;
          link?: string;
          onClick?: () => void;
          isExternal?: never;
      }
    | {
          name: string;
          icon: React.ReactNode;
          link: string; // required when isExternal is true
          onClick?: () => void;
          isExternal: true;
      };

export interface NavigationItems {
    category: string;
    items: NavigationItem[];
}
