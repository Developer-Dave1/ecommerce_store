interface LoginPageProps {
  onLoginSuccess: (username: string, isAdmin: boolean) => void;
}

interface isAuthenticatedProps {
  setIsAuthenticated: boolean
}

export { LoginPageProps, isAuthenticatedProps };
