import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScreenContainer from '../components/ScreenContainer';
import TextField from '../components/TextField';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { colors, radius, spacing, typography } from '../theme/theme';
import { EXAM_OPTIONS, QUALIFICATION_OPTIONS } from '../data/mockQuestions';
import { Gender, ProfileFormData } from '../types';
import {
  calculateAge,
  validateDob,
  validateEmail,
  validateFirstName,
  validateLastName,
} from '../utils/validation';
import { useUserStore } from '../store/userStore';

const OTP_CODE = '1234';
const RESEND_COOLDOWN = 30;
const GENDER_OPTIONS: Gender[] = ['Male', 'Female'];

export default function ProfileScreen({ navigation }: any) {
  const profile = useUserStore((s) => s.profile);
  const saveProfile = useUserStore((s) => s.saveProfile);

  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [emailVerified, setEmailVerified] = useState(profile?.emailVerified || false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const [dob, setDob] = useState<Date | null>(profile?.dob ? new Date(profile.dob) : null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<Gender | null>(profile?.gender || null);
  const [exam, setExam] = useState<string | null>(profile?.exam || null);
  const [qualification, setQualification] = useState<string | null>(profile?.qualification || null);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(!!profile);

  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cooldown <= 0) {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
      return;
    }
    cooldownRef.current = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, [cooldown > 0]);

  const firstNameError = touched.firstName ? validateFirstName(firstName) : null;
  const lastNameError = touched.lastName ? validateLastName(lastName) : null;
  const emailError = touched.email ? validateEmail(email) : null;
  const dobError = touched.dob ? validateDob(dob) : null;

  const isFormValid = useMemo(() => {
    return (
      !validateFirstName(firstName) &&
      !validateLastName(lastName) &&
      !validateEmail(email) &&
      emailVerified &&
      !validateDob(dob) &&
      !!gender &&
      !!exam &&
      !!qualification
    );
  }, [firstName, lastName, email, emailVerified, dob, gender, exam, qualification]);

  function openOtpModal() {
    const err = validateEmail(email);
    setTouched((t) => ({ ...t, email: true }));
    if (err) return;
    setOtpInput('');
    setOtpError(null);
    setOtpModalOpen(true);
    setCooldown(RESEND_COOLDOWN);
  }

  function handleVerifyOtp() {
    if (otpInput === OTP_CODE) {
      setEmailVerified(true);
      setOtpModalOpen(false);
    } else {
      setOtpError('Incorrect code. Try 1234 for this demo.');
    }
  }

  function handleResend() {
    if (cooldown > 0) return;
    setCooldown(RESEND_COOLDOWN);
    setOtpError(null);
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (emailVerified) setEmailVerified(false);
  }

  const [submitting, setSubmitting] = useState(false);

  function handleSubmit() {
    setTouched({ firstName: true, lastName: true, email: true, dob: true });
    if (!isFormValid) return;

    setSubmitting(true);
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();

    const payload: ProfileFormData = {
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: trimmedEmail,
      emailVerified,
      dob: dob ? dob.toISOString() : null,
      gender,
      exam,
      qualification,
    };
    console.log('Profile submitted payload:', payload);
    saveProfile(payload);

    setTimeout(() => {
      setSubmitting(false);
      navigation.navigate('HomeTab');
    }, 600);
  }

  return (
    <ScreenContainer noPadding>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoWrap}>
              <Logo size="md" />
            </View>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>STUDENT ONBOARDING</Text>
            </View>
            <Text style={styles.title}>Complete your profile</Text>
            <Text style={styles.subtitle}>
              A few details so we can personalise your prep.
            </Text>
          </View>

          {/* Elevated Form Card Container */}
          <View style={styles.formCard}>
            <TextField
              label="First name"
              placeholder="e.g. Gaurav"
              value={firstName}
              onChangeText={setFirstName}
              onBlur={() => {
                setFirstName((v) => v.trim());
                setTouched((t) => ({ ...t, firstName: true }));
              }}
              error={firstNameError}
              autoCapitalize="words"
            />
            <TextField
              label="Last name"
              placeholder="e.g. Jikar"
              value={lastName}
              onChangeText={setLastName}
              onBlur={() => {
                setLastName((v) => v.trim());
                setTouched((t) => ({ ...t, lastName: true }));
              }}
              error={lastNameError}
              autoCapitalize="words"
            />
            <TextField
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={handleEmailChange}
              onBlur={() => {
                setEmail((v) => v.trim());
                setTouched((t) => ({ ...t, email: true }));
              }}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              rightElement={
                emailVerified ? (
                  <View style={styles.verifiedPill}>
                    <Text style={styles.verifiedPillText}>Verified ✓</Text>
                  </View>
                ) : (
                  <Pressable onPress={openOtpModal} hitSlop={8}>
                    <Text style={styles.verifyLink}>Verify</Text>
                  </Pressable>
                )
              }
            />

            <View style={styles.wrap}>
              <Text style={styles.label}>Date of birth</Text>
              <Pressable
                style={[styles.trigger, dobError && styles.triggerError]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={dob ? styles.valueText : styles.placeholderText}>
                  {dob ? dob.toLocaleDateString() : 'Select date of birth'}
                </Text>
              </Pressable>
              {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}
              {dob && !dobError ? (
                <Text style={styles.hint}>Age: {calculateAge(dob)} years</Text>
              ) : null}
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={dob ?? new Date(2000, 0, 1)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={(_event, selected) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selected) {
                    setDob(selected);
                    setTouched((t) => ({ ...t, dob: true }));
                  }
                }}
              />
            )}

            <Dropdown
              label="Gender"
              value={gender}
              options={GENDER_OPTIONS}
              onChange={(v) => setGender(v as Gender)}
            />
            <Dropdown label="Exam" value={exam} options={EXAM_OPTIONS} onChange={setExam} />
            <Dropdown
              label="Qualification"
              value={qualification}
              options={QUALIFICATION_OPTIONS}
              onChange={setQualification}
            />

            <Button
              label={submitting ? 'Saving profile...' : 'Submit profile'}
              loading={submitting}
              onPress={handleSubmit}
              disabled={!isFormValid || submitting}
              style={{ marginTop: spacing.md }}
            />
            {profile && (
              <Button
                label="Reset Profile (Clear Data)"
                variant="ghost"
                onPress={() => {
                  useUserStore.getState().clearProfile();
                  setFirstName('');
                  setLastName('');
                  setEmail('');
                  setEmailVerified(false);
                  setDob(null);
                  setGender(null);
                  setExam(null);
                  setQualification(null);
                }}
                style={{ marginTop: spacing.xs }}
              />
            )}
            {!isFormValid && (
              <Text style={styles.hintCenter}>
                Fill in all fields and verify your email to continue.
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {otpModalOpen && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Verify your email</Text>
            <Text style={styles.modalBody}>
              We sent a 4-digit code to {email}. Enter it below (demo code: 1234).
            </Text>
            <TextField
              label="OTP code"
              placeholder="1234"
              value={otpInput}
              onChangeText={setOtpInput}
              keyboardType="number-pad"
              maxLength={4}
              error={otpError}
            />
            <Button label="Verify code" onPress={handleVerifyOtp} />
            <Pressable
              onPress={handleResend}
              disabled={cooldown > 0}
              style={{ marginTop: spacing.md, alignItems: 'center' }}
            >
              <Text style={[styles.resendText, cooldown > 0 && styles.resendDisabled]}>
                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
              </Text>
            </Pressable>
            <Button
              label="Cancel"
              variant="ghost"
              onPress={() => setOtpModalOpen(false)}
              style={{ marginTop: spacing.xs }}
            />
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: spacing.lg, paddingBottom: spacing.xxxl },
  header: { marginBottom: spacing.lg, alignItems: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: spacing.sm },
  stepBadge: {
    backgroundColor: colors.blueTint,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  stepBadgeText: { fontSize: 10, fontWeight: '800', color: colors.blue, letterSpacing: 0.8 },
  title: { ...typography.display, color: colors.textPrimary, marginTop: 4, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  wrap: { marginBottom: spacing.lg },
  label: { ...typography.caption, color: colors.textSecondary, marginBottom: 6, textTransform: 'uppercase' },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  triggerError: { borderColor: colors.wrong, backgroundColor: colors.wrongBg },
  valueText: { fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  placeholderText: { fontSize: 15, color: colors.textMuted },
  errorText: { color: colors.wrong, fontSize: 12, marginTop: 4, fontWeight: '600' },
  hint: { color: colors.blue, fontSize: 12, marginTop: 6, fontWeight: '600' },
  hintCenter: { color: colors.textMuted, fontSize: 12, marginTop: spacing.sm, textAlign: 'center' },
  verifyLink: { color: colors.blue, fontWeight: '700', fontSize: 13, backgroundColor: colors.blueTint, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill },
  verifiedPill: {
    backgroundColor: colors.correctBg,
    borderColor: colors.correctBorder,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  verifiedPillText: { color: colors.correct, fontWeight: '700', fontSize: 12 },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.correctBg,
    borderWidth: 2,
    borderColor: colors.correctBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successCheck: { fontSize: 36, color: colors.correct, fontWeight: '800' },
  successTitle: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  successBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  modalTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: 6 },
  modalBody: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  resendText: { color: colors.blue, fontWeight: '600', fontSize: 13 },
  resendDisabled: { color: colors.textMuted },
});
