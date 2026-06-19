import { useMemo, useState } from "react";
import {
  USERS,
  BOOKS,
  today,
  afterDays,
  fine,
  Login,
  Student,
  Librarian,
} from "./components/Components.jsx";

export default function App() {
  const [users, setUsers] = useState(USERS);
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState(BOOKS);
  const [issued, setIssued] = useState([]);
  const [prebooks, setPrebooks] = useState([]);
  const [view, setView] = useState("all");
  const [login, setLogin] = useState({ role: "student", id: "", password: "" });
  const [error, setError] = useState("");
  const [newBook, setNewBook] = useState({ title: "", author: "", genre: "" });
  const [newUser, setNewUser] = useState({ name: "", id: "", password: "", role: "student" });

  const available = books.filter((b) => b.available);
  const activeIssued = issued.filter((i) => !i.returned);
  const myIssued = issued.filter((i) => i.studentId === user?.id);

  const recommendations = useMemo(() => {
    const mine = books.filter((b) => myIssued.some((i) => i.bookId === b.id));
    const authors = mine.map((b) => b.author);
    const genres = mine.map((b) => b.genre);
    const result = available.filter((b) => authors.includes(b.author) || genres.includes(b.genre));
    return result.length ? result : available.slice(0, 3);
  }, [books, available, myIssued]);

  function handleLogin(e) {
    e.preventDefault();
    const found = users.find(
      (u) => u.role === login.role && u.id === login.id.trim() && u.password === login.password
    );

    if (!found) return setError("Invalid login details");

    setUser(found);
    setError("");
    setView("all");
  }

  function logout() {
    setUser(null);
    setLogin({ role: "student", id: "", password: "" });
  }

  function issueBook(id) {
    const book = books.find((b) => b.id === id);
    if (!book?.available) return;

    const issuedDate = today();
    const returnDate = afterDays(14, issuedDate);

    setBooks(books.map((b) => (b.id === id ? { ...b, available: false } : b)));
    setIssued([...issued, {
      id: Date.now(),
      bookId: id,
      studentId: user.id,
      issuedDate,
      returnDate,
      dueDate: returnDate,
      actualReturnDate: "",
      returned: false,
    }]);
  }

  function returnBook(id) {
    const record = issued.find((i) => i.id === id);
    if (!record) return;

    setIssued(issued.map((i) => i.id === id ? { ...i, returned: true, actualReturnDate: today() } : i));
    setBooks(books.map((b) => b.id === record.bookId ? { ...b, available: true } : b));
  }

  function preBook(id) {
    if (prebooks.some((p) => p.bookId === id && p.studentId === user.id)) return;
    setPrebooks([...prebooks, { id: Date.now(), bookId: id, studentId: user.id, date: today() }]);
  }

  function addBook() {
    if (!newBook.title || !newBook.author || !newBook.genre) return;
    setBooks([...books, { id: Date.now(), ...newBook, available: true }]);
    setNewBook({ title: "", author: "", genre: "" });
  }

  function addUser() {
    if (!newUser.name || !newUser.id || !newUser.password) return;
    if (users.some((u) => u.id === newUser.id)) return alert("This ID already exists.");

    setUsers([...users, newUser]);
    setNewUser({ name: "", id: "", password: "", role: "student" });
    alert("New credentials created successfully.");
  }

  const updateBook = (id, key, value) =>
    setBooks(books.map((b) => b.id === id ? { ...b, [key]: value } : b));

  const deleteBook = (id) => {
    setBooks(books.filter((b) => b.id !== id));
    setIssued(issued.filter((i) => i.bookId !== id));
    setPrebooks(prebooks.filter((p) => p.bookId !== id));
  };

  if (!user) {
    return <Login login={login} setLogin={setLogin} error={error} onLogin={handleLogin} />;
  }

  if (user.role === "student") {
    return (
      <Student
        user={user}
        books={books}
        available={available}
        issued={myIssued}
        recommendations={recommendations}
        prebooks={prebooks}
        logout={logout}
        issueBook={issueBook}
        returnBook={returnBook}
        preBook={preBook}
      />
    );
  }

  return (
    <Librarian
      user={user}
      users={users}
      books={books}
      available={available}
      issued={activeIssued}
      prebooks={prebooks}
      view={view}
      setView={setView}
      newBook={newBook}
      setNewBook={setNewBook}
      newUser={newUser}
      setNewUser={setNewUser}
      logout={logout}
      addBook={addBook}
      addUser={addUser}
      updateBook={updateBook}
      deleteBook={deleteBook}
    />
  );
}