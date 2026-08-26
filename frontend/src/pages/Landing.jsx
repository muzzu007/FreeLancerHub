import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  Briefcase, 
  Users, 
  MessageSquare, 
  Star, 
  Shield, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Globe,
  Clock
} from "lucide-react";

function Landing() {
  const { user } = useAuth();

  const features = [
    {
      icon: Briefcase,
      title: "Find Projects",
      description: "Browse hundreds of projects posted by clients worldwide."
    },
    {
      icon: Users,
      title: "Hire Freelancers",
      description: "Connect with talented freelancers who match your project needs."
    },
    {
      icon: MessageSquare,
      title: "Real-time Chat",
      description: "Communicate instantly with clients and freelancers via real-time chat."
    },
    {
      icon: Star,
      title: "Reviews & Ratings",
      description: "Build trust with transparent reviews and ratings."
    },
    {
      icon: Clock,
      title: "Project Management",
      description: "Track progress, manage proposals, and complete projects seamlessly."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-teal-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-[#635bff] text-sm font-medium mb-6">
              <Sparkles size={16} />
              The Future of Freelancing
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Connect, Collaborate,{' '}
              <span className="bg-gradient-to-r from-[#635bff] to-[#00d4b2] bg-clip-text text-transparent">
                Succeed
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              FreelanceHub is the all-in-one platform for freelancers and clients to connect, 
              collaborate, and build amazing projects together.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
                >
                  Go to Dashboard
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
                  >
                    Get Started Free
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-gray-200 pt-10">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#635bff]">10K+</p>
                <p className="text-sm text-gray-500 mt-1">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#635bff]">5K+</p>
                <p className="text-sm text-gray-500 mt-1">Projects</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#635bff]">98%</p>
                <p className="text-sm text-gray-500 mt-1">Satisfaction Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#635bff]">24/7</p>
                <p className="text-sm text-gray-500 mt-1">Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-[#635bff] to-[#00d4b2] bg-clip-text text-transparent">
                succeed
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Powerful features designed to make freelancing simple, secure, and successful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-indigo-50 text-[#635bff] flex items-center justify-center mb-5">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-[#635bff] to-[#00d4b2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of freelancers and clients already using FreelanceHub to build amazing projects.
          </p>
          {user ? (
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-[#635bff] bg-white hover:shadow-lg hover:shadow-black/10 transition-all duration-200"
            >
              Go to Dashboard
              <ArrowRight size={20} />
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-[#635bff] bg-white hover:shadow-lg hover:shadow-black/10 transition-all duration-200"
            >
              Get Started Free
              <ArrowRight size={20} />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} FreelanceHub. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link to="/" className="hover:text-[#635bff] transition-colors">Home</Link>
              <Link to="/projects" className="hover:text-[#635bff] transition-colors">Projects</Link>
              {!user && (
                <>
                  <Link to="/login" className="hover:text-[#635bff] transition-colors">Login</Link>
                  <Link to="/register" className="hover:text-[#635bff] transition-colors">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;