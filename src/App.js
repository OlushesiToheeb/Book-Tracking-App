import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import { Route } from 'react-router-dom'
import './App.css'
import ListBooks from './listBooks';
import SearchBooks from './searchBooks';




const bookShelves = [
  {id: "currentlyReading", title: "Currently Reading"},
  {id:"wantToRead", title: "Want To Read"},
  {id:"read", title: "Read"}
]

class BooksApp extends Component {
  state = {
    books: [],
    searchedBooks: [],
    searchError: false,
    apiError: false
  }

  componentDidMount() {
    // Get all the users book from api and set state
    BooksAPI.getAll()
      .then(books => {
        this.setState(() => ({
          books: books,
          apiError: false
        }))
      })
      .catch(error => {
        this.setState({
          apiError: true
        })
      })
  }

  shelfChange = (newShelf, selectedBook) => {
    // change book shelf object property depending on user interaction and also update the api
    BooksAPI.update(selectedBook, newShelf)
    .catch(err => {
        this.setState({
          apiError: true
        })
    });

    if (newShelf === "none") {
      this.setState((prevState) => ({
        books: prevState.books.filter(book => book.id !== selectedBook.id)
      }))
      return;    
    }
    selectedBook.shelf = newShelf;
    this.setState((prevState) => ({
      books: prevState.books.filter(book => book.id !== selectedBook.id).concat([selectedBook])
    }))  
  }

  searchBooksAPI = (query) => {
    // Search for books based on query and set state
    BooksAPI.search(query)
    .then(books => {
      if (books.error === 'empty query') {
        this.setState({
          searchError: true
        })
      } else {
        this.setState({
          searchedBooks: books,
          searchError: false
        })
      }
    })
    .catch(error => {
      this.setState({
        apiError: true
      })
    }) 
  }

  closeSearchPage = () => {
    this.setState({
      searchedBooks: []
    })
  } 


  render() {

    const { books, apiError, searchedBooks, searchError} = this.state;

    if (apiError) {
      return ( 
          <div>There is a problem with the server. Please reload your webpage and try again</div> 
      )
    }
    return (
      <div className="app"> 
        <Route exact path="/" render={() => (
        <ListBooks allBooks={books} bookShelves={bookShelves} onShelfChange={this.shelfChange}/>
        )}
        />
        <Route path="/search" render={() => (
          <SearchBooks 
          onSearch={this.searchBooksAPI} 
          searchedBooks={searchedBooks} 
          onShelfChange={this.shelfChange}
          onCloseSearch={this.closeSearchPage}
          allBooks = {books}
          searchError = {searchError}
          />
        )}
        />
      </div>
    )
  }
}

export default BooksApp;
