import React, { useEffect, useRef, useState } from 'react';
import type { iTunesSong } from '../../.next/dev/types/itunes';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { useAudioAnalysis } from './api/song-analysis/route';

type AudioPlayerProps = {
    song: iTunesSong;
    onAnalysisComplete?: (result: { maxEnergy: number; finalTempo: "slow" | "mid" | "fast" }) => void;
};

export default function AudioPlayer({ song, onAnalysisComplete }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const { energy, tempo, maxEnergy, finalTempo } = useAudioAnalysis(audioRef.current, isPlaying);
    const hasCompleted = useRef(false);

    // Trigger final analysis exactly once
    useEffect(() => {
        if (finalTempo !== null && !hasCompleted.current) {
            hasCompleted.current = true;
            if (onAnalysisComplete) {
                onAnalysisComplete({ maxEnergy, finalTempo });
            }
        }
    }, [finalTempo, maxEnergy, onAnalysisComplete]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [song.previewUrl]);

    // Reset analysis when song changes
    useEffect(() => {
        hasCompleted.current = false;
        setProgress(0);
        setIsPlaying(false);
    }, [song.trackId]);

    return (
        <div>
            <div className='flex gap-1 items-center'>
                <button onClick={togglePlay} className='cursor-pointer'>
                    {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                </button>
                <div className='relative h-2 bg-gray-300 rounded m-2 w-full'>
                    <div
                        className='absolute left-0 top-0 h-2 rounded'
                        style={{ width: `${progress}%`, height: '100%', backgroundColor: 'blue' }}
                    />
                </div>
            </div>

            <audio
                ref={audioRef}
                src={`/api/audio-proxy?url=${encodeURIComponent(song.previewUrl)}`}
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
}
