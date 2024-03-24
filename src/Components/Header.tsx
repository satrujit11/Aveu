import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo-transparent.png";
const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-between items-center">
      <img src={Logo} alt="logo" className="max-h-16" />
      <i
        className="material-symbols-outlined text-secondary p-2 border-[1px] rounded border-secondary cursor-pointer"
        onClick={() => navigate("/create")}
      >
        add
      </i>
    </div>
  );
};

export default Header;
