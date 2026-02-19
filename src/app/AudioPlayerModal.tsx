"use client";
import React from 'react'
import type { iTunesSong } from '../../.next/dev/types/itunes';
import AudioPlayer from './AudioPlayer';
import { on } from 'events';

type Props ={
    song: iTunesSong;
    onClose: () => void;
    onAnalysisComplete?: (result: { maxEnergy: number; finalTempo: "slow" | "mid" | "fast" }) => void;
}

export default function AudioPlayerModal({ song, onClose, onAnalysisComplete }: Props) {
  return (
            <div className="fixed inset-0 sm:z-30 z-50 flex items-end justify-center pointer-events-none">
                <div className="bg-white rounded-xl border p-2 sm:max-w-9/10 max-w-lg w-9/10 mb-5 pointer-events-auto" onClick={(e) => e.stopPropagation()}>  
                    <div className='flex items-center justify-between'>
                        <div className='flex gap-2 items-center'>
                            <img src={song.artworkUrl100} alt={song.trackName} className=" sm:w-20 sm:h-20 w-1/10 h-1/10 object-cover rounded-lg"/>
                            <div className='flex items-center justify-center sm:hidden'>
                                <h4 className="text-xs font-bold">{song.trackName} - {song.artistName}</h4>
                            </div>
                            <div className='hidden sm:flex flex-col justify-center'>
                                    <h5 className='text-base font-light'>{song.trackName}</h5>
                                    <h6 className='text-sm font-extralight'>{song.artistName}</h6>
                            </div>
                        </div>
                        <div className='w-1/2 h-full'>
                            {song.previewUrl && <AudioPlayer key={song.trackId} song={song} onAnalysisComplete={onAnalysisComplete} />}
                        </div>
                        {/* <button className='text-gray-400' onClick={onClose}>X</button> */}
                    </div>
                </div>
            </div>
  )
}