import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {BASE_URL} from '../config';


const EditBookModal = ({ isOpen, closeModal, selectedBook, updateBook, getData }) => {
  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const { title, author, isbn } = selectedBook;
    setTitle(title);
    setAuthor(author);
    setIsbn(isbn);
  }, [selectedBook]);

  const handleChange = (value, state) => {
    switch (state) {
      case 'title':
        setTitle(value);
        break;
      case 'author':
        setAuthor(value);
        break;
      case 'isbn':
        setIsbn(value);
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

  const handleupdateBook = () => {
    setErrorMessage('');
    setLoading(true);

    if (title && author && isbn) {
      fetch(`${BASE_URL}/update/${selectedBook.id}`, {
        method: 'PUT',
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
          updateBook({
            title: res.title,
            isbn: res.isbn,
            author: res.author,
            id: selectedBook.id
          });
        })
        .catch(() => {
          setErrorMessage('Network Error. Please try again.');
          setLoading(false);
        }).finally(() => {clearInputs(),closeModal(), getData()});;
    } else {
      setErrorMessage('Fields are empty.');
      setLoading(false);
    }
  };

  return (
    <Modal visible={isOpen} onRequestClose={closeModal} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Update Book</Text>

        <TextInput
          value={title}
          style={styles.textBox}
          onChangeText={text => handleChange(text, 'title')}
          placeholder="Full title"
        />

        <TextInput
          defaultValue={isbn.toString()}
          keyboardType="numeric"
          style={styles.textBox}
          onChangeText={text => handleChange(text, 'isbn')}
          placeholder="Book's isbn"
        />

       <TextInput
          value={author}
          style={styles.textBox}
          onChangeText={text => handleChange(text, 'author')}
          placeholder="Book's author"
        />

        {loading ? <Text style={styles.message}>Please Wait...</Text> : errorMessage ? (
          <Text style={styles.message}>{errorMessage}</Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleupdateBook} style={styles.button}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={closeModal} style={{ ...styles.button, backgroundColor: 'tomato' }}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditBookModal;

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
