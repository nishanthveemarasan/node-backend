# node-backend

## MongoDB Setup & Access

This project uses **MongoDB** as the database and **Mongo Express** as a browser-based UI to manage your data. Both run in Docker containers.

---

### MongoDB Connection

Use the following connection string in your Node.js project:

```bash
mongodb://root:secret@mongodb:27017/mydb?authSource=admin
```


### Access MongoDB via CLI (mongosh)

**Inside the MongoDB container:**

```bash
sudo docker-compose exec mongodb mongosh -u root -p secret
```

### Access MongoDB via Browser (Mongo Express)

Mongo Express provides a web-based interface to view and manage your MongoDB data.

- **Open in browser:** [http://localhost:8081](http://localhost:8081)  
- **Login credentials (Mongo Express UI):**

```text
Username: admin
Password: pass
```