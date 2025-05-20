import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, MapPin, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CountUpNumber } from '../components/countUpNumber';

import Lottie from 'lottie-react';
import robotAnimation from '../assets/robot-construction.json';
import communityAnimation from '../assets/community-animation.json'; // Use your desired Lottie file

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Robot Animation */}
      <div className="relative flex justify-center items-center py-8 px-4 bg-white">
        <div className="absolute inset-0 rounded-full bg-blue-200 blur-3xl opacity-20 animate-pulse" />
        <Lottie
          animationData={robotAnimation}
          loop
          className="w-60 h-60 relative z-10"
        />
      </div>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 flex items-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-urban-primary/20 to-urban-secondary/20" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487958449943-2429e8be8625')] bg-cover bg-center opacity-10 dark:opacity-5" />
          </div>

          <div className="container relative z-10 mx-auto flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-handwritten">
              <span className="block">Make Your City Better with</span>
              <span className="block mt-2 text-urban-primary dark:text-urban-light">Urban Fix</span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              Report public issues like potholes, broken streetlights, waste problems, and leaks easily.
              Help your community become safer and cleaner.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button asChild variant="outline" className="flex-1 h-12 text-base" size="lg">
                <Link to="/report">
                  Report an Issue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="flex-1 h-12 text-base" size="lg">
                <Link to="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 px-6 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Urban Fix connects citizens directly with local authorities to quickly resolve issues
                in your neighborhood. Report, track, and see problems get fixed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Camera className="h-10 w-10 text-urban-primary" />}
                title="Report Issues"
                description="Take a photo, choose a category, and provide your location. Reporting only takes seconds."
              />

              <FeatureCard
                icon={<MapPin className="h-10 w-10 text-urban-primary" />}
                title="Accurate Location"
                description="Our app automatically detects your location or lets you place a pin on the map for precise reporting."
              />

              <FeatureCard
                icon={<CheckCircle className="h-10 w-10 text-urban-primary" />}
                title="Status Updates"
                description="Get real-time notifications as your report progresses from pending to fixed."
              />
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 md:py-24 px-6 border-y border-border/60">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard value={<CountUpNumber target={15000} suffix="+" />} label="Issues Reported" />
              <StatCard value={<CountUpNumber target={85} suffix="%" />} label="Resolution Rate" />
              <StatCard value={<CountUpNumber target={48} suffix="hrs" />} label="Average Response Time" />
              <StatCard value={<CountUpNumber target={10000} suffix="+" />} label="Active Users" />
            </div>
          </div>
      </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-6">
          <div className="container mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-muted/30 p-8 md:p-12">
              
              {/* ✅ Lottie animation in the top-right */}
              <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 md:h-64 md:w-64 z-10">
                <Lottie animationData={communityAnimation} loop className="h-full w-full" />
              </div>

              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold">Join the Community</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Be part of the solution.
                  <br />
                  Join thousands of active citizens
                  <br />
                  who are making their neighborhoods better places to live.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg">
                    <Link to="/report">
                      Report Your First Issue
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="lg">
                    <Link to="/dashboard">
                      Explore the Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Helper Components
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-none shadow-sm bg-card/80">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 p-3 rounded-full bg-muted/60">
            {icon}
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  value: React.ReactNode; // allow JSX (for CountUpNumber)
  label: string;
  className?: string;
}

function StatCard({ value, label, className = "" }: StatCardProps) {
  return (
    <div className={`text-center p-6 ${className}`}>
      <div className="text-4xl font-bold text-urban-primary shining">{value}</div>
      <div className="mt-2 text-muted-foreground">{label}</div>
    </div>
  );
}

export default Index;