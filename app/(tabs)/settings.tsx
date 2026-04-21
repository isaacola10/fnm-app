import {View, Text, Pressable} from 'react-native'
import React from 'react'
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";
import {useAuth} from "@clerk/expo";
import {useRouter} from "expo-router";
const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
    const { signOut } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        await signOut()
        router.replace('/(auth)/sign-in')
    }

    return (
        <SafeAreaView className="flex-1 p-5 bg-background">
            <Text>Settings</Text>
            <Pressable
                onPress={handleLogout}
                className="mt-6 bg-red-500 rounded-xl p-4 items-center"
            >
                <Text className="text-white font-semibold text-base">Log Out</Text>
            </Pressable>
        </SafeAreaView>
    )
}
export default Settings
