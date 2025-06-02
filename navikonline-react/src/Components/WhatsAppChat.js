import React, { useEffect } from 'react';

const WhatsAppChat = () => {
  useEffect(() => {
    // Ensure the Elfsight script is loaded
    if (window.ExWidget) {
      window.ExWidget.init();
    }
  }, []);

  return (
    <div className="eapps-widget-toolbar">
      {/* Replace the data-elfsight-app-id with your actual Elfsight app ID */}
      <div className="elfsight-app-f7d24964-1a9f-48b9-99a6-29c421fe056c"></div>
    </div>
  );
};

export default WhatsAppChat; 