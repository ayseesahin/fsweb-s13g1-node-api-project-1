// SUNUCUYU BU DOSYAYA KURUN
const express = require("express");
const server = express();
const { find, findById, insert, update, remove } = require("./users/model");

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Server is up and running...");
});

// POST isteği ile yeni bir kullanıcı oluşturma
server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;

  if (!name || !bio) {
    return res
      .status(400)
      .json({ message: "Lütfen kullanıcı için bir name ve bio sağlayın" });
  }

  insert({ name, bio })
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    });
});
/* 
server.post("/api/users", async (req, res) => {
  try {
    const { name, bio } = req.body;

    if (!name || !bio) {
      res
        .status(400)
        .json({ message: "Lütfen kullanıcı için bir name ve bio sağlayın" });
    } else {
      const inserted = await insert({ name: name, bio: bio });
      res.status(201).json(inserted);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
  }
});
*/

// GET isteği ile tüm kullanıcıları alma
server.get("/api/users", (req, res) => {
  find()
    .then((users) => {
      res.json(users);
    })
    .catch(() => {
      res.status(500).json({ message: "Kullanıcı bilgileri alınamadı" });
    });
});
/*
server.get("/api/users", async (req, res) => {
  try {
    const allUsers = await find();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı bilgileri alınamadı" });
  }
});
*/

// GET isteği ile belirli bir kullanıcıyı alma
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  findById(id)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
      }
      res.json(user);
    })
    .catch(() => {
      res.status(500).json({ message: "Kullanıcı bilgisi alınamadı" });
    });
});
/* 
server.get("/api/users/:id", async (req, res) => {
  try {
    const user = await findById(req.params.id);
    if (!user) {
      res
        .status(404)
        .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı bilgisi alınamadı" });
  }
});
*/

// DELETE isteği ile belirli bir kullanıcıyı silme
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  remove(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res
          .status(404)
          .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
      }
      res.json(deletedUser);
    })
    .catch(() => {
      res.status(500).json({ message: "Kullanıcı silinemedi" });
    });
});
/* 
server.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await findById(req.params.id);
    if (!user) {
      res
        .status(404)
        .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
    } else {
      await remove(req.params.id);
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı silinemedi" });
  }
});
*/

// PUT isteği ile belirli bir kullanıcıyı güncelleme
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const { name, bio } = req.body;

  if (!name || !bio) {
    return res
      .status(400)
      .json({ message: "Lütfen kullanıcı için name ve bio sağlayın" });
  }

  update(id, { name, bio })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res
          .status(404)
          .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
      }
      res.json(updatedUser);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Kullanıcı bilgisi alınamadı" });
    });
});
/*
server.put("/api/users/:id", async (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name || !bio) {
      res
        .status(400)
        .json({ message: "Lütfen kullanıcı için name ve bio sağlayın" });
    } else {
      const user = await findById(req.params.id);
      if (!user) {
        res
          .status(404)
          .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
      } else {
        const updatedUser = await update(req.params.id, {
          name: name,
          bio: bio,
        });
        res.json(updatedUser);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı bilgisi alınamadı" });
  }
});
*/

module.exports = server; // SERVERINIZI EXPORT EDİN {}
