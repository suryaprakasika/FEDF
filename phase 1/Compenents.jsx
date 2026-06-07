export const initialBooks = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", available: true },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", genre: "Technology", available: true },
  { id: 3, title: "Sapiens", author: "Yuval Noah Harari", genre: "History", available: true },
];

export const initialUsers = [
  { id: "2520030044", name: "Asthra Pilla", role: "student", password: "student123" },
  { id: "2520030444", name: "Surya Prakasika", role: "student", password: "student456" },
  { id: "librarian", name: "Head Librarian", role: "librarian", password: "lib123" },
];

const styles = {
  page: { minHeight: "100vh", background: "#f5f0e8", fontFamily: "Georgia, serif" },
  login: { maxWidth: 380, margin: "80px auto", padding: 28, background: "white", borderRadius: 10 },
  app: { display: "flex", minHeight: "100vh" },
  sidebar: { width: 220, padding: 20, background: "#1a3a5c", color: "white" },
  main: { flex: 1, padding: 30 },
  button: { padding: "8px 12px", margin: 4, border: 0, borderRadius: 6, cursor: "pointer" },
  card: { background: "white", padding: 18, marginBottom: 14, borderRadius: 10, border: "1px solid #ddd" },
  input: { width: "100%", padding: 10, marginBottom: 10 },
};

export function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function calcFine(dueDate, returned) {
  if (returned) return 0;

  const today = new Date();
  const due = new Date(dueDate);
  today.setHours(0, 0, 0, 0);

  const lateDays = Math.floor((today - due) / 86400000);
  return lateDays > 0 ? lateDays * 2 : 0;
}

export function Login({ onLogin, error }) {
  let id = "";
  let password = "";
  let role = "student";

  return (
    <div style={styles.page}>
      <div style={styles.login}>
        <h1>LibraVault</h1>

        <select style={styles.input} onChange={(e) => (role = e.target.value)}>
          <option value="student">Student</option>
          <option value="librarian">Librarian</option>
        </select>

        <input style={styles.input} placeholder="ID" onChange={(e) => (id = e.target.value)} />
        <input style={styles.input} type="password" placeholder="Password" onChange={(e) => (password = e.target.value)} />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button style={styles.button} onClick={() => onLogin(role, id, password)}>
          Login
        </button>

        <p>
          Student: 2520030044 / student123<br />
          Librarian: librarian / lib123
        </p>
      </div>
    </div>
  );
}

export function Layout({ user, page, setPage, logout, children }) {
  const links =
    user.role === "librarian"
      ? ["dashboard", "books", "addbook"]
      : ["dashboard", "books", "mybooks"];

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <h2>LibraVault</h2>
        <p>{user.name}</p>

        {links.map((link) => (
          <button
            key={link}
            style={{
              ...styles.button,
              width: "100%",
              background: page === link ? "#c8860a" : "transparent",
              color: "white",
            }}
            onClick={() => setPage(link)}
          >
            {link}
          </button>
        ))}

        <button style={styles.button} onClick={logout}>Logout</button>
      </aside>

      <main style={styles.main}>{children}</main>
    </div>
  );
}

export function Dashboard({ books, issued, totalFine }) {
  return (
    <>
      <h1>Dashboard</h1>
      <div style={styles.card}>Total Books: {books.length}</div>
      <div style={styles.card}>Available Books: {books.filter((b) => b.available).length}</div>
      <div style={styles.card}>Issued Books: {issued.filter((i) => !i.returned).length}</div>
      <div style={styles.card}>My Fine: Rs. {totalFine}</div>
    </>
  );
}

export function Books({ user, books, issueBook }) {
  return (
    <>
      <h1>Books</h1>

      {books.map((book) => (
        <div style={styles.card} key={book.id}>
          <h3>{book.title}</h3>
          <p>{book.author} | {book.genre}</p>
          <p>{book.available ? "Available" : "Issued"}</p>

          {user.role === "student" && book.available && (
            <button style={styles.button} onClick={() => issueBook(book.id)}>
              Borrow
            </button>
          )}
        </div>
      ))}
    </>
  );
}

export function MyBooks({ books, issued, returnBook }) {
  return (
    <>
      <h1>My Books</h1>

      {issued.length === 0 && <p>No books borrowed.</p>}

      {issued.map((item) => {
        const book = books.find((b) => b.id === item.bookId);
        const fine = calcFine(item.dueDate, item.returned);

        return (
          <div style={styles.card} key={item.id}>
            <h3>{book?.title}</h3>
            <p>Due Date: {item.dueDate}</p>
            <p>Fine: Rs. {fine}</p>

            {!item.returned && (
              <button style={styles.button} onClick={() => returnBook(item.id)}>
                Return
              </button>
            )}
          </div>
        );
      })}
    </>
  );
}

export function AddBook({ newBook, setNewBook, addBook }) {
  return (
    <div style={styles.card}>
      <h1>Add Book</h1>

      <input
        style={styles.input}
        placeholder="Title"
        value={newBook.title}
        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
      />

      <input
        style={styles.input}
        placeholder="Author"
        value={newBook.author}
        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
      />

      <input
        style={styles.input}
        placeholder="Genre"
        value={newBook.genre}
        onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
      />

      <button style={styles.button} onClick={addBook}>
        Add Book
      </button>
    </div>
  );
}
