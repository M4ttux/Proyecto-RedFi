import React, { useState } from "react";

const SpeedTest = () => {
  return (
    <div>
      <iframe
        src="https://librespeed.org/"
        className="w-full h-[400px] lg:h-[700px] rounded-lg border border-white/10"
        title="Test de Velocidad"
      />
    </div>
  );
};

export default SpeedTest;
