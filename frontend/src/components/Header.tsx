import { Link } from "react-router-dom";

interface HeaderProps {
    darkMode: boolean;
    onToggleTheme: () => void;
}

const Header = ({ darkMode, onToggleTheme }: HeaderProps) => {
    return (
        <header className="header">
            <div>
                <h1>HomeChart</h1>
                <p>Your home's maintenance history in one place.</p>

                <Link to="/" className="text-white">
                    Dashboard
                </Link>
            </div>

            <button
                type="button"
                className="theme-toggle"
                onClick={onToggleTheme}
                aria-label={
                    darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
            >
                {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
        </header>
    );
};

export default Header;