require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const app = express();
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.json({ message: "Hello World!" }));

app.get("/api/cinemas", (req, res) => {
    pool.query("SELECT id, name FROM cinema", (error, rows) => {
        if (error) {
            return res.status(500).json({ error });
        }

        res.json(rows);
    });
});

app.get("/api/cinemas/:id", (req, res) => {
    pool.query(
        "SELECT id, name FROM cinema WHERE id = ?",
        [req.params.id],
        (error, rows) => {
            if (error) {
                return res.status(500).json({ error });
            }

            res.json(rows);
        }
    );
});

app.get("/api/cinemas/:id/movies", (req, res) => {
    pool.query(
        `SELECT s.time, m.id, m.title, m.description, m.duration, m.release_year, m.poster_url, GROUP_CONCAT(g.description) genres
        FROM showtime s
        JOIN movie m ON m.id = s.movie_id
        JOIN genre g ON g.movie_id = m.id
        WHERE s.cinema_id = ?
        GROUP BY m.id, s.time
        ORDER BY m.title, s.time;`,
        [req.params.id],
        (error, rows) => {
            if (error) {
                return res.status(500).json({ error });
            }

            res.json(rows);
        }
    );
});

app.get("/api/movies/:id", (req, res) => {
    pool.query(
        `SELECT m.id, m.title, m.description, m.duration, m.release_year, m.poster_url, GROUP_CONCAT(g.description) genres
        FROM movie m
        JOIN genre g ON g.movie_id = m.id
        WHERE m.id = ?
        GROUP BY m.id`,
        [req.params.id],
        (error, rows) => {
            if (error) {
                return res.status(500).json({ error });
            }

            res.json(rows);
        }
    );
});

app.get("/api/movies/:id/cinemas", (req, res) => {
    pool.query(
        `SELECT s.cinema_id, s.time, c.name
        FROM showtime s
        JOIN cinema c ON c.id = s.cinema_id
        WHERE s.movie_id = ?
        ORDER BY c.name, s.time`,
        [req.params.id],
        (error, rows) => {
            if (error) {
                return res.status(500).json({ error });
            }

            res.json(rows);
        }
    );
});

app.get("/api/moviesshowing", (req, res) => {
    pool.query(
        `SELECT m.id, m.title, m.poster_url, COUNT(DISTINCT s.cinema_id) as cinema_count
        FROM movie m
        LEFT JOIN showtime s ON s.movie_id = m.id
        GROUP BY m.id
        ORDER BY cinema_count DESC`,
        (error, rows) => {
            if (error) {
                return res.status(500).json({ error });
            }

            res.json(rows);
        }
    );
});

app.get("/api/movies", (req, res) => {
    pool.query(
        `SELECT m.id, m.title, m.description, m.duration, m.release_year, m.poster_url, GROUP_CONCAT(g.description) genres
        FROM movie m
        JOIN genre g ON g.movie_id = m.id
        GROUP BY m.id
        ORDER BY m.title`,
        (error, rows) => {
            if (error) {
                return res.status(500).json({ error });
            }

            res.json(rows);
        }
    );
});

app.get("/api/showtimes", (req, res) => {
    pool.query(
        `SELECT s.id, s.cinema_id, s.movie_id, s.time, c.name cinema_name, m.title movie_title
        FROM showtime s
        JOIN cinema c ON c.id = s.cinema_id
        JOIN movie m ON m.id = s.movie_id
        ORDER BY s.time`,
        (error, rows) => {
            if (error) {
                return res.status(500).json({ error });
            }

            res.json(rows);
        }
    );
});

app.post("/api/cinemas", (req, res) => {
    const cinema = req.body;

    if (!cinema.name) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    pool.query(
        "INSERT INTO cinema (name) VALUES (?)",
        [cinema.name],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }

            res.json(results.insertId);
        }
    );
});

app.put("/api/cinemas/:id", (req, res) => {
    const cinema = req.body;

    if (!cinema.name) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    pool.query(
        "UPDATE cinema SET name = ? WHERE id = ?",
        [cinema.name, req.params.id],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }

            res.json(results.changedRows);
        }
    );
});

app.delete("/api/cinemas/:id", (req, res) => {
    pool.query(
        "DELETE FROM cinema WHERE id = ?",
        [req.params.id],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }

            res.json(results.affectedRows);
        }
    );
});

app.post("/api/movies", (req, res) => {
    const {
        title,
        release_year,
        duration,
        description,
        poster_url,
        genres
    } = req.body;

    if (
        !title ||
        !release_year ||
        !duration ||
        !description ||
        !poster_url ||
        (Array.isArray(genres) && genres.length === 0)
    ) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    pool.getConnection((error, connection) => {
        if (error) {
            return res.status(500).json({ error });
        }

        connection.beginTransaction(error => {
            if (error) {
                return res.status(500).json({ error });
            }

            connection.query(
                "INSERT INTO movie (title, release_year, duration, description, poster_url) VALUES (?, ?, ?, ?, ?)",
                [title, release_year, duration, description, poster_url],
                (error, results) => {
                    if (error) {
                        return connection.rollback(() => {
                            res.status(500).json({ error });
                        });
                    }

                    const insertId = results.insertId;
                    const genreValues = genres.map(genre => [insertId, genre]);

                    connection.query(
                        "INSERT INTO genre (movie_id, description) VALUES ?",
                        [genreValues],
                        (error, results) => {
                            if (error) {
                                return connection.rollback(() => {
                                    res.status(500).json({ error });
                                });
                            }

                            connection.commit(error => {
                                if (error) {
                                    return connection.rollback(() => {
                                        res.status(500).json({ error });
                                    });
                                }

                                connection.release();

                                res.json(insertId);
                            });
                        }
                    );
                }
            );
        });
    });
});

app.put("/api/movies/:id", (req, res) => {
    const {
        title,
        release_year,
        duration,
        description,
        poster_url,
        genres
    } = req.body;

    if (
        !title ||
        !release_year ||
        !duration ||
        !description ||
        !poster_url ||
        (Array.isArray(genres) && genres.length === 0)
    ) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    pool.getConnection((error, connection) => {
        if (error) {
            return res.status(500).json({ error });
        }

        connection.beginTransaction(error => {
            if (error) {
                return res.status(500).json({ error });
            }

            const movieId = req.params.id;

            connection.query(
                "UPDATE movie SET title = ?, release_year = ?, duration = ?, description = ?, poster_url = ? WHERE id = ?",
                [
                    title,
                    release_year,
                    duration,
                    description,
                    poster_url,
                    movieId
                ],
                (error, results) => {
                    if (error) {
                        return connection.rollback(() => {
                            res.status(500).json({ error });
                        });
                    }

                    const changedRows = results.changedRows;
                    const genreValues = genres.map(genre => [movieId, genre]);

                    connection.query(
                        "DELETE FROM genre WHERE movie_id = ?",
                        [movieId],
                        (error, results) => {
                            if (error) {
                                return connection.rollback(() => {
                                    res.status(500).json({ error });
                                });
                            }

                            connection.query(
                                "INSERT INTO genre (movie_id, description) VALUES ?",
                                [genreValues],
                                (error, results) => {
                                    if (error) {
                                        return connection.rollback(() => {
                                            res.status(500).json({ error });
                                        });
                                    }

                                    connection.commit(error => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                res.status(500).json({ error });
                                            });
                                        }

                                        connection.release();

                                        res.json(changedRows);
                                    });
                                }
                            );
                        }
                    );
                }
            );
        });
    });
});

app.delete("/api/movies/:id", (req, res) => {
    const movieId = req.params.id;

    pool.getConnection((error, connection) => {
        if (error) {
            return res.status(500).json({ error });
        }

        connection.beginTransaction(error => {
            if (error) {
                return res.status(500).json({ error });
            }

            connection.query(
                "DELETE FROM genre WHERE movie_id = ?",
                [movieId],
                (error, results) => {
                    if (error) {
                        return connection.rollback(() => {
                            res.status(500).json({ error });
                        });
                    }

                    connection.query(
                        "DELETE FROM movie WHERE id = ?",
                        [movieId],
                        (error, results) => {
                            if (error) {
                                return connection.rollback(() => {
                                    res.status(500).json({ error });
                                });
                            }

                            connection.commit(error => {
                                if (error) {
                                    return connection.rollback(() => {
                                        res.status(500).json({ error });
                                    });
                                }

                                connection.release();

                                res.json(results.affectedRows);
                            });
                        }
                    );
                }
            );
        });
    });
});

app.post("/api/showtimes", (req, res) => {
    const { cinema_id, movie_id, time } = req.body;

    if (!cinema_id || !movie_id || !time) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    pool.query(
        "INSERT INTO showtime (cinema_id, movie_id, time) VALUES (?, ?, ?)",
        [cinema_id, movie_id, time],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }

            res.json(results.insertId);
        }
    );
});

app.put("/api/showtimes/:id", (req, res) => {
    const { cinema_id, movie_id, time } = req.body;

    if (!cinema_id || !movie_id || !time) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    pool.query(
        "UPDATE showtime SET cinema_id = ?, movie_id = ?, time = ? WHERE id = ?",
        [cinema_id, movie_id, time, req.params.id],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }

            res.json(results.changedRows);
        }
    );
});

app.delete("/api/showtimes/:id", (req, res) => {
    pool.query(
        "DELETE FROM showtime WHERE id = ?",
        [req.params.id],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }

            res.json(results.affectedRows);
        }
    );
});

app.listen(port, () => console.log(`App listening on port ${port}`));
