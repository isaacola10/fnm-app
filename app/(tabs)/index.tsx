import "@/global.css"
import { Text, View } from "react-native";
import {Link} from "expo-router";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
    return (
        <SafeAreaView className="flex-1 p-5 bg-background">
            <Text className="text-xl font-bold text-success">
                Welcome to Nativewind!
            </Text>
            <Link href={'/onboarding'} className="mt-4 rounded-full bg-primary text-white p-4">Onboarding</Link>
            <Link href={'/(auth)/sign-in'} className="mt-4 rounded-full bg-primary text-white p-4">Go to Sign in</Link>
            <Link href={'/(auth)/sign-up'} className="mt-4 rounded-full bg-primary text-white p-4">Go to Sign up</Link>
            <Link href={{
                pathname: "/subscriptions/[id]",
                params: {id: "claude"},
            }} className="mt-4 rounded-full bg-primary text-white p-4">Claude Max Subscription</Link>
        </SafeAreaView>
    );
}