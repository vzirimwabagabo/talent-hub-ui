import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Header from "@/components/Header";

//import { Header } from "@radix-ui/react-accordion"; 

const About = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <Header/>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">About Us</CardTitle>
          <CardDescription>Our mission is to connect talent with opportunities.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            We are a passionate team dedicated to building a platform that empowers individuals and organizations to thrive. Our mission is to bridge the gap between talent and opportunity, fostering a vibrant community where skills and aspirations can meet.
          </p>
          <p className="text-lg">
            Whether you are a talented individual seeking to showcase your abilities or an organization looking for the perfect candidate, our platform provides the tools and resources to help you succeed. We believe in the power of connection and are committed to creating a positive and impactful experience for all our users.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
