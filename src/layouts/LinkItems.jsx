import React from "react";

const LinkItems = () => {
  const Links = [
    { title: "Home", url: "/", icon: "", subMenu: false },
    { title: "Aboutus", url: "/aboutus", icon: "", subMenu: false },
    { title: "Categories", url: "/categories", icon: "", subMenu: false },
    { title: "Contactus", url: "/contactus", icon: "", subMenu: false },
  ];

  return <div>
       {
        <Links/>
       }
  </div>;
};

export default LinkItems;
