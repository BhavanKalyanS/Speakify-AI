import React from 'react';
import { Box, Typography } from '@mui/material';

const WaveformScoreRing = ({ score = 0, size = 150, isAdmin = false, label = "" }) => {
  const N = 40; // Total number of bars in the ring
  const bars = [];
  const activeCount = Math.round((score / 100) * N);

  // Brand colors
  const learnerActive = '#CC785C'; // Clay warm
  const learnerInactive = '#E2D9C5'; // Muted sand/parchment border
  const adminActive = '#00ED64'; // Spring signal
  const adminInactive = '#1E4C40'; // Muted forest green

  const activeColor = isAdmin ? adminActive : learnerActive;
  const inactiveColor = isAdmin ? adminInactive : learnerInactive;
  const textColor = isAdmin ? '#00ED64' : '#1B1B18';

  for (let i = 0; i < N; i++) {
    // Offset by -90 degrees (-Math.PI/2) so the ring starts at the top
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / N;
    const isHighlighted = i < activeCount;

    // Create a deterministic pseudo-random height pattern resembling an audio wave
    const wavePattern = Math.sin(i * 0.9) * 0.4 + Math.cos(i * 1.8) * 0.3;
    const heightFactor = 0.5 + Math.abs(wavePattern);
    const barHeight = 6 + 14 * heightFactor;

    const rIn = 60; // Inner radius
    const rOut = rIn + barHeight; // Outer radius

    const x1 = 100 + rIn * Math.cos(angle);
    const y1 = 100 + rIn * Math.sin(angle);
    const x2 = 100 + rOut * Math.cos(angle);
    const y2 = 100 + rOut * Math.sin(angle);

    bars.push({
      x1,
      y1,
      x2,
      y2,
      color: isHighlighted ? activeColor : inactiveColor,
      width: isAdmin ? 2.5 : 3
    });
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: size,
        height: size + (label ? 24 : 0),
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: size,
          height: size,
        }}
      >
        <svg
          viewBox="0 0 200 200"
          width="100%"
          height="100%"
          style={{ display: 'block' }}
        >
          {bars.map((bar, index) => (
            <line
              key={index}
              x1={bar.x1}
              y1={bar.y1}
              x2={bar.x2}
              y2={bar.y2}
              stroke={bar.color}
              strokeWidth={bar.width}
              strokeLinecap="round"
              style={{ transition: 'stroke 0.3s ease' }}
            />
          ))}
        </svg>
        
        {/* Center Text */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontWeight: 700,
              fontSize: `${size * 0.18}px`,
              color: textColor,
              lineHeight: 1,
            }}
          >
            {Math.round(score)}
            <span style={{ fontSize: `${size * 0.1}px`, fontWeight: 400, marginLeft: 1 }}>%</span>
          </Typography>
        </Box>
      </Box>

      {label && (
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            fontFamily: isAdmin ? '"IBM Plex Mono", monospace' : 'Georgia, serif',
            fontWeight: isAdmin ? 600 : 500,
            fontSize: '0.85rem',
            color: isAdmin ? '#00ED64' : '#6B6B63',
            textAlign: 'center',
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
};

export default WaveformScoreRing;
