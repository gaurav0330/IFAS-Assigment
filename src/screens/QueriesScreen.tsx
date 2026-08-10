import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';
import { useUserStore } from '../store/userStore';

interface Message {
  id: string;
  text: string;
  sender: 'agent' | 'user';
  time: string;
}

export default function QueriesScreen() {
  const insets = useSafeAreaInsets();
  const profile = useUserStore((s) => s.profile);
  const examName = profile?.exam || 'NEET UG';

  const chatScrollRef = useRef<ScrollView>(null);

  const [viewState, setViewState] = useState<'options' | 'chat'>('options');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: `Hello ${profile?.firstName || 'Student'}! How can we assist your ${examName} prep today?`, sender: 'agent', time: '10:00 AM' },
  ]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (viewState === 'chat') {
      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, viewState]);

  const sendAutoReply = (userQuery: string) => {
    const queryLower = userQuery.toLowerCase();
    let replyText = "Thank you for reaching out! An academic advisor will assist you shortly.";

    if (queryLower.includes('purchase') || queryLower.includes('buy') || queryLower.includes('price') || queryLower.includes('cost')) {
      replyText = `Special offer! The ${examName} All-India Test Series is available at 20% off. Includes 60+ full length tests & detailed solutions.`;
    } else if (queryLower.includes('doubt') || queryLower.includes('question') || queryLower.includes('solution')) {
      replyText = `You can view step-by-step solutions in your Test Analysis screen after submitting any mock test.`;
    } else if (queryLower.includes('admit') || queryLower.includes('date') || queryLower.includes('schedule')) {
      replyText = `Admit cards and exam schedules for ${examName} are updated live on our Notice Board. Check the Home tab!`;
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: replyText,
          sender: 'agent',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 900);
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputText('');

    sendAutoReply(text);
  };

  const startTopicChat = (topicMessage: string) => {
    setViewState('chat');
    handleSend(topicMessage);
  };

  const renderHeader = (showClose: boolean) => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={[colors.ink, colors.blueDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 16) + 16 }]}
      >
        <View style={styles.headerSafe}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }} />
            <View style={styles.headerRight}>
              {showClose && (
                <Pressable onPress={() => setViewState('options')} style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}>
                  <Ionicons name="close-circle" size={28} color={colors.white} />
                </Pressable>
              )}
            </View>
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              Hello {profile?.firstName || 'Student'}! 👋
            </Text>
            <Text style={styles.headerSubtitle}>
              {profile?.exam ? `Queries & Help for ${profile.exam}` : 'How can we help you today?'}
            </Text>
          </View>
        </View>

        {/* Decorative Wave SVG */}
        <Svg height="90" width="100%" viewBox="0 0 1000 120" style={styles.waveSvg} preserveAspectRatio="none">
          <Path
            fill="#ffffff"
            fillOpacity="0.3"
            d="M 0,60 C 80,40, 120,90, 200,80 C 280,70, 320,10, 420,15 C 520,20, 550,75, 650,70 C 750,65, 780,25, 880,30 C 980,35, 980,75, 1000,80 L 1000,120 L 0,120 Z"
          />
          <Path
            fill={colors.paper}
            fillOpacity="1"
            d="M 0,80 C 60,110, 130,20, 220,30 C 310,40, 330,95, 420,90 C 510,85, 530,45, 600,50 C 670,55, 700,95, 800,90 C 900,85, 930,35, 1000,45 L 1000,120 L 0,120 Z"
          />
        </Svg>
      </LinearGradient>
    </View>
  );

  if (viewState === 'chat') {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {renderHeader(true)}
        <ScrollView
          ref={chatScrollRef}
          onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.messageBubble, msg.sender === 'user' ? styles.messageUser : styles.messageAgent]}>
              <Text style={[styles.messageText, msg.sender === 'user' ? styles.messageTextUser : styles.messageTextAgent]}>{msg.text}</Text>
              <Text style={[styles.messageTime, msg.sender === 'user' ? styles.messageTimeUser : styles.messageTimeAgent]}>{msg.time}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Quick Suggestion Chips */}
        <View style={styles.chipRow}>
          <Pressable style={styles.quickChip} onPress={() => handleSend("Tell me about test pricing")}>
            <Text style={styles.quickChipText}>💰 Pricing</Text>
          </Pressable>
          <Pressable style={styles.quickChip} onPress={() => handleSend("How to attempt mock test?")}>
            <Text style={styles.quickChipText}>📝 Test Guide</Text>
          </Pressable>
          <Pressable style={styles.quickChip} onPress={() => handleSend("Contact academic counselor")}>
            <Text style={styles.quickChipText}>📞 Call Us</Text>
          </Pressable>
        </View>

        <SafeAreaView edges={['bottom']} style={styles.inputAreaWrapper}>
          <View style={styles.inputArea}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor={colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
            />
            <Pressable style={({ pressed }) => [styles.sendButton, pressed && { opacity: 0.8 }]} onPress={() => handleSend()}>
              <Ionicons name="send" size={18} color={colors.white} style={styles.sendIcon} />
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader(false)}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.promptText}>Tell us what you're looking for...</Text>
        
        <Pressable
          style={({ pressed }) => [styles.optionCard, pressed && styles.optionCardPressed]}
          onPress={() => startTopicChat(`I want to purchase the ${examName} test series.`)}
        >
          <View style={styles.optionIconWrap}>
            <FontAwesome5 name="graduation-cap" size={18} color={colors.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Want to Purchase?</Text>
            <Text style={styles.optionSub}>Get discount deals on test series & courses</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.optionCard, pressed && styles.optionCardPressed]}
          onPress={() => startTopicChat(`I want to chat with a representative regarding ${examName}.`)}
        >
          <View style={styles.optionIconWrapOrange}>
            <Ionicons name="chatbubbles" size={18} color={colors.orangeDeep} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Chat with Representative</Text>
            <Text style={styles.optionSub}>Speak live with our student support counselor</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.optionCard, pressed && styles.optionCardPressed]}
          onPress={() => startTopicChat(`Please share useful links & syllabus for ${examName}.`)}
        >
          <View style={styles.optionIconWrap}>
            <MaterialCommunityIcons name="link-variant" size={18} color={colors.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Useful Links & Syllabus</Text>
            <Text style={styles.optionSub}>Download syllabus, rank predictors & free papers</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  headerContainer: {
    backgroundColor: colors.paper,
  },
  headerGradient: {
    paddingBottom: 90, // Increased to make room for taller wave
    position: 'relative',
  },
  waveSvg: {
    position: 'absolute',
    bottom: -1, // prevent 1px gap
    left: 0,
    right: 0,
  },
  headerSafe: {
    position: 'relative',
    zIndex: 1,
    paddingHorizontal: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 2,
  },
  headerContent: {
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: 10,
    paddingBottom: spacing.xxl,
  },
  promptText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1F2937', // Darker text for the prompt
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  optionCardPressed: {
    backgroundColor: colors.blueTint,
    transform: [{ scale: 0.98 }],
  },
  optionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blueTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionIconWrapOrange: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.orangeTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  optionSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chipRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
    backgroundColor: colors.paper,
  },
  quickChip: {
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.blueDeep,
  },
  chatArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  chatContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  messageBubble: {
    maxWidth: '82%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  messageAgent: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.blue,
    borderBottomRightRadius: 4,
  },
  messageText: {
    ...typography.body,
    lineHeight: 22,
  },
  messageTextAgent: {
    color: colors.textPrimary,
  },
  messageTextUser: {
    color: colors.white,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  messageTimeAgent: {
    color: colors.textMuted,
  },
  messageTimeUser: {
    color: colors.blueTintStrong,
  },
  inputAreaWrapper: {
    backgroundColor: colors.paper,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.sm : spacing.lg,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    marginRight: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    ...shadow.card,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  sendIcon: {
    marginLeft: 4,
  },
});
