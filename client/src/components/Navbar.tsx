import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <>
      <div className="navbar fixed left-0 top-0 z-[9999] bg-base-100 shadow-lg">
        <Link to="/" className="btn btn-ghost text-xl">
          Theater
        </Link>
      </div>
      <div className="h-[100px] w-full" />
    </>
  );
};
