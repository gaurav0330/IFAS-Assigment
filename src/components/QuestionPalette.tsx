import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
import { AnswersMap, Question } from '../types';

interface Props {
  questions: Question[];
  answers: AnswersMap;
  currentIndex: number;
  onJump: (index: number) => void;
}

const COLUMNS = 5;

function CellComponent({
  item,
  index,
  isCurrent,
  isAnswered,
  onJump,
}: {
  item: Question;
  index: number;
  isCurrent: boolean;
  isAnswered: boolean;
  onJump: (i: number) => void;
}) {
  return (
    <Pressable
      onPress={() => onJump(index)}
      style={[
        styles.cell,
        isAnswered && styles.cellAnswered,
        isCurrent && styles.cellCurrent,
      ]}
    >
      <Text
        style={[
          styles.cellText,
          isAnswered && styles.cellTextAnswered,
          isCurrent && styles.cellTextCurrent,
        ]}
      >
        {index + 1}
      </Text>
    </Pressable>
  );
}
const Cell = React.memo(CellComponent);

export default function QuestionPalette({ questions, answers, currentIndex, onJump }: Props) {
  const renderItem = useCallback(
    ({ item, index }: { item: Question; index: number }) => {
      const isAnswered = (answers[item.id]?.selected.length ?? 0) > 0;
      return (
        <Cell
          item={item}
          index={index}
          isCurrent={index === currentIndex}
          isAnswered={isAnswered}
          onJump={onJump}
        />
      );
    },
    [answers, currentIndex, onJump]
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.legendRow}>
        <Legend color={colors.blue} label="Current" />
        <Legend color={colors.blueTintStrong} label="Answered" textColor={colors.blueDeep} />
        <Legend color={colors.neutralBg} label="Unanswered" textColor={colors.textSecondary} />
      </View>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={COLUMNS}
        initialNumToRender={30}
        maxToRenderPerBatch={30}
        windowSize={7}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContent}
      />
    </View>
  );
}

function Legend({ color, label, textColor }: { color: string; label: string; textColor?: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendText, textColor && { color: textColor }]}>{label}</Text>
    </View>
  );
}

const CELL_SIZE = 52;

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  legendRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { ...typography.caption, color: colors.textSecondary },
  gridContent: { paddingBottom: spacing.xl },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: 5,
    borderRadius: radius.sm,
    backgroundColor: colors.neutralBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellAnswered: { backgroundColor: colors.blueTintStrong },
  cellCurrent: { backgroundColor: colors.blue },
  cellText: { ...typography.bodyStrong, color: colors.textSecondary },
  cellTextAnswered: { color: colors.blueDeep },
  cellTextCurrent: { color: colors.white },
});
