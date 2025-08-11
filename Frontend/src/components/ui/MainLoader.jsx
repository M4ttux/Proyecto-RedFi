import React from "react";
import { IconLoader2 } from "@tabler/icons-react";
import classNames from "classnames";

const MainLoader = ({ texto = "", className = "", size = 24 }) => {
  return (
    <div className={classNames("flex items-center justify-center gap-2 text-texto", className)}>
      <IconLoader2 size={size} className="animate-spin" />
      {texto && <span className="text-sm font-medium">{texto}</span>}
    </div>
  );
};

export default MainLoader;
