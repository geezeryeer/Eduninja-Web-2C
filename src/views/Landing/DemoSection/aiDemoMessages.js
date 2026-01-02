/**
 * AI Demo Messages Configuration
 * 
 * 集中管理所有 AI 功能的示例对话内容
 * 包含三种 AI 功能场景的用户问题和 AI 回复
 */

export const AI_DEMO_CONVERSATIONS = {
  // ==================== 示例 1: 考试预测功能 ====================
  prediction: {
    user: 'Can you predict high-frequency topics for IB Biology HL Paper 2 in May 2025?',
    assistant: `Based on analysis of **IB Biology new syllabus (2023-2029)** [2] and **past exam patterns (2020-2024)** [1], here are the high-probability topics for May 2025 HL Paper 2:

### 📊 High-Frequency Topics & Common Question Types

| Topic | Appearances | Common Question Types |
|-------|-------------|----------------------|
| Immune System | 19/20 (95%) | Antibody structure-function (14×), Active vs passive immunity (11×) |
| Cell Respiration | 18/20 (90%) | Electron transport chain diagram (15×), Glycolysis mechanism (12×), ATP yield (8×) |
| Gas Exchange | 17/20 (85%) | Oxygen dissociation curves (10×), Ventilation mechanisms (8×) |
| Photosynthesis | 16/20 (80%) | Calvin cycle with limiting factors (13×), Light reactions (11×) |
| Ecosystems | 15/20 (75%) | Energy flow & pyramids (9×), Nutrient cycles (7×) |
| Gene Expression | 14/20 (70%) | Epigenetic regulation (7×), Transcription control (6×) |
| Cardiac Cycle | 13/20 (65%) | ECG interpretation (6×), Heart structure (5×) |
| Neural Signaling | 12/20 (60%) | Synaptic transmission (8×), Action potentials (7×) |

### 🔥 High-Priority Topics for May 2025

**Theme B: Form and Function (50-60% of Paper 2)**

1. **Cell Respiration** - 90% frequency
   - Electron transport chain mechanisms
   - Chemiosmosis and ATP synthase
   - Mitochondrial structure-function relationships

2. **Immune Response** - 95% frequency
   - Antibody structure and antigen recognition
   - Clonal selection and memory cells
   - Active vs passive immunity comparison

3. **Photosynthesis** - 80% frequency
   - Calvin cycle with limiting factors
   - Light-independent reactions
   - RuBisCO function and regulation

**Theme D: Continuity and Change (20-30% of Paper 2)**

4. **Gene Expression & Regulation** - 70% frequency, trending up
   - Epigenetic modifications (methylation, acetylation)
   - Transcription control mechanisms
   - Prokaryotic vs eukaryotic gene regulation

**Theme C: Interaction and Interdependence (15-20% of Paper 2)**

5. **Ecosystem Dynamics** - 75% frequency
   - Energy flow and trophic efficiency
   - Carbon and nitrogen cycles

### 📝 Study Recommendations

1. **Data Analysis** - 60% of questions include graphs/tables [1]
2. **Process Diagrams** - Practice drawing ETC and Calvin cycle
3. **Cross-Theme Integration** - Theme B + D questions in 80% of exams [1]
4. **Command Terms** - "Explain" needs mechanisms; "Describe" needs observations only

> **Note:** Integrated questions (cell respiration + gas exchange) appeared in 8/10 recent exams [1]. New syllabus emphasizes cross-theme connections [2].`
  },

  // ==================== 示例 2: 拍照搜题功能 ====================
  photo: {
    user: 'Can you help me solve this Biology question about mitochondrial structure?',
    imageUrl: '/images/2_paper.png', // 示例题目图片
    // 找到的相关原题
    questions: [
      {
        id: 'photo-q1',
        imageKey: '/images/5_a_paper.png',
        answerImageKey: '/images/5_a_answer.png',
        title: 'Similar Question from Past Papers',
        knowledgePoint: 'Cell Structure',
        difficulty: 'Medium',
        questionType: 'Extended Response'
      }
    ],
    assistant: `### 📋 Question Information

**Year:** 2023 May Paper 2  
**Question Type:** Extended Response (6 marks)  
**Theme:** A - Unity and Diversity

---

### 🎯 Knowledge Points Covered

This question tests understanding of:
- **Mitochondrial structure** (cristae, matrix, double membrane)
- **Structure-function relationship** in organelles
- **Cell respiration** and ATP synthesis
- **Electron transport chain** (ETC) mechanism

These concepts appear in **14/20 past papers (70%)** [1] and are frequently combined with cell respiration pathways.

---

### ⚠️ Common Difficulties

**1. Linking structure to function**  
Many students describe the cristae structure but fail to explain *why* the folded shape increases ATP production. You need to establish a causal chain: folded membrane → increased surface area → more ETC proteins → more ATP synthesis.

**2. Quantifying the effect**  
Examiners reward specific details. State that cristae increase surface area by **3-5× compared to smooth membrane**, allowing significantly more ATP synthase enzymes.

**3. Missing the mechanism**  
Don't just say "cristae make ATP." Explain that more surface area accommodates more electron transport chain proteins, which pump more protons to create a stronger gradient for ATP synthase.

---

### 📊 Key Data for Your Answer

| Component | Structure | Function | IB Focus |
|-----------|-----------|----------|----------|
| Cristae | Folded inner membrane | Increases surface area 3-5× | More space for ETC proteins |
| Matrix | Enzyme-filled space | Krebs cycle location | Substrate concentration |
| Double Membrane | Inner + outer bilayer | Maintains proton gradient | Chemiosmosis mechanism |

---

### ✅ Model Answer Strategy (6 marks)

1. **State structure:** Cristae are folds in the inner mitochondrial membrane
2. **Quantify:** This increases surface area by 3-5 times
3. **Connect to proteins:** More surface area = more ETC proteins and ATP synthase
4. **Link to ATP:** More electron transport → stronger proton gradient → more ATP synthesis
5. **Add context:** Cells with high energy needs (e.g., muscle) have more cristae
6. **Use terminology:** Mention chemiosmosis, oxidative phosphorylation

> 💡 The question card above shows the original question and detailed answer. Click "View Answer" to see the complete model response.

---

**Would you like me to show you similar questions from other years for practice?** I can find questions with the same knowledge points or difficulty level.`
  },

  // ==================== 示例 3: 智能组卷功能 ====================
  paper: {
    user: 'Can you help me create a practice paper for IB Biology Theme B?',
    // 示例题目数据
    questions: [
      {
        id: 'demo-q1',
        imageKey: '/images/2_paper.png',
        answerImageKey: '/images/5_a_answer.png',
        title: 'Question 1',
        knowledgePoint: 'Cell Respiration',
        difficulty: 'Medium',
        questionType: 'Extended Response'
      },
      {
        id: 'demo-q2',
        imageKey: '/images/5_a_paper.png',
        title: 'Question 2',
        knowledgePoint: 'Photosynthesis',
        difficulty: 'Hard',
        questionType: 'Data Analysis'
      }
    ],
    assistant: `I'll create a custom practice paper for **IB Biology Theme B: Form and Function** based on new syllabus (2023-2029) and past exam data (2020-2024).

### 📊 Theme B Historical Data (2020-2024)

| Topic Area | Exam Frequency | Times Asked |
|------------|----------------|-------------|
| Immune System | 19/20 (95%) | 19× |
| Cell Respiration | 18/20 (90%) | 18× |
| Gas Exchange | 17/20 (85%) | 17× |
| Photosynthesis | 16/20 (80%) | 16× |
| Cardiac Cycle | 13/20 (65%) | 13× |
| Neural Signaling | 12/20 (60%) | 12× |

**Theme B Overview:**
- Represents 50-60% of Paper 2 marks
- 65% of questions include data analysis
- Difficulty: 25% Easy, 50% Medium, 25% Hard

### Paper Configuration
- **Theme B - Form and Function** | IB Biology HL
- **45 marks** | 50 minutes
- **Extended Response** (short + long answer)
- **Target:** 70-75% success rate

### 📋 Intelligent Question Distribution

| Content Area | Questions | Marks | Difficulty | Exam Frequency | Priority |
|--------------|-----------|-------|------------|----------------|----------|
| Cell Respiration | 3 | 15 | Medium-High | 90% (18×) | ⭐⭐⭐ |
| Photosynthesis | 2 | 12 | High | 80% (16×) | ⭐⭐⭐ |
| Immune System | 2 | 10 | Medium | 95% (19×) | ⭐⭐⭐ |
| Gas Exchange | 1 | 8 | Medium | 85% (17×) | ⭐⭐ |

### 🎯 Question Breakdown

**1. Cell Respiration (15 marks)**
   - Q1: Glycolysis mechanism (4 marks) - 12× appearances
   - Q2: Electron transport chain diagram (6 marks) - 15× 
   - Q3: ATP yield calculation (5 marks) - 8×

**2. Photosynthesis (12 marks)**
   - Q4: Calvin cycle process (5 marks) - 13×
   - Q5: Limiting factors graph (7 marks) - 9×

**3. Immune System (10 marks)**
   - Q6: Antibody structure-function (4 marks) - 14×
   - Q7: Active vs passive immunity (6 marks) - 11×

**4. Gas Exchange (8 marks)**
   - Q8: O₂ dissociation curve (8 marks) - 10×

### 📈 Question Type Distribution

| Question Type | Count | Total Marks | Exam Frequency | Included |
|---------------|-------|-------------|----------------|----------|
| Process Diagrams | 2 | 10 | 70% of papers | ✅ (Q2, Q4) |
| Graph/Data Analysis | 2 | 15 | 65% of papers | ✅ (Q5, Q8) |
| Calculations | 1 | 5 | 35% of papers | ✅ (Q3) |
| Compare/Contrast | 1 | 6 | 45% of papers | ✅ (Q7) |
| Structure-Function | 2 | 9 | 55% of papers | ✅ (Q1, Q6) |

### 📊 Difficulty Curve (Evidence-Based)

**Marks by Difficulty Level:**
- **Medium (11 marks, 24%):** Q1, Q4, Q6 | Build foundation
- **Medium-High (23 marks, 51%):** Q2, Q5, Q7, Q8 | Core challenge zone
- **High (11 marks, 25%):** Q3 (calculations) | Stretch goal

> This distribution matches real IB exam patterns and targets your optimal learning zone (70-75% success rate).

### 💡 Included Features

| Feature | Description |
|---------|-------------|
| 🎯 Adaptive Difficulty | 70-75% target success rate |
| 📄 IB-Style Format | Matches real exam layout |
| ✅ Mark Schemes | Point-by-point with common errors |
| ⏱️ Time Guide | Suggested pace per question |
| 📊 Error Analysis | High-risk areas highlighted |

> **Smart Weighting:** 60% marks to Cell Respiration & Photosynthesis (matches 85% combined appearance in real exams)

### 🔎 Searching Question Database...

Analyzing over **10,000+ past paper questions** from IB Biology archives...

### 🔍 Matched Questions from Database

I found **2 relevant questions** from our question bank that match your criteria:

> 💡 **Tip:** Click on any question image to view it in full screen. Questions with answers can be expanded by clicking "View Answer".`
  }
}

/**
 * 将对话配置转换为消息格式
 * @returns {Object} 包含各模式消息数组的对象
 */
export function convertToMessages() {
  return Object.keys(AI_DEMO_CONVERSATIONS).reduce((acc, mode) => {
    const conversation = AI_DEMO_CONVERSATIONS[mode]
    
    // Debug: 打印 photo 模式的 questions
    if (mode === 'photo') {
      console.log('Photo mode questions:', conversation.questions)
    }
    
    acc[mode] = [
      {
        id: 1,
        role: 'user',
        content: conversation.user,
        imageUrl: conversation.imageUrl || '', // 支持图片
        fileUrl: conversation.fileUrl || '', // 支持文件
        fileName: conversation.fileName || '',
        fileSize: conversation.fileSize || '',
        timestamp: new Date()
      },
      {
        id: 2,
        role: 'assistant',
        content: conversation.assistant,
        questions: conversation.questions || [], // 支持题目卡片
        timestamp: new Date()
      }
    ]
    
    // Debug: 打印生成的消息
    if (mode === 'photo') {
      console.log('Photo mode assistant message:', acc[mode][1])
    }
    
    return acc
  }, {})
}

