import { useState } from "react";
import AVAILABLE_SKILLS from "../../constants/skills";

function SkillsSelect({ selectedSkills, onChange, label = "Skills", maxDisplay = 12 }) {

    const [showAll, setShowAll] = useState(false);

    const toggleSkill = (skill) => {
        if (selectedSkills.includes(skill)) {
            onChange(selectedSkills.filter(s => s !== skill));
        } else {
            onChange([...selectedSkills, skill]);
        }
    };

    const displayedSkills = showAll 
        ? AVAILABLE_SKILLS 
        : AVAILABLE_SKILLS.slice(0, maxDisplay);

    const hasMore = AVAILABLE_SKILLS.length > maxDisplay;

    return (
        <div>
            <label>{label}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                {displayedSkills.map((skill) => (
                    <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        style={{
                            padding: "6px 12px",
                            borderRadius: "4px",
                            border: selectedSkills.includes(skill)
                                ? "2px solid #007bff"
                                : "1px solid #ccc",
                            backgroundColor: selectedSkills.includes(skill)
                                ? "#007bff"
                                : "white",
                            color: selectedSkills.includes(skill)
                                ? "white"
                                : "#333",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        {skill}
                    </button>
                ))}
            </div>

            {/* Show More / Show Less */}
            {hasMore && (
                <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    style={{ marginTop: "8px", padding: "4px 12px", cursor: "pointer" }}
                >
                    {showAll ? "Show Less" : `Show More (${AVAILABLE_SKILLS.length - maxDisplay} more)`}
                </button>
            )}

            {/* Selected count */}
            {selectedSkills.length > 0 && (
                <p style={{ marginTop: "8px", fontSize: "14px", color: "#555" }}>
                    Selected: {selectedSkills.length} skills
                </p>
            )}
        </div>
    );
}

export default SkillsSelect;