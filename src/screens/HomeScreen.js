import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';
import {BASE_URL} from '../config';

// Components modals imports 
import AddbookModal from "../crud-components/AddBookModal";
import EditBookModal from "../crud-components/EditBookModal";
import DeleteBookModal from "../crud-components/DeleteBookModal";

const HomeScreen = () => {
  const {userInfo, isLoading, logout} = useContext(AuthContext);
  const [book, setBook] = useState([]);

 
  const [isAddBookModalOpen, setAddBookModalOpen] = useState(false);
  const [isEditBookModalOpen, setEditBookModalOpen] = useState(false);
  const [isDeleteBookModalOpen, setDeleteBookModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedBook, setSelectedBook] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setErrorMessage("");
    setLoading(true);

    fetch(`${BASE_URL}/`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        setBook(res);
        setLoading(false);
        setErrorMessage("");
      })
      .catch(() => {
        setLoading(false);
        setErrorMessage("Network Error. Please try again.");
      });
  }

  const toggleAddBookModal = () => {
    setAddBookModalOpen(!isAddBookModalOpen);
  }

  const toggleEditBookModal = (data) => {
    setEditBookModalOpen(!isEditBookModalOpen);
    setSelectedBook(data);
  }

  const toggleDeleteBookModal = (data) => {
    setDeleteBookModalOpen(!isDeleteBookModalOpen);
    setSelectedBook(data);
  }

  const addBook = (data) => {
    setBook([data, ...book]);
    
  }

  const updateBook = (data) => {
    setBook(book.map(book => (book.id === data.id ? data : book)));
    
  }

  const deleteBook = (bookId) => {
    setBook(book.filter(book => book.id !== bookId));
    getData();
  }



  return (
    <ScrollView>
    <Spinner visible={isLoading} />
    <Text style={styles.welcome}>Welcome {userInfo.email}</Text>
    <Text style={styles.welcome}>Welcome USER</Text>
    <Button title="Logout" color="red" onPress={logout} />
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleAddBookModal}
        style={styles.button}>
        <Text style={styles.buttonText}>Add book</Text>
      </TouchableOpacity>

      <Text style={styles.title}>book Lists:</Text>
      {book.map((data, index) => (
        <View style={styles.bookListContainer} key={data.id}>
          <Text style={{ ...styles.listItem, color: "tomato" }}>{index + 1}.</Text>
          <Text style={styles.name}>{data.title}</Text>
          <Text style={styles.listItem}>isbn: {data.isbn}</Text>
          <Text style={styles.listItem}>author: {data.author}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => toggleEditBookModal(data)}
              style={{ ...styles.button, marginVertical: 0 }}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleDeleteBookModal(data)}
              style={{ ...styles.button, marginVertical: 0, marginLeft: 10, backgroundColor: "tomato" }}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {loading ? <Text style={styles.message}>Please Wait...</Text> : errorMessage ? (
        <Text style={styles.message}>{errorMessage}</Text>
      ) : null}

      {isAddBookModalOpen ? (
        <AddbookModal
          isOpen={isAddBookModalOpen}
          closeModal={toggleAddBookModal}
          addBook={addBook}
          getData={getData}
        />
      ) : null}

      {isEditBookModalOpen ? (
        <EditBookModal
          isOpen={isEditBookModalOpen}
          closeModal={toggleEditBookModal}
          selectedBook={selectedBook}
          updateBook={updateBook}
          getData={getData}
        />
      ) : null}

      {isDeleteBookModalOpen ? (
        <DeleteBookModal
          isOpen={isDeleteBookModalOpen}
          closeModal={toggleDeleteBookModal}
          selectedBook={selectedBook}
          deleteBook={deleteBook}
          getData={getData}
        />
      ) : null}
    </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
  },
  button: {
    borderRadius: 5,
    marginVertical: 20,
    alignSelf: 'flex-start',
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10
  },
  bookListContainer: {
    marginBottom: 25,
    elevation: 4,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.1)"
  },
  name: {
    fontWeight: "bold",
    fontSize: 16
  },
  listItem: {
    fontSize: 16
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  message: {
    color: "tomato",
    fontSize: 17
  }
})


export default HomeScreen;