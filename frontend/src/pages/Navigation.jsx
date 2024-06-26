import { Link } from "react-router-dom";
export const Navigation = () => {
  return (
    <>
      <Link to="/dashboard"> dashboard </Link >
      <Link to="/signin"> sigin </Link>
      <Link to="/send"> send  </Link>
      <Link to="/signup"> signup </Link>
    </>
  )
};
