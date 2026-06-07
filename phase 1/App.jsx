import { useState } from "react";
import {
  initialBooks,
  initialUsers,
  daysFromNow,
  calcFine,
  Login,
  Layout,
  Dashboard,
  Books,
  MyBooks,
  AddBook,
} from "./components/components.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [books, setBooks] = useState(initialBooks);
  const [issued, setIssued] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "", genre: "" });
  const [error, setError] = useState("");

  function login(role, id, password) {
    const found = initialUsers.find(
      (u) => u.role === role && u.id === id && u.password === password
    );

    if (!found) {
      setError("Invalid login details");
      return;
    }

    setUser(found);
    setError("");
    setPage("dashboard");
  }

  function logout() {
    setUser(null);
    setPage("dashboard");
  }

  function issueBook(bookId) {
    setBooks(
      books.map((book) =>
        book.id === bookId ? { ...book, available: false } : book
      )
    );

    setIssued([
      ...issued,
      {
        id: Date.now(),
        bookId,
        userId: user.id,
        issuedDate: new Date().toISOString().split("T")[0],
        dueDate: daysFromNow(14),
        returned: false,
      },
    ]);
  }

  function returnBook(issueId) {
    const record = issued.find((item) => item.id === issueId);

    setIssued(
      issued.map((item) =>
        item.id === issueId ? { ...item, returned: true } : item
      )
    );

    setBooks(
      books.map((book) =>
        book.id === record.bookId ? { ...book, available: true } : book
      )
    );
  }

  function addBook() {
    if (!newBook.title || !newBook.author) return;

    setBooks([
      ...books,
      {
        id: Date.now(),
        ...newBook,
        available: true,
      },
    ]);

    setNewBook({ title: "", author: "", genre: "" });
  }

  if (!user) {
    return <Login onLogin={login} error={error} />;
  }

  const myIssued = issued.filter((item) => item.userId === user.id);
  const totalFine = myIssued.reduce(
    (sum, item) => sum + calcFine(item.dueDate, item.returned),
    0
  );

  return (
    <Layout user={user} page={page} setPage={setPage} logout={logout}>
      {page === "dashboard" && (
        <Dashboard books={books} issued={issued} totalFine={totalFine} />
      )}

      {page === "books" && (
        <Books user={user} books={books} issueBook={issueBook} />
      )}

      {page === "mybooks" && (
        <MyBooks books={books} issued={myIssued} returnBook={returnBook} />
      )}

      {page === "addbook" && user.role === "librarian" && (
        <AddBook
          newBook={newBook}
          setNewBook={setNewBook}
          addBook={addBook}
        />
      )}
    </Layout>
  );
}
