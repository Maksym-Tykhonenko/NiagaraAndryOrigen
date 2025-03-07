import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const QuestsScreen = () => {
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuests, setCompletedQuests] = useState<any>({});

  useEffect(() => {
    loadCompletedQuests();
  }, []);

  const loadCompletedQuests = async () => {
    try {
      const storedData = await AsyncStorage.getItem('completedQuests');
      if (storedData) {
        setCompletedQuests(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to load completed quests:', error);
    }
  };

  const saveCompletedQuests = async (updatedCompletedQuests: any) => {
    try {
      await AsyncStorage.setItem(
        'completedQuests',
        JSON.stringify(updatedCompletedQuests),
      );
      setCompletedQuests(updatedCompletedQuests);
    } catch (error) {
      console.error('Failed to save completed quests:', error);
    }
  };

  const handleAnswerSelection = (selectedOption: string) => {
    if (!selectedQuest) return;

    const currentQuestion = selectedQuest.questions[currentQuestionIndex];

    if (selectedOption === currentQuestion.correctAnswer) {
      if (currentQuestionIndex + 1 < selectedQuest.questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        const updatedCompletedQuests = {
          ...completedQuests,
          [selectedQuest.id]: true,
        };
        saveCompletedQuests(updatedCompletedQuests);

        setSelectedQuest(null);
        setCurrentQuestionIndex(0);
        Alert.alert('🎉 Quest Completed!');
      }
    } else {
      Alert.alert('❌ Incorrect answer. Try again!');
    }
  };

  const quests = [
    {
      id: '1',
      title: 'Waterfall Explorer',
      description:
        'Visit 5 different waterfalls and answer questions about them.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmTWz9q7T4uUc8kP4abkEGlGueo6BWazzLjA&s',
      questions: [
        {
          question: 'Which country is home to Niagara Falls?',
          options: ['USA & Canada', 'Brazil', 'Venezuela', 'Norway'],
          correctAnswer: 'USA & Canada',
        },
        {
          question: 'What is the highest waterfall in the world?',
          options: [
            'Iguazu Falls',
            'Angel Falls',
            'Victoria Falls',
            'Yosemite Falls',
          ],
          correctAnswer: 'Angel Falls',
        },
      ],
    },
    {
      id: '2',
      title: 'Eco Protector',
      description: 'Learn how to protect nature through this challenge.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjbnK3cvEKE18isJtTwL0lFgl5iolD-_RBiw&s',
      questions: [
        {
          question: 'What is the best way to reduce plastic waste?',
          options: ['Recycle', 'Throw away', 'Burn it', 'Bury it'],
          correctAnswer: 'Recycle',
        },
        {
          question: 'Which of these materials is biodegradable?',
          options: ['Plastic', 'Glass', 'Paper', 'Metal'],
          correctAnswer: 'Paper',
        },
      ],
    },
    {
      id: '3',
      title: 'Wildlife Observer',
      description: 'Learn about animals living near waterfalls.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShWlhTgddD9O7mHyO74PxOoAN7RzKQP8JEZw&s',
      questions: [
        {
          question:
            'Which animal is commonly found near rivers and waterfalls?',
          options: ['Lion', 'Otter', 'Giraffe', 'Zebra'],
          correctAnswer: 'Otter',
        },
        {
          question: 'Which bird is known for diving into waterfalls for fish?',
          options: ['Eagle', 'Kingfisher', 'Parrot', 'Owl'],
          correctAnswer: 'Kingfisher',
        },
      ],
    },
    {
      id: '4',
      title: 'Survival Skills',
      description: 'Test your knowledge on surviving in the wild.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEL0eKj4Xy3vw6pG4qDJi6gYdKK7gJ2X2DKA&s',
      questions: [
        {
          question:
            'Which of these is the best way to find clean drinking water?',
          options: [
            'Drink from a river',
            'Collect rainwater',
            'Use ocean water',
            'Melt ice',
          ],
          correctAnswer: 'Collect rainwater',
        },
        {
          question: 'What is the best way to start a fire in the wild?',
          options: [
            'Use wet wood',
            'Use a magnifying glass',
            'Use dry grass and a spark',
            'Wait for lightning',
          ],
          correctAnswer: 'Use dry grass and a spark',
        },
      ],
    },
    {
      id: '5',
      title: 'Green Energy',
      description: 'Discover renewable energy sources and their benefits.',
      image:
        'https://pub.mdpi-res.com/resources/resources-08-00149/article_deploy/html/images/resources-08-00149-g001.png?1571741481',
      questions: [
        {
          question: 'Which energy source is the most eco-friendly?',
          options: ['Coal', 'Nuclear', 'Solar', 'Gas'],
          correctAnswer: 'Solar',
        },
        {
          question: 'What is a major advantage of wind energy?',
          options: [
            'It is unlimited',
            'It creates pollution',
            'It uses a lot of land',
            'It requires fuel',
          ],
          correctAnswer: 'It is unlimited',
        },
      ],
    },
    {
      id: '6',
      title: 'Climate Change Awareness',
      description: 'Understand the causes and effects of climate change.',
      image:
        'https://media.licdn.com/dms/image/v2/D4D12AQG0D0vbM_wYfA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1696003038408?e=2147483647&v=beta&t=TAZKYOUyCrvFRjHq1mD0gNKglyhrTsxdlTbKUNPTu78',
      questions: [
        {
          question: 'What is the main cause of global warming?',
          options: [
            'Deforestation',
            'Volcanoes',
            'Solar flares',
            'Overfishing',
          ],
          correctAnswer: 'Deforestation',
        },
        {
          question: 'Which gas contributes the most to the greenhouse effect?',
          options: ['Oxygen', 'Carbon dioxide', 'Hydrogen', 'Methane'],
          correctAnswer: 'Carbon dioxide',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {selectedQuest ? (
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{selectedQuest.title}</Text>
          <Text style={styles.description}>{selectedQuest.description}</Text>

          <Text style={styles.question}>
            {selectedQuest.questions[currentQuestionIndex].question}
          </Text>

          {selectedQuest.questions[currentQuestionIndex].options.map(
            (option: any, index: any) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleAnswerSelection(option)}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ),
          )}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedQuest(null)}>
            <Text style={styles.backButtonText}>Back to Quests</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.header}>Eco Quests</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={quests}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => setSelectedQuest(item)}>
                <Image source={{uri: item.image}} style={styles.cardImage} />
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                  {completedQuests[item.id] && (
                    <Text style={styles.completedLabel}>✅ Completed</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: 20,
    paddingVertical: 40,
  },
  title: {
    //
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: '#2E7D32',
    marginBottom: 20,
  },
  header: {
    marginTop:10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    padding: 10,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  textContainer: {
    paddingLeft: 10,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  cardDescription: {
    fontSize: 14,
    color: '#388E3C',
  },
  completedLabel: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginTop: 5,
  },
  detailsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#388E3C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 30,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default QuestsScreen;
