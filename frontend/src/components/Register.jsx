import { useState } from "react";
import RoleSelection from "./RoleSelection";
import RegisterForm from "./RegisterForm";

function Register() {
  const [selectedRole, setSelectedRole] = useState(null);

  if (!selectedRole) {
    return <RoleSelection onSelectRole={setSelectedRole} />;
  }

  return (
    <RegisterForm
      role={selectedRole}
      onBack={() => setSelectedRole(null)}
    />
  );
}

export default Register;