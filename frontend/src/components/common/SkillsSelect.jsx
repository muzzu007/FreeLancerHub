import { useState } from "react";
import AVAILABLE_SKILLS from "../../constants/skills";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

function SkillsSelect({
  selectedSkills,
  onChange,
  label = "Skills",
  maxDisplay = 12,
}) {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter((s) => s !== skill));
    } else {
      onChange([...selectedSkills, skill]);
    }
  };

  // Filter skills based on search
  const filteredSkills = AVAILABLE_SKILLS.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine which skills to display
  const displayedSkills = showAll
    ? filteredSkills
    : filteredSkills.slice(0, maxDisplay);

  const hasMore = filteredSkills.length > maxDisplay;
  const hasSearchResults = filteredSkills.length > 0;

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {selectedSkills.length > 0 && (
          <span className="ml-2 text-xs font-normal text-gray-400">
            ({selectedSkills.length} selected)
          </span>
        )}
      </label>

      {/* Search Input */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Selected Skills Tags */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-[#635bff] text-white"
            >
              {skill}
              <button
                type="button"
                onClick={() => toggleSkill(skill)}
                className="hover:text-gray-200 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Available Skills Grid */}
      {searchTerm && !hasSearchResults ? (
        <p className="text-sm text-gray-500 py-2">
          No skills found matching "{searchTerm}"
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {displayedSkills.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-[#635bff] text-white hover:bg-[#4f46e5]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent hover:border-gray-300"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      )}

      {/* Show More / Show Less */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 text-sm font-medium text-[#635bff] hover:text-[#4f46e5] transition-colors duration-200"
        >
          {showAll ? (
            <>
              <ChevronUp size={16} />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              Show More ({filteredSkills.length - maxDisplay} more)
            </>
          )}
        </button>
      )}

      {/* Selected count */}
      {selectedSkills.length > 0 && (
        <p className="text-xs text-gray-400">
          Selected: {selectedSkills.length} skill{selectedSkills.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

export default SkillsSelect;