import { Outlet, useNavigate, useLocation } from "react-router";
import type { LayoutProps, TitleImageProps, NavBarProps, MessageBarText } from "./layoutTypes";
import "./layout.css";
import essentialsLogo from "../assets/essentials-favicon.png";

async function logoutUser(onLogoutSuccess: () => void) {

  try {
    const response = await fetch('/logout', {
       method: 'POST',
      });

    if (response.ok) {
      onLogoutSuccess();
    } else {
      throw new Error('There was an error logging out.');
    }

  } catch (error) {
    console.error('Logout failed:', error);

  }
}


const mockTitleObject: TitleImageProps = {
  image: "/src/assets/title-image.png",
};

const TitleImage = (_props: TitleImageProps) => {
  return (
    <>
      <header className="store-hero" aria-labelledby="store-headline">
        <div className="container store-hero__inner">
          <div className="store-hero__copy">
            <p className="store-hero__brand">essentials</p>
            <h1 id="store-headline" className="store-hero__headline">
              Everything you need.<br />
              Built to code.<br />
              <span>Built for you.</span>
            </h1>
          </div>
          <div className="store-hero__artwork">
            <img src={essentialsLogo} alt="Essentials logo" />
          </div>
        </div>
      </header>
    </>
  );
};


const Footer = () => {
  return (
    <>
      <div>
        <footer className="border-top mt-5 py-4 text-center text-muted">All rights reserved {new Date().getFullYear()}.</footer>
      </div>
    </>
  )
}


const NavBar = ({
  isAdmin,
  logoutLabel,
  onLogoutClick,
  allProductsClick,
  myCartClick,
  cartCount
}: NavBarProps) => {

    return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm">
      <div className="container">
        <div className="ms-auto d-flex gap-2">
          <ul className="navbar-nav justify-content-end flex-grow-1 gap-3 pe-3">
            <button type="button" className="btn btn-outline-light" onClick={allProductsClick}>
            All Products
            </button>

            <button type="button" className="btn btn-primary position-relative" onClick={myCartClick}>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{cartCount}</span>
              My Cart 
            </button>
            <li className="d-flex align-items-center gap-4">
              <button type="button" className="btn btn-danger" onClick={onLogoutClick}>
                {logoutLabel}
              </button>
              {isAdmin && (
                <span className="badge rounded-pill text-bg-warning px-3 py-2">Admin</span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const MessageBar = ({message}: MessageBarText) => {
  return (
    <div className="alert alert-primary mb-0">
      {message}
    </div>
    
  );
}


function LayoutComponents({ showMessage, cartCount, onLogoutSuccess, isAdmin }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <TitleImage
        image={mockTitleObject.image}
      />

      <NavBar
        isAdmin={isAdmin}
        logoutLabel="Logout"
        onLogoutClick={() => logoutUser(onLogoutSuccess)}
        allProductsClick={() => navigate("/")}
        myCartClick={() => navigate("/cart")}
        cartCount={cartCount}
      />


      <div className="container my-4 d-flex justify-content-center text-center" role="status" aria-live="polite">
        <div style={{ visibility: showMessage && location.pathname !== "/cart" ? "visible" : "hidden" }}>
          <MessageBar message="Added to cart!" />
        </div>
      </div>

      <Outlet />

      <Footer />
    </>
  );
}

export { LayoutComponents as Layout, mockTitleObject, TitleImage, Footer, NavBar, MessageBar, logoutUser };
