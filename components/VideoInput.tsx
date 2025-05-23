"use client";

import qs from "query-string";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import useDebounce from "@/hooks/useDebounce";
import Input from "./Input";

const VideoInput = () => {
    const router = useRouter();
    const [value, setValue] = useState<string>("");

    const debouncedValue = useDebounce<string>(value, 500);

    useEffect(() => {
        const query = {
            title: debouncedValue,
        };

        const url = qs.stringifyUrl({
            url: '/videos',
            query: query
        });

        router.push(url);
    }, [debouncedValue, router]);

    

    
    return (
       <Input 
        placeholder="Search for a Video!"
        value={value}
        onChange={(e) => setValue(e.target.value)}
       />
    );
}

export default VideoInput;