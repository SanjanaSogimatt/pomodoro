import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useEffect, useState } from 'react';
import MusicChanger from './MusicChanger';
import { Switch } from './ui/switch';
import useSound from 'use-sound';
import spacebar_click from './sounds/spacebar_click.mp3';
import tap_notification from './sounds/tap_notification.mp3';
import { Music } from 'lucide-react';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover";

import mechanical_keyboard_typing from "./sounds/mechanical_keyboard_typing.mp3"
import chill_background_music from "./sounds/chill_background_music.mp3"
import piano_loops from "./sounds/piano_loops.mp3"
import alram from "./sounds/alram.mp3"


const soundUrls = {
  'option-one': mechanical_keyboard_typing,
  'option-two': chill_background_music,
  'option-three': piano_loops,
  'none': null
}
const ProgressBar = () => {
    const TOTAL_TIME = 1500; // 25 minutes in seconds
    const SHORT_BREAK = 300; // 5 minutes in seconds
    const [phase, setPhase] = useState('work');
    const [time, setTime] = useState(TOTAL_TIME);
    const [running, setRunning] = useState(false);
    const [selected, setSelected] = useState(false);
    const [selectedMusic, setSelectedMusic] = useState('none');
    const [play_toggle] = useSound(tap_notification, { volume: 0.5 });
    const [play] = useSound(spacebar_click, { volume: 0.5 });
    const [play_alarm,{stop:stopAlarm}] = useSound(alram, { volume: 0.5 });
    const [playKeyboard, { stop: stopKeyboard }] = useSound(soundUrls['option-one'], { loop: true });
    const [playChill, { stop: stopChill }] = useSound(soundUrls['option-two'], { loop: true });
    const [playPiano, { stop: stopPiano }] = useSound(soundUrls['option-three'], { loop: true });

    useEffect(() => {
        let interval:any;
        if (running) {
            interval = setInterval(() => {
                setTime((prev) => {
                    if (prev <= 1) {
                        play_alarm();
                        switchPhase();
                        return phase === 'work' ? SHORT_BREAK : TOTAL_TIME;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (!running && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running, time,phase, play_alarm]);

    useEffect(() => {
        if (selected && running && selectedMusic !== 'none') {
            stopAllSounds();
            playSelectedMusic();
        } else {
            stopAllSounds();
        }
    }, [selected, running, selectedMusic]);

    const playSelectedMusic = () => {
        if (selectedMusic === 'option-one') playKeyboard();
        else if (selectedMusic === 'option-two') playChill();
        else if (selectedMusic === 'option-three') playPiano();
    };

    const stopAllSounds = () => {
        stopKeyboard();
        stopChill();
        stopPiano();
    };

    const switchPhase = () => {
        stopAllSounds();
        if (phase === 'work') {
            setPhase('short_break');
            setTime(SHORT_BREAK);
            setRunning(true); // Automatically start the short break
        } else {
            setPhase('work');
            setTime(TOTAL_TIME);
            setRunning(false);
        }
    };

    const startTimer = () => {
        play();
        stopAlarm();
        setRunning(!running);
    };

    const resetTimer = () => {
        play();
        stopAlarm();
        setTime(TOTAL_TIME);
        setRunning(false);
        setPhase('work');
    };

    const formatTime = (seconds:any) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleChange = () => {
        play_toggle();
        setSelected(!selected);
    };

    const handleMusicChange = (value:any) => {
        setSelectedMusic(value);
    };

    const percentage = (time / (phase === 'work' ? TOTAL_TIME : SHORT_BREAK)) * 100;

    return (
        <>
            <div className='flex flex-col items-center justify-center h-screen bg-cover bg-center' style={{ backgroundImage: "url('/bg3.jpg')" }}>
                <div className="flex items-center space-x-2 absolute top-4 left-4 z-10">
                    <Switch
                        checked={selected}
                        onCheckedChange={handleChange}
                    />
                    <Popover>
                        <PopoverTrigger>
                            <button className='bg-black p-2 bg-opacity-30 rounded-full shadow-sm'>
                                <Music size={16} className='text-white font-bold' />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className='bg-black bg-opacity-30 m-2 text-white border-0'>
                            <MusicChanger initialValue={selectedMusic} onMusicChange={handleMusicChange} />
                        </PopoverContent>
                    </Popover>
                </div>

                <h1 className='text-2xl my-9 font-bold text-white text-center'>
                    <span className='text-5xl bg-gradient-to-r from-blue-600 via-orange-700 to-yellow-600 text-transparent bg-clip-text'>Pomodoro</span>
                </h1>
                <div className="w-64 h-64 flex items-center justify-center my-12">
                    <div className='bg-white bg-opacity-30 rounded-full shadow-lg border-2 p-4 btn'>
                        <button onClick={startTimer} onDoubleClick={resetTimer} className="w-full h-full">
                            <CircularProgressbar
                                value={percentage}
                                text={`${formatTime(time)}`}
                                strokeWidth={2}
                                circleRatio={0}
                                styles={buildStyles({
                                    textColor: "skyblue",
                                    textSize: "32px",
                                })}
                            />
                        </button>
                    </div>
                </div>
                <div className='w-full max-w-lg mt-8'>
                    <Card className='bg-slate-400 bg-opacity-20 shadow-lg text-center text-bold w-full'>
                        <CardHeader>
                            <CardTitle className='text-pink-800'>Let's get work done</CardTitle>
                            <CardDescription className='text-sm text-orange-800 mt-2 text-center'> Single click to start double click to reset</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default ProgressBar;
