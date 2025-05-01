import React from 'react';
import { motion } from 'framer-motion';

const RoomCard = ({ title, description, imageSrc }) => {
  return (
    <motion.div 
      className="bg-amber-200 rounded-2xl shadow-lg h-full flex flex-col overflow-hidden"
      whileHover={{ 
        scale: 1.02,
        backgroundColor: 'rgb(254, 215, 170)', // amber-200 hover color
        boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.15)"
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gray-200 h-64 w-full relative">
        {/* Aquí se cargará la imagen desde la API */}
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          {/* Placeholder para las imágenes que vendrán de la API */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent to-amber-100/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      <div className="p-5 flex-grow">
        <motion.h3 
          className="text-xl font-bold text-amber-950 mb-2"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-base text-amber-950"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default RoomCard;