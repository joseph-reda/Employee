// مكون Avatar.js جديد
import React from "react";
import "./Avatar.css";

const Avatar = ({ name, src, size = 150 }) => {
  const [hasError, setHasError] = React.useState(false);
  
  const getInitials = () => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getColor = () => {
    const colors = [
      '#4299e1', '#38a169', '#ed8936', '#9f7aea',
      '#f56565', '#4fd1c7', '#ed64a6', '#667eea'
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name}
        className="avatar-image"
        style={{ width: size, height: size }}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div 
      className="avatar-fallback"
      style={{
        width: size,
        height: size,
        backgroundColor: getColor(),
        fontSize: size * 0.4
      }}
    >
      {getInitials()}
    </div>
  );
};

export default Avatar;