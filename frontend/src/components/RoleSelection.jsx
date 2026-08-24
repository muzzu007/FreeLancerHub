import { Building2, Code2 } from "lucide-react";

function RoleSelection({ onSelectRole }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/50 to-teal-50/50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#635bff] to-[#00d4b2] bg-clip-text text-transparent">
            FreelanceHub
          </h1>
          <p className="text-gray-500 mt-2">Choose how you want to use the platform</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Client Card */}
          <div
            onClick={() => onSelectRole("client")}
            className="group bg-white rounded-xl border-2 border-gray-200 p-8 text-center cursor-pointer transition-all duration-300 hover:border-[#635bff] hover:shadow-xl hover:-translate-y-1"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 text-[#635bff] flex items-center justify-center group-hover:bg-[#635bff] group-hover:text-white transition-colors duration-300">
              <Building2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-4">I'm a Client</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Post projects, review proposals, and hire the best freelancers.
            </p>
          </div>

          {/* Freelancer Card */}
          <div
            onClick={() => onSelectRole("freelancer")}
            className="group bg-white rounded-xl border-2 border-gray-200 p-8 text-center cursor-pointer transition-all duration-300 hover:border-[#00d4b2] hover:shadow-xl hover:-translate-y-1"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-teal-50 text-[#00d4b2] flex items-center justify-center group-hover:bg-[#00d4b2] group-hover:text-white transition-colors duration-300">
              <Code2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-4">I'm a Freelancer</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Find projects, submit proposals, and grow your career.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-[#635bff] font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;