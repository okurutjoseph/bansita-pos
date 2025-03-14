import React from 'react';
import Image from 'next/image';

// A simple gray placeholder image as a base64 data URL
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  width = 100,
  height = 100,
  className = '',
  alt = 'Placeholder image'
}) => {
  return (
    <Image
      src={PLACEHOLDER_IMAGE}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default PlaceholderImage;
export { PLACEHOLDER_IMAGE }; 