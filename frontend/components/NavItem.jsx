import React from 'react';
import { motion } from 'framer-motion';

const NavItem = ({ label, active }) => {
  return (
    <motion.div 
      className={`py-5 px-6 text-center cursor-pointer transition-all w-full ${
        active 
          ? 'bg-amber-700 text-white font-bold' 
          : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
      }`}
      whileHover={{ 
        backgroundColor: active ? undefined : 'rgb(254, 215, 170)'  // amber-200 hover color
      }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-lg">{label}</span>
    </motion.div>
  );
};

export default NavItem;