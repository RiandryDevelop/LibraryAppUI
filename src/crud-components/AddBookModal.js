import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {BASE_URL} from '../config';


const AddBookModal = ({ isOpen, closeModal, addBook, getData}) => {
  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
 
 
  const handleChange = (value, state) => {
    switch (state) {
      case 'title':
        setTitle(value);
        break;
      case 'isbn':
        setIsbn(value);
        break;
      case 'author':
        setAuthor(value);
        break;
      default:
        break;
    }
  };

  const clearInputs = () => {
    setTitle('');
    setIsbn('');
    setAuthor('');
  };

  const submitBook = () => {
    setErrorMessage('');
    setLoading(true);

    if (title && author && isbn) {
      fetch(`${BASE_URL}/new`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          isbn: isbn,
          author: author
        })
      })
        .then(res => res.json())
        .then(res => {
          closeModal();
          addBook({
            title: res.title,
            author: res.author,
            isbn: res.isbn,
            id: res.id
          });
          clearInputs();
        })
        .catch(() => {
          setErrorMessage('Network Error. Please try again.');
          setLoading(false);
        }).finally(() =>{
          clearInputs()
          closeModal()
          getData()
        }
        );
    } else {
      setErrorMessage('Fields are empty.');
      setLoading(false);
    }
  };

  return (
    <Modal visible={isOpen} onRequestClose={closeModal} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Add New Book</Text>

        <TextInput
          style={styles.textBox}
          onChangeText={text => handleChange(text, 'title')}
          placeholder="Book's Title"
        />

        <TextInput
          keyboardType="numeric"
          style={styles.textBox}
          onChangeText={text => handleChange(text, 'isbn')}
          placeholder="Book's ISBN"
          maxLength={13}
        />
        <TextInput
          keyboardType="ascii-capable"
          style={styles.textBox}
          onChangeText={text => handleChange(text, 'author')}
          placeholder="Book's Author"
        />

        {loading ? <Text style={styles.message}>Please Wait...</Text> : errorMessage ? (
          <Text style={styles.message}>{errorMessage}</Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={submitBook} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={closeModal} style={{ ...styles.button, backgroundColor: 'tomato' }}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddBookModal;

const styles = StyleSheet.create({
  container: {
    padding: 15
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20
  },
  textBox: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'rgba(0,0,0,0.3)',
    marginBottom: 15,
    fontSize: 18,
    padding: 10
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    borderRadius: 5,
    marginVertical: 20,
    alignSelf: 'flex-start',
    backgroundColor: 'gray'
  },
  buttonText: {
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16
  },
  message: {
    color: 'tomato',
    fontSize: 17
  }
});
