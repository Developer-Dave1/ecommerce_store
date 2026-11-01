type LayoutProps = {
  isAdmin: boolean;
  onLogoutSuccess: () => void;
  showMessage: boolean;
  cartCount: number;
};

interface TitleImageProps {
  image: string;
}

interface NavBarProps {
  isAdmin: boolean;
  logoutLabel: string;
  onLogoutClick: () => void;
  allProductsClick: () => void;
  myCartClick: () => void;
  cartCount: number;
}

interface MessageBarText {
  message: string;
}

export type { LayoutProps, TitleImageProps, NavBarProps, MessageBarText };
