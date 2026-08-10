import { Question, TestMeta } from '../types';

export const EXAM_OPTIONS = [
  'NEET UG',
  'JEE Main',
  'CUET UG',
  'CAT',
  'GATE (CS)',
];

export const QUALIFICATION_OPTIONS = [
  '10th Pass',
  '12th Pass',
  "Bachelor's Degree",
  "Master's Degree",
  'Other',
];

// A comprehensive bank of NEET UG / Science & Medical mock exam questions.
// These templates cycle to produce full-length test sets of any desired length.
const TEMPLATES: Array<Omit<Question, 'id'>> = [
  {
    type: 'MCQ',
    text: 'Which organelle is responsible for ATP synthesis during cellular respiration?',
    options: ['Lysosome', 'Mitochondrion', 'Golgi Complex', 'Endoplasmic Reticulum'],
    correctAnswerIndices: [1],
  },
  {
    type: 'MSQ',
    text: 'Which of the following nitrogenous bases are purines in nucleic acids?',
    options: ['Adenine', 'Cytosine', 'Guanine', 'Thymine'],
    correctAnswerIndices: [0, 2],
  },
  {
    type: 'MCQ',
    text: 'What is the normal resting blood pressure of a healthy adult human?',
    options: ['80/120 mmHg', '120/80 mmHg', '100/140 mmHg', '90/60 mmHg'],
    correctAnswerIndices: [1],
  },
  {
    type: 'MSQ',
    text: 'Which of the following pigments participate in light absorption during photosynthesis?',
    options: ['Chlorophyll a', 'Chlorophyll b', 'Carotenoids', 'Hemoglobin'],
    correctAnswerIndices: [0, 1, 2],
  },
  {
    type: 'MCQ',
    text: 'Which functional group is characteristic of primary alcohols?',
    options: ['-COOH', '-CHO', '-OH', '-COOR'],
    correctAnswerIndices: [2],
  },
  {
    type: 'MSQ',
    text: 'Which of the following hormones are secreted by the anterior pituitary gland?',
    options: ['Growth Hormone (GH)', 'Thyroid Stimulating Hormone (TSH)', 'Insulin', 'Adrenaline'],
    correctAnswerIndices: [0, 1],
  },
  {
    type: 'MCQ',
    text: 'What is the speed of electromagnetic waves in a vacuum?',
    options: ['3 × 10^8 m/s', '3 × 10^6 m/s', '3 × 10^5 m/s', '1.5 × 10^8 m/s'],
    correctAnswerIndices: [0],
  },
  {
    type: 'MSQ',
    text: 'Which of the following thermodynamic processes are endothermic in nature?',
    options: ['Sublimation of dry ice', 'Melting of ice', 'Condensation of steam', 'Freezing of water'],
    correctAnswerIndices: [0, 1],
  },
  {
    type: 'MCQ',
    text: 'To which phylum do earthworms belong in the animal kingdom?',
    options: ['Platyhelminthes', 'Aschelminthes', 'Annelida', 'Arthropoda'],
    correctAnswerIndices: [2],
  },
  {
    type: 'MSQ',
    text: 'Which of the following are essential amino acids for human nutrition?',
    options: ['Leucine', 'Lysine', 'Valine', 'Alanine'],
    correctAnswerIndices: [0, 1, 2],
  },
  {
    type: 'MCQ',
    text: "According to Ohm's Law, what is the mathematical relation between Voltage (V), Current (I), and Resistance (R)?",
    options: ['V = I / R', 'V = I × R', 'I = V × R', 'R = I / V'],
    correctAnswerIndices: [1],
  },
  {
    type: 'MSQ',
    text: 'Which of the following environmental factors influence enzyme catalytic activity?',
    options: ['Temperature', 'pH Level', 'Substrate Concentration', 'Gravitational pull'],
    correctAnswerIndices: [0, 1, 2],
  },
  {
    type: 'MCQ',
    text: 'What is the structural and functional unit of the human kidney?',
    options: ['Neuron', 'Nephron', 'Alveolus', 'Hepatocyte'],
    correctAnswerIndices: [1],
  },
  {
    type: 'MSQ',
    text: 'Which subatomic particles are located within the atomic nucleus of an atom?',
    options: ['Protons', 'Neutrons', 'Electrons', 'Photons'],
    correctAnswerIndices: [0, 1],
  },
  {
    type: 'MCQ',
    text: "Which atmospheric layer contains the Earth's protective ozone layer?",
    options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'],
    correctAnswerIndices: [1],
  },
  {
    type: 'MSQ',
    text: 'Which of the following statements are true regarding Meiosis cell division?',
    options: [
      'Occurs in germ cells to form gametes',
      'Results in 4 haploid daughter cells',
      'Maintains exact chromosome count in daughter cells',
      'Includes genetic crossing over',
    ],
    correctAnswerIndices: [0, 1, 3],
  },
  {
    type: 'MCQ',
    text: 'In human lungs, actual exchange of respiratory gases (O2 and CO2) occurs in the:',
    options: ['Trachea', 'Bronchioles', 'Alveoli', 'Larynx'],
    correctAnswerIndices: [2],
  },
  {
    type: 'MSQ',
    text: 'Which of the following molecules exhibit covalent bonding?',
    options: ['Methane (CH4)', 'Water (H2O)', 'Sodium Chloride (NaCl)', 'Carbon Dioxide (CO2)'],
    correctAnswerIndices: [0, 1, 3],
  },
  {
    type: 'MCQ',
    text: 'What is the pH value of pure neutral water at 25°C?',
    options: ['0', '7', '14', '1'],
    correctAnswerIndices: [1],
  },
  {
    type: 'MSQ',
    text: 'Which of the following physical quantities are vector quantities?',
    options: ['Displacement', 'Velocity', 'Force', 'Mass'],
    correctAnswerIndices: [0, 1, 2],
  },
  {
    type: 'MCQ',
    text: 'What is the phenotypic ratio of a Mendelian monohybrid cross in the F2 generation?',
    options: ['9:3:3:1', '1:2:1', '3:1', '1:1'],
    correctAnswerIndices: [2],
  },
  {
    type: 'MSQ',
    text: 'Which of the following tools are essential for Recombinant DNA technology?',
    options: ['Restriction Endonucleases', 'DNA Ligase', 'Plasmids', 'Centrioles'],
    correctAnswerIndices: [0, 1, 2],
  },
  {
    type: 'MCQ',
    text: 'Which blood vessel carries oxygenated blood from lungs back to the left atrium of the heart?',
    options: ['Pulmonary Artery', 'Pulmonary Vein', 'Superior Vena Cava', 'Aorta'],
    correctAnswerIndices: [1],
  },
  {
    type: 'MSQ',
    text: 'Which of the following tissues are plant vascular tissues responsible for transport?',
    options: ['Xylem', 'Phloem', 'Parenchyma', 'Epidermis'],
    correctAnswerIndices: [0, 1],
  },
  {
    type: 'MCQ',
    text: 'Who proposed the Special Theory of Relativity and mass-energy equivalence equation E = mc²?',
    options: ['Isaac Newton', 'Albert Einstein', 'Niels Bohr', 'Ernest Rutherford'],
    correctAnswerIndices: [1],
  },
];

/**
 * Generates a list of `count` questions by cycling through the TEMPLATES array.
 * This allows producing both a 10-question quick test and a 60-question full test
 * from the same template pool.
 */
export function generateTestQuestions(count: number): Question[] {
  return Array.from({ length: count }, (_, i) => {
    const template = TEMPLATES[i % TEMPLATES.length];
    return {
      id: `q-${i + 1}`,
      ...template,
      text: i >= TEMPLATES.length
        ? `[Set ${Math.floor(i / TEMPLATES.length) + 1}] ${template.text}`
        : template.text,
    };
  });
}

// Preset test configurations available in the app
export const TEST_CONFIGS: Record<string, TestMeta> = {
  quick: {
    examName: 'NEET UG Quick Practice Test',
    totalQuestions: 10,
    durationMinutes: 10,
    allowEarlySubmit: true,
  },
  full: {
    examName: 'NEET UG Full Length Grand Test',
    totalQuestions: 30,
    durationMinutes: 45,
    allowEarlySubmit: true,
  },
};
