import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, CheckBox } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addProjectToFirestore } from '../firbase/data/firestoreUtility';
import { auth } from '../firbase/firebase.settings';


const languageOptions = [
  { id: 'java', label: 'Java' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
];

export function NewProject() {
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [numberOfPages, setNumberOfPages] = useState('');
  const [difficulty, setDifficulty] = useState(null);
  const [languages, setLanguages] = useState({
    java: false,
    javascript: false,
    python: false,
    html: false,
    css: false
  });
  const userId = auth.currentUser ? auth.currentUser.uid : null;


  const handleSubmit = async () => {
    const selectedLanguagesList = Object.keys(languages).filter(lang => languages[lang]);
    const projectData = {
        userId, 
        projectName,
        startDate,
        endDate,
        selectedProjectType,
        selectedLanguages: selectedLanguagesList,
        numberOfPages,
        difficulty
    };
    
    await addProjectToFirestore(projectData);
};

  return (
    <View style={styles.container}>
      <Text>Name des Projekts:</Text>
      <TextInput value={projectName} onChangeText={setProjectName} style={styles.input} />

      <Text>Start Termin:</Text>
      <TextInput value={startDate} onChangeText={setStartDate} style={styles.input} />

      <Text>End Termin:</Text>
      <TextInput value={endDate} onChangeText={setEndDate} style={styles.input} />

      <Text>Project Art:</Text>
      <Picker
          style={styles.picker}
          selectedValue={selectedProjectType}
          onValueChange={(itemValue) => setSelectedProjectType(itemValue)}
      >
          <Picker.Item label="Bitte auswählen" value="" />
          <Picker.Item label="Website" value="website" />
          <Picker.Item label="App" value="app" />
          <Picker.Item label="Singlepage" value="singlepage" />
          <Picker.Item label="Andere" value="other" />
      </Picker>

      <Text>Sprachen:</Text>
      <View style={styles.checkboxContainer}>
        {languageOptions.map((language) => (
          <View key={language.id} style={styles.checkboxRow}>
            <CheckBox
              value={languages[language.id]}
              onValueChange={() => {
                setLanguages(prevState => ({ ...prevState, [language.id]: !prevState[language.id] }));
              }}
            />
            <Text>{language.label}</Text>
          </View>
        ))}
      </View>

      <Text>Einschätzung des Schwierigkeitsgrads:</Text>
      <View style={styles.checkboxContainer}>
        {[1,2,3,4,5].map(num => (
          <View key={num} style={styles.checkboxRow}>
            <CheckBox
              value={difficulty === num}
              onValueChange={() => {
                setDifficulty(num);
              }}
            />
            <Text>{num}</Text>
          </View>
        ))}
      </View>

      <Text>Wie viele Seiten/Komponenten werden benötigt:</Text>
      <TextInput value={numberOfPages} onChangeText={setNumberOfPages} style={styles.input} />

      <Button title="Absenden" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    marginBottom: 15
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 15
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10
  },
  picker: {
    height: 40,
    borderWidth: 1,
    borderColor: 'grey',
    marginBottom: 15
  },
});



