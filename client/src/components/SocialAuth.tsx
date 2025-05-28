import { AppleLight, Facebook, Google } from "developer-icons";
import { Fragment } from "react";

const SocialAuth = () => {
  return (
    <Fragment>
      <a href="http://localhost:5000/auth/google">
        <SocialButton icon={<Google size={20} />} label="Sign up with Google" />
      </a>

      {/* TODO: */}
      {/* Test facebook login after production */}
      <a href="http://localhost:5000/auth/facebook">
        <SocialButton
          icon={<Facebook size={20} className="text-blue-500" />}
          label="Sign up with Facebook"
        />
      </a>

      <SocialButton
        icon={<AppleLight size={20} />}
        label="Sign up with Apple"
      />
    </Fragment>
  );
};

const SocialButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 transition text-sm">
    {icon}
    {label}
  </button>
);

export default SocialAuth;
