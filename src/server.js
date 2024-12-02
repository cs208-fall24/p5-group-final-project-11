import express from 'express';
import sql from 'sqlite3';

const sqlite3 = sql.verbose();
const db = new sqlite3.Database(':memory:');

const app = express();
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));

// Create the comments table with a major column
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, major TEXT)', (err) => {
    if (err) console.error('Error creating comments table:', err.message);
  });
});

// Root route renders the university landing page
app.get('/', (req, res) => {
  res.render('index');
});

// Render Student 1's page with comments filtered by major
app.get('/student1', (req, res) => {
  db.all('SELECT content FROM comments WHERE major = ? ORDER BY RANDOM() LIMIT 5', ['Party Studies'], (err, rows) => {
    const comments = rows ? rows.map(row => row.content) : [];
    res.render('student1', { comments });
  });
});

// Render Student 2's page with comments filtered by major
app.get('/student2', (req, res) => {
  db.all('SELECT content FROM comments WHERE major = ? ORDER BY RANDOM() LIMIT 5', ['Esport Major'], (err, rows) => {
    const comments = rows ? rows.map(row => row.content) : [];
    res.render('student2', { comments });
  });
});

// Render comments management page for all comments
app.get('/comments', (req, res) => {
  db.all('SELECT id, content, major FROM comments', (err, rows) => {
    res.render('comments', { comments: rows });
  });
});

// Add a new comment for Student 1's major
app.post('/comments/add', (req, res) => {
  const { comment } = req.body;
  const major = 'Party Studies';
  db.run('INSERT INTO comments (content, major) VALUES (?, ?)', [comment, major], function(err) {
    if (err) {
      console.error('Error adding comment:', err.message);
      res.status(500).json({ error: 'Failed to add comment' });
    } else {
      res.json({ id: this.lastID, content: comment });
    }
  });
});

// Add a new comment for Student 2's major
app.post('/comments/add/student2', (req, res) => {
  const { comment } = req.body;
  const major = 'Esport Major';
  db.run('INSERT INTO comments (content, major) VALUES (?, ?)', [comment, major], function(err) {
    if (err) {
      console.error('Error adding comment:', err.message);
      res.status(500).json({ error: 'Failed to add comment' });
    } else {
      res.json({ id: this.lastID, content: comment });
    }
  });
});

// Delete a comment
app.post('/comments/delete/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM comments WHERE id = ?', id, (err) => {
    if (err) console.error('Error deleting comment:', err.message);
    res.redirect('/comments');
  });
});

// Render edit comment form
app.get('/comments/edit/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT id, content FROM comments WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching comment:', err.message);
      res.redirect('/comments');
    } else {
      res.render('edit_comment', { comment: row });
    }
  });
});

// Update a comment
app.post('/comments/edit/:id', (req, res) => {
  const id = req.params.id;
  const updatedContent = req.body.comment;
  db.run('UPDATE comments SET content = ? WHERE id = ?', [updatedContent, id], (err) => {
    if (err) console.error('Error updating comment:', err.message);
    res.redirect('/comments');
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
