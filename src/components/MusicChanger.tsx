import { useEffect } from 'react';
import { Label } from "./ui/label";
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const MusicChanger = ({ onMusicChange,initialValue }:any) => {
    const [selected, setSelected] = useState(initialValue);
    useEffect(() => {
        setSelected(initialValue);
    }, [initialValue]);
    const handleChange = (value:any) => {
        setSelected(value);
        onMusicChange(value);
    };

    return (
        <div className="">
            <RadioGroup value={selected} onValueChange={handleChange}>
                <div className="flex items-center space-x-2 p-0 rounded-lg shadow-sm m-3">
                    <RadioGroupItem value="option-one" id="option-one" className="bg-white" />
                    <Label htmlFor="option-one" className="cursor-pointer">Keyboard</Label>
                </div>
                <div className="flex items-center space-x-2 p-0 rounded-lg shadow-sm m-3">
                    <RadioGroupItem value="option-two" id="option-two" className="bg-white" />
                    <Label htmlFor="option-two" className="cursor-pointer">Chill lofi</Label>
                </div>
                <div className="flex items-center space-x-2 p-0 rounded-lg shadow-sm m-3">
                    <RadioGroupItem value="option-three" id="option-three" className="bg-white" />
                    <Label htmlFor="option-three" className="cursor-pointer">Piano loops</Label>
                </div>
                <div className="flex items-center space-x-2 p-0 rounded-lg shadow-sm m-3">
                    <RadioGroupItem value="None" id="None" className="bg-white" />
                    <Label htmlFor="None" className="cursor-pointer">None</Label>
                </div>
            </RadioGroup>
        </div>
    );
};

export default MusicChanger;
