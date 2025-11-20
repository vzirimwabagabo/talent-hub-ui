import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card,  CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Briefcase, Heart, Users, TrendingUp, Shield, Rocket } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

import Header from "@/components/Header";

const Index = () => {



  return (
    <div className="min-h-screen bg-background">

      <Header />


      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Connect Talent with{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Opportunity
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join TalentHub - where exceptional talent meets meaningful opportunities. 
                Whether you're seeking your next career move or looking to hire top talent, 
                we've got you covered.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="text-base">
                    Join as Talent
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="text-base">
                    Post Opportunities
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Professional networking and collaboration"
                className="rounded-2xl shadow-large w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose TalentHub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed to connect talent with opportunities and support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-medium hover:shadow-large transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>For Talent</CardTitle>
                <CardDescription>
                  Showcase your skills, build your professional profile, and discover opportunities 
                  that match your expertise and aspirations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-medium hover:shadow-large transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>For Employers</CardTitle>
                <CardDescription>
                  Access a curated pool of talented professionals, post job opportunities, 
                  and find the perfect match for your team.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-medium hover:shadow-large transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>For Donors</CardTitle>
                <CardDescription>
                  Support talent development and opportunity creation through meaningful 
                  contributions to the platform.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-medium hover:shadow-large transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Smart Matching</CardTitle>
                <CardDescription>
                  Our intelligent system connects talent with opportunities based on skills, 
                  experience, and preferences.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-medium hover:shadow-large transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Secure & Trusted</CardTitle>
                <CardDescription>
                  Your data and privacy are our top priority. All interactions are secure 
                  and confidential.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-medium hover:shadow-large transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Grow Together</CardTitle>
                <CardDescription>
                  Join a community committed to professional growth, collaboration, 
                  and mutual success.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Transform Your Career Journey?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of professionals who are already connected on TalentHub
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link to="/register">
                <Button size="lg" className="text-base">
                  Create Your Profile
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button variant="outline" size="lg" className="text-base">
                  Browse Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">TalentHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting talent with opportunity, one profile at a time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Talent</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/register" className="hover:text-primary transition-colors">Create Profile</Link></li>
                <li><Link to="/opportunities" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/register" className="hover:text-primary transition-colors">Post Jobs</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-colors">Find Talent</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Employer Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 TalentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
