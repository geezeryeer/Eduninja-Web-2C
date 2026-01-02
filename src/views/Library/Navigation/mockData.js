/**
 * Mock 知识点数据 - 包含详细的学习目标和内容描述
 * 这些数据通常从 Syllabus PDF 中提取
 */
export const mockKnowledgePoints = [
  {
    id: 'topic-1',
    name: 'Topic 1: Cell Biology',
    pdfSource: {
      fileName: 'IB_Biology_Syllabus_2023.pdf',
      pages: '12-18'
    },
    children: [
      { 
        id: '1.1', 
        name: '1.1 Introduction to cells',
        description: 'An introduction to cell theory and the basic characteristics of living organisms at the cellular level.',
        learningObjectives: [
          'Outline the cell theory',
          'Discuss the evidence for the cell theory',
          'State that unicellular organisms carry out all the functions of life',
          'Compare the relative sizes of molecules, cell membrane thickness, viruses, bacteria, organelles and cells',
          'Calculate the linear magnification of drawings and the actual size of specimens from drawings',
          'Explain the importance of the surface area to volume ratio as a factor limiting cell size'
        ],
        keyConcepts: [
          'Cell Theory',
          'Unicellular Organisms',
          'Magnification',
          'Surface Area to Volume Ratio'
        ]
      },
      { 
        id: '1.2', 
        name: '1.2 Ultrastructure of cells',
        description: 'Study of the internal structure of cells as revealed by electron microscopy, including prokaryotic and eukaryotic cells.',
        learningObjectives: [
          'Draw and label a diagram of the ultrastructure of a liver cell as an example of an animal cell',
          'Annotate a diagram of an animal cell to show the function of each organelle',
          'Draw and label a diagram of the ultrastructure of a palisade cell as an example of a plant cell',
          'State the function of each organelle in a plant cell',
          'Compare prokaryotic and eukaryotic cells',
          'State that prokaryotic cells divide by binary fission'
        ],
        keyConcepts: [
          'Eukaryotic Cells',
          'Prokaryotic Cells',
          'Organelles',
          'Binary Fission',
          'Cell Ultrastructure'
        ]
      },
      { 
        id: '1.3', 
        name: '1.3 Membrane structure',
        description: 'Understanding the fluid mosaic model of membrane structure and the role of cholesterol and glycoproteins.',
        learningObjectives: [
          'Draw and label a diagram to show the structure of membranes',
          'Explain how the hydrophobic and hydrophilic properties of phospholipids help to maintain the structure of cell membranes',
          'List the functions of membrane proteins, including hormone binding sites, enzymes, electron carriers, channels for passive transport and pumps for active transport',
          'Define diffusion and osmosis',
          'Explain passive transport across membranes by simple diffusion and facilitated diffusion'
        ],
        keyConcepts: [
          'Fluid Mosaic Model',
          'Phospholipid Bilayer',
          'Membrane Proteins',
          'Hydrophobic/Hydrophilic'
        ]
      },
      { 
        id: '1.4', 
        name: '1.4 Membrane transport',
        description: 'Study of active and passive transport mechanisms across cell membranes.',
        learningObjectives: [
          'Explain passive transport across membranes by simple diffusion and facilitated diffusion',
          'Explain the role of protein pumps and ATP in active transport across membranes',
          'Explain how vesicles are used to transport materials within a cell between the RER, Golgi apparatus and plasma membrane',
          'Describe how the fluidity of the membrane allows it to change shape, break and reform during endocytosis and exocytosis'
        ],
        keyConcepts: [
          'Active Transport',
          'Passive Transport',
          'Endocytosis',
          'Exocytosis',
          'Protein Pumps'
        ]
      },
      { 
        id: '1.5', 
        name: '1.5 The origin of cells',
        description: 'Understanding theories about the origin of the first cells on Earth.',
        learningObjectives: [
          'Outline the four processes needed for the spontaneous origin of life on Earth',
          'Outline the experiments of Miller and Urey into the origin of organic compounds',
          'State that prokaryotic cells were the first type of cell to evolve',
          'Explain the endosymbiotic theory for the origin of eukaryotes'
        ],
        keyConcepts: [
          'Spontaneous Origin of Life',
          'Miller-Urey Experiment',
          'Endosymbiotic Theory',
          'Evolution of Cells'
        ]
      },
      { 
        id: '1.6', 
        name: '1.6 Cell division',
        description: 'Study of mitosis and the cell cycle, including the importance of cell division in growth and repair.',
        learningObjectives: [
          'State that growth, embryonic development, tissue repair and asexual reproduction involve mitosis',
          'Explain the importance of mitosis in producing genetically identical daughter cells',
          'State that interphase is an active period in the life of a cell when many metabolic reactions occur',
          'Describe the events that occur in the four phases of mitosis',
          'State that tumours (cancers) are the result of uncontrolled cell division',
          'State that these can occur in any organ or tissue'
        ],
        keyConcepts: [
          'Mitosis',
          'Cell Cycle',
          'Interphase',
          'Cancer',
          'Cell Division'
        ]
      }
    ]
  },
  {
    id: 'topic-2',
    name: 'Topic 2: Molecular Biology',
    pdfSource: {
      fileName: 'IB_Biology_Syllabus_2023.pdf',
      pages: '19-28'
    },
    children: [
      { 
        id: '2.1', 
        name: '2.1 Molecules to metabolism',
        description: 'Introduction to the molecular basis of life and metabolic pathways.',
        learningObjectives: [
          'Explain the importance of carbon compounds in living organisms',
          'Distinguish between organic and inorganic compounds',
          'Identify biochemicals such as sugars, lipids or amino acids from molecular diagrams',
          'List three examples each of monosaccharides, disaccharides and polysaccharides',
          'State one function of glucose, lactose and glycogen in animals, and of fructose, sucrose and cellulose in plants',
          'Outline the role of condensation and hydrolysis in the relationship between monosaccharides, disaccharides and polysaccharides'
        ],
        keyConcepts: [
          'Carbon Compounds',
          'Metabolism',
          'Organic Molecules',
          'Condensation',
          'Hydrolysis'
        ]
      },
      { 
        id: '2.2', 
        name: '2.2 Water',
        description: 'Understanding the unique properties of water and their importance for life.',
        learningObjectives: [
          'Outline the thermal, cohesive and solvent properties of water',
          'Explain the relationship between the properties of water and its uses in living organisms as a coolant, medium for metabolic reactions and transport medium'
        ],
        keyConcepts: [
          'Water Properties',
          'Hydrogen Bonding',
          'Cohesion',
          'Thermal Properties',
          'Solvent'
        ]
      },
      { 
        id: '2.3', 
        name: '2.3 Carbohydrates and lipids',
        description: 'Study of the structure and function of carbohydrates and lipids in living organisms.',
        learningObjectives: [
          'Distinguish between monosaccharides, disaccharides and polysaccharides',
          'State the composition of a triglyceride',
          'Distinguish between saturated and unsaturated fatty acids',
          'State the function of lipids in energy storage, thermal insulation and cell membrane structure',
          'Compare the use of carbohydrates and lipids in energy storage'
        ],
        keyConcepts: [
          'Carbohydrates',
          'Lipids',
          'Triglycerides',
          'Fatty Acids',
          'Energy Storage'
        ]
      },
      { 
        id: '2.4', 
        name: '2.4 Proteins',
        description: 'Understanding protein structure, from amino acids to quaternary structure, and protein function.',
        learningObjectives: [
          'Explain the four levels of protein structure, indicating the significance of each level',
          'Outline the difference between fibrous and globular proteins, with reference to two examples of each protein type',
          'Explain the significance of polar and non-polar amino acids',
          'State four functions of proteins, giving a named example of each'
        ],
        keyConcepts: [
          'Amino Acids',
          'Primary Structure',
          'Secondary Structure',
          'Tertiary Structure',
          'Quaternary Structure',
          'Denaturation'
        ]
      },
      { 
        id: '2.5', 
        name: '2.5 Enzymes',
        description: 'Study of enzyme structure, function, and factors affecting enzyme activity.',
        learningObjectives: [
          'State that metabolic reactions are catalyzed by enzymes',
          'Explain enzyme-substrate specificity',
          'Explain the effects of temperature, pH and substrate concentration on enzyme activity',
          'Define denaturation',
          'Explain the difference between competitive and non-competitive inhibition'
        ],
        keyConcepts: [
          'Enzyme Catalysis',
          'Active Site',
          'Substrate Specificity',
          'Enzyme Inhibition',
          'Denaturation'
        ]
      },
      { 
        id: '2.6', 
        name: '2.6 Structure of DNA and RNA',
        description: 'Understanding the molecular structure of nucleic acids.',
        learningObjectives: [
          'Draw and label a simple diagram of the molecular structure of DNA and RNA',
          'Outline DNA nucleotide structure in terms of sugar (deoxyribose), base and phosphate',
          'State the names of the four bases in DNA',
          'Outline how DNA nucleotides are linked together by covalent bonds into a single strand',
          'Explain how a DNA double helix is formed using complementary base pairing and hydrogen bonds',
          'Explain how DNA replication depends on complementary base pairing'
        ],
        keyConcepts: [
          'DNA Structure',
          'RNA Structure',
          'Nucleotides',
          'Base Pairing',
          'Double Helix'
        ]
      },
      { 
        id: '2.7', 
        name: '2.7 DNA replication, transcription and translation',
        description: 'Understanding the central dogma of molecular biology: DNA → RNA → Protein.',
        learningObjectives: [
          'Explain DNA replication in terms of unwinding the double helix and separation of strands by helicase',
          'Explain the process of transcription in prokaryotes, including the role of RNA polymerase',
          'Describe the genetic code in terms of codons composed of triplets of bases',
          'Explain the process of translation, including ribosomes, tRNA, codons and anticodons',
          'Discuss the relationship between one gene and one polypeptide'
        ],
        keyConcepts: [
          'DNA Replication',
          'Transcription',
          'Translation',
          'Genetic Code',
          'Codons',
          'Ribosomes'
        ]
      },
      { 
        id: '2.8', 
        name: '2.8 Cell respiration',
        description: 'Study of aerobic and anaerobic respiration pathways and ATP production.',
        learningObjectives: [
          'State that oxidation involves the loss of electrons from an element, whereas reduction involves a gain of electrons',
          'Outline the process of glycolysis, including phosphorylation, lysis, oxidation and ATP formation',
          'Draw and label a diagram showing the structure of a mitochondrion',
          'Explain aerobic respiration, including the link reaction, the Krebs cycle, the role of NADH + H+, the electron transport chain',
          'Explain oxidative phosphorylation in terms of chemiosmosis',
          'Explain the relationship between the structure of the mitochondrion and its function'
        ],
        keyConcepts: [
          'Glycolysis',
          'Krebs Cycle',
          'Electron Transport Chain',
          'ATP',
          'Aerobic Respiration',
          'Anaerobic Respiration'
        ]
      },
      { 
        id: '2.9', 
        name: '2.9 Photosynthesis',
        description: 'Understanding light-dependent and light-independent reactions in photosynthesis.',
        learningObjectives: [
          'Draw and label a diagram showing the structure of a chloroplast',
          'State that photosynthesis consists of light-dependent and light-independent reactions',
          'Explain the light-dependent reactions, including photoactivation of chlorophyll',
          'Explain the light-independent reactions, including the fixation of carbon dioxide and the reduction of glycerate 3-phosphate to triose phosphate',
          'Explain the relationship between the structure of the chloroplast and its function'
        ],
        keyConcepts: [
          'Chloroplast Structure',
          'Light-dependent Reactions',
          'Light-independent Reactions',
          'Calvin Cycle',
          'Photosystems'
        ]
      }
    ]
  },
  {
    id: 'topic-6',
    name: 'Topic 6: Human Physiology',
    pdfSource: {
      fileName: 'IB_Biology_Syllabus_2023.pdf',
      pages: '45-56'
    },
    children: [
      { 
        id: '6.1', 
        name: '6.1 Digestion and absorption',
        description: 'Understanding the structure and function of the human digestive system.',
        learningObjectives: [
          'Explain why digestion of large food molecules is essential',
          'Explain the need for enzymes in digestion',
          'State the source, substrate, products and optimum pH conditions for amylase, pepsin and lipase',
          'Draw and label a diagram of the digestive system',
          'Outline the function of the stomach, small intestine and large intestine',
          'Distinguish between absorption and assimilation',
          'Explain how the structure of the villus is related to its role in absorption and transport of the products of digestion'
        ],
        keyConcepts: [
          'Digestive Enzymes',
          'Digestion',
          'Absorption',
          'Villi',
          'Small Intestine'
        ]
      },
      { 
        id: '6.2', 
        name: '6.2 The blood system',
        description: 'Study of the structure and function of the cardiovascular system.',
        learningObjectives: [
          'Draw and label a diagram of the heart showing the four chambers, associated blood vessels, valves and the route of blood through the heart',
          'State that the coronary arteries supply the heart muscle with oxygen and nutrients',
          'Explain the action of the heart in terms of collecting blood, pumping blood, and opening and closing of valves',
          'Outline the control of the heartbeat in terms of myogenic muscle contraction, the role of the pacemaker, nerves and adrenaline',
          'Explain the relationship between the structure and function of arteries, capillaries and veins'
        ],
        keyConcepts: [
          'Heart Structure',
          'Blood Circulation',
          'Blood Vessels',
          'Cardiac Cycle',
          'Heart Rate Control'
        ]
      },
      { 
        id: '6.3', 
        name: '6.3 Defence against infectious disease',
        description: 'Understanding the immune system and how the body defends against pathogens.',
        learningObjectives: [
          'Define pathogen',
          'Explain why antibiotics are effective against bacteria but not against viruses',
          'Outline the role of skin and mucous membranes in defence against pathogens',
          'Outline how phagocytic leucocytes ingest pathogens in the blood and in body tissues',
          'Distinguish between antigens and antibodies',
          'Explain antibody production',
          'Outline the principle of challenge and response, clonal selection and memory cells as the basis of immunity',
          'Define active and passive immunity'
        ],
        keyConcepts: [
          'Pathogens',
          'Immune System',
          'Antibodies',
          'Antigens',
          'Phagocytosis',
          'Immunity'
        ]
      },
      { 
        id: '6.4', 
        name: '6.4 Gas exchange',
        description: 'Study of the structure and function of the respiratory system.',
        learningObjectives: [
          'Define ventilation',
          'Draw and label a diagram of the ventilation system, including trachea, lungs, bronchi, bronchioles and alveoli',
          'Explain the mechanism of ventilation of the lungs in terms of volume and pressure changes caused by the internal and external intercostal muscles, the diaphragm and abdominal muscles',
          'Explain the role of alveoli in gas exchange'
        ],
        keyConcepts: [
          'Ventilation',
          'Gas Exchange',
          'Alveoli',
          'Respiratory System',
          'Breathing Mechanism'
        ]
      },
      { 
        id: '6.5', 
        name: '6.5 Neurons and synapses',
        description: 'Understanding the structure and function of the nervous system at cellular level.',
        learningObjectives: [
          'Draw and label a diagram of the structure of a motor neuron',
          'State that nerve impulses are conducted from receptors to the CNS by sensory neurons, within the CNS by relay neurons, and from the CNS to effectors by motor neurons',
          'Define resting potential and action potential',
          'Explain how a nerve impulse passes along a non-myelinated neuron',
          'Explain the principles of synaptic transmission',
          'State that there are excitatory and inhibitory neurotransmitters'
        ],
        keyConcepts: [
          'Neurons',
          'Action Potential',
          'Synapses',
          'Neurotransmitters',
          'Nerve Impulse'
        ]
      },
      { 
        id: '6.6', 
        name: '6.6 Hormones, homeostasis and reproduction',
        description: 'Study of endocrine system, homeostatic mechanisms and human reproductive system.',
        learningObjectives: [
          'State that the endocrine system consists of glands that release hormones',
          'State that homeostasis involves maintaining the internal environment between limits, including blood pH, carbon dioxide concentration, blood glucose concentration, body temperature and water balance',
          'Explain that homeostasis involves monitoring levels of variables and correcting changes in levels by negative feedback mechanisms',
          'Explain the control of blood glucose concentration, including the roles of glucagon, insulin and α and β cells in the pancreatic islets',
          'Distinguish between type I and type II diabetes',
          'Annotate diagrams of the male and female reproductive systems',
          'Outline the role of hormones in the menstrual cycle'
        ],
        keyConcepts: [
          'Hormones',
          'Homeostasis',
          'Blood Glucose',
          'Insulin',
          'Glucagon',
          'Menstrual Cycle',
          'Reproduction'
        ]
      }
    ]
  }
]

