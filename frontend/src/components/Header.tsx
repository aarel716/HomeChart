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

                <nav className="d-flex gap-3 mt-2" aria-label="Main navigation">
                    <Link to="/" className="text-white">My Properties</Link>
                    <Link to="/contractors" className="text-white">Contractors</Link>
                </nav>
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