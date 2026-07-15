import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  IconButton,
  Typography,
  Paper,
  Stack,
  Alert,
  Box,
} from "@mui/material";
import {
  Mic,
  Stop,
  PlayArrow,
  Delete,
  CloudUpload,
  Pause,
  Refresh,
} from "@mui/icons-material";

const AudioRecorder = ({ onAudioReady, targetText }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      setError("");
      chunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const recorder = new MediaRecorder(stream, { audioBitsPerSecond: 128000 });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `recording_${Date.now()}.webm`, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        setHasRecording(true);
        onAudioReady(file);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setError("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.requestData();
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 100);
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setHasRecording(false);
    setAudioUrl("");
    setRecordingTime(0);
    setIsPlaying(false);
    chunksRef.current = [];
    onAudioReady(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioUrl(URL.createObjectURL(file));
      setHasRecording(true);
      setError("");
      onAudioReady(file);
    } else {
      setError("Please upload a valid audio file");
    }
    event.target.value = "";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Target Sentence Display */}
      {targetText && (
        <Box sx={{ textAlign: 'center', mb: 5, px: 2 }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#6B6B63', display: 'block', mb: 1, fontWeight: 600 }}>
            Target Sentence
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: 'Georgia, serif', 
              color: '#1B1B18', 
              fontStyle: 'italic', 
              lineHeight: 1.4,
              fontSize: { xs: '1.4rem', md: '1.8rem' }
            }}
          >
            "{targetText}"
          </Typography>
        </Box>
      )}

      {/* Recording Widget Area */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        py: 6,
        bgcolor: '#F7F3EA',
        borderRadius: '12px',
        border: '1px solid rgba(27,27,24,0.04)',
        mb: 4
      }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: '8px', border: '1px solid rgba(224, 87, 74, 0.2)' }}>
            {error}
          </Alert>
        )}

        {/* Dynamic Waveform Visual Zone */}
        <Box sx={{ 
          position: 'relative', 
          width: 220, 
          height: 220, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 3
        }}>
          {/* Pulsating Radiating Bars */}
          {Array.from({ length: 24 }).map((_, index) => {
            const angle = (360 / 24) * index;
            const delay = (index % 5) * 0.15;
            return (
              <Box
                key={index}
                className="waveform-bar"
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '20px',
                  backgroundColor: '#00ED64', // Spring signal green
                  borderRadius: '2px',
                  transformOrigin: 'center bottom',
                  transform: `rotate(${angle}deg) translateY(-60px)`,
                  transition: 'all 0.3s ease',
                }}
                sx={{
                  '--angle': `${angle}deg`,
                  animation: isRecording ? 'radiateWave 0.8s ease-in-out infinite alternate' : 'none',
                  animationDelay: `${delay}s`,
                  opacity: isRecording ? 0.8 : 0.15
                }}
              />
            );
          })}

          {/* Central Clay Mic Button */}
          <IconButton
            onClick={isRecording ? stopRecording : startRecording}
            sx={{
              width: 86,
              height: 86,
              bgcolor: isRecording ? '#E0574A' : '#CC785C', // Alert coral if recording, clay warm if ready
              color: 'white',
              boxShadow: '0 4px 12px rgba(204, 120, 92, 0.25)',
              zIndex: 2,
              '&:hover': {
                bgcolor: isRecording ? '#b84236' : '#b8674d',
                boxShadow: '0 6px 16px rgba(204, 120, 92, 0.35)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isRecording ? <Stop sx={{ fontSize: 36 }} /> : <Mic sx={{ fontSize: 36 }} />}
          </IconButton>
        </Box>

        {/* Monospace Timer */}
        {isRecording && (
          <Typography 
            sx={{ 
              fontFamily: '"IBM Plex Mono", monospace', 
              fontWeight: 700, 
              fontSize: '1.4rem', 
              color: '#E0574A',
              letterSpacing: '1px',
              mb: 1
            }}
          >
            {formatTime(recordingTime)}
          </Typography>
        )}

        <Typography variant="body2" sx={{ color: '#6B6B63', fontFamily: '"Inter", sans-serif', fontWeight: 500, mb: 3 }}>
          {isRecording ? 'Recording - speak clearly...' :
           hasRecording ? 'Recording captured successfully' :
           'Tap microphone to record'}
        </Typography>

        {/* Control Buttons & Upload */}
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" flexWrap="wrap">
          {!isRecording && !hasRecording && (
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              sx={{ 
                color: '#1B1B18', 
                borderColor: 'rgba(27,27,24,0.15)',
                borderRadius: '8px',
                px: 3,
                py: 1.2,
                '&:hover': { borderColor: '#CC785C', bgcolor: 'rgba(204,120,92,0.05)' }
              }}
            >
              Upload Audio File
              <input type="file" accept="audio/*" hidden onChange={handleFileUpload} />
            </Button>
          )}

          {hasRecording && !isRecording && (
            <Paper sx={{ p: 2, bgcolor: '#EDE6D6', borderRadius: '12px', boxShadow: 'none', border: '1px solid rgba(27,27,24,0.04)' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton 
                  onClick={isPlaying ? pauseAudio : playAudio}
                  sx={{ bgcolor: '#CC785C', color: 'white', '&:hover': { bgcolor: '#b8674d' } }}
                >
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                
                <IconButton 
                  onClick={() => { deleteRecording(); startRecording(); }} 
                  sx={{ color: '#CC785C', border: '1px solid rgba(204,120,92,0.2)', '&:hover': { bgcolor: 'rgba(204,120,92,0.05)' } }}
                >
                  <Refresh />
                </IconButton>
                
                <IconButton 
                  color="error" 
                  onClick={deleteRecording}
                  sx={{ border: '1px solid rgba(224,87,74,0.2)', '&:hover': { bgcolor: 'rgba(224,87,74,0.05)' } }}
                >
                  <Delete />
                </IconButton>
                
                <Typography variant="body2" sx={{ color: '#6B6B63', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
                  {isPlaying ? 'Playing audio...' : 'Ready to submit'}
                </Typography>
              </Stack>
            </Paper>
          )}
        </Stack>
      </Box>

      <audio 
        ref={audioRef} 
        src={audioUrl} 
        style={{ display: "none" }} 
        onEnded={() => setIsPlaying(false)}
      />

      {/* Embedded CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes radiateWave {
          0% {
            transform: rotate(var(--angle)) translateY(-55px) scaleY(0.7);
            opacity: 0.5;
          }
          100% {
            transform: rotate(var(--angle)) translateY(-66px) scaleY(2.2);
            opacity: 1;
            background-color: #00ED64;
          }
        }
      `}} />
    </Box>
  );
};

export default AudioRecorder;
