import { SlotColor } from '../types';

interface FootprintProps {
  color: SlotColor;
  className?: string;
}

export const Footprint = ({ color, className }: FootprintProps) => {
  const isEmpty = color === 'empty';
  const fill =
    color === 'pink'
      ? 'var(--footprint-pink)'
      : color === 'blue'
        ? 'var(--footprint-blue)'
        : 'transparent';

  return (
    <svg
      viewBox='0 0 100 100'
      className={`w-full h-full transition-all duration-300 ${className}`}
      style={{
        filter: isEmpty ? 'none' : 'drop-shadow(2px 4px 3px rgba(0,0,0,0.4))',
        transform:
          color !== 'empty'
            ? 'scale(1.05) rotate(-5deg)'
            : 'scale(0.95) rotate(-5deg)',
      }}
    >
      {isEmpty && (
        <g
          fill='var(--footprint-empty-fill)'
          stroke='var(--footprint-empty-stroke)'
          strokeWidth='1'
        >
          <ellipse
            cx='32'
            cy='22'
            rx='10'
            ry='14'
            transform='rotate(-15 32 22)'
          />
          <ellipse
            cx='54'
            cy='18'
            rx='7'
            ry='10'
            transform='rotate(-5 54 18)'
          />
          <ellipse cx='70' cy='22' rx='6' ry='8' transform='rotate(5 70 22)' />
          <ellipse cx='82' cy='30' rx='5' ry='7' transform='rotate(15 82 30)' />
          <path d='M 32 40 C 20 50, 25 85, 45 92 C 65 99, 82 85, 80 60 C 78 40, 60 32, 45 35 C 38 36, 35 38, 32 40 Z' />
        </g>
      )}
      {!isEmpty && (
        <g fill={fill} stroke='rgba(0,0,0,0.05)' strokeWidth='1'>
          <ellipse
            cx='32'
            cy='22'
            rx='10'
            ry='14'
            transform='rotate(-15 32 22)'
          />
          <ellipse
            cx='54'
            cy='18'
            rx='7'
            ry='10'
            transform='rotate(-5 54 18)'
          />
          <ellipse cx='70' cy='22' rx='6' ry='8' transform='rotate(5 70 22)' />
          <ellipse cx='82' cy='30' rx='5' ry='7' transform='rotate(15 82 30)' />
          <path d='M 32 40 C 20 50, 25 85, 45 92 C 65 99, 82 85, 80 60 C 78 40, 60 32, 45 35 C 38 36, 35 38, 32 40 Z' />

          {/* Subtle highlights */}
          <path
            d='M 32 40 C 20 50, 25 85, 45 92'
            fill='none'
            stroke='rgba(255,255,255,0.5)'
            strokeWidth='2'
            strokeLinecap='round'
          />
          <ellipse
            cx='30'
            cy='18'
            rx='3'
            ry='5'
            fill='rgba(255,255,255,0.4)'
            transform='rotate(-15 30 18)'
          />
        </g>
      )}
    </svg>
  );
};
