import { useSignIn } from '@clerk/expo'
import { type Href, Link, useRouter } from 'expo-router'
import React, {useState} from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
const SafeAreaView = styled(RNSafeAreaView);
import clsx from 'clsx'

const SignIn = () => {
    const { signIn, errors, fetchStatus } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [code, setCode] = React.useState('')

    // Validation states
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    // Client-side validation
    const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
    const passwordValid = password.length > 0;
    const formValid = emailAddress.length > 0 && password.length > 0 && emailValid;

    const loading = fetchStatus === 'fetching'

    const handleSubmit = async () => {
        const { error } = await signIn.password({ emailAddress, password })
        if (error) return

        if (signIn.status === 'complete') {
            await signIn.finalize({
                navigate: ({ session }) => {
                    if (session?.currentTask) return
                    router.replace('/(tabs)' as Href)
                },
            })
        } else if (signIn.status === 'needs_client_trust') {
            await signIn.mfa.sendEmailCode()
        }
    }

    const handleVerify = async () => {
        await signIn.mfa.verifyEmailCode({ code })

        if (signIn.status === 'complete') {
            await signIn.finalize({
                navigate: ({ session }) => {
                    if (session?.currentTask) return
                    router.replace('/(tabs)' as Href)
                },
            })
        }
    }

    const BrandBlock = () => (
        <View className="auth-brand-block">
            <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                    <Text className="auth-logo-mark-text">F</Text>
                </View>
                <View>
                    <Text className="auth-wordmark">FNM</Text>
                    <Text className="auth-wordmark-sub">Subscription Tracker</Text>
                </View>
            </View>
        </View>
    )

    if (signIn.status === 'needs_client_trust') {
        return (
            <SafeAreaView className="auth-safe-area">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="auth-screen"
                >
                    <ScrollView
                        className="auth-scroll"
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="auth-content">
                            <BrandBlock />

                            <Text className="auth-title">Check your email</Text>
                            <Text className="auth-subtitle">
                                Enter the verification code we sent to {emailAddress}
                            </Text>

                            <View className="auth-card">
                                <View className="auth-form">
                                    <View className="auth-field">
                                        <Text className="auth-label">Verification code</Text>
                                        <TextInput
                                            className="auth-input"
                                            value={code}
                                            placeholder="000000"
                                            placeholderTextColor="rgba(0,0,0,0.3)"
                                            onChangeText={setCode}
                                            keyboardType="numeric"
                                            autoFocus
                                        />
                                        {errors.fields.code && (
                                            <Text className="auth-error">{errors.fields.code.message}</Text>
                                        )}
                                    </View>

                                    <Pressable
                                        className={clsx('auth-button', (!code || loading) && 'auth-button-disabled')}
                                        onPress={handleVerify}
                                        disabled={!code || loading}
                                    >
                                        <Text className="auth-button-text">Verify</Text>
                                    </Pressable>

                                    <Pressable
                                        className="auth-secondary-button"
                                        onPress={() => signIn.mfa.sendEmailCode()}
                                        disabled={loading}
                                    >
                                        <Text className="auth-secondary-button-text">Resend code</Text>
                                    </Pressable>
                                </View>
                            </View>

                            <Pressable className="auth-link-row" onPress={() => signIn.reset()}>
                                <Text className="auth-link">Start over</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="auth-safe-area">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="auth-screen"
            >
                <ScrollView
                    className="auth-scroll"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="auth-content">
                        {/* Branding */}
                        <View className="auth-brand-block">
                            <View className="auth-logo-wrap">
                                <View className="auth-logo-mark">
                                    <Text className="auth-logo-mark-text">R</Text>
                                </View>
                                <View>
                                    <Text className="auth-wordmark">Recurrly</Text>
                                    <Text className="auth-wordmark-sub">SUBSCRIPTIONS</Text>
                                </View>
                            </View>
                            <Text className="auth-title">Welcome back</Text>
                            <Text className="auth-subtitle">
                                Sign in to continue managing your subscriptions
                            </Text>
                        </View>

                        {/* Sign-In Form */}
                        <View className="auth-card">
                            <View className="auth-form">
                                <View className="auth-field">
                                    <Text className="auth-label">Email Address</Text>
                                    <TextInput
                                        className={`auth-input ${emailTouched && !emailValid && 'auth-input-error'}`}
                                        autoCapitalize="none"
                                        value={emailAddress}
                                        placeholder="name@example.com"
                                        placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                        onChangeText={setEmailAddress}
                                        onBlur={() => setEmailTouched(true)}
                                        keyboardType="email-address"
                                        autoComplete="email"
                                    />
                                    {emailTouched && !emailValid && (
                                        <Text className="auth-error">Please enter a valid email address</Text>
                                    )}
                                    {errors.fields.identifier && (
                                        <Text className="auth-error">{errors.fields.identifier.message}</Text>
                                    )}
                                </View>

                                <View className="auth-field">
                                    <Text className="auth-label">Password</Text>
                                    <TextInput
                                        className={`auth-input ${passwordTouched && !passwordValid && 'auth-input-error'}`}
                                        value={password}
                                        placeholder="Enter your password"
                                        placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                        secureTextEntry
                                        onChangeText={setPassword}
                                        onBlur={() => setPasswordTouched(true)}
                                        autoComplete="password"
                                    />
                                    {passwordTouched && !passwordValid && (
                                        <Text className="auth-error">Password is required</Text>
                                    )}
                                    {errors.fields.password && (
                                        <Text className="auth-error">{errors.fields.password.message}</Text>
                                    )}
                                </View>

                                <Pressable
                                    className={`auth-button ${(!formValid || fetchStatus === 'fetching') && 'auth-button-disabled'}`}
                                    onPress={handleSubmit}
                                    disabled={!formValid || fetchStatus === 'fetching'}
                                >
                                    <Text className="auth-button-text">
                                        {fetchStatus === 'fetching' ? 'Signing In...' : 'Sign In'}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Sign-Up Link */}
                        <View className="auth-link-row">
                            <Text className="auth-link-copy">Don't have an account?</Text>
                            <Link href="/(auth)/sign-up" asChild>
                                <Pressable>
                                    <Text className="auth-link">Create Account</Text>
                                </Pressable>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SignIn