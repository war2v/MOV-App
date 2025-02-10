"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import uniqid from "uniqid";
import { useRouter } from "next/navigation";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";


const UploadModal = () =>{
    const [isLoading, setIsLoading] = useState(false);
    const uploadModal = useUploadModal();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
        }
    });

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            uploadModal.onClose();
        }
    };

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            const imageFile = values.image?.[0];

            const songFile = values.song?.[0];

            if(!imageFile || !songFile || !user) {
                toast.error('Missing fields');
                return;
            }

            const uniqueID = uniqid();

            // Upload Song
            const {
                data: songData,
                error: songError,
            } = await supabaseClient
                .storage
                .from('songs')
                .upload(`song-${values.title}-${uniqueID}`, songFile, {
                    cacheControl: '3600',
                    upsert: false,
                });

                if (songError) {
                    setIsLoading(false);
                    return toast.error('Failed to upload song')
                }
            
                const {
                    data: imageData,
                    error: imageError,
                } = await supabaseClient
                    .storage
                    .from('images')
                    .upload(`image-${values.title}-${uniqueID}`, imageFile, {
                        cacheControl: '3600',
                        upsert: false,
                    });
    
                    if (imageError) {
                        setIsLoading(false);
                        return toast.error('Failed to upload image')
                    }
                
                const {
                    error: supabaseError
                } = await supabaseClient
                                .from('songs')
                                .insert({
                                    user_id: user.id,
                                    title: values.title,
                                    author: values.author,
                                    image_path: imageData.path,
                                    song_path: songData.path
                                });
                if (supabaseError) {
                    setIsLoading(false);
                    return toast.error(supabaseError.message);
                }

                router.refresh();
                setIsLoading(false);
                toast.success('Song Created!');
                reset();
                uploadModal.onClose();
        } catch (error){
            toast.error("Oops, something went wrong...")
        } finally {
            setIsLoading(false);
        }
    }



    return (
        <Modal 
        title="Add A Song"
        description="Upload mp3 or wav file"
        isOpen={uploadModal.isOpen}
        onChange={onChange}>
            <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
            >
                <Input 
                id="title"
                disabled={isLoading}
                {...register('title', {required: true})}
                placeholder="Song title"
                />
                <Input 
                id="author"
                disabled={isLoading}
                {...register('author', {required: true})}
                placeholder="Song Author"
                />
                <div>
                    <div className="pb-1">
                        Select Song File
                    </div>
                    <Input 
                    id="song"
                    type="file"
                    disabled={isLoading}
                    {...register('song', {required: true})}
                    accept=".mp3"
                    />
                </div>
                <div>
                    <div className="pb-1">
                        Select an Image
                    </div>
                    <Input 
                    id="image"
                    type="file"
                    disabled={isLoading}
                    {...register('image', {required: true})}
                    accept="image/*"
                    />
                </div>
                <Button 
                    disabled={isLoading}
                    type="submit">
                    Create
                </Button>
            </form>
        </Modal>
    );
};

export default UploadModal;