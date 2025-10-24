// pages/Logout.js

function Logout() {
  localStorage.clear();
  window.location.href = "/login";
  return null;
}

export default Logout;
