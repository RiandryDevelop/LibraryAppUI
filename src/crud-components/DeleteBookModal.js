import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {BASE_URL} from '../config';

const DeleteBookModal = ({ isOpen, closeModal, selectedBook, updateBook, getData }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  

  const deleteBook = () => {
    setLoading(true);
    setErrorMessage('');
    
    fetch(`${BASE_URL}/delete/${selectedBook.id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(res => {
        closeModal();
        updateBook(selectedBook.id);
      })
      .catch(() => {
        setErrorMessage('Network Error. Please try again.');
        setLoading(false);
      }).finally(() =>{
        closeModal()
        getData()
      } 
      );
  };

  return (
    <Modal
      visible={isOpen}
      onRequestClose={closeModal}
      animationType="slide"
      transparent
    >
      <View style={styles.BackgroundContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Would you like to delete book name ({selectedBook.title})?</Text>
          <Text style={styles.subTitle}>
            If you are sure to delete this book, click the "Agree" button. If you are not willing to delete, click "Disagree".
          </Text>

          {loading ? <Text style={styles.message}>Please Wait...</Text> : errorMessage ? <Text style={styles.message}>{errorMessage}</Text> : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={deleteBook}>
              <Text style={styles.buttonText}>Agree</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginLeft: 10 }} onPress={closeModal}>
              <Text style={{ ...styles.buttonText, color: 'skyblue' }}>Disagree</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteBookModal;

const styles = StyleSheet.create({
  BackgroundContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  container: {
    width: '90%',
    padding: 15,
    maxHeight: '40%',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 5
  },
  subTitle: {
    fontSize: 16
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'flex-end'
  },
  buttonText: {
    color: 'tomato',
    fontSize: 17
  },
  message: {
    color: 'tomato',
    fontSize: 17
  }
});
