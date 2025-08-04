import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <main className="m-5">{children}</main>;
};

export default Layout;
