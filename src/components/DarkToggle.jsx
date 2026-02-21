import { Moon, Sun } from "lucide-react";
import useDarkMode from "../hooks/useDarkMode";

export default function DarkToggle() {
  const [dark, setDark] = useDarkMode();

  return (
    <button onClick={() => setDark(!dark)} className="mr-4">
      {dark ? <Sun /> : <Moon />}
    </button>
  );
}
