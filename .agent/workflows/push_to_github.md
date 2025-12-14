---
description: Push changes to the taninigeria-aa/kifiapp repository
---

1. Check if the new remote exists, if not add it.
   ```bash
   git remote add target https://github.com/taninigeria-aa/kifiapp.git
   ```
   Or if you want to replace origin:
   ```bash
   git remote set-url origin https://github.com/taninigeria-aa/kifiapp.git
   ```

2. Stage all changes.
   ```bash
   git add .
   ```

3. Commit the changes.
   ```bash
   git commit -m "feat: implement user registration and active user check"
   ```

4. Push to the repository.
   ```bash
   git push -u target main
   # OR if you replaced origin
   git push -u origin main
   ```
