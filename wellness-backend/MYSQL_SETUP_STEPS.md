# MySQL Setup Steps for Wellness Backend

## ❌ Current Issue
The application still cannot connect to MySQL even after starting XAMPP. 

**Error**: `Connection refused: getsockopt` on `localhost:3306`

---

## 🔍 Step 1: Verify MySQL is Running in XAMPP

1. **Open XAMPP Control Panel**
2. **Check MySQL status** - The Status column should show "Running" in green
3. **If NOT running:**
   - Click the **"Start"** button next to MySQL
   - Wait for it to turn green and show "Running"

### Screenshot Guide:
```
Module    | PID  | Port(s) | Status
----------|------|---------|--------
Apache    | xxxx | 80,443  | ✔ Running
MySQL     | xxxx | 3306    | ✔ Running  <-- Must be green
```

---

## 🔍 Step 2: Verify MySQL Port

Once MySQL is running:

**Open Command Prompt** and run:
```bash
netstat -an | findstr :3306
```

**Expected Output:**
```
TCP    0.0.0.0:3306          0.0.0.0:0      LISTENING
TCP    [::]:3306             [::]:0         LISTENING
```

If you DO NOT see this output, MySQL is not listening on port 3306.

---

## 🔍 Step 3: Test MySQL Connection

**Open Command Prompt** and run:
```bash
mysql -u root -p
```

**If it asks for password:**
- Press Enter (default XAMPP MySQL has no password)
- Or enter your MySQL password if you've set one

**If connection succeeds**, you'll see:
```
Welcome to the MySQL monitor...
mysql>
```

---

## 🗄️ Step 4: Create the Database

Once you're in the MySQL shell (from Step 3):

```sql
SHOW DATABASES;
```

**Check if `wellness_db` exists**. If NOT, create it:

```sql
CREATE DATABASE IF NOT EXISTS wellness_db;
```

**Verify it was created:**
```sql
SHOW DATABASES;
```

You should see `wellness_db` in the list.

**Exit MySQL:**
```sql
exit;
```

---

## 🔧 Step 5: Update Password (If Needed)

If your MySQL password is NOT empty, update `application.properties`:

**File:** `src/main/resources/application.properties`

```properties
spring.datasource.password=     <-- CHANGE THIS to your actual MySQL password
```

Common XAMPP MySQL passwords:
- Empty (no password) - default
- `root`
- Whatever you set during XAMPP installation

---

## ✅ Step 6: Run the Application Again

Once MySQL is **definitely running** and the database is created:

```bash
.\mvnw.cmd spring-boot:run
```

---

## 🆘 Still Not Working?

### Check MySQL Error Logs

In XAMPP Control Panel:
1. Click **"Logs"** button next to MySQL
2. Look for error messages

### Common Issues:

**Port 3306 already in use:**
- Another MySQL instance is running
- Stop other MySQL services in Windows Services

**Firewall blocking:**
- Allow MySQL through Windows Firewall

**Wrong credentials:**
- Double-check username and password in `application.properties`

---

## 📋 Quick Checklist

- [ ] XAMPP Control Panel shows MySQL as "Running" (green)
- [ ] `netstat -an | findstr :3306` shows LISTENING
- [ ] Can connect with `mysql -u root -p`
- [ ] Database `wellness_db` exists
- [ ] Password in `application.properties` is correct
- [ ] Application re-run with `.\mvnw.cmd spring-boot:run`
