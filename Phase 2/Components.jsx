export const USERS = [
  { id: "2520030044", name: "Asthra Pilla", role: "student", password: "student123" },
  { id: "2520030444", name: "Surya Prakasika", role: "student", password: "student456" },
  { id: "librarian", name: "Head Librarian", role: "librarian", password: "lib123" },
];

export const BOOKS = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", available: true },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", genre: "Technology", available: true },
  { id: 3, title: "Sapiens", author: "Yuval Noah Harari", genre: "History", available: false },
  { id: 4, title: "Dune", author: "Frank Herbert", genre: "Science Fiction", available: true },
  { id: 5, title: "Atomic Habits", author: "James Clear", genre: "Self Help", available: true },
];

const FINE = 2;

const s = {
  page: { minHeight: "100vh", background: "#f5f0e8", fontFamily: "Georgia, serif", color: "#1a1a1a", padding: 25 },
  login: { maxWidth: 390, margin: "70px auto", padding: 28, background: "#fff", borderRadius: 12 },
  input: { width: "100%", padding: 10, margin: "8px 0", borderRadius: 6, border: "1px solid #ccc", boxSizing: "border-box" },
  btn: { padding: "9px 14px", margin: 4, border: 0, borderRadius: 6, background: "#1a3a5c", color: "white", cursor: "pointer" },
  danger: { padding: "9px 14px", margin: 4, border: 0, borderRadius: 6, background: "#b33a2e", color: "white", cursor: "pointer" },
  card: { background: "#fff", padding: 16, margin: "12px 0", borderRadius: 10, border: "1px solid #ddd" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 },
  top: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  stat: { background: "#fff", padding: 20, borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" },
};

export const today = () => new Date().toISOString().split("T")[0];

export function afterDays(days, base = new Date()) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function fine(dueDate, returned) {
  if (returned) return 0;
  const now = new Date();
  const due = new Date(dueDate);
  now.setHours(0, 0, 0, 0);
  const late = Math.floor((now - due) / 86400000);
  return late > 0 ? late * FINE : 0;
}

function Top({ title, user, logout }) {
  return (
    <div style={s.top}>
      <h1>{title}</h1>
      <div>
        <b>{user.name}</b>
        <button style={s.danger} onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

function BookGrid({ books, text, action }) {
  return (
    <div style={s.grid}>
      {books.map((b) => (
        <div style={s.card} key={b.id}>
          <h3>{b.title}</h3>
          <p>{b.author}</p>
          <p>{b.genre}</p>
          {action && <button style={s.btn} onClick={() => action(b.id)}>{text}</button>}
        </div>
      ))}
    </div>
  );
}

export function Login({ login, setLogin, error, onLogin }) {
  return (
    <div style={s.page}>
      <form style={s.login} onSubmit={onLogin}>
        <h1>LibraVault</h1>

        <select style={s.input} value={login.role} onChange={(e) => setLogin({ ...login, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="librarian">Librarian</option>
        </select>

        <input style={s.input} placeholder={login.role === "student" ? "Student ID" : "Librarian ID"} value={login.id} onChange={(e) => setLogin({ ...login, id: e.target.value })} />
        <input style={s.input} type="password" placeholder="Password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button style={s.btn}>Login</button>
      </form>
    </div>
  );
}

export function Student({ user, books, available, issued, recommendations, prebooks, logout, issueBook, returnBook, preBook }) {
  const fineBooks = issued.filter((i) => fine(i.dueDate, i.returned) > 0);

  return (
    <div style={s.page}>
      <Top
title="Student Dashboard" user={user} logout={logout} />

      <h2>Available Books</h2>
      <BookGrid books={available} text="Issue Book" action={issueBook} />

      <h2>Recommendation & Preferences</h2>
      <BookGrid books={recommendations} text="Issue Book" action={issueBook} />

      <h2>Pre Book</h2>
      <div style={s.grid}>
        {books.filter((b) => !b.available).map((b) => {
          const booked = prebooks.some((p) => p.bookId === b.id && p.studentId === user.id);

          return (
            <div style={s.card} key={b.id}>
              <h3>{b.title}</h3>
              <p>{b.author}</p>
              <p>{b.genre}</p>
              <button style={s.btn} disabled={booked} onClick={() => preBook(b.id)}>
                {booked ? "Pre Booked" : "Pre Book"}
              </button>
            </div>
          );
        })}
      </div>

      <h2>Issue & Returns</h2>
      {issued.length === 0 && <p>No books issued yet.</p>}

      {issued.map((i) => {
        const book = books.find((b) => b.id === i.bookId);

        return (
          <div style={s.card} key={i.id}>
            <h3>{book?.title}</h3>
            <p>Issued Date: {i.issuedDate}</p>
            <p>Return Date: {i.returnDate}</p>
            <p>Actual Returned On: {i.actualReturnDate || "Not returned yet"}</p>
            <p>Status: {i.returned ? "Returned" : "Issued"}</p>
            {!i.returned && <button style={s.btn} onClick={() => returnBook(i.id)}>Return Book</button>}
          </div>
        );
      })}

      <h2>Due Date and Fine Management</h2>
      {fineBooks.length === 0 && <p>No fine generated.</p>}

      {fineBooks.map((i) => {
        const book = books.find((b) => b.id === i.bookId);

        return (
          <div style={s.card} key={i.id}>
            <h3>{book?.title}</h3>
            <p>Due Date: {i.dueDate}</p>
            <p style={{ color: "red" }}>Fine Generated: ₹{fine(i.dueDate, i.returned)}</p>
          </div>
        );
      })}
    </div>
  );
}

export function Librarian({
  user, users, books, available, prebooks, view, setView,
  newBook, setNewBook, newUser, setNewUser,
  logout, addBook, addUser, updateBook, deleteBook,
}) {
  const shownBooks = view === "available" ? available : view === "issued" ? books.filter((b) => !b.available) : books;

  return (
    <div style={s.page}>
      <Top title="Librarian Dashboard" user={user} logout={logout} />

      <div style={s.grid}>
        <div style={s.stat} onClick={() => setView("all")}><h2>{books.length}</h2><p>Total Number of Books</p></div>
        <div style={s.stat} onClick={() => setView("available")}><h2>{available.length}</h2><p>Available Books</p></div>
        <div style={s.stat} onClick={() => setView("issued")}><h2>{books.filter((b) => !b.available).length}</h2><p>Issued Books</p></div>
      </div>

      <h2>{view === "available" ? "Available Books" : view === "issued" ? "Issued Books" : "All Books"}</h2>

      {shownBooks.map((b) => (
        <div style={s.card} key={b.id}>
          {["title", "author", "genre"].map((key) => (
            <input key={key} style={s.input} value={b[key]} onChange={(e) => updateBook(b.id, key, e.target.value)} />
          ))}
          <p>Status: {b.available ? "Available" : "Issued"}</p>
          <button style={s.danger} onClick={() => deleteBook(b.id)}>Remove Book</button>
        </div>
      ))}

      <Form title="Add Book" data={newBook} setData={setNewBook} fields={["title", "author", "genre"]} button="Add Book" submit={addBook} />

      <Form
        title="Create New Credentials"
        data={newUser}
        setData={setNewUser}
        fields={["name", "id", "password"]}
        button="Create Credentials"
        submit={addUser}
        selectRole
      />

      <h2>Fine Management</h2>
      {books.length && users.length && <FineList users={users} books={books} />}

      <h2>Pre Book Requests</h2>
      {prebooks.length === 0 && <p>No pre book requests.</p>}

      {prebooks.map((p) => (
        <div style={s.card} key={p.id}>
          <p>Student: {users.find((u) => u.id ===
p.studentId)?.name}</p>
          <p>Book: {books.find((b) => b.id === p.bookId)?.title}</p>
          <p>Requested On: {p.date}</p>
        </div>
      ))}
    </div>
  );
}

function Form({ title, data, setData, fields, button, submit, selectRole }) {
  return (
    <>
      <h2>{title}</h2>
      <div style={s.card}>
        {selectRole && (
          <select style={s.input} value={data.role} onChange={(e) => setData({ ...data, role: e.target.value })}>
            <option value="student">Student</option>
            <option value="librarian">Librarian</option>
          </select>
        )}

        {fields.map((f) => (
          <input
            key={f}
            style={s.input}
            placeholder={f}
            value={data[f]}
            onChange={(e) => setData({ ...data, [f]: e.target.value })}
          />
        ))}

        <button style={s.btn} onClick={submit}>{button}</button>
      </div>
    </>
  );
}

function FineList() {
  return <p>No students have pending fines.</p>;
}