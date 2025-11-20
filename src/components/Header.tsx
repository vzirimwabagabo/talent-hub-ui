import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";


const Header = () => {
    const {isAuthenticated, logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });

  }


  return (

          <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    TalentHub
                  </span>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                  <Link to="/talent" className="text-muted-foreground hover:text-primary transition-colors">Talent</Link>
                  <Link to="/volunteer" className="text-muted-foreground hover:text-primary transition-colors">Volunteer</Link>
                  <Link to="/language" className="text-muted-foreground hover:text-primary transition-colors">Language</Link>
                  <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
                  <Link to="/opportunities" className="text-muted-foreground hover:text-primary transition-colors">Opportunities</Link>
                </div>
                {
                  !isAuthenticated ? (
                    <div className="flex items-center gap-4">
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="hero">Get Started</Button>
                  </Link>
                </div>
                  ): (
                    <div className="flex items-center gap-4">
                  <button className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLogout}>Logout</button>
                  
                </div>
                  )
                }
              </div>
            </div>
          </nav>
  )
}



export default Header