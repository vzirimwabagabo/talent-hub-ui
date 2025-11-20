import { Puzzle } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="inline-flex items-center gap-2">
      <Puzzle className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
        TalentHub
      </span>
    </Link>
  );
};

export default Logo;
