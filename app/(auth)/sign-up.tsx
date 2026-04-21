import { useSignUp } from '@clerk/expo'
import { type Href, Link, useRouter } from 'expo-router'
import React from 'react'
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

export default function SignUp() {
    const { signUp, errors, fetchStatus } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [passwordVisible, setPasswordVisible] = React.useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState(false)
    const [code, setCode] = React.useState('')
    const [step, setStep] = React.useState<'form' | 'verify'>('form')
    const [confirmError, setConfirmError] = React.useState('')

    const loading = fetchStatus === 'fetching'

    const isFormReady =
        emailAddress.trim().length > 0 &&
        password.length >= 8 &&
        confirmPassword.length > 0 &&
        !loading

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setConfirmError('Passwords do not match')
            return
        }
        setConfirmError('')

        const { error } = await signUp.password({ emailAddress, password })
        if (error) return

        await signUp.verifications.sendEmailCode()
        setStep('verify')
    }

    const handleVerify = async () => {
        await signUp.verifications.verifyEmailCode({ code })

        if (signUp.status === 'complete') {
            await signUp.finalize({
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

    if (step === 'verify') {
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

                            <Text className="auth-title">Verify your email</Text>
                            <Text className="auth-subtitle">
                                Enter the 6-digit code we sent to {emailAddress}
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
                                        <Text className="auth-button-text">
                                            {loading ? 'Verifying…' : 'Verify email'}
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        className="auth-secondary-button"
                                        onPress={() => signUp.verifications.sendEmailCode()}
                                        disabled={loading}
                                    >
                                        <Text className="auth-secondary-button-text">Resend code</Text>
                                    </Pressable>
                                </View>
                            </View>

                            <Pressable className="auth-link-row" onPress={() => setStep('form')}>
                                <Text className="auth-link">Go back</Text>
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
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="auth-content">
                        <BrandBlock />

                        <Text className="auth-title">Create account</Text>
                        <Text className="auth-subtitle">Start tracking your subscriptions</Text>

                        <View className="auth-card">
                            <View className="auth-form">
                                <View className="auth-field">
                                    <Text className="auth-label">Email address</Text>
                                    <TextInput
                                        className={clsx(
                                            'auth-input',
                                            errors.fields.emailAddress && 'auth-input-error',
                                        )}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                        placeholder="you@example.com"
                                        placeholderTextColor="rgba(0,0,0,0.3)"
                                        value={emailAddress}
                                        onChangeText={setEmailAddress}
                                    />
                                    {errors.fields.emailAddress && (
                                        <Text className="auth-error">
                                            {errors.fields.emailAddress.message}
                                        </Text>
                                    )}
                                </View>

                                <View className="auth-field">
                                    <Text className="auth-label">Password</Text>
                                    <View style={{ position: 'relative' }}>
                                        <TextInput
                                            className={clsx(
                                                'auth-input',
                                                errors.fields.password && 'auth-input-error',
                                            )}
                                            placeholder="Min. 8 characters"
                                            placeholderTextColor="rgba(0,0,0,0.3)"
                                            secureTextEntry={!passwordVisible}
                                            value={password}
                                            onChangeText={setPassword}
                                        />
                                        <Pressable
                                            onPress={() => setPasswordVisible((v) => !v)}
                                            style={{
                                                position: 'absolute',
                                                right: 16,
                                                top: 0,
                                                bottom: 0,
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text className="text-sm font-sans-semibold text-muted-foreground">
                                                {passwordVisible ? 'Hide' : 'Show'}
                                            </Text>
                                        </Pressable>
                                    </View>
                                    {errors.fields.password && (
                                        <Text className="auth-error">{errors.fields.password.message}</Text>
                                    )}
                                </View>

                                <View className="auth-field">
                                    <Text className="auth-label">Confirm password</Text>
                                    <View style={{ position: 'relative' }}>
                                        <TextInput
                                            className={clsx(
                                                'auth-input',
                                                confirmError && 'auth-input-error',
                                            )}
                                            placeholder="Re-enter password"
                                            placeholderTextColor="rgba(0,0,0,0.3)"
                                            secureTextEntry={!confirmPasswordVisible}
                                            value={confirmPassword}
                                            onChangeText={(v) => {
                                                setConfirmPassword(v)
                                                if (confirmError) setConfirmError('')
                                            }}
                                        />
                                        <Pressable
                                            onPress={() => setConfirmPasswordVisible((v) => !v)}
                                            style={{
                                                position: 'absolute',
                                                right: 16,
                                                top: 0,
                                                bottom: 0,
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text className="text-sm font-sans-semibold text-muted-foreground">
                                                {confirmPasswordVisible ? 'Hide' : 'Show'}
                                            </Text>
                                        </Pressable>
                                    </View>
                                    {confirmError && (
                                        <Text className="auth-error">{confirmError}</Text>
                                    )}
                                </View>

                                <Pressable
                                    className={clsx(
                                        'auth-button',
                                        !isFormReady && 'auth-button-disabled',
                                    )}
                                    onPress={handleSubmit}
                                    disabled={!isFormReady}
                                >
                                    <Text className="auth-button-text">
                                        {loading ? 'Creating account…' : 'Create account'}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        <View className="auth-link-row">
                            <Text className="auth-link-copy">Already have an account?</Text>
                            <Link href="/(auth)/sign-in">
                                <Text className="auth-link">Sign in</Text>
                            </Link>
                        </View>

                        {/* Required for Clerk bot protection */}
                        <View nativeID="clerk-captcha" />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
