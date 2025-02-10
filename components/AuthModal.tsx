"use client";

// Packages
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";

// Custom Imports
import Modal from "./Modal";
import useAuthModal from "@/hooks/useAuthModal";


const AuthModal = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const {session} = useSessionContext();
    const { onClose, isOpen} = useAuthModal();

    useEffect(() => {
        if (session) {
            router.refresh();
            onClose();
        }
    }, [session, router, onClose]);

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    return (
        <Modal
        title="Welcome back"
        description="Login to your account"
        isOpen={isOpen}
        onChange={() => {}}
        >
            <Auth 
            theme="dark"
            magicLink
            providers={['google', 'facebook', 'twitter']}
            supabaseClient={supabaseClient}
            appearance={{
                theme: ThemeSupa,
                variables: {
                    default: {
                        colors: {
                            brand: '#404040',
                            brandAccent: '22c55e',
                        }
                    }
                }
            }}
            />
        </Modal>
    );
};

export default AuthModal;